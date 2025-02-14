import { RoomType } from './enums/room-type';
import { ILocationDetails } from './planet/response';

export interface JoinSimilarTableDetails {
  roomId: string;
  vendorId: number;
  locationDetails: ILocationDetails;
  roomType: RoomType;
  ignoreTableIds: number[];
  clientIpAddress: string;
  deviceInfo: any;
  appType: string;
}
