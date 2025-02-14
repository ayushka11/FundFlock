import PayoutErrorCodes from './payout-error-codes';
import ServiceError from '../service-error';

class PayoutServiceError extends ServiceError {

    static readonly INSUFFICIENT_BALANCE = PayoutServiceError.get(
        PayoutErrorCodes.INSUFFICIENT_BALANCE,
    )

    static readonly WITHDRAWAL_DOES_NOT_EXIST = PayoutServiceError.get(
        PayoutErrorCodes.WITHDRAWAL_DOES_NOT_EXIST,
    )

    static readonly WITHDRAWAL_USER_ID_MISMATCH = PayoutServiceError.get(
        PayoutErrorCodes.WITHDRAWAL_USER_ID_MISMATCH,
    )

    static readonly WITHDRAWAL_LIMIT_FOR_THE_DAY = PayoutServiceError.get(
        PayoutErrorCodes.WITHDRAWAL_LIMIT_FOR_THE_DAY,
    )

    static readonly KYC_NEEDED_FOR_WITHDRAWAL = PayoutServiceError.get(
        PayoutErrorCodes.KYC_NEEDED_FOR_WITHDRAWAL,
    )

    static readonly WITHDRAWAL_DOWNTIME_ERROR = PayoutServiceError.get(
        PayoutErrorCodes.WITHDRAWAL_DOWNTIME_ERROR,
    )

    static readonly WITHDRAWAL_FAILED_TRY_AGAIN = PayoutServiceError.get(
        PayoutErrorCodes.WITHDRAWAL_FAILED_TRY_AGAIN
    )

    static readonly WITHDRWAL_LIMIT_MIN_AMOUNT = PayoutServiceError.get(
        PayoutErrorCodes.WITHDRWAL_LIMIT_MIN_AMOUNT,
    )

    static readonly WITHDRWAL_LIMIT_MAX_AMOUNT = PayoutServiceError.get(
        PayoutErrorCodes.WITHDRWAL_LIMIT_MAX_AMOUNT,
    )

    static readonly INVALID_ACCOUNT_OR_IFSC = PayoutServiceError.get(
        PayoutErrorCodes.INVALID_ACCOUNT_OR_IFSC,
    )

    static readonly WITHDRAWAL_ACCOUNT_INFO_IS_WRONG = PayoutServiceError.get(
        PayoutErrorCodes.WITHDRAWAL_ACCOUNT_INFO_IS_WRONG
    )

    static readonly WITHDRAWAL_ACCOUNT_DETAILS_NOT_VERIFIED = PayoutServiceError.get(
        PayoutErrorCodes.WITHDRAWAL_ACCOUNT_DETAILS_NOT_VERIFIED
    )

    static readonly WITHDRAWAL_FAILED_AT_BANK = PayoutServiceError.get(
        PayoutErrorCodes.WITHDRAWAL_FAILED_AT_BANK
    )

    static readonly WITHDRAWAL_FAILED_AT_TENET = PayoutServiceError.get(
        PayoutErrorCodes.WITHDRAWAL_FAILED_AT_TENET
    )

    static readonly TRANSACTION_NOT_FOUND = PayoutServiceError.get(
        PayoutErrorCodes.TRANSACTION_NOT_FOUND
    )

    static readonly WITHDRAWAL_BAN = PayoutServiceError.get(
        PayoutErrorCodes.WITHDRAWAL_BAN
    )

    static readonly INVALID_WITHDRAWAL_PACK = PayoutServiceError.get(
        PayoutErrorCodes.INVALID_WITHDRAWAL_PACK
    )

    static readonly WITHDRAWAL_AMT_LIMIT_FOR_DAY_REACHED = PayoutServiceError.get(
        PayoutErrorCodes.WITHDRAWAL_AMT_LIMIT_FOR_DAY_REACHED
    )

    constructor(public name: string, public code: number, public message: any, public type: any) {
		super(name, code, message, type);
	}

	public static get(errorDetails: PayoutErrorCodes): PayoutServiceError {
		return new PayoutServiceError(
			errorDetails.name,
			errorDetails.code,
			errorDetails.message,
            errorDetails.type || 'PayoutServiceError',
		);
	}
}

export default PayoutServiceError;
