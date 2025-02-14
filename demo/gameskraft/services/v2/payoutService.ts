// import Pagination from '../../models/pagination';
import PayoutClientV2 from '../../clients/v2/payoutClient';
import GuardianService from '../../services/guardianService';
import LoggerUtil, {ILogger} from '../../utils/logger';
import {
    GUARDIAN_DOCUMENT_STATUS,
    GUARDIAN_DOCUMENT_TYPE,
    GUARDIAN_SORT_DATA_CONFIG,
    USER_KYC_DATA
} from '../../constants/guardian-constants';
import {
    DEFAULT_PAYOUT_CONSTANT,
    MAX_BENEFICIARY_REJECTED_ACCOUNTS,
    PAYOUT_BENEFICIARY_TYPE,
    PAYOUT_HOOK_EVENT_NAME,
    PAYOUT_MODE_FOR_EVENTS,
    PAYOUT_STATUS,
    PAYOUT_TYPE,
    UPI_SPLITTER
} from '../../constants/payout-constants';
import UserKycFilter from '../../models/user-kyc-filter';
import {UserKycDetails, UserKycDocumentDetails, UserKycStatus} from '../../models/guardian/user-kyc';
import {
    BankDetails,
    PayoutBeneficiary,
    PayoutDetailsV2,
    PayoutDowntime,
    PayoutLimits,
    PayoutPack,
    PayoutPacksResponseV2,
    PayoutStatusV2,
    PayoutTransaction,
    PayoutTransactionBreakup,
    PayoutTransactionV2,
    TdsFreeWithdrawalDetails,
    TdsInfo,
    UpiDetails,
    ValidatePayoutResponseV2
} from '../../models/payoutV2/response';
import SupernovaService from './../supernovaService';
import PayoutFilter from '../../models/payout/payout-filter';
import PayoutServiceErrorUtil from '../../errors/payout/payout-error-util';
import EventPushService from '../../producer/eventPushService';
import EventNames from '../../producer/enums/eventNames';
import RoyaltyService from './../royaltyService';
import DatetimeUtil from '../../utils/datetime-util';
import ZodiacService from './../zodiacService';
import IDMService from './../idmService';
import {IDMUserProfile} from "../../models/idm/user-idm";
import IdmUtil from "../../utils/idm-utils";
import {RoyaltyBenefits} from '../../models/royalty/response';
import PayoutUtilV2 from '../../utils/v2/payout-utils';
import {
    CreatePayoutRequest,
    CreateUserPayoutRequestV2,
    ValidatePayoutRequest,
    ValidateUserPayoutRequestV2
} from '../../models/payoutV2/request';
import Parser from '../../utils/parser';
import { P52_VENDOR_ID } from '../../constants/constants';
import { getUpiDetails } from '../../utils/guardian-util';
import PlanetService from '../planetService';
const configService = require('../configService');
const logger: ILogger = LoggerUtil.get('PayoutService');

export default class PayoutServiceV2 {

    static async getPayoutDowntimes(restClient: any,vendorId: number): Promise<PayoutDowntime[]>{
        try{
            logger.info('fetching payout downtimes');
            const downtime: PayoutDowntime[] = await PayoutClientV2.getPayoutDownTimes(restClient,vendorId);
            logger.info("got the downtime",downtime);
            return downtime;
        } catch(e){
            throw(e);
        }
    }

