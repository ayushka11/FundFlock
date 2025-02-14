class GuardianErrorCodes {

    private static BaseErrorCode = 20000;
    static RuntimeError = GuardianErrorCodes.BaseErrorCode + 1;
    static InternalServerError = GuardianErrorCodes.BaseErrorCode + 2;
    static SecurityHeadersNotProvided = GuardianErrorCodes.BaseErrorCode + 3;
    static InvalidAccessId = GuardianErrorCodes.BaseErrorCode + 4;
    static UpstreamErrorStr = GuardianErrorCodes.BaseErrorCode + 5;
    static InvalidRequest = GuardianErrorCodes.BaseErrorCode + 6;
    static InvalidTask = GuardianErrorCodes.BaseErrorCode + 7;
    static InvalidJson = GuardianErrorCodes.BaseErrorCode + 8;
    static PartnerInvalidResponse = GuardianErrorCodes.BaseErrorCode + 9;
    static InvalidDocumentField = GuardianErrorCodes.BaseErrorCode + 10;
    static InvalidDocumentStatus = GuardianErrorCodes.BaseErrorCode + 11;
    static IdfyInsufficientBalance = GuardianErrorCodes.BaseErrorCode + 12;
    static CashfreeInsufficientBalance = GuardianErrorCodes.BaseErrorCode + 13;
    static PartnerServiceUnknownError = GuardianErrorCodes.BaseErrorCode + 14;
    static DocumentNotUploaded = GuardianErrorCodes.BaseErrorCode + 15;
    static PartnerClientError = GuardianErrorCodes.BaseErrorCode + 16;
    static RequestIdNotProvided = GuardianErrorCodes.BaseErrorCode + 17;
    static FileNotSupported = GuardianErrorCodes.BaseErrorCode + 18;
    static FileSizeExceeded = GuardianErrorCodes.BaseErrorCode + 19;
    static UploadToS3Failed = GuardianErrorCodes.BaseErrorCode + 20;
    static DocumentAlreadyUploaded = GuardianErrorCodes.BaseErrorCode + 21;
    static InvalidImageUrl = GuardianErrorCodes.BaseErrorCode + 22;
    static InvalidImage = GuardianErrorCodes.BaseErrorCode + 23;
    static ImageNotAccessible = GuardianErrorCodes.BaseErrorCode + 24;
    static ImageNotPan = GuardianErrorCodes.BaseErrorCode + 25;
    static MinorDobPan = GuardianErrorCodes.BaseErrorCode + 26;
    static PanTypeNotIndividual = GuardianErrorCodes.BaseErrorCode + 27;
    static ExtractionResponseInvalid = GuardianErrorCodes.BaseErrorCode + 28;
    static DocumentNotOriginal = GuardianErrorCodes.BaseErrorCode + 29;
    static InvalidDocumentKycLevel = GuardianErrorCodes.BaseErrorCode + 30;
    static PrerequisiteDocumentNotVerified = GuardianErrorCodes.BaseErrorCode + 31;
    static DocumentKycAlreadyDone = GuardianErrorCodes.BaseErrorCode + 32;
    static SameDetailsVerifiedAlreadyVerified = GuardianErrorCodes.BaseErrorCode + 33;
    static SameDetailsAlreadyVerifiedForUser = GuardianErrorCodes.BaseErrorCode + 34;
    static PanIdNotFoundOnSource = GuardianErrorCodes.BaseErrorCode + 35;
    static SourceBankError = GuardianErrorCodes.BaseErrorCode + 36;
    static InvalidBankAccount = GuardianErrorCodes.BaseErrorCode + 37;
    static InvalidIfsc = GuardianErrorCodes.BaseErrorCode + 38;
    static AccountBlocked = GuardianErrorCodes.BaseErrorCode + 39;
    static AccountClosed = GuardianErrorCodes.BaseErrorCode + 40;
    static InvalidPartnerIfscResponse = GuardianErrorCodes.BaseErrorCode + 41;
    static InvalidPartnerBankVerifyResponse = GuardianErrorCodes.BaseErrorCode + 42;
    static BankNotSupported = GuardianErrorCodes.BaseErrorCode + 43;
    static DigitalBankWithoutConsent = GuardianErrorCodes.BaseErrorCode + 44;
    static IfscFromBannedState = GuardianErrorCodes.BaseErrorCode + 45;
    static IfscNotProvided = GuardianErrorCodes.BaseErrorCode + 46;
    static InvalidUpi = GuardianErrorCodes.BaseErrorCode + 47;
    static UpiNotSupported = GuardianErrorCodes.BaseErrorCode + 48;
    static UpiWithoutConsent = GuardianErrorCodes.BaseErrorCode + 49;
    static VerificationAlreadyStarted = GuardianErrorCodes.BaseErrorCode + 50;
    static InvalidTransition = GuardianErrorCodes.BaseErrorCode + 51;
    static WebhookUnknownError = GuardianErrorCodes.BaseErrorCode + 52;
    static StateNotAllowedForAadharError = GuardianErrorCodes.BaseErrorCode + 53;
    static MaxAllowedKycLimitExceededError = GuardianErrorCodes.BaseErrorCode + 54;
    static BankVerificationFailed =  GuardianErrorCodes.BaseErrorCode + 55;
    static UpiVerificationFailed =  GuardianErrorCodes.BaseErrorCode + 56;
    static FaceNotDetected =  GuardianErrorCodes.BaseErrorCode + 57;
    static ProvidedScannedCopy =  GuardianErrorCodes.BaseErrorCode + 58;
    
    
    static readonly RUNTIME_ERROR = new GuardianErrorCodes(
		GuardianErrorCodes.RuntimeError,
		'Something went wrong',
		'APPLICATION_RUNTIME_ERROR',
	);

    static readonly INTERNAL_SERVER_ERROR = new GuardianErrorCodes(
        GuardianErrorCodes.InternalServerError,
        'Something went wrong. Please try again later',
        'INTERNAL_SERVER_ERROR'
    );
    
    static readonly SECURITY_HEADERS_NOT_PROVIDED = new GuardianErrorCodes(
        GuardianErrorCodes.SecurityHeadersNotProvided,
        'X-Access-Id Not Provided in the Headers',
        'SECURITY_HEADERS_NOT_PROVIDED'
    );
    
    static readonly INVALID_ACCESS_ID = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidAccessId,
        'Access Id is invalid',
        'INVALID_ACCESS_ID'
    );

    

    static readonly BANK_VERIFICATION_FAILED = (errorMessage: string) => {
        return new GuardianErrorCodes(
            GuardianErrorCodes.BankVerificationFailed,
            errorMessage,
            'BANK_VERIFICATION_FAILED'
        );
    }

    static readonly UPI_VERIFICATION_FAILED = (errorMessage: string) => {
        return new GuardianErrorCodes(
            GuardianErrorCodes.UpiVerificationFailed,
            errorMessage,
            'UPI_VERIFICATION_FAILED'
        );
    }
    
    static readonly UPSTREAM_ERROR_STR = new GuardianErrorCodes(
        GuardianErrorCodes.UpstreamErrorStr,
        'Third Party Error',
        'UPSTREAM_ERROR_STR'
    );
    
    static readonly INVALID_REQUEST = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidRequest,
        'Invalid Request',
        'INVALID_REQUEST'
    );
    
    static readonly INVALID_TASK = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidTask,
        'Invalid Task',
        'INVALID_TASK'
    );
    
    static readonly INVALID_JSON = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidJson,
        'Invalid Json',
        'INVALID_JSON'
    );
    
    static readonly PARTNER_INVALID_RESPONSE = new GuardianErrorCodes(
        GuardianErrorCodes.PartnerInvalidResponse,
        'Invalid Response from Partner Service',
        'PARTNER_INVALID_RESPONSE'
    );
    
    static readonly INVALID_DOCUMENT_FIELD = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidDocumentField,
        'Field not supported',
        'INVALID_DOCUMENT_FIELD'
    );
    
    static readonly INVALID_DOCUMENT_STATUS = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidDocumentStatus,
        'Invalid Document Status',
        'INVALID_DOCUMENT_STATUS'
    );
    
    static readonly IDFY_INSUFFICIENT_BALANCE = new GuardianErrorCodes(
        GuardianErrorCodes.IdfyInsufficientBalance,
        'Insufficient Credits in Idfy Account',
        'IDFY_INSUFFICIENT_BALANCE'
    );
    
    static readonly CASHFREE_INSUFFICIENT_BALANCE = new GuardianErrorCodes(
        GuardianErrorCodes.CashfreeInsufficientBalance,
        'Insufficient Balance in Quicko',
        'CASHFREE_INSUFFICIENT_BALANCE'
    );
    
    static readonly PARTNER_SERVICE_UNKNOWN_ERROR = new GuardianErrorCodes(
        GuardianErrorCodes.PartnerServiceUnknownError,
        'Unknown Error from Partner Service',
        'PARTNER_SERVICE_UNKNOWN_ERROR'
    );
    
    static readonly DOCUMENT_NOT_UPLOADED = new GuardianErrorCodes(
        GuardianErrorCodes.DocumentNotUploaded,
        'Image not uploaded yet',
        'DOCUMENT_NOT_UPLOADED'
    );
    
    static readonly PARTNER_CLIENT_ERROR = new GuardianErrorCodes(
        GuardianErrorCodes.PartnerClientError,
        'Partner Client Error',
        'PARTNER_CLIENT_ERROR'
    );

    static readonly REQUEST_ID_NOT_PROVIDED = new GuardianErrorCodes(
        GuardianErrorCodes.RequestIdNotProvided,
        'X-Request-Id missing from headers',
        'REQUEST_ID_NOT_PROVIDED'
    );
    
    static readonly FILE_NOT_SUPPORTED = new GuardianErrorCodes(
        GuardianErrorCodes.FileNotSupported,
        'File format not supported',
        'FILE_NOT_SUPPORTED'
    );
    
    static readonly FILE_SIZE_EXCEEDED = new GuardianErrorCodes(
        GuardianErrorCodes.FileSizeExceeded,
        'Max file size is 5MB',
        'FILE_SIZE_EXCEEDED'
    );
    
    static readonly UPLOAD_TO_S3_FAILED = new GuardianErrorCodes(
        GuardianErrorCodes.UploadToS3Failed,
        "Couldn't upload file",
        'UPLOAD_TO_S3_FAILED'
    );
    
    static readonly DOCUMENT_ALREADY_UPLOADED = new GuardianErrorCodes(
        GuardianErrorCodes.DocumentAlreadyUploaded,
        'Document Already Uploaded',
        'DOCUMENT_ALREADY_UPLOADED'
    );
    
    static readonly INVALID_IMAGE_URL = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidImageUrl,
        'Image URL Not Accessible',
        'INVALID_IMAGE_URL'
    );
    
    static readonly INVALID_IMAGE = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidImage,
        'Image Not Clear Enough',
        'INVALID_IMAGE'
    );
    
    static readonly IMAGE_NOT_ACCESSIBLE = new GuardianErrorCodes(
        GuardianErrorCodes.ImageNotAccessible,
        'Encrypted Image',
        'IMAGE_NOT_ACCESSIBLE'
    );
    
    static readonly IMAGE_NOT_PAN = new GuardianErrorCodes(
        GuardianErrorCodes.ImageNotPan,
        'Image is not a Pan Document',
        'IMAGE_NOT_PAN'
    );
    
    static readonly MINOR_DOB_PAN = new GuardianErrorCodes(
        GuardianErrorCodes.MinorDobPan,
        'Pan Belongs to a Minor',
        'MINOR_DOB_PAN'
    );
    
    static readonly PAN_TYPE_NOT_INDIVIDUAL = new GuardianErrorCodes(
        GuardianErrorCodes.PanTypeNotIndividual,
        'Pan does not belong a person',
        'PAN_TYPE_NOT_INDIVIDUAL'
    );
    
    static readonly EXTRACTION_RESPONSE_INVALID = new GuardianErrorCodes(
        GuardianErrorCodes.ExtractionResponseInvalid,
        'Extraction Response is Invalid',
        'EXTRACTION_RESPONSE_INVALID'
    );
    
    static readonly DOCUMENT_NOT_ORIGINAL = new GuardianErrorCodes(
        GuardianErrorCodes.DocumentNotOriginal,
        'Document is not Original',
        'DOCUMENT_NOT_ORIGINAL'
    );
    
    static readonly INVALID_DOCUMENT_KYC_LEVEL = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidDocumentKycLevel,
        'Document Kyc Level Not Valid',
        'INVALID_DOCUMENT_KYC_LEVEL'
    );
    
    static readonly PREREQUISITE_DOCUMENT_NOT_VERIFIED = new GuardianErrorCodes(
        GuardianErrorCodes.PrerequisiteDocumentNotVerified,
        'Prerequisite document not verified',
        'PREREQUISITE_DOCUMENT_NOT_VERIFIED'
    );
    
    static readonly DOCUMENT_KYC_ALREADY_DONE = new GuardianErrorCodes(
        GuardianErrorCodes.DocumentKycAlreadyDone,
        'Document is already verified',
        'DOCUMENT_KYC_ALREADY_DONE'
    );
    
    static readonly SAME_DETAILS_VERIFIED_ALREADY_VERIFIED = new GuardianErrorCodes(
        GuardianErrorCodes.SameDetailsVerifiedAlreadyVerified,
        'Same details are already verified for this user',
        'SAME_DETAILS_VERIFIED_ALREADY_VERIFIED'
    );
    
    static readonly SAME_DETAILS_ALREADY_VERIFIED_FOR_USER = new GuardianErrorCodes(
        GuardianErrorCodes.SameDetailsAlreadyVerifiedForUser,
        'Same details are already verified for another user',
        'SAME_DETAILS_ALREADY_VERIFIED_FOR_ANOTHER_USER'
    );
    
    static readonly PAN_ID_NOT_FOUND_ON_SOURCE = new GuardianErrorCodes(
        GuardianErrorCodes.PanIdNotFoundOnSource,
        'Pan Id not Found',
        'PAN_ID_NOT_FOUND_ON_SOURCE'
    );
    
    static readonly SOURCE_BANK_ERROR = new GuardianErrorCodes(
        GuardianErrorCodes.SourceBankError,
        'Error at source bank',
        'SOURCE_BANK_ERROR'
    );
    
    static readonly INVALID_BANK_ACCOUNT = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidBankAccount,
        'Bank Account Invalid',
        'INVALID_BANK_ACCOUNT'
    );
    
    static readonly INVALID_IFSC = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidIfsc,
        'IFSC is Invalid',
        'INVALID_IFSC'
    );
    
    static readonly ACCOUNT_BLOCKED = new GuardianErrorCodes(
        GuardianErrorCodes.AccountBlocked,
        'Account is blocked',
        'ACCOUNT_BLOCKED' 
    );
    
    static readonly ACCOUNT_CLOSED = new GuardianErrorCodes(
        GuardianErrorCodes.AccountClosed,
        'Account is Closed',
        'ACCOUNT_CLOSED'
    );
    
    static readonly INVALID_PARTNER_IFSC_RESPONSE = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidPartnerIfscResponse,
        'Invalid response from partner for ifsc details',
        'INVALID_PARTNER_IFSC_RESPONSE'
    );
    
    static readonly INVALID_PARTNER_BANK_VERIFY_RESPONSE = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidPartnerBankVerifyResponse,
        'Invalid response from partner for bank account verification',
        'INVALID_PARTNER_BANK_VERIFY_RESPONSE'
    );
    
    static readonly BANK_NOT_SUPPORTED = new GuardianErrorCodes(
        GuardianErrorCodes.BankNotSupported,
        'This bank is not supported currently',
        'BANK_NOT_SUPPORTED'
    );
    
    static readonly DIGITAL_BANK_WITHOUT_CONSENT = new GuardianErrorCodes(
        GuardianErrorCodes.DigitalBankWithoutConsent,
        'Consent Not Provided for Digital Bank',
        'DIGITAL_BANK_WITHOUT_CONSENT'
    );
    
    static readonly IFSC_FROM_BANNED_STATE = new GuardianErrorCodes(
        GuardianErrorCodes.IfscFromBannedState,
        'Ifsc is from Banned State',
        'IFSC_FROM_BANNED_STATE'
    );
    
    static readonly IFSC_NOT_PROVIDED = new GuardianErrorCodes(
        GuardianErrorCodes.IfscNotProvided,
        'Ifsc not provided',
        'IFSC_NOT_PROVIDED'
    );
    
    static readonly INVALID_UPI = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidUpi,
        'UPI Invalid',
        'INVALID_UPI'
    );
    
    static readonly UPI_NOT_SUPPORTED = new GuardianErrorCodes(
        GuardianErrorCodes.UpiNotSupported,
        'This upi is not supported currently',
        'UPI_NOT_SUPPORTED'
    );
    
    static readonly UPI_WITHOUT_CONSENT = new GuardianErrorCodes(
        GuardianErrorCodes.UpiWithoutConsent,
        'Consent Not Provided for UPI',
        'UPI_WITHOUT_CONSENT'
    );
    
    static readonly VERIFICATION_ALREADY_STARTED = new GuardianErrorCodes(
        GuardianErrorCodes.VerificationAlreadyStarted,
        'Document Verification Already Started',
        'VERIFICATION_ALREADY_STARTED'
    );
    
    static readonly INVALID_TRANSITION = new GuardianErrorCodes(
        GuardianErrorCodes.InvalidTransition,
        'Status Transition Invalid',
        'INVALID_TRANSITION'
    );
    
    static readonly WEBHOOK_UNKNOWN_ERROR = new GuardianErrorCodes(
        GuardianErrorCodes.WebhookUnknownError,
        'Unknown Error from Webhook Call',
        'WEBHOOK_UNKNOWN_ERROR'
    );   
    
    static readonly STATE_NOT_ALLLOWED_FOR_AADHAR = new GuardianErrorCodes(
        GuardianErrorCodes.StateNotAllowedForAadharError,
        'Unknown Error from Webhook Call',
        'WEBHOOK_UNKNOWN_ERROR'
    );   
    static readonly MAX_ALLOWED_KYC_LIMIT_EXCEEDED = new GuardianErrorCodes(
        GuardianErrorCodes.MaxAllowedKycLimitExceededError,
        'User has reached max number of Kyc Attempts',
        'MAX_ALLOWED_KYC_LIMIT_EXCEEDED'
    );  
    
    static readonly FACE_NOT_DETECTED_ON_DOCUMENT = new GuardianErrorCodes(
        GuardianErrorCodes.FaceNotDetected,
        'Face is not detected',
        'FACE_NOT_DETECTED_ON_DOCUMENT'
    ); 
    
    static readonly PROVIDED_SCANNED_COPY_DOCUMENT = new GuardianErrorCodes(
        GuardianErrorCodes.ProvidedScannedCopy,
        'Provided document is a scanned copy',
        'PROVIDED_SCANNED_COPY_DOCUMENT'
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

export default GuardianErrorCodes;
