class LeaderboardErrorCodes {

    private static BaseErrorCode = 190000;
    static RuntimeError = LeaderboardErrorCodes.BaseErrorCode + 1;

	// ROYALTY ERRORS
	static LeaderboardDoesNotExists = LeaderboardErrorCodes.BaseErrorCode + 2

	static LeaderboardCampaignDoesNotExists = LeaderboardErrorCodes.BaseErrorCode + 3

	static LeaderboardCampaignCannotBeUpdated = LeaderboardErrorCodes.BaseErrorCode + 4

    static readonly RUNTIME_ERROR = new LeaderboardErrorCodes(
		LeaderboardErrorCodes.RuntimeError,
		'Something went wrong',
		'APPLICATION_RUNTIME_ERROR',
	);

	static readonly LEADERBOARD_DOES_NOT_EXISTS = new LeaderboardErrorCodes(
		LeaderboardErrorCodes.LeaderboardDoesNotExists,
		'Leaderboard does not exists',
		'LEADERBOARD_DOESNOT_EXISTS',
	);

	static readonly LEADERBOARD_CAMPAIGN_DOES_NOT_EXISTS = new LeaderboardErrorCodes(
		LeaderboardErrorCodes.LeaderboardDoesNotExists,
		'Leaderboard Campaign does not exists',
		'LEADERBOARD_CAMPAIGN_DOES_NOT_EXISTS',
	);

	static readonly LEADERBOARD_CAMPAIGN_CANNOT_UPDATED = new LeaderboardErrorCodes(
		LeaderboardErrorCodes.LeaderboardCampaignCannotBeUpdated,
		'Leaderboard Campaign can not updated',
		'LEADERBOARD_CAMPAIGN_CANNOT_UPDATED',
	);


	// private to disallow creating other instances of this type
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

export default LeaderboardErrorCodes;
