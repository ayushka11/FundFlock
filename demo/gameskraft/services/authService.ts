import {APP_UNIQUE_CODE, CASH_APP, NEW_USER_PRACTICE_BALANCE, NO_OP, PROD_TEST_USERS,PRACTICE_APP} from '../constants/constants';
import {USER_CATEGORY, USER_TYPE} from '../constants/idm-constants';
import AuthServiceErrorUtil from '../errors/auth/auth-error-util';
import IDMServiceErrorUtil from '../errors/idm/idm-error-util';
import {
    IDMGenerateOtpResponse,
    IDMLoginWithPasswordResponse,
    IDMVerifyOTPResponse,
    VerifyOTPContext,
    TrueCallerPayload,
    IDMVerifyTrueCallerResponse,
    TrueCallerPayloadV2,
    IDMVerifyTrueCallerResponseV2
} from '../models/idm/request-response';
import {IDMUserProfile} from '../models/idm/user-idm';
import {TenetCustomerDetails} from '../models/payin/user-details';
import {
    GenerateOtpForgotPwdRequest,
    GenerateOtpRequest,
    GenerateOtpResponse,
    LoginWithPasswordRequest,
    LoginWithPasswordResponse,
    SetPasswordRequest,
    VerifyOtpRequest,
    VerifyOTPResponse,
    TrueCallerRequest,
    TrueCallerUserProfile,
    TrueCallerRequestV2
} from '../models/request/auth';
import EventNames from '../producer/enums/eventNames';
import EventPushService from '../producer/eventPushService';
import {md5hash} from '../utils/crypto-util';
import IdmUtil from '../utils/idm-utils';
import LoggerUtil from '../utils/logger';
import IDMService from './idmService';

import PayinService from './payinService';
import SupernovaService from './supernovaService';
import TrexControlCenter from './trexControlCenter';
import ZodiacService from './zodiacService';
import ReferralService from './referralService';
import ReferralServiceV2 from './v2/referralService';
import {UpdateUserRequest} from '../models/zodiac/update-user-request';
import {CreateUserRequest} from '../models/zodiac/create-user-request';
import {User} from '../models/zodiac/user';
import {DeviceInfo} from "../models/payin/request";
import {getDomainFromVendorId} from '../utils/auth-util';
import VendorUtil from "../utils/vendor-utils";
import { getNewAppReleaseConfigForPlatformForVendor } from './configService';
import { compareVersions } from 'compare-versions';
import RoyaltyService from './royaltyService';
import ClsUtil from '../utils/cls-util';
import { UserPropertyUpdateEvent } from '../models/rocket-events/user-property-update-events';
import DatetimeUtil from '../utils/datetime-util';
import RequestUtil from '../utils/request-util';
import ServiceErrorUtil from '../errors/service-error-util';

const communicationService = require("../services/communicationService");

const logger = LoggerUtil.get("IDMService");
const configService = require("../services/configService");

export default class AuthService {

    static async login(req: any, request: GenerateOtpRequest, vendorId: string, appType : string): Promise<GenerateOtpResponse> {
        logger.info(`generateOtp request`);
        const isValidGenerateOtpRequestId = RequestUtil.isValidGenerateOtpRequestId(req.internalRestClient);
        if (!isValidGenerateOtpRequestId) {
            const invalidRequestId = ServiceErrorUtil.getInvalidRequestId();
            throw invalidRequestId;
        }
        if (request.pwd_auth) { // Password based auth
            logger.info(`Password authentication ${request.mobile}`);

            const userDetails: IDMUserProfile = await IDMService.checkUserDetails(req.internalRestClient, request.mobile, vendorId);

            logger.info(userDetails, `Login - userDetails`);

            if (userDetails?.customAttributes?.pwdAuth) {
                logger.info(`Password enabled for the User according to the data in idm`);
                const response: GenerateOtpResponse = {
                    pwd_available: true,
                    signup_token: 'dummy', // TODO why is this needed by UI
                }

                return response;
            }
        }

        logger.info(`Password not enabled for the user`);

        if (!IdmUtil.validateMobileNumber(request.mobile)) {
            const invalidMobileError = IDMServiceErrorUtil.getInvalidMobileFormat();
            logger.info(`Invalid Mobile Format ${JSON.stringify(invalidMobileError)}`);
            throw invalidMobileError;
        }

        const generateOtpResponse: IDMGenerateOtpResponse = await IDMService.generateOtp(req, request.mobile, vendorId);

        if (!PROD_TEST_USERS.includes(request.mobile)) {
            communicationService.sendSMSForOTPLogin(
                req.internalRestClient,
                request.mobile,
                generateOtpResponse?.otp,
                VendorUtil.getAppUniqueCodeForVendor(vendorId, appType),
                vendorId,
              function (err, data) {
                  if (err) {
                      logger.error(err, 'Error from communicationService.sendSMSForOTPLogin in authService generateOtp');
                      return;
                  }

                  logger.info({data}, 'Successfully send OTP to user for generateOTP');
              });
        }

        const response: GenerateOtpResponse = {
            pwd_available: false,
            signup_token: 'dummy', // TODO REMOVE This after UI has removed signup token mandatorily
        };

        return response;
    }

    static async verifyOTPForgotPassword(req: any, verifyOtpRequest: VerifyOtpRequest, vendorId: string): Promise<any> {

        // DO Not proceed if User doesn't exist - Forgot password flow is only for existing users
        await IDMService.getUserDetails(req.internalRestClient, verifyOtpRequest?.mobile, vendorId);
        await this.verifyOTP(req, verifyOtpRequest, VerifyOTPContext.FORGOT_PASSWORD, vendorId);

        return {
            msg: "Forgot password OTP verified successfully"
        }
    }

    static async userLoggedinState(req: any, vendorId: string): Promise<any> {
        try {
            const existingToken = req.cookieManager.getToken();
            const userId = req?.sessionManager?.getLoggedInUserId();
            const vendorId = req.vendorId;

            await TrexControlCenter.validateToken(existingToken, req.internalRestClient);

            const userDetails: IDMUserProfile = await IDMService.getUserDetails(req.internalRestClient, userId, vendorId);
            const domain = getDomainFromVendorId(vendorId);
            const token = await TrexControlCenter.getToken(userId, userDetails?.userHandle, userDetails?.mobile, vendorId, domain, req.internalRestClient);
            req.cookieManager.setToken(token); // Token to be set in cookies for the App

            return {
                message: "success",
                session_id: token,
            };
        } catch (e) {
            logger.error(e, "Error in userLoggedin state");
            return {
                message: "invalid_user"
            }
        }
    }

