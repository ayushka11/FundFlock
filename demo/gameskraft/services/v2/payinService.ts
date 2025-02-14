import PayinClient from '../../clients/payinClient';
import { PAGINATION, PROMISE_STATUS } from '../../constants/constants';
import {
    GUARDIAN_DOCUMENT_STATUS,
    GUARDIAN_DOCUMENT_TYPE,
    GUARDIAN_SORT_DATA_CONFIG,
    USER_KYC_DATA
} from '../../constants/guardian-constants';
import { EMAIL_VERIFICATION_STATUS } from '../../constants/idm-constants';
import {
    currencyTypes,
    PAYIN_TRANSACTION_STATUS,
    paymentMethod,
    refundLabels,
    refundMethods,
    refundStatus,
    TRANSACTIONS_SORTING_METHOD
} from '../../constants/payin-constants';
import { ALL_TRANSACTION_TYPES, PROMO_TRANSACTION_TYPES } from '../../constants/supernova-constants';
import PayinServiceErrorUtil from '../../errors/payin/payin-error-util';
import { UserRefundDcsAmountRequest } from '../../models/aurora/request';
import { UserRefundDcsAmountsDetails, UserRevertRefundDcsAmountRequest } from '../../models/aurora/response';
import { UserKycDetails } from '../../models/guardian/user-kyc';
import { IDMUserProfile } from '../../models/idm/user-idm';
import { DeviceInfo, OrderMeta, PayinInitiateOrderV2, PayinInvoiceData, PaymentModeValidationRequest } from '../../models/payin/request';
import { PaymenSuccessResponse, UserRefundData, PaymentModeValidationResponse } from '../../models/payin/response';
import { TaxBreakup } from '../../models/payin/tax-breakup';
import { AddCashSummary, UserOrder, UserOrderDetailsV2, UserRefundResponse } from '../../models/payin/user-details';
import { DepositEvent } from '../../models/rocket-events/deposit-events';
import {
    DepositRequestV2,
    RefundOrderV2,
    RevertPayinRefundRequest,
    SupernovaRefundDetailsRequest
} from '../../models/supernova/request';
import { UserTransactionDetails, UserWalletBalanceV2 } from '../../models/supernova/response';
import UserKycFilter from '../../models/user-kyc-filter';
import EventNames from '../../producer/enums/eventNames';
import EventPushService from '../../producer/eventPushService';
import IdmUtil from '../../utils/idm-utils';
import LoggerUtil from '../../utils/logger';
import {
    checkPayinRefundStatus,
    checkPayinStatus,
    checkUserRefundEligibilty,
    createUserOrder,
    createUserOrderDetailsV2,
    extractInitiateOrderUserResponse,
    formulateUserRefundResponseV2,
    getDepositEventData,
    getPaymentResponse,
    getUserAddCashHistoryResponseV2,
    getWebhookDetailsFromOrder,
    invalidCardResponse,
    processUserTransactionsForRefundV2,
    validCardResponse,
    validateCardPaymentMode
} from '../../utils/payin-util';
import SupernovaUtil from '../../utils/supernova-util';
import GuardianService from '../guardianService';
import IDMService from '../idmService';
import PayinService from '../payinService';
import RoyaltyService from '../royaltyService';
import SupernovaService from '../supernovaService';
import SupernovaServiceV2 from './supernovaService';
import RoyaltyErrorCodes from "../../errors/royalty/royalty-error-codes";
import SupernovaErrorCodes from "../../errors/supernova/supernova-error-codes";
import { CASH_APP, PRACTICE_APP } from '../../constants/constants';
import PromosService from '../promosService';
import { promosEvent } from '../../constants/promos';
import { createPromoSuccessEvent } from '../../utils/promos-util';
import { validationMessage } from 'aws-sdk/clients/datapipeline';
import { CardBinDetails, CardDetails, PaymentMode } from '../../models/payin/payment-method';

const configService = require('../configService');

const redisService = require('../redisService');
const logger = LoggerUtil.get("PayinServiceV2");

export default class PayinServiceV2 {

    static async getCardDetails(validationReq: PaymentModeValidationRequest, payinCustomerId: string, vendorId: string, restClient: any): Promise<PaymentModeValidationResponse> {
        try {
            switch(validationReq.paymentMethod){
                case paymentMethod.Card:
                    const cardDetails: CardBinDetails = await PayinClient.getCardDetails(validationReq.cardBin,vendorId,restClient);
                    logger.info('got the details for the card ::',cardDetails);
                    const validationResponse = validateCardPaymentMode(cardDetails,vendorId);
                    logger.info('got the validation response as :: ',validationResponse);
                    return {...validationResponse,...cardDetails};
                default: 
                    return validCardResponse;
            }
            return validCardResponse;
        } catch (e) {
            logger.error("got error fetching details for the payment mode :: ",{validationReq,error: e});
            return invalidCardResponse;
        }
    }

