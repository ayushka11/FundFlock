import PayoutServiceError from './payout-error';
import PayoutErrorCodes from './payout-error-codes';
import ServiceErrorUtil from '../service-error-util';

class PayoutServiceErrorUtil extends ServiceErrorUtil {
    public static getRuntimeError(): PayoutServiceError {
		return PayoutServiceError.get(PayoutErrorCodes.RUNTIME_ERROR);
	}

	public static getError(error: Error): PayoutServiceError {
		if (!(error instanceof PayoutServiceError)) {
			return this.getRuntimeError();
		}
		return error;
	}

	public static getInsufficientBalance(): PayoutServiceError {
        return PayoutServiceError.INSUFFICIENT_BALANCE;
    }

    public static getWithdrawalDoesNotExist(): PayoutServiceError {
        return PayoutServiceError.WITHDRAWAL_DOES_NOT_EXIST;
    }

    public static getWithdrawalUserIdMismatch(): PayoutServiceError {
        return PayoutServiceError.WITHDRAWAL_USER_ID_MISMATCH;
    }

    public static getWithdrawalLimitForTheDay(): PayoutServiceError {
        return PayoutServiceError.WITHDRAWAL_LIMIT_FOR_THE_DAY;
    }

    public static getWithdrwalLimitMinAmount(): PayoutServiceError {
        return PayoutServiceError.WITHDRWAL_LIMIT_MIN_AMOUNT;
    }

    public static getWithdrwalLimitMaxAmount(): PayoutServiceError {
        return PayoutServiceError.WITHDRWAL_LIMIT_MAX_AMOUNT;
    }

    public static getInvalidAccountOrIfsc(): PayoutServiceError {
        return PayoutServiceError.INVALID_ACCOUNT_OR_IFSC;
    }

    public static getKycNeededForWithdrawal(): PayoutServiceError {
        return PayoutServiceError.KYC_NEEDED_FOR_WITHDRAWAL;
    }

    public static getWithdrawalDowntimeError(): PayoutServiceError {
        return PayoutServiceError.WITHDRAWAL_DOWNTIME_ERROR;
    }

    public static getWithdrawalFailedTryAgain(): PayoutServiceError {
        return PayoutServiceError.WITHDRAWAL_FAILED_TRY_AGAIN
    }

    public static getWithdrawalAccountInfoWrong(): PayoutServiceError {
        return PayoutServiceError.WITHDRAWAL_ACCOUNT_INFO_IS_WRONG
    }

    public static getAccountDetailsNotVerified(): PayoutServiceError {
        return PayoutServiceError.WITHDRAWAL_ACCOUNT_DETAILS_NOT_VERIFIED
    }

    public static getWithdrawalFailedAtBank(): PayoutServiceError {
        return PayoutServiceError.WITHDRAWAL_FAILED_AT_BANK
    }

    public static getWithdrawalFailedAtTenet(): PayoutServiceError {
        return PayoutServiceError.WITHDRAWAL_FAILED_AT_TENET
    }

    public static getTransactionNotFound(): PayoutServiceError {
        return PayoutServiceError.TRANSACTION_NOT_FOUND
    }

    public static getWithdrawalBanError(): PayoutServiceError {
        return PayoutServiceError.WITHDRAWAL_BAN
    }

    public static getInvalidWithdrawalPack(): PayoutServiceError {
        return PayoutServiceError.INVALID_WITHDRAWAL_PACK
    }

    public static getWithdrawalAmtLimitForTheDay(): PayoutServiceError {
        return PayoutServiceError.WITHDRAWAL_AMT_LIMIT_FOR_DAY_REACHED
    }

    public static wrapError(error: any): PayoutServiceError {
		return PayoutServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `PayoutServiceError:${error.type}`,
        })
	}
}

export default PayoutServiceErrorUtil;
