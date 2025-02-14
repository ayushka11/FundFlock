class AriesErrorCodes {

	private static BaseErrorCode = 30000;
	static RuntimeError = AriesErrorCodes.BaseErrorCode + 1;
	static GameplayBanned = AriesErrorCodes.BaseErrorCode + 2;
	static InvalidRoomType = AriesErrorCodes.BaseErrorCode + 3;
	static RoomNotAvailable = AriesErrorCodes.BaseErrorCode + 4;
	static UnableToFindTable = AriesErrorCodes.BaseErrorCode + 5;
	static UserNotOnTable = AriesErrorCodes.BaseErrorCode + 6;
	static TopupRequestAlreadyExists = AriesErrorCodes.BaseErrorCode + 7;
	static InvalidTopupRequestSitout = AriesErrorCodes.BaseErrorCode + 8;
	static InvalidTopupRequestEnableSitout = AriesErrorCodes.BaseErrorCode + 9;
	static InsufficientWalletBalance = AriesErrorCodes.BaseErrorCode + 10;
	static InvalidReserveCashGameTableRequest = AriesErrorCodes.BaseErrorCode + 11;
	static InvalidJoinCashGameTableBuyinAmount = AriesErrorCodes.BaseErrorCode + 12;
	static InvalidJoinCashGameTableRequest = AriesErrorCodes.BaseErrorCode + 13;
	static InvalidLeaveCashGameTableRequest = AriesErrorCodes.BaseErrorCode + 14;
	static InvalidSettleCashGameHandRequest = AriesErrorCodes.BaseErrorCode + 15;
	static InvalidSettleCashGameHandUsers = AriesErrorCodes.BaseErrorCode + 16;
	static InvalidTopupCashGameTableTopupAmount = AriesErrorCodes.BaseErrorCode + 17;
	static InvalidTopupCashGameTableMaxBuyIn = AriesErrorCodes.BaseErrorCode + 18;
	static InvalidTopupCashGameTableInsufficientBalance = AriesErrorCodes.BaseErrorCode + 19;
	static InvalidTopupCashGameTableCurrentStack = AriesErrorCodes.BaseErrorCode + 20;
	static InvalidCompleteCashGameTableTopupAmount = AriesErrorCodes.BaseErrorCode + 21;
	static InvalidRebuyCashGameTableRebuyAmount = AriesErrorCodes.BaseErrorCode + 22;
	static InvalidRebuyCashGameTableRequest = AriesErrorCodes.BaseErrorCode + 23;
	static InvalidReservePracticeGameTableRequest = AriesErrorCodes.BaseErrorCode + 24;
	static InvalidJoinPracticeGameTableBuyinAmount = AriesErrorCodes.BaseErrorCode + 25;
	static InvalidJoinPracticeGameTableRequest = AriesErrorCodes.BaseErrorCode + 26;
	static InvalidLeavePracticeGameTableRequest = AriesErrorCodes.BaseErrorCode + 27;
	static InvalidSettlePracticeGameHandRequest = AriesErrorCodes.BaseErrorCode + 28;
	static InvalidSettlePracticeGameHandUsers = AriesErrorCodes.BaseErrorCode + 29;
	static InvalidTopupPracticeGameTableTopupAmount = AriesErrorCodes.BaseErrorCode + 30;
	static InvalidTopupPracticeGameTableMaxBuyIn = AriesErrorCodes.BaseErrorCode + 31;
	static InvalidTopupPracticeGameTableInsufficientBalance = AriesErrorCodes.BaseErrorCode + 32;
	static InvalidTopupPracticeGameTableCurrentStack = AriesErrorCodes.BaseErrorCode + 33;
	static InvalidCompletePracticeGameTableTopupAmount = AriesErrorCodes.BaseErrorCode + 34;
	static InvalidRebuyPracticeGameTableRebuyAmount = AriesErrorCodes.BaseErrorCode + 35;
	static InvalidRebuyPracticeGameTableRequest = AriesErrorCodes.BaseErrorCode + 36;
	static UserAlreadyOnTable = AriesErrorCodes.BaseErrorCode + 37;
	static PlayerNotAvailableOnTable = AriesErrorCodes.BaseErrorCode + 38;
	static PlayerAlreadyLeft = AriesErrorCodes.BaseErrorCode + 39;
	static SeatNotOccupied = AriesErrorCodes.BaseErrorCode + 40;
	static SeatAlreadyOccupied = AriesErrorCodes.BaseErrorCode + 41;
	static SeatNotReserved = AriesErrorCodes.BaseErrorCode + 42;
	static PlayerSeatEmpty = AriesErrorCodes.BaseErrorCode + 43;
	static InvalidSeatId = AriesErrorCodes.BaseErrorCode + 44;
	static InvalidPlayerOnSeat = AriesErrorCodes.BaseErrorCode + 45;
	static NoEmptySeatFound = AriesErrorCodes.BaseErrorCode + 46;
	static SeatNotEmpty = AriesErrorCodes.BaseErrorCode + 47;
	static ReserveTableLimitReached = AriesErrorCodes.BaseErrorCode + 48;
	static GroupNotAvailable = AriesErrorCodes.BaseErrorCode + 49;
	static InvalidGroupType = AriesErrorCodes.BaseErrorCode + 50;
	static UserNotEligibleToSitOnTable = AriesErrorCodes.BaseErrorCode + 51;
	static PrimaryRoomNotAvailable = AriesErrorCodes.BaseErrorCode + 52;

	static MaxPlayersReached = AriesErrorCodes.BaseErrorCode + 53;
	static TournamentNotInRegistrationPhase = AriesErrorCodes.BaseErrorCode + 54;
	static PlayerAlreadyRegistered = AriesErrorCodes.BaseErrorCode + 55;
	static InvalidVendorId = AriesErrorCodes.BaseErrorCode + 56;
	static InvalidRegisterBuyinMethod = AriesErrorCodes.BaseErrorCode + 57;

	static InvalidReentryBuyinMethod = AriesErrorCodes.BaseErrorCode + 58;
	static MaxReentryLimitReached = AriesErrorCodes.BaseErrorCode + 59;
	static PlayerNotRegistered = AriesErrorCodes.BaseErrorCode + 60;
	static ReenterNotAllowed = AriesErrorCodes.BaseErrorCode + 61;


	static readonly RUNTIME_ERROR = new AriesErrorCodes(
		AriesErrorCodes.RuntimeError,
		'Something went wrong',
		'APPLICATION_RUNTIME_ERROR',
	);

	static readonly GAMEPLAY_BANNED = new AriesErrorCodes(
		AriesErrorCodes.GameplayBanned,
		'Your gameplay has been suspended. Kindly reach out to our customer support team at 1800-121-663322.',
		'GAMEPLAY_BANNED',
	);

	static readonly INVALID_ROOM_TYPE = new AriesErrorCodes(
		AriesErrorCodes.InvalidRoomType,
		'Invalid room type.',
		'INVALID_ROOM_TYPE',
	);

	static readonly INVALID_GROUP_TYPE = new AriesErrorCodes(
		AriesErrorCodes.InvalidGroupType,
		'Invalid group type.',
		'INVALID_GROUP_TYPE',
	);

	static readonly ROOM_NOT_AVAILABLE = new AriesErrorCodes(
		AriesErrorCodes.RoomNotAvailable,
		'This room is not available.',
		'ROOM_NOT_AVAILABLE',
	);

	static readonly GROUP_NOT_AVAILABLE = new AriesErrorCodes(
		AriesErrorCodes.GroupNotAvailable,
		'This group is not available.',
		'GROUP_NOT_AVAILABLE',
	);

	static readonly UNABLE_TO_FIND_TABLE = new AriesErrorCodes(
		AriesErrorCodes.UnableToFindTable,
		'This table is not available.',
		'UNABLE_TO_FIND_TABLE',
	);

	static readonly USER_NOT_ON_TABLE = new AriesErrorCodes(
		AriesErrorCodes.UserNotOnTable,
		'You are not on this table.',
		'USER_NOT_ON_TABLE',
	);

	static readonly  USER_NOT_ELIGIBLE_TO_SIT_ON_TABLE = new AriesErrorCodes(
		AriesErrorCodes.UserNotEligibleToSitOnTable,
		'You are not permitted to sit on this table. Please select any other table.',
		'USER_NOT_ELIGIBLE_TO_SIT_ON_TABLE',
	);

	static readonly TOPUP_REQUEST_ALREADY_EXISTS = new AriesErrorCodes(
		AriesErrorCodes.TopupRequestAlreadyExists,
		'Topup request already in progress.',
		'TOPUP_REQUEST_ALREADY_EXIST',
	);

	static readonly INVALID_TOPUP_REQUEST_SITOUT = new AriesErrorCodes(
		AriesErrorCodes.InvalidTopupRequestSitout,
		'Toup request is not allowed in sitout mode.',
		'INVALID_TOPUP_REQUEST_SITOUT',
	);

	static readonly INVALID_TOPUP_REQUEST_ENABLE_SITOUT = new AriesErrorCodes(
		AriesErrorCodes.InvalidTopupRequestEnableSitout,
		'Topup Request is not allowed as you will be sitout in next hand.',
		'INVALID_TOPUP_REQUEST_ENABLE_SITOUT',
	);

	static readonly INSUFFICIENT_WALLET_BALANCE = new AriesErrorCodes(
		AriesErrorCodes.InsufficientWalletBalance,
		'You have insufficient balance in your wallet.',
		'INSUFFICIENT_WALLET_BALANCE',
	);

	static readonly INVALID_RESERVE_CASH_GAME_TABLE_REQUEST = new AriesErrorCodes(
		AriesErrorCodes.InvalidReserveCashGameTableRequest,
		'Your request to reserve a seat on this table cannot be processed.',
		'INVALID_RESERVE_CASH_GAME_TABLE_REQUEST',
	);

	static readonly INVALID_JOIN_CASH_GAME_TABLE_BUYIN_AMOUNT = new AriesErrorCodes(
		AriesErrorCodes.InvalidJoinCashGameTableBuyinAmount,
		'Your request to join this table cannot be processed.',
		'INVALID_JOIN_CASH_GAME_TABLE_BUYIN_AMOUNT',
	);

	static readonly INVALID_JOIN_CASH_GAME_TABLE_REQUEST = new AriesErrorCodes(
		AriesErrorCodes.InvalidJoinCashGameTableRequest,
		'Your request to join this table cannot be processed.',
		'INVALID_JOIN_CASH_GAME_TABLE_REQUEST',
	);

	static readonly INVALID_LEAVE_CASH_GAME_TABLE_REQUEST = new AriesErrorCodes(
		AriesErrorCodes.InvalidLeaveCashGameTableRequest,
		'Your request to leave this table cannot be processed.',
		'INVALID_LEAVE_CASH_GAME_TABLE_REQUEST',
	);

	static readonly INVALID_SETTLE_CASH_GAME_HAND_REQUEST = new AriesErrorCodes(
		AriesErrorCodes.InvalidSettleCashGameHandRequest,
		'Your request to settle this hand cannot be processed.',
		'INVALID_SETTLE_CASH_GAME_HAND_REQUEST',
	);

	static readonly INVALID_SETTLE_CASH_GAME_HAND_USERS = new AriesErrorCodes(
		AriesErrorCodes.InvalidSettleCashGameHandUsers,
		'Your request to settle this hand cannot be processed.',
		'INVALID_SETTLE_CASH_GAME_HAND_USERS',
	);

	static readonly INVALID_TOPUP_CASH_GAME_TABLE_TOPUP_AMOUNT = new AriesErrorCodes(
		AriesErrorCodes.InvalidTopupCashGameTableTopupAmount,
		'Your Top-up request could not be completed due to Invalid Top-up Amount.',
		'INVALID_TOPUP_CASH_GAME_TABLE_TOPUP_AMOUNT',
	);

	static readonly INVALID_TOPUP_CASH_GAME_TABLE_MAX_BUY_IN = new AriesErrorCodes(
		AriesErrorCodes.InvalidTopupCashGameTableMaxBuyIn,
		'Top-up request cannot be made. Your stack exceeds the maximum Buy-In limit.',
		'INVALID_TOPUP_CASH_GAME_TABLE_MAX_BUY_IN',
	);

	static readonly INVALID_TOPUP_CASH_GAME_TABLE_INSUFFICIENT_BALANCE = new AriesErrorCodes(
		AriesErrorCodes.InvalidTopupCashGameTableInsufficientBalance,
		'Top-up request denied due to Insufficient Funds in your wallet.',
		'INVALID_TOPUP_CASH_GAME_TABLE_INSUFFICIENT_BALANCE',
	);

	static readonly INVALID_TOPUP_CASH_GAME_TABLE_CURRENT_STACK = new AriesErrorCodes(
		AriesErrorCodes.InvalidTopupCashGameTableCurrentStack,
		'Top-up not allowed. Your Current Stack Exceeds the requested amount.',
		'INVALID_TOPUP_CASH_GAME_TABLE_CURRENT_STACK',
	);

	static readonly INVALID_COMPLETE_CASH_GAME_TABLE_TOPUP_AMOUNT = new AriesErrorCodes(
		AriesErrorCodes.InvalidCompleteCashGameTableTopupAmount,
		'Your Top-up request could not be completed due to Invalid Top-up Amount.',
		'INVALID_COMPLETE_CASH_GAME_TABLE_TOPUP_AMOUNT',
	);

	static readonly INVALID_REBUY_CASH_GAME_TABLE_REBUY_AMOUNT = new AriesErrorCodes(
		AriesErrorCodes.InvalidRebuyCashGameTableRebuyAmount,
		'Rebuy request cannot be made. Your stack exceeds the maximum Buy-In limit.',
		'INVALID_REBUY_CASH_GAME_TABLE_REBUY_AMOUNT',
	);

	static readonly INVALID_REBUY_CASH_GAME_TABLE_REQUEST = new AriesErrorCodes(
		AriesErrorCodes.InvalidRebuyCashGameTableRequest,
		'Your request to rebuy cannot be processed.',
		'INVALID_REBUY_CASH_GAME_TABLE_REQUEST',
	);

	static readonly INVALID_RESERVE_PRACTICE_GAME_TABLE_REQUEST = new AriesErrorCodes(
		AriesErrorCodes.InvalidReservePracticeGameTableRequest,
		'Your request to reserve a seat on this table cannot be processed.',
		'INVALID_RESERVE_PRACTICE_GAME_TABLE_REQUEST',
	);

	static readonly INVALID_JOIN_PRACTICE_GAME_TABLE_BUYIN_AMOUNT = new AriesErrorCodes(
		AriesErrorCodes.InvalidJoinPracticeGameTableBuyinAmount,
		'Your request to join this table cannot be processed.',
		'INVALID_JOIN_PRACTICE_GAME_TABLE_BUYIN_AMOUNT',
	);

	static readonly INVALID_JOIN_PRACTICE_GAME_TABLE_REQUEST = new AriesErrorCodes(
		AriesErrorCodes.InvalidJoinPracticeGameTableRequest,
		'Your request to join this table cannot be processed.',
		'INVALID_JOIN_PRACTICE_GAME_TABLE_REQUEST',
	);

	static readonly INVALID_LEAVE_PRACTICE_GAME_TABLE_REQUEST = new AriesErrorCodes(
		AriesErrorCodes.InvalidLeavePracticeGameTableRequest,
		'Your request to leave this table cannot be processed.',
		'INVALID_LEAVE_PRACTICE_GAME_TABLE_REQUEST',
	);

	static readonly INVALID_SETTLE_PRACTICE_GAME_HAND_REQUEST = new AriesErrorCodes(
		AriesErrorCodes.InvalidSettlePracticeGameHandRequest,
		'Your request to settle this hand cannot be processed.',
		'INVALID_SETTLE_PRACTICE_GAME_HAND_REQUEST',
	);

	static readonly INVALID_SETTLE_PRACTICE_GAME_HAND_USERS = new AriesErrorCodes(
		AriesErrorCodes.InvalidSettlePracticeGameHandUsers,
		'Your request to settle this hand cannot be processed.',
		'INVALID_SETTLE_PRACTICE_GAME_HAND_USERS',
	);

	static readonly INVALID_TOPUP_PRACTICE_GAME_TABLE_TOPUP_AMOUNT = new AriesErrorCodes(
		AriesErrorCodes.InvalidTopupPracticeGameTableTopupAmount,
		'Your Top-up request could not be completed due to Invalid Top-up Amount.',
		'INVALID_TOPUP_PRACTICE_GAME_TABLE_TOPUP_AMOUNT',
	);

	static readonly INVALID_TOPUP_PRACTICE_GAME_TABLE_MAX_BUY_IN = new AriesErrorCodes(
		AriesErrorCodes.InvalidTopupPracticeGameTableMaxBuyIn,
		'Top-up request cannot be made. Your stack exceeds the maximum Buy-In limit.',
		'INVALID_TOPUP_PRACTICE_GAME_TABLE_MAX_BUY_IN',
	);

	static readonly INVALID_TOPUP_PRACTICE_GAME_TABLE_INSUFFICIENT_BALANCE = new AriesErrorCodes(
		AriesErrorCodes.InvalidTopupPracticeGameTableInsufficientBalance,
		'Top-up request denied due to Insufficient Funds in your wallet.',
		'INVALID_TOPUP_PRACTICE_GAME_TABLE_INSUFFICIENT_BALANCE',
	);

	static readonly INVALID_TOPUP_PRACTICE_GAME_TABLE_CURRENT_STACK = new AriesErrorCodes(
		AriesErrorCodes.InvalidTopupPracticeGameTableCurrentStack,
		'Top-up not allowed. Your Current Stack Exceeds the requested amount.',
		'INVALID_TOPUP_PRACTICE_GAME_TABLE_CURRENT_STACK',
	);

	static readonly INVALID_COMPLETE_PRACTICE_GAME_TABLE_TOPUP_AMOUNT = new AriesErrorCodes(
		AriesErrorCodes.InvalidCompletePracticeGameTableTopupAmount,
		'Your Top-up request could not be completed due to Invalid Top-up Amount.',
		'INVALID_COMPLETE_PRACTICE_GAME_TABLE_TOPUP_AMOUNT',
	);

	static readonly INVALID_REBUY_PRACTICE_GAME_TABLE_REBUY_AMOUNT = new AriesErrorCodes(
		AriesErrorCodes.InvalidRebuyPracticeGameTableRebuyAmount,
		'Rebuy request cannot be made. Your stack exceeds the maximum Buy-In limit.',
		'INVALID_REBUY_PRACTICE_GAME_TABLE_REBUY_AMOUNT',
	);

	static readonly INVALID_REBUY_PRACTICE_GAME_TABLE_REQUEST = new AriesErrorCodes(
		AriesErrorCodes.InvalidRebuyPracticeGameTableRequest,
		'Your request to rebuy cannot be processed.',
		'INVALID_REBUY_PRACTICE_GAME_TABLE_REQUEST',
	);

	static readonly USER_ALREADY_ON_TABLE = new AriesErrorCodes(
		AriesErrorCodes.UserAlreadyOnTable,
		'You are already on this table.',
		'USER_ALREADY_ON_TABLE',
	);

	static readonly PLAYER_NOT_AVAILABLE_ON_TABLE = new AriesErrorCodes(
		AriesErrorCodes.PlayerNotAvailableOnTable,
		'Please join the table again.',
		'PLAYER_NOT_AVAILABLE_ON_TABLE',
	);

	static readonly PLAYER_ALREADY_LEFT = new AriesErrorCodes(
		AriesErrorCodes.PlayerAlreadyLeft,
		'You have already left the table.',
		'PLAYER_ALREADY_LEFT',
	);

	static readonly SEAT_NOT_OCCUPIED = new AriesErrorCodes(
		AriesErrorCodes.SeatNotOccupied,
		'Sorry, there\'s a problem on our end. Please try again.',
		'SEAT_NOT_OCCUPIED',
	);

	static readonly SEAT_ALREADY_OCCUPIED = new AriesErrorCodes(
		AriesErrorCodes.SeatAlreadyOccupied,
		'This seat is already occupied. Please reserve a seat again and join the table.',
		'SEAT_ALREADY_OCCUPIED',
	);

	static readonly SEAT_NOT_RESERVED = new AriesErrorCodes(
		AriesErrorCodes.SeatNotReserved,
		'This seat is not reserved. Please reserve a seat again and join the table.',
		'SEAT_NOT_RESERVED',
	);

	static readonly PLAYER_SEAT_EMPTY = new AriesErrorCodes(
		AriesErrorCodes.PlayerSeatEmpty,
		'Sorry, there\'s a problem on our end. Please try again.',
		'PLAYER_SEAT_EMPTY',
	);

	static readonly INVALID_SEAT_ID = new AriesErrorCodes(
		AriesErrorCodes.InvalidSeatId,
		'Sorry, there\'s a problem on our end. Please try again.',
		'INVALID_SEAT_ID',
	);

	static readonly INVALID_PLAYER_ON_SEAT = new AriesErrorCodes(
		AriesErrorCodes.InvalidPlayerOnSeat,
		'Sorry, there\'s a problem on our end. Please try again.',
		'INVALID_PLAYER_ON_SEAT',
	);

	static readonly NO_EMPTY_SEAT_FOUND = new AriesErrorCodes(
		AriesErrorCodes.NoEmptySeatFound,
		'No empty seat are available on this table. Please join another table.',
		'NO_EMPTY_SEAT_FOUND',
	);

	static readonly SEAT_NOT_EMPTY = new AriesErrorCodes(
		AriesErrorCodes.SeatNotEmpty,
		'This seat is not empty. Please reserve another seat again and join the table.',
		'SEAT_NOT_EMPTY',
	);

	static readonly RESERVE_TABLE_LIMIT_REACHED = new AriesErrorCodes(
		AriesErrorCodes.ReserveTableLimitReached,
		'No more table available for you',
		'RESERVE_TABLE_LIMIT_REACHED',
	);

	static readonly PRIMARY_ROOM_NOT_AVAILABLE = new AriesErrorCodes(
		AriesErrorCodes.PrimaryRoomNotAvailable,
		'primary room not available',
		'Primary Room not available',
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

export default AriesErrorCodes;
