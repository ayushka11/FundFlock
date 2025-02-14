import CurrencyUtil from '../helpers/currency-util';
import GsUtil from "../utils/gs-util";
import {TournamentUtil} from "../utils/tournament-util";
import {GameVariant} from "./enums/game-variant";
import {MoneyType} from "./enums/money-type";
import {EntryType} from "./enums/tournament/entry-type";
import {PlayerTournamentStatus} from "./enums/tournament/player-tournament-status";
import {TournamentSpeed} from "./enums/tournament/tournament-speed";
import {TournamentStatus} from "./enums/tournament/tournament-status";
import {TournamentType} from "./enums/tournament/tournament-type";
import {GsBuyInConfig, GsEntryConfig, GsMoneyType, TournamentResponse} from "./game-server/mtt-list";
import {PrizeConfigType} from "./enums/tournament/prize-config-type";
import {TournamentCurrencyType} from "./enums/tournament/tournament-currency-type";
import AriesTournamentResponse from "./tournament/response/tournament-response";
import AriesUtil from "../utils/aries-util";
import AriesTournamentType from "./tournament/enums/aries-tournament-type";

export const nonFetaturedTournamentStatus: number[] = [TournamentStatus.RUNNING, TournamentStatus.COMPLETED, TournamentStatus.CANCELLED, TournamentStatus.ANNOUNCED, TournamentStatus.RUNNING]
export const nonFeaturedPlayerTournamentStatus: number[] = [PlayerTournamentStatus.PLAYING, PlayerTournamentStatus.REGISTERED]

export interface BuyInConfig {
    type: MoneyType[];
    totalAmount: number;
    registrationFee: number;
    prizePoolContribution: number;
    bountyAmount: number;
}

export interface EntryConfig {
    type: EntryType;
    config: {
        bountyAmount?: number;
        limit?: number;
        methods?: MoneyType[];
        popUpDuration?: number;
        topUpDuration?: number;
        prizePoolContribution?: number;
        registrationFee?: number;
        totalAmount?: number;
        reBuyLimit?: number;
        reBuyDuration?: number;
        reBuyMinStack?: number;
        reBuyTopUpDuration?: number;
        reBuyEnd?: number;
        addOnAfter?: number;
        addOnChips?: number;
        addOnAmount?: number;
        addOnDuration?: number;
        minStack?: number;
        end?: number
    };
}


export interface TournamentConfig {
    minPlayers?: number;
    maxPlayers?: number;
    startTime?: number;
    endTime?: number;
    entryConfig?: EntryConfig
    buyInConfig?: BuyInConfig;
    breakStart?: number,
    breakEnd?: number,
    totalBuyIns?: number,
    totalReBuys?: number,
    totalAddOns?: number,
    totalReEntries?: number,
    maxPlayer?: number
    hasSatellite?: boolean;
    isSatellite?: boolean;
    isFeatured?: boolean;
    maxNumberOfSeat?: number;
    satelliteTournamentList?: Tournament[];
    featureColor?: string;
    featureColors?: Array<string>;
    tag?: string;
    stackAmount?: number;
    stackAmountInBB?: string;
    registrationStartTime?: number;
    lateRegistrationDuration?: number;
    lateRegistrationEndTime?: number
    donotList?: boolean;
    listOnPlayStore?: boolean;
    entryType?: EntryType;
    entryMethods?: MoneyType[];
    buyInAmount?: number;
    isActive?: boolean;
    ticketWinners?: string[];
    tournamentSpeed?: TournamentSpeed;
    gameVariant?: GameVariant;
    tournamentType?: TournamentType;
}


export class Tournament {
    id?: string;
    gameVariant?: GameVariant;
    tournamentType?: TournamentType;
    tournamentStatus?: TournamentStatus;
    tournamentSpeed?: TournamentSpeed;
    tournamentConfig?: TournamentConfig;
    name?: string;
    prizePool?: number;
    totalTickets?: number;
    totalPoints?: string;
    remainingPlayer?: number;
    playerCount?: number;
    blindLevel?: number;
    anteAmount?: number;
    smallBlindAmount?: number;
    bigBlindAmount?: number;
    blindDuration?: number;
    filters?: {
        userFilter: number[]
    };
    hasPlayed?: boolean;
    isOverlayActive?: boolean;
    prizeConfigType?: PrizeConfigType;
    primaryCurrency?: TournamentCurrencyType;
    migratedTournament?: boolean;

