import ZodiacServiceError from './zodiac-error';
import ZodiacErrorCodes from './zodiac-error-codes';
import ServiceErrorUtil from '../service-error-util';

class ZodiacServiceErrorUtil extends ServiceErrorUtil {
    public static getRuntimeError(): ZodiacServiceError {
		return ZodiacServiceError.get(ZodiacErrorCodes.RUNTIME_ERROR);
	}

	public static getError(error: Error): ZodiacServiceError {
		if (!(error instanceof ZodiacServiceError)) {
			return this.getRuntimeError();
		}
		return error;
	}

	public static getNoActiveTableSessionError(): ZodiacServiceError {
		return ZodiacServiceError.NO_ACTIVE_TABLE_SESSION;
	}

	public static getNoHandInCurrentTableSessionError(): ZodiacServiceError {
		return ZodiacServiceError.NO_HAND_IN_CURRENT_TABLE_SESSION
	}

	public static getNoTableSessionsOnCurrentDateError(): ZodiacServiceError {
		return ZodiacServiceError.NO_TABLE_SESSIONS_ON_DATE
	}

	public static getNoTableHandsOnCurrentDateError(): ZodiacServiceError {
		return ZodiacServiceError.NO_TABLE_HANDS_ON_DATE
	}

	public static getTableHandDetailsNotFoundError(): ZodiacServiceError {
		return ZodiacServiceError.TABLE_HAND_DETAILS_NOT_FOUND
	}

	public static getNoActiveTournamentError(): ZodiacServiceError {
		return ZodiacServiceError.NO_ACTIVE_TOURNAMENT;
	}

	public static getNoHandsInCurrentTournamentError(): ZodiacServiceError {
		return ZodiacServiceError.NO_HAND_IN_CURRENT_TOURNAMENT;
	}

	public static getNoTournamentHandsOnCurrentDateError(): ZodiacServiceError {
		return ZodiacServiceError.NO_TOURNAMENT_HANDS_ON_DATE
	}

	public static getTournamentHandDetailsNotFoundError(): ZodiacServiceError {
		return ZodiacServiceError.TOURNAMENT_HAND_DETAILS_NOT_FOUND
	}

	public static getUserAlreadyExists(): ZodiacServiceError {
		return ZodiacServiceError.USER_ALREADY_EXISTS;
	}

	public static getUserDoesNotExists(): ZodiacServiceError {
		return ZodiacServiceError.USER_DOES_NOT_EXISTS;
	}

	public static getInvalidGameplayNoteColorToUpdate(): ZodiacServiceError {
		return ZodiacServiceError.INVALID_GAMEPLAY_NOTE_COLOR_TO_UPDATE;
	}

	public static getInvalidGameplayNoteColorId(): ZodiacServiceError {
		return ZodiacServiceError.INVALID_GAMEPLAY_NOTE_COLOR_ID;
	}

	public static getPslPassAlreadyClaimed(): ZodiacServiceError {
		return ZodiacServiceError.PSL_PASS_ALREADY_CLAIMED;
	}

	public static getPslPassNotClaimed(): ZodiacServiceError {
		return ZodiacServiceError.PSL_PASS_NOT_CLAIMED;
	}

	public static getMaximumPslTournamentRegistrationLimitError(): ZodiacServiceError {
		return ZodiacServiceError.MAXIMUM_PSL_TOURNAMENT_REGISTRATION_LIMIT_ERROR;
	}

	public static wrapError(error: any): ZodiacServiceError {
		return ZodiacServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `ZodiacServiceError:${error.type}`,
        })
	}
}

export default ZodiacServiceErrorUtil;
