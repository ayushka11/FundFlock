import {CURRENCY, TournamentSeat} from '../constants/constants';
import {IAmountData} from '../models/amount-data';
import {EntryType} from '../models/enums/tournament/entry-type';
import {PlayerTournamentStatus} from '../models/enums/tournament/player-tournament-status';
import {TournamentCurrencyType} from '../models/enums/tournament/tournament-currency-type';
import {TournamentStatus} from '../models/enums/tournament/tournament-status';
import {TournamentResponseV3} from '../models/game-server/mtt-list';
import {PlayerMTTList, PlayerTournamentData} from '../models/player-mtt-list';
import {PlayerTournamentRegisterRequest} from '../models/request/player-tournament-register-request';
import {Tournament} from '../models/tournament';
import {TournamentBlindStructure} from '../models/tournament-blind-structure';
import AriesBlindLevel from '../models/tournament/blind-level';
import TournamentCurrency from '../models/tournament/enums/tournament-currency';
import TournamentStatusAries from '../models/tournament/enums/tournament-status-aries';
import AriesTournamentType from '../models/tournament/enums/aries-tournament-type';
import TitanTournamentEntryRequest, {
    UserIdsDetailsForFraudChecks
} from '../models/tournament/request/tournament-entry-request';
import TournamentPlayerStatusResponse, {
    UserTournamentTableDetails
} from '../models/tournament/response/tournament-player-status-response';
import AriesTournamentResponse from '../models/tournament/response/tournament-response';
import TitanTournamentResponse from '../models/tournament/response/tournament-response';
import AmountUtil from './amount-util';
import AriesUtil from './aries-util';
import {TournamentUtil} from './tournament-util';

export default class TitanUtil {

    static filterTournamentsByVendor(tournamentResponse: Array<TitanTournamentResponse> = [], vendorId: number): Array<TitanTournamentResponse> {
        return tournamentResponse.filter(tournament => {
            return tournament.vendorMetadata.some(tournamentVendorNameMapping => tournamentVendorNameMapping.vendorId === vendorId);
        });
    }

    static convertTournamentResponse(tournamentResponse: Array<AriesTournamentResponse> = [], vendorId: number): Tournament[] {
        return tournamentResponse.filter(tournament => tournament).map((ariesTournamentResponse: AriesTournamentResponse) => {
            const tournament: Tournament = Tournament.getTournamentFromAriesResponse(ariesTournamentResponse, vendorId);
            return tournament;
        })
    }

    static convertFeaturedTournamentResponse(tournamentResponse: Array<AriesTournamentResponse> = [], vendorId: number, isMigratedTournament: boolean): TournamentResponseV3[] {
        return tournamentResponse.filter(tournament => (
            tournament.feature.isFeatured && (
            tournament.status === TournamentStatusAries.LATE_REGISTRATION ||
            tournament.status === TournamentStatusAries.REGISTRATION))).map((ariesTournamentResponse: AriesTournamentResponse) => {
            return {
                id: ariesTournamentResponse.id.toString(),
                registrationStartTime: ariesTournamentResponse.registrationStartTime,
                startTime: ariesTournamentResponse.startTime,
                lateRegistrationEndTime: ariesTournamentResponse.lateRegistrationEndTime,
                name: TournamentUtil.getTournamentNameFromAriesTournamentVendorMetadata(ariesTournamentResponse.vendorMetadata, vendorId),
                registerAmount: ariesTournamentResponse.registrationAmount,
                prizePool: TitanUtil.getPrizePool(ariesTournamentResponse),
                tournamentStatus: TitanUtil.getTournamentStatusResponse(ariesTournamentResponse.status),
                activePlayers: ariesTournamentResponse.remainingPlayers,
                migratedTournament: isMigratedTournament,
                gameVariant: AriesUtil.getGameVariant(ariesTournamentResponse?.gameVariant),
                tournamentType: TournamentUtil.getTournamentTypeFromAriesTournamentType(ariesTournamentResponse?.tournamentType),
                maxNumberOfSeat: ariesTournamentResponse?.maxSeatsPerTable,
                tournamentVariant: (ariesTournamentResponse.canReenter) ? EntryType.RE_ENTRY : EntryType.FREEZE_OUT,
                canReenter: !!ariesTournamentResponse.canReenter
            };
        })
    }

    static extractIdsFromTournaments(tournaments: Array<AriesTournamentResponse> = []): number[] {
        return tournaments.map(tournament => tournament?.id);
    }

  static getPlayerStatusFromTournamentStatus(tournamentStatus: TournamentStatusAries, tableId?: number): PlayerTournamentStatus {
    switch (tournamentStatus) {
      case TournamentStatusAries.CREATED:
      case TournamentStatusAries.ANNOUNCED:
      case TournamentStatusAries.REGISTRATION:
        return PlayerTournamentStatus.REGISTERED;
      case TournamentStatusAries.SEAT_ALLOCATION:
        if (!tableId){
            return PlayerTournamentStatus.ALLOCATING_SEATS;
        }
        return PlayerTournamentStatus.REGISTERED;
      case TournamentStatusAries.LATE_REGISTRATION:
        if (!tableId){
          return PlayerTournamentStatus.ALLOCATING_SEATS;
        }
        return PlayerTournamentStatus.REGISTERED;
      case TournamentStatusAries.RUNNING:
        return PlayerTournamentStatus.REGISTERED;
      case TournamentStatusAries.COMPLETED:
        return PlayerTournamentStatus.NOT_REGISTERED;
      case TournamentStatusAries.CANCEL_PENDING:
      case TournamentStatusAries.ABORT_PENDING:
      case TournamentStatusAries.CANCELED:
      case TournamentStatusAries.ABORTED:
        return PlayerTournamentStatus.NOT_REGISTERED;
      default:
        return;
    }
  }

