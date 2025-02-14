import SupernovaClient from '../../clients/supernovaClient';
import {DepositRequestV2, RefundOrderRequestV2, RefundOrderV2, RevertPayinRefundRequest, UserCreditPracticeChipsRequest} from '../../models/supernova/request';

import LoggerUtil from '../../utils/logger';
import {UserWalletBalanceV2} from "../../models/supernova/response";
import { UserRefundData } from '../../models/payin/response';


const logger = LoggerUtil.get("SupernovaServiceV2");

export default class SupernovaServiceV2 {

    static async processUserDepositV2(depositRequest: DepositRequestV2, restClient: any, vendorId: string) {
        try {
            logger.info(depositRequest, `[SupernovaService] [processUserDepositV2]`);
            const response: any = SupernovaClient.processUserDepositV2(depositRequest, restClient, Number(vendorId));
            logger.info(response, `[SupernovaService] [processUserDepositV2] userDepositResponse ::`);
            return response;
        } catch (e) {
            throw (e);
        }
    }

    static async getUserWalletBalance(userId: string, restClient: any, vendorId: string): Promise<UserWalletBalanceV2> {
        logger.info(`inside [SupernovaService] [getUserWalletBalance] for userId :: ${userId}`);
        const response: any = SupernovaClient.getUserWalletBalanceV2(userId, restClient, Number(vendorId));
        logger.info(response, `[SupernovaService] [getUserWalletBalance] userWalletBalance :: `);
        return response;
    }

    static async getUserRefundTdsDetails(userId: string, userRefundOrderRequest: RefundOrderRequestV2, vendorId: string,restClient: any): Promise<UserRefundData[]> {
        try {
            logger.info(userRefundOrderRequest, `[SupernovaServiceV2] [getUserRefundTdsDetails] vendorId :: ${vendorId}`);
            const response: any = await SupernovaClient.getUserRefundTdsDetailsV2(userId,userRefundOrderRequest, Number(vendorId),restClient);
            logger.info(response, `[SupernovaServiceV2] [getUserRefundTdsDetails] userRefundTdsDetails ::`);
            return response;
        } catch (e) {
            throw (e);
        }
    }
    
    static async refundCash(userRefund: any, restClient: any, vendorId: number) {
        logger.info(userRefund, `[SupernovaService] [refundCash] for userRefund :: `);
        const response: any = SupernovaClient.refundCashV2(userRefund, restClient, vendorId);
        logger.info(response, `inside [SupernovaService] [refundCash] userRefundDetails :: `);
        return response;
    }

    static async revertUserRefund(request: RevertPayinRefundRequest, restClient: any, vendorId: number) {
        logger.info(request, `[SupernovaService] [revertUserRefund] for RevertRefundOrderRequest :: `);
        const response: any = SupernovaClient.revertUserRefundV2(request, restClient, vendorId);
        logger.info(response, `[SupernovaService] [revertUserRefund] revertedOrder :: `);
        return response;
    }

    static async creditPracticeChipsV2(restClient: any, request: UserCreditPracticeChipsRequest, vendorId: number) {
        logger.info(request, `[SupernovaService] [creditPracticeChipsV2]`);
        const response: any = await SupernovaClient.creditPracticeChipsV2(restClient, request, vendorId);
        logger.info(response, `[creditPracticeChipsV2] response`);
        return response;
    }
};
