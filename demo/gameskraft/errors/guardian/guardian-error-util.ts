import GuardianServiceError from './guardian-error';
import GuardianErrorCodes from './guardian-error-codes';
import ServiceErrorUtil from '../service-error-util';

class GuardianServiceErrorUtil extends ServiceErrorUtil {
    public static getRuntimeError(): GuardianServiceError {
		return GuardianServiceError.get(GuardianErrorCodes.RUNTIME_ERROR);
	}

	public static getError(error: Error): GuardianServiceError {
		if (!(error instanceof GuardianServiceError)) {
			return this.getRuntimeError();
		}
		return error;
	}

    public static getInternalServerError(): GuardianServiceError {
        return GuardianServiceError.INTERNAL_SERVER_ERROR;
    }
    
    public static getSecurityHeadersNotProvided(): GuardianServiceError {
        return GuardianServiceError.SECURITY_HEADERS_NOT_PROVIDED;
    }
    
    public static getInvalidAccessId(): GuardianServiceError {
        return GuardianServiceError.INVALID_ACCESS_ID;
    }

    public static getBankVerificationFailedError(errorMessage: string): GuardianServiceError {
        return GuardianServiceError.BANK_VERIFICATION_FAILED(errorMessage);
    }
    
    public static getUpiVerificationFailedError(errorMessage: string): GuardianServiceError {
        return GuardianServiceError.UPI_VERIFICATION_FAILED(errorMessage);
    }
    
    public static getUpstreamErrorStr(): GuardianServiceError {
        return GuardianServiceError.UPSTREAM_ERROR_STR;
    }
    
    public static getInvalidRequest(): GuardianServiceError {
        return GuardianServiceError.INVALID_REQUEST;
    }
    
    public static getInvalidTask(): GuardianServiceError {
        return GuardianServiceError.INVALID_TASK;
    }
    
    public static getInvalidJson(): GuardianServiceError {
        return GuardianServiceError.INVALID_JSON;
    }
    
    public static getPartnerInvalidResponse(): GuardianServiceError {
        return GuardianServiceError.PARTNER_INVALID_RESPONSE;
    }
    
    public static getInvalidDocumentField(): GuardianServiceError {
        return GuardianServiceError.INVALID_DOCUMENT_FIELD;
    }
    
    public static getInvalidDocumentStatus(): GuardianServiceError {
        return GuardianServiceError.INVALID_DOCUMENT_STATUS;
    }
    
    public static getIdfyInsufficientBalance(): GuardianServiceError {
        return GuardianServiceError.IDFY_INSUFFICIENT_BALANCE;
    }
    
    public static getCashfreeInsufficientBalance(): GuardianServiceError {
        return GuardianServiceError.CASHFREE_INSUFFICIENT_BALANCE;
    }
    
    public static getPartnerServiceUnknownError(): GuardianServiceError {
        return GuardianServiceError.PARTNER_SERVICE_UNKNOWN_ERROR;
    }
    
    public static getDocumentNotUploaded(): GuardianServiceError {
        return GuardianServiceError.DOCUMENT_NOT_UPLOADED;
    }
    
    public static getPartnerClientError(): GuardianServiceError {
        return GuardianServiceError.PARTNER_CLIENT_ERROR;
    }
    
    public static getRequestIdNotProvided(): GuardianServiceError {
        return GuardianServiceError.REQUEST_ID_NOT_PROVIDED;
    }
    
    public static getFileNotSupported(): GuardianServiceError {
        return GuardianServiceError.FILE_NOT_SUPPORTED;
    }
    
    public static getFileSizeExceeded(): GuardianServiceError {
        return GuardianServiceError.FILE_SIZE_EXCEEDED;
    }
    
    public static getUploadToS3Failed(): GuardianServiceError {
        return GuardianServiceError.UPLOAD_TO_S3_FAILED;
    }
    
    public static getDocumentAlreadyUploaded(): GuardianServiceError {
        return GuardianServiceError.DOCUMENT_ALREADY_UPLOADED;
    }
    
    public static getInvalidImageUrl(): GuardianServiceError {
        return GuardianServiceError.INVALID_IMAGE_URL;
    }
    
    public static getInvalidImage(): GuardianServiceError {
        return GuardianServiceError.INVALID_IMAGE;
    }
    
    public static getImageNotAccessible(): GuardianServiceError {
        return GuardianServiceError.IMAGE_NOT_ACCESSIBLE;
    }
    
    public static getImageNotPan(): GuardianServiceError {
        return GuardianServiceError.IMAGE_NOT_PAN;
    }
    
    public static getMinorDobPan(): GuardianServiceError {
        return GuardianServiceError.MINOR_DOB_PAN;
    }
    
    public static getPanTypeNotIndividual(): GuardianServiceError {
        return GuardianServiceError.PAN_TYPE_NOT_INDIVIDUAL;
    }
    
