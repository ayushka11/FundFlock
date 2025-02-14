class SupernovaErrorCodes {
    private static BaseErrorCode = 14000;

    static AuthorizationError = SupernovaErrorCodes.BaseErrorCode + 1;
    static InternalServerError = SupernovaErrorCodes.BaseErrorCode + 2;
    static BodyValidationError = SupernovaErrorCodes.BaseErrorCode + 3;
    static DbAnomaly = SupernovaErrorCodes.BaseErrorCode + 4;
    static InvalidVendorId = SupernovaErrorCodes.BaseErrorCode + 5;

    // Cash Game Errors
    static InsufficientWalletBalance = SupernovaErrorCodes.BaseErrorCode + 6;
    static InvalidReserveCashGameTableRequest = SupernovaErrorCodes.BaseErrorCode + 7;
    static InvalidJoinCashGameTableBuyinAmount = SupernovaErrorCodes.BaseErrorCode + 8;
    static InvalidJoinCashGameTableRequest = SupernovaErrorCodes.BaseErrorCode + 9;
    static InvalidLeaveCashGameTableRequest = SupernovaErrorCodes.BaseErrorCode + 10;
    static InvalidSettleCashGameHandRequest = SupernovaErrorCodes.BaseErrorCode + 11;
    static InvalidSettleCashGameHandUsers = SupernovaErrorCodes.BaseErrorCode + 12;
    static InvalidTopupCashGameTableTopupAmount = SupernovaErrorCodes.BaseErrorCode + 13;
    static InvalidCompleteCashGameTableTopupAmount = SupernovaErrorCodes.BaseErrorCode + 14;
    static InvalidRebuyCashGameTableRebuyAmount = SupernovaErrorCodes.BaseErrorCode + 15;
    static InvalidRebuyCashGameTableRequest = SupernovaErrorCodes.BaseErrorCode + 16;

    // Practice Game Errors
    static InvalidReservePracticeGameTableRequest = SupernovaErrorCodes.BaseErrorCode + 17;
    static InvalidJoinPracticeGameTableBuyinAmount = SupernovaErrorCodes.BaseErrorCode + 18;
    static InvalidJoinPracticeGameTableRequest = SupernovaErrorCodes.BaseErrorCode + 19;
    static InvalidLeavePracticeGameTableRequest = SupernovaErrorCodes.BaseErrorCode + 20;
    static InvalidSettlePracticeGameHandRequest = SupernovaErrorCodes.BaseErrorCode + 21;
    static InvalidSettlePracticeGameHandUsers = SupernovaErrorCodes.BaseErrorCode + 22;
    static InvalidTopupPracticeGameTableTopupAmount = SupernovaErrorCodes.BaseErrorCode + 23;
    static InvalidCompletePracticeGameTableTopupAmount = SupernovaErrorCodes.BaseErrorCode + 24;
    static InvalidRebuyPracticeGameTableRebuyAmount = SupernovaErrorCodes.BaseErrorCode + 25;
    static InvalidRebuyPracticeGameTableRequest = SupernovaErrorCodes.BaseErrorCode + 26;

    // Tds Errors
    static TdsLedgerEntryAlreadyExists = SupernovaErrorCodes.BaseErrorCode + 27;
    static TdsLedgerEntryNotExists = SupernovaErrorCodes.BaseErrorCode + 28;
    static TdsDetailsMismatch = SupernovaErrorCodes.BaseErrorCode + 29;
    static InvalidWithdrawalAmount = SupernovaErrorCodes.BaseErrorCode + 30;
    static InvalidRefundAmount = SupernovaErrorCodes.BaseErrorCode + 31;

    // User Account Errors
    static UserDepositAlreadySuccessfulOrFailed = SupernovaErrorCodes.BaseErrorCode + 32;
    static UserWithdrawalAlreadySuccessfulOrFailed = SupernovaErrorCodes.BaseErrorCode + 33;
    static UserRefundAlreadySuccessfulOrFailed = SupernovaErrorCodes.BaseErrorCode + 34;
    static InvalidUserConfiscationAmount = SupernovaErrorCodes.BaseErrorCode + 35;
    static InvalidUserCreditAmount = SupernovaErrorCodes.BaseErrorCode + 36;
    static InvalidUserDebitAmount = SupernovaErrorCodes.BaseErrorCode + 37;

    // B2B P52 Errors
    static InvalidTransactionIdForRollback = SupernovaErrorCodes.BaseErrorCode + 38;
    static InvalidRegisterTournamentRequest = SupernovaErrorCodes.BaseErrorCode + 39;
    static InvalidReentryTournamentRequest = SupernovaErrorCodes.BaseErrorCode + 40;
    static InvalidRebuyTournamentRequest = SupernovaErrorCodes.BaseErrorCode + 41;
    static InvalidAddonTournamentRequest = SupernovaErrorCodes.BaseErrorCode + 42;
    static InvalidUnregisterTournamentRequest = SupernovaErrorCodes.BaseErrorCode + 43;
    static TournamentAccountCreationFailed = SupernovaErrorCodes.BaseErrorCode + 44;
    static InvalidSettleTournamentRequest = SupernovaErrorCodes.BaseErrorCode + 45;
    static InvalidTransactionIdForRollforward = SupernovaErrorCodes.BaseErrorCode + 46;
    static InvalidTournamentIdForRollforward = SupernovaErrorCodes.BaseErrorCode + 47;
    static InvalidEntryMethodsForTournament = SupernovaErrorCodes.BaseErrorCode + 48;
    static RunTimeError = SupernovaErrorCodes.BaseErrorCode + 49;


    // Add descriptions and error codes here

    static readonly AUTHORIZATION_ERROR = new SupernovaErrorCodes(
        SupernovaErrorCodes.AuthorizationError,
        'Authorization error occurred',
        'AUTHORIZATION_ERROR',
    );

    static readonly INTERNAL_SERVER_ERROR = new SupernovaErrorCodes(
        SupernovaErrorCodes.InternalServerError,
        'Internal server error occurred',
        'INTERNAL_SERVER_ERROR',
    );

    static readonly BODY_VALIDATION_ERROR = new SupernovaErrorCodes(
        SupernovaErrorCodes.BodyValidationError,
        'Body validation error occurred',
        'BODY_VALIDATION_ERROR',
    );

    static readonly DB_ANOMALY = new SupernovaErrorCodes(
        SupernovaErrorCodes.DbAnomaly,
        'Database anomaly occurred',
        'DB_ANOMALY',
    );

    static readonly INVALID_VENDORID = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidVendorId,
        'Invalid vendor ID in headers',
        'INVALID_VENDOR_ID',
    );

    // Cash Game Errors
    static readonly INSUFFICIENT_WALLET_BALANCE = new SupernovaErrorCodes(
        SupernovaErrorCodes.InsufficientWalletBalance,
        'You have insufficient balance in your wallet.',
        'INSUFFICIENT_WALLET_BALANCE',
    );

    static readonly INVALID_RESERVE_CASH_GAME_TABLE_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidReserveCashGameTableRequest,
        'Invalid reserve cash game table request',
        'INVALID_RESERVE_CASH_GAME_TABLE_REQUEST',
    );

    static readonly INVALID_JOIN_CASH_GAME_TABLE_BUYIN_AMOUNT = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidJoinCashGameTableBuyinAmount,
        'Invalid join cash game table buy-in amount',
        'INVALID_JOIN_CASH_GAME_TABLE_BUYIN_AMOUNT',
    );

    static readonly INVALID_JOIN_CASH_GAME_TABLE_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidJoinCashGameTableRequest,
        'Invalid join cash game table request',
        'INVALID_JOIN_CASH_GAME_TABLE_REQUEST',
    );

    static readonly INVALID_LEAVE_CASH_GAME_TABLE_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidLeaveCashGameTableRequest,
        'Invalid leave cash game table request',
        'INVALID_LEAVE_CASH_GAME_TABLE_REQUEST',
    );

    static readonly INVALID_SETTLE_CASH_GAME_HAND_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidSettleCashGameHandRequest,
        'Invalid settle cash game hand request',
        'INVALID_SETTLE_CASH_GAME_HAND_REQUEST',
    );

    static readonly INVALID_SETTLE_CASH_GAME_HAND_USERS = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidSettleCashGameHandUsers,
        'Invalid settle cash game hand users',
        'INVALID_SETTLE_CASH_GAME_HAND_USERS',
    );

    static readonly INVALID_TOPUP_CASH_GAME_TABLE_TOPUP_AMOUNT = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidTopupCashGameTableTopupAmount,
        'Invalid top-up cash game table top-up amount',
        'INVALID_TOPUP_CASH_GAME_TABLE_TOPUP_AMOUNT',
    );

    static readonly INVALID_COMPLETE_CASH_GAME_TABLE_TOPUP_AMOUNT = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidCompleteCashGameTableTopupAmount,
        'Invalid complete cash game table top-up amount',
        'INVALID_COMPLETE_CASH_GAME_TABLE_TOPUP_AMOUNT',
    );

    static readonly INVALID_REBUY_CASH_GAME_TABLE_REBUY_AMOUNT = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidRebuyCashGameTableRebuyAmount,
        'Invalid rebuy cash game table rebuy amount',
        'INVALID_REBUY_CASH_GAME_TABLE_REBUY_AMOUNT',
    );

    static readonly INVALID_REBUY_CASH_GAME_TABLE_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidRebuyCashGameTableRequest,
        'Invalid rebuy cash game table request',
        'INVALID_REBUY_CASH_GAME_TABLE_REQUEST',
    );

    // Practice Game Errors
    static readonly INVALID_RESERVE_PRACTICE_GAME_TABLE_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidReservePracticeGameTableRequest,
        'Invalid reserve practice game table request',
        'INVALID_RESERVE_PRACTICE_GAME_TABLE_REQUEST',
    );

    static readonly INVALID_JOIN_PRACTICE_GAME_TABLE_BUYIN_AMOUNT = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidJoinPracticeGameTableBuyinAmount,
        'Invalid join practice game table buy-in amount',
        'INVALID_JOIN_PRACTICE_GAME_TABLE_BUYIN_AMOUNT',
    );

    static readonly INVALID_JOIN_PRACTICE_GAME_TABLE_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidJoinPracticeGameTableRequest,
        'Invalid join practice game table request',
        'INVALID_JOIN_PRACTICE_GAME_TABLE_REQUEST',
    );

    static readonly INVALID_LEAVE_PRACTICE_GAME_TABLE_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidLeavePracticeGameTableRequest,
        'Invalid leave practice game table request',
        'INVALID_LEAVE_PRACTICE_GAME_TABLE_REQUEST',
    );

    static readonly INVALID_SETTLE_PRACTICE_GAME_HAND_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidSettlePracticeGameHandRequest,
        'Invalid settle practice game hand request',
        'INVALID_SETTLE_PRACTICE_GAME_HAND_REQUEST',
    );

    static readonly INVALID_SETTLE_PRACTICE_GAME_HAND_USERS = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidSettlePracticeGameHandUsers,
        'Invalid settle practice game hand users',
        'INVALID_SETTLE_PRACTICE_GAME_HAND_USERS',
    );

    static readonly INVALID_TOPUP_PRACTICE_GAME_TABLE_TOPUP_AMOUNT = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidTopupPracticeGameTableTopupAmount,
        'Invalid top-up practice game table top-up amount',
        'INVALID_TOPUP_PRACTICE_GAME_TABLE_TOPUP_AMOUNT',
    );

    static readonly INVALID_COMPLETE_PRACTICE_GAME_TABLE_TOPUP_AMOUNT = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidCompletePracticeGameTableTopupAmount,
        'Invalid complete practice game table top-up amount',
        'INVALID_COMPLETE_PRACTICE_GAME_TABLE_TOPUP_AMOUNT',
    );

    static readonly INVALID_REBUY_PRACTICE_GAME_TABLE_REBUY_AMOUNT = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidRebuyPracticeGameTableRebuyAmount,
        'Invalid rebuy practice game table rebuy amount',
        'INVALID_REBUY_PRACTICE_GAME_TABLE_REBUY_AMOUNT',
    );

    static readonly INVALID_REBUY_PRACTICE_GAME_TABLE_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidRebuyPracticeGameTableRequest,
        'Invalid rebuy practice game table request',
        'INVALID_REBUY_PRACTICE_GAME_TABLE_REQUEST',
    );

    // Tds Errors (continued)
    static readonly TDS_LEDGER_ENTRY_ALREADY_EXISTS = new SupernovaErrorCodes(
        SupernovaErrorCodes.TdsLedgerEntryAlreadyExists,
        'TDS ledger entry already exists',
        'TDS_LEDGER_ENTRY_ALREADY_EXISTS',
    );

    static readonly TDS_LEDGER_ENTRY_NOT_EXISTS = new SupernovaErrorCodes(
        SupernovaErrorCodes.TdsLedgerEntryNotExists,
        'TDS ledger entry does not exist',
        'TDS_LEDGER_ENTRY_NOT_EXISTS',
    );

    static readonly TDS_DETAILS_MISMATCH = new SupernovaErrorCodes(
        SupernovaErrorCodes.TdsDetailsMismatch,
        'TDS details mismatch',
        'TDS_DETAILS_MISMATCH',
    );

    static readonly INVALID_WITHDRAWAL_AMOUNT = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidWithdrawalAmount,
        'Invalid withdrawal amount',
        'INVALID_WITHDRAWAL_AMOUNT',
    );

    static readonly INVALID_REFUND_AMOUNT = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidRefundAmount,
        'Invalid refund amount',
        'INVALID_REFUND_AMOUNT',
    );

    // User Account Errors (continued)
    static readonly USER_DEPOSIT_ALREADY_SUCCESSFUL_OR_FAILED = new SupernovaErrorCodes(
        SupernovaErrorCodes.UserDepositAlreadySuccessfulOrFailed,
        'User deposit already successful or failed',
        'USER_DEPOSIT_ALREADY_SUCCESSFUL_OR_FAILED',
    );

    static readonly USER_WITHDRAWAL_ALREADY_SUCCESSFUL_OR_FAILED = new SupernovaErrorCodes(
        SupernovaErrorCodes.UserWithdrawalAlreadySuccessfulOrFailed,
        'User withdrawal already successful or failed',
        'USER_WITHDRAWAL_ALREADY_SUCCESSFUL_OR_FAILED',
    );

    static readonly USER_REFUND_ALREADY_SUCCESSFUL_OR_FAILED = new SupernovaErrorCodes(
        SupernovaErrorCodes.UserRefundAlreadySuccessfulOrFailed,
        'User refund already successful or failed',
        'USER_REFUND_ALREADY_SUCCESSFUL_OR_FAILED',
    );

    static readonly INVALID_USER_CONFISCATION_AMOUNT = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidUserConfiscationAmount,
        'Invalid user confiscation amount',
        'INVALID_USER_CONFISCATION_AMOUNT',
    );

    static readonly INVALID_USER_CREDIT_AMOUNT = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidUserCreditAmount,
        'Invalid user credit amount',
        'INVALID_USER_CREDIT_AMOUNT',
    );

    static readonly INVALID_USER_DEBIT_AMOUNT = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidUserDebitAmount,
        'Invalid user debit amount',
        'INVALID_USER_DEBIT_AMOUNT',
    );

    // B2B P52 Errors (continued)
    static readonly INVALID_TRANSACTION_ID_FOR_ROLLBACK = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidTransactionIdForRollback,
        'Invalid transaction ID for rollback',
        'INVALID_TRANSACTION_ID_FOR_ROLLBACK',
    );

    static readonly INVALID_REGISTER_TOURNAMENT_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidRegisterTournamentRequest,
        'Invalid register tournament request',
        'INVALID_REGISTER_TOURNAMENT_REQUEST',
    );

    static readonly INVALID_REENTRY_TOURNAMENT_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidReentryTournamentRequest,
        'Reentry is not allowed in this tournament',
        'INVALID_REENTRY_TOURNAMENT_REQUEST',
    );

    static readonly INVALID_REBUY_TOURNAMENT_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidRebuyTournamentRequest,
        'Invalid rebuy tournament request',
        'INVALID_REBUY_TOURNAMENT_REQUEST',
    );

    static readonly INVALID_ADDON_TOURNAMENT_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidAddonTournamentRequest,
        'Invalid addon tournament request',
        'INVALID_ADDON_TOURNAMENT_REQUEST',
    );

    static readonly INVALID_UNREGISTER_TOURNAMENT_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidUnregisterTournamentRequest,
        'Invalid unregister tournament request',
        'INVALID_UNREGISTER_TOURNAMENT_REQUEST',
    );

    static readonly TOURNAMENT_ACCOUNT_CREATION_FAILED = new SupernovaErrorCodes(
        SupernovaErrorCodes.TournamentAccountCreationFailed,
        'Tournament account creation failed',
        'TOURNAMENT_ACCOUNT_CREATION_FAILED',
    );

    static readonly INVALID_SETTLE_TOURNAMENT_REQUEST = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidSettleTournamentRequest,
        'Invalid settle tournament request',
        'INVALID_SETTLE_TOURNAMENT_REQUEST',
    );

    static readonly INVALID_TRANSACTION_ID_FOR_ROLLFORWARD = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidTransactionIdForRollforward,
        'Invalid transaction ID for roll forward',
        'INVALID_TRANSACTION_ID_FOR_ROLL_FORWARD',
    );

    static readonly INVALID_TOURNAMENT_ID_FOR_ROLLFORWARD = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidTournamentIdForRollforward,
        'Invalid tournament ID for roll forward',
        'INVALID_TOURNAMENT_ID_FOR_ROLL_FORWARD',
    );

    static readonly INVALID_ENTRY_METHODS_FOR_TOURNAMENT = new SupernovaErrorCodes(
        SupernovaErrorCodes.InvalidEntryMethodsForTournament,
        'Invalid entry methods for tournament',
        'INVALID_ENTRY_METHODS_FOR_TOURNAMENT',
    );

    static readonly RUN_TIME_ERROR = new SupernovaErrorCodes(
        SupernovaErrorCodes.RunTimeError,
        'Something went wrong',
        'APPLICATION_RUNTIME_ERROR',
    )

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

export default SupernovaErrorCodes;
