import PslService from "../services/pslService";
import LoggerUtil, { ILogger } from "../utils/logger";
import ResponseUtil from "../utils/response-util";

const logger: ILogger = LoggerUtil.get("PslController");

export default class PslController {

    static async getPslInfoPageData(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            logger.info(`[PslController] [getPslInfoPageData] Request ${userId}`);
            const resp: any = await PslService.getPslInfoPageData(req.internalRestClient, userId, vendorId);
            logger.info(`[PslController] [getPslInfoPageData] Response ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getPslSchedulePageData(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            logger.info(`[PslController] [getPslSchedulePageData] Request ${userId}`);
            const resp: any = await PslService.getPslScheduleData(req.internalRestClient, userId, vendorId);
            logger.info(`[PslController] [getPslSchedulePageData] Response ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getPslLeaderboardPageData(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            logger.info(`[PslController] [getPslLeaderboardPageData] Request ${userId}`);
            const resp: any = await PslService.getPslLeaderboardData(req.internalRestClient, userId, vendorId);
            logger.info(`[PslController] [getPslLeaderboardPageData] Response ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async claimPslTicket(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            logger.info(`[PslController] [claimPslTicket] Request ${userId}`);
            const resp: any = await PslService.claimPslTicket(req.internalRestClient, userId, vendorId);
            logger.info(`[PslController] [claimPslTicket] Response ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getUserPslTicketClaimStatus(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            logger.info(`[PslController] [getUserPslTicketClaimStatus] Request ${userId}`);
            const resp: any = await PslService.getUserPslTicketClaimStatus(req.internalRestClient, userId, vendorId);
            logger.info(`[PslController] [getUserPslTicketClaimStatus] Response ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

};
