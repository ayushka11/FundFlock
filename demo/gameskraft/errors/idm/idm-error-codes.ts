class IDMErrorCodes {

    private static BaseErrorCode = 19000;
    static RuntimeError = IDMErrorCodes.BaseErrorCode + 1;
    static UserDoesNotExist = IDMErrorCodes.BaseErrorCode + 2;
    static MissingRequiredUniqueId = IDMErrorCodes.BaseErrorCode + 3;
    static MissingRequiredDisplayNameInfo = IDMErrorCodes.BaseErrorCode + 4;
    static NoSuchUser = IDMErrorCodes.BaseErrorCode + 5;
    static IncorrectPassword = IDMErrorCodes.BaseErrorCode + 6;
    static InvalidFacebookAccessToken = IDMErrorCodes.BaseErrorCode + 7;
    static InvalidGoogleIdToken = IDMErrorCodes.BaseErrorCode + 8;
    static InvalidReferralInfo = IDMErrorCodes.BaseErrorCode + 9;
    static InvalidEmailFormat = IDMErrorCodes.BaseErrorCode + 10;
    static EmailNotPresent = IDMErrorCodes.BaseErrorCode + 11;
    static InvalidMobileFormat = IDMErrorCodes.BaseErrorCode + 12;
    static InvalidUserId = IDMErrorCodes.BaseErrorCode + 13;
    static EmailOrMobileRequired = IDMErrorCodes.BaseErrorCode + 14;
    static DisplayNameNecessary = IDMErrorCodes.BaseErrorCode + 15;
    static PasswordNecessary = IDMErrorCodes.BaseErrorCode + 16;
    static EmailAlreadyExist = IDMErrorCodes.BaseErrorCode + 17;
    static MobileAlreadyExist = IDMErrorCodes.BaseErrorCode + 18;
    static SameMobileAlreadyExist = IDMErrorCodes.BaseErrorCode + 19;
    static InvalidDisplayName = IDMErrorCodes.BaseErrorCode + 20;
    static DisplayNameTooShort = IDMErrorCodes.BaseErrorCode + 21;
    static DisplayNameTooLong = IDMErrorCodes.BaseErrorCode + 22;
    static DisplayNameContainsSwearWord = IDMErrorCodes.BaseErrorCode + 23;
    static DisplayNameStartsWithInvalidSequence = IDMErrorCodes.BaseErrorCode + 24;
    static DisplayNameShouldHaveOneAlphabet = IDMErrorCodes.BaseErrorCode + 25;
    static DisplayNameApiIntentNotValidation = IDMErrorCodes.BaseErrorCode + 26;
    static InvalidPanStatus = IDMErrorCodes.BaseErrorCode + 27;
    static InvalidBankStatus = IDMErrorCodes.BaseErrorCode + 28;
    static MobileUpdateInvalid = IDMErrorCodes.BaseErrorCode + 29;
    static MobileNumberInvalid = IDMErrorCodes.BaseErrorCode + 30;
    static InvalidFlowForUser = IDMErrorCodes.BaseErrorCode + 31;
    static DisplayNameAlreadyTaken = IDMErrorCodes.BaseErrorCode + 32;
    static MobileUpdateNotAllowedAlreadyVerified = IDMErrorCodes.BaseErrorCode + 33;
    static IncorrectEmailOrMobile = IDMErrorCodes.BaseErrorCode + 34;
    static EmailNotRegistered = IDMErrorCodes.BaseErrorCode + 35;
    static MobileNotRegistered = IDMErrorCodes.BaseErrorCode + 36;
    static UserAccountBlocked = IDMErrorCodes.BaseErrorCode + 37;
    static MultipleUsersFound = IDMErrorCodes.BaseErrorCode + 38;
    static OtpExpired = IDMErrorCodes.BaseErrorCode + 39;
    static OtpMismatch = IDMErrorCodes.BaseErrorCode + 40;
    static PanAlreadyExist = IDMErrorCodes.BaseErrorCode + 41;
    static PanAlreadyVerified = IDMErrorCodes.BaseErrorCode + 42;
    static NameIsMandatory = IDMErrorCodes.BaseErrorCode + 43;
    static DobIsMandatory = IDMErrorCodes.BaseErrorCode + 44;
    static BankDetailsDoesNotExist = IDMErrorCodes.BaseErrorCode + 45;
    static PanDetailsDoesNotExist = IDMErrorCodes.BaseErrorCode + 46;
    static BankDetailsAlreadyVerified = IDMErrorCodes.BaseErrorCode + 47;
    static RejectionReasonIsMandatory = IDMErrorCodes.BaseErrorCode + 48;
    static InvalidPanId = IDMErrorCodes.BaseErrorCode + 49;
    static InvalidIfsc = IDMErrorCodes.BaseErrorCode + 50;
    static InvalidFileUrl = IDMErrorCodes.BaseErrorCode + 51;
    static AgeLessThan_18 = IDMErrorCodes.BaseErrorCode + 52;
    static PanNotVerified = IDMErrorCodes.BaseErrorCode + 53;
    static UpiDetailsDoesNotExist = IDMErrorCodes.BaseErrorCode + 54;
    static UpiAlreadyExist = IDMErrorCodes.BaseErrorCode + 55;
    static ConsentNotProvided = IDMErrorCodes.BaseErrorCode + 56;
    static UpiDetailsAlreadyVerified = IDMErrorCodes.BaseErrorCode + 57;
    static MaxBankAccountsLimitReached = IDMErrorCodes.BaseErrorCode + 58;
    static BankAccountBlacklistedCode = IDMErrorCodes.BaseErrorCode + 59;
    static BulkLimitCrossed = IDMErrorCodes.BaseErrorCode + 60;
    static FacebookTokenAlreadyExist = IDMErrorCodes.BaseErrorCode + 61;
    static GoogleTokenAlreadyExist = IDMErrorCodes.BaseErrorCode + 62;
    static MobileAlreadyExistWithEmailVerified = IDMErrorCodes.BaseErrorCode + 63;
    static LocationRestrictedByIp = IDMErrorCodes.BaseErrorCode + 64;
    static LocationRestrictedByGeoCoordinate = IDMErrorCodes.BaseErrorCode + 65;
    static LocationRestrictedMonitoringMsg1 = IDMErrorCodes.BaseErrorCode + 66;
    static LocationRestrictedMonitoringMsg2 = IDMErrorCodes.BaseErrorCode + 67;
    static LocationRestrictedMonitoringMsg3 = IDMErrorCodes.BaseErrorCode + 68;
    static BulkUpdateUserLimitReached = IDMErrorCodes.BaseErrorCode + 69;
    static InvalidBrandId = IDMErrorCodes.BaseErrorCode + 70;
    static InvalidBrandNameFormat = IDMErrorCodes.BaseErrorCode + 71;
    static InvalidBrandNameLength = IDMErrorCodes.BaseErrorCode + 72;
    static InvalidBrandDescLength = IDMErrorCodes.BaseErrorCode + 73;
    static BrandIdAlreadyExist = IDMErrorCodes.BaseErrorCode + 74;
    static BrandNameAlreadyExist = IDMErrorCodes.BaseErrorCode + 75;
    static DocumentNotPan = IDMErrorCodes.BaseErrorCode + 75;
    static ImageNotReadable = IDMErrorCodes.BaseErrorCode + 76;
    static ExtractionDataNotValid = IDMErrorCodes.BaseErrorCode + 77;
    static PanTypeNotIndividual = IDMErrorCodes.BaseErrorCode + 78;
    static MinorDob = IDMErrorCodes.BaseErrorCode + 79;
    static DetectionApiError = IDMErrorCodes.BaseErrorCode + 80;
    static ExtractionApiError = IDMErrorCodes.BaseErrorCode + 81;
    static BadImageQuality = IDMErrorCodes.BaseErrorCode + 82;
    static IdfyInsufficientFunds = IDMErrorCodes.BaseErrorCode + 83;
    static DocumentNotOriginal = IDMErrorCodes.BaseErrorCode + 84;
    static PasswordProtectedFile = IDMErrorCodes.BaseErrorCode + 85;
    static CurrentUserKycDetailsError = IDMErrorCodes.BaseErrorCode + 86;
    static MaxKycAccountsReached = IDMErrorCodes.BaseErrorCode + 87;
    static InvalidRequestError = IDMErrorCodes.BaseErrorCode + 89;
    static InvalidVendorId              = IDMErrorCodes.BaseErrorCode + 90;
    static InvalidMobileStatus = IDMErrorCodes.BaseErrorCode + 91;
    static InvalidEmailStatus = IDMErrorCodes.BaseErrorCode + 92;
    static MaxDisplayNameDigitCount = IDMErrorCodes.BaseErrorCode + 93;
    static UsernameAlreadyExists = IDMErrorCodes.BaseErrorCode + 94;
    static InvalidUsernameUpdate = IDMErrorCodes.BaseErrorCode + 95;
    static InvalidAccessKey = IDMErrorCodes.BaseErrorCode + 96;

    static readonly RUNTIME_ERROR = new IDMErrorCodes(
        IDMErrorCodes.RuntimeError,
        'Something went wrong',
        'APPLICATION_RUNTIME_ERROR',
	  );

    static readonly USER_DOES_NOT_EXIST = new IDMErrorCodes(
        IDMErrorCodes.UserDoesNotExist,
        'User does not exist',
        'USER_DOES_NOT_EXIST',
    );

    static readonly MISSING_REQUIRED_UNIQUE_ID = new IDMErrorCodes(
        IDMErrorCodes.MissingRequiredUniqueId,
        '"Missing Required Unique Identifier',
        'MISSING_REQUIRED_UNIQUE_ID',
    );

    static readonly MISSING_REQUIRED_DISPLAY_NAME_INFO = new IDMErrorCodes(
        IDMErrorCodes.MissingRequiredDisplayNameInfo,
        'Missing Required Display Name Info',
        'MISSING_REQUIRED_DISPLAY_NAME_INFO',
    );

    static readonly NO_SUCH_USER = new IDMErrorCodes(
        IDMErrorCodes.NoSuchUser,
        'No such user',
        'NO_SUCH_USER',
    );

    static readonly INCORRECT_PASSWORD = new IDMErrorCodes(
        IDMErrorCodes.IncorrectPassword,
        'Incorrect Password',
        'INCORRECT_PASSWORD',
    );

    static readonly INVALID_FACEBOOK_ACCESS_TOKEN = new IDMErrorCodes(
        IDMErrorCodes.InvalidFacebookAccessToken,
        'Invalid facebook access token',
        'INVALID_FACEBOOK_ACCESS_TOKEN',
    );

    static readonly INVALID_GOOGLE_ID_TOKEN = new IDMErrorCodes(
        IDMErrorCodes.InvalidGoogleIdToken,
        'Invalid Google id token',
        'INVALID_GOOGLE_ID_TOKEN',
    );

    static readonly INVALID_REFERRAL_INFO = new IDMErrorCodes(
        IDMErrorCodes.InvalidReferralInfo,
        'Invalid referral Information',
        'INVALID_REFERRAL_INFO',
    );

    static readonly INVALID_EMAIL_FORMAT = new IDMErrorCodes(
        IDMErrorCodes.InvalidEmailFormat,
        'Invalid Email Format',
        'INVALID_EMAIL_FORMAT',
    );

    static readonly EMAIL_NOT_PRESENT = new IDMErrorCodes(
        IDMErrorCodes.EmailNotPresent,
        'Email not present',
        'EMAIL_NOT_PRESENT',
    );

    static readonly INVALID_MOBILE_FORMAT = new IDMErrorCodes(
        IDMErrorCodes.InvalidMobileFormat,
        'Invalid Mobile Format',
        'INVALID_MOBILE_FORMAT',
    );

    static readonly INVALID_USER_ID = new IDMErrorCodes(
        IDMErrorCodes.InvalidUserId,
        'Invalid userId',
        'INVALID_USER_ID',
    );

    static readonly EMAIL_OR_MOBILE_REQUIRED = new IDMErrorCodes(
        IDMErrorCodes.EmailOrMobileRequired,
        'Email or Mobile required',
        'EMAIL_OR_MOBILE_REQUIRED',
    );

    static readonly DISPLAY_NAME_NECESSARY = new IDMErrorCodes(
        IDMErrorCodes.DisplayNameNecessary,
        'Display name is necessary',
        'DISPLAY_NAME_NECESSARY',
    );

    static readonly PASSWORD_NECESSARY = new IDMErrorCodes(
        IDMErrorCodes.PasswordNecessary,
        'Password is required',
        'PASSWORD_NECESSARY',
    );

    static readonly EMAIL_ALREADY_EXIST = new IDMErrorCodes(
        IDMErrorCodes.EmailAlreadyExist,
        'Email already exist',
        'EMAIL_ALREADY_EXIST',
    );

    static readonly MOBILE_ALREADY_EXIST = new IDMErrorCodes(
        IDMErrorCodes.MobileAlreadyExist,
        'Mobile already exist',
        'MOBILE_ALREADY_EXIST',
    );

    static readonly SAME_MOBILE_ALREADY_EXIST = new IDMErrorCodes(
        IDMErrorCodes.SameMobileAlreadyExist,
        'ame mobile already exist',
        'SAME_MOBILE_ALREADY_EXIST',
    );

    static readonly INVALID_DISPLAY_NAME = new IDMErrorCodes(
        IDMErrorCodes.InvalidDisplayName,
        'Invalid Display name',
        'INVALID_DISPLAY_NAME',
    );

    static readonly DISPLAY_NAME_TOO_SHORT = new IDMErrorCodes(
        IDMErrorCodes.DisplayNameTooShort,
        'Display Name too short',
        'DISPLAY_NAME_TOO_SHORT',
    );

    static readonly DISPLAY_NAME_TOO_LONG = new IDMErrorCodes(
        IDMErrorCodes.DisplayNameTooLong,
        'Display Name too long',
        'DISPLAY_NAME_TOO_LONG',
    );

    static readonly DISPLAY_NAME_CONTAINS_SWEAR_WORD = new IDMErrorCodes(
        IDMErrorCodes.DisplayNameContainsSwearWord,
        'Display name contains a swear word',
        'DISPLAY_NAME_CONTAINS_SWEAR_WORD',
    );

    static readonly DISPLAY_NAME_STARTS_WITH_INVALID_SEQUENCE = new IDMErrorCodes(
        IDMErrorCodes.DisplayNameStartsWithInvalidSequence,
        'Display name starts with Invalid Sequence',
        'DISPLAY_NAME_STARTS_WITH_INVALID_SEQUENCE',
    );

    static readonly DISPLAY_NAME_SHOULD_HAVE_ONE_ALPHABET = new IDMErrorCodes(
        IDMErrorCodes.DisplayNameShouldHaveOneAlphabet,
        'Display name should have atleast one alphabet',
        'DISPLAY_NAME_SHOULD_HAVE_ONE_ALPHABET',
    );

    static readonly DISPLAY_NAME_API_INTENT_NOT_VALIDATION = new IDMErrorCodes(
        IDMErrorCodes.DisplayNameApiIntentNotValidation,
        'Display name api intent is not validate',
        'DISPLAY_NAME_API_INTENT_NOT_VALIDATION',
    );

    static readonly INVALID_PAN_STATUS = new IDMErrorCodes(
        IDMErrorCodes.InvalidPanStatus,
        'Invalid Pan Status',
        'INVALID_PAN_STATUS',
    );

    static readonly INVALID_BANK_STATUS = new IDMErrorCodes(
        IDMErrorCodes.InvalidBankStatus,
        'Invalid Bank Status',
        'INVALID_BANK_STATUS',
    );

    static readonly MOBILE_UPDATE_INVALID = new IDMErrorCodes(
        IDMErrorCodes.MobileUpdateInvalid,
        'Mobile update invalid',
        'MOBILE_UPDATE_INVALID',
    );

    static readonly MOBILE_NUMBER_INVALID = new IDMErrorCodes(
        IDMErrorCodes.MobileNumberInvalid,
        'Mobile number invalid',
        'MOBILE_NUMBER_INVALID',
    );

    static readonly INVALID_FLOW_FOR_USER = new IDMErrorCodes(
        IDMErrorCodes.InvalidFlowForUser,
        'Invalid Flow For User',
        'INVALID_FLOW_FOR_USER',
    );

    static readonly DISPLAY_NAME_ALREADY_TAKEN = new IDMErrorCodes(
        IDMErrorCodes.DisplayNameAlreadyTaken,
        'Display name already taken',
        'DISPLAY_NAME_ALREADY_TAKEN',
    );

    static readonly MOBILE_UPDATE_NOT_ALLOWED_ALREADY_VERIFIED = new IDMErrorCodes(
        IDMErrorCodes.MobileUpdateNotAllowedAlreadyVerified,
        'Mobile update not allowed for verified mobile',
        'MOBILE_UPDATE_NOT_ALLOWED_ALREADY_VERIFIED',
    );

    static readonly INCORRECT_EMAIL_OR_MOBILE = new IDMErrorCodes(
        IDMErrorCodes.IncorrectEmailOrMobile,
        'Incorrect Email or Mobile',
        'INCORRECT_EMAIL_OR_MOBILE',
    );

    static readonly EMAIL_NOT_REGISTERED = new IDMErrorCodes(
        IDMErrorCodes.EmailNotRegistered,
        'Email not registered',
        'EMAIL_NOT_REGISTERED',
    );

    static readonly MOBILE_NOT_REGISTERED = new IDMErrorCodes(
        IDMErrorCodes.MobileNotRegistered,
        'Mobile not registered',
        'MOBILE_NOT_REGISTERED',
    );

    static readonly USER_ACCOUNT_BLOCKED = new IDMErrorCodes(
        IDMErrorCodes.UserAccountBlocked,
        'Your account has been temporarily blocked. Please reach out to our support team for assistance.',
        'USER_ACCOUNT_BLOCKED',
    );

    static readonly MULTIPLE_USERS_FOUND = new IDMErrorCodes(
        IDMErrorCodes.MultipleUsersFound,
        'Mutiple users found with given details',
        'MULTIPLE_USERS_FOUND',
    );

    static readonly OTP_EXPIRED = new IDMErrorCodes(
        IDMErrorCodes.OtpExpired,
        'The OTP has expired. Please generate a new OTP to proceed.',
        'OTP_EXPIRED',
    );

    static readonly OTP_MISMATCH = new IDMErrorCodes(
        IDMErrorCodes.OtpMismatch,
        'The OTP entered is invalid. Please try again.',
        'OTP_MISMATCH',
    );

    static readonly PAN_ALREADY_EXIST = new IDMErrorCodes(
        IDMErrorCodes.PanAlreadyExist,
        'Same Pan already exist for a user',
        'PAN_ALREADY_EXIST',
    );

    static readonly PAN_ALREADY_VERIFIED = new IDMErrorCodes(
        IDMErrorCodes.PanAlreadyVerified,
        'PAN Already Verified',
        'PAN_ALREADY_VERIFIED',
    );

    static readonly NAME_IS_MANDATORY = new IDMErrorCodes(
        IDMErrorCodes.NameIsMandatory,
        'Name is Mandatory',
        'NAME_IS_MANDATORY',
    );

    static readonly DOB_IS_MANDATORY = new IDMErrorCodes(
        IDMErrorCodes.DobIsMandatory,
        'DOB is Mandatory',
        'DOB_IS_MANDATORY',
    );

    static readonly BANK_DETAILS_DOES_NOT_EXIST = new IDMErrorCodes(
        IDMErrorCodes.BankDetailsDoesNotExist,
        'Bank Details do not Exist',
        'BANK_DETAILS_DOES_NOT_EXIST',
    );

    static readonly PAN_DETAILS_DOES_NOT_EXIST = new IDMErrorCodes(
        IDMErrorCodes.PanDetailsDoesNotExist,
        'Pan Details do not Exist',
        'PAN_DETAILS_DOES_NOT_EXIST',
    );

    static readonly BANK_DETAILS_ALREADY_VERIFIED = new IDMErrorCodes(
        IDMErrorCodes.BankDetailsAlreadyVerified,
        'Bank Details do not Exist',
        'BANK_DETAILS_ALREADY_VERIFIED',
    );

    static readonly REJECTION_REASON_IS_MANDATORY = new IDMErrorCodes(
        IDMErrorCodes.RejectionReasonIsMandatory,
        'Rejection Reason is mandatory',
        'REJECTION_REASON_IS_MANDATORY',
    );

    static readonly INVALID_PAN_ID = new IDMErrorCodes(
        IDMErrorCodes.InvalidPanId,
        'Invalid Pan Id',
        'INVALID_PAN_ID',
    );

    static readonly INVALID_IFSC = new IDMErrorCodes(
        IDMErrorCodes.InvalidIfsc,
        'Invalid Ifsc',
        'INVALID_IFSC',
    );

    static readonly INVALID_FILE_URL = new IDMErrorCodes(
        IDMErrorCodes.InvalidFileUrl,
        'Invalid File Url',
        'INVALID_FILE_URL',
    );

    static readonly AGE_LESS_THAN_18 = new IDMErrorCodes(
        IDMErrorCodes.AgeLessThan_18,
        'Age less than 18',
        'AGE_LESS_THAN_18',
    );

    static readonly PAN_NOT_VERIFIED = new IDMErrorCodes(
        IDMErrorCodes.PanNotVerified,
        'PAN Not Verified',
        'PAN_NOT_VERIFIED',
    );

    static readonly UPI_DETAILS_DOES_NOT_EXIST = new IDMErrorCodes(
        IDMErrorCodes.UpiDetailsDoesNotExist,
        'UPI details does not exist',
        'UPI_DETAILS_DOES_NOT_EXIST',
    );

    static readonly UPI_ALREADY_EXIST = new IDMErrorCodes(
        IDMErrorCodes.UpiAlreadyExist,
        'Same Upi already exist for a user',
        'UPI_ALREADY_EXIST',
    );

    static readonly CONSENT_NOT_PROVIDED = new IDMErrorCodes(
        IDMErrorCodes.ConsentNotProvided,
        'Consent not provided by user',
        'CONSENT_NOT_PROVIDED',
    );

    static readonly UPI_DETAILS_ALREADY_VERIFIED = new IDMErrorCodes(
        IDMErrorCodes.UpiDetailsAlreadyVerified,
        'Upi Details already verified',
        'UPI_DETAILS_ALREADY_VERIFIED',
    );

    static readonly MAX_BANK_ACCOUNTS_LIMIT_REACHED = new IDMErrorCodes(
        IDMErrorCodes.MaxBankAccountsLimitReached,
        'User Max Bank Account Limit Reached',
        'MAX_BANK_ACCOUNTS_LIMIT_REACHED',
    );

    static readonly BANK_ACCOUNT_BLACKLISTED_CODE = new IDMErrorCodes(
        IDMErrorCodes.BankAccountBlacklistedCode,
        'Bank account is blacklisted',
        'BANK_ACCOUNT_BLACKLISTED_CODE',
    );

    static readonly BULK_LIMIT_CROSSED = new IDMErrorCodes(
        IDMErrorCodes.BulkLimitCrossed,
        'Bulk limit is exceeded',
        'BULK_LIMIT_CROSSED',
    );

    static readonly FACEBOOK_TOKEN_ALREADY_EXIST = new IDMErrorCodes(
        IDMErrorCodes.FacebookTokenAlreadyExist,
        'Facebook Id is already registered',
        'FACEBOOK_TOKEN_ALREADY_EXIST',
    );

    static readonly GOOGLE_TOKEN_ALREADY_EXIST = new IDMErrorCodes(
        IDMErrorCodes.GoogleTokenAlreadyExist,
        'Google id is already registered',
        'GOOGLE_TOKEN_ALREADY_EXIST',
    );

    static readonly MOBILE_ALREADY_EXIST_WITH_EMAIL_VERIFIED = new IDMErrorCodes(
        IDMErrorCodes.MobileAlreadyExistWithEmailVerified,
        'Mobile already exist with another verified EmailId',
        'MOBILE_ALREADY_EXIST_WITH_EMAIL_VERIFIED',
    );

    static readonly LOCATION_RESTRICTED_BY_IP = new IDMErrorCodes(
        IDMErrorCodes.LocationRestrictedByIp,
        'Location is restricted by IP',
        'LOCATION_RESTRICTED_BY_IP',
    );

    static readonly LOCATION_RESTRICTED_BY_GEO_COORDINATE = new IDMErrorCodes(
        IDMErrorCodes.LocationRestrictedByGeoCoordinate,
        'Location is restricted by geo coordinates',
        'LOCATION_RESTRICTED_BY_GEO_COORDINATE',
    );

    static readonly LOCATION_RESTRICTED_MONITORING_MSG1 = new IDMErrorCodes(
        IDMErrorCodes.LocationRestrictedMonitoringMsg1,
        'Location is restricted',
        'LOCATION_RESTRICTED_MONITORING_MSG1',
    );

    static readonly LOCATION_RESTRICTED_MONITORING_MSG2 = new IDMErrorCodes(
        IDMErrorCodes.LocationRestrictedMonitoringMsg2,
        'Location is restricted',
        'LOCATION_RESTRICTED_MONITORING_MSG2',
    );

    static readonly LOCATION_RESTRICTED_MONITORING_MSG3 = new IDMErrorCodes(
        IDMErrorCodes.LocationRestrictedMonitoringMsg3,
        'Location is restricted',
        'LOCATION_RESTRICTED_MONITORING_MSG3',
    );

    static readonly BULK_UPDATE_USER_LIMIT_REACHED = new IDMErrorCodes(
        IDMErrorCodes.BulkUpdateUserLimitReached,
        'Bulk update max user limit reached',
        'BULK_UPDATE_USER_LIMIT_REACHED',
    );

    static readonly INVALID_BRAND_ID = new IDMErrorCodes(
        IDMErrorCodes.InvalidBrandId,
        'Invalid Brand ID',
        'INVALID_BRAND_ID',
    );

    static readonly INVALID_BRAND_NAME_FORMAT = new IDMErrorCodes(
        IDMErrorCodes.InvalidBrandNameFormat,
        'Invalid Brand Name Format',
        'INVALID_BRAND_NAME_FORMAT',
    );

    static readonly INVALID_BRAND_NAME_LENGTH = new IDMErrorCodes(
        IDMErrorCodes.InvalidBrandNameLength,
        'Invalid Brand Name Length. Should be less than 100',
        'INVALID_BRAND_NAME_LENGTH',
    );

    static readonly INVALID_BRAND_DESC_LENGTH = new IDMErrorCodes(
        IDMErrorCodes.InvalidBrandDescLength,
        'Invalid Brand Name Length. Should be less than 250',
        'INVALID_BRAND_DESC_LENGTH',
    );

    static readonly BRAND_ID_ALREADY_EXIST = new IDMErrorCodes(
        IDMErrorCodes.BrandIdAlreadyExist,
        'Brand Id already exists',
        'BRAND_ID_ALREADY_EXIST',
    );

    static readonly BRAND_NAME_ALREADY_EXIST = new IDMErrorCodes(
        IDMErrorCodes.BrandNameAlreadyExist,
        'Brand Name already exists',
        'BRAND_NAME_ALREADY_EXIST',
    );

    static readonly DOCUMENT_NOT_PAN = new IDMErrorCodes(
        IDMErrorCodes.DocumentNotPan,
        'Document is not a valid PAN',
        'DOCUMENT_NOT_PAN',
    );

    static readonly IMAGE_NOT_READABLE = new IDMErrorCodes(
        IDMErrorCodes.ImageNotReadable,
        'Image is not clear',
        'IMAGE_NOT_READABLE',
    );

    static readonly EXTRACTION_DATA_NOT_VALID = new IDMErrorCodes(
        IDMErrorCodes.ExtractionDataNotValid,
        'Pan Extracted Data is not valid',
        'EXTRACTION_DATA_NOT_VALID',
    );

    static readonly PAN_TYPE_NOT_INDIVIDUAL = new IDMErrorCodes(
        IDMErrorCodes.PanTypeNotIndividual,
        'Pan type is business',
        'PAN_TYPE_NOT_INDIVIDUAL',
    );

    static readonly MINOR_DOB = new IDMErrorCodes(
        IDMErrorCodes.MinorDob,
        'Pan belongs to a minor',
        'MINOR_DOB',
    );

    static readonly DETECTION_API_ERROR = new IDMErrorCodes(
        IDMErrorCodes.DetectionApiError,
        'Failed to process PAN',
        'DETECTION_API_ERROR',
    );

    static readonly EXTRACTION_API_ERROR = new IDMErrorCodes(
        IDMErrorCodes.ExtractionApiError,
        'Failed to process PAN',
        'EXTRACTION_API_ERROR',
    );

    static readonly BAD_IMAGE_QUALITY = new IDMErrorCodes(
        IDMErrorCodes.BadImageQuality,
        'Image is non compliant to request/quality standard',
        'BAD_IMAGE_QUALITY',
    );

    static readonly IDFY_INSUFFICIENT_FUNDS = new IDMErrorCodes(
        IDMErrorCodes.IdfyInsufficientFunds,
        'Failed to process PAN',
        'IDFY_INSUFFICIENT_FUNDS',
    );

    static readonly DOCUMENT_NOT_ORIGINAL = new IDMErrorCodes(
        IDMErrorCodes.DocumentNotOriginal,
        'Document is not original',
        'DOCUMENT_NOT_ORIGINAL',
    );

    static readonly PASSWORD_PROTECTED_FILE = new IDMErrorCodes(
        IDMErrorCodes.PasswordProtectedFile,
        'Document is password protected',
        'PASSWORD_PROTECTED_FILE',
    );

    static readonly CURRENT_USER_KYC_DETAILS_ERROR = new IDMErrorCodes(
        IDMErrorCodes.CurrentUserKycDetailsError,
        'Unable to retrieve the current kyc accounts.',
        'CURRENT_USER_KYC_DETAILS_ERROR',
    );

    static readonly MAX_KYC_ACCOUNTS_REACHED = new IDMErrorCodes(
        IDMErrorCodes.MaxKycAccountsReached,
        "You've reached max account limit for this account",
        'MAX_KYC_ACCOUNTS_REACHED',
    );

    static readonly INVALID_REQUEST_ERROR  = new IDMErrorCodes(
        IDMErrorCodes.InvalidRequestError,
        "Invalid Request Error",
        'INVALID_REQUEST_ERROR',
    );

    static readonly INVALID_VENDOR_ID  = new IDMErrorCodes(
        IDMErrorCodes.InvalidVendorId,
        "Invalid Vendor Id",
        'INVALID_VENDOR_ID',
    );

    static readonly INVALID_MOBILE_STATUS  = new IDMErrorCodes(
        IDMErrorCodes.InvalidMobileStatus,
        "Invalid Mobile Status",
        'INVALID_MOBILE_STATUS',
    );

    static readonly INVALID_EMAIL_STATUS  = new IDMErrorCodes(
        IDMErrorCodes.InvalidEmailStatus,
        "Invalid Email Status",
        'INVALID_EMAIL_STATUS',
    );

    static readonly MAX_DISPLAY_NAME_DIGIT_COUNT   = new IDMErrorCodes(
        IDMErrorCodes.MaxDisplayNameDigitCount,
        "Max Display Name Digit Count",
        'MAX_DISPLAY_NAME_DIGIT_COUNT',
    );

    static readonly USERNAME_ALREADY_EXISTS = new IDMErrorCodes(
      IDMErrorCodes.UsernameAlreadyExists,
      'Username already exists',
      'USERNAME_ALREADY_EXISTS',
    );

    static readonly INVALID_USERNAME_UPDATE  = new IDMErrorCodes(
        IDMErrorCodes.InvalidUsernameUpdate,
        'Username update invalid ',
        'USERNAME_UPDATE_INVALID',
    );

    static readonly INVALID_ACCESS_KEY = new IDMErrorCodes(
        IDMErrorCodes.InvalidAccessKey,
        'Invalid Access Key',
        'INVALID_ACCESS_KEY',
    );




	// private to disallow creating other instances of this type
	private constructor(
		public code: number,
		public message: string,
		public name: string,
		public type?: string,
	) {}
	toString(): string {
		return `${this.name}:${this.code}:${this.message}`;
	}
}

export default IDMErrorCodes;
