import SupernovaErrorCodes from './supernova-error-codes';
import ServiceError from '../service-error';

class SupernovaServiceError extends ServiceError {
	
static readonly AUTHORIZATION_ERROR = SupernovaServiceError.get(
    SupernovaErrorCodes.AUTHORIZATION_ERROR
);

static readonly INTERNAL_SERVER_ERROR = SupernovaServiceError.get(
    SupernovaErrorCodes.INTERNAL_SERVER_ERROR
);

static readonly BODY_VALIDATION_ERROR = SupernovaServiceError.get(
    SupernovaErrorCodes.BODY_VALIDATION_ERROR
);

static readonly DB_ANOMALY = SupernovaServiceError.get(
    SupernovaErrorCodes.DB_ANOMALY
);

static readonly INVALID_VENDORID = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_VENDORID
);

// Cash Game Errors
static readonly INSUFFICIENT_WALLET_BALANCE = SupernovaServiceError.get(
    SupernovaErrorCodes.INSUFFICIENT_WALLET_BALANCE
);

static readonly INVALID_RESERVE_CASH_GAME_TABLE_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_RESERVE_CASH_GAME_TABLE_REQUEST
);

static readonly INVALID_JOIN_CASH_GAME_TABLE_BUYIN_AMOUNT = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_JOIN_CASH_GAME_TABLE_BUYIN_AMOUNT
);

static readonly INVALID_JOIN_CASH_GAME_TABLE_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_JOIN_CASH_GAME_TABLE_REQUEST
);

static readonly INVALID_LEAVE_CASH_GAME_TABLE_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_LEAVE_CASH_GAME_TABLE_REQUEST
);

static readonly INVALID_SETTLE_CASH_GAME_HAND_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_SETTLE_CASH_GAME_HAND_REQUEST
);

static readonly INVALID_SETTLE_CASH_GAME_HAND_USERS = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_SETTLE_CASH_GAME_HAND_USERS
);

static readonly INVALID_TOPUP_CASH_GAME_TABLE_TOPUP_AMOUNT = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_TOPUP_CASH_GAME_TABLE_TOPUP_AMOUNT
);

static readonly INVALID_COMPLETE_CASH_GAME_TABLE_TOPUP_AMOUNT = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_COMPLETE_CASH_GAME_TABLE_TOPUP_AMOUNT
);

static readonly INVALID_REBUY_CASH_GAME_TABLE_REBUY_AMOUNT = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_REBUY_CASH_GAME_TABLE_REBUY_AMOUNT
);

static readonly INVALID_REBUY_CASH_GAME_TABLE_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_REBUY_CASH_GAME_TABLE_REQUEST
);

// Practice Game Errors
static readonly INVALID_RESERVE_PRACTICE_GAME_TABLE_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_RESERVE_PRACTICE_GAME_TABLE_REQUEST
);

static readonly INVALID_JOIN_PRACTICE_GAME_TABLE_BUYIN_AMOUNT = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_JOIN_PRACTICE_GAME_TABLE_BUYIN_AMOUNT
);

static readonly INVALID_JOIN_PRACTICE_GAME_TABLE_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_JOIN_PRACTICE_GAME_TABLE_REQUEST
);

static readonly INVALID_LEAVE_PRACTICE_GAME_TABLE_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_LEAVE_PRACTICE_GAME_TABLE_REQUEST
);

static readonly INVALID_SETTLE_PRACTICE_GAME_HAND_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_SETTLE_PRACTICE_GAME_HAND_REQUEST
);

static readonly INVALID_SETTLE_PRACTICE_GAME_HAND_USERS = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_SETTLE_PRACTICE_GAME_HAND_USERS
);

static readonly INVALID_TOPUP_PRACTICE_GAME_TABLE_TOPUP_AMOUNT = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_TOPUP_PRACTICE_GAME_TABLE_TOPUP_AMOUNT
);

static readonly INVALID_COMPLETE_PRACTICE_GAME_TABLE_TOPUP_AMOUNT = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_COMPLETE_PRACTICE_GAME_TABLE_TOPUP_AMOUNT
);

static readonly INVALID_REBUY_PRACTICE_GAME_TABLE_REBUY_AMOUNT = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_REBUY_PRACTICE_GAME_TABLE_REBUY_AMOUNT
);

