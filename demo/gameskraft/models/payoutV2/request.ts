interface UserDetailsRequest {
    userName: string
}

export interface ValidatePayoutRequest {
    requestId: string,
    userId: string,
    amount: number,
    nameValidationRequired: boolean,
    accountId: string,
    accountDepository?: string,
    payoutMode: number,
    userDetails?: UserDetailsRequest,
};


export interface CreatePayoutRequest {
    requestId: string,
    transferId: string,
    userId: string,
    amount: number,
    phoneNumber?: string,
    email?: string,
    nameValidationRequired: boolean,
    accountId: string,
    accountDepository: string,
    payoutMode: number,
    userDetails?: UserDetailsRequest,
    address: string,
    metadata?: any,
    approvalRequired: boolean,
    isAccountValidationRequired: boolean
};


export interface CreateUserPayoutRequestV2 {
    userId: string,
    amount: number,
    documentNumber: string,
    tdsTransactionId: string,
    withdrawalPackId: number,
    beneficiaryType?: number
}

export interface ValidateUserPayoutRequestV2 {
    userId: string,
    amount: number,
    documentNumber: string,
    withdrawalPackId: number,
    beneficiaryType?: number
}