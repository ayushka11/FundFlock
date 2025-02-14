import QueryParam from "../models/query-param";
import LoggerUtil, {ILogger} from '../utils/logger';
import {PromosClientLatencyDecorator} from "../utils/monitoring/client-latency-decorator";
import RequestUtil from "../helpers/request-util";
import BaseClient from "./baseClient";
import {PromoEvent, UserPromoQueryRequest} from "../models/promos/request";
import PromosServiceError from "../errors/promos/promos-error";
import PromosServiceErrorUtil from "../errors/promos/promos-error-util";
import { Buffer } from "buffer";
import { toString } from "lodash";
import { createConditionParamString } from "../utils/promos-util";

const logger: ILogger = LoggerUtil.get("PromosClient");
const configService = require('../services/configService');

export default class PromosClient {
    private static urls = {
        getUserPromos: 'v1/users/##USER_ID##/promotions',
        publishEvent: 'v1/events/publish',
        getPromoDetails:'v1/promotions'
    }

    @PromosClientLatencyDecorator
    static async getPromoDetails(promoCode: string,vendorId: string,restClient:any){
        try {
            logger.info(`[PromosClient] [getPromoDetails] promosEvent :: ${JSON.stringify(promoCode)}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "promoCode", value: promoCode});
            const url: string = PromosClient.getCompleteUrl(PromosClient.urls.getPromoDetails, queryParams);
            const headers: any = PromosClient.getPromosServiceHeaders(restClient.getRequestId(),vendorId);
            logger.info(`[PromosClient] [getPromoDetails] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const promoDetail: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PromosClient] [getPromoDetails promoDetail :: ${JSON.stringify(promoDetail)}`);
            return promoDetail.result.promotionList[0];
        } catch (error) {
            logger.error(error,`[PromosClient] [getPromoDetails]:: `)
            throw PromosClient.getError(error);
        }
    }

    @PromosClientLatencyDecorator
    static async getUserPromos(userId: string, userPromo: UserPromoQueryRequest, restClient: any,vendorId: string): Promise<any[]> {
        try {
            logger.info(`[PromosClient] [getUserPromos] ::`,userPromo);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: 'types', value: userPromo.promoType});
            if(userPromo.conditions){
                queryParams.push({param: 'conditions', value:createConditionParamString(userPromo.conditions)});
            }
            const url: string = PromosClient.getCompleteUrl(PromosClient.urls.getUserPromos.replace(/##USER_ID##/g, userId), queryParams);
            const headers: any = PromosClient.getPromosServiceHeaders(restClient.getRequestId(),vendorId);
            logger.info(`[PromosClient] [getUserPromos] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const userPromos: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[PromosClient] [getUserPromos] response :: ${JSON.stringify(userPromos || {})}`);
            return userPromos?.result || [];
        } catch (error) {
            logger.info(error,`[PromosClient] [getUserPromos]:: `)
            throw PromosClient.getError(error);
        }
    }

    @PromosClientLatencyDecorator
    static async publishSuccessEvent(promosEvent: PromoEvent, restClient: any,vendorId:string): Promise<any> {
        try {
            logger.info(`[PromosClient] [publishSuccessEvent] promosEvent :: ${JSON.stringify(promosEvent)}`);
            const queryParams: QueryParam[] = [];
            const url: string = PromosClient.getCompleteUrl(PromosClient.urls.publishEvent, queryParams);
            const headers: any = PromosClient.getPromosServiceHeaders(restClient.getRequestId(),vendorId);
            logger.info(`[PromosClient] [publishSuccessEvent] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const successEventResponse: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, promosEvent, headers);
            logger.info(`[PromosClient] [publishSuccessEvent] successEventResponse :: ${JSON.stringify(successEventResponse)}`);
            return successEventResponse;
        } catch (error) {
            logger.error(error,`[PromosClient] [publishSuccessEvent]:: `)
            throw PromosClient.getError(error);
        }
    }

    // change this appropriately
    static wrapError(error: any) {
        if (error && !(error instanceof PromosServiceError)) {
            return PromosServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    static getErrorFromCode(errorCode: number) {
        return PromosClient.getError({errorCode});
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(configService.getPromosServiceBaseUrl(), relativeUrl, queryParams);
    }

    private static getPromosServiceHeaders(requestId: string,vendorId?: string) {
        const tenetAccessId = configService.getPromosServiceAccessKeyForVendor()[vendorId];
        const headers: any = {'X-Access-Id': tenetAccessId, "X-Request-Id": requestId};
        return headers;
    }

    private static getError(error: any) {
        switch (error.errorCode) {
            default:
                return PromosServiceErrorUtil.getError(error);
        }
    }
};