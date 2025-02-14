import { CashPopupKeyValue } from "./reserve-room";

export interface PlayerJoinBackResponse {
    data: string,
    seatId: number,
    kv?: CashPopupKeyValue
    max: number;
    min: number;
    table_id: string;
    ticket_active?: boolean;
    ticket_balance?: number;
    ticket_max?: number;
    ticket_min?: number;
    timer: number;
}