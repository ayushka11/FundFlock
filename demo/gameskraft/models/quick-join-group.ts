import AriesUtil from '../utils/aries-util';
import Parser from '../utils/parser';
import { QuickJoinGroupResponse } from './aries/quick-join-group';
import { TableDetails, Ticket, Wallet } from './reserve-room';

export class QuickJoinGroup {
    tableId: string;
    groupId: number;
    roomId: number;
    wallet: Wallet;
    tableDetails: TableDetails;
    ticketDetails: Ticket;
    seatId?: number;
    migratedRoom: boolean;

    static convertAriesResponse(quickJoinResponse: QuickJoinGroupResponse): QuickJoinGroup {
        const quickJoinGroup = new QuickJoinGroup();
        if (quickJoinResponse?.tableId) {
            quickJoinGroup.tableId = quickJoinResponse.tableId
        }
        if (quickJoinResponse?.groupId) {
            quickJoinGroup.groupId = quickJoinResponse.groupId
        }
        if (quickJoinResponse?.roomId) {
            quickJoinGroup.roomId = Parser.parseNumber(quickJoinResponse.roomId);
        }
        if (quickJoinResponse?.userBalance) {
            quickJoinGroup.wallet = AriesUtil.getWalletBalanceDetails(quickJoinResponse?.userBalance);
        }
        quickJoinGroup.tableDetails = AriesUtil.getTableDetailsFromReserveResponse(quickJoinResponse)
        quickJoinGroup.migratedRoom = true;
        return quickJoinGroup
    }

}
