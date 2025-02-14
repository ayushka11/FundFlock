import GsServiceError from './gs-error';
import ServiceErrorUtil from '../service-error-util';
import GsErrorCode from './gs-error-codes';

class GsServiceErrorUtil extends ServiceErrorUtil {

  public static getRuntimeError(): GsServiceError {
    return GsServiceError.get(GsErrorCode.RUNTIME_ERROR);
  }

  public static getError(error: Error): GsServiceError {
    if (!(error instanceof GsServiceError)) {
      return this.getRuntimeError();
    }
    return error;
  }

  public static getCashTableRuntimeError(): GsServiceError {
    return GsServiceError.CASH_TABLE_RUNTIME_ERROR;
  }

  public static getInvalidRoomTypeError(): GsServiceError {
    return GsServiceError.INVALID_ROOM_TYPE;
  }

  public static getCashTableCommandNotAvailableError(): GsServiceError {
    return GsServiceError.CASH_TABLE_COMMAND_NOT_AVAILABLE;
  }

  public static getCashTableSeatNotFoundError(): GsServiceError {
    return GsServiceError.CASH_TABLE_SEAT_NOT_FOUND;
  }

  public static getCashTableWalletError(): GsServiceError {
    return GsServiceError.CASH_TABLE_WALLET_ERROR;
  }

  public static getCashTablePlayerPresentFromOtherDomainError(): GsServiceError {
    return GsServiceError.CASH_TABLE_PLAYER_PRESENT_FROM_OTHER_DOMAIN;
  }

  public static getCashTableSeatHasBeenReservedError(): GsServiceError {
    return GsServiceError.CASH_TABLE_SEAT_HAS_BEEN_RESERVED;
  }

  public static getCashTableUserAlreadySeatedError(): GsServiceError {
    return GsServiceError.CASH_TABLE_USER_ALREADY_SEATED;
  }

  public static getCashTableBannedPlayerError(): GsServiceError {
    return GsServiceError.CASH_TABLE_BANNED_PLAYER;
  }

  public static getCashTableIpConflictError(): GsServiceError {
    return GsServiceError.CASH_TABLE_IP_CONFLICT;
  }

  public static getCashTableTimerExpiredError(): GsServiceError {
    return GsServiceError.CASH_TABLE_TIMER_EXPIRED;
  }

  public static getCashTablePlayerNotSeatedError(): GsServiceError {
    return GsServiceError.CASH_TABLE_PLAYER_NOT_SEATED;
  }

  public static getCashTableStackMoreThanMaxBuyInError(): GsServiceError {
    return GsServiceError.CASH_TABLE_STACK_MORE_THAN_MAX_BUY_IN;
  }

  public static getCashTableInsufficientFundsError(): GsServiceError {
    return GsServiceError.CASH_TABLE_INSUFFICIENT_FUNDS;
  }

  public static getCashTablePreviousTopupIsPendingError(): GsServiceError {
    return GsServiceError.CASH_TABLE_PREVIOUS_TOP_UP_IS_PENDING;
  }

  public static getCashTablePlayerNotSitOutError(): GsServiceError {
    return GsServiceError.CASH_TABLE_PLAYER_NOT_SIT_OUT;
  }

  public static getCashTableRebuyWithoutRequestError(): GsServiceError {
    return GsServiceError.CASH_TABLE_RE_BUY_WITHOUT_REQUEST;
  }

  public static getCashTablePlayerAlreadyInWaitQueueError(): GsServiceError {
    return GsServiceError.CASH_TABLE_PLAYER_ALREADY_IN_WAIT_QUEUE;
  }

  public static getCashTablePlayerLeaveTableInProgressError(): GsServiceError {
    return GsServiceError.CASH_TABLE_PLAYER_LEAVE_TABLE_IN_PROGRESS;
  }

  public static getCashTablePlayerNotInWaitQueueError(): GsServiceError {
    return GsServiceError.CASH_TABLE_PLAYER_NOT_IN_WAIT_QUEUE;
  }

  public static getCashTablePlayerSeatingInProgressError(): GsServiceError {
    return GsServiceError.CASH_TABLE_PLAYER_SEATING_IN_PROGRESS;
  }

