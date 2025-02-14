import DatetimeUtil from "../../utils/datetime-util";
import InvoiceUtil from "../../utils/invoice-util";

export default class TenetInvoiceDao {
    userId?: number;
    invoiceNo?: string;
    invoiceDate?: string;
    invoiceTime?: string;
    invoiceType?: number;
    transactionId?: number;
    variantId?: number;
    gameId?: string;
    tableId?: string;
    tournamentId?: string;
    creditNoteNo?: string;
    creditNoteDate?: string;
    productType?: number;
    referenceId?: string;
    totalAmount?: number;
    taxableValue?: number;
    roundOffValue?: number;
    invoiceValue?: number;
    creditNoteBalance?: number;
    taxType?: number;
    metaData?: any;
    taxDistribution?: any;
    creditNotes?: any;

    public static get(tenetInvoiceInfoDao: TenetInvoiceDao): TenetInvoice {
        return {
            userId: tenetInvoiceInfoDao.userId,
            invoiceId: tenetInvoiceInfoDao.invoiceNo,
            invoiceName: `ID:${tenetInvoiceInfoDao?.gameId}`,
            time: DatetimeUtil.getFormattedDate(DatetimeUtil.getTimeZoneDate(new Date(tenetInvoiceInfoDao.invoiceDate)), "dd MMM yyyy"),
            invoiceType: tenetInvoiceInfoDao.invoiceType,
            transactionId: tenetInvoiceInfoDao.transactionId,
            variantId: tenetInvoiceInfoDao.variantId,
            handId: tenetInvoiceInfoDao?.gameId,
            tableId: tenetInvoiceInfoDao?.tableId ? tenetInvoiceInfoDao?.tableId : undefined,
            tournamentId: tenetInvoiceInfoDao?.tournamentId ? tenetInvoiceInfoDao?.tournamentId : undefined,
            creditNoteNo: tenetInvoiceInfoDao?.creditNoteNo,
            creditNoteDate: tenetInvoiceInfoDao?.creditNoteDate,
            invoiceTypeText: InvoiceUtil.getInvoiceTypeText(tenetInvoiceInfoDao?.invoiceType || -1)
        };
    }

    public static getV2(tenetInvoiceInfoDao: TenetInvoiceDao): TenetInvoice {
        const invoiceType = InvoiceUtil.getInvoiceTypeFromProductType(tenetInvoiceInfoDao?.productType || -1);
        return {
            userId: tenetInvoiceInfoDao.userId,
            invoiceId: tenetInvoiceInfoDao.invoiceNo,
            invoiceName: `ID:${tenetInvoiceInfoDao?.transactionId}`,
            time: DatetimeUtil.getFormattedDate(DatetimeUtil.getTimeZoneDate(new Date(tenetInvoiceInfoDao.invoiceTime)), "dd MMM yyyy"),
            invoiceType: invoiceType,
            transactionId: tenetInvoiceInfoDao.transactionId,
            invoiceTypeText: InvoiceUtil.getInvoiceTypeText(invoiceType || -1)
        }
    }
}

export interface TenetInvoice {
    userId?: number;
    invoiceId?: string;
    invoiceName?: string;
    time?: string;
    invoiceType?: number;
    transactionId?: number;
    variantId?: number;
    handId?: string;
    tableId?: string;
    tournamentId?: string;
    creditNoteNo?: string;
    creditNoteDate?: string;
    invoiceTypeText?: string
}

export interface TenetInvoicesResponse {
    _metadata: TenetInvoiceMetaDataDao,
    result: {
        invoices: Array<TenetInvoiceDao>
    }
}

export interface TenetInvoiceMetaDataDao {
    limit: number,
    pageNo: number,
    pagePerCount: number,
    links: paginationLinks[]
}

export interface paginationLinks {
    next: string,
    previous: string,
    self: string,
    first: string
}