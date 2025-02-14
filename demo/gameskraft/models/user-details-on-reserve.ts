import { ILocationDetails } from './planet/response';

export interface  UserDetailsOnReserve {
  vendorId: number;
  locationDetails: ILocationDetails;
  clientIpAddress: string;
  deviceInfo: any;
  appType: string;
}
