import { ILocationMeta } from "../../location";
import { User } from "./user";

export interface ReserveSeatRequest {
  seatId: number,
  user: User,
  locationMeta: ILocationMeta
}
