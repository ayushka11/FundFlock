import { CURRENCY } from "../constants/constants";
import {
    IJoinSimilarTable,
    IPlayerBuyInDetails,
    IPlayerJoinBack,
    IPlayerLeaveTableData,
    IPlayerRebuyData,
    IPlayerTopupData, IPlayerTournamentLeaveTableData,
    IReserveSeat,
    ITopupValuesData,
    PlayerBuyInDetails
} from '../models/gateway/response';
import { PlayerJoinBack } from "../models/player-join-back";
import { PlayerLeaveTable } from "../models/player-leave-table";
import { PlayerRebuy } from "../models/player-rebuy";
import { PlayerTopup } from "../models/player-topup";
import { ReserveSeat } from '../models/reserve-seat';
import { TopupValue } from "../models/topup-value";
import AmountUtil from "./amount-util";
import { RoomUtil } from "./room-util";
import { TableDetails } from "../models/table-details";
import LoggerUtil, { ILogger } from "./logger";

const logger: ILogger = LoggerUtil.get("TableUtil");

export class TableUtil {

    static getPlayerTopupResponse(playerTopup: PlayerTopup, userId: string, tableId: string): IPlayerTopupData {
        return {
            userId: Number(userId),
            tableId: tableId,
            seatId: playerTopup?.seatId,
            transactionId: playerTopup?.transactionId,
            topupAmount: AmountUtil.getAmountWithCurrency(playerTopup?.topupAmount, CURRENCY.INR),
            message: playerTopup?.message
        }

    }

    static getPlayerPracticeTopupResponse(playerTopup: PlayerTopup, userId: string, tableId: string): IPlayerTopupData {
        return {
            userId: Number(userId),
            tableId: tableId,
            seatId: playerTopup?.seatId,
            transactionId: playerTopup?.transactionId,
            topupAmount: AmountUtil.getAmountWithCurrency(playerTopup?.topupAmount, CURRENCY.CHIPS),
            message: playerTopup?.message
        }

    }

    static getPlayerRebuyResponse(playerRebuy: PlayerRebuy, userId: string, tableId: string): IPlayerRebuyData {
        return {
            userId: Number(userId),
            tableId: tableId,
            seatId: playerRebuy?.seatId,
            transactionId: playerRebuy?.transactionId,
            rebuyAmount: AmountUtil.getAmountWithCurrency(playerRebuy?.rebuyAmount, CURRENCY.INR),
            message: playerRebuy?.message
        }

    }

    static getPlayerPracticeRebuyResponse(playerRebuy: PlayerRebuy, userId: string, tableId: string): IPlayerRebuyData {
        return {
            userId: Number(userId),
            tableId: tableId,
            seatId: playerRebuy?.seatId,
            transactionId: playerRebuy?.transactionId,
            rebuyAmount: AmountUtil.getAmountWithCurrency(playerRebuy?.rebuyAmount, CURRENCY.CHIPS),
            message: playerRebuy?.message
        }

    }

    static getPlayerLeaveTableResponse(playerLeaveTable: PlayerLeaveTable, userId: string, roomId: number): IPlayerLeaveTableData {
        return {
            seatId: playerLeaveTable?.seatId,
            tableId: playerLeaveTable?.tableId,
            userId: Number(userId),
            roomId: roomId
        }
    }


    static getPlayerTournamentLeaveTableResponse(playerLeaveTable: PlayerLeaveTable, userId: string): IPlayerTournamentLeaveTableData {
        return {
            seatId: playerLeaveTable?.seatId,
            tableId: playerLeaveTable?.tableId,
            userId: Number(userId)
        }
    }

    static getTopupValuesResponse(response: TopupValue, userId: string): ITopupValuesData {
        return {
            userId: Number(userId),
            tableId: response?.tableId,
            seatId: response?.seatId ?? -1,
            showPopup: RoomUtil.showPopupCheck(response),
            wallet: RoomUtil.getRoomWalletResponse(response?.wallet),
            tableDetails: RoomUtil.getRoomTableDetails(response?.tableDetails, false),
            ticketDetails: RoomUtil.getRoomTicketDetails(response?.ticketDetails, false),
            popupMeta: {
                popUpHeader: "Top Up",
                tableBlindsText: "Table Blinds",
                sliderMinBuyInText: "MIN",
                sliderMaxButtonText: "MAX",
                joinTableButtonText: "Join Table",
                timerText: " You have  ##SECONDS## to confirm",
                timerPlaceholderText: "##SECONDS##",
            }
        }

    }

