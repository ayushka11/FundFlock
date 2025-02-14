import RequestUtil from "../helpers/request-util";
import RegosService from "../services/regosService";
import ResponseUtil from "../utils/response-util";
import VendorUtil from "../utils/vendor-utils";
import LoggerUtil, {ILogger} from '../utils/logger';
import { RegosServiceConstants } from "../constants/regos-service-constants";
const logger: ILogger = LoggerUtil.get("RegosController");

export default class RegosController {
    static async allocateRewardWebhook(req,res,next): Promise<any> {
        try {
            const {params,body} = req;
            const vendor: string = RequestUtil.parseQueryParamAsString(params, RegosServiceConstants.REGOS_SERVICE_REQUEST_PARAM.VENDOR);
            const vendorId: number = VendorUtil.getVendorIdFromName(vendor);
            logger.info(`recvd. allocation webhook for :: `,{rewardEvent :body, vendor:vendor,vendorId});
            await RegosService.allocateRewardWebhook(req.internalRestClient, body,vendorId,req.internalRestClient.getRequestId());
            return ResponseUtil.sendSuccessResponse(res, {});
        } catch (error) {
            logger.info(error,'got error from [allocateRewardWebhook]')
            next(error);
        }
    }
}