  static convertPlayerMTTListResponse(tournaments: Array<AriesTournamentResponse> = [], tournamentPlayerStatusResponse: TournamentPlayerStatusResponse, userTournamentTableDetails: Array<UserTournamentTableDetails>): PlayerMTTList {
    //Iterate on player's registered tournaments and build openedList
    const openedList: Array<PlayerTournamentData> = tournamentPlayerStatusResponse?.registeredTournaments?.map((registeredTournamentId)=>{
      const tournamentId = registeredTournamentId.toString()
      const tournamentStatus: TournamentStatusAries = tournaments?.find(tournament => tournament.id === registeredTournamentId)?.status;
      const tableId: number | undefined = userTournamentTableDetails?.find(userTournamentTableDetail => userTournamentTableDetail.tournamentId === registeredTournamentId)?.tableId;
      const playerStatus = TitanUtil.getPlayerStatusFromTournamentStatus(tournamentStatus, tableId)

            return {
                tournamentId,
                playerStatus
            }
        })
        return {
            openedList,
            viewingList: []
        }
    }

    static checkTournamentInCache(tournamentResponse: Array<AriesTournamentResponse> = [], tournamentId: number): boolean {
        let isTournamentInCache: boolean = false
        tournamentResponse.forEach(tournament => {
            if (tournament.id == tournamentId) isTournamentInCache = true
        })
        return isTournamentInCache
    }

    static getTournamentEntryRequest(tournamentId: number, playerTournamentRegisterRequest: PlayerTournamentRegisterRequest, id: number, vendorId: number, userName: string, gstStateCode: number, otherVendorUsers: Array<UserIdsDetailsForFraudChecks>): TitanTournamentEntryRequest {
        const ticketId = Number(playerTournamentRegisterRequest?.ticketId)
        const buyInMethod = TournamentUtil.getAriesBuyInMethodFromGSEntryMethod(playerTournamentRegisterRequest?.entry_method)
        return {
            tournamentId,
            user: {
                id,
                vendorId,
                userName
            },
            refId: playerTournamentRegisterRequest?.seatPackId,
            buyInMethod,
            meta: playerTournamentRegisterRequest?.meta,
            ticketId,
            gstStateCode,
            otherVendorUsers
        }
    }

    static getTournamentBlindStructureFromAriesResponse(blindLevels: AriesBlindLevel[] = [], blindLevelDuration: number): TournamentBlindStructure[] {
        return blindLevels.map((blindLevel) => {
            return TournamentBlindStructure.convertAriesResponse(blindLevel, blindLevelDuration)
        })
    }

    static getTournamentStatusResponse(status: TournamentStatusAries) {
        switch (status) {
            case TournamentStatusAries.ANNOUNCED:
                return TournamentStatus.ANNOUNCED
            case TournamentStatusAries.REGISTRATION:
                return TournamentStatus.REGISTERING
            case TournamentStatusAries.LATE_REGISTRATION:
                return TournamentStatus.LATE_REGISTRATION
            case TournamentStatusAries.RUNNING:
                return TournamentStatus.RUNNING
            case TournamentStatusAries.COMPLETED:
                return TournamentStatus.COMPLETED
            case TournamentStatusAries.CANCEL_PENDING:
                return TournamentStatus.COMPLETED
            case TournamentStatusAries.CANCELED:
                return TournamentStatus.CANCELLED
            case TournamentStatusAries.ABORT_PENDING:
                return TournamentStatus.ABORTED
            case TournamentStatusAries.ABORTED:
                return TournamentStatus.ABORTED
        }

    }

    private static getPrizePool(tournamentResponse: AriesTournamentResponse): IAmountData {
        const isOverlay: boolean = (tournamentResponse?.prizeDistribution?.overlayPercent != 100.00);
        let currency: TournamentCurrencyType;
        switch (tournamentResponse?.prizeDistribution?.primaryCurrency) {
            case TournamentCurrency.DISCOUNT_CREDIT:
                currency = TournamentCurrencyType.DC
                break;
            case TournamentCurrency.WINNING_SEGMENT:
                currency = TournamentCurrencyType.WS;
                break;
            case TournamentCurrency.TOURNAMENT_DISCOUNT_CREDIT:
                currency = TournamentCurrencyType.TDC;
                break;
        }
        if (tournamentResponse.tournamentType === AriesTournamentType.SATELLITE) {
            return {
                text: `${tournamentResponse?.prizeAssetCount} ${TournamentSeat.SEATS}`,
                currency: CURRENCY.SEATS,
                value: tournamentResponse?.prizeAssetCount,
            }
        }
        return AmountUtil.getAmountWithTournamentCurrency(tournamentResponse?.prizePool, currency, isOverlay)
    }
}
