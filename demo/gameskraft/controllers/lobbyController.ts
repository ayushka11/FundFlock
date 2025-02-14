import ServiceError from '../errors/service-error';
import { QuickJoinGroup } from '../models/quick-join-group';
import { QuickJoinGroupDetails } from '../models/quick-join-group-details';
import { ReserveRoomDetails } from '../models/reserve-room-details';
import TableMetaAndSeatDetails from '../models/table-meta-and-seat-details';
import LobbyService from "../services/lobbyService";
import { TitanService } from '../services/titanService';
import ZodiacService from "../services/zodiacService";
import LoggerUtil, { ILogger } from "../utils/logger";
import ResponseUtil from "../utils/response-util";
import { REQUEST_PARAMS } from "../constants/constants";
import RequestUtil from "../helpers/request-util";
import {
    IGroup,
    IGroups,
    IGroupTableResponse,
    IJoinTable,
    IPlayerMTTListResponse,
    IPlayerTournamentRegisterResponse,
    IPlayerTournamentStatus,
    IPlayerTournamentUnregisterResponse,
    IQuickJoinGroup,
    IReserveRoom,
    IRoom,
    IRooms,
    ITableMetaAndSeatDetails,
    ITablePlayerDetailsResponse,
    ITableResponse,
    ITournamentBlindStructureResponse,
    ITournamentDetails, ITournamentDetailsV3,
    ITournamentListResponse, ITournamentListResponseV3,
    TournamentObserverTableId
} from "../models/gateway/response";
import { JoinTable } from "../models/join-table";
import Pagination from "../models/pagination";
import { ReserveRoom } from "../models/reserve-room";
import { Room } from "../models/room";
import { Group } from "../models/group";
import { GsService } from "../services/gsService";
import { LobbyUtil } from "../utils/lobby-util";
import { TournamentBlindStructure } from "../models/tournament-blind-structure";
import { TournamentDetails } from "../models/tournament-details";
import { PlayerMTTList } from "../models/player-mtt-list";
import { Tournament } from "../models/tournament";
import { Table } from "../models/cash-table";
import { TablePlayersDetails } from "../models/cash-table-player-details";
import { TournamentEntryDetails } from "../models/game-server/tournament-entry-details";
import SupernovaService from "../services/supernovaService";
import { TournamentEntryDetailsRequest, TournamentEntryDetailsRequestV2 } from "../models/supernova/request";
import { TournamentEntryDetailsResponse } from "../models/supernova/response";
import { AddCashSummary } from "../models/payin/user-details";
import PayinService from "../services/payinService";
import { TournamentEntryDetailsResponseV2 } from "../models/supernova/tournament-response";
import PlanetServiceErrorUtil from "../errors/planet/planet-error-util";
import { appVersionUtil, getPlatformAndVersion } from "../utils/app-version-util";
import { AriesService } from "../services/ariesService";
import AriesUtil from "../utils/aries-util";
import ServiceErrorUtil from "../errors/service-error-util";
import TitanUtil from '../utils/titan-util';
import { getDefaultChatSuggestionsForVendor, } from '../services/configService';
import TitanTournamentResponse from "../models/tournament/response/tournament-response"
import GsUtil from "../utils/gs-util";
import { TableDetails } from "../models/table-details";
import { TournamentUserDetailResponse } from '../models/tournament/response/tournament-user-detail-response';
import { AriesTournamentService } from '../services/ariesTournamentService';
import { IAppVersionAndPlatform } from '../models/appversion-and-platform';
import {TournamentUtil} from "../utils/tournament-util";
import AriesTournamentType from "../models/tournament/enums/aries-tournament-type";

const logger: ILogger = LoggerUtil.get("LobbyController");

export default class LobbyController {


