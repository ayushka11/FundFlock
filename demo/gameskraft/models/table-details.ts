import { GroupTables } from "./aries/group-tables";
import { RoomType } from "./enums/room-type";

export class TableDetails {
    id: number;
    roomId: number;
    smallBlindAmount: number;
    bigBlindAmount: number;
    minBuyInAmount: number;
    maxBuyInAmount: number;
    gameType: number;
    gameVariant: string;
    isPractice: boolean;
    ritActive: boolean;
    isTurbo: boolean;
    isTenBB?: boolean;
    maxSeats: number;
    averageStack: number;
    averagePot: number;
    playerCount: number;
    migratedRoom: boolean;
    playerIds: number[];


    static convertAriesResponse(resp: GroupTables): TableDetails {
        const tableDetails: TableDetails = new TableDetails();
        tableDetails.id = resp?.tableId ? resp?.tableId : 0;
        tableDetails.roomId = resp?.roomId ? resp?.roomId : 0;
        tableDetails.smallBlindAmount = resp?.smallBlind ? resp?.smallBlind : 0;
        tableDetails.bigBlindAmount = resp?.bigBlind ? resp?.bigBlind : 0;
        tableDetails.minBuyInAmount = resp?.minBuyIn ? resp?.minBuyIn : 0;
        tableDetails.maxBuyInAmount = resp?.maxBuyIn ? resp?.maxBuyIn : 0;
        tableDetails.gameType = resp?.gameType ? resp?.gameType : -1;
        tableDetails.gameVariant = resp?.gameVariant ? resp?.gameVariant : "";
        tableDetails.isPractice = resp?.gameType == RoomType.PRACTICE;
        tableDetails.ritActive = resp?.ritActive ? resp?.ritActive : false;
        tableDetails.isTurbo = resp?.isTurbo ? resp?.isTurbo : false;
        tableDetails.maxSeats = resp?.maxSeats ? resp?.maxSeats : 0;
        tableDetails.averageStack = resp?.averageStack ? resp?.averageStack : 0;
        tableDetails.averagePot = resp?.averagePot ? resp?.averagePot : 0;
        tableDetails.playerCount = resp?.noOfPlayers ? resp?.noOfPlayers : 0;
        tableDetails.migratedRoom = true;
        tableDetails.isTenBB = resp?.isTenBB;
        tableDetails.playerIds = (resp?.playerIds || []).map(id => Number(id));
        return tableDetails;
    }
}
