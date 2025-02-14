import QueryParam from "../models/query-param";
import { QuickJoinGroupResponse } from '../models/aries/quick-join-group';
import { JoinSimilarTableRequest } from '../models/request/aries/join-similar-table-request';
import { OpenTableRequest } from '../models/request/aries/open-table-request';
import {
    QuickJoinGroupRequest
} from '../models/request/aries/quick-join-request';
import { RebuyRequest } from '../models/request/aries/rebuy-request';
import { ReserveSeatRequest } from '../models/request/aries/reserve-seat-request';
import { TopupDetailsRequest } from '../models/request/aries/topup-details-request';
import { TopupRequest } from '../models/request/aries/topup-request';
import { getAriesServiceBaseUrl } from "../services/configService";
import { AriesClientLatencyDecorator } from "../utils/monitoring/client-latency-decorator";
import RequestUtil from "../helpers/request-util";
import BaseClient from "./baseClient";

import LoggerUtil, { ILogger } from '../utils/logger';
import AriesServiceErrorUtil from "../errors/aries/aries-error-util";
import SupernovaServiceErrorUtil from "../errors/supernova/supernova-error-util";
import AriesServiceError from "../errors/aries/aries-error";
import { UpdateUserAutoTopUpSetting, UpdateUserBetSettingsRequest } from "../models/zodiac/gameplay";
import { UpdateEnablePostBBRequest } from "../models/request/aries/update-enable-post-bb";

const logger: ILogger = LoggerUtil.get("AriesClient");

export default class AriesClient {
    private static urls = {
        getRooms: '/v1/room',
        getGroups: '/v1/group',
        roomTables: '/v1/room/##ROOM_ID##/tables',
        groupTables: '/v1/group/##GROUP_ID##/tables',
        groupsTables: '/v1/group/tables',
        reserveAnySeat: '/v1/table/reserveAnySeat',
        reserveSeat: '/v1/table/##TABLE_ID##/reserveSeat',
        joinSimilarTable: '/v1/room/joinSimilar',
        sitAtTable: '/v1/table/sitAtTable',
        leaveTable: '/v1/table/leaveTable',
        unReserveRoom: '/v1/table/unReserveSeat',
        sitOut: '/v1/table/sitOut',
        joinBack: '/v1/table/iAmBack',
        tablePlayerDetails: '/v1/table/##TABLE_ID##/playersData',
        reserveRoom: '/v1/room/reserve',
        quickJoinGroup: '/v1/group/quick-join',
        practiceTableResult: '/v1/table/practice/##TABLE_ID##/result',
        cashTableResult: '/v1/table/cash/##TABLE_ID##/result',
        //  w.r.t get player details like gameSessionId, userName, vendorId, currentStackAmount
        playerDetails: '/v1/table/##TABLE_ID##/player/##USER_ID##/details',
        practiceTablePlayerStats: '/v1/table/practice/##TABLE_ID##/player/##USER_ID##/stats',
        cashTablePlayerStats: '/v1/table/cash/##TABLE_ID##/player/##USER_ID##/stats',
        updatePlayerBetSettings: '/v1/player/##USER_ID##/updateBetSettings',
        updatePlayerEnablePostBB: '/v1/player/##USER_ID##/updateEnablePostBB',
        topupDetails: '/v1/table/cash/topup/details',
        topupRequest: '/v1/table/cash/topup/request',
        rebuyRequest: '/v1/table/cash/rebuy/request',
        getActiveRoomByStake: '/v1/room/stake/##STAKE##',
        getPlayerActiveTableByRoom: '/v1/player/##USER_ID##/rooms/active/tables',
        updatePlayerAutoTopUpSetting: '/v1/player/##USER_ID##/updateAutoTopSettings',
        openTable: '/v1/table/##TABLE_ID##/open',
        getTableDetails: '/v1/table/##TABLE_ID##/details',
        getGroupIdsFromRoomIds: '/v1/group/groupIds',
    }

