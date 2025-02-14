import QueryParam from "../models/query-param";
import LoggerUtil, { ILogger } from "../utils/logger";
import RequestUtil from "../helpers/request-util";
import ConcordiaServiceError from "../errors/concordia/concordia-error";
import ConcordiaServiceErrorUtil from "../errors/concordia/concordia-error-util";
import { ConcordiaClientLatencyDecorator } from "../utils/monitoring/client-latency-decorator";
import { IPolicyFilter } from "../models/concordia/policyFilter";
import BaseClient from "./baseClient";
import { IPolicyAcknowledgement } from "../models/concordia/policy";

const logger: ILogger = LoggerUtil.get("ConcordiaClient");
const configService = require('../services/configService');

export default class ConcordiaClient {
    private static urls = {
        getPolicies: 'v1/policies',
        createAcknowledgement: 'v1/policies/##POLICY_ID##/versions/1/action'// this is the default version will not change mostly
    }
    
    @ConcordiaClientLatencyDecorator
    static async createAcknowledgement(restClient: any,policyAcknowledgement: IPolicyAcknowledgement,policyId: number,vendorId: string): Promise<any> {
        try {
            logger.info(`[ConcordiaClient] [createAcknowledgement] policyAcknowledgement :: `,policyAcknowledgement);
            const queryParams: QueryParam[] = [];
            const url: string = ConcordiaClient.getCompleteUrl(ConcordiaClient.urls.createAcknowledgement.replace(/##POLICY_ID##/g, `${policyId}`), queryParams);
            const headers: any = ConcordiaClient.getConcordiaServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[ConcordiaClient] [createAcknowledgement] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const acknowledgement: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, policyAcknowledgement,headers);
            logger.info(`[ConcordiaClient] [createAcknowledgement] response :: ${JSON.stringify(acknowledgement || {})}`);
            return acknowledgement.data;
        } catch (error) {
            logger.error(error,`[ConcordiaClient] [getPolicies]:: `)
            throw ConcordiaClient.getError(error);
        }
    }

    @ConcordiaClientLatencyDecorator
    static async getPolicies(restClient: any,policyFilter: IPolicyFilter,vendorId: string): Promise<any> {
        try {
            logger.info(`[ConcordiaClient] [getPolicies] policyFilter :: `,policyFilter);
            const queryParams: QueryParam[] = this.createQueryParams(policyFilter);
            const url: string = ConcordiaClient.getCompleteUrl(ConcordiaClient.urls.getPolicies, queryParams);
            const headers: any = ConcordiaClient.getConcordiaServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[ConcordiaClient] [getPolicies] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const policies: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ConcordiaClient] [getPolicies] response :: ${JSON.stringify(policies || {})}`);
            return policies.data.policies;
        } catch (error) {
            logger.error(error,`[ConcordiaClient] [getPolicies]:: `)
            throw ConcordiaClient.getError(error);
        }
    }

    static createQueryParams(query: any): QueryParam[] {
        return Object.keys(query).map(key => {return {param: key,value: query[key]}});
    }

    static wrapError(error: any) {
        if (error && !(error instanceof ConcordiaServiceError)) {
            return ConcordiaServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    static getErrorFromCode(errorCode: number) {
        return ConcordiaClient.getError({errorCode});
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(configService.getConcordiaServiceBaseUrl(), relativeUrl, queryParams);
    }

    private static getConcordiaServiceHeaders(requestId: string, vendorId: string) {
        const tenetAccessId = configService.getConcordiaServiceAccessKeyForVendor()[vendorId];
        const headers: any = {'X-Access-Id': tenetAccessId, "X-Request-Id": requestId};
        return headers;
    }

    private static getError(error: any) {
        logger.error('[ConcordiaClient] Error: %s', JSON.stringify(error || {}));
        switch (error.errorCode) {
            default:
                return ConcordiaServiceErrorUtil.getError(error);
        }
    }
}