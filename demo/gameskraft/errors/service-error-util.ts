import ErrorCodes from './error-codes';
import ServiceError from './service-error';

class ServiceErrorUtil {

	public static getError(error: Error): ServiceError {
		if (!(error instanceof ServiceError)) {
			return ServiceError.INTERNAL_SERVER_ERROR;
		}
		return error;
	}

	public static getBodyValidationError(message: any): ServiceError {
		const error = ServiceError.get(ErrorCodes.BODY_VALIDATION_ERROR);
		error.message = message;
		return error;
	}

	public static getAuthorizationError(): ServiceError {
		return ServiceError.AUTHORIZATION_ERROR;
	}

	public static getInternalServerError(): ServiceError {
		return ServiceError.INTERNAL_SERVER_ERROR;
	}

	public static getWithdrawalDowntimeError(): ServiceError {
		return ServiceError.WITHDRAWAL_DOWNTIME_ERROR;
	}

	public static getAddCashDowntimeError(): ServiceError {
		return ServiceError.ADD_CASH_DOWNTIME_ERROR;
	}

	public static getRoomIdNotFoundError(): ServiceError {
		return ServiceError.ROOM_ID_NOT_FOUND_ERROR;
	}

	public static getTableIdNotFoundError(): ServiceError {
		return ServiceError.TABLE_ID_NOT_FOUND_ERROR;
	}

	public static getTournamentIdNotFoundError(): ServiceError {
		return ServiceError.TOURNAMENT_ID_NOT_FOUND_ERROR;
	}

	public static getInvalidRoomError(): ServiceError {
		return ServiceError.INVALID_ROOM_ERROR;
	}

	public static getInvalidUnregisterTournament(): ServiceError {
		return ServiceError.INVALID_UNREGISTER_TOURNAMENT;
	}

	public static getGroupIdNotFoundError(): ServiceError {
		return ServiceError.GROUP_ID_NOT_FOUND_ERROR;
	}

	public static getTournamentObserverTableIdNotFoundError(): ServiceError {
		return ServiceError.TOURNAMENT_OBSERVER_TABLE_ID_NOT_FOUND_ERROR;
	}

	public static getTournamentPlayerBustedError(): ServiceError {
		return ServiceError.TOURNAMENT_PLAYER_BUSTED_ERROR;
	}

	public static getTournamentNotInRunningStateError(): ServiceError {
		return ServiceError.TOURNAMENT_NOT_IN_RUNNING_STATE_ERROR;
	}

	public static getInvalidGroupError(): ServiceError {
		return ServiceError.INVALID_GROUP_ERROR;
	}

	public static getInvalidRequestId(): ServiceError {
		return ServiceError.INVALID_REQUEST_ID;
	}

	public static wrapError(error: any): ServiceError {
		return ServiceError.get({
            name: error?.name,
            code: error?.code,
            message: error?.message,
            type: `ServiceError:${error?.type}`,
        })
	}
}

export default ServiceErrorUtil;
