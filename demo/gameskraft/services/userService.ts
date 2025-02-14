import { MIN_THRESHOLD_PRACTICE_BALANCE , CREDIT_PRACTICE_BALANCE, PROMISE_STATUS } from '../constants/constants';
import IDMServiceErrorUtil from '../errors/idm/idm-error-util';
import {UpdateUserPersonal, UserAvatars, UserPersonal, UserSummary, UserSummaryV2} from '../models/gateway/response';
import {IDMGenerateOtpResponse, VerifyOTPContext} from '../models/idm/request-response';
import {IDMCustomAttributes, IDMEmailStatus, IDMUserProfile} from '../models/idm/user-idm';
import {
    CheckStatusRequest,
    CheckStatusResponse,
    CheckUsernameRequest,
    VerifyEmailRequest
} from '../models/request/user';
import EventNames from '../producer/enums/eventNames';
import EventPushService from '../producer/eventPushService';
import LoggerUtil from '../utils/logger';
import IDMService from './idmService';
import SupernovaService from './supernovaService';
import SupernovaServiceV2 from './v2/supernovaService';
import ZodiacService from './zodiacService';
import AffiliateService from "./affiliateService";
import UserDetails from '../models/user-details';
import UserKycFilter from '../models/user-kyc-filter';
import { getUserKYCFilterForAries, getUserPanDetails } from '../utils/guardian-util';
import GuardianService from './guardianService';
import IdmUtil from '../utils/idm-utils';
import { PanDetails, UserKycDetails } from '../models/guardian/user-kyc';
import { md5hash } from '../utils/crypto-util';
import { UserDetailInfo, UserPanDetailInfo } from '../models/user/users-tournament-info';

const communicationService = require("../services/communicationService");
const configService = require("../services/configService");
const redisService = require('../services/redisService');
const logger = LoggerUtil.get("IDMService");

export default class UserService {

    static async checkStatus(req: any, reqBody: CheckStatusRequest, vendorId: string) {

        const userDetails: IDMUserProfile = await IDMService.getUserDetails(req.internalRestClient, reqBody.mobile, vendorId);

        // TODO need to check what UI actually uses & change accordingly
        const response: CheckStatusResponse = {
            userId: userDetails.userId,
            mobile: userDetails.mobile,
            status: 3,
            mobileStatus: 2,
            isUserBlocked: 0,
        }
        return response;
    }

    static async updateUserPersonal(req: any, userId: number, reqBody: UpdateUserPersonal, vendorId: string) {
        const deviceInfo = req.sessionManager.getUserDeviceInfo();

        const restClient = req.internalRestClient;
        if (reqBody.email) {
            const generateOtpResponse: IDMGenerateOtpResponse = await IDMService.generateOtp(req, `${userId}`, vendorId);

            const userDetails: IDMUserProfile = await IDMService.getUserDetails(req.internalRestClient, `${userId}`, vendorId);

            const eventData = {
                userId: userId,
                userName: userDetails.userHandle,
                userEmail: reqBody.email,
                otp: generateOtpResponse?.otp,
            };
            EventPushService.push(userId, Number(vendorId), deviceInfo["gk-app-type"], EventNames.USER_VERIFY_EMAIL, eventData);

            // Do not update Email
            // It goes via verifyEmail flow via OTP
            reqBody.email = undefined;
        }
        let userHandle: string = undefined
        let customAttributes: IDMCustomAttributes;
        if (reqBody?.displayName) {
            const user: IDMUserProfile = await IDMService.getUserDetails(restClient, `${userId}`, vendorId)
            if (user?.customAttributes?.usernameEditable) {
                customAttributes = {
                    usernameEditable: false
                }
                userHandle = reqBody?.displayName
            }
            else {
                throw IDMServiceErrorUtil.getInvalidUsernameUpdate();
            }
            // Remove userName as we user only userHandle
            reqBody.displayName = undefined
        }


        const request = {
            userId,
            userHandle,
            customAttributes,
            ...reqBody,
        };

        await IDMService.updateUser(restClient, request, vendorId);

        return {
            message: "success"
        }
    }

