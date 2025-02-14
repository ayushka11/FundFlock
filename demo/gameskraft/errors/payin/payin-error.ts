import PayinErrorCodes from './payin-error-codes';
import ServiceError from '../service-error';

class PayinServiceError extends ServiceError {
    static readonly MANDATORY_FIELDS_MISSING = PayinServiceError.get(
        PayinErrorCodes.MANDATORY_FIELDS_MISSING,
    );

    

    static readonly USER_REFUND_INELIGIBLE = PayinServiceError.get(
        PayinErrorCodes.USER_REFUND_INELIGIBLE,
    );

    static readonly INVALID_AMOUNT = PayinServiceError.get(
        PayinErrorCodes.INVALID_AMOUNT,
    );

    static readonly INVALID_MOBILE = PayinServiceError.get(
        PayinErrorCodes.INVALID_MOBILE,
    );

    static readonly INVALID_Payin_MODE = PayinServiceError.get(
        PayinErrorCodes.INVALID_Payin_MODE,
    );

    static readonly INVALID_AGGREGATOR_ID = PayinServiceError.get(
        PayinErrorCodes.INVALID_AGGREGATOR_ID,
    );

    static readonly INVALID_ORDER_ID = PayinServiceError.get(
        PayinErrorCodes.INVALID_ORDER_ID,
    );

    static readonly ORDER_ID_NOT_FOUND = PayinServiceError.get(
        PayinErrorCodes.ORDER_ID_NOT_FOUND,
    );

    static readonly INVALID_USER_ID = PayinServiceError.get(
        PayinErrorCodes.INVALID_USER_ID,
    );

    static readonly INVALID_DELETE_ID = PayinServiceError.get(
        PayinErrorCodes.INVALID_DELETE_ID,
    );

    static readonly THIRD_PARTY_API_CALL_FAILED = PayinServiceError.get(
        PayinErrorCodes.THIRD_PARTY_API_CALL_FAILED,
    );

    static readonly DATABASE_READ_OR_UPDATE_FAILED = PayinServiceError.get(
        PayinErrorCodes.DATABASE_READ_OR_UPDATE_FAILED,
    );

    static readonly CACHE_READ_OR_UPDATE_FAILED = PayinServiceError.get(
        PayinErrorCodes.CACHE_READ_OR_UPDATE_FAILED,
    );

    static readonly TENET_MERCHANT_NOT_FOUND = PayinServiceError.get(
        PayinErrorCodes.TENET_MERCHANT_NOT_FOUND,
    );

    static readonly PSP_NOT_FOUND = PayinServiceError.get(
        PayinErrorCodes.PSP_NOT_FOUND,
    );

    static readonly CURRENCY_NOT_FOUND = PayinServiceError.get(
        PayinErrorCodes.CURRENCY_NOT_FOUND,
    );

    static readonly Payin_MODE_NOT_FOUND = PayinServiceError.get(
        PayinErrorCodes.Payin_MODE_NOT_FOUND,
    );

    static readonly TENET_CUSTOMER_NOT_FOUND = PayinServiceError.get(
        PayinErrorCodes.TENET_CUSTOMER_NOT_FOUND,
    );

    static readonly NO_ACTIVE_Payin_MODE_FOUND = PayinServiceError.get(
        PayinErrorCodes.NO_ACTIVE_Payin_MODE_FOUND,
    );

    static readonly INVALID_REQUEST = PayinServiceError.get(
        PayinErrorCodes.INVALID_REQUEST,
    );

    static readonly DUPLICATE_CUSTOMER_ID = PayinServiceError.get(
        PayinErrorCodes.DUPLICATE_CUSTOMER_ID,
    );

    static readonly ADD_CASH_BAN = PayinServiceError.get(
        PayinErrorCodes.ADD_CASH_BAN,
    );

    constructor(public name: string, public code: number, public message: any, public type: any) {
        super(name, code, message, type);
    }

    public static get(errorDetails: PayinErrorCodes): PayinServiceError {
        return new PayinServiceError(
            errorDetails.name,
            errorDetails.code,
            errorDetails.message,
            errorDetails.type || 'PayinServiceError',
        );
    }
}

export default PayinServiceError;
