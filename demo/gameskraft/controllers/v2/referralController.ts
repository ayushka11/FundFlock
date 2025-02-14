import {REFERRAL_REQUEST_PARAMS} from "../../constants/referral-constants";
import Pagination from "../../models/pagination";
import ReferralServiceV2 from "../../services/v2/referralService";
import LoggerUtil, {ILogger} from "../../utils/logger";
import RequestUtil from "../../utils/request-util";
import ResponseUtil from "../../utils/response-util";

const logger: ILogger = LoggerUtil.get("ReferralControllerV2");

export default class ReferralController {

    static async getUserReferees(req, res, next): Promise<any> {
        try {
            const { query } = req;
            logger.info(`[ReferralControllerV2] [getUserReferees] Request query :: ${JSON.stringify(query)}`)
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            logger.info(`[ReferralControllerV2] [getUserReferees] Request userId :: ${userId} query :: ${JSON.stringify(query)}`)
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            const refereeFilter: number = RequestUtil.parseQueryParamAsNumber(query, REFERRAL_REQUEST_PARAMS.REFEREE_FILTER);
            logger.info(`[ReferralControllerV2] [getUserReferees] Request userId :: ${userId} refereeFilter :: ${refereeFilter} pagination :: numOfRecords :: ${pagination.numOfRecords} offset :: ${pagination.offset}`);
            const userReferees: any = await ReferralServiceV2.getUserReferees(req.internalRestClient, userId, vendorId, refereeFilter, pagination);
            logger.info(`[ReferralControllerV2] [getUserReferees] Response userId :: ${userId} refereeFilter :: ${refereeFilter} userReferees :: ${JSON.stringify(userReferees)}`);
            ResponseUtil.sendSuccessResponse(res, userReferees);
        } catch (e) {
            next(e);
        }
    }

    static async getReferralDetails(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            logger.info(`[ReferralControllerV2] [getReferralDetails] Request userId :: ${userId}`);
            const getReferAndEarnDetails: any = await ReferralServiceV2.getReferralDetails(req.internalRestClient, userId, vendorId);
            logger.info(`[ReferralControllerV2] [getReferralDetails] Response userId :: ${userId} getReferAndEarnDetails :: ${JSON.stringify(getReferAndEarnDetails)}`);
            ResponseUtil.sendSuccessResponse(res, getReferAndEarnDetails);
        } catch (e) {
            next(e);
        }
    }

    static async getUserReferralStats(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            logger.info(`[ReferralControllerV2] [getUserReferralStats] Request userId :: ${userId}`);
            const userReferralStats: any = await ReferralServiceV2.getUserReferralStats(req.internalRestClient, userId);
            logger.info(`[ReferralControllerV2] [getUserReferralStats] Request userId :: ${userId} userReferralStats :: ${JSON.stringify(userReferralStats)}`);
            ResponseUtil.sendSuccessResponse(res, userReferralStats);
        } catch (e) {
            next(e);
        }
    }

};