static readonly INVALID_REBUY_PRACTICE_GAME_TABLE_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_REBUY_PRACTICE_GAME_TABLE_REQUEST
);

// Tds Errors (continued)
static readonly TDS_LEDGER_ENTRY_ALREADY_EXISTS = SupernovaServiceError.get(
    SupernovaErrorCodes.TDS_LEDGER_ENTRY_ALREADY_EXISTS
);

static readonly TDS_LEDGER_ENTRY_NOT_EXISTS = SupernovaServiceError.get(
    SupernovaErrorCodes.TDS_LEDGER_ENTRY_NOT_EXISTS
);

static readonly TDS_DETAILS_MISMATCH = SupernovaServiceError.get(
    SupernovaErrorCodes.TDS_DETAILS_MISMATCH
);

static readonly INVALID_WITHDRAWAL_AMOUNT = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_WITHDRAWAL_AMOUNT
);

static readonly INVALID_REFUND_AMOUNT = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_REFUND_AMOUNT
);

// User Account Errors (continued)
static readonly USER_DEPOSIT_ALREADY_SUCCESSFUL_OR_FAILED = SupernovaServiceError.get(
    SupernovaErrorCodes.USER_DEPOSIT_ALREADY_SUCCESSFUL_OR_FAILED
);

static readonly USER_WITHDRAWAL_ALREADY_SUCCESSFUL_OR_FAILED = SupernovaServiceError.get(
    SupernovaErrorCodes.USER_WITHDRAWAL_ALREADY_SUCCESSFUL_OR_FAILED
);

static readonly USER_REFUND_ALREADY_SUCCESSFUL_OR_FAILED = SupernovaServiceError.get(
    SupernovaErrorCodes.USER_REFUND_ALREADY_SUCCESSFUL_OR_FAILED
);

static readonly INVALID_USER_CONFISCATION_AMOUNT = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_USER_CONFISCATION_AMOUNT
);

static readonly INVALID_USER_CREDIT_AMOUNT = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_USER_CREDIT_AMOUNT
);

static readonly INVALID_USER_DEBIT_AMOUNT = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_USER_DEBIT_AMOUNT
);

// B2B P52 Errors (continued)
static readonly INVALID_TRANSACTION_ID_FOR_ROLLBACK = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_TRANSACTION_ID_FOR_ROLLBACK
);

static readonly INVALID_REGISTER_TOURNAMENT_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_REGISTER_TOURNAMENT_REQUEST
);

static readonly INVALID_REENTRY_TOURNAMENT_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_REENTRY_TOURNAMENT_REQUEST
);

static readonly INVALID_REBUY_TOURNAMENT_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_REBUY_TOURNAMENT_REQUEST
);

static readonly INVALID_ADDON_TOURNAMENT_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_ADDON_TOURNAMENT_REQUEST
);

static readonly INVALID_UNREGISTER_TOURNAMENT_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_UNREGISTER_TOURNAMENT_REQUEST
);

static readonly TOURNAMENT_ACCOUNT_CREATION_FAILED = SupernovaServiceError.get(
    SupernovaErrorCodes.TOURNAMENT_ACCOUNT_CREATION_FAILED
);

static readonly INVALID_SETTLE_TOURNAMENT_REQUEST = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_SETTLE_TOURNAMENT_REQUEST
);

static readonly INVALID_TRANSACTION_ID_FOR_ROLLFORWARD = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_TRANSACTION_ID_FOR_ROLLFORWARD
);

static readonly INVALID_TOURNAMENT_ID_FOR_ROLLFORWARD = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_TOURNAMENT_ID_FOR_ROLLFORWARD
);

static readonly INVALID_ENTRY_METHODS_FOR_TOURNAMENT = SupernovaServiceError.get(
    SupernovaErrorCodes.INVALID_ENTRY_METHODS_FOR_TOURNAMENT
);


    constructor(public name: string, public code: number, public message: any, public type: any) {
		super(name, code, message, type);
	}

	public static get(errorDetails: SupernovaErrorCodes): SupernovaServiceError {
		return new SupernovaServiceError(
			errorDetails.name,
			errorDetails.code,
			errorDetails.message,
            errorDetails.type || 'SupernovaServiceError',
		);
	}
}

export default SupernovaServiceError;