    static async getUserTaxBreakup(userAddCashAmount: number[], gstStateCode: number, vendorId: string, restClient: any): Promise<TaxBreakup[] | undefined> {
        try {
            // check for gststate code from banned state if yes throw error
            logger.info('got the amounts as :: ', userAddCashAmount);
            logger.info("got the gst and vendor data as :: ", {gstStateCode, vendorId});
            const userTaxBreakup: {
                taxSplitForAmounts: TaxBreakup[]
            } | any = await PayinClient.getUserTaxBreakup(restClient, userAddCashAmount, gstStateCode, vendorId);
            logger.info("got the user tax breakup as :: ", userTaxBreakup);
            const taxBreakup: TaxBreakup[] = userTaxBreakup.taxSplitForAmounts;
            logger.info("got the tax breakup ::", taxBreakup);
            return taxBreakup;
        } catch (e) {
            throw (e);
        }
    }

    static async initiatePayment(userIdentifier: string, payinCustomerId: string, orderRequest: PayinInitiateOrderV2, promo: string, vendorId: string, stateCode: number, deviceInfo: DeviceInfo, restClient: any): Promise<any> {
        // get the location
        // check if the user from a non banned state
        // if yes get the details of the user from idm
        // fill the additional details and create the order
        // also take the vendor id for the same
        try {
            const userDetails: IDMUserProfile = await IDMService.getUserDetails(restClient, `${userIdentifier}`, `${vendorId}`);

            const isAddCashBan: boolean = IdmUtil.getAddCashBan(userDetails);
            if (isAddCashBan) {
                throw PayinServiceErrorUtil.getAddCashBan();
            }

            const documentType: number[] = [GUARDIAN_DOCUMENT_TYPE.PAN];
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
            logger.info(`[initiatePayment] userId - ${userIdentifier} userKYCFilter -${JSON.stringify(userKycFilter)}, vendorId-${vendorId}`);
            const kycDetails: UserKycDetails = await GuardianService.getUserKycDetails(
                userIdentifier, userKycFilter, restClient, vendorId, getDocumentDetails
            );
            const {userKycDocumentDetails} = kycDetails;
            const kycStatus = kycDetails.userKycStatus;
            const isKYCDone: boolean = (kycStatus.pan && kycStatus.pan === GUARDIAN_DOCUMENT_STATUS.VERIFIED);

            let userName: string = ''
            if (userKycDocumentDetails.length > 0) {
                // Filter Pan Document
                const userPanKycDoc = userKycDocumentDetails.filter(
                    (panDetail: any) => Number(panDetail.documentType) === Number(GUARDIAN_DOCUMENT_TYPE.PAN)
                )
                if (userPanKycDoc.length) {
                    const userPanDocuments: any = userPanKycDoc[0].documentDetails;
                    userPanDocuments.map((pan: any) => {
                            userName = pan.name;
                        }
                    )
                }
            }

            logger.info(`printing kyc data`, kycDetails);

            const email: string = userDetails?.emailStatus == EMAIL_VERIFICATION_STATUS.VERIFIED ? userDetails?.email : "";
            const mobile: string = userDetails?.mobile;
            const payinInvoiceData: PayinInvoiceData = {userIdentifier, stateCode, email, mobile, userName};
            orderRequest.invoiceData = payinInvoiceData;

            const requestId: string = restClient.getRequestId();
            logger.info(`inside [payinServiceV2] [initiatePayment] requestid ::  ${requestId}`);
            logger.info(`inside [payinServiceV2] [initiatePayment] tenetCustomerId from redis ::  ${payinCustomerId}`);
            const currencyId: number = currencyTypes.INR;
            const uiPaymentModeId: number = orderRequest.paymentModeId;
            const addCashSummary : AddCashSummary = await PayinService.getUserAddCashSummary(userIdentifier, restClient, payinCustomerId, vendorId);
            const addCashCount: number = addCashSummary?.addCashCount;
            const orderMeta: OrderMeta = {promo, userId: userIdentifier, uiPaymentModeId, deviceInfo,addCashCount};
            orderRequest.tenetCustomerId = payinCustomerId;
            orderRequest.requestId = requestId;
            orderRequest.currencyId = currencyId;
            orderRequest.orderMetaData = orderMeta;
            logger.info(`inside [payinService] [initiatePayment] orderRequest ::  ${JSON.stringify(orderRequest)}`);
            // call tenet for order
            const orderResponse: any = await PayinClient.initiatePaymentV2(orderRequest, vendorId, restClient);
            logger.info(`inside [payinServiceV2] [initiatePayment] orderResponse from payinClient ::  ${JSON.stringify(orderResponse)}`);
            const payinUserResponse: any = extractInitiateOrderUserResponse(orderResponse, payinCustomerId);
            logger.info(`inside [payinServiceV2] [initiatePayment] payinUserResponse ::  ${JSON.stringify(payinUserResponse)}`);
            return payinUserResponse;


        } catch (e) {
            throw (e);
        }

    }

