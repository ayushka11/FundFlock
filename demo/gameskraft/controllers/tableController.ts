import PlanetServiceErrorUtil from '../errors/planet/planet-error-util';
import { JoinSimilarTable } from '../models/join-similar-table';
import { JoinSimilarTableDetails } from '../models/join-similar-table-details';
import { ReserveSeat } from '../models/reserve-seat';
import { ReserveSeatDetails } from '../models/reserve-seat-details';
import SupernovaService from '../services/supernovaService';
import LoggerUtil, { ILogger } from "../utils/logger";
import { CASH_APP, REQUEST_PARAMS } from '../constants/constants';
import RequestUtil from "../helpers/request-util";
import {
    IJoinSimilarTable,
    IPlayerJoinBack,
    IPlayerLeaveTableData,
    IPlayerRebuyData,
    IPlayerTopupData, IPlayerTournamentJoinBack, IPlayerTournamentLeaveTableData,
    IReserveSeat,
    ITopupValuesData
} from '../models/gateway/response';
import { PlayerLeaveTable } from "../models/player-leave-table";
import { PlayerRebuy } from "../models/player-rebuy";
import { PlayerTopup } from "../models/player-topup";
import { Room } from "../models/room";
import { TopupValue } from "../models/topup-value";
import { TableUtil } from "../utils/table-util";
import { PlayerJoinBack } from "../models/player-join-back";
import ResponseUtil from '../utils/response-util';
import { appVersionUtil } from '../utils/app-version-util';
import { AriesService } from "../services/ariesService";
import { TableResultResponse } from "../models/aries/table-result";
import { TablePlayerStatsResponse } from "../models/aries/table-player-stats";
import AriesUtil from "../utils/aries-util";
import AppConfigService from '../services/appConfigService';
import ServiceErrorUtil from "../errors/service-error-util";
import { getAutoTopUpFlagForPlatformForVendor } from '../services/configService';
import ClsUtil from '../utils/cls-util';
import { IUserAutoTopUpSetting, UserGameplaySettings } from "../models/zodiac/gameplay";
import ZodiacUtil from "../utils/zodiac-util";
import ZodiacService from "../services/zodiacService";

const restHelper = require("../helpers/restHelper");

const logger: ILogger = LoggerUtil.get("TableController");

export default class TableController {

