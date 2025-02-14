import PromosErrorCodes from './promos-error-codes';
import ServiceError from '../service-error';

class PromosServiceError extends ServiceError {
   
    constructor(public name: string, public code: number, public message: any, public type: any) {
        super(name, code, message, type);
    }

    public static get(errorDetails: PromosErrorCodes): PromosServiceError {
        return new PromosServiceError(
            errorDetails.name,
            errorDetails.code,
            errorDetails.message,
            errorDetails.type || 'PromosServiceError',
        );
    }
}

export default PromosServiceError;
