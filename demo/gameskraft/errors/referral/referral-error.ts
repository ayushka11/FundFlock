import ServiceError from "../service-error";
import ReferralErrorCodes from "./referral-error-codes";


class ReferralServiceError extends ServiceError {

    static readonly INTERNAL_SERVER_ERROR = ReferralServiceError.get(
        ReferralErrorCodes.RUNTIME_ERROR,
    );

    constructor(public name: string, public code: number, public message: any, public type: any) {
		super(name, code, message, type);
	}

    public static get(errorDetails: ReferralErrorCodes): ReferralServiceError {
		return new ReferralServiceError(
			errorDetails.name,
			errorDetails.code,
			errorDetails.message,
            errorDetails.type || 'ReferralServiceError',
		);
	}
};

export default ReferralServiceError;