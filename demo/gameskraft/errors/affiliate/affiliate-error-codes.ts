class AffiliateErrorCodes {

    private static BaseErrorCode = 190000;
    static RuntimeError = AffiliateErrorCodes.BaseErrorCode + 1;
    static AffiliateDoesNotExist = AffiliateErrorCodes.BaseErrorCode + 2


    static readonly RUNTIME_ERROR = new AffiliateErrorCodes(
        AffiliateErrorCodes.RuntimeError,
        'Something went wrong',
        'APPLICATION_RUNTIME_ERROR',
    );

    static readonly AFFILIATE_DOES_NOT_EXIST = new AffiliateErrorCodes(
        AffiliateErrorCodes.AffiliateDoesNotExist,
        'Affiliate does not exists',
        'AFFILIATE_DOES_NOT_EXIST',
    );

    static readonly AFFILIATE_EMAIL_NOT_FOUND = new AffiliateErrorCodes(
        AffiliateErrorCodes.AffiliateDoesNotExist,
        'Your email is not linked. Please go to profile section and link your email.',
        'AFFILIATE_EMAIL_NOT_FOUND',
    );

    // private to disallow creating other instances of this type
    private constructor(
        public code: number,
        public message: string,
        public name: string,
        public type?: string,
    ) {
    }

    toString(): string {
        return `${this.name}:${this.code}:${this.message}`;
    }
}

export default AffiliateErrorCodes;