    static getPracticeTopupValuesResponse(response: TopupValue, userId: string): ITopupValuesData {
        return {
            userId: Number(userId),
            tableId: response?.tableId,
            seatId: response?.seatId ?? -1,
            wallet: RoomUtil.getRoomWalletResponse(response?.wallet),
            tableDetails: RoomUtil.getRoomTableDetails(response?.tableDetails, true),
            ticketDetails: RoomUtil.getRoomTicketDetails(response?.ticketDetails, true),
            showPopup: false,
            popupMeta: {
                popUpHeader: "Top Up",
                tableBlindsText: "Table Blinds",
                sliderMinBuyInText: "MIN",
                sliderMaxButtonText: "MAX",
                joinTableButtonText: "Join Table",
                timerText: " You have  ##SECONDS## to confirm",
                timerPlaceholderText: "##SECONDS##",
            }
        }

    }

    static getPlayerJoinBackResponse(playerJoinBack: PlayerJoinBack, userId: number, roomId: number, tableId: string): IPlayerJoinBack {
        return {
            seatId: playerJoinBack?.seatId ?? -1,
            tableId: tableId,
            userId: userId,
            roomId: roomId,
            wallet: RoomUtil.getRoomWalletResponse(playerJoinBack?.wallet),
            tableDetails: RoomUtil.getRoomTableDetails(playerJoinBack?.tableDetails, false),
            ticketDetails: RoomUtil.getRoomTicketDetails(playerJoinBack?.ticketDetails, false),
            showPopup: RoomUtil.showPopupCheck(playerJoinBack),
            popupMeta: {
                popUpHeader: "Join Table",
                tableBlindsText: "Table Blinds",
                bonusText: "User ##BONUS##% of your bonus amount",
                bonusPlaceholderText: "##BONUS##",
                sliderMinBuyInText: "MIN",
                sliderMaxButtonText: "MAX",
                joinTableButtonText: "Re Buy",
                timerText: " You have  ##SECONDS## to confirm",
                timerPlaceholderText: "##SECONDS##",
                antiBankingTimerText: "Your AntiBanking TimeTournamentStatus.RUNNING##SECONDS##",
                antiBankingTimerPlaceholderText: "##SECOND##"
            }

        }
    }

    static getPlayerPracticeJoinBackResponse(playerJoinBack: PlayerJoinBack, userId: number, roomId: number, tableId: string): IPlayerJoinBack {
        return {
            seatId: playerJoinBack?.seatId ?? -1,
            tableId: tableId,
            userId: userId,
            roomId: roomId,
            wallet: RoomUtil.getRoomWalletResponse(playerJoinBack?.wallet),
            tableDetails: RoomUtil.getRoomTableDetails(playerJoinBack?.tableDetails, true),
            ticketDetails: RoomUtil.getRoomTicketDetails(playerJoinBack?.ticketDetails, true),
            showPopup: false,
            popupMeta: {
                popUpHeader: "Join Table",
                tableBlindsText: "Table Blinds",
                bonusText: "User ##BONUS##% of your bonus amount",
                bonusPlaceholderText: "##BONUS##",
                sliderMinBuyInText: "MIN",
                sliderMaxButtonText: "MAX",
                joinTableButtonText: "Join Table",
                timerText: " You have  ##SECONDS## to confirm",
                timerPlaceholderText: "##SECONDS##",
                antiBankingTimerText: "Your AntiBanking TimeTournamentStatus.RUNNING##SECONDS##",
                antiBankingTimerPlaceholderText: "##SECOND##"
            }

        }
    }

    static getBuyInDetailsResponse(response: PlayerBuyInDetails): IPlayerBuyInDetails {
        return {
            playerGameBalance: AmountUtil.getAmountWithCurrency(response?.playerGameBalance ?? 0, CURRENCY.INR),
            winningBalance: AmountUtil.getAmountWithCurrency(response?.winningBalance ?? 0, CURRENCY.INR),
            discountCreditBalance: AmountUtil.getAmountWithCurrency(response?.discountCreditBalance ?? 0, CURRENCY.CHIPS),
            totalRealBalance: AmountUtil.getAmountWithCurrency(response?.totalRealBalance ?? 0, CURRENCY.INR),
        }
    }