    static async getPayoutDetailsV2(req: any, userId: string, vendorId: number,payoutDetailsForVerification?:boolean): Promise<PayoutDetailsV2> {
        try {
            // Check for Withdrawal Ban
            const userDetails: IDMUserProfile = await IDMService.getUserDetails(req.internalRestClient, userId, `${vendorId}`);
            const isWithdrawalBan: boolean = IdmUtil.getWithdrawalBan(userDetails);
            if (isWithdrawalBan) {
                throw PayoutServiceErrorUtil.getWithdrawalBanError();
            }

            // create payload for Fetching KYC information
            const documentType: number[] = [GUARDIAN_DOCUMENT_TYPE.BANK, GUARDIAN_DOCUMENT_TYPE.PAN,GUARDIAN_DOCUMENT_TYPE.UPI];
            const userKycDataMethod: string = USER_KYC_DATA.NORMAL;
            const documentStatus: number[] = [
                GUARDIAN_DOCUMENT_STATUS.VERIFIED,
            ];
            if(!payoutDetailsForVerification){
                documentStatus.push(GUARDIAN_DOCUMENT_STATUS.MANUAL_REVIEW);
                documentStatus.push(GUARDIAN_DOCUMENT_STATUS.SUBMITTED);
                documentStatus.push(GUARDIAN_DOCUMENT_STATUS.REJECTED);
            }
            const sortBy = GUARDIAN_SORT_DATA_CONFIG.DESC;
            const userKycFilter: UserKycFilter = {
                userKycDataMethod,
                documentType,
                documentStatus,
                sortBy
            };
            const getSelectedDocumentInformation: boolean = false;// we need all the verified documents
            logger.info(`[getPayoutDetailsV2] userId - ${userId} userKYCFilter -${JSON.stringify(userKycFilter)},`);
            type kycDetails = UserKycDetails;
            type payoutBenefits = RoyaltyBenefits;
            type tdsFreeWithdrawalAmount = TdsFreeWithdrawalDetails;
            const [kycDetails, payoutBenefits, {totalCount, totalSum,payoutTransactionBreakup}, tdsFreeWithdrawalDetails] = await Promise.all([
                // TODO Change when Guardian V2 Service is ready
                GuardianService.getUserKycDetails(userId, userKycFilter, req.internalRestClient, `${vendorId}`, getSelectedDocumentInformation),
                RoyaltyService.getUserRoyaltyBenefits(req.internalRestClient, Number(userId), vendorId),
                PayoutServiceV2.getTodaysWithdrawalCountAndAmountV2(req, userId, vendorId),
                SupernovaService.getTdsFreeWithdrawalDetails(req.internalRestClient, userId, vendorId),

            ]);
            const payoutdowntime: PayoutDowntime[] = await PayoutServiceV2.getPayoutDowntimes(req.internalRestClient,vendorId);

            logger.info(`[getPayoutDetailsV2] GuardianService response :: ${JSON.stringify(kycDetails)}, userId - ${userId}`);

            const {userKycDocumentDetails} = kycDetails;
            const kycStatus = kycDetails.userKycStatus;

            const isKYCDone: boolean = PayoutServiceV2.isKYCVerifiedWRTWithdrawal(kycStatus); // Transforming Guardian Response

            logger.info(`[getPayoutDetailsV2] response :: ${JSON.stringify(kycStatus)}, ${JSON.stringify(userKycDocumentDetails)}`);

            const bankDetails: BankDetails[] = [];
            if (userKycDocumentDetails.length > 0) {
                // Filter Bank Document
                const userBankKycDoc = userKycDocumentDetails.filter(
                    (bankDetail: any) => Number(bankDetail.documentType) === Number(GUARDIAN_DOCUMENT_TYPE.BANK)
                )
                if (userBankKycDoc.length <= 0) {
                    throw PayoutServiceErrorUtil.getKycNeededForWithdrawal()
                }
                const userBankDocuments: any = userBankKycDoc[0].documentDetails;
                let maxUnverifiedBankDetails: number = 0;
                userBankDocuments.map((bank: any,index: number) => {
                        const bankIconInfo = bank?.ifsc ? PayoutUtilV2.getPayoutBankConfigWrtIfsc(bank.ifsc, vendorId): {bankIcon: '',bankShortName:'',bankName: ''};
                        const bankDowntimeStatus: {isDisabled: boolean,errorText: string} = PayoutUtilV2.getBankDowntimeStatus(payoutdowntime,bank,bankIconInfo.bankName);
                        const bankDetail = {
                            accountNumber: bank.accountNumber,
                            ifsc: bank.ifsc,
                            name: bank.name,
                            documentNumber: bank.documentNumber,
                            status: bank.status,
                            statusChangeReason: bank.statusChangeReason,
                            autoVerificationStatus: bank?.autoVerificationStatus,
                            ...bankDowntimeStatus,
                            ...bankIconInfo
                        }
                        if(bankDetail.status == GUARDIAN_DOCUMENT_STATUS.REJECTED && !(bankDetail?.autoVerificationStatus)){
                            maxUnverifiedBankDetails++;
                        }
                        if(index < configService.getMaxKycBankAccountsForVendor()[vendorId]){
                            if(bankDetail.status != GUARDIAN_DOCUMENT_STATUS.REJECTED)
                                bankDetails.push(bankDetail)
                            else if(maxUnverifiedBankDetails <= MAX_BENEFICIARY_REJECTED_ACCOUNTS && !(bankDetail?.autoVerificationStatus)){
                                bankDetails.push(bankDetail)
                            }
                        }
                    }
                )
            }
            logger.info(`[getPayoutDetailsV2] response Bank Details:: ${JSON.stringify(bankDetails)}`);
            const maxAlloweBankBeneficiaryAccounts: number = configService.getMaxKycBankAccountsForVendor()[vendorId];
            const bankBeneficiaryAccountLimitReached: boolean = PayoutUtilV2.checkBeneficiaryAccountLimitReached(bankDetails,maxAlloweBankBeneficiaryAccounts);
            const bankPayoutBeneficiary: PayoutBeneficiary = {beneficiaryType:PAYOUT_BENEFICIARY_TYPE.BANK,
                                                            beneficiaryAccounts: bankDetails,
                                                            beneficiaryAccountLimitReached:bankBeneficiaryAccountLimitReached,
                                                            beneficiaryTag: configService.getPayoutbeneficiaryTagConfigForVendor()[vendorId][PAYOUT_BENEFICIARY_TYPE.BANK],
                                                            beneficiaryPriority: configService.getPayoutbeneficiaryPriorityForVendor()[vendorId][PAYOUT_BENEFICIARY_TYPE.BANK],
                                                        }// following the guardian enums here for document
            // get upi details
            const upiDetails: UpiDetails[] = getUpiDetails(userKycDocumentDetails,vendorId);
            const upiDetailsWithDowntime: UpiDetails[] = upiDetails.map(upi => {return {...upi,...PayoutUtilV2.getUpiDowntime(payoutdowntime,upi.upiId)}});
            const maxAlloweUpiBeneficiaryAccounts: number = configService.getMaxKycUpiAccountsForVendor()[vendorId];
            const upiBeneficiaryAccountLimitReached: boolean = PayoutUtilV2.checkBeneficiaryAccountLimitReached(upiDetailsWithDowntime,maxAlloweUpiBeneficiaryAccounts);
            const upiPayoutBeneficiary: PayoutBeneficiary = {beneficiaryType:PAYOUT_BENEFICIARY_TYPE.UPI,
                                                            beneficiaryAccounts: upiDetailsWithDowntime,
                                                            beneficiaryAccountLimitReached:upiBeneficiaryAccountLimitReached,
                                                            beneficiaryTag: configService.getPayoutbeneficiaryTagConfigForVendor()[vendorId][PAYOUT_BENEFICIARY_TYPE.UPI],
                                                            beneficiaryPriority: configService.getPayoutbeneficiaryPriorityForVendor()[vendorId][PAYOUT_BENEFICIARY_TYPE.BANK], 
                                                        }
            const payoutBeneficiary: Array<PayoutBeneficiary> = [
                                                            upiPayoutBeneficiary,
                                                            bankPayoutBeneficiary
                                                        ].sort(
                                                            (beneficiary1,beneficiary2) => beneficiary2.beneficiaryPriority - beneficiary1.beneficiaryPriority
                                                        );
            logger.info(`[getPayoutDetailsV2] response upi Details:: ${JSON.stringify(upiDetails)}`);

            const payoutLimits: PayoutLimits = {
                minPayoutAmountLimit: PayoutUtilV2.getPayoutMinimumLimit(vendorId),
                maxPayoutCountLimit: payoutBenefits.withdrawalCountLimit,
                maxPayoutAmountLimit: payoutBenefits.withdrawalAmtLimit,
                payoutCountLimitReached: (payoutBenefits.withdrawalCountLimit <= totalCount),
                freeTdsPayoutLimit: tdsFreeWithdrawalDetails?.tdsFreeWithdrawalAmount || 0
            }
            const payoutDetails: PayoutDetailsV2 = {kycStatus: isKYCDone, 
                                                    payoutBeneficiary, 
                                                    payoutLimits,
                                                    bankDetails,
                                                    payoutTransactionBreakup
                                                };
            return payoutDetails;
        } catch (error) {
            logger.info({error}, 'Exception in getPayoutDetails');
            throw error;
        }
        // Fetch Configs from Zookeeper or Royalty
    }

