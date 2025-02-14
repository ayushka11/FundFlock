import TrexControlCenterError from './trex-control-center-error';
import TrexControlCenterErrorCodes from './trex-control-center-error-codes';
import ServiceErrorUtil from '../service-error-util';

class TrexControlCenterErrorUtil extends ServiceErrorUtil {
    public static getRuntimeError(): TrexControlCenterError {
        return TrexControlCenterError.get(TrexControlCenterErrorCodes.RUNTIME_ERROR);
    }

    public static getError(error: Error): TrexControlCenterError {
        if (!(error instanceof TrexControlCenterError)) {
            return this.getRuntimeError();
        }
        return error;
    }

    public static getTokenGenerationError(): TrexControlCenterError {
        return TrexControlCenterError.TOKEN_GENERATION_ERROR;
    }

    public static getRefreshTokenGenerationError(): TrexControlCenterError {
        return TrexControlCenterError.REFRESH_TOKEN_GENERATION_ERROR;
    }

    public static getLogoutTokenError(): TrexControlCenterError {
        return TrexControlCenterError.LOGOUT_TOKEN_ERROR;
    }

    public static getBadRequest(): TrexControlCenterError {
        return TrexControlCenterError.BAD_REQUEST;
    }

    public static getJsonMarshal(): TrexControlCenterError {
        return TrexControlCenterError.JSON_MARSHAL;
    }

    public static getJsonUnmarshal(): TrexControlCenterError {
        return TrexControlCenterError.JSON_UNMARSHAL;
    }

    public static getHostCommunicationError(): TrexControlCenterError {
        return TrexControlCenterError.HOST_COMMUNICATION_ERROR;
    }

    public static getIDNotSpecified(): TrexControlCenterError {
        return TrexControlCenterError.ID_NOT_SPECIFIED;
    }

    public static getDockerServiceError(): TrexControlCenterError {
        return TrexControlCenterError.DOCKER_SERVICE_ERROR;
    }

    public static getLoginFromOtherDomain(): TrexControlCenterError {
        return TrexControlCenterError.LOGIN_FROM_OTHER_DOMAIN;
    }

    public static getLoginError(): TrexControlCenterError {
        return TrexControlCenterError.LOGIN_ERROR;
    }

    public static getExpiredToken(): TrexControlCenterError {
        return TrexControlCenterError.EXPIRED_TOKEN;
    }

    public static getInvalidToken(): TrexControlCenterError {
        return TrexControlCenterError.INVALID_TOKEN;
    }

    public static getRevokedToken(): TrexControlCenterError {
        return TrexControlCenterError.REVOKED_TOKEN;
    }

    public static getCashTableIDAlreadyExist(): TrexControlCenterError {
        return TrexControlCenterError.CASH_TABLE_ID_ALREADY_EXIST;
    }

    public static getTournamentIDAlreadyExist(): TrexControlCenterError {
        return TrexControlCenterError.TOURNAMENT_ID_ALREADY_EXIST;
    }

    public static getInvalidUser(): TrexControlCenterError {
        return TrexControlCenterError.INVALID_USER;
    }

    public static getLoginBanned(): TrexControlCenterError {
        return TrexControlCenterError.LOGIN_BANNED;
    }

    public static getPublishError(): TrexControlCenterError {
        return TrexControlCenterError.PUBLISH_ERROR;
    }

    public static getRoomIDAlreadyExist(): TrexControlCenterError {
        return TrexControlCenterError.ROOM_ID_ALREADY_EXIST;
    }

    public static getDBIOError(): TrexControlCenterError {
        return TrexControlCenterError.DB_IO_ERROR;
    }

    public static getRoomNotAvailable(): TrexControlCenterError {
        return TrexControlCenterError.ROOM_NOT_AVAILABLE;
    }

    public static getInvalidParam(): TrexControlCenterError {
        return TrexControlCenterError.INVALID_PARAM;
    }

    public static getPrivateTableConfigNotFound(): TrexControlCenterError {
        return TrexControlCenterError.PRIVATE_TABLE_CONFIG_NOT_FOUND;
    }

    public static getLimitNotSpecified(): TrexControlCenterError {
        return TrexControlCenterError.LIMIT_NOT_SPECIFIED;
    }

    public static getUnlockPCTFailed(): TrexControlCenterError {
        return TrexControlCenterError.UNLOCK_PCT_FAILED;
    }

    public static getPrivateCashTableIDAlreadyExist(): TrexControlCenterError {
        return TrexControlCenterError.PRIVATE_CASH_TABLE_ID_ALREADY_EXIST;
    }

    public static getPrivateCashTablePinAlreadyExist(): TrexControlCenterError {
        return TrexControlCenterError.PRIVATE_CASH_TABLE_PIN_ALREADY_EXIST;
    }

    public static getPrivateTableCreationLocked(): TrexControlCenterError {
        return TrexControlCenterError.PRIVATE_TABLE_CREATION_LOCKED;
    }

    public static getTournamentNotAvailable(): TrexControlCenterError {
        return TrexControlCenterError.TOURNAMENT_NOT_AVAILABLE;
    }

    public static getEVChopAndRITBothEnabled(): TrexControlCenterError {
        return TrexControlCenterError.EV_CHOP_AND_RIT_BOTH
    }

    public static getSNGNotAvailable(): TrexControlCenterError {
        return TrexControlCenterError.SNG_NOT_AVAILABLE;
    }


    public static wrapError(error: any): TrexControlCenterError {
        return TrexControlCenterError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `TrexControlCenterError:${error.type}`,
        });
    }
}

export default TrexControlCenterErrorUtil;