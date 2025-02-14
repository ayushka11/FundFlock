const restHelper = require('../helpers/restHelper');
const configService = require('../services/configService');
import UserFeedbackService from "../services/userFeedbackService";
import LoggerUtil, {ILogger} from "../utils/logger";
import ResponseUtil from "../utils/response-util";

const logger: ILogger = LoggerUtil.get("UserFeedbackController");

export default class UserFeedbackController {

    static async pushUserFeedback(req, res, next) {
        try {
            const userId = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const deviceInfo = req.sessionManager.getUserDeviceInfo();
            const userMessage = req.body?.message;
            logger.info(`User Feedback received by userId ${userId}`);
            await UserFeedbackService.pushUserFeedback(req, userId, vendorId, userMessage, deviceInfo);
            ResponseUtil.sendSuccessResponse(res, {
                "msg": configService.getUserFeedbackMessageOnReceive()
            });
        } catch (e) {
            logger.error(`Error in pushUserFeedback ${e}` && e.message);
            next(e);
        }
    }
};