import QueryParam from "../models/query-param";
import LoggerUtil, {ILogger} from '../utils/logger';
import {RegosClientLatencyDecorator} from "../utils/monitoring/client-latency-decorator";
import RequestUtil from "../helpers/request-util";
import BaseClient from "./baseClient";
import RegosServiceError from "../errors/regos/regos-error";
import RegosServiceErrorUtil from "../errors/regos/regos-error-util";

const logger: ILogger = LoggerUtil.get("RegosClient");
const configService = require('../services/configService');

export default class RegosClient {
    private static urls = {
        getRewardDetails:'/v1/reward/##REWARD_CODE##'
    }

    @RegosClientLatencyDecorator
    static async getRewardDetails(rewardCode: string,vendorId: string,restClient:any){
        try {
            logger.info(`[RegosClient] [getRewardDetails] reward :: ${JSON.stringify(rewardCode)}`);
            const queryParams: QueryParam[] = [];
            const url: string = RegosClient.getCompleteUrl(RegosClient.urls.getRewardDetails.replace('##REWARD_CODE##',rewardCode), queryParams);
            const headers: any = RegosClient.getRegosServiceHeaders(restClient.getRequestId(),vendorId);
            logger.info(`[RegosClient] [getRewardDetails] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const rewardDetail: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[RegosClient] [getRewardDetails RewardDetail :: ${JSON.stringify(rewardDetail)}`);
            return rewardDetail.result;
        } catch (error) {
            logger.error(error,`[RegosClient] [getRewardDetails]:: `)
            throw RegosClient.getError(error);
        }
    }

    // change this appropriately
    static wrapError(error: any) {
        if (error && !(error instanceof RegosServiceError)) {
            return RegosServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    static getErrorFromCode(errorCode: number) {
        return RegosClient.getError({errorCode});
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(configService.getRegosServiceBaseUrl(), relativeUrl, queryParams);
    }

    private static getRegosServiceHeaders(requestId: string,vendorId?: string) {
        const tenetAccessId = configService.getRegosServiceAccessKeyForVendor()[vendorId];
        const headers: any = {'X-Access-Id': tenetAccessId, "X-Request-Id": requestId};
        return headers;
    }

    private static getError(error: any) {
        logger.error('[RegosClient] Error: %s', JSON.stringify(error || {}));
        switch (error.errorCode) {
            default:
                return RegosServiceErrorUtil.getError(error);
        }
    }
};