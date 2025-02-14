import ConcordiaService from "../services/concordiaService";
import LoggerUtil, { ILogger } from "../utils/logger";
import ResponseUtil from "../utils/response-util";

const logger: ILogger = LoggerUtil.get("PolicyController");

export default class PolicyController {
    static async getUserPolicy(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            logger.info({UserUniqueId: userUniqueId,userId}, `[PolicyController] [getUserPolicy] `);
            const resp = await ConcordiaService.getUserMigrationPolicy(req.internalRestClient, userUniqueId, userId, vendorId);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async createUserPolicyAcknowledgement(req, res, next): Promise<any> {
        try {
            const {params, query} = req;
            const {body} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            logger.info({UserUniqueId: userUniqueId,userId}, `[PolicyController] [getUserPolicy] `);
            const resp = await ConcordiaService.createUserMigrationAcknowledgement(req.internalRestClient, userUniqueId, body,userId,vendorId);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }
}