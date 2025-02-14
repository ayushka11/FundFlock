import { RoomType } from './enums/room-type';
import { ILocationDetails } from './planet/response';

export interface ReserveSeatDetails {
  roomId: string;
  seatId: number
  vendorId: number;
  locationDetails: ILocationDetails;
  roomType: RoomType;
  tableId?: number;
  clientIpAddress: string;
  deviceInfo: any;
  appType: string;
}
