import serviceErrorUtil from "../service-error-util";
import AuthServiceError from "./auth-error";

class AuthServiceErrorUtil extends serviceErrorUtil{


    public static getRuntimeError(): AuthServiceError {
        return AuthServiceError.get(AuthServiceError.RUNTIME_ERROR);
    }

    public static getInvalidRequest(): AuthServiceError {
        return AuthServiceError.get(AuthServiceError.INVALID_REQUEST);
    }

    public static getInvalidOtp(): AuthServiceError {
        return AuthServiceError.get(AuthServiceError.INVALID_OTP);
    }

    public static getIncorrectPassword(): AuthServiceError {
        return AuthServiceError.INCORRECT_PASSWORD;
    }

    public static getUserLoginBanned(): AuthServiceError {
        return AuthServiceError.USER_LOGIN_BANNED;
    }

    public static getError(error: Error): AuthServiceError {
        if (!(error instanceof AuthServiceError)) {
            return this.getRuntimeError();
        }
        return error;
    }

    public static wrapError(error: any): AuthServiceError {
        return AuthServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `AuthServiceError:${error.type}`,
        })
    }
}

export default AuthServiceErrorUtil;
