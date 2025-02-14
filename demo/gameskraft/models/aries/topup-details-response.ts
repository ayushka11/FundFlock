import { UserBalance } from './user-balance';
import { TableConfig } from "./table-config";

export interface TopupDetailsResponse {
    seatId: number,
    tableId: string,
    userBalance: UserBalance,
    maxBuyIn: number,
    minBuyIn: number,
    tableConfig: TableConfig,
    antiBankingDuration: number,
}
