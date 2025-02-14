import gsBaseClient from "./gsBaseClient";

import LoggerUtil, {ILogger} from '../utils/logger';
import {getGsBearerToken, getGSHallwayBaseUrlForVendor} from "../services/configService";
import RequestUtil from "../helpers/request-util";
import GsServiceErrorUtil from "../errors/gs/gs-error-util";
import QueryParam from "../models/query-param";
import {GsRequestPayload} from "../models/request/gs/request";
import GsServiceError from "../errors/gs/gs-error";
import {GsCommand} from "../models/enums/gs-command";
import {GsClientLatencyDecorator} from "../utils/monitoring/client-latency-decorator";

const logger: ILogger = LoggerUtil.get("GsClient");

export default class GsClient {

    private static relativeUrls = {
        gsHallway: '/gs/hallway/openapi/v1',
        getRoomList: '/gs/hallway/public/v1',
        getRoomTables: '/gs/hallway/public/v1',
        getTableStatus: '/gs/hallway/public/v1',
        reserveRoomRequest: '/gs/hallway/public/v1',
        sitAtTableRequest: '/gs/hallway/public/v1',
        topupRequest: '/gs/ct/##TABLE_ID##/public/v1',
        topupValueRequest: '/gs/ct/##TABLE_ID##/public/v1',
        rebuyRequest: '/gs/ct/##TABLE_ID##/public/v1',
        leaveTableRequest: '/gs/ct/##TABLE_ID##/public/v1',
        iAmBackRequest: '/gs/ct/##TABLE_ID##/public/v1',
        unreserveRoom: '/gs/hallway/public/v1',
        getTournamentBlindStructure: '/gs/mttv2/lobby/##TOURNAMENT_ID##/public/v1',
        getTournamentStats: '/gs/mttv2/lobby/##TOURNAMENT_ID##/public/v1',
        registerTournamentPlayer: '/gs/mttv2/tables/##TOURNAMENT_ID##/public/v1',
        unregisterTournamentPlayer: '/gs/mttv2/tables/##TOURNAMENT_ID##/public/v1',
        playerTournamentStatus: '/gs/mttv2/tables/##TOURNAMENT_ID##/public/v1',
        playerMTTList: '/gs/hallway/public/v1',
        getMttList: '/gs/hallway/public/v1',
        getTournamentEntryDetails: '/gs/cc/control/v1/',
        getRecommendedRooms: '/gs/hallway/public/v1'
    };

