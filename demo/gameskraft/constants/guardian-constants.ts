export const GUARDIAN_DOCUMENT_TRANSAFORMATION_KEYS = {
    documentType: 'documentType'
}

export const GUARDIAN_DOCUMENT_TYPE = {
    PAN: 1,
    BANK: 2,
    UPI: 3,
    AADHAR: 4,
    VOTER: 5,
    DL: 6
};

export const GUARDIAN_DOCUMENT_STATUS = {
    SUBMITTED: 1,
    MANUAL_REVIEW: 2,
    VERIFIED: 4,
    REJECTED: 5,
};

export const GUARDIAN_DOCUMENT_STATUS_FOR_EVENTS = {
    1: "SUBMITTED",
    2: "MANUAL_REVIEW",
    4: "VERIFIED",
    5: "REJECTED"
}

export const GUARDIAN_DOCUMENT_METHOD = {
    PAN: "pan",
    BANK: "bank",
    UPI: "upi",
    AADHAR_LITE: "aadhar_lite",
    DIGILOCKER_AADHAR: "digilocker_aadhar",
    DL: "driving_license"
};

export const GUARDIAN_KYC_CONFIG_RULE = {
    NEW_USER: 5,
};

export const GUARDIAN_SORT_DATA_CONFIG = {
    ASC: 0,
    DESC: 1,
};

export const GUARDIAN_DOCUMENT_NAME = {
    1: 'pan',
    2: 'bank',
    3: 'upi',
    4: 'aadhar',
    5: 'voter',
    6: 'dl'
};


export const GUARDIAN_KYC_VALIDATOR = {
    0: 'manual',
    1: 'auto',

};

export const GUARDIAN_REQUEST_PARAM = {
    RETRY_ATTEMPT_PARAM: 'retry',
    DOCUMENT_TYPE: 'docType',
    USER_KYC_DATA: 'userKycData',
    DOCUMENT_STATUS: 'documentStatus',
    VENDOR:'vendor'
};

export const USER_KYC_DATA = {
    LITE: 'lite',
    NORMAL: 'normal'
};

export const GUARDIAN_DOCUMENT_STATUS_CHANGE_REASON = {
    0: "Default Status",
    50: "Invalid Document Number",
    51: "Invalid Request",
    52: "Invalid Request Field Missing",
    53: "Invalid Request Field Invalid",
    54: "Invalid Request File Missing",
    55: "Verification has already started",
    56: "Same details already verified for the user",
    57: "Same details already verified for another user",
    58: "Document kyc already done",
    59: "Prerequisite document not verified",
    60: "Task document deleted",
    61: "Consent not given for document",
    62: "Document not uploaded",
    1: "AUTO KYC Verification",
    2: "Verified by Ops Team",
    3: "Unknown Reason",
    101: "Image is not clear",
    102: "Image is not accessible",
    103: "Extraction Failure",
    104: "Image Url is not accessible",
    105: "Error from Partner Service",
    106: "Insufficient Balance for Idfy",
    107: "Not an original document",
    108: "Mismatch between details submitted by user and extracted details from image",
    109: "Mismatch between details submitted by user and details fetched from source",
    110: "Mismatch between extracted details from image and details fetched from source",
    111: "Registered KYC name is different from given in request",
    112: "Insufficient balance in Cashfree Account",
    113: "Invalid input fields",
    114: "Partner Client Error",
    115: "Same Document Already Exists for Another User",
    116: "User can be a fraud user",
    117: "Invalid File Format",
    118: "Source Details Not Found",
    119: "Extraction Failure",
    120: "Verification has timed out.",
    121: "Access to document has been denied",
    122: "Happens when we try to open link for digilocker after its expiry",
    123: "Extraction for document has failed",
    124: "Same document already exists for user",
    125: "Pending at partner verification timeout",
    126: "Partner source is down",
    127: "The verification failed due to timeout on partner",
    201: "Image is not a valid PAN",
    202: "Minor Dob Pan",
    203: "Pan type is not individual",
    204: "Pan Number Mismatched",
    205: "Pan DOB Mismatched",
    206: "Pan Id not found in nsdl db",
    207: "Details required for pan verification not found on pan source",
    208: "Pan image is tampered (Not Live)",
    301: "Bank is banned currently",
    302: "Consent Not Provided for Digital Bank",
    303: "Ifsc is from Banned State",
    304: "Source Error",
    305: "Invalid Bank Account",
    306: "Invalid Ifsc",
    307: "Bank Account is blocked",
    308: "Bank Account closed",
    309: "Bank Account Number Mismatch",
    310: "Bank Account IFSC Mismatch",
    311: "Name Not Found during Pennydrop",
    312: "Razorpay insufficient balance",
    313: "The account is a non resident external account",
    315: "The client bank account does not support imps or is not enabled",
    318: "Suspicious Transactions Detected",
    319: "Ongoing concurrent request for same bankAccount and ifsc",
    401: "Upi is banned currently",
    402: "Consent Not Provided for UPI",
    403: "Invalid UPI",
    404: "NPCI is currently unavailable",
    405: "Validation Not Enabled",
    406: "Name not found during upi verification",
    450: "Image Not Voter Id",
    451: "Invalid Voter ID",
    452: "Voter Id from banned state",
    453: "Voter Id of Minor Person",
    454: "Voter Id State from input and source do not match",
    455: "Details not found on voter source",
    470: "Image is not of aadhar",
    471: "Aadhar ID provided is invalid",
    472: "Aadhar ID provided does not exists",
    475: "Aadhar belongs to a minor person",
    476: "Aadhar Id from banned state",
    477: "State from input and aadhar do not match",
    478: "Comes when input state not present while verification",
    479: "Details not found on aadhar source",
    480: "Pan and Aadhar not linked",
    481: "Pan and Aadhar linking api failed",
    482: "Aadhar lite api failed",
    483: "Aadhar verification failed",
    485: "Image is not a driving license",
    486: "Invalid DL",
    487: "Minor DOB Driving License",
    488: "Driving License from banned state",
    489: "Input Source Driving License State Mismatch",
    490: "Driving License not found on the source",
    491: "Driving License validity is expired",
    492: "Driving License address is null",
    493: "Driving License validity could not be obtained",
    494: "Driving License name not found",
    495: "Driving License state not found",
    496: "Driving License dob not found",
    602: "Pan Number Already Exists",
    603: "DOB not visible",
    604: "Bank Number Already Exists",
    605: "Name at bank is NA",
    606: "Penny Drop Failed",
    607: "Name at Bank doesn't match with name on Voter",
    608: "Name at Bank doesn't match with name on Aadhar",
    609: "Name at Bank doesn't match with name on DL",
    610: "Name at Bank doesn't match with name at UPI",
    611: "UPI name at bank is NA", 
    612: "Voter Id Registered Name is NA",
    613: "Name on Voter doesn't match with the Registered Name",
    614: "Name on Voter doesn't match with name on Aadhar",
    615: "Voter Id is from Banned State",
    616: "Invalid Front or Back Image for Voter Id",
    617: "Name on Aadhar doesn't match with name on DL",
    618: "Aadhar Id Registered Name is NA",
    619: "Aadhar is from Banned State",
    314: "Rejected as bank account is currently offline",
    316: "Rejected as Bank name is Missing",
    317: "Rejected as bank account verification has failed",
    320: "Rejected as bank account verification has failed",
    322: "Rejected as bank account verification has failed"    
};