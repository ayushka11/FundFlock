import LoggerUtil, { ILogger } from "../utils/logger";
import ResponseUtil from "../utils/response-util";
import { PROMISE_STATUS, REQUEST_PARAMS } from "../constants/constants";
import RequestUtil from "../helpers/request-util";
import LeaderboardService from "../services/leaderboardService";
import { GetChildLeaderboardDetailsByIdRequest } from "../models/leaderboard/request";

const logger: ILogger = LoggerUtil.get("LeaderboardController");

export default class LeaderboardController {
    static async processSettlementWebhook(req: any, res: any, next: any){
        try {
            const {query,body} = req;
            logger.info(`[LeaderboardController] [processSettlementWebhook] `, body);
            LeaderboardService.handleSettlementWebhook(req.internalRestClient, body)
            ResponseUtil.sendSuccessResponse(res, {});
        } catch (e) {
            logger.error(`[LeaderboardController] [processSettlementWebhook] error`, e);
            next(e);
        }
    }

    static async processLeaderboardEvent(req: any, res: any, next: any){
        try {
            const {query, body} = req;
            logger.info(`[LeaderboardController] [processLeaderboardEvent] got the body as :: `,body);
            LeaderboardService.processLeaderboardEvents(req.internalRestClient, body)
            ResponseUtil.sendSuccessResponse(res, {});
        } catch (e) {
            logger.error(`[LeaderboardController] [processLeaderboardEvent] error`, e);
            next(e);
        }
    }

    static async sendLeaderboardWinnerGratification(req: any, res: any, next: any){
        try {
            const {query, body} = req;
            logger.info(`[LeaderboardController] [sendLeaderboardWinnerGratification] got the body as :: `,body);
            LeaderboardService.sendLeaderboardWinningGratification(req.internalRestClient, body)
            ResponseUtil.sendSuccessResponse(res, {});
        } catch (e) {
            logger.error(`[LeaderboardController] [sendLeaderboardWinnerGratification] error`, e);
            next(e);
        }
    }

