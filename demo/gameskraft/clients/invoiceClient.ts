import InvoiceServiceError from "../errors/invoice/invoice-error";
import InvoiceServiceErrorUtil from "../errors/invoice/invoice-error-util";
import RequestUtil from "../helpers/request-util";
import QueryParam from "../models/query-param";
import {getInvoiceServiceBaseUrl, getTenetInvoiceAccessIdForVendor} from "../services/configService";
import {InvoiceClientLatencyDecorator} from "../utils/monitoring/client-latency-decorator";
import BaseClient from "./baseClient";
import LoggerUtil, {ILogger} from '../utils/logger';
import Pagination from "../models/pagination";

const logger: ILogger = LoggerUtil.get("InvoiceClient");

export default class InvoiceClient {

    private static urls = {
        downloadInvoice: '/invoice-service/invoice/download',
        getInvoicesV2: '/invoice-service/v1/invoice',
        downloadInvoiceV2: '/invoice-service/v1/invoice/download',
        getInvoices: '/invoice-service/invoice'
    };

    @InvoiceClientLatencyDecorator
    static async downloadInvoice(restClient: any, vendorId: string, invoiceNo?: string, orderId?: string, productType?: number): Promise<any> {
        try {
            logger.info(`[InvoiceClient] [downloadInvoice] invoiceNo :: ${invoiceNo} productType:: ${productType}`);
            const queryParams: QueryParam[] = [];
            if (invoiceNo) {
                queryParams.push({param: "invoiceNo", value: invoiceNo});
            }
            else if (orderId) {
                queryParams.push({param: "transactionId", value: orderId});
            }
            if (productType) {
                queryParams.push({param: "productType", value: productType});
            }
            const url = InvoiceClient.getCompleteUrl(InvoiceClient.urls.downloadInvoice, queryParams);
            logger.info(`[InvoiceClient] [downloadInvoice] url :: ${url}`);
            const headers = InvoiceClient.getInvoiceServiceHeader(vendorId);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[InvoiceClient] [downloadInvoice] response :: ${JSON.stringify(response || {})}`);
            return response.result;
        } catch (error) {
            throw InvoiceClient.getError(error);
        }
    }

    @InvoiceClientLatencyDecorator
    static async downloadInvoiceV2(restClient: any, vendorId: string, invoiceNo: string, productType?: number, orderId?: string,): Promise<any> {
        try {
            logger.info(`[InvoiceClient] [downloadInvoice2] invoiceNo :: ${invoiceNo}  ${productType}`);
            const queryParams: QueryParam[] = [];
            if (invoiceNo) {
                queryParams.push({param: "invoiceNo", value: invoiceNo});
            }
            else if (orderId) {
                queryParams.push({param: "transactionId", value: orderId});
            }
            if (productType) {
                queryParams.push({param: "productType", value: productType});
            }
            const url = InvoiceClient.getCompleteUrl(InvoiceClient.urls.downloadInvoiceV2, queryParams);
            logger.info(`[InvoiceClient] [downloadInvoice] url :: ${url}`);
            const headers = InvoiceClient.getInvoiceServiceHeader(vendorId);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[InvoiceClient] [downloadInvoice] response :: ${JSON.stringify(response || {})}`);
            return response.result;
        } catch (error) {
            throw InvoiceClient.getError(error);
        }
    }

    @InvoiceClientLatencyDecorator
    static async getInvoices(restClient: any, userId: string, vendorId: string, fromDate: string, toDate: string, invoiceTypes: number[], sortBy: string[], pagination: Pagination): Promise<any> {
        try {
            logger.info(`[InvoiceClient] [getInvoices] userId :: ${userId} :: fromDate :: ${fromDate} :: toDate :: ${toDate} :: invoiceTypes :: ${invoiceTypes} :: pagination :: ${JSON.stringify(pagination || {})} :: sortBy ${sortBy}`);
            const queryParams: QueryParam[] = [];
            const page = pagination?.pageNo;
            const size = pagination.numOfRecords;
            queryParams.push({param: "userId", value: userId});
            queryParams.push({param: "from", value: fromDate});
            queryParams.push({param: "to", value: toDate});
            queryParams.push({param: "pageNo", value: page});
            queryParams.push({param: "limit", value: size});
            queryParams.push({param: "invoiceType", value: invoiceTypes.join(",")});
            queryParams.push({param: "sortBy", value: sortBy.join(",")});
            const url = InvoiceClient.getCompleteUrl(InvoiceClient.urls.getInvoices, queryParams);
            logger.info(`[InvoiceClient] [getInvoices] url :: ${url}`);
            const headers = InvoiceClient.getInvoiceServiceHeader(vendorId);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[InvoiceClient] [getInvoices] response :: ${JSON.stringify(response || {})}`);
            return response;
        } catch (error) {
            throw InvoiceClient.getError(error);
        }
    }

    @InvoiceClientLatencyDecorator
    static async getInvoicesV2(restClient: any, userId: number, vendorId: string, fromDate: string, toDate: string, invoiceTypes: number[], sortBy: string[], pagination: Pagination): Promise<any> {
        try {
            logger.info(`[InvoiceClient] [getInvoicesV2] userId :: ${userId} :: fromDate :: ${fromDate} :: toDate :: ${toDate} :: productTypes :: ${invoiceTypes} :: pagination :: ${JSON.stringify(pagination || {})} :: sortBy ${sortBy}`);
            const queryParams: QueryParam[] = [];
            const page = pagination?.pageNo;
            const size = pagination.numOfRecords;
            queryParams.push({param: "userId", value: userId});
            queryParams.push({param: "from", value: fromDate});
            queryParams.push({param: "to", value: toDate});
            queryParams.push({param: "pageNo", value: page});
            queryParams.push({param: "limit", value: size});
            queryParams.push({param: "productType", value: invoiceTypes.join(",")});
            queryParams.push({param: "sortBy", value: sortBy.join(",")});
            const url = InvoiceClient.getCompleteUrl(InvoiceClient.urls.getInvoicesV2, queryParams);
            logger.info(`[InvoiceClient] [getInvoicesV2] url :: ${url}`);
            const headers = InvoiceClient.getInvoiceServiceHeader(vendorId);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[InvoiceClient] [getInvoicesV2] response :: ${JSON.stringify(response || {})}`);
            return response;
        } catch (error) {
            throw InvoiceClient.getError(error);
        }
    }

    static wrapError(error: any) {
        if (error && !(error instanceof InvoiceServiceError)) {
            return InvoiceServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    private static getInvoiceServiceHeader(vendorId: string) {
        const accessId: string = getTenetInvoiceAccessIdForVendor()[vendorId] || '';
        const headers: any = {
            "X-Access-Id": accessId,
        };
        return headers;
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(getInvoiceServiceBaseUrl(), relativeUrl, queryParams)
    }

    private static getError(error: any) {
        logger.error('[InvoiceClient] Error: %s', JSON.stringify(error || {}));
        switch (error.errorCode) {
            default:
                return InvoiceServiceErrorUtil.getError(error);
        }
    }
};
