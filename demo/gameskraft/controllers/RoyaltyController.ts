import LoggerUtil, {ILogger} from "../utils/logger";
import RoyaltyService from "../services/royaltyService";
import ResponseUtil from "../utils/response-util";

const restHelper = require("../helpers/restHelper");

const logger: ILogger = LoggerUtil.get("RoyaltyController");
export default class RoyaltyController {

    static async redeemCoins(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            logger.info(`[RoyaltyController] [redeemCoins] Request ${userId}`);
            const resp: any = await RoyaltyService.redeemCoins(req.internalRestClient, userId);
            logger.info(`[RoyaltyController] [redeemCoins] Response ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async redeemCoinsV2(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            logger.info(`[RoyaltyController] [redeemCoinsV2] Request ${userId}`);
            const resp: any = await RoyaltyService.redeemCoinsV2(req.internalRestClient, userId);
            logger.info(`[RoyaltyController] [redeemCoinsV2] Response ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }    


    static async getUserRoyaltyInfo(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            logger.info(`[RoyaltyController] [getUserRoyaltyInfo] Request ${userId}`);
            const resp: any = await RoyaltyService.getUserRoyaltyInfo(req.internalRestClient, userId);
            logger.info(`[RoyaltyController] [getUserRoyaltyInfo] Response ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getRoyaltyHomeInfo(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            logger.info(`[RoyaltyController] [getUserRoyaltyInfo] Request ${userId} `);
            const resp: any = await RoyaltyService.getRoyaltyHomeInfo(req.internalRestClient, userId);
            logger.info(`[RoyaltyController] [getUserRoyaltyInfo] Response ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getUserRoyaltyBenefits(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: number = req.vendorId;
            const resp: any = await RoyaltyService.getUserRoyaltyBenefits(req.internalRestClient, userId, vendorId);
            logger.info(`[RoyaltyController] [getUserRoyaltyBenefits] Response ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getRoyaltyFAQs(req, res, next): Promise<any> {
        try {
            logger.info(`[RoyaltyController] [getRoyaltyFAQs] Request`);
            const resp: any = await RoyaltyService.getRoyaltyFAQs(req.internalRestClient);
            logger.info(`[RoyaltyController] [getRoyaltyFAQs] Response ${JSON.stringify(resp)}`);
            return res.send(restHelper.getSuccessResponse(resp));
        } catch (e) {
            next(e);
        }
    }

    static async getRoyaltyAddCashUserDetails(req, res, next): Promise<any> {
        try {
            logger.info(`[RoyaltyController] [getRoyaltyAddCashUserDetails] Request`);
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: number = req.vendorId;
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            const resp: any = await RoyaltyService.getRoyaltyAddCashUserDetails(userId,payinCustomerId,vendorId,req.internalRestClient);
            logger.info(`[RoyaltyController] [getRoyaltyAddCashUserDetails] Response ${JSON.stringify(resp)}`);
            return res.send(restHelper.getSuccessResponse(resp));
        } catch (e) {
            next(e);
        }
    }

}