    static isKYCVerifiedWRTWithdrawal(kycStatus: UserKycStatus): boolean {
        if (kycStatus.pan && kycStatus.pan === GUARDIAN_DOCUMENT_STATUS.VERIFIED && kycStatus.bank && kycStatus.bank === GUARDIAN_DOCUMENT_STATUS.VERIFIED) {
            return true;
        }
        return false;
    }

    static async getPayoutPacksV2(
        userId: string, amount: number, vendorId: number): Promise<PayoutPacksResponseV2> {
        try {
            logger.info(`[getPayoutPacksV2] userId :: ${userId} amount: ${amount}, vendorId: ${vendorId}`);
            const payoutPacksList: PayoutPack[] = [];
            const payoutPacksData = PayoutUtilV2.getPayoutPacks(vendorId);
            const updatedPayoutPacks = payoutPacksData?.payoutPacks.map(payoutPack => ({
                ...payoutPack,
                gameBalanceCredit: Parser.parseToTwoDecimal(payoutPack.gameBalanceCredit * amount),
                withdrawToBank: Parser.parseToTwoDecimal(payoutPack.withdrawToBank * amount),
                discountCredit: Parser.parseToTwoDecimal(payoutPack.discountCredit * amount),
                finalAmount: Parser.parseToTwoDecimal(payoutPack.gameBalanceCredit * amount + payoutPack.withdrawToBank * amount + payoutPack.discountCredit * amount)
            }));
            const payoutDetails: PayoutPacksResponseV2 = {
                requestedWithdrawalAmount: amount,
                withdrawalPacks: updatedPayoutPacks,
                defaultWithdrawalPack: payoutPacksData.defaultPayoutPack
            };
            return payoutDetails;
        } catch (error) {
            logger.info({error}, 'Exception in getPayoutPacksV2');
            throw error;
        }
        // Fetch Configs from Zookeeper or Royalty
    }

