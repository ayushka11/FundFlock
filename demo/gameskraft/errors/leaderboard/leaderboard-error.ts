import LeaderboardErrorCodes from './leaderboard-error-codes';
import ServiceError from '../service-error';


class LeaderboardServiceError extends ServiceError {
    static readonly INTERNAL_SERVER_ERROR = LeaderboardServiceError.get(
        LeaderboardErrorCodes.RUNTIME_ERROR,
    );

	static readonly LEADERBOARD_DOES_NOT_EXISTS = LeaderboardServiceError.get(
		LeaderboardErrorCodes.LEADERBOARD_DOES_NOT_EXISTS,
	);

	static readonly LEADERBOARD_CAMPAIGN_DOES_NOT_EXISTS = LeaderboardServiceError.get(
		LeaderboardErrorCodes.LEADERBOARD_CAMPAIGN_DOES_NOT_EXISTS,
	);

	static readonly LEADERBOARD_CAMPAIGN_CANNOT_UPDATED = LeaderboardServiceError.get(
		LeaderboardErrorCodes.LEADERBOARD_CAMPAIGN_CANNOT_UPDATED,
	);

    constructor(public name: string, public code: number, public message: any, public type: any) {
		super(name, code, message, type);
	}

	public static get(errorDetails: LeaderboardErrorCodes): LeaderboardServiceError {
		return new LeaderboardServiceError(
			errorDetails.name,
			errorDetails.code,
			errorDetails.message,
            errorDetails.type || 'LeaderboardServiceError',
		);
	}
}

export default LeaderboardServiceError;