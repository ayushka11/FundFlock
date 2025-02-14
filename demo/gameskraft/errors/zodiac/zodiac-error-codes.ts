class ZodiacErrorCodes {

    private static BaseErrorCode = 21000;
    static RuntimeError = ZodiacErrorCodes.BaseErrorCode + 1;
	static UserAlreadyExists = ZodiacErrorCodes.BaseErrorCode + 2;
	static UserDoesNotExists = ZodiacErrorCodes.BaseErrorCode + 3;
	static InvalidGameplayNoteColorToUpdate = ZodiacErrorCodes.BaseErrorCode + 4;
	static InvalidGameplayNoteColorId = ZodiacErrorCodes.BaseErrorCode + 5;
	static NoActiveTableSession = ZodiacErrorCodes.BaseErrorCode + 6;
	static NoHandInCurrentTableSession = ZodiacErrorCodes.BaseErrorCode + 7;
	static NoTableSessionsOnDate = ZodiacErrorCodes.BaseErrorCode + 8;
	static NoTableHandsOnDate = ZodiacErrorCodes.BaseErrorCode + 9;
	static TableHandDetailsNotFound = ZodiacErrorCodes.BaseErrorCode + 10;
	static NoActiveTournament = ZodiacErrorCodes.BaseErrorCode + 11;
	static NoHandInCurrentTournament = ZodiacErrorCodes.BaseErrorCode + 12;
	static NoTournamentHandsOnDate = ZodiacErrorCodes.BaseErrorCode + 13;
	static TournamentHandDetailsNotFound = ZodiacErrorCodes.BaseErrorCode + 14;
    static PslPassAlreadyClaimed = ZodiacErrorCodes.BaseErrorCode + 15;
    static PslPassNotClaimed = ZodiacErrorCodes.BaseErrorCode + 16;
	static MaximumPslTournamentRegistrationLimitError = ZodiacErrorCodes.BaseErrorCode + 17;

    static readonly RUNTIME_ERROR = new ZodiacErrorCodes(
		ZodiacErrorCodes.RuntimeError,
		'Something went wrong',
		'APPLICATION_RUNTIME_ERROR',
	);

	static readonly USER_ALREADY_EXISTS = new ZodiacErrorCodes(
		ZodiacErrorCodes.UserAlreadyExists,
		'User already exists',
		'USER_ALREADY_EXISTS',
	);

	static readonly USER_DOES_NOT_EXISTS = new ZodiacErrorCodes(
		ZodiacErrorCodes.UserDoesNotExists,
		'User does not exists',
		'USER_DOES_NOT_EXISTS',
	);

	static readonly INVALID_GAMEPLAY_NOTE_COLOR_TO_UPDATE = new ZodiacErrorCodes(
		ZodiacErrorCodes.InvalidGameplayNoteColorToUpdate,
		'Invalid gameplay note color id to update',
		'INVALID_GAMEPLAY_NOTE_COLOR_TO_UPDATE',
	);

	static readonly INVALID_GAMEPLAY_NOTE_COLOR_ID = new ZodiacErrorCodes(
		ZodiacErrorCodes.InvalidGameplayNoteColorId,
		'Invalid gameplay note color id',
		'INVALID_GAMEPLAY_NOTE_COLOR_ID',
	);

	static readonly NO_ACTIVE_TABLE_SESSION = new ZodiacErrorCodes(
		ZodiacErrorCodes.NoActiveTableSession,
		'No active table session..',
		'NO_ACTIVE_TABLE_SESSION',
	);

	static readonly NO_HAND_IN_CURRENT_TABLE_SESSION = new ZodiacErrorCodes(
		ZodiacErrorCodes.NoHandInCurrentTableSession,
		'No hands in current table session..',
		'NO_HAND_IN_CURRENT_TABLE_SESSION',
	);

	static readonly NO_TABLE_SESSIONS_ON_DATE = new ZodiacErrorCodes(
		ZodiacErrorCodes.NoTableSessionsOnDate,
		'No table sessions on date..',
		'NO_TABLE_SESSIONS_ON_DATE',
	);

	static readonly NO_TABLE_HANDS_ON_DATE = new ZodiacErrorCodes(
		ZodiacErrorCodes.NoTableHandsOnDate,
		'No table hands on date..',
		'NO_TABLE_HANDS_ON_DATE',
	);

	static readonly TABLE_HAND_DETAILS_NOT_FOUND = new ZodiacErrorCodes(
		ZodiacErrorCodes.TableHandDetailsNotFound,
		'No table hand details found..',
		'TABLE_HAND_DETAILS_NOT_FOUND',
	);

	// Tournament game play error codes
	static readonly NO_ACTIVE_TOURNAMENT = new ZodiacErrorCodes(
		ZodiacErrorCodes.NoActiveTournament,
		'No active tournament..',
		'NO_ACTIVE_TOURNAMENT',
	);

	static readonly NO_HAND_IN_CURRENT_TOURNAMENT = new ZodiacErrorCodes(
		ZodiacErrorCodes.NoHandInCurrentTournament,
		'No hands in current tournament..',
		'NO_HAND_IN_CURRENT_TOURNAMENT',
	);

	static readonly NO_TOURNAMENT_HANDS_ON_DATE = new ZodiacErrorCodes(
		ZodiacErrorCodes.NoTournamentHandsOnDate,
		'No tournament hands on date..',
		'NO_TOURNAMENT_HANDS_ON_DATE',
	);

	static readonly TOURNAMENT_HAND_DETAILS_NOT_FOUND = new ZodiacErrorCodes(
		ZodiacErrorCodes.TournamentHandDetailsNotFound,
		'No tournament hand details found..',
		'TOURNAMENT_HAND_DETAILS_NOT_FOUND',
	);

	static readonly PSL_PASS_ALREADY_CLAIMED = new ZodiacErrorCodes(
		ZodiacErrorCodes.PslPassAlreadyClaimed,
		'PSL Pass already claimed..',
		'PSL_PASS_ALREADY_CLAIMED',
	);

	static readonly PSL_PASS_NOT_CLAIMED = new ZodiacErrorCodes(
		ZodiacErrorCodes.PslPassNotClaimed,
		'PSL Pass not claimed..',
		'PSL_PASS_NOT_CLAIMED',
	);

	static readonly MAXIMUM_PSL_TOURNAMENT_REGISTRATION_LIMIT_ERROR = new ZodiacErrorCodes(
		ZodiacErrorCodes.MaximumPslTournamentRegistrationLimitError,
		'You have reached the maximum registration limit for PSL tournament',
		'MAXIMUM_PSL_TOURNAMENT_REGISTRATION_LIMIT_ERROR',
	);

	// private to disallow creating other instances of this type
	private constructor(
		public code: number,
		public message: string,
		public name: string,
		public type?: string,
	) {}
	toString(): string {
		return `${this.name}:${this.code}:${this.message}`;
	}
}

export default ZodiacErrorCodes;
