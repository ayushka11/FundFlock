import RoyaltyErrorCodes from './royalty-error-codes';
import ServiceError from '../service-error';


class RoyaltyServiceError extends ServiceError {
    static readonly INTERNAL_SERVER_ERROR = RoyaltyServiceError.get(
        RoyaltyErrorCodes.RUNTIME_ERROR,
    );

	static readonly ROYALTY_LEVEL_DOES_NOT_EXIST = RoyaltyServiceError.get(
		RoyaltyErrorCodes.ROYALTY_LEVEL_DOES_NOT_EXIST,
	);

	static readonly ROYALTY_USER_DOES_NOT_EXIST = RoyaltyServiceError.get(
		RoyaltyErrorCodes.ROYALTY_USER_DOES_NOT_EXIST,
	);

	static readonly INVALID_CREATE_ROYALTY_USER = RoyaltyServiceError.get(
		RoyaltyErrorCodes.INVALID_CREATE_ROYALTY_USER,
	)

	static readonly CREDIT_COIN_FAILED = RoyaltyServiceError.get(
		RoyaltyErrorCodes.CREDIT_COIN_FAILED,
	)

	static readonly COIN_GENERATION_FAILED = RoyaltyServiceError.get(
		RoyaltyErrorCodes.COIN_GENERATION_FAILED
	)

	static readonly INVALID_CREATE_ROYALTY_LEVEL = RoyaltyServiceError.get(
		RoyaltyErrorCodes.INVALID_CREATE_ROYALTY_LEVEL,
	)

	static readonly ROYALTY_LEVEL_ORDER_NO_EXIST = RoyaltyServiceError.get(
		RoyaltyErrorCodes.ROYALTY_LEVEL_ORDER_NO_EXIST,
	)

	static readonly ROYALTY_USER_ALREADY_EXIST = RoyaltyServiceError.get(
		RoyaltyErrorCodes.ROYALTY_USER_ALREADY_EXIST,
	)

	static readonly COIN_REDEMPTION_FAILED = RoyaltyServiceError.get(
		RoyaltyErrorCodes.COIN_REDEMPTION_FAILED,
	)

	static readonly NOT_SUFFICIENT_COINS = RoyaltyServiceError.get(
		RoyaltyErrorCodes.NOT_SUFFICIENT_COINS,
	)

    constructor(public name: string, public code: number, public message: any, public type: any) {
		super(name, code, message, type);
	}

	public static get(errorDetails: RoyaltyErrorCodes): RoyaltyServiceError {
		return new RoyaltyServiceError(
			errorDetails.name,
			errorDetails.code,
			errorDetails.message,
            errorDetails.type || 'RoyaltyServiceError',
		);
	}
}

export default RoyaltyServiceError;