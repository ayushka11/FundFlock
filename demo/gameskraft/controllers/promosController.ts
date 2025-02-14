import {UserPromoQueryRequest} from "../models/promos/request";
import PromosService from "../services/promosService";
import LoggerUtil, {ILogger} from "../utils/logger";
import {getPromoDetailsFromQuery} from "../utils/promos-util";
import ResponseUtil from "../utils/response-util";

const restHelper = require("../helpers/restHelper");
const logger: ILogger = LoggerUtil.get("promosController");

export default class promosController {
    // depriciated function pls donot use this
    static async getUserPromos(req, res, next): Promise<any> {
        logger.info(`[promosController] [getUserPromos]`);
        try {
            const {query, params} = req;
            const vendorId: string = req.vendorId;
            const userPromoQueryRequest: UserPromoQueryRequest = getPromoDetailsFromQuery(query, vendorId);
            const userId: string = req.sessionManager.getLoggedInUserId();
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            logger.info(`[promosController] [getUserPromos] userId :: ${userId} for promoType :: ${userPromoQueryRequest.promoType} vendorId:: ${vendorId}`);
            const userPromos: any = await PromosService.getUserPromos(userId, userPromoQueryRequest, req.internalRestClient, vendorId);
            ResponseUtil.sendSuccessResponse(res, userPromos);
        } catch (e) {
            next(e);
        }
    };

    static async getUserOffers(req, res, next): Promise<any> {
        logger.info(`[promosController] [getUserOffers]`);
        try {
            logger.info(`[promosController] [getUserOffers]`);
            const userOffers: any = await PromosService.getUserOffer();
            ResponseUtil.sendSuccessResponse(res, userOffers);
        } catch (e) {
            next(e);
        }
    }

}
