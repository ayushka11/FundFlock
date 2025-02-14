import PayinServiceError from "../errors/payin/payin-error";
import PayinServiceErrorUtil from "../errors/payin/payin-error-util";
import QueryParam from "../models/query-param";
import LoggerUtil, {ILogger} from '../utils/logger';
import {PayinClientLatencyDecorator} from "../utils/monitoring/client-latency-decorator";
import RequestUtil from "../helpers/request-util";
import BaseClient from "./baseClient";
import {PayinUserDetailsRequest} from "../models/payin/user-details";
import {DeletePaymentMethodRequest, PayinInitiateOrder, PayinInitiateOrderV2} from "../models/payin/request";
import {DEFAULT_LIMIT, DEFAULT_PAGE, TRANSACTIONS_SORTING_METHOD} from "../constants/payin-constants";

const logger: ILogger = LoggerUtil.get("PayinClient");
const configService = require('../services/configService');

export default class PayinClient {
    static PAYIN_CUSTOM_ERROR_CODES = {
        USER_NOT_ELIGIBLE_FOR_REFUND: 4219
    }
    private static urls = {
        getUser: '/v1/customer/##CUSTOMER_ID##',
        createUser: '/v1/customer',
        getPaymentMethods: '/v1/paymentMethods',
        getPaymentMethodsDowntime: '/v1/paymentMethods/downtime',
        getUserPayinMethods: '/v1/user/##USER_ID##/preferredModes',
        createOrder: '/v1/order',
        processPayment: '/v2/processPayment',
        updatePaymentStatus: '/v1/order',
        deletePaymentMethod: '/v1/user/preferredMode',
        userAddCashSummary: '/v1/user/##CUSTOMER_ID##/addCashSummary',
        getUserTransactionHistory: '/v1/user/##CUSTOMER_ID##/transactionHistory',
        getUserOrderStatus: '/v1/order/##ORDER_ID##',
        initiateUserRefund: '/v1/order/refund/bulk',
        getUserAddCashRefundHistory: '/v1/user/##CUSTOMER_ID##/refundHistory',
        getUserTaxBreakup: '/v1/tax/calculation',
        getCardDetails: '/v1/card/##CARD_BIN##'
    }

