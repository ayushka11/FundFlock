export type TournamentBlindStructureResp = Array<TournamentBlindStructure>

export interface TournamentBlindStructure {
    level: number;
    small_blind: number;
    big_blind: number;
    ante: number;
    turn_time: number;
    time_bank: number;
    time_bank_renew: number;
    reconnect_time: number;
    disconnect_time: number;
    duration: number;
}