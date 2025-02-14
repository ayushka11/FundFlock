const async = require('async');
const configService = require('../services/configService');
import GuardianClient from '../clients/guardianClient';
import {
    GUARDIAN_DOCUMENT_METHOD,
    GUARDIAN_DOCUMENT_NAME,
    GUARDIAN_DOCUMENT_STATUS,
    GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON,
    GUARDIAN_DOCUMENT_STATUS_FOR_EVENTS,
    GUARDIAN_DOCUMENT_TYPE,
    GUARDIAN_KYC_CONFIG_RULE,
    GUARDIAN_KYC_VALIDATOR,
    GUARDIAN_SORT_DATA_CONFIG,
    USER_KYC_DATA
} from '../constants/guardian-constants';
import LoggerUtil from '../utils/logger';
import {getDigilockerStateConfigForVendor} from './configService';
import {
    getActiveRule,
    getUserKycDetails,
    getUserKycStatus,
    parseUserKycDetails,
    validateDigilockerStateCheck,
    getBankKycSuccessEventData,
    getPanKycSuccessEventData
} from '../utils/guardian-util';
import {GuardianDocumentDetails, GuardianTaskResponse} from '../models/guardian/response';
import UserKycFilter from '../models/user-kyc-filter';
import {GuardianKycDetails, UserKycDetails, UserKycDocumentDetails, UserKycStatus} from '../models/guardian/user-kyc';
import {KycRule, Rule} from '../models/guardian/kyc-rule';
import EventPushService from '../producer/eventPushService';
import EventNames from '../producer/enums/eventNames';
import ApiVersioningUtil from '../utils/api-versioning-util';

const redisService = require('../services/redisService');

const logger = LoggerUtil.get("GuardianService");

export default class GuardianService {

    static async getUserKycConfig(userId: string, restClient: any, vendorId: string) {
        // fetch all the rules for kyc seggrigation
        // filter the rule that is to be used
        // fetch userdetails from idm
        // check if the user follows the rule
        // return the config according to if the rule is being followed or not
        try {
            const userKycConfigRule: KycRule = await configService.getuserKycConfigRuleForVendor()[vendorId];// fix this
            const activeRule: Rule = getActiveRule(userKycConfigRule);
            switch (activeRule.rule) {
                case GUARDIAN_KYC_CONFIG_RULE.NEW_USER:
                    logger.info(`inside [guardianService] [getUserKycConfig] inside guardian kyc rule switch :: new user rule selected`)
                    const userDetails: any = {}// call to idm service(userId)
                    logger.info(`inside [guardianService] [getUserKycConfig] calling idm for user details`)
                    if (userDetails.createdTime && userDetails.createdTime < activeRule.triggerValue) {
                        logger.info(`inside [guardianService] [getUserKycConfig] inside guardian kyc rule switch :: user is an old user`)
                        return configService.getOldUserKycConfigForVendor()[vendorId];// fix this
                    }
                    return configService.getNewUserKycConfigForVendor()[vendorId];// fix this
                default:
                    logger.info(`inside [guardianService] [getUserKycConfig] inside default swith`)
                    return configService.getNewUserKycConfigForVendor()[vendorId];// fix this
            }
        } catch (e) {
            // check for relevant error here
            GuardianClient.getErrorFromCode(e?.status?.code)
            logger.info(e,`inside [guardianService] [getUserKycConfig] received error from [getUserKycConfig]`);
            throw (e);
        }
    }

    static async getUserKycDetails(userId: string, userKycFilter: UserKycFilter, restClient: any, vendorId: string, getSelectedDocumentInformation?: boolean) {
        try {
            logger.info(`inside [guardianService] [getUserKycDetails] with filter :: ${JSON.stringify(userKycFilter)} for userId :: ${userId}`);
            const userKycDetails: GuardianKycDetails = await GuardianClient.getUserKycDetails(userId, userKycFilter, restClient, vendorId);

            logger.info(`inside [guardianService] [getUserKycDetails] got data :: ${JSON.stringify(userKycDetails)}`);
            const userKycStatus: UserKycStatus = getUserKycStatus(userKycDetails);
            logger.info(`inside [guardianService] [getUserKycDetails] userKycStatus :: ${JSON.stringify(userKycStatus)}`);

            let userKyc: UserKycDetails = {userKycStatus};
            if (userKycFilter.userKycDataMethod == USER_KYC_DATA.LITE) {
                logger.info(`inside [guardianService] [getUserKycDetails] inside lite kyc`);
                return userKyc;
            }

            userKyc.userKycDocumentDetails = getUserKycDetails(userKycDetails, getSelectedDocumentInformation);
            logger.info(`inside [guardianService] [getUserKycDetails] userKyc :: ${JSON.stringify(userKyc)}`);
            return userKyc;
        } catch (e) {
            GuardianClient.getErrorFromCode(e?.status?.code)
            logger.info(e,`inside [guardianService] [getUserKycDetails] received error from [getUserKycDetails] `);
            throw (e);
        }
    }

