import {Room} from "../models/room";
import {GsCommand} from "../models/enums/gs-command";
import {RoomResponse} from "../models/game-server/room-response";
import {GsRequestPayload} from "../models/request/gs/request";
import GsUtil from "../utils/gs-util";
import GsServiceErrorUtil from "../errors/gs/gs-error-util";
import {ReserveRoomRequestData} from "../models/request/gs/reserve-room-request-data";
import LoggerUtil, {ILogger} from "../utils/logger";
import {ReserveRoomResponse} from "../models/game-server/reserve-room";
import {ReserveRoom} from "../models/reserve-room";
import {JoinTableRequest} from "../models/request/join-table-request";
import {SitAtTableRequestData} from "../models/request/gs/sit-at-table-request-data";
import {JoinTableResponse} from "../models/game-server/join-table";
import {JoinTable} from "../models/join-table";
import {PlayerTopupRequest} from "../models/request/player-topup-request";
import {TopupRequestData} from "../models/request/gs/top-up-request-data";
import {PlayerTopupRequestResponse} from "../models/game-server/player-topup-request";
import {PlayerTopup} from "../models/player-topup";
import {PlayerRebuyRequest} from "../models/request/player-rebuy-request";
import {PlayerRebuy} from "../models/player-rebuy";
import {RebuyRequestData} from "../models/request/gs/rebuy-request-data";
import {PlayerRebuyRequestResponse} from "../models/game-server/player-rebuy-request";
import {PlayerJoinBackResponse} from "../models/game-server/player-join-back";
import {PlayerJoinBack} from "../models/player-join-back";
import {PlayerLeaveTable} from "../models/player-leave-table";
import {PlayerLeaveTableResponse} from "../models/game-server/player-leave-table";
import {PlayerUnreserveRoomRequestData} from "../models/request/gs/unreserve-room-data";
import {TopupValueResponse} from "../models/game-server/topup-values";
import {TopupValue} from "../models/topup-value";
import GsClient from '../clients/gsClient';
import {TournamentBlindStructureResp} from "../models/game-server/tournament-blind-structure";
import {TournamentBlindStructure} from "../models/tournament-blind-structure";
import {TournamentDetailsResponse} from "../models/game-server/tournament-details";
import {TournamentDetails} from "../models/tournament-details";
import {PlayerTournamentRegisterData} from "../models/request/gs/player-tournament-register-data";
import {PlayerTournamentRegisterRequest} from "../models/request/player-tournament-register-request";
import {PlayerTournamentStatusData} from "../models/request/gs/player-tournament-status-data";
import {PlayerMTTListResponse} from "../models/game-server/player-mtt-list";
import {PlayerMTTList, PlayerTournamentData} from "../models/player-mtt-list";
import {TournamentResponse, TournamentResponseV3} from "../models/game-server/mtt-list";
import {Tournament} from "../models/tournament";
import {MTTListRequestData} from "../models/request/gs/mtt-list-request-data";
import {RoomTablesRequestData} from "../models/request/gs/room-tables-request";
import {TableResponse} from "../models/game-server/TableResponse";
import {Table} from "../models/cash-table";
import {TablePlayersDetails} from "../models/cash-table-player-details";
import {CashTablePlayerDetails} from "../models/request/gs/cash-table-player-request";
import {TablePlayersResponse} from "../models/game-server/table-player-response";
import {TournamentEntryDetailsRequest} from "../models/request/gs/tournament-entry-details-request";
import {TournamentEntryDetails} from "../models/game-server/tournament-entry-details";
import {RecommendedRoomRequest} from "../models/request/gs/recommended-room-request";
import IDMService from "./idmService";
import IdmUtil from "../utils/idm-utils";
import { RoomType } from "../models/enums/room-type";

const logger: ILogger = LoggerUtil.get("GsService");


export class GsService {

    static getGsRequestPayload(command: GsCommand, data?: any): GsRequestPayload {
        return {
            command: command,
            data: data || {}
        }

    }

