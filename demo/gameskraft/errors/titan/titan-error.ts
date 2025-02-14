import ServiceError from '../service-error';
import TitanErrorCodes from './titan-error-codes';

class TitanServiceError extends ServiceError {

    static readonly INTERNAL_SERVER_ERROR = TitanServiceError.get(
        TitanErrorCodes.INTERNAL_SERVER_ERROR
    );

    static readonly RUNTIME_ERROR = TitanServiceError.get(
        TitanErrorCodes.RUNTIME_ERROR
    );

    static readonly MAX_PLAYERS_REACHED = ServiceError.get(
        TitanErrorCodes.MAX_PLAYERS_REACHED,
    );

    static readonly TOURNAMENT_NOT_IN_REGISTRATION_PHASE = ServiceError.get(
        TitanErrorCodes.TOURNAMENT_NOT_IN_REGISTRATION_PHASE,
    );

    static readonly PLAYER_ALREADY_REGISTERED = ServiceError.get(
        TitanErrorCodes.PLAYER_ALREADY_REGISTERED,
    );

    static readonly INVALID_VENDOR_ID = ServiceError.get(
        TitanErrorCodes.INVALID_VENDOR_ID,
    );

    static readonly INVALID_REGISTER_BUYIN_METHOD = ServiceError.get(
        TitanErrorCodes.INVALID_REGISTER_BUYIN_METHOD,
    );

    static readonly INVALID_REENTRY_BUYIN_METHOD = ServiceError.get(
        TitanErrorCodes.INVALID_REENTRY_BUYIN_METHOD,
    );

    static readonly MAX_REENTRY_LIMIT_REACHED = ServiceError.get(
        TitanErrorCodes.MAX_REENTRY_LIMIT_REACHED,
    );

    static readonly PLAYER_NOT_REGISTERED = ServiceError.get(
        TitanErrorCodes.PLAYER_NOT_REGISTERED,
    );

    static readonly REENTER_NOT_ALLOWED = ServiceError.get(
        TitanErrorCodes.REENTER_NOT_ALLOWED,
    );

    static readonly PLAYER_NOT_ELIGIBLE_TO_REGISTER_OR_REENTER = ServiceError.get(
        TitanErrorCodes.PLAYER_NOT_ELIGIBLE_TO_REGISTER_OR_REENTER,
    );

    static readonly TOURNAMENT_NOT_FOUND = ServiceError.get(
        TitanErrorCodes.TOURNAMENT_NOT_FOUND,
    );

    static readonly PLAYER_CANNOT_UNREGISTER = ServiceError.get(
        TitanErrorCodes.PLAYER_CANNOT_UNREGISTER,
    );

    static readonly TOURNAMENT_COMPLETED = ServiceError.get(
        TitanErrorCodes.TOURNAMENT_COMPLETED,
    );

    static readonly TOURNAMENT_CANCELLED = ServiceError.get(
        TitanErrorCodes.TOURNAMENT_CANCELLED,
    );

    static readonly PLAYER_CANNOT_REGISTER = ServiceError.get(
        TitanErrorCodes.PLAYER_CANNOT_REGISTER,
    );

    static readonly PLAYER_ALREADY_PLAYING = ServiceError.get(
        TitanErrorCodes.PLAYER_ALREADY_PLAYING,
    );

    static readonly PLAYER_CANNOT_REENTRY = ServiceError.get(
        TitanErrorCodes.PLAYER_CANNOT_REENTRY,
    );

    static readonly TOURNAMENT_COMPLETED_OR_CANCELED = ServiceError.get(
        TitanErrorCodes.TOURNAMENT_COMPLETED_OR_CANCELED,
    );

    static readonly TOURNAMENT_IS_ON_BREAK = ServiceError.get(
        TitanErrorCodes.TOURNAMENT_IS_ON_BREAK,
    );

    static readonly TOURNAMENT_IS_ON_WAIT_FOR_BREAK = ServiceError.get(
        TitanErrorCodes.TOURNAMENT_IS_ON_WAIT_FOR_BREAK,
    );

    static readonly TOURNAMENT_LEVEL_ALREADY_STARTED = ServiceError.get(
        TitanErrorCodes.TOURNAMENT_LEVEL_ALREADY_STARTED,
    );

    static readonly TOURNAMENT_LEVEL_ALREADY_PAUSED = ServiceError.get(
        TitanErrorCodes.TOURNAMENT_LEVEL_ALREADY_PAUSED,
    );

    static readonly PLAYER_CANNOT_UNREGISTER_DURING_SEAT_ALLOCATION = ServiceError.get(
        TitanErrorCodes.PLAYER_CANNOT_UNREGISTER_DURING_SEAT_ALLOCATION,
    );

    constructor(public name: string, public code: number, public message: any, public type: any) {
        super(name, code, message, type);
    }

    public static get(errorDetails: TitanErrorCodes): TitanServiceError {
        return new TitanServiceError(
            errorDetails.name,
            errorDetails.code,
            errorDetails.message,
            errorDetails.type || 'TitanServiceError',
        );
    }
}

export default TitanServiceError;
