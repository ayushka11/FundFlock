import IDMErrorCodes from './idm-error-codes';
import ServiceError from '../service-error';

class IDMServiceError extends ServiceError {

    static readonly DOCUMENT_NOT_PAN = IDMServiceError.get(
        IDMErrorCodes.DOCUMENT_NOT_PAN,
    );

    static readonly IMAGE_NOT_READABLE = IDMServiceError.get(
        IDMErrorCodes.IMAGE_NOT_READABLE,
    );

    static readonly EXTRACTION_DATA_NOT_VALID = IDMServiceError.get(
        IDMErrorCodes.EXTRACTION_DATA_NOT_VALID,
    );

    static readonly PAN_TYPE_NOT_INDIVIDUAL = IDMServiceError.get(
        IDMErrorCodes.PAN_TYPE_NOT_INDIVIDUAL,
    );

    static readonly MINOR_DOB = IDMServiceError.get(
        IDMErrorCodes.MINOR_DOB,
    );

    static readonly DETECTION_API_ERROR = IDMServiceError.get(
        IDMErrorCodes.DETECTION_API_ERROR,
    );

    static readonly EXTRACTION_API_ERROR = IDMServiceError.get(
        IDMErrorCodes.EXTRACTION_API_ERROR,
    );

    static readonly BAD_IMAGE_QUALITY = IDMServiceError.get(
        IDMErrorCodes.BAD_IMAGE_QUALITY,
    );

    static readonly IDFY_INSUFFICIENT_FUNDS = IDMServiceError.get(
        IDMErrorCodes.IDFY_INSUFFICIENT_FUNDS,
    );

    static readonly DOCUMENT_NOT_ORIGINAL = IDMServiceError.get(
        IDMErrorCodes.DOCUMENT_NOT_ORIGINAL,
    );

    static readonly PASSWORD_PROTECTED_FILE = IDMServiceError.get(
        IDMErrorCodes.PASSWORD_PROTECTED_FILE,
    );

	static readonly USER_DOES_NOT_EXIST = IDMServiceError.get(
        IDMErrorCodes.USER_DOES_NOT_EXIST,
    );

    static readonly MISSING_REQUIRED_UNIQUE_ID = IDMServiceError.get(
        IDMErrorCodes.MISSING_REQUIRED_UNIQUE_ID,
    );

    static readonly MISSING_REQUIRED_DISPLAY_NAME_INFO = IDMServiceError.get(
        IDMErrorCodes.MISSING_REQUIRED_DISPLAY_NAME_INFO,
    );

    static readonly NO_SUCH_USER = IDMServiceError.get(
        IDMErrorCodes.NO_SUCH_USER,
    );

    static readonly INCORRECT_PASSWORD = IDMServiceError.get(
        IDMErrorCodes.INCORRECT_PASSWORD,
    );

    static readonly INVALID_FACEBOOK_ACCESS_TOKEN = IDMServiceError.get(
        IDMErrorCodes.INVALID_FACEBOOK_ACCESS_TOKEN,
    );

    static readonly INVALID_GOOGLE_ID_TOKEN = IDMServiceError.get(
        IDMErrorCodes.INVALID_GOOGLE_ID_TOKEN,
    );

    static readonly INVALID_REFERRAL_INFO = IDMServiceError.get(
        IDMErrorCodes.INVALID_REFERRAL_INFO,
    );

    static readonly INVALID_EMAIL_FORMAT = IDMServiceError.get(
        IDMErrorCodes.INVALID_EMAIL_FORMAT,
    );

    static readonly EMAIL_NOT_PRESENT = IDMServiceError.get(
        IDMErrorCodes.EMAIL_NOT_PRESENT,
    );

    static readonly INVALID_MOBILE_FORMAT = IDMServiceError.get(
        IDMErrorCodes.INVALID_MOBILE_FORMAT,
    );

    static readonly INVALID_USER_ID = IDMServiceError.get(
        IDMErrorCodes.INVALID_USER_ID,
    );

    static readonly EMAIL_OR_MOBILE_REQUIRED = IDMServiceError.get(
        IDMErrorCodes.EMAIL_OR_MOBILE_REQUIRED,
    );

    static readonly DISPLAY_NAME_NECESSARY = IDMServiceError.get(
        IDMErrorCodes.DISPLAY_NAME_NECESSARY,
    );

