import {GsMoneyType} from '../game-server/mtt-list';
import AriesTournamentBuyInMethod from "../../models/tournament/enums/tournament-buy-in-method"

export interface TournamentEntryDetailsResponseV2 {
    userId: number;
    playerGameBalance: number;
    winningBalance: number;
    discountCreditBalance: number;
    tournamentDiscountCreditBalance: number;
    totalBalance: number;
    registrationFee: number;
    prizePoolContribution: number;
    entryMethods: Array<TournamentEntryMethodV2>
}

export interface TournamentEntryMethodV2 {
    entryMethod: GsMoneyType;
    entryAmount: number;
    active: boolean;
    wallet: TournamentEntryCurrencyDetailsV2;
    debit: TournamentEntryCurrencyDetailsV2;
}

export interface TournamentEntryCurrencyDetailsV2 {
    playerGameBalance?: number;
    winningBalance?: number;
    discountCreditBalance?: number;
    tournamentDiscountCreditBalance?: number;
    totalBalance?: number;
    totalRealBalance?: number;
}


export interface TournamentEntryDetailsResponseV3 {
    userId: number;
    playerGameBalance: number;
    winningBalance: number;
    discountCreditBalance: number;
    tournamentDiscountCreditBalance: number;
    totalBalance: number;
    registrationFee: number;
    prizePoolContribution: number;
    entryMethods: Array<TournamentEntryMethodV3>
}

export interface TournamentEntryMethodV3 {
    entryMethod: AriesTournamentBuyInMethod;
    entryAmount: number;
    active: boolean;
    wallet: TournamentEntryCurrencyDetailsV2;
    debit: TournamentEntryCurrencyDetailsV2;
}