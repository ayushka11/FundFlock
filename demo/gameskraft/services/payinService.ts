import PayinClient from '../clients/payinClient';
import {PAGINATION} from '../constants/constants';
import {
    currencyTypes,
    PAYIN_TRANSACTION_STATUS,
    refundLabels,
    refundMethods,
    refundStatus,
    TRANSACTIONS_SORTING_METHOD
} from '../constants/payin-constants';
import {promosEvent} from '../constants/promos';
import {PayinPaymentMethod, PaymentMethodsList} from '../models/payin/payment-method';
import {DeletePaymentMethodRequest, DeviceInfo, OrderMeta, PayinInitiateOrder} from '../models/payin/request';
import {PaymenSuccessResponse, UserRefundData} from '../models/payin/response';
import {
    AddCashSummary,
    PayinUserDetailsRequest,
    TenetCustomerDetails,
    UserOrderDetails,
    UserRefundResponse
} from '../models/payin/user-details';
import {promosData} from '../models/promos/promos';
import {UserWalletBalance} from '../models/supernova/response';
import EventPushService from '../producer/eventPushService';
import LoggerUtil from '../utils/logger';
import {
    checkPayinRefundStatus,
    checkPayinStatus,
    checkUserRefundEligibilty,
    createUserOrderDetails,
    extractInitiateOrderUserResponse,
    extractPayinPaymentMethods,
    formulateUserRefundResponse,
    getDepositEventData,
    getPaymentResponse,
    getUserAddCashHistoryResponse,
    getUserRefundHistoryResponse,
    getWebhookDetailsFromOrder,
    processUserTransactionsForRefund
} from '../utils/payin-util';
import IDMService from './idmService';
import PromosService from './promosService';
import SupernovaService from './supernovaService';
import EventNames from '../producer/enums/eventNames';
import {IDMUserProfile} from "../models/idm/user-idm";
import IdmUtil from "../utils/idm-utils";
import PayinServiceErrorUtil from "../errors/payin/payin-error-util";
import GuardianService from "./guardianService";
import UserKycFilter from "../models/user-kyc-filter";
import {USER_KYC_DATA} from "../constants/guardian-constants";
import {UserKycDetails} from "../models/guardian/user-kyc";
import {DepositEvent} from "../models/rocket-events/deposit-events";
import PayinServiceV2 from './v2/payinService';

const configService = require('../services/configService');

const redisService = require('../services/redisService');
const logger = LoggerUtil.get("PayinService");

export default class PayinService {


    static async getUserOrderStatus(orderId: string, userId: string, payinCustomerId: string, restClient: any, vendorId: string): Promise<any> {
        try {
            logger.info(`inside [payinService] [getUserOrderStatus] orderId vendorid`, vendorId);
            const orderDetails: any = await PayinClient.getUserOrderStatus(orderId, restClient, vendorId);
            logger.info(`inside [payinService] [getUserOrderStatus] orderDetails ::  ${JSON.stringify(orderDetails)}`);

            const addCashSummaryResp: AddCashSummary = await PayinService.getUserAddCashSummary(userId, restClient, payinCustomerId, vendorId)

            const userorderDetails: UserOrderDetails = createUserOrderDetails(orderDetails, addCashSummaryResp?.addCashCount);
            logger.info(`inside [payinService] [getUserOrderStatus] userorderDetails ::  ${JSON.stringify(userorderDetails)}`);
            return userorderDetails;
        } catch (e) {
            logger.error(e,`inside [payinService] [getUserOrderStatus] received error from [getUserOrderStatus] `);
            throw (e);
        }
    }

    static async getPayinUserDetails(userId: string, restClient: any, vendorId: string): Promise<any> {
        try {
            logger.info(`inside [payinService] [getPayinUserDetails] tenetCustomerId ::  ${userId}`);
            const payinDetails: TenetCustomerDetails = await PayinClient.getUserPayinDetails(userId, restClient, vendorId);
            logger.info(`inside [payinService] [getPayinUserDetails] payinDetails ::  ${{payinDetails}}`);
            return payinDetails;
        } catch (e) {
            logger.error(e,`inside [payinService] [getPayinUserDetails] received error from [getPayinUserDetails] `);
            throw (e);
        }
    }

