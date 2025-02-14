export interface TopupValueResponse {
    balance?: number;
    kv?: TopupValueKeyValue
    max: number;
    min: number;
    seatId: number;
    ticket_active?: boolean;
    ticket_balance?: number;
    ticket_max?: number;
    ticket_min?: number;
    timer: number;
    antiBankingTimer?: number
}

export interface TopupValueKeyValue {
    primary: PrimaryWalletData;
    pw_bonus: number;
    pw_real: number;
}

export interface PrimaryWalletData {
    bonus: number;
    deposit: number;
    total: number;
    total_real: number;
    winning: number;
};