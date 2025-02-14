import {GsGameVariant} from "../enums/gs-game-variant";
import {
    GsBuyInConfig,
    GsEntryConfig,
    GsEntryType,
    GsMoneyType,
    GsTournamentSpeed,
    GsTournamentState,
    GsTournamentType
} from "./mtt-list";
import {GsPrizeConfigType} from "../enums/gs-prize-config-type";
import {GsTournamentCurrencyType} from "../enums/gs-tournament-currency-type";

export interface TableList {
    max_stack: number;
    max_stackInBB: string;
    min_stack: number;
    min_stackInBB: string;
    players: number;
    table_id: string;
}

export interface PlayerList {
    idx: number;
    is_idx_show: boolean;
    player_id: string;
    player_name: string;
    rank: number;
    re_entries: number;
    re_buys: number;
    stack: number;
    stackInBB: string;
    table: string;
}

export interface PrizeList {
    amount: number;
    asset: string;
    idx: number;
    is_idx_show: boolean;
    player_id: string;
    player_name: string;
    rank: number;
    point: string;
    primary_value?: number;
    secondary_value?: number;
}

export interface Blind {
    current_sb: number;
    current_bb: number;
    current_ante: number;
    current_level: number;
    current_level_start: number;
    current_level_pause: number;
    current_level_end: number;
    next_sb: number;
    next_bb: number;
    next_ante: number;
    next_level: number;
    next_level_start: number;
}

export interface Metric {
    hands: number;
    stack_max: number;
    stack_min: number;
    stack_avg: number;
    stack_maxInBB: string;
    stack_minInBB: string;
    stack_avgInBB: string;
}

export interface SatelliteTournamentResponse {
    start_time?: number;
    late_registration_duration?: number;
    game_type?: GsGameVariant;
    id?: string;
    name?: string;
    socket?: string;
    buy_in?: number;
    prize_pool?: number;
    type?: GsTournamentType;
    entry?: GsEntryType;
    methods?: GsMoneyType[]; // You need to replace `methods.Method` with the correct type if available.
    state?: GsTournamentState;
    speed?: GsTournamentSpeed;
    remaining_players?: number;
    players?: number;
    stack?: number;
    seats?: number;
    blind_level?: number;
    ante?: number;
    small_blind?: number;
    big_blind?: number;
    blind_duration?: number;
    has_satellite?: boolean;
    is_satellite?: boolean;
    dont_list?: boolean;
    list_on_play_store?: boolean;
    is_hard_shuffle_itm?: boolean;
    is_active?: boolean;
    ticket_winners?: string[];
}

export interface PrizeDistributionDetails {
    prize_config_type: GsPrizeConfigType,
    is_overlay: boolean,
    entries_left: number,
    primary_currency: GsTournamentCurrencyType,
    secondary_currency: GsTournamentCurrencyType,
    total_entries_required: number,
    overlay_percent: number,
}


export interface TournamentDetailsResponse {
    name: string;
    state: GsTournamentState;
    table_list: TableList[];
    player_list: PlayerList[];
    prize_list: PrizeList[];
    is_satellite: boolean;
    satty_list: SatelliteTournamentResponse[];
    blind: Blind;
    total_players: number;
    remaining_players: number;
    min_players: number;
    max_players: number;
    total_buy_ins: number;
    total_re_buys: number;
    total_add_ons: number;
    total_re_entries: number;
    metric: Metric;
    total_prize_pool: number;
    total_tickets: number;
    total_points: string;
    entry: GsEntryConfig;
    break_start: number;
    break_end: number;
    is_hh: boolean;
    is_break: boolean;
    start_time: number;
    end_time: number;
    prize_distribution_details: PrizeDistributionDetails;
    speed: GsTournamentSpeed;
    type: GsTournamentType;
    variant: GsGameVariant;
    seats: number;
    buy_in_config: GsBuyInConfig;
    entry_methods: GsMoneyType[];
    stack: number;
    registration_end: number;
}