import { UserBalance } from "./user-balance";
import { TableConfig } from "./table-config";
import { TableMetaData } from "./table-meta-data";

export interface ReserveSeatResponse {
    seatId: number,
    tableId: string,
    roomId: string,
    groupId: number,
    userBalance: UserBalance,
    maxBuyIn: number,
    minBuyIn: number,
    tableConfig: TableConfig,
    tableMetaData: TableMetaData,
    antiBankingTime: number,
}
