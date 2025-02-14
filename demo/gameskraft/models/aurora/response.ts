export interface UserRefundDcsAmountsDetails {
    transactionId: string,
    dcsRefundableAmount: number
}

export interface UserRevertRefundDcsAmountRequest {
    transactionId?: string,
    revertDcsAmount?: number,
};