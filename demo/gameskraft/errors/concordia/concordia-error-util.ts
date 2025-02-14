import ServiceErrorUtil from '../service-error-util';
import ConcordiaServiceError from './concordia-error';
import ConcordiaErrorCodes from './concordia-error-codes';

class ConcordiaServiceErrorUtil extends ServiceErrorUtil {
    public static getRuntimeError(): ConcordiaServiceError {
        return ConcordiaServiceError.get(ConcordiaErrorCodes.RUNTIME_ERROR);
    }

    public static getError(error: Error): ConcordiaServiceError {
        if (!(error instanceof ConcordiaServiceError)) {
            return this.getRuntimeError();
        }
        return error;
    }
    

    public static wrapError(error: any): ConcordiaServiceError {
        return ConcordiaServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `ConcordiaServiceError:${error.type}`,
        })
    }
}

export default ConcordiaServiceErrorUtil;