    static async validatePayoutV2(
        req: any, validateUserPayoutRequest: ValidateUserPayoutRequestV2, vendorId: number
    ): Promise<any> {
        if(!validateUserPayoutRequest.beneficiaryType){
            validateUserPayoutRequest.beneficiaryType = PAYOUT_BENEFICIARY_TYPE.BANK;
        }
        logger.info({validateUserPayoutRequest, vendorId}, '[validatePayoutV2] Request Data ');
        const [beneficiaryDetails, payoutBenefits, {totalCount, totalSum,payoutTransactionBreakup}] = await Promise.all([
            PayoutServiceV2.getPayoutBeneficiaryDetailsV2(req, validateUserPayoutRequest.userId, validateUserPayoutRequest.documentNumber, validateUserPayoutRequest.beneficiaryType,vendorId),
            RoyaltyService.getUserRoyaltyBenefits(req.internalRestClient, Number(validateUserPayoutRequest.userId), vendorId),
            PayoutServiceV2.getTodaysWithdrawalCountAndAmountV2(req, validateUserPayoutRequest.userId, vendorId)
        ]);

        const minimumPayoutLimit = PayoutUtilV2.getPayoutMinimumLimit(vendorId);
        if (validateUserPayoutRequest.amount < minimumPayoutLimit) {
            throw PayoutServiceErrorUtil.getWithdrwalLimitMinAmount()
        }

        logger.info(`[validatePayoutV2] payoutBeneficiaryDetails - ${JSON.stringify(beneficiaryDetails)}`);
        logger.info(`[validatePayoutV2] payoutBenefits - ${JSON.stringify(payoutBenefits)}`);
        logger.info(`[validatePayoutV2] totalCount, totalSum, payoutTransactionBreakup - ${JSON.stringify(totalCount)}, ${JSON.stringify(totalSum)}, ${JSON.stringify(payoutTransactionBreakup)}`);

        // withdrawal amount limit should not be the amount requested
        if (Number(payoutBenefits.withdrawalAmtLimit) < validateUserPayoutRequest.amount) {
            throw PayoutServiceErrorUtil.getWithdrwalLimitMaxAmount();
        }

        if (Number(payoutBenefits.withdrawalCountLimit) <= totalCount) {
            throw PayoutServiceErrorUtil.getWithdrawalLimitForTheDay();
        }

        // upi based checks comes here 
        if(validateUserPayoutRequest.beneficiaryType == PAYOUT_BENEFICIARY_TYPE.UPI){
            
            if(payoutTransactionBreakup.upiPayoutTransactions + 1 > payoutTransactionBreakup.maxUpiTransactionsAllowed){
                throw PayoutServiceErrorUtil.getWithdrawalLimitForTheDay();
            }

            if(Number(payoutTransactionBreakup.upiPayoutSum) + Number(validateUserPayoutRequest.amount) > payoutTransactionBreakup.maxUpiPayoutAmount){
                throw PayoutServiceErrorUtil.getWithdrawalLimitForTheDay();
            }
        }
        const selectedPayoutPack: PayoutPack = PayoutUtilV2.getSelectedPayoutPacksData(validateUserPayoutRequest.withdrawalPackId, validateUserPayoutRequest.amount, vendorId);

        if (!selectedPayoutPack) {
            throw PayoutServiceErrorUtil.getInvalidWithdrawalPack();
        }
        const accountId: string = 'upiId' in beneficiaryDetails ? beneficiaryDetails?.upiId: beneficiaryDetails?.accountNumber;
        const accountDepository:  string = 'ifsc' in beneficiaryDetails ? beneficiaryDetails?.ifsc : "";
        const payoutMode: number = 'upiId' in beneficiaryDetails ? DEFAULT_PAYOUT_CONSTANT.UPI_PAYOUT_MODE:DEFAULT_PAYOUT_CONSTANT.PAYOUT_MODE;
        const payoutRequest: ValidatePayoutRequest = {
            amount: selectedPayoutPack.withdrawToBank,
            requestId: req.internalRestClient.getRequestId(),
            userId: validateUserPayoutRequest.userId,
            nameValidationRequired: DEFAULT_PAYOUT_CONSTANT.NAME_VALIDATION_REQUIRED,
            payoutMode: payoutMode,
            accountId: accountId,
            accountDepository: accountDepository
        };
        // Bank KYCed Name
        const userName: string = 'name' in beneficiaryDetails ? beneficiaryDetails.name : '';
        const userDetails = {userName};
        payoutRequest.userDetails = userDetails;

        // Validate Request
        const isValidRequest: any = await PayoutClientV2.validateOrderV2(req.internalRestClient, vendorId, payoutRequest);

        logger.info(`[validatePayout] isValidRequest - ${JSON.stringify(isValidRequest)}`);
        // Call for TDS Calculation
        const tdsInfoResp = await SupernovaService.getTdsInformation(
            req.internalRestClient,
            validateUserPayoutRequest.userId,
            selectedPayoutPack.withdrawToBank,
            vendorId
        );

        const transformedTdsInfo: TdsInfo = PayoutUtilV2.getTransformedTdsInfo(tdsInfoResp);
        logger.info(`[validatePayout] userId - ${validateUserPayoutRequest.userId}, tdsInfo - ${JSON.stringify(transformedTdsInfo)}`);
        const resp: ValidatePayoutResponseV2 = {
            tdsInfo: transformedTdsInfo,
            documentNumber: validateUserPayoutRequest.documentNumber,
            isSuperSaverApplied: selectedPayoutPack.superSaver,
            withdrawalPack: selectedPayoutPack,
            requestedAmount: validateUserPayoutRequest.amount,
        };
        return resp;
    }

