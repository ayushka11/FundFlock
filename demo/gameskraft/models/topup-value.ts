import AriesUtil from '../utils/aries-util';
import GsUtil from "../utils/gs-util";
import { TopupDetailsResponse as AriesTopupDetailsResponse } from './aries/topup-details-response';
import { TopupValueKeyValue, TopupValueResponse as TopupValueResponse } from "./game-server/topup-values";

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
    gameVariant?: string
}

export class TopupValue {
    tableId: string;
    wallet: Wallet;
    tableDetails: TableDetails;
    ticketDetails: Ticket;
    seatId?: number;

    static convertGsResponse(response: TopupValueResponse, tableId: string): TopupValue {
        const topupValue: TopupValue = new TopupValue();
        topupValue.tableId = tableId
        if (response?.kv) {
            if (response?.kv?.primary) {
                const walletData: TopupValueKeyValue = response?.kv;
                topupValue.wallet = GsUtil.getWalletBalanceDetails(walletData);
            }
        }
        if (response?.max) {
            topupValue.tableDetails = GsUtil.getTableDetailsFromResponse(response)
            topupValue.ticketDetails = {
                isTicketActive: response?.ticket_active,
                ticketBalance: response?.ticket_balance,
                ticketMax: response?.ticket_max,
                ticketMin: response?.ticket_min
            }
        }
        return topupValue
    }

    static convertAriesResponse(topupDetailsResponse: AriesTopupDetailsResponse): TopupValue {
        const topupValue = new TopupValue();
        if (topupDetailsResponse?.tableId) {
            topupValue.tableId = topupDetailsResponse.tableId
        }
        if (topupDetailsResponse?.seatId) {
            topupValue.seatId = topupDetailsResponse.seatId
        }
        if (topupDetailsResponse?.userBalance) {
            topupValue.wallet = AriesUtil.getWalletBalanceDetails(topupDetailsResponse?.userBalance);
        }
        topupValue.tableDetails = AriesUtil.getTableDetailsFromTopupResponse(topupDetailsResponse)
        return topupValue
    }

}

