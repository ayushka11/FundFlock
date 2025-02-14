import {TopupDetailsResponse as AriesTopupDetailsResponse} from '../models/aries/topup-details-response';
import {Room} from "../models/room";
import {GameVariant} from "../models/enums/game-variant";
import {Number} from "aws-sdk/clients/iot";

import {TableDetails, Wallet} from "../models/reserve-room";

import {RoomResponse as AriesRoomResponse} from "../models/aries/room-response";
import {ReserveRoomResponse as AriesReserveRoomResponse} from "../models/aries/reserve-room";
import {UserBalance} from "../models/aries/user-balance";
import TimerUtil from "../helpers/timer-util";
import CurrencyUtil from "../helpers/currency-util";
import {RoomTables} from "../models/aries/room-tables";
import {Table} from "../models/cash-table";
import {ITableResponse} from "../models/gateway/response";
import {PlayerResult} from "../models/table-result";
import {PlayerJoinBack} from "../models/player-join-back";
import {AriesGameVariant} from "../models/enums/aries-game-variant";
import AriesTournamentResponse from "../models/tournament/response/tournament-response";
import {Tournament} from "../models/tournament";
import {PlayerMTTList, PlayerTournamentData} from "../models/player-mtt-list";
import TournamentPlayerStatusResponse from "../models/tournament/response/tournament-player-status-response";
import {PlayerTournamentStatus} from "../models/enums/tournament/player-tournament-status"
import AriesTournamentEntryRequest from "../models/tournament/request/tournament-entry-request"
import {PlayerTournamentRegisterRequest} from '../models/request/player-tournament-register-request';
import {TournamentUtil} from "./tournament-util";
import {TournamentBlindStructure} from "../models/tournament-blind-structure"
import AriesBlindLevel from "../models/tournament/blind-level"
import {GsEntryType, TournamentResponseV3} from "../models/game-server/mtt-list";
import {IAmountData} from "../models/amount-data";
import AriesTournamentType from "../models/tournament/enums/aries-tournament-type";
import AmountUtil from "./amount-util";
import {TournamentCurrencyType} from "../models/enums/tournament/tournament-currency-type";
import {CURRENCY, TournamentSeat} from "../constants/constants";
import TournamentCurrency from "../models/tournament/enums/tournament-currency";
import TournamentStatusAries from "../models/tournament/enums/tournament-status-aries";
import {TournamentStatus} from "../models/enums/tournament/tournament-status";
import {response} from "express";
import {EntryType} from "../models/enums/tournament/entry-type";
import { UserDetail } from 'aws-sdk/clients/iam';
import { CASH_APP, REQUEST_HEADERS } from '../constants/constants';
import LobbyController from '../controllers/lobbyController';
import RequestUtil from '../helpers/request-util';
import { RoomType } from '../models/enums/room-type';
import UserGameSettingType from '../models/enums/user-game-setting-type';
import { PanDetails } from '../models/guardian/user-kyc';
import { IDMUserProfile } from '../models/idm/user-idm';
import { JoinSimilarTable } from '../models/join-similar-table';
import { JoinSimilarTableDetails } from '../models/join-similar-table-details';
import { QuickJoinGroupDetails } from '../models/quick-join-group-details';
import { JoinSimilarTableRequest } from '../models/request/aries/join-similar-table-request';
import { QuickJoinGroupRequest } from '../models/request/aries/quick-join-request';
import { ReserveRoomRequest } from '../models/request/aries/reserve-room-request';
import { ReserveSeatRequest } from '../models/request/aries/reserve-seat-request';
import { User as AriesUser, UserAutoTopUpSetting } from '../models/request/aries/user';
import { ReserveRoomDetails } from '../models/reserve-room-details';
import { ReserveSeatDetails } from '../models/reserve-seat-details';

