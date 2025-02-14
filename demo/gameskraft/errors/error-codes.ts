class ErrorCodes {
	static readonly RUNTIME_ERROR = new ErrorCodes(
		10_001,
		'Something went wrong',
		'APPLICATION_RUNTIME_ERROR',
	);

	static readonly AUTHORIZATION_ERROR = new ErrorCodes(
		10_005,
		'Unauthorized request',
		'UNAUTHORIZED_REQUEST',
	);

	static readonly INTERNAL_SERVER_ERROR = new ErrorCodes(
		10_015,
		'Something went wrong..',
		'INTERNAL_SERVER_ERROR',
	);

	static readonly BODY_VALIDATION_ERROR = new ErrorCodes(
		10_020,
		'Body validation error',
		'BODY_VALIDATION_ERROR',
	);

	static readonly DB_ANOMALY = new ErrorCodes(
		10_025,
		'Something went wrong..',
		'DB_ANOMALY',
	);

	static readonly WITHDRAWAL_DOWNTIME_ERROR = new ErrorCodes(
		10_030,
		'We are currently under maintenance. We will be live soon',
		'WITHDRAWAL_DOWNTIME_ERROR',
	);

	static readonly ADD_CASH_DOWNTIME_ERROR = new ErrorCodes(
		10_035,
		'We are currently under maintenance. We will be live soon',
		'ADD_CASH_DOWNTIME_ERROR',
	);

	static readonly ROOM_ID_NOT_FOUND_ERROR = new ErrorCodes(
		10_040,
		'Sorry, there\'s a problem on our end. Please try again.',
		'ROOM_ID_NOT_FOUND_ERROR',
	);

	static readonly TABLE_ID_NOT_FOUND_ERROR = new ErrorCodes(
		10_041,
		'Sorry, there\'s a problem on our end. Please try again.',
		'TABLE_ID_NOT_FOUND_ERROR',
	);

	static readonly TOURNAMENT_ID_NOT_FOUND_ERROR = new ErrorCodes(
		10_042,
		'Sorry, there\'s a problem on our end. Please try again.',
		'TOURNAMENT_ID_NOT_FOUND_ERROR',
	);

	static readonly INVALID_ROOM_ERROR = new ErrorCodes(
		10_045,
		'Sorry, there\'s a problem on our end. Please try again.',
		'INVALID_ROOM_ERROR',
	);
	static readonly MISSING_MOBILE_ERROR = new ErrorCodes(
		10_046,
		'Mobile Number is missing from the request',
		'MISSING_MOBILE_ERROR',
	);

	static readonly INVALID_UNREGISTER_TOURNAMENT = new ErrorCodes(
		10_050,
		'Unregister tournament is not permitted',
		'INVALID_UNREGISTER_TOURNAMENT',
	);

	static readonly GROUP_ID_NOT_FOUND_ERROR = new ErrorCodes(
		10_051,
		'Sorry, there\'s a problem on our end. Please try again.',
		'GROUP_ID_NOT_FOUND_ERROR',
	);

	static readonly INVALID_GROUP_ERROR = new ErrorCodes(
		10_052,
		'Sorry, there\'s a problem on our end. Please try again.',
		'INVALID_GROUP_ERROR',
	);

	static readonly TOURNAMENT_OBSERVER_TABLE_ID_NOT_FOUND_ERROR = new ErrorCodes(
		10_053,
		'Sorry, there\'s a problem on our end. Please try again.',
		'TOURNAMENT_OBSERVER_TABLE_ID_NOT_FOUND_ERROR',
	);

	static readonly TOURNAMENT_PLAYER_BUSTED_ERROR = new ErrorCodes(
		10_054,
		'Player is not available on table.',
		'TOURNAMENT_PLAYER_BUSTED_ERROR',
	);

	static readonly TOURNAMENT_NOT_IN_RUNNING_STATE_ERROR = new ErrorCodes(
		10_055,
		'Tournament is not in running state.',
		'TOURNAMENT_NOT_IN_RUNNING_STATE_ERROR',
	);

	static readonly INVALID_REQUEST_ID = new ErrorCodes(
		10_056,
		'Sorry, there\'s a problem on our end. Please try again.',
		'INVALID_REQUEST',
	);

	// private to disallow creating other instances of this type
	private constructor(
		public code: number,
		public message: string,
		public name: string,
		public type?: string,
	) {}
	toString(): string {
		return `${this.name}:${this.code}:${this.message}:${this.type}`;
	}
}

export default ErrorCodes;
