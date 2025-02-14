interface PayinOptions {
    client_auth_token: boolean
};

export interface PayinUserDetailsRequest {
    uniqueRef: number;
    mobile: string;
    name?: string;
    email?: string;
    options?: PayinOptions;
};

interface PspDetails {
    pspId: number,
    tenetCustomerId: string,
    pspCustomerId: string
}

export interface TenetCustomerDetails {
    createdAt?: string,
    updatedAt?: string,
    id?: number,
    tenetCustomerId?: string,
    referenceId?: string,
    email?: string,
    mobile?: string,
    name?: string,
    pspTenetCustomerList?: PspDetails[],
}

export interface AddCashSummary {
    tenetCustomer: TenetCustomerDetails,
    addCashSum: number,
    addCashCount: number,
}

export interface UserRefundDetails {
    userWalletBalance: number,
    userTaxLiability: number,
    userRefundableAmount: number
}

export interface UserOrderDetails {
    status: number,
    orderId: string,
    amount: number,
    successfulTransactionCount: number,
    userId: number,
    orderStatus: string,
    message: string,
    utr: string,
    paymentMethod?: string,
    promoCode: string,
    transactionTime: string,
}

export interface AddCashData {
    buyInValue?: number, // current add cash amount - gst + discount credit
    addCashAmount?: number,
    gst?: number,
    discountCredit?: number,
    tournamentDiscountCredit?: number,
}

export interface UserOrder {
    transactionId: string,
    createdAt: string,
    updatedBuyInValue: number,// current add cash value after this add cash --> kha se laenge ye kyunki change hoti rhegi
    transactionLabel: string,
    transactionType: number,
    type: string,
    status: string,
    transactionAmount: number,
    addCashData?: AddCashData
}

export interface UserOrderDetailsV2 {
    status: number,
    orderId: string,
    amount: number,
    successfulTransactionCount: number,
    userId: number,
    orderStatus: string,
    message: string,
    utr: string,
    paymentMethod?: string,
    promoCode: string,
    transactionTime: string,
    updatedBalance?: number,
    invoiceId?: string,
    addCashAmount?: number,
    gstAmount?: number,
    discountCreditAmount?: number,
    buyInAmount?: number,
    tournamentDiscountCreditAmount?: number,
    tournamentDiscountCredit?:number,
    lockedDcsCredit?: number,
    tournamentTickets?: number,
    benefitAmount?: number,
    totalValue?: number
}

export interface UserRefundResponse {
    refundedAmount: number,
    refundLabel: string,
    refundMessage: string,
    status: string
}