    //  Online Users Count
    @GsClientLatencyDecorator
    static async getOnlineUsersCount(restClient: any, vendorId: string): Promise<number> {
        try {
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.gsHallway, vendorId);
            const onlineUsersCountPayload = GsClient.createGsRequestPayload(GsCommand.onlineUsersCount, {});
            logger.info(`[GsClient] [getOnlineUsersCount] url :: ${url} requestBody :: ${JSON.stringify(onlineUsersCountPayload)}`);
            const getOnlineUsersCountResp: any = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, onlineUsersCountPayload, GsClient.getGsHeaders());
            logger.info(`[GsClient] [getOnlineUsersCount] response :: ${JSON.stringify(getOnlineUsersCountResp || {})}`);
            return getOnlineUsersCountResp.message;
        } catch (error) {
            logger.error(error, `[GsClient] [getOnlineUsersCount] Failed`);
            throw GsClient.getError(error);
        }
    }

    //  Featured MTT
    @GsClientLatencyDecorator
    static async getFeaturedMtt(restClient: any, vendorId: string): Promise<any> {
        try {
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.gsHallway, vendorId);
            const featuredMttPayload = GsClient.createGsRequestPayload(GsCommand.featuredMtt, {});
            logger.info(`[GsClient] [getFeaturedMtt] url :: ${url} requestBody :: ${JSON.stringify(featuredMttPayload)}`);
            const featuredMttResp: any = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, featuredMttPayload, GsClient.getGsHeaders());
            logger.info(`[GsClient] [getFeaturedMtt] response :: ${JSON.stringify(featuredMttResp || {})}`);
            return featuredMttResp.message;
        } catch (error) {
            logger.error(error, `[GsClient] [getFeaturedMtt] Failed`);
            throw GsClient.getError(error);
        }
    }

    @GsClientLatencyDecorator
    static async getRooms(restClient: any, request: GsRequestPayload, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.getRoomList, vendorId, queryParams);
            logger.info(`[getRoomList] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[getRoomList] response :: ${JSON.stringify(response || {})}`);
            return response.message;
        } catch (error) {
            throw GsClient.getError(error);
        }
    }

    @GsClientLatencyDecorator
    static async getRoomTables(restClient: any, request: GsRequestPayload, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.getRoomTables, vendorId, queryParams);
            logger.info(`[getRoomTables] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[getRoomTables] response :: ${JSON.stringify(response || {})}`);
            return response.message;
        } catch (error) {
            throw GsClient.getError(error);
        }
    }

    @GsClientLatencyDecorator
    static async getTablePlayerDetails(restClient: any, request: GsRequestPayload, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.getTableStatus, vendorId, queryParams);
            logger.info(`[getTablePlayerDetails] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[getTableStatus] response :: ${JSON.stringify(response || {})}`);
            return response.message;
        } catch (error) {
            throw GsClient.getError(error);
        }
    }

    @GsClientLatencyDecorator
    static async getTopupValue(restClient: any, request: GsRequestPayload, tableId: string, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.topupValueRequest.replace('##TABLE_ID##', tableId), vendorId, queryParams);
            logger.info(`[topupValuesRequest] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[topupValuesRequest] response :: ${JSON.stringify(response || {})}`);
            return response.message.data;
        } catch (error) {
            throw GsClient.getError(error);
        }
    }

    @GsClientLatencyDecorator
    static async reserveRoom(restClient: any, request: GsRequestPayload, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.reserveRoomRequest, vendorId, queryParams);
            logger.info(`[reserveRoomRequest] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[reserveRoomRequest] response :: ${JSON.stringify(response || {})}`);
            return response.message;
        } catch (error) {
            throw GsClient.getError(error);
        }

    }

    @GsClientLatencyDecorator
    static async sitAtTable(restClient: any, request: GsRequestPayload, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.sitAtTableRequest, vendorId, queryParams);
            logger.info(`[sitAtTable] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[sitAtTable] response :: ${JSON.stringify(response || {})}`);
            return response.message;
        } catch (error) {
            throw GsClient.getError(error);
        }
    }

    @GsClientLatencyDecorator
    static async playerTopup(restClient: any, request: GsRequestPayload, tableId: string, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.topupRequest.replace('##TABLE_ID##', tableId), vendorId, queryParams);
            logger.info(`[topupRequest] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[topupRequest] response :: ${JSON.stringify(response || {})}`);
            return response.message;
        } catch (error) {
            throw GsClient.getError(error);
        }
    }

    @GsClientLatencyDecorator
    static async playerRebuy(restClient: any, request: GsRequestPayload, tableId: string, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.rebuyRequest.replace('##TABLE_ID##', tableId), vendorId, queryParams);
            logger.info(`[rebuyRequest] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[rebuyRequest] response :: ${JSON.stringify(response || {})}`);
            return response?.message;
        } catch (error) {
            throw GsClient.getError(error);
        }
    }

    @GsClientLatencyDecorator
    static async playerJoinBack(restClient: any, request: GsRequestPayload, tableId: string, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.iAmBackRequest.replace('##TABLE_ID##', tableId), vendorId, queryParams);
            logger.info(`[iAmBackRequest] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[iAmBackRequest] response :: ${JSON.stringify(response || {})}`);
            return response?.message?.data;
        } catch (error) {
            throw GsClient.getError(error);
        }
    }

    @GsClientLatencyDecorator
    static async playerLeaveTable(restClient: any, request: GsRequestPayload, tableId: string, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.leaveTableRequest.replace('##TABLE_ID##', tableId), vendorId, queryParams);
            logger.info(`[leaveTableRequest] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[leaveTableRequest] response :: ${JSON.stringify(response || {})}`);
            return response?.response?.data;
        } catch (error) {
            throw GsClient.getError(error);
        }
    }

    @GsClientLatencyDecorator
    static async playerUnreserveRoom(restClient: any, request: GsRequestPayload, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.unreserveRoom, vendorId, queryParams);
            logger.info(`[playerUnreserveRoom] response :: url :: ${url}`);
            return await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
        } catch (error) {
            throw GsClient.getError(error);
        }
    }

    @GsClientLatencyDecorator
    static async getTournamentBlindStructure(restClient: any, request: GsRequestPayload, tournamentId: string, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.getTournamentBlindStructure.replace('##TOURNAMENT_ID##', `${tournamentId}`), vendorId, queryParams);
            logger.info(`[getTournamentBlindStructure] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[getTournamentBlindStructure] response :: ${JSON.stringify(response || {})}`);
            return response?.message;
        } catch (error) {
            throw GsClient.getError(error);
        }

    }

    @GsClientLatencyDecorator
    static async getTournamentDetails(restClient: any, request: GsRequestPayload, tournamentId: string, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.getTournamentStats.replace('##TOURNAMENT_ID##', `${tournamentId}`), vendorId, queryParams);
            logger.info(`[getTournamentDetails] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[getTournamentDetails] response :: ${JSON.stringify(response || {})}`);
            return response?.message;
        } catch (error) {
            throw GsClient.getError(error);
        }
    }

    @GsClientLatencyDecorator
    static async registerPlayerForTournament(restClient: any, request: GsRequestPayload, tournamentId: string, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.registerTournamentPlayer.replace('##TOURNAMENT_ID##', `${tournamentId}`), vendorId, queryParams);
            logger.info(`[registerPlayerForTournament] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[registerPlayerForTournament] response :: ${JSON.stringify(response || {})}`);
            return response?.message;
        } catch (error) {
            throw GsClient.getError(error);
        }

    }

    @GsClientLatencyDecorator
    static async unregisterPlayerForTournament(restClient: any, request: GsRequestPayload, tournamentId: string, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.registerTournamentPlayer.replace('##TOURNAMENT_ID##', `${tournamentId}`), vendorId, queryParams);
            logger.info(`[unregisterPlayerForTournament] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[unregisterPlayerForTournament] response :: ${JSON.stringify(response || {})}`);
            return response?.message;
        } catch (error) {
            throw GsClient.getError(error);
        }

    }

    @GsClientLatencyDecorator
    static async getPlayerTournamentStatus(restClient: any, request: GsRequestPayload, tournamentId: string, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.playerTournamentStatus.replace('##TOURNAMENT_ID##', `${tournamentId}`), vendorId, queryParams);
            logger.info(`[getPlayerTournamentStatus] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[getPlayerTournamentStatus] response :: ${JSON.stringify(response || {})}`);
            return response?.message;
        } catch (error) {
            throw GsClient.getError(error);
        }

    }

    @GsClientLatencyDecorator
    static async getPlayerMTTList(restClient: any, request: GsRequestPayload, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.playerMTTList, vendorId, queryParams);
            logger.info(`[getPlayerMTTList] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[getPlayerMTTList] response :: ${JSON.stringify(response || {})}`);
            return response?.message;
        } catch (error) {
            throw GsClient.getError(error);
        }
    }

    @GsClientLatencyDecorator
    static async getMTTList(restClient: any, request: GsRequestPayload, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.getMttList, vendorId, queryParams);
            logger.info(`[playerMTTList] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[playerMTTList] response :: ${JSON.stringify(response || {})}`);
            return response?.message;
        } catch (error) {
            throw GsClient.getError(error);
        }

    }

    @GsClientLatencyDecorator
    static async getTournamentEntryDetails(restClient: any, request: GsRequestPayload, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.getTournamentEntryDetails, vendorId, queryParams);
            logger.info(`[getTournamentEntryDetails] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[getTournamentEntryDetails] response :: ${JSON.stringify(response || {})}`);
            return response?.message;
        } catch (error) {
            throw GsClient.getError(error);
        }
    }

    @GsClientLatencyDecorator
    static async getRecommendedRooms(restClient: any, request: GsRequestPayload, gsToken: string, vendorId: string) {
        try {
            const queryParams: QueryParam[] = [];
            if (gsToken) {
                queryParams.push({
                    param: 'angutha',
                    value: gsToken
                })
            }
            const url = GsClient.getCompleteUrl(GsClient.relativeUrls.getRecommendedRooms, vendorId, queryParams);
            logger.info(`[getRecommendedRooms] response :: url :: ${url}`);
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, request, GsClient.getGsHeaders());
            logger.info(`[getRecommendedRooms] response :: ${JSON.stringify(response || {})}`);
            return response?.message;
        } catch (error) {
            throw GsClient.getError(error);
        }
    }

    static wrapError(error: any) {
        if (error && !(error instanceof GsServiceError)) {
            return GsServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    private static getGsHeaders() {
        const bearerToken = getGsBearerToken();
        if (bearerToken) {
            const headers: any = {"Content-Type": "application/json", 'Authorization': `Bearer ${bearerToken}`};
            return headers;
        }
        else {
            return {"Content-Type": "application/json"};
        }
    }

    private static createGsRequestPayload(api: string, pl: any) {
        let payload = {
            'command': api,
            'data': pl
        };
        return payload;
    }

    private static getCompleteUrl(relativeUrl: string, vendorId: string, queryParams?: any) {
        const vendorUrls = getGSHallwayBaseUrlForVendor();
        const url = vendorUrls[vendorId];
        return RequestUtil.getCompleteRequestURL(url, relativeUrl, queryParams);
    }

    private static getError(error: any) {
        logger.error(JSON.stringify(error || {}), 'Error: ');
        const errorMessage: string = error?.message || String(error.errorCode);

        switch (errorMessage) {
            // Cash Table
            case "Error":
                return GsServiceErrorUtil.getGsCommonError()
            case "Error : CT001":
                return GsServiceErrorUtil.getCashTableRuntimeError()
            case "Error : CT002":
                return GsServiceErrorUtil.getCashTableCommandNotAvailableError()
            case "Error : CT003":
                return GsServiceErrorUtil.getCashTablePlayerPresentFromOtherDomainError()
            case "Error : CT004":
                return GsServiceErrorUtil.getCashTableSeatHasBeenReservedError()
            case "Error : CT005":
                return GsServiceErrorUtil.getCashTableSeatNotFoundError()
            case "Error : CT006":
                return GsServiceErrorUtil.getCashTableUserAlreadySeatedError()
            case "Error : CT007":
                return GsServiceErrorUtil.getCashTableBannedPlayerError()
            case "Error : CT008":
                return GsServiceErrorUtil.getCashTableWalletError()
            case "Error : CT009":
                return GsServiceErrorUtil.getCashTableIpConflictError()
            case "Error : CT010":
                return GsServiceErrorUtil.getCashTableTimerExpiredError()
            case "Error : CT011":
                return GsServiceErrorUtil.getCashTablePlayerNotSeatedError()
            case "Error : CT012":
                return GsServiceErrorUtil.getCashTableStackMoreThanMaxBuyInError()
            case "Error : CT013":
                return GsServiceErrorUtil.getCashTableInsufficientFundsError()
            case "Error : CT014":
                return GsServiceErrorUtil.getCashTablePreviousTopupIsPendingError()
            case "Error : CT015":
                return GsServiceErrorUtil.getCashTablePlayerNotSitOutError()
            case "Error : CT016":
                return GsServiceErrorUtil.getCashTableRebuyWithoutRequestError()
            case "Error : CT017":
                return GsServiceErrorUtil.getCashTablePlayerAlreadyInWaitQueueError()
            case "Error : CT018":
                return GsServiceErrorUtil.getCashTableJSONMarshalError()
            case "Error : CT019":
                return GsServiceErrorUtil.getCashTableJSONUnMarshalError()
            case "Error : CT020":
                return GsServiceErrorUtil.getCashTableShutdownRequestPendingError()
            case "Error : CT021":
                return GsServiceErrorUtil.getCashTableRebootRequestPendingError()
            case "Error : CT022":
                return GsServiceErrorUtil.getCashTablePlayerLeaveTableInProgressError()
            case "Error : CT023":
                return GsServiceErrorUtil.getCashTableRITPopUpIsOverError()
            case "Error : CT024":
                return GsServiceErrorUtil.getCashTableNotRITParticipantError()
            case "Error : CT025":
                return GsServiceErrorUtil.getCashTableNoReservationError()
            case "Error : CT026":
                return GsServiceErrorUtil.getCashTablePlayerNotInWaitQueueError()
            case "Error : CT027":
                return GsServiceErrorUtil.getCashTablePlayerSeatingInProgressError()
            case "Error : CT028":
                return GsServiceErrorUtil.getCashTablePlayerRebuyInProgressError()
            //TODO check the difference of this two 
            case "Error : CT029":
                return GsServiceErrorUtil.getCashTablePlayerRebuyInProgressError()
            case "Error : CT030":
                return GsServiceErrorUtil.getCashTablePlayerReserveInProgressError()
            case "Error : CT031":
                return GsServiceErrorUtil.getCashTableSystemUpgradeError()
            //TODO check  tabble not empty
            case "Error : CT032":
                return GsServiceErrorUtil.getCashTableRuntimeError()
            case "Error : CT033":
                return GsServiceErrorUtil.getCashTablePlayerRebuyNotApplicableError()
            //TODO check this error in gs
            case "Error : CT034":
                return GsServiceErrorUtil.getCashTableTopupPlayerSitOutError()
            //TODO check the error from  35 to 46
            case "Error : CT035":
                return GsServiceErrorUtil.getCashTableRuntimeError()
            case "Error : CT036":
                return GsServiceErrorUtil.getCashTableRuntimeError()
            case "Error : CT037":
                return GsServiceErrorUtil.getCashTableRuntimeError()
            case "Error : CT038":
                return GsServiceErrorUtil.getCashTableRuntimeError()
            case "Error : CT039":
                return GsServiceErrorUtil.getCashTableRuntimeError()
            case "Error : CT040":
                return GsServiceErrorUtil.getCashTableRuntimeError()
            case "Error : CT041":
                return GsServiceErrorUtil.getCashTableRuntimeError()
            case "Error : CT042":
                return GsServiceErrorUtil.getCashTableRuntimeError()
            case "Error : CT043":
                return GsServiceErrorUtil.getCashTableRuntimeError()
            case "Error : CT044":
                return GsServiceErrorUtil.getCashTableRuntimeError()
            case "Error : CT045":
                return GsServiceErrorUtil.getCashTableRuntimeError()
            case "Error : CT046":
                return GsServiceErrorUtil.getCashTableRuntimeError()
            case "Error : CT047":
                return GsServiceErrorUtil.getCashTableInvalidPlatformDataError()
            case "Error : CT051":
                return GsServiceErrorUtil.getCashTableMaxTableLimitReachedError()

            // Tournaments
            case "Error : TT001":
                return GsServiceErrorUtil.getTournamentRunTimeError()
            case "Error : TT002":
                return GsServiceErrorUtil.getTournamentCommandNotAvailableError()
            case "Error : TT003":
                return GsServiceErrorUtil.getTournamentUserAlreadyRegisteredError()
            case "Error : TT004":
                return GsServiceErrorUtil.getTournamentRegistrationMaxLimitReachedError()
            case "Error : TT005":
                return GsServiceErrorUtil.getTournamentPlayerRegistrationMaxLimitReachedError()
            case "Error : TT006":
                return GsServiceErrorUtil.getTournamentNotInRegistrationStateError()
            case "Error : TT007":
                return GsServiceErrorUtil.getTournamentNotRegisteredError()
            case "Error : TT008":
                return GsServiceErrorUtil.getTournamentCannotCancelInCurrentStateError()
            case "Error : TT009":
                return GsServiceErrorUtil.getTournamentAlreadyAbortedError()
            case "Error : TT010":
                return GsServiceErrorUtil.getTournamentCannotAbortInCurrentStateError()
            case "Error : TT011":
                return GsServiceErrorUtil.getTournamentUserNotLoggedInError()
            case "Error : TT012":
                return GsServiceErrorUtil.getTournamentUserNotValidError()
            case "Error : TT013":
                return GsServiceErrorUtil.getTournamentUserInMttFromOtherDomainError()
            case "Error : TT014":
                return GsServiceErrorUtil.getTournamentReBuyAlreadyInitiatedError()
            case "Error : TT015":
                return GsServiceErrorUtil.getTournamentStackMoreThanMinAllowedError()
            case "Error : TT016":
                return GsServiceErrorUtil.getTournamentReBuyLimitExceededError()
            case "Error : TT017":
                return GsServiceErrorUtil.getTournamentReBuyTimeIsOverError()
            case "Error : TT018":
                return GsServiceErrorUtil.getTournamentReBuyIsNotAllowedError()
            case "Error : TT019":
                return GsServiceErrorUtil.getTournamentSeatNotFoundError()
            case "Error : TT020":
                return GsServiceErrorUtil.getTournamentPlayerNotSeatedError()
            case "Error : TT021":
                return GsServiceErrorUtil.getTournamentStackIsNonZeroError()
            case "Error : TT022":
                return GsServiceErrorUtil.getTournamentHandIsRunningError()
            case "Error : TT023":
                return GsServiceErrorUtil.getTournamentAddonAlreadyDoneError()
            case "Error : TT024":
                return GsServiceErrorUtil.getTournamentAddonNotAllowedError()
            case "Error : TT025":
                return GsServiceErrorUtil.getTournamentAlreadySittingOutError()
            case "Error : TT026":
                return GsServiceErrorUtil.getTournamentEmptySeatError()
            case "Error : TT027":
                return GsServiceErrorUtil.getTournamentWalletError()
            case "Error : TT028":
                return GsServiceErrorUtil.getTournamentInsufficientFundError()
            case "Error : TT029":
                return GsServiceErrorUtil.getTournamentTicketNotValidError()
            case "Error : TT030":
                return GsServiceErrorUtil.getTournamentUserIsBannedError()
            case "Error : TT031":
                return GsServiceErrorUtil.getTournamentMSPNotFoundError()
            case "Error : TT032":
                return GsServiceErrorUtil.getTournamentMFPMismatchError()
            case "Error : TT033":
                return GsServiceErrorUtil.getTournamentMFPPlayerRegistrationNotPossibleError()
            case "Error : TT034":
                return GsServiceErrorUtil.getTournamentMFPPlayerCannotUnRegisterError()
            case "Error : TT035":
                return GsServiceErrorUtil.getTournamentUpdateNotPossibleError()
            case "Error : TT036":
                return GsServiceErrorUtil.getTournamentTableInvalidParamError()
            case "Error : TT037":
                return GsServiceErrorUtil.getTournamentUserIsNotPresentInTournamentListingError()
            case "Error : TT038":
                return GsServiceErrorUtil.getTournamentInvalidConnectionModeError()
            case "Error : TT039":
                return GsServiceErrorUtil.getTournamentSatelliteWinnerCannotUnRegisterError()
            case "Error : TT040":
                return GsServiceErrorUtil.getTournamentMaxTableLimitReachedError()
            // Hallway 
            //TODO check all the hallway error regarfing pct
            case "Error : H001":
                return GsServiceErrorUtil.getHallwayRuntimeError()
            case "Error : H002":
                return GsServiceErrorUtil.getHallwayCommunicationError()
            case "Error : H003":
                return GsServiceErrorUtil.getHallwayRoomNotAvailableError()
            case "Error : H004":
                return GsServiceErrorUtil.getHallwayWalletError()
            case "Error : H005":
                return GsServiceErrorUtil.getHallwayNoTableAvailableError()
            case "Error : H006":
                return GsServiceErrorUtil.getHallwayBannedPlayerError()
            case "Error : H007":
                return GsServiceErrorUtil.getHallwayAlreadyJoinedPCTError()
            case "Error : H008":
                return GsServiceErrorUtil.getHallwayInvalidPINError()
            case "Error : H009":
                return GsServiceErrorUtil.getHallwayInternalServerError()
            case "Error : H010":
                return GsServiceErrorUtil.getHallwayNonExistingPCTError()
            case "Error : H011":
                return GsServiceErrorUtil.getHallwayRunExistingPCTError()
            case "Error : H012":
                return GsServiceErrorUtil.getHallwayTableNotUnlockedError()
            case "Error : H013":
                return GsServiceErrorUtil.getHallwayMaxTableReachedError()

            //Auth Middleware
            case "Error : SS001":
                return GsServiceErrorUtil.getMissingFingerprintError()
            case "Error : SS002":
                return GsServiceErrorUtil.getBadFingerprintError()
            case "Error : SS003":
                return GsServiceErrorUtil.getBadRouteError()
            case "Error : SS004":
                return GsServiceErrorUtil.getExpiredFingerprintError()
            case "Error : SS005":
                return GsServiceErrorUtil.getInvalidFingerprintError()

            //4xx error
            case "404":
                return GsServiceErrorUtil.getURLNotFound()

            default:
                return GsServiceErrorUtil.getError(error);
        }

    }
}