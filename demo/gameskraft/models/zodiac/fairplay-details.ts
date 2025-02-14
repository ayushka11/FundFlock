export interface UserFairplayDetailsResponse {
    user_id: number;
    fairplay_config: UserFairplayDetails;
}

export interface UserFairplayDetails {
    instant_withdrawal_allowed: boolean;
}