import { GroupResponse as AriesGroupResponse } from "../models/aries/group-response";
import { Group } from "../models/group";
import { TableDetails as AriesTableDetails } from "../models/table-details";
import { GroupTables } from "../models/aries/group-tables";
import { UserDetailsOnReserve } from '../models/user-details-on-reserve';
import { UserGameplaySettings } from '../models/zodiac/gameplay';
import { UserDetailsResponse } from '../models/zodiac/user-detail';
import AppConfigService from '../services/appConfigService';
import { md5hash } from './crypto-util';
import IdmUtil from './idm-utils';

export default class AriesUtil {

    static getGameVariant(variantName: string): number {
        switch (variantName) {
            case AriesGameVariant.NLHE:
                return GameVariant.NLHE
            case AriesGameVariant.PLO4:
                return GameVariant.PLO4
            case AriesGameVariant.PLO5:
                return GameVariant.PLO5
            case AriesGameVariant.PLO6:
                return GameVariant.PL06
            default:
                return -1;
        }
    }

    static getAriesGameVariant(variant: number): string {
        switch (variant) {
            case GameVariant.NLHE:
                return AriesGameVariant.NLHE
            case GameVariant.PLO4:
                return AriesGameVariant.PLO4
            case GameVariant.PLO5:
                return AriesGameVariant.PLO5
            case GameVariant.PL06:
                return AriesGameVariant.PLO6
            default:
                return '';
        }
    }

    static getAveragePotLevel(averagePot: number, bigBlindAmount: number): number {
        // If averagePot is less than 5 times the bigBlindAmount, return 1
        if (averagePot <= (5 * bigBlindAmount)) {
            return 1;
        }
        // If averagePot is between 5 and 15 times the bigBlindAmount, return 2
        if (averagePot > (5 * bigBlindAmount) && averagePot <= (15 * bigBlindAmount)) {
            return 2;
        }
        // If averagePot is between 15 and above times the bigBlindAmount, return 3
        if (averagePot > (15 * bigBlindAmount)) {
            return 3;
        }
    }

    static filterRooms(roomResponse: Array<AriesRoomResponse> = [], userId: string, groupId?: number): Array<AriesRoomResponse> {
        return roomResponse.filter((room) => {
            // If room has non-empty userFilter and it excludes the userId, filter out the room.
            if (room.userFilter && room.userFilter.length && !room.userFilter.includes(Number(userId))) {
                return false;
            }
            if (groupId && room.groupId !== groupId) {
                return false;
            }
            return true;
        })
    }

    static filterGroupTables(groupTablesResponse: Array<GroupTables> = [], userId: string): GroupTables[] {
        return groupTablesResponse.filter((room) => {
            // If room has non-empty userFilter and it excludes the userId, filter out the room.
            if (room.userFilter && room.userFilter.length && !room.userFilter.includes(Number(userId))) {
                return false;
            }
            return true;
        })
    }

    static convertRoomResponse(roomResponse: Array<AriesRoomResponse> = []): Room[] {
        return roomResponse.filter(rooms => rooms).map((ariesRoomResponse: AriesRoomResponse) => {
            const room: Room = Room.getRoomFromAriesResponse(ariesRoomResponse);
            room.smallBlindAmount = CurrencyUtil.getAmountInRupee(room.smallBlindAmount);
            room.bigBlindAmount = CurrencyUtil.getAmountInRupee(room.bigBlindAmount);
            room.minBuyInAmount = CurrencyUtil.getAmountInRupee(room.minBuyInAmount);
            room.maxBuyInAmount = CurrencyUtil.getAmountInRupee(room.maxBuyInAmount);
            return room;
        })
    }

