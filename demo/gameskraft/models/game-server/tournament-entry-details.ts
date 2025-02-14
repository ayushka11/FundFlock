export interface TournamentEntryDetails {
    tid: string;
    entryMethod: TournamentEntryMethod;
}

export interface TournamentEntryMethod {
    buy_in: TournamentEntryBuyIn;
    type?: TournamentEntryType;
    methods: string[];
}

export interface TournamentEntryBuyIn {
    total_amount: number;
    registration_fee: number;
    prize_pool_contribution: number;
    bounty_amount: number;
}

export interface TournamentEntryType {
    type?: string
    config?: TournamentEntryTypeConfig;
}

export interface TournamentEntryTypeConfig {
    limit?: number;
    total_amount?: number;
    registration_fee?: number;
    prize_pool_contribution?: number;
    bounty_amount?: number;
    pop_up_duration?: number;
    methods?: string[];
}