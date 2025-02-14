import QueryParam from "../models/query-param";
import {getAuroraServiceBaseUrl} from "../services/configService";
import {AuroraClientLatencyDecorator} from "../utils/monitoring/client-latency-decorator";
import RequestUtil from "../helpers/request-util";
import BaseClient from "./baseClient";

import LoggerUtil, {ILogger} from '../utils/logger';
import LeaderboardServiceError from "../errors/leaderboard/leaderboard-error";
import LeaderboardServiceErrorUtil from "../errors/leaderboard/leaderboard-error-util";
import LeaderboardAuroraResponse, { LeaderboardCampaign } from "../models/leaderboard/response";
import { GetChildLeaderboardDetailsByIdRequest, GetLeaderboardsFromGroupsRequest } from "../models/leaderboard/request";

const configService = require('../services/configService');
const logger: ILogger = LoggerUtil.get("LeaderboardClient");

export default class LeaderboardClient {
    private static urls = {
        getLeaderboardCampaigns: '/v1/leaderboard/campaign',
        getChildLeaderboardOnTable: '/v1/leaderboard/child/user/##USER_ID##',
        getLeaderboardGroupsFromCampaign: '/v1/leaderboard/group/user/##USER_ID##',
        getChildLeaderboardDetailsFromId: '/v1/leaderboard/group/',
        updateLeaderboardCampaignStatus: '/v1/leaderboard/campaign/##CAMPAIGN_TAG##',
        getUserLeaderboardsByStatus: '/v1/leaderboard/user/##USER_ID##',
        getLeaderboardNeighbourDetails: '/v1/leaderboard/group/',
        getRunningLeaderboardFromRooms: '/v1/leaderboard/user/##USER_ID##/running',
        getPrizePool: '/v1/leaderboard/prize/pool',
    }