    static convertGroupResponse(groupResponse: Array<AriesGroupResponse> = []): Group[] {
        return groupResponse.filter(groups => groups).map((ariesGroupResponse: AriesGroupResponse) => {
            const group: Group = Group.getGroupFromAriesResponse(ariesGroupResponse);
            group.smallBlindAmount = CurrencyUtil.getAmountInRupee(group.smallBlindAmount);
            group.bigBlindAmount = CurrencyUtil.getAmountInRupee(group.bigBlindAmount);
            group.minBuyInAmount = CurrencyUtil.getAmountInRupee(group.minBuyInAmount);
            group.maxBuyInAmount = CurrencyUtil.getAmountInRupee(group.maxBuyInAmount);
            return group;
        })
    }

    static getWalletBalanceDetails(data: UserBalance): Wallet {
        let wallet: Wallet = {};
        if (data?.totalBalance) {
            wallet.total = CurrencyUtil.getAmountInRupee(data?.totalBalance);
        }
        if (data?.totalRealBalance) {
            wallet.real = CurrencyUtil.getAmountInRupee(data?.totalRealBalance);
        }
        return wallet;
    }

    static getTableDetailsFromReserveResponse(roomResponse: AriesReserveRoomResponse): TableDetails {
        let tableDetails: TableDetails = {}
        if (roomResponse?.minBuyIn) {
            tableDetails.minBuyInAmount = CurrencyUtil.getAmountInRupee(roomResponse?.minBuyIn)
        }
        if (roomResponse?.maxBuyIn) {
            tableDetails.maxBuyInAmount = CurrencyUtil.getAmountInRupee(roomResponse?.maxBuyIn)
        }
        if (roomResponse?.tableConfig?.smallBlind) {
            tableDetails.smallBlindAmount = CurrencyUtil.getAmountInRupee(roomResponse?.tableConfig?.smallBlind)
        }
        if (roomResponse?.tableConfig?.bigBlind) {
            tableDetails.bigBlindAmount = CurrencyUtil.getAmountInRupee(roomResponse?.tableConfig?.bigBlind)
        }
        if (roomResponse?.tableConfig?.gameType) {
            tableDetails.gameType = roomResponse?.tableConfig?.gameType
        }
        if (roomResponse?.tableConfig?.gameVariant) {
            tableDetails.gameVariant = roomResponse?.tableConfig?.gameVariant
        }
        if (roomResponse?.tableConfig?.seatReserveDuration) {
            tableDetails.timerDuration = TimerUtil.getTimeInSeconds(roomResponse?.tableConfig?.seatReserveDuration)
        }
        if (roomResponse?.antiBankingTime >= 0) {
            tableDetails.antiBankingDuration = TimerUtil.getTimeInSeconds(roomResponse?.antiBankingTime)
        }
        if (roomResponse?.tableConfig?.isRitEnabled !== undefined) {
            tableDetails.IsRIT = roomResponse?.tableConfig?.isRitEnabled
        }
        return tableDetails;
    }

    static getTableDetailsFromTopupResponse(roomResponse: AriesTopupDetailsResponse): TableDetails {
        let tableDetails: TableDetails = {}
        if (roomResponse?.minBuyIn) {
            tableDetails.minBuyInAmount = CurrencyUtil.getAmountInRupee(roomResponse?.minBuyIn)
        }
        if (roomResponse?.maxBuyIn) {
            tableDetails.maxBuyInAmount = CurrencyUtil.getAmountInRupee(roomResponse?.maxBuyIn)
        }
        if (roomResponse?.tableConfig?.smallBlind) {
            tableDetails.smallBlindAmount = CurrencyUtil.getAmountInRupee(roomResponse?.tableConfig?.smallBlind)
        }
        if (roomResponse?.tableConfig?.bigBlind) {
            tableDetails.bigBlindAmount = CurrencyUtil.getAmountInRupee(roomResponse?.tableConfig?.bigBlind)
        }
        if (roomResponse?.tableConfig?.gameType) {
            tableDetails.gameType = roomResponse?.tableConfig?.gameType
        }
        if (roomResponse?.tableConfig?.gameVariant) {
            tableDetails.gameVariant = roomResponse?.tableConfig?.gameVariant
        }
        if (roomResponse?.tableConfig?.topupDuration) {
            tableDetails.timerDuration = TimerUtil.getTimeInSeconds(roomResponse?.tableConfig?.topupDuration)
        }
        if (roomResponse?.antiBankingDuration >= 0) {
            tableDetails.antiBankingDuration = TimerUtil.getTimeInSeconds(roomResponse?.antiBankingDuration)
        }
        return tableDetails;
    }