    static getTournamentEntryConfig(entryConfig: GsEntryConfig): EntryConfig {
        if (entryConfig?.config) {
            return {
                type: TournamentUtil.getEntryTypeFromGsResponse(entryConfig?.type),
                config: {
                    bountyAmount: entryConfig?.config?.bounty_amount,
                    limit: entryConfig?.config?.limit,
                    methods: TournamentUtil.getEntryMethodsFromGsResponse(entryConfig?.config?.methods),
                    popUpDuration: entryConfig?.config?.pop_up_duration,
                    prizePoolContribution: entryConfig?.config?.prize_pool_contribution,
                    registrationFee: entryConfig?.config?.registration_fee,
                    totalAmount: entryConfig?.config?.total_amount,
                    topUpDuration: entryConfig?.config?.top_up_duration,
                    end: entryConfig?.config?.end,
                    minStack: entryConfig?.config?.min_stack,
                    reBuyLimit: entryConfig?.config?.re_buy_limit,
                    reBuyDuration: entryConfig?.config?.re_buy_duration,
                    reBuyMinStack: entryConfig?.config?.re_buy_min_stack,
                    reBuyTopUpDuration: entryConfig?.config?.re_buy_top_up_duration,
                    reBuyEnd: entryConfig?.config?.re_buy_end,
                    addOnAfter: entryConfig?.config?.add_on_after,
                    addOnChips: entryConfig?.config?.add_on_chips,
                    addOnAmount: entryConfig?.config?.add_on_amount,
                    addOnDuration: entryConfig?.config?.add_on_duration
                }
            }
        }
        else {
            return;
        }
    }

    static getTournamentBuyInConfig(buyInConfig: GsBuyInConfig, buyInMethods: GsMoneyType[]): BuyInConfig {
        return {
            type: TournamentUtil.getEntryMethodsFromGsResponse(buyInMethods),
            totalAmount: buyInConfig.total_amount,
            registrationFee: buyInConfig.registration_fee,
            prizePoolContribution: buyInConfig.prize_pool_contribution,
            bountyAmount: buyInConfig.bounty_amount,
        }
    }

    static getTournamentConfig(response: TournamentResponse): TournamentConfig {
        return {
            maxPlayers: response?.mxp,
            startTime: response?.st,
            registrationStartTime: response?.rt,
            lateRegistrationDuration: response?.ld,
            entryConfig: Tournament.getTournamentEntryConfig(response?.ec),
            buyInConfig: Tournament.getTournamentBuyInConfig(response?.bic, response?.mt),
            stackAmount: response?.sk,
            stackAmountInBB: response?.skInBB,
            maxNumberOfSeat: response?.se,
            hasSatellite: response?.hs,
            isSatellite: response?.is,
            donotList: response?.dl,
            listOnPlayStore: response?.lp,
            isFeatured: response?.kv?.is_featured || false,
            featureColor: response?.kv?.feature_color || "",
            featureColors: response?.kv?.feature_colors || [],
            tag: response?.kv?.tag || "",
        }
    }

    static convertGsResponse(response: TournamentResponse): Tournament {
        const tournament = new Tournament();

        tournament.id = response?.id;
        tournament.gameVariant = GsUtil.getGameVariant(response?.gt);
        tournament.tournamentType = TournamentUtil.getTournamentTypeFromGsResponse(response?.ty);
        tournament.tournamentStatus = TournamentUtil.getTournamentStatusFromGsResponse(response?.sa);
        tournament.tournamentSpeed = TournamentUtil.getTournamentSpeedFromGsResponse(response?.sp);
        tournament.tournamentConfig = Tournament.getTournamentConfig(response);
        tournament.name = response?.nm || "";
        tournament.prizePool = response?.pp;
        tournament.totalTickets = response?.tt;
        tournament.totalPoints = response?.totalPoints,
            tournament.remainingPlayer = response?.rp;
        tournament.playerCount = response?.pc;
        tournament.blindLevel = response?.bl;
        tournament.anteAmount = response?.an;
        tournament.smallBlindAmount = response?.sb;
        tournament.bigBlindAmount = response?.bb;
        tournament.blindDuration = response?.bd;
        tournament.filters = {
            userFilter: response?.uf || []
        };
        return tournament
    }

