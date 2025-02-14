import RegosServiceError from './regos-error';
import RegosErrorCodes from './regos-error-codes';
import ServiceErrorUtil from '../service-error-util';

class RegosServiceErrorUtil extends ServiceErrorUtil {
    public static getRuntimeError(): RegosServiceError {
        return RegosServiceError.get(RegosErrorCodes.RUNTIME_ERROR);
    }

    public static getError(error: Error): RegosServiceError {
        if (!(error instanceof RegosServiceError)) {
            return this.getRuntimeError();
        }
        return error;
    }

    public static wrapError(error: any): RegosServiceError {
        return RegosServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `regosServiceError:${error.type}`,
        })
    }
}

export default RegosServiceErrorUtil;