    static async createPayoutOrderV2(
        req: any, createPayoutUserRequest: CreateUserPayoutRequestV2,gstStateCode: number,vendorId: number
    ): Promise<any> {
        if(!createPayoutUserRequest.beneficiaryType){
            createPayoutUserRequest.beneficiaryType = PAYOUT_BENEFICIARY_TYPE.BANK;
        }
        logger.info(`createPayoutOrder Request userId -
                        ${createPayoutUserRequest.userId}, amount - ${createPayoutUserRequest.amount}, documentNumber - ${createPayoutUserRequest.documentNumber},
                        transactionId - ${createPayoutUserRequest.tdsTransactionId} with beneficiaryType - ${createPayoutUserRequest.beneficiaryType}`);

        // Validate Payout Order Request Again
        const beneficiaryDetail: UpiDetails | BankDetails = await PayoutServiceV2.getPayoutBeneficiaryDetailsV2(
            req,
            createPayoutUserRequest.userId,
            createPayoutUserRequest.documentNumber,
            createPayoutUserRequest.beneficiaryType,
            vendorId
        );
        logger.info(`[createPayoutOrder] payoutBeneficiaryDetail - ${JSON.stringify(beneficiaryDetail)}`);

        const userUniqueId = `${vendorId}_${createPayoutUserRequest.userId}`;
        const bankIfsc = 'ifsc' in beneficiaryDetail ? beneficiaryDetail?.ifsc : "";
        // if the beneficary is a bank do this
        const [ifscState, userDetails, fairplayDetails] = await Promise.all([
            createPayoutUserRequest.beneficiaryType == PAYOUT_BENEFICIARY_TYPE.BANK ? PayoutServiceV2.getIfscStateV2(req.internalRestClient,bankIfsc, vendorId):"",
            IDMService.getUserDetails(req.internalRestClient, createPayoutUserRequest.userId, `${vendorId}`),
            ZodiacService.getUserFairplayDetails(req.internalRestClient, userUniqueId)
        ])

        if(createPayoutUserRequest.beneficiaryType == PAYOUT_BENEFICIARY_TYPE.BANK)
            logger.info(`[createPayoutOrder] ifscState :: ${JSON.stringify(ifscState)}`);
        logger.info(`[createPayoutOrder]  userDetails :: ${JSON.stringify(userDetails)}`);
        logger.info(`[createPayoutOrder] fairplayDetails :: ${JSON.stringify(fairplayDetails)}`);

        let instantWithdrawalAllowed = fairplayDetails.instant_withdrawal_allowed;

        const selectedPayoutPack: PayoutPack = PayoutUtilV2.getSelectedPayoutPacksData(createPayoutUserRequest.withdrawalPackId, createPayoutUserRequest.amount, vendorId);


        // selected Payout does not exists
        if (!selectedPayoutPack) {
            throw PayoutServiceErrorUtil.getInvalidWithdrawalPack();
        }

        const defaultEmailId = vendorId === Number(P52_VENDOR_ID) ? `user${createPayoutUserRequest.userId}@pocket52.com` : `user${createPayoutUserRequest.userId}@gamezypoker.com`

        // If Amount is greater than instant payout limit
        const instantPayoutLimit: number = PayoutUtilV2.getInstantPayoutLimit(vendorId);
        if (selectedPayoutPack.withdrawToBank > instantPayoutLimit) {
            instantWithdrawalAllowed = false
        }

        const accountId: string = 'upiId' in beneficiaryDetail ? beneficiaryDetail?.upiId: beneficiaryDetail?.accountNumber;
        const accountDepository:  string = 'ifsc' in beneficiaryDetail ? beneficiaryDetail?.ifsc : "";
        const payoutMode: number = 'upiId' in beneficiaryDetail ? DEFAULT_PAYOUT_CONSTANT.UPI_PAYOUT_MODE:DEFAULT_PAYOUT_CONSTANT.PAYOUT_MODE;
        const createPayoutRequest: CreatePayoutRequest = {
            userId: createPayoutUserRequest.userId,
            amount: selectedPayoutPack.withdrawToBank,
            requestId: req.internalRestClient.getRequestId(),
            transferId: createPayoutUserRequest.tdsTransactionId,
            nameValidationRequired: DEFAULT_PAYOUT_CONSTANT.NAME_VALIDATION_REQUIRED,
            email: userDetails?.email || defaultEmailId,
            phoneNumber: userDetails?.mobile,
            accountId: accountId,
            accountDepository: accountDepository,
            payoutMode: payoutMode,
            address: ifscState || `${gstStateCode}`,
            approvalRequired: !instantWithdrawalAllowed,
            isAccountValidationRequired: false,
        };
        const userName: string = beneficiaryDetail.name;
        const userDetail = {userName};
        createPayoutRequest.userDetails = userDetail;

        const placeWithdrawalRequest = {
            userId: createPayoutUserRequest.userId,
            withdrawalAmount: selectedPayoutPack.withdrawToBank,
            tdsTransactionId: createPayoutUserRequest.tdsTransactionId,
            withdrawalToGameBalance: selectedPayoutPack.gameBalanceCredit,
            discountCreditAmount: selectedPayoutPack.discountCredit
        };

        // Deduct from Wallet Winnings and Make a TDS Record
        const walletDebitResp = await SupernovaService.placeWithdrawalV2(
            req.internalRestClient, placeWithdrawalRequest, vendorId
        );

        logger.info(`createPayoutOrder responseWalletDebit:: ${JSON.stringify(walletDebitResp)}`);

        const tdsDetails = walletDebitResp?.tdsDetails || {}
        createPayoutRequest.metadata = {
            ...tdsDetails,
            selectedPayoutPack,
            userAccount: walletDebitResp.userAccount,
            requestedAmount: createPayoutUserRequest.amount,
            instantWithdrawalAllowed
        };
        createPayoutRequest.amount = walletDebitResp.tdsDetails?.amountToBeCredit;

        let payoutOrderResp: any;

        try {
            // Place Order At Tenet
            payoutOrderResp = await PayoutClientV2.createPayoutOrderV2(req.internalRestClient, vendorId, createPayoutRequest);

            logger.info(`[createPayoutOrder] payoutOrderResp:: ${JSON.stringify(payoutOrderResp)}`);
            EventPushService.push(Number(createPayoutUserRequest.userId), Number(vendorId), '', EventNames.USER_PAYOUT_INITIATED, {
                amount: selectedPayoutPack.withdrawToBank,
                discountCreditAmount: selectedPayoutPack.discountCredit,
                withdrawalToGameBalance: selectedPayoutPack.gameBalanceCredit,
                withdrawalType: instantWithdrawalAllowed ? PAYOUT_TYPE.INSTANT : PAYOUT_TYPE.MANUAL,
                superboostUsed: selectedPayoutPack?.superSaver,
                tdsDetails,
                accountId: createPayoutRequest.accountId,
                payoutMode: PAYOUT_MODE_FOR_EVENTS[createPayoutRequest.payoutMode]
            });
        } catch (error) {
            logger.error({error}, `[createPayoutOrder] Withdrawal Creation API Failed `)
            const reverseWithdrawalReq = {
                userId: createPayoutUserRequest.userId,
                tdsTransactionId: createPayoutUserRequest.tdsTransactionId
            };
            const reversePayoutResp = await SupernovaService.reverseWithdrawalV2(
                req.internalRestClient, reverseWithdrawalReq, Number(vendorId)
            );
            throw PayoutClientV2.getErrorFromCode(error?.code);
        }
        const payoutConfig = PayoutUtilV2.getPayoutConfig(vendorId);
        const refreshInterval = payoutConfig.refresh_interval;
        const syncRequired = payoutConfig.sync_required;
        const requestedAmount = createPayoutUserRequest.amount;
        const amountCredited = walletDebitResp.tdsDetails?.amountToBeCredit;
        return {...payoutOrderResp, requestedAmount, amountCredited, refreshInterval, syncRequired}
    }