    static async userSession(req: any, vendorId: string): Promise<any> {
        return {
            loggedInUserId: req?.sessionManager?.getLoggedInUserId()
        }
    }

    static async verifyOTPLogin(req: any, verifyOtpRequest: VerifyOtpRequest, vendorId: string): Promise<any> {
        return AuthService.verifyOTP(req, verifyOtpRequest, VerifyOTPContext.USER_LOGIN, vendorId);
    }
    // donot forget to change the admin Service createNewSystemUser flow if changing the signup flow
    static async verifyOTP(req: any, verifyOtpRequest: VerifyOtpRequest, context: VerifyOTPContext, vendorId: string) {
        logger.info({verifyOtpRequest}, `inside [authService] [verifyOTPLogin] with filter ::`);

        let userDetails: IDMUserProfile = await IDMService.checkUserDetails(req.internalRestClient, verifyOtpRequest.mobile, vendorId);
        let payinTenetCustomerId: string = userDetails?.customAttributes?.payinTenetCustomerId;
        const verifyOtpResponse: IDMVerifyOTPResponse = await IDMService.verifyOtp(req, vendorId, context, verifyOtpRequest.mobile, verifyOtpRequest.otp);
        const userId = verifyOtpResponse?.user?.userId;
        const appType = ClsUtil.getAppType();
        const platform = req.headers["gk-platform"]
        logger.info(`inside [authService] [verifyOTPLogin] platform ${platform}`);
        let firstLogin = false; // first login on app level (practice and cash)
        let isNewUser = false; // first login globally
        const currentTs : number = Date.now();
        const currentTime : string = DatetimeUtil.getUTCDate(new Date(currentTs)).toISOString();
        let userProperties: UserPropertyUpdateEvent = {};

        const appsflyerId: string = verifyOtpRequest.af_params?.appsflyer_id
        // very very IMP: pls change the code in AdminService createNewSystemUser if there is any change in signup flow
        if (!userDetails) {
            // NEW USER - Go for Signup flow

            logger.info("VerifyOTP - New User -- Registration flow for the new user");
            isNewUser = true;
            firstLogin = true;   // if new user then first login also

            const payinUserDetails: TenetCustomerDetails = await PayinService.createPayinUserDetails({
                mobile: verifyOtpRequest.mobile,
                uniqueRef: userId,
            }, req.internalRestClient, vendorId);
            payinTenetCustomerId = payinUserDetails?.tenetCustomerId;
            const avatars = configService.getUserAvatarsForVendor()[vendorId];
            const defaultUsername = await IdmUtil.getDefaultUsername(userId);
            logger.info(`[verifyOTP] defaultUsername - ${defaultUsername}`)
            const defaultUserAvatar = IdmUtil.getDefaultAvatar(avatars?.allUserAvatars ?? []) ?? avatars?.defaultUserAvatar;
            logger.info(`[verifyOTP] defaultUserAvatar - ${defaultUserAvatar}`)
            let updateUser: IDMUserProfile = {
                clientIdentifier: `${vendorId}_${userId}`,
                userUuid: md5hash(`${vendorId}_${verifyOtpRequest.mobile}`),
                userId: userId,
                displayPicture: defaultUserAvatar,
                customAttributes: {
                    payinTenetCustomerId: payinTenetCustomerId || '',
                    usernameEditable: isNewUser,
                    vendorUniqueUserId: '',
                    userTypes: USER_TYPE.NORMAL_USER.toString(),
                },
                userHandle: defaultUsername,
                displayName: defaultUsername,
            };

            if(appType == CASH_APP){
                updateUser.customAttributes.cashAppSignupTs = currentTs;
                userProperties.cashAppSignupTs = currentTime;
                userProperties.is_paid_app_user = true;
            }

            if(appType == PRACTICE_APP){
                updateUser.customAttributes.practiceAppSignupTs = currentTs;
                userProperties.practiceAppSignupTs = currentTime;
            }

            if (appsflyerId) {
                updateUser.customAttributes.appsFlyerCustomerId = appsflyerId
            }

            const userUpdateIdm = await IDMService.updateUser(req.internalRestClient, updateUser, vendorId);
            const createUserAccount = SupernovaService.createUserAccount(req.internalRestClient, {
                userId: userId,
                practiceBalance: NEW_USER_PRACTICE_BALANCE
            }, Number(vendorId));
            const createUserRequest: CreateUserRequest = {
                hasMigratedToApollo: true,
                showApolloUpdate: true,
                createdDirectlyOnApollo: true
            }
            const createZodiacUser = ZodiacService.createUser(req.internalRestClient, `${vendorId}_${userId}`, createUserRequest);

            //  Create New User's ReferCode
            const createUserReferCode = ReferralService.createUserReferCode(req.internalRestClient, userId);

            const createRoyaltyuser = RoyaltyService.createRoyaltyUser(req.internalRestClient, userId, vendorId)

            const [createUserAccRes, zodiacResponse, createUserReferCodeResponse, createRoyaltyuserResp] = await Promise.all([createUserAccount, createZodiacUser, createUserReferCode, createRoyaltyuser]);

            logger.info(`[authService] [verifyOTPLogin] userId :: ${userId} referCodeResp :: ${JSON.stringify(createUserReferCodeResponse)}`);

            //  Referral-ship creation call
            if (verifyOtpRequest.referralCode) {
                const referrer = await ReferralService.getUserByReferCode(req.internalRestClient, verifyOtpRequest.referralCode);
                logger.info(`[authService] [verifyOTPLogin] userId :: ${userId} referrer :: ${JSON.stringify(referrer)}`);
                if (referrer?.userId) {
                    //  Got a valid referCode from user
                    //  Create a referral-ship b/w user & referrer
                    const referralData: any = await ReferralServiceV2.addUserReferral(req.internalRestClient, userId, referrer.userId, verifyOtpRequest.mobile);
                    logger.info(`[authService] [verifyOTPLogin] userId :: ${userId} referrerUserId :: ${referrer.userId} referralData :: ${JSON.stringify(referralData)}`);
                }
            }

            // Get latest Userdetails after update
            userDetails = await IDMService.getUserDetails(req.internalRestClient, `${userId}`, vendorId);
            const deviceInfo = req?.sessionManager?.getUserDeviceInfo() || {}
            const eventDetails: DeviceInfo = {
                appVersionName: deviceInfo['gk-app-version-name'] || '',
                platform: platform ,
                osVersion: deviceInfo.osVersion,
                clientIpAddress: req?.sessionManager?.getClientIp(),
            }
        }
        //User already in tenet
        else {
            if (context === VerifyOTPContext.USER_LOGIN) {
                const zodiacUserInfo: User = await ZodiacService.getUserMigrationInfo(req.internalRestClient, `${vendorId}_${userId}`);
                if (!zodiacUserInfo?.has_migrated_to_apollo) {
                    const updateUserRequest: UpdateUserRequest = {
                        hasMigratedToApollo: true,
                        showApolloUpdate: true,
                        createdDirectlyOnApollo: false
                    }
                    const updateUser = ZodiacService.updateUser(req.internalRestClient, `${vendorId}_${userId}`, updateUserRequest);
                    const createUserAccount = SupernovaService.createUserAccount(req.internalRestClient, {
                        userId: userId,
                        practiceBalance: NEW_USER_PRACTICE_BALANCE
                    }, Number(vendorId));
                    const [createUserAccRes, zodiacResponse] = await Promise.all([createUserAccount, updateUser]);
                    logger.info(`[authService] [verifyOTPLogin] userId :: ${userId} createUserAccountResponse :: ${JSON.stringify(createUserAccRes)} :: updateUserZodiacResponse :: ${JSON.stringify(zodiacResponse)}`);
                }

                //TODO  Please remove this call after 100% trafic to new ms
                // Create PayinTenetCustomerID If not present & Update it in the User
                // This check is for corner cases during migration, can be removed later as registration ensures payin customerid in idm

                let updateUser: IDMUserProfile = {
                    userId: userId,
                    customAttributes: {}
                };

                if (!verifyOtpResponse?.user?.customAttributes?.payinTenetCustomerId) {
                    const payinUserDetails: TenetCustomerDetails = await PayinService.createPayinUserDetails({
                        mobile: verifyOtpRequest.mobile,
                        uniqueRef: userId,
                    }, req.internalRestClient, vendorId);
                    payinTenetCustomerId = payinUserDetails?.tenetCustomerId;

                    updateUser.customAttributes.payinTenetCustomerId = payinTenetCustomerId;
                }

                if (appsflyerId) {
                    updateUser.customAttributes.appsFlyerCustomerId = appsflyerId
                }

                if(!verifyOtpResponse?.user?.customAttributes?.cashAppSignupTs && appType == CASH_APP){
                    firstLogin = true;
                    updateUser.customAttributes.cashAppSignupTs = currentTs;
                    userProperties.cashAppSignupTs = currentTime;
                    userProperties.is_paid_app_user = true;
                }

                if(!verifyOtpResponse?.user?.customAttributes?.practiceAppSignupTs && appType == PRACTICE_APP){
                    firstLogin = true;
                    updateUser.customAttributes.practiceAppSignupTs = currentTs;
                    userProperties.practiceAppSignupTs = currentTime;
                }

                IDMService.updateUser(req.internalRestClient, updateUser, vendorId).then(NO_OP).catch(e => {
                    logger.error(e, "Error in updating user customAttributes If not present");
                });

            }
        }

        //Check for Login Ban Here and throw error if user is banned
        const isLoginBan = IdmUtil.getLoginBan(userDetails);
        if (isLoginBan) {
            throw AuthServiceErrorUtil.getUserLoginBanned();
        }

        if(firstLogin){

            const deviceInfo = req?.sessionManager?.getUserDeviceInfo() || {}
            const eventDetails: DeviceInfo = {
                appVersionName: deviceInfo['gk-app-version-name'],
                platform: platform,
                osVersion: deviceInfo.osVersion,
                clientIpAddress: req?.sessionManager?.getClientIp(),
            }
            EventPushService.push(userId, Number(vendorId), PRACTICE_APP, EventNames.USER_SIGNUP_SUCCESS, eventDetails);
            EventPushService.push(userId, Number(vendorId), CASH_APP, EventNames.USER_SIGNUP_SUCCESS, eventDetails);

            // now updating user properties (signup date) for both app
            EventPushService.push(userId, Number(vendorId), PRACTICE_APP, EventNames.USER_PROPERTIES_UPDATE, userProperties)
            EventPushService.push(userId, Number(vendorId), CASH_APP, EventNames.USER_PROPERTIES_UPDATE, userProperties)
        }
        // Common flow for ALL

        return this.initiateLoginForUser(req, userDetails, vendorId, payinTenetCustomerId, isNewUser,firstLogin);
    }

