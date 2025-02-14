import {GMZ_VENDOR_ID, P52_VENDOR_ID, PAGINATION} from "../constants/constants";
import PlanetServiceErrorUtil from "../errors/planet/planet-error-util";
import {DeviceInfo, PayinInitiateOrder} from "../models/payin/request";
import PayinService from "../services/payinService";
import PayinServiceV2 from "../services/v2/payinService";
import LoggerUtil, {ILogger} from "../utils/logger";
import {getOrderIdfromQuery, getPayinInitiatePaymentOrderRequest, getPromo, getUserRefunds} from "../utils/payin-util";
import {getPlatform} from "../utils/platform-util";
import ResponseUtil from "../utils/response-util";

const restHelper = require("../helpers/restHelper");

const logger: ILogger = LoggerUtil.get("PayinController");

export default class PayinController {
    // remove this function

    static async getUserPaymentMethods(req, res, next): Promise<any> {
        logger.info(`[PayinController] [getUserPaymentMethods]`);
        try {
            const headers = req.headers;
            const platform: string = getPlatform(headers);
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            logger.info(`[PayinController] [getUserPaymentMethods] payinCustomerId :: ${payinCustomerId}`);
            const userPaymentMethods: any = await PayinService.getUserPaymentMethods(userId, payinCustomerId, platform, req.internalRestClient, vendorId);
            ResponseUtil.sendSuccessResponse(res, userPaymentMethods);
        } catch (e) {
            next(e);
        }
    };

    static async reverseUserRefund(req, res, next): Promise<any> {
        logger.info(`[PayinController] [reverseUserRefund]`);
        try {
            const {body} = req;
            const vendorId: string = req.vendorId;
            logger.info(`[PayinController] [reverseUserRefund] body :: ${JSON.stringify(body)}`);
            const reverseUserRefundResponse: any = await PayinService.reverseUserRefund(body, req.internalRestClient, vendorId);
            ResponseUtil.sendSuccessResponse(res, reverseUserRefundResponse);
        } catch (e) {
            next(e);
        }
    };

    static async getUserOrderStatus(req, res, next): Promise<any> {
        logger.info(`[PayinController] [getUserOrderStatus]`);
        try {
            const {query} = req;
            const orderId: string = getOrderIdfromQuery(query);
            const userId: string = req.sessionManager.getLoggedInUserId();
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            const vendorId: string = req.vendorId;
            logger.info(`[PayinController] [getUserOrderStatus] orderId :: ${(orderId)}  userId :: ${userId} payinCustomerId :: ${payinCustomerId}`);
            const userorderStatus: any = await PayinService.getUserOrderStatus(orderId, userId, payinCustomerId, req.internalRestClient, vendorId);
            logger.info(`[PayinController] [getUserOrderStatus] userorderStatus :: ${JSON.stringify(userorderStatus)}`);
            ResponseUtil.sendSuccessResponse(res, userorderStatus);
        } catch (e) {
            next(e);
        }
    };

    static async initiatePayment(req, res, next): Promise<any> {
        logger.info(`[PayinController] [initiatePayment]`);
        try {
            const LocationDetails = req.sessionManager.getLocation();
            if (!LocationDetails) {
                throw PlanetServiceErrorUtil.getLocationDetailsNotFound();
            }
            const isAllowed = LocationDetails.isAllowed;
            if (!isAllowed) {
                throw PlanetServiceErrorUtil.getLocationRestrictedByGeoCoordinate();
            }
            const userId: string = req.sessionManager.getLoggedInUserId();
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            const deviceInfo: any = req.sessionManager.getUserDeviceInfo();
            const vendorId: string = req.vendorId;
            const platform = req.headers["gk-platform"];
            const deviceDetails: DeviceInfo = {
                appVersionName: deviceInfo['gk-app-version-name'],
                platform: platform,
                osVersion: deviceInfo.osVersion,
                clientIpAddress: req.sessionManager.getClientIp(),
            }
            logger.info(`[PayinController] [initiatePayment] userId :: ${userId}`);
            const {body} = req;
            const initiatePaymentRequest: PayinInitiateOrder = getPayinInitiatePaymentOrderRequest(body);
            const promo: string = getPromo(body);
            logger.info(`[PayinController] [initiatePayment] initiatePaymentRequest :: ${JSON.stringify(initiatePaymentRequest)} promo :: ${promo}`);
            const userInitiatePaymentResponse: any = await PayinService.initiatePayment(userId, payinCustomerId, initiatePaymentRequest, promo, deviceDetails, req.internalRestClient, vendorId)
            ResponseUtil.sendSuccessResponse(res, userInitiatePaymentResponse);
        } catch (e) {
            next(e);
        }
    };

