class RoyaltyErrorCodes {

    private static BaseErrorCode = 90000;
    static RuntimeError = RoyaltyErrorCodes.BaseErrorCode + 1;

	// ROYALTY ERRORS
	static RoyaltyLevelDoesNotExist = RoyaltyErrorCodes.BaseErrorCode + 2

	static RoyaltyUserDoesNotExist = RoyaltyErrorCodes.BaseErrorCode + 3

	static InvalidCreateRoyaltyUser = RoyaltyErrorCodes.BaseErrorCode + 4

	static CreditCoinFailed = RoyaltyErrorCodes.BaseErrorCode + 5

	static CoinGenerationFailed = RoyaltyErrorCodes.BaseErrorCode + 6

	static InvalidCreateRoyaltyLevel = RoyaltyErrorCodes.BaseErrorCode + 7

	static RoyaltyLevelOrderNoExist = RoyaltyErrorCodes.BaseErrorCode + 8

	static RoyaltyUserAlreadyExist = RoyaltyErrorCodes.BaseErrorCode + 9

	static CoinRedemptionFailed = RoyaltyErrorCodes.BaseErrorCode + 10

	static NotSufficientCoins = RoyaltyErrorCodes.BaseErrorCode + 11

	static DbDuplicateEntryError = RoyaltyErrorCodes.BaseErrorCode + 12;



    static readonly RUNTIME_ERROR = new RoyaltyErrorCodes(
		RoyaltyErrorCodes.RuntimeError,
		'Something went wrong',
		'APPLICATION_RUNTIME_ERROR',
	);

	static readonly DB_DUPLICATE_ENTRY_ERROR = new RoyaltyErrorCodes(
		RoyaltyErrorCodes.DbDuplicateEntryError,
		'Something went wrong..',
		'DB_DUPLICATE_ENTRY_ERROR',
	);

	static readonly ROYALTY_LEVEL_DOES_NOT_EXIST = new RoyaltyErrorCodes(
		RoyaltyErrorCodes.RoyaltyLevelDoesNotExist,
		'Royalty Level does not exists',
		'ROYALTY_LEVEL_DOES_NOT_EXIST',
	);

	static readonly ROYALTY_USER_DOES_NOT_EXIST = new RoyaltyErrorCodes(
		RoyaltyErrorCodes.RoyaltyUserDoesNotExist,
		'Royalty User does not exists',
		'ROYALTY_USER_DOES_NOT_EXIST',
	);

	static readonly INVALID_CREATE_ROYALTY_USER = new RoyaltyErrorCodes(
		RoyaltyErrorCodes.InvalidCreateRoyaltyUser,
		'Invalid Royalty User Creation Request',
		'INVALID_CREATE_ROYALTY_USER'
	)

	static readonly CREDIT_COIN_FAILED = new RoyaltyErrorCodes(
		RoyaltyErrorCodes.CreditCoinFailed,
		"Credit Coin Failed",
		"CREDIT_COIN_FAILED"
	)

	static readonly COIN_GENERATION_FAILED = new RoyaltyErrorCodes(
		RoyaltyErrorCodes.CoinGenerationFailed,
		"Coin Generation Failed",
		"COIN_GENERATION_FAILED"
	)

	static readonly INVALID_CREATE_ROYALTY_LEVEL = new RoyaltyErrorCodes(
		RoyaltyErrorCodes.InvalidCreateRoyaltyLevel,
		"Invalid Royalty Level Creation Request",
		"INVALID_CREATE_ROYALTY_LEVEL"
	)

	static readonly ROYALTY_LEVEL_ORDER_NO_EXIST = new RoyaltyErrorCodes(
		RoyaltyErrorCodes.RoyaltyLevelOrderNoExist,
		"Royalty Level or Order No Already Exist",
		"ROYALTY_LEVEL_ORDER_NO_EXIST"
	)

	static readonly ROYALTY_USER_ALREADY_EXIST = new RoyaltyErrorCodes(
		RoyaltyErrorCodes.RoyaltyUserAlreadyExist,
		"Royalty User Already Exist",
		"ROYALTY_USER_ALREADY_EXIST"
	)

	static readonly COIN_REDEMPTION_FAILED = new RoyaltyErrorCodes(
		RoyaltyErrorCodes.CoinRedemptionFailed,
		"Coin Redemption Failed",
		"COIN_REDEMPTION_FAILED"
	)

	static readonly NOT_SUFFICIENT_COINS = new RoyaltyErrorCodes(
		RoyaltyErrorCodes.NotSufficientCoins,
		"You do not have enough coins to redeem",
		"NOT_SUFFICIENT_COINS"
	)

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

export default RoyaltyErrorCodes;
