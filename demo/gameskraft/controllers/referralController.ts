import {REFERRAL_REQUEST_PARAMS} from "../constants/referral-constants";
import Pagination from "../models/pagination";
import ReferralService from "../services/referralService";
import LoggerUtil, {ILogger} from "../utils/logger";
import RequestUtil from "../utils/request-util";
import ResponseUtil from "../utils/response-util";

const logger: ILogger = LoggerUtil.get("ReferralController");

export default class ReferralController {

    static async getUserReferees(req, res, next): Promise<any> {
        try {
            const {query} = req;
            logger.info(`[ReferralController] [getUserReferees] Request query :: ${JSON.stringify(query)}`)
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            logger.info(`[ReferralController] [getUserReferees] Request userId :: ${userId} query :: ${JSON.stringify(query)}`)
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            const refereeFilter: number = RequestUtil.parseQueryParamAsNumber(query, REFERRAL_REQUEST_PARAMS.REFEREE_FILTER);
            logger.info(`[ReferralController] [getUserReferees] Request userId :: ${userId} refereeFilter :: ${refereeFilter} pagination :: numOfRecords :: ${pagination.numOfRecords} offset :: ${pagination.offset}`);
            const userReferees: any = await ReferralService.getUserReferees(req.internalRestClient, userId, vendorId, refereeFilter, pagination);
            logger.info(`[ReferralController] [getUserReferees] Response userId :: ${userId} refereeFilter :: ${refereeFilter} userReferees :: ${JSON.stringify(userReferees)}`);
            ResponseUtil.sendSuccessResponse(res, userReferees);
        } catch (e) {
            next(e);
        }
    }

    static async getReferralDetails(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            logger.info(`[ReferralController] [getReferralDetails] Request userId :: ${userId}`);
            const getReferAndEarnDetails: any = await ReferralService.getReferralDetails(req.internalRestClient, userId, vendorId);
            logger.info(`[ReferralController] [getReferralDetails] Response userId :: ${userId} getReferAndEarnDetails :: ${JSON.stringify(getReferAndEarnDetails)}`);
            ResponseUtil.sendSuccessResponse(res, getReferAndEarnDetails);
        } catch (e) {
            next(e);
        }
    }

    static async getUserReferralStats(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            logger.info(`[ReferralController] [getUserReferralStats] Request userId :: ${userId}`);
            const userReferralStats: any = await ReferralService.getUserReferralStats(req.internalRestClient, userId);
            logger.info(`[ReferralController] [getUserReferralStats] Request userId :: ${userId} userReferralStats :: ${JSON.stringify(userReferralStats)}`);
            ResponseUtil.sendSuccessResponse(res, userReferralStats);
        } catch (e) {
            next(e);
        }
    }

    static async validateReferCode(req, res, next): Promise<any> {
        try {
            const {params} = req;
            logger.info(`[ReferralController] [validateReferCode] params :: ${params}`);
            const referCode: string = RequestUtil.parseQueryParamAsString(params, REFERRAL_REQUEST_PARAMS.REFER_CODE);
            logger.info(`[ReferralController] [validateReferCode] referCode :: ${referCode} params :: ${params}`);
            const validateReferCodeResp = await ReferralService.validateReferCode(req.internalRestClient, referCode);
            logger.info(`[ReferralController] [validateReferCode] referCode :: ${referCode} validateReferCodeResp :: ${JSON.stringify(validateReferCodeResp)}`);
            ResponseUtil.sendSuccessResponse(res, validateReferCodeResp);
        } catch (e) {
            next(e);
        }
    }

    static async getUserReferralSharePayload(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            logger.info(`[ReferralController] [getUserReferralSharePayload] userId :: ${userId}`);
            const userReferralSharePayloadResp: any = await ReferralService.getUserReferralSharePayload(req.internalRestClient, userId);
            logger.info(`[ReferralController] [getUserReferralSharePayload] userId :: ${userId} userReferralSharePayloadResp :: ${JSON.stringify(userReferralSharePayloadResp)}`);
            ResponseUtil.sendSuccessResponse(res, userReferralSharePayloadResp);
        } catch (e) {
            next(e);
        }
    }

};