import { Room } from '../room';

export interface GetRecommendedRoomsRequest {
  activeRoomsInfo: Room[];
  firstDepositAmount: number;
}