    static async getDigilockerStateConfig(vendorId: string): Promise<any> {
        try {
            logger.info(`[GuardianService] [getDigilockerStateConfig]`);
            const digilockerStateConfig = await getDigilockerStateConfigForVendor()[vendorId];// fix this
            logger.info(`[GuardianService] [getDigilockerStateConfig] obtained the digilocker state configs from configService :: ${JSON.stringify(digilockerStateConfig)}`);
            return digilockerStateConfig;
        } catch (e) {
            // check for relevant error here
            GuardianClient.getErrorFromCode(e?.status?.code)
            logger.info(e,`inside [guardianService] [getDigilockerStateConfig] received error from [getDigilockerStateConfig] `);
            throw (e);
        }
    }


    static async initiateDigilockerKyc(userId: string, userState: string, userConsent: boolean, retryAttempts: string, restClient: any, vendorId: string): Promise<any> {
        try {
            const digilockerStateConfig: any = await GuardianService.getDigilockerStateConfig(vendorId);
            const availableStates: string[] = digilockerStateConfig?.AvailableDigilockerStates || [];
            const isStateAllowed: boolean = validateDigilockerStateCheck(userState, availableStates);
            if (!isStateAllowed) {
                // return an error
                //return "error";
                // User state Not allowed for Aadhar KYC
                const invalidStateError: any = GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.STATE_NOT_ALLLOWED_FOR_AADHAR);
                logger.info(`inside [guardianService] [initiateDigilockerKyc] received error from [getDigilockerStateConfig] ${{invalidStateError}}`);
                throw (invalidStateError);
            }
            const digilockerTask: GuardianTaskResponse = await GuardianClient.createTask(userId, GUARDIAN_DOCUMENT_TYPE.AADHAR, GUARDIAN_DOCUMENT_METHOD.DIGILOCKER_AADHAR, restClient, vendorId);
            if (digilockerTask.taskId) {
                // do the nexts step only if the taskid is generated
                const isAadharConsentRequired: boolean = configService.getIsAadharConsentRequiredParamForVendor()[vendorId];
                if (isAadharConsentRequired && userConsent) {
                    try {
                        logger.info(`inside [guardianService] [initiateDigilockerKyc] isAadharConsentRequired :: ${isAadharConsentRequired}`);
                        await GuardianClient.createUserConsent(digilockerTask.taskId, userConsent, restClient, vendorId);
                    } catch (e) {
                        logger.info(`inside [guardianService] [initiateDigilockerKyc] received error from [createUserConsent] `,e);
                        throw (e);
                    }
                }
                if (userConsent) {
                    const digilockerLink: any = await GuardianClient.getDigilockerVerficationLink(digilockerTask.taskId, userState, retryAttempts, restClient, vendorId);
                    return digilockerLink;
                }
                return {};
            }
            const guardianTaskIdDoesNotExistError: any = GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.TASK_ID_DOESNOT_EXIST);
            // add this to monitoring as well
            logger.info(`inside [guardianService] [initiateDigilockerKyc] received error from [getDigilockerStateConfig] ${JSON.stringify(guardianTaskIdDoesNotExistError)}`);
            throw (guardianTaskIdDoesNotExistError);
        } catch (e) {
            logger.info(e,`inside [guardianService] [initiateDigilockerKyc] received error from [createTask] `);
            throw (e);
        }
    }

    static async extractUserKycDetails(userId: any, docType: number, restClient: any, vendorId: string) {
        try {
            // add this in userUniqueId
            const userTaskId: string = await redisService.getGuardianTaskId(userId, vendorId, docType);
            logger.info(`inside [guardianService] [extractUserKycDetails] recieved task id from [redisService] :: ${userTaskId}`);
            if (userTaskId) {
                const userKycDetails: GuardianDocumentDetails = await GuardianClient.extractUserKycDetails(userTaskId, restClient, vendorId);
                EventPushService.push(userId, Number(vendorId), "", EventNames.USER_KYC_EXTRACT_SUCCESS, {
                    docType: docType
                });
                return parseUserKycDetails(userKycDetails);
            }
            const guardianTaskIdDoesNotExistError: any = GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.TASK_ID_DOESNOT_EXIST);
            logger.info(`inside [guardianService] [extractUserKycDetails] received error from [extractUserKycDetails] ${JSON.stringify(guardianTaskIdDoesNotExistError)}`);
            throw (guardianTaskIdDoesNotExistError);
        } catch (e) {
            logger.info(e,`inside [guardianService] [extractUserKycDetails] received error from [extractUserKycDetails] `);
            EventPushService.push(userId, Number(vendorId), "", EventNames.USER_KYC_EXTRACT_FAILURE, {
                docType: docType,
                reason: JSON.stringify(e?.name)
            });
            throw (e);
        }
    }

    static async verifyUserKycDetails(userId: any, userDocumentDetails: any, docType: number, uploadedFile: string, restClient: any, vendorId: string) {
        try {
            const userTaskId: string = await redisService.getGuardianTaskId(userId, vendorId, docType);// user useruniqueid
            logger.info(`inside [guardianService] [verifyUserKycDetails] recieved task id from [redisService] :: ${userTaskId} for userId :: ${userId} and userDocumentDetails ${JSON.stringify(userDocumentDetails)} and docType :: ${docType} and uploaded FIle :: ${uploadedFile}`);
            if (userTaskId) {
                switch (docType) {
                    case GUARDIAN_DOCUMENT_TYPE.BANK:
                        // fetch current user kyc details
                        // check if the current bank account exists in the given kyc contents
                        // if it does throw error
                        // else
                        // check the number of kycs the user has done
                        // if more than the max limit throw error
                        // else fetch the task id and hit the api
                        // else hit the guardian api to verify the ban details

                        // get all the bank documents for bank
                        const kycFilter: UserKycFilter = {userKycDataMethod: USER_KYC_DATA.NORMAL}
                        kycFilter.sortBy = GUARDIAN_SORT_DATA_CONFIG.DESC;
                        const userKycDetails: UserKycDetails = await GuardianService.getUserKycDetails(userId, kycFilter, restClient, vendorId);
                        logger.info(`inside [guardianService] [verifyUserKycDetails] switch case for bank kyc verification :: received userKycDetails ${JSON.stringify(userKycDetails)}`);
                        // filter only the bank documents
                        const userBankKycDetails: UserKycDocumentDetails[] = userKycDetails.userKycDocumentDetails.filter(document => document.documentType === GUARDIAN_DOCUMENT_TYPE.BANK);
                        const userUpiKycDetails: UserKycDocumentDetails[] = userKycDetails.userKycDocumentDetails.filter(document => document.documentType === GUARDIAN_DOCUMENT_TYPE.UPI);
                        logger.info(`inside [guardianService] [verifyUserKycDetails] switch case for bank kyc verification :: received userBankKycDetails ${JSON.stringify(userBankKycDetails)} :: received userUpiKycDetails ${JSON.stringify(userUpiKycDetails)}`);
                        const bankAccountNumber = userDocumentDetails.bankAccountNumber;
                        const bankIFSC = userDocumentDetails.bankIFSC;
                        if (userBankKycDetails.length) {
                            // only check if we have the bank details of user
                            const existingData: any[] = userBankKycDetails[0]?.documentDetails.filter(bank => bank.accountNumber == bankAccountNumber && bank.IFSC == bankIFSC);
                            logger.info(`inside [guardianService] [verifyUserKycDetails] switch case for bank kyc verification :: received existingData ${JSON.stringify(existingData)}`);
                            const isExisting = existingData.length != 0;
                            if (isExisting) {
                                const guardianBankAlreadyExistsError: any = GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.BANK_ALREADY_VERIFIED);
                                logger.info(`inside [guardianService] [verifyUserKycDetails] received error from [verifyUserKycDetails] ${JSON.stringify(guardianBankAlreadyExistsError)}`);
                                throw (guardianBankAlreadyExistsError);
                            }
                        }
                        const userBankAccounts: number = userBankKycDetails.length ? userBankKycDetails[0].documentDetails.length : 0;
                        const userUpiAccounts: number = userUpiKycDetails.length ? userUpiKycDetails[0].documentDetails.length : 0;
                        const kycCount: number = userBankAccounts + userUpiAccounts;
                        logger.info(`inside [guardianService] [verifyUserKycDetails] got userBankAccounts:: ${userBankAccounts} userUpiAccounts :: ${userUpiAccounts} :: kycCount :: ${kycCount}`)
                        if (kycCount >= configService.getMaxKycAccountsForVendor()[vendorId]) {
                            logger.info({userDocumentDetails}, 'max allowed KYC limit exceeded.');
                            const guardianMaxAllowedKycLimitExceededError: any = GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.MAX_ALLOWED_KYC_LIMIT_EXCEEDED);
                            logger.info(`inside [guardianService] [verifyUserKycDetails] received error from [verifyUserKycDetails] ${JSON.stringify(guardianMaxAllowedKycLimitExceededError)}`);
                            throw (guardianMaxAllowedKycLimitExceededError);
                        }
                        logger.info({file1: uploadedFile}, 'Got file details from session');

                        if (!uploadedFile) {
                            const guardianEmptyFileUploadedError: any = GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.EMPTY_FILE_UPLOADED_ERROR);
                            logger.info(`inside [guardianService] [verifyUserKycDetails] received error from [verifyUserKycDetails] ${JSON.stringify(guardianEmptyFileUploadedError)}`);
                            throw (guardianEmptyFileUploadedError);
                        }
                        if (userTaskId) {
                            await GuardianClient.verifyDocumentSync(userTaskId, userDocumentDetails, restClient, vendorId);
                            //  User KYC Bank Success
                        }
                        else {
                            const guardianTaskIdDoesNotExistError: any = GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.TASK_ID_DOESNOT_EXIST);
                            logger.info(`inside [guardianService] [verifyUserKycDetails] received error from [verifyUserKycDetails] ${JSON.stringify(guardianTaskIdDoesNotExistError)}`);
                            throw (guardianTaskIdDoesNotExistError);
                        }
                        return;
                    case GUARDIAN_DOCUMENT_TYPE.DL:
                    case GUARDIAN_DOCUMENT_TYPE.PAN:
                    case GUARDIAN_DOCUMENT_TYPE.VOTER:
                        // fetch the task id of the doctype
                        // use these document details and simply hit the tenet api
                        // if the task id is not found check if the file exists
                        // if the file exists send it for manual verification
                        // else throw the error that the file does not exist
                        const taskId: string = redisService.getGuardianTaskId(userId, vendorId, String(docType));// user userunique id
                        if (taskId) {
                            const functionArguements = [userTaskId, userDocumentDetails, restClient, vendorId];
                            const rolloutPercentage = Number(configService.	getApiRolloutPercentageForVendor()[vendorId].guardianService.verifyDocumentSyncForPan ?? 0);
                            const availableApiRoutes = [
                                GuardianClient.verifyDocumentSync,
                                GuardianClient.verifyDocumentSyncV2
                            ]
                            await (ApiVersioningUtil.getApiBasedOnPercentage(rolloutPercentage,availableApiRoutes,functionArguements));
                            return;
                        }
                        logger.info({uploadedFile: uploadedFile}, 'Got file details from session');
                        if (!uploadedFile) {
                            const guardianEmptyFileUploadedError: any = GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.EMPTY_FILE_UPLOADED_ERROR);
                            logger.info(`inside [guardianService] [verifyUserKycDetails] received error from [verifyUserKycDetails] ${JSON.stringify(guardianEmptyFileUploadedError)}`);
                            throw (guardianEmptyFileUploadedError);
                        }
                        return;
                    default:
                        return;
                }
            }
            const guardianTaskIdDoesNotExistError: any = GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.TASK_ID_DOESNOT_EXIST);
            logger.info(`inside [guardianService] [verifyUserKycDetails] received error from [verifyUserKycDetails] ${JSON.stringify(guardianTaskIdDoesNotExistError)}`);
            throw (guardianTaskIdDoesNotExistError);
        } catch (e) {
            //  User KYC Failure
            logger.info(e,`inside [guardianService] [verifyUserKycDetails] received error from [verifyUserKycDetails] `);
            throw (e);
        }
    }

    static async verifyKycBankDocuments(userId: any, userDocumentDetails: any, restClient: any, vendorId: string) {
        try {
            const kycFilter: UserKycFilter = {userKycDataMethod: USER_KYC_DATA.NORMAL};
            kycFilter.documentStatus = [
                GUARDIAN_DOCUMENT_STATUS.MANUAL_REVIEW,
                GUARDIAN_DOCUMENT_STATUS.SUBMITTED,
                GUARDIAN_DOCUMENT_STATUS.VERIFIED
            ]
            kycFilter.sortBy = GUARDIAN_SORT_DATA_CONFIG.DESC;
            const userKycDetails: UserKycDetails = await GuardianService.getUserKycDetails(userId, kycFilter, restClient, vendorId);
            logger.info(`inside [guardianService] [verifyKycBankDocuments] :: received userKycDetails ${JSON.stringify(userKycDetails)}`);
            // filter only the bank documents
            const userBankKycDetails: UserKycDocumentDetails[] = userKycDetails.userKycDocumentDetails.filter(document => document.documentType === GUARDIAN_DOCUMENT_TYPE.BANK);
            const userUpiKycDetails: UserKycDocumentDetails[] = userKycDetails.userKycDocumentDetails.filter(document => document.documentType === GUARDIAN_DOCUMENT_TYPE.UPI);
            logger.info(`inside [guardianService] [verifyKycBankDocuments]:: received userBankKycDetails ${JSON.stringify(userBankKycDetails)} :: received userUpiKycDetails ${JSON.stringify(userUpiKycDetails)}`);
            const bankAccountNumber = userDocumentDetails?.bankAccountNumber;
            const bankIFSC = userDocumentDetails?.bankIFSC;
            const name: string = userDocumentDetails?.name;
            if (userBankKycDetails.length) {
                // only check if we have the bank details of user
                const existingData: any[] = userBankKycDetails[0]?.documentDetails.filter(bank => bank.accountNumber == bankAccountNumber && bank.IFSC == bankIFSC);
                logger.info(`inside [guardianService] [verifyKycBankDocuments]:: received existingData ${JSON.stringify(existingData)}`);
                const isExisting = existingData.length != 0;
                if (isExisting) {
                    const guardianBankAlreadyExistsError: any = GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.BANK_ALREADY_VERIFIED);
                    logger.info(`inside [guardianService] [verifyKycBankDocuments] received error from [verifyKycBankDocuments] ${JSON.stringify(guardianBankAlreadyExistsError)}`);
                    throw (guardianBankAlreadyExistsError);
                }
            }
            const userBankAccounts: number = userBankKycDetails.length ? userBankKycDetails[0].documentDetails.length : 0;
            const userUpiAccounts: number = userUpiKycDetails.length ? userUpiKycDetails[0].documentDetails.length : 0;
            const kycCount: number = userBankAccounts + userUpiAccounts;
            logger.info(`inside [guardianService] [verifyKycBankDocuments] got userBankAccounts:: ${userBankAccounts} userUpiAccounts :: ${userUpiAccounts} :: kycCount :: ${kycCount}`)
            if (kycCount >= configService.getMaxKycAccountsForVendor()[vendorId] || userBankAccounts > configService.getMaxKycBankAccountsForVendor()[vendorId] || userUpiAccounts > configService.getMaxKycUpiAccountsForVendor()[vendorId]) {
                logger.info({userDocumentDetails}, 'max allowed KYC limit exceeded.');
                const guardianMaxAllowedKycLimitExceededError: any = GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.MAX_ALLOWED_KYC_LIMIT_EXCEEDED);
                logger.info(`inside [guardianService] [verifyKycBankDocuments] received error from [verifyKycBankDocuments] ${JSON.stringify(guardianMaxAllowedKycLimitExceededError)}`);
                throw (guardianMaxAllowedKycLimitExceededError);
            }
            const task: any = await GuardianClient.createTask(userId, GUARDIAN_DOCUMENT_TYPE.BANK, GUARDIAN_DOCUMENT_METHOD.BANK, restClient, vendorId);
            const taskId: string = task?.taskId ?? '';
            userDocumentDetails = {accountNumber: String(bankAccountNumber), ifsc: String(bankIFSC), name}
            const bankVerifyDetails: any = await GuardianClient.verifyDocumentSync(taskId, userDocumentDetails, restClient, vendorId);
            if(bankVerifyDetails?.userDocument?.documentStatus != GUARDIAN_DOCUMENT_STATUS.VERIFIED && bankVerifyDetails?.userDocument?.documentStatus != GUARDIAN_DOCUMENT_STATUS.MANUAL_REVIEW){
                throw GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.BANK_VERIFICATION_FAILED,GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON[bankVerifyDetails?.userDocument?.statusChangeReason])
            }
            return {verificationStatus : bankVerifyDetails?.userDocument?.documentStatus};
        } catch (e) {
            //  User KYC Failure
            logger.info(e,`inside [guardianService] [verifyKycBankDocuments] received error from [verifyKycBankDocuments] `);
            throw (e);
        }
    }

    static async verifyKycUpiDocuments(userId: any, userDocumentDetails: any, restClient: any, vendorId: string) {
        try {
            const kycFilter: UserKycFilter = {userKycDataMethod: USER_KYC_DATA.NORMAL};
            kycFilter.documentStatus = [
                GUARDIAN_DOCUMENT_STATUS.MANUAL_REVIEW,
                GUARDIAN_DOCUMENT_STATUS.SUBMITTED,
                GUARDIAN_DOCUMENT_STATUS.VERIFIED
            ]
            kycFilter.sortBy = GUARDIAN_SORT_DATA_CONFIG.DESC;
            const userKycDetails: UserKycDetails = await GuardianService.getUserKycDetails(userId, kycFilter, restClient, vendorId);
            logger.info(`inside [guardianService] [verifyKycUpiDocuments] :: received userKycDetails ${JSON.stringify(userKycDetails)}`);
            // filter only the bank documents
            const userBankKycDetails: UserKycDocumentDetails[] = userKycDetails.userKycDocumentDetails.filter(document => document.documentType === GUARDIAN_DOCUMENT_TYPE.BANK);
            const userUpiKycDetails: UserKycDocumentDetails[] = userKycDetails.userKycDocumentDetails.filter(document => document.documentType === GUARDIAN_DOCUMENT_TYPE.UPI);
            logger.info(`inside [guardianService] [verifyKycUpiDocuments]:: received userBankKycDetails ${JSON.stringify(userBankKycDetails)} :: received userUpiKycDetails ${JSON.stringify(userUpiKycDetails)}`);
            const upiId = userDocumentDetails?.upiId;
            if (userUpiKycDetails.length) {
                // only check if we have the bank details of user
                const existingData: any[] = userUpiKycDetails[0]?.documentDetails.filter(upi => upi.upiId == upiId);
                logger.info(`inside [guardianService] [verifyKycUpiDocuments]:: received existingData ${JSON.stringify(existingData)}`);
                const isExisting = existingData.length != 0;
                if (isExisting) {
                    const guardianBankAlreadyExistsError: any = GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.BANK_ALREADY_VERIFIED);
                    logger.info(`inside [guardianService] [verifyKycUpiDocuments] received error from [verifyKycUpiDocuments] ${JSON.stringify(guardianBankAlreadyExistsError)}`);
                    throw (guardianBankAlreadyExistsError);
                }
            }
            const userBankAccounts: number = userBankKycDetails.length ? userBankKycDetails[0].documentDetails.length : 0;
            const userUpiAccounts: number = userUpiKycDetails.length ? userUpiKycDetails[0].documentDetails.length : 0;
            const kycCount: number = userBankAccounts + userUpiAccounts;
            logger.info(`inside [guardianService] [verifyKycUpiDocuments] got userBankAccounts:: ${userBankAccounts} userUpiAccounts :: ${userUpiAccounts} :: kycCount :: ${kycCount}`)
            if (kycCount >= configService.getMaxKycAccountsForVendor()[vendorId] || userBankAccounts > configService.getMaxKycBankAccountsForVendor()[vendorId] || userUpiAccounts > configService.getMaxKycUpiAccountsForVendor()[vendorId]) {
                logger.info({userDocumentDetails}, 'max allowed KYC limit exceeded.');
                const guardianMaxAllowedKycLimitExceededError: any = GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.MAX_ALLOWED_KYC_LIMIT_EXCEEDED);
                logger.info(`inside [guardianService] [verifyKycUpiDocuments] received error from [verifyKycUpiDocuments] ${JSON.stringify(guardianMaxAllowedKycLimitExceededError)}`);
                throw (guardianMaxAllowedKycLimitExceededError);
            }
            const task: any = await GuardianClient.createTask(userId, GUARDIAN_DOCUMENT_TYPE.UPI, GUARDIAN_DOCUMENT_METHOD.UPI, restClient, vendorId);
            const taskId: string = task?.taskId ?? '';
            userDocumentDetails = {upiId: String(upiId)}
            const upiVerificationDetails: any = await GuardianClient.verifyDocumentSync(taskId, userDocumentDetails, restClient, vendorId);
            logger.info('got the data for upi verification as ::',upiVerificationDetails);
            if(upiVerificationDetails?.userDocument?.documentStatus != GUARDIAN_DOCUMENT_STATUS.VERIFIED && upiVerificationDetails?.userDocument?.documentStatus != GUARDIAN_DOCUMENT_STATUS.MANUAL_REVIEW){
                throw GuardianClient.getErrorFromCode(GuardianClient.GUARDIAN_ERROR_CODES.UPI_VERIFICATION_FAILED,GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON[upiVerificationDetails?.userDocument?.statusChangeReason])
            }
            return {verificationStatus : upiVerificationDetails?.userDocument?.documentStatus};
        } catch (e) {
            //  User KYC Failure
            logger.info(e,`inside [guardianService] [verifyKycBankDocuments] received error from [verifyKycBankDocuments] `);
            throw (e);
        }
    }

    static async getIfscDetails(ifsc: string, restClient: any, vendorId: string) {
        try {
            logger.info(`inside [guardianService] [getIfscDetails] with ifsc ::  ${ifsc}`);
            const userIfscDetails: any = await GuardianClient.getIfscDetails(ifsc, restClient, vendorId);

            logger.info(`inside [guardianService] [userIfscDetails] got data :: ${JSON.stringify(userIfscDetails)}`);

            return userIfscDetails;
        } catch (e) {
            GuardianClient.getErrorFromCode(e?.status?.code)
            logger.info(e,`inside [guardianService] [getIfscDetails] received error from [getIfscDetails] `);
            throw (e);
        }
    }

    static async processTenetKycWebhookResponse(response: any, restClient: any, vendorId: string) {
        try {
            const successResponse = response?.data
            const userId = successResponse.userId
            logger.info(`
            inside [guardianService] [processTenetKycWebhookResponse] :: userId :: ${userId} 
            :: document status :: ${successResponse?.status} :: document type:: ${successResponse?.documentType}`);
            let firstBankVerification: boolean = true;
            if(successResponse?.documentType == GUARDIAN_DOCUMENT_TYPE.BANK){
                // check if the user has already done bank kyc
                const documentType: number[] = [GUARDIAN_DOCUMENT_TYPE.BANK],
                    userKycDataMethod: string = USER_KYC_DATA.NORMAL,
                    sortBy: number = GUARDIAN_SORT_DATA_CONFIG.DESC,
                    documentStatus: number[] = [
                        GUARDIAN_DOCUMENT_STATUS.VERIFIED,
                    ];
                const userKycFilter: UserKycFilter = {
                    userKycDataMethod,
                    documentType,
                    documentStatus,
                    sortBy
                };
                const getSelectedDocumentInformation: boolean = false;// we need all the verified documents
                const kycDetails :UserKycDetails = await GuardianService.getUserKycDetails(userId, userKycFilter, restClient, `${vendorId}`, getSelectedDocumentInformation);
                if(kycDetails.userKycDocumentDetails.length && kycDetails.userKycDocumentDetails[0].documentDetails.length > 1){
                    firstBankVerification = false
                }   
            }
            logger.info('pushing this data to kafka ::',{
                docType: GUARDIAN_DOCUMENT_NAME[successResponse?.documentType],
                documentStatus: GUARDIAN_DOCUMENT_STATUS_FOR_EVENTS[successResponse?.status],
                documentNumber: successResponse?.upiId,
                reason: GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON[successResponse?.reason],
                autoVerificationStatus: successResponse?.autoVerificationStatus
            });
            switch (successResponse?.status) {
                case GUARDIAN_DOCUMENT_STATUS.SUBMITTED:
                    if(successResponse?.documentType == GUARDIAN_DOCUMENT_TYPE.UPI){
                        EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_UPI_STATUS, {
                            docType: GUARDIAN_DOCUMENT_NAME[successResponse?.documentType],
                            documentStatus: GUARDIAN_DOCUMENT_STATUS_FOR_EVENTS[successResponse?.status],
                            documentNumber: successResponse?.upiId,
                            reason: GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON[successResponse?.reason],
                            autoVerificationStatus: successResponse?.autoVerificationStatus
                        });
                    }
                    else if(successResponse?.documentType == GUARDIAN_DOCUMENT_TYPE.BANK && !firstBankVerification){
                        EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_BANK_STATUS, {
                            docType: GUARDIAN_DOCUMENT_NAME[successResponse?.documentType],
                            documentStatus: GUARDIAN_DOCUMENT_STATUS_FOR_EVENTS[successResponse?.status],
                            documentNumber: successResponse?.accountNumber,
                            name: successResponse?.name,
                            ifsc: successResponse?.ifsc,
                            reason: GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON[successResponse?.reason],
                            autoVerificationStatus: successResponse?.autoVerificationStatus
                        })
                    }
                    else
                    {   EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_KYC_UPLOAD_SUCCESS, {
                            docType: GUARDIAN_DOCUMENT_NAME[successResponse?.documentType]
                        })
                    }
                    return
                case GUARDIAN_DOCUMENT_STATUS.MANUAL_REVIEW:
                    if(successResponse?.documentType == GUARDIAN_DOCUMENT_TYPE.UPI){
                        EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_UPI_STATUS, {
                            docType: GUARDIAN_DOCUMENT_NAME[successResponse?.documentType],
                            documentStatus: GUARDIAN_DOCUMENT_STATUS_FOR_EVENTS[successResponse?.status],
                            documentNumber: successResponse?.upiId,
                            reason: GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON[successResponse?.reason],
                            autoVerificationStatus: successResponse?.autoVerificationStatus
                        });
                    }
                    else if(successResponse?.documentType == GUARDIAN_DOCUMENT_TYPE.BANK && !firstBankVerification){
                        EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_BANK_STATUS, {
                            docType: GUARDIAN_DOCUMENT_NAME[successResponse?.documentType],
                            documentStatus: GUARDIAN_DOCUMENT_STATUS_FOR_EVENTS[successResponse?.status],
                            documentNumber: successResponse?.accountNumber,
                            name: successResponse?.name,
                            ifsc: successResponse?.ifsc,
                            reason: GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON[successResponse?.reason],
                            autoVerificationStatus: successResponse?.autoVerificationStatus
                        })
                    }
                    else{
                        EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_KYC_UPLOAD_SUCCESS, {
                            docType: GUARDIAN_DOCUMENT_NAME[successResponse?.documentType]
                        })
                        EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_KYC_PENDING, {
                            docType: GUARDIAN_DOCUMENT_NAME[successResponse?.documentType],
                            documentStatus: GUARDIAN_DOCUMENT_STATUS_FOR_EVENTS[successResponse?.status],
                            documentNumber: successResponse?.accountNumber,
                            reason: GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON[successResponse?.reason],
                            autoVerificationStatus: successResponse?.autoVerificationStatus
                        })
                    }
                    return
                case GUARDIAN_DOCUMENT_STATUS.VERIFIED:
                    if(successResponse?.documentType == GUARDIAN_DOCUMENT_TYPE.UPI){
                        EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_UPI_STATUS, {
                            docType: GUARDIAN_DOCUMENT_NAME[successResponse?.documentType],
                            documentStatus: GUARDIAN_DOCUMENT_STATUS_FOR_EVENTS[successResponse?.status],
                            documentNumber: successResponse?.upiId,
                            reason: GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON[successResponse?.reason],
                            autoVerificationStatus: successResponse?.autoVerificationStatus
                        });
                    }
                    else if (successResponse?.documentType == GUARDIAN_DOCUMENT_TYPE.PAN) {
                        const panKycSuccessEventData = getPanKycSuccessEventData(successResponse);
                        EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_KYC_PAN_SUCCESS, panKycSuccessEventData)
                    }
                    else if (successResponse?.documentType == GUARDIAN_DOCUMENT_TYPE.BANK) {
                        if(!firstBankVerification){
                            EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_BANK_STATUS, {
                                docType: GUARDIAN_DOCUMENT_NAME[successResponse?.documentType],
                                documentStatus: GUARDIAN_DOCUMENT_STATUS_FOR_EVENTS[successResponse?.status]
                            })
                        }
                        else{
                        //  User KYC Complete
                            const bankKycSuccessEventData = getBankKycSuccessEventData(successResponse);
                            EventPushService.push(userId, Number(vendorId), "", EventNames.USER_KYC_COMPLETE, {});
                            EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_KYC_BANK_SUCCESS, bankKycSuccessEventData)
                        }
                    }
                    return
                case GUARDIAN_DOCUMENT_STATUS.REJECTED:
                    if(successResponse?.documentType == GUARDIAN_DOCUMENT_TYPE.UPI){
                        EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_UPI_STATUS, {
                            docType: GUARDIAN_DOCUMENT_NAME[successResponse?.documentType],
                            documentStatus: GUARDIAN_DOCUMENT_STATUS_FOR_EVENTS[successResponse?.status],
                            documentNumber: successResponse?.upiId,
                            reason: GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON[successResponse?.reason],
                            autoVerificationStatus: successResponse?.autoVerificationStatus
                        });
                    }
                    else if(successResponse?.documentType == GUARDIAN_DOCUMENT_TYPE.BANK && !firstBankVerification){
                        EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_BANK_STATUS, {
                            docType: GUARDIAN_DOCUMENT_NAME[successResponse?.documentType],
                            documentStatus: GUARDIAN_DOCUMENT_STATUS_FOR_EVENTS[successResponse?.status],
                            documentNumber: successResponse?.accountNumber,
                            name: successResponse?.name,
                            ifsc: successResponse?.ifsc,
                            reason: GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON[successResponse?.reason],
                            autoVerificationStatus: successResponse?.autoVerificationStatus
                        })
                    }
                    else{
                        EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_KYC_FAILURE, {
                            docType: GUARDIAN_DOCUMENT_NAME[successResponse?.documentType],
                            reason: GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON[successResponse?.autoVerificationStatus]
                        })
                    }
                    return
                default:
                    return
            }

        } catch (e) {
            logger.error(e,`inside [guardianService] [processTenetKycWebhookResponse] received error from [processTenetKycWebhookResponse] `);
            throw (e);
        }
    }
};
