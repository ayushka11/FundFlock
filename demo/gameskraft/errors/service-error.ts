import { VError } from '@netflix/nerror';
import ErrorCodes from './error-codes';

class ServiceError extends VError {
	// Reducing runtime object allocation of the common errors
	static readonly INTERNAL_SERVER_ERROR = ServiceError.get(
		ErrorCodes.INTERNAL_SERVER_ERROR,
	);
	static readonly AUTHORIZATION_ERROR = ServiceError.get(
		ErrorCodes.AUTHORIZATION_ERROR,
	);
	static readonly WITHDRAWAL_DOWNTIME_ERROR = ServiceError.get(
		ErrorCodes.WITHDRAWAL_DOWNTIME_ERROR,
	);
	static readonly ADD_CASH_DOWNTIME_ERROR = ServiceError.get(
		ErrorCodes.ADD_CASH_DOWNTIME_ERROR,
	);

	static readonly ROOM_ID_NOT_FOUND_ERROR = ServiceError.get(
		ErrorCodes.ROOM_ID_NOT_FOUND_ERROR,
	);

	static readonly TABLE_ID_NOT_FOUND_ERROR = ServiceError.get(
		ErrorCodes.TABLE_ID_NOT_FOUND_ERROR,
	);

	static readonly TOURNAMENT_ID_NOT_FOUND_ERROR = ServiceError.get(
		ErrorCodes.TOURNAMENT_ID_NOT_FOUND_ERROR,
	);

	static readonly INVALID_ROOM_ERROR = ServiceError.get(
		ErrorCodes.INVALID_ROOM_ERROR,
	);

	static readonly INVALID_UNREGISTER_TOURNAMENT = ServiceError.get(
		ErrorCodes.INVALID_UNREGISTER_TOURNAMENT,
	);


	static readonly MISSING_MOBILE_ERROR = ServiceError.get(
		ErrorCodes.MISSING_MOBILE_ERROR,
	);

	static readonly GROUP_ID_NOT_FOUND_ERROR = ServiceError.get(
		ErrorCodes.GROUP_ID_NOT_FOUND_ERROR,
	);

	static readonly TOURNAMENT_OBSERVER_TABLE_ID_NOT_FOUND_ERROR = ServiceError.get(
		ErrorCodes.TOURNAMENT_OBSERVER_TABLE_ID_NOT_FOUND_ERROR,
	);

	static readonly TOURNAMENT_PLAYER_BUSTED_ERROR = ServiceError.get(
		ErrorCodes.TOURNAMENT_PLAYER_BUSTED_ERROR,
	);

	static readonly TOURNAMENT_NOT_IN_RUNNING_STATE_ERROR = ServiceError.get(
		ErrorCodes.TOURNAMENT_NOT_IN_RUNNING_STATE_ERROR,
	);

	static readonly INVALID_GROUP_ERROR = ServiceError.get(
		ErrorCodes.INVALID_GROUP_ERROR,
	);

	static readonly INVALID_REQUEST_ID = ServiceError.get(
		ErrorCodes.INVALID_REQUEST_ID,
	);

	static readonly DB_ANOMALY = ServiceError.get(ErrorCodes.DB_ANOMALY);

	constructor(public name: string, public code: number, public message: any, public type: any) {
		super();
	}

	public static get(errorDetails: ErrorCodes): ServiceError {
		return new ServiceError(
			errorDetails.name,
			errorDetails.code,
			errorDetails.message,
			errorDetails.type || 'ServiceError',
		);
	}
}

export default ServiceError;
