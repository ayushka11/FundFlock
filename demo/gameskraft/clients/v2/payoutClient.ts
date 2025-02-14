/* eslint-disable no-unused-vars */
/* eslint-disable import/no-unresolved */
/* eslint-disable import/extensions */
import PayoutServiceError from '../../errors/payout/payout-error';
import PayoutServiceErrorUtil from '../../errors/payout/payout-error-util';
import RequestUtil from '../../helpers/request-util';
// import Pagination from '../models/pagination';
import QueryParam from '../../models/query-param';
import {CreatePayoutRequest, ValidatePayoutRequest} from '../../models/payoutV2/request';
import {getPayoutServiceBaseUrl} from '../../services/configService';
import {PayoutLatencyDecorator} from '../../utils/monitoring/client-latency-decorator';
import BaseClient from './../baseClient';
import LoggerUtil, {ILogger} from '../../utils/logger';
import PayoutFilter from '../../models/payoutV2/payout-filter';
import PayoutUtilV2 from '../../utils/v2/payout-utils';


const logger: ILogger = LoggerUtil.get('PayoutClientV2');

export default class PayoutClientV2 {
    private static urls = {
        createPayoutOrder: 'payout',
        validateOrder: 'payout/validation',
        payoutHistory: 'payout',
        payoutStatus: 'payout/transferId',
        getPayoutDownTimes: 'payout/mode/incident'
    };

    @PayoutLatencyDecorator
    static async getPayoutDownTimes(restClient: any, vendorId: number): Promise<any> {
        try {
            logger.info(`[PayoutClientV2] [getPayoutDownTimes]`);
            const queryParams: QueryParam[] = [];
            const url = PayoutClientV2.getCompleteUrlV2(PayoutClientV2.urls.getPayoutDownTimes, vendorId, queryParams);
            const headers: any = PayoutClientV2.getPayoutServiceHeadersV2(vendorId);
            logger.info(`[PayoutClientV2] [getPayoutDownTimes] url :: ${url}`);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url,headers);
            logger.info(`[PayoutClientV2] [getPayoutDownTimes] response :: ${JSON.stringify(response || {})}`);
            return response.data;
        } catch (error) {
            throw PayoutClientV2.getError(error);
        }
    }

    @PayoutLatencyDecorator
    static async validateOrderV2(restClient: any, vendorId: number, request: ValidatePayoutRequest): Promise<any> {
        try {
            logger.info(`[PayoutClientV2] [validateOrderV2] request Body :: ${JSON.stringify(request)}, vendorId :: ${vendorId}`);
            const url = PayoutClientV2.getCompleteUrlV2(PayoutClientV2.urls.validateOrder, vendorId);
            const headers: any = PayoutClientV2.getPayoutServiceHeadersV2(vendorId);
            logger.info(`[PayoutClientV2] [validateOrderV2] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(`[PayoutClientV2] [validateOrderV2] response :: ${JSON.stringify(response || {})}`);
            if (!response.status?.success) {
                throw PayoutClientV2.getErrorFromCode(response.status?.code);
            }
            return response.status;
        } catch (error) {
            throw PayoutClientV2.getError(error);
        }
    }

    @PayoutLatencyDecorator
    static async createPayoutOrderV2(restClient: any, vendorId: number, request: CreatePayoutRequest): Promise<any> {
        try {
            logger.info(`[PayoutClientV2] [createPayoutOrderV2] request :: ${JSON.stringify(request)}, vendorId- ${vendorId}`);
            const url = PayoutClientV2.getCompleteUrlV2(PayoutClientV2.urls.createPayoutOrder, vendorId);
            const headers: any = PayoutClientV2.getPayoutServiceHeadersV2(vendorId);
            logger.info(`[PayoutClientV2] [createPayoutOrderV2] url :: ${url} with headers :: ${JSON.stringify(headers)}, vendorId- ${vendorId}`);
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(`[PayoutClientV2] [createPayoutOrderV2] response :: ${JSON.stringify(response || {})}`);
            return response.data;
        } catch (error) {
            throw PayoutClientV2.getError(error);
        }
    }

    @PayoutLatencyDecorator
    static async payoutHistoryV2(restClient: any, userId: string, vendorId: number, payoutFilter: PayoutFilter): Promise<any> {
        try {
            logger.info(`[PayoutClientV2] [payoutHistoryV2] userId :: ${userId} :: payoutFilter :: ${JSON.stringify(payoutFilter || {})}, vendorId :: ${vendorId}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: 'userId', value: userId});

            if (payoutFilter.page) queryParams.push({param: 'page', value: payoutFilter.page});
            if (payoutFilter.limit) queryParams.push({param: 'limit', value: payoutFilter.limit});
            if (payoutFilter.from) queryParams.push({param: 'from', value: payoutFilter.from});
            if (payoutFilter.to) queryParams.push({param: 'to', value: payoutFilter.to});
            if (payoutFilter.transferId) queryParams.push({param: 'transferId', value: payoutFilter.transferId});
            if (payoutFilter.status) queryParams.push({param: 'status', value: payoutFilter.status});

            const url = PayoutClientV2.getCompleteUrlV2(PayoutClientV2.urls.payoutHistory, vendorId, queryParams);
            const headers: any = PayoutClientV2.getPayoutServiceHeadersV2(vendorId);
            logger.info(`[PayoutClientV2] [payoutHistoryV2] url :: ${url} with headers :: ${JSON.stringify(headers)}`);

            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PayoutClientV2] [payoutHistoryV2] response :: ${JSON.stringify(response || {})}`);
            return response.data;
        } catch (error) {
            throw PayoutClientV2.getError(error);
        }
    }

    @PayoutLatencyDecorator
    static async getPayoutStatusFromTransactionIdV2(restClient: any, vendorId: number, transferId: string): Promise<any> {
        try {
            logger.info(`[PayoutClientV2] [getPayoutStatusFromTransactionId] userId :: ${transferId}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: 'transferId', value: transferId});
            const url = PayoutClientV2.getCompleteUrlV2(PayoutClientV2.urls.payoutStatus, vendorId, queryParams);
            logger.info(`[PayoutClientV2] [getPayoutStatusFromTransactionId] url :: ${url}`);
            const response = await BaseClient.sendGetRequestAsync(restClient, url);
            logger.info(`[PayoutClientV2] [getPayoutStatusFromTransactionId] response :: ${JSON.stringify(response || {})}`);
            return response.data;
        } catch (error) {
            throw PayoutClientV2.getError(error);
        }
    }

    static getErrorFromCode(errorCode: number) {
        return PayoutClientV2.getError({errorCode});
    }

    static wrapError(error: any) {
        if (error && !(error instanceof PayoutServiceError)) {
            return PayoutServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    private static getPayoutServiceHeadersV2(vendorId: number) {
        const headers: any = {'x-access-id': PayoutUtilV2.getPayoutAccessIdByVendor(vendorId)};
        return headers;
    }

    private static getCompleteUrlV2(relativeUrl: string, vendorId: number, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(getPayoutServiceBaseUrl(), relativeUrl, queryParams)
    }


    private static getError(error: any) {
        logger.error('[PayoutClientV2] Error: %s', JSON.stringify(error || {}));
        switch (Number(error.code)) {
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