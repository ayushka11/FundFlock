import {IAmountData} from '../amount-data';
import {GsMoneyType} from "../game-server/mtt-list";

export interface CashGameTickets {
    cashGameTickets?: Ticket[],
    totalCashGameTicketCount?: number,
    totalCashGameTicketAmount?: number
}

export interface TournamentTickets {
    tournamentTickets?: Ticket[],
    totalTournamentTicketCount?: number,
    totalTournamentTicketAmount?: number
}


export interface Ticket {
    id?: string,
    userId?: string,
    currencyCode?: string,
    packId?: string,
    totalCreditAmount?: number,
    totalCreditCount?: number,
    totalDebitCount?: number,
    totalDebitAmount?: number,
    balance?: number,
    initBalance?: number,
    accumulationLevel?: number,
    activationTime?: string,
    expiryTime?: string,
    version?: number,
    eventId?: string,
    subEventId?: string,
    status?: string,
    createdAt?: string,
    updatedAt?: string,
    meta?: string
}


export interface ICashGameTickets {
    cashGameTickets?: ICashTicket[];
    totalCashGameTicketCount?: number;
    totalCashGameTicketAmount?: number;
}

export interface ITournamentTickets {
    tournamentTickets?: ITournamentTicket[];
    totalTournamentTicketCount?: number;
    totalTournamentTicketAmount?: number;
}

export interface ICashTicket {
    id?: string,
    name?: string,
    description?: string,
    balance?: number,
    value?: number,
    expiry?: number,
    variants?: string[],
    gameVariantDetails?: TicketGameVariant[],
    status?: string;
}

export interface ITournamentTicket {
    id?: string,
    name?: string,
    value?: number,
    expiry?: number,
    ticketCount?: number,
    status?: string,
    tournamentId?: string,
}


export interface TicketGameVariant {
    gameVariant: string,
    smallBlind: number,
    bigBlind: number,
    minBuyIn: number,
    maxBuyIn: number
}


export interface WalletTransaction {
    userId?: string,
    currencyCode?: string,
    transactionType?: string,
    internalTransactionType?: number,
    transactionAmount?: number,
    ticketId?: string,
    eventId?: string,
    subEventId?: string,
    referenceId?: string,
    meta?: any,
    createdAt?: string,
    updatedAt?: string,
    isPrimaryWalletTransaction?: boolean,
    previousBalance?: number,
    updatedBalance?: number,
    transactionId?: string,
    tenantId?: number,
    subOrgId?: number
}

export interface CashGameTicketTransactions {
    transactions?: WalletTransaction[]
}

export interface ITicketTransaction {
    transactionAmount?: number,
    transactionType?: number,
    transactionName?: string,
    transactionDate?: number,
    gameDetails?: TicketGameVariant,
}

export interface ICashGameTicketTransactions {
    cashGameTicketTransactions?: ITicketTransaction[]
}

export interface UserWalletBalance {
    userId?: number,
    depositBalance?: number,
    withdrawalBalance?: number,
    practiceBalance?: number,
    cashGameTicketBalance?: number,
    tournamentTicketBalance?: number,
    lockedCashBalance?: number,
    releasedLockedCashBalance?: number,
    currentBalance?: number, //Total of Deposit + Withdrawal
}


export interface UserWalletBalanceV2 {
    userId?: number,
    playerGameBalance?: number;
    addCashBalance?: number;
    winningBalance?: number;
    discountCreditBalance?: number;
    tournamentDiscountCreditBalance?: number;
    practiceBalance?: number;
    lockedDiscountCreditBalance?: number;
    totalTournamentBalance?: number;
    currentBalance?: number, //Total of Deposit + Withdrawal
    formattedUserWalletBalance?: FormattedUserWalletBalance
}


export interface UserWalletDetails {
    userId?: number,
    playerGameBalance?: number;
    addCashBalance?: number;
    winningBalance?: number;
    discountCreditBalance?: number;
    tournamentDiscountCreditBalance?: number;
    practiceBalance?: number;
    lockedDiscountCreditBalance?: number;
    tournamentTicketCount?: number;
    totalTournamentBalance?: number;
    currentBalance?: number, //Total of Deposit + Withdrawal
}

export interface FormattedUserWalletBalance {
    playerGameBalance?: IAmountData;
    winningBalance?: IAmountData;
    discountCreditBalance?: IAmountData;
    tournamentDiscountCreditBalance?: IAmountData;
    lockedDiscountCreditBalance?: IAmountData;
    currentBalance?: IAmountData,
    totalTournamentBalance?: IAmountData,
}

