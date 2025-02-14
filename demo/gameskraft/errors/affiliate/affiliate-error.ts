import AffiliateErrorCodes from './affiliate-error-codes';
import ServiceError from '../service-error';


class AffiliateServiceError extends ServiceError {
    static readonly INTERNAL_SERVER_ERROR = AffiliateServiceError.get(
        AffiliateErrorCodes.RUNTIME_ERROR,
    );

	static readonly AFFILIATE_DOES_NOT_EXIST = AffiliateServiceError.get(
		AffiliateErrorCodes.AFFILIATE_DOES_NOT_EXIST,
	);

	static readonly AFFILIATE_EMAIL_NOT_FOUND = AffiliateServiceError.get(
		AffiliateErrorCodes.AFFILIATE_EMAIL_NOT_FOUND,
	);

    constructor(public name: string, public code: number, public message: any, public type: any) {
		super(name, code, message, type);
	}

	public static get(errorDetails: AffiliateErrorCodes): AffiliateServiceError {
		return new AffiliateServiceError(
			errorDetails.name,
			errorDetails.code,
			errorDetails.message,
            errorDetails.type || 'AffiliateServiceError',
		);
	}
}

export default AffiliateServiceError;