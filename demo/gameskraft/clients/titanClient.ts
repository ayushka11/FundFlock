import AriesServiceError from '../errors/aries/aries-error';
import SupernovaServiceErrorUtil from '../errors/supernova/supernova-error-util';
import TitanServiceErrorUtil from '../errors/titan/titan-error-util';
import RequestUtil from '../helpers/request-util';
import { PlayerTournamentStatus } from '../models/enums/tournament/player-tournament-status';
import QueryParam from '../models/query-param';
import TournamentEntryRequest from '../models/tournament/request/tournament-entry-request';
import TournamentPlayerStatusRequest from '../models/tournament/request/tournament-player-status-request';
import ActiveTablesResponse from '../models/tournament/response/active-tables-response';
import TournamentLeaderboardResponse from '../models/tournament/response/tournament-leaderboard-response';
import TournamentPlayerStatusResponse from '../models/tournament/response/tournament-player-status-response';
import TournamentResponse from '../models/tournament/response/tournament-response';
import { TournamentUserDetailResponse } from '../models/tournament/response/tournament-user-detail-response';
import { getTitanServiceBaseUrl } from '../services/configService';
import LoggerUtil, { ILogger } from '../utils/logger';
import { TitanClientLatencyDecorator } from '../utils/monitoring/client-latency-decorator';
import BaseClient from './baseClient';

const logger: ILogger = LoggerUtil.get("TitanClient");

export default class TitanClient {
    private static urls = {
        getTournaments: '/v1/tournament/lobby/details',
        getTournamentPlayerStatus: '/v1/tournament/player/listingLobby/status',
        getActiveTables: '/v1/tournament/activeTables',
        getTournamentLeaderboard: '/v1/tournament/leaderboard',
        registerPlayerForTournament: '/v1/tournament/player/register',
        unregisterPlayerForTournament: '/v1/tournament/player/unregister',
        getActiveTournamentIds: '/v1/tournament/activeIds',
        getPlayerTournamentStatus: '/v1/tournament/player/lobby/status',
        getTournamentObserverDetailsByUsername: '/v1/tournament/player/details',
    }

