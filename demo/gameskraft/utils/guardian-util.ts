import {
    GUARDIAN_DOCUMENT_NAME,
    GUARDIAN_DOCUMENT_STATUS,
    GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON,
    GUARDIAN_DOCUMENT_TRANSAFORMATION_KEYS,
    GUARDIAN_DOCUMENT_TYPE,
    GUARDIAN_SORT_DATA_CONFIG,
    USER_KYC_DATA,
    GUARDIAN_KYC_VALIDATOR
} from "../constants/guardian-constants";
import { GuardianCreateTaskRequestPayload, GuardianDigilockerTaskRequestPayload } from "../models/guardian/request";
import { GuardianDocumentDetails } from "../models/guardian/response";
import {
    GuardianKycDetails,
    PanDetails,
    UserDocument,
    UserKycDetails,
    UserKycDocumentDetails,
    UserKycStatus
} from "../models/guardian/user-kyc";
import LoggerUtil from "./logger";
import { KycRule, Rule } from "../models/guardian/kyc-rule";
import UserKycFilter from "../models/user-kyc-filter";
import { UpiDetails } from "../models/payoutV2/response";
import PayoutUtilV2 from "./v2/payout-utils";
import { MAX_BENEFICIARY_REJECTED_ACCOUNTS } from "../constants/payout-constants";
const configService = require('../services/configService');
const logger = LoggerUtil.get("guardian-util");

export const validateDigilockerStateCheck = (userState: string, availableStatesList: string[]): boolean => {
    logger.info(`inside [guardian-util] [validateDigilockerStateCheck] received userState :: ${userState} recieved availableStatesList :: ${JSON.stringify(availableStatesList)}`);
    const givenState: string[] = availableStatesList.filter(state => state === userState) || [];
    logger.info(`inside [guardian-util] [validateDigilockerStateCheck] givenState :: ${JSON.stringify(givenState)}`);
    return givenState.length > 0;
};

export const createGuardianTaskPayload = (userId: string, documentType?: number, taskId?: string): GuardianCreateTaskRequestPayload => {
    return {userId: String(userId), taskId, documentType};
}

export const createGuardianDigilockerAadharTaskPayload = (taskId: string, state: string): GuardianDigilockerTaskRequestPayload => {
    const documentDetails = {state};
    return {taskId, documentDetails};
}

export const parseUserKycDetails = (userKycDetails: GuardianDocumentDetails): any => {
    let userDocumentDetails: any = {};
    userDocumentDetails.documentNumber = userKycDetails.documentNumber;
    userKycDetails.documentDetails.map((userDetails) => userDocumentDetails[userDetails.field] = userDetails.value);
    return userDocumentDetails;
}
const getDefaultKycStatuses = (): any => {
    const defaultStatusObject = {};
    Object.keys(GUARDIAN_DOCUMENT_NAME).map(documentKey => {
        logger.info('inside [guardianUtil] seeting default status for', {
            documentKey,
            document: GUARDIAN_DOCUMENT_NAME[documentKey]
        });
        defaultStatusObject[GUARDIAN_DOCUMENT_NAME[Number(documentKey)]] = 0
    });
    logger.info(defaultStatusObject, `return default status kyc object here`);
    return defaultStatusObject;
}

const getUserVerifiedDocuments = (documents: UserDocument[]): UserDocument[] => {
    const userVerfiedDocuments: UserDocument[] = [];
    documents.map(document => {
        if (document.documentStatus == GUARDIAN_DOCUMENT_STATUS.VERIFIED) {
            userVerfiedDocuments.push(document);
        }
    });
    return userVerfiedDocuments;
}

const getUserPendingDocuments = (documents: UserDocument[]): UserDocument[] => {
    const userPendingDocuments: UserDocument[] = [];
    documents.map(document => {
        if (document.documentStatus == GUARDIAN_DOCUMENT_STATUS.MANUAL_REVIEW)
            userPendingDocuments.push(document);
    });
    return userPendingDocuments;
}