    static convertGsResponseV2(response: TournamentResponse): Tournament {
        const tournament = new Tournament();

        tournament.id = response?.id;
        tournament.gameVariant = GsUtil.getGameVariant(response?.gt);
        tournament.tournamentType = TournamentUtil.getTournamentTypeFromGsResponse(response?.ty);
        tournament.tournamentStatus = TournamentUtil.getTournamentStatusFromGsResponse(response?.sa);
        tournament.tournamentSpeed = TournamentUtil.getTournamentSpeedFromGsResponse(response?.sp);
        tournament.tournamentConfig = Tournament.getTournamentConfig(response);
        tournament.name = response?.nm || "";
        tournament.prizePool = response?.pp;
        tournament.totalTickets = response?.tt;
        tournament.totalPoints = response?.totalPoints;
        tournament.remainingPlayer = response?.rp;
        tournament.playerCount = response?.pc;
        tournament.blindLevel = response?.bl;
        tournament.anteAmount = response?.an;
        tournament.smallBlindAmount = response?.sb;
        tournament.bigBlindAmount = response?.bb;
        tournament.blindDuration = response?.bd;
        tournament.filters = {
            userFilter: response?.uf || []
        };
        tournament.prizeConfigType = GsUtil.getTournamentPrizeConfig(response?.prizeConfigType)
        tournament.primaryCurrency = GsUtil.getTournamentCurrencyType(response?.primaryCurrency)
        tournament.isOverlayActive = response?.isOverlayActive
        return tournament
    }



    static getTournamentConfigFromAriesResponse(response: AriesTournamentResponse): TournamentConfig {
        return {
            startTime: response?.startTime,
            lateRegistrationDuration: response?.lateRegistrationEndTime - response?.startTime,
            lateRegistrationEndTime: response?.lateRegistrationEndTime,
            isSatellite: TournamentUtil.getIsSatelliteFromAriesTournamentType(response?.tournamentType),
            isFeatured: !!response?.feature?.isFeatured,
            featureColors: response?.feature?.featureColours,
            buyInConfig: TournamentUtil.getTournamentBuyInConfigFromAriesResponse(response),
            entryConfig: TournamentUtil.getTournamentEntryConfigFromAriesResponse(response),

            stackAmount: CurrencyUtil.getAmountInRupee(response?.playerInitialStack),
            maxPlayers: response?.maxPlayers,
            maxNumberOfSeat: response?.maxSeatsPerTable,
            totalReEntries: response?.reentryCount,
            entryType: response?.canReenter ? EntryType.RE_ENTRY : EntryType.FREEZE_OUT

            //registrationStartTime: response?.registrationStartTime,
            //stackAmountInBB: response?.skInBB,
            //hasSatellite: response?.hs,
            //donotList: response?.dl,
            //listOnPlayStore: response?.lp,
            //featureColor: response?.feature?.featureColour || "",
            // tag: response?.kv?.tag || "",
        }
    }

    static getTournamentFromAriesResponse(response: AriesTournamentResponse, vendorId: number){
        const tournament = new Tournament();

        tournament.id = response?.id?.toString();
        tournament.name = TournamentUtil.getTournamentNameFromAriesTournamentVendorMetadata(response?.vendorMetadata, vendorId);
        tournament.gameVariant = AriesUtil.getGameVariant(response?.gameVariant);
        tournament.tournamentType = TournamentUtil.getTournamentTypeFromAriesTournamentType(response?.tournamentType);
        tournament.tournamentSpeed = response?.tournamentSpeed;
        tournament.tournamentStatus = TournamentUtil.getTournamentStatusFromAriesTournamentStatus(response?.status);
        tournament.playerCount = response?.registerCount + response?.reentryCount;

        tournament.prizePool = CurrencyUtil.getAmountInRupee(response?.prizePool);
        tournament.primaryCurrency = TournamentUtil.getTournamentCurrencyTypeFromAriesTournamentCurrency(response?.prizeDistribution?.primaryCurrency);
        tournament.isOverlayActive = TournamentUtil.getIsOverlayActiveFromAriesPrizeDistributionType(response?.prizeDistribution?.prizeDistributionType, response?.prizeDistribution?.overlayPercent);

        tournament.totalTickets =  TournamentUtil.getTotalTicketsFromAriesPrizeAsset(response?.prizeAssetType, response?.prizeAssetCount);
        tournament.tournamentConfig = Tournament.getTournamentConfigFromAriesResponse(response);
        tournament.migratedTournament = true;

        tournament.totalPoints = (response?.tournamentType === AriesTournamentType.PSL) ? 'LB POINTS' : undefined;
        //tournament.gameVariant = AriesUtil.getGameVariant(response?.gameVariant);
        //tournament.remainingPlayer = response?.remainingPlayers;
        //tournament.blindLevel = response?.bl;
        //tournament.anteAmount = response?.an;
        //tournament.smallBlindAmount = response?.sb;
        //tournament.bigBlindAmount = response?.bb;
        //tournament.blindDuration = response?.bd;
        // tournament.filters = {
        //     userFilter: response?.uf || []
        // };
        //tournament.prizeConfigType = GsUtil.getTournamentPrizeConfig(response?.prizeConfigType)
        return tournament
    }
}