    static async getUserPersonal(req: any, vendorId: string) {

        const userId: number = req.sessionManager.getLoggedInUserId();
        const userDetails: IDMUserProfile = await IDMService.getUserDetails(req.internalRestClient, `${userId}`, vendorId);
        let isAffiliate = false;
        try {
            const affiliate = await AffiliateService.getAffiliate(req.internalRestClient, userId, vendorId);
            isAffiliate = affiliate?.userId === userId;
        } catch (error) {
            logger.error(`[UserService] getUserPersonal Error :: ${JSON.stringify(error)}`);
        }

        const response: UserPersonal = {
            userId: userDetails.userId,
            displayName: userDetails.userHandle,
            emailStatus: userDetails.emailStatus,
            mobile: userDetails.mobile,
            mobileStatus: userDetails.mobileStatus,
            email: userDetails.email,
            displayPicture: userDetails.displayPicture,
            username_editable: userDetails?.customAttributes?.usernameEditable,
            isAffiliate: isAffiliate
        }

        return response;
    }

    static async checkUsername(req: any, reqBody: CheckUsernameRequest, vendorId: string) {

        const userId: number = req.sessionManager.getLoggedInUserId();
        const userDetails: IDMUserProfile = await IDMService.getUserByHandle(req.internalRestClient, reqBody?.username, vendorId);

        if (userDetails) {
            throw IDMServiceErrorUtil.getUsernameAlreadyExists();
        }

        const response: any = {
            msg: "Username avlb"
        }

        return response;
    }

    static async getUserSummary(req: any, vendorId: string) {

        const userId: number = req.sessionManager.getLoggedInUserId();
        const userDetailsRequest = IDMService.getUserDetails(req.internalRestClient, `${userId}`, vendorId);
        const walletRequest = SupernovaService.getUserWalletBalance(`${userId}`, req.internalRestClient, Number(vendorId));

        const [userDetails, walletDetails] = await Promise.all([userDetailsRequest, walletRequest]);
        redisService.setOnlineUsersInRedis(userId);

        const response: UserSummary = {
            userId: userDetails.userId,
            practiceChips: walletDetails.practiceBalance,
            realChips: {
                added: walletDetails.depositBalance,
                withdrawable: walletDetails.withdrawalBalance,
            },
            bonus: {
                totalAmount: 0,
                releasedAmount: 0,
            },
            effectiveBalance: walletDetails.withdrawalBalance + walletDetails.depositBalance,
            displayName: userDetails.userHandle,
            mobile: userDetails.mobile,
            userUniqueId: `${vendorId}_${userDetails.userId}`
        }

        return response;
    }


    static async getUserSummaryV2(req: any, vendorId: string) {

        const userId: number = req.sessionManager.getLoggedInUserId();
        const token = req?.cookieManager?.getToken();
        let userStats:any ={}
        const userDetailsRequest = IDMService.getUserDetails(req.internalRestClient, `${userId}`, vendorId);
        const walletRequest = SupernovaService.getBalanceV2(req.internalRestClient, `${userId}`, token, Number(vendorId));

        const [userDetails, walletDetails] = await Promise.all([userDetailsRequest, walletRequest]);
        try{
           userStats = await ZodiacService.getUserStats(req.internalRestClient, Number(userId));
           redisService.setOnlineUsersInRedis(userId);
        }
        catch (error) {
        }

        let practiceChipsBalance = walletDetails.practiceBalance;
        try{
            if(practiceChipsBalance < MIN_THRESHOLD_PRACTICE_BALANCE){
                const creditPracticeChipsRes =await SupernovaServiceV2.creditPracticeChipsV2(req.internalRestClient, {
                    userId: userId,
                    practiceBalance: CREDIT_PRACTICE_BALANCE
                }, Number(vendorId));
                logger.info(`[UserService] creditPracticeChipsRes :: ${JSON.stringify(creditPracticeChipsRes)}`);
                practiceChipsBalance = creditPracticeChipsRes.practiceBalance;
            }
        }
        catch (error) {
            logger.error(error,`[UserService] creditPracticeChips Error :: `);
        }

        const response: UserSummaryV2 = {
            userId: userDetails.userId,
            practiceChips: practiceChipsBalance,
            discountCreditBalance: walletDetails.discountCreditBalance,
            tournamentDiscountCreditBalance: walletDetails.tournamentDiscountCreditBalance,
            realChips: {
                added: walletDetails.playerGameBalance,
                withdrawable: walletDetails.winningBalance,
            },
            effectiveBalance: walletDetails.playerGameBalance + walletDetails.winningBalance + walletDetails.discountCreditBalance,
            displayName: userDetails.userHandle,
            mobile: userDetails.mobile,
            userUniqueId: `${vendorId}_${userDetails.userId}`,
            userStats: userStats || {}
        }

        return response;
    }