const getUserUnverifiedDocuments = (documents: UserDocument[]): UserDocument[] => {
    const userUnverfiedDocuments: UserDocument[] = [];
    documents.map(document => {
        if(document.documentType == GUARDIAN_DOCUMENT_TYPE.PAN){
            if (document.documentStatus != GUARDIAN_DOCUMENT_STATUS.VERIFIED){
                userUnverfiedDocuments.push(document);
            }
        }else{
            if (document.documentStatus != GUARDIAN_DOCUMENT_STATUS.VERIFIED && document.documentStatus != GUARDIAN_DOCUMENT_STATUS.MANUAL_REVIEW){
                userUnverfiedDocuments.push(document);
            }
        }
    });
    return userUnverfiedDocuments;
}
const setStatusForDocuments = (userVerifiedKycDocuments: UserDocument[], userUnverifiedKycDocuments: UserDocument[], userKycStatus: UserKycStatus) => {
    logger.info(`setting status for verified documents`);
    userVerifiedKycDocuments.map(kycDocument => {
        if (kycDocument) {
            if (userKycStatus[GUARDIAN_DOCUMENT_NAME[kycDocument.documentType]] == 0) {
                // if default value and we have this document in verified document se it to the value of its status
                userKycStatus[GUARDIAN_DOCUMENT_NAME[kycDocument.documentType]] = kycDocument.documentStatus;
            }
        }
    });
    logger.info(userKycStatus, `statuses after setting for all the verified documents`);
    logger.info(`setting kyc status for unverified documents`);
    userUnverifiedKycDocuments.map(kycDocument => {
        if (kycDocument) {
            if (userKycStatus[GUARDIAN_DOCUMENT_NAME[kycDocument.documentType]] == 0) {
                // if default value and we have this document in verified document set it to the value of its status
                // otherwise it is already set and don't touch it
                userKycStatus[GUARDIAN_DOCUMENT_NAME[kycDocument.documentType]] = kycDocument.documentStatus;
            }
        }
    });
    logger.info(userKycStatus, `statuses after setting for all the un-verified documents`);
    userKycStatus.proofOfIdentityKyc = Number(userKycStatus.pan == GUARDIAN_DOCUMENT_STATUS.VERIFIED);

    userKycStatus.proofOfAddressKyc = Number(userKycStatus.aadhar == GUARDIAN_DOCUMENT_STATUS.VERIFIED ||
        userKycStatus.voter == GUARDIAN_DOCUMENT_STATUS.VERIFIED ||
        userKycStatus.dl == GUARDIAN_DOCUMENT_STATUS.VERIFIED);
    logger.info(userKycStatus, `statuses after setting poa and poi`);
    return userKycStatus;
}
export const getUserKycStatus = (kycDetails: GuardianKycDetails): UserKycStatus => {
    const defaultKycStatus: any = getDefaultKycStatuses();
    logger.info(defaultKycStatus, `received default object`);
    const kycStatus: UserKycStatus = defaultKycStatus;
    const userVerifiedKycDocuments: UserDocument[] = getUserVerifiedDocuments(kycDetails.userDocuments);
    const userUnverifiedKycDocuments: UserDocument[] = getUserUnverifiedDocuments(kycDetails.userDocuments);
    const userKycStatus: UserKycStatus = setStatusForDocuments(userVerifiedKycDocuments, userUnverifiedKycDocuments, kycStatus);
    return userKycStatus;
}

const aggregateUserKycDocuments = (userKycDocuments: UserDocument[], transformationKey: string): Map<number, UserDocument[]> => {
    // Use reduce to aggregate the documents based on the transformation key
    logger.info({
        documents: userKycDocuments,
        key: transformationKey
    }, 'got this for transformation in [aggregateUserKycDocuments]');
    const aggregatedUserKycDocuments: Map<number, UserDocument[]> = userKycDocuments.reduce((agg, document) => {
        const key = Number(document[transformationKey]);
        logger.info(agg.has(key));
        if (!agg.has(key)) {
            agg.set(key, [document]);
        }
        else {
            agg.get(key).push(document);
        }
        return agg;
    }, new Map<number, UserDocument[]>());
    // Return the aggregated transactions as an array
    return aggregatedUserKycDocuments;
}

const parseKycMap = (kycDetails: UserDocument[]) => {
    return kycDetails.map((document) => {
        let userDocumentDetails: any = {};
        userDocumentDetails.documentNumber = document?.documentNumber;
        userDocumentDetails.autoVerificationStatus = document?.autoVerificationStatus;
        userDocumentDetails.status = document?.documentStatus;
        userDocumentDetails.registeredDetails = document?.registeredDetails;
        userDocumentDetails.statusChangeReason = GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON[Number(document?.statusChangeReason)];
        if(document?.documentDetails.length)
            document.documentDetails.map(doc => {
                userDocumentDetails[doc.field] = doc.value;
            })
        else if (document?.extractionDetails.length) {
            document.extractionDetails.map(doc => {
                userDocumentDetails[doc.field] = doc.value;
            })
        }
        return userDocumentDetails;
    })
}

const getDocumentUrl = (kycDetails: UserDocument[]) => {
    if (kycDetails.length && kycDetails[0].uploadDetails.length) {
        return kycDetails[0].uploadDetails[0].documentUrl || "";
    }
    return "";
}