    static async verifyTrueCallerLogin(req: any, verifyTrueCallerRequest: TrueCallerRequest, vendorId: string) {
        logger.info(verifyTrueCallerRequest, "inside [authService] [verifyTrueCallerLogin] verifyTrueCallerRequest");

        const userProfileString :string = Buffer.from(verifyTrueCallerRequest.payload, 'base64').toString('ascii');
        const userprofile : TrueCallerUserProfile = JSON.parse(userProfileString);
        logger.info(userprofile, "inside [authService] [verifyTrueCallerLogin] userprofile");
        let phoneNumber : string = userprofile.phoneNumber;
        phoneNumber = phoneNumber.substring(phoneNumber.length - 10);
        let userDetails: IDMUserProfile = await IDMService.checkUserDetails(req.internalRestClient, phoneNumber, vendorId);
        let payinTenetCustomerId: string = userDetails?.customAttributes?.payinTenetCustomerId;
        logger.info(userDetails, "inside [authService] [verifyTrueCallerLogin] userDetails");

        let truecallerPayload: TrueCallerPayload = {
            providerType:verifyTrueCallerRequest?.providerType,
            encryption: {
                payload: verifyTrueCallerRequest?.payload ,
                signature: verifyTrueCallerRequest?.signature ,
                algorithm: verifyTrueCallerRequest?.signatureAlgorithm
            }
        };
        const verifyTruecallerResponse : IDMVerifyTrueCallerResponse = await IDMService.verifyTrueCaller(req, truecallerPayload, vendorId );
        logger.info(verifyTruecallerResponse, "inside [authService] [verifyTrueCallerLogin] verifyTruecallerResponse ::");

        const userId = verifyTruecallerResponse?.user?.userId;
        phoneNumber = verifyTruecallerResponse?.user?.mobile;

        const appType = ClsUtil.getAppType();
        const platform = req.headers["gk-platform"]
        logger.info(`inside [authService] [verifyTrueCallerLogin] platform ${platform}`);
        let firstLogin = false; // first login on app level (practice and cash)
        let isNewUser = false; // first login globally
        const currentTs : number = Date.now();
        const currentTime : string = DatetimeUtil.getTimeZoneDate(new Date(currentTs)).toISOString();
        let userProperties: UserPropertyUpdateEvent = {};

        const appsflyerId: string = verifyTrueCallerRequest.af_params?.appsflyer_id

        if (!userDetails) {
            // NEW USER - Go for Signup flow

            logger.info("verifyTrueCallerLogin - New User -- Registration flow for the new user");
            isNewUser = true;
            firstLogin = true;

            const payinUserDetails: TenetCustomerDetails = await PayinService.createPayinUserDetails({
                mobile: phoneNumber,
                uniqueRef: userId,
            }, req.internalRestClient, vendorId);
            payinTenetCustomerId = payinUserDetails?.tenetCustomerId;
            const avatars = configService.getUserAvatarsForVendor()[vendorId];
            const defaultUsername = await IdmUtil.getDefaultUsername(userId);
            logger.info(`[verifyTrueCallerLogin] defaultUsername - ${defaultUsername}`)
            const defaultUserAvatar = IdmUtil.getDefaultAvatar(avatars?.allUserAvatars ?? []) ?? avatars?.defaultUserAvatar;
            logger.info(`[verifyTrueCallerLogin] defaultUserAvatar - ${defaultUserAvatar}`)
            let updateUser: IDMUserProfile = {
                clientIdentifier: `${vendorId}_${userId}`,
                userUuid: md5hash(`${vendorId}_${phoneNumber}`),
                userId: userId,
                displayPicture: defaultUserAvatar,
                customAttributes: {
                    payinTenetCustomerId: payinTenetCustomerId || '',
                    usernameEditable: isNewUser,
                    vendorUniqueUserId: '',
                    userTypes: USER_TYPE.NORMAL_USER.toString(),
                },
                userHandle: defaultUsername,
                displayName: defaultUsername,
            };

            if (appsflyerId) {
                updateUser.customAttributes.appsFlyerCustomerId = appsflyerId
            }

            if(appType == CASH_APP){
                updateUser.customAttributes.cashAppSignupTs = currentTs;
                userProperties.cashAppSignupTs = currentTime;
                userProperties.is_paid_app_user = true;
            }

            if(appType == PRACTICE_APP){
                updateUser.customAttributes.practiceAppSignupTs = currentTs;
                userProperties.practiceAppSignupTs = currentTime;
            }

            const userUpdateIdm = await IDMService.updateUser(req.internalRestClient, updateUser, vendorId);

            const createUserAccount = SupernovaService.createUserAccount(req.internalRestClient, {
                userId: userId,
                practiceBalance: NEW_USER_PRACTICE_BALANCE
            }, Number(vendorId));

            const createUserRequest: CreateUserRequest = {
                hasMigratedToApollo: true,
                showApolloUpdate: true,
                createdDirectlyOnApollo: true
            }
            const createZodiacUser = ZodiacService.createUser(req.internalRestClient, `${vendorId}_${userId}`, createUserRequest);

            //  Create New User's ReferCode
            const createUserReferCode = ReferralService.createUserReferCode(req.internalRestClient, userId);

            // create New Royalty User
            const createRoyaltyuser = RoyaltyService.createRoyaltyUser(req.internalRestClient, userId, vendorId)

            const [createUserAccRes, zodiacResponse, createUserReferCodeResponse, createRoyaltyuserResponse] = await Promise.all([createUserAccount, createZodiacUser, createUserReferCode, createRoyaltyuser]);

            logger.info(`[authService] [verifyTrueCallerLogin] userId :: ${userId} referCodeResp :: ${JSON.stringify(createUserReferCodeResponse)}`);

            //  Referral-ship creation call
            if (verifyTrueCallerRequest.referralCode) {
                const referrer = await ReferralService.getUserByReferCode(req.internalRestClient, verifyTrueCallerRequest.referralCode);
                logger.info(`[authService] [verifyTrueCallerLogin] userId :: ${userId} referrer :: ${JSON.stringify(referrer)}`);
                if (referrer?.userId) {
                    //  Got a valid referCode from user
                    //  Create a referral-ship b/w user & referrer
                    const referralData: any = await ReferralServiceV2.addUserReferral(req.internalRestClient, userId, referrer.userId, phoneNumber);
                    logger.info(`[authService] [verifyTrueCallerLogin] userId :: ${userId} referrerUserId :: ${referrer.userId} referralData :: ${JSON.stringify(referralData)}`);
                }
            }

            // Get latest Userdetails after update
            userDetails = await IDMService.getUserDetails(req.internalRestClient, `${userId}`, vendorId);
            const deviceInfo = req?.sessionManager?.getUserDeviceInfo() || {}
            const eventDetails: DeviceInfo = {
                appVersionName: deviceInfo['gk-app-version-name'],
                platform: platform,
                osVersion: deviceInfo.osVersion,
                clientIpAddress: req?.sessionManager?.getClientIp(),
            }

        }
        else{
            //User already in tenet

            const zodiacUserInfo: User = await ZodiacService.getUserMigrationInfo(req.internalRestClient, `${vendorId}_${userId}`);
            if (!zodiacUserInfo?.has_migrated_to_apollo) {
                const updateUserRequest: UpdateUserRequest = {
                    hasMigratedToApollo: true,
                    showApolloUpdate: true,
                    createdDirectlyOnApollo: false
                }
                const updateUser = ZodiacService.updateUser(req.internalRestClient, `${vendorId}_${userId}`, updateUserRequest);
                const createUserAccount = SupernovaService.createUserAccount(req.internalRestClient, {
                    userId: userId,
                    practiceBalance: NEW_USER_PRACTICE_BALANCE
                }, Number(vendorId));
                const [createUserAccRes, zodiacResponse] = await Promise.all([createUserAccount, updateUser]);
                logger.info(`[authService] [verifyTrueCallerLogin] userId :: ${userId} createUserAccountResponse :: ${JSON.stringify(createUserAccRes)} :: updateUserZodiacResponse :: ${JSON.stringify(zodiacResponse)}`);
            }

            let updateUser: IDMUserProfile = {
                userId: userId,
                customAttributes: {}
            };

            if (!verifyTruecallerResponse?.user?.customAttributes?.payinTenetCustomerId) {
                const payinUserDetails: TenetCustomerDetails = await PayinService.createPayinUserDetails({
                    mobile: phoneNumber,
                    uniqueRef: userId,
                }, req.internalRestClient, vendorId);
                payinTenetCustomerId = payinUserDetails?.tenetCustomerId;

                updateUser.customAttributes.payinTenetCustomerId = payinTenetCustomerId;

            }

            if (appsflyerId) {
                updateUser.customAttributes.appsFlyerCustomerId = appsflyerId
            }

            if(!verifyTruecallerResponse?.user?.customAttributes?.cashAppSignupTs && appType == CASH_APP){
                firstLogin = true;
                updateUser.customAttributes.cashAppSignupTs = currentTs;
                userProperties.cashAppSignupTs = currentTime;
                userProperties.is_paid_app_user = true;
            }

            if(!verifyTruecallerResponse?.user?.customAttributes?.practiceAppSignupTs && appType == PRACTICE_APP){
                firstLogin = true;
                updateUser.customAttributes.practiceAppSignupTs = currentTs;
                userProperties.practiceAppSignupTs = currentTime;
            }

            IDMService.updateUser(req.internalRestClient, updateUser, vendorId).then(NO_OP).catch(e => {
                logger.error(e, "Error in updating user PayinTenetCustomerID If not present");
            });

        }

        //Check for Login Ban Here and throw error if user is banned
        const isLoginBan = IdmUtil.getLoginBan(userDetails);
        if (isLoginBan) {
            throw AuthServiceErrorUtil.getUserLoginBanned();
        }

        if(firstLogin){

            const deviceInfo = req?.sessionManager?.getUserDeviceInfo() || {}
            const eventDetails: DeviceInfo = {
                appVersionName: deviceInfo['gk-app-version-name'],
                platform: platform,
                osVersion: deviceInfo.osVersion,
                clientIpAddress: req?.sessionManager?.getClientIp(),
            }
            EventPushService.push(userId, Number(vendorId), PRACTICE_APP, EventNames.USER_SIGNUP_SUCCESS, eventDetails);
            EventPushService.push(userId, Number(vendorId), CASH_APP, EventNames.USER_SIGNUP_SUCCESS, eventDetails);

            // now updating user properties (signup date) for both app
            EventPushService.push(userId, Number(vendorId), PRACTICE_APP, EventNames.USER_PROPERTIES_UPDATE, userProperties)
            EventPushService.push(userId, Number(vendorId), CASH_APP, EventNames.USER_PROPERTIES_UPDATE, userProperties)
        }
        return this.initiateLoginForUser(req, userDetails, vendorId, payinTenetCustomerId, isNewUser,firstLogin);
    }

