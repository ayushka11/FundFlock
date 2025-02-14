export interface UserRefundDcsAmountRequest {
    transactionId?: string,
    amount?: number,// this is the amount including gst
    gstDeductedAmount?: number,// amount -gst
    refundAmountRequested?: number // request amt 
};