export const getUserKycDetails = (kycDetails: GuardianKycDetails, getSelectedDocumentInformation?: boolean): UserKycDocumentDetails[] => {
    const userKycDocumentDetails: UserKycDocumentDetails[] = [];
    const userVerifiedKycDocuments: UserDocument[] = getUserVerifiedDocuments(kycDetails.userDocuments);
    const userPendingKycDocuments: UserDocument[] = getUserPendingDocuments(kycDetails.userDocuments);
    const userUnverifiedKycDocuments: UserDocument[] = getUserUnverifiedDocuments(kycDetails.userDocuments);
    const allUnverifiedKycDocuments: UserDocument[] = [...userPendingKycDocuments,...userUnverifiedKycDocuments];
    const userAllKycDocuments: UserDocument[] = [...userVerifiedKycDocuments,...allUnverifiedKycDocuments];
    logger.info({ userVerifiedKycDocuments, allUnverifiedKycDocuments, userAllKycDocuments }, 'got these documents');
    const aggregatedVerifiedDocumentMap: Map<number, UserDocument[]> = aggregateUserKycDocuments(userVerifiedKycDocuments, GUARDIAN_DOCUMENT_TRANSAFORMATION_KEYS.documentType);
    logger.info(aggregatedVerifiedDocumentMap, `aggregated verified deocuments based on documentType`);
    const aggregatedUnverifiedDocumentMap: Map<number, UserDocument[]> = aggregateUserKycDocuments(allUnverifiedKycDocuments, GUARDIAN_DOCUMENT_TRANSAFORMATION_KEYS.documentType);
    logger.info(aggregatedUnverifiedDocumentMap, `aggregated unverified deocuments based on documentType`);
    logger.info('inserting the verified documents into userKycDocumentDetails');
    aggregatedVerifiedDocumentMap.forEach((value, key) => {
        logger.info(key, `here is the key`);
        const userKycDocumentDetail: UserKycDocumentDetails = {
            documentType: Number(key),
            documentDetails: parseKycMap(aggregatedVerifiedDocumentMap.get(Number(key))),
            documentUrl: getDocumentUrl(aggregatedVerifiedDocumentMap.get(Number(key)))
        }
        userKycDocumentDetails.push(userKycDocumentDetail);
    });
    logger.info(userKycDocumentDetails, `inserted the documents with verified kyc`);
    logger.info(`inserting unverified kyc documents`);
    // if this was called from ui we will only insert the documents where there is no other verified document with rejection reasn
    // also we will only insert 1 document
    // if it wasn't called from ui we will insert all the documents irrespective of what we have got
    if (getSelectedDocumentInformation) {
        aggregatedUnverifiedDocumentMap.forEach((value, key) => {
            // check if there is an document of the same key in this array
            logger.info(`getting existing documents for `, Number(key));
            const existingDocuments: UserKycDocumentDetails[] = getExisitingDocuments(userKycDocumentDetails, Number(key));
            if (existingDocuments.length) {
                logger.info(`verified document already exists`)
            }
            else {
                logger.info(`verified document does not exists`)
                // if there are documents here insert the first one
                if (aggregatedUnverifiedDocumentMap.get(Number(key)).length) {
                    // pushing only first
                    const unverfiedDocument: UserDocument = aggregatedUnverifiedDocumentMap.get(Number(key))[0];
                    const userKycDocumentDetail: UserKycDocumentDetails = {
                        documentType: Number(key),
                        documentDetails: parseKycMap([unverfiedDocument]),
                        documentUrl: unverfiedDocument.uploadDetails.length ? unverfiedDocument.uploadDetails[0].documentUrl : '',
                        statusChangeReason: GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON[Number(unverfiedDocument.statusChangeReason)]
                    }
                    userKycDocumentDetails.push(userKycDocumentDetail);
                }
            }
        });
        return userKycDocumentDetails;
    }
    // inserting all the documents without neglecting anything
    logger.info(`this is an internal call and we will insert all the unverified documents here`);
    const allDocumentMap: Map<number, UserDocument[]> = aggregateUserKycDocuments(userAllKycDocuments, GUARDIAN_DOCUMENT_TRANSAFORMATION_KEYS.documentType);
    const alluserKycDocumentDetails: UserKycDocumentDetails[] = [];
    allDocumentMap.forEach((value, key) => {
        const userKycDocumentDetail: UserKycDocumentDetails = {
            documentType: Number(key),
            documentDetails: parseKycMap(allDocumentMap.get(key))
        }
        alluserKycDocumentDetails.push(userKycDocumentDetail);
    })
    logger.info(alluserKycDocumentDetails, `printing all documents here`);
    return alluserKycDocumentDetails;
}

