import IDMServiceError from './idm-error';
import IDMErrorCodes from './idm-error-codes';
import ServiceErrorUtil from '../service-error-util';

class IDMServiceErrorUtil extends ServiceErrorUtil {
    public static getRuntimeError(): IDMServiceError {
		return IDMServiceError.get(IDMErrorCodes.RUNTIME_ERROR);
	}

	public static getError(error: Error): IDMServiceError {
		if (!(error instanceof IDMServiceError)) {
			return this.getRuntimeError();
		}
		return error;
	}

    public static getDocumentNotPan(): IDMServiceError {
        return IDMServiceError.DOCUMENT_NOT_PAN;
    }

    public static getImageNotReadable(): IDMServiceError {
        return IDMServiceError.IMAGE_NOT_READABLE;
    }

    public static getExtractionDataNotValid(): IDMServiceError {
        return IDMServiceError.EXTRACTION_DATA_NOT_VALID;
    }

    public static getPanTypeNotIndividual(): IDMServiceError {
        return IDMServiceError.PAN_TYPE_NOT_INDIVIDUAL;
    }

    public static getMinorDOB(): IDMServiceError {
        return IDMServiceError.MINOR_DOB;
    }

    public static getDetectionAPIError(): IDMServiceError {
        return IDMServiceError.DETECTION_API_ERROR;
    }

    public static getExtractionAPIError(): IDMServiceError {
        return IDMServiceError.EXTRACTION_API_ERROR;
    }

    public static getBadImageQuality(): IDMServiceError {
        return IDMServiceError.BAD_IMAGE_QUALITY;
    }

    public static getIDFYInsufficientFunds(): IDMServiceError {
        return IDMServiceError.IDFY_INSUFFICIENT_FUNDS;
    }

    public static getDocumentNotOriginal(): IDMServiceError {
        return IDMServiceError.DOCUMENT_NOT_ORIGINAL;
    }

    public static getPasswordProtectedFile(): IDMServiceError {
        return IDMServiceError.PASSWORD_PROTECTED_FILE;
    }

	public static getUserDoesNotExist(): IDMServiceError {
        return IDMServiceError.USER_DOES_NOT_EXIST;
    }

    public static getMissingRequiredUniqueId(): IDMServiceError {
        return IDMServiceError.MISSING_REQUIRED_UNIQUE_ID;
    }

    public static getMissingRequiredDisplayNameInfo(): IDMServiceError {
        return IDMServiceError.MISSING_REQUIRED_DISPLAY_NAME_INFO;
    }

    public static getNoSuchUser(): IDMServiceError {
        return IDMServiceError.NO_SUCH_USER;
    }

    public static getIncorrectPassword(): IDMServiceError {
        return IDMServiceError.INCORRECT_PASSWORD;
    }

    public static getInvalidFacebookAccessToken(): IDMServiceError {
        return IDMServiceError.INVALID_FACEBOOK_ACCESS_TOKEN;
    }

    public static getInvalidGoogleIdToken(): IDMServiceError {
        return IDMServiceError.INVALID_GOOGLE_ID_TOKEN;
    }

    public static getInvalidReferralInfo(): IDMServiceError {
        return IDMServiceError.INVALID_REFERRAL_INFO;
    }

    public static getInvalidEmailFormat(): IDMServiceError {
        return IDMServiceError.INVALID_EMAIL_FORMAT;
    }

    public static getEmailNotPresent(): IDMServiceError {
        return IDMServiceError.EMAIL_NOT_PRESENT;
    }

    public static getInvalidMobileFormat(): IDMServiceError {
        return IDMServiceError.INVALID_MOBILE_FORMAT;
    }

    public static getInvalidUserId(): IDMServiceError {
        return IDMServiceError.INVALID_USER_ID;
    }

    public static getEmailOrMobileRequired(): IDMServiceError {
        return IDMServiceError.EMAIL_OR_MOBILE_REQUIRED;
    }

    public static getDisplayNameNecessary(): IDMServiceError {
        return IDMServiceError.DISPLAY_NAME_NECESSARY;
    }

    public static getPasswordNecessary(): IDMServiceError {
        return IDMServiceError.PASSWORD_NECESSARY;
    }

    public static getEmailAlreadyExist(): IDMServiceError {
        return IDMServiceError.EMAIL_ALREADY_EXIST;
    }

    public static getMobileAlreadyExist(): IDMServiceError {
        return IDMServiceError.MOBILE_ALREADY_EXIST;
    }

    public static getSameMobileAlreadyExist(): IDMServiceError {
        return IDMServiceError.SAME_MOBILE_ALREADY_EXIST;
    }

    public static getInvalidDisplayName(): IDMServiceError {
        return IDMServiceError.INVALID_DISPLAY_NAME;
    }

    public static getDisplayNameTooShort(): IDMServiceError {
        return IDMServiceError.DISPLAY_NAME_TOO_SHORT;
    }

