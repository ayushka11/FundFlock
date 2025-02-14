import ServiceError from "../service-error";
import AriesErrorCodes from "./aries-error-codes";

class AriesServiceError extends ServiceError {

    static readonly GAMEPLAY_BANNED = ServiceError.get(
        AriesErrorCodes.GAMEPLAY_BANNED,
    );

    static readonly INVALID_ROOM_TYPE = ServiceError.get(
        AriesErrorCodes.INVALID_ROOM_TYPE,
    );

    static readonly INVALID_GROUP_TYPE = ServiceError.get(
      AriesErrorCodes.INVALID_GROUP_TYPE,
    );

    static readonly ROOM_NOT_AVAILABLE = ServiceError.get(
        AriesErrorCodes.ROOM_NOT_AVAILABLE,
    );

    static readonly GROUP_NOT_AVAILABLE = ServiceError.get(
        AriesErrorCodes.GROUP_NOT_AVAILABLE,
    );

    static readonly UNABLE_TO_FIND_TABLE = ServiceError.get(
        AriesErrorCodes.UNABLE_TO_FIND_TABLE,
    );

    static readonly USER_NOT_ON_TABLE = ServiceError.get(
        AriesErrorCodes.USER_NOT_ON_TABLE,
    );

    static readonly USER_NOT_ELIGIBLE_TO_SIT_ON_TABLE = ServiceError.get(
      AriesErrorCodes.USER_NOT_ELIGIBLE_TO_SIT_ON_TABLE,
    );

    static readonly TOPUP_REQUEST_ALREADY_EXISTS = ServiceError.get(
        AriesErrorCodes.TOPUP_REQUEST_ALREADY_EXISTS,
    );

    static readonly INVALID_TOPUP_REQUEST_SITOUT = ServiceError.get(
        AriesErrorCodes.INVALID_TOPUP_REQUEST_SITOUT,
    );

    static readonly INVALID_TOPUP_REQUEST_ENABLE_SITOUT = ServiceError.get(
        AriesErrorCodes.INVALID_TOPUP_REQUEST_ENABLE_SITOUT,
    );

    static readonly INSUFFICIENT_WALLET_BALANCE = ServiceError.get(
        AriesErrorCodes.INSUFFICIENT_WALLET_BALANCE,
    );

    static readonly INVALID_RESERVE_CASH_GAME_TABLE_REQUEST = ServiceError.get(
        AriesErrorCodes.INVALID_RESERVE_CASH_GAME_TABLE_REQUEST,
    );

    static readonly INVALID_JOIN_CASH_GAME_TABLE_BUYIN_AMOUNT = ServiceError.get(
        AriesErrorCodes.INVALID_JOIN_CASH_GAME_TABLE_BUYIN_AMOUNT,
    );

    static readonly INVALID_JOIN_CASH_GAME_TABLE_REQUEST = ServiceError.get(
        AriesErrorCodes.INVALID_JOIN_CASH_GAME_TABLE_REQUEST,
    );

    static readonly INVALID_LEAVE_CASH_GAME_TABLE_REQUEST = ServiceError.get(
        AriesErrorCodes.INVALID_LEAVE_CASH_GAME_TABLE_REQUEST,
    );

    static readonly INVALID_SETTLE_CASH_GAME_HAND_REQUEST = ServiceError.get(
        AriesErrorCodes.INVALID_SETTLE_CASH_GAME_HAND_REQUEST,
    );

    static readonly INVALID_SETTLE_CASH_GAME_HAND_USERS = ServiceError.get(
        AriesErrorCodes.INVALID_SETTLE_CASH_GAME_HAND_USERS,
    );

    static readonly INVALID_TOPUP_CASH_GAME_TABLE_TOPUP_AMOUNT = ServiceError.get(
        AriesErrorCodes.INVALID_TOPUP_CASH_GAME_TABLE_TOPUP_AMOUNT,
    );

    static readonly INVALID_TOPUP_CASH_GAME_TABLE_MAX_BUY_IN = ServiceError.get(
        AriesErrorCodes.INVALID_TOPUP_CASH_GAME_TABLE_MAX_BUY_IN,
    );

    static readonly INVALID_TOPUP_CASH_GAME_TABLE_INSUFFICIENT_BALANCE = ServiceError.get(
        AriesErrorCodes.INVALID_TOPUP_CASH_GAME_TABLE_INSUFFICIENT_BALANCE,
    );

    static readonly INVALID_TOPUP_CASH_GAME_TABLE_CURRENT_STACK = ServiceError.get(
        AriesErrorCodes.INVALID_TOPUP_CASH_GAME_TABLE_CURRENT_STACK,
    );

    static readonly INVALID_COMPLETE_CASH_GAME_TABLE_TOPUP_AMOUNT = ServiceError.get(
        AriesErrorCodes.INVALID_COMPLETE_CASH_GAME_TABLE_TOPUP_AMOUNT,
    );

    static readonly INVALID_REBUY_CASH_GAME_TABLE_REBUY_AMOUNT = ServiceError.get(
        AriesErrorCodes.INVALID_REBUY_CASH_GAME_TABLE_REBUY_AMOUNT,
    );

    static readonly INVALID_REBUY_CASH_GAME_TABLE_REQUEST = ServiceError.get(
        AriesErrorCodes.INVALID_REBUY_CASH_GAME_TABLE_REQUEST,
    );

    static readonly INVALID_RESERVE_PRACTICE_GAME_TABLE_REQUEST = ServiceError.get(
        AriesErrorCodes.INVALID_RESERVE_PRACTICE_GAME_TABLE_REQUEST
    )

