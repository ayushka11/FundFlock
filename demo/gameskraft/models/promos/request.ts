export interface PromoEvent {
    eventName: string,
    userId: string,
    data?: any
}

export interface IPromoQueryConditions {
    addCashCount?: number,
    amount?: number
}

export interface UserPromoQueryRequest {
    promoType?: string,
    amount?: number,
    isDefaultAmount?: boolean,
    conditions?: IPromoQueryConditions
}