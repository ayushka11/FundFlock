import ConcordiaErrorCodes from './concordia-error-codes';
import ServiceError from '../service-error';

class ConcordiaServiceError extends ServiceError {
    constructor(public name: string, public code: number, public message: any, public type: any) {
        super(name, code, message, type);
    }

    public static get(errorDetails: ConcordiaErrorCodes): ConcordiaServiceError {
        return new ConcordiaServiceError(
            errorDetails.name,
            errorDetails.code,
            errorDetails.message,
            errorDetails.type || 'ConcordiaServiceError',
        );
    }
}

export default ConcordiaServiceError;