    static getTableFromResponse(tables: RoomTables[] = []): Table[] {
        return tables.map((table: RoomTables) => {
            return Table.convertAriesResponse(table)
        })
    }

    static getGroupTableFromResponse(tables: GroupTables[] = []): AriesTableDetails[] {
        return tables.map((table: GroupTables) => {
            const resp = AriesTableDetails.convertAriesResponse(table)
            resp.smallBlindAmount = CurrencyUtil.getAmountInRupee(resp.smallBlindAmount);
            resp.bigBlindAmount = CurrencyUtil.getAmountInRupee(resp.bigBlindAmount);
            resp.minBuyInAmount = CurrencyUtil.getAmountInRupee(resp.minBuyInAmount);
            resp.maxBuyInAmount = CurrencyUtil.getAmountInRupee(resp.maxBuyInAmount);
            resp.averageStack = CurrencyUtil.getAmountInRupee(resp.averageStack);
            resp.averagePot = CurrencyUtil.getAmountInRupee(resp.averagePot);
            return resp;
        })
    }

    static getRoomTableResponse(resp: Table[] = []): ITableResponse {
        return {
            tables: resp?.map((table: Table) => {
                return {
                    id: table?.id,
                    tableIndex: table?.tableIndex,
                }
            })
        }
    }

    static getPlayerResultFromResponse(playerResultResponse: PlayerResult[], userId: number): PlayerResult[] {
        playerResultResponse.forEach(result => {
            result.userId = Number(result.userId);
            result.initialStackAmount = CurrencyUtil.getAmountInRupee(result.initialStackAmount);
            result.winningStackAmount = CurrencyUtil.getAmountInRupee(result.winningStackAmount);
        });

        // Sort the array
        playerResultResponse.sort((a, b) => {
            if (a.userId === userId) {
                return -1; // `a` (with userId) should come before `b`
            } else if (b.userId === userId) {
                return 1; // `b` (with userId) should come before `a`
            } else {
                return 0; // maintain current order for others
            }
        });

        return playerResultResponse;
    }

    // static getTournamentBlindStructure(resp: TournamentBlindStructureResp = []): TournamentBlindStructure[] {
    //     return resp.map((tournamentBlindStructure: GsTournamentBlindStructure) => {
    //         return TournamentBlindStructure.convertGsResponse(tournamentBlindStructure)
    //     })

    // }

    // static getTournaments(resp: TournamentResponse[] = []): Tournament[] {
    //     return resp.map((tournament: TournamentResponse) => Tournament.convertGsResponse(tournament))
    // }

    // static getTournamentsV2(resp: TournamentResponse[] = []): Tournament[] {
    //     return resp.map((tournament: TournamentResponse) => Tournament.convertGsResponseV2(tournament))
    // }

    static getPlayerJoinBackResponse(response: PlayerJoinBack, userId: string, roomId: number, tableId: string) {
        return {
            tableId: tableId,
            userId: Number(userId),
            roomId: roomId,
        }
    }