    static async createPayinUserDetails(payinUserDetails: PayinUserDetailsRequest, restClient: any, vendorId: string): Promise<TenetCustomerDetails> {
        try {
            // when idm calls it we just give the details to idm and idm further saves it in redis and its db
            // this is just an instrument so no business logic here
            logger.info({payinUserDetails, vendorId}, `inside [payinService] [createPayinUserDetails] payinDetails`);
            const merchantId: string = await configService.getPayInMerchantIdForVendor()[vendorId];
            logger.info(`inside [payinService] [createPayinUserDetails] merchantid:: ${merchantId}`);
            // add client auth token to be true or false flag from zk
            const payinDetails: TenetCustomerDetails = await PayinClient.createNewPayinUser(merchantId, payinUserDetails, restClient, vendorId);
            logger.info(`inside [payinService] [createPayinUserDetails]success created new payin user:: ${{payinDetails}}`);
            return payinDetails;
        } catch (e) {
            logger.error(e,`inside [payinService] [createPayinUserDetails] received error from [createPayinUserDetails] `);
            throw (e);
        }
    }

    static async getUserPreferredPaymentMethods(payinCustomerId: string, restClient: any, vendorId: string): Promise<any> {
        try {
            const pspIds: number[] = configService.getPspIdConfigForVendor()[vendorId].pspIds;
            logger.info(`inside [payinService] [getUserPreferredPaymentMethods] payinCustomerId ::  ${payinCustomerId} for pspIds :: ${JSON.stringify({pspIds})}`);
            const userPayinMethods: any = await PayinClient.getAllUserPayinMethods(payinCustomerId, pspIds, restClient, vendorId)
            logger.info(`inside [payinService] [getUserPreferredPaymentMethods] userPaymentMethods ::  ${JSON.stringify(userPayinMethods || {})}`);
            return userPayinMethods;
        } catch (e) {
            logger.error(e,`inside [payinService] [getUserPreferredPaymentMethods] received error from [getPayinUserDetails] `);
            throw (e);
        }
    }

    static async getUserPaymentMethods(userId: number, payinCustomerId: string, platform: string, restClient: any, vendorId: string): Promise<any> {
        // get the list of all the available payment options
        // get the list of all the preferred payment methods of user
        // get the doiwntimes for each type of payment methods
        // add relevant messages for the same
        try {
            const pspIds: number[] = configService.getPspIdConfigForVendor()[vendorId].pspIds;
            logger.info(`inside [payinService] [getUserPaymentMethods] payinCustomerId ::  ${payinCustomerId} for pspIds :: ${JSON.stringify({pspIds})} platform :: ${platform}`);
            const userPayinMethods: any = await Promise.all([
                PayinClient.getAllAvailableUserPayinMethods(restClient, vendorId),
                PayinClient.getAllUserPayinMethods(payinCustomerId, pspIds, restClient, vendorId),
                PayinClient.getPayinMethodsDowntime(restClient, vendorId)
            ]);
            logger.info(`inside [payinService] [getUserPaymentMethods] got response for payin methods ${JSON.stringify(userPayinMethods)}`);
            const allAvailablePayinMethods: PayinPaymentMethod[] = userPayinMethods[0].list;
            logger.info(`inside [payinService] [getUserPaymentMethods] allAvailablePayinMethods ::  ${JSON.stringify(allAvailablePayinMethods)}`);
            const userPreferredPayinMethods: any = userPayinMethods[1];
            logger.info(`inside [payinService] [getUserPaymentMethods] userPreferredPayinMethods ::  ${JSON.stringify(userPreferredPayinMethods)}`);
            const payinMethodsDowntime: any[] = userPayinMethods[2].paymentModes;
            logger.info(`inside [payinService] [getUserPaymentMethods] payinMethodsDowntime ::  ${JSON.stringify(payinMethodsDowntime)}`);
            const userPaymentMethods: PaymentMethodsList = extractPayinPaymentMethods(allAvailablePayinMethods, userPreferredPayinMethods, payinMethodsDowntime, platform, vendorId);
            logger.info(`inside [payinService] [getUserPaymentMethods] userPaymentMethods ::  ${JSON.stringify(userPaymentMethods)}`);
            return userPaymentMethods;
        } catch (e) {
            logger.error(e,`inside [payinService] [getUserPaymentMethods] received error from [getUserPaymentMethods] `);
            throw (e);
        }
    }