    @PayinClientLatencyDecorator
    static async getCardDetails(cardBin: string,vendorId: string,restClient: any): Promise<any> {
        try {
            logger.info(`[PayinClient] [getCardDetails] orderId :: ${cardBin}`);
            const queryParams: QueryParam[] = [];
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.getCardDetails.replace(/##CARD_BIN##/g, cardBin), queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [getCardDetails] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const orderDetails: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PayinClient] [getCardDetails] response :: ${JSON.stringify(orderDetails || {})}`);
            return orderDetails.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [getCardDetails]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async getUserOrderStatus(orderId: string, restClient: any, vendorId?: string): Promise<any> {
        try {
            logger.info(`[PayinClient] [getUserOrderStatus] orderId :: ${orderId}`);
            const queryParams: QueryParam[] = [];
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.getUserOrderStatus.replace(/##ORDER_ID##/g, orderId), queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [getUserOrderStatus] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const orderDetails: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PayinClient] [getUserOrderStatus] response :: ${JSON.stringify(orderDetails || {})}`);
            return orderDetails.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [getUserOrderStatus]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async getAllAvailableUserPayinMethods(restClient: any, vendorId: string): Promise<any> {
        try {
            logger.info(`[PayinClient] [getAllAvailableUserPayinMethods] `);
            const queryParams: QueryParam[] = [];
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.getPaymentMethods, queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [getAllAvailableUserPayinMethods] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const payinMethods: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PayinClient] [getAllAvailableUserPayinMethods] response :: ${JSON.stringify(payinMethods || {})}`);
            return payinMethods.data;
        } catch (error) {
            logger.error(`[PayinClient] [getAllAvailableUserPayinMethods]:: `,error)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async getUserAddCashSummary(tenetCustomerId: string, restClient: any, vendorId: string): Promise<any> {
        try {
            logger.info(`[PayinClient] [getUserAddCashSummary] `);
            const queryParams: QueryParam[] = [];
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.userAddCashSummary.replace(/##CUSTOMER_ID##/g, tenetCustomerId), queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [getUserAddCashSummary] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const addCashSummary: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PayinClient] [getUserAddCashSummary] response :: ${JSON.stringify(addCashSummary || {})}`);
            return addCashSummary.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [getUserAddCashSummary]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async getPayinMethodsDowntime(restClient: any, vendorId: string): Promise<any> {
        try {
            logger.info(`[PayinClient] [getPayinMethodsDowntime] `);
            const queryParams: QueryParam[] = [];
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.getPaymentMethodsDowntime, queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [getPayinMethodsDowntime] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const payinMethodsDowntime: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PayinClient] [getPayinMethodsDowntime] response :: ${JSON.stringify(payinMethodsDowntime || {})}`);
            return payinMethodsDowntime.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [getPayinMethodsDowntime]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async getAllUserPayinMethods(userId: string, pspIds: number[], restClient: any, vendorId: string): Promise<any> {
        try {
            logger.info(`[PayinClient] [getAllUserPayinMethods] userId :: ${userId}`);
            const queryParams: QueryParam[] = [];
            if (pspIds.length) {
                queryParams.push({param: "pspId", value: pspIds});
            }
            queryParams.push({param: "wallets", value: false});
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.getUserPayinMethods.replace(/##USER_ID##/g, userId), queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [getAllUserPayinMethods] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const payinUserDetails: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PayinClient] [getAllUserPayinMethods] response :: ${JSON.stringify(payinUserDetails || {})}`);
            return payinUserDetails.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [getAllUserPayinMethods]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async getUserPayinDetails(tenetCustomerId: string, restClient: any, vendorId: string): Promise<any> {
        try {
            logger.info(`[PayinClient] [getUserPayinDetails] tenetCustomerId :: ${tenetCustomerId}`);
            const queryParams: QueryParam[] = [];
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.getUser.replace(/##CUSTOMER_ID##/g, tenetCustomerId), queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [getUserPayinDetails] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const payinUserDetails: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PayinClient] [getUserPayinDetails] response :: ${JSON.stringify(payinUserDetails || {})}`);
            return payinUserDetails.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [getUserPayinDetails]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async initiatePayment(orderRequest: PayinInitiateOrder, restClient: any, vendorId: string) {
        try {
            logger.info(`[PayinClient] [initiatePayment] for request ${JSON.stringify(orderRequest)}`);
            const queryParams: QueryParam[] = [];
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.createOrder, queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [initiatePayment] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const payinOrderDetails: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, orderRequest, headers);
            logger.info(`[PayinClient] [initiatePayment] response :: ${JSON.stringify(payinOrderDetails || {})}`);
            return payinOrderDetails.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [initiatePayment]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async createNewPayinUser(merchantId: string, userDetails: PayinUserDetailsRequest, restClient: any, vendorId: string) {
        try {
            logger.info(`[PayinClient] [createNewPayinUser] userId :: ${userDetails} for merchantId :: ${merchantId}`);
            const queryParams: QueryParam[] = [];
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.createUser, queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [createNewPayinUser] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const payinUserDetails: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, userDetails, headers);
            logger.info(`[PayinClient] [createNewPayinUser] response :: ${JSON.stringify(payinUserDetails || {})}`);
            return payinUserDetails.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [createNewPayinUser]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async processPayment(processPaymentRequest: any, restClient: any, vendorId: string) {
        try {
            logger.info(`[PayinClient] [processPayment] with request :: ${{processPaymentRequest}}`);
            const queryParams: QueryParam[] = [];
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.processPayment, queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [processPayment] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const processPaymentDetails: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, processPaymentRequest, headers);
            logger.info(`[PayinClient] [processPayment] response :: ${JSON.stringify(processPaymentDetails || {})}`);
            return processPaymentDetails.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [processPayment]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async updatePaymentStatus(updatePaymentStatusRequest: any, restClient: any, vendorId: string) {
        try {
            logger.info(`[PayinClient] [updatePaymentStatus] with request :: ${{updatePaymentStatusRequest}}`);
            const queryParams: QueryParam[] = [];
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.updatePaymentStatus, queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [updatePaymentStatus] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const updatePaymentDetails: any = await BaseClient.sendPutRequestWithHeaders(restClient, url, updatePaymentStatusRequest, headers);
            logger.info(`[PayinClient] [updatePaymentStatus] response :: ${JSON.stringify(updatePaymentDetails || {})}`);
            return updatePaymentDetails.data;
        } catch (error) {
            logger.info(error,`[PayinClient] [updatePaymentStatus]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async deletePaymentMethod(deletePaymentMethodRequest: DeletePaymentMethodRequest, restClient: any, vendorId: string) {
        try {
            logger.info(`[PayinClient] [deletePaymentMethod] with request :: ${{deletePaymentMethodRequest}}`);
            const queryParams: QueryParam[] = [];
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.deletePaymentMethod, queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [deletePaymentMethod] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const deletePaymentResponse: any = await BaseClient.sendDeleteRequestWithHeaders(restClient, url, deletePaymentMethodRequest, headers);
            logger.info(`[PayinClient] [deletePaymentMethod] response :: ${JSON.stringify(deletePaymentResponse || {})}`);
            return deletePaymentResponse.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [updatePaymentStatus]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async getUserTransactionHistory(restClient: any, tenetCustomerId: string, limit: number, page: number, sortBy: string, status?: string, vendorId?: string) {
        try {
            if (!page) {
                page = DEFAULT_PAGE
            }
            if (!limit) {
                limit = DEFAULT_LIMIT
            }
            logger.info(`[PayinClient] [getUserTransactionHistory] for :: ${{tenetCustomerId}}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "limit", value: limit});
            queryParams.push({param: "page", value: page});
            queryParams.push({param: "sortBy", value: sortBy});
            if (status) {
                queryParams.push({param: "status", value: status});
            }
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.getUserTransactionHistory.replace(/##CUSTOMER_ID##/g, tenetCustomerId), queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [getUserTransactionHistory] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const userTransactionHistoryData: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PayinClient] [getUserTransactionHistory] response :: ${JSON.stringify(userTransactionHistoryData || {})}`);
            return userTransactionHistoryData.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [getUserTransactionHistory]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async getUserTransactionHistoryV2(restClient: any, tenetCustomerId: string, limit: number, page: number, sortBy: string, vendorId?: string, status?: string) {
        try {
            logger.info(`[PayinClient] [getUserTransactionHistoryV2] for :: `, tenetCustomerId);
            const queryParams: QueryParam[] = [];
            if (!page) {
                page = DEFAULT_PAGE
            }
            if (!limit) {
                limit = DEFAULT_LIMIT
            }
            queryParams.push({param: "limit", value: limit});
            queryParams.push({param: "page", value: page});
            queryParams.push({param: "sortBy", value: sortBy});
            if (status) {
                queryParams.push({param: "status", value: status});
            }
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.getUserTransactionHistory.replace(/##CUSTOMER_ID##/g, tenetCustomerId), queryParams);
            logger.info("got this url ::", url);
            logger.info("got the vendorId::", vendorId);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);// to be fixed whhy is vendor id null here
            logger.info(`[PayinClient] [getUserTransactionHistoryV2] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const userTransactionHistoryData: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PayinClient] [getUserTransactionHistoryV2] response :: ${JSON.stringify(userTransactionHistoryData || {})}`);
            return userTransactionHistoryData.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [getUserTransactionHistoryV2]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async getUserAddCashRefundHistory(restClient: any, tenetCustomerId: string, limit: number, page: number, sortBy: string = TRANSACTIONS_SORTING_METHOD.DESC, vendorId: string) {
        try {
            if (!page) {
                page = DEFAULT_PAGE
            }
            if (!limit) {
                limit = DEFAULT_LIMIT
            }
            logger.info(`[PayinClient] [getUserAddCashRefundHistory] for :: ${{tenetCustomerId}}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "limit", value: limit});
            queryParams.push({param: "page", value: page});
            queryParams.push({param: "sortBy", value: sortBy});
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.getUserAddCashRefundHistory.replace(/##CUSTOMER_ID##/g, tenetCustomerId), queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [getUserAddCashRefundHistory] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const userRefundTransactionHistoryData: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PayinClient] [getUserAddCashRefundHistory] response :: ${JSON.stringify(userRefundTransactionHistoryData || {})}`);
            return userRefundTransactionHistoryData.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [getUserAddCashRefundHistory]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async initiateUserRefund(refunds: any[], restClient: any, vendorId: string) {
        try {
            logger.info(`[PayinClient] [initiateUserRefund] with refunds ::`, refunds);
            const queryParams: QueryParam[] = [];
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.initiateUserRefund, queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [initiateUserRefund] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const userRefundOrders: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, {
                refundableOrders: refunds,
                referenceId: restClient.getRequestId()
            }, headers);
            logger.info(`[PayinClient] [initiateUserRefund] response :: ${JSON.stringify(userRefundOrders || {})}`);
            return userRefundOrders.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [initiateUserRefund]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async getUserTaxBreakup(restClient: any, amounts: number[], gstStateCode: number, vendorId: string, isTaxinclusive: boolean = true) {
        try {
            logger.info(`[PayinClient] [getUserTaxBreakup] for amounts :: ${amounts} with gst state code :: ${gstStateCode} and the tax is included:: ${isTaxinclusive}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "amounts", value: amounts});
            queryParams.push({param: "stateCode", value: gstStateCode});
            queryParams.push({param: "isTaxinclusive", value: isTaxinclusive});
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.getUserTaxBreakup, queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [getUserTaxBreakup] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const userTaxBreakup: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PayinClient] [getUserTaxBreakup] response :: ${JSON.stringify(userTaxBreakup || {})}`);
            return userTaxBreakup.data;
        } catch (error) {
            logger.error(error,`[PayinClient] [getUserTaxBreakup]:: `)
            throw PayinClient.getError(error);
        }
    }

    @PayinClientLatencyDecorator
    static async initiatePaymentV2(orderRequest: PayinInitiateOrderV2, vendorId: string, restClient: any) {
        try {
            logger.info(`[PayinClient] [initiatePaymentV2] for request ${JSON.stringify(orderRequest)}`);
            const queryParams: QueryParam[] = [];
            const url: string = PayinClient.getCompleteUrl(PayinClient.urls.createOrder, queryParams);
            const headers: any = PayinClient.getPayinServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[PayinClient] [initiatePaymentV2] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const payinOrderDetails: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, orderRequest, headers);
            logger.info(`[PayinClient] [initiatePaymentV2] response :: ${JSON.stringify(payinOrderDetails || {})}`);
            return payinOrderDetails.data;
        } catch (error) {
            logger.error(`[PayinClient] [initiatePaymentV2]:: `,error)
            throw PayinClient.getError(error);
        }
    }

    static wrapError(error: any) {
        if (error && !(error instanceof PayinServiceError)) {
            return PayinServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    static getErrorFromCode(errorCode: number) {
        return PayinClient.getError({errorCode});
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(configService.getPayinServiceBaseUrl(), relativeUrl, queryParams);
    }

    private static getPayinServiceHeaders(requestId: string, vendorId: string) {
        const tenetAccessId = configService.getPayinServiceAccessKeyForVendor()[vendorId];
        const headers: any = {'X-Access-Id': tenetAccessId, "X-Request-Id": requestId};
        return headers;
    }

    private static getError(error: any) {
        logger.error('[PayinClient] Error: %s', JSON.stringify(error || {}));
        switch (error.errorCode) {
            case 4219:
                return PayinServiceErrorUtil.getUserRefundIneligible()
            case 4200:
                return PayinServiceErrorUtil.getMandatoryFieldsMissing();
            case 4201:
                return PayinServiceErrorUtil.getInvalidAmount();
            case 4202:
                return PayinServiceErrorUtil.getInvalidMobile();
            case 4203:
                return PayinServiceErrorUtil.getInvalidPayinMode();
            case 4204:
                return PayinServiceErrorUtil.getInvalidAggregatorId();
            case 4206:
                return PayinServiceErrorUtil.getInvalidOrderId();
            case 4207:
                return PayinServiceErrorUtil.getOrderIdNotFound();
            case 4208:
                return PayinServiceErrorUtil.getInvalidUserId();
            case 4209:
                return PayinServiceErrorUtil.getInvalidDeleteId();
            case 5200:
                return PayinServiceErrorUtil.getThirdPartyApiCallFailed();
            case 5201:
                return PayinServiceErrorUtil.getDatabaseReadOrUpdateFailed();
            case 5203:
                return PayinServiceErrorUtil.getCacheReadOrUpdateFailed();
            case 5204:
                return PayinServiceErrorUtil.getTenetMerchantNotFound();
            case 5205:
                return PayinServiceErrorUtil.getPspNotFound();
            case 5206:
                return PayinServiceErrorUtil.getCurrencyNotFound();
            case 5207:
                return PayinServiceErrorUtil.getPayinModeNotFound();
            case 5208:
                return PayinServiceErrorUtil.getTenetCustomerNotFound();
            case 5209:
                return PayinServiceErrorUtil.getNoActivePayinModeFound();
            case 7000:
                return PayinServiceErrorUtil.getInvalidRequest();
            case 7004:
                return PayinServiceErrorUtil.getDuplicateCustomerId();
            default:
                return PayinServiceErrorUtil.getError(error);
        }
    }
};
