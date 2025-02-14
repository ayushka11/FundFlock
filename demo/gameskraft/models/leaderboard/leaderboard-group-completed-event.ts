import { ChildLeaderboardSchedulingDetails } from "./leaderboard-schedule-event";

export interface LeaderboardGroupCompletedEvent {
    data: LeaderboardGroupCompletedData;
    requestId: string;
    eventName: string;
    leaderboardId: number;
    id: string;
}


interface LeaderboardGroupCompletedData {
    id: number;
    tag: string;
    categories: string[];
    status: string;
    child_leaderboards: ChildLeaderboardSchedulingDetails[];
    start_time: string;
    end_time: string;
}