    static async getUserOrderStatus(orderId: string, userId: string, payinCustomerId: string, vendorId: string, internalRestClient: any): Promise<any> {
        try {
            logger.info(`inside [payinServiceV2] [getUserOrderStatus] orderId`);
            const walletTransactionId: string = SupernovaUtil.getWalletTransactionId(orderId, ALL_TRANSACTION_TYPES.ADD_CASH);
            const userOrderResp: any = await (Promise as any).allSettled([
                PayinClient.getUserOrderStatus(orderId, internalRestClient, `${vendorId}`),
                PayinService.getUserAddCashSummary(userId, internalRestClient, payinCustomerId, vendorId),
                SupernovaService.getWalletTransaction({internalRestClient}, userId, walletTransactionId, "", Number(vendorId)),
                SupernovaService.getBalanceV2(internalRestClient, userId, "", Number(vendorId))

            ]);
            logger.info(userOrderResp, "userOrderResp :: ");
            const orderDetails: AddCashSummary = userOrderResp[0]?.status == PROMISE_STATUS.FULFILLED ? userOrderResp[0].value : {};
            const addCashSummaryResp: AddCashSummary = userOrderResp[1]?.status == PROMISE_STATUS.FULFILLED ? userOrderResp[1].value : {};
            const userTransactionDetails: UserTransactionDetails = userOrderResp[2]?.status == PROMISE_STATUS.FULFILLED ? userOrderResp[2].value : {};
            const userWalletBalance: UserWalletBalanceV2 = userOrderResp[3]?.status == PROMISE_STATUS.FULFILLED ? userOrderResp[3].value : {};
            const userorderDetails: UserOrderDetailsV2 = createUserOrderDetailsV2(orderDetails, addCashSummaryResp?.addCashCount, userTransactionDetails, userWalletBalance);
            logger.info(`inside [payinServiceV2] [getUserOrderStatus] userorderDetails ::  ${JSON.stringify(userorderDetails)}`);
            return userorderDetails;
        } catch (e) {
            throw (e);
        }
    }

    static async getUserOrderDetails(orderId: string, userId: string, payinCustomerId: string, vendorId: string, internalRestClient: any): Promise<any> {
        try {
            logger.info(`inside [payinServiceV2] [getUserOrderDetails] ${orderId}`);
            const walletTransactionId: string = SupernovaUtil.getWalletTransactionId(orderId, ALL_TRANSACTION_TYPES.ADD_CASH);
            const userOrderResp: any = await (Promise as any).allSettled([
                PayinClient.getUserOrderStatus(orderId, internalRestClient, vendorId),
                SupernovaService.getWalletTransaction({internalRestClient}, userId, walletTransactionId, "", Number(vendorId)),
                SupernovaService.getBalanceV2(internalRestClient, userId, "", Number(vendorId))
            ]);
            logger.info(userOrderResp, "userOrderResp :: ");
            const orderDetails: AddCashSummary = userOrderResp[0]?.status == PROMISE_STATUS.FULFILLED ? userOrderResp[0].value : {};
            const userTransactionDetails: any = userOrderResp[1]?.status == PROMISE_STATUS.FULFILLED ? userOrderResp[1].value : {};
            const userWalletBalance: UserWalletBalanceV2 = userOrderResp[3]?.status == PROMISE_STATUS.FULFILLED ? userOrderResp[3].value : {};
            const userorderDetails: UserOrder = createUserOrder(orderDetails, userTransactionDetails,userWalletBalance);
            
            logger.info(`inside [payinServiceV2] [getUserOrderStatus] userorderDetails ::  ${JSON.stringify(userorderDetails)}`);
            return userorderDetails;
        } catch (e) {
            throw (e);
        }
    }

