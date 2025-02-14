import IDMClient from '../clients/idmClient';
import Config from '../config/config';
import {
    DEFAULT_STAGE_OTP,
    NO_OP,
    PROD_TEST_USER_OTP,
    PROD_TEST_USERS
} from '../constants/constants';
import IDMServiceError from '../errors/idm/idm-error';
import IDMServiceErrorUtil from '../errors/idm/idm-error-util';
import {
    IDMGenerateOtpResponse,
    IDMLoginWithPasswordResponse,
    IDMVerifyOTPResponse,
    IDMVerifyTrueCallerResponse,
    IDMVerifyTrueCallerResponseV2,
    TrueCallerPayload,
    TrueCallerPayloadV2
} from '../models/idm/request-response';
import LoggerUtil from '../utils/logger';
import {BulkUserResponse, IDMUserProfile} from '../models/idm/user-idm';

const logger = LoggerUtil.get("IDMService");

export default class IDMService {

    static async generateOtp(req:any, key: string, vendorId: string): Promise<IDMGenerateOtpResponse> {
        try {
            const generateOtpResponse: IDMGenerateOtpResponse = await IDMClient.generateOtp(req.internalRestClient, key, vendorId)
            logger.info(`[IDMClient] [generateOtp] response :: ${JSON.stringify(generateOtpResponse?.otp || {})}`);

            if(Config.isDevEnv()) {
                // Used for Dev environments default OTPs
                req.sessionManager.setOTP(generateOtpResponse.otp).then(NO_OP).catch(NO_OP);
            }

            // This is for prod user testing
            if(PROD_TEST_USERS.includes(key)) {
                req.sessionManager.setOTP(generateOtpResponse.otp).then(NO_OP).catch(NO_OP);
            }

            return generateOtpResponse;
        } catch (e) {
            throw e;
        }
    }

    static async getUserDetails(restClient: any, uniqueIdentifier: string, vendorId: string): Promise<IDMUserProfile> {
        const clientResponse : IDMUserProfile = await IDMClient.getUserByUniqueIdentifier(restClient, uniqueIdentifier, vendorId);
        return clientResponse;
    }


    static async getUserByHandle(restClient: any, userHandle: string, vendorId: string): Promise<IDMUserProfile> {
        const clientResponse : BulkUserResponse = await IDMClient.getUserByHandle(restClient, userHandle, vendorId);
        return clientResponse && clientResponse.userDetailsResponses && clientResponse.userDetailsResponses[0] || undefined;
    }

    static async checkUserDetails(restClient: any, uniqueIdentifier: string, vendorId: string): Promise<IDMUserProfile | undefined> {
        logger.info(`[checkUserDetails] mobile :: ${uniqueIdentifier} `);
        try {
            const clientResponse : IDMUserProfile = await IDMClient.getUserByUniqueIdentifier(restClient, uniqueIdentifier, vendorId);
            logger.info(clientResponse, "response in checkUserDetails");
            return clientResponse;
        } catch (e) {
            logger.info(e, "Error in checkUserDetails");
            if((e instanceof IDMServiceError) && (e.code == IDMServiceErrorUtil.getUserDoesNotExist().code)) {
                // New User Flow
                logger.info(e, "User does not exist in IDM");
                return undefined;
            }
        }
    }

    static async verifyOtp(req: any, vendorId: string, context: number, key: string, otp: string): Promise<IDMVerifyOTPResponse> {
        if (Config.isDevEnv() && otp === DEFAULT_STAGE_OTP) {
            otp = req.sessionManager.getOTP();
        }

        // This is for prod user testing
        if(PROD_TEST_USERS.includes(key) && otp == PROD_TEST_USER_OTP) {
            otp = req.sessionManager.getOTP();
        }

        const clientResponse : any = await IDMClient.postVerifyOtp(req.internalRestClient, key, otp, vendorId, context);
        logger.info(clientResponse, "Verify otp response");
        return clientResponse;
    }

    static async verifyTrueCaller(req: any, trueCallerPayload : TrueCallerPayload ,vendorId: string): Promise<IDMVerifyTrueCallerResponse> {
        const clientResponse : any = await IDMClient.postVerifyTrueCaller(req.internalRestClient,trueCallerPayload, vendorId);
        logger.info(clientResponse, "Verify truecaller response");
        return clientResponse;
    }

    static async verifyTrueCallerV2(req: any, trueCallerPayload : TrueCallerPayloadV2 ,vendorId: string): Promise<IDMVerifyTrueCallerResponseV2> {
        const clientResponse : any = await IDMClient.postVerifyTrueCallerV2(req.internalRestClient,trueCallerPayload, vendorId);
        logger.info(clientResponse, "Verify truecallerV2 response");
        return clientResponse;
    }

    static async loginWithPassword(restClient: any, username: string, password: string, vendorId: string): Promise<IDMLoginWithPasswordResponse> {
        const clientResponse: IDMLoginWithPasswordResponse = await IDMClient.postLoginWithPassword(restClient, username, password, vendorId);
        logger.info(clientResponse, `[loginWithPassword] response`);
        return clientResponse;
    }

    /*
        userId - unique across all suborgs
        userUuid - hash of vendorId_mobile for P52
                 - hash of vendorId_userUniqueId for other vendors
           userUuid is immutable, so this decision is taken
        clientIdentifier - vendorId_userId - Its also network id used by other vendors

        customAttributes -
            payinTenetCustomerId - payin's tenet customer id created on registration
            vendorId - same as suborgid - is this required?
            vendorUniqueUserId - vendors unique userId - unhashed version of userUuid
            usernameEditable - whether username is editable for the user
    */
    static async updateUser(restClient: any, idmUserProfile: IDMUserProfile, vendorId: string) {
        try{
            const clientResponse : any = await IDMClient.putUpdateUser(restClient, idmUserProfile, vendorId);
            logger.info(`inside [IDMClient] [createNewUser]  ${JSON.stringify(clientResponse)}`);
            return clientResponse;
        }catch (e){
            logger.info(e,`inside [idmService] [createNewUser] received error from [service] `);
            throw (e);
        }
    }

    static async updateUserPassword(restClient: any, contextKey: string, password: string, context: number, vendorId: string) {
        try{
            const clientResponse: any = await IDMClient.putUpdatePassword(restClient, contextKey, password, context, vendorId);
            logger.info(`inside [updateUserPassword] ${JSON.stringify(clientResponse)}`);
            return clientResponse;
        }catch (e){
            logger.info(e, `inside [updateUserPassword] received error from [service]`);
            throw (e);
        }
    }

    static getUserDetailsById(restClient: any, userId: number, callback: any) {
        logger.info(`[IDMService] [getUserDetailsById] userId :: ${userId} `);
    }

    static async postCreateUser(restClient,idmUserProfile: IDMUserProfile,vendorId: string){
        try{
            logger.info(`creating idm user :: ${JSON.stringify(idmUserProfile)} for the vendor :: ${vendorId}`);
            const idmResponse = await IDMClient.postNewUser(restClient,idmUserProfile,vendorId);
            logger.info(idmResponse,`got the response`);
            return idmResponse;
        }catch(error){
            logger.error(error,'error while creating new user on idm');
            throw(error);
        }
    }

};
