import LoggerUtil from '../utils/logger';
import AffiliateClient from "../clients/affiliateClient";
import Pagination from "../models/pagination";
import { IDMUserProfile } from "../models/idm/user-idm";
import IDMService from "./idmService";
import AffiliateServiceErrorUtil from "../errors/affiliate/affiliate-error-util";
import DatetimeUtil from "../utils/datetime-util";
import { getAffiliateMetaConfigForVendor } from "./configService";
import {
    AffiliateMenuFilterDao,
    AffiliateMenuFilters,
    AffiliateMetaInfo,
    AffiliateMetaInfoDao
} from "../models/affiliate/affiliate-meta";
import { AffiliateUsers, IAffiliateUsers } from "../models/affiliate/affiliate-users";
import AffiliateUtil from "../utils/affiliate-util";
import { AffiliatePayments, IAffiliatePayments } from "../models/affiliate/affiliate-payments";

const configService = require('../services/configService');

const logger = LoggerUtil.get("AffiliateService");

export default class AffiliateService {

    static async getAffiliate(restClient: any, userId: number, vendorId: string): Promise<any> {
        try {
            logger.info(`[getAffiliate] userId :: ${userId} vendorId :: ${vendorId}`);
            const affiliate: any = await AffiliateClient.getAffiliate(restClient, userId, vendorId);
            logger.info(`[getAffiliate] got data :: ${JSON.stringify(affiliate)}`);
            return affiliate
        } catch (e) {
            logger.error(e, `[getAffiliate] Failed `);
            throw (e);
        }
    }

    static async getAffiliateUsers(restClient: any, userId: number, vendorId: string, pagination: Pagination): Promise<any> {
        try {
            logger.info(`[getAffiliateUsers] userId :: ${userId} vendorId :: ${vendorId} pagination :: ${JSON.stringify(pagination)}`);
            const affiliateUsers: AffiliateUsers[] = await AffiliateClient.getAffiliateUsers(restClient, userId, vendorId, pagination);
            logger.info(`[getAffiliateUsers] got data :: ${JSON.stringify(affiliateUsers)}`);
            const affiliateUsersResponse: IAffiliateUsers[] = await AffiliateUtil.getAffiliateUsersResponse(restClient, affiliateUsers);
            return affiliateUsersResponse
        } catch (e) {
            logger.error(e, `[getAffiliateUsers] Failed `);
            throw (e);
        }
    }

    static async getAffiliatePayments(restClient: any, userId: number, vendorId: string, pagination: Pagination): Promise<any> {
        try {
            logger.info(`[getAffiliatePayments] userId :: ${userId} vendorId :: ${vendorId} pagination :: ${JSON.stringify(pagination)}`);
            const affiliatePayments: AffiliatePayments[] = await AffiliateClient.getAffiliatePayments(restClient, userId, vendorId, pagination);
            logger.info(`[getAffiliatePayments] got data :: ${JSON.stringify(affiliatePayments)}`);
            const affiliatePaymentsResponse: IAffiliatePayments[] = AffiliateUtil.getAffiliatePaymentsResponse(restClient, affiliatePayments);
            return affiliatePaymentsResponse
        } catch (e) {
            logger.error(e, `[getAffiliatePayments] Failed `);
            throw (e);
        }
    }

    static async generateAffiliateReport(restClient: any, userId: number, vendorId: string, fromDate: Date | void, toDate: Date | void): Promise<any> {
        try {
            logger.info(`[generateAffiliateReport] userId :: ${userId} fromDate :: ${fromDate} toDate :: ${toDate}`);
            let fromDateString: string = ""
            if (fromDate) {
                fromDateString = DatetimeUtil.getFormattedDate(fromDate, "yyyy-MM-dd");
            }
            let toDateString: string = "";
            if (toDate) {
                toDateString = DatetimeUtil.getFormattedDate(toDate, "yyyy-MM-dd");
            }
            const userProfile: IDMUserProfile = await IDMService.getUserDetails(restClient, `${userId}`, vendorId);
            if (!userProfile?.email) {
                throw AffiliateServiceErrorUtil.getAffiliateEmailNotFoundError();
            }
            const affiliateReport: any = await AffiliateClient.generateAffiliateReport(restClient, userId, vendorId, fromDateString, toDateString, userProfile?.email);
            logger.info(`[generateAffiliateReport] got data :: ${JSON.stringify(affiliateReport)}`);
            return affiliateReport
        } catch (e) {
            logger.error(e, `[generateAffiliateReport] Failed `);
            throw (e);
        }
    }

    static async getAffiliateMetaInfo(restClient: any, vendorId: string): Promise<AffiliateMetaInfo> {
        try {
            const affiliateMetaDao: AffiliateMetaInfoDao = getAffiliateMetaConfigForVendor()[vendorId];
            logger.info(`[getAffiliateMetaInfo] vendorId :: ${vendorId} affiliateMetaDao :: ${JSON.stringify(affiliateMetaDao)}`);
            const affiliateMetaInfo: AffiliateMetaInfo = {
                menuFilters: affiliateMetaDao?.menuFilters.map((menuFilter: AffiliateMenuFilterDao) => {
                    let toDate;
                    if (menuFilter?.toDateUTCTimeStamp) {
                        toDate = DatetimeUtil.getTimeZoneDate(new Date(Math.max(menuFilter?.toDateUTCTimeStamp, DatetimeUtil.subtractDays(new Date(), 1).getTime())));
                        logger.info(`[InvoiceControllerController] [getAffiliateMetaInfo] toDate ${toDate}`);
                    }
                    else {
                        toDate = DatetimeUtil.getTimeZoneDate(new Date());
                        logger.info(`[InvoiceControllerController] [getAffiliateMetaInfo] toDate ${toDate}`);
                    }
                    let fromDate;
                    if (menuFilter?.fromDateUTCTimeStamp) {
                        fromDate = DatetimeUtil.getTimeZoneDate(new Date(menuFilter?.fromDateUTCTimeStamp));
                        logger.info(`[InvoiceControllerController] [getAffiliateMetaInfo] fromDate ${fromDate}`);
                    }
                    else {
                        fromDate = DatetimeUtil.getTimeZoneDate(new Date());
                        logger.info(`[InvoiceControllerController] [getAffiliateMetaInfo] fromDate ${fromDate}`);
                    }
                    const affiliateFilter: AffiliateMenuFilters = {
                        type: menuFilter?.type,
                        title: menuFilter?.title,
                        default: menuFilter?.default,
                        enable: menuFilter?.enable,
                        startingText: menuFilter?.startingText,
                        fromDate: DatetimeUtil.getFormattedDate(fromDate, "yyyy-MM-dd"),
                        toDate: DatetimeUtil.getFormattedDate(toDate, "yyyy-MM-dd"),
                    };
                    return affiliateFilter;
                }),
                emptyPaymentsText: affiliateMetaDao?.emptyPaymentsText,
                emptyUsersText: affiliateMetaDao?.emptyUsersText,
                comingSoonText: affiliateMetaDao?.comingSoonText
            };
            return affiliateMetaInfo;
        } catch (e) {
            logger.error(e, `[getAffiliateMetaInfo] Failed `);
            throw (e);
        }
    }
};
