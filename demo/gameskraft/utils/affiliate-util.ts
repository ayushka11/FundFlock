import { P52_VENDOR_ID } from "../constants/constants";
import { AffiliateUsers, IAffiliateUsers } from "../models/affiliate/affiliate-users";
import { IDMUserProfile } from "../models/idm/user-idm";
import IDMService from "../services/idmService";
import { AffiliatePayments, IAffiliatePayments } from "../models/affiliate/affiliate-payments";
import DatetimeUtil from "./datetime-util";

export default class AffiliateUtil {

    public static async getAffiliateUsersResponse(restClient: any, affiliateUsers: AffiliateUsers[]): Promise<IAffiliateUsers[]> {
        const affiliateUsersResponse: IAffiliateUsers[] = [];

        // Map each user to a promise fetching their details asynchronously
        const promises = affiliateUsers.map(async (affiliateUser: AffiliateUsers) => {
            const affiliateUserProfile: IDMUserProfile = await IDMService.getUserDetails(restClient, `${affiliateUser.userId}`, P52_VENDOR_ID);
            const affiliateUserResponse: IAffiliateUsers = {
                userId: affiliateUserProfile.userId,
                userName: affiliateUserProfile.displayName,
                displayPicture: affiliateUserProfile.displayPicture,
                rakeStartDate: DatetimeUtil.getFormattedDate(DatetimeUtil.getTimeZoneDate(new Date(affiliateUser.startDate)), "dd-MM-yyyy"),
                lastPlayedDate: affiliateUser.lastPlayedDate ? DatetimeUtil.getFormattedDate(DatetimeUtil.getTimeZoneDate(new Date(affiliateUser.lastPlayedDate)), "dd-MM-yyyy") : "N/A",
            };
            return affiliateUserResponse;
        });

        // Wait for all promises to resolve
        const responses = await Promise.all(promises);

        // Concatenate responses into affiliateUsersResponse
        affiliateUsersResponse.push(...responses);

        return affiliateUsersResponse;
    }

    public static getAffiliatePaymentsResponse(restClient: any, affiliatePayments: AffiliatePayments[]): IAffiliatePayments[] {
        const affiliatePaymentsResponse: IAffiliatePayments[] = [];
        affiliatePayments.forEach((affiliatePayment: AffiliatePayments) => {
            const affiliatePaymentResponse: IAffiliatePayments = {
                userId: affiliatePayment.userId,
                invoiceNumber: affiliatePayment.invoiceNumber,
                startDate: DatetimeUtil.getFormattedDate(DatetimeUtil.getTimeZoneDate(new Date(affiliatePayment.startDate)), "dd-MM-yyyy"), // "yyyy-MM-dd"
                endDate: DatetimeUtil.getFormattedDate(DatetimeUtil.getTimeZoneDate(new Date(affiliatePayment.endDate)), "dd-MM-yyyy"), // "yyyy-MM-dd"
                paidAmount: affiliatePayment.paidAmount,
                invoiceLink: affiliatePayment.invoiceLink,
            };
            affiliatePaymentsResponse.push(affiliatePaymentResponse);
        });
        return affiliatePaymentsResponse;
    }


}
