
class AuthErrorCodes {

    private static BaseErrorCode = 90000;
    static RuntimeError = AuthErrorCodes.BaseErrorCode + 1;
    static InternalServerError = AuthErrorCodes.BaseErrorCode + 2;
    static InvalidRequest = AuthErrorCodes.BaseErrorCode + 3;
    static InvalidOtp = AuthErrorCodes.BaseErrorCode + 4;
    static IncorrectPassword = AuthErrorCodes.BaseErrorCode + 5;
    static UserLoginBanned = AuthErrorCodes.BaseErrorCode + 6;

    static readonly RUNTIME_ERROR = new AuthErrorCodes(
        AuthErrorCodes.RuntimeError,
        'Something went wrong',
        'APPLICATION_RUNTIME_ERROR',
    );

    static readonly INTERNAL_SERVER_ERROR = new AuthErrorCodes(
        AuthErrorCodes.InternalServerError,
        'Something went wrong. Please try again later',
        'INTERNAL_SERVER_ERROR'
    );

    static readonly INVALID_REQUEST = new AuthErrorCodes(
        AuthErrorCodes.InvalidRequest,
        'Invalid Request',
        'INVALID_REQUEST',
    );

    static readonly INVALID_OTP = new AuthErrorCodes(
        AuthErrorCodes.InvalidOtp,
        'Invalid OTP',
        'INVALID_OTP',
    );

    static readonly INCORRECT_PASSWORD = new AuthErrorCodes(
      AuthErrorCodes.InvalidOtp,
      'Incorrect Password entered',
      'INCORRECT_PASSWORD',
    );

    static readonly  USER_LOGIN_BANNED = new AuthErrorCodes(
        AuthErrorCodes.UserLoginBanned,
      'Your account has been temporarily blocked. Please reach out to our support team for assistance.',
      'USER_ACCOUNT_BLOCKED',
    );

    private constructor(
        public code: number,
        public message: string,
        public name: string,
        public type?: string,
    ) {}
    toString(): string {
        return `${this.name}:${this.code}:${this.message}`;
    }

}

export default AuthErrorCodes;