    @AriesClientLatencyDecorator
    static async getRooms(restClient: any): Promise<any> {
        try {
            logger.info(`[AriesClient] [getRooms] Request`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.getRooms
            );
            logger.info(`[AriesClient] [getRooms] url :: ${url}`);
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[AriesClient] [getRooms] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [getRooms]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getGroups(restClient: any): Promise<any> {
        try {
            logger.info(`[AriesClient] [getGroups] Request`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.getGroups
            );
            logger.info(`[AriesClient] [getGroups] url :: ${url}`);
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[AriesClient] [getGroups] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(`[AriesClient] [getGroups]:: ${JSON.stringify(error)}`)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async reserveAnySeat(restClient: any, reserveAnySeatRequest: any): Promise<any> {
        try {
            logger.info(`[AriesClient] [reserveAnySeat] Request: ${JSON.stringify(reserveAnySeatRequest)}`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.reserveAnySeat
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [reserveAnySeat] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, reserveAnySeatRequest, headers);
            logger.info(resp, `[AriesClient] [reserveAnySeat] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [reserveAnySeat]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async reserveSeat(restClient: any, tableId: string, reserveSeatRequest: ReserveSeatRequest): Promise<any> {
        try {
            logger.info(`[AriesClient] [reserveSeat] Request: ${JSON.stringify(reserveSeatRequest)}`);
            const url = AriesClient.getCompleteUrl(
              AriesClient.urls.reserveSeat.replace(/##TABLE_ID##/g, tableId)
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [reserveSeat] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, reserveSeatRequest, headers);
            logger.info(resp, `[AriesClient] [reserveSeat] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [reserveSeat]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async joinSimilarTable(restClient: any, joinSimilarTableRequest: JoinSimilarTableRequest): Promise<any> {
        try {
            logger.info(`[AriesClient] [joinSimilarTable] Request: ${JSON.stringify(joinSimilarTableRequest)}`);
            const url = AriesClient.getCompleteUrl(AriesClient.urls.joinSimilarTable);
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [joinSimilarTable] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, joinSimilarTableRequest, headers);
            logger.info(resp, `[AriesClient] [joinSimilarTable] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [joinSimilarTable]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async sitAtTable(restClient: any, sitAtTableRequest: any): Promise<any> {
        try {
            logger.info(`[AriesClient] [sitAtTable] Request: ${JSON.stringify(sitAtTableRequest)}`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.sitAtTable
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [sitAtTable] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, sitAtTableRequest, headers);
            logger.info(resp, `[AriesClient] [sitAtTable] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [sitAtTable]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async leaveTable(restClient: any, leaveTableRequest: any): Promise<any> {
        try {
            logger.info(`[AriesClient] [leaveTable] Request: ${JSON.stringify(leaveTableRequest)}`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.leaveTable
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [leaveTable] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, leaveTableRequest, headers);
            logger.info(resp, `[AriesClient] [leaveTable] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [leaveTable]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async unReserveRoom(restClient: any, unReserveRoomRequest: any): Promise<any> {
        try {
            logger.info(`[AriesClient] [unReserveRoom] Request: ${JSON.stringify(unReserveRoomRequest)}`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.unReserveRoom
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [unReserveRoom] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, unReserveRoomRequest, headers);
            logger.info(resp, `[AriesClient] [unReserveRoom] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [unReserveRoom]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async sitOut(restClient: any, sitOutRequest: any): Promise<any> {
        try {
            logger.info(`[AriesClient] [sitOut] Request: ${JSON.stringify(sitOutRequest)}`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.sitOut
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [sitOut] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, sitOutRequest, headers);
            logger.info(resp, `[AriesClient] [sitOut] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [sitOut]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async joinBack(restClient: any, joinBackRequest: any): Promise<any> {
        try {
            logger.info(`[AriesClient] [joinBack] Request: ${JSON.stringify(joinBackRequest)}`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.joinBack
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [joinBack] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, joinBackRequest, headers);
            logger.info(resp, `[AriesClient] [joinBack] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [joinBack]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getRoomTables(restClient: any, roomId: string): Promise<any> {
        try {
            logger.info(`[AriesClient] [getRoomTables] RoomId :: ${roomId} `);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.roomTables.replace(/##ROOM_ID##/g, roomId)
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [getRoomTables] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[AriesClient] [getRoomTables] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [getRoomTables]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getGroupTables(restClient: any, groupId: number): Promise<any> {
        try {
            logger.info(`[AriesClient] [getGroupTables] GroupId :: ${groupId} `);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.groupTables.replace(/##GROUP_ID##/g, `${groupId}`)
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [getGroupTables] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[AriesClient] [getGroupTables] response :: `);
            return resp.data;
        }
        catch (error) {
            logger.error(`[AriesClient] [getGroupTables]:: ${JSON.stringify(error)}`)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async quickJoinGroup(restClient: any, quickJoinGroupRequest: QuickJoinGroupRequest): Promise<QuickJoinGroupResponse> {
        try {
            logger.info({quickJoinGroupRequest}, `[AriesClient] [quickJoinGroup] Request`);
            const url = AriesClient.getCompleteUrl(
              AriesClient.urls.quickJoinGroup
            );
            logger.info(`[AriesClient] [quickJoinGroup] url :: ${url}`);
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            const resp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, quickJoinGroupRequest, headers);
            logger.info(resp, `[AriesClient] [quickJoinGroup] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [quickJoinGroup]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getGroupsTables(restClient: any): Promise<any> {
        try {
            logger.info(`[AriesClient] [getGroupsTables]`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.groupsTables
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [getGroupsTables] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[AriesClient] [getGroupsTables] response :: `);
            return resp.data;
        }
        catch (error) {
            logger.error(`[AriesClient] [getGroupsTables]:: ${JSON.stringify(error)}`)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getTablePlayerDetails(restClient: any, tableId: string): Promise<any> {
        try {
            logger.info(`[AriesClient] [getTablePlayerDetails] TableId :: ${tableId}`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.tablePlayerDetails.replace(/##TABLE_ID##/g, tableId)
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [getTablePlayerDetails] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[AriesClient] [getTablePlayerDetails] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [getTablePlayerDetails]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async reserveRoom(restClient: any, reserveRoomRequest: any): Promise<any> {
        try {
            logger.info({reserveRoomRequest}, `[AriesClient] [reserveRoom] Request`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.reserveRoom
            );
            logger.info(`[AriesClient] [reserveRoom] url :: ${url}`);
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            const resp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, reserveRoomRequest, headers);
            logger.info(resp, `[AriesClient] [reserveRoom] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [reserveRoom]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getPracticeTableResult(restClient: any, tableId: string): Promise<any> {
        try {
            logger.info(`[AriesClient] [getPracticeTableResult] TableId :: ${tableId}`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.practiceTableResult.replace(/##TABLE_ID##/g, tableId)
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [getPracticeTableResult] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[AriesClient] [getPracticeTableResult] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [getPracticeTableResult]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getCashTableResult(restClient: any, tableId: string): Promise<any> {
        try {
            logger.info(`[AriesClient] [getCashTableResult] TableId :: ${tableId}`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.cashTableResult.replace(/##TABLE_ID##/g, tableId)
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [getCashTableResult] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[AriesClient] [getCashTableResult] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [getCashTableResult]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async updateUserBetSettings(restClient: any, userId: string, request: UpdateUserBetSettingsRequest): Promise<any> {
        try {
            logger.info(`[AriesClient] [updateUserBetSettings] Request: ${JSON.stringify(request)}`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.updatePlayerBetSettings.replace(/##USER_ID##/g, userId)
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [updateUserBetSettings] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendPutRequestWithHeaders(restClient, url, request, headers);
            logger.info(resp, `[AriesClient] [updateUserBetSettings] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [updateUserBetSettings]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async updateUserAutoTopUpSettings(restClient: any, userId: string, request: UpdateUserAutoTopUpSetting): Promise<any> {
        try {
            logger.info(`[AriesClient] [updateUserAutoTopUpSettings] Request: ${JSON.stringify(request)}`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.updatePlayerAutoTopUpSetting.replace(/##USER_ID##/g, userId)
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [updateUserAutoTopUpSettings] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendPutRequestWithHeaders(restClient, url, request, headers);
            logger.info(resp, `[AriesClient] [updateUserAutoTopUpSettings] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [updateUserAutoTopUpSettings]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async updateUserEnablePostBB(restClient: any, userId: string, request: UpdateEnablePostBBRequest): Promise<any> {
        try {
            logger.info(`[AriesClient] [updateUserEnablePostBB] Request: ${JSON.stringify(request)}`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.updatePlayerEnablePostBB.replace(/##USER_ID##/g, userId)
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [updateUserEnablePostBB] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp: any = await BaseClient.sendPutRequestWithHeaders(restClient, url, request, headers);
            logger.info(resp, `[AriesClient] [updateUserEnablePostBB] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [updateUserEnablePostBB]:: `)
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getPlayerDetails(restClient: any, userId: string, tableId: number): Promise<any> {
        try {
            logger.info(`[AriesClient] [getPlayerDetails] userId :: ${userId} tableId :: ${tableId}`);
            const url = AriesClient.getCompleteUrl(AriesClient.urls.playerDetails.replace(/##USER_ID##/g, String(userId)).replace(/##TABLE_ID##/g, String(tableId)));
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [getPlayerDetails] userId :: ${userId} tableId :: ${tableId} url :: ${JSON.stringify(url)} headers :: ${JSON.stringify(headers)}`);
            const resp = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[AriesClient] [getPlayerDetails] Response :: userId :: ${userId} tableId :: ${tableId} resp :: ${JSON.stringify(resp)}`);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [getPlayerDetails] userId :: ${userId} tableId :: ${tableId} Error :: `);
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getPracticeTablePlayerStats(restClient: any, tableId: string, userId: string): Promise<any> {
        try {
            logger.info(`[AriesClient] [getPracticeTablePlayerStats] userId :: ${userId} tableId :: ${tableId}`);
            const url = AriesClient.getCompleteUrl(AriesClient.urls.practiceTablePlayerStats.replace(/##USER_ID##/g, String(userId)).replace(/##TABLE_ID##/g, String(tableId)));
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [getPracticeTablePlayerStats] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[AriesClient] [getPracticeTablePlayerStats] Response :: ${JSON.stringify(resp)}`);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [getPracticeTablePlayerStats] Error :: `);
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getCashTablePlayerStats(restClient: any, tableId: string, userId: string): Promise<any> {
        try {
            logger.info(`[AriesClient] [getCashTablePlayerStats] userId :: ${userId} tableId :: ${tableId}`);
            const url = AriesClient.getCompleteUrl(AriesClient.urls.cashTablePlayerStats.replace(/##USER_ID##/g, String(userId)).replace(/##TABLE_ID##/g, String(tableId)));
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [getCashTablePlayerStats] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[AriesClient] [getCashTablePlayerStats] Response :: ${JSON.stringify(resp)}`);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [getCashTablePlayerStats] Error :: `);
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getTopupDetails(restClient: any, request: TopupDetailsRequest, timeout?: number): Promise<any> {
        try {
            logger.info(`[AriesClient] [getTopupDetails] user :: ${JSON.stringify(request)}`);
            const url = AriesClient.getCompleteUrl(AriesClient.urls.topupDetails);
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [getTopupDetails] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, timeout, request);
            logger.info(`[AriesClient] [getTopupDetails] Response :: ${JSON.stringify(resp)}`);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [getTopupDetails] Error :: `);
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async topupRequest(restClient: any, request: TopupRequest): Promise<any> {
        try {
            logger.info(`[AriesClient] [topupRequest] user :: ${JSON.stringify(request)}`);
            const url = AriesClient.getCompleteUrl(AriesClient.urls.topupRequest);
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [topupRequest] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(`[AriesClient] [topupRequest] Response :: ${JSON.stringify(resp)}`);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [topupRequest] Error :: `);
            throw AriesClient.getError(error);
        }
    }


    @AriesClientLatencyDecorator
    static async rebuyRequest(restClient: any, request: RebuyRequest): Promise<any> {
        try {
            logger.info(`[AriesClient] [rebuyRequest] user :: ${JSON.stringify(request)}`);
            const url = AriesClient.getCompleteUrl(AriesClient.urls.rebuyRequest);
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [rebuyRequest] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(`[AriesClient] [rebuyRequest] Response :: ${JSON.stringify(resp)}`);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [rebuyRequest] Error :: `);
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getActiveRoomByStake(restClient: any, stake: string): Promise<any> {
        try {
            logger.info(`[AriesClient] [getActiveRoomByStake] stake :: ${JSON.stringify(stake)}`);
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.getActiveRoomByStake.replace(/##STAKE##/g, stake)
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [getActiveRoomByStake] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[AriesClient] [getActiveRoomByStake] Response :: ${JSON.stringify(resp)}`);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [getActiveRoomByStake] Error :: `);
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getPlayerActiveTableByRoom(restClient: any, userId: string, roomIds: string): Promise<any> {
        try {
            logger.info(`[AriesClient] [getPlayerActiveTableByRoom] user :: ${JSON.stringify(userId)}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "roomIds", value: roomIds});
            const url = AriesClient.getCompleteUrl(
                AriesClient.urls.getPlayerActiveTableByRoom.replace(/##USER_ID##/g, userId),
                queryParams
            );
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [getPlayerActiveTableByRoom] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[AriesClient] [getPlayerActiveTableByRoom] Response :: ${JSON.stringify(resp)}`);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [getPlayerActiveTableByRoom] Error :: `);
        }
    }

    static async openTable(restClient: any, tableId: string, request: OpenTableRequest): Promise<any> {
        try {
            logger.info(`[AriesClient] [openTable] tableId :: ${tableId} request :: ${JSON.stringify(request)}`);
            const url = AriesClient.getCompleteUrl(AriesClient.urls.openTable.replace(/##TABLE_ID##/g, tableId));
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [openTable] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(`[AriesClient] [openTable] Response :: ${JSON.stringify(resp)}`);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesClient] [openTable] Error :: `);
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getTableDetails(restClient: any, tableId: string): Promise<any> {
        try {
            logger.info(`[AriesClient] [getTableDetails] tableId :: ${tableId}`);
            const url = AriesClient.getCompleteUrl(AriesClient.urls.getTableDetails.replace(/##TABLE_ID##/g, tableId));
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [getTableDetails] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp = await BaseClient.sendGetRequestWithHeaders(restClient, url,  headers);
            logger.info(`[AriesClient] [getTableDetails] Response :: ${JSON.stringify(resp)}`);
            return resp.data;
        } catch(error) {
            logger.error(error,`[AriesClient] [getTableDetails] Error :: `);
            throw AriesClient.getError(error);
        }
    }

    @AriesClientLatencyDecorator
    static async getGroupIdsFromRoomIds(restClient: any, roomIds: string): Promise<any>{
        try {
            logger.info(`[AriesClient] [getGroupIdsFromRoomIds] roomIds :: ${JSON.stringify(roomIds)}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "roomIds", value: roomIds});
            const url = AriesClient.getCompleteUrl(AriesClient.urls.getGroupIdsFromRoomIds, queryParams);
            const headers: any = AriesClient.getAriesServiceHeaders(restClient.getRequestId());
            logger.info(`[AriesClient] [getGroupIdsFromRoomIds] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp = await BaseClient.sendGetRequestWithHeaders(restClient, url,  headers);
            logger.info(`[AriesClient] [getGroupIdsFromRoomIds] Response :: ${JSON.stringify(resp)}`);
            return resp.data;
        } catch(error) {
            logger.error(error,`[AriesClient] [getTableDetails] Error :: `);
            throw AriesClient.getError(error);
        }
    }

    static wrapError(error: any) {
        if (error && !(error instanceof AriesServiceError)) {
            return AriesServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    static getErrorFromCode(errorCode: number) {
        return AriesClient.getError({errorCode});
    }

    private static getAriesServiceHeaders(requestId: string) {
        const headers: any = {"X-Request-Id": requestId};
        return headers;
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(getAriesServiceBaseUrl(), relativeUrl, queryParams);
    }

    private static getError(error: any) {
        logger.error('[AriesClient] Error: %s', JSON.stringify(error || {}));
        switch (error.errorCode) {
            case 10001:
                return AriesServiceErrorUtil.getRuntimeError();
            case 10005:
                return AriesServiceErrorUtil.getAuthorizationError();
            case 10015:
                return AriesServiceErrorUtil.getInternalServerError();
            case 10020:
                return AriesServiceErrorUtil.getBodyValidationError('Request Payload is Incorrect');
            case 10025:
                return AriesServiceErrorUtil.getInternalServerError();
            case 12000:
                return AriesServiceErrorUtil.getUnableToFindTableError();
            case 12001:
                return AriesServiceErrorUtil.getUserNotOnTableError();
            case 12002:
                return AriesServiceErrorUtil.getUserNotEligibleToSitError();
            case 13001:
                return AriesServiceErrorUtil.getTopupRequestAlreadyExistsError();
            case 13002:
                return AriesServiceErrorUtil.getInvalidTopupRequestSitoutError();
            case 13003:
                return AriesServiceErrorUtil.getInvalidTopupRequestEnableSitoutError();
            case 20006:
                return AriesServiceErrorUtil.getInsufficientWalletBalanceError();
            case 20007:
                return AriesServiceErrorUtil.getInvalidReserveCashGameTableRequestError();
            case 20008:
                return AriesServiceErrorUtil.getInvalidJoinCashGameTableBuyinAmountError();
            case 20009:
                return AriesServiceErrorUtil.getInvalidJoinCashGameTableRequestError();
            case 20010:
                return AriesServiceErrorUtil.getInvalidLeaveCashGameTableRequestError();
            case 20011:
                return AriesServiceErrorUtil.getInvalidSettleCashGameHandRequestError();
            case 20012:
                return AriesServiceErrorUtil.getInvalidSettleCashGameHandUsersError();
            case 20013:
                return AriesServiceErrorUtil.getInvalidTopupCashGameTableTopupAmountError();
            case 20014:
                return AriesServiceErrorUtil.getInvalidTopupCashGameTableMaxBuyInError();
            case 20015:
                return AriesServiceErrorUtil.getInvalidTopupCashGameTableInsufficientBalanceError();
            case 20016:
                return AriesServiceErrorUtil.getInvalidTopupCashGameTableCurrentStackError();
            case 20017:
                return AriesServiceErrorUtil.getInvalidCompleteCashGameTableTopupAmountError();
            case 20018:
                return AriesServiceErrorUtil.getInvalidRebuyCashGameTableRebuyAmountError();
            case 20019:
                return AriesServiceErrorUtil.getInvalidRebuyCashGameTableRequestError();
            case 20020:
                return AriesServiceErrorUtil.getInvalidReservePracticeGameTableRequestError();
            case 20021:
                return AriesServiceErrorUtil.getInvalidJoinPracticeGameTableBuyinAmountError();
            case 20022:
                return AriesServiceErrorUtil.getInvalidJoinPracticeGameTableRequestError();
            case 20023:
                return AriesServiceErrorUtil.getInvalidLeavePracticeGameTableRequestError();
            case 20024:
                return AriesServiceErrorUtil.getInvalidSettlePracticeGameHandRequestError();
            case 20025:
                return AriesServiceErrorUtil.getInvalidSettlePracticeGameHandUsersError();
            case 20026:
                return AriesServiceErrorUtil.getInvalidTopupPracticeGameTableTopupAmountError();
            case 20027:
                return AriesServiceErrorUtil.getInvalidTopupPracticeGameTableMaxBuyInError();
            case 20028:
                return AriesServiceErrorUtil.getInvalidTopupPracticeGameTableInsufficientBalanceError();
            case 20029:
                return AriesServiceErrorUtil.getInvalidTopupPracticeGameTableCurrentStackError();
            case 20030:
                return AriesServiceErrorUtil.getInvalidCompletePracticeGameTableTopupAmountError();
            case 20031:
                return AriesServiceErrorUtil.getInvalidRebuyPracticeGameTableRebuyAmountError();
            case 20032:
                return AriesServiceErrorUtil.getInvalidRebuyPracticeGameTableRequestError();
            case 40003:
                return AriesServiceErrorUtil.getUserAlreadyOnTableError();
            case 40004:
                return AriesServiceErrorUtil.getPlayerNotAvailableOnTableError();
            case 40005:
                return AriesServiceErrorUtil.getPlayerAlreadyLeftError();
            case 40011:
                return AriesServiceErrorUtil.getUserNotEligibleToSitError();
            case 40012:
                return AriesServiceErrorUtil.getUserNotEligibleToSitError();
            case 40020:
                return AriesServiceErrorUtil.getSeatNotOccupiedError();
            case 40021:
                return AriesServiceErrorUtil.getSeatAlreadyOccupiedError();
            case 40022:
                return AriesServiceErrorUtil.getSeatNotReservedError();
            case 40023:
                return AriesServiceErrorUtil.getPlayerSeatEmptyError();
            case 40024:
                return AriesServiceErrorUtil.getInvalidSeatIdError();
            case 40025:
                return AriesServiceErrorUtil.getInvalidPlayerOnSeatError();
            case 40026:
                return AriesServiceErrorUtil.getNoEmptySeatFoundError();
            case 40027:
                return AriesServiceErrorUtil.getSeatNotEmptyError();
            case 40055:
                return AriesServiceErrorUtil.getReserveTableLimitReached();

            case 20101:
                return SupernovaServiceErrorUtil.getInvalidRegisterTournamentRequest();

            default:
                return AriesServiceErrorUtil.getError(error);
        }
    }
};
