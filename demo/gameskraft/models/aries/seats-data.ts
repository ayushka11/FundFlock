import PlayerConnectionStatus from '../enums/player-connection-status';
import PlayerGameStatus from '../enums/player-game-status';
import TableSeatStatus from '../enums/table-seat-status';

export interface SeatData {
  seatId: number;
  userId?: number;
  userName?: string;
  vendorId?: number;
  stackValue?: number;
  stackValueInBB?: string;
  playerActionType?: string;
  playerActionName?: string;
  seatStatusName?: string;
  seatStatusType?: TableSeatStatus;
  gameStatusName?: string;
  gameStatusType?: PlayerGameStatus;
  connectionStatusName?: string;
  connectionStatusType?: PlayerConnectionStatus;
  turnBankTimer?: number;
  disconnectTimer?: number;
  userAvatar?: string;
}

export type SeatsData =  Array<SeatData>;
