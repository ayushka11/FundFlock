import { COMMUNICATION_REQUEST_PARAMS } from "../constants/communication-constants";
import EventNames from "../producer/enums/eventNames";
import EventPushService from "../producer/eventPushService";
import LoggerUtil, {ILogger} from "../utils/logger";
import RequestUtil from "../utils/request-util";
import ResponseUtil from "../utils/response-util";
import VendorUtil from "../utils/vendor-utils";

const restHelper = require("../helpers/restHelper");
const communicationService = require("../services/communicationService");
const logger: ILogger = LoggerUtil.get("CommunicationController");
export default class CommunicationController {
    static async processSmsWebhook(req, res, next): Promise<any> {
        logger.info(`[CommunicationController] [processSmsWebhook]`);
        try {
            const {query,params} = req;
            logger.info(`[CommunicationController] [processSmsWebhook] got the query as :: `,query);
            const vendor: string = RequestUtil.parseQueryParamAsString(params, COMMUNICATION_REQUEST_PARAMS.VENDOR);
            logger.info(`[CommunicationController] [processSmsWebhook] vendor :: ${vendor}`);
            const vendorId: number = VendorUtil.getVendorIdFromName(vendor);
            logger.info(`[CommunicationController] [processSmsWebhook] vendorId :: ${vendorId}`);
            const smsResponse: any = await communicationService.processSmsWebhook(req.internalRestClient,query,vendorId);
            ResponseUtil.sendSuccessResponse(res, smsResponse);
        } catch (e) {
            next(e);
        }
    };

    static async sendAppDownloadSms(req, res, next): Promise<any> {
        logger.info(`[CommunicationController] [sendAppDownloadSms]`);
        try{
            const vendorId = req.vendorId;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const deviceInfo: any = req.sessionManager.getUserDeviceInfo();
            
            logger.info(`[CommunicationController] [sendAppDownloadSms] userId :: ${userId}  vendorId :: ${vendorId}`);
            const eventData = {};
            EventPushService.push(Number(userId), Number(vendorId),"", EventNames.PRACTICE_APP_DOWNLOAD_SMS, eventData);
            ResponseUtil.sendSuccessResponse(res, {});
        }catch(e){
            logger.error(e,`[CommunicationController] [sendAppDownloadSms] error`)
            next(e);
        }
    }
}
