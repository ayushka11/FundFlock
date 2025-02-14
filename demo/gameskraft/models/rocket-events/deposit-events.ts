
export interface DepositEvent{
    amount?: number
    promoCode?: string
    transactionId?: string
    paymentMethod?: string
    paymentVendor?: string
    paymentGateway?: string
    reason?: string
    addCashCount?: number
    isDepositFirstTime?: boolean
    bank?: string
    issuer?: string
    vpa?: string
    uniqueIdentifier?: string
    scheme?: string
    bin?: string
    transactionDate?: string
    appVersionName?: string
    osVersion?: string
    platform?: string
    clientIpAddress?: string
    phoneNumber?: string
    email?: string
    depositTime?: string
}