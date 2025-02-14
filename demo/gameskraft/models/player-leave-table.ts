import {PlayerLeaveTableResponse} from "./game-server/player-leave-table";
import { PlayerLeaveTableResponse as AriesPlayerLeaveTableResponse } from "./aries/leave-table";

export class PlayerLeaveTable {
    tableId: string;
    seatId: number;

    static convertGsResponse(response: PlayerLeaveTableResponse, tableId: string) {
        const playerLeaveTable: PlayerLeaveTable = new PlayerLeaveTable();
        playerLeaveTable.seatId = response?.seatId ?? -1
        playerLeaveTable.tableId = tableId
        return playerLeaveTable;
    }

    static convertAriesResponse(response: AriesPlayerLeaveTableResponse, tableId: string) {
        const playerLeaveTable: PlayerLeaveTable = new PlayerLeaveTable();
        playerLeaveTable.seatId = response?.seatId ?? -1
        playerLeaveTable.tableId = tableId
        return playerLeaveTable;
    }
}