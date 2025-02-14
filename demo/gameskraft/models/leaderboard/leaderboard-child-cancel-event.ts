import { ChildLeaderboardSchedulingDetails } from "./leaderboard-schedule-event";

export interface LeaderboardChildCancellationEvent {
    data: ChildLeaderboardSchedulingDetails,
    eventName: string,
    id: number,
    requestId: string,
    leaderboardId: number,
    childLbId: number
}




