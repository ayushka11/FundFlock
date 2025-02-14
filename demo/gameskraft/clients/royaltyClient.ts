import QueryParam from "../models/query-param";
import RoyaltyServiceError from "../errors/royalty/royalty-error";
import RoyaltyServiceErrorUtil from "../errors/royalty/royalty-error-util";
import {getAuroraServiceBaseUrl} from "../services/configService";
import {AuroraClientLatencyDecorator} from "../utils/monitoring/client-latency-decorator";
import RequestUtil from "../helpers/request-util";
import BaseClient from "./baseClient";

import LoggerUtil, {ILogger} from '../utils/logger';
import { UserRefundDcsAmountRequest } from "../models/aurora/request";
import { UserRevertRefundDcsAmountRequest } from "../models/aurora/response";
import { CreateRoyaltyUser } from "../models/royalty/request";

const configService = require('../services/configService');
const logger: ILogger = LoggerUtil.get("RoyaltyClient");

export default class RoyaltyClient {
    private static urls = {
        redeemCoins: '/v1/royalty/user/##USER_ID##/coins/redeem',
        userRoyaltyInfo: '/v1/royalty/user/##USER_ID##/info',
        userRoyaltyBenefits: '/v1/royalty/user/##USER_ID##/benefits',
        homeRoyaltyInfo: '/v1/royalty/user/##USER_ID##',
        userDcsAmount: '/v1/royalty/user/##USER_ID##/dcs',
        creditUserDcs: '/v1/royalty/user/##USER_ID##/dcs',
        getRoyaltyDcsInfo: '/v1/royalty/user/##USER_ID##/dcs/benefits',
        royaltyFAQs: '/v1/royalty/faq',
        redeemCoinsV2: '/v2/royalty/user/##USER_ID##/coins/redeem',
        upgradeUserRoyaltyVersion: '/v1/royalty/user/##USER_ID##/upgrade/royalty/version',
        getRefundDcsDetails:'/v1/royalty/user/##USER_ID##/refund/dcs',
        debitUserDcsOnRefund: '/v1/royalty/user/##USER_ID##/refund/dcs',
        revertRefundDcs: '/v1/royalty/user/##USER_ID##/revert/refund/dcs',
        checkIfUserInRakeback: '/v1/royalty/user/##USER_ID##/rakeback/validate',
        createRoyaltyUser: '/v1/royalty/user'
    }

