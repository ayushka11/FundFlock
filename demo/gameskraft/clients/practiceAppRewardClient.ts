import QueryParam from "../models/query-param";
import {getAuroraServiceBaseUrl} from "../services/configService";
import {AuroraClientLatencyDecorator} from "../utils/monitoring/client-latency-decorator";
import RequestUtil from "../helpers/request-util";
import BaseClient from "./baseClient";
import LoggerUtil, {ILogger} from '../utils/logger';

const logger: ILogger = LoggerUtil.get("PracticeAppRewardClient");

export default class PracticeAppRewardClient {
    private static urls = {
        checkDcsLimit: '/practice/checkDcsLimit',
    }

    @AuroraClientLatencyDecorator
    static async checkDcsLimit(restClient: any, userId: number,vendorId: string): Promise<any> {
        try {
            logger.info(`[PracticeAppRewardClient] [checkDcsLimit] userId :: ${userId}`);
            const url = PracticeAppRewardClient.getCompleteUrl(PracticeAppRewardClient.urls.checkDcsLimit);
            logger.info(`[PracticeAppRewardClient] [checkDcsLimit] url :: ${url}`);
            const headers: any = PracticeAppRewardClient.getAuroraServiceHeaders(restClient.getRequestId(),vendorId);
            const request = {
                userId : userId
            };
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers,null,request);
            logger.info(`[PracticeAppRewardClient] [checkDcsLimit] response :: ${JSON.stringify(resp || {})}`);
            return resp.data;
        } catch (error) {
            logger.error(`[PracticeAppRewardClient] [checkDcsLimit]:: ${JSON.stringify(error)}`)
            throw error;
        }
    }

    private static getAuroraServiceHeaders(requestId: string, vendorId?: string) {
        let headers: any = {"X-Request-Id": requestId};
        if (vendorId) {
            headers = {"X-Request-Id": requestId, "x-vendor-id": vendorId};
        }
        return headers;
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(getAuroraServiceBaseUrl(), relativeUrl, queryParams);
    }

};
