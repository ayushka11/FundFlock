import LoggerUtil, { ILogger } from "../utils/logger";
import ResponseUtil from "../utils/response-util";
import AffiliateService from "../services/affiliateService";
import Pagination from "../models/pagination";
import RequestUtil from "../helpers/request-util";
import { REQUEST_PARAMS } from "../constants/constants";

const restHelper = require("../helpers/restHelper");

const logger: ILogger = LoggerUtil.get("AffiliateController");
export default class AffiliateController {

    static async getAffiliate(req, res, next): Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            logger.info(`[AffiliateController] [getAffiliate] userId: ${userId} vendorId: ${vendorId}`);
            const response = await AffiliateService.getAffiliate(req.internalRestClient, userId, vendorId);
            logger.info(`[AffiliateController] [getAffiliate] response: ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    }

    static async getAffiliateUsers(req, res, next): Promise<any> {
        try {
            const {query} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            logger.info(`[AffiliateController] [getAffiliateUsers] userId: ${userId} vendorId: ${vendorId} pagination: ${JSON.stringify(pagination)}`);
            const response = await AffiliateService.getAffiliateUsers(req.internalRestClient, userId, vendorId, pagination);
            logger.info(`[AffiliateController] [getAffiliateUsers] response: ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    }

    static async getAffiliatePayments(req, res, next): Promise<any> {
        try {
            const {query} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            logger.info(`[AffiliateController] [getAffiliatePayments] userId: ${userId} vendorId: ${vendorId} pagination: ${JSON.stringify(pagination)}`);
            const response = await AffiliateService.getAffiliatePayments(req.internalRestClient, userId, vendorId, pagination);
            logger.info(`[AffiliateController] [getAffiliatePayments] response: ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    }

    static async generateAffiliateReport(req, res, next): Promise<any> {
        try {
            const {query} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const fromDate: Date | void = RequestUtil.parseQueryAsDate(query, REQUEST_PARAMS.FROM_DATE_QUERY_PARAM)
            const toDate: Date | void = RequestUtil.parseQueryAsDate(query, REQUEST_PARAMS.TO_DATE_QUERY_PARAM);
            logger.info(`[AffiliateController] [generateAffiliateReport] userId: ${userId} vendorId: ${vendorId} fromDate: ${fromDate} toDate: ${toDate}`);
            const response = await AffiliateService.generateAffiliateReport(req.internalRestClient, userId, vendorId, fromDate, toDate);
            logger.info(`[AffiliateController] [generateAffiliateReport] response: ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    }

    static async getAffiliateMetaInfo(req, res, next): Promise<any> {
        try {
            logger.info(`[AffiliateController] [getAffiliateMetaInfo]`);
            const vendorId: string = req.vendorId;
            const response = await AffiliateService.getAffiliateMetaInfo(req.internalRestClient, vendorId);
            logger.info(`[AffiliateController] [getAffiliateMetaInfo] response: ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    }
}