    static async playerTopupRequest(req, res, next): Promise<any> {
        try {
            const { params, query, body } = req;
            appVersionUtil(req);
            const tableId: string = TableController.getTableIdFromParam(params);
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req?.vendorId;
            const { roomId } = req.body;
            logger.info(`[playerTopupRequest] tableId ${tableId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validateTopupRequest(req.internalRestClient, userId, `${roomId}`, false)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: PlayerTopup = await AriesService.topupRequest(req.internalRestClient, tableId, userId, vendorId, body?.amount ?? 0);
            logger.info(`[playerTopupRequest] game server success response ${JSON.stringify(response)}`);
            const playerTopup: IPlayerTopupData = TableUtil.getPlayerTopupResponse(response, userId, tableId);
            logger.info(`[playerTopupRequest] final response ${JSON.stringify(playerTopup)}`);
            ResponseUtil.sendSuccessResponse(res, playerTopup);
        } catch (e) {
            logger.error(e, `[playerTopupRequest] error `,)
            next(e);
        }
    }

    static async playerPracticeTopupRequest(req, res, next): Promise<any> {
        try {
            const { params, query, body } = req;
            appVersionUtil(req);
            const tableId: string = TableController.getTableIdFromParam(params);
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req?.vendorId;
            const { roomId } = req.body;
            logger.info(`[playerPracticeTopupRequest] tableId ${tableId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validateTopupRequest(req.internalRestClient, userId, `${roomId}`, true)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: PlayerTopup = await AriesService.topupRequest(req.internalRestClient, tableId, userId, vendorId, body?.amount ?? 0);
            logger.info(`[playerPracticeTopupRequest] game server success response ${JSON.stringify(response)}`);
            const playerTopup: IPlayerTopupData = TableUtil.getPlayerPracticeTopupResponse(response, userId, tableId);
            logger.info(`[playerPracticeTopupRequest] final response ${JSON.stringify(playerTopup)}`);
            ResponseUtil.sendSuccessResponse(res, playerTopup);
        } catch (e) {
            logger.error(e, `[playerPracticeTopupRequest] error `,)
            next(e);
        }
    }

    static async playerRebuyRequest(req, res, next): Promise<any> {
        try {
            const { params, query, body } = req;
            appVersionUtil(req);
            const tableId: string = TableController.getTableIdFromParam(params);
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req?.vendorId;
            const roomId = req.body.roomId;
            logger.info(`[playerRebuyRequest] tableId ${tableId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validateRebuyRequest(req.internalRestClient, userId, `${roomId}`, false)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: PlayerRebuy = await AriesService.playerRebuyRequest(req.internalRestClient, tableId, userId, body, vendorId);
            logger.info(`[playerRebuyRequest] game server success response ${JSON.stringify(response)}`);
            const playerRebuy: IPlayerRebuyData = TableUtil.getPlayerRebuyResponse(response, userId, tableId);
            logger.info(`[playerRebuyRequest] final response ${JSON.stringify(playerRebuy)}`);
            ResponseUtil.sendSuccessResponse(res, playerRebuy);
        } catch (e) {
            logger.error(e, `[playerRebuyRequest] error `,)
            next(e);
        }
    }

    static async playerPracticeRebuyRequest(req, res, next): Promise<any> {
        try {
            const { params, query, body } = req;
            appVersionUtil(req);
            const tableId: string = TableController.getTableIdFromParam(params);
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req?.vendorId;
            const roomId = req.body.roomId;
            logger.info(`[playerPracticeRebuyRequest] tableId ${tableId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validateRebuyRequest(req.internalRestClient, userId, `${roomId}`, true)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: PlayerRebuy = await AriesService.playerRebuyRequest(req.internalRestClient, tableId, userId, body, vendorId);
            logger.info(`[playerPracticeRebuyRequest] game server success response ${JSON.stringify(response)}`);
            const playerRebuy: IPlayerRebuyData = TableUtil.getPlayerPracticeRebuyResponse(response, userId, tableId);
            logger.info(`[playerPracticeRebuyRequest] final response ${JSON.stringify(playerRebuy)}`);
            ResponseUtil.sendSuccessResponse(res, playerRebuy);
        } catch (e) {
            logger.error(e, `[playerRebuyRequest] error `,)
            next(e);
        }
    }

    static async playerLeaveTable(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, query, body } = req;
            const tableId: string = TableController.getTableIdFromParam(params);
            const roomId: number = body?.roomId;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req?.vendorId;
            logger.info(`[playerLeaveTable] tableId ${tableId}`);
            if (tableId && tableId.includes('_play')) {
                logger.info(`[playerLeaveTable] tableId ${tableId} is tournament table`);
                ResponseUtil.sendSuccessResponse(res, {});
                return;
            }
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validatePlayerLeaveTableRequest(req.internalRestClient, userId, `${roomId}`)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: PlayerLeaveTable = await AriesService.leaveTable(req.internalRestClient, tableId, userId, vendorId);
            logger.info(`[playerLeaveTable] aries success response ${JSON.stringify(response)}`);
            const playerLeaveTable: IPlayerLeaveTableData = TableUtil.getPlayerLeaveTableResponse(response, userId, roomId);
            logger.info(`[playerLeaveTable] final response ${JSON.stringify(playerLeaveTable)}`);
            ResponseUtil.sendSuccessResponse(res, playerLeaveTable);
        } catch (e) {
            logger.error(e, `[playerLeaveTable] error `,)
            next(e)
        }
    }

    static async playerTournamentLeaveTable(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const {params, query, body} = req;
            const tournamentId: number = TableController.getTournamentIdFromParam(params);
            const tableId: string = body?.tableId;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req?.vendorId;
            logger.info(`[playerLeaveTable] tournamentId ${tournamentId}`);

            if (!tournamentId) {
                throw ServiceErrorUtil.getTournamentIdNotFoundError();
            }

            const response: PlayerLeaveTable = await AriesService.tournamentLeaveTable(req.internalRestClient, tournamentId, userId, vendorId, tableId);
            logger.info(`[playerLeaveTable] aries success response ${JSON.stringify(response)}`);
            const playerLeaveTable: IPlayerTournamentLeaveTableData = TableUtil.getPlayerTournamentLeaveTableResponse(response, userId);
            logger.info(`[playerLeaveTable] final response ${JSON.stringify(playerLeaveTable)}`);
            ResponseUtil.sendSuccessResponse(res, playerLeaveTable);
        } catch (e) {
            logger.error(e, `[playerLeaveTable] error `,)
            next(e)
        }
    }

    static async playerUnreserveTable(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, query, body } = req;
            const tableId: string = TableController.getTableIdFromParam(params);
            const userId: string = req.sessionManager.getLoggedInUserId();
            const roomId: number = body.roomId
            const vendorId = req?.vendorId;
            logger.info(`[playerUnreserveRoom] tableId ${tableId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validatePlayerUnreserveTableRequest(req.internalRestClient, userId, `${roomId}`)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: boolean = await AriesService.playerUnreserveRoom(req.internalRestClient, tableId, userId, vendorId);
            logger.info(`[playerUnreserveRoom] aries success response ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, {});
        } catch (e) {
            logger.error(e, `[playerUnreserveRoom] error `,)
            next(e)
        }
    }

    static async getTopupValues(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, query, body } = req;
            const tableId: string = TableController.getTableIdFromParam(params);
            const roomId: number = body.roomId;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req?.vendorId;
            const appType = ClsUtil.getAppType();
            logger.info(`[getTopupValues] tableId ${tableId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validateTopupRequest(req.internalRestClient, userId, `${roomId}`, false)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }

            // Auto Top Up Flag
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const headers = req?.headers;
            let platform: string = ''
            if (headers.hasOwnProperty("gk-platform")) {
                platform = headers["gk-platform"]
            }
            logger.info(`[getTopupValues] userUniqueId :: ${userUniqueId} platform :: ${platform}`);
            const autoTopUpFlagForPlatform = getAutoTopUpFlagForPlatformForVendor()[vendorId];
            logger.info(`[getTopupValues] autoTopUpFlagForPlatform = ${JSON.stringify(autoTopUpFlagForPlatform)}`);
            const autoTopUpFlag: boolean = autoTopUpFlagForPlatform[platform] || false;
            logger.info(`[getTopupValues] autoTopUpFlag = ${autoTopUpFlag}`);


            const response: TopupValue = await AriesService.topupDetails(req.internalRestClient, tableId, userId, vendorId);
            logger.info(`[getTopupValues] aries  success response ${JSON.stringify(response)}`);
            const topupValues: ITopupValuesData = TableUtil.getTopupValuesResponse(response, userId);
            if (autoTopUpFlag && appType === CASH_APP) {
                const gameplaySettings: UserGameplaySettings = await ZodiacService.getUserGameplaySettings(req.internalRestClient, userUniqueId);
                const autoTopUpSetting: IUserAutoTopUpSetting = ZodiacUtil.getAutoTopUpSettings(gameplaySettings);
                topupValues.autoTopUpSetting = autoTopUpSetting;
            }
            logger.info(`[getTopupValues] final response ${JSON.stringify(topupValues)}`);
            ResponseUtil.sendSuccessResponse(res, topupValues);
        } catch (e) {
            logger.error(e, `[getTopupValues] error `,)
            next(e);
        }
    }

    static async playerJoinBack(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, query, body } = req;
            const tableId: string = TableController.getTableIdFromParam(params);
            const roomId: number = body.roomId;
            const userId: string = req.sessionManager.getLoggedInUserId();
            logger.info(`[playerJoinBack] tableId ${tableId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validatePlayerJoinBack(req.internalRestClient, userId, `${roomId}`, false)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: PlayerJoinBack = await AriesService.playerJoinBack(req.internalRestClient, tableId, userId);
            logger.info(`[playerJoinBack] aries success response ${JSON.stringify(response)}`);
            const playerJoinBack: IPlayerJoinBack = AriesUtil.getPlayerJoinBackResponse(response, userId, roomId, tableId);
            ResponseUtil.sendSuccessResponse(res, playerJoinBack);
        } catch (e) {
            logger.error(e, `[playerJoinBack] error `,)
            next(e);
        }
    }


    static async playerTournamentTableJoinBack(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const {
                params,
                query,
                body
            } = req;
            const tournamentId: number = TableController.getTournamentIdFromParam(params);
            const roomId: number = body.roomId;
            const userId: string = req.sessionManager.getLoggedInUserId();
            logger.info(`[playerTournamentTableJoinBack] tournamentId ${tournamentId}`);
            if (!tournamentId) {
                throw ServiceErrorUtil.getTournamentIdNotFoundError();
            }
            const response: PlayerJoinBack = await AriesService.playerTournamentTableJoinBack(req.internalRestClient, tournamentId, userId);
            logger.info(`[playerTournamentTableJoinBack] aries success response ${JSON.stringify(response)}`);
            const playerJoinBack: IPlayerTournamentJoinBack = AriesUtil.getPlayerTournamentTableJoinBackResponse(response, userId, tournamentId);
            ResponseUtil.sendSuccessResponse(res, playerJoinBack);
        } catch (e) {
            logger.error(e, `[playerTournamentTableJoinBack] error `,)
            next(e);
        }
    }

    static async playerSitOut(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, body } = req;
            const tableId: string = TableController.getTableIdFromParam(params);
            const roomId: number = body.roomId;
            const enableSitOut: boolean = body?.enableSitout ?? true;
            const userId: string = req.sessionManager.getLoggedInUserId();
            logger.info(`[playerSitOut] tableId ${tableId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validatePlayerSitOut(req.internalRestClient, userId, `${roomId}`, false)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: boolean = await AriesService.playerSitOut(req.internalRestClient, tableId, userId, enableSitOut);
            logger.info(`[playerSitOut] aries success response ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            logger.error(e, `[playerSitOut] error `,)
            next(e);
        }
    }

    static async playerTournamentTableSitOut(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const {params, query, body} = req;
            const tournamentId: number = TableController.getTournamentIdFromParam(params);
            const userId: string = req.sessionManager.getLoggedInUserId();
            const enableSitOut: boolean = body?.enableSitout ?? true;
            logger.info(`[playerTournamentTableSitOut] tournamentId ${tournamentId}`);
            if (!tournamentId) {
                throw ServiceErrorUtil.getTournamentIdNotFoundError();
            }
            const response: boolean = await AriesService.playerTournamentTableSitOut(req.internalRestClient, tournamentId, userId, enableSitOut);
            logger.info(`[playerTournamentTableSitOut] aries success response ${JSON.stringify(response)}`);
            logger.info(`[playerTournamentTableSitOut] aries success response ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            logger.error(e, `[playerTournamentTableSitOut] error `,)
            next(e);
        }
    }

    static async getPracticeTopupValues(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, query, body } = req;
            const tableId: string = TableController.getTableIdFromParam(params);
            const roomId: number = body.roomId;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId = req?.vendorId;
            const appType = ClsUtil.getAppType();
            logger.info(`[getPracticeTopupValues] tableId ${tableId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validateTopupRequest(req.internalRestClient, userId, `${roomId}`, true)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }

            // Auto Top Up Flag
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const headers = req?.headers;
            let platform: string = ''
            if (headers.hasOwnProperty("gk-platform")) {
                platform = headers["gk-platform"]
            }
            logger.info(`[getPracticeTopupValues] userUniqueId :: ${userUniqueId} platform :: ${platform}`);
            const autoTopUpFlagForPlatform = getAutoTopUpFlagForPlatformForVendor()[vendorId];
            logger.info(`[getPracticeTopupValues] autoTopUpFlagForPlatform = ${JSON.stringify(autoTopUpFlagForPlatform)}`);
            const autoTopUpFlag: boolean = autoTopUpFlagForPlatform[platform] || false;
            logger.info(`[getPracticeTopupValues] autoTopUpFlag = ${autoTopUpFlag}`);

            const response: TopupValue = await AriesService.topupDetails(req.internalRestClient, tableId, userId, vendorId);
            logger.info(`[getPracticeTopupValues] game server success response ${JSON.stringify(response)}`);
            const topupValues: ITopupValuesData = TableUtil.getPracticeTopupValuesResponse(response, userId);
            if (autoTopUpFlag && appType === CASH_APP) {
                const gameplaySettings: UserGameplaySettings = await ZodiacService.getUserGameplaySettings(req.internalRestClient, userUniqueId);
                const autoTopUpSetting: IUserAutoTopUpSetting = ZodiacUtil.getAutoTopUpSettings(gameplaySettings);
                topupValues.autoTopUpSetting = autoTopUpSetting;
            }
            logger.info(`[getPracticeTopupValues] final response ${JSON.stringify(topupValues)}`);
            ResponseUtil.sendSuccessResponse(res, topupValues);
        } catch (e) {
            logger.error(e, `[getPracticeTopupValues] error `,)
            next(e)
        }
    }

    static async playerPracticeJoinBack(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, query, body } = req;
            const tableId: string = TableController.getTableIdFromParam(params);
            const roomId: number = body.roomId;
            const userId: string = req.sessionManager.getLoggedInUserId();
            logger.info(`[playerPracticeJoinBack] tableId ${tableId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validatePlayerJoinBack(req.internalRestClient, userId, `${roomId}`, true)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: PlayerJoinBack = await AriesService.playerJoinBack(req.internalRestClient, tableId, userId);
            logger.info(`[playerPracticeJoinBack] aries success response ${JSON.stringify(response)}`);
            const playerJoinBack: IPlayerJoinBack = AriesUtil.getPlayerJoinBackResponse(response, userId, roomId, tableId);
            ResponseUtil.sendSuccessResponse(res, playerJoinBack)
        } catch (e) {
            logger.error(e, `[playerPracticeJoinBack] error `,)
            next(e)
        }
    }

    static async playerPracticeSitOut(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, body } = req;
            const tableId: string = TableController.getTableIdFromParam(params);
            const roomId: number = body.roomId;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const enableSitOut: boolean = body?.enableSitout ?? true;
            logger.info(`[playerPracticeSitOut] tableId ${tableId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validatePlayerSitOut(req.internalRestClient, userId, `${roomId}`, true)
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: boolean = await AriesService.playerSitOut(req.internalRestClient, tableId, userId, enableSitOut);
            logger.info(`[playerPracticeSitOut] aries success response ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            logger.error(e, `[playerPracticeSitOut] error `,)
            next(e);
        }
    }

    static async cashGameBuyInDetails(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, query, body } = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId = req?.vendorId;
            const amount: number = RequestUtil.parseQueryParamAsNumberWithTwoDecimal(query, REQUEST_PARAMS.AMOUNT);
            const response = await SupernovaService.getCashGameBuyInDetails(req.internalRestClient, userId, { amount: amount }, Number(vendorId));
            ResponseUtil.sendSuccessResponse(res, TableUtil.getBuyInDetailsResponse(response));
        } catch (e) {
            logger.error(e, `[cashGameBuyInDetails] error `,)
            next(e)
        }
    }

    static async getPracticeTableResult(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, query, body } = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const tableId: string = TableController.getTableIdFromParam(params);
            const roomId: number = TableController.getRoomIdFormParams(query);
            logger.info(`[getPracticeTableResult] tableId ${tableId} roomId ${roomId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validateTableResult(req.internalRestClient, userId, `${roomId}`, true);
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: TableResultResponse = await AriesService.getPracticeTableResult(req.internalRestClient, tableId, userId);
            logger.info(`[getPracticeTableResult] aries success response ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            logger.error(e, `[getPracticeTableResult] error `,)
            next(e)
        }
    }

    static async getCashTableResult(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, query, body } = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const tableId: string = TableController.getTableIdFromParam(params);
            const roomId: number = TableController.getRoomIdFormParams(query);
            logger.info(`[getCashTableResult] tableId ${tableId} roomId ${roomId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }

            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validateTableResult(req.internalRestClient, userId, `${roomId}`, false)

            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: TableResultResponse = await AriesService.getCashTableResult(req.internalRestClient, tableId, userId);
            logger.info(`[getCashTableResult] aries success response ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            logger.error(e, `[getCashTableResult] error `,)
            next(e)
        }
    }

    static async getPracticeTablePlayerStats(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, query, body } = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const tableId: string = TableController.getTableIdFromParam(params);
            const roomId: number = TableController.getRoomIdFormParams(query);
            logger.info(`[getPracticeTablePlayerStats] tableId ${tableId} roomId ${roomId} userId ${userId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validateTablePlayerStats(req.internalRestClient, userId, `${roomId}`, true);
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: TablePlayerStatsResponse = await AriesService.getPracticeTablePlayerStats(req.internalRestClient, tableId, userId);
            logger.info(`[getPracticeTablePlayerStats] aries success response ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            logger.error(e, `[getPracticeTablePlayerStats] error `,)
            next(e)
        }
    }

    static async getCashTablePlayerStats(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, query, body } = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const tableId: string = TableController.getTableIdFromParam(params);
            const roomId: number = TableController.getRoomIdFormParams(query);
            logger.info(`[getCashTablePlayerStats] tableId ${tableId} roomId ${roomId} userId ${userId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const room: Room = await AriesService.validateTablePlayerStats(req.internalRestClient, userId, `${roomId}`, false);
            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: TablePlayerStatsResponse = await AriesService.getCashTablePlayerStats(req.internalRestClient, tableId, userId);
            logger.info(`[getCashTablePlayerStats] aries success response ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            logger.error(e, `[getCashTablePlayerStats] error `,)
            next(e)
        }
    }

    static async getPracticeTableOtherPlayerStats(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, query, body } = req;
            const userId: string = TableController.getPlayerIdFromParam(params);
            const tableId: string = TableController.getTableIdFromParam(params);
            const roomId: number = TableController.getRoomIdFormParams(query);
            logger.info(`[getPracticeTableOtherPlayerStats] tableId ${tableId} roomId ${roomId} userId ${userId}`);


            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }

            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }

            const room: Room = await AriesService.validateTablePlayerStats(req.internalRestClient, userId, `${roomId}`, true);

            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: TablePlayerStatsResponse = await AriesService.getPracticeTablePlayerStats(req.internalRestClient, tableId, userId);
            logger.info(`[getPracticeTableOtherPlayerStats] aries success response ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            logger.error(e, `[getPracticeTableOtherPlayerStats] error `,)
            next(e)
        }
    }

    static async getCashTableOtherPlayerStats(req, res, next): Promise<any> {
        try {
            appVersionUtil(req);
            const { params, query, body } = req;
            const userId: string = TableController.getPlayerIdFromParam(params);
            const tableId: string = TableController.getTableIdFromParam(params);
            const roomId: number = TableController.getRoomIdFormParams(query);
            logger.info(`[getCashTableOtherPlayerStats] tableId ${tableId} roomId ${roomId} userId ${userId}`);
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }

            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }

            const room: Room = await AriesService.validateTablePlayerStats(req.internalRestClient, userId, `${roomId}`, false);

            if (!room) {
                throw ServiceErrorUtil.getInvalidRoomError();
            }
            const response: TablePlayerStatsResponse = await AriesService.getCashTablePlayerStats(req.internalRestClient, tableId, userId);
            logger.info(`[getCashTableOtherPlayerStats] aries success response ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            logger.error(e, `[getCashTableOtherPlayerStats] error `,)
            next(e)
        }
    }

    static async reserveSeat(req, res, next): Promise<any> {
        try {
            const {
                params,
                query,
                body
            } = req;
            appVersionUtil(req);
            const tableId: string = TableController.getTableIdFromParam(params);
            const userId: string = req.sessionManager.getLoggedInUserId();
            const roomId: string = body.roomId;
            const seatId: number = body.seatId;
            const reserveSeatDetails: ReserveSeatDetails = AriesUtil.getReserveSeatDetailsFromRequest(req, roomId, tableId, seatId, false)
            if (!reserveSeatDetails?.locationDetails) {
                throw PlanetServiceErrorUtil.getLocationDetailsNotFound();
            }
            if (!reserveSeatDetails?.locationDetails?.isAllowed) {
                throw PlanetServiceErrorUtil.getLocationRestrictedByGeoCoordinate();
            }
            logger.info(`[ReserveSeat] tableId ${tableId} roomId ${roomId}`);
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            if (!roomId) {
                throw ServiceErrorUtil.getRoomIdNotFoundError();
            }
            const roomInfo: Room = await AriesService.validateReserveSeat(req.internalRestClient, userId, `${roomId}`, false);
            const response: ReserveSeat = await AriesService.reserveSeat(req.internalRestClient, tableId, userId, reserveSeatDetails, roomInfo);
            logger.info(`[ReserveSeat] aries success response ${JSON.stringify(response)}`);
            const reserveSeatResponse: IReserveSeat = TableUtil.getReserveSeatResponse(response, userId, reserveSeatDetails?.vendorId);
            logger.info(`[ReserveSeat] final response ${JSON.stringify(reserveSeatResponse)}`);
            ResponseUtil.sendSuccessResponse(res, reserveSeatResponse);
        } catch (e) {
            logger.error(e, `[ReserveSeat] error `);
            next(e);
        }
    }

    static async practiceReserveSeat(req, res, next): Promise<any> {
        try {
            const {
                params,
                query,
                body
            } = req;
            appVersionUtil(req);
            const tableId: string = TableController.getTableIdFromParam(params);
            const userId: string = req.sessionManager.getLoggedInUserId();
            const roomId: string = body.roomId;
            const seatId: number = body.seatId;
            const reserveSeatDetails: ReserveSeatDetails = AriesUtil.getReserveSeatDetailsFromRequest(req, roomId, tableId, seatId, true)
            logger.info(`[practiceReserveSeat] tableId ${tableId}`);
            if (!tableId) {
                throw ServiceErrorUtil.getTableIdNotFoundError();
            }
            const roomInfo: Room = await AriesService.validateReserveSeat(req.internalRestClient, userId, `${roomId}`, true);
            const response: ReserveSeat = await AriesService.reserveSeat(req.internalRestClient, tableId, userId, reserveSeatDetails, roomInfo);
            logger.info(`[practiceReserveSeat] aries success response ${JSON.stringify(response)}`);
            const reserveSeatResponse: IReserveSeat = TableUtil.getReserveSeatResponse(response, userId, reserveSeatDetails?.vendorId);
            logger.info(`[practiceReserveSeat] final response ${JSON.stringify(reserveSeatResponse)}`);
            ResponseUtil.sendSuccessResponse(res, reserveSeatResponse);
        } catch (e) {
            logger.error(e, `[ReserveSeat] error `);
            next(e);
        }

    }


    static async joinSimilarTable(req, res, next): Promise<any> {
        try {
            const {
                params,
                query,
                body
            } = req;
            appVersionUtil(req);
            const tableIds: number[] = body?.ignoreTables || [];
            const userId: string = req.sessionManager.getLoggedInUserId();
            const roomId: number = TableController.getRoomIdFormParams(params);
            const joinSimilarTableDetails: JoinSimilarTableDetails = AriesUtil.getJoinSimilarTableDetailsFromRequest(req, `${roomId}`, tableIds, false);
            if (!joinSimilarTableDetails?.locationDetails) {
                throw PlanetServiceErrorUtil.getLocationDetailsNotFound();
            }
            if (!joinSimilarTableDetails?.locationDetails?.isAllowed) {
                throw PlanetServiceErrorUtil.getLocationRestrictedByGeoCoordinate();
            }
            logger.info(`[joinSimilarTable] roomId ${roomId}`);
            const roomInfo: Room = await AriesService.validateJoinSimilarTable(req.internalRestClient, userId, `${roomId}`, false);
            const response: JoinSimilarTable = await AriesService.joinSimilarTable(req.internalRestClient, roomId, userId, joinSimilarTableDetails, roomInfo);
            logger.info(`[joinSimilarTable] aries success response ${JSON.stringify(response)}`);
            const joinSimilarTable: IJoinSimilarTable = TableUtil.getJoinSimilarTableResponse(response, userId, joinSimilarTableDetails?.vendorId);
            logger.info(`[joinSimilarTable] final response ${JSON.stringify(joinSimilarTable)}`);
            ResponseUtil.sendSuccessResponse(res, joinSimilarTable);
        } catch (e) {
            logger.error(e, `[joinSimilarTable] error `);
            next(e);
        }

    }

    static async practiceJoinSimilarTable(req, res, next): Promise<any> {
        try {
            const {
                params,
                query,
                body
            } = req;
            appVersionUtil(req);
            const tableIds: number[] = body?.ignoreTables || [];
            const userId: string = req.sessionManager.getLoggedInUserId();
            const roomId: number = TableController.getRoomIdFormParams(params);
            const joinSimilarTableDetails: JoinSimilarTableDetails = AriesUtil.getJoinSimilarTableDetailsFromRequest(req, `${roomId}`, tableIds, true);
            logger.info(`[practiceJoinSimilarTable] roomId ${roomId}`);
            const roomInfo: Room = await AriesService.validateJoinSimilarTable(req.internalRestClient, userId, `${roomId}`, true);
            const response: JoinSimilarTable = await AriesService.joinSimilarTable(req.internalRestClient, roomId, userId, joinSimilarTableDetails, roomInfo);
            logger.info(`[practiceJoinSimilarTable] aries success response ${JSON.stringify(response)}`);
            const joinSimilarTable: IJoinSimilarTable = TableUtil.getJoinSimilarTableResponse(response, userId, joinSimilarTableDetails?.vendorId);
            logger.info(`[practiceJoinSimilarTable] final response ${JSON.stringify(joinSimilarTable)}`);
            ResponseUtil.sendSuccessResponse(res, joinSimilarTable);
        } catch (e) {
            logger.error(e, `[practiceJoinSimilarTable] error `);
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

    private static getTournamentIdFromParam(params: any): number {
        return RequestUtil.parseQueryParamAsNumber(
            params,
            REQUEST_PARAMS.TOURNAMENT_ID_PARAM,
        )
    }

    private static getPlayerIdFromParam(params: any): string {
        return RequestUtil.parseQueryParamAsString(
            params,
            REQUEST_PARAMS.PLAYER_ID_PARAM,
        )
    }

    private static getRoomIdFormParams(params): number {
        return RequestUtil.parseQueryParamAsNumber(
            params,
            REQUEST_PARAMS.ROOM_ID_PARAM,
        )
    }
}
