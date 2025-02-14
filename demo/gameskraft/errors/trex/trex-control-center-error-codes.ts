class TrexControlCenterErrorCodes {
    private static BaseErrorCode = 25000;
    static RuntimeError = TrexControlCenterErrorCodes.BaseErrorCode + 1;
    static TokenGenerationError = TrexControlCenterErrorCodes.BaseErrorCode + 2;
    static RefreshTokenGenerationError = TrexControlCenterErrorCodes.BaseErrorCode + 3;
    static LogoutTokenError = TrexControlCenterErrorCodes.BaseErrorCode + 4;
    static BadRequest = TrexControlCenterErrorCodes.BaseErrorCode + 5;
    static JsonMarshal = TrexControlCenterErrorCodes.BaseErrorCode + 6;
    static JsonUnmarshal = TrexControlCenterErrorCodes.BaseErrorCode + 7;
    static HostCommunicationError = TrexControlCenterErrorCodes.BaseErrorCode + 8;
    static IDNotSpecified = TrexControlCenterErrorCodes.BaseErrorCode + 9;
    static DockerServiceError = TrexControlCenterErrorCodes.BaseErrorCode + 10;
    static LoginFromOtherDomain = TrexControlCenterErrorCodes.BaseErrorCode + 11;
    static LoginError = TrexControlCenterErrorCodes.BaseErrorCode + 12;
    static ExpiredToken = TrexControlCenterErrorCodes.BaseErrorCode + 13;
    static InvalidToken = TrexControlCenterErrorCodes.BaseErrorCode + 14;
    static RevokedToken = TrexControlCenterErrorCodes.BaseErrorCode + 15;
    static CashTableIDAlreadyExist = TrexControlCenterErrorCodes.BaseErrorCode + 16;
    static TournamentIDAlreadyExist = TrexControlCenterErrorCodes.BaseErrorCode + 17;
    static InvalidUser = TrexControlCenterErrorCodes.BaseErrorCode + 18;
    static LoginBanned = TrexControlCenterErrorCodes.BaseErrorCode + 19;
    static PublishError = TrexControlCenterErrorCodes.BaseErrorCode + 20;
    static RoomIDAlreadyExist = TrexControlCenterErrorCodes.BaseErrorCode + 21;
    static DBIOError = TrexControlCenterErrorCodes.BaseErrorCode + 22;
    static RoomNotAvailable = TrexControlCenterErrorCodes.BaseErrorCode + 23;
    static InvalidParam = TrexControlCenterErrorCodes.BaseErrorCode + 24;
    static PrivateTableConfigNotFound = TrexControlCenterErrorCodes.BaseErrorCode + 25;
    static LimitNotSpecified = TrexControlCenterErrorCodes.BaseErrorCode + 26;
    static UnlockPCTFailed = TrexControlCenterErrorCodes.BaseErrorCode + 27;
    static PrivateCashTableIDAlreadyExist = TrexControlCenterErrorCodes.BaseErrorCode + 28;
    static PrivateCashTablePinAlreadyExist = TrexControlCenterErrorCodes.BaseErrorCode + 29;
    static PrivateTableCreationLocked = TrexControlCenterErrorCodes.BaseErrorCode + 30;
    static TournamentNotAvailable = TrexControlCenterErrorCodes.BaseErrorCode + 31;
    static EVChopAndRITBothEnabled = TrexControlCenterErrorCodes.BaseErrorCode + 32;
    static SNGNotAvailable = TrexControlCenterErrorCodes.BaseErrorCode + 33;

    static readonly RUNTIME_ERROR = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.RuntimeError,
        'Something went wrong',
        'APPLICATION_RUNTIME_ERROR',
    );

    static readonly TOKEN_GENERATION_ERROR = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.TokenGenerationError,
        'Sorry, there\'s a problem on our end.We are fixing it.Please try again later.',
        'GS_CC_TOKEN_GEN_ERROR',
    );

    static readonly REFRESH_TOKEN_GENERATION_ERROR = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.RefreshTokenGenerationError,
        'Sorry, there\'s a problem on our end.We are fixing it.Please try again later.',
        'GS_CC_REFRESH_TOKEN_GEN_ERROR',
    );

    static readonly LOGOUT_TOKEN_ERROR = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.LogoutTokenError,
        "Sorry, there's a problem on our end. We are fixing it. Please try again later.",
        'GS_CC_LOGOUT_TOKEN_ERROR',
    );

    static readonly BAD_REQUEST = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.BadRequest,
        'Bad Request',
        'BAD_REQUEST',
    );

    static readonly LOGIN_FROM_OTHER_DOMAIN = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.LoginFromOtherDomain,
        'You have logged in from other domains',
        'LOGIN_FROM_OTHER_DOMAIN',
    );

    static readonly EXPIRED_TOKEN = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.ExpiredToken,
        'Token has expired',
        'EXPIRED_TOKEN',
    );

    static readonly INVALID_TOKEN = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.InvalidToken,
        'Invalid token',
        'INVALID_TOKEN',
    );

    static readonly REVOKED_TOKEN = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.RevokedToken,
        'Token has been revoked',
        'REVOKED_TOKEN',
    );

    static readonly CASH_TABLE_ID_ALREADY_EXIST = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.CashTableIDAlreadyExist,
        'Cash table ID already exists',
        'CASH_TABLE_ID_ALREADY_EXIST',
    );

    static readonly TOURNAMENT_ID_ALREADY_EXIST = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.TournamentIDAlreadyExist,
        'Tournament ID already exists',
        'TOURNAMENT_ID_ALREADY_EXIST',
    );

    static readonly INVALID_USER = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.InvalidUser,
        'Invalid user',
        'INVALID_USER',
    );

    static readonly LOGIN_BANNED = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.LoginBanned,
        "Your account has been temporarily blocked. Please reach out to our support team for assistance.",
        'LOGIN_BANNED',
    );

    static readonly PUBLISH_ERROR = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.PublishError,
        'Error while publishing',
        'PUBLISH_ERROR',
    );

    static readonly ROOM_ID_ALREADY_EXIST = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.RoomIDAlreadyExist,
        'Room ID already exists',
        'ROOM_ID_ALREADY_EXIST',
    );

    static readonly DB_IO_ERROR = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.DBIOError,
        "Sorry, there's a problem on our end. We are fixing it. Please try again later.",
        'DB_IO_ERROR',
    );

    static readonly ROOM_NOT_AVAILABLE = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.RoomNotAvailable,
        'Room not available',
        'ROOM_NOT_AVAILABLE',
    );

    static readonly INVALID_PARAM = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.InvalidParam,
        'Invalid parameter',
        'INVALID_PARAM',
    );

    static readonly PRIVATE_TABLE_CONFIG_NOT_FOUND = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.PrivateTableConfigNotFound,
        'Private table configuration not found',
        'PRIVATE_TABLE_CONFIG_NOT_FOUND',
    );

    static readonly LIMIT_NOT_SPECIFIED = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.LimitNotSpecified,
        'Limit not specified',
        'LIMIT_NOT_SPECIFIED',
    );

    static readonly UNLOCK_PCT_FAILED = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.UnlockPCTFailed,
        'Unlock private cash table failed',
        'UNLOCK_PCT_FAILED',
    );

    static readonly PRIVATE_CASH_TABLE_ID_ALREADY_EXIST = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.PrivateCashTableIDAlreadyExist,
        'Private cash table ID already exists',
        'PRIVATE_CASH_TABLE_ID_ALREADY_EXIST',
    );

    static readonly PRIVATE_CASH_TABLE_PIN_ALREADY_EXIST = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.PrivateCashTablePinAlreadyExist,
        'Private cash table PIN already exists',
        'PRIVATE_CASH_TABLE_PIN_ALREADY_EXIST',
    );

    static readonly PRIVATE_TABLE_CREATION_LOCKED = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.PrivateTableCreationLocked,
        'Private table creation is locked',
        'PRIVATE_TABLE_CREATION_LOCKED',
    );

    static readonly TOURNAMENT_NOT_AVAILABLE = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.TournamentNotAvailable,
        'Tournament not available',
        'TOURNAMENT_NOT_AVAILABLE',
    );

    static readonly EV_CHOP_AND_RIT_BOTH_ENABLED = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.EVChopAndRITBothEnabled,
        'Both EV chop and RIT are enabled',
        'EV_CHOP_AND_RIT_BOTH_ENABLED',
    );

    static readonly SNG_NOT_AVAILABLE = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.SNGNotAvailable,
        'SNG not available',
        'SNG_NOT_AVAILABLE',
    );

    static readonly JSON_MARSHAL_ERROR = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.JsonMarshal,
        'Error occurred while marshaling JSON',
        'JSON_MARSHAL_ERROR',
    );

    static readonly JSON_UNMARSHAL_ERROR = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.JsonUnmarshal,
        'Error occurred while unmarshaling JSON',
        'JSON_UNMARSHAL_ERROR',
    );

    static readonly HOST_COMMUNICATION_ERROR = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.HostCommunicationError,
        'Error in host communication',
        'HOST_COMMUNICATION_ERROR_ERROR',
    );

    static readonly ID_NOT_SPECIFIED_ERROR = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.IDNotSpecified,
        'ID not specified',
        'ID_NOT_SPECIFIED_ERROR',
    );

    static readonly DOCKER_SERVICE_ERROR = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.DockerServiceError,
        'Error in Docker service',
        'DOCKER_SERVICE_ERROR_ERROR',
    );

    static readonly LOGIN_FROM_OTHER_DOMAIN_ERROR = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.LoginFromOtherDomain,
        'Login from another domain not allowed',
        'LOGIN_FROM_OTHER_DOMAIN_ERROR',
    );

    static readonly LOGIN_ERROR = new TrexControlCenterErrorCodes(
        TrexControlCenterErrorCodes.LoginError,
        'Login error',
        'LOGIN_ERROR_ERROR',
    );



    constructor(
        public code: number,
        public message: string,
        public name: string,
        public type?: string,
    ) {}
    toString(): string {
        return `${this.name}:${this.code}:${this.message}`;
    }
}

export default TrexControlCenterErrorCodes;
