import ServiceError from "../service-error";
import AuthErrorCodes from "./auth-error-codes";

class AuthServiceError extends ServiceError{

    static readonly RUNTIME_ERROR = AuthServiceError.get(
        AuthErrorCodes.RUNTIME_ERROR,
    );

    static readonly INTERNAL_SERVER_ERROR = AuthServiceError.get(
        AuthErrorCodes.INTERNAL_SERVER_ERROR,
    );

    static readonly INVALID_REQUEST = AuthServiceError.get(
        AuthErrorCodes.INVALID_REQUEST,
    );

    static readonly INVALID_OTP = AuthServiceError.get(
        AuthErrorCodes.INVALID_OTP,
    );

    static readonly INCORRECT_PASSWORD = AuthServiceError.get(
      AuthErrorCodes.INCORRECT_PASSWORD,
    );

    static readonly  USER_LOGIN_BANNED = AuthServiceError.get(
        AuthErrorCodes.USER_LOGIN_BANNED,
    );

    constructor(public name: string, public code: number, public message: any, public type: any) {
        super(name, code, message, type);
    }

    public static get(errorDetails: AuthErrorCodes): AuthServiceError {
        return new AuthServiceError(
            errorDetails.name,
            errorDetails.code,
            errorDetails.message,
            errorDetails.type || 'AuthServiceError',
        );
    }
}

export default AuthServiceError;