    static async verifyTrueCallerLoginV2(req: any, verifyTrueCallerRequest: TrueCallerRequestV2, vendorId: string) {
        logger.info(verifyTrueCallerRequest, "inside [authService] [verifyTrueCallerLoginV2] verifyTrueCallerRequest");
        const appType = ClsUtil.getAppType();
        const platform = req.headers["gk-platform"]
        logger.info(`inside [authService] [verifyTrueCallerLoginV2] platform ${platform}`);
        let truecallerPayload: TrueCallerPayloadV2 = {
            providerType:verifyTrueCallerRequest?.providerType,
            appType: appType,
            authInfo:{
                codeVerifier: verifyTrueCallerRequest?.codeVerifier,
                code: verifyTrueCallerRequest?.authorizationCode
            }
        };
        const verifyTruecallerResponse : IDMVerifyTrueCallerResponseV2 = await IDMService.verifyTrueCallerV2(req, truecallerPayload, vendorId );
        logger.info(verifyTruecallerResponse, "inside [authService] [verifyTrueCallerLoginV2] verifyTruecallerResponse ::");

        const userId = verifyTruecallerResponse?.user?.userId;
        let userDetails = await IDMService.getUserDetails(req.internalRestClient, `${userId}`, vendorId);
        logger.info(userDetails, "inside [authService] [verifyTrueCallerLoginV2] userDetails ::");
        let payinTenetCustomerId: string = userDetails?.customAttributes?.payinTenetCustomerId;
        const phoneNumber = userDetails?.mobile;

        let firstLogin = false; // first login on app level (practice and cash)
        let isNewUser = false; // first login globally
        const currentTs : number = Date.now();
        const currentTime : string = DatetimeUtil.getTimeZoneDate(new Date(currentTs)).toISOString();
        let userProperties: UserPropertyUpdateEvent = {};

        const appsflyerId: string = verifyTrueCallerRequest.af_params?.appsflyer_id

        if (verifyTruecallerResponse?.isNewUser) {
            // NEW USER - Go for Signup flow

            logger.info("verifyTrueCallerLogin - New User -- Registration flow for the new user");
            isNewUser = true;
            firstLogin = true;

            const payinUserDetails: TenetCustomerDetails = await PayinService.createPayinUserDetails({
                mobile: phoneNumber,
                uniqueRef: userId,
            }, req.internalRestClient, vendorId);
            payinTenetCustomerId = payinUserDetails?.tenetCustomerId;
            const avatars = configService.getUserAvatarsForVendor()[vendorId];
            const defaultUsername = await IdmUtil.getDefaultUsername(userId);
            logger.info(`[verifyTrueCallerLogin] defaultUsername - ${defaultUsername}`)
            const defaultUserAvatar = IdmUtil.getDefaultAvatar(avatars?.allUserAvatars ?? []) ?? avatars?.defaultUserAvatar;
            logger.info(`[verifyTrueCallerLogin] defaultUserAvatar - ${defaultUserAvatar}`)
            let updateUser: IDMUserProfile = {
                clientIdentifier: `${vendorId}_${userId}`,
                userUuid: md5hash(`${vendorId}_${phoneNumber}`),
                userId: userId,
                displayPicture: defaultUserAvatar,
                customAttributes: {
                    payinTenetCustomerId: payinTenetCustomerId || '',
                    usernameEditable: isNewUser,
                    vendorUniqueUserId: '',
                    userTypes: USER_TYPE.NORMAL_USER.toString(),
                },
                userHandle: defaultUsername,
                displayName: defaultUsername,
            };

            if (appsflyerId) {
                updateUser.customAttributes.appsFlyerCustomerId = appsflyerId
            }

            if(appType == CASH_APP){
                updateUser.customAttributes.cashAppSignupTs = currentTs;
                userProperties.cashAppSignupTs = currentTime;
                userProperties.is_paid_app_user = true;
            }

            if(appType == PRACTICE_APP){
                updateUser.customAttributes.practiceAppSignupTs = currentTs;
                userProperties.practiceAppSignupTs = currentTime;
            }

            const userUpdateIdm = await IDMService.updateUser(req.internalRestClient, updateUser, vendorId);

            const createUserAccount = SupernovaService.createUserAccount(req.internalRestClient, {
                userId: userId,
                practiceBalance: NEW_USER_PRACTICE_BALANCE
            }, Number(vendorId));

            const createUserRequest: CreateUserRequest = {
                hasMigratedToApollo: true,
                showApolloUpdate: true,
                createdDirectlyOnApollo: true
            }
            const createZodiacUser = ZodiacService.createUser(req.internalRestClient, `${vendorId}_${userId}`, createUserRequest);

            //  Create New User's ReferCode
            const createUserReferCode = ReferralService.createUserReferCode(req.internalRestClient, userId);

            const [createUserAccRes, zodiacResponse, createUserReferCodeResponse] = await Promise.all([createUserAccount, createZodiacUser, createUserReferCode]);

            logger.info(`[authService] [verifyTrueCallerLogin] userId :: ${userId} referCodeResp :: ${JSON.stringify(createUserReferCodeResponse)}`);

            //  Referral-ship creation call
            if (verifyTrueCallerRequest.referralCode) {
                const referrer = await ReferralService.getUserByReferCode(req.internalRestClient, verifyTrueCallerRequest.referralCode);
                logger.info(`[authService] [verifyTrueCallerLogin] userId :: ${userId} referrer :: ${JSON.stringify(referrer)}`);
                if (referrer?.userId) {
                    //  Got a valid referCode from user
                    //  Create a referral-ship b/w user & referrer
                    const referralData: any = await ReferralServiceV2.addUserReferral(req.internalRestClient, userId, referrer.userId, phoneNumber);
                    logger.info(`[authService] [verifyTrueCallerLogin] userId :: ${userId} referrerUserId :: ${referrer.userId} referralData :: ${JSON.stringify(referralData)}`);
                }
            }

            // Get latest Userdetails after update
            userDetails = await IDMService.getUserDetails(req.internalRestClient, `${userId}`, vendorId);
            const deviceInfo = req?.sessionManager?.getUserDeviceInfo() || {}
            const eventDetails: DeviceInfo = {
                appVersionName: deviceInfo['gk-app-version-name'],
                platform: platform,
                osVersion: deviceInfo.osVersion,
                clientIpAddress: req?.sessionManager?.getClientIp(),
            }

        }
        else{
            //User already in tenet

            const zodiacUserInfo: User = await ZodiacService.getUserMigrationInfo(req.internalRestClient, `${vendorId}_${userId}`);
            if (!zodiacUserInfo?.has_migrated_to_apollo) {
                const updateUserRequest: UpdateUserRequest = {
                    hasMigratedToApollo: true,
                    showApolloUpdate: true,
                    createdDirectlyOnApollo: false
                }
                const updateUser = ZodiacService.updateUser(req.internalRestClient, `${vendorId}_${userId}`, updateUserRequest);
                const createUserAccount = SupernovaService.createUserAccount(req.internalRestClient, {
                    userId: userId,
                    practiceBalance: NEW_USER_PRACTICE_BALANCE
                }, Number(vendorId));
                const [createUserAccRes, zodiacResponse] = await Promise.all([createUserAccount, updateUser]);
                logger.info(`[authService] [verifyTrueCallerLogin] userId :: ${userId} createUserAccountResponse :: ${JSON.stringify(createUserAccRes)} :: updateUserZodiacResponse :: ${JSON.stringify(zodiacResponse)}`);
            }

            let updateUser: IDMUserProfile = {
                userId: userId,
                customAttributes: {}
            };

            if (!verifyTruecallerResponse?.user?.customAttributes?.payinTenetCustomerId) {
                const payinUserDetails: TenetCustomerDetails = await PayinService.createPayinUserDetails({
                    mobile: phoneNumber,
                    uniqueRef: userId,
                }, req.internalRestClient, vendorId);
                payinTenetCustomerId = payinUserDetails?.tenetCustomerId;

                updateUser.customAttributes.payinTenetCustomerId = payinTenetCustomerId;

            }

            if (appsflyerId) {
                updateUser.customAttributes.appsFlyerCustomerId = appsflyerId
            }

            if(!verifyTruecallerResponse?.user?.customAttributes?.cashAppSignupTs && appType == CASH_APP){
                firstLogin = true;
                updateUser.customAttributes.cashAppSignupTs = currentTs;
                userProperties.cashAppSignupTs = currentTime;
                userProperties.is_paid_app_user = true;
            }

            if(!verifyTruecallerResponse?.user?.customAttributes?.practiceAppSignupTs && appType == PRACTICE_APP){
                firstLogin = true;
                updateUser.customAttributes.practiceAppSignupTs = currentTs;
                userProperties.practiceAppSignupTs = currentTime;
            }

            IDMService.updateUser(req.internalRestClient, updateUser, vendorId).then(NO_OP).catch(e => {
                logger.error(e, "Error in updating user PayinTenetCustomerID If not present");
            });

        }
        //Check for Login Ban Here and throw error if user is banned
        const isLoginBan = IdmUtil.getLoginBan(userDetails);
        if (isLoginBan) {
            throw AuthServiceErrorUtil.getUserLoginBanned();
        }

        if(firstLogin){

            const deviceInfo = req?.sessionManager?.getUserDeviceInfo() || {}
            const eventDetails: DeviceInfo = {
                appVersionName: deviceInfo['gk-app-version-name'],
                platform: platform,
                osVersion: deviceInfo.osVersion,
                clientIpAddress: req?.sessionManager?.getClientIp(),
            }
            EventPushService.push(userId, Number(vendorId), PRACTICE_APP, EventNames.USER_SIGNUP_SUCCESS, eventDetails);
            EventPushService.push(userId, Number(vendorId), CASH_APP, EventNames.USER_SIGNUP_SUCCESS, eventDetails);

            // now updating user properties (signup date) for both app
            EventPushService.push(userId, Number(vendorId), PRACTICE_APP, EventNames.USER_PROPERTIES_UPDATE, userProperties)
            EventPushService.push(userId, Number(vendorId), CASH_APP, EventNames.USER_PROPERTIES_UPDATE, userProperties)
        }
        return this.initiateLoginForUser(req, userDetails, vendorId, payinTenetCustomerId, isNewUser,firstLogin);
    }

