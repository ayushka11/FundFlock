export interface UserWinningData {
    transactionId: string;
    transactionAmount: number;
    rank: number;
    score: number;
    rewardCode: string;
    tag: string;
    leaderboardId: string;
    childLeaderboardId: string;
    lbGroups: string;
    currencyCode: string;
    leaderboardInfo: string;
    categories: Array<string>,
    gameStakes: Array<string>,
    gameBlinds: Array<string>,
    gameVariants: Array<string>,
    leaderboardDate: string,
    hourRange: string,
    campaignName: string,
    tableIds?: Array<any>
}

export default interface LeaderboardWinningGratificationData{
    userId: number,
    userSettlementData: UserWinningData
}