    static async getPracticeUserSummaryV2(req: any, vendorId: string) {

        const userId: number = req.sessionManager.getLoggedInUserId();
        const token = req?.cookieManager?.getToken();
        let userStats:any ={}
        const userDetailsRequest = IDMService.getUserDetails(req.internalRestClient, `${userId}`, vendorId);
        const walletRequest = SupernovaService.getBalanceV2(req.internalRestClient, `${userId}`, token, Number(vendorId));

        const [userDetails, walletDetails] = await Promise.all([userDetailsRequest, walletRequest]);
        try{
           userStats = await ZodiacService.getUserStats(req.internalRestClient, Number(userId));
           redisService.setPracticeAppOnlineUsersInRedis(userId);
        }
        catch (error) {
        }

        let practiceChipsBalance = walletDetails.practiceBalance;
        try{
            if(practiceChipsBalance < MIN_THRESHOLD_PRACTICE_BALANCE){
                const creditPracticeChipsRes =await SupernovaServiceV2.creditPracticeChipsV2(req.internalRestClient, {
                    userId: userId,
                    practiceBalance: CREDIT_PRACTICE_BALANCE
                }, Number(vendorId));
                logger.info(`[UserService] creditPracticeChipsRes :: ${JSON.stringify(creditPracticeChipsRes)}`);
                practiceChipsBalance = creditPracticeChipsRes.practiceBalance;
            }
        }
        catch (error) {
            logger.error(error,`[UserService] creditPracticeChips Error :: `);
        }

        const response: UserSummaryV2 = {
            userId: userDetails.userId,
            practiceChips: practiceChipsBalance,
            discountCreditBalance: walletDetails.discountCreditBalance,
            tournamentDiscountCreditBalance: walletDetails.tournamentDiscountCreditBalance,
            realChips: {
                added: walletDetails.playerGameBalance,
                withdrawable: walletDetails.winningBalance,
            },
            effectiveBalance: walletDetails.discountCreditBalance,
            displayName: userDetails.userHandle,
            mobile: userDetails.mobile,
            userUniqueId: `${vendorId}_${userDetails.userId}`,
            userStats: userStats || {}
        }

        return response;
    }

    static async getUserAvatars(req: any, vendorId: string) {
        const avatars = configService.getUserAvatarsForVendor()[vendorId];
        const response: UserAvatars = {
            avatar_url: avatars.allUserAvatars,
            default_avatar_url: avatars.defaultUserAvatar,
            msg: "avatar url list successfully fetched"
        }
        return response;
    }

    static async checkPermission(req: any) {
        return {
            isKycRequired: false,
            isAllowedAnyBankWithdrawal: true,
        }
    }

    static async verifyEmail(req: any, reqBody: VerifyEmailRequest, vendorId: string) {
        const userId = req.sessionManager.getLoggedInUserId();
        await IDMService.verifyOtp(req, vendorId, VerifyOTPContext.OTHER, userId, reqBody.otp);

        // Update user's email as OTP is verified & its a valid email
        await IDMService.updateUser(req.internalRestClient, {
            userId,
            email: reqBody.email,
            emailStatus: IDMEmailStatus.VERIFIED,
        }, vendorId);

        return {
            msg: "Verification Successful.",
            user_id: userId,
        }
    }

