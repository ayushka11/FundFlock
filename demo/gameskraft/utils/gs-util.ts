import {Room} from "../models/room";
import {RoomResponse as GsRoomResponse} from "../models/game-server/room-response";
import {GsGameVariant} from "../models/enums/gs-game-variant";
import {GameVariant} from "../models/enums/game-variant";
import {CashPopupKeyValue, PrimaryWalletData} from "../models/game-server/reserve-room";
import {TableDetails, Wallet} from "../models/reserve-room";
import {
    TournamentBlindStructure as GsTournamentBlindStructure,
    TournamentBlindStructureResp
} from "../models/game-server/tournament-blind-structure";
import {TournamentBlindStructure} from "../models/tournament-blind-structure";
import {TournamentResponse, TournamentResponseV3} from "../models/game-server/mtt-list";
import {Tournament} from "../models/tournament";
import {TableResponse} from "../models/game-server/TableResponse";
import {Table} from "../models/cash-table";
import {GsPrizeConfigType} from "../models/enums/gs-prize-config-type";
import {PrizeConfigType} from "../models/enums/tournament/prize-config-type";
import {GsTournamentCurrencyType} from "../models/enums/gs-tournament-currency-type";
import {TournamentCurrencyType} from "../models/enums/tournament/tournament-currency-type";
import {PlayerTournamentData} from "../models/player-mtt-list";
import {PlayerTournamentStatus} from "../models/enums/tournament/player-tournament-status";
import {IAmountData} from "../models/amount-data";
import AmountUtil from "./amount-util";
import {CURRENCY, TournamentSeat} from "../constants/constants";
import {TournamentUtil} from "./tournament-util";
import {EntryType} from "../models/enums/tournament/entry-type";

export default class GsUtil {

    static getGameVariant(variantName: string): number {
        switch (variantName) {
            case GsGameVariant.NLHE:
                return GameVariant.NLHE
            case GsGameVariant.PLO:
                return GameVariant.PLO4
            case GsGameVariant.PLO5:
                return GameVariant.PLO5
            default:
                return -1;
        }
    }

    static getTournamentPrizeConfig(prizeConfigType: GsPrizeConfigType): PrizeConfigType {
        switch (prizeConfigType) {
            case GsPrizeConfigType.OVERLAY:
                return PrizeConfigType.OVERLAY
            case GsPrizeConfigType.FIXED:
                return PrizeConfigType.FIXED
            default:
                return PrizeConfigType.FIXED
        }
    }

    static getTournamentCurrencyType(currencyType: string): number {
        switch (currencyType) {
            case GsTournamentCurrencyType.WS:
                return TournamentCurrencyType.WS
            case GsTournamentCurrencyType.TDC:
                return TournamentCurrencyType.TDC
            case GsTournamentCurrencyType.DC:
                return TournamentCurrencyType.DC
            default:
                return
        }
    }

    static convertRoomResponse(roomResponse: Array<GsRoomResponse> = []): Room[] {
        return roomResponse.filter(rooms => rooms).map((gsRoomResponse: GsRoomResponse) => {
            const room: Room = Room.getRoomFromGsRoomResponse(gsRoomResponse);
            return room;
        })
    }

    static getWalletBalanceDetails(data: CashPopupKeyValue): Wallet {
        let wallet: Wallet = {};
        if (data?.primary) {
            const primaryWalletData: PrimaryWalletData = data?.primary
            wallet.deposit = primaryWalletData?.deposit;
            wallet.real = primaryWalletData?.total_real;
            wallet.total = primaryWalletData?.total;
            wallet.winning = primaryWalletData?.winning;
        }
        if (data?.pw_real) {
            wallet.real = data?.pw_real;
        }
        return wallet;
    }

    static getTableDetailsFromResponse(roomResponse: any): TableDetails {
        let tableDetails: TableDetails = {}
        if (roomResponse?.min) {
            tableDetails.minBuyInAmount = roomResponse?.min
        }
        if (roomResponse?.max) {
            tableDetails.maxBuyInAmount = roomResponse?.max
        }
        if (roomResponse?.timer) {
            tableDetails.timerDuration = roomResponse?.timer
        }
        if (roomResponse?.antiBankingTime >= 0) {
            tableDetails.antiBankingDuration = roomResponse?.antiBankingTime
        }
        return tableDetails;
    }

    static getTableFromResponse(tables: TableResponse[] = []): Table[] {
        return tables.map((table: TableResponse) => {
            return Table.convertGsResponse(table)
        })
    }