const getExisitingDocuments = (userKycDocumentDetails: UserKycDocumentDetails[], key: number) => {
    return userKycDocumentDetails.filter(doc => doc.documentType == key);
}


export const getActiveRule = (userKycConfigRule: KycRule): Rule => {
    const activeRule: number = userKycConfigRule.activeRule ?? 0;
    const userRule: Rule = {};
    if (activeRule) {
        const obtainedRule: Rule[] = userKycConfigRule.availableRules.filter(givenRule => givenRule.rule === activeRule);
        if (obtainedRule.length) {
            return obtainedRule[0];
        }
    }
    userRule.rule = 0;
    userRule.triggerValue = 0;
    return userRule;
}

export const getUserPanDetails = (kycDetails: UserKycDetails) => {
    const {userKycDocumentDetails} = kycDetails;

    let panDetails: PanDetails = {};
    if (userKycDocumentDetails.length > 0) {
        // Filter Pan Document
        const userPanKycDoc = userKycDocumentDetails.filter(
            (panDetail: any) => Number(panDetail.documentType) === Number(GUARDIAN_DOCUMENT_TYPE.PAN)
        )
        if (userPanKycDoc.length) {
            const userPanDocuments: any = userPanKycDoc[0].documentDetails;
            userPanDocuments.map((pan: any) => {
                    panDetails = pan;
                }
            )
        }
    }
    return panDetails;
}

export const getUserKYCFilterForAries = (): UserKycFilter => {
    // get pan details
    const documentType: number[] = [GUARDIAN_DOCUMENT_TYPE.PAN];
    const userKycDataMethod: string = USER_KYC_DATA.NORMAL;
    const documentStatus: number[] = [
        GUARDIAN_DOCUMENT_STATUS.VERIFIED,
    ];
    const sortBy = GUARDIAN_SORT_DATA_CONFIG.DESC;
    return {
        userKycDataMethod,
        documentType,
        documentStatus,
        sortBy
    };
}
export const getUpiDetails = (userKycDocumentDetails: UserKycDocumentDetails[],vendorId: number): UpiDetails[] => {
    const upiDetails: UpiDetails[] = [];
    let maxUnverifiedUpiDetails: number = 0;
    if (userKycDocumentDetails.length > 0) {
        // Filter upi Document
        const userUpiKycDoc = userKycDocumentDetails.filter(
            (bankDetail: any) => Number(bankDetail.documentType) === Number(GUARDIAN_DOCUMENT_TYPE.UPI)
        )
        if(userUpiKycDoc.length){
            const userUpiDocuments: UpiDetails[] = userUpiKycDoc[0].documentDetails;
            let maxUnverifiedUpiDetails: number = 0;
            userUpiDocuments.map((upi: UpiDetails,index: number) => {
                    const upiDetail = {
                    upiId: upi?.upiId,
                    documentNumber: upi.documentNumber,
                    status: upi.status,
                    statusChangeReason: upi.statusChangeReason,
                    bankIcon: configService.getBankIconInfoBasedOnUpiForVendor()[vendorId][PayoutUtilV2.getUpiInstrument(upi?.upiId)],
                    name: upi?.registeredDetails?.name,
                    autoVerificationStatus: upi?.autoVerificationStatus
                    }
                    if(upiDetail.status == GUARDIAN_DOCUMENT_STATUS.REJECTED && !(upi?.autoVerificationStatus)){
                        maxUnverifiedUpiDetails++;
                    }
                    if(index < configService.getMaxKycUpiAccountsForVendor()[vendorId]){
                        if(upiDetail.status != GUARDIAN_DOCUMENT_STATUS.REJECTED)
                            upiDetails.push(upiDetail)
                        else if(maxUnverifiedUpiDetails <= MAX_BENEFICIARY_REJECTED_ACCOUNTS && !(upi?.autoVerificationStatus)){
                            upiDetails.push(upiDetail)
                        }
                    }
                }
            )
        }
        
    }
    return upiDetails;
}

export const getPanKycSuccessEventData = (data: any) => {
    return {
        type: GUARDIAN_KYC_VALIDATOR[data?.autoVerificationStatus],
        panId: data?.panId,
    }
}


export const getBankKycSuccessEventData = (data: any) => {
    return {
        type: GUARDIAN_KYC_VALIDATOR[data?.autoVerificationStatus],
        accountNumber: data?.accountNumber,
        name: data?.name,
        ifsc: data?.ifsc,
        status: data?.status,
        reason: data?.reason
    }
}