    static async initiateLoginForUser(req: any, userDetails: IDMUserProfile, vendorId: string, payinTenetCustomerId: string, isNewUser: boolean, firstLogin: boolean) {

        const userId = userDetails?.userId;
        const domain = getDomainFromVendorId(vendorId);
        const tokenRequest = TrexControlCenter.getToken(userId, userDetails?.userHandle, userDetails?.mobile, vendorId, domain, req.internalRestClient);
        const setLoggedInUser = req.sessionManager.setLoggedInUser(userId);
        const setUserSession = req.sessionManager.updateUserSessionInRedis();
        const setPayinCustomerId = req.sessionManager.setPayinCustomerId(payinTenetCustomerId);

        const [token, loggedInUserRedisResponse, userSessionRedisResponse] = await Promise.all([tokenRequest, setLoggedInUser, setUserSession, setPayinCustomerId]);
        req.cookieManager.setToken(token); // Token to be set in cookies for the App

        // TODO Remove this user after all the user has migrated to Royalty V2 App
        // Check if the User has moved to Upgraded Version of App
        const headers = req?.headers;

        let appVersion: string = '';
        if (req.headers.hasOwnProperty("gk-app-version-name")) {
            appVersion = req.headers["gk-app-version-name"]
        }


        let platform: string = ''
        if (headers.hasOwnProperty("gk-platform")) {
            platform = headers["gk-platform"]
        }

        const newAppReleaseConfig = getNewAppReleaseConfigForPlatformForVendor()[vendorId];
        let newAppReleaseConfigForPlatform;
        if (platform && platform !== ''){
            newAppReleaseConfigForPlatform = newAppReleaseConfig[platform];
        }
        const baseRoyaltyV2App = newAppReleaseConfig?.baseRoyaltyV2App

        logger.info(`[initiateLoginForUser] newAppReleaseConfigForPlatform = ${JSON.stringify(newAppReleaseConfigForPlatform)}, newAppVersion = ${baseRoyaltyV2App}`);

        // If user has an app with RoyaltyV2 then just upgradeRoyaltyVersion
        if(baseRoyaltyV2App && baseRoyaltyV2App != '' && appVersion !='' && compareVersions(appVersion, baseRoyaltyV2App) >= 0) {
            RoyaltyService.upgradeUserRoyaltyVersion(req.internalRestClient, userId);
        }

        const response: VerifyOTPResponse = {
            "userId": userId,
            "mobile": userDetails.mobile,
            "first_login": firstLogin, // it will remain same indicates first_login on that app
            "is_new_user" : isNewUser,  // is new to system
            "username_editable": userDetails?.customAttributes?.usernameEditable || false,
            "session_id": token,
        }

        return response;
    }

