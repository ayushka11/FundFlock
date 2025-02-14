import ServiceError from "../service-error";
import GsErrorCodes from "./gs-error-codes";

class GsServiceError extends ServiceError {
	// CASHTABLE ERRORS
	static readonly CASH_TABLE_RUNTIME_ERROR = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_RUNTIME_ERROR,
	);

	static readonly INVALID_ROOM_TYPE = GsServiceError.get(
		GsErrorCodes.INVALID_ROOM_TYPE,
	);

	static readonly CASH_TABLE_COMMAND_NOT_AVAILABLE = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_COMMAND_NOT_AVAILABLE,
	);

	static readonly CASH_TABLE_SEAT_NOT_FOUND = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_SEAT_NOT_FOUND,
	);

	static readonly CASH_TABLE_WALLET_ERROR = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_WALLET_ERROR,
	);

	static readonly CASH_TABLE_SYSTEM_UPGRADE = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_SYSTEM_UPGRADE,
	);

	static readonly CASH_TABLE_PLAYER_PRESENT_FROM_OTHER_DOMAIN = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_PLAYER_PRESENT_FROM_OTHER_DOMAIN,
	);

	static readonly CASH_TABLE_SEAT_HAS_BEEN_RESERVED = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_SEAT_HAS_BEEN_RESERVED,
	);

	static readonly CASH_TABLE_USER_ALREADY_SEATED = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_USER_ALREADY_SEATED,
	);

	static readonly CASH_TABLE_BANNED_PLAYER = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_BANNED_PLAYER,
	);

	static readonly CASH_TABLE_IP_CONFLICT = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_IP_CONFLICT,
	);

	static readonly CASH_TABLE_TIMER_EXPIRED = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_TIMER_EXPIRED,
	);

	static readonly CASH_TABLE_PLAYER_NOT_SEATED = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_PLAYER_NOT_SEATED,
	);

	static readonly CASH_TABLE_STACK_MORE_THAN_MAX_BUY_IN = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_STACK_MORE_THAN_MAX_BUY_IN,
	);

	static readonly CASH_TABLE_INSUFFICIENT_FUNDS = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_INSUFFICIENT_FUNDS,
	);

	static readonly CASH_TABLE_PREVIOUS_TOP_UP_IS_PENDING = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_PREVIOUS_TOP_UP_IS_PENDING,
	);

	static readonly CASH_TABLE_PLAYER_NOT_SIT_OUT = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_PLAYER_NOT_SIT_OUT,
	);

	static readonly CASH_TABLE_RE_BUY_WITHOUT_REQUEST = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_RE_BUY_WITHOUT_REQUEST,
	);

	static readonly CASH_TABLE_PLAYER_ALREADY_IN_WAIT_QUEUE = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_PLAYER_ALREADY_IN_WAIT_QUEUE,
	);

	static readonly CASH_TABLE_PLAYER_LEAVE_TABLE_IN_PROGRESS = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_PLAYER_LEAVE_TABLE_IN_PROGRESS,
	);

	static readonly CASH_TABLE_PLAYER_NOT_IN_WAIT_QUEUE = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_PLAYER_NOT_IN_WAIT_QUEUE,
	);

	static readonly CASH_TABLE_PLAYER_SEATING_IN_PROGRESS = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_PLAYER_SEATING_IN_PROGRESS,
	);

	static readonly CASH_TABLE_PLAYER_RE_BUY_IN_PROGRESS = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_PLAYER_RE_BUY_IN_PROGRESS,
	);

	static readonly CASH_TABLE_PLAYER_RESERVE_IN_PROGRESS = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_PLAYER_RESERVE_IN_PROGRESS,
	);

	static readonly CASH_TABLE_TOP_UP_INSUFFICIENT_FUNDS = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_TOP_UP_INSUFFICIENT_FUNDS,
	);

	static readonly CASH_TABLE_PLAYER_RE_BUY_NOT_APPLICABLE = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_PLAYER_RE_BUY_NOT_APPLICABLE,
	);

	static readonly CASH_TABLE_TOP_UP_PLAYER_SIT_OUT = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_TOP_UP_PLAYER_SIT_OUT,
	);

	static readonly CASH_TABLE_INVALID_PLATFORM_DATA = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_INVALID_PLATFORM_DATA,
	);

	static readonly CASH_TABLE_JSON_MARSHAL = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_JSON_MARSHAL,
	);

	static readonly CASH_TABLE_JSON_UN_MARSHAL = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_JSON_UN_MARSHAL,
	);

	static readonly CASH_TABLE_SHUTDOWN_REQUEST_PENDING = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_SHUTDOWN_REQUEST_PENDING,
	);

	static readonly CASH_TABLE_REBOOT_REQUEST_PENDING = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_REBOOT_REQUEST_PENDING,
	);

	static readonly CASH_TABLE_RIT_POP_UP_IS_OVER = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_RIT_POP_UP_IS_OVER,
	);

	static readonly CASH_TABLE_NOT_RIT_PARTICIPANT = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_NOT_RIT_PARTICIPANT,
	);

	static readonly CASH_TABLE_NO_RESERVATION = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_NO_RESERVATION,
	);

	static readonly CASH_TABLE_MAX_TABLE_LIMIT_REACHED = GsServiceError.get(
		GsErrorCodes.CASH_TABLE_MAX_TABLE_LIMIT_REACHED,
	);
	//HALLWAY ERROR

	static readonly HALLWAY_RUNTIME_ERROR = GsServiceError.get(
		GsErrorCodes.HALLWAY_RUNTIME_ERROR,
	);

	static readonly HALLWAY_COMMUNICATION_ERROR = GsServiceError.get(
		GsErrorCodes.HALLWAY_COMMUNICATION_ERROR,
	);

	static readonly HALLWAY_ROOM_NOT_AVAILABLE = GsServiceError.get(
		GsErrorCodes.HALLWAY_ROOM_NOT_AVAILABLE,
	);

	static readonly HALLWAY_WALLET_ERROR = GsServiceError.get(
		GsErrorCodes.HALLWAY_WALLET_ERROR,
	);

	static readonly HALLWAY_NO_TABLE_AVAILABLE = GsServiceError.get(
		GsErrorCodes.HALLWAY_NO_TABLE_AVAILABLE,
	);

	static readonly HALLWAY_BANNED_PLAYER = GsServiceError.get(
		GsErrorCodes.HALLWAY_BANNED_PLAYER,
	);

	static readonly HALLWAY_ALREADY_JOINED_PCT = GsServiceError.get(
		GsErrorCodes.HALLWAY_ALREADY_JOINED_PCT,
	);

	static readonly HALLWAY_INVALID_PIN = GsServiceError.get(
		GsErrorCodes.HALLWAY_INVALID_PIN,
	);

	static readonly HALLWAY_INTERNAL_SERVER_ERROR = GsServiceError.get(
		GsErrorCodes.HALLWAY_INTERNAL_SERVER_ERROR,
	);

	static readonly HALLWAY_NON_EXISTING_PCT = GsServiceError.get(
		GsErrorCodes.HALLWAY_NON_EXISTING_PCT,
	);

	static readonly HALLWAY_RUN_EXISTING_PCT = GsServiceError.get(
		GsErrorCodes.HALLWAY_RUN_EXISTING_PCT,
	);

	static readonly HALLWAY_TABLE_NOT_UNLOCKED = GsServiceError.get(
		GsErrorCodes.HALLWAY_TABLE_NOT_UNLOCKED,
	);

	static readonly HALLWAY_MAX_TABLE_REACHED = GsServiceError.get(
		GsErrorCodes.HALLWAY_MAX_TABLE_REACHED,
	);

	static readonly TOURNAMENT_RUN_TIME_ERROR = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_RUN_TIME_ERROR,
	);

	static readonly TOURNAMENT_DOES_NOT_EXIST = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_DOES_NOT_EXIST,
	);

	static readonly TOURNAMENT_COMMAND_NOT_AVAILABLE = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_COMMAND_NOT_AVAILABLE,
	);

	static readonly TOURNAMENT_USER_ALREADY_REGISTERED = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_USER_ALREADY_REGISTERED,
	);

	static readonly TOURNAMENT_REGISTRATION_MAX_LIMIT_REACHED = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_REGISTRATION_MAX_LIMIT_REACHED,
	);

	static readonly TOURNAMENT_PLAYER_REGISTRATION_MAX_LIMIT_REACHED = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_PLAYER_REGISTRATION_MAX_LIMIT_REACHED,
	);

	static readonly TOURNAMENT_NOT_IN_REGISTRATION_STATE = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_NOT_IN_REGISTRATION_STATE,
	);

	static readonly TOURNAMENT_NOT_REGISTERED = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_NOT_REGISTERED,
	);

	static readonly TOURNAMENT_CANNOT_CANCEL_IN_CURRENT_STATE = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_CANNOT_CANCEL_IN_CURRENT_STATE,
	);

	static readonly TOURNAMENT_ALREADY_ABORTED = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_ALREADY_ABORTED,
	);

	static readonly TOURNAMENT_CANNOT_ABORT_IN_CURRENT_STATE = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_CANNOT_ABORT_IN_CURRENT_STATE,
	);

	static readonly TOURNAMENT_USER_NOT_LOGGED_IN = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_USER_NOT_LOGGED_IN,
	);

	static readonly TOURNAMENT_USER_NOT_VALID = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_USER_NOT_VALID,
	);

	static readonly TOURNAMENT_USER_IN_MTT_FROM_OTHER_DOMAIN = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_USER_IN_MTT_FROM_OTHER_DOMAIN,
	);

	static readonly TOURNAMENT_REBUY_ALREADY_INITIATED = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_REBUY_ALREADY_INITIATED,
	);

	static readonly TOURNAMENT_STACK_MORE_THAN_MIN_ALLOWED = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_STACK_MORE_THAN_MIN_ALLOWED,
	);

	static readonly TOURNAMENT_REBUY_LIMIT_EXCEEDED = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_REBUY_LIMIT_EXCEEDED,
	);

	static readonly TOURNAMENT_REBUY_TIME_IS_OVER = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_REBUY_TIME_IS_OVER,
	);

	static readonly TOURNAMENT_REBUY_IS_NOT_ALLOWED = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_REBUY_IS_NOT_ALLOWED,
	);

	static readonly TOURNAMENT_SEAT_NOT_FOUND = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_SEAT_NOT_FOUND,
	);

	static readonly TOURNAMENT_PLAYER_NOT_SEATED = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_PLAYER_NOT_SEATED,
	);

	static readonly TOURNAMENT_STACK_IS_NON_ZERO = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_STACK_IS_NON_ZERO,
	);

	static readonly TOURNAMENT_HAND_IS_RUNNING = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_HAND_IS_RUNNING,
	);

	static readonly TOURNAMENT_ADDON_ALREADY_DONE = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_ADDON_ALREADY_DONE,
	);

	static readonly TOURNAMENT_ADDON_NOT_ALLOWED = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_ADDON_NOT_ALLOWED,
	);

	static readonly TOURNAMENT_ALREADY_SITTING_OUT = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_ALREADY_SITTING_OUT,
	);

	static readonly TOURNAMENT_EMPTY_SEAT = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_EMPTY_SEAT,
	);

	static readonly TOURNAMENT_WALLET_ERROR = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_WALLET_ERROR,
	);

	static readonly TOURNAMENT_INSUFFICIENT_FUND = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_INSUFFICIENT_FUND,
	);

	static readonly TOURNAMENT_TICKET_NOT_VALID = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_TICKET_NOT_VALID,
	);

	static readonly TOURNAMENT_USER_IS_BANNED = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_USER_IS_BANNED,
	);

	static readonly TOURNAMENT_MSP_NOT_FOUND = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_MSP_NOT_FOUND,
	);

	static readonly TOURNAMENT_MFP_MISMATCH = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_MFP_MISMATCH,
	);

	static readonly TOURNAMENT_MFP_PLAYER_REGISTRATION_NOT_POSSIBLE = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_MFP_PLAYER_REGISTRATION_NOT_POSSIBLE,
	);

	static readonly TOURNAMENT_MFP_PLAYER_CANNOT_UNREGISTER = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_MFP_PLAYER_CANNOT_UNREGISTER,
	);

	static readonly TOURNAMENT_UPDATE_NOT_POSSIBLE = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_UPDATE_NOT_POSSIBLE,
	);

	static readonly TOURNAMENT_TABLE_INVALID_PARAM = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_TABLE_INVALID_PARAM,
	);

	static readonly TOURNAMENT_USER_IS_NOT_PRESENT_IN_TOURNAMENT_LISTING = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_USER_IS_NOT_PRESENT_IN_TOURNAMENT_LISTING,
	);

	static readonly TOURNAMENT_INVALID_CONNECTION_MODE = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_INVALID_CONNECTION_MODE,
	);

	static readonly TOURNAMENT_SATELLITE_WINNER_CANNOT_UNREGISTER = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_SATELLITE_WINNER_CANNOT_UNREGISTER,
	);

	static readonly TOURNAMENT_MAX_TABLE_LIMIT_REACHED = GsServiceError.get(
		GsErrorCodes.TOURNAMENT_MAX_TABLE_LIMIT_REACHED,
	);

	static readonly MISSING_FINGERPRINT = GsServiceError.get(
		GsErrorCodes.MISSING_FINGERPRINT,
	);

	static readonly BAD_FINGERPRINT = GsServiceError.get(
		GsErrorCodes.BAD_FINGERPRINT,
	);

	static readonly BAD_ROUTE = GsServiceError.get(
		GsErrorCodes.BAD_ROUTE,
	);

	static readonly EXPIRED_FINGERPRINT = GsServiceError.get(
		GsErrorCodes.EXPIRED_FINGERPRINT,
	);

	static readonly INVALID_FINGERPRINT = GsServiceError.get(
		GsErrorCodes.INVALID_FINGERPRINT,
	);

	static readonly ERROR = GsServiceError.get(
		GsErrorCodes.ERROR,
	);

	static readonly URL_NOT_FOUND = GsServiceError.get(
		GsErrorCodes.URL_NOT_FOUND,
	);


	constructor(public name: string, public code: number, public message: any, public type: any) {
		super(name, code, message, type);
	}

	public static get(errorDetails: GsErrorCodes): GsServiceError {
		return new GsServiceError(
			errorDetails.name,
			errorDetails.code,
			errorDetails.message,
			errorDetails.type || 'GsServiceError',
		);
	}
}

export default GsServiceError;
