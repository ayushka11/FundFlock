import ServiceErrorUtil from '../service-error-util';
import TitanServiceError from './titan-error';
import TitanErrorCodes from './titan-error-codes';

class TitanServiceErrorUtil extends ServiceErrorUtil {

    public static getRuntimeError(): TitanServiceError {
        return TitanServiceError.get(TitanErrorCodes.RUNTIME_ERROR);
    }

    public static getInternalServerError(): TitanServiceError {
        return TitanServiceError.get(TitanErrorCodes.INTERNAL_SERVER_ERROR);
    }

    static getMaxPlayersReached(): TitanServiceError {
        return TitanServiceError.MAX_PLAYERS_REACHED;
    }

    static getTournamentNotInRegistrationPhase(): TitanServiceError {
        return TitanServiceError.TOURNAMENT_NOT_IN_REGISTRATION_PHASE;
    }

    static getPlayerAlreadyRegistered(): TitanServiceError {
        return TitanServiceError.PLAYER_ALREADY_REGISTERED;
    }

    static getInvalidVendorId(): TitanServiceError {
        return TitanServiceError.INVALID_VENDOR_ID;
    }

    static getInvalidRegisterBuyinMethod(): TitanServiceError {
        return TitanServiceError.INVALID_REGISTER_BUYIN_METHOD;
    }

    static getInvalidReentryBuyinMethod(): TitanServiceError {
        return TitanServiceError.INVALID_REENTRY_BUYIN_METHOD;
    }

    static getMaxReentryLimitReached(): TitanServiceError {
        return TitanServiceError.MAX_REENTRY_LIMIT_REACHED;
    }

    static getPlayerNotRegistered(): TitanServiceError {
        return TitanServiceError.PLAYER_NOT_REGISTERED;
    }

    static getReenterNotAllowed(): TitanServiceError {
        return TitanServiceError.REENTER_NOT_ALLOWED;
    }

    static getPlayerNotEligibleToRegisterorReenter(): TitanServiceError {
        return TitanServiceError.PLAYER_NOT_ELIGIBLE_TO_REGISTER_OR_REENTER;
    }

    static getTournamentNotFoundError(): TitanServiceError {
        return TitanServiceError.TOURNAMENT_NOT_FOUND;
    }

    public static getPlayerCannotUnRegister(): TitanServiceError {
        return TitanServiceError.PLAYER_CANNOT_UNREGISTER;
    }

    public static getTournamentCompleted(): TitanServiceError {
        return TitanServiceError.TOURNAMENT_COMPLETED;
    }

    public static getTournamentCancelled(): TitanServiceError {
        return TitanServiceError.TOURNAMENT_CANCELLED;
    }

    public static getPlayerCannotRegister(): TitanServiceError {
        return TitanServiceError.PLAYER_CANNOT_REGISTER;
    }

    public static getPlayerAlreadyPlaying(): TitanServiceError {
        return TitanServiceError.PLAYER_ALREADY_PLAYING;
    }

    public static getPlayerCannotReentry(): TitanServiceError {
        return TitanServiceError.PLAYER_CANNOT_REENTRY;
    }

    public static getTournamentCompletedOrCanceled(): TitanServiceError {
        return TitanServiceError.TOURNAMENT_COMPLETED_OR_CANCELED;
    }

    public static getTournamentIsOnBreak(): TitanServiceError {
        return TitanServiceError.TOURNAMENT_IS_ON_BREAK;
    }

    public static getTournamentIsOnWaitForBreak(): TitanServiceError {
        return TitanServiceError.TOURNAMENT_IS_ON_WAIT_FOR_BREAK;
    }

    public static getTournamentLevelAlreadyStarted(): TitanServiceError {
        return TitanServiceError.TOURNAMENT_LEVEL_ALREADY_STARTED;
    }

    public static getTournamentLevelAlreadyPaused(): TitanServiceError {
        return TitanServiceError.TOURNAMENT_LEVEL_ALREADY_PAUSED;
    }

    public static getPlayerCannotUnRegisterDuringSeatAllocation(): TitanServiceError {
        return TitanServiceError.PLAYER_CANNOT_UNREGISTER_DURING_SEAT_ALLOCATION;
    }

    public static getError(error: Error): TitanServiceError {
        if (!(error instanceof TitanServiceError)) {
            return this.getRuntimeError();
        }
        return error;
    }


    public static wrapError(error: any): TitanServiceError {
        return TitanServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `TitanServiceError:${error.type}`,
        })
    }
}

export default TitanServiceErrorUtil;