    static async loginWithPassword(req: any, loginWithPassRequest: LoginWithPasswordRequest, vendorId: string) {
        const userDetails: IDMUserProfile = await IDMService.getUserDetails(req.internalRestClient, `${loginWithPassRequest.mobile}`, vendorId);
        const userId: number = userDetails?.userId;
        const platform = req.headers["gk-platform"]
        logger.info(`inside [authService] [loginWithPassword] platform ${platform}`);
        let payinTenetCustomerId: string = userDetails?.customAttributes?.payinTenetCustomerId;
        if (!userDetails?.customAttributes?.isPasswordResetDone) {
            const oldHashPwd = userDetails?.customAttributes?.oldHashPwd;
            const hashPwdInReq = md5hash(loginWithPassRequest.password);

            if (oldHashPwd !== hashPwdInReq) { // Password match
                throw AuthServiceErrorUtil.getIncorrectPassword();
            }

            // Reset the password in IDM
            const context = VerifyOTPContext.PASSWORD_SIGN_UP;
            const generateOtpResponse: IDMGenerateOtpResponse = await IDMService.generateOtp(req, `${userDetails?.userId}`, vendorId);
            await IDMService.verifyOtp(req, vendorId, context, `${userDetails?.userId}`, generateOtpResponse.otp);

            await IDMService.updateUserPassword(req.internalRestClient, `${userDetails.userId}`, loginWithPassRequest.password, context, vendorId);
            await IDMService.updateUser(req.internalRestClient, {
                userId: userDetails.userId,
                customAttributes: {
                    isPasswordResetDone: true,
                    pwdAuth: 1,
                }
            }, vendorId);
        }

        const loginWithPasswordResponse: IDMLoginWithPasswordResponse = await IDMService.loginWithPassword(req.internalRestClient, loginWithPassRequest.mobile, loginWithPassRequest.password, vendorId);
        const zodiacUserInfo: User = await ZodiacService.getUserMigrationInfo(req.internalRestClient, `${vendorId}_${userId}`);
        if (!zodiacUserInfo?.has_migrated_to_apollo) {
            const updateUserRequest: UpdateUserRequest = {
                hasMigratedToApollo: true,
                showApolloUpdate: true,
                createdDirectlyOnApollo: false
            }
            const updateUser = ZodiacService.updateUser(req.internalRestClient, `${vendorId}_${userId}`, updateUserRequest);
            const createUserAccount = SupernovaService.createUserAccount(req.internalRestClient, {
                userId: userId,
                practiceBalance: NEW_USER_PRACTICE_BALANCE
            }, Number(vendorId));
            const [createUserAccRes, zodiacResponse] = await Promise.all([createUserAccount, updateUser]);
            logger.info(`[authService] [PasswordLogin] userId :: ${userId} createUserAccountResponse :: ${JSON.stringify(createUserAccRes)} :: updateUserZodiacResponse :: ${JSON.stringify(zodiacResponse)}`);
        }

        //TODO  Please remove this call after 100% trafic to new ms
        // Create PayinTenetCustomerID If not present & Update it in the User
        // This check is for corner cases during migration, can be removed later as registration ensures payin customerid in idm

        if (!userDetails?.customAttributes?.payinTenetCustomerId) {
            const payinUserDetails: TenetCustomerDetails = await PayinService.createPayinUserDetails({
                mobile: userDetails?.mobile,
                uniqueRef: userId,
            }, req.internalRestClient, vendorId);
            payinTenetCustomerId = payinUserDetails?.tenetCustomerId;

            let updateUser: IDMUserProfile = {
                userId: userId,
                customAttributes: {
                    payinTenetCustomerId: payinTenetCustomerId
                }
            };

            IDMService.updateUser(req.internalRestClient, updateUser, vendorId).then(NO_OP).catch(e => {
                logger.error(e, "Error in updating user PayinTenetCustomerID If not present");
            });
        }

        const isLoginBan = IdmUtil.getLoginBan(userDetails);
        if (isLoginBan) {
            throw AuthServiceErrorUtil.getUserLoginBanned();
        }
        let firstLogin =false;
        const currentTs : number = Date.now();
        const currentTime : string = DatetimeUtil.getTimeZoneDate(new Date(currentTs)).toISOString();
        let userProperties: UserPropertyUpdateEvent = {};

        if(!userDetails?.customAttributes?.cashAppSignupTs){
            firstLogin = true;
            let updateUser: IDMUserProfile = {
                userId: userId,
                customAttributes: {
                    cashAppSignupTs: currentTs,
                }
            };
            userProperties.cashAppSignupTs = currentTime;
            userProperties.is_paid_app_user = true;
            IDMService.updateUser(req.internalRestClient, updateUser, vendorId).then(NO_OP).catch(e => {
                logger.error(e, "Error in updating user cashAppSignupTs");
            });
        }
        if(firstLogin){
            const deviceInfo = req?.sessionManager?.getUserDeviceInfo() || {}
            const eventDetails: DeviceInfo = {
                appVersionName: deviceInfo['gk-app-version-name'],
                platform: platform,
                osVersion: deviceInfo.osVersion,
                clientIpAddress: req?.sessionManager?.getClientIp(),
            }
            EventPushService.push(userId, Number(vendorId), PRACTICE_APP, EventNames.USER_SIGNUP_SUCCESS, eventDetails);
            EventPushService.push(userId, Number(vendorId), CASH_APP, EventNames.USER_SIGNUP_SUCCESS, eventDetails);

            // now updating user properties (signup date) for both app
            EventPushService.push(userId, Number(vendorId), PRACTICE_APP, EventNames.USER_PROPERTIES_UPDATE, userProperties)
            EventPushService.push(userId, Number(vendorId), CASH_APP, EventNames.USER_PROPERTIES_UPDATE, userProperties)
        }
        const loginResponse: any = await this.initiateLoginForUser(req, userDetails, vendorId, payinTenetCustomerId, false,firstLogin);

        const response: LoginWithPasswordResponse = {
            userId: userDetails?.userId,
            token: loginResponse.session_id,
        }

        return response;
    }

