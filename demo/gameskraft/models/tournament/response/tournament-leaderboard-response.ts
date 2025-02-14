export default interface TournamentLeaderboardResponse {
    myRank?: number;
    leaderboardRanks?: TournamentLeaderboardRank[]
}

export interface TournamentLeaderboardRank {
    rank: number; 
    userName: string;
    stackAmount: number;
}