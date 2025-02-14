class ReferralErrorCodes {

    private static BaseErrorCode = 80_000;
    static RuntimeError = ReferralErrorCodes.BaseErrorCode;
	static InvalidRefereeFilter = ReferralErrorCodes.BaseErrorCode + 5;

    static readonly RUNTIME_ERROR = new ReferralErrorCodes(
		ReferralErrorCodes.RuntimeError,
		'Something went wrong',
		'APPLICATION_RUNTIME_ERROR',
	);

	static readonly INVALID_REFEREE_FILTER = new ReferralErrorCodes(
		ReferralErrorCodes.InvalidRefereeFilter,
		'Referee Filter provided is Invalid',
		'INVALID_REFEREE_FILTER'
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
};

export default ReferralErrorCodes;