import {PAGINATION} from "../../constants/constants";
import {
    PAYIN_EXCLUSIVE_STATE_CODE,
    PAYIN_REQUEST_PARAMS,
    PAYIN_STATE_CODE_DAMAN_AND_DIU_DADRA_NAGAR_HAVELI
} from "../../constants/payin-constants";
import PlanetServiceErrorUtil from "../../errors/planet/planet-error-util";
import {DeviceInfo, PayinInitiateOrderV2} from "../../models/payin/request";
import PayinService from "../../services/payinService";
import PayinServiceV2 from "../../services/v2/payinService";
import LoggerUtil, {ILogger} from "../../utils/logger";
import {getOrderIdfromQuery, getPayinInitiatePaymentOrderRequest, getPromo, getUserRefunds} from "../../utils/payin-util";
import RequestUtil from "../../utils/request-util";
import ResponseUtil from "../../utils/response-util";
import VendorUtil from "../../utils/vendor-utils";


const logger: ILogger = LoggerUtil.get("PayinControllerV2");

export default class PayinControllerV2 {


    static async initiatePayment(req, res, next): Promise<any> {
        // get the location
        // check if the user from a non banned state
        // if yes get the details of the user from idm
        // fill the additional details and create the order
        // also take the vendor id for the same
        logger.info(`[PayinControllerV2] [initiatePayment]`);
        try {
            const isAllowed: boolean = req.sessionManager.getLocation()?.isAllowed;
            if (!isAllowed) {
                throw PlanetServiceErrorUtil.getLocationRestrictedByGeoCoordinate();
            }
            let gstStateCode: number = req.sessionManager.getLocation().gstStateCode;
            if (PAYIN_EXCLUSIVE_STATE_CODE.includes(gstStateCode)) {
                gstStateCode = PAYIN_STATE_CODE_DAMAN_AND_DIU_DADRA_NAGAR_HAVELI;
            }
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            const deviceInfo: any = req.sessionManager.getUserDeviceInfo();
            const platform = req.headers["gk-platform"]
            const deviceDetails: DeviceInfo = {
                appVersionName: deviceInfo['gk-app-version-name'],
                platform: platform,
                osVersion: deviceInfo.osVersion,
                clientIpAddress: req.sessionManager.getClientIp(),
            }
            logger.info(`[PayinControllerV2] [initiatePayment] userId :: ${userId}`);
            const {body} = req;
            const initiatePaymentRequest: PayinInitiateOrderV2 = getPayinInitiatePaymentOrderRequest(body);
            const promo: string = getPromo(body);
            logger.info(`[PayinControllerV2] [initiatePayment] initiatePaymentRequest :: ${JSON.stringify(initiatePaymentRequest)} promo :: ${promo}`);
            const userInitiatePaymentResponse: any = await PayinServiceV2.initiatePayment(userId, payinCustomerId, initiatePaymentRequest, promo, vendorId, gstStateCode, deviceDetails, req.internalRestClient)
            return ResponseUtil.sendSuccessResponse(res, userInitiatePaymentResponse);
        } catch (e) {
            next(e);
        }
    };


    static async getUserOrderStatus(req, res, next): Promise<any> {
        logger.info(`[PayinControllerV2] [getUserOrderStatus]`);
        try {
            const {query} = req;
            const orderId: string = getOrderIdfromQuery(query);
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            logger.info(`[PayinControllerV2] [getUserOrderStatus] orderId :: ${(orderId)}  userId :: ${userId} payinCustomerId :: ${payinCustomerId}`);
            const userorderStatus: any = await PayinServiceV2.getUserOrderStatus(orderId, userId, payinCustomerId, vendorId, req.internalRestClient);
            logger.info(`[PayinControllerV2] [getUserOrderStatus] userorderStatus :: ${JSON.stringify(userorderStatus)}`);

            return ResponseUtil.sendSuccessResponse(res, userorderStatus);
        } catch (e) {
            next(e);
        }
    };

    static async getCardDetails(req,res,next): Promise<any> {
        logger.info(`[PayinControllerV2] [getCardDetails]`);
        try {
            const {body} = req;
            const vendorId: string = req.vendorId;
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            logger.info(`[PayinControllerV2] [getCardDetails] body :: ${(body)} payinCustomerId :: ${payinCustomerId}`);
            const validationResponse: any = await PayinServiceV2.getCardDetails(body, payinCustomerId, vendorId, req.internalRestClient);
            logger.info(`[PayinControllerV2] [getCardDetails] userorderStatus :: ${JSON.stringify(validationResponse)}`);

            return ResponseUtil.sendSuccessResponse(res, validationResponse);
        } catch (e) {
            next(e);
        }
    }

    static async getUserOrderDetails(req, res, next): Promise<any> {
        logger.info(`[PayinControllerV2] [getUserOrderDetails]`);
        try {
            const {query} = req;
            const orderId: string = getOrderIdfromQuery(query);
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            logger.info(`[PayinControllerV2] [getUserOrderDetails] orderId :: ${(orderId)}  userId :: ${userId} payinCustomerId :: ${payinCustomerId}`);
            const userorderDetails: any = await PayinServiceV2.getUserOrderDetails(orderId, userId, payinCustomerId, vendorId, req.internalRestClient);
            logger.info(`[PayinControllerV2] [getUserOrderDetails] userorderStatus :: ${JSON.stringify(userorderDetails)}`);

            return ResponseUtil.sendSuccessResponse(res, userorderDetails);
        } catch (e) {
            next(e);
        }
    };