    static readonly PASSWORD_NECESSARY = IDMServiceError.get(
        IDMErrorCodes.PASSWORD_NECESSARY,
    );

    static readonly EMAIL_ALREADY_EXIST = IDMServiceError.get(
        IDMErrorCodes.EMAIL_ALREADY_EXIST,
    );

    static readonly MOBILE_ALREADY_EXIST = IDMServiceError.get(
        IDMErrorCodes.MOBILE_ALREADY_EXIST,
    );

    static readonly SAME_MOBILE_ALREADY_EXIST = IDMServiceError.get(
        IDMErrorCodes.SAME_MOBILE_ALREADY_EXIST,
    );

    static readonly INVALID_DISPLAY_NAME = IDMServiceError.get(
        IDMErrorCodes.INVALID_DISPLAY_NAME,
    );

    static readonly DISPLAY_NAME_TOO_SHORT = IDMServiceError.get(
        IDMErrorCodes.DISPLAY_NAME_TOO_SHORT,
    );

    static readonly DISPLAY_NAME_TOO_LONG = IDMServiceError.get(
        IDMErrorCodes.DISPLAY_NAME_TOO_LONG,
    );

    static readonly DISPLAY_NAME_CONTAINS_SWEAR_WORD = IDMServiceError.get(
        IDMErrorCodes.DISPLAY_NAME_CONTAINS_SWEAR_WORD,
    );

    static readonly DISPLAY_NAME_STARTS_WITH_INVALID_SEQUENCE = IDMServiceError.get(
        IDMErrorCodes.DISPLAY_NAME_STARTS_WITH_INVALID_SEQUENCE,
    );

    static readonly DISPLAY_NAME_SHOULD_HAVE_ONE_ALPHABET = IDMServiceError.get(
        IDMErrorCodes.DISPLAY_NAME_SHOULD_HAVE_ONE_ALPHABET,
    );

    static readonly DISPLAY_NAME_API_INTENT_NOT_VALIDATION = IDMServiceError.get(
        IDMErrorCodes.DISPLAY_NAME_API_INTENT_NOT_VALIDATION,
    );

    static readonly INVALID_PAN_STATUS = IDMServiceError.get(
        IDMErrorCodes.INVALID_PAN_STATUS,
    );

    static readonly INVALID_BANK_STATUS = IDMServiceError.get(
        IDMErrorCodes.INVALID_BANK_STATUS,
    );

    static readonly MOBILE_UPDATE_INVALID = IDMServiceError.get(
        IDMErrorCodes.MOBILE_UPDATE_INVALID,
    );

    static readonly MOBILE_NUMBER_INVALID = IDMServiceError.get(
        IDMErrorCodes.MOBILE_NUMBER_INVALID,
    );

    static readonly INVALID_FLOW_FOR_USER = IDMServiceError.get(
        IDMErrorCodes.INVALID_FLOW_FOR_USER,
    );

    static readonly DISPLAY_NAME_ALREADY_TAKEN = IDMServiceError.get(
        IDMErrorCodes.DISPLAY_NAME_ALREADY_TAKEN,
    );

    static readonly MOBILE_UPDATE_NOT_ALLOWED_ALREADY_VERIFIED = IDMServiceError.get(
        IDMErrorCodes.MOBILE_UPDATE_NOT_ALLOWED_ALREADY_VERIFIED,
    );

    static readonly INCORRECT_EMAIL_OR_MOBILE = IDMServiceError.get(
        IDMErrorCodes.INCORRECT_EMAIL_OR_MOBILE,
    );

    static readonly EMAIL_NOT_REGISTERED = IDMServiceError.get(
        IDMErrorCodes.EMAIL_NOT_REGISTERED,
    );

    static readonly MOBILE_NOT_REGISTERED = IDMServiceError.get(
        IDMErrorCodes.MOBILE_NOT_REGISTERED,
    );

    static readonly USER_ACCOUNT_BLOCKED = IDMServiceError.get(
        IDMErrorCodes.USER_ACCOUNT_BLOCKED,
    );

    static readonly MULTIPLE_USERS_FOUND = IDMServiceError.get(
        IDMErrorCodes.MULTIPLE_USERS_FOUND,
    );

