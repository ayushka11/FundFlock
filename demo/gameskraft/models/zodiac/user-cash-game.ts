export interface RoomInfo {
    bigBlind: number;
    lastBuyInAmount: number;
    lastJoinedTime: string;
    maxBuyIn: number;
    minBuyIn: number;
    roomId: string;
    roomJoinCount: number;
    smallBlind: number;
    tableId: string;
    utilizedCashGameTicket: boolean;
}

export interface UserCashGames {
    userId?: string;
    createdAt?: string;
    updatedAt?: string;
    rooms?: Array<RoomInfo>
}