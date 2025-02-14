import {INVOICE_TYPE_TEXT} from "../constants/constants";
import InvoiceProductType from "../models/enums/invoice-product-type";
import InvoiceType from "../models/enums/invoice-type";
import {TenetInvoice, TenetInvoiceMetaDataDao} from "../models/invoice/invoice-info";
import {PaginationInfo} from "../models/invoice/invoice-response";
import Parser from "./parser";

export default class InvoiceUtil {

    public static getPageNo(matchString: RegExpMatchArray | null): number {
        if (matchString && matchString[1]) {
            return Parser.parseNumber(matchString[1])
        }
        return -1;
    }

    public static getPaginationInfoFromMeta(meta: TenetInvoiceMetaDataDao): PaginationInfo {
        const paginationLink = meta?.links && meta?.links?.length > 0 ? meta?.links[0] : null;
        const regex = /[?&]pageNo=([^&]+)/;
        let nextPageNo: number = InvoiceUtil.getPageNo(paginationLink?.next?.match(regex))
        let previousPageNo: number = InvoiceUtil.getPageNo(paginationLink?.previous?.match(regex))
        let selfPageNo: number = InvoiceUtil.getPageNo(paginationLink?.self?.match(regex))
        let firstPageNo: number = InvoiceUtil.getPageNo(paginationLink?.first?.match(regex))
        return {
            currentPageNo: selfPageNo,
            numOfRecords: meta?.pagePerCount,
            nextPageNo: nextPageNo,
            previousPageNo: previousPageNo,
            firstPageNo: firstPageNo
        }
    }

    static getInvoiceTypeText(invoiceType: number) {
        switch (invoiceType) {
            case InvoiceType.CASH_GAME:
                return INVOICE_TYPE_TEXT.CASH_GAME
            case InvoiceType.TOURNAMENT:
                return INVOICE_TYPE_TEXT.TOURNAMENTS
            case InvoiceType.ADD_CASH:
                return INVOICE_TYPE_TEXT.ADD_CASH
        }
    }


    public static getProductTypeFromInvoiceType (invoiceType: number) {
        switch (invoiceType) {
            case InvoiceType.ADD_CASH:
                return InvoiceProductType.ADD_CASH
        }
        return -1;
    }


    static getInvoiceTypeFromProductType(productType: number) {
        switch (productType) {
           case InvoiceProductType.ADD_CASH:
                return InvoiceType.ADD_CASH
        }
        return -1;
    }

    public static getInvoiceResponse(invoices: TenetInvoice[], meta: TenetInvoiceMetaDataDao) {
        const paginationInfo: PaginationInfo = InvoiceUtil.getPaginationInfoFromMeta(meta);
        return  {
            paginationInfo: paginationInfo,
            invoices: invoices
        }
    }


}
