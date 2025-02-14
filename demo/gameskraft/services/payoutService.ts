// import Pagination from '../models/pagination';
import PayoutClient from '../clients/payoutClient';
import GuardianService from '../services/guardianService';
import LoggerUtil, {ILogger} from '../utils/logger';
import {
    GUARDIAN_DOCUMENT_STATUS,
    GUARDIAN_DOCUMENT_TYPE,
    GUARDIAN_SORT_DATA_CONFIG,
    USER_KYC_DATA
} from '../constants/guardian-constants';
import {
    DEFAULT_PAYOUT_CONSTANT,
    PAYOUT_HOOK_EVENT_NAME,
    PAYOUT_STATUS,
    PAYOUT_TYPE
} from '../constants/payout-constants';
import UserKycFilter from '../models/user-kyc-filter';
import {UserKycDetails, UserKycStatus} from '../models/guardian/user-kyc';
import {
    BankDetails,
    PayoutDetails,
    PayoutTransaction,
    PayoutTransactionStatus,
    TdsInfo,
    ValidatePayoutResponse
} from '../models/payout/response';
import {CreatePayoutRequest, ValidatePayoutRequest} from '../models/payout/requests';
import SupernovaService from './supernovaService';
import PayoutFilter from '../models/payout/payout-filter';
import PayoutServiceErrorUtil from '../errors/payout/payout-error-util';
import PayoutUtil from '../utils/payout-utils';
import EventPushService from '../producer/eventPushService';
import EventNames from '../producer/enums/eventNames';
import RoyaltyService from './royaltyService';
import DatetimeUtil from '../utils/datetime-util';
import ZodiacService from './zodiacService';
import IDMService from './idmService';
import {IDMUserProfile} from "../models/idm/user-idm";
import IdmUtil from "../utils/idm-utils";
import { P52_VENDOR_ID } from '../constants/constants';

const logger: ILogger = LoggerUtil.get('PayoutService');

export default class PayoutService {