    public static getExtractionResponseInvalid(): GuardianServiceError {
        return GuardianServiceError.EXTRACTION_RESPONSE_INVALID;
    }
    
    public static getDocumentNotOriginal(): GuardianServiceError {
        return GuardianServiceError.DOCUMENT_NOT_ORIGINAL;
    }
    
    public static getInvalidDocumentKycLevel(): GuardianServiceError {
        return GuardianServiceError.INVALID_DOCUMENT_KYC_LEVEL;
    }
    
    public static getPrerequisiteDocumentNotVerified(): GuardianServiceError {
        return GuardianServiceError.PREREQUISITE_DOCUMENT_NOT_VERIFIED;
    }
    
    public static getDocumentKycAlreadyDone(): GuardianServiceError {
        return GuardianServiceError.DOCUMENT_KYC_ALREADY_DONE;
    }
    
    public static getSameDetailsVerifiedAlreadyVerified(): GuardianServiceError {
        return GuardianServiceError.SAME_DETAILS_VERIFIED_ALREADY_VERIFIED;
    }
    
    public static getSameDetailsAlreadyVerifiedForUser(): GuardianServiceError {
        return GuardianServiceError.SAME_DETAILS_ALREADY_VERIFIED_FOR_USER;
    }
    
    public static getPanIdNotFoundOnSource(): GuardianServiceError {
        return GuardianServiceError.PAN_ID_NOT_FOUND_ON_SOURCE;
    }
    
    public static getSourceBankError(): GuardianServiceError {
        return GuardianServiceError.SOURCE_BANK_ERROR;
    }
    
    public static getInvalidBankAccount(): GuardianServiceError {
        return GuardianServiceError.INVALID_BANK_ACCOUNT;
    }
    
    public static getInvalidIfsc(): GuardianServiceError {
        return GuardianServiceError.INVALID_IFSC;
    }
    
    public static getAccountBlocked(): GuardianServiceError {
        return GuardianServiceError.ACCOUNT_BLOCKED;
    }
    
    public static getAccountClosed(): GuardianServiceError {
        return GuardianServiceError.ACCOUNT_CLOSED;
    }
    
    public static getInvalidPartnerIfscResponse(): GuardianServiceError {
        return GuardianServiceError.INVALID_PARTNER_IFSC_RESPONSE;
    }
    
    public static getInvalidPartnerBankVerifyResponse(): GuardianServiceError {
        return GuardianServiceError.INVALID_PARTNER_BANK_VERIFY_RESPONSE;
    }
    
    public static getBankNotSupported(): GuardianServiceError {
        return GuardianServiceError.BANK_NOT_SUPPORTED;
    }
    
    public static getDigitalBankWithoutConsent(): GuardianServiceError {
        return GuardianServiceError.DIGITAL_BANK_WITHOUT_CONSENT;
    }
    
    public static getIfscFromBannedState(): GuardianServiceError {
        return GuardianServiceError.IFSC_FROM_BANNED_STATE;
    }
    
    public static getIfscNotProvided(): GuardianServiceError {
        return GuardianServiceError.IFSC_NOT_PROVIDED;
    }
    
    public static getInvalidUpi(): GuardianServiceError {
        return GuardianServiceError.INVALID_UPI;
    }
    
    public static getUpiNotSupported(): GuardianServiceError {
        return GuardianServiceError.UPI_NOT_SUPPORTED;
    }
    
    public static getUpiWithoutConsent(): GuardianServiceError {
        return GuardianServiceError.UPI_WITHOUT_CONSENT;
    }
    
    public static getVerificationAlreadyStarted(): GuardianServiceError {
        return GuardianServiceError.VERIFICATION_ALREADY_STARTED;
    }
    
    public static getInvalidTransition(): GuardianServiceError {
        return GuardianServiceError.INVALID_TRANSITION;
    }
    
    public static getWebhookUnknownError(): GuardianServiceError {
        return GuardianServiceError.WEBHOOK_UNKNOWN_ERROR;
    }    
    public static getStateNotAllowedForAadharError(): GuardianServiceError {
        return GuardianServiceError.STATE_NOT_ALLLOWED_FOR_AADHAR;
    } 
    public static getMaxAllowedKycLimitExceededError(): GuardianServiceError {
        return GuardianServiceError.MAX_ALLOWED_KYC_LIMIT_EXCEEDED;
    }      
    
    public static faceNotDetected(): GuardianServiceError {
        return GuardianServiceError.FACE_NOT_DETECTED_ON_DOCUMENT;
    }

    public static providedScannedCopy(): GuardianServiceError {
        return GuardianServiceError.PROVIDED_SCANNED_COPY_DOCUMENT;
    }
    
    
	public static wrapError(error: any): GuardianServiceError {
		return GuardianServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `GuardianServiceError:${error.type}`,
        })
	}
}

export default GuardianServiceErrorUtil;