    static async getPayoutTransactionsV2(req: any, userId: string, vendorId: number, payoutFilter: PayoutFilter) {
        // For Transaction Ledger
        try {
            logger.info(`[getPayoutTransactions] userId - ${userId}, payoutFilter - ${JSON.stringify(payoutFilter)}`);
            const payoutTransactions = await PayoutClientV2.payoutHistoryV2(req.internalRestClient, userId, vendorId, payoutFilter);
            logger.info(`[getPayoutTransactions] userId - ${userId}, payoutTransactions Response - ${JSON.stringify(payoutTransactions)}`);
            const processedTransactions: PayoutTransaction[] = PayoutUtilV2.processPayoutTransactionsResponse(payoutTransactions.data);
            const payoutTransactionResponse = {
                transactions: processedTransactions,
                totalCount: payoutTransactions.totalCount
            }
            return payoutTransactionResponse;
        } catch (error) {
            logger.info({error}, 'Exception in getPayoutTransactions');
            throw error;
        }
    }

    static async getPayoutTransactionV2(restClient: any, userId: string, vendorId: number, payoutFilter: PayoutFilter) {
        // For a Single Transaction
        try {
            logger.info(`[getPayoutTransactionV2] userId - ${userId}, payoutFilter - ${JSON.stringify(payoutFilter)}`);
            const payoutTransactions = await PayoutClientV2.payoutHistoryV2(restClient, userId, vendorId, payoutFilter);
            logger.info(`[getPayoutTransactionV2] userId - ${userId}, payoutTransactions Response - ${JSON.stringify(payoutTransactions)}`);
            const processedTransaction: PayoutTransactionV2 | undefined = PayoutUtilV2.getSinglePayoutTransactionV2(payoutTransactions.data);
            if (!processedTransaction) {
                throw PayoutServiceErrorUtil.getTransactionNotFound()
            }
            return processedTransaction;
        } catch (error) {
            logger.info({error}, 'Exception in getPayoutTransactionV2');
            throw error;
        }
    }

