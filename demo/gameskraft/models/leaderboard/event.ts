export interface LeaderboardStartedEvent {
    data: LeaderboardStartedData,
    eventName: string,
    id: number,
    requestId: string,
    leaderboardId: number,
    childLbId: number,
    tags: string,
    categories: Array<string>
}

export interface LeaderboardScoreUpdate {
    data: LeaderboardScoreUpdateData,
    eventName: string,
    id: number,
    requestId: string,
    leaderboardId: number,
    childLbId: number,
    userId: string
}

interface LeaderboardStartedData {
    id: number,
    startTime: number,
    endTime: number,
    claimStartTime: number,
    claimEndTime: number,
    boosters: Array<any>,
    status: string,
}

interface LeaderboardScoreUpdateData {
    currentScore: string,
    previousScore: string,
    currentRank: number,
    previousRank: number,
    tag: string,
    categories: Array<string>,
    userMeta: {vendorId?: string}
}