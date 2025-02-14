import CurrencyUtil from '../helpers/currency-util';
import { TopupResponse as AriesTopupResponse } from './aries/topup-response';
import { PlayerTopupRequestResponse } from "./game-server/player-topup-request";

export class PlayerTopup {
    seatId: number;
    message: string;
    transactionId?: number;
    tableId?: string;
    topupAmount?: number;

    static convertGsResponse(playerTopupRequest: PlayerTopupRequestResponse, tableId: string): PlayerTopup {
        const playerTopup = new PlayerTopup();
        playerTopup.seatId = playerTopupRequest?.seatId ? playerTopupRequest?.seatId : -1
        playerTopup.message = playerTopupRequest?.data
        playerTopup.tableId = tableId;
        return playerTopup;
    }

    static convertAriesResponse(topupResponse: AriesTopupResponse): PlayerTopup {
        const playerTopup = new PlayerTopup();
        playerTopup.seatId = topupResponse?.seatId ?? -1;
        playerTopup.topupAmount = CurrencyUtil.getAmountInRupee(topupResponse?.topupAmount ?? 0);
        playerTopup.message = topupResponse.message;
        return playerTopup
    }
}
