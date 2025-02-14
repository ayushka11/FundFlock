import { User } from "./user";

export interface LeaveTableRequest {
    tableId: string,
    user: User
}