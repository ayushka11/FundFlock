import {InvoiceConstant, REQUEST_PARAMS} from "../constants/constants";
import RequestUtil from "../helpers/request-util";
import InvoiceType from "../models/enums/invoice-type";
import {DownloadInvoiceInfo} from '../models/invoice/download-invoice-info';
import {
    InvoiceMenuFilterDao,
    InvoiceMenuFilterDaoV2,
    InvoiceMenuFilters,
    InvoiceMenuFiltersV2,
    InvoiceMetaInfo,
    InvoiceMetaInfoDao,
    InvoiceMetaInfoDaoV2,
    InvoiceMetaInfoV2
} from "../models/invoice/invoice-meta";
import {InvoiceResponse} from "../models/invoice/invoice-response";
import Pagination from "../models/pagination";
import {getInvoiceMetaConfigForVendor, getInvoiceMetaConfigForVendorV2} from "../services/configService";
import InvoiceService from "../services/invoiceService";
import DatetimeUtil from '../utils/datetime-util';
import InvoiceUtil from "../utils/invoice-util";
import LoggerUtil, {ILogger} from "../utils/logger";
import ResponseUtil from "../utils/response-util";

const restHelper = require("../helpers/restHelper");
const logger: ILogger = LoggerUtil.get("InvoiceController");

export default class InvoiceController {

    static async getInvoiceMeta(req, res, next): Promise<void> {
        logger.info(`[InvoiceControllerController] [getInvoiceMeta]`);

        try {
            const vendorId: string = req.vendorId;
            const invoiceMetaDao: InvoiceMetaInfoDao = getInvoiceMetaConfigForVendor()[vendorId];
            const invoiceMetaInfo: InvoiceMetaInfo = {
                menuFilters: invoiceMetaDao?.menuFilters.map((menuFilter: InvoiceMenuFilterDao) => {
                    const invoiceFilter: InvoiceMenuFilters = {
                        title: menuFilter?.title,
                        fromDate: DatetimeUtil.getFormattedDate(DatetimeUtil.subtractMonths(new Date(), menuFilter?.maxMonthsToShow), "yyyy-MM-dd"),
                        toDate: DatetimeUtil.getFormattedDate(DatetimeUtil.getTimeZoneDate(new Date()), "yyyy-MM-dd"),
                        default: menuFilter?.default,
                        enable: menuFilter?.enable,
                        startingText: menuFilter?.startingText,
                        filters: (menuFilter?.filters || []).map((filter) => {
                            return {
                                title: filter?.title,
                                type: filter?.filterType,
                                default: filter?.default ?? false
                            };
                        }),
                        invoiceMenuFilterType: menuFilter?.invoiceMenuFilterType
                    };
                    return invoiceFilter;
                }),
                emptyText: invoiceMetaDao?.emptyText,
                comingSoonText: invoiceMetaDao?.comingSoonText
            };
            ResponseUtil.sendSuccessResponse(res, invoiceMetaInfo);
        } catch (e) {
            logger.error({e}, "Error in getting invoice meta " + e && e.message);
            next(e);
        }
    }