    static getReserveSeatResponse(reserveSeat: ReserveSeat, userId: string, vendorId: number): IReserveSeat {
        return {
            userId: Number(userId),
            vendorId: `${vendorId}`,
            tableId: reserveSeat?.tableId,
            seatId: reserveSeat?.seatId,
            wallet: RoomUtil.getRoomWalletResponse(reserveSeat?.wallet),
            tableDetails: RoomUtil.getRoomTableDetails(reserveSeat?.tableDetails, false),
            ticketDetails: RoomUtil.getRoomTicketDetails(reserveSeat?.ticketDetails, false),
            showPopup: RoomUtil.showPopupCheck(reserveSeat),
            popupMeta: {
                popUpHeader: "Join Table",
                tableBlindsText: "Table Blinds",
                bonusText: "User ##BONUS##% of your bonus amount",
                bonusPlaceholderText: "##BONUS##",
                sliderMinBuyInText: "MIN",
                sliderMaxButtonText: "MAX",
                joinTableButtonText: "Join Table",
                timerText: " You have  ##SECONDS## to confirm",
                timerPlaceholderText: "##SECONDS##",
                antiBankingTimerText: "Your AntiBanking remaining timer ##SECONDS##",
                antiBankingTimerPlaceholderText: "##SECOND##"
            }
        }
    }

    static getReservePracticeSeatResponse(reserveSeat: ReserveSeat, userId: number, vendorId: string): IReserveSeat {
        return {
            userId: userId,
            vendorId: vendorId,
            tableId: reserveSeat?.tableId,
            seatId: reserveSeat?.seatId,
            wallet: RoomUtil.getRoomWalletResponse(reserveSeat?.wallet),
            tableDetails: RoomUtil.getRoomTableDetails(reserveSeat?.tableDetails, true),
            ticketDetails: RoomUtil.getRoomTicketDetails(reserveSeat?.ticketDetails, true),
            showPopup: RoomUtil.showPopupCheck(reserveSeat),
            popupMeta: {
                popUpHeader: "Join Table",
                tableBlindsText: "Table Blinds",
                bonusText: "User ##BONUS##% of your bonus amount",
                bonusPlaceholderText: "##BONUS##",
                sliderMinBuyInText: "MIN",
                sliderMaxButtonText: "MAX",
                joinTableButtonText: "Join Table",
                timerText: " You have  ##SECONDS## to confirm",
                timerPlaceholderText: "##SECONDS##",
                antiBankingTimerText: "Your AntiBanking remaining timer ##SECONDS##",
                antiBankingTimerPlaceholderText: "##SECOND##"
            }
        }
    }


    static getJoinSimilarTableResponse(reserveSeat: ReserveSeat, userId: string, vendorId: number): IJoinSimilarTable {
        return {
            userId: Number(userId),
            vendorId: `${vendorId}`,
            tableId: reserveSeat?.tableId,
            seatId: reserveSeat?.seatId,
            wallet: RoomUtil.getRoomWalletResponse(reserveSeat?.wallet),
            tableDetails: RoomUtil.getRoomTableDetails(reserveSeat?.tableDetails, false),
            ticketDetails: RoomUtil.getRoomTicketDetails(reserveSeat?.ticketDetails, false),
            showPopup: RoomUtil.showPopupCheck(reserveSeat),
            popupMeta: {
                popUpHeader: "Join Table",
                tableBlindsText: "Table Blinds",
                bonusText: "User ##BONUS##% of your bonus amount",
                bonusPlaceholderText: "##BONUS##",
                sliderMinBuyInText: "MIN",
                sliderMaxButtonText: "MAX",
                joinTableButtonText: "Join Table",
                timerText: " You have  ##SECONDS## to confirm",
                timerPlaceholderText: "##SECONDS##",
                antiBankingTimerText: "Your AntiBanking remaining timer ##SECONDS##",
                antiBankingTimerPlaceholderText: "##SECOND##"
            }
        }
    }