    static async getPayoutDetails(restClient: any, userId: string, vendorId: string): Promise<PayoutDetails> {
        try {
            // Check for Withdrawal Ban
            const userDetails: IDMUserProfile = await IDMService.getUserDetails(restClient, userId, vendorId);
            const isWithdrawalBan: boolean = IdmUtil.getWithdrawalBan(userDetails);
            if (isWithdrawalBan) {
                throw PayoutServiceErrorUtil.getWithdrawalBanError();
            }


            // create payload for Fetching KYC information
            const documentType: number[] = [GUARDIAN_DOCUMENT_TYPE.BANK, GUARDIAN_DOCUMENT_TYPE.PAN];
            const userKycDataMethod: string = USER_KYC_DATA.NORMAL;
            const documentStatus: number[] = [
                GUARDIAN_DOCUMENT_STATUS.VERIFIED,
            ];
            const sortBy = GUARDIAN_SORT_DATA_CONFIG.DESC;
            const userKycFilter: UserKycFilter = {
                userKycDataMethod,
                documentType,
                documentStatus,
                sortBy
            };
            const getDocumentDetails: boolean = true;
            logger.info(`[getPayoutDetails] userId - ${userId} userKYCFilter -${JSON.stringify(userKycFilter)}, vendorId-${vendorId}`);
            const kycDetails: UserKycDetails = await GuardianService.getUserKycDetails(
                userId, userKycFilter, restClient, vendorId, getDocumentDetails
            );

            logger.info(`[getPayoutDetails] GuardianService response :: ${JSON.stringify(kycDetails)}, userId - ${userId}`);

            const {userKycDocumentDetails} = kycDetails;
            const kycStatus = kycDetails.userKycStatus;

            const isKYCDone: boolean = PayoutService.isKYCVerifiedWRTWithdrawal(kycStatus); // Transforming Guardian Response

            logger.info(`[PayoutService] response :: ${JSON.stringify(kycStatus)}, ${JSON.stringify(userKycDocumentDetails)}`);

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
                userBankDocuments.map((bank: any) => {
                        const bankIconInfo = PayoutUtil.getPayoutBankConfigWrtIfsc(bank.ifsc, vendorId);
                        const bankDetail = {
                            accountNumber: bank.accountNumber,
                            ifsc: bank.ifsc,
                            name: bank.name,
                            documentNumber: bank.documentNumber,
                            ...bankIconInfo
                        }
                        bankDetails.push(bankDetail)
                    }
                )
            }

            logger.info(`[PayoutService] response Bank Details:: ${JSON.stringify(bankDetails)}`);
            const minimumPayoutLimit = PayoutUtil.getPayoutMinimumLimit(vendorId);
            const payoutDetails: PayoutDetails = {kycStatus: isKYCDone, bankDetails, minimumPayoutLimit};

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

    static async validatePayout(
        req: any, userId: string, vendorId: string, amount: number, documentNumber: string
    ): Promise<any> {
        if (!documentNumber) {
            throw PayoutServiceErrorUtil.getInvalidAccountOrIfsc();
        }

        const [bankDetail, payoutBenefits, {totalCount, totalSum}] = await Promise.all([
            PayoutService.getBankDetails(req.internalRestClient, userId, vendorId, documentNumber),
            RoyaltyService.getUserRoyaltyBenefits(req.internalRestClient, Number(userId), Number(vendorId)),
            PayoutService.getTodaysWithdrawalCountAndAmount(req, userId, vendorId)
        ]);

        const minimumPayoutLimit = PayoutUtil.getPayoutMinimumLimit(vendorId);
        if (amount < minimumPayoutLimit) {
            throw PayoutServiceErrorUtil.getWithdrwalLimitMinAmount()
        }

        logger.info(`[validatePayout] payoutBankKYCDetails - ${JSON.stringify(bankDetail)}`);
        logger.info(`[validatePayout] payoutBenefits - ${JSON.stringify(payoutBenefits)}`);
        logger.info(`[validatePayout] totalCount, totalSum - ${JSON.stringify(totalCount)}, ${JSON.stringify(totalSum)}`);

        // withdrawal amount limit should not be the amount requested
        if (Number(payoutBenefits.withdrawalAmtLimit) < amount) {
            throw PayoutServiceErrorUtil.getWithdrwalLimitMaxAmount()
        }

        if (Number(payoutBenefits.withdrawalCountLimit) <= totalCount) {
            throw PayoutServiceErrorUtil.getWithdrawalLimitForTheDay()
        }

        const payoutRequest: ValidatePayoutRequest = {
            amount,
            requestId: req.internalRestClient.getRequestId(),
            userId,
            nameValidationRequired: DEFAULT_PAYOUT_CONSTANT.NAME_VALIDATION_REQUIRED,
            payoutMode: DEFAULT_PAYOUT_CONSTANT.PAYOUT_MODE,
            accountId: bankDetail.accountNumber,
            accountDepository: bankDetail.ifsc
        };
        // Bank KYCed Name
        const userDetails = {userName: bankDetail.name};
        payoutRequest.userDetails = userDetails;

        // Validate Request
        const isValidRequest: any = await PayoutClient.validateOrder(req.internalRestClient, payoutRequest, vendorId);

        logger.info(`[validatePayout] isValidRequest - ${JSON.stringify(isValidRequest)}`);
        // Call for TDS Calculation
        const tdsInfoResp = await SupernovaService.getTdsInformation(req.internalRestClient, userId, amount, Number(vendorId));

        const transformedTdsInfo: TdsInfo = PayoutUtil.getTransformedTdsInfo(tdsInfoResp);

        logger.info(`[validatePayout] userId - ${userId}, tdsInfo - ${JSON.stringify(transformedTdsInfo)}`);
        const resp: ValidatePayoutResponse = {tdsInfo: transformedTdsInfo, documentNumber};
        return resp;
    }

    static async createPayoutOrder(
        restClient: any, userId: string, vendorId: string, amount: number, documentNumber: string, transactionId: string
    ): Promise<any> {
        logger.info(`createPayoutOrder Request userId - ${userId}, amount - ${amount}, documentNumber - ${documentNumber}, transactionId - ${transactionId}`);

        // Validate Payout Order Request Again
        const bankDetail: BankDetails = await PayoutService.getBankDetails(restClient, userId, vendorId, documentNumber);
        logger.info(`[createPayoutOrder] payoutBankKYCDetails - ${JSON.stringify(bankDetail)}`);

        const userUniqueId = `${vendorId}_${userId}`;
        const [ifscState, userDetails, fairplayDetails] = await Promise.all([
            PayoutService.getIfscState(restClient, vendorId, bankDetail.ifsc),
            IDMService.getUserDetails(restClient, userId, vendorId),
            ZodiacService.getUserFairplayDetails(restClient, userUniqueId)
        ])


        logger.info(`[createPayoutOrder] ifscState :: ${JSON.stringify(ifscState)}`);
        logger.info(`[createPayoutOrder]  userDetails :: ${JSON.stringify(userDetails)}`);
        logger.info(`[createPayoutOrder] fairplayDetails :: ${JSON.stringify(fairplayDetails)}`);

        let instantWithdrawalAllowed = fairplayDetails.instant_withdrawal_allowed;

        // If Amount is greater than instant payout limit
        const instantPayoutLimit: number = PayoutUtil.getInstantPayoutLimit(vendorId);
        if (amount > instantPayoutLimit) {
            instantWithdrawalAllowed = false
        }

        const defaultEmailId = vendorId === P52_VENDOR_ID ? `user${userId}@pocket52.com` : `user${userId}@gamezypoker.com`

        const createPayoutRequest: CreatePayoutRequest = {
            userId,
            amount,
            requestId: restClient.getRequestId(),
            transferId: transactionId,
            nameValidationRequired: DEFAULT_PAYOUT_CONSTANT.NAME_VALIDATION_REQUIRED,
            email: userDetails?.email || defaultEmailId,
            phoneNumber: userDetails?.mobile,
            accountId: bankDetail.accountNumber,
            accountDepository: bankDetail.ifsc,
            payoutMode: DEFAULT_PAYOUT_CONSTANT.PAYOUT_MODE,
            address: ifscState,
            approvalRequired: !instantWithdrawalAllowed,
            isAccountValidationRequired: false,
        };
        const userDetail = {userName: bankDetail.name};
        createPayoutRequest.userDetails = userDetail;

        const placeWithdrawalRequest = {userId: userId, withdrawalAmount: amount, tdsTransactionId: transactionId};
        // Deduct from Wallet Winnings and Make a TDS Record
        const walletDebitResp = await SupernovaService.placeWithdrawal(
            restClient, placeWithdrawalRequest, Number(vendorId)
        );

        logger.info(`createPayoutOrder responseWalletDebit:: ${JSON.stringify(walletDebitResp)}`);

        createPayoutRequest.metadata = walletDebitResp?.tdsDetails;
        createPayoutRequest.amount = walletDebitResp.tdsDetails?.amountToBeCredit;

        let payoutOrderResp: any;

        try {
            // Place Order At Tenet
            payoutOrderResp = await PayoutClient.createPayoutOrder(restClient, createPayoutRequest, vendorId);

            logger.info(`[createPayoutOrder] payoutOrderResp:: ${JSON.stringify(payoutOrderResp)}`);
            EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_PAYOUT_INITIATED, {
                amount: createPayoutRequest.amount,
                withdrawalType: instantWithdrawalAllowed ? PAYOUT_TYPE.INSTANT : PAYOUT_TYPE.MANUAL,
            });
        } catch (error) {
            logger.error({error}, `[createPayoutOrder] Withdrawal Creation API Failed `)
            const reverseWithdrawalReq = {userId: userId, tdsTransactionId: transactionId};
            const reversePayoutResp = await SupernovaService.reverseWithdrawal(
                restClient, reverseWithdrawalReq, Number(vendorId)
            );
            throw PayoutClient.getErrorFromCode(error?.code);
        }
        const payoutConfig = PayoutUtil.getPayoutConfig(vendorId);
        const refreshInterval = payoutConfig.refresh_interval;
        const syncRequired = payoutConfig.sync_required;
        const requestedAmount = amount;
        const amountCredited = walletDebitResp.tdsDetails?.amountToBeCredit;
        return {...payoutOrderResp, requestedAmount, amountCredited, refreshInterval, syncRequired}
    }

