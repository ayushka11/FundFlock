import AffiliateServiceError from './affiliate-error';
import ServiceErrorUtil from '../service-error-util';

class AffiliateServiceErrorUtil extends ServiceErrorUtil {
    public static getRuntimeError(): AffiliateServiceError {
        return AffiliateServiceError.INTERNAL_SERVER_ERROR;
    }

    public static getAffiliateDoesNotExistError(): AffiliateServiceError {
        return AffiliateServiceError.AFFILIATE_DOES_NOT_EXIST;
    }

    public static getAffiliateEmailNotFoundError(): AffiliateServiceError {
        return AffiliateServiceError.AFFILIATE_EMAIL_NOT_FOUND;
    }

    public static wrapError(error: any): AffiliateServiceError {
        return AffiliateServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `AffiliateError:${error.type}`,
        })
    }
}

export default AffiliateServiceErrorUtil;
