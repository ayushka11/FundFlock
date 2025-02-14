class PayinErrorCodes {

    private static BaseErrorCode = 22000;
    static RuntimeError = PayinErrorCodes.BaseErrorCode + 1;
    static MandatoryFieldsMissing = PayinErrorCodes.BaseErrorCode + 2;
    static InvalidAmount = PayinErrorCodes.BaseErrorCode + 3;
    static InvalidMobile = PayinErrorCodes.BaseErrorCode + 4;
    static InvalidPayinMode = PayinErrorCodes.BaseErrorCode + 5;
    static InvalidAggregatorId = PayinErrorCodes.BaseErrorCode + 6;
    static InvalidOrderId = PayinErrorCodes.BaseErrorCode + 7;
    static OrderIdNotFound = PayinErrorCodes.BaseErrorCode + 8;
    static InvalidUserId = PayinErrorCodes.BaseErrorCode + 9;
    static InvalidDeleteId = PayinErrorCodes.BaseErrorCode + 10;
    static ThirdPartyApiCallFailed = PayinErrorCodes.BaseErrorCode + 11;
    static DatabaseReadOrUpdateFailed = PayinErrorCodes.BaseErrorCode + 12;
    static CacheReadOrUpdateFailed = PayinErrorCodes.BaseErrorCode + 13;
    static TenetMerchantNotFound = PayinErrorCodes.BaseErrorCode + 14;
    static PspNotFound = PayinErrorCodes.BaseErrorCode + 15;
    static CurrencyNotFound = PayinErrorCodes.BaseErrorCode + 16;
    static PayinModeNotFound = PayinErrorCodes.BaseErrorCode + 17;
    static TenetCustomerNotFound = PayinErrorCodes.BaseErrorCode + 18;
    static NoActivePayinModeFound = PayinErrorCodes.BaseErrorCode + 19;
    static InvalidRequest = PayinErrorCodes.BaseErrorCode + 20;
    static DuplicateCustomerId = PayinErrorCodes.BaseErrorCode + 21;
    static AddCashBan = PayinErrorCodes.BaseErrorCode + 22;
    static UserRefundIneligible = PayinErrorCodes.BaseErrorCode + 23;


    static readonly RUNTIME_ERROR = new PayinErrorCodes(
        PayinErrorCodes.RuntimeError,
        'Something went wrong',
        'APPLICATION_RUNTIME_ERROR',
    );
    

    static readonly USER_REFUND_INELIGIBLE = new PayinErrorCodes(
        PayinErrorCodes.UserRefundIneligible,
        'UserRefundIneligible',
        'USER_REFUND_INELIGIBLE_DUE_TO_INCOMPLETE_KYC'
    );

    static readonly MANDATORY_FIELDS_MISSING = new PayinErrorCodes(
        PayinErrorCodes.MandatoryFieldsMissing,
        'MandatoryFieldsMissing',
        'MANDATORY_FIELDS_MISSING'
    );
    

    static readonly INVALID_AMOUNT = new PayinErrorCodes(
        PayinErrorCodes.InvalidAmount,
        'InvalidAmount',
        'INVALID_AMOUNT'
    );

    static readonly INVALID_MOBILE = new PayinErrorCodes(
        PayinErrorCodes.InvalidMobile,
        'InvalidMobile',
        'INVALID_MOBILE'
    );

    static readonly INVALID_Payin_MODE = new PayinErrorCodes(
        PayinErrorCodes.InvalidPayinMode,
        'InvalidPayinMode',
        'INVALID_Payin_MODE'
    );

    static readonly INVALID_AGGREGATOR_ID = new PayinErrorCodes(
        PayinErrorCodes.InvalidAggregatorId,
        'InvalidAggregatorId',
        'INVALID_AGGREGATOR_ID'
    );

    static readonly INVALID_ORDER_ID = new PayinErrorCodes(
        PayinErrorCodes.InvalidOrderId,
        'InvalidOrderId',
        'INVALID_ORDER_ID'
    );

    static readonly ORDER_ID_NOT_FOUND = new PayinErrorCodes(
        PayinErrorCodes.OrderIdNotFound,
        'OrderIdNotFound',
        'ORDER_ID_NOT_FOUND'
    );

    static readonly INVALID_USER_ID = new PayinErrorCodes(
        PayinErrorCodes.InvalidUserId,
        'InvalidUserId',
        'INVALID_USER_ID'
    );

    static readonly INVALID_DELETE_ID = new PayinErrorCodes(
        PayinErrorCodes.InvalidDeleteId,
        'InvalidDeleteId',
        'INVALID_DELETE_ID'
    );

    static readonly THIRD_PARTY_API_CALL_FAILED = new PayinErrorCodes(
        PayinErrorCodes.ThirdPartyApiCallFailed,
        'ThirdPartyApiCallFailed',
        'THIRD_PARTY_API_CALL_FAILED'
    );

    static readonly DATABASE_READ_OR_UPDATE_FAILED = new PayinErrorCodes(
        PayinErrorCodes.DatabaseReadOrUpdateFailed,
        'DatabaseReadOrUpdateFailed',
        'DATABASE_READ_OR_UPDATE_FAILED'
    );

    static readonly CACHE_READ_OR_UPDATE_FAILED = new PayinErrorCodes(
        PayinErrorCodes.CacheReadOrUpdateFailed,
        'CacheReadOrUpdateFailed',
        'CACHE_READ_OR_UPDATE_FAILED'
    );

    static readonly TENET_MERCHANT_NOT_FOUND = new PayinErrorCodes(
        PayinErrorCodes.TenetMerchantNotFound,
        'TenetMerchantNotFound',
        'TENET_MERCHANT_NOT_FOUND'
    );

    static readonly PSP_NOT_FOUND = new PayinErrorCodes(
        PayinErrorCodes.PspNotFound,
        'PspNotFound',
        'PSP_NOT_FOUND'
    );

    static readonly CURRENCY_NOT_FOUND = new PayinErrorCodes(
        PayinErrorCodes.CurrencyNotFound,
        'CurrencyNotFound',
        'CURRENCY_NOT_FOUND'
    );

    static readonly Payin_MODE_NOT_FOUND = new PayinErrorCodes(
        PayinErrorCodes.PayinModeNotFound,
        'PayinModeNotFound',
        'Payin_MODE_NOT_FOUND'
    );

    static readonly TENET_CUSTOMER_NOT_FOUND = new PayinErrorCodes(
        PayinErrorCodes.TenetCustomerNotFound,
        'TenetCustomerNotFound',
        'TENET_CUSTOMER_NOT_FOUND'
    );

    static readonly NO_ACTIVE_Payin_MODE_FOUND = new PayinErrorCodes(
        PayinErrorCodes.NoActivePayinModeFound,
        'NoActivePayinModeFound',
        'NO_ACTIVE_Payin_MODE_FOUND'
    );

    static readonly INVALID_REQUEST = new PayinErrorCodes(
        PayinErrorCodes.InvalidRequest,
        'InvalidRequest',
        'INVALID_REQUEST'
    );

    static readonly DUPLICATE_CUSTOMER_ID = new PayinErrorCodes(
        PayinErrorCodes.DuplicateCustomerId,
        'DuplicateCustomerId',
        'DUPLICATE_CUSTOMER_ID'
    );

    static readonly ADD_CASH_BAN = new PayinErrorCodes(
        PayinErrorCodes.AddCashBan,
        'Add Cash have been blocked for your account. Please contact support for more details.',
        'ADD_CASH_BAN'
    );

    // private to disallow creating other instances of this type
    private constructor(
        public code: number,
        public message: string,
        public name: string,
        public type?: string,
    ) { }
    toString(): string {
        return `${this.name}:${this.code}:${this.message}`;
    }
}

export default PayinErrorCodes;