    static readonly OTP_EXPIRED = IDMServiceError.get(
        IDMErrorCodes.OTP_EXPIRED,
    );

    static readonly OTP_MISMATCH = IDMServiceError.get(
        IDMErrorCodes.OTP_MISMATCH,
    );

    static readonly PAN_ALREADY_EXIST = IDMServiceError.get(
        IDMErrorCodes.PAN_ALREADY_EXIST,
    );

    static readonly PAN_ALREADY_VERIFIED = IDMServiceError.get(
        IDMErrorCodes.PAN_ALREADY_VERIFIED,
    );

    static readonly NAME_IS_MANDATORY = IDMServiceError.get(
        IDMErrorCodes.NAME_IS_MANDATORY,
    );

    static readonly DOB_IS_MANDATORY = IDMServiceError.get(
        IDMErrorCodes.DOB_IS_MANDATORY,
    );

    static readonly BANK_DETAILS_DOES_NOT_EXIST = IDMServiceError.get(
        IDMErrorCodes.BANK_DETAILS_DOES_NOT_EXIST,
    );

    static readonly PAN_DETAILS_DOES_NOT_EXIST = IDMServiceError.get(
        IDMErrorCodes.PAN_DETAILS_DOES_NOT_EXIST,
    );

    static readonly BANK_DETAILS_ALREADY_VERIFIED = IDMServiceError.get(
        IDMErrorCodes.BANK_DETAILS_ALREADY_VERIFIED,
    );

    static readonly REJECTION_REASON_IS_MANDATORY = IDMServiceError.get(
        IDMErrorCodes.REJECTION_REASON_IS_MANDATORY,
    );

    static readonly INVALID_PAN_ID = IDMServiceError.get(
        IDMErrorCodes.INVALID_PAN_ID,
    );

    static readonly INVALID_IFSC = IDMServiceError.get(
        IDMErrorCodes.INVALID_IFSC,
    );

    static readonly INVALID_FILE_URL = IDMServiceError.get(
        IDMErrorCodes.INVALID_FILE_URL,
    );

    static readonly AGE_LESS_THAN_18 = IDMServiceError.get(
        IDMErrorCodes.AGE_LESS_THAN_18,
    );

    static readonly PAN_NOT_VERIFIED = IDMServiceError.get(
        IDMErrorCodes.PAN_NOT_VERIFIED,
    );

    static readonly UPI_DETAILS_DOES_NOT_EXIST = IDMServiceError.get(
        IDMErrorCodes.UPI_DETAILS_DOES_NOT_EXIST,
    );

    static readonly UPI_ALREADY_EXIST = IDMServiceError.get(
        IDMErrorCodes.UPI_ALREADY_EXIST,
    );

    static readonly CONSENT_NOT_PROVIDED = IDMServiceError.get(
        IDMErrorCodes.CONSENT_NOT_PROVIDED,
    );

    static readonly UPI_DETAILS_ALREADY_VERIFIED = IDMServiceError.get(
        IDMErrorCodes.UPI_DETAILS_ALREADY_VERIFIED,
    );

    static readonly MAX_BANK_ACCOUNTS_LIMIT_REACHED = IDMServiceError.get(
        IDMErrorCodes.MAX_BANK_ACCOUNTS_LIMIT_REACHED,
    );

    static readonly BANK_ACCOUNT_BLACKLISTED_CODE = IDMServiceError.get(
        IDMErrorCodes.BANK_ACCOUNT_BLACKLISTED_CODE,
    );

    static readonly BULK_LIMIT_CROSSED = IDMServiceError.get(
        IDMErrorCodes.BULK_LIMIT_CROSSED,
    );

    static readonly FACEBOOK_TOKEN_ALREADY_EXIST = IDMServiceError.get(
        IDMErrorCodes.FACEBOOK_TOKEN_ALREADY_EXIST,
    );

    static readonly GOOGLE_TOKEN_ALREADY_EXIST = IDMServiceError.get(
        IDMErrorCodes.GOOGLE_TOKEN_ALREADY_EXIST,
    );

    static readonly MOBILE_ALREADY_EXIST_WITH_EMAIL_VERIFIED = IDMServiceError.get(
        IDMErrorCodes.MOBILE_ALREADY_EXIST_WITH_EMAIL_VERIFIED,
    );