    static getPracticeJoinSimilarTableResponse(reserveSeat: ReserveSeat, userId: number, vendorId: string): IJoinSimilarTable {
        return {
            userId: userId,
            vendorId: vendorId,
            tableId: reserveSeat?.tableId,
            seatId: reserveSeat?.seatId,
            wallet: RoomUtil.getRoomWalletResponse(reserveSeat?.wallet),
            tableDetails: RoomUtil.getRoomTableDetails(reserveSeat?.tableDetails, true),
            ticketDetails: RoomUtil.getRoomTicketDetails(reserveSeat?.ticketDetails, true),
            showPopup: RoomUtil.showPopupCheck(reserveSeat),
            popupMeta: {
                popUpHeader: "Join Table",
                tableBlindsText: "Table Blinds",
                bonusText: "User ##BONUS##% of your bonus amount",
                bonusPlaceholderText: "##BONUS##",
                sliderMinBuyInText: "MIN",
                sliderMaxButtonText: "MAX",
                joinTableButtonText: "Join Table",
                timerText: " You have  ##SECONDS## to confirm",
                timerPlaceholderText: "##SECONDS##",
                antiBankingTimerText: "Your AntiBanking remaining timer ##SECONDS##",
                antiBankingTimerPlaceholderText: "##SECOND##"
            }
        }
    }

    static sortTablesComparator(a: TableDetails, b: TableDetails): number {
        logger.info(`Debugging sorting logic for group tables  a: ${JSON.stringify(a)} b: ${JSON.stringify(b)}  `)

        // Rule 1: Table with min seats open but not empty
        if (a.playerCount < a.maxSeats && b.playerCount < b.maxSeats && a.playerCount !== 0 && b.playerCount !== 0) {

            // If open seats are different, sort by the number of open seats
            if ((a.maxSeats - a.playerCount) !== (b.maxSeats - b.playerCount)) {
                return (a.maxSeats - a.playerCount) - (b.maxSeats - b.playerCount);
            }

            // Additional conditions when open seats are the same
            // sort by the number of max seats
            if (a.maxSeats !== b.maxSeats) {
                return b.maxSeats - a.maxSeats;
            }

            // Sort by RIT status
            if (a.ritActive !== b.ritActive) {
                return a.ritActive ? -1 : 1;
            }

            // Sort by minimum buy-in amount
            if (a.minBuyInAmount !== b.minBuyInAmount) {
                return a.minBuyInAmount - b.minBuyInAmount;
            }

            // Sort by turbo
            if (a.isTurbo !== b.isTurbo) {
                return a.isTurbo ? -1 : 1;
            }
        }

        // Rule 2: Empty Tables
        if (a.playerCount === 0 && b.playerCount === 0) {

            // sort by the number of max seats
            if (a.maxSeats !== b.maxSeats) {
                return b.maxSeats - a.maxSeats;
            }

            // Sort by RIT status
            if (a.ritActive !== b.ritActive) {
                return a.ritActive ? -1 : 1;
            }

            // Sort by minimum buy-in amount
            if (a.minBuyInAmount !== b.minBuyInAmount) {
                return a.minBuyInAmount - b.minBuyInAmount;
            }

            // Sort by turbo
            if (a.isTurbo !== b.isTurbo) {
                return a.isTurbo ? -1 : 1;
            }
        }

        // Rule 3: Full Tables
        if (a.playerCount === a.maxSeats && b.playerCount === b.maxSeats) {
            // sort by the number of max seats
            if (a.maxSeats !== b.maxSeats) {
                return b.maxSeats - a.maxSeats;
            }

            // Sort by RIT status
            if (a.ritActive !== b.ritActive) {
                return a.ritActive ? -1 : 1;
            }

            // Sort by minimum buy-in amount
            if (a.minBuyInAmount !== b.minBuyInAmount) {
                return a.minBuyInAmount - b.minBuyInAmount;
            }

            // Sort by turbo
            if (a.isTurbo !== b.isTurbo) {
                return a.isTurbo ? -1 : 1;
            }
        }

        // Rule 4: Tables with open seats and empty tables
        if (a.playerCount < a.maxSeats && a.playerCount !== 0 && b.playerCount === 0) {
            return -1;
        }
        else if (a.playerCount === 0 && b.playerCount < b.maxSeats && b.playerCount !== 0) {
            return 1;
        }

        // Rule 5: Tables with open seats and full tables
        if (a.playerCount < a.maxSeats && a.playerCount !== 0 && b.playerCount === b.maxSeats) {
            return -1;
        }
        else if (a.playerCount === a.maxSeats && b.playerCount < b.maxSeats && b.playerCount !== 0) {
            return 1;
        }

        // Rule 6: Empty tables and full tables
        if (a.playerCount === 0 && b.playerCount === b.maxSeats) {
            return 1;
        }
        else if (a.playerCount === a.maxSeats && b.playerCount === 0) {
            return -1;
        }

        // Default case (if none of the above conditions are met)
        return 0;

    }
}