    public static getDisplayNameTooLong(): IDMServiceError {
        return IDMServiceError.DISPLAY_NAME_TOO_LONG;
    }

    public static getDisplayNameContainsSwearWord(): IDMServiceError {
        return IDMServiceError.DISPLAY_NAME_CONTAINS_SWEAR_WORD;
    }

    public static getDisplayNameStartsWithInvalidSequence(): IDMServiceError {
        return IDMServiceError.DISPLAY_NAME_STARTS_WITH_INVALID_SEQUENCE;
    }

    public static getDisplayNameShouldHaveOneAlphabet(): IDMServiceError {
        return IDMServiceError.DISPLAY_NAME_SHOULD_HAVE_ONE_ALPHABET;
    }

    public static getDisplayNameApiIntentNotValidation(): IDMServiceError {
        return IDMServiceError.DISPLAY_NAME_API_INTENT_NOT_VALIDATION;
    }

    public static getInvalidPanStatus(): IDMServiceError {
        return IDMServiceError.INVALID_PAN_STATUS;
    }

    public static getInvalidBankStatus(): IDMServiceError {
        return IDMServiceError.INVALID_BANK_STATUS;
    }

    public static getMobileUpdateInvalid(): IDMServiceError {
        return IDMServiceError.MOBILE_UPDATE_INVALID;
    }

    public static getMobileNumberInvalid(): IDMServiceError {
        return IDMServiceError.MOBILE_NUMBER_INVALID;
    }

    public static getInvalidFlowForUser(): IDMServiceError {
        return IDMServiceError.INVALID_FLOW_FOR_USER;
    }

    public static getDisplayNameAlreadyTaken(): IDMServiceError {
        return IDMServiceError.DISPLAY_NAME_ALREADY_TAKEN;
    }

    public static getMobileUpdateNotAllowedAlreadyVerified(): IDMServiceError {
        return IDMServiceError.MOBILE_UPDATE_NOT_ALLOWED_ALREADY_VERIFIED;
    }

    public static getIncorrectEmailOrMobile(): IDMServiceError {
        return IDMServiceError.INCORRECT_EMAIL_OR_MOBILE;
    }

    public static getEmailNotRegistered(): IDMServiceError {
        return IDMServiceError.EMAIL_NOT_REGISTERED;
    }

    public static getMobileNotRegistered(): IDMServiceError {
        return IDMServiceError.MOBILE_NOT_REGISTERED;
    }

    public static getUserAccountBlocked(): IDMServiceError {
        return IDMServiceError.USER_ACCOUNT_BLOCKED;
    }

    public static getMultipleUsersFound(): IDMServiceError {
        return IDMServiceError.MULTIPLE_USERS_FOUND;
    }

    public static getOtpExpired(): IDMServiceError {
        return IDMServiceError.OTP_EXPIRED;
    }

    public static getOtpMismatch(): IDMServiceError {
        return IDMServiceError.OTP_MISMATCH;
    }

    public static getPanAlreadyExist(): IDMServiceError {
        return IDMServiceError.PAN_ALREADY_EXIST;
    }

    public static getPanAlreadyVerified(): IDMServiceError {
        return IDMServiceError.PAN_ALREADY_VERIFIED;
    }

    public static getNameIsMandatory(): IDMServiceError {
        return IDMServiceError.NAME_IS_MANDATORY;
    }

    public static getDobIsMandatory(): IDMServiceError {
        return IDMServiceError.DOB_IS_MANDATORY;
    }

    public static getBankDetailsDoesNotExist(): IDMServiceError {
        return IDMServiceError.BANK_DETAILS_DOES_NOT_EXIST;
    }

    public static getPanDetailsDoesNotExist(): IDMServiceError {
        return IDMServiceError.PAN_DETAILS_DOES_NOT_EXIST;
    }

    public static getBankDetailsAlreadyVerified(): IDMServiceError {
        return IDMServiceError.BANK_DETAILS_ALREADY_VERIFIED;
    }

    public static getRejectionReasonIsMandatory(): IDMServiceError {
        return IDMServiceError.REJECTION_REASON_IS_MANDATORY;
    }

    public static getInvalidPanId(): IDMServiceError {
        return IDMServiceError.INVALID_PAN_ID;
    }

    public static getInvalidIfsc(): IDMServiceError {
        return IDMServiceError.INVALID_IFSC;
    }

    public static getInvalidFileUrl(): IDMServiceError {
        return IDMServiceError.INVALID_FILE_URL;
    }

    public static getAgeLessThan_18(): IDMServiceError {
        return IDMServiceError.AGE_LESS_THAN_18;
    }

    public static getPanNotVerified(): IDMServiceError {
        return IDMServiceError.PAN_NOT_VERIFIED;
    }

    public static getUpiDetailsDoesNotExist(): IDMServiceError {
        return IDMServiceError.UPI_DETAILS_DOES_NOT_EXIST;
    }

    public static getUpiAlreadyExist(): IDMServiceError {
        return IDMServiceError.UPI_ALREADY_EXIST;
    }

