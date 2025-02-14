import RegosErrorCodes from './regos-error-codes';
import ServiceError from '../service-error';

class RegosServiceError extends ServiceError {
   
    constructor(public name: string, public code: number, public message: any, public type: any) {
        super(name, code, message, type);
    }

    public static get(errorDetails: RegosErrorCodes): RegosServiceError {
        return new RegosServiceError(
            errorDetails.name,
            errorDetails.code,
            errorDetails.message,
            errorDetails.type || 'PromosServiceError',
        );
    }
}

export default RegosServiceError;