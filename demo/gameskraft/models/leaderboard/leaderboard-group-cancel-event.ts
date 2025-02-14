export interface LeaderboardGroupCancellationEvent {
    data: LeaderboardCancellationEventData,
    eventName: string,
    id: number,
    requestId: string,
    leaderboardId: number,
}


export interface CancellationLeaderboard {
    id: number;
    startTime: number;
    endTime: number;
    claimStartTime: number;
    claimEndTime: number;
    boosters: any[];
    status: string;
}

export interface LeaderboardCancellationEventData{
    id: number;
    showTime: number;
    startTime: number;
    endTime: number;
    joinStartTime: number;
    joinEndTime: number;
    configId: number;
    status: string;
    meta: object;
    description: string;
    leaderboards: CancellationLeaderboard[];
    createdAt: string;
    updatedAt: string;
}