    static async getInvoiceMetaV2(req, res, next): Promise<void> {
        logger.info(`[InvoiceControllerController] [getInvoiceMeta]`);

        try {
            const vendorId: string = req.vendorId;
            const invoiceMetaDao: InvoiceMetaInfoDaoV2 = getInvoiceMetaConfigForVendorV2()[vendorId];
            const invoiceMetaInfo: InvoiceMetaInfoV2 = {
                menuFilters: invoiceMetaDao?.menuFilters.map((menuFilter: InvoiceMenuFilterDaoV2) => {
                    const invoiceFilter: InvoiceMenuFiltersV2 = {
                        title: menuFilter?.title,
                        default: menuFilter?.default,
                        enable: menuFilter?.enable,
                        startingText: menuFilter?.startingText,
                        filters: (menuFilter?.filters || []).map((filter) => {
                            let date;
                            if (filter?.toDateUTCTimeStamp) {
                                date = DatetimeUtil.getTimeZoneDate(new Date(Math.max(filter?.toDateUTCTimeStamp, new Date().getTime())));
                                logger.info(`[InvoiceControllerController] [getInvoiceMeta] date ${date}`);
                            } else {
                                date = DatetimeUtil.getTimeZoneDate(new Date());
                                 logger.info(`[InvoiceControllerController] [getInvoiceMetaV2] date ${date}`);
                            }

                            return {
                                title: filter?.title,
                                type: filter?.filterType,
                                default: filter?.default ?? false,
                                fromDate: DatetimeUtil.getFormattedDate(DatetimeUtil.subtractMonths(date, filter?.maxMonthsToShow), "yyyy-MM-dd"),
                                toDate: DatetimeUtil.getFormattedDate(date, "yyyy-MM-dd"),
                            };
                        }),
                        invoiceMenuFilterType: menuFilter?.invoiceMenuFilterType
                    };
                    return invoiceFilter;
                }),
                emptyText: invoiceMetaDao?.emptyText,
                comingSoonText: invoiceMetaDao?.comingSoonText
            };
            ResponseUtil.sendSuccessResponse(res, invoiceMetaInfo);
        } catch (e) {
            logger.error({e}, "Error in getting invoice meta " + e && e.message);
            next(e);
        }
    }
    static async getInvoices(req, res, next): Promise<void> {
        const {query} = req;
        const vendorId: string = req.vendorId;
        const pagination: Pagination = RequestUtil.getPaginationInfo(query);
        const fromDate: Date | void = RequestUtil.parseQueryAsDate(query, REQUEST_PARAMS.FROM_DATE_QUERY_PARAM)
        const toDate: Date | void = RequestUtil.parseQueryAsDate(query, REQUEST_PARAMS.TO_DATE_QUERY_PARAM);
        const invoiceType: number = RequestUtil.parseQueryParamAsNumber(query, REQUEST_PARAMS.INVOICE_TYPE);
        let sortBy: Array<string> = [];
        if (fromDate || toDate) {
            sortBy.push(InvoiceConstant.sortByDate);
        }

        sortBy.push(InvoiceConstant.sortByInvoiceId);

        logger.info(`[InvoiceControllerController] [getInvoices] ${JSON.stringify(pagination)} ${fromDate} ${toDate} ${JSON.stringify(sortBy)} `);

        try {
            let userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            let fromDateString: string = ""
            let invoiceTypes: number[] = []
            let productInvoiceType: number[] = [];
            if (fromDate) {
                fromDateString = DatetimeUtil.getFormattedDate(fromDate, "yyyy-MM-dd");
            }
            let toDateString: string = "";
            if (toDate) {
                toDateString = DatetimeUtil.getFormattedDate(toDate, "yyyy-MM-dd");
            }

            if (invoiceType) {
                if (invoiceType === InvoiceType.ADD_CASH) {
                    productInvoiceType.push(InvoiceUtil.getProductTypeFromInvoiceType(invoiceType))
                    fromDateString = fromDate ? DatetimeUtil.getFormattedDate(DatetimeUtil.getUTCDate(fromDate), "yyyy-MM-dd'T'HH:mm:ss") : "";
                    toDateString = toDate ? DatetimeUtil.getFormattedDate(DatetimeUtil.getEndOfDayDate(DatetimeUtil.getUTCDate(toDate)), "yyyy-MM-dd'T'HH:mm:ss") : "";
                }
                else {
                    invoiceTypes.push(invoiceType)

                }
            }
            if (productInvoiceType.length > 0) {
                const userId = req.sessionManager.getLoggedInUserId();
                const invoiceResponse: InvoiceResponse = await InvoiceService.getInvoicesV2(req.internalRestClient, userId, vendorId, fromDateString, toDateString, productInvoiceType, sortBy, pagination);
                ResponseUtil.sendSuccessResponse(res, invoiceResponse);
            }
            else {
                const invoiceResponse: InvoiceResponse = await InvoiceService.getInvoices(req.internalRestClient, userUniqueId, vendorId, fromDateString, toDateString, invoiceTypes, sortBy, pagination);
                ResponseUtil.sendSuccessResponse(res, invoiceResponse);
            }
        } catch (e) {
            logger.error({e}, "Error in get invoices " + e && e.message);
            next(e);
        }
    }

    static async downloadInvoice(req, res, next): Promise<void> {
        const {query} = req;
        const vendorId: string = req.vendorId;
        const invoiceId: string = query[REQUEST_PARAMS.INVOICE_ID_QUERY_PARAM] ? query[REQUEST_PARAMS.INVOICE_ID_QUERY_PARAM] : 0;
        const invoiceType: number = query[REQUEST_PARAMS.INVOICE_TYPE] ? query[REQUEST_PARAMS.INVOICE_TYPE] : 0;
        const orderId: string = query[REQUEST_PARAMS.ORDER_ID_QUERY_PARAM] ? query[REQUEST_PARAMS.ORDER_ID_QUERY_PARAM] : null;
        logger.info(`[InvoiceControllerController] [downloadInvoice] ${invoiceId} ${invoiceType}`);
        try {
            if (invoiceType == InvoiceType.ADD_CASH || orderId) {
                const productType = InvoiceUtil.getProductTypeFromInvoiceType(InvoiceType.ADD_CASH);
                const downloadInvoiceInfo: DownloadInvoiceInfo = await InvoiceService.downloadInvoiceV2(req.internalRestClient, vendorId, invoiceId, productType, orderId);
                ResponseUtil.sendSuccessResponse(res, downloadInvoiceInfo);
            }
            else {
                const downloadInvoiceInfo: DownloadInvoiceInfo = await InvoiceService.downloadInvoice(req.internalRestClient, vendorId, invoiceId, orderId);
                ResponseUtil.sendSuccessResponse(res, downloadInvoiceInfo);
            }
        } catch (e) {
            logger.error({e}, "Error in download invoice " + e && e.message);
            next(e);
        }
    }

}
