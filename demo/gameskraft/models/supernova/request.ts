import { SupernovaRoomMeta } from './supernova-room-meta';

export interface DepositRequest {
    userId: string,
    depositAmount: number,
    payinOrderId: string,
    requestId: string,
    promoCode?: string
}

export interface DepositRequestV2 {
    userId: number,
    depositAmount: number, //after tax
    gstAmount: number,
    tournamentDiscountCreditAmount: number,
    discountCreditAmount: number,
    payinOrderId: number,
    requestId: string

}

export interface RefundOrder {
    transactionId?: string,
    amount?: number
}

export interface RefundOrderV2 {
    transactionId?: string,
    amount?: number,
    depositedAmount?: number,
    gstAmount?: number
}

export interface RefundOrderRequest {
    refunds?: RefundOrder[]
}

export interface RefundOrderRequestV2 {
    refunds?: RefundOrderV2[]
}

export interface RevertRefundOrderRequest {
    requestId?: string,
    userId?: string,
    payoutOrderId?: string,
    tdsTransactionId?: string
}

export interface UserCreateAccountRequest {
    userId: number,
    practiceBalance: number
}

export interface UserCreditPracticeChipsRequest {
    userId: number,
    practiceBalance: number
}

export interface PlaceWithdrawalRequest {
    userId: string,
    withdrawalAmount: number,
    tdsTransactionId: string,
}

export interface ReverseWithdrawalRequest {
    userId: string,
    tdsTransactionId: string
}

export interface WalletTransactionFilter {
    walletType?: number,
    currencies?: string[] | number[],
    transactionId?: string[],
    transactionTypes?: number[],
    amountGT?: number,
    internalTransactionTypes?: number[];
    fromDate?: string;
    referenceId?: string;
}


export interface SupernovaReserveSeatEligibilityRequest {
    userId: number,
    roomId?: number,
    vendorId: number,
    appType: string,
    roomMeta: SupernovaRoomMeta,
}

export interface TournamentEntryDetailsRequest {
    tournamentId: string;
    registerEntryAmount: number;
    registerRegistrationFee: number;
    registerPrizePoolContribution: number;
    reentryEntryAmount: number;
    reentryRegistrationFee: number;
    reentryPrizePoolContribution: number;
    registerEntryMethods: string[];
    reentryEntryMethods: string[];
}

export interface TournamentEntryDetailsRequestV2 {
    tournamentId: number,
    registerBuyInAmount: number,
    registerRegistrationFee: number,
    registerPrizePoolContribution: number,
    reentryBuyInAmount: number,
    reentryRegistrationFee: number,
    reentryPrizePoolContribution: number,
    registerBuyInMethods: number[],
    reentryBuyInMethods: number[]
}

export interface PlaceWithdrawalRequestV2 {
    userId: string,
    withdrawalAmount: number,
    tdsTransactionId: string,
    withdrawalToGameBalance?: number,
    discountCreditAmount?: number
}


export interface WalletAndTdsMigrationRequest {
    userId?: number;
    depositBalance?: number;
    withdrawalBalance?: number;
    depositRunningTotal?: number;
    withdrawalRequestedTotal?: number;
    withdrawalProceedTotal?: number;
    withdrawalTdsDeductedTotal?: number;
    refundRequestedTotal?: number;
    refundProceedTotal?: number;
    refundTdsDeductedTotal?: number;
    startYearDepositBalance?: number;
    startYearWithdrawalBalance?: number;

}

export interface SupernovaRefundDetailsRequest {
    userId?:number,
    refundAmount: number, // amount to be refunded on order
    depositedAmount: number,// total amount deposited on the order
    gstAmount: number,// amount deducted as gst
    revertDcsAmount:number,//dcs amount to be reverted
    transactionId: string,
    tdsTransactionId: string,
    payinRefundAmount?: number,
    amountAfterGst?: number
}

export interface RevertPayinRefundRequest {
    userId:number,
    transactionId: string,
    tdsTransactionId: string,
    dcsAmount?: number
}

interface ITournamentRegisterRequestMeta {
    tournamentType :string,
    registerEntryMethods : string[]
}
export interface ITournamentAutoRegisterRequest {
    userId:number,
    requestId : string,
    transactionId :string,
    tournamentId : string,
    entryMethod:string,
    registrationFee : number,
    prizePoolContribution : number,
    registerAmount:number,
    tournamentMeta: ITournamentRegisterRequestMeta,
    seatPackId:string
}
export interface PackDetailsFilter {
    status?: string;
    currencies?: string[];
    orderBy?: string;
    sortBy?: string;
    packsRequired?: boolean;
    excludeZeroPacks?: boolean;
}
