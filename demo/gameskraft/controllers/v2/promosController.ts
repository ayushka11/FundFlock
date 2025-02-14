import {DEFAULT_STATE_CODE} from "../../constants/planet-contants";
import {UserPromoQueryRequest} from "../../models/promos/request";
import PromosServiceV2 from "../../services/v2/promosService";
import LoggerUtil, {ILogger} from "../../utils/logger";
import {getPromoDetailsFromQuery} from "../../utils/promos-util";
import ResponseUtil from "../../utils/response-util";

const logger: ILogger = LoggerUtil.get("promosControllerV2");

export default class promosControllerV2 {

    static async getUserPromos(req, res, next): Promise<any> {
        logger.info(`[promosControllerV2] [getUserPromos]`);
        try {
            const {query, params} = req;
            const vendorId: string = req.vendorId;
            const token: string = req.cookieManager.getToken();
            const userPromoQueryRequest: UserPromoQueryRequest = getPromoDetailsFromQuery(query, vendorId);
            const gstStateCode: number = req.sessionManager.getLocation()?.gstStateCode ? req.sessionManager.getLocation()?.gstStateCode : DEFAULT_STATE_CODE;
            logger.info("got the details of the user as ::", {gstStateCode, vendorId});
            const userId: string = req.sessionManager.getLoggedInUserId();
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            logger.info(`[promosControllerV2] [getUserPromos] userId :: ${userId} for promoType :: ${userPromoQueryRequest.promoType}`);
            const userPromos: any = await PromosServiceV2.getUserPromos(userId, payinCustomerId, userPromoQueryRequest, gstStateCode, vendorId, req.internalRestClient,token);
            return ResponseUtil.sendSuccessResponse(res, userPromos);
        } catch (e) {
            next(e);
        }
    };

}