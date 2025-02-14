import GuardianErrorCodes from './guardian-error-codes';
import ServiceError from '../service-error';

class GuardianServiceError extends ServiceError {
	
    static readonly INTERNAL_SERVER_ERROR = GuardianServiceError.get(
        GuardianErrorCodes.INTERNAL_SERVER_ERROR,
    );
    
    static readonly SECURITY_HEADERS_NOT_PROVIDED = GuardianServiceError.get(
        GuardianErrorCodes.SECURITY_HEADERS_NOT_PROVIDED,
    );
    
    static readonly INVALID_ACCESS_ID = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_ACCESS_ID,
    );
    
    static readonly BANK_VERIFICATION_FAILED = (errorMessage: string) => {
        const bankVerificationError: GuardianErrorCodes = GuardianErrorCodes.BANK_VERIFICATION_FAILED(errorMessage);
        return GuardianServiceError.get(
            bankVerificationError,
        );
    }

    static readonly UPI_VERIFICATION_FAILED = (errorMessage: string) => {
        const upiVerificationError: GuardianErrorCodes = GuardianErrorCodes.UPI_VERIFICATION_FAILED(errorMessage);
        return GuardianServiceError.get(
            upiVerificationError,
        );
    }
    
    static readonly UPSTREAM_ERROR_STR = GuardianServiceError.get(
        GuardianErrorCodes.UPSTREAM_ERROR_STR,
    );
    
    static readonly INVALID_REQUEST = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_REQUEST,
    );
    
    static readonly INVALID_TASK = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_TASK,
    );
    
    static readonly INVALID_JSON = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_JSON,
    );
    
    static readonly PARTNER_INVALID_RESPONSE = GuardianServiceError.get(
        GuardianErrorCodes.PARTNER_INVALID_RESPONSE,
    );
    
    static readonly INVALID_DOCUMENT_FIELD = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_DOCUMENT_FIELD,
    );
    
    static readonly INVALID_DOCUMENT_STATUS = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_DOCUMENT_STATUS,
    );
    
    static readonly IDFY_INSUFFICIENT_BALANCE = GuardianServiceError.get(
        GuardianErrorCodes.IDFY_INSUFFICIENT_BALANCE,
    );
    
    static readonly CASHFREE_INSUFFICIENT_BALANCE = GuardianServiceError.get(
        GuardianErrorCodes.CASHFREE_INSUFFICIENT_BALANCE,
    );
    
    static readonly PARTNER_SERVICE_UNKNOWN_ERROR = GuardianServiceError.get(
        GuardianErrorCodes.PARTNER_SERVICE_UNKNOWN_ERROR,
    );
    
    static readonly DOCUMENT_NOT_UPLOADED = GuardianServiceError.get(
        GuardianErrorCodes.DOCUMENT_NOT_UPLOADED,
    );
    
    static readonly PARTNER_CLIENT_ERROR = GuardianServiceError.get(
        GuardianErrorCodes.PARTNER_CLIENT_ERROR,
    );
    
    static readonly REQUEST_ID_NOT_PROVIDED = GuardianServiceError.get(
        GuardianErrorCodes.REQUEST_ID_NOT_PROVIDED,
    );
    
    static readonly FILE_NOT_SUPPORTED = GuardianServiceError.get(
        GuardianErrorCodes.FILE_NOT_SUPPORTED,
    );
    
    static readonly FILE_SIZE_EXCEEDED = GuardianServiceError.get(
        GuardianErrorCodes.FILE_SIZE_EXCEEDED,
    );
    
    static readonly UPLOAD_TO_S3_FAILED = GuardianServiceError.get(
        GuardianErrorCodes.UPLOAD_TO_S3_FAILED,
    );
    
    static readonly DOCUMENT_ALREADY_UPLOADED = GuardianServiceError.get(
        GuardianErrorCodes.DOCUMENT_ALREADY_UPLOADED,
    );
    
    static readonly INVALID_IMAGE_URL = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_IMAGE_URL,
    );
    
    static readonly INVALID_IMAGE = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_IMAGE,
    );
    
    static readonly IMAGE_NOT_ACCESSIBLE = GuardianServiceError.get(
        GuardianErrorCodes.IMAGE_NOT_ACCESSIBLE,
    );
    
    static readonly IMAGE_NOT_PAN = GuardianServiceError.get(
        GuardianErrorCodes.IMAGE_NOT_PAN,
    );
    
    static readonly MINOR_DOB_PAN = GuardianServiceError.get(
        GuardianErrorCodes.MINOR_DOB_PAN,
    );
    
    static readonly PAN_TYPE_NOT_INDIVIDUAL = GuardianServiceError.get(
        GuardianErrorCodes.PAN_TYPE_NOT_INDIVIDUAL,
    );
    
    static readonly EXTRACTION_RESPONSE_INVALID = GuardianServiceError.get(
        GuardianErrorCodes.EXTRACTION_RESPONSE_INVALID,
    );
    
    static readonly DOCUMENT_NOT_ORIGINAL = GuardianServiceError.get(
        GuardianErrorCodes.DOCUMENT_NOT_ORIGINAL,
    );
    
    static readonly INVALID_DOCUMENT_KYC_LEVEL = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_DOCUMENT_KYC_LEVEL,
    );
    
    static readonly PREREQUISITE_DOCUMENT_NOT_VERIFIED = GuardianServiceError.get(
        GuardianErrorCodes.PREREQUISITE_DOCUMENT_NOT_VERIFIED,
    );
    
    static readonly DOCUMENT_KYC_ALREADY_DONE = GuardianServiceError.get(
        GuardianErrorCodes.DOCUMENT_KYC_ALREADY_DONE,
    );
    
    static readonly SAME_DETAILS_VERIFIED_ALREADY_VERIFIED = GuardianServiceError.get(
        GuardianErrorCodes.SAME_DETAILS_VERIFIED_ALREADY_VERIFIED,
    );
    
    static readonly SAME_DETAILS_ALREADY_VERIFIED_FOR_USER = GuardianServiceError.get(
        GuardianErrorCodes.SAME_DETAILS_ALREADY_VERIFIED_FOR_USER,
    );
    
    static readonly PAN_ID_NOT_FOUND_ON_SOURCE = GuardianServiceError.get(
        GuardianErrorCodes.PAN_ID_NOT_FOUND_ON_SOURCE,
    );
    
    static readonly SOURCE_BANK_ERROR = GuardianServiceError.get(
        GuardianErrorCodes.SOURCE_BANK_ERROR,
    );
    
    static readonly INVALID_BANK_ACCOUNT = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_BANK_ACCOUNT,
    );
    
    static readonly INVALID_IFSC = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_IFSC,
    );
    
    static readonly ACCOUNT_BLOCKED = GuardianServiceError.get(
        GuardianErrorCodes.ACCOUNT_BLOCKED,
    );
    
    static readonly ACCOUNT_CLOSED = GuardianServiceError.get(
        GuardianErrorCodes.ACCOUNT_CLOSED,
    );
    
    static readonly INVALID_PARTNER_IFSC_RESPONSE = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_PARTNER_IFSC_RESPONSE,
    );
    
    static readonly INVALID_PARTNER_BANK_VERIFY_RESPONSE = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_PARTNER_BANK_VERIFY_RESPONSE,
    );
    
    static readonly BANK_NOT_SUPPORTED = GuardianServiceError.get(
        GuardianErrorCodes.BANK_NOT_SUPPORTED,
    );
    
    static readonly DIGITAL_BANK_WITHOUT_CONSENT = GuardianServiceError.get(
        GuardianErrorCodes.DIGITAL_BANK_WITHOUT_CONSENT,
    );
    
    static readonly IFSC_FROM_BANNED_STATE = GuardianServiceError.get(
        GuardianErrorCodes.IFSC_FROM_BANNED_STATE,
    );
    
    static readonly IFSC_NOT_PROVIDED = GuardianServiceError.get(
        GuardianErrorCodes.IFSC_NOT_PROVIDED,
    );
    
    static readonly INVALID_UPI = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_UPI,
    );
    
    static readonly UPI_NOT_SUPPORTED = GuardianServiceError.get(
        GuardianErrorCodes.UPI_NOT_SUPPORTED,
    );
    
    static readonly UPI_WITHOUT_CONSENT = GuardianServiceError.get(
        GuardianErrorCodes.UPI_WITHOUT_CONSENT,
    );
    
    static readonly VERIFICATION_ALREADY_STARTED = GuardianServiceError.get(
        GuardianErrorCodes.VERIFICATION_ALREADY_STARTED,
    );
    
    static readonly INVALID_TRANSITION = GuardianServiceError.get(
        GuardianErrorCodes.INVALID_TRANSITION,
    );
    
    static readonly WEBHOOK_UNKNOWN_ERROR = GuardianServiceError.get(
        GuardianErrorCodes.WEBHOOK_UNKNOWN_ERROR,
    );
    static readonly STATE_NOT_ALLLOWED_FOR_AADHAR = GuardianServiceError.get(
        GuardianErrorCodes.STATE_NOT_ALLLOWED_FOR_AADHAR,
    );

    static readonly MAX_ALLOWED_KYC_LIMIT_EXCEEDED = GuardianServiceError.get(
        GuardianErrorCodes.MAX_ALLOWED_KYC_LIMIT_EXCEEDED,
    );

    static readonly FACE_NOT_DETECTED_ON_DOCUMENT = GuardianServiceError.get(
        GuardianErrorCodes.FACE_NOT_DETECTED_ON_DOCUMENT,
    );

    static readonly PROVIDED_SCANNED_COPY_DOCUMENT = GuardianServiceError.get(
        GuardianErrorCodes.PROVIDED_SCANNED_COPY_DOCUMENT,
    );

    

    
    constructor(public name: string, public code: number, public message: any, public type: any) {
		super(name, code, message, type);
	}

	public static get(errorDetails: GuardianErrorCodes): GuardianServiceError {
		return new GuardianServiceError(
			errorDetails.name,
			errorDetails.code,
			errorDetails.message,
            errorDetails.type || 'GuardianServiceError',
		);
	}
}

export default GuardianServiceError;
