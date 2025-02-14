import PayinServiceError from './payin-error';
import PayinErrorCodes from './payin-error-codes';
import ServiceErrorUtil from '../service-error-util';

class PayinServiceErrorUtil extends ServiceErrorUtil {
    public static getRuntimeError(): PayinServiceError {
        return PayinServiceError.get(PayinErrorCodes.RUNTIME_ERROR);
    }

    public static getError(error: Error): PayinServiceError {
        if (!(error instanceof PayinServiceError)) {
            return this.getRuntimeError();
        }
        return error;
    }
    

    public static getUserRefundIneligible(): PayinServiceError {
        return PayinServiceError.USER_REFUND_INELIGIBLE;
    }

    public static getMandatoryFieldsMissing(): PayinServiceError {
        return PayinServiceError.MANDATORY_FIELDS_MISSING;
    }

    public static getInvalidAmount(): PayinServiceError {
        return PayinServiceError.INVALID_AMOUNT;
    }

    public static getInvalidMobile(): PayinServiceError {
        return PayinServiceError.INVALID_MOBILE;
    }

    public static getInvalidPayinMode(): PayinServiceError {
        return PayinServiceError.INVALID_Payin_MODE;
    }

    public static getInvalidAggregatorId(): PayinServiceError {
        return PayinServiceError.INVALID_AGGREGATOR_ID;
    }

    public static getInvalidOrderId(): PayinServiceError {
        return PayinServiceError.INVALID_ORDER_ID;
    }

    public static getOrderIdNotFound(): PayinServiceError {
        return PayinServiceError.ORDER_ID_NOT_FOUND;
    }

    public static getInvalidUserId(): PayinServiceError {
        return PayinServiceError.INVALID_USER_ID;
    }

    public static getInvalidDeleteId(): PayinServiceError {
        return PayinServiceError.INVALID_DELETE_ID;
    }

    public static getThirdPartyApiCallFailed(): PayinServiceError {
        return PayinServiceError.THIRD_PARTY_API_CALL_FAILED;
    }

    public static getDatabaseReadOrUpdateFailed(): PayinServiceError {
        return PayinServiceError.DATABASE_READ_OR_UPDATE_FAILED;
    }

    public static getCacheReadOrUpdateFailed(): PayinServiceError {
        return PayinServiceError.CACHE_READ_OR_UPDATE_FAILED;
    }

    public static getTenetMerchantNotFound(): PayinServiceError {
        return PayinServiceError.TENET_MERCHANT_NOT_FOUND;
    }

    public static getPspNotFound(): PayinServiceError {
        return PayinServiceError.PSP_NOT_FOUND;
    }

    public static getCurrencyNotFound(): PayinServiceError {
        return PayinServiceError.CURRENCY_NOT_FOUND;
    }

    public static getPayinModeNotFound(): PayinServiceError {
        return PayinServiceError.Payin_MODE_NOT_FOUND;
    }

    public static getTenetCustomerNotFound(): PayinServiceError {
        return PayinServiceError.TENET_CUSTOMER_NOT_FOUND;
    }

    public static getNoActivePayinModeFound(): PayinServiceError {
        return PayinServiceError.NO_ACTIVE_Payin_MODE_FOUND;
    }

    public static getInvalidRequest(): PayinServiceError {
        return PayinServiceError.INVALID_REQUEST;
    }

    public static getDuplicateCustomerId(): PayinServiceError {

        return PayinServiceError.DUPLICATE_CUSTOMER_ID;
    }

    public static getAddCashBan(): PayinServiceError {
        return PayinServiceError.ADD_CASH_BAN;
    }

    public static wrapError(error: any): PayinServiceError {
        return PayinServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `PayinServiceError:${error.type}`,
        })
    }
}

export default PayinServiceErrorUtil;
