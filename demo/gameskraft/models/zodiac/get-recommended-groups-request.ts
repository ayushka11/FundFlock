import { Group } from '../group';

export interface GetRecommendedGroupsRequest {
  activeRoomsInfo: Group[];
  firstDepositAmount: number;
}