    static getUserDetailsOnReserve(req: any): UserDetailsOnReserve {
        const vendorId: string = req?.vendorId;
        const locationDetails = req.sessionManager.getLocation();
        const lat: number = req.sessionManager.getLocation()?.lat ?? -1;
        const lng: number = req.sessionManager.getLocation()?.lng ?? -1;
        const clientIpAddress: string = req.sessionManager?.getClientIpFromRequest();
        const deviceInfo: any = req.sessionManager?.getUserDeviceInfo();
        const appType: string = RequestUtil.parseQueryParamAsString(req.headers, REQUEST_HEADERS.APP_TYPE) || CASH_APP;

        return {
            vendorId: parseInt(vendorId),
            locationDetails: {
                lat: lat,
                lng: lng,
                ip: locationDetails?.ip,
                state: locationDetails?.state,
                country: locationDetails?.country,
                stateFromGeo: locationDetails?.stateFromGeo,
                countryFromGeo: locationDetails?.countryFromGeo,
                stateFromIp: locationDetails?.stateFromIp,
                countryFromIp: locationDetails?.countryFromIp,
                accuracyRadius: locationDetails?.accuracyRadius,
                gstStateCode: locationDetails?.gstStateCode,
                isAllowed: locationDetails?.isAllowed,
            },
            clientIpAddress: clientIpAddress,
            deviceInfo: deviceInfo,
            appType: appType
        }
    }
    static getReserveRoomDetailsFromRequest(req: any, isPractice: boolean, roomId: string, tableId?: number): ReserveRoomDetails {
        const userDetailsOnReserve = AriesUtil.getUserDetailsOnReserve(req)
        return {
            roomId: roomId,
            ...userDetailsOnReserve,
            roomType: isPractice ? RoomType.PRACTICE : RoomType.CASH,
            tableId: tableId
        }
    }

    static getAriesUser(userId: string, reserveDetails: ReserveRoomDetails | QuickJoinGroupDetails | ReserveSeatDetails | JoinSimilarTableDetails, userDetails: IDMUserProfile, panDetails: PanDetails, userGameplaySettings: UserGameplaySettings): AriesUser {
        const isChatBan: boolean = IdmUtil.getChatBan(userDetails);
        const userBetSettings = userGameplaySettings?.bet_settings;
        const userGameSettings = userGameplaySettings?.game_settings;
        const autoTopUpSetting = userGameplaySettings?.auto_top_up_setting;
        const userAutoTopUpSetting: UserAutoTopUpSetting = {
            setting: autoTopUpSetting?.setting,
            enableAutoTopUp: autoTopUpSetting?.value,
            topUpThresholdPrecentage: autoTopUpSetting?.config?.topUpThresholdPrecentage,
            topUpStackPercentage: autoTopUpSetting?.config?.topUpStackPercentage
        };
        const autoPostBBValue = userGameSettings && userGameSettings.filter((gameSetting) => gameSetting?.setting === UserGameSettingType.AUTO_POST_BB)[0]?.value;
        return {
            id: Number(userId),
            vendorId: Number(reserveDetails?.vendorId),
            userName: userDetails?.userHandle,
            userMobileHash: md5hash(userDetails?.mobile),
            userPanHash: (panDetails?.panId !== undefined ? md5hash(panDetails?.panId || "") : null),
            userIpAddress: reserveDetails?.clientIpAddress || "",
            userStateCode: reserveDetails?.locationDetails?.gstStateCode || -1,
            deviceInfo: JSON.stringify(reserveDetails?.deviceInfo) || "",
            userAvatar: userDetails?.displayPicture || "",
            isChatBan: isChatBan,
            enablePostBB: autoPostBBValue,
            betSettings: userBetSettings,
            autoTopUpSetting: userAutoTopUpSetting
        }
    }
    static getReserveRoomRequest(userId: string, reserveRoomDetails: ReserveRoomDetails, panDetails: PanDetails, userDetails: IDMUserProfile, userGameplaySetting: UserGameplaySettings): ReserveRoomRequest {
        const ariesUser: AriesUser = AriesUtil.getAriesUser(userId, reserveRoomDetails, userDetails, panDetails, userGameplaySetting)
        return {
            roomId: reserveRoomDetails?.roomId,
            user: ariesUser,
            locationMeta: {
                lat: reserveRoomDetails?.locationDetails?.lat,
                lng: reserveRoomDetails?.locationDetails?.lng,
            }
        }
    }


