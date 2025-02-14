export default interface UserLeaderboardTotalEarnings{
    totalAmount: number,
    winnigBreakup: Array<UserLeaderboardWinningBreakup>
}

export interface UserLeaderboardWinningBreakup {
    currencyIdentifier: string,
    amount: number
}

export interface ZodiacUserLeaderboardTotalWinning{
    user_id: number,
    vendor_id: number,
    leaderboard_dc_segment_amount: number,
    leaderboard_winning_segment_amount: number,
}