    static async getUsersTournamentSettingsInfo(restClient: any, usersDetails: Array<UserDetails>):Promise<any>{
        const usersDetailsPromise = UserService.getUsersDetails(restClient, usersDetails);
        const usersPanDetailPromise = UserService.getUsersPanDetails(restClient, usersDetails);
        const playerIds: Array<number> = usersDetails.map(userDetail => {return userDetail.userId})
        const usersGameSettingsPromise = ZodiacService.getBulkUserGameplaySettings(restClient, {playerIds});

        const [userDetailPromise, kycDetailPromise, gameplaySettingPromise] = await (Promise as any).allSettled([
            usersDetailsPromise,
            usersPanDetailPromise,
            usersGameSettingsPromise
        ])
        logger.info('getUsersTournamentSettingsInfo',{userDetailPromise, kycDetailPromise, gameplaySettingPromise});
        if (userDetailPromise.status === PROMISE_STATUS.REJECTED) {
            throw userDetailPromise.reason;
        }
        if (kycDetailPromise.status === PROMISE_STATUS.REJECTED) {
            throw kycDetailPromise.reason;
        }
        if (gameplaySettingPromise.status === PROMISE_STATUS.REJECTED) {
            throw gameplaySettingPromise.reason;
        }
        return {
            usersDetailsInfo: userDetailPromise.value,
            usersPanInfo: kycDetailPromise.value,
            usersGameplaySettings: gameplaySettingPromise.value
        }

    }


    static async getUsersDetails(restClient: any, usersDetails: Array<UserDetails>):Promise<Array<UserDetailInfo>>{
        const idmRequests: Array<Promise<any>>= []
        usersDetails.map(userDetail => {
            idmRequests.push(IDMService.getUserDetails(restClient, `${userDetail.userId}`, `${userDetail.vendorId}`))
        })
        const idmPromisesResponse: Array<any> = await (Promise as any).allSettled(idmRequests);
        const usersAvatarAndChatBanDetails = usersDetails.map((userDetail, index) => {
            const idmPromiseResponse = idmPromisesResponse[index];
            if (idmPromiseResponse.status === "fulfilled") {
                return {
                    ...userDetail,
                    ...UserService.getAvatarAndChatBanStatusFromIdmData(idmPromiseResponse.value)
                };
            } else {
                return {
                    ...userDetail,
                    avatarUrl: "",
                    chatBan: false,
                };
            }
        });
        return usersAvatarAndChatBanDetails
    }

    static async getUsersPanDetails(restClient: any, usersDetails: Array<UserDetails>):Promise<Array<UserPanDetailInfo>>{
        const guardianRequests: Array<any>= []
        const userKycFilter: UserKycFilter = getUserKYCFilterForAries();
        usersDetails.map(userDetail => {
            guardianRequests.push(GuardianService.getUserKycDetails(`${userDetail.userId}`, userKycFilter, restClient, `${userDetail.vendorId}`, true))
        })
        const gaurdianPromisesResponse: Array<any> = await (Promise as any).allSettled(guardianRequests);
        const usersPanHashInfo = usersDetails.map((userDetail, index) => {
            const guardianPromiseResponse = gaurdianPromisesResponse[index];
            if (guardianPromiseResponse.status === "fulfilled") {
                return {
                    ...userDetail,
                    ...UserService.getUserPanHashInfor(guardianPromiseResponse.value)
                };
            } else {
                return {
                    ...userDetail,
                    userPanHash: null
                };
            }
        });
        return usersPanHashInfo
    }

    private static getAvatarAndChatBanStatusFromIdmData(idmResponse: IDMUserProfile){
        return {
            avatarUrl: idmResponse.displayPicture || '',
            chatBan: IdmUtil.getChatBan(idmResponse)
        }
    }

    private static getUserPanHashInfor(userKycDetails: UserKycDetails){
        const panDetails: PanDetails = getUserPanDetails(userKycDetails);
        return {
            userPanHash: (panDetails?.panId !== undefined ? md5hash(panDetails?.panId || "") : null),
        }
    }

}
