import ZodiacErrorCodes from './zodiac-error-codes';
import ServiceError from '../service-error';

class ZodiacServiceError extends ServiceError {

	static readonly USER_ALREADY_EXISTS = ServiceError.get(
		ZodiacErrorCodes.USER_ALREADY_EXISTS,
	);

	static readonly USER_DOES_NOT_EXISTS = ServiceError.get(
		ZodiacErrorCodes.USER_DOES_NOT_EXISTS,
	);

	static readonly INVALID_GAMEPLAY_NOTE_COLOR_TO_UPDATE = ServiceError.get(
		ZodiacErrorCodes.INVALID_GAMEPLAY_NOTE_COLOR_TO_UPDATE,
	);

	static readonly INVALID_GAMEPLAY_NOTE_COLOR_ID = ServiceError.get(
		ZodiacErrorCodes.INVALID_GAMEPLAY_NOTE_COLOR_ID,
	);

	static readonly NO_ACTIVE_TABLE_SESSION = ZodiacServiceError.get(
		ZodiacErrorCodes.NO_ACTIVE_TABLE_SESSION
	);

	static readonly NO_HAND_IN_CURRENT_TABLE_SESSION = ZodiacServiceError.get(
		ZodiacErrorCodes.NO_HAND_IN_CURRENT_TABLE_SESSION
	);

	static readonly NO_TABLE_SESSIONS_ON_DATE = ZodiacServiceError.get(
		ZodiacErrorCodes.NO_TABLE_SESSIONS_ON_DATE
	);

	static readonly NO_TABLE_HANDS_ON_DATE = ZodiacServiceError.get(
		ZodiacErrorCodes.NO_TABLE_HANDS_ON_DATE
	);

	static readonly TABLE_HAND_DETAILS_NOT_FOUND = ZodiacServiceError.get(
		ZodiacErrorCodes.TABLE_HAND_DETAILS_NOT_FOUND
	);

	static readonly NO_TOURNAMENT_HANDS_ON_DATE = ZodiacServiceError.get(
		ZodiacErrorCodes.NO_TOURNAMENT_HANDS_ON_DATE
	);

	static readonly NO_ACTIVE_TOURNAMENT = ZodiacServiceError.get(
		ZodiacErrorCodes.NO_ACTIVE_TOURNAMENT
	);

	static readonly NO_HAND_IN_CURRENT_TOURNAMENT = ZodiacServiceError.get(
		ZodiacErrorCodes.NO_HAND_IN_CURRENT_TOURNAMENT
	);

	static readonly TOURNAMENT_HAND_DETAILS_NOT_FOUND = ZodiacServiceError.get(
		ZodiacErrorCodes.TOURNAMENT_HAND_DETAILS_NOT_FOUND
	);

	static readonly PSL_PASS_ALREADY_CLAIMED = ZodiacServiceError.get(
		ZodiacErrorCodes.PSL_PASS_ALREADY_CLAIMED
	);

	static readonly PSL_PASS_NOT_CLAIMED = ZodiacServiceError.get(
		ZodiacErrorCodes.PSL_PASS_NOT_CLAIMED
	);

	static readonly MAXIMUM_PSL_TOURNAMENT_REGISTRATION_LIMIT_ERROR = ZodiacServiceError.get(
		ZodiacErrorCodes.MAXIMUM_PSL_TOURNAMENT_REGISTRATION_LIMIT_ERROR
	);

	constructor(public name: string, public code: number, public message: any, public type: any) {
		super(name, code, message, type);
	}

	public static get(errorDetails: ZodiacErrorCodes): ZodiacServiceError {
		return new ZodiacServiceError(
			errorDetails.name,
			errorDetails.code,
			errorDetails.message,
            errorDetails.type || 'ZodiacServiceError',
		);
	}
}

export default ZodiacServiceError;
