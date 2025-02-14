import { getOnboardingScreenBannersVendor } from "../services/configService";
import LoggerUtil, { ILogger } from "../utils/logger";
import ResponseUtil from "../utils/response-util";
import PublicApiService from "../services/publicApiService";
import RequestUtil from "../helpers/request-util";
import { GMZ_VENDOR_ID, P52_VENDOR_ID, REQUEST_PARAMS } from "../constants/constants";
import { SendAppDownloadLinkRequest } from '../models/request/auth';

const logger: ILogger = LoggerUtil.get("PublicApiController");

export default class PublicApiController {

    static getOnboardingBanners = async (req, res, next) => {
        const vendorId: string = req.vendorId;
        const onboardingBanners = getOnboardingScreenBannersVendor()[vendorId];
        logger.info(`[userController] [getOnboardingBanners] onboardingBanners :: ${JSON.stringify(onboardingBanners)}`);
        ResponseUtil.sendSuccessResponse(res, onboardingBanners);
    }

    static async getAppVideos(req, res, next): Promise<any> {
        try {
            const {query} = req;
            const vendorId: string = req.vendorId;
            const screen: string = RequestUtil.parseQueryParamAsString(query, REQUEST_PARAMS.VIDEO_SCREEN);
            logger.info(`[PublicApiController] [getAppVideos] Request Vendor Id :: ${vendorId}, Screen :: ${screen}`);
            const resp = await PublicApiService.getAppVideos(req.internalRestClient, vendorId, screen);
            logger.info(`[PublicApiController] [getAppVideos] Response :: ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getPracticeAppVideos(req, res, next): Promise<any> {
        try {
            const {query} = req;
            const vendorId: string = req.vendorId;
            const screen: string = RequestUtil.parseQueryParamAsString(query, REQUEST_PARAMS.VIDEO_SCREEN);
            logger.info(`[PublicApiController] [getPracticeAppVideos] Request Vendor Id :: ${vendorId}, Screen :: ${screen}`);
            const resp = await PublicApiService.getPracticeAppVideos(screen,vendorId);
            logger.info(`[PublicApiController] [getPracticeAppVideos] Response :: ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async sendPocket52AppDownloadLink(req, res, next): Promise<any> {
        try {
            const vendorId: string = P52_VENDOR_ID;
            const reqBody: SendAppDownloadLinkRequest = req.body;
            const mobile: string = reqBody.mobile;
            logger.info(`[PublicApiController] [sendPocket52AppDownloadLink] Request Vendor Id :: ${vendorId} ,Mobile :: ${mobile}`);
            const resp = await PublicApiService.sendAppDownloadLink(req, mobile, vendorId, false);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async sendPocket52RummyAppDownloadLink(req, res, next): Promise<any> {
        try {
            const vendorId: string = P52_VENDOR_ID;
            const reqBody: SendAppDownloadLinkRequest = req.body;
            const mobile: string = reqBody.mobile;
            logger.info(`[PublicApiController] [sendPocket52RummyAppDownloadLink] Request Vendor Id :: ${vendorId} ,Mobile :: ${mobile}`);
            const resp = await PublicApiService.sendAppDownloadLink(req, mobile, vendorId, true);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async sendGamezyAppDownloadLink(req, res, next): Promise<any> {
        try {
            const vendorId: string = GMZ_VENDOR_ID;
            const reqBody: SendAppDownloadLinkRequest = req.body;
            const mobile: string = reqBody.mobile;
            logger.info(`[PublicApiController] [sendGamezyAppDownloadLink] Request Vendor Id :: ${vendorId} ,Mobile :: ${mobile}`);
            const resp = await PublicApiService.sendAppDownloadLink(req, mobile, vendorId, false);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }
};