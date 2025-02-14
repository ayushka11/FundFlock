export interface PayinPaymentMethod {
    methodType: string,
    method: string,
    paymentModeId: number,
    pspPaymentCode: string,
    pspId: number,
    name: string,
    description: string,
    priority: string,
    platfrom?: any
};

export interface PaymentMethodsList {
    paymentMethodsList: any[],
    paymentMethodsMapping?: any
};


export interface UserPaymentMethod {
    availableMethods: any[],
    userAvailableMethods: any[],
}

export interface PaymentMode {
    paymentMode?: string,
    paymentModeDetails?: any,
    paymentModeType?: any[],
    paymentModeTypeDetails?: any
}

export interface CardDetails {
    cardNumber?: string,
    cardToken?: string,
    paymentMethodImageUrl?: string,
    cardIssuer?: string,
    cardType?: string
}

export interface BankDetails {
    bankName?: string,
    bankCode?: string,
    paymentMethodImageUrl?: string,
    offerText?: string,
    errorText?: string,
    showDisabled?: boolean
}

export interface CardBinDetails {
    paymentModeId: number,
    iconUrl: string | undefined,
    paymentModeName: string,
    cardType: string,
    cardBrand: string,
    cardIssuer: string
}