  public static getCashTablePlayerRebuyInProgressError(): GsServiceError {
    return GsServiceError.CASH_TABLE_PLAYER_RE_BUY_IN_PROGRESS;
  }

  public static getCashTablePlayerReserveInProgressError(): GsServiceError {
    return GsServiceError.CASH_TABLE_PLAYER_RESERVE_IN_PROGRESS;
  }

  public static getCashTableTopupInsufficientFundsError(): GsServiceError {
    return GsServiceError.CASH_TABLE_TOP_UP_INSUFFICIENT_FUNDS;
  }

  public static getCashTablePlayerRebuyNotApplicableError(): GsServiceError {
    return GsServiceError.CASH_TABLE_PLAYER_RE_BUY_NOT_APPLICABLE;
  }

  public static getCashTableTopupPlayerSitOutError(): GsServiceError {
    return GsServiceError.CASH_TABLE_TOP_UP_PLAYER_SIT_OUT;
  }

  public static getCashTableInvalidPlatformDataError(): GsServiceError {
    return GsServiceError.CASH_TABLE_INVALID_PLATFORM_DATA;
  }

  public static getCashTableJSONMarshalError(): GsServiceError {
    return GsServiceError.CASH_TABLE_JSON_MARSHAL;
  }

  public static getCashTableJSONUnMarshalError(): GsServiceError {
    return GsServiceError.CASH_TABLE_JSON_UN_MARSHAL;
  }

  public static getCashTableShutdownRequestPendingError(): GsServiceError {
    return GsServiceError.CASH_TABLE_SHUTDOWN_REQUEST_PENDING;
  }

  public static getCashTableRebootRequestPendingError(): GsServiceError {
    return GsServiceError.CASH_TABLE_REBOOT_REQUEST_PENDING;
  }

  public static getCashTableRITPopUpIsOverError(): GsServiceError {
    return GsServiceError.CASH_TABLE_RIT_POP_UP_IS_OVER;
  }

  public static getCashTableNotRITParticipantError(): GsServiceError {
    return GsServiceError.CASH_TABLE_NOT_RIT_PARTICIPANT;
  }

  public static getCashTableNoReservationError(): GsServiceError {
    return GsServiceError.CASH_TABLE_NO_RESERVATION;
  }

  public static getCashTableMaxTableLimitReachedError(): GsServiceError {
    return GsServiceError.CASH_TABLE_MAX_TABLE_LIMIT_REACHED;
  }

  public static getCashTableSystemUpgradeError(): GsServiceError {
    return GsServiceError.CASH_TABLE_SYSTEM_UPGRADE;
  }

  public static getHallwayRuntimeError(): GsServiceError {
    return GsServiceError.HALLWAY_RUNTIME_ERROR;
  }

  public static getHallwayCommunicationError(): GsServiceError {
    return GsServiceError.HALLWAY_COMMUNICATION_ERROR;
  }

  public static getHallwayRoomNotAvailableError(): GsServiceError {
    return GsServiceError.HALLWAY_ROOM_NOT_AVAILABLE;
  }

  public static getHallwayWalletError(): GsServiceError {
    return GsServiceError.HALLWAY_WALLET_ERROR;
  }

  public static getHallwayNoTableAvailableError(): GsServiceError {
    return GsServiceError.HALLWAY_NO_TABLE_AVAILABLE;
  }

  public static getHallwayBannedPlayerError(): GsServiceError {
    return GsServiceError.HALLWAY_BANNED_PLAYER;
  }

  public static getHallwayAlreadyJoinedPCTError(): GsServiceError {
    return GsServiceError.HALLWAY_ALREADY_JOINED_PCT;
  }

  public static getHallwayInvalidPINError(): GsServiceError {
    return GsServiceError.HALLWAY_INVALID_PIN;
  }

  public static getHallwayInternalServerError(): GsServiceError {
    return GsServiceError.HALLWAY_INTERNAL_SERVER_ERROR;
  }

  public static getHallwayNonExistingPCTError(): GsServiceError {
    return GsServiceError.HALLWAY_NON_EXISTING_PCT;
  }

  public static getHallwayRunExistingPCTError(): GsServiceError {
    return GsServiceError.HALLWAY_RUN_EXISTING_PCT;
  }

