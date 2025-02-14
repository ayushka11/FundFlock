import CurrencyUtil from '../helpers/currency-util';
import GsUtil from "../utils/gs-util";
import {TournamentUtil} from "../utils/tournament-util";
import {EntryType} from './enums/tournament/entry-type';
import {TournamentStatus} from "./enums/tournament/tournament-status";
import {
    Blind,
    Metric,
    PlayerList,
    PrizeList,
    SatelliteTournamentResponse,
    TableList,
    TournamentDetailsResponse
} from "./game-server/tournament-details";
import {Tournament, TournamentConfig} from "./tournament";
import {PrizeConfigType} from "./enums/tournament/prize-config-type";
import {TournamentCurrencyType} from "./enums/tournament/tournament-currency-type";
import AriesTournamentResponse from "../models/tournament/response/tournament-response"
import ActiveTablesResponse from "../models/tournament/response/active-tables-response"
import AriesPrizeStructureLobby from "../models/tournament/response/prize-structure-lobby"
import AriesTournamentPrizeType from "../models/tournament/enums/tournament-prize-type"
import {PlayerTournamentStatus} from "./enums/tournament/player-tournament-status";
import {GameVariant} from "./enums/game-variant";
import TournamentLeaderboardResponse, {
    TournamentLeaderboardRank
} from '../models/tournament/response/tournament-leaderboard-response';
import {TournamentStats as AriesTournamentStats} from "../models/tournament/tournament-stats";
import TitanUtil from "../utils/titan-util";
import AriesTournamentType from "./tournament/enums/aries-tournament-type";
import Parser from "../utils/parser";
export interface TournamentTableList {
    maxStackAmount: number;
    maxStackAmountInBB: string;
    minStackAmount: number;
    minStackAmountInBB: string;
    players: number;
    tableId: string;
    tableNumber?: string;
}

export interface TournamentPlayerList {
    idx?: number;
    isIdxShow?: boolean;
    playerId: string;
    playerName: string;
    rank: number;
    reEntries?: number;
    stackAmount: number;
    stackAmountInBB?: string;
    tableId?: string;
}

export interface TournamentPrizeList {
    amount?: number;
    asset?: string;
    idx?: number;
    isIdxShow?: boolean;
    playerId?: string;
    playerName?: string;
    rank?: number;
    point?: string;
    primaryValue?: number;
    secondaryValue?: number;
}

export interface PrizeDistributionDetailsApollo {
    prizeConfigType?: PrizeConfigType,
    isOverlay?: boolean,
    entriesLeft?: number,
    primaryCurrency?: TournamentCurrencyType,
    secondaryCurrency?: TournamentCurrencyType,
    totalEntriesRequired?: number,
    overlayPercent?: number,
}

interface TournamentBlindDetails {
    currentSmallBlindAmount: number;
    currentBigBlindAmount: number;
    currentAnteAmount: number;
    currentLevel: number;
    currentLevelStart: number;
    currentLevelPause: number;
    currentLevelEnd: number;
    nextSmallBlindAmount: number;
    nextBigBlindAmount: number;
    nextAnteAmount: number;
    nextLevel: number;
    nextLevelStart: number;
}

interface TournamentStats {
    handsPlayed: number;
    stackMaxAmount: number;
    stackMinAmount: number;
    stackAvgAmount: number;
    stackMaxAmountInBB: string;
    stackMinAmountInBB: string;
    stackAvgAmountInBB: string;
}

export class TournamentDetails {
    name: string;
    tournamentStatus: TournamentStatus;
    tableList?: TournamentTableList[];
    playerList?: TournamentPlayerList[];
    prizeList?: TournamentPrizeList[];
    blindDetails?: TournamentBlindDetails;
    totalPlayers?: number;
    remainingPlayers?: number;
    tournamentConfig?: TournamentConfig;
    stats?: TournamentStats;
    totalPrizePool?: number;
    totalTickets?: number;
    totalPoints?: string;
    isHandForHandActive?: boolean;
    isBreak?: boolean;
    prizeDistributionDetails?: PrizeDistributionDetailsApollo;
    migratedTournament?: boolean;
    playerStatus?: PlayerTournamentStatus;
    myRank?: number;

