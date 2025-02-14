export const DEFAULT_PAYMENT_MODE = 1

export const DEFAULT_PSPID = 1

export const DEFAULT_PROMO = ''

export const payinTenetCustomerIdKey = "payinTenetCustomerId"

export const refundLabels = {
    INITIATED: "Refund Initiated"
}
export const refundStatus = {
    INITIATED: "INITIATED"
}
export const payinPaymentMethodTypes = {
    UPI_INTENT: 'UPI_INTENT',
    NET_BANKING: 'NET_BANKING',
    WALLET: 'WALLET',
    DEBIT_CARD: 'DEBIT_CARD',
    CREDIT_CARD: 'CREDIT_CARD',
}

export const userCardTypes = {
    CREDIT: 'CREDIT',
    DEBIT: 'DEBIT',
}

export const currencyTypes = {
    INR: 1
}

export const PAYIN_REQUEST_PARAMS = {
    VENDOR:'vendor',
    USER_ID:'userId'
}

export const payinOrderStatus = {
    SUCCESS: 'SUCCESS',
    AUTHENTICATION_FAILED: 'AUTHENTICATION_FAILED',
    AUTHORIZATION_FAILED: 'AUTHORIZATION_FAILED',
    FAILED: 'FAILED',
    ABANDONED: 'ABANDONED'
}

export const payinRefundOrderStatus = {
    SUCCESS: 'REFUND_SUCCESS',
    FAILURE: 'REFUND_FAILURE',
}

export const paymentGateway = {
    JUSPAY: 'JUSPAY'
}

export const sdkVersionNumberMapping = {
    sdk1: 1
}

export const paymentModes = {
    savedCards: 'saved_cards',
    wallet: 'wallet',
    NetBanking: 'net_banking',
    upiIntent: 'upi',
}

export const paymentMethod = {
    Card: 'card',
    UPI: 'upi',
    Wallet: 'wallet',
    NetBanking: 'nb'
}

export const availableWallets = {
    PAYTM: 'PAYTM_WALLET'
}

export const refundMethods = {
    MANUAL: "MANUAL"
}

export const PAYIN_TRANSACTION_STATUS = {
    SUCCESS: "SUCCESS"
}

export const SUPERNOVA_PAYIN_TRANSACTION_STATUS_MAPPER = {
    "CREATED": 5,
    "ACTIVE": 10,
    "APPROVAL_PENDING":10,
    "AUTHORIZATION_FAILED": 21,
    "AUTHENTICATION_FAILED": 21,
    "SUCCESS": 20,
    "FAILED": 21,
    "REFUNDED": 20,
    "ABANDONED": 21,
    "PENDING": 10
}

export const MS_ADD_CASH_TRANSACTION_STATUS_MAPPER = {
    "pending": 5,
    "failed": 21,
    "success": 20,
}

export const MS_REFUND_TRANSACTION_STATUS_MAPPER = {
    "Initiated": 5,
    "failed": 21,
    "success": 20,
}

export const TRANSACTION_LABEL = {
    "2": "User Deposit",
    "3": "Refund From Deposit Balance",
    "4": "Refund",
    "5": "Refund Rejected",
    "6": "Refund",
    "7": "Withdrawal",
    "8": "TDS Withdrawal",
    "9": "Withdrawal Rejected",
    "10": "TDS Withdrawal Rejected",
    "11": "Coin Redemption",
    "14": "Join Table",
    "15": "Table Topup",
    "16": "Leave Table",
    "21": "Leave Table",
    "22": "Table Topup",
    "32": "Table Rebuy",
    "34": "Table Join Rollbacked",
    "35": "Table Topup Rollbacked",
    "36": "Table Rebuy Rollbacked",
    "40": "Table Transaction Rollbacked",
    "42": "Tournament Register",
    "43": "Tournament Re-entry",
    "44": "Tournament Rebuy",
    "45": "Tournament Addon",
    "46": "Tournament Unregister",
    "47": "Tournament Winning",
    "48": "Tournament Register Rollbacked",
    "49": "Tournament Reentry Rollbacked",
    "50": "Tournament Rebuy Rollbacked",
    "51": "Tournament Addon Rollbacked",
    "52": "Tournament Transaction Rollbacked",
    "54": "Locked Cash Released",
    "55": "Confiscated",
    "56": "Platform credit",
    "57": "Debit",
    "58": "Referral Wager Cash",
    "59": "Referee Wager Cash",
    "61": "Add Cash Reward",
    "63": "Withdrawal Reward",
    "65": "Credits Expired",
    "68": "Satellite Tournament Winning",
    "69": "Balances migrated from Gamezy",
    "104": "Refund",
    "105": "Refund Rejected",
    "107": "System Correction",
    "108": "System Correction",
    "110": "System Refund",
    "119": "Table Topup",
    "118": "Released from Locked DC",
    "123": "Add Cash Reward",
    "126": "Fiscal Year Ending Tds Deduction",
    "127": "Cross financial year transaction",
    "129": "Business Promotion Credit",
    "130": "TDS Correction",
    "131": "TDS Correction",
    "132": "System Correction",
    "133": "Leaderboard Winnings",
}

export const ADD_CASH_TRANSACTION_LABEL = {
    20: "₹{amount} Added Successfully",
    21: "₹{amount} Deposit Failed",
    5: "₹{amount} Deposit is in Process",
    10:"₹{amount} Deposit is in Process"
}

export const TRANSACTIONS_SORTING_METHOD = {
    ASC:"ASC",
    DESC:"DESC"
}

export const PAYIN_EXCLUSIVE_STATE_CODE = [25,26]

export const PAYIN_STATE_CODE_DAMAN_AND_DIU_DADRA_NAGAR_HAVELI = 26;

export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 1;
