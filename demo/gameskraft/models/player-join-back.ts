import GsUtil from "../utils/gs-util";
import {PlayerJoinBackResponse} from "./game-server/player-join-back";
import {CashPopupKeyValue} from "./game-server/reserve-room";
import {TableDetails, Ticket, Wallet} from "./reserve-room";
import {PlayerJoinBackResponse as AriesPlayerJoinBackResponse} from "./aries/join-back";

export class PlayerJoinBack {
    tableId: string;
    seatId: number;
    wallet: Wallet;
    tableDetails: TableDetails;
    ticketDetails: Ticket;

    static convertGsResponse(response: PlayerJoinBackResponse, tableId: string) {
        const playerJoinBack = new PlayerJoinBack();
        playerJoinBack.seatId = response?.seatId ?? -1
        playerJoinBack.tableId = tableId;
        if (response?.kv) {
            if (response?.kv?.primary) {
                const walletData: CashPopupKeyValue = response?.kv;
                playerJoinBack.wallet = GsUtil.getWalletBalanceDetails(walletData);
            }
        }
        if (response?.max) {
            playerJoinBack.tableDetails = GsUtil.getTableDetailsFromResponse(response)
            playerJoinBack.ticketDetails = {
                isTicketActive: response?.ticket_active,
                ticketBalance: response?.ticket_balance,
                ticketMax: response?.ticket_max,
                ticketMin: response?.ticket_min
            }
        }
        return playerJoinBack;
    }

    static convertAriesResponse(response: AriesPlayerJoinBackResponse) {
        const playerJoinBack = new PlayerJoinBack();
        playerJoinBack.tableId = response.tableId;
        return playerJoinBack;
    }
}