    static getTournamentTableList(response: TableList[]): TournamentTableList[] {
        return response.map((resp: TableList) => {
            return {
                maxStackAmount: resp?.max_stack,
                maxStackAmountInBB: resp?.max_stackInBB,
                minStackAmount: resp?.min_stack,
                minStackAmountInBB: resp?.min_stackInBB,
                players: resp?.players,
                tableId: resp?.table_id
            }
        })
    }

    static getTournamentPlayerList(response: PlayerList[]): TournamentPlayerList[] {
        return response.map((resp: PlayerList) => {
            return {
                idx: resp?.idx,
                isIdxShow: resp?.is_idx_show,
                playerId: resp?.player_id,
                playerName: resp?.player_name,
                rank: resp?.rank,
                reEntries: resp?.re_entries,
                stackAmount: resp?.stack,
                stackAmountInBB: resp?.stackInBB,
                tableId: resp?.table
            }
        })
    }

    static getTournamentPrizeList(response: PrizeList[]): TournamentPrizeList[] {
        return response.map((resp: PrizeList) => {
            return {
                amount: resp?.amount,
                asset: resp?.asset,
                idx: resp?.idx,
                isIdxShow: resp?.is_idx_show,
                playerId: resp?.player_id,
                playerName: resp?.player_name,
                rank: resp?.rank,
                point: resp?.point,
                primaryValue: resp?.primary_value,
                secondaryValue: resp?.secondary_value,
            }
        })
    }

    static getTournamentBlindDetails(response: Blind): TournamentBlindDetails {
        return {
            currentSmallBlindAmount: response?.current_sb,
            currentBigBlindAmount: response?.current_bb,
            currentAnteAmount: response?.current_ante,
            currentLevel: response?.current_level,
            currentLevelStart: Parser.roundOffToNearestNumber(TournamentUtil.getTimeInMilliSeconds(response?.current_level_start)),
            currentLevelPause: Parser.roundOffToNearestNumber(TournamentUtil.getTimeInMilliSeconds(response?.current_level_pause)),
            currentLevelEnd: Parser.roundOffToNearestNumber(TournamentUtil.getTimeInMilliSeconds(response?.current_level_end)),
            nextSmallBlindAmount: response?.next_sb,
            nextBigBlindAmount: response?.next_bb,
            nextAnteAmount: response?.next_ante,
            nextLevel: response?.next_level,
            nextLevelStart: Parser.roundOffToNearestNumber(TournamentUtil.getTimeInMilliSeconds(response?.next_level_start)),
        }
    }

    static getTournamentStats(response: Metric): TournamentStats {
        return {
            handsPlayed: response?.hands,
            stackMaxAmount: CurrencyUtil.getAmountInRupee(response?.stack_max),
            stackMinAmount: CurrencyUtil.getAmountInRupee(response?.stack_min),
            stackAvgAmount: CurrencyUtil.getAmountInRupee(response?.stack_avg),
            stackMaxAmountInBB: response?.stack_maxInBB,
            stackMinAmountInBB: response?.stack_minInBB,
            stackAvgAmountInBB: response?.stack_avgInBB,
        }
    }


    static getSatelliteTournamentConfig(tournament: SatelliteTournamentResponse): TournamentConfig {
        return {
            startTime: tournament?.start_time,
            lateRegistrationDuration: tournament?.late_registration_duration,
            buyInAmount: tournament?.buy_in,
            entryType: TournamentUtil.getEntryTypeFromGsResponse(tournament?.entry),
            entryMethods: TournamentUtil.getEntryMethodsFromGsResponse(tournament?.methods),
            stackAmount: tournament?.stack,
            maxNumberOfSeat: tournament?.seats,
            isSatellite: tournament?.is_satellite,
            hasSatellite: tournament?.has_satellite,
            isActive: tournament?.is_active,
            ticketWinners: tournament?.ticket_winners

        }
    }

