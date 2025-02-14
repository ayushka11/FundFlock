class TitanErrorCodes {

    private static BaseErrorCode = 28000;
    static RuntimeError = TitanErrorCodes.BaseErrorCode + 1;
    static InternalServerError = TitanErrorCodes.BaseErrorCode + 2;
    static MaxPlayersReached = TitanErrorCodes.BaseErrorCode + 53;
    static TournamentNotInRegistrationPhase = TitanErrorCodes.BaseErrorCode + 54;
    static PlayerAlreadyRegistered = TitanErrorCodes.BaseErrorCode + 55;
    static InvalidVendorId = TitanErrorCodes.BaseErrorCode + 56;
    static InvalidRegisterBuyinMethod = TitanErrorCodes.BaseErrorCode + 57;
    static InvalidReentryBuyinMethod = TitanErrorCodes.BaseErrorCode + 58;
    static MaxReentryLimitReached = TitanErrorCodes.BaseErrorCode + 59;
    static PlayerNotRegistered = TitanErrorCodes.BaseErrorCode + 60;
    static ReenterNotAllowed = TitanErrorCodes.BaseErrorCode + 61;
    static PlayerNotEligibleToRegisterOrReenter = TitanErrorCodes.BaseErrorCode + 62;
    static TournamentNotFound = TitanErrorCodes.BaseErrorCode + 63;
    static PlayerCannotUnRegister = TitanErrorCodes.BaseErrorCode + 64;
    static TournamentCompleted = TitanErrorCodes.BaseErrorCode + 65;
    static TournamentCancelled = TitanErrorCodes.BaseErrorCode + 66;
    static PlayerCannotRegister = TitanErrorCodes.BaseErrorCode + 67;
    static PlayerAlreadyPlaying = TitanErrorCodes.BaseErrorCode + 68;
    static PlayerCannotReentry = TitanErrorCodes.BaseErrorCode + 69;
    static TournamentCompletedOrCanceled = TitanErrorCodes.BaseErrorCode + 70;
    static TournamentIsOnBreak = TitanErrorCodes.BaseErrorCode + 71;
    static TournamentIsOnWaitForBreak = TitanErrorCodes.BaseErrorCode + 72;
    static TournamentLevelAlreadyStarted = TitanErrorCodes.BaseErrorCode + 73;
    static TournamentLevelAlreadyPaused = TitanErrorCodes.BaseErrorCode + 74;
    static TournamentLevelCannotPause = TitanErrorCodes.BaseErrorCode + 75;
    static TournamentLevelCannotStart = TitanErrorCodes.BaseErrorCode + 76;
    static PlayerCannotUnregisterDuringSeatAllocation = TitanErrorCodes.BaseErrorCode + 77;


    static readonly RUNTIME_ERROR = new TitanErrorCodes(
        TitanErrorCodes.RuntimeError,
        'Something went wrong',
        'APPLICATION_RUNTIME_ERROR',
    );
    static readonly INTERNAL_SERVER_ERROR = new TitanErrorCodes(
        TitanErrorCodes.InternalServerError,
        'Internal server error occurred',
        'INTERNAL_SERVER_ERROR',
    );
    static readonly PLAYER_ALREADY_REGISTERED = new TitanErrorCodes(
        TitanErrorCodes.PlayerAlreadyRegistered,
        'Player Already Registered',
        'PLAYER_ALREADY_REGISTERED',
    );
    static readonly INVALID_VENDOR_ID = new TitanErrorCodes(
        TitanErrorCodes.InvalidVendorId,
        'Invalid Vendor Id',
        'INVALID_VENDOR_ID',
    );
    static readonly INVALID_REGISTER_BUYIN_METHOD = new TitanErrorCodes(
        TitanErrorCodes.InvalidRegisterBuyinMethod,
        'Invalid Register Buyin Method',
        'INVALID_REGISTER_BUYIN_METHOD',
    );
    static readonly INVALID_REENTRY_BUYIN_METHOD = new TitanErrorCodes(
        TitanErrorCodes.InvalidReentryBuyinMethod,
        'Invalid Reentry Buyin Method',
        'INVALID_REENTRY_BUYIN_METHOD',
    );
    static readonly MAX_REENTRY_LIMIT_REACHED = new TitanErrorCodes(
        TitanErrorCodes.MaxReentryLimitReached,
        'MaxReentryLimitReached',
        'MAX_REENTRY_LIMIT_REACHED',
    );
    static readonly PLAYER_NOT_REGISTERED = new TitanErrorCodes(
        TitanErrorCodes.PlayerNotRegistered,
        'Player Not Registered',
        'PLAYER_NOT_REGISTERED',
    );
    static readonly REENTER_NOT_ALLOWED = new TitanErrorCodes(
        TitanErrorCodes.ReenterNotAllowed,
        'Reenter Not Allowed',
        'REENTER_NOT_ALLOWED',
    );
    static readonly MAX_PLAYERS_REACHED = new TitanErrorCodes(
        TitanErrorCodes.MaxPlayersReached,
        'Max Players Reached',
        'MAX_PLAYERS_REACHED',
    );
    static readonly TOURNAMENT_NOT_IN_REGISTRATION_PHASE = new TitanErrorCodes(
        TitanErrorCodes.TournamentNotInRegistrationPhase,
        'Tournament not in registration phase',
        'TOURNAMENT_NOT_IN_REGISTRATION_PHASE',
    );
    static readonly PLAYER_NOT_ELIGIBLE_TO_REGISTER_OR_REENTER = new TitanErrorCodes(
        TitanErrorCodes.PlayerNotEligibleToRegisterOrReenter,
        'Player is not Eligible for Registering',
        'PLAYER_NOT_REGISTERED',
    );
    static readonly TOURNAMENT_NOT_FOUND = new TitanErrorCodes(
        TitanErrorCodes.PlayerNotRegistered,
        'Tournament Not Found',
        'TOURNAMENT_NOT_FOUND',
    );

    static readonly PLAYER_CANNOT_UNREGISTER = new TitanErrorCodes(
        TitanErrorCodes.PlayerCannotUnRegister,
        'Player Cannot UnRegister',
        'PLAYER_CANNOT_UNREGISTER',
    );

    static readonly TOURNAMENT_COMPLETED = new TitanErrorCodes(
        TitanErrorCodes.TournamentCompleted,
        'Tournament Completed',
        'TOURNAMENT_COMPLETED',
    );

    static readonly TOURNAMENT_CANCELLED = new TitanErrorCodes(
        TitanErrorCodes.TournamentCancelled,
        'Tournament Cancelled',
        'TOURNAMENT_CANCELLED',
    );

    static readonly PLAYER_CANNOT_REGISTER = new TitanErrorCodes(
        TitanErrorCodes.PlayerCannotRegister,
        'Player Cannot Register Now',
        'PLAYER_CANNOT_REGISTER',
    );

    static readonly PLAYER_ALREADY_PLAYING = new TitanErrorCodes(
        TitanErrorCodes.PlayerAlreadyPlaying,
        'Player Already Playing',
        'PLAYER_ALREADY_PLAYING',
    );

    static readonly PLAYER_CANNOT_REENTRY = new TitanErrorCodes(
        TitanErrorCodes.PlayerCannotReentry,
        'Player Cannot Reentry Now',
        'PLAYER_CANNOT_REENTRY',
    );


    static readonly TOURNAMENT_COMPLETED_OR_CANCELED = new TitanErrorCodes(
        TitanErrorCodes.TournamentCompletedOrCanceled,
        'Tournament completed or canceled',
        'TOURNAMENT_COMPLETED_OR_CANCELED',
    );

    static readonly TOURNAMENT_IS_ON_BREAK = new TitanErrorCodes(
        TitanErrorCodes.TournamentIsOnBreak,
        'Tournament is on break',
        'TOURNAMENT_IS_ON_BREAK',
    );

    static readonly TOURNAMENT_IS_ON_WAIT_FOR_BREAK = new TitanErrorCodes(
        TitanErrorCodes.TournamentIsOnWaitForBreak,
        'Tournament is on wait for break',
        'TOURNAMENT_IS_ON_WAIT_FOR_BREAK',
    );

    static readonly TOURNAMENT_LEVEL_ALREADY_STARTED = new TitanErrorCodes(
        TitanErrorCodes.TournamentLevelAlreadyStarted,
        'Tournament level already started',
        'TOURNAMENT_LEVEL_ALREADY_STARTED',
    );

    static readonly TOURNAMENT_LEVEL_ALREADY_PAUSED = new TitanErrorCodes(
        TitanErrorCodes.TournamentLevelAlreadyPaused,
        'Tournament level already paused',
        'TOURNAMENT_LEVEL_ALREADY_PAUSED',
    );

    static readonly TOURNAMENT_LEVEL_CANNOT_PAUSE = new TitanErrorCodes(
        TitanErrorCodes.TournamentLevelCannotPause,
        'Tournament level cannot pause',
        'TOURNAMENT_LEVEL_CANNOT_PAUSE',
    );

    static readonly TOURNAMENT_LEVEL_CANNOT_START = new TitanErrorCodes(
        TitanErrorCodes.TournamentLevelCannotStart,
        'Tournament level cannot start',
        'TOURNAMENT_LEVEL_CANNOT_START',
    );

    static readonly PLAYER_CANNOT_UNREGISTER_DURING_SEAT_ALLOCATION = new TitanErrorCodes(
        TitanErrorCodes.PlayerCannotUnregisterDuringSeatAllocation,
        `You cannot unregister from this tournament during seat allocation`,
        'PLAYER_CANNOT_UNREGISTER_DURING_SEAT_ALLOCATION',
    );


    private constructor(
        public code: number,
        public message: string,
        public name: string,
        public type?: string,
    ) {
    }

    toString(): string {
        return `${this.name}:${this.code}:${this.message}`;
    }
}

export default TitanErrorCodes;
