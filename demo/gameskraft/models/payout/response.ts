export interface PayoutDetails {
    kycStatus: boolean,
    bankDetails: BankDetails[],
    minimumPayoutLimit: number
}


export interface BankDetails {
    accountNumber: string,
    ifsc: string,
    name: string,
    documentNumber?: string,
    bankIcon: string,
    bankName?: string,
    bankShortName: string
}

export interface PayoutTransaction {
    id: string,
    type: string,
    utr: string,
    status: number,
    reason?: string,
    payoutId?: number,
    amount: number,
    amountCredited?: number,
    withdrawalRequestedAmount?: number,
    msg?: string,
    previousBalance?: number,
    updatedBalance?: number,
    tdsDeducted: number,
    createdAt: string,
    updatedAt: string,
    transactionType: number,
    transactionTypeLabel: string,
}


export interface PayoutTransactionStatus {
    transferId: string,
    utr: string,
    status: string,
    reason?: string,
    payoutId?: number,
    requestedAmount: number,
    amountCredited: number,
    msg?: string,
    tdsDeducted: number,
    createdAt: string,
    updatedAt: string,
}

export interface BankConfig {
    ifsc_sub_code: string,
    image_link: string,
    bank_short: string,
    bank_name: string
}


export interface ValidatePayoutResponse {
    tdsInfo: any,
    documentNumber: string
}

export interface TdsInfo {
    userId: number | string,
    tdsTransactionId: string,
    withdrawalRequestedAmount: number,
    netWinnings: number,
    taxableNetWinnings: number,
    tdsApplicable: number,
    amountToBeCredit: number,
    previousTaxedWinnings: number,
    previousTaxedAmount: number,
    tdsPercentage: number,
    amountEligibleWithoutTax?: number,
    tdsSnapshot: TdsSnapshot
}


export interface TdsSnapshot {
    fiscalYear: string,
    startingDepositBalance: number,
    startingWithdrawalBalance: number,
    totalDepositAmount: number,
    totalWithdrawalRequestedAmount: number,
    totalWithdrawalRequestedIncludingCurrentWithdrawal?: number,
    totalWithdrawalAmount: number,
    totalWithdrawalTdsDeductedAmount: number,
    totalPreviousTaxedWithdrawalAmount: number,
    totalRefundRequestedAmount: number,
    totalRefundAmount: number,
    totalRefundTdsDeductedAmount: number,
    totalPreviousTaxedRefundAmount: number,
    totalPreviousTaxedAmount: number,
    totalTdsDeductedAmount: number,
    totalDepositAmountIncludingStartingBalance?: number,
}


export interface PayoutDetailsV2 {
    kycStatus: boolean,
    bankDetails: BankDetails[],
    payoutLimits: PayoutLimits,
    meta?: object
}

export interface PayoutLimits {
    minPayoutAmountLimit: number,
    maxPayoutCountLimit: number,
    payoutCountLimitReached: boolean
}