export interface CheckStatusRequest {
  mobile?: string;
}

export interface CheckUsernameRequest {
  username?: string;
}

export interface VerifyEmailRequest {
  email?: string;
  otp?: string;
}

export interface CheckStatusResponse {
  isUserBlocked: number,
  mobile: string
  mobileStatus: number;
  status: number;
  userId: number;
}
