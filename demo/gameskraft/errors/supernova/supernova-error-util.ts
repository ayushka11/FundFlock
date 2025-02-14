import SupernovaServiceError from './supernova-error';
import SupernovaErrorCodes from './supernova-error-codes';
import ServiceErrorUtil from '../service-error-util';
import ServiceError from '../service-error';

class SupernovaServiceErrorUtil extends ServiceErrorUtil {

    public static getRuntimeError(): SupernovaServiceError {
		return SupernovaServiceError.get(SupernovaErrorCodes.INTERNAL_SERVER_ERROR);
	}

	public static getError(error: Error): SupernovaServiceError {
		if (!(error instanceof SupernovaServiceError)) {
			return this.getRuntimeError();
		}
		return error;
	}

    public static getAuthorizationError(): SupernovaServiceError {
        return SupernovaServiceError.AUTHORIZATION_ERROR    
    }

    public static getInternalServerError(): SupernovaServiceError {
        return SupernovaServiceError.INTERNAL_SERVER_ERROR;
    }
    
    public static getBodyValidationError(): SupernovaServiceError { 
        return SupernovaServiceError.BODY_VALIDATION_ERROR;
    }

    public static getDbAnomaly(): SupernovaServiceError {
        return SupernovaServiceError.DB_ANOMALY;
    }

    public static getInvalidVendorId(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_VENDORID;
    }

    public static getInsufficientBalance(): SupernovaServiceError {
    return SupernovaServiceError.INSUFFICIENT_WALLET_BALANCE;
    }

    public static getInvalidReserveCashGameTableRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_RESERVE_CASH_GAME_TABLE_REQUEST;
    }

    public static getInvalidJoinCashGameTableBuyinAmount(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_JOIN_CASH_GAME_TABLE_BUYIN_AMOUNT;
    }

    public static getInvalidJoinCashGameTableRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_JOIN_CASH_GAME_TABLE_REQUEST;
    }

    public static getInvalidLeaveCashGameTableRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_LEAVE_CASH_GAME_TABLE_REQUEST;
    }

    public static getInvalidSettleCashGameHandRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_SETTLE_CASH_GAME_HAND_REQUEST;
    }

    public static getInvalidSettleCashGameHandUsers(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_SETTLE_CASH_GAME_HAND_USERS;
    }

    public static getInvalidTopupCashGameTableTopupAmount(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_TOPUP_CASH_GAME_TABLE_TOPUP_AMOUNT;
    }

    public static getInvalidCompleteCashGameTableTopupAmount(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_COMPLETE_CASH_GAME_TABLE_TOPUP_AMOUNT;
    }

    public static getInvalidRebuyCashGameTableRebuyAmount(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_REBUY_CASH_GAME_TABLE_REBUY_AMOUNT;
    }

    public static getInvalidRebuyCashGameTableRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_REBUY_CASH_GAME_TABLE_REQUEST;
    }

    // Practice Game Errors
    public static getInvalidReservePracticeGameTableRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_RESERVE_PRACTICE_GAME_TABLE_REQUEST;
    }

    public static getInvalidJoinPracticeGameTableBuyinAmount(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_JOIN_PRACTICE_GAME_TABLE_BUYIN_AMOUNT;
    }

    public static getInvalidJoinPracticeGameTableRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_JOIN_PRACTICE_GAME_TABLE_REQUEST;
    }

    public static getInvalidLeavePracticeGameTableRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_LEAVE_PRACTICE_GAME_TABLE_REQUEST;
    }

    public static getInvalidSettlePracticeGameHandRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_SETTLE_PRACTICE_GAME_HAND_REQUEST;
    }

    public static getInvalidSettlePracticeGameHandUsers(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_SETTLE_PRACTICE_GAME_HAND_USERS;
    }

    public static getInvalidTopupPracticeGameTableTopupAmount(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_TOPUP_PRACTICE_GAME_TABLE_TOPUP_AMOUNT;
    }

    public static getInvalidCompletePracticeGameTableTopupAmount(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_COMPLETE_PRACTICE_GAME_TABLE_TOPUP_AMOUNT;
    }

    public static getInvalidRebuyPracticeGameTableRebuyAmount(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_REBUY_PRACTICE_GAME_TABLE_REBUY_AMOUNT;
    }

    public static getInvalidRebuyPracticeGameTableRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_REBUY_PRACTICE_GAME_TABLE_REQUEST;
    }

    // Tds Errors (continued)
    public static getTdsLedgerEntryAlreadyExists(): SupernovaServiceError {
        return SupernovaServiceError.TDS_LEDGER_ENTRY_ALREADY_EXISTS;
    }

    public static getTdsLedgerEntryNotExists(): SupernovaServiceError {
        return SupernovaServiceError.TDS_LEDGER_ENTRY_NOT_EXISTS;
    }

    public static getTdsDetailsMismatch(): SupernovaServiceError {
        return SupernovaServiceError.TDS_DETAILS_MISMATCH;
    }

    public static getInvalidWithdrawalAmount(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_WITHDRAWAL_AMOUNT;
    }

    public static getInvalidRefundAmount(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_REFUND_AMOUNT;
    }

    // User Account Errors (continued)
    public static getUserDepositAlreadySuccessfulOrFailed(): SupernovaServiceError {
        return SupernovaServiceError.USER_DEPOSIT_ALREADY_SUCCESSFUL_OR_FAILED;
    }

    public static getUserWithdrawalAlreadySuccessfulOrFailed(): SupernovaServiceError {
        return SupernovaServiceError.USER_WITHDRAWAL_ALREADY_SUCCESSFUL_OR_FAILED;
    }

    public static getUserRefundAlreadySuccessfulOrFailed(): SupernovaServiceError {
        return SupernovaServiceError.USER_REFUND_ALREADY_SUCCESSFUL_OR_FAILED;
    }

    public static getInvalidUserConfiscationAmount(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_USER_CONFISCATION_AMOUNT;
    }

    public static getInvalidUserCreditAmount(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_USER_CREDIT_AMOUNT;
    }

    public static getInvalidUserDebitAmount(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_USER_DEBIT_AMOUNT;
    }

    // B2B P52 Errors (continued)
    public static getInvalidTransactionIdForRollback(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_TRANSACTION_ID_FOR_ROLLBACK;
    }

    public static getInvalidRegisterTournamentRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_REGISTER_TOURNAMENT_REQUEST;
    }

    public static getInvalidReentryTournamentRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_REENTRY_TOURNAMENT_REQUEST;
    }

    public static getInvalidRebuyTournamentRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_REBUY_TOURNAMENT_REQUEST;
    }

    public static getInvalidAddonTournamentRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_ADDON_TOURNAMENT_REQUEST;
    }

    public static getInvalidUnregisterTournamentRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_UNREGISTER_TOURNAMENT_REQUEST;
    }

    public static getTournamentAccountCreationFailed(): SupernovaServiceError {
        return SupernovaServiceError.TOURNAMENT_ACCOUNT_CREATION_FAILED;
    }

    public static getInvalidSettleTournamentRequest(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_SETTLE_TOURNAMENT_REQUEST;
    }

    public static getInvalidTransactionIdForRollforward(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_TRANSACTION_ID_FOR_ROLLFORWARD;
    }

    public static getInvalidTournamentIdForRollforward(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_TOURNAMENT_ID_FOR_ROLLFORWARD;
    }

    public static getInvalidEntryMethodsForTournament(): SupernovaServiceError {
        return SupernovaServiceError.INVALID_ENTRY_METHODS_FOR_TOURNAMENT;
    }

	public static wrapError(error: any): SupernovaServiceError {
		return SupernovaServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `SupernovaServiceError:${error.type}`,
        })
	}
}

export default SupernovaServiceErrorUtil;
