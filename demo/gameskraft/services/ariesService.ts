import AriesClient from '../clients/ariesClient';
import GsClient from '../clients/gsClient';
import { PROMISE_STATUS } from '../constants/constants';
import AriesServiceErrorUtil from '../errors/aries/aries-error-util';
import CurrencyUtil from '../helpers/currency-util';
import {
    AriesTableMetaAndSeatDetails as AriesTableMetaAndSeatDetails
} from '../models/aries/aries-table-meta-and-seat-details';
import { GroupResponse as AriesGroupResponse } from '../models/aries/group-response';
import { GroupTables } from '../models/aries/group-tables';
import { PlayerJoinBackResponse } from '../models/aries/join-back';
import { JoinSimilarTableResponse } from '../models/aries/join-similar-table-response';
import { JoinTableResponse as AriesJoinTableResponse } from '../models/aries/join-table';
import { PlayerLeaveTableResponse as AriesLeaveTableResponse } from '../models/aries/leave-table';
import { QuickJoinGroupResponse } from '../models/aries/quick-join-group';
import { RebuyResponse as AriesRebuyResponse } from '../models/aries/rebuy-response';
import { ReserveRoomResponse as AriesReserveRoomResponse } from '../models/aries/reserve-room';
import { ReserveSeatResponse } from '../models/aries/reserve-seat';
import { RoomResponse as AriesRoomResponse } from '../models/aries/room-response';
import { RoomTables } from '../models/aries/room-tables';
import { TablePlayersResponse as AriesTablePlayersResponse } from '../models/aries/table-player-response';
import { TablePlayerStatsResponse } from '../models/aries/table-player-stats';
import { TableResultResponse } from '../models/aries/table-result';
import { TopupDetailsResponse as AriesTopupDetailsResponse } from '../models/aries/topup-details-response';
import { TopupResponse as AriesTopupResponse } from '../models/aries/topup-response';
import { UpdateBetSettingsResponse } from '../models/aries/update-bet-settings';
import { UpdateEnablePostBBResponse } from '../models/aries/update-enable-post-bb';
import { Table } from '../models/cash-table';
import { TablePlayersDetails } from '../models/cash-table-player-details';
import { RoomType } from '../models/enums/room-type';
import UserGameSettingType from '../models/enums/user-game-setting-type';
import { Group } from '../models/group';
import { PanDetails, UserKycDetails } from '../models/guardian/user-kyc';
import { IDMUserProfile } from '../models/idm/user-idm';
import { JoinSimilarTable } from '../models/join-similar-table';
import { JoinSimilarTableDetails } from '../models/join-similar-table-details';
import { JoinTable } from '../models/join-table';
import { PlayerJoinBack } from '../models/player-join-back';
import { PlayerLeaveTable } from '../models/player-leave-table';
import { PlayerRebuy } from '../models/player-rebuy';
import { PlayerTopup } from '../models/player-topup';
import { QuickJoinGroup } from '../models/quick-join-group';
import { QuickJoinGroupDetails } from '../models/quick-join-group-details';
import { JoinBackRequest } from '../models/request/aries/join-back-request';
import { JoinSimilarTableRequest } from '../models/request/aries/join-similar-table-request';
import { JoinTableRequest as AriesJoinTableRequest } from '../models/request/aries/join-table-request';
import { LeaveTableRequest as AriesLeaveTableRequest } from '../models/request/aries/leave-table-request';
import { OpenTableRequest } from '../models/request/aries/open-table-request';
import { QuickJoinGroupRequest } from '../models/request/aries/quick-join-request';
import { RebuyRequest } from '../models/request/aries/rebuy-request';
import { ReserveRoomRequest } from '../models/request/aries/reserve-room-request';
import { ReserveSeatRequest } from '../models/request/aries/reserve-seat-request';
import { SitOutRequest } from '../models/request/aries/sit-out-request';
import { TopupDetailsRequest } from '../models/request/aries/topup-details-request';
import { TopupRequest } from '../models/request/aries/topup-request';
import { TournamentJoinBackRequest } from '../models/request/aries/tournament-join-back-request';
import {
    TournamentLeaveTableRequest
} from '../models/request/aries/tournament-leave-table-request';
import { UnReserveRoomRequest as AriesUnReserveRoomRequest } from '../models/request/aries/unreserve-room-request';
import { User as AriesUser, UserAutoTopUpSetting } from '../models/request/aries/user';
import { JoinTableRequest } from '../models/request/join-table-request';
import { PlayerRebuyRequest } from '../models/request/player-rebuy-request';
import { ReserveRoom } from '../models/reserve-room';
import { ReserveRoomDetails } from '../models/reserve-room-details';
import { ReserveSeat } from '../models/reserve-seat';
import { ReserveSeatDetails } from '../models/reserve-seat-details';
import { Room } from '../models/room';
import { TableDetails } from '../models/table-details';
import { TableResult } from '../models/table-result';
import TableMetaAndSeatDetails from '../models/table-meta-and-seat-details';
import { TopupValue } from '../models/topup-value';
import UserKycFilter from '../models/user-kyc-filter';
import LoggerUtil, { ILogger } from "../utils/logger";
import AriesUtil from "../utils/aries-util";
import Parser from '../utils/parser';
import IDMService from "./idmService";
import GuardianService from "./guardianService";
import { getUserKYCFilterForAries, getUserPanDetails } from "../utils/guardian-util";
import ZodiacService from "./zodiacService";
import {
    UpdateUserAutoTopUpSetting,
    UpdateUserBetSettingsPayload,
    UpdateUserGameSettingsPayload,
    UserGameplaySettings
} from '../models/zodiac/gameplay';
import IdmUtil from '../utils/idm-utils';
import { ActiveRoomByStake } from '../models/aries/active-room-by-stake';
import { ILocationMeta } from '../models/location';
import { Tournament } from "../models/tournament";
import AriesTournamentResponse from "../models/tournament/response/tournament-response";
import TournamentPlayerStatusResponse, {
    UserTournamentTableDetails
} from "../models/tournament/response/tournament-player-status-response";
import ActiveTablesResponse from "../models/tournament/response/active-tables-response"
import TournamentPlayerStatusRequest from "../models/tournament/request/tournament-player-status-request"
import {PlayerMTTList, PlayerTournamentData} from "../models/player-mtt-list";
import AriesTournamentEntryRequest from "../models/tournament/request/tournament-entry-request"
import { PlayerTournamentRegisterRequest } from "../models/request/player-tournament-register-request"

