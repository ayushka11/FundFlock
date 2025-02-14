import { User } from './user';

export interface TopupRequest {
  tableId: number,
  userId: number,
  amount: number,
}