    static getSatelliteTournaments(sattyList: SatelliteTournamentResponse[] = []): Tournament[] {
        return sattyList.map((resp: SatelliteTournamentResponse) => {
            return {
                id: resp?.id,
                gameVariant: GsUtil.getGameVariant(resp?.game_type),
                tournamentType: TournamentUtil.getTournamentTypeFromGsResponse(resp?.type),
                tournamentStatus: TournamentUtil.getTournamentStatusFromGsResponse(resp?.state),
                tournamentSpeed: TournamentUtil.getTournamentSpeedFromGsResponse(resp?.speed),
                tournamentConfig: TournamentDetails.getSatelliteTournamentConfig(resp),
                name: resp?.name || "",
                prizePool: resp?.prize_pool,
                remainingPlayer: resp?.remaining_players,
                playerCount: resp?.players,
                blindLevel: resp?.blind_level,
                anteAmount: resp?.ante,
                smallBlindAmount: resp?.small_blind,
                bigBlindAmount: resp?.big_blind,
                blindDuration: resp?.blind_duration,
            }

        })
    }

    static getSatelliteTournamentListFromAriesResponse(sattyList: AriesTournamentResponse[] = [], vendorId: number): Tournament[] {
        return sattyList.map((resp: AriesTournamentResponse) => {
            return Tournament.getTournamentFromAriesResponse(resp, vendorId)
        })
    }



    static getTournamentConfigFromDetails(response: TournamentDetailsResponse): TournamentConfig {
        return {
            minPlayers: response?.min_players,
            maxPlayers: response?.max_players,
            startTime: response?.start_time,
            endTime: response?.end_time,
            entryConfig: Tournament.getTournamentEntryConfig(response?.entry),
            breakStart: response?.break_start,
            breakEnd: response?.break_end,
            totalBuyIns: response?.total_buy_ins,
            totalReBuys: response?.total_re_buys,
            totalAddOns: response?.total_add_ons,
            totalReEntries: response?.total_re_entries,
            isSatellite: response?.is_satellite,
            satelliteTournamentList: TournamentDetails.getSatelliteTournaments(response?.satty_list)
        }
    }

    static getTournamentConfigFromDetailsV3(response: TournamentDetailsResponse): TournamentConfig {
        return {
            minPlayers: response?.min_players,
            maxPlayers: response?.max_players,
            startTime: TournamentUtil.getTimeInMilliSeconds(response?.start_time),
            endTime: TournamentUtil.getTimeInMilliSeconds(response?.end_time),
            entryConfig: Tournament.getTournamentEntryConfig(response?.entry),
            breakStart: TournamentUtil.getTimeInMilliSeconds(response?.break_start),
            breakEnd: TournamentUtil.getTimeInMilliSeconds(response?.break_end),
            totalBuyIns: response?.total_buy_ins,
            totalReBuys: response?.total_re_buys,
            totalAddOns: response?.total_add_ons,
            totalReEntries: response?.total_re_entries,
            isSatellite: response?.is_satellite,
            satelliteTournamentList: TournamentDetails.getSatelliteTournaments(response?.satty_list),
            buyInConfig: Tournament.getTournamentBuyInConfig(response?.buy_in_config, response?.entry_methods),
            tournamentSpeed: TournamentUtil.getTournamentSpeedFromGsResponse(response?.speed),
            gameVariant: GsUtil.getGameVariant(response?.variant),
            maxNumberOfSeat: response?.seats,
            tournamentType: TournamentUtil.getTournamentTypeFromGsResponse(response?.type),
            entryType: TournamentUtil.getEntryTypeFromGsResponse(response?.entry?.type),
            lateRegistrationEndTime: TournamentUtil.getTimeInMilliSeconds(response?.registration_end),
            stackAmount: response?.stack,
            lateRegistrationDuration: Parser.roundOffToNearestNumber(response?.registration_end) - Parser.roundOffToNearestNumber(TournamentUtil.getTimeInMilliSeconds(response?.start_time)) ,
        }
    }

    static getTournamentPrizeDistributionDetails(response: TournamentDetailsResponse): PrizeDistributionDetailsApollo {
        return {
            prizeConfigType: GsUtil.getTournamentPrizeConfig(response?.prize_distribution_details?.prize_config_type),
            isOverlay: response?.prize_distribution_details?.is_overlay,
            entriesLeft: response?.prize_distribution_details?.entries_left,
            primaryCurrency: GsUtil.getTournamentCurrencyType(response?.prize_distribution_details?.primary_currency),
            secondaryCurrency: GsUtil.getTournamentCurrencyType(response?.prize_distribution_details?.secondary_currency),
            totalEntriesRequired: response?.prize_distribution_details?.total_entries_required,
            overlayPercent: response?.prize_distribution_details?.overlay_percent,
        }
    }


