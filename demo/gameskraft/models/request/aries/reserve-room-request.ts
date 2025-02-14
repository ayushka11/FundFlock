import { ILocationMeta } from "../../location";
import { User } from "./user";

export interface ReserveRoomRequest {
    roomId: string,
    user: User,
    locationMeta: ILocationMeta,
}
