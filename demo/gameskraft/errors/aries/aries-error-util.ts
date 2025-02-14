import AriesServiceError from './aries-error';
import ServiceErrorUtil from '../service-error-util';
import AriesErrorCode from './aries-error-codes';

class AriesServiceErrorUtil extends ServiceErrorUtil {

    public static getRuntimeError(): AriesServiceError {
        return AriesServiceError.get(AriesErrorCode.RUNTIME_ERROR);
    }

    public static getError(error: Error): AriesServiceError {
        if (!(error instanceof AriesServiceError)) {
            return this.getRuntimeError();
        }
        return error;
    }

    static getGameplayBannedError(): AriesServiceError {
        return AriesServiceError.GAMEPLAY_BANNED;
    }

    static getInvalidRoomTypeError(): AriesServiceError {
        return AriesServiceError.INVALID_ROOM_TYPE;
    }

    static getInvalidGroupTypeError(): AriesServiceError {
        return AriesServiceError.INVALID_GROUP_TYPE;
    }

    static getRoomNotAvailableError(): AriesServiceError {
        return AriesServiceError.ROOM_NOT_AVAILABLE;
    }

    static getGroupNotAvailableError(): AriesServiceError {
        return AriesServiceError.GROUP_NOT_AVAILABLE;
    }

    static getUnableToFindTableError(): AriesServiceError {
        return AriesServiceError.UNABLE_TO_FIND_TABLE;
    }

    static getUserNotOnTableError(): AriesServiceError {
        return AriesServiceError.USER_NOT_ON_TABLE;
    }

    static getUserNotEligibleToSitError(): AriesServiceError {
        return AriesServiceError.USER_NOT_ELIGIBLE_TO_SIT_ON_TABLE;
    }


    static getTopupRequestAlreadyExistsError(): AriesServiceError {
        return AriesServiceError.TOPUP_REQUEST_ALREADY_EXISTS;
    }

    static getInvalidTopupRequestSitoutError(): AriesServiceError {
        return AriesServiceError.INVALID_TOPUP_REQUEST_SITOUT;
    }

    static getInvalidTopupRequestEnableSitoutError(): AriesServiceError {
        return AriesServiceError.INVALID_TOPUP_REQUEST_ENABLE_SITOUT;
    }

    static getInsufficientWalletBalanceError(): AriesServiceError {
        return AriesServiceError.INSUFFICIENT_WALLET_BALANCE;
    }

    static getInvalidReserveCashGameTableRequestError(): AriesServiceError {
        return AriesServiceError.INVALID_RESERVE_CASH_GAME_TABLE_REQUEST;
    }

    static getInvalidJoinCashGameTableBuyinAmountError(): AriesServiceError {
        return AriesServiceError.INVALID_JOIN_CASH_GAME_TABLE_BUYIN_AMOUNT;
    }

    static getInvalidJoinCashGameTableRequestError(): AriesServiceError {
        return AriesServiceError.INVALID_JOIN_CASH_GAME_TABLE_REQUEST;
    }

    static getInvalidLeaveCashGameTableRequestError(): AriesServiceError {
        return AriesServiceError.INVALID_LEAVE_CASH_GAME_TABLE_REQUEST;
    }

    static getInvalidSettleCashGameHandRequestError(): AriesServiceError {
        return AriesServiceError.INVALID_SETTLE_CASH_GAME_HAND_REQUEST;
    }

    static getInvalidSettleCashGameHandUsersError(): AriesServiceError {
        return AriesServiceError.INVALID_SETTLE_CASH_GAME_HAND_USERS;
    }

    static getInvalidTopupCashGameTableTopupAmountError(): AriesServiceError {
        return AriesServiceError.INVALID_TOPUP_CASH_GAME_TABLE_TOPUP_AMOUNT;
    }

    static getInvalidTopupCashGameTableMaxBuyInError(): AriesServiceError {
        return AriesServiceError.INVALID_TOPUP_CASH_GAME_TABLE_MAX_BUY_IN;
    }

    static getInvalidTopupCashGameTableInsufficientBalanceError(): AriesServiceError {
        return AriesServiceError.INVALID_TOPUP_CASH_GAME_TABLE_INSUFFICIENT_BALANCE;
    }

    static getInvalidTopupCashGameTableCurrentStackError(): AriesServiceError {
        return AriesServiceError.INVALID_TOPUP_CASH_GAME_TABLE_CURRENT_STACK;
    }

    static getInvalidCompleteCashGameTableTopupAmountError(): AriesServiceError {
        return AriesServiceError.INVALID_COMPLETE_CASH_GAME_TABLE_TOPUP_AMOUNT;
    }

    static getInvalidRebuyCashGameTableRebuyAmountError(): AriesServiceError {
        return AriesServiceError.INVALID_REBUY_CASH_GAME_TABLE_REBUY_AMOUNT;
    }

    static getInvalidRebuyCashGameTableRequestError(): AriesServiceError {
        return AriesServiceError.INVALID_REBUY_CASH_GAME_TABLE_REQUEST;
    }