    static convertGsResponse(resp: TournamentDetailsResponse) {
        const tournamentDetails = new TournamentDetails();
        tournamentDetails.name = resp?.name;
        tournamentDetails.tournamentStatus = TournamentUtil.getTournamentStatusFromGsResponse(resp?.state)
        tournamentDetails.tableList = resp?.table_list ? TournamentDetails.getTournamentTableList(resp.table_list) : [];
        tournamentDetails.playerList = resp?.player_list ? TournamentDetails.getTournamentPlayerList(resp.player_list) : [];
        tournamentDetails.prizeList = resp?.prize_list ? TournamentDetails.getTournamentPrizeList(resp.prize_list) : [];
        tournamentDetails.blindDetails = resp?.blind ? TournamentDetails.getTournamentBlindDetails(resp?.blind) : undefined;
        tournamentDetails.stats = resp?.metric ? TournamentDetails.getTournamentStats(resp?.metric) : undefined;
        tournamentDetails.totalPlayers = resp?.total_players;
        tournamentDetails.remainingPlayers = resp?.remaining_players;
        tournamentDetails.totalPrizePool = resp?.total_prize_pool;
        tournamentDetails.totalTickets = resp?.total_tickets;
        tournamentDetails.totalPoints = resp?.total_points;
        tournamentDetails.isHandForHandActive = resp?.is_hh;
        tournamentDetails.isBreak = resp?.is_break;
        tournamentDetails.tournamentConfig = TournamentDetails.getTournamentConfigFromDetails(resp);
        return tournamentDetails;
    }

    static convertGsResponseV2(resp: TournamentDetailsResponse) {
        const tournamentDetails = new TournamentDetails();
        tournamentDetails.name = resp?.name;
        tournamentDetails.tournamentStatus = TournamentUtil.getTournamentStatusFromGsResponse(resp?.state)
        tournamentDetails.tableList = resp?.table_list ? TournamentDetails.getTournamentTableList(resp.table_list) : [];
        tournamentDetails.playerList = resp?.player_list ? TournamentDetails.getTournamentPlayerList(resp.player_list) : [];
        tournamentDetails.prizeList = resp?.prize_list ? TournamentDetails.getTournamentPrizeList(resp.prize_list) : [];
        tournamentDetails.blindDetails = resp?.blind ? TournamentDetails.getTournamentBlindDetails(resp?.blind) : undefined;
        tournamentDetails.stats = resp?.metric ? TournamentDetails.getTournamentStats(resp?.metric) : undefined;
        tournamentDetails.totalPlayers = resp?.total_players;
        tournamentDetails.remainingPlayers = resp?.remaining_players;
        tournamentDetails.totalPrizePool = resp?.total_prize_pool;
        tournamentDetails.totalTickets = resp?.total_tickets;
        tournamentDetails.totalPoints = resp?.total_points;
        tournamentDetails.isHandForHandActive = resp?.is_hh;
        tournamentDetails.isBreak = resp?.is_break;
        tournamentDetails.tournamentConfig = TournamentDetails.getTournamentConfigFromDetails(resp);
        tournamentDetails.prizeDistributionDetails = TournamentDetails.getTournamentPrizeDistributionDetails(resp);

        return tournamentDetails;
    }

