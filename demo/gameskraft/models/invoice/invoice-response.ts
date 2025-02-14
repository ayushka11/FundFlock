import {TenetInvoice} from "./invoice-info"

export interface InvoiceResponse {
    paginationInfo: PaginationInfo
    invoices: TenetInvoice[]
}

export interface PaginationInfo {
    currentPageNo?: number,
    numOfRecords: number,
    previousPageNo?: number,
    nextPageNo?: number,
    firstPageNo?: number
}