    static async initiatePayment(userId: string, payinCustomerId: string, orderRequest: PayinInitiateOrder, promo: string, deviceInfo: DeviceInfo, restClient: any, vendorId: string): Promise<any> {
        try {
            // Check for Add Cash Ban
            const userDetails: IDMUserProfile = await IDMService.getUserDetails(restClient, userId.toString(), vendorId);
            const isAddCashBan: boolean = IdmUtil.getAddCashBan(userDetails);
            if (isAddCashBan) {
                throw PayinServiceErrorUtil.getAddCashBan();
            }

            logger.info(`inside [payinService] [getUserPaymentMethods] initiatePayment  for userId::  ${userId} for ${JSON.stringify(orderRequest)} with promo :: ${promo}`);
            const requestId: string = restClient.getRequestId();
            logger.info(`inside [payinService] [initiatePayment] requestid ::  ${requestId}`);
            logger.info(`inside [payinService] [initiatePayment] tenetCustomerId from redis ::  ${payinCustomerId}`);
            const currencyId: number = currencyTypes.INR;
            const uiPaymentModeId: number = orderRequest.paymentModeId;
            const orderMeta: OrderMeta = {promo, userId, uiPaymentModeId, deviceInfo};
            orderRequest.tenetCustomerId = payinCustomerId;
            orderRequest.requestId = requestId;
            orderRequest.currencyId = currencyId;
            orderRequest.orderMetaData = orderMeta;
            logger.info(`inside [payinService] [initiatePayment] orderRequest ::  ${JSON.stringify(orderRequest)}`);
            // call tenet for order
            const orderResponse: any = await PayinClient.initiatePayment(orderRequest, restClient, vendorId);
            logger.info(`inside [payinService] [initiatePayment] orderResponse from payinClient ::  ${JSON.stringify(orderResponse)}`);
            const payinUserResponse: any = extractInitiateOrderUserResponse(orderResponse, payinCustomerId);
            logger.info(`inside [payinService] [initiatePayment] payinUserResponse ::  ${JSON.stringify(payinUserResponse)}`);
            return payinUserResponse;
        } catch (e) {
            logger.error(e,`inside [payinService] [initiatePayment] received error from [initiatePayment]`);
            throw (e);
        }
    }