    static convertGsResponseV3(resp: TournamentDetailsResponse) {
        const tournamentDetails = new TournamentDetails();
        tournamentDetails.name = resp?.name;
        tournamentDetails.tournamentStatus = TournamentUtil.getTournamentStatusFromGsResponse(resp?.state)
        tournamentDetails.tableList = resp?.table_list ? TournamentDetails.getTournamentTableList(resp.table_list) : [];
        tournamentDetails.playerList = resp?.player_list ? TournamentDetails.getTournamentPlayerList(resp.player_list) : [];
        tournamentDetails.prizeList = resp?.prize_list ? TournamentDetails.getTournamentPrizeList(resp.prize_list) : [];
        tournamentDetails.blindDetails = resp?.blind ? TournamentDetails.getTournamentBlindDetails(resp?.blind) : undefined;
        tournamentDetails.stats = resp?.metric ? TournamentDetails.getTournamentStats(resp?.metric) : undefined;
        tournamentDetails.totalPlayers = resp?.total_players;
        tournamentDetails.remainingPlayers = resp?.remaining_players;
        tournamentDetails.totalPrizePool = resp?.total_prize_pool;
        tournamentDetails.totalTickets = resp?.total_tickets;
        tournamentDetails.totalPoints = resp?.total_points;
        tournamentDetails.isHandForHandActive = resp?.is_hh;
        tournamentDetails.isBreak = resp?.is_break;
        tournamentDetails.tournamentConfig = TournamentDetails.getTournamentConfigFromDetailsV3(resp);
        tournamentDetails.prizeDistributionDetails = TournamentDetails.getTournamentPrizeDistributionDetails(resp);

        return tournamentDetails;
    }

    static getTournamentPrizeListFromAriesResponse(response: AriesPrizeStructureLobby[]): TournamentPrizeList[] {
        return response?.map((resp: AriesPrizeStructureLobby) => {
            return {
                amount: CurrencyUtil.getAmountInRupee(resp?.prizeValue),
                asset: TournamentUtil.getAssetValue(resp),
                //idx: resp?.idx,
                //isIdxShow: resp?.is_idx_show,
                playerId: `${resp?.userId}`,
                playerName: resp?.userName,
                rank: resp?.rank,
                //point: resp?.point,
                primaryValue: CurrencyUtil.getAmountInRupee(resp?.primaryAmount),
                secondaryValue: CurrencyUtil.getAmountInRupee(resp?.secondaryAmount),
            }
        }) ?? []
    }

    static getTournamentConfigFromAriesResponse(response: AriesTournamentResponse, childSattyTournament: AriesTournamentResponse[], vendorId: number): TournamentConfig {
        return {
            minPlayers: response?.minPlayers,
            maxPlayers: response?.maxPlayers,
            startTime: response?.startTime,
            lateRegistrationEndTime: response?.lateRegistrationEndTime,
            totalReEntries: response?.reentryCount,
            isSatellite: TournamentUtil.getIsSatelliteFromAriesTournamentType(response?.tournamentType),
            buyInConfig: TournamentUtil.getTournamentBuyInConfigFromAriesResponse(response),
            entryConfig: TournamentUtil.getTournamentEntryConfigFromAriesResponse(response),
            stackAmount: CurrencyUtil.getAmountInRupee(response.playerInitialStack),
            tournamentSpeed: response?.tournamentSpeed,
            gameVariant: GameVariant.NLHE,
            maxNumberOfSeat: response.maxSeatsPerTable,
            tournamentType: TournamentUtil.getTournamentTypeFromAriesTournamentType(response?.tournamentType),
            breakStart: response?.breakStartTs,
            lateRegistrationDuration: response?.lateRegistrationEndTime - response?.startTime,
            entryType: response?.canReenter ? EntryType.RE_ENTRY : EntryType.FREEZE_OUT,
            satelliteTournamentList: TournamentDetails.getSatelliteTournamentListFromAriesResponse(childSattyTournament, vendorId)

            //breakEnd: response?.break_end,
            //totalBuyIns: response?.total_buy_ins,
            //totalReBuys: response?.total_re_buys,
            //totalAddOns: response?.total_add_ons,
            
        }
    }

