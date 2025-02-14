import { CURRENCY, GameVariantText, RoomsGameTypeInfoPriorityConstant } from "../constants/constants";
import {TableDetails, Ticket, Wallet} from "../models/reserve-room";
import {Room} from "../models/room";
import AmountUtil from "./amount-util";
import LoggerUtil, {ILogger} from "./logger";
import {ITableDetails, ITicket, IWalletData} from "../models/gateway/response";
import { Number } from "aws-sdk/clients/iot";
import { GameVariant } from "../models/enums/game-variant";

const logger: ILogger = LoggerUtil.get("RoomUtil");
export class RoomUtil {

    static sortRoomsComparator(a: Room, b: Room) {
        /*
            Sort according to:
            1. Descending order of Player Count
            2. Ascending order of Small Blind
            3. Ascending order of GameType Priority
        */
        return (b?.playerCount - a?.playerCount)    // Descending order of Player Count
            || (a?.smallBlindAmount - b?.smallBlindAmount)
            || (RoomsGameTypeInfoPriorityConstant[a?.gameVariant]?.priority - RoomsGameTypeInfoPriorityConstant[b?.gameVariant]?.priority)
    }

    static showPopupCheck(response: any): boolean {
        if (response?.tableDetails?.minBuyInAmount != undefined) {
            return true;
        } else {
            return false;
        }
    }

    static getGameVariantText(variant: Number): string {
        switch (variant) {
            case GameVariant.NLHE:
                return GameVariantText.NLHE
            case GameVariant.PLO4:
                return GameVariantText.PLO4
            case GameVariant.PLO5:
                return GameVariantText.PLO5
            case GameVariant.PL06:
                return GameVariantText.PLO6
        }
    }

    static getRoomWalletResponse(wallet: Wallet): IWalletData | undefined {
        if(wallet) {
            return {
                deposit: AmountUtil.getAmountWithCurrency(wallet?.deposit, CURRENCY.INR),
                total: AmountUtil.getAmountWithCurrency(wallet?.total, CURRENCY.INR),
                real: AmountUtil.getAmountWithCurrency(wallet?.real, CURRENCY.INR),
                winning: AmountUtil.getAmountWithCurrency(wallet?.winning, CURRENCY.INR)
            }
        } else {
            return;
        }
    }

    static getRoomTableDetails(tableDetails: TableDetails, isPractice: boolean): ITableDetails | undefined {
        if(tableDetails) {
            const currency = isPractice ? CURRENCY.CHIPS : CURRENCY.INR
            return {
                minBuyInAmount: AmountUtil.getAmountWithCurrency(tableDetails?.minBuyInAmount, currency),
                maxBuyInAmount: AmountUtil.getAmountWithCurrency(tableDetails?.maxBuyInAmount, currency),
                smallBlindAmount: AmountUtil.getAmountWithCurrency(tableDetails?.smallBlindAmount, currency),
                bigBlindAmount: AmountUtil.getAmountWithCurrency(tableDetails?.bigBlindAmount, currency),
                gameType: tableDetails?.gameType,
                gameVariant: tableDetails?.gameVariant,
                timerDuration: tableDetails?.timerDuration,
                antiBankingDuration: tableDetails?.antiBankingDuration,
                isPractice: isPractice,
                isRIT: tableDetails?.IsRIT
            }
        } else {
            return;
        }
    }

    static getRoomTicketDetails(ticketDetails: Ticket, isPractice: boolean): ITicket | undefined {
        if(ticketDetails) {
            const currency = isPractice ? CURRENCY.CHIPS : CURRENCY.INR
            return {
                isTicketActive: ticketDetails?.isTicketActive,
                ticketBalance: AmountUtil.getAmountWithCurrency(ticketDetails?.ticketBalance, currency),
                ticketMax: AmountUtil.getAmountWithCurrency(ticketDetails?.ticketMax, currency),
                ticketMin: AmountUtil.getAmountWithCurrency(ticketDetails?.ticketMin, currency),
            }
        } else {
            return;
        }
    }

}
