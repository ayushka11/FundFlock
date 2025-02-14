import ReferralServiceErrorUtil from '../errors/referral/referral-error-util';
import RequestUtil from '../helpers/request-util';
import Pagination from '../models/pagination';
import QueryParam from '../models/query-param';
import { getAuroraServiceBaseUrl } from '../services/configService';

import LoggerUtil, { ILogger } from '../utils/logger';
import { AuroraClientLatencyDecorator } from '../utils/monitoring/client-latency-decorator';
import BaseClient from './baseClient';
const logger: ILogger = LoggerUtil.get("ReferralClient");

export default class ReferralClient {

    private static urls = {
        userRefereesV2: '/v2/user/referees/list',
        referralDetailsV2: '/v2/user/referral/details',
        userReferralStatsV2: '/v2/user/referral/stats',
        addReferralV2: '/v2/user/referral',

        userReferees: '/v1/user/referees/list',
        referralDetails: '/v1/user/referral/details',
        userReferralStats: '/v1/user/referral/stats',
        addReferral: '/v1/user/referral',
        createReferCode: '/v1/user/referral/refer-code',
        getUserByReferCode: '/v1/user/referral/##REFER_CODE##/details',
        validateReferCode: '/v1/user/referral/##REFER_CODE##/validate',
        referralShare: '/v1/user/referral/share',
    }