    static async getRegistrationPopupDetails(req, res, next) {
        const {params, query} = req;
        const tournamentId: string = LobbyController.getTournamentIdFromParam(params);
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[getRegistrationPopupDetails] tournamentId ${tournamentId}`);
        try {
            appVersionUtil(req);
            const tournamentEntryDetails: TournamentEntryDetails = await GsService.getTournamentEntryDetails(req.internalRestClient, tournamentId, token, vendorId);
            logger.info(`[getRegistrationPopupDetails] tournamentEntryDetails ${JSON.stringify(tournamentEntryDetails)}`);
            const request: TournamentEntryDetailsRequest = LobbyUtil.getTournamentEntryDetailsPayload(`${tournamentId}`, tournamentEntryDetails);
            logger.info(`[getRegistrationPopupDetails] request ${JSON.stringify(request)}`);
            const response: TournamentEntryDetailsResponse = await SupernovaService.getTournamentEntryDetails(req.internalRestClient, userId, request, Number(vendorId));
            logger.info(`[getRegistrationPopupDetails] response ${JSON.stringify(response)}`);
            const resp = LobbyUtil.getTournamentEntryDetails(response);
            logger.info(`[getRegistrationPopupDetails] resp ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            logger.error(e, `[getRegistrationPopupDetails] error `,)
            next(e);
        }
    }

    static async getRegistrationPopupDetailsV2(req, res, next) {
        const {params, query} = req;
        const tournamentId: string = LobbyController.getTournamentIdFromParam(params);
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[getRegistrationPopupDetails] tournamentId ${tournamentId}`);
        try {
            appVersionUtil(req);
            const tournamentEntryDetails: TournamentEntryDetails = await GsService.getTournamentEntryDetails(req.internalRestClient, tournamentId, token, vendorId);
            logger.info(`[getRegistrationPopupDetails] tournamentEntryDetails ${JSON.stringify(tournamentEntryDetails)}`);
            const request: TournamentEntryDetailsRequest = LobbyUtil.getTournamentEntryDetailsPayload(`${tournamentId}`, tournamentEntryDetails);
            logger.info(`[getRegistrationPopupDetails] request ${JSON.stringify(request)}`);
            const response: TournamentEntryDetailsResponseV2 = await SupernovaService.getTournamentEntryDetailsV2(req.internalRestClient, userId, request, Number(vendorId));
            logger.info(`[getRegistrationPopupDetails] response ${JSON.stringify(response)}`);
            const resp = LobbyUtil.getTournamentEntryDetailsV2(response);
            logger.info(`[getRegistrationPopupDetails] resp ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            logger.error(e, `[getRegistrationPopupDetails] error `,)
            next(e);
        }
    }

    static async getRegistrationPopupDetailsV3(req, res, next) {
        const {params, query} = req;
        const tournamentId: string = LobbyController.getTournamentIdFromParam(params);
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[getRegistrationPopupDetails] tournamentId ${tournamentId}`);
        try {
            appVersionUtil(req);
            let resp;
            const isTournamentMigrated: boolean = await TitanService.checkMigratedTournamentId(req.internalRestClient, Number(tournamentId))
            //If tournament exist in Aries Tournaments
            if (isTournamentMigrated) {
                const tournament: TitanTournamentResponse = await TitanService.findTitanTournamentById(req.internalRestClient, Number(tournamentId))
                const request: TournamentEntryDetailsRequestV2 = LobbyUtil.getTournamentEntryDetailsPayloadForNewTournament(tournament);
                logger.info(`[getRegistrationPopupDetails] request ${JSON.stringify(request)}`);
                const response = await SupernovaService.getTournamentEntryDetailsV3(req.internalRestClient, userId, request, Number(vendorId));
                logger.info(`[getRegistrationPopupDetails] response ${JSON.stringify(response)}`);
                resp = LobbyUtil.getTournamentEntryDetailsV3(response)
            }
            else {
                const tournamentEntryDetails: TournamentEntryDetails = await GsService.getTournamentEntryDetails(req.internalRestClient, tournamentId, token, vendorId);
                logger.info(`[getRegistrationPopupDetails] tournamentEntryDetails ${JSON.stringify(tournamentEntryDetails)}`);
                const request: TournamentEntryDetailsRequest = LobbyUtil.getTournamentEntryDetailsPayload(`${tournamentId}`, tournamentEntryDetails);
                logger.info(`[getRegistrationPopupDetails] request ${JSON.stringify(request)}`);
                const response = await SupernovaService.getTournamentEntryDetailsV2(req.internalRestClient, userId, request, Number(vendorId));
                logger.info(`[getRegistrationPopupDetails] response ${JSON.stringify(response)}`);
                resp = LobbyUtil.getTournamentEntryDetailsV2(response);
            }
            logger.info(`[getRegistrationPopupDetails] resp ${JSON.stringify(resp)}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            logger.error(e, `[getRegistrationPopupDetails] error `,)
            next(e);
        }
    }

    static getLobbyBanners = async (req, res, next) => {
        try {
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const payinCustomerId: string = req.sessionManager.getPayinCustomerId();
            const platformAndVersion: IAppVersionAndPlatform = getPlatformAndVersion(req);
            const userUniqueId = `${vendorId}_${userId}`;
            const fairplayDetails = await ZodiacService.getUserFairplayDetails(req.internalRestClient, userUniqueId);
            logger.info(`[LobbyController] [getLobbyBanners] fairplayDetails :: ${JSON.stringify(fairplayDetails)}`);
            const addCashSummaryResp: AddCashSummary = await PayinService.getUserAddCashSummary(`${userId}`, req.internalRestClient, payinCustomerId, vendorId)
            logger.info(`[LobbyController] [getLobbyBanners] addCashSummaryResp :: ${JSON.stringify(addCashSummaryResp)}`);
            const hasUserDepositedMoney: boolean = addCashSummaryResp?.addCashCount > 0;
            const bannerType = req.query?.type;
            logger.info(`[LobbyController] [getLobbyBanners] Request userId :: ${userId} vendorID :: ${vendorId} hasUserDepositedMoney :: ${hasUserDepositedMoney}`);
            const lobbyBanners = LobbyService.getLobbyBanners(userId, hasUserDepositedMoney, bannerType, vendorId, platformAndVersion);
            logger.info(`[LobbyController] [getLobbyBanners] Response userId :: ${userId} vendorID :: ${vendorId} lobbyBanners :: ${lobbyBanners}`);
            ResponseUtil.sendSuccessResponse(res, lobbyBanners);
        } catch (e) {
            logger.error(e, `[getLobbyBanners] error `,)
            next(e);
        }
    }

    static getPracticeLobbyBanners = async (req, res, next) => {
        try {
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const bannerType = req.query?.type;
            logger.info(`[LobbyController] [getPracticeLobbyBanners] Request userId :: ${userId} vendorID :: ${vendorId} bannerType :: ${bannerType}`);
            const lobbyBanners = LobbyService.getPracticeLobbyBanners(userId, bannerType, vendorId);
            logger.info(`[LobbyController] [getPracticeLobbyBanners] Response userId :: ${userId} vendorID :: ${vendorId} lobbyBanners :: ${lobbyBanners}`);
            ResponseUtil.sendSuccessResponse(res, lobbyBanners);
        } catch (e) {
            logger.error(e, `[getPracticeLobbyBanners] error `,)
            next(e);
        }
    }

    static async getRooms(req, res, next): Promise<any> {
        const {params, query} = req;
        const pagination: Pagination = RequestUtil.getPaginationInfo(query);
        let rooms: IRoom[] = []
        const userId: string = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[getRooms] with pagination ${JSON.stringify(pagination || {})}`);
        try {
            appVersionUtil(req);
            const ariesRooms = await AriesService.getRooms(req.internalRestClient, userId)
            logger.info(`[getRooms]  ariesResponse ${JSON.stringify(ariesRooms)} `);
            const transformedRoomData: IRoom[] = LobbyUtil.getRoomsData([...ariesRooms])
            rooms.push(...transformedRoomData);
            const roomsResponse: IRooms = {
                rooms: rooms
            }
            logger.info(`[getRooms] roomResponse ${JSON.stringify(roomsResponse)}`);
            ResponseUtil.sendSuccessResponse(res, roomsResponse);
        } catch (e) {
            logger.error(e, `[getRooms] error `,)
            next(e);
        }
    }

    static async getPracticeRooms(req, res, next): Promise<any> {
        const {params, query} = req;
        const pagination: Pagination = RequestUtil.getPaginationInfo(query);
        let rooms: IRoom[] = []
        const token: string = req.cookieManager.getToken();
        const userId: string = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[getPracticeRooms] with pagination ${JSON.stringify(pagination || {})}`);
        try {
            appVersionUtil(req);
            const ariesRooms = await AriesService.getRooms(req.internalRestClient, userId);
            logger.info(`[getPracticeRooms]  ariesResponse ${JSON.stringify(ariesRooms)} `);
            const transformedRoomData: IRoom[] = LobbyUtil.getPracticeRoomsData(ariesRooms)
            rooms.push(...transformedRoomData);
            const roomsResponse: IRooms = {
                rooms: rooms
            }
            logger.info(`[getPracticeRooms] roomResponse ${JSON.stringify(roomsResponse)}`);
            ResponseUtil.sendSuccessResponse(res, roomsResponse);
        } catch (e) {
            logger.error(e, `[getPracticeRooms] error `,)
            next(e);
        }
    }

    static async getGroups(req, res, next): Promise<any> {
        const {query} = req;
        const pagination: Pagination = RequestUtil.getPaginationInfo(query);
        let groups: IGroup[] = []
        const userId: string = req.sessionManager.getLoggedInUserId();
        logger.info(`[getGroups] with pagination ${JSON.stringify(pagination || {})}`);
        try {
            appVersionUtil(req);
            const ariesGroups: Group[] = await AriesService.getGroups(req.internalRestClient, userId);
            logger.info(`[getGroups] ariesResponse ${JSON.stringify(ariesGroups)}`);
            const transformedGroupData: IGroup[] = LobbyUtil.getGroupsData(ariesGroups)
            groups.push(...transformedGroupData);
            const groupsResponse: IGroups = {
                groups: groups
            }
            logger.info(`[getGroups] groupResponse ${JSON.stringify(groupsResponse)}`);
            ResponseUtil.sendSuccessResponse(res, groupsResponse);
        } catch (e) {
            logger.error(e, `[getRooms] error `,)
            next(e);
        }
    }

    static async getPracticeGroups(req, res, next): Promise<any> {
        const {query} = req;
        const pagination: Pagination = RequestUtil.getPaginationInfo(query);
        let groups: IGroup[] = []
        const userId: string = req.sessionManager.getLoggedInUserId();
        logger.info(`[getPracticeGroups] with pagination ${JSON.stringify(pagination || {})}`);
        try {
            appVersionUtil(req);
            const ariesGroups: Group[] = await AriesService.getGroups(req.internalRestClient, userId);
            logger.info(`[getGroups] ariesResponse ${JSON.stringify(ariesGroups)}`);
            const transformedGroupData: IGroup[] = LobbyUtil.getPracticeGroupsData(ariesGroups)
            groups.push(...transformedGroupData);
            const groupsResponse: IGroups = {
                groups: groups
            }
            logger.info(`[getGroups] groupResponse ${JSON.stringify(groupsResponse)}`);
            ResponseUtil.sendSuccessResponse(res, groupsResponse);
        } catch (e) {
            logger.error(e, `[getRooms] error `,)
            next(e);
        }
    }

    static async getRoomTables(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const {params, query} = req;
            const roomId: string = LobbyController.getRoomIdFormParams(params)
            const userId: string = req.sessionManager.getLoggedInUserId();
            logger.info(`[getRoomTables] roomId ${roomId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            const room: Room = await AriesService.validateTablesRequest(req.internalRestClient, userId, roomId)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: Table[] = await AriesService.getRoomTables(req.internalRestClient, roomId);
            logger.info(`[getRoomTables] aries success response ${JSON.stringify(response)}`);
            const tablesResponse: ITableResponse = AriesUtil.getRoomTableResponse(response);
            logger.info(`[getRoomTables] final response ${JSON.stringify(tablesResponse)}`);
            ResponseUtil.sendSuccessResponse(res, tablesResponse);
        } catch (e) {
            logger.error(e, `[getRoomTables] Error `);
            next(e);
        }
    }

    static async getGroupTables(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const {params, query} = req;
            const groupId: number = LobbyController.getGroupIdFormParams(params)
            const userId: string = req.sessionManager.getLoggedInUserId();
            logger.info(`[getGroupTables] groupId ${groupId}`);
            if (!groupId) {
                throw ServiceErrorUtil.getGroupIdNotFoundError();
            }
            const group: Group = await AriesService.validateGroupTablesRequest(req.internalRestClient, userId, groupId);
            if (!group) {
                throw ServiceErrorUtil.getInvalidGroupError();
            }
            const response: TableDetails[] = await AriesService.getGroupTables(req.internalRestClient, groupId, userId);
            logger.info(`[getGroupTables] aries success response ${JSON.stringify(response)}`);
            const tablesResponse: IGroupTableResponse = LobbyUtil.getGroupTablesResponse(response, Number(userId));
            ResponseUtil.sendSuccessResponse(res, tablesResponse);
        } catch (e) {
            logger.error(e, `[getGroupTables] Error `);
            next(e);
        }
    }

    static async quickJoinGroup(req, res, next): Promise<any> {
        try {
            const {params, query} = req;
            appVersionUtil(req);
            const groupId: number = LobbyController.getGroupIdFormParams(params)
            const userId: string = req.sessionManager.getLoggedInUserId();
            const quickJoinGroupDetails: QuickJoinGroupDetails = AriesUtil.getQuickJoinGroupDetailsFromRequest(req, false, groupId);
            if (!quickJoinGroupDetails?.locationDetails) {
                throw PlanetServiceErrorUtil.getLocationDetailsNotFound();
            }
            if (!quickJoinGroupDetails?.locationDetails?.isAllowed) {
                throw PlanetServiceErrorUtil.getLocationRestrictedByGeoCoordinate();
            }
            logger.info(`[quickJoinGroup] groupId ${groupId} quickJoinGroupDetails : ${JSON.stringify(quickJoinGroupDetails)}`);
            if (!groupId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            const {
                group,
                primaryRoom
            } = await AriesService.validateQuickJoinGroup(req.internalRestClient, userId, groupId, false)
            if (!group) {
                throw ServiceErrorUtil.getInvalidGroupError();
            }
            const response: QuickJoinGroup = await AriesService.quickJoinGroup(req.internalRestClient, userId, quickJoinGroupDetails, primaryRoom);
            logger.info(`[quickJoinGroup] aries success response ${JSON.stringify(response)}`);
            const quickJoinResponse: IQuickJoinGroup = LobbyUtil.getQuickJoinGroupResponse(response, userId, quickJoinGroupDetails?.vendorId);
            logger.info(`[quickJoinGroup] final response ${JSON.stringify(quickJoinResponse)}`);
            ResponseUtil.sendSuccessResponse(res, quickJoinResponse);
        } catch (e) {
            logger.error(e, `[quickJoinGroup] Error `);
            next(e);
        }
    }

    static async quickJoinPracticeGroup(req, res, next): Promise<any> {
        try {
            const {params, query} = req;
            appVersionUtil(req);
            const groupId: number = LobbyController.getGroupIdFormParams(params)
            const userId: string = req.sessionManager.getLoggedInUserId();
            const quickJoinGroupDetails: QuickJoinGroupDetails = AriesUtil.getQuickJoinGroupDetailsFromRequest(req, true, groupId);
            logger.info(`[quickJoinPracticeGroup] groupId ${groupId} quickJoinGroupDetails : ${JSON.stringify(quickJoinGroupDetails)}`);
            if (!groupId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            const {
                group,
                primaryRoom
            } = await AriesService.validateQuickJoinGroup(req.internalRestClient, userId, groupId, true)
            if (!group) {
                throw ServiceErrorUtil.getInvalidGroupError();
            }
            const response: QuickJoinGroup = await AriesService.quickJoinGroup(req.internalRestClient, userId, quickJoinGroupDetails, primaryRoom);
            logger.info(`[quickJoinPracticeGroup] aries success response ${JSON.stringify(response)}`);
            const quickJoinResponse: IQuickJoinGroup = LobbyUtil.getQuickJoinPracticeGroupResponse(response, userId, quickJoinGroupDetails?.vendorId);
            logger.info(`[quickJoinPracticeGroup] final response ${JSON.stringify(quickJoinResponse)}`);
            ResponseUtil.sendSuccessResponse(res, quickJoinResponse);
        } catch (e) {
            logger.error(e, `[quickJoinPracticeGroup] Error `);
            next(e);
        }
    }

    static async getTablePlayerDetails(req, res, next): Promise<any> {
        try {
            const {params, query, body} = req;
            appVersionUtil(req);
            const tableId: string = LobbyController.getTableIdFromParam(params)
            const roomId: string = LobbyController.getRoomIdFormParams(query);
            const userId: string = req.sessionManager.getLoggedInUserId();
            logger.info(`[getTablePlayerDetails] roomId ${roomId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }

            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }

            const room: Room = await AriesService.validateTablePlayersRequest(req.internalRestClient, userId, roomId)

            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: TablePlayersDetails = await AriesService.getTablePlayerDetails(req.internalRestClient, tableId);
            logger.info(`[getTablePlayerDetails] aries success response ${JSON.stringify(response)}`);
            const tablesResponse: ITablePlayerDetailsResponse = LobbyUtil.getTablePlayersResponse(response, room?.isPractice);
            logger.info(`[getTablePlayerDetails] final response ${JSON.stringify(tablesResponse)}`);
            ResponseUtil.sendSuccessResponse(res, tablesResponse)
        } catch (e) {
            logger.error(e, `[getTablePlayerDetails] Error `);
            next(e);
        }
    }

    static async reserveRoom(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const {params, query} = req;
            const roomId: string = LobbyController.getRoomIdFormParams(params)
            const userId: string = req.sessionManager.getLoggedInUserId();
            const reserveRoomDetails: ReserveRoomDetails = AriesUtil.getReserveRoomDetailsFromRequest(req, false, roomId);
            if (!reserveRoomDetails?.locationDetails) {
                throw PlanetServiceErrorUtil.getLocationDetailsNotFound();
            }
            if (!reserveRoomDetails?.locationDetails?.isAllowed) {
                throw PlanetServiceErrorUtil.getLocationRestrictedByGeoCoordinate();
            }
            logger.info(`[reserveRoom] roomId ${roomId} reserveRoomDetails : ${JSON.stringify(reserveRoomDetails)}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            const room: Room = await AriesService.validateReserveRoom(req.internalRestClient, userId, roomId, false)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: ReserveRoom = await AriesService.reserveRoom(req.internalRestClient, userId, reserveRoomDetails, room);
            logger.info(`[reserveRoom] aries success response ${JSON.stringify(response)}`);
            const reserveRoomResponse: IReserveRoom = LobbyUtil.getReserveRoomResponse(response, userId);
            logger.info(`[reserveRoom] final response ${JSON.stringify(reserveRoomResponse)}`);
            ResponseUtil.sendSuccessResponse(res, reserveRoomResponse);
        } catch (e) {
            logger.error(e, `[reserveRoom] Error `);
            next(e);
        }
    }

    static async reservePracticeRoom(req, res, next): Promise<any> {
        try {
            const {params, query} = req;
            appVersionUtil(req);

            const roomId: string = LobbyController.getRoomIdFormParams(params)
            const userId: string = req.sessionManager.getLoggedInUserId();
            const reserveRoomDetails: ReserveRoomDetails = AriesUtil.getReserveRoomDetailsFromRequest(req, true, roomId);
            logger.info(`[reserveRoomPractice] roomId ${roomId} reserveRoomDetails : ${JSON.stringify(reserveRoomDetails)}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            const room: Room = await AriesService.validateReserveRoom(req.internalRestClient, userId, roomId, true)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: ReserveRoom = await AriesService.reserveRoom(req.internalRestClient, userId, reserveRoomDetails, room);
            logger.info(`[reserveRoomPractice] aries success response ${JSON.stringify(response)}`);
            const reserveRoomResponse: IReserveRoom = LobbyUtil.getReservePracticeRoomResponse(response, userId);
            logger.info(`[reserveRoomPractice] final response ${JSON.stringify(reserveRoomResponse)}`);
            ResponseUtil.sendSuccessResponse(res, reserveRoomResponse);
        } catch (e) {
            logger.error(e, `[reserveRoomPractice] Error `);
            next(e);
        }
    }

    static async joinTable(req, res, next): Promise<any> {
        try {
            const {params, query, body} = req;
            appVersionUtil(req);
            const roomId: number = body?.roomId;
            const tableId: string = LobbyController.getTableIdFromParam(params)
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req?.vendorId;
            logger.info(`[joinTable] tableId ${tableId}`);

            const LocationDetails = req.sessionManager.getLocation();
            if (!LocationDetails) {
                throw PlanetServiceErrorUtil.getLocationDetailsNotFound();
            }
            if (!LocationDetails.isAllowed) {
                throw PlanetServiceErrorUtil.getLocationRestrictedByGeoCoordinate();
            }

            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }

            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }

            const room: Room = await AriesService.validateJoinTable(req.internalRestClient, userId, body, false)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: JoinTable = await AriesService.joinTable(req.internalRestClient, tableId, body, userId, vendorId);
            logger.info(`[joinTable] aries  success response ${JSON.stringify(response)}`);
            const joinTableResponse: IJoinTable = LobbyUtil.getJoinTableResponse(response, userId, tableId);
            logger.info(`[joinTable] final response ${JSON.stringify(joinTableResponse)}`);
            ResponseUtil.sendSuccessResponse(res, joinTableResponse);
        } catch (e) {
            logger.error(e, `[joinTable] error `,)
            next(e);
        }
    }

    static async joinPracticeTable(req, res, next): Promise<any> {
        try {
            const {params, query, body} = req;
            appVersionUtil(req);
            const roomId: number = body?.roomId;
            const tableId: string = LobbyController.getTableIdFromParam(params)
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req?.vendorId;
            logger.info(`[joinPracticeTable] tableId ${tableId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }

            const room: Room = await AriesService.validateJoinTable(req.internalRestClient, userId, body, true)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: JoinTable = await AriesService.joinTable(req.internalRestClient, tableId, body, userId, vendorId);
            logger.info(`[joinPracticeTable] aries  success response ${JSON.stringify(response)}`);
            const joinTableResponse: IJoinTable = LobbyUtil.getJoinPracticeTableResponse(response, userId, tableId);
            logger.info(`[joinPracticeTable] final response ${JSON.stringify(joinTableResponse)}`);
            ResponseUtil.sendSuccessResponse(res, joinTableResponse);
        } catch (e) {
            logger.error(e, `[joinPracticeTable] error `,)
            next(e);
        }
    }

    static async getTournamentBlindStructure(req, res, next): Promise<any> {
        const {params, query} = req;
        const tournamentId: string = LobbyController.getTournamentIdFromParam(params);
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[getTournamentBlindStructure] tournamentId ${tournamentId}`);
        try {
            appVersionUtil(req);
            const response: TournamentBlindStructure[] = await GsService.getTournamentBlindStructure(req.internalRestClient, tournamentId, token, vendorId);
            logger.info(`[getTournamentBlindStructure] game server success response ${JSON.stringify(response)} tournamentId ${tournamentId}`);
            const tounamentBlindStructure: ITournamentBlindStructureResponse = LobbyUtil.getTournamentBlindStructure(response, userId, tournamentId);
            logger.info(`[getTournamentBlindStructure] final response ${JSON.stringify(tounamentBlindStructure)} tournamentId ${tournamentId}`);
            ResponseUtil.sendSuccessResponse(res, tounamentBlindStructure);
        } catch (e) {
            logger.error(e, `[getTournamentBlindStructure] error `,)
            next(e);
        }
    }

    static async getTournamentBlindStructureV3(req, res, next): Promise<any> {
        const {params, query} = req;
        const tournamentId: string = LobbyController.getTournamentIdFromParam(params);
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[getTournamentBlindStructure] tournamentId ${tournamentId}`);
        try {
            appVersionUtil(req);

            let response
            const isTournamentMigrated: boolean = await TitanService.checkMigratedTournamentId(req.internalRestClient, Number(tournamentId))
            //If tournament exist in Aries Tournaments
            if (isTournamentMigrated) {
                const tournament: TitanTournamentResponse = await TitanService.findTitanTournamentById(req.internalRestClient, Number(tournamentId))
                response = TitanUtil.getTournamentBlindStructureFromAriesResponse(tournament?.blindLevels, tournament?.blindLevelDuration)
            }
            else {
                response = await GsService.getTournamentBlindStructure(req.internalRestClient, tournamentId, token, vendorId);
            }
            logger.info(`[getTournamentBlindStructure] success response ${JSON.stringify(response)} tournamentId ${tournamentId}`);
            const tounamentBlindStructure: ITournamentBlindStructureResponse = LobbyUtil.getTournamentBlindStructure(response, userId, tournamentId);
            logger.info(`[getTournamentBlindStructure] final response ${JSON.stringify(tounamentBlindStructure)} tournamentId ${tournamentId}`);
            ResponseUtil.sendSuccessResponse(res, tounamentBlindStructure);
        } catch (e) {
            logger.error(e, `[getTournamentBlindStructure] error `,)
            next(e);
        }
    }

    static async getTournamentDetails(req, res, next): Promise<any> {
        const {params, query} = req;
        const tournamentId: string = LobbyController.getTournamentIdFromParam(params);
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[getTournamentDetails] tournamentId ${tournamentId}`);
        try {
            appVersionUtil(req);
            const response: TournamentDetails = await GsService.getTournamentDetails(req.internalRestClient, tournamentId, token, vendorId);
            logger.info(`[getTournamentDetails] game server success response ${JSON.stringify(response)} tournamentId ${tournamentId}`);
            const tounamentDetails: ITournamentDetails = LobbyUtil.getTournamentDetails(response, userId);
            logger.info(`[getTournamentDetails] final response ${JSON.stringify(tounamentDetails)} tournamentId ${tournamentId}`);
            ResponseUtil.sendSuccessResponse(res, tounamentDetails);
        } catch (e) {
            logger.error(e, `[getTournamentDetails] error `,)
            next(e);
        }
    }

    static async getTournamentDetailsV2(req, res, next): Promise<any> {
        const {params, query} = req;
        const tournamentId: string = LobbyController.getTournamentIdFromParam(params);
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[getTournamentDetails] tournamentId ${tournamentId}`);
        try {
            appVersionUtil(req);
            const response: TournamentDetails = await GsService.getTournamentDetailsV2(req.internalRestClient, tournamentId, token, vendorId);
            logger.info(`[getTournamentDetails] game server success response ${JSON.stringify(response)} tournamentId ${tournamentId}`);
            const tounamentDetails: ITournamentDetails = LobbyUtil.getTournamentDetailsV2(response, userId);
            logger.info(`[getTournamentDetails] final response ${JSON.stringify(tounamentDetails)} tournamentId ${tournamentId}`);
            ResponseUtil.sendSuccessResponse(res, tounamentDetails);
        } catch (e) {
            logger.error(e, `[getTournamentDetails] error `,)
            next(e);
        }
    }

    static async getTournamentDetailsV3(req, res, next): Promise<any> {
        const {params, query} = req;
        const tournamentId: string = LobbyController.getTournamentIdFromParam(params);
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[getTournamentDetailsV3] tournamentId ${tournamentId}`);
        try {
            appVersionUtil(req);
            const isTournamentMigrated: boolean = await TitanService.checkMigratedTournamentId(req.internalRestClient, Number(tournamentId))

            //If tournament exist in Aries Tournaments
            if(isTournamentMigrated){
                const [tournament,activeTables, tournamentLeaderboard, playerStatusResponse, childSattyTournament] = await Promise.all([
                    TitanService.findTitanTournamentById(req.internalRestClient, Number(tournamentId)),
                    TitanService.getTournamentActiveTables(req.internalRestClient, Number(tournamentId)),
                    TitanService.getTournamentLeaderboard(req.internalRestClient, Number(tournamentId), userId),
                    TitanService.getPlayerTournamentStatus(req.internalRestClient, Number(userId), Number(tournamentId)),
                    TitanService.getChildSattyTournaments(req.internalRestClient, Number(tournamentId))
                ])
                logger.info(`[getTournamentDetailsV3] tournament ${JSON.stringify(tournament)}`);
                logger.info(`[getTournamentDetailsV3] activeTables ${JSON.stringify(activeTables)}`);
                logger.info(`[getTournamentDetailsV3] tournamentLeaderboard ${JSON.stringify(tournamentLeaderboard)}`);
                logger.info(`[getTournamentDetailsV3] playerStatusResponse ${JSON.stringify(playerStatusResponse)}`);
                logger.info(`[getTournamentDetailsV3] childSattyTournament ${JSON.stringify(childSattyTournament)}`);
                const tableId: number | undefined = await AriesService.getPlayerTournamentTableId(req.internalRestClient, userId, tournamentId, playerStatusResponse, tournament.status)
                logger.info(`[getTournamentDetailsV3] tableId - ${tableId}`)
                const response: TournamentDetails = TournamentDetails.convertAriesResponse(tournament, activeTables, tournamentLeaderboard, Number(vendorId), playerStatusResponse, childSattyTournament, tableId);
                logger.info(`[getTournamentDetailsV3]  response ${JSON.stringify(response)} tournamentId ${tournamentId}`);
                const tournamentDetails: ITournamentDetailsV3 = LobbyUtil.getTournamentDetailsV3(response);
                logger.info(`[getTournamentDetailsV3] final response ${JSON.stringify(tournamentDetails)} tournamentId ${tournamentId}`);
                ResponseUtil.sendSuccessResponse(res, tournamentDetails);
            }
            else {
                const [gsPlayerStatusResp, response] = await Promise.all([GsService.getPlayerStatusMttList(req.internalRestClient, token, vendorId), GsService.getTournamentDetailsV3(req.internalRestClient, tournamentId, token, vendorId)])
                logger.info(`[getTournamentDetailsV3] gsPlayerStatusResp ${JSON.stringify(gsPlayerStatusResp)}`);
                logger.info(`[getTournamentDetailsV3] response ${JSON.stringify(response)}`);
                response.playerStatus = GsUtil.getPlayerStatusV3(gsPlayerStatusResp, tournamentId);
                logger.info(`[getTournamentDetailsV3] response.playerStatus  ${response.playerStatus}`);
                response.migratedTournament = isTournamentMigrated;
                logger.info(`[getTournamentDetailsV3] response ${JSON.stringify(response)} tournamentId ${tournamentId}`);
                const tournamentDetails: ITournamentDetailsV3 = LobbyUtil.getTournamentDetailsV4(response);
                logger.info(`[getTournamentDetailsV3] final response ${JSON.stringify(tournamentDetails)} tournamentId ${tournamentId}`);
                ResponseUtil.sendSuccessResponse(res, tournamentDetails);
            }
        } catch (e) {
            logger.error(e, `[getTournamentDetailsV3] error `,)
            next(e);
        }
    }

    static async getTournamentPlayerTableInfo(req, res, next): Promise<any> {
        const {params} = req;
        const tournamentId: string = LobbyController.getTournamentIdFromParam(params);
        const userId: number = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[getTournamentPlayerTableInfo] tournamentId ${tournamentId} userId: ${userId}`);
        try {
            appVersionUtil(req);
            const [tournament, activeTables, tournamentLeaderboard] = await Promise.all([
                TitanService.findTitanTournamentById(req.internalRestClient, Number(tournamentId)),
                TitanService.getTournamentActiveTables(req.internalRestClient, Number(tournamentId)),
                TitanService.getTournamentLeaderboard(req.internalRestClient, Number(tournamentId), userId)
            ])
            logger.info(`[getTournamentPlayerTableInfo] tournament ${JSON.stringify(tournament)}`);
            logger.info(`[getTournamentPlayerTableInfo] activeTables ${JSON.stringify(activeTables)}`);
            logger.info(`[getTournamentPlayerTableInfo] tournamentLeaderboard ${JSON.stringify(tournamentLeaderboard)}`);
            const response: TournamentDetails = TournamentDetails.convertAriesResponse(tournament, activeTables, tournamentLeaderboard, Number(vendorId))
            logger.info(`[getTournamentPlayerTableInfo]  response ${JSON.stringify(response)} tournamentId ${tournamentId}`);
            const tournamentDetails: ITournamentDetailsV3 = LobbyUtil.getTournamentDetailsV3(response);
            logger.info(`[getTournamentPlayerTableInfo] final response ${JSON.stringify(tournamentDetails)} tournamentId ${tournamentId}`);
            ResponseUtil.sendSuccessResponse(res, tournamentDetails);
        } catch (e) {
            logger.error(e, `[getTournamentPlayerTableInfo] error `,)
            next(e);
        }
    }

    static async registerPlayerForTournament(req, res, next): Promise<any> {
        const {params, query, body} = req;
        const tournamentId: string = LobbyController.getTournamentIdFromParam(params);
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[registerPlayerForTournament] tournamentId ${tournamentId}`);
        try {
            appVersionUtil(req);
            const LocationDetails = req.sessionManager.getLocation();
            if (!LocationDetails) {
                throw PlanetServiceErrorUtil.getLocationDetailsNotFound();
            }
            const isAllowed = LocationDetails.isAllowed;
            if (!isAllowed) {
                throw PlanetServiceErrorUtil.getLocationRestrictedByGeoCoordinate();
            }
            const response: string = await GsService.registerPlayerForTournament(req.internalRestClient, tournamentId, body, token, vendorId, userId);
            logger.info(`[registerPlayerForTournament] game server success response ${JSON.stringify(response)} tournamentId ${tournamentId}`);
            const resp: IPlayerTournamentRegisterResponse = {
                message: response,
                userId: userId,
                tournamentId: tournamentId
            }
            logger.info(`[registerPlayerForTournament] final response ${JSON.stringify(resp)} tournamentId ${tournamentId}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            logger.error(e, `[registerPlayerForTournament] error `,)
            next(e);
        }

    }


    static async registerPlayerForTournamentV3(req, res, next): Promise<any> {
        try {
            const {params, query, body} = req;
            const tournamentId: string = LobbyController.getTournamentIdFromParam(params);
            const token: string = req.cookieManager.getToken();
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req?.vendorId;
            logger.info(`[registerPlayerForTournament] tournamentId ${tournamentId}`);

            appVersionUtil(req);
            const LocationDetails = req.sessionManager.getLocation();

            const isTournamentMigrated: boolean = await TitanService.checkMigratedTournamentId(req.internalRestClient, Number(tournamentId));

            let enableLocationCheck: boolean = true;
            //If tournament exist in Aries Tournaments
            if(isTournamentMigrated) {
                const tournamentDetails: TitanTournamentResponse = await TitanService.findTitanTournamentById(req.internalRestClient, Number(tournamentId));
                if(tournamentDetails.tournamentType == AriesTournamentType.PSL) {
                    logger.info(`[registerPlayerForTournament] disabling location check for PSL tournaments`);
                    enableLocationCheck = true;
                }
            }

            if (!LocationDetails) {
                throw PlanetServiceErrorUtil.getLocationDetailsNotFound();
            }
            const isAllowed = LocationDetails.isAllowed;
            if (enableLocationCheck && !isAllowed) {
                throw PlanetServiceErrorUtil.getLocationRestrictedByGeoCoordinate();
            }
            let gstStateCode: number = req.sessionManager.getLocation().gstStateCode;

            let response
            if (isTournamentMigrated) {
                response = await TitanService.registerPlayerForTournament(req.internalRestClient, tournamentId, body, userId, vendorId, gstStateCode);
            }
            else {
                response = await GsService.registerPlayerForTournament(req.internalRestClient, tournamentId, body, token, vendorId, userId);
            }
            logger.info(`[registerPlayerForTournament] game server success response ${JSON.stringify(response)} tournamentId ${tournamentId}`);
            const resp: IPlayerTournamentRegisterResponse = {
                message: response,
                userId: userId,
                tournamentId: tournamentId
            }
            logger.info(`[registerPlayerForTournament] final response ${JSON.stringify(resp)} tournamentId ${tournamentId}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            logger.error(e, `[registerPlayerForTournament] error `,)
            next(e);
        }

    }

    static async unregisterPlayerForTournament(req, res, next): Promise<any> {
        const {params, query, body} = req;
        const tournamentId: string = LobbyController.getTournamentIdFromParam(params);
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[unregisterPlayerForTournament] tournamentId ${tournamentId}`);
        try {
            appVersionUtil(req);
            const canUnregisterTournamentResponse: any = await SupernovaService.checkUserCanUnregisterTheTournament(req.internalRestClient, `${userId}`, Number(vendorId), tournamentId);
            if (canUnregisterTournamentResponse && !canUnregisterTournamentResponse?.canUnregisterTournament) {
                let error: ServiceError = ServiceErrorUtil.getInvalidUnregisterTournament();
                error.message = canUnregisterTournamentResponse?.reason ?? error.message;
                throw error;
            }
            const response: string = await GsService.unregisterPlayerForTournament(req.internalRestClient, tournamentId, body, token, vendorId);
            logger.info(`[unregisterPlayerForTournament] game server success response ${JSON.stringify(response)} tournamentId ${tournamentId}`);
            const resp: IPlayerTournamentUnregisterResponse = {
                message: response,
                userId: userId,
                tournamentId: tournamentId
            }
            logger.info(`[unregisterPlayerForTournament] final response ${JSON.stringify(resp)} tournamentId ${tournamentId}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            logger.error(e, `[unregisterPlayerForTournament] error `,)
            next(e);
        }

    }

    static async unregisterPlayerForTournamentV3(req, res, next): Promise<any> {
        try {
            const {params, query, body} = req;
            const tournamentId: string = LobbyController.getTournamentIdFromParam(params);
            const token: string = req.cookieManager.getToken();
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req?.vendorId;
            logger.info(`[unregisterPlayerForTournament] tournamentId ${tournamentId}`);

            appVersionUtil(req);
            const LocationDetails = req.sessionManager.getLocation();

            const isTournamentMigrated: boolean = await TitanService.checkMigratedTournamentId(req.internalRestClient, Number(tournamentId));

            let enableLocationCheck: boolean = true;
            //If tournament exist in Aries Tournaments
            if(isTournamentMigrated) {
                const tournamentDetails: TitanTournamentResponse = await TitanService.findTitanTournamentById(req.internalRestClient, Number(tournamentId));
                if(tournamentDetails.tournamentType == AriesTournamentType.PSL) {
                    logger.info(`[unregisterPlayerForTournament] disabling location check for PSL tournaments`);
                    enableLocationCheck = true;
                }
            }

            if (!LocationDetails) {
                throw PlanetServiceErrorUtil.getLocationDetailsNotFound();
            }
            const isAllowed = LocationDetails.isAllowed;
            if (enableLocationCheck && !isAllowed) {
                throw PlanetServiceErrorUtil.getLocationRestrictedByGeoCoordinate();
            }
            let gstStateCode: number = req.sessionManager.getLocation().gstStateCode;

            const canUnregisterTournamentResponse: any = await SupernovaService.checkUserCanUnregisterTheTournament(req.internalRestClient, `${userId}`, Number(vendorId), tournamentId);
            if (canUnregisterTournamentResponse && !canUnregisterTournamentResponse?.canUnregisterTournament) {
                let error: ServiceError = ServiceErrorUtil.getInvalidUnregisterTournament();
                error.message = canUnregisterTournamentResponse?.reason ?? error.message;
                throw error;
            }

            let response
            //If tournament exist in Aries Tournaments
            if (isTournamentMigrated) {
                response = await TitanService.unregisterPlayerForTournament(req.internalRestClient, Number(tournamentId), userId, Number(vendorId), gstStateCode);
            }
            else {
                response = await GsService.unregisterPlayerForTournament(req.internalRestClient, tournamentId, body, token, vendorId);
            }
            logger.info(`[unregisterPlayerForTournament] success response ${JSON.stringify(response)} tournamentId ${tournamentId}`);
            const resp: IPlayerTournamentUnregisterResponse = {
                message: response,
                userId: userId,
                tournamentId: tournamentId
            }
            logger.info(`[unregisterPlayerForTournament] final response ${JSON.stringify(resp)} tournamentId ${tournamentId}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            logger.error(e, `[unregisterPlayerForTournament] error `,)
            next(e);
        }

    }

    static async getPlayerTournamentStatus(req, res, next): Promise<any> {
        const {params, query} = req;
        const tournamentId: string = LobbyController.getTournamentIdFromParam(params);
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        logger.info(`[getPlayerTournamentStatus] tournamentId ${tournamentId}`);
        const vendorId: string = req?.vendorId;
        try {
            appVersionUtil(req);
            const response: string = await GsService.getPlayerTournamentStatus(req.internalRestClient, tournamentId, token, vendorId);
            logger.info(`[getPlayerTournamentStatus] game server success response ${JSON.stringify(response)} tournamentId ${tournamentId}`);
            const tounamentStatus: IPlayerTournamentStatus = {
                message: response,
                userId: userId,
                tournamentId: tournamentId
            }
            logger.info(`[getPlayerTournamentStatus] final response ${JSON.stringify(tounamentStatus)} tournamentId ${tournamentId}`);
            ResponseUtil.sendSuccessResponse(res, tounamentStatus);
        } catch (e) {
            logger.error(e, `[getPlayerTournamentStatus] error `,)
            next(e);
        }

    }

    static async getPlayerMTTList(req, res, next): Promise<any> {
        const {params, query} = req;
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[getPlayerMTTList] userId ${userId}`);
        try {
            appVersionUtil(req);
            const response: PlayerMTTList = await GsService.getPlayerMTTList(req.internalRestClient, token, vendorId);
            logger.info(`[getPlayerMTTList] game server success response ${JSON.stringify(response)}`);
            const playerMttListResponse: IPlayerMTTListResponse = LobbyUtil.getPlayerMTTListResponse(response, userId);
            logger.info(`[getPlayerMTTList] final response ${JSON.stringify(playerMttListResponse)}`);
            ResponseUtil.sendSuccessResponse(res, playerMttListResponse);
        } catch (e) {
            logger.error(e, `[getPlayerMTTList] error `,)
            next(e);
        }
    }

    static async getPlayerMTTListV2(req, res, next): Promise<any> {
        const {params, query} = req;
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[getPlayerMTTListV2] userId ${userId}`);
        try {
            appVersionUtil(req);
            //Fetch gs and aries PlayerMTTList
            const gsPlayerMTTListPromise = GsService.getPlayerMTTList(req.internalRestClient, token, vendorId);
            const ariesPlayerMTTListPromise = TitanService.getPlayerMTTList(req.internalRestClient, userId, Number(vendorId));
            const [gsPlayerMTTListResponse, ariesPlayerMTTListResponse] = await (Promise as any).allSettled([gsPlayerMTTListPromise, ariesPlayerMTTListPromise]);

            const gsPlayerMTTList: PlayerMTTList = gsPlayerMTTListResponse.value || {openedList: [], viewingList: []};
            const ariesPlayerMTTList: PlayerMTTList = ariesPlayerMTTListResponse.value || {
                openedList: [],
                viewingList: []
            };

            logger.info(`[getPlayerMTTListV2] PlayerMTTList gsResponse ${JSON.stringify(gsPlayerMTTList)} ariesResponse ${JSON.stringify(ariesPlayerMTTList)} `);

            //merge GS and aries PlayerMTTList
            const combinedPlayerMTTList: PlayerMTTList = {
                openedList: [...gsPlayerMTTList.openedList, ...ariesPlayerMTTList.openedList],
                viewingList: [...gsPlayerMTTList.viewingList, ...ariesPlayerMTTList.viewingList]
            };
            const playerMttListResponse: IPlayerMTTListResponse = LobbyUtil.getPlayerMTTListResponse(combinedPlayerMTTList, userId);
            logger.info(`[getPlayerMTTListV2] final response ${JSON.stringify(playerMttListResponse)}`);
            ResponseUtil.sendSuccessResponse(res, playerMttListResponse);
        } catch (e) {
            logger.error(e, `[getPlayerMTTListV2] error `,)
            next(e);
        }
    }

    static async getMTTList(req, res, next): Promise<any> {
        const {params, query} = req;
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[getMTTList] userId ${userId}`);
        try {
            appVersionUtil(req);
            const response: Tournament[] = await GsService.getMTTList(req.internalRestClient, token, vendorId);
            logger.info(`[getMTTList] game server success response ${JSON.stringify(response)} userId ${userId}`);
            const userOpenedTournamentList: PlayerMTTList = await GsService.getPlayerMTTList(req.internalRestClient, token, vendorId);
            const tournamentsResponse: ITournamentListResponse[] = LobbyUtil.getTournamentList(response, userOpenedTournamentList)
            const resp = {
                tournaments: tournamentsResponse
            }
            logger.info(`[getMTTList] final response ${JSON.stringify(resp)} userId ${userId}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            logger.error(e, `[getMTTList] error `,)
            next(e);
        }
    }

    static async getMTTListV2(req, res, next): Promise<any> {
        const {params, query} = req;
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        logger.info(`[getMTTList] userId ${userId}`);
        const vendorId: string = req?.vendorId;
        try {
            appVersionUtil(req);
            const response: Tournament[] = await GsService.getMTTListV2(req.internalRestClient, token, vendorId);
            logger.info(`[getMTTList] game server success response ${JSON.stringify(response)} userId ${userId}`);
            const userOpenedTournamentList: PlayerMTTList = await GsService.getPlayerMTTList(req.internalRestClient, token, vendorId);
            const tournamentsResponse: ITournamentListResponse[] = LobbyUtil.getTournamentListV2(response, userOpenedTournamentList)
            const resp = {
                tournaments: tournamentsResponse
            }
            logger.info(`[getMTTList] final response ${JSON.stringify(resp)} userId ${userId}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            logger.error(e, `[getMTTList] error `,)
            next(e);
        }
    }

    static async getMTTListV3(req, res, next): Promise<any> {
        const {params, query} = req;
        const token: string = req.cookieManager.getToken();
        const userId: number = req.sessionManager.getLoggedInUserId();
        logger.info(`[getMTTList] userId ${userId}`);
        const vendorId: string = req?.vendorId;
        try {
            appVersionUtil(req);

            //Fetch gs and aries tournaments
            const gsTournamentsPromise = GsService.getMTTListV2(req.internalRestClient, token, vendorId);
            const ariesTournamentPromise = TitanService.getTournaments(req.internalRestClient, Number(vendorId));
            const [gsResponse, ariesResponse] = await (Promise as any).allSettled([gsTournamentsPromise, ariesTournamentPromise]);

            const gsTournaments: Tournament[] = gsResponse.value || [];
            const ariesTournaments: Tournament[] = ariesResponse.value || [];

            logger.info(`[getMTTList] gsResponse ${JSON.stringify(gsTournaments)} ariesResponse ${JSON.stringify(ariesTournaments)} `);

            //Fetch gs and aries PlayerMTTList
            const gsPlayerMTTListPromise = GsService.getPlayerMTTListV3(req.internalRestClient, token, vendorId);
            const ariesPlayerMTTListPromise = TitanService.getPlayerMTTList(req.internalRestClient, userId, Number(vendorId));
            const [gsPlayerMTTListResponse, ariesPlayerMTTListResponse] = await (Promise as any).allSettled([gsPlayerMTTListPromise, ariesPlayerMTTListPromise]);

            const gsPlayerMTTList: PlayerMTTList = gsPlayerMTTListResponse.value || {openedList: [], viewingList: []};
            const ariesPlayerMTTList: PlayerMTTList = ariesPlayerMTTListResponse.value || {
                openedList: [],
                viewingList: []
            };

            logger.info(`[getMTTList] PlayerMTTList gsResponse ${JSON.stringify(gsPlayerMTTList)} ariesResponse ${JSON.stringify(ariesPlayerMTTList)} `);

            //merge GS and aries tournaments
            const combinedTournaments: Tournament[] = [...gsTournaments, ...ariesTournaments];
            const combinedPlayerMTTList: PlayerMTTList = {
                openedList: [...gsPlayerMTTList.openedList, ...ariesPlayerMTTList.openedList],
                viewingList: [...gsPlayerMTTList.viewingList, ...ariesPlayerMTTList.viewingList]
            };

            //getTournamentList from combinedTournaments and combinedPlayerMTTList
            const tournamentsResponse: ITournamentListResponseV3[] = LobbyUtil.getTournamentListV3(combinedTournaments, combinedPlayerMTTList)
            const resp = {
                tournaments: tournamentsResponse
            }
            logger.info(`[getMTTList] final response ${JSON.stringify(resp)} userId ${userId}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            logger.error(e, `[getMTTList] error `,)
            next(e);
        }
    }

    static getLobbyConfig = async (req, res, next) => {
        const userId = req.sessionManager.getLoggedInUserId();
        const vendorId: string = req?.vendorId;
        logger.info(`[LobbyController] [getLobbyConfig] Request userId :: ${userId}, vendorId :: ${vendorId}`);
        const resp = LobbyService.getLobbyConfig(userId, vendorId);
        logger.info(resp, `[LobbyController] [getLobbyConfig] Response ::  `);
        ResponseUtil.sendSuccessResponse(res, resp);
    }

    static async getDefaultChatSuggestion(req, res, next): Promise<any> {
        const vendorId: string = req?.vendorId;
        try {
            const resp = getDefaultChatSuggestionsForVendor()[vendorId]
            ResponseUtil.sendSuccessResponse(res, {"defaultSuggestionMsg": resp});
        } catch (e) {
            logger.error(e, `[getDefaultChatSuggestion] error `,)
            next(e);
        }
    }

    static getPracticeLobbyConfig = async (req, res, next) => {
        const userId = req.sessionManager.getLoggedInUserId();
        logger.info(userId, `[LobbyController] [getPracticeLobbyConfig] Request userId :: `);
        const resp = LobbyService.getPracticeLobbyConfig(userId);
        logger.info(resp, `[LobbyController] [getPracticeLobbyConfig] Response ::  `);
        ResponseUtil.sendSuccessResponse(res, resp);
    }

    static openTable = async (req, res, next) => {
        try {
            const userId = req.sessionManager.getLoggedInUserId();
            const {params, query, body} = req;
            const tableId: string = LobbyController.getTableIdFromParam(params)
            const roomId: string = body?.roomId;
            const token: string = req.cookieManager.getToken();
            const vendorId: string = req?.vendorId;
            const isPractice: boolean = body?.isPractice;

            logger.info(`[openTable] tableId ${tableId} roomId ${roomId} userId ${userId} vendorId ${vendorId} isPractice ${isPractice}`);
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            const room: Room = await AriesService.validateOpenTableRequest(req.internalRestClient, userId, roomId, isPractice);


            await AriesService.openTable(req.internalRestClient, tableId, userId, vendorId, isPractice);

            ResponseUtil.sendSuccessResponse(res, {});
        } catch (e) {
            logger.error(e, `[openTable] error `,)
            next(e);
        }
    }

    static async getTableDetails(req: any, res: any, next): Promise<void> {
        try {
            const userId = req.sessionManager.getLoggedInUserId();
            const {params, query, body} = req;
            const tableId: string = LobbyController.getTableIdFromParam(params)
            const vendorId: string = req?.vendorId;
            logger.info(`[getTableDetails] tableId ${tableId} userId ${userId} vendorId ${vendorId}`);
            const response: TableMetaAndSeatDetails = await AriesService.getTableDetails(req.internalRestClient, tableId);
            const tableDetails: ITableMetaAndSeatDetails = LobbyUtil.getTableMetaAndSeatDetails(response, userId);
            ResponseUtil.sendSuccessResponse(res, tableDetails);
        } catch (e) {
            logger.error(e, `[getTableDetails] error `,)
            next(e);
        }
    }

    static  async getTournamentObserverTableIdByUsername(req: any, res: any, next): Promise<void>  {
        try {
            const {query} = req;
            logger.info(query,`[getTournamentObserverTableIdByUsername] query: `);
            const tournamentId: string = LobbyController.getTournamentIdFromParam(query)
            const tournamentUserName: string = LobbyController.getTournamentPlayerUserNameParam(query);
            logger.info(`[getTournamentObserverTableIdByUsername] tournamentId: ${tournamentId}  tournamentUserName: ${tournamentUserName}`);
            const tournament: TitanTournamentResponse | undefined = await TitanService.findTitanTournamentById(req.internalRestClient, Number(tournamentId))
            logger.info(`[getTournamentObserverTableIdByUsername] tournament: ${JSON.stringify(tournament)} `);
            if(tournament && tournament?.status && !TournamentUtil.isTournamentRunning(tournament?.status)){
                throw ServiceErrorUtil.getTournamentNotInRunningStateError();
            }
            // fetching userId from titan by tournamentId and tournamentUserName
            const tournamentUserDetailResponse: TournamentUserDetailResponse = await TitanService.getTournamentObserverDetailsByUsername(req.internalRestClient, Number(tournamentId),tournamentUserName);
            const userId = tournamentUserDetailResponse?.userId;
            const isUserBusted = tournamentUserDetailResponse?.isBusted
            logger.info(`[getTournamentObserverTableIdByUsername] userId: ${userId} isUserBusted ${isUserBusted}`);
            if(isUserBusted){
                throw ServiceErrorUtil.getTournamentPlayerBustedError();
            }
            if(!userId){
                throw ServiceErrorUtil.getTournamentObserverTableIdNotFoundError();
            }
            // fetching tableId from aries tournament by tournamentId and userId
            const tableId = await AriesTournamentService.getTournamentObserverTableId(req.internalRestClient, Number(tournamentId), userId);
            logger.info(`[getTournamentObserverTableIdByUsername] tableId: ${tableId}`);

            if(!tableId){
                throw ServiceErrorUtil.getTournamentObserverTableIdNotFoundError();
            }

            const response : TournamentObserverTableId = {
                tableId: tableId,
            }
            ResponseUtil.sendSuccessResponse(res, response);
        } catch(e) {
            logger.error(e, `[getTournamentObserverTableIdByUsername] error `,)
            next(e);
        }
    }

    private static getTableIdFromParam(params: any): string {
        const tableId: string = RequestUtil.parseQueryParamAsString(params, REQUEST_PARAMS.TABLE_ID_PARAM);
        if (tableId === 'undefined') {
            return '';
        }
        return tableId;
    }

    private static getTournamentIdFromParam(params: any): string {
        return RequestUtil.parseQueryParamAsString(
            params,
            REQUEST_PARAMS.TOURNAMENT_ID_PARAM,
        )
    }

    private static getTournamentPlayerUserNameParam(params: any): string {
        return RequestUtil.parseQueryParamAsString(
            params,
            REQUEST_PARAMS.TOURNAMENT_USER_NAME,
        )
    }

    private static getRoomIdFormParams(params): string {
        return RequestUtil.parseQueryParamAsString(
            params,
            REQUEST_PARAMS.ROOM_ID_PARAM,
        )
    }

    private static getGroupIdFormParams(params): number {
        return RequestUtil.parseQueryParamAsNumber(
            params,
            REQUEST_PARAMS.GROUP_ID_PARAM,
        )
    }

}
