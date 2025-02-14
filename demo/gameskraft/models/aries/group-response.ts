export interface GroupResponse {
    id?: number;
    name?: string;
    bigBlind?: number;
    smallBlind?: number;
    minBuyIn?: number;
    maxBuyIn?: number;
    gameType?: number;
    gameVariant?: string;
    status?: number;
    noOfPlayers?: number;
    isQuickJoinEnabled?: boolean;
}