    static async processTenetPaymentWebhookResponseV2(successResponse: any, vendorId: string, restClient: any) {
        try {
            logger.info(`inside [payinServiceV2] [processTenetPaymentWebhookResponseV2] successResponse ::  ${JSON.stringify(successResponse)}`);
            const paymentOrder: any = successResponse?.content?.order;
            const paymentRefund: any = successResponse?.content?.refund;
            logger.info(`inside [payinServiceV2] [processTenetPaymentWebhookResponseV2] paymentOrder ::  ${JSON.stringify(paymentOrder)}`);
            logger.info(`inside [payinServiceV2] [processTenetPaymentWebhookResponseV2] paymentRefund ::  ${JSON.stringify(paymentRefund)}`);
            if (paymentOrder) {
                const {isOrderSuccess, isOrderFailure} = checkPayinStatus(paymentOrder);
                logger.info(`inside [payinServiceV2] [processTenetPaymentWebhookResponseV2] isOrderSuccess ::  ${isOrderSuccess} isOrderFailure :: ${isOrderFailure}`);
                const {
                    userCreditAmount,
                    promo,
                    orderMeta,
                    userId,
                    taxableAmount,
                    gstAmount,
                    paymentMethod,
                    addCashCount
                } = getWebhookDetailsFromOrder(paymentOrder);

                if (!userId) {
                    logger.info(`inside [payinServiceV2] [processTenetPaymentWebhookResponseV2] userId empty`);
                    // send an error to monitoring
                    return;
                }
                const userDetails: IDMUserProfile = await IDMService.getUserDetails(restClient, userId, vendorId);
                if (isOrderFailure) {
                    logger.info(`inside [payinServiceV2] [processTenetPaymentWebhookResponseV2] sending failure notification to the userId :: ${userId} on the mobile ::  ${userDetails?.mobile}`);

                    const addCashSummaryResp: AddCashSummary = await PayinService.getUserAddCashSummary(userId, restClient, paymentOrder?.tenetCustomerId, vendorId)

                    const eventData: DepositEvent = getDepositEventData(paymentOrder, addCashSummaryResp, userDetails)

                    // send failure communication
                    EventPushService.push(userId, Number(vendorId), '', EventNames.USER_DEPOSIT_FAILURE, eventData);
                    return;
                }
                logger.info(`inside [payinServiceV2] [processTenetPaymentWebhookResponseV2] isOrderSuccess :: ${isOrderSuccess} firstSuccess :: ${paymentOrder?.firstSuccess}`)
                if (paymentOrder?.firstSuccess && isOrderSuccess) {

                    logger.info(`inside [payinServiceV2] [processTenetPaymentWebhookResponseV2] adding funds to the userId :: ${userId} with amount ${userCreditAmount} and promo ${promo}`);
                    try {
                        // await wallet call goes here
                        const creditRoyalty: any = await (Promise as any).allSettled([RoyaltyService.creditUserDcs(restClient, userId, userCreditAmount, vendorId, paymentOrder.orderId)])
                        if (creditRoyalty[0].status == PROMISE_STATUS.FULFILLED) {
                            const userDcsDetails: any = creditRoyalty[0].value;
                            logger.info(userDcsDetails, "got the dcs amount");
                            const depositRequest: DepositRequestV2 = {
                                userId,
                                depositAmount: Number(taxableAmount),
                                gstAmount,
                                tournamentDiscountCreditAmount: 0,// to be filled
                                discountCreditAmount: userDcsDetails?.dcsAmountCredited,
                                payinOrderId: paymentOrder.orderId,
                                requestId: restClient.getRequestId()
                            }
                            const supernovaRes: any = await (Promise as any).allSettled([SupernovaServiceV2.processUserDepositV2(depositRequest, restClient, vendorId)]);
                            if(supernovaRes[0].status == PROMISE_STATUS.FULFILLED){
                                if(promo){    
                                    const promoSuccessEvent = createPromoSuccessEvent(userCreditAmount,paymentOrder.orderId,promo,paymentMethod,`${addCashCount}`);
                                    await (Promise as any).allSettled([PromosService.publishSuccessEvent(userId,vendorId,promoSuccessEvent,promosEvent.ADDCASH,restClient)]);
                                }
                            }
                            if (supernovaRes[0].status == PROMISE_STATUS.REJECTED) {
                                logger.error(`inside [payinServiceV2] [processTenetPaymentWebhookResponseV2] error in supernova request`);
                                if(supernovaRes[0].reason?.code !== SupernovaErrorCodes.UserDepositAlreadySuccessfulOrFailed){
                                    throw supernovaRes[0].reason;
                                }
                            }
                            const addCashSummaryResp: AddCashSummary = await PayinService.getUserAddCashSummary(userId, restClient, paymentOrder?.tenetCustomerId, vendorId)
                            
                            const walletRes: any = supernovaRes[0].value;
                            logger.info(`inside [payinServiceV2] [processTenetPaymentWebhookResponseV2] walletRes :: ${JSON.stringify(walletRes)}`);
                            
                            const eventData: DepositEvent = getDepositEventData(paymentOrder, addCashSummaryResp, userDetails)
                            if (addCashSummaryResp?.addCashCount === 1) {
                                EventPushService.push(userId, Number(vendorId), CASH_APP, EventNames.USER_FIRST_DEPOSIT_SUCCESS, eventData);
                                EventPushService.push(userId, Number(vendorId), PRACTICE_APP, EventNames.USER_FIRST_DEPOSIT_SUCCESS, eventData);
                            }
                            if (userDetails?.mobile) {
                                logger.info(`inside [payinServiceV2] [processTenetPaymentWebhookResponseV2] sending success notification to the userId :: ${userId} on the mobile ::  ${userDetails?.mobile}`);
                                // send success notification
                                EventPushService.push(userId, Number(vendorId), '', EventNames.USER_DEPOSIT_SUCCESS, eventData);
                            }
                            // send additional promo details for monitoring
                        }
                        else {
                            logger.error(`inside [payinServiceV2] [processTenetPaymentWebhookResponseV2] error in credit royalty`);
                            if(creditRoyalty[0].reason?.code !== RoyaltyErrorCodes.DbDuplicateEntryError){
                                throw creditRoyalty[0].reason;
                            }
                        }
                    } catch (e) {
                        // add a failure event here
                        logger.error(`inside [payinServiceV2] [processTenetPaymentWebhookResponseV2] error in adding funds with wallet service`);
                        EventPushService.push(userId, Number(vendorId), '', EventNames.SERVICE_DEPOSIT_FAILURE, {
                            paymentOrder,
                            userDetails,
                            reason: e
                        });
                        // send to monitoring and push event
                        // wallet error goes here
                    }
                }
            }
            else if (paymentRefund) {
                const {isOrderSuccess, isOrderFailure} = checkPayinRefundStatus(paymentRefund);
                logger.info(`inside [payinService] [processTenetPaymentWebhookResponseV2] isOrderSuccess ::  ${isOrderSuccess} isOrderFailure :: ${isOrderFailure}`);
                if (isOrderFailure) {
                    try {
                        const order = paymentRefund;
                        const revertedOrder: RevertPayinRefundRequest = {
                            userId: Number(order.uniqueRef),
                            transactionId: order.orderDetails.orderId,
                            tdsTransactionId: order.udf2
                        };
                        const revertedDcsOrder: UserRevertRefundDcsAmountRequest = {
                            transactionId: order.orderDetails.orderId,
                            revertDcsAmount: order.udf3
                        }
                        const revertDcsResponse: UserRefundDcsAmountsDetails = await RoyaltyService.revertRefundDcs(Number(order.uniqueRef), Number(vendorId), revertedDcsOrder, restClient);
                        logger.info(revertDcsResponse, 'reverted dcs amounts');
                        revertedOrder.dcsAmount = revertDcsResponse.dcsRefundableAmount;
                        const walletResponse: any = await SupernovaServiceV2.revertUserRefund(revertedOrder, restClient, Number(vendorId));// send vendor id here
                        logger.info('wallet response for reverting dcs amount', walletResponse);
                    } catch (error) {
                        logger.error(`inside [payinService] [processTenetPaymentWebhookResponseV2] error in adding funds with wallet service`);
                        EventPushService.push(Number(paymentRefund.uniqueRef), Number(vendorId), '', EventNames.USER_REVERT_REFUND_FAILURE, {
                            paymentRefund,
                            reason: error
                        });
                    }
                }
                else if (isOrderSuccess) {
                    const {userCreditAmount, userId} = getWebhookDetailsFromOrder(paymentRefund);
                    EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_REFUND_COMPLETED, {
                        refundAmount: userCreditAmount,
                    });
                }
            }
        } catch (e) {
            throw (e);
        }
    }

    static async getUserAddCashHistory(req: any, payinCustomerId: string, page: number, limit: number, vendorId: string, sortBy: string = TRANSACTIONS_SORTING_METHOD.DESC): Promise<any> {
        try {
            logger.info(`inside [payinServiceV2] [getUserAddCashHistory] payinCustomerId ::  ${payinCustomerId}`);
            const userTransactionData: any = await PayinServiceV2.getUserTransactions(req.internalRestClient, payinCustomerId, page, limit, sortBy, vendorId);
            logger.info(`inside [payinServiceV2] [getUserAddCashHistory] userTransactionData ::  ${JSON.stringify(userTransactionData)}`);
            return {transactions: getUserAddCashHistoryResponseV2(userTransactionData ?? [])};
        } catch (e) {
            logger.error(e,`inside [payinServiceV2] [getUserAddCashHistory] received error from [getUserAddCashHistory] `);
            throw (e);
        }
    }

    static async getUserTransactions(restClient: any, payinCustomerId: string, page: number, limit: number, sortBy: string, vendorId: string, status?: string): Promise<any[]> {
        try {
            logger.info(`inside [payinServiceV2] [getUserTransactions] payinCustomerId ::  ${payinCustomerId} with status :: ${status}`);
            logger.info(`inside [payinServiceV2] [getUserTransactions] payinCustomerId ::  ${{payinCustomerId}}`);
            const userTransactionData: any = await PayinClient.getUserTransactionHistoryV2(restClient, payinCustomerId, limit, page, sortBy, vendorId, status);
            logger.info(`inside [payinServiceV2] [getUserTransactions] userTransactionData ::  ${JSON.stringify(userTransactionData)}`);
            return userTransactionData?.orders ?? [];
        } catch (e) {
            logger.error(e,`inside [payinServiceV2] [getPayinUserDetails] received error from [getPayinUserDetails] `);
            throw (e);
        }
    }

    static async paymentSuccessFromSDKV2(queryParams: any, postParams: any, redirectionFlow: boolean, restClient: any, vendorId: string, userId: string, payinCustomerId: string) {
        try {
            postParams = queryParams;
            // here the data comes in post params we take the data
            logger.info(`inside [payinServiceV2] [paymentSuccessFromSDKV2] queryParams :: ${JSON.stringify(queryParams)} postParams :: ${JSON.stringify(postParams)} with redirectionFlow :: ${redirectionFlow}`);
            const orderId = postParams?.order_id || postParams?.content?.order?.order_id;
            const requestId: string = restClient.getRequestId();
            logger.info(`inside [payinServiceV2] [paymentSuccessFromSDKV2] orderId ::  ${orderId} requestId :: ${requestId}`);
            const processPaymentRequest: any = {orderId, requestId};
            logger.info(`inside [payinServiceV2] [paymentSuccessFromSDKV2] processPaymentRequest ::  ${JSON.stringify(processPaymentRequest)}`);
            try {
                // call payinclient process payment
                const processPaymentResponse: any = await PayinClient.processPayment(processPaymentRequest, restClient, vendorId);
                logger.info(`inside [payinServiceV2] [paymentSuccessFromSDKV2] processPaymentResponse ::  ${JSON.stringify(processPaymentResponse)}`);
                try {
                    processPaymentResponse.firstSuccess = true;
                    await PayinServiceV2.processTenetPaymentWebhookResponseV2({content: {order: processPaymentResponse}}, vendorId, restClient);
                } catch (e) {
                    logger.info(e, "error from processTenetPaymentWebhook");
                }
                const payinSuccessData: any = await PayinServiceV2.getUserOrderStatus(orderId, userId, payinCustomerId, vendorId, restClient);
                const paymentSuccessResponse: PaymenSuccessResponse = getPaymentResponse(processPaymentResponse, queryParams);
                // send this to monitoring
                // log this
                logger.info(`inside [payinServiceV2] [paymentSuccessFromSDKV2] paymentSuccessResponse ::  ${JSON.stringify(paymentSuccessResponse)}`);
                // redirection flow is true for when the webhook is hit
                // log this
                if (redirectionFlow) {
                    return;
                }
                return {...paymentSuccessResponse, ...payinSuccessData};

            } catch (e) {
                throw (e);
            }
        } catch (e) {
            throw (e);
        }
    }

    static async getUserRefundDetails(userId: string, vendorId: string, restClient: any) {
        try {
            // basic kyc check 
            const userKycFilter: UserKycFilter = {userKycDataMethod: USER_KYC_DATA.LITE}
            const userDetails: [UserKycDetails, IDMUserProfile] = await Promise.all([
                GuardianService.getUserKycDetails(userId, userKycFilter, restClient, vendorId),
                IDMService.getUserDetails(restClient, userId, vendorId)
            ])
            // get user email status from idm
            const refundEligibleUser: boolean = true//checkUserRefundEligibilty(userDetails[0], userDetails[1]);// add idm's variable here
            if (!refundEligibleUser) {
                // if the user is not eligible then throw error here
                throw (PayinClient.getErrorFromCode(PayinClient.PAYIN_CUSTOM_ERROR_CODES.USER_NOT_ELIGIBLE_FOR_REFUND));
            }
            const userIdmProfile: IDMUserProfile = userDetails[1];
            // additional vairables needed
            const payinCustomerId: string = userIdmProfile?.customAttributes?.payinTenetCustomerId;
            logger.info(`inside [payinServiceV2] [getUserRefundDetails] userId ::  ${userId} payinCustomerId :: ${payinCustomerId}`);

            // get wallet acs from suoernova change this api
            const getAcsDetails: boolean = true;
            const userWalletBalance: UserWalletBalanceV2 = await SupernovaService.getBalanceV2(restClient, userId, '', Number(vendorId), getAcsDetails);// send vendor id here
            logger.info(`inside [payinServiceV2] [getUserRefundDetails] userWalletBalance ::  ${JSON.stringify(userWalletBalance)}`);
            const userDepositBalance: number = userWalletBalance.addCashBalance ?? 0;
            logger.info(`inside [payinServiceV2] [getUserRefundDetails] userDepositBalance ::  ${userDepositBalance}`);
            let transactionPageSize: number = PAGINATION.MAX_NUM_OF_RECORDS,
                transactionPageNumber: number = 1;
            const userTransactions: any[] = await PayinServiceV2.getUserTransactions(restClient, payinCustomerId, transactionPageNumber, transactionPageSize, TRANSACTIONS_SORTING_METHOD.DESC, vendorId, PAYIN_TRANSACTION_STATUS.SUCCESS);
            // get refund details api ka kya use hai yha
            const {userRefundOrderDetails, userRefundDcsDetails}: {
                userRefundOrderDetails: RefundOrderV2[],
                userRefundDcsDetails: UserRefundDcsAmountRequest[]
            } = processUserTransactionsForRefundV2(userTransactions, userDepositBalance);
            logger.info(`inside [payinServiceV2] [getUserRefundDetails]got userRefundOrderDetails :: ${JSON.stringify(userRefundOrderDetails)}`);
            const userRefundOrderRequest = {refunds: userRefundOrderDetails}
            let userRefundTdsDetails: UserRefundData[] = [];
            let userRefunDcsOrderDetails: UserRefundDcsAmountsDetails[] = [];
            if (userRefundOrderRequest.refunds.length) {
                userRefundTdsDetails = await SupernovaServiceV2.getUserRefundTdsDetails(userId, userRefundOrderRequest, vendorId, restClient);
                userRefunDcsOrderDetails = await RoyaltyService.getRefundDcsDetails(Number(userId), userRefundDcsDetails, Number(vendorId), restClient);
            }// send vendorid here
            logger.info(`inside [payinServiceV2] [getUserRefundDetails]got userRefundTdsDetails :: ${JSON.stringify(userRefundTdsDetails)}`);
            return formulateUserRefundResponseV2(userDepositBalance, userRefundTdsDetails, userRefunDcsOrderDetails, userTransactions);
        } catch (e) {
            logger.error(e,`inside [payinServiceV2] [getUserRefundDetails] received error from [getUserRefundDetails] `);
            throw (e);
        }
    }

    static async CreateUserRefund(userId: string, vendorId: string, userRefunds: SupernovaRefundDetailsRequest[], deviceInfo: any, restClient: any): Promise<any> {
        try {
            const userKycFilter: UserKycFilter = {userKycDataMethod: USER_KYC_DATA.LITE}
            const userDetails: [UserKycDetails, IDMUserProfile] = await Promise.all([
                GuardianService.getUserKycDetails(userId, userKycFilter, restClient, vendorId),
                IDMService.getUserDetails(restClient, userId, vendorId)
            ])
            // get user email status from idm
            const refundEligibleUser: boolean = true//checkUserRefundEligibilty(userDetails[0], userDetails[1]);// add idm's variable here
            if (!refundEligibleUser) {
                // if the user is not eligible then throw error here
                throw (PayinClient.getErrorFromCode(PayinClient.PAYIN_CUSTOM_ERROR_CODES.USER_NOT_ELIGIBLE_FOR_REFUND));
            }
            logger.info(`inside [payinService] [CreateUserRefund] userId ::  ${userId} userRefunds:: ${JSON.stringify(userRefunds)}`);

            let refunds: any[] = [], orders: any[] = [], refundedAmount: number = 0;
            for (let index = 0; index < userRefunds.length; index++) {
                const refund = userRefunds[index];
                logger.info({refund, index}, 'got refunds to process here')
                const userRefund = refund;
                userRefund.userId = Number(userId);
                try {
                    logger.info(`calling supernova refundCash here`)
                    const dcsDeductionRequest: UserRefundDcsAmountRequest[] = [{
                        transactionId: refund.transactionId,
                        amount: userRefund.depositedAmount,
                        gstDeductedAmount: userRefund.amountAfterGst,
                        refundAmountRequested: userRefund.refundAmount
                    }]
                    const deductDcsResponse: UserRefundDcsAmountsDetails[] = await RoyaltyService.debitUserDcsOnRefund(dcsDeductionRequest, Number(userId), Number(vendorId), restClient);
                    userRefund.revertDcsAmount = deductDcsResponse.length ? deductDcsResponse[0].dcsRefundableAmount : 0;
                    logger.info('calling supernova for refund', userRefund);
                    const refundResponse: any = await SupernovaServiceV2.refundCash(userRefund, restClient, Number(vendorId));// add vendor id here
                    refunds.push({
                        orderId: refund.transactionId,
                        amount: userRefund.amountAfterGst,
                        netRefundAmount: userRefund.payinRefundAmount,
                        refundOnPsp: true,
                        manualApproval: configService.getRefundApprovalMethodForVendor()[vendorId] == refundMethods.MANUAL,
                        udf1: refundResponse?.tdsDetails?.tdsApplicable ?? 0,
                        udf2: refund.tdsTransactionId,
                        udf3: userRefund.revertDcsAmount
                    })
                    logger.info(refunds, 'updated refunds <array>')
                    refundedAmount += (refunds[refunds.length - 1]?.payinRefundAmount);
                    logger.info(refundedAmount, 'refundedAmount updated')
                    orders.push(userRefund);
                } catch (e) {
                    logger.error(e,`inside [payinService] [initiateUserRefund] received error from [initiateUserRefund]error from supernovaService `);
                    EventPushService.push(Number(userId), Number(vendorId), deviceInfo, EventNames.USER_REFUND_FAILURE, {
                        userRefund,
                        reason: e
                    });
                }
                logger.info(index, 'current index')
                if (index % 10 == 0 && refunds.length) {
                    logger.info('calling payin refunds api')
                    try {
                        await PayinClient.initiateUserRefund(refunds, restClient, vendorId);
                        refunds.forEach((refund) => {
                            EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_REFUND_INITIATED, {
                                refundAmount: refund.netRefundAmount,
                                refundRequestId: refund.orderId
                            });
                        });
                    } catch (e) {
                        logger.error(e,`inside [payinService] [initiateUserRefund] received error from [initiateUserRefund]error from supernovaService `);
                        logger.error(`inside [payinService] [initiateUserRefund] reverting refunds for the order ${JSON.stringify(refunds)}`);
                        EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_REFUND_FAILURE, {
                            refunds,
                            reason: e
                        });
                        for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) {

                            const order = orders[orderIndex];
                            const revertedOrder: RevertPayinRefundRequest = {
                                userId: Number(userId),
                                transactionId: order.transactionId,
                                tdsTransactionId: order.tdsTransactionId
                            };
                            const revertedDcsOrder: UserRevertRefundDcsAmountRequest = {
                                transactionId: order.transactionId,
                                revertDcsAmount: order.revertDcsAmount
                            }
                            try {
                                const revertDcsResponse: UserRefundDcsAmountsDetails = await RoyaltyService.revertRefundDcs(Number(userId), Number(vendorId), revertedDcsOrder, restClient);
                                revertedOrder.dcsAmount = revertDcsResponse.dcsRefundableAmount
                                await SupernovaServiceV2.revertUserRefund(revertedOrder, restClient, Number(vendorId));// send vendorid here
                            } catch (e) {
                                logger.error(e,`inside [payinService] [initiateUserRefund] recieved error while revert refund of failed refund on payinclient `);
                                EventPushService.push(Number(userId), Number(vendorId), deviceInfo, EventNames.USER_REVERT_REFUND_FAILURE, {
                                    order,
                                    reason: e
                                });
                            }
                        }
                    }
                    refunds = [];
                    orders = [];
                }
                logger.info(refunds, '<<refunds array>>')
            }
            logger.info(refundedAmount, 'final refunded amount')
            if (refunds.length) {
                logger.info(refunds, 'refunds left')
                try {
                    logger.info('calling payin client for left over refunds <<<array>>>')
                    await PayinClient.initiateUserRefund(refunds, restClient, vendorId);
                    refunds.forEach((refund) => {
                        EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_REFUND_INITIATED, {
                            refundAmount: refund.netRefundAmount,
                            refundRequestId: refund.orderId,
                        });
                    });
                } catch (e) {
                    logger.error(e,`inside [payinService] [initiateUserRefund] received error from [initiateUserRefund]error from supernovaService `);
                    logger.error(`inside [payinService] [initiateUserRefund] reverting refunds for the order ${JSON.stringify(refunds)}`);
                    EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_REFUND_FAILURE, {
                        orders,
                        error: e
                    });
                    for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) {
                        const order = orders[orderIndex];
                        const revertedOrder: RevertPayinRefundRequest = {
                            userId: Number(userId),
                            transactionId: order.transactionId,
                            tdsTransactionId: order.tdsTransactionId
                        };
                        const revertedDcsOrder: UserRevertRefundDcsAmountRequest = {
                            transactionId: order.transactionId,
                            revertDcsAmount: order.revertDcsAmount
                        }
                        try {
                            const revertDcsResponse: UserRefundDcsAmountsDetails = await RoyaltyService.revertRefundDcs(Number(userId), Number(vendorId), revertedDcsOrder, restClient);
                            revertedOrder.dcsAmount = revertDcsResponse.dcsRefundableAmount
                            await SupernovaServiceV2.revertUserRefund(revertedOrder, restClient, Number(vendorId));// send vendor id here
                        } catch (e) {
                            logger.error(e,`inside [payinService] [initiateUserRefund] recieved error while revert refund of failed refund on payinclient `);
                            EventPushService.push(Number(userId), Number(vendorId), deviceInfo, EventNames.USER_REVERT_REFUND_FAILURE, {
                                order,
                                reason: e
                            });
                        }
                    }
                }
            }
            const userRefundResponse: UserRefundResponse = {
                refundedAmount,
                refundLabel: refundLabels.INITIATED,
                refundMessage: configService.getUserRefundMessageForVendor()[vendorId],
                status: refundStatus.INITIATED

            }
            logger.info('sending response');
            return userRefundResponse;

        } catch (e) {
            logger.error(e,`inside [payinService] [initiateUserRefund] received error from [initiateUserRefund] `);
            throw (e);
        }

    }
};