    @TitanClientLatencyDecorator
    static async getTournaments(restClient: any): Promise<Array<TournamentResponse>> {
        try {
            logger.info(`[TitanClient] [getTournaments] Request`);
            const url = TitanClient.getCompleteUrl(
                TitanClient.urls.getTournaments
            );
            logger.info(`[TitanClient] [getTournaments] url :: ${url}`);
            const headers: any = TitanClient.getTitanServiceHeader(restClient.getRequestId());
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[TitanClient] [getTournaments] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error, `[TitanClient] [getTournaments]:: `)
            throw TitanClient.getError(error);
        }
    }

    @TitanClientLatencyDecorator
    static async getTournamentPlayerStatus(restClient: any, request: TournamentPlayerStatusRequest, timeout?: number): Promise<TournamentPlayerStatusResponse> {
        try {
            logger.info(`[TitanClient] [getTournamentPlayerStatus] request :: ${JSON.stringify(request)}`);
            const url = TitanClient.getCompleteUrl(
                TitanClient.urls.getTournamentPlayerStatus
            );
            logger.info(`[TitanClient] [getTournamentPlayerStatus] url :: ${url}`);
            const headers: any = TitanClient.getTitanServiceHeader(restClient.getRequestId());
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, timeout, request);
            logger.info(resp, `[TitanClient] [getTournamentPlayerStatus] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error, `[TitanClient] [getTournamentPlayerStatus]:: `)
            throw TitanClient.getError(error);
        }
    }

    @TitanClientLatencyDecorator
    static async getPlayerTournamentStatus(restClient: any, userId: number, tournamentId: number): Promise<PlayerTournamentStatus> {
        try {
            logger.info(`[TitanClient] [getPlayerTournamentStatus] tournamentId :: ${JSON.stringify(tournamentId)} userId :: ${JSON.stringify(userId)}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: 'tournamentId', value: tournamentId});
            queryParams.push({param: 'userId', value: userId});
            const url = TitanClient.getCompleteUrl(TitanClient.urls.getPlayerTournamentStatus, queryParams);
            logger.info(`[TitanClient] [getPlayerTournamentStatus] url :: ${url}`);
            const headers: any = TitanClient.getTitanServiceHeader(restClient.getRequestId());
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[TitanClient] [getPlayerTournamentStatus] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error, `[TitanClient] [getPlayerTournamentStatus]:: `)
            throw TitanClient.getError(error);
        }
    }

    @TitanClientLatencyDecorator
    static async getActiveTables(restClient: any, tournamentId: number): Promise<ActiveTablesResponse[]> {
        try {
            logger.info(`[TitanClient] [getActiveTables] tournamentId :: ${JSON.stringify(tournamentId)}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: 'tournamentId', value: tournamentId});
            const url = TitanClient.getCompleteUrl(TitanClient.urls.getActiveTables, queryParams);
            logger.info(`[TitanClient] [getActiveTables] url :: ${url}`);
            const headers: any = TitanClient.getTitanServiceHeader(restClient.getRequestId());
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[TitanClient] [getActiveTables] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error, `[TitanClient] [getActiveTables]:: `)
            throw TitanClient.getError(error);
        }
    }

    @TitanClientLatencyDecorator
    static async getTournamentLeaderboard(restClient: any, tournamentId: number, userId: number): Promise<TournamentLeaderboardResponse> {
        try {
            logger.info(`[TitanClient] [getTournamentLeaderboard] tournamentId :: ${JSON.stringify(tournamentId)} userId :: ${JSON.stringify(userId)}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: 'tournamentId', value: tournamentId});
            queryParams.push({param: 'userId', value: userId});
            const url = TitanClient.getCompleteUrl(TitanClient.urls.getTournamentLeaderboard, queryParams);
            logger.info(`[TitanClient] [getTournamentLeaderboard] url :: ${url}`);
            const headers: any = TitanClient.getTitanServiceHeader(restClient.getRequestId());
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[TitanClient] [getTournamentLeaderboard] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error, `[TitanClient] [getTournamentLeaderboard]:: `)
            throw TitanClient.getError(error);
        }
    }

    @TitanClientLatencyDecorator
    static async getActiveTournamentIds(restClient: any): Promise<number[]> {
        try {
            const url = TitanClient.getCompleteUrl(TitanClient.urls.getActiveTournamentIds);
            logger.info(`[TitanClient] [getActiveTables] url :: ${url}`);
            const headers: any = TitanClient.getTitanServiceHeader(restClient.getRequestId());
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[TitanClient] [getActiveTables] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error, `[TitanClient] [getActiveTables]:: `)
            throw TitanClient.getError(error);
        }
    }

    @TitanClientLatencyDecorator
    static async registerPlayerForTournament(restClient: any, request: TournamentEntryRequest): Promise<any> {
        try {
            logger.info(`[TitanClient] [registerPlayerForTournament] request :: ${JSON.stringify(request)}`);
            const url = TitanClient.getCompleteUrl(TitanClient.urls.registerPlayerForTournament);
            const headers: any = TitanClient.getTitanServiceHeader(restClient.getRequestId());
            logger.info(`[TitanClient] [registerPlayerForTournament] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(`[TitanClient] [registerPlayerForTournament] Response :: ${JSON.stringify(resp)}`);
            return resp.data;
        } catch (error) {
            logger.error(error, `[TitanClient] [registerPlayerForTournament] Error :: `);
            throw TitanClient.getError(error);
        }
    }


    @TitanClientLatencyDecorator
    static async getTournamentObserverDetailsByUsername(restClient: any, tournamentId: number, tournamentUserName: string): Promise<TournamentUserDetailResponse> {
        try {
            logger.info(`[TitanClient] [getTournamentObserverDetailsByUsername] tournamentId :: ${tournamentId} tournamentUserName :: ${tournamentUserName}`);
            const queryParams: QueryParam[] = []; 
            queryParams.push({ param: 'tournamentId', value: tournamentId});  
            queryParams.push({ param: 'tournamentUserName', value: tournamentUserName});  
            const url = TitanClient.getCompleteUrl( TitanClient.urls.getTournamentObserverDetailsByUsername, queryParams );
            logger.info(`[TitanClient] [getTournamentObserverDetailsByUsername] url :: ${url}`);
            const headers: any = TitanClient.getTitanServiceHeader(restClient.getRequestId());
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[TitanClient] [getTournamentObserverDetailsByUsername] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[TitanClient] [getObserverUserIdByUsername]:: `)
            throw TitanClient.getError(error);
        }
    }

    @TitanClientLatencyDecorator
    static async unregisterPlayerForTournament(restClient: any, tournamentId: number, userId: number, vendorId: number, request: any): Promise<any> {
        try {
            logger.info(`[TitanClient] [unregisterPlayerForTournament] tournamentId :: ${tournamentId} userId :: ${userId} vendorId :: ${vendorId}, request: ${JSON.stringify(request)}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: 'tournamentId', value: tournamentId});
            queryParams.push({param: 'userId', value: userId});
            queryParams.push({param: 'vendorId', value: vendorId});
            const url = TitanClient.getCompleteUrl(TitanClient.urls.unregisterPlayerForTournament, queryParams);
            const headers: any = TitanClient.getTitanServiceHeader(restClient.getRequestId());
            logger.info(`[TitanClient] [unregisterPlayerForTournament] url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const resp = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(`[TitanClient] [unregisterPlayerForTournament] Response :: ${JSON.stringify(resp)}`);
            return resp.data;
        } catch (error) {
            logger.error(error, `[TitanClient] [unregisterPlayerForTournament] Error :: `);
            throw TitanClient.getError(error);
        }
    }

    static wrapError(error: any) {
        if (error && !(error instanceof AriesServiceError)) {
            return TitanServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    private static getTitanServiceHeader(requestId: string) {
        const headers: any = {"X-Request-Id": requestId};
        return headers;
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(getTitanServiceBaseUrl(), relativeUrl, queryParams);
    }

    private static getError(error: any) {
        logger.error('[TitanClient] Error: %s', JSON.stringify(error || {}));
        switch (error.errorCode) {
            case 10001:
                return TitanServiceErrorUtil.getRuntimeError();
            case 10015:
                return TitanServiceErrorUtil.getInternalServerError();
            case 10020:
                return TitanServiceErrorUtil.getBodyValidationError('Request Payload is Incorrect');
            //new tournament errors
            case 14026:
                return TitanServiceErrorUtil.getMaxPlayersReached();
            case 14027:
                return TitanServiceErrorUtil.getTournamentNotInRegistrationPhase();
            case 14028:
                return TitanServiceErrorUtil.getPlayerAlreadyRegistered();
            case 14029:
                return TitanServiceErrorUtil.getInvalidVendorId();
            case 14033:
                return TitanServiceErrorUtil.getInvalidRegisterBuyinMethod();
            case 14034:
                return TitanServiceErrorUtil.getInvalidReentryBuyinMethod();
            case 14035:
                return TitanServiceErrorUtil.getMaxReentryLimitReached();
            case 14036:
                return TitanServiceErrorUtil.getPlayerNotRegistered();
            case 14037:
                return TitanServiceErrorUtil.getReenterNotAllowed();
            case 14040:
                return TitanServiceErrorUtil.getPlayerNotEligibleToRegisterorReenter();
            case 20101:
                return SupernovaServiceErrorUtil.getInvalidRegisterTournamentRequest();
            case 50001:
                return TitanServiceErrorUtil.getPlayerNotRegistered();
            case 50002:
                return TitanServiceErrorUtil.getPlayerCannotUnRegister();
            case 50003:
                return TitanServiceErrorUtil.getTournamentCompleted();
            case 50004:
                return TitanServiceErrorUtil.getTournamentCancelled();
            case 50005:
                return TitanServiceErrorUtil.getPlayerCannotRegister();
            case 50006:
                return TitanServiceErrorUtil.getPlayerAlreadyRegistered();
            case 50007:
                return TitanServiceErrorUtil.getPlayerAlreadyPlaying();
            case 50008:
                return TitanServiceErrorUtil.getPlayerCannotReentry();
            case 50009:
                return TitanServiceErrorUtil.getTournamentNotInRegistrationPhase();
            case 50010:
                return TitanServiceErrorUtil.getTournamentCompletedOrCanceled();
            case 50011:
                return TitanServiceErrorUtil.getTournamentIsOnBreak();
            case 50012:
                return TitanServiceErrorUtil.getTournamentIsOnWaitForBreak();
            case 50013:
                return TitanServiceErrorUtil.getTournamentLevelAlreadyStarted();
            case 50014:
                return TitanServiceErrorUtil.getTournamentLevelAlreadyPaused();
            case 50017:
                return TitanServiceErrorUtil.getPlayerCannotUnRegisterDuringSeatAllocation();
            default:
                return TitanServiceErrorUtil.getError(error);
        }
    }
}
