import ServiceErrorUtil from "../service-error-util";
import ReferralServiceError from "./referral-error";
import ReferralErrorCodes from "./referral-error-codes";


class ReferralServiceErrorUtil extends ServiceErrorUtil {

    public static getRuntimeError(): ReferralServiceError {
		    return ReferralServiceError.get(ReferralErrorCodes.RUNTIME_ERROR);
	  }

    public static getInvalidRefereeFilter(): ReferralServiceError {
        return ReferralServiceError.get(ReferralErrorCodes.INVALID_REFEREE_FILTER);
    }

    public static wrapError(error: any): ReferralServiceError {
        return ReferralServiceError.get({
          name: error.name,
          code: error.code,
          message: error.message,
          type: `ReferralError:${error.type}`,
        })
	  }
};

export default ReferralServiceErrorUtil;