    static async getPayoutStatusV2(restClient: any, userId: string, vendorId: number, payoutFilter: PayoutFilter) {
        // For a Single Transaction
        try {
            logger.info(`[getPayoutStatusV2] userId - ${userId}, payoutFilter - ${JSON.stringify(payoutFilter)}`);
            const payoutTransactions = await PayoutClientV2.payoutHistoryV2(restClient, userId, vendorId, payoutFilter);
            logger.info(`[getPayoutStatusV2] userId - ${userId}, payoutTransactions Response - ${JSON.stringify(payoutTransactions)}`);
            const processedTransaction: PayoutStatusV2 | undefined = PayoutUtilV2.getPayoutStatusV2(payoutTransactions.data, vendorId);
            if (!processedTransaction) {
                throw PayoutServiceErrorUtil.getTransactionNotFound()
            }
            return processedTransaction;
        } catch (error) {
            logger.info({error}, 'Exception in getPayoutStatusV2');
            throw error;
        }
    }


    static async getTodaysWithdrawalCountAndAmountV2(req: any, userId: string, vendorId: number) {
        const currentDate = new Date();
        const {startOfDay, endOfDay} = DatetimeUtil.getStartAndEndOfDayInUTC(currentDate);
        logger.info({startOfDay, endOfDay}, 'getTodaysWithdrawalCountAndAmountV2')
        const status = [PAYOUT_STATUS.PENDING, PAYOUT_STATUS.SUCCESS, PAYOUT_STATUS.PENDING_APPROVAL];
        const payoutFilter: PayoutFilter = {from: startOfDay, to: endOfDay, status};
        const payoutTransactions = await PayoutServiceV2.getPayoutTransactionsV2(req, userId, vendorId, payoutFilter);
        let payoutSum: number = 0,upiPayoutTransactions = 0,upiPayoutSum = 0,bankPayoutTransactions = 0,bankPayoutSum = 0;
        payoutTransactions.transactions.map((transaction => {
            payoutSum += transaction.amount;
            const isUpiTransaction: boolean = (transaction.accountId || "").includes(UPI_SPLITTER);
            // check if the tranx is a upi tranxn
            if(isUpiTransaction){
                upiPayoutTransactions+=1;
                upiPayoutSum+=transaction.amount;
            } else{
                bankPayoutTransactions+=1;
                bankPayoutSum+=transaction.amount;
            }
        }))

        const payoutTransactionBreakup: PayoutTransactionBreakup = {
            upiPayoutTransactions,
            upiPayoutSum,
            bankPayoutTransactions,
            bankPayoutSum,
            maxUpiPayoutAmount: configService.getMaxUpiTransactionAmountForVendor()[vendorId].amount,
            maxUpiTransactionsAllowed: configService.getMaxUpiTransactionAmountForVendor()[vendorId].transactionNumber
        }

        return {totalCount: payoutTransactions.totalCount, totalSum: payoutSum,payoutTransactionBreakup};

    }


