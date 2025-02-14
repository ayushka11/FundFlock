
export interface RoomResponse {
    roomId?: string;
    groupId?: number;
    name?: string;
    bigBlind?: number;
    smallBlind?: number;
    maxSeatsPerTable?: number;
    minBuyIn?: number;
    maxBuyIn?: number;
    gameType?: number;
    gameVariant?: string;
    ritActive?: boolean;
    anonymousMode?: boolean;
    potOfGoldActive?: boolean;
    evChopActive?: boolean;
    domainFilter?: Array<number>;
    userFilter?: Array<number>;
    noOfPlayers?: number;
    allowSeatSelection?: boolean;
    isPrimary?: boolean;
}