  public static getHallwayTableNotUnlockedError(): GsServiceError {
    return GsServiceError.HALLWAY_TABLE_NOT_UNLOCKED;
  }

  public static getHallwayMaxTableReachedError(): GsServiceError {
    return GsServiceError.HALLWAY_MAX_TABLE_REACHED;
  }

  static getTournamentDoesNotExistError(): GsServiceError {
    return GsServiceError.TOURNAMENT_DOES_NOT_EXIST;
  }

  static getTournamentRunTimeError(): GsServiceError {
    return GsServiceError.TOURNAMENT_RUN_TIME_ERROR;
  }

  static getTournamentCommandNotAvailableError(): GsServiceError {
    return GsServiceError.TOURNAMENT_COMMAND_NOT_AVAILABLE;
  }

  static getTournamentUserAlreadyRegisteredError(): GsServiceError {
    return GsServiceError.TOURNAMENT_USER_ALREADY_REGISTERED;
  }

  static getTournamentRegistrationMaxLimitReachedError(): GsServiceError {
    return GsServiceError.TOURNAMENT_REGISTRATION_MAX_LIMIT_REACHED;
  }

  static getTournamentPlayerRegistrationMaxLimitReachedError(): GsServiceError {
    return GsServiceError.TOURNAMENT_PLAYER_REGISTRATION_MAX_LIMIT_REACHED;
  }

  static getTournamentNotInRegistrationStateError(): GsServiceError {
    return GsServiceError.TOURNAMENT_NOT_IN_REGISTRATION_STATE;
  }

  static getTournamentNotRegisteredError(): GsServiceError {
    return GsServiceError.TOURNAMENT_NOT_REGISTERED;
  }

  static getTournamentCannotCancelInCurrentStateError(): GsServiceError {
    return GsServiceError.TOURNAMENT_CANNOT_CANCEL_IN_CURRENT_STATE;
  }

  static getTournamentAlreadyAbortedError(): GsServiceError {
    return GsServiceError.TOURNAMENT_ALREADY_ABORTED;
  }

  static getTournamentCannotAbortInCurrentStateError(): GsServiceError {
    return GsServiceError.TOURNAMENT_CANNOT_ABORT_IN_CURRENT_STATE;
  }

  static getTournamentUserNotLoggedInError(): GsServiceError {
    return GsServiceError.TOURNAMENT_USER_NOT_LOGGED_IN;
  }

  static getTournamentUserNotValidError(): GsServiceError {
    return GsServiceError.TOURNAMENT_USER_NOT_VALID;
  }

  static getTournamentUserInMttFromOtherDomainError(): GsServiceError {
    return GsServiceError.TOURNAMENT_USER_IN_MTT_FROM_OTHER_DOMAIN;
  }

  static getTournamentReBuyAlreadyInitiatedError(): GsServiceError {
    return GsServiceError.TOURNAMENT_REBUY_ALREADY_INITIATED;
  }

  static getTournamentStackMoreThanMinAllowedError(): GsServiceError {
    return GsServiceError.TOURNAMENT_STACK_MORE_THAN_MIN_ALLOWED;
  }

  static getTournamentReBuyLimitExceededError(): GsServiceError {
    return GsServiceError.TOURNAMENT_REBUY_LIMIT_EXCEEDED;
  }

  static getTournamentReBuyTimeIsOverError(): GsServiceError {
    return GsServiceError.TOURNAMENT_REBUY_TIME_IS_OVER;
  }

  static getTournamentReBuyIsNotAllowedError(): GsServiceError {
    return GsServiceError.TOURNAMENT_REBUY_IS_NOT_ALLOWED;
  }

  static getTournamentSeatNotFoundError(): GsServiceError {
    return GsServiceError.TOURNAMENT_SEAT_NOT_FOUND;
  }

  static getTournamentPlayerNotSeatedError(): GsServiceError {
    return GsServiceError.TOURNAMENT_PLAYER_NOT_SEATED;
  }

  static getTournamentStackIsNonZeroError(): GsServiceError {
    return GsServiceError.TOURNAMENT_STACK_IS_NON_ZERO;
  }