export interface UserTransactionSummary {
    transactionType: number,
    transactionTypeLabel: string,
    createdAt?: string,
    id: string,
    status?: number,
    amount: number,
    previousBalance?: number,
    updatedBalance?: number,
    type: string,
    isNewTxn?: boolean,
    tagMsg?: string,
}

export interface UserTransactionDetails {
    transactionType: number,
    transactionLabel: string,
    createdAt?: string,
    id: string,
    status?: number,
    transactionAmount: number,
    updatedBuyInValue?: number,
    type: string,
    addCashData?: AddCashData,
    withdrawalData?: WithdrawalData,
    gameData?: GameData,
    benefitData?: BenefitData,
    meta?: object,
    tagMsg?: string;
}

export interface AddCashData {
    buyInValue?: number,
    addCashAmount?: number,
    gst?: number,
    discountCredit?: number,
    tournamentDiscountCredit?: number,
    lockedDcsCredit?: number;
    tournamentTickets?: number;
    benefitAmount?: number;
    totalValue?: number;
}

export interface WithdrawalData {
    requestedAmount?: number,
    winningsToGameBalance?: number,
    winningsToBank?: number,
    tds?: number,
    withdrawalPlaceAmount?: number,
}

export interface GameData {
    buyInValue?: number,
    realBuyInValue?: number,
    playerGameBalance?: number,
    winnigs?: number,
    discountCredit?: number,
    tournamentDiscountCredit?: number,
}

export interface BenefitData {
    discountCredit?: number,
    tournamentDiscountCredit?: number,
}

export interface TournamentEntryDetailsResponse {
    userId: number;
    depositBalance: number;
    withdrawalBalance: number;
    totalBalance: number;
    registrationFee: number;
    prizePoolContribution: number;
    entryMethods: Array<TournamentEntryMethod>
}

export interface TournamentEntryMethod {
    entryMethod: GsMoneyType;
    entryAmount: number;
    active: boolean;
    wallet: TournamentEntryCurrencyDetails;
    debit: TournamentEntryCurrencyDetails;
    ticketId?: string;
    ticketName?: string;
}

export interface TournamentEntryCurrencyDetails {
    depositBalance?: number;
    withdrawalBalance?: number;
    tournamentTicketBalance?: number;
    totalBalance?: number;
}

export interface Cashbacks {
    cashbacks?: Cashback[],
}

export interface Cashback {
    id?: string;
    userId?: string;
    currencyCode?: string;
    packId?: string;
    totalCreditAmount?: number;
    totalCreditCount?: number;
    totalDebitCount?: number;
    totalDebitAmount?: number;
    initBalance?: number;
    balance?: number;
    accumulationLevel?: number;
    activationTime?: Date;
    expiryTime?: Date;
    version?: number;
    eventId?: string;
    subEventId?: string;
    status?: number;
    createdAt?: Date;
    updatedAt?: Date;
    meta?: string;
    lockedCashReleaseAmount?: number;
    releasedLockedCashAmount?: number;
    conversionFactor?: number;
}

export interface ICashbacks {
    cashbacks?: ICashback[];
}

export interface ICashback {
    id?: string;
    promoCode?: string;
    releasedAmount?: number;
    value?: number;
    expiry?: number;
    expiryText?: string;
    status?: number;
    statusText?: string;
}


export interface UserWalletBalanceV2 {
    userId?: number;
    playerGameBalance?: number;// ACS+ GS
    winningBalance?: number;// WS
    discountCreditBalance?: number;// DCS
    tournamentDiscountCreditBalance?: number;// TDC
    practiceBalance?: number;
    addCashBalance?: number;
}


export interface PackDetails {
    id?: string;
    userId?: string;
    currencyCode?: string;
    packId?: string;
    totalCreditAmount?: number;
    totalCreditCount?: number;
    totalDebitCount?: number;
    totalDebitAmount?: number;
    initBalance?: number;
    balance?: number;
    accumulationLevel?: number;
    activationTime?: Date;
    expiryTime?: Date;
    version?: number;
    eventId?: string;
    subEventId?: string;
    status?: number;
    createdAt?: Date;
    updatedAt?: Date;
    meta?: string;
    lockedCashReleaseAmount?: number;
    releasedLockedCashAmount?: number;
    conversionFactor?: number;
}


export interface LockedDcsPackDetails {
    expiryTime?: number;
    createdAt?: number;
    maxBenefitBalance?: number;
    redeemedBalance?: number;
    description?: string;
    status?: number;
    completedOn?: number;
}
