export enum userKycDocumentType {
    PAN = 1,
    BANK = 2,
    UPI =  3,
    AADHAR = 4,
    VOTER = 5,
    DL = 6
}

export enum userKycData {
    LITE = 'LITE',
    NORMAL = 'NORMAL'
}

export enum userKycDocumentStatus {
    SUBMITTED = 1,
    MANUAL_REVIEW = 2,
    VERIFIED = 3,
    REJECTED = 4
}
