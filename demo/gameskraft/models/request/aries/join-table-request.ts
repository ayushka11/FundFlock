import { User } from "./user";

export interface JoinTableRequest {
    tableId: string,
    buyInAmount: number,
    user: User
    isChatBan?: boolean,
}