    static async processTenetPaymentWebhookResponse(req, res, next): Promise<any> {
        logger.info(`[PayinController] [processTenetPaymentWebhookResponse]`);
        try {
            logger.info(`[PayinController] [processTenetPaymentWebhookResponse]`);
            const {body} = req;
            const vendorId = P52_VENDOR_ID;
            logger.info(`[PayinController] [processTenetPaymentWebhookResponse]  successResponse :: ${JSON.stringify(body)}`);
            const webhookSuccessResponse: any = await PayinService.processTenetPaymentWebhookResponse(body, vendorId, req.internalRestClient);
            ResponseUtil.sendSuccessResponse(res, webhookSuccessResponse);
        } catch (e) {
            next(e);
        }
    };

    static async processTenetPaymentWebhookResponseGmz(req, res, next): Promise<any> {
        logger.info(`[PayinController] [processTenetPaymentWebhookResponseGmz]`);
        try {
            logger.info(`[PayinController] [processTenetPaymentWebhookResponseGmz]`);
            const {body} = req;
            const vendorId = GMZ_VENDOR_ID;
            logger.info(`[PayinController] [processTenetPaymentWebhookResponseGmz]  successResponse :: ${JSON.stringify(body)}`);
            const webhookSuccessResponse: any = await PayinService.processTenetPaymentWebhookResponse(body, vendorId, req.internalRestClient);
            ResponseUtil.sendSuccessResponse(res, webhookSuccessResponse);
        } catch (e) {
            next(e);
        }
    };

    static async paymentSuccessFromSDK(req, res, next): Promise<any> {
        logger.info(`[PayinController] [paymentSuccessFromSDK]`);
        try {
            logger.info(`[PayinController] [paymentSuccessFromSDK]`);
            const {query} = req;
            const {body} = req;
            const postParams: any = body;
            const redirectionFlow: boolean = false;
            const vendorId: string = req.vendorId;
            logger.info(`[PayinController] [paymentSuccessFromSDK] query :: ${JSON.stringify(query)} postParams :: ${JSON.stringify(postParams)} redirectionFlow :: ${redirectionFlow}`);
            const webhookSuccessResponse: any = await PayinService.paymentSuccessFromSDK(query, postParams, redirectionFlow, req.internalRestClient, vendorId);
            ResponseUtil.sendSuccessResponse(res, webhookSuccessResponse);
        } catch (e) {
            next(e);
        }
    };

    static async paymentSuccessFromWeb(req, res, next): Promise<any> {
        logger.info(`[PayinController] [paymentSuccessFromWeb]`);
        try {
            logger.info(`[PayinController] [paymentSuccessFromWeb]`);
            const {query} = req;
            const {body} = req;
            const postParams: any = body;
            const vendorId: string = P52_VENDOR_ID;
            const redirectionFlow: boolean = true;
            logger.info(`[PayinController] [paymentSuccessFromWeb] query :: ${JSON.stringify(query)} postParams :: ${JSON.stringify(postParams)} redirectionFlow :: ${redirectionFlow}`);
            const webhookSuccessResponse: any = await PayinServiceV2.paymentSuccessFromSDKV2(query, postParams, redirectionFlow, req.internalRestClient, vendorId,null,null);
            logger.info(`[PayinController] [paymentSuccessFromWeb] redirecting to payment success page`);
            next();
        } catch (e) {
            next(e);
        }
    };

    static async paymentSuccessFromWebGmz(req, res, next): Promise<any> {
        logger.info(`[PayinController] [paymentSuccessFromWeb]`);
        try {
            logger.info(`[PayinController] [paymentSuccessFromWeb]`);
            const {query} = req;
            const {body} = req;
            const postParams: any = body;
            const vendorId: string = GMZ_VENDOR_ID;
            const redirectionFlow: boolean = true;
            logger.info(`[PayinController] [paymentSuccessFromWeb] query :: ${JSON.stringify(query)} postParams :: ${JSON.stringify(postParams)} redirectionFlow :: ${redirectionFlow}`);
            const webhookSuccessResponse: any = await PayinServiceV2.paymentSuccessFromSDKV2(query, postParams, redirectionFlow, req.internalRestClient,vendorId,null,null);
            logger.info(`[PayinController] [paymentSuccessFromWeb] redirecting to payment success page`);
            next();
        } catch (e) {
            next(e);
        }
    };

