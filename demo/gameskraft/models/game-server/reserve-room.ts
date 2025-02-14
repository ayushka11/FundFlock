export interface ReserveRoomResponse {
    balance?: number;
    kv?: CashPopupKeyValue
    max: number;
    min: number;
    table_id: string;
    ticket_active?: boolean;
    ticket_balance?: number;
    ticket_max?: number;
    ticket_min?: number;
    timer: number;
    antiBankingTime?: number
}

export interface CashPopupKeyValue {
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