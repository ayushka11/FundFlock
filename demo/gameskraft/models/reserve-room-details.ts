import { RoomType } from './enums/room-type';
import { ILocationDetails } from './planet/response';

export interface ReserveRoomDetails {
  roomId: string;
  vendorId: number;
  locationDetails: ILocationDetails;
  roomType: RoomType;
  tableId?: number;
  clientIpAddress: string;
  deviceInfo: any;
  appType?: string;
}