    static getSatteliteTournamentConfigFromAriesResponse(response: AriesTournamentResponse): TournamentConfig {
        return {
            minPlayers: response?.minPlayers,
            maxPlayers: response?.maxPlayers,
            startTime: response?.startTime,
            lateRegistrationEndTime: response?.lateRegistrationEndTime,
            totalReEntries: response?.reentryCount,
            isSatellite: TournamentUtil.getIsSatelliteFromAriesTournamentType(response?.tournamentType),
            buyInConfig: TournamentUtil.getTournamentBuyInConfigFromAriesResponse(response),
            entryConfig: TournamentUtil.getTournamentEntryConfigFromAriesResponse(response),
            stackAmount: CurrencyUtil.getAmountInRupee(response.playerInitialStack),
            tournamentSpeed: response?.tournamentSpeed,
            gameVariant: GameVariant.NLHE,
            maxNumberOfSeat: response.maxSeatsPerTable,
            tournamentType: TournamentUtil.getTournamentTypeFromAriesTournamentType(response?.tournamentType),
            breakStart: response?.breakStartTs,
            lateRegistrationDuration: response?.lateRegistrationEndTime - response?.startTime,
            entryType: response?.canReenter ? EntryType.RE_ENTRY : EntryType.FREEZE_OUT
            //breakEnd: response?.break_end,
            //totalBuyIns: response?.total_buy_ins,
            //totalReBuys: response?.total_re_buys,
            //totalAddOns: response?.total_add_ons,
        }
    }

    static getTournamentPrizeDistributionDetailsFromAriesResponse(response: AriesTournamentResponse): PrizeDistributionDetailsApollo {
        return {
            prizeConfigType: TournamentUtil.getTournamentPrizeConfigFromAriesPrizeDistributionType(response?.prizeDistribution?.prizeDistributionType),
            isOverlay: TournamentUtil.getIsOverlayActiveFromAriesPrizeDistributionType(response?.prizeDistribution?.prizeDistributionType, response?.prizeDistribution?.overlayPercent),
            entriesLeft: response?.entriesRequired, //TODO fix
            primaryCurrency: TournamentUtil.getTournamentCurrencyTypeFromAriesTournamentCurrency(response?.prizeDistribution?.primaryCurrency),
            secondaryCurrency: TournamentUtil.getTournamentCurrencyTypeFromAriesTournamentCurrency(response?.prizeDistribution?.secondaryCurrency),
            totalEntriesRequired: response?.totalEntriesRequired,
            overlayPercent: response?.prizeDistribution?.overlayPercent ?? 0,
        }
    }

    static getTournamentTableListFromAriesActiveTables(activeTables: ActiveTablesResponse[]): TournamentTableList[] {
        return activeTables.map((activeTable: ActiveTablesResponse) => {
            return {
                maxStackAmount: CurrencyUtil.getAmountInRupeeRoundedToSingleDecimal(activeTable?.maxStack),
                maxStackAmountInBB: '0',
                minStackAmount: CurrencyUtil.getAmountInRupeeRoundedToSingleDecimal(activeTable?.minStack),
                minStackAmountInBB: '0',
                players: activeTable?.playerCount,
                tableId: `${activeTable?.tableId}`,
                tableNumber: `${activeTable?.tableNumber}`,
            }
        })
    }

    static getTournamentPlayerListFromAriesTournamentLeaderboardResponse(response: TournamentLeaderboardResponse): TournamentPlayerList[] {
        return response?.leaderboardRanks?.map((tournamentLeaderboardRank: TournamentLeaderboardRank) => {
            return {
                playerId: `0`,
                playerName: tournamentLeaderboardRank?.userName,
                rank: tournamentLeaderboardRank?.rank,
                stackAmount: CurrencyUtil.getAmountInRupeeRoundedToSingleDecimal(tournamentLeaderboardRank?.stackAmount),
            }
        })
    }

    static getTournamentBlindDetailsFromAriesCurrentLevel(response: AriesTournamentResponse): TournamentBlindDetails {
        const { blindLevels, currentBlindLevelId, blindLevelDuration, currentBlindLevelStartTs, currentBlindLevelPauseTs, currentBlindLevelEndTs } = response;
        const currentBlindLevel = blindLevels.find(blindLevel => blindLevel.level === currentBlindLevelId);
        const nextBlindLevel = blindLevels.find(blindLevel => blindLevel.level === currentBlindLevelId+1);
        if(!currentBlindLevel || !nextBlindLevel) return undefined;
        return {
            currentSmallBlindAmount: CurrencyUtil.getAmountInRupee(currentBlindLevel?.smallBlind),
            currentBigBlindAmount: CurrencyUtil.getAmountInRupee(currentBlindLevel?.bigBlind),
            currentAnteAmount: CurrencyUtil.getAmountInRupee(currentBlindLevel?.ante),
            currentLevel: currentBlindLevel?.level,
            currentLevelStart: currentBlindLevelStartTs ,
            currentLevelPause: currentBlindLevelPauseTs || 0,
            currentLevelEnd: currentBlindLevelEndTs || 0,
            nextSmallBlindAmount: CurrencyUtil.getAmountInRupee(nextBlindLevel?.smallBlind),
            nextBigBlindAmount: CurrencyUtil.getAmountInRupee(nextBlindLevel?.bigBlind),
            nextAnteAmount: CurrencyUtil.getAmountInRupee(nextBlindLevel?.ante),
            nextLevel: nextBlindLevel?.level,
            nextLevelStart: currentBlindLevelEndTs || 0,
        }
    }