    static async getBankDetailsV2(req: any, userId: string, documentNumber: string, vendorId: number) {
        logger.info({userId, documentNumber, vendorId}, '[getBankDetailsV2] Request ');
        const getPayoutDetailsForVerification: boolean = true;
        const payoutBankKYCDetails: PayoutDetailsV2 = await PayoutServiceV2.getPayoutDetailsV2(req, userId, vendorId,getPayoutDetailsForVerification);

        logger.info(`[getBankAndIfscDetails] getBankDetailsV2 - ${JSON.stringify(payoutBankKYCDetails)}`);
        if (!payoutBankKYCDetails.kycStatus) {
            throw PayoutServiceErrorUtil.getKycNeededForWithdrawal();
        }
        const bankDetail: BankDetails[] = payoutBankKYCDetails.bankDetails.filter(
            (bankDetail: any) => bankDetail.documentNumber == documentNumber
        );

        logger.info(`[getBankDetailsV2] bankDetails after filtering ${bankDetail}`);
        if (!bankDetail || bankDetail && bankDetail.length <= 0) {
            throw PayoutServiceErrorUtil.getInvalidAccountOrIfsc();
        }

        return bankDetail[0]

    }
    static async getPayoutBeneficiaryDetailsV2(req: any, userId: string, documentNumber: string,beneficiaryType: number,vendorId: number): Promise<UpiDetails | BankDetails> {
        logger.info({userId, documentNumber, vendorId}, '[getPayoutBeneficiaryDetailsV2] Request ');
        const getPayoutDetailsForVerification: boolean = true;
        const payoutBeneficiaryKYCDetails: PayoutDetailsV2 = await PayoutServiceV2.getPayoutDetailsV2(req, userId, vendorId,getPayoutDetailsForVerification);
        logger.info(`[getPayoutBeneficiaryDetailsV2] - ${JSON.stringify(payoutBeneficiaryKYCDetails)}`);
        if (!payoutBeneficiaryKYCDetails.kycStatus) {
            throw PayoutServiceErrorUtil.getKycNeededForWithdrawal();
        }
        const benficiaryDetails: PayoutBeneficiary[]  = payoutBeneficiaryKYCDetails.payoutBeneficiary.filter(beneficiary => beneficiary.beneficiaryType == beneficiaryType);
        if(benficiaryDetails.length){
            const beneficiaryDetail: PayoutBeneficiary = benficiaryDetails[0];
            const beneficiary: Array<UpiDetails | BankDetails> = beneficiaryDetail.beneficiaryAccounts.filter(beneficiaryElement => beneficiaryElement.documentNumber == documentNumber);
            logger.info(`[getPayoutBeneficiaryDetailsV2] beneficiary after filtering ${JSON.stringify(beneficiary)}`);
            if(!beneficiary || beneficiary && beneficiary.length <= 0)
                throw PayoutServiceErrorUtil.getInvalidAccountOrIfsc();
            return beneficiary[0];
        }
        throw PayoutServiceErrorUtil.getInvalidAccountOrIfsc();

    }

    static async getIfscStateV2(restClient: any, ifsc: string, vendorId: number) {
        if (!ifsc) {
            throw PayoutServiceErrorUtil.getInvalidAccountOrIfsc();
        }
        let ifscDetails: any;
        try {
            // TODO Change when Guardian V2 Service is ready
            ifscDetails = await GuardianService.getIfscDetails(ifsc, restClient, `${vendorId}`);
        } catch (error) {
            logger.error({error}, `[getBankAndIfscDetails] Failed to get IFSC Details `);
        }

        logger.info(`[getBankAndIfscDetails] getIfscDetails ${JSON.stringify(ifscDetails)}`);
        const ifscState: string = ifscDetails?.ifsc?.state || DEFAULT_PAYOUT_CONSTANT.DEFAULT_IFSC_STATE;

        return ifscState
    }

    static async processWebhookV2(restClient: any, userId: string, eventName: string, eventData: any, vendorId: number, metadata: any) {
        logger.info(`[PayoutServiceV2.processWebhook] eventName and eventData:: ${JSON.stringify(eventName)} ${JSON.stringify(eventData)}`);
        if (!userId) {
            throw PayoutServiceErrorUtil.getBodyValidationError('userId can not be empty')
        }
        const appType = "";
        switch (eventName) {
            case PAYOUT_HOOK_EVENT_NAME.TRANSFER_REVERSED:
            case PAYOUT_HOOK_EVENT_NAME.TRANSFER_FAILED:
                const resp = await PayoutServiceV2.reversePayoutV2(restClient, userId, eventData, vendorId);
                EventPushService.push(Number(userId), Number(vendorId), appType, EventNames.USER_PAYOUT_FAILED, {...eventData, metadata});
                return {};
            case PAYOUT_HOOK_EVENT_NAME.TRANSFER_PENDING:
                // Do nothing
                return {}
            case PAYOUT_HOOK_EVENT_NAME.TRANSFER_SUCCESS:
                EventPushService.push(Number(userId), Number(vendorId), appType, EventNames.USER_PAYOUT_SUCCESS, {...eventData, metadata});
                return {};
            case PAYOUT_HOOK_EVENT_NAME.VIRTUAL_ACCOUNT_THRESHOLD_BREACHED:
            case PAYOUT_HOOK_EVENT_NAME.CIRCUIT_BREAKER:
                EventPushService.push(Number(userId), Number(vendorId), appType, EventNames.USER_PAYOUT_FAILED, {...eventData, metadata});
                return {};
            default:
                return false;
        }
    }

    static async reversePayoutV2(restClient: any, userId: string, eventData: any, vendorId: number) {
        logger.info(`reversePayout userId - ${userId}, eventData ${JSON.stringify(eventData)}`)
        const transactionId = eventData?.transferId;
        if (!transactionId) {
            throw PayoutServiceErrorUtil.getBodyValidationError('transferId can not be empty');
        }
        const reverseWithdrawalReq = {userId: userId, tdsTransactionId: transactionId};
        const resp = await SupernovaService.reverseWithdrawalV2(
            restClient, reverseWithdrawalReq, vendorId
        );
        logger.info(`reversePayout resp - ${userId}, eventData ${JSON.stringify(resp)}`)

        return resp;
    }
}