    static async updatePaymentOrderStatus(req, res, next): Promise<any> {
        logger.info(`[PayinController] [updatePaymentOrderStatus]`);
        try {
            logger.info(`[PayinController] [updatePaymentOrderStatus]`);
            const {query} = req;
            const {body} = req;
            const vendorId: string = req.vendorId;
            const postParams: any = body || {};
            logger.info(`[PayinController] [updatePaymentOrderStatus] query :: ${JSON.stringify(query)} postParams :: ${JSON.stringify(postParams)}`);
            const orderStatusResponse: any = await PayinService.updatePaymentOrderStatus(query, postParams, req.internalRestClient, vendorId);
            ResponseUtil.sendSuccessResponse(res, orderStatusResponse);
        } catch (e) {
            next(e);
        }
    };

    static async deletePaymentMethod(req, res, next): Promise<any> {
        logger.info(`[PayinController] [deletePaymentMethod]`);
        try {
            logger.info(`[PayinController] [deletePaymentMethod]`);
            const {body} = req;
            logger.info(`[PayinController] [deletePaymentMethod]  paymentMethod :: ${JSON.stringify(body)}`);
            const vendorId: string = req.vendorId;
            const deletePaymentMethodResponse: any = await PayinService.deletePaymentMethod(body, req.internalRestClient, vendorId);
            ResponseUtil.sendSuccessResponse(res, deletePaymentMethodResponse);
        } catch (e) {
            next(e);
        }
    };

    static async getUserRefundDetails(req, res, next): Promise<any> {
        logger.info(`[PayinController] [getUserRefundDetails]`);
        try {
            const vendorId: string = req.vendorId;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            logger.info(`[PayinController] [getUserRefundDetails] payinCustomerId :: ${payinCustomerId}`);
            const userRefundDetails: any = await PayinService.getUserRefundDetails(userId, vendorId, payinCustomerId, req.internalRestClient);
            ResponseUtil.sendSuccessResponse(res, userRefundDetails);
        } catch (e) {
            next(e);
        }
    };

    static async initiateUserRefund(req, res, next): Promise<any> {
        logger.info(`[PayinController] [initiateUserRefund]`);
        try {
            const {body} = req;
            const vendorId: string = req.vendorId;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const payinCustomerId = req.sessionManager.getPayinCustomerId();
            const deviceInfo = req.sessionManager.getUserDeviceInfo();
            logger.info(`[PayinController] [initiateUserRefund] userId :: ${userId}`);
            const userRefunds = getUserRefunds(body);
            const userRefundResponse: any = await PayinService.initiateUserRefund(userId, vendorId, payinCustomerId, userRefunds, req.internalRestClient, deviceInfo['gk-app-type']);
            ResponseUtil.sendSuccessResponse(res, userRefundResponse);
        } catch (e) {
            next(e);
        }
    };

    static async getUserAddCashHistory(req, res, next): Promise<any> {
        logger.info(`[PayinController] [getUserAddCashHistory]`);
        try {
            const {query} = req;
            const pageNumber: number = query.page;
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            const vendorId: string = req.vendorId;
            logger.info(`[PayinController] [getUserAddCashHistory] payinCustomerId :: ${payinCustomerId}`);
            const userAddCashHistory: any = await PayinService.getUserAddCashHistory(req, payinCustomerId, pageNumber, PAGINATION.DEFAULT_NUM_OF_RECORDS, null, vendorId);
            ResponseUtil.sendSuccessResponse(res, userAddCashHistory);
        } catch (e) {
            next(e);
        }
    }

    static async getUserAddCashRefundHistory(req, res, next): Promise<any> {
        logger.info(`[PayinController] [getUserAddCashRefundHistory]`);
        try {
            const {query} = req;
            const pageNumber: number = query.page;
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            const vendorId: string = req.vendorId;
            logger.info(`[PayinController] [getUserAddCashRefundHistory] payinCustomerId :: ${payinCustomerId}`);
            const userAddCashRefundHistory: any = await PayinService.getUserAddCashRefundHistory(req, payinCustomerId, pageNumber, PAGINATION.DEFAULT_NUM_OF_RECORDS, vendorId);
            ResponseUtil.sendSuccessResponse(res, userAddCashRefundHistory);
        } catch (e) {
            next(e);
        }
    }
}
