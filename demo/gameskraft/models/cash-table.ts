import {TableResponse} from "./game-server/TableResponse";
import { RoomTables } from "./aries/room-tables";

export class Table {
    id: string;
    tableIndex: number;
    averageStack: number;
    name: string;
    playerCount: number;

    static convertGsResponse(resp: TableResponse): Table {
        return {
            id: resp?.id,
            tableIndex: resp?.ix,
            averageStack: resp?.as,
            playerCount: resp?.pc,
            name: resp?.nm
        }
    }

    static convertAriesResponse(resp: RoomTables): Table {
        const table = new Table();
        table.id = `${resp?.tableId}`
        table.tableIndex = resp?.tableIndex;
        return table;
    }
}