    static readonly LOCATION_RESTRICTED_BY_IP = IDMServiceError.get(
        IDMErrorCodes.LOCATION_RESTRICTED_BY_IP,
    );

    static readonly LOCATION_RESTRICTED_BY_GEO_COORDINATE = IDMServiceError.get(
        IDMErrorCodes.LOCATION_RESTRICTED_BY_GEO_COORDINATE,
    );

    static readonly LOCATION_RESTRICTED_MONITORING_MSG1 = IDMServiceError.get(
        IDMErrorCodes.LOCATION_RESTRICTED_MONITORING_MSG1,
    );

    static readonly LOCATION_RESTRICTED_MONITORING_MSG2 = IDMServiceError.get(
        IDMErrorCodes.LOCATION_RESTRICTED_MONITORING_MSG2,
    );

    static readonly LOCATION_RESTRICTED_MONITORING_MSG3 = IDMServiceError.get(
        IDMErrorCodes.LOCATION_RESTRICTED_MONITORING_MSG3,
    );

    static readonly BULK_UPDATE_USER_LIMIT_REACHED = IDMServiceError.get(
        IDMErrorCodes.BULK_UPDATE_USER_LIMIT_REACHED,
    );

    static readonly INVALID_BRAND_ID = IDMServiceError.get(
        IDMErrorCodes.INVALID_BRAND_ID,
    );

    static readonly INVALID_BRAND_NAME_FORMAT = IDMServiceError.get(
        IDMErrorCodes.INVALID_BRAND_NAME_FORMAT,
    );

    static readonly INVALID_BRAND_NAME_LENGTH = IDMServiceError.get(
        IDMErrorCodes.INVALID_BRAND_NAME_LENGTH,
    );

    static readonly INVALID_BRAND_DESC_LENGTH = IDMServiceError.get(
        IDMErrorCodes.INVALID_BRAND_DESC_LENGTH,
    );

    static readonly BRAND_ID_ALREADY_EXIST = IDMServiceError.get(
        IDMErrorCodes.BRAND_ID_ALREADY_EXIST,
    );

    static readonly BRAND_NAME_ALREADY_EXIST = IDMServiceError.get(
        IDMErrorCodes.BRAND_NAME_ALREADY_EXIST,
    );

    static readonly CURRENT_USER_KYC_DETAILS_ERROR = IDMServiceError.get(
        IDMErrorCodes.CURRENT_USER_KYC_DETAILS_ERROR,
    );

    static readonly MAX_KYC_ACCOUNTS_REACHED = IDMServiceError.get(
        IDMErrorCodes.MAX_KYC_ACCOUNTS_REACHED,
    );

    static readonly INVALID_REQUEST_ERROR = IDMServiceError.get(
        IDMErrorCodes.INVALID_REQUEST_ERROR,
    );

    static readonly INVALID_VENDOR_ID = IDMServiceError.get(
        IDMErrorCodes.INVALID_VENDOR_ID,
    );

    static readonly INVALID_MOBILE_STATUS = IDMServiceError.get(
        IDMErrorCodes.INVALID_MOBILE_STATUS,
    );


    static readonly INVALID_EMAIL_STATUS = IDMServiceError.get(
        IDMErrorCodes.INVALID_EMAIL_STATUS,
    );

    static readonly MAX_DISPLAY_NAME_DIGIT_COUNT = IDMServiceError.get(
        IDMErrorCodes.MAX_DISPLAY_NAME_DIGIT_COUNT,
    );

    static readonly USERNAME_ALREADY_EXISTS = IDMServiceError.get(
      IDMErrorCodes.USERNAME_ALREADY_EXISTS,
    );

    static readonly INVALID_USERNAME_UPDATE = IDMServiceError.get(
        IDMErrorCodes.INVALID_USERNAME_UPDATE,
    );

    static readonly INVALID_ACCESS_KEY = IDMServiceError.get(
        IDMErrorCodes.INVALID_ACCESS_KEY,
    );

    constructor(public name: string, public code: number, public message: any, public type: any) {
		    super(name, code, message, type);
	  }

	public static get(errorDetails: IDMErrorCodes): IDMServiceError {
		return new IDMServiceError(
			errorDetails.name,
			errorDetails.code,
			errorDetails.message,
            errorDetails.type || 'IDMServiceError',
		);
	}
}

export default IDMServiceError;
