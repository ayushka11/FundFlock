import InvoiceClient from "../clients/invoiceClient";
import {INVOICE_PRODUCT_TYPE} from "../constants/invoice-constants";
import DownloadInvoiceInfoDao, {DownloadInvoiceInfo} from "../models/invoice/download-invoice-info";
import TenetInvoiceDao from "../models/invoice/invoice-info";
import TenetInvoiceInfoDao, {TenetInvoice, TenetInvoicesResponse} from "../models/invoice/invoice-info";
import {InvoiceResponse} from "../models/invoice/invoice-response";
import Pagination from "../models/pagination";
import InvoiceUtil from "../utils/invoice-util";

export default class InvoiceService {

    static async downloadInvoice(restClient: any, vendorId: string, invoiceNo?: string, orderId?: string): Promise<DownloadInvoiceInfo> {
        try {
            let downloadInvoiceInfoDao: DownloadInvoiceInfoDao = {};
            if (invoiceNo) {
                downloadInvoiceInfoDao = await InvoiceClient.downloadInvoice(restClient, vendorId, invoiceNo);
            }
            else {
                downloadInvoiceInfoDao = await InvoiceClient.downloadInvoice(restClient, vendorId, null, orderId, INVOICE_PRODUCT_TYPE.ADD_CASH);
            }
            const downloadInvoiceInfo: DownloadInvoiceInfo = DownloadInvoiceInfoDao.get(downloadInvoiceInfoDao);
            return downloadInvoiceInfo;
        } catch (error) {
            throw error;
        }
    }

    static async downloadInvoiceV2(restClient: any, vendorId: string, invoiceNo: string, productType: number, orderId?: string): Promise<DownloadInvoiceInfo> {
        try {
            const downloadInvoiceInfoDao: DownloadInvoiceInfoDao = await InvoiceClient.downloadInvoiceV2(restClient, vendorId, invoiceNo, productType, orderId);
            const downloadInvoiceInfo: DownloadInvoiceInfo = DownloadInvoiceInfoDao.get(downloadInvoiceInfoDao);
            return downloadInvoiceInfo;
        } catch (error) {
            throw error;
        }
    }

    static async getInvoices(restClient: any, userId: string, vendorId: string, fromDate: string, toDate: string, invoiceTypes: number[], sortBy: string[], pagination: Pagination): Promise<InvoiceResponse> {
        try {
            const invoicesResponse: TenetInvoicesResponse = await InvoiceClient.getInvoices(restClient, userId, vendorId, fromDate, toDate, invoiceTypes, sortBy, pagination);
            const invoiceInfoDaos = invoicesResponse?.result?.invoices;
            const invoices: TenetInvoice[] = invoiceInfoDaos.map((invoiceInfoDao: TenetInvoiceDao) => TenetInvoiceInfoDao.get(invoiceInfoDao));
            const invoiceResponse: InvoiceResponse = InvoiceUtil.getInvoiceResponse(invoices, invoicesResponse?._metadata)
            return invoiceResponse;
        } catch (error) {
            throw error;
        }
    }

    static async getInvoicesV2(restClient: any, userId: number, vendorId: string, fromDate: string, toDate: string, invoiceTypes: number[], sortBy: string[], pagination: Pagination): Promise<InvoiceResponse> {
        try {
            const invoicesResponse: TenetInvoicesResponse = await InvoiceClient.getInvoicesV2(restClient, userId, vendorId, fromDate, toDate, invoiceTypes, sortBy, pagination);
            const invoiceInfoDaos = invoicesResponse?.result?.invoices;
            const invoices: TenetInvoice[] = invoiceInfoDaos.map((invoiceInfoDao: TenetInvoiceDao) => TenetInvoiceInfoDao.getV2(invoiceInfoDao));
            const invoiceResponse: InvoiceResponse = InvoiceUtil.getInvoiceResponse(invoices, invoicesResponse?._metadata)
            return invoiceResponse;
        } catch (error) {
            throw error;
        }
    }
}
