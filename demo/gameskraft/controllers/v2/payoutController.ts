import ResponseUtil from '../../utils/response-util';
import LoggerUtil, {ILogger} from '../../utils/logger';
import PayoutServiceV2 from '../../services/v2/payoutService';
import PayoutFilter from '../../models/payout/payout-filter';
import RequestUtil from '../../utils/request-util';

import {PAYOUT_REQUEST_PARAM} from '../../constants/payout-constants';
import VendorUtil from '../../utils/vendor-utils';
import {CreateUserPayoutRequestV2, ValidateUserPayoutRequestV2} from '../../models/payoutV2/request';
import { DEFAULT_STATE_CODE } from '../../constants/planet-contants';

const logger: ILogger = LoggerUtil.get('PayoutControllerV2');

export default class PayoutControllerV2 {

    static async getPayoutDetailsV2(
        req, res, next
    ): Promise<any> {
        /*
          This API/Function Gives Basic Details of Payout, e.g.
          Bank Details, KYC status, Minimum Payout Limit.
          This will be the first API frontend will call
        */

        const {params, query} = req;
        const userId: string = req.sessionManager.getLoggedInUserId();
        const vendorId: number = req.vendorId;
        logger.info(`[PayoutController] [getPayoutDetails] userId ${userId}, vendorId ${vendorId}, ${JSON.stringify(params)}, ${JSON.stringify(query)}`);
        try {
            const result: any = await PayoutServiceV2.getPayoutDetailsV2(req, userId, vendorId);
            logger.info(`[PayoutController] [getPayoutDetails]  ${JSON.stringify(result)}`);
            ResponseUtil.sendSuccessResponse(res, result);
        } catch (e) {
            logger.error(`Error in getPayoutDetails${e}` && e.message);
            next(e);
        }
    }

    static async getPayoutPacksV2(
        req, res, next
    ): Promise<any> {
        try {
            const {query} = req;
            logger.info(`[getPayoutPacksV2] ${JSON.stringify(query)}`);
            const amount: number = RequestUtil.parseQueryParamAsFloat(query, PAYOUT_REQUEST_PARAM.AMOUNT);
            const userId = req.sessionManager.getLoggedInUserId();
            const vendorId: number = req.vendorId;
            const result: any = await PayoutServiceV2.getPayoutPacksV2(
                userId, amount, vendorId
            );
            logger.info(`[getPayoutPacksV2]  ${JSON.stringify(result)}`);
            ResponseUtil.sendSuccessResponse(res, result);
        } catch (e) {
            logger.error(`Error while validating Payout and TDS calculations ${e}` && e.message);
            next(e);
        }
    }

    static async validatePayoutRequestV2(
        req, res, next
    ): Promise<any> {
        /*
          This API/Function Validate Payout with out Royalty and other system limits,
          then it validate it with Tenet, then it fetch tds details from supernova and
          send the same to client
        */
        try {
            const {body} = req;
            logger.info(`[validatePayoutRequest] ${JSON.stringify(body)}`);
            const {documentNumber, beneficiaryType} = body;
            const {amount, withdrawalPackId} = body;
            const userId = req.sessionManager.getLoggedInUserId();
            const vendorId: number = req.vendorId;
            const validateUserPayoutRequest: ValidateUserPayoutRequestV2 = {
                userId,
                amount,
                documentNumber,
                withdrawalPackId,
                beneficiaryType
            };
            const result: any = await PayoutServiceV2.validatePayoutV2(
                req, validateUserPayoutRequest, vendorId
            );
            logger.info(`[validatePayoutRequest]  ${JSON.stringify(result)}`);
            ResponseUtil.sendSuccessResponse(res, result);
        } catch (e) {
            logger.error(`Error while validating Payout and TDS calculations ${e}` && e.message);
            next(e);
        }
    }

    static async createPayoutOrderV2(
        req, res, next
    ): Promise<any> {
        /*
          This API/Function is Actual Payout Order Creation flow.
          First We Validate the Payout Order,
          then we deduct the Amount from wallet along with Tenet (through supernova)
          then we make a Tenet API call for the Order Placement
        */
        const {body} = req;
        const userId = req.sessionManager.getLoggedInUserId();
        const vendorId: number = req.vendorId;
        logger.info(`PayoutController [createPayoutOrder] userId-${userId}, body-${JSON.stringify(body)}`);
        const {documentNumber,beneficiaryType} = body;
        const {tdsTransactionId, amount, withdrawalPackId} = body;
        const createPayoutUserRequest: CreateUserPayoutRequestV2 = {
            userId,
            amount,
            documentNumber,
            tdsTransactionId,
            withdrawalPackId,
            beneficiaryType
        };
        try {
            const gstStateCode: number = req.sessionManager.getLocation()?.gstStateCode ? req.sessionManager.getLocation()?.gstStateCode : DEFAULT_STATE_CODE;
            const result: any = await PayoutServiceV2.createPayoutOrderV2(
                req, createPayoutUserRequest,gstStateCode, vendorId
            );
            logger.info(`[createPayoutOrder] Response ${JSON.stringify(result)}`);
            ResponseUtil.sendSuccessResponse(res, result);
        } catch (e) {
            logger.error(`Error in placing order${e}` && e.message);
            next(e);
        }
    }