  static getTournamentHandIsRunningError(): GsServiceError {
    return GsServiceError.TOURNAMENT_HAND_IS_RUNNING;
  }

  static getTournamentAddonAlreadyDoneError(): GsServiceError {
    return GsServiceError.TOURNAMENT_ADDON_ALREADY_DONE;
  }

  static getTournamentAddonNotAllowedError(): GsServiceError {
    return GsServiceError.TOURNAMENT_ADDON_NOT_ALLOWED;
  }

  static getTournamentAlreadySittingOutError(): GsServiceError {
    return GsServiceError.TOURNAMENT_ALREADY_SITTING_OUT;
  }

  static getTournamentEmptySeatError(): GsServiceError {
    return GsServiceError.TOURNAMENT_EMPTY_SEAT;
  }

  static getTournamentWalletError(): GsServiceError {
    return GsServiceError.TOURNAMENT_WALLET_ERROR;
  }

  static getTournamentInsufficientFundError(): GsServiceError {
    return GsServiceError.TOURNAMENT_INSUFFICIENT_FUND;
  }

  static getTournamentTicketNotValidError(): GsServiceError {
    return GsServiceError.TOURNAMENT_TICKET_NOT_VALID;
  }

  static getTournamentUserIsBannedError(): GsServiceError {
    return GsServiceError.TOURNAMENT_USER_IS_BANNED;
  }

  static getTournamentMSPNotFoundError(): GsServiceError {
    return GsServiceError.TOURNAMENT_MSP_NOT_FOUND;
  }

  static getTournamentMFPMismatchError(): GsServiceError {
    return GsServiceError.TOURNAMENT_MFP_MISMATCH;
  }

  static getTournamentMFPPlayerRegistrationNotPossibleError(): GsServiceError {
    return GsServiceError.TOURNAMENT_MFP_PLAYER_REGISTRATION_NOT_POSSIBLE;
  }

  static getTournamentMFPPlayerCannotUnRegisterError(): GsServiceError {
    return GsServiceError.TOURNAMENT_MFP_PLAYER_CANNOT_UNREGISTER;
  }

  static getTournamentUpdateNotPossibleError(): GsServiceError {
    return GsServiceError.TOURNAMENT_UPDATE_NOT_POSSIBLE;
  }

  static getTournamentTableInvalidParamError(): GsServiceError {
    return GsServiceError.TOURNAMENT_TABLE_INVALID_PARAM;
  }

  static getTournamentUserIsNotPresentInTournamentListingError(): GsServiceError {
    return GsServiceError.TOURNAMENT_USER_IS_NOT_PRESENT_IN_TOURNAMENT_LISTING;
  }

  static getTournamentInvalidConnectionModeError(): GsServiceError {
    return GsServiceError.TOURNAMENT_INVALID_CONNECTION_MODE;
  }

  static getTournamentSatelliteWinnerCannotUnRegisterError(): GsServiceError {
    return GsServiceError.TOURNAMENT_SATELLITE_WINNER_CANNOT_UNREGISTER;
  }

  static getTournamentMaxTableLimitReachedError(): GsServiceError {
    return GsServiceError.TOURNAMENT_MAX_TABLE_LIMIT_REACHED;
  }

  public static getMissingFingerprintError(): GsServiceError {
    return GsServiceError.MISSING_FINGERPRINT;
  }

  public static getBadFingerprintError(): GsServiceError {
    return GsServiceError.BAD_FINGERPRINT;
  }

  public static getBadRouteError(): GsServiceError {
    return GsServiceError.BAD_ROUTE;
  }

  public static getExpiredFingerprintError(): GsServiceError {
    return GsServiceError.EXPIRED_FINGERPRINT;
  }

  public static getInvalidFingerprintError(): GsServiceError {
    return GsServiceError.INVALID_FINGERPRINT;
  }

  public static getGsCommonError(): GsServiceError {
    return GsServiceError.ERROR;
  }

  public static getURLNotFound(): GsServiceError {
    return GsServiceError.URL_NOT_FOUND;
  }

  public static wrapError(error: any): GsServiceError {
    return GsServiceError.get({
      name: error.name,
      code: error.code,
      message: error.message,
      type: `GsService:${error.type}`,
    })
  }
}

export default GsServiceErrorUtil;
