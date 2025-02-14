import { User } from "./user";

export interface UnReserveRoomRequest {
    tableId: string,
    user: User
}