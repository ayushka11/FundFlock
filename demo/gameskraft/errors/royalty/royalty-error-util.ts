import RoyaltyServiceError from './royalty-error';
import RoyaltyErrorCodes from './royalty-error-codes';
import ServiceErrorUtil from '../service-error-util';

class RoyaltyServiceErrorUtil extends ServiceErrorUtil {
    public static getRuntimeError(): RoyaltyServiceError {
		return RoyaltyServiceError.get(RoyaltyErrorCodes.RUNTIME_ERROR);
	}

	public static getDBDuplicateEntryError(): RoyaltyServiceError {
		return RoyaltyServiceError.get(RoyaltyErrorCodes.DB_DUPLICATE_ENTRY_ERROR);
	}

    public static getRoyaltyLevelDoesNotExist(): RoyaltyServiceError {
		return RoyaltyServiceError.get(RoyaltyErrorCodes.ROYALTY_LEVEL_DOES_NOT_EXIST);
	}
    public static getRoyaltyUserDoesNotExist(): RoyaltyServiceError {
		return RoyaltyServiceError.get(RoyaltyErrorCodes.ROYALTY_USER_DOES_NOT_EXIST);
	}
    public static getRoyaltyUserAlreadyExist(): RoyaltyServiceError {
		return RoyaltyServiceError.get(RoyaltyErrorCodes.ROYALTY_USER_ALREADY_EXIST);
	}
    public static getInvalidCreateRoyaltyUser(): RoyaltyServiceError {
		return RoyaltyServiceError.get(RoyaltyErrorCodes.INVALID_CREATE_ROYALTY_USER);
	}
    public static getInvalidCreateRoyaltyLevel(): RoyaltyServiceError {
		return RoyaltyServiceError.get(RoyaltyErrorCodes.INVALID_CREATE_ROYALTY_LEVEL);
	}
    public static getCreditCoinFailed(): RoyaltyServiceError {
		return RoyaltyServiceError.get(RoyaltyErrorCodes.CREDIT_COIN_FAILED);
	}
    public static getCoinRedemptionFailed(): RoyaltyServiceError {
		return RoyaltyServiceError.get(RoyaltyErrorCodes.COIN_REDEMPTION_FAILED);
	}
    public static getCoinGenerationFailed(): RoyaltyServiceError {
		return RoyaltyServiceError.get(RoyaltyErrorCodes.COIN_GENERATION_FAILED);
	}
    public static getCoinLedgerEntryFailed(): RoyaltyServiceError {
		return RoyaltyServiceError.get(RoyaltyErrorCodes.COIN_REDEMPTION_FAILED);
	}
    public static getRoyaltyLevelOrOrderNoExist(): RoyaltyServiceError {
		return RoyaltyServiceError.get(RoyaltyErrorCodes.ROYALTY_LEVEL_ORDER_NO_EXIST);
	}
    public static getNotSufficientCoins(): RoyaltyServiceError {
		return RoyaltyServiceError.get(RoyaltyErrorCodes.NOT_SUFFICIENT_COINS);
	}

	public static wrapError(error: any): RoyaltyServiceError {
		return RoyaltyServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `RoyaltyError:${error.type}`,
        })
	}
}

export default RoyaltyServiceErrorUtil;