    static async validateReserveRoom(restClient: any, roomId: string, isPractice: boolean, token: string, vendorId: string): Promise<Room> {
        try {
            const rooms: Room[] = await GsService.getRooms(restClient, token, vendorId);
            logger.info(rooms, `[validateReserveRoom] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    logger.info(room, `[validateReserveRoom] returned room`)
                    return room
                }
                else {
                    logger.error(`[validateReserveRoom] error INVALID_ROOM_TYPE`)
                    throw GsServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validateReserveRoom] error INVALID_ROOM_ID`)
                throw GsServiceErrorUtil.getHallwayRoomNotAvailableError();
            }
        } catch (error) {
            throw GsClient.wrapError(error)
        }
    }

    static async validateTablesRequest(restClient: any, roomId: string, token: string, vendorId: string): Promise<Room> {
        try {
            const rooms: Room[] = await GsService.getRooms(restClient, token, vendorId);
            logger.info(rooms, `[validateTablesRequest] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                return room
            }
            else {
                logger.error(`[validateTablesRequest] error INVALID_ROOM_ID`)
                throw GsServiceErrorUtil.getHallwayRoomNotAvailableError();
            }
        } catch (error) {
            throw GsClient.wrapError(error)
        }
    }

    static async validateJoinTable(restClient: any, joinTableRequest: JoinTableRequest, isPractice: boolean, token: string, vendorId: string): Promise<Room> {
        try {
            const roomId = joinTableRequest?.roomId
            const rooms: Room[] = await GsService.getRooms(restClient, token, vendorId);
            logger.info(rooms, `[validateJoinTable] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    return room
                }
                else {
                    logger.error(`[validateJoinTable] error INVALID_ROOM_TYPE`)
                    throw GsServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validateJoinTable] error INVALID_ROOM_ID`)
                throw GsServiceErrorUtil.getHallwayRoomNotAvailableError();
            }
        } catch (error) {
            throw GsClient.wrapError(error)
        }

    }

    static async validatePlayerTopupRequest(restClient: any, topupRequest: PlayerTopupRequest, isPractice: boolean, token: string, vendorId: string): Promise<Room> {
        try {
            const roomId = topupRequest?.roomId
            const rooms: Room[] = await GsService.getRooms(restClient, token, vendorId);
            logger.info(rooms, `[validatePlayerTopupRequest] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    return room
                }
                else {
                    logger.error(`[validatePlayerTopupRequest] error INVALID_ROOM_TYPE`)
                    throw GsServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validatePlayerTopupRequest] error ROOM_NOT_PRESENT`)
                throw GsServiceErrorUtil.getHallwayRoomNotAvailableError();
            }
        } catch (error) {
            throw GsClient.wrapError(error)
        }

    }

    static async validatePlayerLeaveTableRequest(restClient: any, roomId: string, token: string, vendorId: string): Promise<Room> {
        try {
            const rooms: Room[] = await GsService.getRooms(restClient, token, vendorId);
            logger.info(rooms, `[validatePlayerLeaveTableRequest] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                return room;
            }
            else {
                logger.error(`[validatePlayerLeaveTableRequest] error ROOM_NOT_PRESENT`)
                throw GsServiceErrorUtil.getHallwayRoomNotAvailableError();
            }
        } catch (error) {
            throw GsClient.wrapError(error)
        }

    }

    static async validatePlayerUnreserveTableRequest(restClient: any, roomId: string, token: string, vendorId: string): Promise<Room> {
        try {
            const rooms: Room[] = await GsService.getRooms(restClient, token, vendorId);
            logger.info(rooms, `[validatePlayerUnreserveRoomRequest] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                return room;
            }
            else {
                logger.error(`[validatePlayerUnreserveRoomRequest] error ROOM_NOT_PRESENT`)
                throw GsServiceErrorUtil.getHallwayRoomNotAvailableError();
            }
        } catch (error) {
            throw GsClient.wrapError(error)
        }

    }

    static async validatePlayerJoinBack(restClient: any, roomId: string, isPractice: boolean, token: string, vendorId: string): Promise<Room> {
        try {
            const rooms: Room[] = await GsService.getRooms(restClient, token, vendorId);
            logger.info(rooms, `[validatePlayerJoinBack] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    return room
                }
                else {
                    logger.error(`[validatePlayerTopupRequest] error INVALID_ROOM_TYPE`)
                    throw GsServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validatePlayerJoinBack] error ROOM_NOT_PRESENT`)
                throw GsServiceErrorUtil.getHallwayRoomNotAvailableError();
            }
        } catch (error) {
            throw GsClient.wrapError(error)
        }

    }

    static async validateTopupValueRequest(restClient: any, roomId: string, isPractice: boolean, token: string, vendorId: string): Promise<Room> {
        try {
            const rooms: Room[] = await GsService.getRooms(restClient, token, vendorId);
            logger.info(rooms, `[validateTopupValueRequest] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    return room
                }
                else {
                    logger.error(`[validateTopupValueRequest] error INVALID_ROOM_TYPE`)
                    throw GsServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validateTopupValueRequest] error ROOM_NOT_PRESENT`)
                throw GsServiceErrorUtil.getHallwayRoomNotAvailableError();
            }
        } catch (error) {
            throw GsClient.wrapError(error)
        }

    }


    static async validatePlayerRebuyRequest(restClient: any, rebuyRequest: PlayerRebuyRequest, isPractice: boolean, token: string, vendorId: string): Promise<Room> {
        try {
            const roomId = rebuyRequest?.roomId
            const rooms: Room[] = await GsService.getRooms(restClient, token, vendorId);
            logger.info(rooms, `[validatePlayerRebuyRequest] response`)
            const room: Room = rooms.find((room: Room) => room?.id == roomId);
            if (room) {
                if (room.isPractice === isPractice) {
                    return room
                }
                else {
                    logger.error(`[validatePlayerRebuyRequest] error INVALID_ROOM_TYPE`)
                    throw GsServiceErrorUtil.getInvalidRoomTypeError();
                }
            }
            else {
                logger.error(`[validatePlayerRebuyRequest] error ROOM_NOT_PRESENT`)
                throw GsServiceErrorUtil.getHallwayRoomNotAvailableError();
            }
        } catch (error) {
            throw GsClient.wrapError(error)
        }

    }

    static async getRooms(restClient: any, token: string, vendorId: string): Promise<Room[]> {
        try {
            const gameServerRequestPaylaod: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.getRoomList)
            logger.info(`[GetRooms] requestPayload ${JSON.stringify(gameServerRequestPaylaod)}`)
            const response: Array<RoomResponse> = await GsClient.getRooms(restClient, gameServerRequestPaylaod, token, vendorId);
            logger.info(`[GetRooms] response ${JSON.stringify(response)}`)
            const rooms: Room[] = GsUtil.convertRoomResponse(response);
            return rooms;
        } catch (error) {
            logger.error(error, `[GetRooms] Error`);
            throw GsClient.wrapError(error);
        }
    }

    static async reserveRoom(restClient: any, roomId: string, token: string, vendorId: string,userId: number,roomType: number): Promise<ReserveRoom> {
        try {
            const reserveRoomData: ReserveRoomRequestData = {
                room_id: `${roomId}`,
                reserve: true
            }
            let isgameplayBan: boolean = false;
            
            if(roomType == RoomType.CASH){
                const userDetails = await IDMService.getUserDetails(restClient, `${userId}`, vendorId);
                isgameplayBan = IdmUtil.getGameplayBan(userDetails);
                if (isgameplayBan) {
                    // throw error accordingly
                    throw GsServiceErrorUtil.getCashTableBannedPlayerError();
                }
            }

            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.reserveRoom, reserveRoomData)
            logger.info(`[ReserveRooms] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: ReserveRoomResponse = await GsClient.reserveRoom(restClient, GsRequestPayload, token, vendorId);
            logger.info(`[ReserveRooms] GsResponse ${JSON.stringify(response)}`)
            const reserveRoom: ReserveRoom = ReserveRoom.convertGsResponse(response);
            logger.info(`[ReserveRooms] transformedGsResponse ${JSON.stringify(reserveRoom)}`)
            return reserveRoom;
        } catch (error) {
            logger.error(error, `[ReserveRooms] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async getRoomTables(restClient: any, roomId: string, token: string, vendorId: string): Promise<Table[]> {
        try {
            const requestData: RoomTablesRequestData = {
                room_id: `${roomId}`,
            }
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.roomTables, requestData)
            logger.info(`[getRoomTables] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: TableResponse[] = await GsClient.getRoomTables(restClient, GsRequestPayload, token, vendorId);
            logger.info(`[getRoomTables] GsResponse ${JSON.stringify(response)}`)
            const tables: Table[] = GsUtil.getTableFromResponse(response);
            logger.info(`[getRoomTables] transformedGsResponse ${JSON.stringify(tables)}`)
            return tables;
        } catch (error) {
            logger.error(error, `[ReserveRooms] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async getTablePlayerDetails(restClient: any, tableId: string, token: string, vendorId: string): Promise<TablePlayersDetails> {
        try {
            const requestData: CashTablePlayerDetails = {
                table_id: tableId,
            }
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.tableDetails, requestData)
            logger.info(`[getTablePlayerDetails] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: TablePlayersResponse = await GsClient.getTablePlayerDetails(restClient, GsRequestPayload, token, vendorId);
            logger.info(`[getTablePlayerDetails] GsResponse ${JSON.stringify(response)}`)
            const resp: TablePlayersDetails = TablePlayersDetails.convertGsResponse(response);
            logger.info(`[getTablePlayerDetails] transformedGsResponse ${JSON.stringify(resp)}`)
            return resp;
        } catch (error) {
            logger.error(error, `[ReserveRooms] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async joinTable(restClient: any, tableId: string, joinTableRequest: JoinTableRequest, token: string, gstStateCode: number, vendorId: string,userId: number,roomType: number): Promise<JoinTable> {
        try {
            const sitAtTableRequestData: SitAtTableRequestData = {
                table_id: tableId,
                stack_size: joinTableRequest?.amount?.toString(),
                ticket_active: joinTableRequest?.isTicketActive,
                state_id: gstStateCode
            }
            let isgameplayBan: boolean = false;
            
            if(roomType == RoomType.CASH){
                const userDetails = await IDMService.getUserDetails(restClient, `${userId}`, vendorId);
                isgameplayBan = IdmUtil.getGameplayBan(userDetails);
                if (isgameplayBan) {
                    // throw error accordingly
                    throw GsServiceErrorUtil.getCashTableBannedPlayerError();
                }
            }
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.sitAtTable, sitAtTableRequestData)
            logger.info(`[JoinTable] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: JoinTableResponse = await GsClient.sitAtTable(restClient, GsRequestPayload, token, vendorId);
            logger.info(`[JoinTable] GsResponse ${JSON.stringify(response)}`)
            const joinTablResponse: JoinTable = JoinTable.convertGsResponse(response);
            logger.info(`[JoinTable] transformedGsResponse ${JSON.stringify(joinTablResponse)}`)
            return joinTablResponse;
        } catch (error) {
            logger.error(error, `[JoinTable] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async playerTopupRequest(restClient: any, tableId: string, playerTopupRequest: PlayerTopupRequest, token: string, vendorId: string): Promise<PlayerTopup> {
        try {
            const playerTopupRequestData: TopupRequestData = {
                amount: `${playerTopupRequest?.amount}`,
                ticket_active: playerTopupRequest?.ticketActive,
                success: playerTopupRequest?.success
            }
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.topup, playerTopupRequestData)
            logger.info(`[playerTopupRequest] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: PlayerTopupRequestResponse = await GsClient.playerTopup(restClient, GsRequestPayload, tableId, token, vendorId);
            logger.info(`[playerTopupRequest] GsResponse ${JSON.stringify(response)}`)
            const playerTopup: PlayerTopup = PlayerTopup.convertGsResponse(response, tableId);
            logger.info(`[playerTopupRequest] transformedResponse ${JSON.stringify(playerTopup)}`);
            return playerTopup;
        } catch (error) {
            logger.error(error, `[playerTopupRequest] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async playerRebuyRequest(restClient: any, tableId: string, playerRebuyRequest: PlayerRebuyRequest, token: string, vendorId: string): Promise<PlayerRebuy> {
        try {
            const playerRebuyRequestData: RebuyRequestData = {
                amount: `${playerRebuyRequest?.amount}`,
                ticket_active: playerRebuyRequest?.ticketActive,
                success: playerRebuyRequest?.success
            }
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.rebuy, playerRebuyRequestData)
            logger.info(`[playerRebuyRequest] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: PlayerRebuyRequestResponse = await GsClient.playerRebuy(restClient, GsRequestPayload, tableId, token, vendorId);
            logger.info(`[playerRebuyRequest] GsResponse ${JSON.stringify(response)}`)
            const playerTopup: PlayerTopup = PlayerRebuy.convertGsResponse(response, tableId);
            logger.info(`[playerRebuyRequest] transformedResponse ${JSON.stringify(playerTopup)}`);
            return playerTopup;
        } catch (error) {
            logger.error(error, `[playerRebuyRequest] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async playerJoinBack(restClient: any, tableId: string, token: string, vendorId: string): Promise<PlayerJoinBack> {
        try {
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.iAmBack)
            logger.info(`[playerJoinBack] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: PlayerJoinBackResponse = await GsClient.playerJoinBack(restClient, GsRequestPayload, tableId, token, vendorId);
            logger.info(`[playerJoinBack] GsResponse ${JSON.stringify(response)}`)
            const playerJoinBack: PlayerJoinBack = PlayerJoinBack.convertGsResponse(response, tableId);
            logger.info(`[playerJoinBack] transformedResponse ${JSON.stringify(playerJoinBack)}`);
            return playerJoinBack;
        } catch (error) {
            logger.error(error, `[playerJoinBack] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async playerLeaveTable(restClient: any, tableId: string, token: string, vendorId: string): Promise<PlayerLeaveTable> {
        try {
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.leaveTableRequest)
            logger.info(`[playerLeaveTable] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: PlayerLeaveTableResponse = await GsClient.playerLeaveTable(restClient, GsRequestPayload, tableId, token, vendorId);
            logger.info(`[playerLeaveTable] GsResponse ${JSON.stringify(response)}`)
            const playerLeaveTableResponse: PlayerLeaveTable = PlayerLeaveTable.convertGsResponse(response, tableId);
            logger.info(`[playerLeaveTable] transformedResponse ${JSON.stringify(playerLeaveTableResponse)}`);
            return playerLeaveTableResponse;
        } catch (error) {
            logger.error(error, `[playerLeaveTable] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async playerUnreserveRoom(restClient: any, tableId: string, token: string, vendorId: string): Promise<boolean> {
        try {
            const unreserveRoomData: PlayerUnreserveRoomRequestData = {
                table_id: `${tableId}`
            }
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.unreserveTable, unreserveRoomData)
            logger.info(`[playerUnreserveRoom] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            return await GsClient.playerUnreserveRoom(restClient, GsRequestPayload, token, vendorId);
        } catch (error) {
            logger.error(error, `[playerUnreserveRoom] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async getTopupValues(restClient: any, tableId: string, token: string, vendorId: string): Promise<TopupValue> {
        try {
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.topupValue)
            logger.info(`[getTopupValues] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: TopupValueResponse = await GsClient.getTopupValue(restClient, GsRequestPayload, tableId, token, vendorId);
            logger.info(`[getTopupValues] GsResponse ${JSON.stringify(response)}`)
            const topupValue: TopupValue = TopupValue.convertGsResponse(response, tableId);
            logger.info(`[getTopupValues] transformedGsResponse ${JSON.stringify(topupValue)}`)
            return topupValue;
        } catch (error) {
            logger.error(error, `[getTopupValues] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async getOnlineUsersCount(internalRestClient: any, vendorId: string): Promise<number> {
        try {
            logger.info(`[GsService] [getOnlineUSersCount]`);
            const onlineUsersCount = await GsClient.getOnlineUsersCount(internalRestClient, vendorId);
            logger.info(`[GsService] [getOnlineUsersCount] onlineUsersCount :: ${onlineUsersCount}`);
            return onlineUsersCount;
        } catch (error) {
            logger.error(error, `[GsService] [getOnlineUSersCount] Failed`);
            throw error;
        }
    }

    static async getFeaturedMtt(internalRestClient: any, vendorId: string): Promise<any> {
        try {
            logger.info(`[GsService] [getFeaturedMtt]`);
            const featuredMtt = await GsClient.getFeaturedMtt(internalRestClient, vendorId);
            logger.info(`[GsService] [getFeaturedMtt] featuredMtt :: ${featuredMtt}`);
            return featuredMtt;
        } catch (error) {
            logger.error(error, `[GsService] [getFeaturedMtt] Failed`);
            throw error;
        }
    }

     static async getFeaturedMttV2(internalRestClient: any, vendorId: string): Promise<any> {
        try {
            logger.info(`[GsService] [getFeaturedMttV2]`);
            const featuredMtt: TournamentResponse[] = await GsClient.getFeaturedMtt(internalRestClient, vendorId);
            logger.info(`[getFeaturedMttV2] GsResponse ${JSON.stringify(featuredMtt)}`)
            return featuredMtt;
        } catch (error) {
            logger.error(error, `[GsService] [getFeaturedMttV2] Failed`);
            throw error;
        }
    }

    static async getFeaturedMttV3(internalRestClient: any, vendorId: string, isMigratedTournament: boolean): Promise<Array<TournamentResponseV3>> {
        try {
            logger.info(`[GsService] [getFeaturedMttV3]`);
            const featuredMtt: TournamentResponse[] = await GsClient.getFeaturedMtt(internalRestClient, vendorId);
            const convertedResponse: TournamentResponseV3[] = GsUtil.convertFeaturedTournamentResponse(featuredMtt, isMigratedTournament)
            logger.info(`[getFeaturedMttV3] GsResponse ${JSON.stringify(convertedResponse)}`)
            return convertedResponse;
        } catch (error) {
            logger.error(error, `[GsService] [getFeaturedMttV3] Failed`);
            throw error;
        }
    }

    static async getTournamentBlindStructure(restClient: any, tournamentId: string, token: string, vendorId: string): Promise<TournamentBlindStructure[]> {
        try {
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.tournamentBlindStructure)
            logger.info(`[getTournamentBlindStructure] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: TournamentBlindStructureResp = await GsClient.getTournamentBlindStructure(restClient, GsRequestPayload, tournamentId, token, vendorId);
            logger.info(`[getTournamentBlindStructure] GsResponse ${JSON.stringify(response)}`)
            const tournamentBlindStructure: TournamentBlindStructure[] = GsUtil.getTournamentBlindStructure(response);
            logger.info(`[getTournamentBlindStructure] transformedGsResponse ${JSON.stringify(tournamentBlindStructure)} tournamentId ${tournamentId}`);
            return tournamentBlindStructure;
        } catch (error) {
            logger.error(error, `[getTournamentBlindStructure] error `)
            throw GsClient.wrapError(error);
        }

    }

    static async getTournamentDetails(restClient: any, tournamentId: string, token: string, vendorId: string): Promise<TournamentDetails> {
        try {
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.tournamentStats)
            logger.info(`[getTournamentDetails] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: TournamentDetailsResponse = await GsClient.getTournamentDetails(restClient, GsRequestPayload, tournamentId, token, vendorId);
            logger.info(`[getTournamentDetails] GsResponse ${JSON.stringify(response)}`)
            const tournamentDetails: TournamentDetails = TournamentDetails.convertGsResponse(response);
            logger.info(`[getTournamentDetails] transformedGsResponse ${JSON.stringify(tournamentDetails)} tournamentId ${tournamentId}`);
            return tournamentDetails;
        } catch (error) {
            logger.error(error, `[getTournamentDetails] error `)
            throw GsClient.wrapError(error);
        }

    }

    static async getTournamentDetailsV2(restClient: any, tournamentId: string, token: string, vendorId: string): Promise<TournamentDetails> {
        try {
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.tournamentStats)
            logger.info(`[getTournamentDetails] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: TournamentDetailsResponse = await GsClient.getTournamentDetails(restClient, GsRequestPayload, tournamentId, token, vendorId);
            logger.info(`[getTournamentDetails] GsResponse ${JSON.stringify(response)}`)
            const tournamentDetails: TournamentDetails = TournamentDetails.convertGsResponseV2(response);
            logger.info(`[getTournamentDetails] transformedGsResponse ${JSON.stringify(tournamentDetails)} tournamentId ${tournamentId}`);
            return tournamentDetails;
        } catch (error) {
            logger.error(error, `[getTournamentDetails] error `)
            throw GsClient.wrapError(error);
        }

    }


    static async getTournamentDetailsV3(restClient: any, tournamentId: string, token: string, vendorId: string): Promise<TournamentDetails> {
        try {
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.tournamentStats)
            logger.info(`[getTournamentDetails] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: TournamentDetailsResponse = await GsClient.getTournamentDetails(restClient, GsRequestPayload, tournamentId, token, vendorId);
            logger.info(`[getTournamentDetails] GsResponse ${JSON.stringify(response)}`)
            const tournamentDetails: TournamentDetails = TournamentDetails.convertGsResponseV3(response);
            logger.info(`[getTournamentDetails] transformedGsResponse ${JSON.stringify(tournamentDetails)} tournamentId ${tournamentId}`);
            return tournamentDetails;
        } catch (error) {
            logger.error(error, `[getTournamentDetails] error `)
            throw GsClient.wrapError(error);
        }

    }

    static async registerPlayerForTournament(restClient: any, tournamentId: string, registerPlayerRequest: PlayerTournamentRegisterRequest, token: string, vendorId: string,userId: number): Promise<string> {
        try {
            const userDetails = await IDMService.getUserDetails(restClient, `${userId}`, vendorId);
            const isgameplayBan: boolean = IdmUtil.getGameplayBan(userDetails);
            if (isgameplayBan) {
                // throw error accordingly
                throw GsServiceErrorUtil.getTournamentUserIsBannedError();
            }
            const registerPlayerData: PlayerTournamentRegisterData = {
                entry_method: registerPlayerRequest?.entry_method,
                ticket_id: registerPlayerRequest?.ticketId,
                seat_pack_id: registerPlayerRequest?.seatPackId,
            }
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.playerTournamentRegistration, registerPlayerData)
            logger.info(`[registerPlayerForTournament] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: string = await GsClient.registerPlayerForTournament(restClient, GsRequestPayload, tournamentId, token, vendorId);
            logger.info(`[registerPlayerForTournament] GsResponse ${JSON.stringify(response)}`)
            return response;
        } catch (error) {
            logger.error(error, `[registerPlayerForTournament] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async unregisterPlayerForTournament(restClient: any, tournamentId: string, registerPlayerRequest: PlayerTournamentRegisterRequest, token: string, vendorId: string): Promise<string> {
        try {
            const registerPlayerData: PlayerTournamentRegisterData = {
                entry_method: registerPlayerRequest?.entry_method,
                ticket_id: registerPlayerRequest?.ticketId
            }
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.playerTournamentUnregistration, registerPlayerData)
            logger.info(`[unregisterPlayerForTournament] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: string = await GsClient.unregisterPlayerForTournament(restClient, GsRequestPayload, tournamentId, token, vendorId);
            logger.info(`[unregisterPlayerForTournament] GsResponse ${JSON.stringify(response)}`)
            return response;
        } catch (error) {
            logger.error(error, `[unregisterPlayerForTournament] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async getPlayerTournamentStatus(restClient: any, tournamentId: string, token: string, vendorId: string): Promise<string> {
        try {
            const playerTournamentStatus: PlayerTournamentStatusData = {
                tournament_id: `${tournamentId}`
            }
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.playerTournamentStatus, playerTournamentStatus)
            logger.info(`[getPlayerTournamentStatus] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: string = await GsClient.getPlayerTournamentStatus(restClient, GsRequestPayload, tournamentId, token, vendorId);
            logger.info(`[getPlayerTournamentStatus] GsResponse ${JSON.stringify(response)}`)
            return response;
        } catch (error) {
            logger.error(error, `[getPlayerTournamentStatus] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async getPlayerMTTList(restClient: any, token: string, vendorId: string): Promise<PlayerMTTList> {
        try {
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.playerMTTList)
            logger.info(`[getPlayerMTTList] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: PlayerMTTListResponse = await GsClient.getPlayerMTTList(restClient, GsRequestPayload, token, vendorId);
            logger.info(`[getPlayerMTTList] GsResponse ${JSON.stringify(response)}`)

            const GsRequestViewMTTListPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.playerMTTViewList)
            logger.info(`[getPlayerMTTList] gsRequestViewMTTListPayload ${JSON.stringify(GsRequestViewMTTListPayload)}`)
            const viewListResponse: PlayerMTTListResponse = await GsClient.getPlayerMTTList(restClient, GsRequestViewMTTListPayload, token, vendorId);
            logger.info(`[getPlayerMTTList] GsResponse ${JSON.stringify(response)}`)
            const mttListResponse: PlayerMTTList = PlayerMTTList.convertGsResponse(response, viewListResponse)
            logger.info(`[getPlayerMTTList] transformedGsResponse ${JSON.stringify(mttListResponse)}`);

            return mttListResponse;
        } catch (error) {
            logger.error(error, `[getPlayerMTTList] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async getPlayerMTTListV3(restClient: any, token: string, vendorId: string): Promise<PlayerMTTList> {
        try {
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.playerMTTList)
            logger.info(`[getPlayerMTTList] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: PlayerMTTListResponse = await GsClient.getPlayerMTTList(restClient, GsRequestPayload, token, vendorId);
            logger.info(`[getPlayerMTTList] GsResponse ${JSON.stringify(response)}`)

            const GsRequestViewMTTListPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.playerMTTViewList)
            logger.info(`[getPlayerMTTList] gsRequestViewMTTListPayload ${JSON.stringify(GsRequestViewMTTListPayload)}`)
            const viewListResponse: PlayerMTTListResponse = await GsClient.getPlayerMTTList(restClient, GsRequestViewMTTListPayload, token, vendorId);
            logger.info(`[getPlayerMTTList] GsResponse ${JSON.stringify(response)}`)
            const mttListResponse: PlayerMTTList = PlayerMTTList.convertGsResponseV3(response, viewListResponse)
            logger.info(`[getPlayerMTTList] transformedGsResponse ${JSON.stringify(mttListResponse)}`);

            return mttListResponse;
        } catch (error) {
            logger.error(error, `[getPlayerMTTList] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async getPlayerStatusMttList(restClient: any, token: string, vendorId: string): Promise<Array<PlayerTournamentData>>{
        const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.playerMTTList)
        logger.info(`[getPlayerMTTList] requestPayload ${JSON.stringify(GsRequestPayload)}`)
        const response: PlayerMTTListResponse = await GsClient.getPlayerMTTList(restClient, GsRequestPayload, token, vendorId);
        logger.info(`[getPlayerMTTList] GsResponse ${JSON.stringify(response)}`)
        const mttPlayerStatusResponse: Array<PlayerTournamentData> = PlayerMTTList.convertGsPlayerStatusResponse(response)
        logger.info(`[getPlayerMTTList] mttPlayerStatusResponse ${JSON.stringify(mttPlayerStatusResponse)}`)
        return mttPlayerStatusResponse;
    }

    static async getMTTList(restClient: any, token: string, vendorId: string): Promise<Tournament[]> {
        try {
            const getMTTListRequestData: MTTListRequestData = {
                full_list: true
            }
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.mttList, getMTTListRequestData)
            logger.info(`[getMTTList] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: TournamentResponse[] = await GsClient.getMTTList(restClient, GsRequestPayload, token, vendorId);
            logger.info(`[getMTTList] GsResponse ${JSON.stringify(response)}`)
            const tournaments: Tournament[] = GsUtil.getTournaments(response)
            logger.info(`[getMTTList] transformedGsResponse ${JSON.stringify(tournaments)}`);
            return tournaments;
        } catch (error) {
            logger.error(error, `[getMTTList] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async getMTTListV2(restClient: any, token: string, vendorId: string): Promise<Tournament[]> {
        try {
            const getMTTListRequestData: MTTListRequestData = {
                full_list: true
            }
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.mttList, getMTTListRequestData)
            logger.info(`[getMTTList] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: TournamentResponse[] = await GsClient.getMTTList(restClient, GsRequestPayload, token, vendorId);
            logger.info(`[getMTTList] GsResponse ${JSON.stringify(response)}`)
            const tournaments: Tournament[] = GsUtil.getTournamentsV2(response)
            logger.info(`[getMTTList] transformedGsResponse ${JSON.stringify(tournaments)}`);
            return tournaments;
        } catch (error) {
            logger.error(error, `[getMTTList] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async getTournamentEntryDetails(restClient: any, tournamentId: string, token: string, vendorId: string): Promise<TournamentEntryDetails> {
        try {
            const tournamentEntryDetailsRequest: TournamentEntryDetailsRequest = {
                tournament_id: `${tournamentId}`
            }
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.tournamentEntryDetails, tournamentEntryDetailsRequest)
            logger.info(`[getTournamentEntryDetails] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const response: TournamentEntryDetails = await GsClient.getTournamentEntryDetails(restClient, GsRequestPayload, token, vendorId);
            logger.info(`[getTournamentEntryDetails] GsResponse ${JSON.stringify(response)}`)
            return response;
        } catch (error) {
            logger.error(error, `[getTournamentEntryDetails] error `)
            throw GsClient.wrapError(error);
        }
    }

    static async getRecommendedRooms(internalRestClient: any, userId: number, firtTimeDepositAmount: number, isRakeGenerated: boolean, frequeuntlyJoinRoomId: string, lastJoinedRoomId: string, token: string, vendorId: string): Promise<any> {
        try {
            const paramArray = [];
            if (frequeuntlyJoinRoomId) {
                paramArray.push(frequeuntlyJoinRoomId);
            }
            if (lastJoinedRoomId) {
                paramArray.push(lastJoinedRoomId);
            }
            const recommendedRoomRequest: RecommendedRoomRequest = {
                params: paramArray.length ? paramArray : undefined,
                irg: isRakeGenerated,
                ftd: firtTimeDepositAmount
            }
            const GsRequestPayload: GsRequestPayload = GsService.getGsRequestPayload(GsCommand.recommendedRooms, recommendedRoomRequest)
            logger.info(`[getRecommendedRooms] requestPayload ${JSON.stringify(GsRequestPayload)}`)
            const _recommendedRooms = await GsClient.getRecommendedRooms(internalRestClient, GsRequestPayload, token, vendorId);
            const recommendedRooms: Room[] = GsUtil.convertRoomResponse(_recommendedRooms);
            logger.info(`[getRecommendedRooms] GsResponse ${JSON.stringify(recommendedRooms)}`)
            return recommendedRooms;
        } catch (error) {
            logger.error(error, `[getRecommendedRooms] error `)
            throw GsClient.wrapError(error);
        }

    }
}