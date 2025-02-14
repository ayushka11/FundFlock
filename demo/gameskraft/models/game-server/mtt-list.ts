import {GsGameVariant} from "../enums/gs-game-variant";
import {GsPrizeConfigType} from "../enums/gs-prize-config-type";
import {GsTournamentCurrencyType} from "../enums/gs-tournament-currency-type";
import {IAmountData} from "../amount-data";
import {TournamentStatus} from "../enums/tournament/tournament-status";
import {TournamentType} from "../enums/tournament/tournament-type";
import {EntryType} from "../enums/tournament/entry-type";

export enum GsEntryType {
    FREEZE_OUT = "freeze_out",
    RE_ENTRY = "re_entry",
    RE_BUY = "re_buy",
    RE_BUY_ADD_ON = "re_buy_add_on",
}

export enum GsTournamentType {
    NORMAL = "normal",
    BOUNTY = "bounty",
    PROGRESSIVE_BOUNTY = "progressive_bounty",
    HIT_AND_RUN = "hit_and_run",
    WIN_THE_BUTTON = "win_the_button",
    THIRTY_BB = "30_bb",
    MSP = "msp",
    MFP = "mfp",
    POINTS = "points"
}

export enum GsMoneyType {
    FREE_ROLL = "free_roll",
    POKER_MONEY = "poker_money",
    TICKET = "ticket",
    POCKET_COIN = "pocket_coins",
    AUTO_REGISTER = "auto_register"
}

export enum GsTournamentState {
    ANNOUNCED = "announced",
    REGISTERING = "registering",
    RUNNING = "running",
    LATE_REGISTRATION = "late_registration",
    COMPLETED = "completed",
    CANCELLED = "canceled",
    ABORTED = "aborted",
}

export enum GsTournamentSpeed {
    SLOW = "slow",
    NORMAL = "normal",
    TURBO = "turbo",
    HYPER_TURBO = "hyper_turbo",
    HYPER = "hyper",
    REGULAR = "regular"
}

export enum GsPlayerTournamntStatus {
    PLAYING = "playing",
    REGISTERED = "registered",
    BUSTED = "busted",
    FINISHED = "finished",
    COMPLETED = "completed"
}

// Interface for BIC (Buy-In Config)
export interface GsBuyInConfig {
    total_amount: number;
    registration_fee: number;
    prize_pool_contribution: number;
    bounty_amount: number;
}

// Interface for EC (Entry Config)
export interface GsEntryConfig {
    type: GsEntryType;
    config: {
        bounty_amount?: number;
        limit?: number;
        methods?: GsMoneyType[];
        pop_up_duration?: number;
        top_up_duration?: number;
        end?: number;
        min_stack?: number;
        prize_pool_contribution?: number;
        registration_fee?: number;
        total_amount?: number;
        re_buy_limit?: number
        re_buy_duration?: number
        re_buy_min_stack?: number
        re_buy_top_up_duration?: number
        re_buy_end?: number
        add_on_after?: number
        add_on_chips?: number
        add_on_amount?: number
        add_on_duration?: number
    };
}

// Interface for KV (Key-Value)
interface KeyValue {
    feature_color: string;
    feature_colors: string[];
    is_featured: boolean;
    tag: string;
}

// Interface for the payload
export interface TournamentResponse {
    id: string;
    rt: number; //registrationTime
    st: number; //startTimer
    ld: number; //lateRegistrationDuration
    gt: GsGameVariant;
    nm: string; //name
    bi: number; // buyIn
    pp: number; //prizePool
    tt: number; //totalTickets
    totalPoints: string;
    ty: GsTournamentType// GstournamentType
    en: GsEntryType; // Update to use the enum
    mt: GsMoneyType[]; // Update to use the enum
    sa: GsTournamentState; // Update to use the enum
    sp: GsTournamentSpeed; // Update to use the enum
    rp: number; //remainingPlayer
    pc: number; //playerCount
    sk: number; //stack
    skInBB: string; //stackInBB
    se: number; //maxNumofSeat
    bl: number; //blindLevel
    an: number;//anter
    sb: number; // smallBlind
    bb: number;// bigBlindAmount
    bd: number;// blindDuration
    hs: boolean;//hasSatellite
    is: boolean;//isSatellite
    dl: boolean;//dontList
    lp: boolean;//listOnPlayerStore
    kv: KeyValue;
    od: number;//order
    vr: string;//version
    bic: GsBuyInConfig;
    ec: GsEntryConfig;
    uf: any[]; // userFilter
    mxp: number;// maxPlayer
    prizeConfigType?: GsPrizeConfigType; //prizeConfigType Overlay or Not
    primaryCurrency?: GsTournamentCurrencyType; //main prizePool currency type
    isOverlayActive?: boolean; //overlayActive or not
}

export interface TournamentResponseV3 {
    id: string;
    registrationStartTime: number; //registrationTime
    startTime: number; //startTimer
    lateRegistrationEndTime: number; //lateRegistrationDuration
    name: string; //name
    registerAmount: number; // buyIn
    prizePool: IAmountData; //prizePool
    tournamentStatus: TournamentStatus; // Update to use the enum
    activePlayers: number; //playerCount
    migratedTournament: boolean;
    gameVariant: number;
    maxNumberOfSeat: number;
    canReenter: boolean;
    tournamentVariant: EntryType;
    tournamentType: TournamentType;
}