    static readonly INVALID_JOIN_PRACTICE_GAME_TABLE_BUYIN_AMOUNT = ServiceError.get(
        AriesErrorCodes.INVALID_JOIN_PRACTICE_GAME_TABLE_BUYIN_AMOUNT
    )

    static readonly INVALID_JOIN_PRACTICE_GAME_TABLE_REQUEST = ServiceError.get(
        AriesErrorCodes.INVALID_JOIN_PRACTICE_GAME_TABLE_REQUEST
    )

    static readonly INVALID_LEAVE_PRACTICE_GAME_TABLE_REQUEST = ServiceError.get(
        AriesErrorCodes.INVALID_LEAVE_PRACTICE_GAME_TABLE_REQUEST,
    );

    static readonly INVALID_SETTLE_PRACTICE_GAME_HAND_REQUEST = ServiceError.get(
        AriesErrorCodes.INVALID_SETTLE_PRACTICE_GAME_HAND_REQUEST,
    );

    static readonly INVALID_SETTLE_PRACTICE_GAME_HAND_USERS = ServiceError.get(
        AriesErrorCodes.INVALID_SETTLE_PRACTICE_GAME_HAND_USERS,
    );

    static readonly INVALID_TOPUP_PRACTICE_GAME_TABLE_TOPUP_AMOUNT = ServiceError.get(
        AriesErrorCodes.INVALID_TOPUP_PRACTICE_GAME_TABLE_TOPUP_AMOUNT,
    );

    static readonly INVALID_TOPUP_PRACTICE_GAME_TABLE_MAX_BUY_IN = ServiceError.get(
        AriesErrorCodes.INVALID_TOPUP_PRACTICE_GAME_TABLE_MAX_BUY_IN,
    );

    static readonly INVALID_TOPUP_PRACTICE_GAME_TABLE_INSUFFICIENT_BALANCE = ServiceError.get(
        AriesErrorCodes.INVALID_TOPUP_PRACTICE_GAME_TABLE_INSUFFICIENT_BALANCE,
    );

    static readonly INVALID_TOPUP_PRACTICE_GAME_TABLE_CURRENT_STACK = ServiceError.get(
        AriesErrorCodes.INVALID_TOPUP_PRACTICE_GAME_TABLE_CURRENT_STACK,
    );

    static readonly INVALID_COMPLETE_PRACTICE_GAME_TABLE_TOPUP_AMOUNT = ServiceError.get(
        AriesErrorCodes.INVALID_COMPLETE_PRACTICE_GAME_TABLE_TOPUP_AMOUNT,
    );

    static readonly INVALID_REBUY_PRACTICE_GAME_TABLE_REBUY_AMOUNT = ServiceError.get(
        AriesErrorCodes.INVALID_REBUY_PRACTICE_GAME_TABLE_REBUY_AMOUNT,
    );

    static readonly INVALID_REBUY_PRACTICE_GAME_TABLE_REQUEST = ServiceError.get(
        AriesErrorCodes.INVALID_REBUY_PRACTICE_GAME_TABLE_REQUEST,
    );

    static readonly USER_ALREADY_ON_TABLE = ServiceError.get(
        AriesErrorCodes.USER_ALREADY_ON_TABLE,
    );

    static readonly PLAYER_NOT_AVAILABLE_ON_TABLE = ServiceError.get(
        AriesErrorCodes.PLAYER_NOT_AVAILABLE_ON_TABLE,
    );

    static readonly PLAYER_ALREADY_LEFT = ServiceError.get(
        AriesErrorCodes.PLAYER_ALREADY_LEFT,
    );

    static readonly SEAT_NOT_OCCUPIED = ServiceError.get(
        AriesErrorCodes.SEAT_NOT_OCCUPIED,
    );

    static readonly SEAT_ALREADY_OCCUPIED = ServiceError.get(
        AriesErrorCodes.SEAT_ALREADY_OCCUPIED,
    );

    static readonly SEAT_NOT_RESERVED = ServiceError.get(
        AriesErrorCodes.SEAT_NOT_RESERVED,
    );

    static readonly PLAYER_SEAT_EMPTY = ServiceError.get(
        AriesErrorCodes.PLAYER_SEAT_EMPTY,
    );

    static readonly INVALID_SEAT_ID = ServiceError.get(
        AriesErrorCodes.INVALID_SEAT_ID,
    );

    static readonly INVALID_PLAYER_ON_SEAT = ServiceError.get(
        AriesErrorCodes.INVALID_PLAYER_ON_SEAT,
    );

    static readonly NO_EMPTY_SEAT_FOUND = ServiceError.get(
        AriesErrorCodes.NO_EMPTY_SEAT_FOUND,
    );

    static readonly SEAT_NOT_EMPTY = ServiceError.get(
        AriesErrorCodes.SEAT_NOT_EMPTY,
    );

    static readonly RESERVE_TABLE_LIMIT_REACHED = ServiceError.get(
        AriesErrorCodes.RESERVE_TABLE_LIMIT_REACHED,
    );

    static readonly PRIMARY_ROOM_NOT_AVAILABLE = ServiceError.get(
        AriesErrorCodes.PRIMARY_ROOM_NOT_AVAILABLE,
    );

    constructor(public name: string, public code: number, public message: any, public type: any) {
        super(name, code, message, type);
    }

    public static get(errorDetails: AriesErrorCodes): AriesServiceError {
        return new AriesServiceError(
            errorDetails.name,
            errorDetails.code,
            errorDetails.message,
            errorDetails.type || 'AriesServiceError',
        );
    }
}

export default AriesServiceError;
