import ResponseUtil from '../utils/response-util';
import LoggerUtil, {ILogger} from '../utils/logger';
import PayoutService from '../services/payoutService';
import PayoutFilter from '../models/payout/payout-filter';
import RequestUtil from '../utils/request-util';

import {PAYOUT_REQUEST_PARAM} from '../constants/payout-constants';
import {GMZ_VENDOR_ID, P52_VENDOR_ID} from '../constants/constants';

const logger: ILogger = LoggerUtil.get('PayoutController');

export default class PayoutController {
    static async getPayoutDetails(
        req, res, next
    ): Promise<any> {
        /*
          This API/Function Gives Basic Details of Payout, e.g.
          Bank Details, KYC status, Minimum Payout Limit.
          This will be the first API frontend will call
        */

        const {params, query} = req;
        const userId: string = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req.vendorId;
        logger.info(`[PayoutController] [getPayoutDetails] userId ${userId}  ${JSON.stringify(params)}, ${JSON.stringify(query)}`);
        try {
            const result: any = await PayoutService.getPayoutDetails(req.internalRestClient, userId, vendorId);
            logger.info(`[PayoutController] [getPayoutDetails]  ${JSON.stringify(result)}`);
            ResponseUtil.sendSuccessResponse(res, result);
        } catch (e) {
            logger.error(`Error in getPayoutDetails${e}` && e.message);
            next(e);
        }
    }

    static async validatePayoutRequest(
        req, res, next
    ): Promise<any> {
        /*
          This API/Function Validate Payout with out Royalty and other system limits,
          then it validate it with Tenet, then it fetch tds details from supernova and
          send the same to client
        */
        try {
            const {body} = req;
            const vendorId: string = req.vendorId;
            logger.info(`[validatePayoutRequest] ${JSON.stringify(body)}, vendorId - ${vendorId}`);
            // const user_id = req.sessionManager.getLoggedInUserId();
            const {documentNumber} = body;
            const {amount} = body;
            const userId = req.sessionManager.getLoggedInUserId();
            const result: any = await PayoutService.validatePayout(
                req, userId, vendorId, amount, documentNumber,
            );
            logger.info(`[validatePayoutRequest]  ${JSON.stringify(result)}`);
            ResponseUtil.sendSuccessResponse(res, result);
        } catch (e) {
            logger.error(`Error while validating Payout and TDS calculations ${e}` && e.message);
            next(e);
        }
    }

    static async createPayoutOrder(
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
        const vendorId: string = req.vendorId;
        logger.info(`PayoutController [createPayoutOrder] userId-${userId}, body-${JSON.stringify(body)}`);
        const {documentNumber} = body;
        const {tdsTransactionId} = body;
        const {amount} = body;
        try {
            const result: any = await PayoutService.createPayoutOrder(
                req.internalRestClient, userId, vendorId, amount, documentNumber, tdsTransactionId
            );
            logger.info(`[createPayoutOrder] Response ${JSON.stringify(result)}`);
            ResponseUtil.sendSuccessResponse(res, result);
        } catch (e) {
            logger.error(`Error in placing order${e}` && e.message);
            next(e);
        }
    }

    static async getPayoutTransactions(
        req, res, next
    ): Promise<any> {

        /*
          This API/Function sends Payout History to Clients.
          It fetches Payout History based on different filter.
        */
        const userId = req.sessionManager.getLoggedInUserId();
        const {query} = req;
        const vendorId: string = req.vendorId;
        logger.info(`PayoutController [getPayoutTransactions] UserId - ${userId}, query - ${JSON.stringify(query)}, vendorId - ${vendorId}`);

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
            const result: any = await PayoutService.getPayoutTransactions(
                req, userId, payoutFilter, vendorId
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

    static async getPayoutTransaction(
        req, res, next
    ): Promise<any> {

        /*
          This API/Function sends Payout Transaction to Client.
          It fetches Payout History based on different filter.
        */
        const userId = req.sessionManager.getLoggedInUserId();
        const {params} = req;
        const vendorId: string = req.vendorId;
        logger.info(`PayoutController [getPayoutTransaction] UserId - ${userId}, query - ${JSON.stringify(params)}, vendorId-${vendorId}`);

        const transferId: string = RequestUtil.parseQueryParamAsString(params, PAYOUT_REQUEST_PARAM.TRANSFER_ID);

        const payoutFilter: PayoutFilter = {
            transferId,
        };

        try {
            const result: any = await PayoutService.getPayoutTransaction(
                req.internalRestClient, userId, payoutFilter, vendorId
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

    static async processTenetPayoutWebhookResponse(
        req, res, next
    ): Promise<any> {
        try {
            /*
              This API/Function handle the Webhook from Tenet
            */
            const {body, params} = req;
            logger.info(`[processTenetPayoutWebhookResponse] Request Body ${JSON.stringify(body)}`);
            const vendorId: string = P52_VENDOR_ID
            logger.info(`[processTenetPayoutWebhookResponse] Request, vendorId ${vendorId}`);
            const {eventName, data} = body;
            const userId: string = data?.payoutData?.userId;
            const result: any = await PayoutService.processWebhook(
                req.internalRestClient, userId, vendorId, eventName, data
            );
            logger.info(`[processTenetPayoutWebhookResponse] Response ${JSON.stringify(result)}`);
            ResponseUtil.sendSuccessResponse(res, result);
        } catch (e) {
            logger.error(`Error in placing order${e}` && e.message);
            next(e);
        }
    }

    static async processTenetPayoutWebhookResponseGmz(
        req, res, next
    ): Promise<any> {
        try {
            /*
              This API/Function handle the Webhook from Tenet
            */
            const {body, params} = req;
            logger.info(`[processTenetPayoutWebhookResponseGmz] Request Body ${JSON.stringify(body)}`);
            const vendorId: string = GMZ_VENDOR_ID
            logger.info(`[processTenetPayoutWebhookResponseGmz] Request, vendorId ${vendorId}`);
            const {eventName, data} = body;
            const userId: string = data?.payoutData?.userId;
            const result: any = await PayoutService.processWebhook(
                req.internalRestClient, userId, vendorId, eventName, data
            );
            logger.info(`[processTenetPayoutWebhookResponseGmz] Response ${JSON.stringify(result)}`);
            ResponseUtil.sendSuccessResponse(res, result);
        } catch (e) {
            logger.error(`Error in placing order${e}` && e.message);
            next(e);
        }
    }
}