    static getTournamentBlindStructure(resp: TournamentBlindStructureResp = []): TournamentBlindStructure[] {
        return resp.map((tournamentBlindStructure: GsTournamentBlindStructure) => {
            return TournamentBlindStructure.convertGsResponse(tournamentBlindStructure)
        })

    }

    static getTournaments(resp: TournamentResponse[] = []): Tournament[] {
        return resp.map((tournament: TournamentResponse) => Tournament.convertGsResponse(tournament))
    }

    static getTournamentsV2(resp: TournamentResponse[] = []): Tournament[] {
        return resp.map((tournament: TournamentResponse) => Tournament.convertGsResponseV2(tournament))
    }

    static getPlayerStatus(gsPlayerStatusResps: Array<PlayerTournamentData>, tournamentId: string): PlayerTournamentStatus {
        let playerStatus: PlayerTournamentStatus  = PlayerTournamentStatus.NOT_REGISTERED
        gsPlayerStatusResps.forEach(playerStatusResp => {
            if (playerStatusResp.tournamentId == tournamentId) playerStatus = playerStatusResp.playerStatus
        })
        return playerStatus;
    }


    static getPlayerStatusV3(gsPlayerStatusResps: Array<PlayerTournamentData>, tournamentId: string): PlayerTournamentStatus {
        let playerStatus: PlayerTournamentStatus  = PlayerTournamentStatus.NOT_REGISTERED
        gsPlayerStatusResps.forEach(playerStatusResp => {
            if (playerStatusResp.tournamentId == tournamentId) playerStatus = this.convertPlayerStatusResponse(playerStatusResp.playerStatus)
        })
        return playerStatus;
    }

    static convertPlayerStatusResponse(playerStatus: PlayerTournamentStatus): PlayerTournamentStatus {
        switch (playerStatus) {
            case PlayerTournamentStatus.PLAYING:
                return PlayerTournamentStatus.REGISTERED
            case PlayerTournamentStatus.REGISTERED:
                return PlayerTournamentStatus.REGISTERED
            case PlayerTournamentStatus.BUSTED:
                return PlayerTournamentStatus.NOT_REGISTERED
            case PlayerTournamentStatus.FINISHED:
                return PlayerTournamentStatus.NOT_REGISTERED
            case PlayerTournamentStatus.COMPLETED:
                return PlayerTournamentStatus.NOT_REGISTERED
            case PlayerTournamentStatus.NOT_REGISTERED:
                return PlayerTournamentStatus.NOT_REGISTERED
            default:
                return PlayerTournamentStatus.NOT_REGISTERED
        }
    }


    static  convertFeaturedTournamentResponse(featuredMtt: TournamentResponse[], isMigratedTournament: boolean): TournamentResponseV3[] {
        return featuredMtt.map((tournamentResponse: TournamentResponse) => {
            return {
                id: tournamentResponse.id,
                name: tournamentResponse.nm,
                registrationStartTime: tournamentResponse.rt,
                startTime: tournamentResponse.st,
                lateRegistrationEndTime: tournamentResponse.st + (tournamentResponse.ld),
                registerAmount: tournamentResponse.bi,
                prizePool: GsUtil.getPrizePool(tournamentResponse),
                tournamentStatus: TournamentUtil.getTournamentStatusFromGsResponse(tournamentResponse.sa),
                activePlayers: tournamentResponse.pc,
                migratedTournament: isMigratedTournament,
                gameVariant: GsUtil.getGameVariant(tournamentResponse.gt),
                maxNumberOfSeat: tournamentResponse.se,
                canReenter: (TournamentUtil.getEntryTypeFromGsResponse(tournamentResponse.en) == EntryType.RE_ENTRY),
                tournamentVariant: TournamentUtil.getEntryTypeFromGsResponse(tournamentResponse.en),
                tournamentType: TournamentUtil.getTournamentTypeFromGsResponse(tournamentResponse.ty),
            }
        })
    }

    static getPrizePool(tournamentResponse: TournamentResponse): IAmountData {
        const primaryCurrency: TournamentCurrencyType = GsUtil.getTournamentCurrencyType(tournamentResponse?.primaryCurrency);
        if (tournamentResponse.is){
            return {
                text: `${tournamentResponse?.tt} ${TournamentSeat.SEATS}`,
                currency: CURRENCY.SEATS,
                value: tournamentResponse?.tt || 0,
            }
        }
        return AmountUtil.getAmountWithTournamentCurrency(tournamentResponse?.pp, primaryCurrency, tournamentResponse?.isOverlayActive);
    }
}