    static getQuickJoinGroupDetailsFromRequest(req: any, isPractice: boolean, groupId: number): QuickJoinGroupDetails {

        const userDetails: UserDetailsOnReserve = AriesUtil.getUserDetailsOnReserve(req)
        return {
            groupId: groupId,
            ...userDetails,
            isPractice: isPractice,
        }
    }

    static getQuickJoinGroupRequest(userId: string, quickJoinGroupDetails: QuickJoinGroupDetails, panDetails: PanDetails, userDetails: IDMUserProfile, userGameplaySetting: UserGameplaySettings): QuickJoinGroupRequest {
        const ariesUser: AriesUser = AriesUtil.getAriesUser(userId, quickJoinGroupDetails, userDetails, panDetails, userGameplaySetting)
        return {
            groupId: quickJoinGroupDetails?.groupId,
            user: ariesUser,
            locationMeta: {
                lat: quickJoinGroupDetails?.locationDetails?.lat,
                lng: quickJoinGroupDetails?.locationDetails?.lng,
            }
        }
    }

    static getReserveSeatDetailsFromRequest(req: any, roomId: string, tableId: string, seatId: number, isPractice: boolean): ReserveSeatDetails {
        const userDetails: UserDetailsOnReserve = AriesUtil.getUserDetailsOnReserve(req)
        return {
            roomId: roomId,
            seatId: seatId,
            tableId: Number(tableId),
            ...userDetails,
            roomType: isPractice ? RoomType.PRACTICE : RoomType.CASH,
        }
    }

    static getReserveSeatRequest(userId: string, reserveSeatDetails: ReserveSeatDetails, panDetails: PanDetails, userDetails: IDMUserProfile, userGameplaySettings: UserGameplaySettings): ReserveSeatRequest {
        const ariesUser: AriesUser = AriesUtil.getAriesUser(userId, reserveSeatDetails, userDetails, panDetails, userGameplaySettings)
        return {
            seatId: reserveSeatDetails?.seatId,
            user: ariesUser,
            locationMeta: {
                lat: reserveSeatDetails?.locationDetails?.lat,
                lng: reserveSeatDetails?.locationDetails?.lng,
            }
        }
    }

    static getPlayerTournamentTableJoinBackResponse(response: PlayerJoinBack, userId: string, tournamentId: number) {
        return {
            tournamentId: tournamentId,
            userId: Number(userId),
        }
    }

    static getJoinSimilarTableDetailsFromRequest(req: any, roomId: string, ignoreTableIds: number[], isPractice: boolean): JoinSimilarTableDetails {
        const userDetails: UserDetailsOnReserve = AriesUtil.getUserDetailsOnReserve(req)
        return {
            roomId: roomId,
            vendorId: userDetails?.vendorId,
            locationDetails: userDetails?.locationDetails,
            roomType: isPractice ? RoomType.PRACTICE : RoomType.CASH,
            ignoreTableIds: ignoreTableIds,
            clientIpAddress: userDetails?.clientIpAddress,
            deviceInfo: userDetails?.deviceInfo,
            appType: userDetails?.appType,
        }
    }

    static getJoinSimilarTableRequest(userId: string, joinSimilarTableDetails: JoinSimilarTableDetails, panDetails: PanDetails, userDetails: IDMUserProfile, userGameplaySetting: UserGameplaySettings): JoinSimilarTableRequest {
        const ariesUser: AriesUser = AriesUtil.getAriesUser(userId, joinSimilarTableDetails, userDetails, panDetails, userGameplaySetting)
        return {
            roomId: joinSimilarTableDetails?.roomId,
            ignoreTables: joinSimilarTableDetails?.ignoreTableIds || [],
            user: ariesUser,
            locationMeta: {
                lat: joinSimilarTableDetails?.locationDetails?.lat,
                lng: joinSimilarTableDetails?.locationDetails?.lng,
            }
        }
    }


}
