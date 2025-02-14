export interface IDMCustomAttributes{
    vendorUniqueUserId?: string;
    pwdAuth?: number;
    usernameEditable?: boolean;
    payinTenetCustomerId?: string;
    oldHashPwd?: string;
    isPasswordResetDone?: boolean;
    userTypes?: string;
    appsFlyerCustomerId?: string;
    cashAppSignupTs?: number;
    practiceAppSignupTs?: number;
}

export interface IDMUserProfile{
    userId?: number,
    clientIdentifier?: string,
    userUuid?: string,
    displayName?: string,
    displayPicture?: string,
    userHandle?: string,
    mobile?: string,
    email?:string,
    loginFailCount?:number,
    emailStatus?:number,
    mobileStatus?:number,
    customAttributes?: IDMCustomAttributes,
    category?: number
}

export interface BulkUserResponse {
    userDetailsResponses?: IDMUserProfile;
}

export enum IDMEmailStatus {
    NOT_VERIFIED = 1,
    VERIFIED  = 2,
}
