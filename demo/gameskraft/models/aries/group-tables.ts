export interface GroupTables {
    tableId?: number;
    roomId?: number;
    bigBlind?: number;
    smallBlind?: number;
    minBuyIn?: number;
    maxBuyIn?: number;
    gameType?: number;
    gameVariant?: string;
    ritActive?: boolean;
    isTurbo?: boolean;
    isTenBB?: boolean;
    maxSeats?: number;
    averageStack?: number;
    averagePot?: number;
    noOfPlayers?: number;
    playerIds?: number[];
    userFilter?: number[];
}
