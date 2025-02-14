import ReferralClient from '../../clients/referralClient';
import {IDMUserProfile} from '../../models/idm/user-idm';
import Pagination from '../../models/pagination';
import LoggerUtil from '../../utils/logger';
import UserProfileUtils from '../../utils/user-profile-util';
import IDMService from '../idmService';

const logger = LoggerUtil.get("ReferralService");

export default class ReferralService {

    static async getUserReferees(restClient: any, userId: number, vendorId: string, refereeFilter: number, pagination: Pagination) {
        try {
            logger.info(`[ReferralService] [getUserReferees] userId :: ${userId} refereeFilter :: ${refereeFilter} pagination :: numOfRecords :: ${pagination.numOfRecords} offset :: ${pagination.offset}`);
            const userRefereeResp: any = await ReferralClient.getUserRefereesV2(restClient, userId, refereeFilter, pagination);
            logger.info(`[ReferralService] [getUserReferees] userId :: ${userId} userRefereeResp :: ${JSON.stringify(userRefereeResp)}`);
            const userDetails = await (Promise as any).allSettled(
                userRefereeResp.map(async (userRefereeDetails: any) => {
                    return {
                        userId: userRefereeDetails.refereeUserId,
                        data: await IDMService.getUserDetails(restClient, userRefereeDetails.refereeUserId.toString(), vendorId),
                    };
                }),
            );
            logger.info(`[ReferralService] [getUserReferees] userDetails :: ${JSON.stringify(userDetails)}`);
            const referees = [];
            userRefereeResp.forEach(async (userRefereeDetails: any) => {
                const refereeProfile = userDetails.find((userDetail: any) => userDetail.value?.userId === userRefereeDetails.refereeUserId)?.value?.data;
                referees.push({
                    ...userRefereeDetails,
                    refereeUsername: refereeProfile?.userHandle ?? '',
                    refereeAvatar: refereeProfile?.displayPicture ?? '',
                    refereeMobile: await UserProfileUtils.maskUserMobile(refereeProfile?.mobile ?? ''),
                });
            });
            return referees;
        } catch (e) {
            logger.error(e,`[ReferralService] [getUserReferees] Error :: `);
            throw e;
        }
    }

    static async getReferralDetails(restClient: any, userId: number, vendorId: string) {
        try {
            logger.info(`[ReferralService] [getReferralDetails] userId :: ${userId}`);
            let referralDetails: any = await ReferralClient.getReferralDetailsV2(restClient, userId);
            logger.info(`[ReferralService] [getReferralDetails] userId :: ${userId} referralDetails :: ${JSON.stringify(referralDetails)}`);
            if (referralDetails?.userReferrerDetails?.referrerUserId) {
                //  Set referrer details like mobile, username & avatar
                const referrerProfile: IDMUserProfile = await IDMService.getUserDetails(restClient, referralDetails.userReferrerDetails.referrerUserId.toString(), vendorId);
                logger.info(`[ReferralService] [getReferralDetails] userId :: ${userId} referrerProfile :: ${JSON.stringify(referrerProfile)}`);
                referralDetails.userReferrerDetails['referrerUsername'] = referrerProfile.userHandle;
                referralDetails.userReferrerDetails['referrerAvatar'] = referrerProfile.displayPicture;
                referralDetails.userReferrerDetails['referrerMobile'] = await UserProfileUtils.maskUserMobile(referrerProfile.mobile);
            }
            logger.info(`[ReferralService] [getReferralDetails] userId :: ${userId} referralDetails :: ${JSON.stringify(referralDetails)}`);
            return referralDetails;
        } catch (e) {
            logger.error(e,`[ReferralService] [getReferralDetails] Error :: `);
            throw e;
        }
    }

    static async getUserReferralStats(restClient: any, userId: number) {
        try {
            logger.info(`[ReferralService] [getUserReferralStats] userId :: ${userId}`);
            const userReferralStats: any = await ReferralClient.getUserReferralStatsV2(restClient, userId);
            logger.info(`[ReferralService] [getUserReferralStats] userId :: ${userId} userReferralStats :: ${JSON.stringify(userReferralStats)}`);
            return userReferralStats;
        } catch (e) {
            logger.error(e,`[ReferralService] [getUserReferralStats] Error :: `);
            throw e;
        }
    }

    static async addUserReferral(restClient: any, userId: number, referrerUserId: number, refereeMobile: string) {
        try {
            logger.info(`[ReferralService] [addUserReferral] userId :: ${userId} referrerUserId :: ${referrerUserId} refereeMobile :: ${refereeMobile}`);
            const addUserReferralResp: any = await ReferralClient.addReferralV2(restClient, userId, referrerUserId, refereeMobile);
            logger.info(`[ReferralService] [addUserReferral] userId :: ${userId} addUserReferralResp :: ${JSON.stringify(addUserReferralResp)}`);
            return addUserReferralResp;
        } catch (e) {
            logger.error(e,`[ReferralService] [addUserReferral] Error :: `);
            throw e;
        }
    }

};