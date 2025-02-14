import { Tournament } from '../models/tournament';
import {getBalanceApiMetaForVendor,getPracticeBalanceApiMetaForVendor} from '../services/configService';
import { GsService } from '../services/gsService';
import LoggerUtil, {ILogger} from "../utils/logger";
import RequestUtil from "../utils/request-util";
import SupernovaService from "../services/supernovaService";
import Pagination from "../models/pagination";
import {REQUEST_PARAM} from "../constants/supernova-constants";
import ResponseUtil from "../utils/response-util";

const logger: ILogger = LoggerUtil.get("SupernovaController");
export default class SupernovaController {

    static async getBalance(req, res, next): Promise<any> {
        try {
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            logger.info(userId, `[SupernovaController] [getBalance] Request for UserId :: `);
            const resp: any = await SupernovaService.getBalance(req.internalRestClient, userId, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getBalance] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getBalanceV2(req, res, next): Promise<any> {
        try {
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            logger.info(userId, `[SupernovaController] [getBalance] Request for UserId :: `);
            const supernovaResp: any = await SupernovaService.getBalanceV2(req.internalRestClient, userId, token, Number(vendorId));
            logger.info(supernovaResp, `[SupernovaController] [getBalance] Response :: `);
            let resp: any = {
                ...supernovaResp,
                meta: getBalanceApiMetaForVendor()[vendorId]
            };
            logger.info(resp, `[SupernovaController] [getBalance] Response :: `);
            logger.info(getBalanceApiMetaForVendor()[vendorId], `[SupernovaController] [getBalance] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getWalletDetails(req, res, next): Promise<any> {
        try {
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            logger.info(userId, `[SupernovaController] [getWalletDetails] Request for UserId :: `);
            const supernovaResp: any = await SupernovaService.getWalletDetails(req.internalRestClient, userId, token, Number(vendorId));
            logger.info(supernovaResp, `[SupernovaController] [getWalletDetails] Response :: `);
            let resp: any = {
                ...supernovaResp,
                meta: getBalanceApiMetaForVendor()[vendorId]
            };
            logger.info(resp, `[SupernovaController] [getBalance] Response :: `);
            logger.info(getBalanceApiMetaForVendor()[vendorId], `[SupernovaController] [getBalance] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getPracticeBalanceV2(req, res, next): Promise<any> {
        try {
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            logger.info(userId, `[SupernovaController] [getPracticeBalanceV2] Request for UserId :: `);
            const supernovaResp: any = await SupernovaService.getBalanceV2(req.internalRestClient, userId, token, Number(vendorId));
            logger.info(supernovaResp, `[SupernovaController] [getPracticeBalanceV2] Response :: `);
            let resp: any = {
                ...supernovaResp,
                meta: getPracticeBalanceApiMetaForVendor()[vendorId]
            };
            logger.info(resp, `[SupernovaController] [getPracticeBalanceV2] Response :: `);
            logger.info(getPracticeBalanceApiMetaForVendor()[vendorId], `[SupernovaController] [getPracticeBalanceV2] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getCashTickets(req, res, next): Promise<any> {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            logger.info(userId, `[SupernovaController] [getCashTickets] Request for UserId :: `);
            const resp: any = await SupernovaService.getCashTickets(req.internalRestClient, userId, pagination, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getCashTickets] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getCashTicketTransactions(req, res, next): Promise<any> {
        try {
            const {params, query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            const ticketId: string = RequestUtil.parseQueryParamAsString(params, REQUEST_PARAM.TICKET_ID);
            logger.info({
                UserId: userId,
                TicketId: ticketId
            }, `[SupernovaController] [getCashTicketTransactions] Request `);
            const resp: any = await SupernovaService.getCashTicketTransactions(req.internalRestClient, userId, ticketId, pagination, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getCashTicketTransactions] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getTournamentTickets(req, res, next): Promise<any> {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            logger.info(userId, `[SupernovaController] [getTournamentTickets] Request for UserId :: `);
            const resp: any = await SupernovaService.getTournamentTickets(req.internalRestClient, userId, pagination, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getTournamentTickets] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getCashbacks(req, res, next): Promise<any> {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            const status: number = RequestUtil.parseQueryParamAsNumber(query, REQUEST_PARAM.STATUS);
            logger.info({UserId: userId, Status: status}, `[SupernovaController] [getCashbacks] Request `);
            const resp: any = await SupernovaService.getCashbacks(req.internalRestClient, userId, status, pagination, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getCashbacks] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getWalletTransactions(req, res, next) {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            logger.info(userId, `[SupernovaController] [getWalletTransactions] Request for UserId :: `);
            const resp: any = await SupernovaService.getWalletTransactions(req, userId, pagination, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getWalletTransactions] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }

    }

    static async getWalletGameplayTransactions(req, res, next) {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            logger.info(userId, `[SupernovaController] [getWalletGameplayTransactions] Request for UserId :: `);
            const resp: any = await SupernovaService.getWalletGameplayTransactions(req, userId, pagination, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getWalletGameplayTransactions] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getWalletTdsTransactions(req, res, next) {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            logger.info(userId, `[SupernovaController] [getWalletTdsTransactions] Request for UserId :: `);
            const resp: any = await SupernovaService.getWalletTdsTransactions(req, userId, pagination, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getWalletTdsTransactions] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getWalletDcsTransactions(req, res, next) {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            logger.info(userId, `[SupernovaController] [getWalletTdsTransactions] Request for UserId :: `);
            const resp: any = await SupernovaService.getWalletDcsTransactions(req, userId, pagination, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getWalletTdsTransactions] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getWalletTdcTransactions(req, res, next) {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            logger.info(userId, `[SupernovaController] [getWalletTdsTransactions] Request for UserId :: `);
            const resp: any = await SupernovaService.getWalletTdcTransactions(req, userId, pagination, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getWalletTdsTransactions] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }


    static async getWalletLeaderboardTransactions(req, res, next) {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            logger.info(userId, `[SupernovaController] [getWalletLeaderboardTransactions] Request for UserId :: `);
            const resp: any = await SupernovaService.getWalletLeaderboardTransactions(req, userId, pagination, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getWalletLeaderboardTransactions] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }

    }

    static async getWalletTransaction(req, res, next) {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            const transactionId: string = RequestUtil.getTransactionId(query);
            logger.info(userId, `[SupernovaController] [getWalletTdsTransactions] Request for UserId :: `);
            const resp: any = await SupernovaService.getWalletTransaction(req, userId, transactionId, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getWalletTdsTransactions] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getWalletLeaderboardTransaction(req, res, next) {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            const transactionId: string = RequestUtil.getTransactionId(query);
            logger.info(userId, `[SupernovaController] [getWalletLeaderboardTransaction] Request for UserId :: `);
            const resp: any = await SupernovaService.getWalletLeaderboardTransaction(req, userId, transactionId, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getWalletLeaderboardTransaction] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getDcsWalletTransaction(req, res, next) {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            const transactionId: string = RequestUtil.getTransactionId(query);
            logger.info(userId, `[SupernovaController] [getWalletTdsTransactions] Request for UserId :: `);
            const resp: any = await SupernovaService.getDcsWalletTransaction(req, userId, transactionId, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getWalletTdsTransactions] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getTdcWalletTransaction(req, res, next) {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            const transactionId: string = RequestUtil.getTransactionId(query);
            logger.info(userId, `[SupernovaController] [getWalletTdsTransactions] Request for UserId :: `);
            const resp: any = await SupernovaService.getTdcWalletTransaction(req, userId, transactionId, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getWalletTdsTransactions] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getTdsWalletTransaction(req, res, next) {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const token = req?.cookieManager?.getToken();
            const transactionId: string = RequestUtil.getTransactionId(query);
            logger.info(userId, `[SupernovaController] [getWalletTdsTransactions] Request for UserId :: `);
            const resp: any = await SupernovaService.getTdsWalletTransaction(req, userId, transactionId, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getWalletTdsTransactions] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }


    static async getUserTournamentRegisteredByDepositReward(req, res, next) {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const token = req?.cookieManager?.getToken();
            logger.info(userId, `[SupernovaController] [getUserTournamentRegisteredByDepositReward] Request for UserId :: `);
            const resp: any = await SupernovaService.getUserTournamentRegisteredByDepositReward(req.internalRestClient, userId, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getUserTournamentRegisteredByDepositReward] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }
    static async getUserTournamentRegisteredByDepositRewardV2(req, res, next) {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const token = req?.cookieManager?.getToken();
            logger.info(userId, `[SupernovaController] [getUserTournamentRegisteredByDepositRewardV2] Request for UserId :: `);
            const resp: any = await SupernovaService.getUserTournamentRegisteredByDepositRewardV2(req.internalRestClient, userId, token, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getUserTournamentRegisteredByDepositRewardV2] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getUserLockedDcsPackDetails(req, res, next) {
        try {
            const {query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const packStatus: number = RequestUtil.getPackStatus(query);
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            logger.info(userId, `[SupernovaController] [getUserLockedDcsPackDetails] Request for UserId :: `);
            const resp: any = await SupernovaService.getUserLockedDcsPackDetails(req.internalRestClient, userId, packStatus, pagination, Number(vendorId));
            logger.info(resp, `[SupernovaController] [getUserLockedDcsPackDetails] Response :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

}
