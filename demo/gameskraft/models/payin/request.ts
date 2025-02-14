export interface DeviceInfo {
    appVersionName?: string,
    platform?: string,
    osVersion?: string,
    clientIpAddress?: string,
}

export interface OrderMeta {
    promo?: string,
    userId?: string,
    uiPaymentModeId?: number,
    deviceInfo?: DeviceInfo,
    addCashCount?: number,
}


export interface PayinInitiateOrder {
    requestId?: string,
    orderMetaData?: OrderMeta,
    tenetCustomerId?: string,
    amount: number,
    currencyId?: number,
    paymentModeId: number,
    pspId: number
}

export interface PayinInvoiceData {
    userIdentifier: string,
    stateCode: number,
    email?: string,
    mobile: string,
    userName?: string,
    address?: string
}

export interface PayinInitiateOrderV2 {
    requestId?: string,
    orderMetaData?: OrderMeta,
    tenetCustomerId?: string,
    amount: number,
    currencyId?: number,
    paymentModeId: number,
    pspId: number,
    invoiceData?: PayinInvoiceData
}

export interface DeletePaymentMethodRequest {
    mode?: number,
    deleteId?: number,
    token?: string,
    pspId?: number
}

export interface PaymentModeValidationRequest {
    paymentMethod: string,
    cardBin: string
}