    // Practice Game Errors
    static getInvalidReservePracticeGameTableRequestError(): AriesServiceError {
        return AriesServiceError.INVALID_RESERVE_PRACTICE_GAME_TABLE_REQUEST;
    }

    static getInvalidJoinPracticeGameTableBuyinAmountError(): AriesServiceError {
        return AriesServiceError.INVALID_JOIN_PRACTICE_GAME_TABLE_BUYIN_AMOUNT;
    }

    static getInvalidJoinPracticeGameTableRequestError(): AriesServiceError {
        return AriesServiceError.INVALID_JOIN_PRACTICE_GAME_TABLE_REQUEST;
    }

    static getInvalidLeavePracticeGameTableRequestError(): AriesServiceError {
        return AriesServiceError.INVALID_LEAVE_PRACTICE_GAME_TABLE_REQUEST;
    }

    static getInvalidSettlePracticeGameHandRequestError(): AriesServiceError {
        return AriesServiceError.INVALID_SETTLE_PRACTICE_GAME_HAND_REQUEST;
    }

    static getInvalidSettlePracticeGameHandUsersError(): AriesServiceError {
        return AriesServiceError.INVALID_SETTLE_PRACTICE_GAME_HAND_USERS;
    }

    static getInvalidTopupPracticeGameTableTopupAmountError(): AriesServiceError {
        return AriesServiceError.INVALID_TOPUP_PRACTICE_GAME_TABLE_TOPUP_AMOUNT;
    }

    static getInvalidTopupPracticeGameTableMaxBuyInError(): AriesServiceError {
        return AriesServiceError.INVALID_TOPUP_PRACTICE_GAME_TABLE_MAX_BUY_IN;
    }

    static getInvalidTopupPracticeGameTableInsufficientBalanceError(): AriesServiceError {
        return AriesServiceError.INVALID_TOPUP_PRACTICE_GAME_TABLE_INSUFFICIENT_BALANCE;
    }

    static getInvalidTopupPracticeGameTableCurrentStackError(): AriesServiceError {
        return AriesServiceError.INVALID_TOPUP_PRACTICE_GAME_TABLE_CURRENT_STACK;
    }

    static getInvalidCompletePracticeGameTableTopupAmountError(): AriesServiceError {
        return AriesServiceError.INVALID_COMPLETE_PRACTICE_GAME_TABLE_TOPUP_AMOUNT;
    }

    static getInvalidRebuyPracticeGameTableRebuyAmountError(): AriesServiceError {
        return AriesServiceError.INVALID_REBUY_PRACTICE_GAME_TABLE_REBUY_AMOUNT;
    }

    static getInvalidRebuyPracticeGameTableRequestError(): AriesServiceError {
        return AriesServiceError.INVALID_REBUY_PRACTICE_GAME_TABLE_REQUEST;
    }

    // Aries Lua Error
    static getUserAlreadyOnTableError(): AriesServiceError {
        return AriesServiceError.USER_ALREADY_ON_TABLE;
    }

    static getPlayerNotAvailableOnTableError(): AriesServiceError {
        return AriesServiceError.PLAYER_NOT_AVAILABLE_ON_TABLE;
    }

    static getPlayerAlreadyLeftError(): AriesServiceError {
        return AriesServiceError.PLAYER_ALREADY_LEFT;
    }

    static getSeatNotOccupiedError(): AriesServiceError {
        return AriesServiceError.SEAT_NOT_OCCUPIED;
    }

    static getSeatAlreadyOccupiedError(): AriesServiceError {
        return AriesServiceError.SEAT_ALREADY_OCCUPIED;
    }

    static getSeatNotReservedError(): AriesServiceError {
        return AriesServiceError.SEAT_NOT_RESERVED;
    }

    static getPlayerSeatEmptyError(): AriesServiceError {
        return AriesServiceError.PLAYER_SEAT_EMPTY;
    }

    static getInvalidSeatIdError(): AriesServiceError {
        return AriesServiceError.INVALID_SEAT_ID;
    }

    static getInvalidPlayerOnSeatError(): AriesServiceError {
        return AriesServiceError.INVALID_PLAYER_ON_SEAT;
    }

    static getNoEmptySeatFoundError(): AriesServiceError {
        return AriesServiceError.NO_EMPTY_SEAT_FOUND;
    }

    static getSeatNotEmptyError(): AriesServiceError {
        return AriesServiceError.SEAT_NOT_EMPTY;
    }

    static getReserveTableLimitReached(): AriesServiceError {
        return AriesServiceError.RESERVE_TABLE_LIMIT_REACHED;
    }

    static getPrimaryRoomNotAvailableError(): AriesServiceError {
        return AriesServiceError.PRIMARY_ROOM_NOT_AVAILABLE;
    }


    public static wrapError(error: any): AriesServiceError {
        return AriesServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `AriesService:${error.type}`,
        })
    }
}

export default AriesServiceErrorUtil;
