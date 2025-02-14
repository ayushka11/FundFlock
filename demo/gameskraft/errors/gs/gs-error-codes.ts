class GsErrorCodes {

	private static BaseErrorCode = 23000;
	static CashTableRuntimeError = GsErrorCodes.BaseErrorCode + 1;
	static CashTableCommandNotAvailable = GsErrorCodes.BaseErrorCode + 2;
	static CashTableSeatNotFound = GsErrorCodes.BaseErrorCode + 3;
	static CashTableWalletError = GsErrorCodes.BaseErrorCode + 4;
	static CashTableSystemUpgrade = GsErrorCodes.BaseErrorCode + 5;
	static CashTablePlayerPresentFromOtherDomain = GsErrorCodes.BaseErrorCode + 6;
	static CashTableSeatHasBeenReserved = GsErrorCodes.BaseErrorCode + 7;
	static CashTableUserAlreadySeated = GsErrorCodes.BaseErrorCode + 8;
	static CashTableBannedPlayer = GsErrorCodes.BaseErrorCode + 9;
	static CashTableIpConflict = GsErrorCodes.BaseErrorCode + 10;
	static CashTableTimerExpired = GsErrorCodes.BaseErrorCode + 11;
	static CashTablePlayerNotSeated = GsErrorCodes.BaseErrorCode + 12;
	static CashTableStackMoreThanMaxBuyIn = GsErrorCodes.BaseErrorCode + 13;
	static CashTableInsufficientFunds = GsErrorCodes.BaseErrorCode + 14;
	static CashTablePreviousTopupIsPending = GsErrorCodes.BaseErrorCode + 15;
	static CashTablePlayerNotSitOut = GsErrorCodes.BaseErrorCode + 16;
	static CashTableRebuyWithoutRequest = GsErrorCodes.BaseErrorCode + 17;
	static CashTablePlayerAlreadyInWaitQueue = GsErrorCodes.BaseErrorCode + 18;
	static CashTablePlayerLeaveTableInProgress = GsErrorCodes.BaseErrorCode + 19;
	static CashTablePlayerNotInWaitQueue = GsErrorCodes.BaseErrorCode + 20;
	static CashTablePlayerSeatingInProgress = GsErrorCodes.BaseErrorCode + 21;
	static CashTablePlayerRebuyInProgress = GsErrorCodes.BaseErrorCode + 22;
	static CashTablePlayerReserveInProgress = GsErrorCodes.BaseErrorCode + 23;
	static CashTableTopupInsufficientFunds = GsErrorCodes.BaseErrorCode + 24;
	static CashTablePlayerRebuyNotApplicable = GsErrorCodes.BaseErrorCode + 25;
	static CashTableTopupPlayerSitOut = GsErrorCodes.BaseErrorCode + 26;
	static CashTableInvalidPlatformData = GsErrorCodes.BaseErrorCode + 27;
	static CashTableJSONMarshal = GsErrorCodes.BaseErrorCode + 28;
	static CashTableJSONUnMarshal = GsErrorCodes.BaseErrorCode + 29;
	static CashTableShutdownRequestPending = GsErrorCodes.BaseErrorCode + 30;
	static CashTableRebootRequestPending = GsErrorCodes.BaseErrorCode + 31;
	static CashTableRITPopUpIsOver = GsErrorCodes.BaseErrorCode + 32;
	static CashTableNotRITParticipant = GsErrorCodes.BaseErrorCode + 33;
	static CashTableNoReservation = GsErrorCodes.BaseErrorCode + 34;
	static CashTableMaxTableLimitReached = GsErrorCodes.BaseErrorCode + 35;
	static InvalidRoomType = GsErrorCodes.BaseErrorCode + 36;

	static HallwayRuntimeError = GsErrorCodes.BaseErrorCode + 100;
	static HallwayCommunicationError = GsErrorCodes.BaseErrorCode + 101;
	static HallwayRoomNotAvailable = GsErrorCodes.BaseErrorCode + 102;
	static HallwayWalletError = GsErrorCodes.BaseErrorCode + 103;
	static HallwayNoTableAvailable = GsErrorCodes.BaseErrorCode + 104;
	static HallwayBannedPlayer = GsErrorCodes.BaseErrorCode + 105;
	static HallwayAlreadyJoinedPCT = GsErrorCodes.BaseErrorCode + 106;
	static HallwayInvalidPIN = GsErrorCodes.BaseErrorCode + 107;
	static HallwayInternalServerError = GsErrorCodes.BaseErrorCode + 108;
	static HallwayNonExistingPCT = GsErrorCodes.BaseErrorCode + 109;
	static HallwayRunExistingPCT = GsErrorCodes.BaseErrorCode + 110;
	static HallwayTableNotUnlocked = GsErrorCodes.BaseErrorCode + 111;
	static HallwayMaxTableReached = GsErrorCodes.BaseErrorCode + 112;

	static TournamentRunTimeError = GsErrorCodes.BaseErrorCode + 113;
	static TournamentCommandNotAvailable = GsErrorCodes.BaseErrorCode + 114;
	static TournamentUserAlreadyRegistered = GsErrorCodes.BaseErrorCode + 115;
	static TournamentRegistrationMaxLimitReached = GsErrorCodes.BaseErrorCode + 116;
	static TournamentPlayerRegisterationMaxLimitReached = GsErrorCodes.BaseErrorCode + 117
	static TournamentNotInRegistrationState = GsErrorCodes.BaseErrorCode + 118
	static TournamentNotRegistered = GsErrorCodes.BaseErrorCode + 119
	static TournamentCannotCancelInCurrentState = GsErrorCodes.BaseErrorCode + 120
	static TournamentAlreadyAborted = GsErrorCodes.BaseErrorCode + 121
	static TournamentCannotAbortInCurrentState = GsErrorCodes.BaseErrorCode + 122
	static TournamentUserNotLoggedIn = GsErrorCodes.BaseErrorCode + 123
	static TournamentUserNotValid = GsErrorCodes.BaseErrorCode + 124
	static TournamentUserInMttFromOtherDomain = GsErrorCodes.BaseErrorCode + 125
	static TournamentRebuyAlreadyInitiated = GsErrorCodes.BaseErrorCode + 126
	static TournamentStackMoreThanMinAllowed = GsErrorCodes.BaseErrorCode + 127
	static TournamentRebuyLimitExceeded = GsErrorCodes.BaseErrorCode + 128
	static TournamentRebuyTimeIsOver = GsErrorCodes.BaseErrorCode + 129
	static TournamentRebuyIsNotAllowed = GsErrorCodes.BaseErrorCode + 130
	static TournamentSeatNotFound = GsErrorCodes.BaseErrorCode + 131
	static TournamentPlayerNotSeated = GsErrorCodes.BaseErrorCode + 132
	static TournamentStackIsNonZero = GsErrorCodes.BaseErrorCode + 133
	static TournamentHandIsRunning = GsErrorCodes.BaseErrorCode + 134
	static TournamentAddOnAlreadyDone = GsErrorCodes.BaseErrorCode + 135
	static TournamentAddOnNotAllowed = GsErrorCodes.BaseErrorCode + 136
	static TournamentAlreadySittingOut = GsErrorCodes.BaseErrorCode + 137
	static TournamentEmptySeat = GsErrorCodes.BaseErrorCode + 138
	static TournamentWalletError = GsErrorCodes.BaseErrorCode + 139
	static TournamentInsufficientFund = GsErrorCodes.BaseErrorCode + 140
	static TournamentTicketNotValid = GsErrorCodes.BaseErrorCode + 141
	static TournamentUserIsBanned = GsErrorCodes.BaseErrorCode + 142
	static TournamentMSPNotFound = GsErrorCodes.BaseErrorCode + 143
	static TournamentMFPMisMatch = GsErrorCodes.BaseErrorCode + 144
	static TournamentMFPPlayerRegistrationNotPossible = GsErrorCodes.BaseErrorCode + 145
	static TournamentMFPPlayerCannotUnRegister = GsErrorCodes.BaseErrorCode + 146
	static TournamentUpdateNotPossible = GsErrorCodes.BaseErrorCode + 147
	static TournamentTableInvalidParam = GsErrorCodes.BaseErrorCode + 148
	static TournamentUserIsNotPresentInTournamentListingt = GsErrorCodes.BaseErrorCode + 149
	static TournamentInvalidConnectionMode = GsErrorCodes.BaseErrorCode + 150
	static TournamentSatelliteWinnerCannotUnRegister = GsErrorCodes.BaseErrorCode + 151
	static TournamentMaxTableLimitReached = GsErrorCodes.BaseErrorCode + 152
	static TournamentDoesNotExists = GsErrorCodes.BaseErrorCode + 153

	static MissingFingerprint = GsErrorCodes.BaseErrorCode + 200;
	static BadFingerprint = GsErrorCodes.BaseErrorCode + 201;
	static BadRoute = GsErrorCodes.BaseErrorCode + 202;
	static ExpiredFingerprint = GsErrorCodes.BaseErrorCode + 203;
	static InvalidFingerprint = GsErrorCodes.BaseErrorCode + 204;



	//Common Error
	static Error = GsErrorCodes.BaseErrorCode + 500;


	//4xx
	static UrlNotFound = GsErrorCodes.BaseErrorCode + 700;




	static RuntimeError = GsErrorCodes.BaseErrorCode + 1000;

	static readonly RUNTIME_ERROR = new GsErrorCodes(
		GsErrorCodes.CashTableRuntimeError,
		"Sorry, there's a problem on our end.We are fixing it.Please try again later.",
		'GAME_SERVER_RUNTIME_ERROR',
	);

	static readonly INVALID_ROOM_TYPE = new GsErrorCodes(
		GsErrorCodes.InvalidRoomType,
		"Room type is not correct.",
		'INVALID_ROOM_TYPE',
	);

	static readonly CASH_TABLE_RUNTIME_ERROR = new GsErrorCodes(
		GsErrorCodes.CashTableRuntimeError,
		"Sorry, there's a problem on our end.We are fixing it.Please try again later.",
		'CASH_TABLE_RUNTIME_ERROR',
	);

	static readonly CASH_TABLE_COMMAND_NOT_AVAILABLE = new GsErrorCodes(
		GsErrorCodes.CashTableCommandNotAvailable,
		"Sorry, there's a problem on our end.We are fixing it.Please try again later.",
		'CASH_TABLE_COMMAND_NOT_AVAILABLE_ERROR',
	);

	static readonly CASH_TABLE_SEAT_NOT_FOUND = new GsErrorCodes(
		GsErrorCodes.CashTableSeatNotFound,
		"Sorry, there's a problem on our end.We are fixing it.Please try again later.",
		'CASH_TABLE_SEAT_NOT_FOUND_ERROR',
	);

	static readonly CASH_TABLE_WALLET_ERROR = new GsErrorCodes(
		GsErrorCodes.CashTableWalletError,
		"Sorry, there's a problem on our end.We are fixing it.Please try again later.",
		'CASH_TABLE_WALLET_ERROR_ERROR',
	);

	static readonly CASH_TABLE_SYSTEM_UPGRADE = new GsErrorCodes(
		GsErrorCodes.CashTableSystemUpgrade,
		"We are upgrading our system to enhance your gameplay experience",
		'CASH_TABLE_SYSTEM_UPGRADE_ERROR',
	);

	static readonly CASH_TABLE_PLAYER_PRESENT_FROM_OTHER_DOMAIN = new GsErrorCodes(
		GsErrorCodes.CashTablePlayerPresentFromOtherDomain,
		"You are already seated at the table through another network partner ID.",
		'CASH_TABLE_PLAYER_PRESENT_FROM_OTHER_DOMAIN_ERROR',
	);

	static readonly CASH_TABLE_SEAT_HAS_BEEN_RESERVED = new GsErrorCodes(
		GsErrorCodes.CashTableSeatHasBeenReserved,
		"Your seat has been reserved.",
		'CASH_TABLE_SEAT_HAS_BEEN_RESERVED_ERROR',
	);

	static readonly CASH_TABLE_USER_ALREADY_SEATED = new GsErrorCodes(
		GsErrorCodes.CashTableUserAlreadySeated,
		"You are already seated at the table",
		'CASH_TABLE_USER_ALREADY_SEATED_ERROR',
	);

	static readonly CASH_TABLE_BANNED_PLAYER = new GsErrorCodes(
		GsErrorCodes.CashTableBannedPlayer,
		"Your gameplay access has been revoked.",
		'CASH_TABLE_BANNED_PLAYER_ERROR',
	);

	static readonly CASH_TABLE_IP_CONFLICT = new GsErrorCodes(
		GsErrorCodes.CashTableIpConflict,
		"Someone is already sitting in the room with same IP ",
		'CASH_TABLE_IP_CONFLICT_ERROR',
	);

	static readonly CASH_TABLE_TIMER_EXPIRED = new GsErrorCodes(
		GsErrorCodes.CashTableTimerExpired,
		"The buy-in pop-up timer has lapsed. Please try again.",
		'CASH_TABLE_TIMER_EXPIRED_ERROR',
	);

	static readonly CASH_TABLE_PLAYER_NOT_SEATED = new GsErrorCodes(
		GsErrorCodes.CashTablePlayerNotSeated,
		"You are not seated at the table",
		'CASH_TABLE_PLAYER_NOT_SEATED_ERROR',
	);

	static readonly CASH_TABLE_STACK_MORE_THAN_MAX_BUY_IN = new GsErrorCodes(
		GsErrorCodes.CashTableStackMoreThanMaxBuyIn,
		"Your current stack exceeds the maximum buy-in allowed for this table.",
		'CASH_TABLE_STACK_MORE_THAN_MAX_BUY_IN_ERROR',
	);

	static readonly CASH_TABLE_INSUFFICIENT_FUNDS = new GsErrorCodes(
		GsErrorCodes.CashTableInsufficientFunds,
		"Insufficient balance. Please deposit and retry",
		'CASH_TABLE_INSUFFICIENT_FUNDS_ERROR',
	);

	static readonly CASH_TABLE_PREVIOUS_TOP_UP_IS_PENDING = new GsErrorCodes(
		GsErrorCodes.CashTablePreviousTopupIsPending,
		"Your request for a top up is being processed",
		'CASH_TABLE_PREVIOUS_TOP_UP_IS_PENDING_ERROR',
	);

	static readonly CASH_TABLE_PLAYER_NOT_SIT_OUT = new GsErrorCodes(
		GsErrorCodes.CashTablePlayerNotSitOut,
		"Player is not sitting out currently",
		'CASH_TABLE_PLAYER_NOT_SIT_OUT_ERROR',
	);

	static readonly CASH_TABLE_RE_BUY_WITHOUT_REQUEST = new GsErrorCodes(
		GsErrorCodes.CashTableRebuyWithoutRequest,
		'ErrorMessageRebuyWithoutRequest',
		'CASH_TABLE_RE_BUY_WITHOUT_REQUEST_ERROR',
	);

	static readonly CASH_TABLE_PLAYER_ALREADY_IN_WAIT_QUEUE = new GsErrorCodes(
		GsErrorCodes.CashTablePlayerAlreadyInWaitQueue,
		"Player is already waiting in the wait-list to join the table",
		'CASH_TABLE_PLAYER_ALREADY_IN_WAIT_QUEUE_ERROR',
	);

	static readonly CASH_TABLE_PLAYER_LEAVE_TABLE_IN_PROGRESS = new GsErrorCodes(
		GsErrorCodes.CashTablePlayerLeaveTableInProgress,
		"Your request to leave the table is being processed",
		'CASH_TABLE_PLAYER_LEAVE_TABLE_IN_PROGRESS_ERROR',
	);

	static readonly CASH_TABLE_PLAYER_NOT_IN_WAIT_QUEUE = new GsErrorCodes(
		GsErrorCodes.CashTablePlayerNotInWaitQueue,
		"Player is not added in the wait-list queue",
		'CASH_TABLE_PLAYER_NOT_IN_WAIT_QUEUE_ERROR',
	);

	static readonly CASH_TABLE_PLAYER_SEATING_IN_PROGRESS = new GsErrorCodes(
		GsErrorCodes.CashTablePlayerSeatingInProgress,
		"Your request to be seated is being processed",
		'CASH_TABLE_PLAYER_SEATING_IN_PROGRESS_ERROR',
	);

	static readonly CASH_TABLE_PLAYER_RE_BUY_IN_PROGRESS = new GsErrorCodes(
		GsErrorCodes.CashTablePlayerRebuyInProgress,
		"Your rebuy request is being processed",
		'CASH_TABLE_PLAYER_RE_BUY_IN_PROGRESS_ERROR',
	);

	static readonly CASH_TABLE_PLAYER_RESERVE_IN_PROGRESS = new GsErrorCodes(
		GsErrorCodes.CashTablePlayerReserveInProgress,
		"Your reservation for a seat at the table is being processed",
		'CASH_TABLE_PLAYER_RESERVE_IN_PROGRESS_ERROR',
	);

	static readonly CASH_TABLE_TOP_UP_INSUFFICIENT_FUNDS = new GsErrorCodes(
		GsErrorCodes.CashTableTopupInsufficientFunds,
		"Your top-up request cannot be fulfilled as your wallet has insufficient funds",
		'CASH_TABLE_TOP_UP_INSUFFICIENT_FUNDS_ERROR',
	);

	static readonly CASH_TABLE_PLAYER_RE_BUY_NOT_APPLICABLE = new GsErrorCodes(
		GsErrorCodes.CashTablePlayerRebuyNotApplicable,
		"Rebuys are not permitted in cash games",
		'APPLICATION_RUNTIME_ERROR_ERROR',
	);

	static readonly CASH_TABLE_TOP_UP_PLAYER_SIT_OUT = new GsErrorCodes(
		GsErrorCodes.CashTableTopupPlayerSitOut,
		"Top-ups are not allowed while the player is in sit-out mode",
		'CASH_TABLE_TOP_UP_PLAYER_NOT_SIT_OUT_ERROR',
	);

	static readonly CASH_TABLE_INVALID_PLATFORM_DATA = new GsErrorCodes(
		GsErrorCodes.CashTableInvalidPlatformData,
		"Sorry, there's a problem on our end. We are fixing it. Please try again later.",
		'CASH_TABLE_INVALID_PLATFORM_DATA_ERROR',
	);

	static readonly CASH_TABLE_JSON_MARSHAL = new GsErrorCodes(
		GsErrorCodes.CashTableJSONMarshal,
		'Something went wrong',
		'CASH_TABLE_JSON_MARSHAL_ERROR',
	);

	static readonly CASH_TABLE_JSON_UN_MARSHAL = new GsErrorCodes(
		GsErrorCodes.CashTableJSONUnMarshal,
		'Something went wrong',
		'CASH_TABLE_JSON_UN_MARSHAL_ERROR',
	);

	static readonly CASH_TABLE_SHUTDOWN_REQUEST_PENDING = new GsErrorCodes(
		GsErrorCodes.CashTableShutdownRequestPending,
		'Something went wrong_ERROR',
		'CASH_TABLE_SHUTDOWN_REQUEST_PENDING_ERROR',
	);

	static readonly CASH_TABLE_REBOOT_REQUEST_PENDING = new GsErrorCodes(
		GsErrorCodes.CashTableRebootRequestPending,
		'Something went wrong_ERROR',
		'CASH_TABLE_REBOOT_REQUEST_PENDING_ERROR',
	);

	static readonly CASH_TABLE_RIT_POP_UP_IS_OVER = new GsErrorCodes(
		GsErrorCodes.CashTableRITPopUpIsOver,
		'Something went wrong_ERROR',
		'CASH_TABLE_RIT_POP_UP_IS_OVER_ERROR',
	);

	static readonly CASH_TABLE_NOT_RIT_PARTICIPANT = new GsErrorCodes(
		GsErrorCodes.CashTableNotRITParticipant,
		'Something went wrong_ERROR',
		'CASH_TABLE_NOT_RIT_PARTICIPANT_ERROR',
	);

	static readonly CASH_TABLE_NO_RESERVATION = new GsErrorCodes(
		GsErrorCodes.CashTableNoReservation,
		'Something went wrong_ERROR',
		'CASH_TABLE_NO_RESERVATION_ERROR',
	);

	static readonly CASH_TABLE_MAX_TABLE_LIMIT_REACHED = new GsErrorCodes(
		GsErrorCodes.CashTableMaxTableLimitReached,
		'Something went wrong_ERROR',
		'CASH_TABLE_MAX_TABLE_LIMIT_REACHED_ERROR',
	);

	static readonly HALLWAY_RUNTIME_ERROR = new GsErrorCodes(
		GsErrorCodes.HallwayRuntimeError,
		"Sorry, there's a problem on our end. We are fixing it. Please try again later.",
		'HALLWAY_RUNTIME_ERROR',
	);

	static readonly HALLWAY_COMMUNICATION_ERROR = new GsErrorCodes(
		GsErrorCodes.HallwayCommunicationError,
		"Sorry, there's a problem on our end. We are fixing it. Please try again later.",
		'HALLWAY_COMMUNICATION_ERROR',
	);

	static readonly HALLWAY_ROOM_NOT_AVAILABLE = new GsErrorCodes(
		GsErrorCodes.HallwayRoomNotAvailable,
		"Sorry, no cash games are available at the moment.",
		'HALLWAY_ROOM_NOT_AVAILABLE',
	);

	static readonly HALLWAY_WALLET_ERROR = new GsErrorCodes(
		GsErrorCodes.HallwayWalletError,
		"Sorry, there's a problem on our end. We are fixing it. Please try again later.",
		'HALLWAY_WALLET_ERROR',
	);

	static readonly HALLWAY_NO_TABLE_AVAILABLE = new GsErrorCodes(
		GsErrorCodes.HallwayNoTableAvailable,
		"Sorry, we are facing difficulty in seating you. Please retry.",
		'HALLWAY_NO_TABLE_AVAILABLE_ERROR',
	);

	static readonly HALLWAY_BANNED_PLAYER = new GsErrorCodes(
		GsErrorCodes.HallwayBannedPlayer,
		"Your gameplay access has been revoked.",
		'HALLWAY_BANNED_PLAYER_ERROR',
	);

	static readonly HALLWAY_ALREADY_JOINED_PCT = new GsErrorCodes(
		GsErrorCodes.HallwayAlreadyJoinedPCT,
		'Something went wrong',
		'HALLWAY_ALREADY_JOINED_PCT',
	);

	static readonly HALLWAY_INVALID_PIN = new GsErrorCodes(
		GsErrorCodes.HallwayInvalidPIN,
		"Please enter valid Table PIN",
		'HALLWAY_INVALID_PIN',
	);

	static readonly HALLWAY_INTERNAL_SERVER_ERROR = new GsErrorCodes(
		GsErrorCodes.HallwayInternalServerError,
		'Something went wrong',
		'HALLWAY_INTERNAL_SERVER_ERROR',
	);

	static readonly HALLWAY_NON_EXISTING_PCT = new GsErrorCodes(
		GsErrorCodes.HallwayNonExistingPCT,
		"This table has expired",
		'HALLWAY_NON_EXISTING_PCT_ERROR',
	);

	static readonly HALLWAY_RUN_EXISTING_PCT = new GsErrorCodes(
		GsErrorCodes.HallwayRunExistingPCT,
		'Something went wrong',
		'HALLWAY_RUN_EXISTING_PCT_ERROR',
	);

	static readonly HALLWAY_TABLE_NOT_UNLOCKED = new GsErrorCodes(
		GsErrorCodes.HallwayTableNotUnlocked,
		'Something went wrong',
		'HALLWAY_TABLE_NOT_UNLOCKED_ERROR',
	);

	static readonly HALLWAY_MAX_TABLE_REACHED = new GsErrorCodes(
		GsErrorCodes.HallwayMaxTableReached,
		'Something went wrong',
		'HALLWAY_MAX_TABLE_REACHED',
	);


	static readonly TOURNAMENT_RUN_TIME_ERROR = new GsErrorCodes(
		GsErrorCodes.TournamentRunTimeError ,
		"Sorry, there's a problem on our end.We are fixing it.Please try again later.",
		'TOURNAMENT_RUN_TIME_ERROR'
	);

	static readonly TOURNAMENT_DOES_NOT_EXIST = new GsErrorCodes(
		GsErrorCodes.TournamentDoesNotExists ,
		"Sorry, this tournament is not active at the moment.",
		'TOURNAMENT_DOES_NOT_EXIST'
	);

	static readonly TOURNAMENT_COMMAND_NOT_AVAILABLE = new GsErrorCodes(
		GsErrorCodes.TournamentCommandNotAvailable ,
		"Sorry, there's a problem on our end. We are fixing it. Please try again later.",
		'TOURNAMENT_COMMAND_NOT_AVAILABLE'
	);

	static readonly TOURNAMENT_USER_ALREADY_REGISTERED = new GsErrorCodes(
		GsErrorCodes.TournamentUserAlreadyRegistered ,
		"You have already registered for this tournament ",
		'TOURNAMENT_USER_ALREADY_REGISTERED'
	);

	static readonly TOURNAMENT_REGISTRATION_MAX_LIMIT_REACHED = new GsErrorCodes(
		GsErrorCodes.TournamentRegistrationMaxLimitReached ,
		"Registration is closed as the tournament has reached its maximum capacity of players",
		'TOURNAMENT_REGISTRATION_MAX_LIMIT_REACHED'
	);

	static readonly TOURNAMENT_PLAYER_REGISTRATION_MAX_LIMIT_REACHED = new GsErrorCodes(
		GsErrorCodes.TournamentPlayerRegisterationMaxLimitReached ,
		"Sorry, you have reached the maximum number of re-entries for this tournament.",
		'TOURNAMENT_PLAYER_REGISTRATION_MAX_LIMIT_REACHED'
	);

	static readonly TOURNAMENT_NOT_IN_REGISTRATION_STATE = new GsErrorCodes(
		GsErrorCodes.TournamentNotInRegistrationState ,
		'Sorry, registration for the tournament is not currently available.',
		'TOURNAMENT_NOT_IN_REGISTRATION_STATE'
	);

	static readonly TOURNAMENT_NOT_REGISTERED = new GsErrorCodes(
		GsErrorCodes.TournamentNotRegistered ,
		'Sorry, registration is unavailable at the moment. Please try again later.',
		'TOURNAMENT_NOT_REGISTERED'
	);

	static readonly TOURNAMENT_CANNOT_CANCEL_IN_CURRENT_STATE = new GsErrorCodes(
		GsErrorCodes.TournamentCannotCancelInCurrentState,
		"Sorry, there's a problem on our end.We are fixing it.Please try again later.",
		'TOURNAMENT_CANNOT_CANCEL_IN_CURRENT_STATE'
	);

	static readonly TOURNAMENT_ALREADY_ABORTED = new GsErrorCodes(
		GsErrorCodes.TournamentAlreadyAborted ,
		"Sorry, there's a problem on our end. We are fixing it. Please try again later.",
		'TOURNAMENT_ALREADY_ABORTED'
	);

	static readonly TOURNAMENT_CANNOT_ABORT_IN_CURRENT_STATE = new GsErrorCodes(
		GsErrorCodes.TournamentCannotAbortInCurrentState ,
		"Sorry, there's a problem on our end. We are fixing it. Please try again later.",
		'TOURNAMENT_CANNOT_ABORT_IN_CURRENT_STATE'
	);

	static readonly TOURNAMENT_USER_NOT_LOGGED_IN = new GsErrorCodes(
		GsErrorCodes.TournamentUserNotLoggedIn ,
		'You are not logged in. Please login and try again.',
		'TOURNAMENT_USER_NOT_LOGGED_IN'
	);

	static readonly TOURNAMENT_USER_NOT_VALID = new GsErrorCodes(
		GsErrorCodes.TournamentUserNotValid ,
		"Sorry, there's a problem on our end.We are fixing it.Please try again later.",
		'TOURNAMENT_USER_NOT_VALID'
	);

	static readonly TOURNAMENT_USER_IN_MTT_FROM_OTHER_DOMAIN = new GsErrorCodes(
		GsErrorCodes.TournamentUserInMttFromOtherDomain ,
		"You are already registered for the tournament from another Network Partner.",
		'TOURNAMENT_USER_IN_MTT_FROM_OTHER_DOMAIN'
	);

	static readonly TOURNAMENT_REBUY_ALREADY_INITIATED = new GsErrorCodes(
		GsErrorCodes.TournamentRebuyAlreadyInitiated ,
		"Your rebuy request is being processed",
		'TOURNAMENT_REBUY_ALREADY_INITIATED'
	);

	static readonly TOURNAMENT_STACK_MORE_THAN_MIN_ALLOWED = new GsErrorCodes(
		GsErrorCodes.TournamentStackMoreThanMinAllowed ,
		"Rebuy failed due to your stack exceeding minimum threshold.",
		'TOURNAMENT_STACK_MORE_THAN_MIN_ALLOWED'
	);

	static readonly TOURNAMENT_REBUY_LIMIT_EXCEEDED = new GsErrorCodes(
		GsErrorCodes.TournamentRebuyLimitExceeded ,
		"You have used the maximum rebuy attempts for this tournament ",
		'TOURNAMENT_REBUY_LIMIT_EXCEEDED'
	);

	static readonly TOURNAMENT_REBUY_TIME_IS_OVER = new GsErrorCodes(
		GsErrorCodes.TournamentRebuyTimeIsOver ,
		"Rebuy period has ended",
		'TOURNAMENT_REBUY_TIME_IS_OVER'
	);

	static readonly TOURNAMENT_REBUY_IS_NOT_ALLOWED = new GsErrorCodes(
		GsErrorCodes.TournamentRebuyIsNotAllowed ,
		"Rebuy is not allowed, period has ended",
		'TOURNAMENT_REBUY_IS_NOT_ALLOWED'
	);

	static readonly TOURNAMENT_SEAT_NOT_FOUND = new GsErrorCodes(
		GsErrorCodes.TournamentSeatNotFound,
		"Sorry, there are no available seats for the tournament at this time. Please try again later.",
		'TOURNAMENT_SEAT_NOT_FOUND'
	);

	static readonly TOURNAMENT_PLAYER_NOT_SEATED = new GsErrorCodes(
		GsErrorCodes.TournamentPlayerNotSeated ,
		"Sorry, you cannot perform this action while in observe mode. Please join a tournament first.",
		'TOURNAMENT_PLAYER_NOT_SEATED'
	);

	static readonly TOURNAMENT_STACK_IS_NON_ZERO = new GsErrorCodes(
		GsErrorCodes.TournamentStackIsNonZero ,
		"Your current stack is not Zero.",
		'TOURNAMENT_STACK_IS_NON_ZERO'
	);

	static readonly TOURNAMENT_HAND_IS_RUNNING = new GsErrorCodes(
		GsErrorCodes.TournamentHandIsRunning ,
		"Sorry, the current hand is in progress and cannot be interrupted. Please try again later.",
		'TOURNAMENT_HAND_IS_RUNNING'
	);

	static readonly TOURNAMENT_ADDON_ALREADY_DONE = new GsErrorCodes(
		GsErrorCodes. TournamentAddOnAlreadyDone,
		"Your add on request has been processed already",
		'TOURNAMENT_ADDON_ALREADY_DONE'
	);

	static readonly TOURNAMENT_ADDON_NOT_ALLOWED = new GsErrorCodes(
		GsErrorCodes.TournamentAddOnNotAllowed ,
		"Sorry, Add on is not allowed",
		'TOURNAMENT_ADDON_NOT_ALLOWED'
	);

	static readonly TOURNAMENT_ALREADY_SITTING_OUT = new GsErrorCodes(
		GsErrorCodes.TournamentAlreadySittingOut ,
		"You are already sitting out",
		'TOURNAMENT_ALREADY_SITTING_OUT'
	);

	static readonly TOURNAMENT_EMPTY_SEAT = new GsErrorCodes(
		GsErrorCodes.TournamentEmptySeat ,
		"Sorry, you cannot perform this action while in observe mode. Please join a tournament first.",
		'TOURNAMENT_EMPTY_SEAT'
	);

	static readonly TOURNAMENT_WALLET_ERROR = new GsErrorCodes(
		GsErrorCodes.TournamentWalletError,
		"Sorry, there's a problem on our end. We are fixing it. Please try again later.",
		'TOURNAMENT_WALLET_ERROR'
	);

	static readonly TOURNAMENT_INSUFFICIENT_FUND = new GsErrorCodes(
		GsErrorCodes.TournamentInsufficientFund ,
		"Insufficient funds. Please deposit and retry",
		'TOURNAMENT_INSUFFICIENT_FUND'
	);

	static readonly TOURNAMENT_TICKET_NOT_VALID = new GsErrorCodes(
		GsErrorCodes.TournamentTicketNotValid ,
		"Invalid tournament entry ticket",
		'TOURNAMENT_TICKET_NOT_VALID'
	);

	static readonly TOURNAMENT_USER_IS_BANNED = new GsErrorCodes(
		GsErrorCodes.TournamentUserIsBanned ,
		"Your access to gameplay has been revoked",
		'TOURNAMENT_USER_IS_BANNED'
	);

	static readonly TOURNAMENT_MSP_NOT_FOUND = new GsErrorCodes(
		GsErrorCodes.TournamentMSPNotFound,
		"The MSP is not found for the current flight",
		'TOURNAMENT_MSP_NOT_FOUND'
	);

	static readonly TOURNAMENT_MFP_MISMATCH = new GsErrorCodes(
		GsErrorCodes.TournamentMFPMisMatch ,
		"Join the MFP by participating in starting flights. See the lobby for further information.",
		'TOURNAMENT_MFP_MISMATCH'
	);

	static readonly TOURNAMENT_MFP_PLAYER_REGISTRATION_NOT_POSSIBLE = new GsErrorCodes(
		GsErrorCodes.TournamentMFPPlayerRegistrationNotPossible,
		"You've qualified directly for the MSP through the flights and cannot withdraw from the tournament",
		'TOURNAMENT_MFP_PLAYER_REGISTRATION_NOT_POSSIBLE'
	);

	static readonly TOURNAMENT_MFP_PLAYER_CANNOT_UNREGISTER = new GsErrorCodes(
		GsErrorCodes.TournamentMFPPlayerCannotUnRegister ,
		"You've qualified directly for the MSP through the flights and cannot withdraw from the tournament",
		'TOURNAMENT_MFP_PLAYER_CANNOT_UNREGISTER'
	);

	static readonly TOURNAMENT_UPDATE_NOT_POSSIBLE = new GsErrorCodes(
		GsErrorCodes.TournamentUpdateNotPossible ,
		"Sorry, there's a problem on our end. We are fixing it. Please try again later.",
		'TOURNAMENT_UPDATE_NOT_POSSIBLE'
	);

	static readonly TOURNAMENT_TABLE_INVALID_PARAM = new GsErrorCodes(
		GsErrorCodes.TournamentTableInvalidParam ,
		"Sorry, there's a problem on our end. We are fixing it. Please try again later.",
		'TOURNAMENT_TABLE_INVALID_PARAM'
	);

	static readonly TOURNAMENT_USER_IS_NOT_PRESENT_IN_TOURNAMENT_LISTING = new GsErrorCodes(
		GsErrorCodes.TournamentUserIsNotPresentInTournamentListingt ,
		"Sorry, there's a problem on our end. We are fixing it. Please try again later.",
		'TOURNAMENT_USER_IS_NOT_PRESENT_IN_TOURNAMENT_LISTING'
	);

	static readonly TOURNAMENT_INVALID_CONNECTION_MODE = new GsErrorCodes(
		GsErrorCodes.TournamentInvalidConnectionMode ,
		"Sorry, there's a problem on our end. We are fixing it. Please try again later.",
		'TOURNAMENT_INVALID_CONNECTION_MODE'
	);

	static readonly TOURNAMENT_SATELLITE_WINNER_CANNOT_UNREGISTER = new GsErrorCodes(
		GsErrorCodes.TournamentSatelliteWinnerCannotUnRegister,
		"You have entered the tournament after winning a satellite, unregistering is not permitted.",
		'TOURNAMENT_SATELLITE_WINNER_CANNOT_UNREGISTER'
	);

	static readonly TOURNAMENT_MAX_TABLE_LIMIT_REACHED = new GsErrorCodes(
		GsErrorCodes.TournamentMaxTableLimitReached,
		"Sorry, there's a problem on our end. We are fixing it. Please try again later.",
		'TOURNAMENT_MAX_TABLE_LIMIT_REACHED'
	);

	static readonly MISSING_FINGERPRINT = new GsErrorCodes(
		GsErrorCodes.MissingFingerprint,
		'Authorisation Error',
		'MISSING_FINGERPRINT',
	);

	static readonly BAD_FINGERPRINT = new GsErrorCodes(
		GsErrorCodes.BadFingerprint,
		'Authorisation Error',
		'BAD_FINGERPRINT',
	);

	static readonly BAD_ROUTE = new GsErrorCodes(
		GsErrorCodes.BadRoute,
		'Authorisation Error',
		'BAD_ROUTE',
	);

	static readonly EXPIRED_FINGERPRINT = new GsErrorCodes(
		GsErrorCodes.ExpiredFingerprint,
		'Authorisation Error',
		'EXPIRED_FINGERPRINT',
	);

	static readonly INVALID_FINGERPRINT = new GsErrorCodes(
		GsErrorCodes.InvalidFingerprint,
		'Authorisation Error',
		'INVALID_FINGERPRINT',
	);

	static readonly ERROR = new GsErrorCodes(
		GsErrorCodes.Error,
		'Something went wrong',
		'ERROR',
	);

	static readonly URL_NOT_FOUND = new GsErrorCodes(
		GsErrorCodes.UrlNotFound,
		"Sorry, there's a problem on our end. We are fixing it. Please try again later.",
		'URL_NOT_FOUND',
	);


	private constructor(
		public code: number,
		public message: string,
		public name: string,
		public type?: string,
	) { }
	toString(): string {
		return `${this.name}:${this.code}:${this.message}`;
	}
}

export default GsErrorCodes;