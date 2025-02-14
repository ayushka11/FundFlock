export interface GenerateOtpRequest {
  mobile?: string;
  verificationChannel?: number;
  pwd_auth?: number;
}

export interface GenerateOtpForgotPwdRequest {
  mobile?: string;
}

export interface SetPasswordRequest {
  pwd?: string;
  signup_token: string; // NOT USED
  context?: number;
}

export interface VerifyOtpRequest {
  mobile?: string;
  otp?: string;
  referralChannel?: number;
  referralCode?: string;
  verificationChannel?: number;
  category?: number;
  af_params?: {
    appsflyer_id?: string;
    os_ver?: string;
  }
}

export interface TrueCallerRequest {
  providerType?: string;
  payload?: string;
  signature?: string;
  signatureAlgorithm?: string;
  referralCode?: string;
  af_params?: {
    appsflyer_id?: string;
    os_ver?: string;
  };
}

export interface TrueCallerRequestV2 {
  providerType?: string;
  codeVerifier?: string;
  authorizationCode?: string;
  referralCode?: string;
  af_params?: {
    appsflyer_id?: string;
    os_ver?: string;
  };
}

export interface TrueCallerUserProfile {
  phoneNumber?: string;
  firstName?: string;
  lastName?: string;
}

export interface GenerateOtpResponse {
  pwd_available?: boolean;
  signup_token?: string;
}

export interface VerifyOTPResponse {
  userId?: number;
  mobile?: string;
  first_login?: boolean;
  username_editable?: boolean;
  session_id?: string;
  is_new_user?: boolean;
}

export interface LoginWithPasswordRequest {
  mobile?: string;
  password?: string;
}

export interface LoginWithPasswordResponse {
  userId?: number;
  token?: string;
}

export interface SendAppDownloadLinkRequest {
  mobile?: string;
}