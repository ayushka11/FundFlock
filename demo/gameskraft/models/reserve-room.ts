import GsUtil from "../utils/gs-util";
import { CashPopupKeyValue, ReserveRoomResponse as GsReserveRoomResponse } from "./game-server/reserve-room";
import { ReserveRoomResponse as AriesReserveRoomResponse } from "./aries/reserve-room";
import AriesUtil from "../utils/aries-util";

export interface Wallet {
    deposit?: number,
    winning?: number,
    real?: number,
    total?: number
}

export interface Ticket {
    isTicketActive: boolean;
    ticketBalance: number
    ticketMax: number
    ticketMin: number
}

export interface TableDetails {
    maxBuyInAmount?: number
    minBuyInAmount?: number
    antiBankingDuration?: number;
    timerDuration?: number;
    practice?: boolean;
    smallBlindAmount?: number
    bigBlindAmount?: number
    gameType?: number
    gameVariant?: string,
    IsRIT?: boolean,
}

export class ReserveRoom {
    tableId: string;
    wallet: Wallet;
    tableDetails: TableDetails;
    ticketDetails: Ticket;
    seatId?: number;

    static convertGsResponse(reserveRoomResponse: GsReserveRoomResponse): ReserveRoom {
        const reserveRoom = new ReserveRoom();
        if (reserveRoomResponse?.table_id) {
            reserveRoom.tableId = reserveRoomResponse.table_id
        }
        if (reserveRoomResponse?.kv) {
            if (reserveRoomResponse?.kv?.primary) {
                const walletData: CashPopupKeyValue = reserveRoomResponse?.kv;
                reserveRoom.wallet = GsUtil.getWalletBalanceDetails(walletData);
            }
        }
        if (reserveRoomResponse?.max) {
            reserveRoom.tableDetails = GsUtil.getTableDetailsFromResponse(reserveRoomResponse)
            reserveRoom.ticketDetails = {
                isTicketActive: reserveRoomResponse?.ticket_active,
                ticketBalance: reserveRoomResponse?.ticket_balance,
                ticketMax: reserveRoomResponse?.ticket_max,
                ticketMin: reserveRoomResponse?.ticket_min
            }
        }
        return reserveRoom
    }

    static convertAriesResponse(reserveRoomResponse: AriesReserveRoomResponse): ReserveRoom {
        const reserveRoom = new ReserveRoom();
        if (reserveRoomResponse?.tableId) {
            reserveRoom.tableId = reserveRoomResponse.tableId
        }
        if (reserveRoomResponse?.userBalance) {
            reserveRoom.wallet = AriesUtil.getWalletBalanceDetails(reserveRoomResponse?.userBalance);
        }
        reserveRoom.tableDetails = AriesUtil.getTableDetailsFromReserveResponse(reserveRoomResponse)
        return reserveRoom
    }

}

