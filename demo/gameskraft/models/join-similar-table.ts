import AriesUtil from '../utils/aries-util';
import { JoinSimilarTableResponse } from './aries/join-similar-table-response';
import { ReserveRoomResponse as AriesReserveRoomResponse } from './aries/reserve-room';
import { ReserveSeatResponse } from './aries/reserve-seat';
import { TableDetails, Ticket, Wallet } from './reserve-room';

export class JoinSimilarTable {
  tableId: string;
  wallet: Wallet;
  tableDetails: TableDetails;
  ticketDetails: Ticket;
  seatId: number;

  static convertAriesResponse(reserveSeatResponse: JoinSimilarTableResponse): JoinSimilarTable {
    const reserveSeat = new JoinSimilarTable();
    if (reserveSeatResponse?.tableId) {
      reserveSeat.tableId = reserveSeatResponse.tableId
    }
    if (reserveSeatResponse?.userBalance) {
      reserveSeat.wallet = AriesUtil.getWalletBalanceDetails(reserveSeatResponse?.userBalance);
    }
    if(reserveSeatResponse?.seatId) {
      reserveSeat.seatId = reserveSeatResponse.seatId;
    }
    reserveSeat.tableDetails = AriesUtil.getTableDetailsFromReserveResponse(reserveSeatResponse)
    return reserveSeat
  }

}
