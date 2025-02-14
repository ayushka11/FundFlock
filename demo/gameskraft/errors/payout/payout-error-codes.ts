class PayoutErrorCodes {

    private static BaseErrorCode = 27000;
    static RuntimeError = PayoutErrorCodes.BaseErrorCode + 1;
    static InsufficientBalance = PayoutErrorCodes.BaseErrorCode + 2;
    static WithdrawalDoesNotExist = PayoutErrorCodes.BaseErrorCode + 3;
    static WithdrawalUserIdMismatch = PayoutErrorCodes.BaseErrorCode + 4;

    static KycNeededForWithdrawal = PayoutErrorCodes.BaseErrorCode + 19;
    static WithdrawalDowntimeError = PayoutErrorCodes.BaseErrorCode + 21;

    // new ones
    static WithdrawalFailedTryAgain = PayoutErrorCodes.BaseErrorCode + 22
    static WithdrwalLimitMinAmount = PayoutErrorCodes.BaseErrorCode + 23;
    static WithdrawalLimitForTheDay = PayoutErrorCodes.BaseErrorCode + 24;
    static WithdrwalLimitMaxAmount = PayoutErrorCodes.BaseErrorCode + 25;
    static WithdrawalAccountInfoIsWrong = PayoutErrorCodes.BaseErrorCode + 26;
    static WithdrawalDetailsNotVerified = PayoutErrorCodes.BaseErrorCode + 27;
    static InvalidAccountOrIfsc = PayoutErrorCodes.BaseErrorCode + 28;
    static WithdrawalFailedAtBank = PayoutErrorCodes.BaseErrorCode + 29;
    static WithdrawalFailedAtTenet = PayoutErrorCodes.BaseErrorCode + 30;
    static TransactionNotFound = PayoutErrorCodes.BaseErrorCode + 31
    static WithdrawalBan = PayoutErrorCodes.BaseErrorCode + 32
    static InvalidWithdrawalPack = PayoutErrorCodes.BaseErrorCode + 33
    static WithdrawalAmtLimitForTheDay = PayoutErrorCodes.BaseErrorCode + 24;

    static readonly RUNTIME_ERROR = new PayoutErrorCodes(
		PayoutErrorCodes.RuntimeError,
		'Something went wrong',
		'APPLICATION_RUNTIME_ERROR',
	);

	static readonly INSUFFICIENT_BALANCE = new PayoutErrorCodes(
        PayoutErrorCodes.InsufficientBalance,
        'Insufficient Balance',
        'INSUFFICIENT_BALANCE',
    )

    static readonly WITHDRAWAL_DOES_NOT_EXIST = new PayoutErrorCodes(
        PayoutErrorCodes.WithdrawalDoesNotExist,
        'Withdrawal does not exist',
        'WITHDRAWAL_DOES_NOT_EXIST',
    )

    static readonly WITHDRAWAL_USER_ID_MISMATCH = new PayoutErrorCodes(
        PayoutErrorCodes.WithdrawalUserIdMismatch,
        '"UserId in withdrawal does not match with the input userId',
        'WITHDRAWAL_USER_ID_MISMATCH',
    )


    static readonly WITHDRAWAL_DOWNTIME_ERROR = new PayoutErrorCodes(
        PayoutErrorCodes.WithdrawalDowntimeError,
        'Withdrawal downtime error',
        'WITHDRAWAL_DOWNTIME_ERROR',
    )

    // newly created
    static readonly WITHDRAWAL_FAILED_TRY_AGAIN = new PayoutErrorCodes(
        PayoutErrorCodes.WithdrawalFailedTryAgain,
        'Sorry! Your withdrawal request could not be processed. Please try again after sometime.',
        'WITHDRAWAL_FAILED_TRY_AGAIN'
    )

    static readonly WITHDRWAL_LIMIT_MIN_AMOUNT = new PayoutErrorCodes(
        PayoutErrorCodes.WithdrwalLimitMinAmount,
        'Requested amount is less than the minimum withdrawal amount. Please try again with a valid withdrawal request',
        'WITHDRWAL_LIMIT_MIN_AMOUNT',
    )

    static readonly WITHDRWAL_LIMIT_MAX_AMOUNT = new PayoutErrorCodes(
        PayoutErrorCodes.WithdrwalLimitMaxAmount,
        'Requested amount is more than the maximum withdrawal limit. Please try again with a valid withdrawal request',
        'WITHDRWAL_LIMIT_MAX_AMOUNT',
    )

    static readonly WITHDRAWAL_LIMIT_FOR_THE_DAY = new PayoutErrorCodes(
        PayoutErrorCodes.WithdrawalLimitForTheDay,
        'You have already exhausted your withdrawal limit. Please try again after 24 Hours.',
        'WITHDRAWAL_LIMIT_FOR_THE_DAY',
    )

    static readonly WITHDRAWAL_ACCOUNT_INFO_IS_WRONG = new PayoutErrorCodes(
        PayoutErrorCodes.WithdrawalAccountInfoIsWrong,
        'Account details are not valid. Please try again.',
        'WITHDRAWAL_ACCOUNT_INFO_IS_WRONG'
    )

    static readonly WITHDRAWAL_ACCOUNT_DETAILS_NOT_VERIFIED = new PayoutErrorCodes(
        PayoutErrorCodes.WithdrawalDetailsNotVerified,
        'Account details could not be verified. Please try again.',
        'WITHDRAWAL_ACCOUNT_DETAILS_NOT_VERIFIED'
    )

    static readonly INVALID_ACCOUNT_OR_IFSC = new PayoutErrorCodes(
        PayoutErrorCodes.InvalidAccountOrIfsc,
        'Sorry! Your withdrawal request failed as either IFSC or Account details are invalid. Please try again with valid details.',
        'INVALID_ACCOUNT_OR_IFSC',
    )

    static readonly KYC_NEEDED_FOR_WITHDRAWAL = new PayoutErrorCodes(
        PayoutErrorCodes.KycNeededForWithdrawal,
        'KYC is needed for placing withdrawal',
        'KYC_NEEDED_FOR_WITHDRAWAL',
    )

    static readonly WITHDRAWAL_FAILED_AT_BANK = new PayoutErrorCodes(
        PayoutErrorCodes.WithdrawalFailedAtBank,
        'Sorry! Your withdrawal request failed due to error at bank\'s end. Please try again after sometime.',
        'WITHDRAWAL_FAILED_AT_BANK'
    )

    static readonly WITHDRAWAL_FAILED_AT_TENET = new PayoutErrorCodes(
        PayoutErrorCodes.WithdrawalFailedAtTenet,
        'Sorry! Your withdrawal request could not be processed. Please try again after sometime.',
        'WITHDRAWAL_FAILED_AT_TENET'
    )

    static readonly TRANSACTION_NOT_FOUND = new PayoutErrorCodes(
        PayoutErrorCodes.TransactionNotFound,
        'Sorry! This Transaction do not exist at out end',
        'TRANSACTION_NOT_FOUND'
    )

    static readonly WITHDRAWAL_BAN = new PayoutErrorCodes(
        PayoutErrorCodes.WithdrawalBan,
        'Withdrawals have been blocked for your account. Please contact support for more details.',
        'WITHDRAWAL_BAN'
    )

    static readonly INVALID_WITHDRAWAL_PACK = new PayoutErrorCodes(
        PayoutErrorCodes.InvalidWithdrawalPack,
        'You have selected an invalid withdrawals packs',
        'INVALID_WITHDRAWAL_PACK'
    )

    static readonly WITHDRAWAL_AMT_LIMIT_FOR_DAY_REACHED = new PayoutErrorCodes(
        PayoutErrorCodes.WithdrawalAmtLimitForTheDay,
        'You have already exhausted your withdrawal limit. Please try again after 24 Hours',
        'WITHDRAWAL_AMT_LIMIT_FOR_DAY_REACHED'
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

export default PayoutErrorCodes;