import SupernovaService from './supernovaService';
import { UpdateAutoTopUpSettingsResponse } from '../models/aries/update-auto-topup-settings';
import {TournamentResponseV3} from "../models/game-server/mtt-list";
import TournamentLeaderboardResponse from "../models/tournament/response/tournament-leaderboard-response";
import { PlayerTournamentStatus } from '../models/enums/tournament/player-tournament-status';
import TournamentStatusAries from "../models/tournament/enums/tournament-status-aries";
import AriesTournamentClient from "../clients/ariesTournamentClient";
import TitanUtil from "../utils/titan-util";

const ApiCacheHelper = require('../helpers/apiCacheHelper');

const logger: ILogger = LoggerUtil.get("AriesService");


export class AriesService {

    static async validateReserveRoom(restClient: any, userId: string, roomId: string, isPractice: boolean): Promise<Room> {
        try {
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validateReserveRoom] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    logger.info(room, `[validateReserveRoom] returned room`)
                    return room
                }
                else {
                    logger.error(`[validateReserveRoom] error INVALID_ROOM_TYPE`)
                    throw AriesServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validateReserveRoom] error INVALID_ROOM_ID`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }
    }

    static async validateReserveSeat(restClient: any, userId: string, roomId: string, isPractice: boolean): Promise<Room> {
        try {
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validateReserveSeat] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    logger.info(room, `[validateReserveSeat] returned room`)
                    return room
                }
                else {
                    logger.error(`[validateReserveSeat] error INVALID_ROOM_TYPE`)
                    throw AriesServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validateReserveSeat] error INVALID_ROOM_ID`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }
    }

    static async validateJoinSimilarTable(restClient: any, userId: string, roomId: string, isPractice: boolean): Promise<Room> {
        try {
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validateJoinSimilarTable] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    logger.info(room, `[validateJoinSimilarTable] returned room`)
                    return room
                }
                else {
                    logger.error(`[validateJoinSimilarTable] error INVALID_ROOM_TYPE`)
                    throw AriesServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validateJoinSimilarTable] error INVALID_ROOM_ID`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }
    }

    static async validateQuickJoinGroup(restClient: any, userId: string, groupId: number, isPractice: boolean): Promise<any> {
        try {
            const groups: Group[] = await AriesService.getGroups(restClient, userId);
            logger.info(groups, `[validateQuickJoinGroup] response`)
            const group: Group = groups.find((group: Group) => group?.id == groupId);
            if (group) {
                if (group.isPractice === isPractice) {
                    logger.info(group, `[validateQuickJoinGroup] returned group`)
                    const rooms: Room[] = await AriesService.getRooms(restClient, userId, groupId);
                    logger.info(rooms, `[validateQuickJoinGroup] room response`)
                    const primaryRoom: Room = rooms.find((room: Room) => room?.isPrimary);
                    if (!primaryRoom) {
                        logger.error(`[validateQuickJoinGroup] error PRIMARY_ROOM_NOT_PRESENT`)
                        throw AriesServiceErrorUtil.getPrimaryRoomNotAvailableError();
                    }
                    return {
                        group,
                        primaryRoom
                    }
                }
                else {
                    logger.error(`[validateQuickJoinGroup] error INVALID_GROUP_TYPE`)
                    throw AriesServiceErrorUtil.getInvalidGroupTypeError();
                }
            }
            else {
                logger.error(`[validateQuickJoinGroup] error INVALID_GROUP_ID`)
                throw AriesServiceErrorUtil.getGroupNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }
    }

    static async validateJoinTable(restClient: any, userId: string, joinTableRequest: JoinTableRequest, isPractice: boolean): Promise<Room> {
        try {
            const roomId = joinTableRequest?.roomId
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validateJoinTable] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    return room
                }
                else {
                    logger.error(`[validateJoinTable] error INVALID_ROOM_TYPE`)
                    throw AriesServiceErrorUtil.getInvalidGroupTypeError();
                }
            }
            else {
                logger.error(`[validateJoinTable] error INVALID_ROOM_ID`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }

    }

    static async validateTableResult(restClient: any, userId: string, roomId: string, isPractice: boolean): Promise<Room> {
        try {
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validateTableResult] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    return room
                }
                else {
                    logger.error(`[validateTableResult] error INVALID_ROOM_TYPE`)
                    throw AriesServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validateTableResult] error INVALID_ROOM_ID`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }

    }

    static async validateTablePlayerStats(restClient: any, userId: string, roomId: string, isPractice: boolean): Promise<Room> {
        try {
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validateJoinTable] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    return room
                }
                else {
                    logger.error(`[validateTablePlayerStats] error INVALID_ROOM_TYPE`)
                    throw AriesServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validateTablePlayerStats] error INVALID_ROOM_ID`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }

    }

    static async validatePlayerLeaveTableRequest(restClient: any, userId: string, roomId: string): Promise<Room> {
        try {
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validatePlayerLeaveTableRequest] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                return room;
            }
            else {
                logger.error(`[validatePlayerLeaveTableRequest] error ROOM_NOT_PRESENT`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }
    }

    static async validatePlayerUnreserveTableRequest(restClient: any, userId: string, roomId: string): Promise<Room> {
        try {
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validatePlayerUnreserveTableRequest] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                logger.info(room, `[validatePlayerUnreserveTableRequest] returned room`)
                return room
            }
            else {
                logger.error(`[validatePlayerUnreserveTableRequest] error INVALID_ROOM_ID`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }
    }

    static async validatePlayerSitOut(restClient: any, userId: string, roomId: string, isPractice: boolean): Promise<Room> {
        try {
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validatePlayerSitOut] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    return room
                }
                else {
                    logger.error(`[validatePlayerSitOut] error INVALID_ROOM_TYPE`)
                    throw AriesServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validatePlayerSitOut] error ROOM_NOT_PRESENT`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }

    }

    static async validatePlayerJoinBack(restClient: any, userId: string, roomId: string, isPractice: boolean): Promise<Room> {
        try {
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validatePlayerJoinBack] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    return room
                }
                else {
                    logger.error(`[validatePlayerTopupRequest] error INVALID_ROOM_TYPE`)
                    throw AriesServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validatePlayerJoinBack] error ROOM_NOT_PRESENT`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }

    }

    static async validateTopupRequest(restClient: any, userId: string, roomId: string, isPractice: boolean): Promise<Room> {
        try {
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validateTopupRequest] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    return room
                }
                else {
                    logger.error(`[validateTopupRequest] error INVALID_ROOM_TYPE`)
                    throw AriesServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validateTopupRequest] error ROOM_NOT_PRESENT`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }

    }

    static async validateRebuyRequest(restClient: any, userId: string, roomId: string, isPractice: boolean): Promise<Room> {
        try {
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validateRebuyRequest] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    return room
                }
                else {
                    logger.error(`[validateRebuyRequest] error INVALID_ROOM_TYPE`)
                    throw AriesServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validateRebuyRequest] error ROOM_NOT_PRESENT`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }

    }

    static async validateTablesRequest(restClient: any, userId: string, roomId: string): Promise<Room> {
        try {
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validateTablesRequest] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                return room
            }
            else {
                logger.error(`[validateTablesRequest] error INVALID_ROOM_ID`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }
    }

    static async validateGroupTablesRequest(restClient: any, userId: string, groupId: number): Promise<Group> {
        try {
            const groups: Group[] = await AriesService.getGroups(restClient, userId);
            logger.info(groups, `[validateTablesRequest] response`)
            const group: Group = groups.find((group: Group) => group?.id == groupId);
            if (group) {
                return group
            }
            else {
                logger.error(`[validateGroupTablesRequest] error INVALID_GROUP_ID`)
                throw AriesServiceErrorUtil.getGroupNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }
    }

    static async validateTablePlayersRequest(restClient: any, userId: string, roomId: string): Promise<Room> {
        try {
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validateTablePlayersRequest] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                return room
            }
            else {
                logger.error(`[validateTablePlayersRequest] error INVALID_ROOM_ID`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }
    }

    static async validateOpenTableRequest(restClient: any, userId: string, roomId: string, isPractice: boolean): Promise<Room> {
        try {
            const rooms: Room[] = await AriesService.getRooms(restClient, userId);
            logger.info(rooms, `[validateOpenTableRequest] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room?.isPractice === isPractice) {
                return room
            }
            else {
                logger.error(`[validateOpenTableRequest] error INVALID_ROOM_ID`)
                throw AriesServiceErrorUtil.getRoomNotAvailableError();
            }
        } catch (error) {
            throw AriesClient.wrapError(error)
        }
    }

    //TODO : remove plo6Enabled once full roll out
    static async getRooms(restClient: any, userId: string, groupId?: number): Promise<Room[]> {
        try {
            const response: Array<AriesRoomResponse> = await ApiCacheHelper.getAriesRoomsFromCache(restClient);
            logger.info(`[GetRooms] Aries  response ${JSON.stringify(response)}`)
            const filteredRooms: Array<AriesRoomResponse> = AriesUtil.filterRooms(response, userId, groupId);
            logger.info(`[GetRooms] userId -${userId}, filteredRooms -${JSON.stringify(filteredRooms)}`);
            return AriesUtil.convertRoomResponse(filteredRooms);
        } catch (error) {
            logger.error(error, `[GetRooms] Error`);
            throw AriesClient.wrapError(error);
        }
    }

    static async getGroups(restClient: any, userId: string): Promise<Group[]> {
        try {
            const response: Array<AriesGroupResponse> = await ApiCacheHelper.getAriesGroupsFromCache(restClient);
            logger.info(`[GetGroups] Aries response ${JSON.stringify(response)}`)
            const groups: Group[] = AriesUtil.convertGroupResponse(response);
            return groups;
        } catch (error) {
            logger.error(error, `[GetGroups] Error`);
            throw AriesClient.wrapError(error);
        }
    }

    static async joinTable(restClient: any, tableId: string, joinTableRequest: JoinTableRequest, userId: string, vendorId: string): Promise<JoinTable> {
        try {
            const [idmResp, zodiacResp] = await (Promise as any).allSettled([
                IDMService.getUserDetails(restClient, `${userId}`, vendorId),
                ZodiacService.getUserGameplaySettings(restClient, `${vendorId}_${userId}`)
            ])

            const userDetails: IDMUserProfile = idmResp.status === PROMISE_STATUS.FULFILLED ? idmResp.value : {};
            let isChatBan: boolean = IdmUtil.getChatBan(userDetails);

            const userGameplaySettings: UserGameplaySettings = zodiacResp.status === PROMISE_STATUS.FULFILLED ? zodiacResp.value : {};
            const userBetSettings = userGameplaySettings?.bet_settings;
            const userGameSettings = userGameplaySettings?.game_settings;
            const autoTopUpSetting = userGameplaySettings?.auto_top_up_setting;
            logger.info(`[JoinTable] userGameSettings ${JSON.stringify(userGameSettings)}`)
            logger.info(`[JoinTable] autoTopUpSetting ${JSON.stringify(autoTopUpSetting)}`)
            const autoPostBBValue = userGameSettings && userGameSettings.filter((gameSetting) => gameSetting?.setting === UserGameSettingType.AUTO_POST_BB)[0]?.value;
            logger.info(`[JoinTable] autoPostBBValue ${JSON.stringify(autoPostBBValue)}`)

            const userAutoTopUpSetting: UserAutoTopUpSetting = {
                setting: autoTopUpSetting?.setting,
                enableAutoTopUp: autoTopUpSetting?.value,
                topUpThresholdPrecentage: autoTopUpSetting?.config?.topUpThresholdPrecentage,
                topUpStackPercentage: autoTopUpSetting?.config?.topUpStackPercentage
            };
            logger.info(`[JoinTable] userAutoTopUpSetting ${JSON.stringify(userAutoTopUpSetting)}`)

            //TODO : check for user Pan hash and check for ipAddress too
            const ariesUser: AriesUser = {
                id: Number(userId),
                vendorId: Number(vendorId),
                betSettings: userBetSettings,
                enablePostBB: autoPostBBValue,
                isChatBan: isChatBan,
                autoTopUpSetting: userAutoTopUpSetting
            }
            const sitAtTableRequestData: AriesJoinTableRequest = {
                tableId: `${tableId}`,
                buyInAmount: CurrencyUtil.getAmountInPaisa(joinTableRequest?.amount),
                user: ariesUser,
                isChatBan,
            }
            const response: AriesJoinTableResponse = await AriesClient.sitAtTable(restClient, sitAtTableRequestData);
            logger.info(`[JoinTable] AriesResponse ${JSON.stringify(response)}`)
            const joinTableResponse: JoinTable = JoinTable.convertAriesResponse(response);
            logger.info(`[JoinTable] transformedAriesResponse ${JSON.stringify(joinTableResponse)}`)
            return joinTableResponse;
        } catch (error) {
            logger.error(error, `[JoinTable] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async leaveTable(restClient: any, tableId: string, userId: string, vendorId: string): Promise<PlayerLeaveTable> {
        try {
            const ariesUser: AriesUser = {
                id: Number(userId),
                vendorId: Number(vendorId)
            }
            const leaveTableRequestData: AriesLeaveTableRequest = {
                tableId: `${tableId}`,
                user: ariesUser
            }
            const response: AriesLeaveTableResponse = await AriesClient.leaveTable(restClient, leaveTableRequestData);
            logger.info(`[leaveTable] AriesResponse ${JSON.stringify(response)}`)
            const leaveTableResponse: PlayerLeaveTable = PlayerLeaveTable.convertAriesResponse(response, tableId);
            logger.info(`[leaveTable] transformedAriesResponse ${JSON.stringify(leaveTableResponse)}`)
            return leaveTableResponse;
        } catch (error) {
            logger.error(error, `[leaveTable] error `)
            throw AriesClient.wrapError(error);
        }
    }


    static async tournamentLeaveTable(restClient: any,tournamentId: number, userId: string, vendorId: string, tableId?: string): Promise<PlayerLeaveTable> {
        try {
            const ariesUser: AriesUser = {
                id: Number(userId),
                vendorId: Number(vendorId)
            }
            const leaveTableRequestData: TournamentLeaveTableRequest = {
                tableId: tableId,
                user: ariesUser,
                tournamentId: tournamentId
            }
            const response: AriesLeaveTableResponse = await AriesTournamentClient.tournamentLeaveTable(restClient, leaveTableRequestData);
            logger.info(`[leaveTable] AriesResponse ${JSON.stringify(response)}`)
            const leaveTableResponse: PlayerLeaveTable = PlayerLeaveTable.convertAriesResponse(response, tableId);
            logger.info(`[leaveTable] transformedAriesResponse ${JSON.stringify(leaveTableResponse)}`)
            return leaveTableResponse;
        } catch (error) {
            logger.error(error, `[leaveTable] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async playerUnreserveRoom(restClient: any, tableId: string, userId: string, vendorId: string): Promise<boolean> {
        try {
            const ariesUser: AriesUser = {
                id: Number(userId),
                vendorId: Number(vendorId)
            }
            const unReserveRoomRequestData: AriesUnReserveRoomRequest = {
                tableId: `${tableId}`,
                user: ariesUser
            }
            const response: boolean = await AriesClient.unReserveRoom(restClient, unReserveRoomRequestData);
            logger.info(`[UnreserveRoom] AriesResponse ${JSON.stringify(response)}`)
            return response;
        } catch (error) {
            logger.error(error, `[UnreserveRoom] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async getRoomTables(restClient: any, roomId: string): Promise<Table[]> {
        try {
            const response: RoomTables[] = await AriesClient.getRoomTables(restClient, roomId);
            logger.info(`[RoomTables] AriesResponse ${JSON.stringify(response)}`)
            const roomTablesResponse: Table[] = AriesUtil.getTableFromResponse(response);
            logger.info(`[RoomTables] transformedAriesResponse ${JSON.stringify(roomTablesResponse)}`)
            return roomTablesResponse;
        } catch (error) {
            logger.error(error, `[RoomTables] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async getGroupTables(restClient: any, groupId: number, userId: string): Promise<TableDetails[]> {
        try {
            const response: GroupTables[] = await ApiCacheHelper.getAriesGroupTablesFromCache(restClient, groupId);
            logger.info(`[getGroupTables] AriesResponse ${JSON.stringify(response)}`);
            const filterGroupTables: GroupTables[] = AriesUtil.filterGroupTables(response, userId);
            return AriesUtil.getGroupTableFromResponse(filterGroupTables);
        } catch (error) {
            logger.error(error, `[getGroupTables] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async getTablePlayerDetails(restClient: any, tableId: string): Promise<TablePlayersDetails> {
        try {
            const response: AriesTablePlayersResponse = await AriesClient.getTablePlayerDetails(restClient, tableId);
            logger.info(`[getTablePlayerDetails] AriesResponse ${JSON.stringify(response)}`)
            const resp: TablePlayersDetails = TablePlayersDetails.convertAriesResponse(response);
            logger.info(`[getTablePlayerDetails] transformedAriesResponse ${JSON.stringify(resp)}`)
            return resp;
        } catch (error) {
            logger.error(error, `[getTablePlayerDetails] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async reserveRoom(restClient: any, userId: string, reserveRoomDetails: ReserveRoomDetails, roomInfo: Room): Promise<ReserveRoom> {
        try {
            const userKycFilter: UserKycFilter = getUserKYCFilterForAries();
            const vendorId: number = reserveRoomDetails?.vendorId;
            logger.info(`[ReserveRooms] userKYCFilter -${JSON.stringify(userKycFilter)}, vendorId-${vendorId}`);
            const [userDetailsPromise, keyDetailsPromise, walletPromise, betSettingsPromise] = await (Promise as any).allSettled([
                IDMService.getUserDetails(restClient, `${userId}`, `${vendorId}`),
                GuardianService.getUserKycDetails(`${userId}`, userKycFilter, restClient, `${vendorId}`, true),
                SupernovaService.reserveSeatEligibility(restClient, userId, `${vendorId}`, roomInfo, reserveRoomDetails?.appType),
                ZodiacService.getUserGameplaySettings(restClient, `${vendorId}_${userId}`),
            ]);
            //Check for GamePlayBan
            if (userDetailsPromise.status === PROMISE_STATUS.REJECTED) {
                throw userDetailsPromise.reason;
            }
            if (keyDetailsPromise.status === PROMISE_STATUS.REJECTED) {
                throw keyDetailsPromise.reason;
            }

            if (walletPromise.status === PROMISE_STATUS.REJECTED) {
                throw walletPromise.reason;
            }

            const userDetails: IDMUserProfile = userDetailsPromise.value;
            const kycDetails: UserKycDetails = keyDetailsPromise.value;
            const userGameplaySettings: UserGameplaySettings = betSettingsPromise.status === PROMISE_STATUS.FULFILLED ? betSettingsPromise.value : null;
            const isGamePlayBan: boolean = IdmUtil.getGameplayBan(userDetails);
            if (reserveRoomDetails?.roomType == RoomType.CASH && isGamePlayBan) {
                throw AriesServiceErrorUtil.getGameplayBannedError();
            }
            // get pan details
            const panDetails: PanDetails = getUserPanDetails(kycDetails);
            //get reserveRoomRequest

            const reserveRoomRequest: ReserveRoomRequest = AriesUtil.getReserveRoomRequest(userId, reserveRoomDetails, panDetails, userDetails, userGameplaySettings);
            const response: AriesReserveRoomResponse = await AriesClient.reserveRoom(restClient, reserveRoomRequest);
            logger.info(`[ReserveRooms] AriesResponse ${JSON.stringify(response)}`)
            const reserveRoom: ReserveRoom = ReserveRoom.convertAriesResponse(response);
            logger.info(`[ReserveRooms] transformedAriesResponse ${JSON.stringify(reserveRoom)}`)
            return reserveRoom;
        } catch (error) {
            logger.error(error, `[ReserveRooms] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async reserveSeat(restClient: any, tableId: string, userId: string, reserveSeatDetails: ReserveSeatDetails, roomInfo: Room): Promise<ReserveSeat> {
        try {
            const userKycFilter: UserKycFilter = getUserKYCFilterForAries();
            const vendorId: number = reserveSeatDetails?.vendorId;
            logger.info(`[reserveSeat] userKYCFilter -${JSON.stringify(userKycFilter)}, vendorId-${vendorId} tableId-${tableId} userId-${userId} reserveSeatDetails-${JSON.stringify(reserveSeatDetails)}`);
            const [userDetailsPromise, keyDetailsPromise, walletPromise, betSettingsPromise] = await (Promise as any).allSettled([
                IDMService.getUserDetails(restClient, `${userId}`, `${vendorId}`),
                GuardianService.getUserKycDetails(`${userId}`, userKycFilter, restClient, `${vendorId}`, true),
                SupernovaService.reserveSeatEligibility(restClient, userId, `${vendorId}`, roomInfo, reserveSeatDetails?.appType),
                ZodiacService.getUserGameplaySettings(restClient, `${vendorId}_${userId}`),
            ]);

            if (userDetailsPromise.status === PROMISE_STATUS.REJECTED) {
                throw userDetailsPromise.reason;
            }
            if (keyDetailsPromise.status === PROMISE_STATUS.REJECTED) {
                throw keyDetailsPromise.reason;
            }
            if (walletPromise.status === PROMISE_STATUS.REJECTED) {
                throw walletPromise.reason;
            }


            const userDetails: IDMUserProfile = userDetailsPromise.value;
            const kycDetails: UserKycDetails = keyDetailsPromise.value;
            const userGameplaySettings: UserGameplaySettings = betSettingsPromise.status === PROMISE_STATUS.FULFILLED ? betSettingsPromise.value : {};
            //Check for GamePlayBan
            const isGamePlayBan: boolean = IdmUtil.getGameplayBan(userDetails);
            if (reserveSeatDetails?.roomType == RoomType.CASH && isGamePlayBan) {
                throw AriesServiceErrorUtil.getGameplayBannedError();
            }
            // get pan details
            const panDetails: PanDetails = getUserPanDetails(kycDetails);
            //get reserveRoomRequest
            const reserveSeatRequest: ReserveSeatRequest = AriesUtil.getReserveSeatRequest(userId, reserveSeatDetails, panDetails, userDetails, userGameplaySettings);
            const response: ReserveSeatResponse = await AriesClient.reserveSeat(restClient, tableId, reserveSeatRequest);
            logger.info(`[ReserveSeat] AriesResponse ${JSON.stringify(response)}`)
            const reserveSeat: ReserveSeat = ReserveSeat.convertAriesResponse(response);
            logger.info(`[ReserveSeat] transformedAriesResponse ${JSON.stringify(reserveSeat)}`)
            return reserveSeat;
        } catch (error) {
            logger.error(error, `[ReserveSeat] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async quickJoinGroup(restClient: any, userId: string, quickJoinGroupDetails: QuickJoinGroupDetails, roomInfo: Room): Promise<QuickJoinGroup> {
        try {
            const userKycFilter: UserKycFilter = getUserKYCFilterForAries();
            const vendorId: number = quickJoinGroupDetails?.vendorId;
            logger.info(`[QuickJoinGroup] userKYCFilter -${JSON.stringify(userKycFilter)}, vendorId-${vendorId}`);
            const [userDetailsPromise, keyDetailsPromise, walletPromise, betSettingsPromise] = await (Promise as any).allSettled([
                IDMService.getUserDetails(restClient, `${userId}`, `${vendorId}`),
                GuardianService.getUserKycDetails(`${userId}`, userKycFilter, restClient, `${vendorId}`, true),
                SupernovaService.reserveSeatEligibility(restClient, userId, `${vendorId}`, roomInfo, quickJoinGroupDetails?.appType),
                ZodiacService.getUserGameplaySettings(restClient, `${vendorId}_${userId}`),
            ]);

            if (userDetailsPromise.status === PROMISE_STATUS.REJECTED) {
                throw userDetailsPromise.reason;
            }
            if (keyDetailsPromise.status === PROMISE_STATUS.REJECTED) {
                throw keyDetailsPromise.reason;
            }
            if (walletPromise.status === PROMISE_STATUS.REJECTED) {
                throw walletPromise.reason;
            }

            const userDetails: IDMUserProfile = userDetailsPromise.value;
            const kycDetails: UserKycDetails = keyDetailsPromise.value;
            const userGameplaySettings: UserGameplaySettings = betSettingsPromise.status === PROMISE_STATUS.FULFILLED ? betSettingsPromise.value : {};
            //Check for GamePlayBan
            const isGamePlayBan: boolean = IdmUtil.getGameplayBan(userDetails);
            if (!quickJoinGroupDetails?.isPractice && isGamePlayBan) {
                throw AriesServiceErrorUtil.getGameplayBannedError();
            }
            // get pan details
            const panDetails: PanDetails = getUserPanDetails(kycDetails);
            //get quickJoinGroupRequest
            const quickJoinRequest: QuickJoinGroupRequest = AriesUtil.getQuickJoinGroupRequest(userId, quickJoinGroupDetails, panDetails, userDetails, userGameplaySettings);
            const response: QuickJoinGroupResponse = await AriesClient.quickJoinGroup(restClient, quickJoinRequest);
            logger.info(`[QuickJoinGroup] AriesResponse ${JSON.stringify(response)}`)
            const quickJoinResponse: QuickJoinGroup = QuickJoinGroup.convertAriesResponse(response);
            logger.info(`[QuickJoinGroup] transformedAriesResponse ${JSON.stringify(quickJoinResponse)}`)
            return quickJoinResponse;
        } catch (error) {
            logger.error(error, `[QuickJoinGroup] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async joinSimilarTable(restClient: any, roomId: number, userId: string, joinSimilarTableDetails: JoinSimilarTableDetails, roomInfo: Room): Promise<JoinSimilarTable> {
        try {
            const userKycFilter: UserKycFilter = getUserKYCFilterForAries();
            const vendorId: number = joinSimilarTableDetails?.vendorId;
            logger.info(`[joinSimilarTable] userKYCFilter -${JSON.stringify(userKycFilter)}, vendorId-${vendorId}`);
            const [userDetailsPromise, keyDetailsPromise, walletPromise, betSettingsPromise] = await (Promise as any).allSettled([
                IDMService.getUserDetails(restClient, `${userId}`, `${vendorId}`),
                GuardianService.getUserKycDetails(`${userId}`, userKycFilter, restClient, `${vendorId}`, true),
                SupernovaService.reserveSeatEligibility(restClient, userId, `${vendorId}`, roomInfo, joinSimilarTableDetails?.appType),
                ZodiacService.getUserGameplaySettings(restClient, `${vendorId}_${userId}`),
            ]);

            if (userDetailsPromise.status === PROMISE_STATUS.REJECTED) {
                throw userDetailsPromise.reason;
            }
            if (keyDetailsPromise.status === PROMISE_STATUS.REJECTED) {
                throw keyDetailsPromise.reason;
            }
            if (walletPromise.status === PROMISE_STATUS.REJECTED) {
                throw walletPromise.reason;
            }

            const userDetails: IDMUserProfile = userDetailsPromise.value;
            const kycDetails: UserKycDetails = keyDetailsPromise.value;
            const userGameplaySettings: UserGameplaySettings = betSettingsPromise.status === PROMISE_STATUS.FULFILLED ? betSettingsPromise.value : {};
            //Check for GamePlayBan
            const isGamePlayBan: boolean = IdmUtil.getGameplayBan(userDetails);
            if (joinSimilarTableDetails?.roomType == RoomType.CASH && isGamePlayBan) {
                throw AriesServiceErrorUtil.getGameplayBannedError();
            }
            // get pan details
            const panDetails: PanDetails = getUserPanDetails(kycDetails);
            //get joinSimilarTableRequest
            const joinSimilarTableRequest: JoinSimilarTableRequest = AriesUtil.getJoinSimilarTableRequest(userId, joinSimilarTableDetails, panDetails, userDetails, userGameplaySettings);
            const response: JoinSimilarTableResponse = await AriesClient.joinSimilarTable(restClient, joinSimilarTableRequest);
            logger.info(`[joinSimilarTable] AriesResponse ${JSON.stringify(response)}`)
            const reserveRoom: JoinSimilarTable = JoinSimilarTable.convertAriesResponse(response);
            logger.info(`[joinSimilarTable] transformedAriesResponse ${JSON.stringify(reserveRoom)}`)
            return reserveRoom;
        } catch (error) {
            logger.error(error, `[joinSimilarTable] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async playerSitOut(restClient: any, tableId: string, userId: string, enableSitOut: boolean): Promise<boolean> {
        try {
            const sitOutRequestData: SitOutRequest = {
                tableId: `${tableId}`,
                userId: Number(userId),
                enableSitOut: enableSitOut
            }
            const response: boolean = await AriesClient.sitOut(restClient, sitOutRequestData);
            logger.info(`[SitOut] AriesResponse ${JSON.stringify(response)}`)
            return response;
        } catch (error) {
            logger.error(error, `[SitOut] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async playerTournamentTableSitOut(restClient: any, tournamentId: number, userId: string, enableSitOut: boolean): Promise<boolean> {
        try {
            const sitOutRequestData: SitOutRequest = {
                tournamentId: `${tournamentId}`,
                userId: Number(userId),
                enableSitOut: enableSitOut
            }
            const response: boolean = await AriesTournamentClient.playerTournamentTableSitOut(restClient, sitOutRequestData);
            logger.info(`[playerTournamentTableSitOut] AriesResponse ${JSON.stringify(response)}`)
            return response;
        } catch (error) {
            logger.error(error, `[playerTournamentTableSitOut] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async playerJoinBack(restClient: any, tableId: string, userId: string): Promise<PlayerJoinBack> {
        try {
            const joinBackRequestData: JoinBackRequest = {
                tableId: `${tableId}`,
                userId: Number(userId)
            }
            const response: PlayerJoinBackResponse = await AriesClient.joinBack(restClient, joinBackRequestData);
            logger.info(`[JoinBack] AriesResponse ${JSON.stringify(response)}`)
            const joinBack: PlayerJoinBack = PlayerJoinBack.convertAriesResponse(response);
            logger.info(`[JoinBack] transformedAriesResponse ${JSON.stringify(joinBack)}`)
            return joinBack;
        } catch (error) {
            logger.error(error, `[JoinBack] error `)
            throw AriesClient.wrapError(error);
        }
    }


    static async playerTournamentTableJoinBack(restClient: any, tournamentId: number, userId: string): Promise<PlayerJoinBack> {
        try {
            const joinBackRequestData: TournamentJoinBackRequest = {
                tournamentId: tournamentId,
                userId: Number(userId)
            }
            const response: PlayerJoinBackResponse = await AriesTournamentClient.tournamentTablejoinBack(restClient, joinBackRequestData);
            logger.info(`[playerTournamentTableJoinBack] AriesResponse ${JSON.stringify(response)}`)
            const joinBack: PlayerJoinBack = PlayerJoinBack.convertAriesResponse(response);
            logger.info(`[playerTournamentTableJoinBack] transformedAriesResponse ${JSON.stringify(joinBack)}`)
            return joinBack;
        } catch (error) {
            logger.error(error, `[JoinBack] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async getPracticeTableResult(restClient: any, tableId: string, userId: string): Promise<TableResultResponse> {
        try {
            const resp: TableResultResponse = await AriesClient.getPracticeTableResult(restClient, tableId);
            logger.info(`[getPracticeTableResult] AriesResponse ${JSON.stringify(resp)}`)
            const tableResult: TableResult = TableResult.convertAriesResponse(resp, userId);
            logger.info(`[getPracticeTableResult] transformedAriesResponse ${JSON.stringify(tableResult)}`)
            return tableResult;
        } catch (error) {
            logger.error(error, `[getPracticeTableResult] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async getCashTableResult(restClient: any, tableId: string, userId: string): Promise<TableResultResponse> {
        try {
            const resp: TableResultResponse = await AriesClient.getCashTableResult(restClient, tableId);
            logger.info(`[getCashTableResult] AriesResponse ${JSON.stringify(resp)}`)
            const tableResult: TableResult = TableResult.convertAriesResponse(resp, userId);
            logger.info(`[getPracticeTableResult] transformedAriesResponse ${JSON.stringify(tableResult)}`)
            return tableResult;
        } catch (error) {
            logger.error(error, `[getCashTableResult] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async getPlayerDetails(restClient: any, userId: string, tableId: number): Promise<any> {
        try {
            logger.info(`[AriesService] [getPlayerDetails] userId :: ${userId} tableId :: ${tableId}`);
            const playerDetailsResponse = await AriesClient.getPlayerDetails(restClient, userId, tableId);
            logger.info(`[AriesService] [getPlayerDetails] userId :: ${userId} tableId :: ${tableId} playerDetailsResponse :: ${JSON.stringify(playerDetailsResponse)}`);
            return playerDetailsResponse;
        } catch (error) {
            logger.error(`[AriesService] [getPlayerDetails] userId :: ${userId} tableId :: ${tableId}`);
            throw error;
        }
    }

    static async getPracticeTablePlayerStats(restClient: any, tableId: string, userId: string): Promise<TablePlayerStatsResponse> {
        try {
            const resp: TablePlayerStatsResponse = await AriesClient.getPracticeTablePlayerStats(restClient, tableId, userId);
            logger.info(`[getPracticeTablePlayerStats] AriesResponse ${JSON.stringify(resp)}`)
            return resp;
        } catch (error) {
            logger.error(error, `[getPracticeTablePlayerStats] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async getCashTablePlayerStats(restClient: any, tableId: string, userId: string): Promise<TablePlayerStatsResponse> {
        try {
            const resp: TablePlayerStatsResponse = await AriesClient.getCashTablePlayerStats(restClient, tableId, userId);
            logger.info(`[getCashTablePlayerStats] AriesResponse ${JSON.stringify(resp)}`)
            return resp;
        } catch (error) {
            logger.error(error, `[getCashTablePlayerStats] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async updateUserBetSettings(restClient: any, userId: string, request: UpdateUserBetSettingsPayload): Promise<any> {
        // Have to Change the Response Type
        try {
            const response: UpdateBetSettingsResponse = await AriesClient.updateUserBetSettings(restClient, userId, request);
            logger.info(`[AriesService] [updateUserBetSettings] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[AriesService] [updateUserBetSettings] Failed`);
            throw error;
        }
    }

    static async updateUserEnablePostBB(restClient: any, userId: string, request: UpdateUserGameSettingsPayload): Promise<any> {
        // Have to Change the Response Type
        try {
            const enablePostBB = request?.settings?.filter((gameSetting) => gameSetting?.setting === UserGameSettingType.AUTO_POST_BB)[0]?.value;
            const response: UpdateEnablePostBBResponse = await AriesClient.updateUserEnablePostBB(restClient, userId, {enablePostBB: enablePostBB});
            logger.info(`[AriesService] [updateUserEnablePostBB] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[AriesService] [updateUserEnablePostBB] Failed`);
            throw error;
        }
    }

    static async updateUserAutoTopUpSetting(restClient: any, userId: string, request: UpdateUserAutoTopUpSetting): Promise<any> {
        try {
            const response: UpdateAutoTopUpSettingsResponse = await AriesClient.updateUserAutoTopUpSettings(restClient, userId, request);
            logger.info(`[AriesService] [updateUserAutoTopUpSetting] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[AriesService] [updateUserAutoTopUpSetting] Failed`);
            throw error;
        }
    }

    static async topupDetails(restClient: any, tableId: string, userId: string, vendorId: string): Promise<TopupValue> {
        try {
            const topupDetailsRequest: TopupDetailsRequest = {
                tableId: Parser.parseNumber(tableId),
                userId: Number(userId),
            }
            const response: AriesTopupDetailsResponse = await AriesClient.getTopupDetails(restClient, topupDetailsRequest);
            logger.info(`[topupDetails] AriesResponse ${JSON.stringify(response)}`)
            const topupValue: TopupValue = TopupValue.convertAriesResponse(response);
            logger.info(`[topupDetails] transformedAriesResponse ${JSON.stringify(topupValue)}`)
            return topupValue;
        } catch (error) {
            logger.error(error, `[topupDetails] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async topupRequest(restClient: any, tableId: string, userId: string, vendorId: string, amount: number): Promise<PlayerTopup> {
        try {
            const topupDetailsRequest: TopupRequest = {
                tableId: Parser.parseNumber(tableId),
                userId: Number(userId),
                amount: CurrencyUtil.getAmountInPaisa(amount),
            }
            const response: AriesTopupResponse = await AriesClient.topupRequest(restClient, topupDetailsRequest);
            logger.info(`[topupDetails] AriesResponse ${JSON.stringify(response)}`)
            const playerTopup: PlayerTopup = PlayerTopup.convertAriesResponse(response);
            logger.info(`[topupDetails] transformedAriesResponse ${JSON.stringify(playerTopup)}`)
            return playerTopup;
        } catch (error) {
            logger.error(error, `[topupDetails] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async playerRebuyRequest(restClient: any, tableId: string, userId: string, request: PlayerRebuyRequest, vendorId: string): Promise<PlayerRebuy> {
        try {
            const rebuyRequest: RebuyRequest = {
                tableId: Parser.parseNumber(tableId),
                userId: Number(userId),
                rebuyAmount: CurrencyUtil.getAmountInPaisa(request.amount),
            }
            const response: AriesRebuyResponse = await AriesClient.rebuyRequest(restClient, rebuyRequest);
            logger.info(`[topupDetails] AriesResponse ${JSON.stringify(response)}`)
            const playerRebuy: PlayerRebuy = PlayerRebuy.convertAriesResponse(response, tableId);
            logger.info(`[topupDetails] transformedAriesResponse ${JSON.stringify(playerRebuy)}`)
            return playerRebuy;
        } catch (error) {
            logger.error(error, `[topupDetails] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async getActiveRoomByStake(restClient: any, stake: string): Promise<ActiveRoomByStake> {
        try {
            const response: ActiveRoomByStake = await AriesClient.getActiveRoomByStake(restClient, stake);
            logger.info(`[topupDetails] AriesResponse ${JSON.stringify(response)}`)
            return response;
        } catch (error) {
            logger.error(error, `[getActiveRoomByStake] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async getPlayerActiveTableByRoom(restClient: any, userId: string, roomIds: Array<string>): Promise<RoomTables[]> {
        try {
            const response: RoomTables[] = await AriesClient.getPlayerActiveTableByRoom(restClient, userId, roomIds.join(","));
            logger.info(`[getPlayerActiveTableByRoom] AriesResponse ${JSON.stringify(response)}`)
            return response;
        } catch (error) {
            logger.error(error, `[getPlayerActiveTableByRoom] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async openTable(restClient: any, tableId: string, userId: string, vendorId: string, isPractice: boolean): Promise<any> {
        try {
            const userDetails: IDMUserProfile = await IDMService.getUserDetails(restClient, `${userId}`, vendorId);
            let isGamePlayBan: boolean = false;
            if (!isPractice) {
                isGamePlayBan = IdmUtil.getGameplayBan(userDetails);
                if (isGamePlayBan) {
                    throw AriesServiceErrorUtil.getGameplayBannedError();
                }
            }
            const openTableRequest: OpenTableRequest = {
                userId: Number(userId),
            }
            const response: any = await AriesClient.openTable(restClient, tableId, openTableRequest);
            logger.info(`[openTable] AriesResponse ${JSON.stringify(response)}`)
            return response;
        } catch (error) {
            logger.error(error, `[openTable] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async getTableDetails(restClient: any, tableId: string): Promise<TableMetaAndSeatDetails> {
        try {
            const response: AriesTableMetaAndSeatDetails = await AriesClient.getTableDetails(restClient, tableId);
            logger.info(`[getTableDetails] AriesResponse ${JSON.stringify(response)}`)
            return TableMetaAndSeatDetails.convertAriesResponse(response)
        } catch (error) {
            logger.error(error, `[getTableDetails] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async getGroupIdsFromRoomIds(restClient: any, roomIds: Array<string>): Promise<Array<any>> {
        try {
            const response: any = await AriesClient.getGroupIdsFromRoomIds(restClient, roomIds.join(','));
            logger.info(`[getGroupIdsFromRoomIds] AriesResponse ${JSON.stringify(response)}`)
            return response.groupIdsMapping;
        } catch (error) {
            logger.error(error, `[getTableDetails] error `)
            throw AriesClient.wrapError(error);
        }
    }

    static async getPlayerTournamentTableId(restClient: any, userId: number, tournamentId: string, playerStatusResponse: PlayerTournamentStatus, tournamentStatus: TournamentStatusAries): Promise<number|undefined> {
        try{
            logger.info(`[getPlayerTournamentStatus] userId - ${userId}, tournamentId - ${tournamentId}, playerStatusResponse - ${playerStatusResponse}, tournamentStatus - ${tournamentStatus}`)
            if (playerStatusResponse == PlayerTournamentStatus.REGISTERED && (tournamentStatus === TournamentStatusAries.SEAT_ALLOCATION || tournamentStatus === TournamentStatusAries.LATE_REGISTRATION)) {
                const userTournamentTableDetails: Array<UserTournamentTableDetails> = await AriesTournamentClient.getPlayerTournamentTablesDetails(restClient, userId, [Number(tournamentId)]);
                logger.info(`[getPlayerTournamentStatus] userTournamentTableDetails - ${JSON.stringify(userTournamentTableDetails)}`)
                const tableId: number | undefined = userTournamentTableDetails.find((userTournamentTableDetail) => userTournamentTableDetail.tournamentId === Number(tournamentId))?.tableId;
                logger.info(`[getPlayerTournamentStatus] tableId - ${tableId}`)
                return tableId;
            }
            return undefined
        } catch (error) {
            logger.error(error, `[getPlayerTournamentStatus] error `)
            throw AriesClient.wrapError(error);
        }

    }
}
