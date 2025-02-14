import AriesUtil from "../utils/aries-util";
import { TableResultResponse } from "./aries/table-result";

export interface PlayerResult {
    userId?: number,
    userName: string,
    initialStackAmount: number,
    initialStackAmountInBB: string,
    winningStackAmount: number,
    winningStackAmountInBB: string,
    handsPlayed: number
}

export class TableResult {
    result: PlayerResult[]

    static convertAriesResponse(tableResultResponse: TableResultResponse, userId: string): TableResult {
        const tableResult = new TableResult();
        if (tableResultResponse?.result) {
            tableResult.result = AriesUtil.getPlayerResultFromResponse(tableResultResponse?.result, Number(userId));
        }
        return tableResult;
    }

}