    static async getPayoutTransactionsV2(
        req, res, next
    ): Promise<any> {

        /*
          This API/Function sends Payout History to Clients.
          It fetches Payout History based on different filter.
        */
        const userId = req.sessionManager.getLoggedInUserId();
        const vendorId: number = req.vendorId;
        const {query} = req;
        logger.info(`PayoutController [getPayoutTransactions] UserId - ${userId}, query - ${JSON.stringify(query)}`);

        const from: string = RequestUtil.parseQueryParamAsString(query, PAYOUT_REQUEST_PARAM.FROM_DATE);
        const to: string = RequestUtil.parseQueryParamAsString(query, PAYOUT_REQUEST_PARAM.TO_DATE);
        const page: number = RequestUtil.parseQueryParamAsNumber(query, PAYOUT_REQUEST_PARAM.PAGE);
        const limit: number = RequestUtil.parseQueryParamAsNumber(query, PAYOUT_REQUEST_PARAM.LIMIT);
        const status: number[] = RequestUtil.parseQueryParamAsNumberArray(query, PAYOUT_REQUEST_PARAM.STATUS);
        const transferId: string = RequestUtil.parseQueryParamAsString(query, PAYOUT_REQUEST_PARAM.TRANSFER_ID);

        const payoutFilter: PayoutFilter = {
            from,
            to,
            page,
            limit,
            transferId,
            status
        };

        try {
            const result: any = await PayoutServiceV2.getPayoutTransactionsV2(
                req, userId, vendorId, payoutFilter
            );
            logger.info(`[PayoutController] [getPayoutTransactions]  ${result}`);
            if (!result) {
                // Flag these requests, where user requests for other user orders
                throw new Error('Something Went Wrong, Please Try Again');
            }
            ResponseUtil.sendSuccessResponse(res, result);
        } catch (e) {
            logger.error(`Error in getPayoutTransactions ${e}` && e.message);
            next(e);
        }
    }

    static async getPayoutTransactionV2(
        req, res, next
    ): Promise<any> {

        /*
          This API/Function sends Payout Transaction Details of a Single Order to Client.
        */
        const userId = req.sessionManager.getLoggedInUserId();
        const vendorId: number = req.vendorId;
        const {params} = req;
        logger.info(`PayoutController [getPayoutTransaction] UserId - ${userId}, query - ${JSON.stringify(params)}`);

        const transferId: string = RequestUtil.parseQueryParamAsString(params, PAYOUT_REQUEST_PARAM.TRANSFER_ID);

        const payoutFilter: PayoutFilter = {
            transferId,
        };

        try {
            const result: any = await PayoutServiceV2.getPayoutTransactionV2(
                req.internalRestClient, userId, vendorId, payoutFilter
            );
            logger.info(`[PayoutController] [getPayoutTransaction]  ${result}`);
            if (!result) {
                // Flag these requests, where user requests for other user orders
                throw new Error('Something Went Wrong, Please Try Again');
            }
            ResponseUtil.sendSuccessResponse(res, result);
        } catch (e) {
            logger.error(`Error in getPayoutTransaction ${e}` && e.message);
            next(e);
        }
    }

    static async getPayoutStatusV2(
        req, res, next
    ): Promise<any> {

        /*
          This API/Function sends Payout Transaction Details of a Single Order to Client.
        */
        const userId = req.sessionManager.getLoggedInUserId();
        const vendorId: number = req.vendorId;
        const {params} = req;
        logger.info(`PayoutController [getPayoutTransaction] UserId - ${userId}, query - ${JSON.stringify(params)}`);

        const transferId: string = RequestUtil.parseQueryParamAsString(params, PAYOUT_REQUEST_PARAM.TRANSFER_ID);

        const payoutFilter: PayoutFilter = {
            transferId,
        };

        try {
            const result: any = await PayoutServiceV2.getPayoutStatusV2(
                req.internalRestClient, userId, vendorId, payoutFilter
            );
            logger.info(`[PayoutController] [getPayoutTransaction]  ${result}`);
            if (!result) {
                // Flag these requests, where user requests for other user orders
                throw new Error('Something Went Wrong, Please Try Again');
            }
            ResponseUtil.sendSuccessResponse(res, result);
        } catch (e) {
            logger.error(`Error in getPayoutTransaction ${e}` && e.message);
            next(e);
        }
    }

    static async processTenetPayoutWebhookResponseV2(
        req, res, next
    ): Promise<any> {
        try {
            /*
              This API/Function handle the Webhook from Tenet
            */
            const {body, params} = req;
            const vendor: string = RequestUtil.parseQueryParamAsString(params, PAYOUT_REQUEST_PARAM.VENDOR);
            const vendorId: number = VendorUtil.getVendorIdFromName(vendor);
            logger.info(`[processTenetPayoutWebhookResponse] Request Body ${JSON.stringify(body)}, vendorName -${vendor}, vendorId${vendorId}`);
            const {eventName, data, metadata} = body;
            const userId: string = data?.payoutData?.userId;
            const result: any = await PayoutServiceV2.processWebhookV2(
                req.internalRestClient, userId, eventName, data, vendorId, metadata
            );
            logger.info(`[processTenetPayoutWebhookResponse] Response ${JSON.stringify(result)}`);
            ResponseUtil.sendSuccessResponse(res, result);
        } catch (e) {
            logger.error(`Error in placing order${e}` && e.message);
            next(e);
        }
    }
}