    static async getPayoutTransactions(req: any, userId: string, payoutFilter: PayoutFilter, vendorId: string) {
        try {
            logger.info(`[getPayoutTransactions] userId - ${userId}, payoutFilter - ${JSON.stringify(payoutFilter)}`);
            const payoutTransactions = await PayoutClient.payoutHistory(req.internalRestClient, userId, payoutFilter, vendorId);
            logger.info(`[getPayoutTransactions] userId - ${userId}, payoutTransactions Response - ${JSON.stringify(payoutTransactions)}`);
            const processedTransactions: PayoutTransaction[] = PayoutUtil.processPayoutTransactionsResponse(payoutTransactions.data);
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

    static async getPayoutTransaction(restClient: any, userId: string, payoutFilter: PayoutFilter, vendorId: string) {
        try {
            logger.info(`[getPayoutTransactions] userId - ${userId}, payoutFilter - ${JSON.stringify(payoutFilter)}`);
            const payoutTransactions = await PayoutClient.payoutHistory(restClient, userId, payoutFilter, vendorId);
            logger.info(`[getPayoutTransactions] userId - ${userId}, payoutTransactions Response - ${JSON.stringify(payoutTransactions)}`);
            let addMsg = false;
            if (payoutFilter.transferId) {
                addMsg = true;
            }
            const processedTransaction: PayoutTransactionStatus | undefined = PayoutUtil.processPayoutTransactionResponse(payoutTransactions.data, vendorId);
            if (!processedTransaction) {
                throw PayoutServiceErrorUtil.getTransactionNotFound()
            }
            return processedTransaction;
        } catch (error) {
            logger.info({error}, 'Exception in getPayoutTransactions');
            throw error;
        }
    }


    static async getTodaysWithdrawalCountAndAmount(req: any, userId: string, vendorId: string) {
        const currentDate = new Date();
        const {startOfDay, endOfDay} = DatetimeUtil.getStartAndEndOfDayInUTC(currentDate);
        const status = [PAYOUT_STATUS.PENDING, PAYOUT_STATUS.SUCCESS, PAYOUT_STATUS.PENDING_APPROVAL];
        const payoutFilter: PayoutFilter = {from: startOfDay, to: endOfDay, status};
        const payoutTransactions = await PayoutService.getPayoutTransactions(req, userId, payoutFilter, vendorId);
        let payoutSum: number = 0;
        payoutTransactions.transactions.map((transaction => {
            payoutSum += transaction.amount;
        }))

        return {totalCount: payoutTransactions.totalCount, totalSum: payoutSum};

    }


    static async getBankDetails(restClient: any, userId: string, vendorId: string, documentNumber: string) {
        const payoutBankKYCDetails: PayoutDetails = await PayoutService.getPayoutDetails(restClient, userId, vendorId);

        logger.info(`[getBankAndIfscDetails] payoutBankKYCDetails - ${JSON.stringify(payoutBankKYCDetails)}`);
        if (!payoutBankKYCDetails.kycStatus) {
            throw PayoutServiceErrorUtil.getKycNeededForWithdrawal();
        }
        const bankDetail: BankDetails[] = payoutBankKYCDetails.bankDetails.filter(
            (bankDetail: any) => bankDetail.documentNumber == documentNumber
        );

        logger.info(`[createPayoutOrder] bankDetails after filtering ${bankDetail}`);
        if (!bankDetail || bankDetail && bankDetail.length <= 0) {
            throw PayoutServiceErrorUtil.getInvalidAccountOrIfsc();
        }

        return bankDetail[0]

    }

    static async getIfscState(restClient: any, vendorId: string, ifsc: string) {
        if (!ifsc) {
            throw PayoutServiceErrorUtil.getInvalidAccountOrIfsc();
        }
        let ifscDetails: any;
        try {
            ifscDetails = await GuardianService.getIfscDetails(ifsc, restClient, vendorId);
        } catch (error) {
            logger.error({error}, `[getBankAndIfscDetails] Failed to get IFSC Details `);
        }

        logger.info(`[getBankAndIfscDetails] getIfscDetails ${JSON.stringify(ifscDetails)}`);
        const ifscState: string = ifscDetails?.ifsc?.state || DEFAULT_PAYOUT_CONSTANT.DEFAULT_IFSC_STATE;

        return ifscState
    }

    static async processWebhook(restClient: any, userId: string, vendorId: string, eventName: string, eventData: any) {
        logger.info(`[PayoutService.processWebhook] eventName and eventData:: ${JSON.stringify(eventName)} ${JSON.stringify(eventData)}`);
        if (!userId) {
            throw PayoutServiceErrorUtil.getBodyValidationError('userId can not be empty')
        }
        const appType = "";
        switch (eventName) {
            case PAYOUT_HOOK_EVENT_NAME.TRANSFER_REVERSED:
            case PAYOUT_HOOK_EVENT_NAME.TRANSFER_FAILED:
                const resp = await PayoutService.reversePayout(restClient, userId, vendorId, eventData);
                EventPushService.push(Number(userId), Number(vendorId), appType, EventNames.USER_PAYOUT_FAILED, eventData);
                return {};
            case PAYOUT_HOOK_EVENT_NAME.TRANSFER_PENDING:
                // Do nothing
                return {}
            case PAYOUT_HOOK_EVENT_NAME.TRANSFER_SUCCESS:
                EventPushService.push(Number(userId), Number(vendorId), appType, EventNames.USER_PAYOUT_SUCCESS, eventData);
                return {};
            case PAYOUT_HOOK_EVENT_NAME.VIRTUAL_ACCOUNT_THRESHOLD_BREACHED:
            case PAYOUT_HOOK_EVENT_NAME.CIRCUIT_BREAKER:
                EventPushService.push(Number(userId), Number(vendorId), appType, EventNames.USER_PAYOUT_FAILED, eventData);
                return {};
            default:
                return false;
        }
    }

    static async reversePayout(restClient: any, userId: string, vendorId: string, eventData: any) {
        logger.info(`reversePayout userId - ${userId}, eventData ${JSON.stringify(eventData)}`)
        const transactionId = eventData?.transferId;
        if (!transactionId) {
            throw PayoutServiceErrorUtil.getBodyValidationError('transferId can not be empty');
        }
        const reverseWithdrawalReq = {userId: userId, tdsTransactionId: transactionId};
        const resp = await SupernovaService.reverseWithdrawal(
            restClient, reverseWithdrawalReq, Number(vendorId)
        );
        logger.info(`reversePayout resp - ${userId}, eventData ${JSON.stringify(resp)}`)

        return resp;
    }
}
