import leaderboardErrorCodes from './leaderboard-error-codes';
import ServiceErrorUtil from '../service-error-util';
import LeaderboardServiceError from './leaderboard-error';

class LeaderboardServiceErrorUtil extends ServiceErrorUtil {
    public static getRuntimeError(): LeaderboardServiceError {
		return LeaderboardServiceError.get(leaderboardErrorCodes.RUNTIME_ERROR);
	}
	public static getLeaderboardDoesNotExistsError(): LeaderboardServiceError {
		return LeaderboardServiceError.get(leaderboardErrorCodes.LEADERBOARD_DOES_NOT_EXISTS);
	}

    public static getLeaderboardCampaignDoesNotExists(): LeaderboardServiceError {
		return LeaderboardServiceError.get(leaderboardErrorCodes.LEADERBOARD_CAMPAIGN_DOES_NOT_EXISTS);
	}
    public static getLeaderboardCampaignCanNotUpdated(): LeaderboardServiceError {
		return LeaderboardServiceError.get(leaderboardErrorCodes.LEADERBOARD_CAMPAIGN_CANNOT_UPDATED);
	}

	public static wrapError(error: any): LeaderboardServiceError {
		return LeaderboardServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `RoyaltyError:${error.type}`,
        })
	}
}

export default LeaderboardServiceErrorUtil;