    static async processTenetPaymentWebhookResponseV2(req, res, next): Promise<any> {
        logger.info(`[PayinControllerV2] [processTenetPaymentWebhookResponseV2]`);
        try {
            logger.info(`[PayinControllerV2] [processTenetPaymentWebhookResponseV2]`);
            const {body, params} = req;
            const vendor: string = RequestUtil.parseQueryParamAsString(params, PAYIN_REQUEST_PARAMS.VENDOR);
            logger.info(`[PayinControllerV2] [processTenetPaymentWebhookResponseV2] vendor :: ${vendor}`);
            const vendorId: number = VendorUtil.getVendorIdFromName(vendor);
            logger.info(`[PayinControllerV2] [processTenetPaymentWebhookResponseV2] vendorId :: ${vendorId}`);
            logger.info(`[PayinControllerV2] [processTenetPaymentWebhookResponseV2]  successResponse :: ${JSON.stringify(body)}`);
            const webhookSuccessResponse: any = await PayinServiceV2.processTenetPaymentWebhookResponseV2(body, `${vendorId}`, req.internalRestClient);
            return ResponseUtil.sendSuccessResponse(res, webhookSuccessResponse);
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
            logger.info(`[PayinControllerV2] [getUserAddCashHistory] payinCustomerId :: ${payinCustomerId}`);
            const userAddCashHistory: any = await PayinServiceV2.getUserAddCashHistory(req, payinCustomerId, pageNumber, PAGINATION.DEFAULT_NUM_OF_RECORDS, vendorId);
            return ResponseUtil.sendSuccessResponse(res, userAddCashHistory);
        } catch (e) {
            next(e);
        }
    }

    static async getUserAddCashRefundHistory(req, res, next): Promise<any> {
        logger.info(`[PayinControllerV2] [getUserAddCashRefundHistory]`);
        try {
            const {query} = req;
            const pageNumber: number = query.page;
            const vendorId: string = req.vendorId;
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            logger.info(`[PayinControllerV2] [getUserAddCashRefundHistory] payinCustomerId :: ${payinCustomerId}`);
            const userAddCashRefundHistory: any = await PayinService.getUserAddCashRefundHistory(req, payinCustomerId, pageNumber, PAGINATION.DEFAULT_NUM_OF_RECORDS, vendorId);
            return ResponseUtil.sendSuccessResponse(res, userAddCashRefundHistory);
        } catch (e) {
            next(e);
        }
    }

    static async paymentSuccessFromSDKV2(req, res, next): Promise<any> {
        logger.info(`[PayinControllerV2] [paymentSuccessFromSDKV2]`);
        try {
            logger.info(`[PayinControllerV2] [paymentSuccessFromSDKV2]`);
            const {query} = req;
            const {body} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            const postParams: any = body;
            const redirectionFlow: boolean = false;
            const vendorId: string = req.vendorId;
            logger.info(`[PayinControllerV2] [paymentSuccessFromSDKV2] query :: ${JSON.stringify(query)} postParams :: ${JSON.stringify(postParams)} redirectionFlow :: ${redirectionFlow}`);
            const webhookSuccessResponse: any = await PayinServiceV2.paymentSuccessFromSDKV2(query, postParams, redirectionFlow, req.internalRestClient, vendorId,userId,payinCustomerId);
            ResponseUtil.sendSuccessResponse(res, webhookSuccessResponse);
        } catch (e) {
            next(e);
        }
    };

    static async getUserRefundDetails(req,res,next): Promise<any> {
        logger.info(`[PayinControllerV2] [getUserRefundDetails]`);
        try {
            logger.info(`[PayinControllerV2] [getUserRefundDetails]`);
            const {body, params} = req;
            const vendor: string = RequestUtil.parseQueryParamAsString(params, PAYIN_REQUEST_PARAMS.VENDOR);
            const userId: string = RequestUtil.parseQueryParamAsString(params, PAYIN_REQUEST_PARAMS.USER_ID);
            logger.info(`[PayinControllerV2] [getUserRefundDetails] vendor :: ${vendor} userId :: ${userId}`);
            const vendorId: number = VendorUtil.getVendorIdFromName(vendor);
            logger.info(`[PayinControllerV2] [getUserRefundDetails] vendorId :: ${vendorId}`);
            const refundDetails: any = await PayinServiceV2.getUserRefundDetails(userId, `${vendorId}`, req.internalRestClient);
            return ResponseUtil.sendSuccessResponse(res, refundDetails);
        } catch (e) {
            next(e);
        }
    }

    static async CreateUserRefund(req,res,next): Promise<any> {
        logger.info(`[PayinControllerV2] [CreateUserRefund]`);
        try {
            logger.info(`[PayinControllerV2] [CreateUserRefund]`);
            const {body, params} = req;
            const vendor: string = RequestUtil.parseQueryParamAsString(params, PAYIN_REQUEST_PARAMS.VENDOR);
            const userId: string = RequestUtil.parseQueryParamAsString(params, PAYIN_REQUEST_PARAMS.USER_ID);
            logger.info(`[PayinControllerV2] [CreateUserRefund] vendor :: ${vendor} userId :: ${userId}`);
            const vendorId: number = VendorUtil.getVendorIdFromName(vendor);
            logger.info(`[PayinControllerV2] [CreateUserRefund] vendorId :: ${vendorId}`);
            const userRefunds: any = getUserRefunds(body);
            const deviceInfo = req.sessionManager.getUserDeviceInfo();
            const refundOrderDetails: any = await PayinServiceV2.CreateUserRefund(userId, `${vendorId}`, userRefunds,deviceInfo,req.internalRestClient);
            return ResponseUtil.sendSuccessResponse(res, refundOrderDetails);
        } catch (e) {
            next(e);
        }
    }
}