    @AuroraClientLatencyDecorator
    static async redeemCoins(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[RoyaltyClient] [redeemCoins] userId :: ${userId}`);
            const url = RoyaltyClient.getCompleteUrl(
                RoyaltyClient.urls.redeemCoins.replace(/##USER_ID##/g, userId.toString())
            );
            logger.info(`[RoyaltyClient] [redeemCoins] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId());
            const royaltyServiceResp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, {}, headers);
            logger.info(`[RoyaltyClient] [redeemCoins] response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error(error,`[RoyaltyClient] [redeemCoins]:: `)
            throw RoyaltyClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async redeemCoinsV2(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[RoyaltyClient] [redeemCoinsV2] userId :: ${userId}`);
            const url = RoyaltyClient.getCompleteUrl(
                RoyaltyClient.urls.redeemCoinsV2.replace(/##USER_ID##/g, userId.toString())
            );
            logger.info(`[RoyaltyClient] [redeemCoinsV2] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId());
            const royaltyServiceResp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, {}, headers);
            logger.info(`[RoyaltyClient] [redeemCoinsV2] response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error(error,`[RoyaltyClient] [redeemCoinsV2]:: `)
            throw RoyaltyClient.getError(error);
        }
    }


    @AuroraClientLatencyDecorator
    static async getUserRoyaltyInfoWithLevels(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[RoyaltyClient] [getUserRoyaltyInfo] userId :: ${userId}`);
            const queryParams: QueryParam[] = [];
            const url = RoyaltyClient.getCompleteUrl(
                RoyaltyClient.urls.userRoyaltyInfo.replace(/##USER_ID##/g, userId.toString()),
                queryParams
            );
            logger.info(`[RoyaltyClient] [getUserRoyaltyInfo] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId());
            const royaltyServiceResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[RoyaltyClient] [getUserRoyaltyInfo] response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error(error,`[getUserRoyaltyInfo] Client Failed:: `);
            throw RoyaltyClient.getError(error);
        }
    }


    @AuroraClientLatencyDecorator
    static async getRoyaltyDcsInfo(restClient: any, userId: number, vendorId: string): Promise<any> {
        try {
            logger.info(`[RoyaltyClient] [getRoyaltyDcsInfo] userId :: ${userId}, vendorId :: ${vendorId}`);
            const queryParams: QueryParam[] = [];
            const url = RoyaltyClient.getCompleteUrl(
                RoyaltyClient.urls.getRoyaltyDcsInfo.replace(/##USER_ID##/g, userId.toString()),
                queryParams
            );
            logger.info(`[RoyaltyClient] [getRoyaltyDcsInfo] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId(), vendorId);
            const royaltyServiceResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[RoyaltyClient] [getRoyaltyDcsInfo] response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error(error,`[getRoyaltyDcsInfo] Client Failed:: `);
            throw RoyaltyClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getDcsAmount(restClient: any, userId: number, vendorId: string, userAddCashAmount: number[]): Promise<any> {
        try {
            logger.info(`[RoyaltyClient] [getDcsAmount] userId :: ${userId}, vendorId :: ${vendorId}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "addCashAmount", value: userAddCashAmount});
            const url = RoyaltyClient.getCompleteUrl(
                RoyaltyClient.urls.userDcsAmount.replace(/##USER_ID##/g, userId.toString()),
                queryParams
            );
            logger.info(`[RoyaltyClient] [getDcsAmount] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId(), vendorId);
            const royaltyServiceResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[RoyaltyClient] [getDcsAmount] response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error(error,`[getDcsAmount] Client Failed:: `);
            throw RoyaltyClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async creditUserDcs(restClient: any, userId: number, vendorId: string, userAddCashAmount: number,transactionId:string): Promise<any> {
        try {
            logger.info(`[RoyaltyClient] [creditUserDcs] userId :: ${userId}, vendorId :: ${vendorId}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "addCashAmount", value: userAddCashAmount});
            queryParams.push({param: "transactionId", value: transactionId});
            const url = RoyaltyClient.getCompleteUrl(
                RoyaltyClient.urls.creditUserDcs.replace(/##USER_ID##/g, userId.toString()),
                queryParams
            );
            logger.info(`[RoyaltyClient] [creditUserDcs] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId(), vendorId);
            const royaltyServiceResp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, {}, headers);
            logger.info(`[RoyaltyClient] [creditUserDcs] response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error(error,`[RoyaltyClient] [creditUserDcs] Failed:: `);
            throw RoyaltyClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getRoyaltyUserInfo(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[RoyaltyClient] [getRoyaltyHomeInfo] userId :: ${userId}`);
            const queryParams: QueryParam[] = [];
            const url = RoyaltyClient.getCompleteUrl(
                RoyaltyClient.urls.homeRoyaltyInfo.replace(/##USER_ID##/g, userId.toString()),
                queryParams
            );
            logger.info(`[RoyaltyClient] [getRoyaltyHomeInfo] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId());
            const royaltyServiceResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[RoyaltyClient] [getRoyaltyHomeInfo] response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error({error},`[getRoyaltyHomeInfo] Client Failed::`)
            throw RoyaltyClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getUserRoyaltyBenefits(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[RoyaltyClient] [getUserRoyaltyBenefits] userId :: ${userId}`);
            const url = RoyaltyClient.getCompleteUrl(
                RoyaltyClient.urls.userRoyaltyBenefits.replace(/##USER_ID##/g, userId.toString())
            );
            logger.info(`[RoyaltyClient] [getUserRoyaltyBenefits] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId());
            const royaltyServiceResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[RoyaltyClient] [getUserRoyaltyBenefits] response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error(error,`[getUserRoyaltyBenefits] Client Failed:: `)
            throw RoyaltyClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getRoyaltyFAQs(restClient: any): Promise<any> {
        try {
            logger.info(`[RoyaltyClient] [getRoyaltyFAQs] Request `);
            const url = RoyaltyClient.getCompleteUrl(RoyaltyClient.urls.royaltyFAQs);
            logger.info(`[RoyaltyClient] [getRoyaltyFAQs] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId());
            const royaltyServiceResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[RoyaltyClient] [getRoyaltyFAQs] Response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error(error,`[getRoyaltyFAQs] Client Failed:: `)
            throw RoyaltyClient.getError(error);
        }
    }

    static async upgradeUserRoyaltyVersion(restClient: any, userId:number): Promise<any> {
        try {
            logger.info(`[RoyaltyClient] [upgradeUserRoyaltyVersion] Request `);
            const url = RoyaltyClient.getCompleteUrl(RoyaltyClient.urls.upgradeUserRoyaltyVersion.replace(/##USER_ID##/g, userId.toString()));
            logger.info(`[RoyaltyClient] [upgradeUserRoyaltyVersion] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId());
            const royaltyServiceResp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url,{}, headers);
            logger.info(`[RoyaltyClient] [upgradeUserRoyaltyVersion] Response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error(error,`[upgradeUserRoyaltyVersion] Client Failed:: `)
        }
    }

    @AuroraClientLatencyDecorator
    static async getRefundDcsDetails(userId: number,userRefundDcsDetails:UserRefundDcsAmountRequest[] ,vendorId: number,restClient: any){
        try {
            logger.info(`[RoyaltyClient] [getRefundDcsDetails] userId :: ${userId}`);
            const url = RoyaltyClient.getCompleteUrl(
                RoyaltyClient.urls.getRefundDcsDetails.replace(/##USER_ID##/g, userId.toString())
            );
            logger.info(`[RoyaltyClient] [getRefundDcsDetails] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId(),`${vendorId}`);
            const royaltyServiceResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers,null,userRefundDcsDetails);
            logger.info(`[RoyaltyClient] [getRefundDcsDetails] response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error(error,`[getRefundDcsDetails] Client Failed:: `)
            throw RoyaltyClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async debitUserDcsOnRefund(userId: number,userRefundDcsDetails:UserRefundDcsAmountRequest[] ,vendorId: number,restClient: any){
        try {
            logger.info(`[RoyaltyClient] [debitUserDcsOnRefund] userId :: ${userId}`);
            const url = RoyaltyClient.getCompleteUrl(
                RoyaltyClient.urls.debitUserDcsOnRefund.replace(/##USER_ID##/g, userId.toString())
            );
            logger.info(`[RoyaltyClient] [debitUserDcsOnRefund] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId(),`${vendorId}`);
            const royaltyServiceResp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, userRefundDcsDetails,headers);
            logger.info(`[RoyaltyClient] [debitUserDcsOnRefund] response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error(error,`[debitUserDcsOnRefund] Client Failed:: `)
            throw RoyaltyClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async revertRefundDcs(userId: number,vendorId: number,revertedDcsOrder:UserRevertRefundDcsAmountRequest,restClient: any){
        try {
            logger.info(`[RoyaltyClient] [revertRefundDcs] userId :: ${userId}`);
            const url = RoyaltyClient.getCompleteUrl(
                RoyaltyClient.urls.revertRefundDcs.replace(/##USER_ID##/g, userId.toString())
            );
            logger.info(`[RoyaltyClient] [revertRefundDcs] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId(),`${vendorId}`);
            const royaltyServiceResp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, revertedDcsOrder,headers);
            logger.info(`[RoyaltyClient] [revertRefundDcs] response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error(error,`[revertRefundDcs] Client Failed:: `)
            throw RoyaltyClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async checkIfUserInRakeback(restClient: any, userId: string, vendorId: number) {
        try {
            logger.info(`[RoyaltyClient] [checkIfUserInRakeback] userId :: ${userId}`);
            const url = RoyaltyClient.getCompleteUrl(
                RoyaltyClient.urls.checkIfUserInRakeback.replace(/##USER_ID##/g, userId.toString())
            );
            logger.info(`[RoyaltyClient] [checkIfUserInRakeback] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId(),`${vendorId}`);
            const royaltyServiceResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[RoyaltyClient] [checkIfUserInRakeback] response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error(error,`[checkIfUserInRakeback] Client Failed:: `)
            throw RoyaltyClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async createRoyaltyUser(restClient: any, createRoyaltyUserReq: CreateRoyaltyUser, ){
        try {
            logger.info(`[RoyaltyClient] [createRoyaltyUser] createRoyaltyUserReq :: ${JSON.stringify(createRoyaltyUserReq)}`);
            const url = RoyaltyClient.getCompleteUrl(
                RoyaltyClient.urls.createRoyaltyUser
            );
            logger.info(`[RoyaltyClient] [createRoyaltyUser] url :: ${url}`);
            const headers: any = RoyaltyClient.getRoyaltyServiceHeaders(restClient.getRequestId(),`${createRoyaltyUserReq.vendorId}`);
            const royaltyServiceResp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, createRoyaltyUserReq, headers);
            logger.info(`[RoyaltyClient] [createRoyaltyUser] response :: ${JSON.stringify(royaltyServiceResp || {})}`);
            return royaltyServiceResp.data;
        } catch (error) {
            logger.error(error,`[createRoyaltyUser] Client Failed:: `)
            throw RoyaltyClient.getError(error);
        }
    }    

    static wrapError(error: any) {
        if (error && !(error instanceof RoyaltyServiceError)) {
            return RoyaltyServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    static getErrorFromCode(errorCode: number) {
        return RoyaltyClient.getError({errorCode});
    }

    private static getRoyaltyServiceHeaders(requestId: string, vendorId?: string) {
        let headers: any = {"X-Request-Id": requestId};
        if (vendorId) {
            headers = {"X-Request-Id": requestId, "x-vendor-id": vendorId};
        }
        return headers;
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(getAuroraServiceBaseUrl(), relativeUrl, queryParams);
    }

    private static getError(error: any) {
        logger.error('[RoyaltyClient] Error: %s', JSON.stringify(error || {}));
        switch (error.errorCode) {
            case 10015:
                return RoyaltyServiceErrorUtil.getInternalServerError();
            case 10001:
                return RoyaltyServiceErrorUtil.getRuntimeError();
            case 10005:
                return RoyaltyServiceErrorUtil.getAuthorizationError();
            case 10020:
                return RoyaltyServiceErrorUtil.getBodyValidationError('Request Payload is Incorrect');
            case 10025:
                return RoyaltyServiceErrorUtil.getInternalServerError();
            case 10026:
                return RoyaltyServiceErrorUtil.getDBDuplicateEntryError();
            case 12000:
                return RoyaltyServiceErrorUtil.getRoyaltyLevelDoesNotExist();
            case 12005:
                return RoyaltyServiceErrorUtil.getRoyaltyUserDoesNotExist();
            case 12010:
                return RoyaltyServiceErrorUtil.getInvalidCreateRoyaltyUser();
            case 12015:
                return RoyaltyServiceErrorUtil.getCreditCoinFailed();
            case 12020:
                return RoyaltyServiceErrorUtil.getCoinGenerationFailed();
            case 12025:
                return RoyaltyServiceErrorUtil.getInvalidCreateRoyaltyUser();
            case 12030:
                return RoyaltyServiceErrorUtil.getRoyaltyLevelOrOrderNoExist();
            case 12035:
                return RoyaltyServiceErrorUtil.getRoyaltyUserAlreadyExist();
            case 12040:
                return RoyaltyServiceErrorUtil.getCoinRedemptionFailed();
            case 12045:
                return RoyaltyServiceErrorUtil.getNotSufficientCoins();
            default:
                return RoyaltyServiceErrorUtil.getError(error);
        }
    }
};
