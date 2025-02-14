import { RoomType } from './enums/room-type';
import { ILocationDetails } from './planet/response';

export interface QuickJoinGroupDetails {
  groupId: number;
  vendorId: number;
  locationDetails: ILocationDetails;
  tableId?: number;
  clientIpAddress: string;
  deviceInfo: any;
  isPractice: boolean;
  appType: string;
}
