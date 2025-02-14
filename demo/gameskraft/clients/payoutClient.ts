/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import PayoutServiceError from '../errors/payout/payout-error';
import PayoutServiceErrorUtil from '../errors/payout/payout-error-util';
import RequestUtil from '../helpers/request-util';
// import Pagination from '../models/pagination';
import QueryParam from '../models/query-param';
import {CreatePayoutRequest, ValidatePayoutRequest} from '../models/payout/requests';
import {getPayoutServiceBaseUrl} from '../services/configService';
import {PayoutLatencyDecorator} from '../utils/monitoring/client-latency-decorator';
import BaseClient from './baseClient';
import LoggerUtil, {ILogger} from '../utils/logger';
import PayoutFilter from '../models/payout/payout-filter';
import PayoutUtilV2 from '../utils/v2/payout-utils';

const logger: ILogger = LoggerUtil.get('PayoutClient');

export default class PayoutClient {
    private static urls = {
        createPayoutOrder: 'payout',
        validateOrder: 'payout/validation',
        payoutHistory: 'payout',
        payoutStatus: 'payout/transferId',
    };

    @PayoutLatencyDecorator
    static async validateOrder(restClient: any, request: ValidatePayoutRequest, vendorId: string): Promise<any> {
        try {
            logger.info(`[PayoutClient] [validateOrder] request Body :: ${JSON.stringify(request)}, vendorId- ${vendorId} `);
            const url = PayoutClient.getCompleteUrl(PayoutClient.urls.validateOrder);
            const headers: any = PayoutClient.getPayoutServiceHeaders(vendorId);
            logger.info(`[PayoutClient] [validateOrder] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(`[PayoutClient] [validateOrder] response :: ${JSON.stringify(response || {})}`);
            if (!response.status?.success) {
                throw PayoutClient.getErrorFromCode(response.status?.code);
            }
            return response.status;
        } catch (error) {
            throw PayoutClient.getError(error);
        }
    }

    @PayoutLatencyDecorator
    static async createPayoutOrder(restClient: any, request: CreatePayoutRequest, vendorId: string): Promise<any> {
        try {
            logger.info(`[PayoutClient] [createPayoutOrder] request :: ${JSON.stringify(request)}, vendorId - ${vendorId}`);
            const url = PayoutClient.getCompleteUrl(PayoutClient.urls.createPayoutOrder);
            const headers: any = PayoutClient.getPayoutServiceHeaders(vendorId);
            logger.info(`[PayoutClient] [validateOrder] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(`[PayoutClient] [createPayoutOrder] response :: ${JSON.stringify(response || {})}`);
            return response.data;
        } catch (error) {
            throw PayoutClient.getError(error);
        }
    }

    @PayoutLatencyDecorator
    static async payoutHistory(restClient: any, userId: string, payoutFilter: PayoutFilter, vendorId: string): Promise<any> {
        try {
            logger.info(`[PayoutClient] [payoutHistory] userId :: ${userId} :: payoutFilter :: ${JSON.stringify(payoutFilter || {})}, vendorId - ${vendorId}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: 'userId', value: userId});

            if (payoutFilter.page) queryParams.push({param: 'page', value: payoutFilter.page});
            if (payoutFilter.limit) queryParams.push({param: 'limit', value: payoutFilter.limit});
            if (payoutFilter.from) queryParams.push({param: 'from', value: payoutFilter.from});
            if (payoutFilter.to) queryParams.push({param: 'to', value: payoutFilter.to});
            if (payoutFilter.transferId) queryParams.push({param: 'transferId', value: payoutFilter.transferId});
            if (payoutFilter.status) queryParams.push({param: 'status', value: payoutFilter.status});

            const url = PayoutClient.getCompleteUrl(PayoutClient.urls.payoutHistory, queryParams);
            const headers: any = PayoutClient.getPayoutServiceHeaders(vendorId);
            logger.info(`[PayoutClient] [payoutHistory] url :: ${url} with headers :: ${JSON.stringify(headers)}`);

            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PayoutClient] [payoutHistory] response :: ${JSON.stringify(response || {})}`);
            return response.data;
        } catch (error) {
            throw PayoutClient.getError(error);
        }
    }

    @PayoutLatencyDecorator
    static async getPayoutStatusFromTransactionId(restClient: any, transferId: string, vendorId: string): Promise<any> {
        try {
            logger.info(`[PayoutClient] [getPayoutStatusFromTransactionId] userId :: ${transferId} vendorId - ${vendorId}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: 'transferId', value: transferId});
            const url = PayoutClient.getCompleteUrl(PayoutClient.urls.payoutStatus, queryParams);
            logger.info(`[PayoutClient] [getPayoutStatusFromTransactionId] url :: ${url}`);
            const response = await BaseClient.sendGetRequestAsync(restClient, url);
            logger.info(`[PayoutClient] [getPayoutStatusFromTransactionId] response :: ${JSON.stringify(response || {})}`);
            return response.data;
        } catch (error) {
            throw PayoutClient.getError(error);
        }
    }

    static getErrorFromCode(errorCode: number) {
        return PayoutClient.getError({errorCode});
    }

    static wrapError(error: any) {
        if (error && !(error instanceof PayoutServiceError)) {
            return PayoutServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    private static getPayoutServiceHeaders(vendorId: string) {
        const headers: any = {'x-access-id': PayoutUtilV2.getPayoutAccessIdByVendor(vendorId)};
        return headers;
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(getPayoutServiceBaseUrl(), relativeUrl, queryParams)
    }


    private static getError(error: any) {
        logger.error('[Payoutclient] Error: %s', JSON.stringify(error || {}));
        switch (Number(error.errorCode)) {
            case 4001:
            case 4004:
            case 4007:
            case 5001:
            case 5002:
            case 6002:
            case 6003:
            case 6004:
            case 6007:
            case 6008:
            case 7000:
            case 7001:
            case 7002:
            case 7003:
            case 8000:
            case 9000:
            case 9001:
            case 9002:
            case 9003:
                return PayoutServiceErrorUtil.getWithdrawalFailedTryAgain();
            case 4002:
                return PayoutServiceErrorUtil.getWithdrwalLimitMinAmount();
            case 4003:
                return PayoutServiceErrorUtil.getWithdrwalLimitMaxAmount();
            case 4005:
                return PayoutServiceErrorUtil.getWithdrawalLimitForTheDay();
            case 4006:
                return PayoutServiceErrorUtil.getWithdrawalAccountInfoWrong();
            case 4008:
                return PayoutServiceErrorUtil.getAccountDetailsNotVerified();
            case 6001:
                return PayoutServiceErrorUtil.getInvalidAccountOrIfsc();
            case 6005:
            case 6006:
                return PayoutServiceErrorUtil.getWithdrawalFailedAtBank();
            case 4010:
                return PayoutServiceErrorUtil.getWithdrawalAmtLimitForTheDay();
            default:
                return PayoutServiceErrorUtil.getError(error);
        }
    }
};