    //  V2 APIs Below
    @AuroraClientLatencyDecorator
    static async getUserRefereesV2(restClient: any, userId: number, refereeFilter: number, pagination: Pagination): Promise<any> {
        try {
            logger.info(`[ReferralClient] [getUserReferees] userId :: ${userId} refereeFilter :: ${refereeFilter}`);
            const queryParams: QueryParam[] = [
                {param: 'userId', value: userId},
                {param: 'refereeFilter', value: refereeFilter},
                {param: 'numOfRecords', value: pagination.numOfRecords},
                {param: 'offset', value: pagination.offset},
            ];
            const headers = ReferralClient.getReferralServiceHeaders(restClient.getRequestId());
            const url = ReferralClient.getCompleteUrl(ReferralClient.urls.userRefereesV2, queryParams);
            logger.info(`[ReferralClient] [getUserReferees] queryParams :: ${JSON.stringify(queryParams)} url :: ${url} headers :: ${headers}`);
            const userRefereeResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ReferralClient] [getUserReferees] response :: ${JSON.stringify(userRefereeResp)}`);
            return userRefereeResp.data;
        } catch (error) {
            logger.error(error,`[ReferralClient] [getUserReferees] Failed at Aurora :: `);
            throw ReferralClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getReferralDetailsV2(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[ReferralClient] [getReferralDetails] userId :: ${userId}`);
            const queryParams: QueryParam[] = [
                {param: 'userId', value: userId}
            ];
            const headers = ReferralClient.getReferralServiceHeaders(restClient.getRequestId());
            const url = ReferralClient.getCompleteUrl(ReferralClient.urls.referralDetailsV2, queryParams);
            logger.info(`[ReferralClient] [getReferralDetails] queryParams :: ${JSON.stringify(queryParams)} url :: ${url} headers :: ${headers}`);
            const referralDetails: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ReferralClient] [getReferralDetails] response :: ${JSON.stringify(referralDetails)}`);
            return referralDetails.data;
        } catch (error) {
            logger.error(error,`[ReferralClient] [getReferralDetails] Failed at Aurora :: `);
            throw ReferralClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getUserReferralStatsV2(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[ReferralClient] [getUserReferralStats] userId :: ${userId}`);
            const queryParams: QueryParam[] = [
                {param: 'userId', value: userId}
            ];
            const headers = ReferralClient.getReferralServiceHeaders(restClient.getRequestId());
            const url = ReferralClient.getCompleteUrl(ReferralClient.urls.userReferralStatsV2, queryParams);
            logger.info(`[ReferralClient] [getUserReferralStats] queryParams :: ${JSON.stringify(queryParams)} url :: ${url} headers :: ${headers}`);
            const userReferralStats: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ReferralClient] [getUserReferralStats] response :: ${JSON.stringify(userReferralStats)}`);
            return userReferralStats.data;
        } catch (error) {
            logger.error(`[ReferralClient] [getUserReferralStats] Failed at Aurora :: `,error);
            throw ReferralClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async addReferralV2(restClient: any, userId: number, referrerUserId: number, refereeMobile: string): Promise<any> {
        try {
            logger.info(`[ReferralClient] [addReferral] userId :: ${userId} referrerUserId :: ${referrerUserId} refereeMobile :: ${refereeMobile}`);
            const headers = ReferralClient.getReferralServiceHeaders(restClient.getRequestId());
            const url = ReferralClient.getCompleteUrl(ReferralClient.urls.addReferralV2);
            logger.info(`[ReferralClient] [addReferral] userId :: ${userId} referrerUserId :: ${referrerUserId} url :: ${url} headers :: ${headers}`);
            const addReferralInfo: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, {
                userId: userId,
                referrerUserId: referrerUserId,
                refereeMobile: refereeMobile,
            }, headers);
            logger.info(`[ReferralClient] [addReferral] userId :: ${userId} referrerUserId :: ${referrerUserId} addReferralInfo :: ${JSON.stringify(addReferralInfo)}`);
            return addReferralInfo.data;
        } catch (error) {
            logger.error(error,`[ReferralClient] [addReferral] Failed at Aurora :: `);
            throw ReferralClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getUserReferees(restClient: any, userId: number, refereeFilter: number, pagination: Pagination): Promise<any> {
        try {
            logger.info(`[ReferralClient] [getUserReferees] userId :: ${userId} refereeFilter :: ${refereeFilter}`);
            const queryParams: QueryParam[] = [
                {param: 'userId', value: userId},
                {param: 'refereeFilter', value: refereeFilter},
                {param: 'numOfRecords', value: pagination.numOfRecords},
                {param: 'offset', value: pagination.offset},
            ];
            const headers = ReferralClient.getReferralServiceHeaders(restClient.getRequestId());
            const url = ReferralClient.getCompleteUrl(ReferralClient.urls.userReferees, queryParams);
            logger.info(`[ReferralClient] [getUserReferees] queryParams :: ${JSON.stringify(queryParams)} url :: ${url} headers :: ${headers}`);
            const userRefereeResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ReferralClient] [getUserReferees] response :: ${JSON.stringify(userRefereeResp)}`);
            return userRefereeResp.data;
        } catch (error) {
            logger.error(error,`[ReferralClient] [getUserReferees] Failed at Aurora :: `);
            throw ReferralClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getReferralDetails(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[ReferralClient] [getReferralDetails] userId :: ${userId}`);
            const queryParams: QueryParam[] = [
                {param: 'userId', value: userId}
            ];
            const headers = ReferralClient.getReferralServiceHeaders(restClient.getRequestId());
            const url = ReferralClient.getCompleteUrl(ReferralClient.urls.referralDetails, queryParams);
            logger.info(`[ReferralClient] [getReferralDetails] queryParams :: ${JSON.stringify(queryParams)} url :: ${url} headers :: ${headers}`);
            const referralDetails: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ReferralClient] [getReferralDetails] response :: ${JSON.stringify(referralDetails)}`);
            return referralDetails.data;
        } catch (error) {
            logger.error(error,`[ReferralClient] [getReferralDetails] Failed at Aurora :: `);
            throw ReferralClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getUserReferralStats(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[ReferralClient] [getUserReferralStats] userId :: ${userId}`);
            const queryParams: QueryParam[] = [
                {param: 'userId', value: userId}
            ];
            const headers = ReferralClient.getReferralServiceHeaders(restClient.getRequestId());
            const url = ReferralClient.getCompleteUrl(ReferralClient.urls.userReferralStats, queryParams);
            logger.info(`[ReferralClient] [getUserReferralStats] queryParams :: ${JSON.stringify(queryParams)} url :: ${url} headers :: ${headers}`);
            const userReferralStats: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ReferralClient] [getUserReferralStats] response :: ${JSON.stringify(userReferralStats)}`);
            return userReferralStats.data;
        } catch (error) {
            logger.error(error,`[ReferralClient] [getUserReferralStats] Failed at Aurora :: `);
            throw ReferralClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getUserByReferCode(restClient: any, referCode: string): Promise<any> {
        try {
            logger.info(`[ReferralClient] [getUserByReferCode] referCode :: ${referCode}`);
            const headers = ReferralClient.getReferralServiceHeaders(restClient.getRequestId());
            const url = ReferralClient.getCompleteUrl(ReferralClient.urls.getUserByReferCode.replace(/##REFER_CODE##/g, referCode));
            logger.info(`[ReferralClient] [getUserByReferCode] referCode :: ${referCode} url :: ${url} headers :: ${headers}`);
            const userByReferCodeResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ReferralClient] [getUserByReferCode] referCode :: ${referCode} userByReferCodeResp :: ${JSON.stringify(userByReferCodeResp)}`);
            return userByReferCodeResp.data;
        } catch (error) {
            logger.error(error,`[ReferralClient] [getUserByReferCode] Failed at Aurora :: `);
            throw ReferralClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async addReferral(restClient: any, userId: number, referrerUserId: number): Promise<any> {
        try {
            logger.info(`[ReferralClient] [addReferral] userId :: ${userId} referrerUserId :: ${referrerUserId}`);
            const headers = ReferralClient.getReferralServiceHeaders(restClient.getRequestId());
            const url = ReferralClient.getCompleteUrl(ReferralClient.urls.addReferral);
            logger.info(`[ReferralClient] [addReferral] userId :: ${userId} referrerUserId :: ${referrerUserId} url :: ${url} headers :: ${headers}`);
            const addReferralInfo: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, {
                userId: userId,
                referrerUserId: referrerUserId,
            }, headers);
            logger.info(`[ReferralClient] [addReferral] userId :: ${userId} referrerUserId :: ${referrerUserId} addReferralInfo :: ${JSON.stringify(addReferralInfo)}`);
            return addReferralInfo.data;
        } catch (error) {
            logger.error(`[ReferralClient] [addReferral] Failed at Aurora :: `,error);
            throw ReferralClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async createUserReferCode(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[ReferralClient] [createUserReferCode] userId :: ${userId}`);
            const headers = ReferralClient.getReferralServiceHeaders(restClient.getRequestId());
            const url = ReferralClient.getCompleteUrl(ReferralClient.urls.createReferCode);
            logger.info(`[ReferralClient] [createUserReferCode] userId :: ${userId} url :: ${url} headers :: ${headers}`);
            const createUserReferCodeResp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, {
                userId: userId,
            }, headers);
            logger.info(`[ReferralClient] [createUserReferCode] userId :: ${userId} createUserReferCodeResp :: ${JSON.stringify(createUserReferCodeResp)}`);
            return createUserReferCodeResp.data;
        } catch (error) {
            logger.error(error,`[ReferralClient] [createUserReferCode] Failed at Aurora :: `);
            throw ReferralClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async validateReferCode(restClient: any, referCode: string): Promise<any> {
        try {
            logger.info(`[ReferralClient] [validateReferCode] referCode :: ${referCode}`);
            const headers = ReferralClient.getReferralServiceHeaders(restClient.getRequestId());
            const url = ReferralClient.getCompleteUrl(ReferralClient.urls.validateReferCode.replace(/##REFER_CODE##/g, referCode));
            logger.info(`[ReferralClient] [validateReferCode] referCode :: ${referCode} url :: ${url} headers :: ${headers}`);
            const validateReferCodeResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ReferralClient] [validateReferCode] referCode :: ${referCode} validateReferCodeResp :: ${JSON.stringify(validateReferCodeResp)}`);
            return validateReferCodeResp.data;
        } catch (error) {
            logger.error(error,`[ReferralClient] [validateReferCode] Failed at Aurora :: `);
            throw ReferralClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getUserReferralSharePayload(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[ReferralClient] [getUserReferralSharePayload] userId :: ${userId}`);
            const queryParams: QueryParam[] = [
                {param: 'userId', value: userId}
            ];
            const headers = ReferralClient.getReferralServiceHeaders(restClient.getRequestId());
            const url = ReferralClient.getCompleteUrl(ReferralClient.urls.referralShare, queryParams);
            logger.info(`[ReferralClient] [getUserReferralSharePayload] queryParams :: ${JSON.stringify(queryParams)} url :: ${url} headers :: ${headers}`);
            const userReferralSharePayload: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ReferralClient] [getUserReferralSharePayload] response :: ${JSON.stringify(userReferralSharePayload)}`);
            return userReferralSharePayload.data;
        } catch (error) {
            logger.error(error,`[ReferralClient] [getUserReferralSharePayload] Failed at Aurora :: `);
            throw ReferralClient.getError(error);
        }
    }

    public static getCompleteRequestURL(baseUrl: string, relativePath: string, queryParams? : QueryParam[]): string {
        return `${baseUrl}${relativePath}${queryParams && queryParams.length > 0 && ("?" + RequestUtil.createQueryParamString(...queryParams)) || ""}`;
      }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return ReferralClient.getCompleteRequestURL(getAuroraServiceBaseUrl(), relativeUrl, queryParams);
    }

    private static getReferralServiceHeaders(requestId: string) {
        const headers: any = {"X-Request-Id": requestId };
        return headers;
    }

    private static getError(error: any) {
        logger.error('[ReferralClient] Error: %s', JSON.stringify(error || {}));
        switch (error.errorCode) {
            case 10015:
                return ReferralServiceErrorUtil.getInternalServerError();
            case 80_000:
                return ReferralServiceErrorUtil.getRuntimeError();
            case 80_005:
                return ReferralServiceErrorUtil.getInvalidRefereeFilter();
            default:
                return ReferralServiceErrorUtil.getError(error);
        };
    }
}