    @AuroraClientLatencyDecorator
    static async getLeaderboardCampaigns(restClient: any, userId: number, statusFilter: number[]):Promise<LeaderboardCampaign[]>{
        try {
            logger.info(`[LeaderboardClient] [getLeaderboardCampaigns] userId :: ${userId}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "status", value: statusFilter});
            const url = LeaderboardClient.getCompleteUrl(
                LeaderboardClient.urls.getLeaderboardCampaigns, queryParams
            );
            logger.info(`[LeaderboardClient] [getLeaderboardCampaigns] url :: ${url}`);
            const headers: any = LeaderboardClient.getLeaderboardServiceHeaders(restClient.getRequestId());
            const leaderboardCampaignResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[LeaderboardClient] [getLeaderboardCampaigns] response :: ${JSON.stringify(leaderboardCampaignResp || {})}`);
            return leaderboardCampaignResp.data;
        } catch (error) {
            logger.error(error,`[LeaderboardClient] [getLeaderboardCampaigns]:: `)
            throw LeaderboardClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getChildLeaderboardsOnTable(restClient: any, userId: number, roomId: number):Promise<LeaderboardAuroraResponse[]>{
        try {
            logger.info(`[LeaderboardClient] [getChildLeaderboardsOnTable] userId :: ${userId}, roomId: ${roomId}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "roomId", value: roomId});
            const url = LeaderboardClient.getCompleteUrl(
                LeaderboardClient.urls.getChildLeaderboardOnTable.replace(/##USER_ID##/g, userId.toString()),
                queryParams
            );
            logger.info(`[LeaderboardClient] [getChildLeaderboardsOnTable] url :: ${url}`);
            const headers: any = LeaderboardClient.getLeaderboardServiceHeaders(restClient.getRequestId());
            const leaderboardCampaignResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[LeaderboardClient] [getChildLeaderboardsOnTable] response :: ${JSON.stringify(leaderboardCampaignResp || {})}`);
            return leaderboardCampaignResp.data;
        } catch (error) {
            logger.error(error,`[LeaderboardClient] [getChildLeaderboardsOnTable]:: `)
            throw LeaderboardClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getLeaderboardsFromGroups(restClient: any, userId: number, request: GetLeaderboardsFromGroupsRequest):Promise<any>{
        try {
            logger.info(`[LeaderboardClient] [getLeaderboardsFromGroups] userId :: ${userId}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "leaderboardCampaignTag", value: request.campaignTag});
            queryParams.push({param: "roomIds", value: request.roomIds});
            queryParams.push({param: "selectedDate", value: request.selectedDate});
            const url = LeaderboardClient.getCompleteUrl(
                LeaderboardClient.urls.getLeaderboardGroupsFromCampaign.replace(/##USER_ID##/g, userId.toString()),
                queryParams
            );
            logger.info(`[LeaderboardClient] [getLeaderboardsFromGroups] url :: ${url}`);
            const headers: any = LeaderboardClient.getLeaderboardServiceHeaders(restClient.getRequestId());
            const leaderboardCampaignResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[LeaderboardClient] [getLeaderboardGroupsFromCampaign] response :: ${JSON.stringify(leaderboardCampaignResp || {})}`);
            return leaderboardCampaignResp.data;
        } catch (error) {
            logger.error(error,`[LeaderboardClient] [getLeaderboardsFromGroups]:: `)
            throw LeaderboardClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getChildLeaderboardDetailsFromId(restClient: any, userId: number, request: GetChildLeaderboardDetailsByIdRequest):Promise<LeaderboardAuroraResponse>{
        try {
            logger.info(`[LeaderboardClient] [getChildLeaderboardDetailsFromId] userId :: ${userId}`);
            const queryParams: QueryParam[] = [];
            if (request.lbCampaignTag) queryParams.push({param: "leaderboardCampaignTag", value: request.lbCampaignTag});
            const url = LeaderboardClient.getCompleteUrl(
                `${LeaderboardClient.urls.getChildLeaderboardDetailsFromId}${request.lbGroupId}/child/${request.lbChildId}/user/${userId}`,
                queryParams
            );
            logger.info(`[LeaderboardClient] [getChildLeaderboardDetailsFromId] url :: ${url}`);
            const headers: any = LeaderboardClient.getLeaderboardServiceHeaders(restClient.getRequestId());
            const leaderboardCampaignResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[LeaderboardClient] [getChildLeaderboardDetailsFromId] response :: ${JSON.stringify(leaderboardCampaignResp || {})}`);
            return leaderboardCampaignResp.data;
        } catch (error) {
            logger.error(error,`[LeaderboardClient] [getChildLeaderboardDetailsFromId]:: `)
            throw LeaderboardClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async updateLeaderboardCampaignStatus(restClient: any, lbCampaignTag: string, request: any):Promise<any>{
        try {
            logger.info(`[LeaderboardClient] [updateLeaderboardCampaignStatus] request :: ${JSON.stringify(request)}`);
            const url = LeaderboardClient.getCompleteUrl(
                LeaderboardClient.urls.updateLeaderboardCampaignStatus.replace(/##CAMPAIGN_TAG##/g, lbCampaignTag)
            );
            logger.info(`[LeaderboardClient] [updateLeaderboardCampaignStatus] url :: ${url}`);
            const headers: any = LeaderboardClient.getLeaderboardServiceHeaders(restClient.getRequestId());
            const leaderboardCampaignResp: any = await BaseClient.sendPutRequestWithHeaders(restClient, url, request, headers);
            logger.info(`[LeaderboardClient] [updateLeaderboardCampaignStatus] response :: ${JSON.stringify(leaderboardCampaignResp || {})}`);
            return leaderboardCampaignResp.data;
        } catch (error) {
            logger.error(error,`[LeaderboardClient] [updateLeaderboardCampaignStatus]:: `)
            throw LeaderboardClient.getError(error);
        }
    }


    @AuroraClientLatencyDecorator
    static async getUserLeaderboardsByStatus(restClient: any, userId: number, status: string):Promise<LeaderboardAuroraResponse[]>{
        try {
            logger.info(`[LeaderboardClient] [getUserLeaderboardsByStatus] userId :: ${userId}`);
            const queryParams: QueryParam[] = [];
            if (status) queryParams.push({param: "status", value: status});
            const url = LeaderboardClient.getCompleteUrl(
                LeaderboardClient.urls.getUserLeaderboardsByStatus.replace(/##USER_ID##/g, userId.toString()),
                queryParams
            );
            logger.info(`[LeaderboardClient] [getUserLeaderboardsByStatus] url :: ${url}`);
            const headers: any = LeaderboardClient.getLeaderboardServiceHeaders(restClient.getRequestId());
            const leaderboardCampaignResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[LeaderboardClient] [getUserLeaderboardsByStatus] response :: ${JSON.stringify(leaderboardCampaignResp || {})}`);
            return leaderboardCampaignResp.data;
        } catch (error) {
            logger.error(error,`[LeaderboardClient] [getUserLeaderboardsByStatus]:: `)
            throw LeaderboardClient.getError(error);
        }
    }


    @AuroraClientLatencyDecorator
    static async getLeaderboardNeighbourDetails(restClient: any, userId: number, request: any):Promise<LeaderboardAuroraResponse>{
        try {
            logger.info(`[LeaderboardClient] [getLeaderboardNeighbourDetails] userId :: ${userId}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "leaderboardCampaignTag", value: request.lbCampaignTag});
            queryParams.push({param: "isNextLeaderboard", value: request.isNextLeaderboard});
            const url = LeaderboardClient.getCompleteUrl(
                `${LeaderboardClient.urls.getLeaderboardNeighbourDetails}${request.lbGroupId}/child/${request.lbChildId}/user/${userId}/neighbour`,
                queryParams
            );
            logger.info(`[LeaderboardClient] [getLeaderboardNeighbourDetails] url :: ${url}`);
            const headers: any = LeaderboardClient.getLeaderboardServiceHeaders(restClient.getRequestId());
            const leaderboardCampaignResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[LeaderboardClient] [getLeaderboardNeighbourDetails] response :: ${JSON.stringify(leaderboardCampaignResp || {})}`);
            return leaderboardCampaignResp.data;
        } catch (error) {
            logger.error(error,`[LeaderboardClient] [getLeaderboardNeighbourDetails]:: `)
            throw LeaderboardClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getRunningLeaderboardFromRooms(restClient: any, userId: number, roomIds: Array<string>):Promise<LeaderboardAuroraResponse[]>{
        try {
            logger.info(`[LeaderboardClient] [getRunningLeaderboardFromRooms] userId :: ${userId}, roomId: ${JSON.stringify(roomIds)}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "roomIds", value: roomIds.join(',')});
            const url = LeaderboardClient.getCompleteUrl(
                LeaderboardClient.urls.getRunningLeaderboardFromRooms.replace(/##USER_ID##/g, userId.toString()),
                queryParams
            );
            logger.info(`[LeaderboardClient] [getRunningLeaderboardFromRooms] url :: ${url}`);
            const headers: any = LeaderboardClient.getLeaderboardServiceHeaders(restClient.getRequestId());
            const leaderboardCampaignResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[LeaderboardClient] [getRunningLeaderboardFromRooms] response :: ${JSON.stringify(leaderboardCampaignResp || {})}`);
            return leaderboardCampaignResp.data;
        } catch (error) {
            logger.error(error,`[LeaderboardClient] [getRunningLeaderboardFromRooms]:: `)
            throw LeaderboardClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getPrizePool(restClient: any, childLeaderboardId: number){
        try {
            logger.info(`[LeaderboardClient] [getPrizePool] childLeaderboardId :: ${childLeaderboardId}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "leaderboardChildId", value: childLeaderboardId});
            const url = LeaderboardClient.getCompleteUrl(
                LeaderboardClient.urls.getPrizePool,
                queryParams
            );
            logger.info(`[LeaderboardClient] [getPrizePool] url :: ${url}`);
            const headers: any = LeaderboardClient.getLeaderboardServiceHeaders(restClient.getRequestId());
            const prizePoolData: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[LeaderboardClient] [getPrizePool] response :: ${JSON.stringify(prizePoolData || {})}`);
            return prizePoolData.data;
        } catch (error) {
            logger.error(error,`[LeaderboardClient] [getPrizePool]:: `)
            throw LeaderboardClient.getError(error);
        }
    }


    static wrapError(error: any) {
        if (error && !(error instanceof LeaderboardServiceError)) {
            return LeaderboardServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    static getErrorFromCode(errorCode: number) {
        return LeaderboardClient.getError({errorCode});
    }

    private static getLeaderboardServiceHeaders(requestId: string, vendorId?: string) {
        let headers: any = {"X-Request-Id": requestId};
        if (vendorId) {
            headers = {"X-Request-Id": requestId, "x-vendor-id": vendorId};
        }
        return headers;
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(getAuroraServiceBaseUrl(), relativeUrl, queryParams);
    }

    private static getError(error: any) {
        logger.error('[LeaderboardClient] Error: %s', JSON.stringify(error || {}));
        switch (error.errorCode) {
            case 70005:
                return LeaderboardServiceErrorUtil.getLeaderboardCampaignDoesNotExists()
            case 70015:
            case 70025:
                return LeaderboardServiceErrorUtil.getLeaderboardCampaignCanNotUpdated()
            case 70020:
            case 70035:
                return LeaderboardServiceErrorUtil.getLeaderboardDoesNotExistsError()
            default:
                return LeaderboardServiceErrorUtil.getInternalServerError();
        }
    }
};
