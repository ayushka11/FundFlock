import PromosServiceError from './promos-error';
import PromosErrorCodes from './promos-error-codes';
import ServiceErrorUtil from '../service-error-util';

class PromosServiceErrorUtil extends ServiceErrorUtil {
    public static getRuntimeError(): PromosServiceError {
        return PromosServiceError.get(PromosErrorCodes.RUNTIME_ERROR);
    }

    public static getError(error: Error): PromosServiceError {
        if (!(error instanceof PromosServiceError)) {
            return this.getRuntimeError();
        }
        return error;
    }

    public static wrapError(error: any): PromosServiceError {
        return PromosServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `PromosServiceError:${error.type}`,
        })
    }
}

export default PromosServiceErrorUtil;
