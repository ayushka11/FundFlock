import QueryParam from "../models/query-param";
import RoyaltyServiceError from "../errors/royalty/royalty-error";
import RoyaltyServiceErrorUtil from "../errors/royalty/royalty-error-util";
import { getAuroraServiceBaseUrl } from "../services/configService";
import { AuroraClientLatencyDecorator } from "../utils/monitoring/client-latency-decorator";
import RequestUtil from "../helpers/request-util";
import BaseClient from "./baseClient";

import LoggerUtil, { ILogger } from '../utils/logger';
import AffiliateServiceErrorUtil from "../errors/affiliate/affiliate-error-util";
import Pagination from "../models/pagination";
import { GENERATE_AFFILIATE_REPORT_BASE_URL } from "../constants/constants";
import AffiliateServiceError from "../errors/affiliate/affiliate-error";

const configService = require('../services/configService');
const logger: ILogger = LoggerUtil.get("AffiliateClient");

export default class AffiliateClient {
    private static urls = {
        getAffiliate: "/v1/affiliates/##USER_ID##",
        getAffiliateUsers: "/v1/affiliates/##AFFILIATE_USER_ID##/users",
        getAffiliatePayments: "/v1/affiliates/##USER_ID##/payment",
        generateAffiliateReport: "/affiliates/##USER_ID##/report"
    }


    @AuroraClientLatencyDecorator
    static async getAffiliate(restClient: any, userId: number, vendorId: string): Promise<any> {
        try {
            logger.info(`[AffiliateClient] [getAffiliate] userId: ${userId} vendorId: ${vendorId}`);
            const url = AffiliateClient.getCompleteUrl(
                AffiliateClient.urls.getAffiliate.replace(/##USER_ID##/g, userId.toString())
            );
            logger.info(`[AffiliateClient] [getAffiliate] url: ${url}`);
            const headers: any = AffiliateClient.getAffiliateServiceHeaders(restClient.getRequestId(), vendorId);
            const affiliateServiceResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[AffiliateClient] [getAffiliate] response: ${JSON.stringify(affiliateServiceResp || {})}`);
            return affiliateServiceResp.data;
        } catch (error) {
            logger.error(error, `[AffiliateClient] [getAffiliate] Failed:: `);
            throw AffiliateClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getAffiliateUsers(restClient: any, userId: number, vendorId: string, pagination: Pagination): Promise<any> {
        try {
            logger.info(`[AffiliateClient] [getAffiliateUsers] userId: ${userId} vendorId: ${vendorId} pagination: ${JSON.stringify(pagination)}`);
            const queryParams: QueryParam[] = [];
            if (pagination) {
                if (pagination.offset) queryParams.push({param: "offset", value: pagination.offset});
                if (pagination.numOfRecords) queryParams.push({param: "numOfRecords", value: pagination.numOfRecords});
            }
            const url = AffiliateClient.getCompleteUrl(
                AffiliateClient.urls.getAffiliateUsers.replace(/##AFFILIATE_USER_ID##/g, userId.toString()), queryParams
            );
            logger.info(`[AffiliateClient] [getAffiliateUsers] url: ${url}`);
            const headers: any = AffiliateClient.getAffiliateServiceHeaders(restClient.getRequestId(), vendorId);
            const affiliateServiceResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[AffiliateClient] [getAffiliateUsers] response: ${JSON.stringify(affiliateServiceResp || {})}`);
            return affiliateServiceResp.data;
        } catch (error) {
            logger.error(error, `[AffiliateClient] [getAffiliateUsers] Failed:: `);
            throw AffiliateClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async getAffiliatePayments(restClient: any, userId: number, vendorId: string, pagination: Pagination): Promise<any> {
        try {
            logger.info(`[AffiliateClient] [getAffiliatePayments] userId: ${userId} vendorId: ${vendorId} pagination: ${JSON.stringify(pagination)}`);
            const queryParams: QueryParam[] = [];
            if (pagination) {
                if (pagination.offset) queryParams.push({param: "offset", value: pagination.offset});
                if (pagination.numOfRecords) queryParams.push({param: "numOfRecords", value: pagination.numOfRecords});
            }
            const url = AffiliateClient.getCompleteUrl(
                AffiliateClient.urls.getAffiliatePayments.replace(/##USER_ID##/g, userId.toString()), queryParams
            );
            logger.info(`[AffiliateClient] [getAffiliatePayments] url: ${url}`);
            const headers: any = AffiliateClient.getAffiliateServiceHeaders(restClient.getRequestId(), vendorId);
            const affiliateServiceResp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[AffiliateClient] [getAffiliatePayments] response: ${JSON.stringify(affiliateServiceResp || {})}`);
            return affiliateServiceResp.data;
        } catch (error) {
            logger.error(error, `[AffiliateClient] [getAffiliatePayments] Failed:: `);
            throw AffiliateClient.getError(error);
        }
    }

    @AuroraClientLatencyDecorator
    static async generateAffiliateReport(restClient: any, userId: number, vendorId: string, fromDate: string, toDate: string, email: string): Promise<any> {
        try {
            logger.info(`[AffiliateClient] [generateAffiliateReport] userId: ${userId} vendorId: ${vendorId} fromDate: ${fromDate} toDate: ${toDate} email: ${email}`);
            const queryParams: QueryParam[] = [];
            if (fromDate) queryParams.push({param: "startDate", value: fromDate});
            if (toDate) queryParams.push({param: "endDate", value: toDate});
            if (email) queryParams.push({param: "email", value: email});
            const url = AffiliateClient.getGenerateReportCompleteUrl(
                AffiliateClient.urls.generateAffiliateReport.replace(/##USER_ID##/g, userId.toString()), queryParams
            );
            logger.info(`[AffiliateClient] [generateAffiliateReport] url: ${url}`);
            const headers: any = AffiliateClient.getAffiliateServiceHeaders(restClient.getRequestId(), vendorId);
            BaseClient.sendPostRequestWithHeaders(restClient, url, {}, headers);
            return {};
        } catch (error) {
            logger.error(error, `[AffiliateClient] [generateAffiliateReport] Failed:: `);
            throw AffiliateClient.getError(error);
        }
    }

    static wrapError(error: any) {
        if (error && !(error instanceof AffiliateServiceError)) {
            return AffiliateServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    static getErrorFromCode(errorCode: number) {
        return AffiliateClient.getError({errorCode});
    }

    private static getAffiliateServiceHeaders(requestId: string, vendorId?: string) {
        let headers: any = {"X-Request-Id": requestId};
        if (vendorId) {
            headers = {"X-Request-Id": requestId, "x-vendor-id": vendorId};
        }
        return headers;
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(getAuroraServiceBaseUrl(), relativeUrl, queryParams);
    }

    private static getGenerateReportCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(GENERATE_AFFILIATE_REPORT_BASE_URL, relativeUrl, queryParams);
    }

    private static getError(error: any) {
        logger.error('[RoyaltyClient] Error: %s', JSON.stringify(error || {}));
        switch (error.errorCode) {
            case 10015:
                return AffiliateServiceErrorUtil.getInternalServerError();
            case 10001:
                return AffiliateServiceErrorUtil.getRuntimeError();
            case 10005:
                return AffiliateServiceErrorUtil.getAuthorizationError();
            case 10020:
                return AffiliateServiceErrorUtil.getBodyValidationError('Request Payload is Incorrect');
            case 10025:
                return AffiliateServiceErrorUtil.getInternalServerError();
            case 11001:
                return AffiliateServiceErrorUtil.getAffiliateDoesNotExistError();
            default:
                return AffiliateClient.wrapError(error);
        }
    }
};