    static async getLeaderboardCampaigns(req: any, res: any, next: any){
        logger.info(`[LeaderboardController] [getLeaderboardCampaigns]`);
        try {
            const {query,params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            logger.info(`[LeaderboardController] [getLeaderboardCampaigns] userId: ${userId}, params:`,params);
            const statusFilter: Array<number> = RequestUtil.parseQueryParamAsNumberArray(query, REQUEST_PARAMS.LEADERBOARD_CAMPAIGN_STATUS);
            const leaderboardCampaigns = await LeaderboardService.getLeaderboardCampaigns(req.internalRestClient, userId, statusFilter);
            ResponseUtil.sendSuccessResponse(res, leaderboardCampaigns);
        } catch (e) {
            logger.error(`[LeaderboardController] [getLeaderboardCampaigns] error`, e);
            next(e);
        }
    }

    static async getLeaderboardOnTable(req: any, res: any, next: any){
        try {
            const {query, params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const roomId: number =  RequestUtil.parseQueryParamAsNumber(params, REQUEST_PARAMS.ROOM_ID_PARAM);
            logger.info(`[LeaderboardController] [getLeaderboardOnTable] userId - ${userId}, params- ${JSON.stringify(params)}`);
            const leaderboardData = await LeaderboardService.getLeaderboardsOnTable(req.internalRestClient, userId, roomId, vendorId);
            logger.info(`[LeaderboardController] [getLeaderboardOnTable] got the query as :: `,query);
            ResponseUtil.sendSuccessResponse(res, leaderboardData);
        } catch (e) {
            logger.error(`[LeaderboardController] [getLeaderboardOnTable] error`, e);
            next(e);
        }
    }

    static async getLeaderboardForHybridLobby(req: any, res: any, next: any){
        try {
            const {query, params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const roomIds: Array<string> =  RequestUtil.parseQueryParamAsArray(query, REQUEST_PARAMS.ROOM_IDS);
            logger.info(`[LeaderboardController] [getLeaderboardOnTable] userId - ${userId}, params- ${JSON.stringify(query)}`);
            const leaderboardData = await LeaderboardService.getLeaderboardOnHybridLobby(req.internalRestClient, userId, roomIds);
            logger.info(`[LeaderboardController] [getLeaderboardOnTable] got the query as :: `,query);
            ResponseUtil.sendSuccessResponse(res, leaderboardData);
        } catch (e) {
            logger.error(`[LeaderboardController] [getLeaderboardOnTable] error`, e);
            next(e);
        }
    }

    static async getLeaderboardsCardForCampaign(req: any, res: any, next: any){
        logger.info(`[LeaderboardController] [getLeaderboardsCardForCampaign]`);
        try {
            const {query, params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const leaderboardCampaignTag: string =  RequestUtil.parseQueryParamAsString(params, REQUEST_PARAMS.LEADERBOARD_CAMPAIGN_TAG);
            const stake: string =  RequestUtil.parseQueryParamAsString(query, REQUEST_PARAMS.LEADERBOARD_STAKES);
            const selectedDate: string =  RequestUtil.parseQueryParamAsString(query, REQUEST_PARAMS.SELECTED_DATE);
            const request = {stake, leaderboardCampaignTag, selectedDate};
            const leaderboardData = await LeaderboardService.getLeaderboardsFromGroups(req.internalRestClient, userId, request);
            logger.info(`[LeaderboardController] [getLeaderboardsCardForCampaign] got the query as :: `,leaderboardData);
            ResponseUtil.sendSuccessResponse(res, leaderboardData);
        } catch (e) {
            logger.error(`[LeaderboardController] [getLeaderboardsCardForCampaign] error`, e);
            next(e);
        }
    }

    static getGameStakesConfig(req: any, res: any, next: any){
        try {
            const vendorId: string = req.vendorId;
            const gameStakes = LeaderboardService.getGameStakesConfig(vendorId);
            ResponseUtil.sendSuccessResponse(res, gameStakes);
        } catch (e) {
            logger.error(`[LeaderboardController] [getGameStakesConfig] error`, e);
            next(e);
        }
    }

    static async getLeaderboardChildDetailsById(req: any, res: any, next: any){
        try {
            const {query, params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            logger.info(`[LeaderboardController] [getLeaderboardChildDetailsById] params`, params);
            const lbGroupId: number =  RequestUtil.parseQueryParamAsNumber(params, REQUEST_PARAMS.LEADERBOARD_GROUP_ID);
            const lbChildId: number =  RequestUtil.parseQueryParamAsNumber(params, REQUEST_PARAMS.LEADERBOARD_CHILD_ID);
            const lbCampaignTag: string =  RequestUtil.parseQueryParamAsString(query, REQUEST_PARAMS.LEADERBOARD_CAMPAIGN_TAG);
            const request: GetChildLeaderboardDetailsByIdRequest = {lbGroupId, lbChildId, lbCampaignTag, vendorId};
            logger.info(`[LeaderboardController] [getLeaderboardChildDetailsById] request`, request);
            const leaderboardData = await LeaderboardService.getChildLeaderboardDetailsFromId(req.internalRestClient, userId, request);
            logger.info(`[LeaderboardController] [getLeaderboardChildDetailsById] got the query as :: `,leaderboardData);
            ResponseUtil.sendSuccessResponse(res, leaderboardData);
        } catch (e) {
            logger.error(`[LeaderboardController] [getLeaderboardChildDetailsById] error`, e);
            next(e);
        }
    }

    static async getUsersTotalLeaderboardEarnings(req: any, res: any, next: any){
        try {
            const {query, params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            logger.info(`[LeaderboardController] [getUsersTotalLeaderboardEarnings] params`, params);
            const userLeaderboardEarnings = await LeaderboardService.getUserLeaboardTotalEarnings(req.internalRestClient, userId);
            logger.info(`[LeaderboardController] [getUsersTotalLeaderboardEarnings] got the query as :: `,userLeaderboardEarnings);
            ResponseUtil.sendSuccessResponse(res, userLeaderboardEarnings);
        } catch (e) {
            logger.error(`[LeaderboardController] [getUsersTotalLeaderboardEarnings] error`, e);
            next(e);
        }
    }

    static async getLeaderboardNeighbourDetails(req: any, res: any, next: any){
        try {
            const {query, params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            logger.info(`[LeaderboardController] [getLeaderboardNeighbourDetails] params`, params);
            const lbGroupId: number =  RequestUtil.parseQueryParamAsNumber(params, REQUEST_PARAMS.LEADERBOARD_GROUP_ID);
            const lbChildId: number =  RequestUtil.parseQueryParamAsNumber(params, REQUEST_PARAMS.LEADERBOARD_CHILD_ID);
            const lbCampaignTag: string =  RequestUtil.parseQueryParamAsString(query, REQUEST_PARAMS.LEADERBOARD_CAMPAIGN_TAG);
            const isNextLeaderboard: boolean =  RequestUtil.parseQueryParamAsBoolean(query, REQUEST_PARAMS.IS_NEXT_LEADERBOARD);
            const request: any = {lbGroupId, lbChildId, lbCampaignTag, isNextLeaderboard, vendorId};
            logger.info(`[LeaderboardController] [getLeaderboardNeighbourDetails] request`, request);
            const leaderboardData = await LeaderboardService.getLeaderboardNeighbourDetails(req.internalRestClient, userId, request);
            logger.info(`[LeaderboardController] [getLeaderboardNeighbourDetails] got the query as :: `,leaderboardData);
            ResponseUtil.sendSuccessResponse(res, leaderboardData);
        } catch (e) {
            logger.error(`[LeaderboardController] [getLeaderboardNeighbourDetails] error`, e);
            next(e);
        }
    }

    static async getLeaderboardFAQ(req: any, res: any, next: any){
        try {
            const vendorId: string = req.vendorId;
            const leaderboardFAQ = await LeaderboardService.getLeaderboardFAQ(vendorId);
            ResponseUtil.sendSuccessResponse(res, leaderboardFAQ);
        } catch (e) {
            logger.error(`[LeaderboardController] [getLeaderboardNeighbourDetails] error`, e);
            next(e);
        }
    }
}