    public static getConsentNotProvided(): IDMServiceError {
        return IDMServiceError.CONSENT_NOT_PROVIDED;
    }

    public static getUpiDetailsAlreadyVerified(): IDMServiceError {
        return IDMServiceError.UPI_DETAILS_ALREADY_VERIFIED;
    }

    public static getMaxBankAccountsLimitReached(): IDMServiceError {
        return IDMServiceError.MAX_BANK_ACCOUNTS_LIMIT_REACHED;
    }

    public static getBankAccountBlacklistedCode(): IDMServiceError {
        return IDMServiceError.BANK_ACCOUNT_BLACKLISTED_CODE;
    }

    public static getBulkLimitCrossed(): IDMServiceError {
        return IDMServiceError.BULK_LIMIT_CROSSED;
    }

    public static getFacebookTokenAlreadyExist(): IDMServiceError {
        return IDMServiceError.FACEBOOK_TOKEN_ALREADY_EXIST;
    }

    public static getGoogleTokenAlreadyExist(): IDMServiceError {
        return IDMServiceError.GOOGLE_TOKEN_ALREADY_EXIST;
    }

    public static getMobileAlreadyExistWithEmailVerified(): IDMServiceError {
        return IDMServiceError.MOBILE_ALREADY_EXIST_WITH_EMAIL_VERIFIED;
    }

    public static getLocationRestrictedByIp(): IDMServiceError {
        return IDMServiceError.LOCATION_RESTRICTED_BY_IP;
    }

    public static getLocationRestrictedByGeoCoordinate(): IDMServiceError {
        return IDMServiceError.LOCATION_RESTRICTED_BY_GEO_COORDINATE;
    }

    public static getLocationRestrictedMonitoringMsg1(): IDMServiceError {
        return IDMServiceError.LOCATION_RESTRICTED_MONITORING_MSG1;
    }

    public static getLocationRestrictedMonitoringMsg2(): IDMServiceError {
        return IDMServiceError.LOCATION_RESTRICTED_MONITORING_MSG2;
    }

    public static getLocationRestrictedMonitoringMsg3(): IDMServiceError {
        return IDMServiceError.LOCATION_RESTRICTED_MONITORING_MSG3;
    }

    public static getBulkUpdateUserLimitReached(): IDMServiceError {
        return IDMServiceError.BULK_UPDATE_USER_LIMIT_REACHED;
    }

    public static getInvalidBrandId(): IDMServiceError {
        return IDMServiceError.INVALID_BRAND_ID;
    }

    public static getInvalidBrandNameFormat(): IDMServiceError {
        return IDMServiceError.INVALID_BRAND_NAME_FORMAT;
    }

    public static getInvalidBrandNameLength(): IDMServiceError {
        return IDMServiceError.INVALID_BRAND_NAME_LENGTH;
    }

    public static getInvalidBrandDescLength(): IDMServiceError {
        return IDMServiceError.INVALID_BRAND_DESC_LENGTH;
    }

    public static getBrandIdAlreadyExist(): IDMServiceError {
        return IDMServiceError.BRAND_ID_ALREADY_EXIST;
    }

    public static getBrandNameAlreadyExist(): IDMServiceError {
        return IDMServiceError.BRAND_NAME_ALREADY_EXIST;
    }

    public static getCurrentUserKycDetailsError(): IDMServiceError {
        return IDMServiceError.CURRENT_USER_KYC_DETAILS_ERROR;
    }

    public static getMaxKycAccountsReached(): IDMServiceError {
        return IDMServiceError.MAX_KYC_ACCOUNTS_REACHED;
    }

    public static getInvalidRequestError(): IDMServiceError{
        return IDMServiceError.INVALID_REQUEST_ERROR
    }

    public static getInvalidVendorId(): IDMServiceError{
        return IDMServiceError.INVALID_VENDOR_ID
    }

    public static getInvalidMobileStatus(): IDMServiceError{
        return IDMServiceError.INVALID_MOBILE_STATUS
    }

    public static getInvalidEmailStatus(): IDMServiceError{
        return IDMServiceError.INVALID_EMAIL_STATUS
    }

    public static getMaxDisplayNameDigitCount(): IDMServiceError{
        return IDMServiceError.MAX_DISPLAY_NAME_DIGIT_COUNT
    }

    public static getUsernameAlreadyExists(): IDMServiceError{
        return IDMServiceError.USERNAME_ALREADY_EXISTS;
    }

    public static getInvalidUsernameUpdate (): IDMServiceError {
        return IDMServiceError.INVALID_USERNAME_UPDATE;
    }

    public static getInvalidAccessKey (): IDMServiceError {
        return IDMServiceError.INVALID_ACCESS_KEY;
    }

	public static wrapError(error: any): IDMServiceError {
		return IDMServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `IDMServiceError:${error.type}`,
        })
	}
}

export default IDMServiceErrorUtil;
