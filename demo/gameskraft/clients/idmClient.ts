import IDMServiceError from "../errors/idm/idm-error";
import IDMServiceErrorUtil from "../errors/idm/idm-error-util";
import LoggerUtil, { ILogger } from '../utils/logger';
import QueryParam from "../models/query-param";
import BaseClient from "./baseClient";
import RequestUtil from "../helpers/request-util";
import {IDMClientLatencyDecorator} from "../utils/monitoring/client-latency-decorator";
import {
    IDMGenerateOtpResponse, IDMVerifyOTPResponse,
    LoginWithPasswordPayload,
    UpdatePasswordPayload,
    VerifyOtpPayload,
    TrueCallerPayload,
    IDMVerifyTrueCallerResponse,
    TrueCallerPayloadV2,
    IDMVerifyTrueCallerResponseV2
} from '../models/idm/request-response';
import IdmUtil from "../utils/idm-utils";
import { BulkUserResponse, IDMUserProfile } from '../models/idm/user-idm';
const configService = require('../services/configService');
const logger: ILogger = LoggerUtil.get("IDMClient");

export default class IDMClient {

    private static urls = {
        user: '/v1/user',
        generateOtp: '/v1/user/generateOtp',
        verifyOtp: '/v1/user/verifyOtp',
        loginPassword: '/v1/user/login/password',
        updatePassword: '/v1/user/password/update',
        verifyTruecaller : '/v1/user/login/social'
    }
    static wrapError(error: any) {
        if (error && !(error instanceof IDMServiceError)) {
            return IDMServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    static getErrorFromCode(errorCode: number) {
        return IDMClient.getError({ errorCode });
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(configService.getIdmServiceBaseUrl(), relativeUrl, queryParams);
    }

    private static getIdmServiceHeaders(requestId: string, vendorId: string) {
        const idmAccessKeys: any = configService.getIdmServiceAccessKeys();
        const accessKey: string = idmAccessKeys && idmAccessKeys[vendorId] || '';

        if(!accessKey) {
            // TODO throw invalid accessKey error
            throw IDMServiceErrorUtil.getInvalidAccessKey();
        }

        const headers: any = {
            "X-Access-Id": accessKey,
            "X-Request-Id": requestId,
        };
        return headers;
    }

    @IDMClientLatencyDecorator
    static async generateOtp(restClient: any, key: string, vendorId: string): Promise<IDMGenerateOtpResponse>{
        try {
            logger.info(`[IDMClient] [postGenerateOtp] Key :: ${key} vendorId :: ${vendorId}`);
            const queryParams: QueryParam[] = [];
            const url: string = IDMClient.getCompleteUrl(IDMClient.urls.generateOtp, queryParams);
            const headers: any = IDMClient.getIdmServiceHeaders(restClient.getRequestId(), vendorId);

            const idmGenerateOtpPostResponse: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, {
                key: key
            }, headers);
            return idmGenerateOtpPostResponse?.data;
        } catch (error) {
            logger.error(error,`[IDMClient] [postGenerateOtp]:: `)
            throw IDMClient.getError(error);
        }

    }

    /*
        Unique Identifier can be mobile number or client-identifier or uuid or userId
     */
    @IDMClientLatencyDecorator
    static async getUserByUniqueIdentifier(restClient: any, uniqueIdentifier: string, vendorId: string): Promise<IDMUserProfile>{
        try {
            const queryParams: QueryParam[] = [];
            const url: string = IDMClient.getCompleteUrl(`${IDMClient.urls.user}/${uniqueIdentifier}`, queryParams);
            const headers: any = IDMClient.getIdmServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[getUserByUniqueIdentifier]- ${url}, ${JSON.stringify(headers)}`);
            const idmGetUserResponse: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);

            return idmGetUserResponse && idmGetUserResponse.data;
        } catch (error) {
            logger.error(error, `Error in [getUserByUniqueIdentifier]::`);
            throw IDMClient.getError(error);
        }
    }

    @IDMClientLatencyDecorator
    static async getUserByHandle(restClient: any, userHandle: string, vendorId: string): Promise<BulkUserResponse> {
        try {
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "userHandles", value: userHandle})
            const url: string = IDMClient.getCompleteUrl(`${IDMClient.urls.user}`, queryParams);
            const headers: any = IDMClient.getIdmServiceHeaders(restClient.getRequestId(), vendorId);

            const response: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);

            return response && response.data;
        } catch (error) {
            logger.error(error, `Error in [getUserByHandle]::`);
            throw IDMClient.getError(error);
        }
    }

    @IDMClientLatencyDecorator
    static async postVerifyOtp(restClient: any, key: string, otp: string, vendorId: string, context: number): Promise<IDMVerifyOTPResponse>{
        try {
            const queryParams: QueryParam[] = [];
            const url: string = IDMClient.getCompleteUrl(`${IDMClient.urls.verifyOtp}`, queryParams);
            const headers: any = IDMClient.getIdmServiceHeaders(restClient.getRequestId(), vendorId);
            const verifyOtpPayload: VerifyOtpPayload = IdmUtil.createVerifyOtpPayload(key, otp, context)
            const postVerifyOtpResponse: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, verifyOtpPayload, headers);
            return postVerifyOtpResponse && postVerifyOtpResponse.data;
        } catch (error) {
            logger.error(error, `Error in [postVerifyOtp]::`)
            throw IDMClient.getError(error);
        }
    }

    @IDMClientLatencyDecorator
    static async postVerifyTrueCaller(restClient: any, trueCallerPayload : TrueCallerPayload , vendorId: string): Promise<IDMVerifyTrueCallerResponse>{
        try {
            const queryParams: QueryParam[] = [];
            const url: string = IDMClient.getCompleteUrl(`${IDMClient.urls.verifyTruecaller}`, queryParams);
            const headers: any = IDMClient.getIdmServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[IDMClient] [postVerifyTrueCaller] trueCallerPayload :: ${trueCallerPayload} headers  :: ${JSON.stringify(headers)} vendorId :: ${vendorId}`);
            const postVerifyTrueCallerResponse: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, trueCallerPayload, headers);
            return postVerifyTrueCallerResponse && postVerifyTrueCallerResponse.data;
        } catch (error) {
            logger.error(error, `Error in [postVerifyTrueCaller]::`)
            throw IDMClient.getError(error);
        }
    }

    @IDMClientLatencyDecorator
    static async postVerifyTrueCallerV2(restClient: any, trueCallerPayload : TrueCallerPayloadV2 , vendorId: string): Promise<IDMVerifyTrueCallerResponseV2>{
        try {
            const queryParams: QueryParam[] = [];
            const url: string = IDMClient.getCompleteUrl(`${IDMClient.urls.verifyTruecaller}`, queryParams);
            const headers: any = IDMClient.getIdmServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[IDMClient] [postVerifyTrueCallerV2] trueCallerPayload :: ${JSON.stringify(trueCallerPayload)} headers  :: ${JSON.stringify(headers)} vendorId :: ${vendorId}`);
            const postVerifyTrueCallerResponse: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, trueCallerPayload, headers);
            logger.info(`[IDMClient] [postVerifyTrueCallerV2] postVerifyTrueCallerResponse :: ${JSON.stringify(postVerifyTrueCallerResponse)} `);
            const isNewUser : boolean = postVerifyTrueCallerResponse?.httpStatusCode === 201;
            return {...postVerifyTrueCallerResponse?.data,isNewUser: isNewUser}
        } catch (error) {
            logger.error(error, `Error in [postVerifyTrueCallerV2]::`)
            throw IDMClient.getError(error);
        }
    }

    @IDMClientLatencyDecorator
    static async postLoginWithPassword(restClient: any, username: string, password: string, vendorId: string): Promise<any>{
        try {
            logger.info(`[IDMClient] [postLoginWithPassword] username :: ${username} password  :: ${password} vendorId :: ${vendorId}`);
            const queryParams: QueryParam[] = [];
            const url: string = IDMClient.getCompleteUrl(`${IDMClient.urls.loginPassword}`, queryParams);
            const headers: any = IDMClient.getIdmServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[IDMClient] [postLoginWithPassword] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const loginWithPasswordPayload: LoginWithPasswordPayload = IdmUtil.createLoginWithPasswordPayload(username, password)
            const postLoginWithPasswordResponse = await BaseClient.sendPostRequestWithHeaders(restClient, url, loginWithPasswordPayload, headers);
            return postLoginWithPasswordResponse && postLoginWithPasswordResponse.data;
        } catch (error) {
            logger.error(error,`[IDMClient] [postLoginWithPassword]:: `)
            throw IDMClient.getError(error);
        }

    }

    @IDMClientLatencyDecorator
    static async putUpdatePassword(restClient: any, contextKey: string, password: string, context: number, vendorId: string): Promise<any>{
        try {
            logger.info(`[putUpdatePassword] username :: ${contextKey} password  :: XXX not printing password vendorId :: ${vendorId}`);
            const queryParams: QueryParam[] = [];
            const url: string = IDMClient.getCompleteUrl(`${IDMClient.urls.updatePassword}`, queryParams);
            const headers: any = IDMClient.getIdmServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[putUpdatePassword] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const loginWithPasswordPayload: UpdatePasswordPayload = IdmUtil.createUpdatePasswordPayload(`${contextKey}`, password, context);
            const postUpdatePasswordResponse = await BaseClient.sendPutRequestWithHeaders(restClient, url, loginWithPasswordPayload, headers);
            return postUpdatePasswordResponse && postUpdatePasswordResponse.data;
        } catch (error) {
            logger.error(error, `error in [putUpdatePassword]::`);
            throw IDMClient.getError(error);
        }

    }

    @IDMClientLatencyDecorator
    static async postNewUser(restClient: any, idmUserProfile: IDMUserProfile, vendorId: string): Promise<any>{
        try {
            const queryParams: QueryParam[] = [];
            const url: string = IDMClient.getCompleteUrl(`${IDMClient.urls.user}`, queryParams);
            const headers: any = IDMClient.getIdmServiceHeaders(restClient.getRequestId(),vendorId);
            logger.info(`[IDMClient] [postNewUser] url :: ${url} with headers :: ${JSON.stringify(headers)} payload :: ${idmUserProfile}`);
            const postNewUserResponse: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, idmUserProfile, headers);
            logger.info(`[IDMClient] [postNewUser] response :: ${JSON.stringify(postNewUserResponse || {})}`);
            return postNewUserResponse && postNewUserResponse.data;
        } catch (error) {
            logger.error(error,`[IDMClient] [postNewUser]:: `)
            throw IDMClient.getError(error);
        }

    }

    @IDMClientLatencyDecorator
    static async putUpdateUser(restClient: any,idmUserProfile: IDMUserProfile, vendorId: string): Promise<any>{
        try {
            const queryParams: QueryParam[] = [];
            const url: string = IDMClient.getCompleteUrl(`${IDMClient.urls.user}/${idmUserProfile.userId}`, queryParams);
            const headers: any = IDMClient.getIdmServiceHeaders(restClient.getRequestId(),vendorId);
            logger.info(`[IDMClient] [putUpdateUser] url :: ${url} with headers :: ${JSON.stringify(headers)} payload :: ${idmUserProfile}`);
            const putUpdateUserResponse: any = await BaseClient.sendPutRequestWithHeaders(restClient, url, idmUserProfile, headers);
            logger.info(`[IDMClient] [putUpdateUser] response :: ${JSON.stringify(putUpdateUserResponse || {})}`);
            return putUpdateUserResponse && putUpdateUserResponse.data;
        } catch (error) {
            logger.error(error,`[IDMClient] [putUpdateUser]:: `)
            throw IDMClient.getError(error);
        }

    }

    private static getError(error: any) {
		logger.error('[IDMClient] Error: %s', JSON.stringify(error || {}));
        switch (error.errorCode) {
            case 1:
                return IDMServiceErrorUtil.getDocumentNotPan();
            case 2:
                return IDMServiceErrorUtil.getImageNotReadable();
            case 3:
                return IDMServiceErrorUtil.getExtractionDataNotValid();
            case 4:
                return IDMServiceErrorUtil.getPanTypeNotIndividual();
            case 5:
                return IDMServiceErrorUtil.getMinorDOB();
            case 6:
                return IDMServiceErrorUtil.getDetectionAPIError();
            case 7:
                return IDMServiceErrorUtil.getExtractionAPIError();
            case 8:
                return IDMServiceErrorUtil.getBadImageQuality();
            case 9:
                return IDMServiceErrorUtil.getIDFYInsufficientFunds();
            case 15:
                return IDMServiceErrorUtil.getDocumentNotOriginal();
            case 16:
                return IDMServiceErrorUtil.getPasswordProtectedFile();
            case 19:
                return IDMServiceErrorUtil.getUserDoesNotExist();
            case 25:
                return IDMServiceErrorUtil.getMissingRequiredUniqueId();
            case 26:
                return IDMServiceErrorUtil.getMissingRequiredDisplayNameInfo();
            case 61:
                return IDMServiceErrorUtil.getNoSuchUser();
            case 65:
                return IDMServiceErrorUtil.getIncorrectPassword();
            case 73:
                return IDMServiceErrorUtil.getInvalidFacebookAccessToken();
            case 74:
                return IDMServiceErrorUtil.getInvalidGoogleIdToken();
            case 75:
                return IDMServiceErrorUtil.getInvalidReferralInfo();
            case 82:
                return IDMServiceErrorUtil.getEmailNotPresent();
            case 84:
                return IDMServiceErrorUtil.getInvalidUserId();
            case 85:
                return IDMServiceErrorUtil.getEmailOrMobileRequired();
            case 86:
                return IDMServiceErrorUtil.getDisplayNameNecessary();
            case 88:
                return IDMServiceErrorUtil.getPasswordNecessary();
            case 91:
                return IDMServiceErrorUtil.getEmailAlreadyExist();
            case 92:
                return IDMServiceErrorUtil.getMobileAlreadyExist();
            case 95:
                return IDMServiceErrorUtil.getSameMobileAlreadyExist();
            case 96:
                return IDMServiceErrorUtil.getInvalidDisplayName();
            case 112:
                return IDMServiceErrorUtil.getDisplayNameContainsSwearWord();
            case 113:
                return IDMServiceErrorUtil.getDisplayNameStartsWithInvalidSequence();
            case 115:
                return IDMServiceErrorUtil.getDisplayNameShouldHaveOneAlphabet();
            case 116:
                return IDMServiceErrorUtil.getDisplayNameApiIntentNotValidation();
            case 117:
                return IDMServiceErrorUtil.getInvalidBankStatus();
            case 118:
                return IDMServiceErrorUtil.getMobileUpdateInvalid();
            case 119:
                return IDMServiceErrorUtil.getMobileNumberInvalid();
            case 120:
                return IDMServiceErrorUtil.getInvalidFlowForUser();
            case 98:
                return IDMServiceErrorUtil.getDisplayNameAlreadyTaken();
            case 87:
                return IDMServiceErrorUtil.getIncorrectEmailOrMobile();
            case 93:
                return IDMServiceErrorUtil.getEmailNotRegistered();
            case 94:
                return IDMServiceErrorUtil.getMobileNotRegistered();
            case 97:
                return IDMServiceErrorUtil.getUserAccountBlocked();
            case 99:
                return IDMServiceErrorUtil.getMultipleUsersFound();
            case 100:
                return IDMServiceErrorUtil.getInvalidMobileFormat();
            case 101:
                return IDMServiceErrorUtil.getInvalidEmailFormat();
            case 102:
                return IDMServiceErrorUtil.getMobileAlreadyExist();
            case 103:
                return IDMServiceErrorUtil.getEmailAlreadyExist();
            case 104:
                return IDMServiceErrorUtil.getDisplayNameTooShort();
            case 105:
                return IDMServiceErrorUtil.getDisplayNameTooLong();
            case 106:
                return IDMServiceErrorUtil.getInvalidDisplayName();
            case 107:
                return IDMServiceErrorUtil.getDisplayNameContainsSwearWord();
            case 108:
                return IDMServiceErrorUtil.getUserAccountBlocked();
            case 109:
                return IDMServiceErrorUtil.getInvalidMobileStatus();
            case 110:
                return IDMServiceErrorUtil.getInvalidEmailStatus();
            case 111:
                return IDMServiceErrorUtil.getMaxDisplayNameDigitCount();
            case 4000:
                return IDMServiceErrorUtil.getOtpExpired();
            case 4001:
                return IDMServiceErrorUtil.getOtpMismatch();
            case 4200:
                return IDMServiceErrorUtil.getPanAlreadyExist();
            case 4201:
                return IDMServiceErrorUtil.getPanAlreadyVerified();
            case 4202:
                return IDMServiceErrorUtil.getNameIsMandatory();
            case 4203:
                return IDMServiceErrorUtil.getDobIsMandatory();
            case 4206:
                return IDMServiceErrorUtil.getBankDetailsDoesNotExist();
            case 4208:
                return IDMServiceErrorUtil.getPanDetailsDoesNotExist();
            case 4211:
                return IDMServiceErrorUtil.getBankDetailsAlreadyVerified();
            case 4212:
                return IDMServiceErrorUtil.getRejectionReasonIsMandatory();
            case 4213:
                return IDMServiceErrorUtil.getInvalidPanId();
            case 4215:
                return IDMServiceErrorUtil.getInvalidIfsc();
            case 4217:
                return IDMServiceErrorUtil.getInvalidFileUrl();
            case 4218:
                return IDMServiceErrorUtil.getAgeLessThan_18();
            case 4219:
                return IDMServiceErrorUtil.getPanNotVerified();
            case 4220:
                return IDMServiceErrorUtil.getUpiDetailsDoesNotExist();
            case 4221:
                return IDMServiceErrorUtil.getUpiAlreadyExist();
            case 4222:
                return IDMServiceErrorUtil.getConsentNotProvided();
            case 4224:
                return IDMServiceErrorUtil.getUpiDetailsAlreadyVerified();
            case 4225:
                return IDMServiceErrorUtil.getMaxBankAccountsLimitReached();
            case 7010:
                return IDMServiceErrorUtil.getBankAccountBlacklistedCode();
            case 7011:
                return IDMServiceErrorUtil.getBulkLimitCrossed();
            case 5001:
                return IDMServiceErrorUtil.getFacebookTokenAlreadyExist();
            case 5002:
                return IDMServiceErrorUtil.getGoogleTokenAlreadyExist();
            case 5003:
                return IDMServiceErrorUtil.getMobileAlreadyExistWithEmailVerified();
            case 6001:
                return IDMServiceErrorUtil.getLocationRestrictedByIp();
            case 6002:
                return IDMServiceErrorUtil.getLocationRestrictedByGeoCoordinate();
            case 6003:
                return IDMServiceErrorUtil.getLocationRestrictedMonitoringMsg1();
            case 6004:
                return IDMServiceErrorUtil.getLocationRestrictedMonitoringMsg2();
            case 6005:
                return IDMServiceErrorUtil.getLocationRestrictedMonitoringMsg3();
            case 6010:
                return IDMServiceErrorUtil.getBulkUpdateUserLimitReached();
            case 8001:
                return IDMServiceErrorUtil.getInvalidBrandId();
            case 8002:
                return IDMServiceErrorUtil.getInvalidBrandNameFormat();
            case 8003:
                return IDMServiceErrorUtil.getInvalidBrandNameLength();
            case 8004:
                return IDMServiceErrorUtil.getInvalidBrandDescLength();
            case 8005:
                return IDMServiceErrorUtil.getBrandIdAlreadyExist();
            case 8006:
                return IDMServiceErrorUtil.getBrandNameAlreadyExist();
            default:
                return IDMServiceErrorUtil.getError(error);
        }
    }
};
