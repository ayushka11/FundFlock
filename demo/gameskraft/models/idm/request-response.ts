import { IDMCustomAttributes, IDMUserProfile } from './user-idm';

export interface VerifyOtpPayload {
    key: string,
    otp: string,
    context: number
}

export interface LoginWithPasswordPayload {
    key: string,
    password: string
}

export interface UpdatePasswordPayload{
    key: string,
    password: string,
    context: number
}

export interface TrueCallerPayload{
    providerType : string,
    encryption : {
        payload : string,
        signature : string,
        algorithm : string
    }
}

export interface TrueCallerPayloadV2{
    providerType : string,
    appType: string,
    authInfo: TruecallerV2AuthInfo;
}

export interface TruecallerV2AuthInfo {
    codeVerifier: string;
    code: string;
}

export interface IDMGenerateOtpResponse {
    otp: string;
    ttl: number;
}

export interface IDMVerifyOTPResponse {
    user?: {
        userUuid?: string;
        userId?: number;
        accessToken?: string;
        refreshToken?: string;
        displayName?: string;
        userHandle?: string;
        mobile?: string;
        emailStatus?: number;
        mobileStatus?: number;
        customAttributes?: IDMCustomAttributes;
    }
}

export interface IDMVerifyTrueCallerResponse {
    user?: {
        userUuid?: string;
        userId?: number;
        displayName?: string;
        userHandle?: string;
        mobile?: string;
        emailStatus?: number;
        mobileStatus?: number;
        customAttributes?: IDMCustomAttributes;
    }
}

export interface IDMVerifyTrueCallerResponseV2 {
    user?: {
        userUuid?: string;
        userId?: number;
        displayName?: string;
        userHandle?: string;
        mobile?: string;
        emailStatus?: number;
        mobileStatus?: number;
        customAttributes?: IDMCustomAttributes;
    };
    isNewUser?: boolean;
}

export interface IDMLoginWithPasswordResponse {
    user?: {
        userId: number;
        status: number;
        subOrgId: number;
        tenantId: number;
        displayName: string;
        mobile: string;
        userHandle: string;
        displayPicture: string;
        userUuid: string;
        clientIdentifier: string;
        loginFailCount: number;
        emailStatus: number;
        mobileStatus: number;
        customAttributes: IDMCustomAttributes;
    }
}

export enum VerifyOTPContext {
    PASSWORD_SIGN_UP = 1,
    FORGOT_PASSWORD  = 2,
    USER_LOGIN = 3,
    OTHER = 4,
}




