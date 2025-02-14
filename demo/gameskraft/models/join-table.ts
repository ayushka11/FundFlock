import {JoinTableResponse} from "./game-server/join-table";
import { JoinTableResponse as AriesJoinTableResponse } from "./aries/join-table";

export class JoinTable {
    seatId: number;
    tableId: string;
    stackSize: number;


    static convertGsResponse(response: JoinTableResponse) {
        const joinTable = new JoinTable();
        joinTable.seatId = response?.seatId ?? -1
        return joinTable
    }
    
    static convertAriesResponse(response: AriesJoinTableResponse) {
        const joinTable = new JoinTable();
        joinTable.seatId = response?.seatId ?? -1
        return joinTable
    }


}