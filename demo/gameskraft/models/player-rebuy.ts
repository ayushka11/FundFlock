import { RebuyResponse as AriesRebuyResponse } from './aries/rebuy-response';
import {PlayerTopupRequestResponse} from "./game-server/player-topup-request";

export class PlayerRebuy {
    seatId: number;
    message: string;
    transactionId?: number;
    tableId?: string;
    rebuyAmount?: number;

    static convertGsResponse(playerTopupRequest: PlayerTopupRequestResponse, tableId: string): PlayerRebuy {
        const playerTopup = new PlayerRebuy();
        playerTopup.seatId = playerTopupRequest?.seatId ? playerTopupRequest?.seatId : -1;
        playerTopup.message = playerTopupRequest?.data
        playerTopup.tableId = tableId;

        return playerTopup;
    }

    static convertAriesResponse(playerRebuyResponse: AriesRebuyResponse, tableId: string): PlayerRebuy {
        const playerTopup = new PlayerRebuy();
        playerTopup.seatId = playerRebuyResponse?.seatId ? playerRebuyResponse?.seatId : -1;
        playerTopup.message = playerRebuyResponse?.message
        playerTopup.tableId = tableId;

        return playerTopup;
    }
}
