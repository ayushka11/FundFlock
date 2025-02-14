import ServiceError from '../service-error';
import TrexControlCenterCodes from './trex-control-center-error-codes';

class TrexControlCenterError extends ServiceError {

    static readonly TOKEN_GENERATION_ERROR: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.TOKEN_GENERATION_ERROR,
    );

    static readonly REFRESH_TOKEN_GENERATION_ERROR: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.REFRESH_TOKEN_GENERATION_ERROR,
    );

    static readonly JSON_MARSHAL: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.JSON_MARSHAL_ERROR,
    );

    static readonly JSON_UNMARSHAL: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.JSON_UNMARSHAL_ERROR,
    );

    static readonly HOST_COMMUNICATION_ERROR: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.HOST_COMMUNICATION_ERROR,
    );

    static readonly ID_NOT_SPECIFIED: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.ID_NOT_SPECIFIED_ERROR,
    );

    static readonly DOCKER_SERVICE_ERROR: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.DOCKER_SERVICE_ERROR,
    );

    static readonly LOGIN_ERROR: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.LOGIN_ERROR,
    );

    static readonly EV_CHOP_AND_RIT_BOTH: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.EV_CHOP_AND_RIT_BOTH_ENABLED,
    );

    static readonly LOGOUT_TOKEN_ERROR: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.LOGOUT_TOKEN_ERROR,
    );

    static readonly RUNTIME_ERROR: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.RUNTIME_ERROR,
    );

    static readonly BAD_REQUEST: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.BAD_REQUEST,
    );

    static readonly LOGIN_FROM_OTHER_DOMAIN: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.LOGIN_FROM_OTHER_DOMAIN,
    );

    static readonly EXPIRED_TOKEN: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.EXPIRED_TOKEN,
    );

    static readonly INVALID_TOKEN: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.INVALID_TOKEN,
    );

    static readonly REVOKED_TOKEN: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.REVOKED_TOKEN,
    );

    static readonly CASH_TABLE_ID_ALREADY_EXIST: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.CASH_TABLE_ID_ALREADY_EXIST,
    );

    static readonly TOURNAMENT_ID_ALREADY_EXIST: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.TOURNAMENT_ID_ALREADY_EXIST,
    );

    static readonly INVALID_USER: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.INVALID_USER,
    );

    static readonly LOGIN_BANNED: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.LOGIN_BANNED,
    );

    static readonly PUBLISH_ERROR: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.PUBLISH_ERROR,
    );

    static readonly ROOM_ID_ALREADY_EXIST: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.ROOM_ID_ALREADY_EXIST,
    );

    static readonly DB_IO_ERROR: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.DB_IO_ERROR,
    );

    static readonly ROOM_NOT_AVAILABLE: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.ROOM_NOT_AVAILABLE,
    );

    static readonly INVALID_PARAM: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.INVALID_PARAM,
    );

    static readonly PRIVATE_TABLE_CONFIG_NOT_FOUND: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.PRIVATE_TABLE_CONFIG_NOT_FOUND,
    );

    static readonly LIMIT_NOT_SPECIFIED: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.LIMIT_NOT_SPECIFIED,
    );

    static readonly UNLOCK_PCT_FAILED: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.UNLOCK_PCT_FAILED,
    );

    static readonly PRIVATE_CASH_TABLE_ID_ALREADY_EXIST: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.PRIVATE_CASH_TABLE_ID_ALREADY_EXIST,
    );

    static readonly PRIVATE_CASH_TABLE_PIN_ALREADY_EXIST: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.PRIVATE_CASH_TABLE_PIN_ALREADY_EXIST,
    );

    static readonly PRIVATE_TABLE_CREATION_LOCKED: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.PRIVATE_TABLE_CREATION_LOCKED,
    );

    static readonly TOURNAMENT_NOT_AVAILABLE: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.TOURNAMENT_NOT_AVAILABLE,
    );

    static readonly EV_CHOP_AND_RIT_BOTH_ENABLED: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.EV_CHOP_AND_RIT_BOTH_ENABLED,
    );

    static readonly SNG_NOT_AVAILABLE: TrexControlCenterError = TrexControlCenterError.get(
        TrexControlCenterCodes.SNG_NOT_AVAILABLE,
    );

    constructor(public name: string, public code: number, public message: any, public type: any) {
        super(name, code, message, type);
    }

    public static get(errorDetails: TrexControlCenterCodes): TrexControlCenterError {
        return new TrexControlCenterError(
            errorDetails.name,
            errorDetails.code,
            errorDetails.message,
            errorDetails.type || 'TrexControlCenterError',
        );
    }
}

export default TrexControlCenterError;
