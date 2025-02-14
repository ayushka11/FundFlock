export interface JoinTableResponse {
    seatId: number;
    data?: string;
    kv?: {
        check_frg?: boolean;
        is_fgp?: boolean;
    };
}