    static getTournamentStatsFromAriesResponse(response: AriesTournamentStats): TournamentStats {
        return {
            handsPlayed: 0,
            stackMaxAmount: CurrencyUtil.getAmountInRupeeRoundedToSingleDecimal(response?.minStack),
            stackMinAmount: CurrencyUtil.getAmountInRupeeRoundedToSingleDecimal(response?.maxStack),
            stackAvgAmount: CurrencyUtil.getAmountInRupeeRoundedToSingleDecimal(response?.avgStack),
            stackMaxAmountInBB: '0',
            stackMinAmountInBB: '0',
            stackAvgAmountInBB: '0',

        }

    }

    static convertAriesResponse(resp: AriesTournamentResponse, activeTables: ActiveTablesResponse[], tournamentLeaderboard: TournamentLeaderboardResponse, vendorId: number, playerStatusResponse?: PlayerTournamentStatus, childSattyTournament?: AriesTournamentResponse[], tableId?: number): TournamentDetails {

        const tournamentDetails = new TournamentDetails();
        tournamentDetails.name = TournamentUtil.getTournamentNameFromAriesTournamentVendorMetadata(resp?.vendorMetadata, vendorId);
        tournamentDetails.tournamentStatus = TournamentUtil.getTournamentStatusFromAriesTournamentStatus(resp?.status);
        tournamentDetails.prizeList = TournamentDetails.getTournamentPrizeListFromAriesResponse(resp?.prizeStructureList);
        tournamentDetails.totalPlayers = resp?.registerCount + resp?.reentryCount; //TODO check
        tournamentDetails.remainingPlayers = resp?.remainingPlayers; //TODO
        tournamentDetails.totalPrizePool = CurrencyUtil.getAmountInRupee(resp?.prizePool);
        tournamentDetails.totalTickets = TournamentUtil.getTotalTicketsFromAriesPrizeAsset(resp?.prizeAssetType, resp?.prizeAssetCount);
        tournamentDetails.tournamentConfig = TournamentDetails.getTournamentConfigFromAriesResponse(resp, childSattyTournament?? [], vendorId);
        tournamentDetails.prizeDistributionDetails = TournamentDetails.getTournamentPrizeDistributionDetailsFromAriesResponse(resp);
        tournamentDetails.tableList = TournamentDetails.getTournamentTableListFromAriesActiveTables(activeTables);
        tournamentDetails.blindDetails = TournamentDetails.getTournamentBlindDetailsFromAriesCurrentLevel(resp);
        if (playerStatusResponse === PlayerTournamentStatus.REGISTERED) {
            tournamentDetails.playerStatus = TitanUtil.getPlayerStatusFromTournamentStatus(resp.status, tableId)
        }else {
            tournamentDetails.playerStatus = playerStatusResponse;
        }
        tournamentDetails.migratedTournament = true;
        tournamentDetails.myRank = tournamentLeaderboard?.myRank;

        tournamentDetails.playerList = TournamentDetails.getTournamentPlayerListFromAriesTournamentLeaderboardResponse(tournamentLeaderboard);
        tournamentDetails.stats = resp?.stats ? TournamentDetails.getTournamentStatsFromAriesResponse(resp?.stats) : undefined;
        tournamentDetails.totalPoints = (resp?.tournamentType === AriesTournamentType.PSL) ? 'LB POINTS' : undefined;
        //tournamentDetails.isHandForHandActive = resp?.is_hh;
        //tournamentDetails.isBreak = resp?.is_break;
        return tournamentDetails;
    }
}
