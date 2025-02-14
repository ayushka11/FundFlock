import { RegisteredDetails } from "../guardian/user-kyc"

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
    bankShortName: string,
    status?: number,
    statusChangeReason?: string,
    isDisabled: boolean,
    errorText: string,
    autoVerificationStatus?: number
}

export interface UpiDetails {
    upiId: string,
    documentNumber: number,
    status?: number,
    statusChangeReason?: string,
    isDisabled?: boolean,
    errorText?: string,
    registeredDetails?: RegisteredDetails,
    name?: string,
    autoVerificationStatus?: number
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
    isNewTxn?: boolean,
    accountId?: string
}


export interface PayoutStatusV2 {
    transferId: string,
    utr: string,
    status: string,
    reason?: string,
    payoutId?: number,
    requestedAmount: number,
    amountCredited: number,
    tdsPercentage?: number
    msg?: string,
    tdsDeducted: number,
    createdAt: string,
    updatedAt: string,
    withdrawalPack?: PayoutPack,
    walletMeta?: object,
    isSuperSaverApplied?: boolean
}


export interface PayoutTransactionV2 {
    transactionId: string,
    utr: string,
    status: number,
    reason?: string,
    payoutId?: number,
    requestedAmount: number,
    amountCredited: number,
    msg?: string,
    tdsDeducted: number,
    createdAt: string,
    updatedAt: string,
    withdrawalData?: WithdrawalData,
    updatedBuyInValue?: number,
    transactionType: number,
    transactionLabel?: string,
    type: string
}

export interface WithdrawalData {
    requestedAmount: number,
    winningsToGameBalance: number,
    winningsToBank: number,
    tds: number,
    withdrawalPlaceAmount: number
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

export interface TdsFreeWithdrawalDetails {
    userId: number,
    tdsPercentage: number,
    tdsFreeWithdrawalAmount: number,
    tdsSnapshot: TdsSnapshot
}

export interface PayoutBeneficiary{
    beneficiaryType: number,
    beneficiaryAccounts: Array<BankDetails | UpiDetails>,
    beneficiaryAccountLimitReached: boolean,
    beneficiaryTag: boolean,
    beneficiaryPriority: number
}

export interface PayoutTransactionBreakup {
    upiPayoutTransactions: number,
    upiPayoutSum: number,
    bankPayoutTransactions: number,
    bankPayoutSum: number,
    maxUpiPayoutAmount: number,
    maxUpiTransactionsAllowed: number,
}


export interface PayoutDetailsV2 {
    kycStatus: boolean,
    payoutBeneficiary:Array<PayoutBeneficiary>,
    bankDetails?: BankDetails[],
    payoutLimits: PayoutLimits,
    payoutTransactionBreakup: PayoutTransactionBreakup,
    meta?: object
}

export interface PayoutLimits {
    minPayoutAmountLimit: number,
    maxPayoutCountLimit: number,
    maxPayoutAmountLimit: number,
    payoutCountLimitReached: boolean,
    freeTdsPayoutLimit?: number
}

export interface PayoutPacksResponseV2 {
    requestedWithdrawalAmount: number,
    defaultWithdrawalPack: number,
    withdrawalPacks: PayoutPack[],
    meta?: object
}

export interface PayoutPack {
    id: number,
    name: string,
    gameBalanceCredit: number,
    withdrawToBank: number,
    discountCredit: number,
    superSaver: boolean,
    finalAmount: number
}

export interface ValidatePayoutResponseV2 {
    tdsInfo: any,
    documentNumber: string,
    isSuperSaverApplied: boolean,
    withdrawalPack: PayoutPack,
    requestedAmount: number,
    meta?: object,
}

export interface Instrument {
    instrument: string;
    status: string;
    alertMessage: string;
    name?: string;
}

export interface PayoutDowntime {
    mode: string;
    status: string;
    alertMessage: string;
    instruments: Instrument[];
}