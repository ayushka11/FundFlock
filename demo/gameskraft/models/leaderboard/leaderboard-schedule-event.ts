export interface LeaderboardScheduledEvent{
        data: {
            id: number;
            tag: string;
            categories: string[];
            status: string;
            child_leaderboards: ChildLeaderboardSchedulingDetails[];
            start_time: string;
            end_time: string;
        };
        requestId: string;
        eventName: string;
        leaderboardId: number;
        id: string;
}
export interface ChildLeaderboardSchedulingDetails {
    id: number;
    status: string;
    starttime: string;
    endtime: string;
    claimstarttime: string;
    claimendtime: string;
    boosters: any[];
}
