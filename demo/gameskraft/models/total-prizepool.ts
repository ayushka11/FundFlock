import {IAmountData} from "./amount-data";

export interface ITotalPrizePool {
    prizePool: IAmountData,
    primaryPrizePool: IAmountData,
    secondaryPrizePool: IAmountData,
    prizePoolWithOverlay: IAmountData,
}