    // only for p52
    static async processTenetPaymentWebhookResponse(successResponse: any, vendorId: string, restClient: any) {
        // recieve the success webhook from sdk
        // extract the request body --> body
        // check if body.content.order
        // check if its success or not
        //const success = (order.status == 'SUCCESS');
        // const failure = (order.status == 'AUTHENTICATION_FAILED' || order.status == 'AUTHORIZATION_FAILED' || order.status == 'FAILED' || order.status == 'ABANDONED');
        // get the amount to be added into the walet in paise user currency util to do the same
        // get the orderId and firstSuccess from order object
        try {
            logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] successResponse ::  ${JSON.stringify(successResponse)}`);
            const paymentOrder: any = successResponse?.content?.order;
            const paymentRefund: any = successResponse?.content?.refund;
            logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] paymentOrder ::  ${JSON.stringify(paymentOrder)}`);
            logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] paymentRefund ::  ${JSON.stringify(paymentRefund)}`);
            if (paymentOrder) {
                const {isOrderSuccess, isOrderFailure} = checkPayinStatus(paymentOrder);
                logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] isOrderSuccess ::  ${isOrderSuccess} isOrderFailure :: ${isOrderFailure}`);
                const {userCreditAmount, promo, orderMeta, userId} = getWebhookDetailsFromOrder(paymentOrder);

                if (!userId) {
                    logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] userId empty`);
                    // send an error to monitoring
                    return;
                }

                const userDetails: any = await IDMService.getUserDetails(restClient, userId, vendorId);
                logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] userDetails :: ${JSON.stringify(userDetails)}`);
                if (isOrderFailure) {
                    logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] sending failure notification to the userId :: ${userId} on the mobile ::  ${userDetails?.mobile}`);

                    const addCashSummaryResp: AddCashSummary = await PayinService.getUserAddCashSummary(userId, restClient, paymentOrder?.tenetCustomerId, vendorId)

                    const eventData: DepositEvent = getDepositEventData(paymentOrder, addCashSummaryResp, userDetails)

                    logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] addCashSummary :: ${JSON.stringify(addCashSummaryResp)} eventData ::  ${JSON.stringify(eventData)}`);

                    // send failure communication
                    EventPushService.push(userId, Number(vendorId), '', EventNames.USER_DEPOSIT_FAILURE, eventData);
                    return;
                }
                logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] isOrderSuccess :: ${isOrderSuccess} firstSuccess :: ${paymentOrder?.firstSuccess}`)
                if (paymentOrder?.firstSuccess && isOrderSuccess) {

                    logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] adding funds to the userId :: ${userId} with amount ${userCreditAmount} and promo ${promo}`);
                    try {
                        logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] calling wallet service to add funds with promo details`);
                        // await wallet call goes here
                        const walletRes: any = await SupernovaService.processUserDeposit(userId, Number(userCreditAmount), paymentOrder.orderId, promo, restClient, Number(vendorId));// send vendor id here
                        logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] walletRes :: ${JSON.stringify(walletRes)}`);
                        // call promos service to publish the event here
                        logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] calling promos service to track user promo details`);
                        const promosData: promosData = {
                            amount: Number(userCreditAmount),
                            referenceId: paymentOrder.orderId
                        }
                        const promoRes: any = await PromosService.publishSuccessEvent(userId, vendorId, promosData, promosEvent.ADDCASH, restClient);

                        const addCashSummaryResp: AddCashSummary = await PayinService.getUserAddCashSummary(userId, restClient, paymentOrder?.tenetCustomerId, vendorId)

                        const eventData: DepositEvent = getDepositEventData(paymentOrder, addCashSummaryResp, userDetails)

                        logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] addCashSummary :: ${JSON.stringify(addCashSummaryResp)} eventData ::  ${JSON.stringify(eventData)}`);

                        if (addCashSummaryResp?.addCashCount === 1) {

                            EventPushService.push(userId, Number(vendorId), '', EventNames.USER_FIRST_DEPOSIT_SUCCESS, eventData);

                        }

                        if (userDetails?.mobile) {
                            logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] sending success notification to the userId :: ${userId} on the mobile ::  ${userDetails?.mobile}`);
                            // send success notification
                            EventPushService.push(userId, Number(vendorId), '', EventNames.USER_DEPOSIT_SUCCESS, eventData);
                        }
                        logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] promoRes :: ${JSON.stringify(promoRes)}`);
                        // send additional promo details for monitoring
                    } catch (e) {
                        logger.error(`inside [payinService] [processTenetPaymentWebhookResponse] error in adding funds with wallet service`);
                        // send to monitoring and push event
                        // wallet error goes here
                    }
                }
            }
            else if (paymentRefund) {
                const {isOrderSuccess, isOrderFailure} = checkPayinRefundStatus(paymentRefund);
                logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] isOrderSuccess ::  ${isOrderSuccess} isOrderFailure :: ${isOrderFailure}`);
                if (isOrderFailure) {
                    try {
                        const walletRes: any = await PayinService.reverseUserRefund(successResponse, restClient, vendorId);
                        logger.info(`inside [payinService] [processTenetPaymentWebhookResponse] walletRes :: ${JSON.stringify(walletRes)}`);
                    } catch (error) {
                        logger.error(`inside [payinService] [processTenetPaymentWebhookResponse] error in adding funds with wallet service`);
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
            logger.error(e,`inside [payinService] [processTenetPaymentWebhookResponse] received error from [processTenetPaymentWebhookResponse] `);
            throw (e);
        }
    }

    // remove webhook flow from here
    // in  updateOrder Sattus api postparams comes in queryparams --> if source is juspay
    // for update status also send the isWebHookCall param | also send this in process payment
    // redirection flow ke liye next krte ho and update status pe sidha jo api response aaega use return krr denge
    static async paymentSuccessFromSDK(queryParams: any, postParams: any, redirectionFlow: boolean, restClient: any, vendorId: string) {
        try {
            postParams = queryParams;
            // here the data comes in post params we take the data
            logger.info(`inside [payinService] [paymentSuccessFromSDK] queryParams :: ${JSON.stringify(queryParams)} postParams :: ${JSON.stringify(postParams)} with redirectionFlow :: ${redirectionFlow}`);
            const orderId = postParams?.order_id || postParams?.content?.order?.order_id;
            const requestId: string = restClient.getRequestId();
            logger.info(`inside [payinService] [paymentSuccessFromSDK] orderId ::  ${orderId} requestId :: ${requestId}`);
            const processPaymentRequest: any = {orderId, requestId};
            logger.info(`inside [payinService] [paymentSuccessFromSDK] processPaymentRequest ::  ${JSON.stringify(processPaymentRequest)}`);
            try {
                // call payinclient process payment
                const processPaymentResponse: any = await PayinClient.processPayment(processPaymentRequest, restClient, vendorId);
                logger.info(`inside [payinService] [paymentSuccessFromSDK] processPaymentResponse ::  ${JSON.stringify(processPaymentResponse)}`);
                try {
                    processPaymentResponse.firstSuccess = true;
                    await PayinService.processTenetPaymentWebhookResponse({content: {order: processPaymentResponse}}, vendorId, restClient);
                } catch (e) {
                    logger.info(e, "error from processTenetPaymentWebhook");
                }
                const paymentSuccessResponse: PaymenSuccessResponse = getPaymentResponse(processPaymentResponse, queryParams);
                // send this to monitoring
                // log this
                logger.info(`inside [payinService] [paymentSuccessFromSDK] paymentSuccessResponse ::  ${JSON.stringify(paymentSuccessResponse)}`);
                // redirection flow is true for when the webhook is hit
                // log this
                logger.info(`inside [payinService] [paymentSuccessFromSDK] redirectionFlow ::  ${redirectionFlow}`);
                if (redirectionFlow) {
                    return;
                }
                return paymentSuccessResponse;

            } catch (e) {
                logger.error(e,`inside [payinService] [paymentSuccessFromSDK] received error from [paymentSuccessFromSDK] `);
                throw (e);
            }
        } catch (e) {
            logger.error(e,`inside [payinService] [paymentSuccessFromSDK] received error from [paymentSuccessFromSDK] `);
            throw (e);
        }
    }

    static async updatePaymentOrderStatus(queryParams: any, postParams: any, restClient: any, vendorId: string) {
        try {
            logger.info(`inside [payinService] [updatePaymentOrderStatus] queryParams :: ${JSON.stringify(queryParams)} postParams :: ${JSON.stringify(postParams)}`);
            postParams = queryParams;
            logger.info(`inside [payinService] [updatePaymentOrderStatus] postParams ::  ${JSON.stringify(postParams)}`);
            const orderId = queryParams?.order_id || queryParams?.content?.order?.order_id;
            const requestId: string = restClient.getRequestId();
            logger.info(`inside [payinService] [updatePaymentOrderStatus] orderId ::  ${orderId} requestId :: ${requestId}`);
            // log everything
            const updatePaymentStatusRequest: any = {queryParams, postParams}
            logger.info(`inside [payinService] [updatePaymentOrderStatus] updatePaymentStatusRequest ::  ${JSON.stringify(updatePaymentStatusRequest)}`);
            try {
                // call payinclient t process payment
                const updatePaymentStatusResponse: any = await PayinClient.updatePaymentStatus(updatePaymentStatusRequest, restClient, vendorId);
                logger.info(`inside [payinService] [updatePaymentOrderStatus] updatePaymentStatusResponse ::  ${JSON.stringify(updatePaymentStatusResponse)}`);
                // push this event
                // log process payment response
                const paymentSuccessResponse: any = {};
                paymentSuccessResponse.paymentStatus = (updatePaymentStatusResponse.status == 'SUCCESS');
                paymentSuccessResponse.gatewayJusPay = queryParams?.source;
                paymentSuccessResponse.orderId = updatePaymentStatusResponse.orderId;
                paymentSuccessResponse.updatedAt = updatePaymentStatusResponse.updatedAt;
                // send this to monitoring
                logger.info(`inside [payinService] [updatePaymentOrderStatus] paymentSuccessResponse ::  ${JSON.stringify(paymentSuccessResponse)}`);
                return paymentSuccessResponse;

            } catch (e) {
                logger.error(e,`inside [payinService] [updatePaymentStatus] received error from [updatePaymentStatus] `);
                throw (e);
            }
        } catch (e) {
            logger.error(e,`inside [payinService] [updatePaymentStatus] received error from [updatePaymentStatus] `);
            throw (e);
        }
    }

    static async deletePaymentMethod(deletePaymentMethod: DeletePaymentMethodRequest, restClient: any, vendorId: string): Promise<any> {
        try {
            logger.info(`inside [payinService] [deletePaymentMethod] deletePaymentMethod ::  ${JSON.stringify(deletePaymentMethod)}`);
            const deletePaymentMethodResponse: any = await PayinClient.deletePaymentMethod(deletePaymentMethod, restClient, vendorId);
            logger.info(`inside [payinService] [deletePaymentMethod] deletePaymentMethodResponse ::  ${JSON.stringify(deletePaymentMethodResponse)}`);
            return deletePaymentMethodResponse;
        } catch (e) {
            logger.error(e,`inside [payinService] [deletePaymentMethod] received error from [deletePaymentMethod] `);
            throw (e);
        }
    }

    static async getUserAddCashSummary(userId: string, restClient: any, tenetCustomerId: string, vendorId: string): Promise<AddCashSummary> {
        try {
            logger.info(`inside [payinService] [getUserAddCashSummary] userId ::  ${userId}`);
            //const tenetCustomerId: string = await redisService.getUserAttribute(userId, payinTenetCustomerIdKey);
            const userAddCashSummary: AddCashSummary = await PayinClient.getUserAddCashSummary(tenetCustomerId, restClient, vendorId);
            logger.info(`inside [payinService] [getUserAddCashSummary] userAddCashSummary ::  ${JSON.stringify(userAddCashSummary)}`);
            return userAddCashSummary;
        } catch (e) {
            logger.error(e,`inside [payinService] [getUserAddCashSummary] received error from [getUserAddCashSummary] `);
            throw (e);
        }
    }

    static async getUserRefundDetails(userId: string, vendorId: string, payinCustomerId: string, restClient: any): Promise<any> {
        try {
            const userKycFilter: UserKycFilter = {userKycDataMethod: USER_KYC_DATA.LITE}
            const userDetails: [UserKycDetails, IDMUserProfile] = await Promise.all([
                GuardianService.getUserKycDetails(userId, userKycFilter, restClient, vendorId),
                IDMService.getUserDetails(restClient, userId, vendorId)
            ])
            // get user email status from idm
            const refundEligibleUser: boolean = checkUserRefundEligibilty(userDetails[0], userDetails[1]);// add idm's variable here
            if (!refundEligibleUser) {
                // if the user is not eligible then throw error here
                throw (PayinClient.getErrorFromCode(PayinClient.PAYIN_CUSTOM_ERROR_CODES.USER_NOT_ELIGIBLE_FOR_REFUND));
            }
            logger.info(`inside [payinService] [getUserRefundDetails] userId ::  ${userId} payinCustomerId :: ${payinCustomerId}`);
            const userWalletBalance: UserWalletBalance = await SupernovaService.getUserWalletBalance(userId, restClient, Number(vendorId));// send vendor id here
            logger.info(`inside [payinService] [getUserRefundDetails] userWalletBalance ::  ${JSON.stringify(userWalletBalance)}`);
            const userDepositBalance: number = userWalletBalance.depositBalance ?? 0;
            logger.info(`inside [payinService] [getUserRefundDetails] userDepositBalance ::  ${userDepositBalance}`);
            let transactionPageSize: number = PAGINATION.MAX_NUM_OF_RECORDS,
                transactionPageNumber: number = 1;
            const userTransactions: any[] = await PayinService.getUserTransactions(restClient, payinCustomerId, transactionPageNumber, transactionPageSize, TRANSACTIONS_SORTING_METHOD.DESC, PAYIN_TRANSACTION_STATUS.SUCCESS, vendorId);
            const userRefundOrderDetails: any[] = processUserTransactionsForRefund(userTransactions, userDepositBalance);
            logger.info(`inside [payinService] [getUserRefundDetails]got userRefundOrderDetails :: ${JSON.stringify(userRefundOrderDetails)}`);
            const userRefundOrderRequest = {refunds: userRefundOrderDetails}
            let userRefundTdsDetails: UserRefundData[] = [];
            if (userRefundOrderRequest.refunds.length) {
                userRefundTdsDetails = await SupernovaService.getUserRefundTdsDetails(userId, userRefundOrderRequest, restClient, Number(vendorId));
            }// send vendorid here
            logger.info(`inside [payinService] [getUserRefundDetails]got userRefundTdsDetails :: ${JSON.stringify(userRefundTdsDetails)}`);
            return formulateUserRefundResponse(userDepositBalance, userRefundTdsDetails);
        } catch (e) {
            logger.error(e,`inside [payinService] [getUserRefundDetails] received error from [getUserRefundDetails] `);
            throw (e);
        }
    }

    static async initiateUserRefund(userId: string, vendorId: string, payinCustomerId: string, userRefunds: any[], restClient: any, deviceInfo: any): Promise<any> {
        try {
            const userKycFilter: UserKycFilter = {userKycDataMethod: USER_KYC_DATA.LITE}
            const userDetails: [UserKycDetails, IDMUserProfile] = await Promise.all([
                GuardianService.getUserKycDetails(userId, userKycFilter, restClient, vendorId),
                IDMService.getUserDetails(restClient, userId, vendorId)
            ])
            // get user email status from idm
            const refundEligibleUser: boolean = checkUserRefundEligibilty(userDetails[0], userDetails[1]);// add idm's variable here
            if (!refundEligibleUser) {
                // if the user is not eligible then throw error here
                throw (PayinClient.getErrorFromCode(PayinClient.PAYIN_CUSTOM_ERROR_CODES.USER_NOT_ELIGIBLE_FOR_REFUND));
            }
            logger.info(`inside [payinService] [initiateUserRefund] userId ::  ${userId} userRefunds:: ${JSON.stringify(userRefunds)}`);
            let refunds: any[] = [], orders: any[] = [], refundedAmount: number = 0;
            for (let index = 0; index < userRefunds.length; index++) {
                const refund = userRefunds[index];
                logger.info({refund, index}, 'got refunds to process here')
                const userRefund = refund;
                userRefund.userId = userId;
                userRefund.requestId = restClient.getRequestId();
                try {
                    logger.info(`calling supernova refundCash here`)
                    const refundResponse: any = await SupernovaService.refundCash(userRefund, restClient, Number(vendorId));// add vendor id here
                    refunds.push({
                        orderId: refund.transactionId,
                        amount: Number(refundResponse?.tdsDetails?.amountToBeCredit) + Number(refundResponse?.tdsDetails?.tdsApplicable),
                        netRefundAmount: Number(refundResponse?.tdsDetails?.amountToBeCredit),
                        refundOnPsp: true,
                        manualApproval: configService.getRefundApprovalMethodForVendor()[vendorId] == refundMethods.MANUAL,
                        udf1: refundResponse?.tdsDetails?.tdsApplicable ?? 0,
                        udf2: refund.tdsTransactionId
                    })
                    logger.info(refunds, 'updated refunds <array>')
                    refundedAmount += (refunds[refunds.length - 1]?.amount);
                    logger.info(refundedAmount, 'refundedAmount updated')
                    orders.push(userRefund);
                } catch (e) {
                    logger.error(e,`inside [payinService] [initiateUserRefund] received error from [initiateUserRefund]error from supernovaService `);
                }
                logger.info(index, 'current index')
                if (index % 10 == 0 && refunds.length) {
                    logger.info('calling payin refunds api')
                    try {
                        await PayinClient.initiateUserRefund(refunds, restClient, vendorId);
                        refunds.forEach((refund) => {
                            EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_REFUND_INITIATED, {
                                refundAmount: refund.amount,
                                refundRequestId: refund.orderId
                            });
                        });
                    } catch (e) {
                        logger.error(e,`inside [payinService] [initiateUserRefund] received error from [initiateUserRefund]error from supernovaService `);
                        logger.error(`inside [payinService] [initiateUserRefund] reverting refunds for the order ${JSON.stringify(refunds)}`);
                        for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) {
                            const order = orders[orderIndex];
                            const revertedOrder: any = {
                                requestId: order.requestId,
                                userId,
                                payOutOrderId: order.transactionId,
                                tdsTransactionId: order.tdsTransactionId
                            };
                            await SupernovaService.revertUserRefund(revertedOrder, restClient, Number(vendorId));// send vendorid here
                        }
                    }
                    refunds = [];
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
                            refundAmount: refund.amount,
                            refundRequestId: refund.orderId,
                        });
                    });
                } catch (e) {
                    logger.error(e,`inside [payinService] [initiateUserRefund] received error from [initiateUserRefund]error from supernovaService `);
                    logger.error(`inside [payinService] [initiateUserRefund] reverting refunds for the order ${JSON.stringify(refunds)}`);
                    for (let orderIndex = 0; orderIndex < orders.length; orderIndex++) {
                        const order = orders[orderIndex];
                        const revertedOrder: any = {
                            requestId: order.requestId,
                            userId,
                            payOutOrderId: order.transactionId,
                            tdsTransactionId: order.tdsTransactionId
                        };
                        await SupernovaService.revertUserRefund(revertedOrder, restClient, Number(vendorId));// send vendor id here
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

    static async getUserTransactions(restClient: any, payinCustomerId: string, page: number, limit: number, sortBy: string, status?: string, vendorId?: string): Promise<any[]> {
        try {
            logger.info(`inside [payinService] [getUserTransactions] payinCustomerId ::  ${payinCustomerId} with status :: ${status}`);
            logger.info(`inside [payinService] [getUserTransactions] payinCustomerId ::  ${{payinCustomerId}}`);
            const userTransactionData: any = await PayinClient.getUserTransactionHistory(restClient, payinCustomerId, limit, page, sortBy, status, vendorId);
            logger.info(`inside [payinService] [getUserTransactions] userTransactionData ::  ${JSON.stringify(userTransactionData)}`);
            return userTransactionData?.orders ?? [];
        } catch (e) {
            logger.error(e,`inside [payinService] [getUserTransactions] received error from [getUserTransactions] `);
            throw (e);
        }
    }

    static async getUserAddCashHistory(req: any, payinCustomerId: string, page: number, limit: number, sortBy: string = TRANSACTIONS_SORTING_METHOD.DESC, vendorId: string): Promise<any> {
        try {
            logger.info(`inside [payinService] [getUserAddCashHistory] payinCustomerId ::  ${payinCustomerId}`);
            const userTransactionData: any = await PayinService.getUserTransactions(req.internalRestClient, payinCustomerId, page, limit, sortBy, null, vendorId);
            logger.info(`inside [payinService] [getUserAddCashHistory] userTransactionData ::  ${JSON.stringify(userTransactionData)}`);
            return {transactions: getUserAddCashHistoryResponse(userTransactionData ?? [])};
        } catch (e) {
            logger.error(e,`inside [payinService] [getUserAddCashHistory] received error from [getUserAddCashHistory] `);
            throw (e);
        }
    }

    static async getUserAddCashRefundHistory(req: any, payinCustomerId: string, page: number, limit: number, vendorId: string): Promise<any> {
        try {
            logger.info(`inside [payinService] [getUserAddCashRefundHistory] payinCustomerId ::  ${payinCustomerId}`);
            const userTransactionRefundData: any = await PayinClient.getUserAddCashRefundHistory(req.internalRestClient, payinCustomerId, limit, page, null, vendorId);
            logger.info(`inside [payinService] [getUserAddCashRefundHistory] userTransactionData ::  ${JSON.stringify(userTransactionRefundData)}`);
            return {transactions: getUserRefundHistoryResponse(userTransactionRefundData?.list ?? [])};
        } catch (e) {
            logger.error(e,`inside [payinService] [getUserAddCashRefundHistory] received error from [getUserTransactions] `);
            throw (e);
        }
    }

    static async reverseUserRefund(refundResponse: any, restClient: any, vendorId: string): Promise<any[]> {
        try {
            logger.info(`inside [payinService] [reverseUserRefund] refundResponse ::  ${JSON.stringify(refundResponse)}`);
            const revertedOrder: any = {
                requestId: restClient.getRequestId(),
                userId: refundResponse.content.refund.uniqueRef,
                payoutOrderId: refundResponse.content.refund.orderDetails.orderId,
                tdsTransactionId: refundResponse.content.refund.udf2
            }
            const reverseUserRefundResponse: any = await SupernovaService.revertUserRefund(revertedOrder, restClient, Number(vendorId));// send vendor id here
            logger.info(`inside [payinService] [reverseUserRefund] reverseUserRefundResponse ::  ${JSON.stringify(reverseUserRefundResponse)}`);
            return reverseUserRefundResponse;
        } catch (e) {
            logger.error(e,`inside [payinService] [reverseUserRefund] received error from [reverseUserRefund] `);
            throw (e);
        }
    }

};