    static async refreshToken(req: any) {
        const token = await TrexControlCenter.refreshToken(req.cookieManager.getToken(), req.internalRestClient);
        req.cookieManager.setToken(token); // Set the latest token to cookie
        return {};
    }

    static async logoutUser(req) {
        const userId = req.sessionManager.getLoggedInUserId();
        const token = req.cookieManager.getToken();
        const vendorId = req.vendorId;

        await Promise.all([
            req.sessionManager.removeSession(),
            req.sessionManager.removeUserSession(),
        ]);

        TrexControlCenter.logout(token, req.internalRestClient).then(NO_OP).catch(e => {
            logger.error(e, "Unable to logout token in authservice logoutuser");
        });

        req.cookieManager.setSessionId('');
        req.cookieManager.setToken('');

        const data = {
            nextUrl: '/'
        };

        const deviceInfo = req?.sessionManager?.getUserDeviceInfo() || {};
        const eventData = {
            userId,
        };
        EventPushService.push(userId, vendorId,"", EventNames.USER_LOGOUT_SUCCESS, eventData);

        return data;
    }

    static async setPassword(req: any, reqBody: SetPasswordRequest, vendorId: string) {
        const userId = req?.sessionManager?.getLoggedInUserId();
        const restClient: any = req.internalRestClient;
        logger.info(`inside [authService] [setPassword] with filter :: ${userId}`);

        const userDetails: IDMUserProfile = await IDMService.getUserDetails(restClient, `${userId}`, vendorId);
        const mobile: string = userDetails?.mobile;
        let context = VerifyOTPContext.FORGOT_PASSWORD; // Default flow is via Forgot Password

        if (!userDetails?.customAttributes?.isPasswordResetDone) {
            // First time user or Existing user with no password or existing user not migrated has initiated password flow

            context = VerifyOTPContext.PASSWORD_SIGN_UP;
            const generateOtpResponse: IDMGenerateOtpResponse = await IDMService.generateOtp(req, userId, vendorId);
            await IDMService.verifyOtp(req, vendorId, context, userId, generateOtpResponse.otp);
        }
        if (context == VerifyOTPContext.FORGOT_PASSWORD) {
            await IDMService.updateUserPassword(restClient, mobile, reqBody.pwd, context, vendorId);
        }
        else if (context == VerifyOTPContext.PASSWORD_SIGN_UP) {
            await IDMService.updateUserPassword(restClient, userId, reqBody.pwd, context, vendorId);
        }
        await IDMService.updateUser(restClient, {
            userId: userDetails.userId,
            customAttributes: {
                isPasswordResetDone: true,
                pwdAuth: 1,
            }
        }, vendorId);
        return {
            msg: "Password is set successfully."
        }
    }

    static async generateOtpForgotPassword(req: any, request: GenerateOtpForgotPwdRequest, vendorId: string): Promise<GenerateOtpResponse> {
        logger.info(`inside generateOtpForgotPassword ${request.mobile}`);

        // DO Not proceed if User doesn't exist - Forgot password flow is only for existing users
        const userDetails: IDMUserProfile = await IDMService.getUserDetails(req.internalRestClient, request.mobile, vendorId);

        const generateOtpResponse: IDMGenerateOtpResponse = await IDMService.generateOtp(req, request.mobile, vendorId);

        communicationService.sendForgotPasswordOTP(
          req.internalRestClient,
          request.mobile,
          userDetails.userHandle,
          generateOtpResponse?.otp,
          vendorId,
          function (err, data) {
              if (err) {
                  logger.error(err, 'Error from communicationService.sendForgotPasswordOTP in authService generateOtpForgotPassword');
                  return;
              }

              logger.info({data}, 'Successfully send OTP to user for generateOtpForgotPassword');
        });

        const response: any = {};

        return response;
    }

}
