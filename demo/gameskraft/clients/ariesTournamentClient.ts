import AriesServiceError from '../errors/aries/aries-error';
import AriesServiceErrorUtil from '../errors/aries/aries-error-util';
import SupernovaServiceErrorUtil from '../errors/supernova/supernova-error-util';
import RequestUtil from '../helpers/request-util';
import QueryParam from '../models/query-param';
import { TournamentTableIdResponse } from '../models/tournament/response/tournament-tableid-response';
import {
  getAriesTournamentServiceBaseUrl
} from '../services/configService';
import LoggerUtil, { ILogger } from '../utils/logger';
import { AriesTournamentClientLatencyDecorator } from '../utils/monitoring/client-latency-decorator';
import BaseClient from './baseClient';
import {AriesClientLatencyDecorator} from "../utils/monitoring/client-latency-decorator";
import { UpdateUserBetSettingsRequest } from '../models/zodiac/gameplay';

;

const logger: ILogger = LoggerUtil.get("AriesTournamentClient");

export default class AriesTournamentClient {
    private static urls = {
        getTournamentObserverTableId: '/v1/tournament/observing/table',
        getPlayerTournamentTables: '/v1/tournament/player/activeTables',
        tournamentTableSitOut: '/v1/table/tournament/sitOut',
        tournamentLeaveTable: '/v1/table/tournament/leaveTable',
        tournamentTableJoinBack: '/v1/table/tournament/iAmBack',
        updateUserBetSettingsTournament: '/v1/player/##USER_ID##/updateBetSettings/tournament',
    }

    @AriesTournamentClientLatencyDecorator
    static async getTournamentObserverTableId(restClient: any, tournamentId: number, userId: number): Promise<TournamentTableIdResponse> {
        try {
            logger.info(`[AriesTournamentClient] [getTournamentObserverTableId] tournamentId :: ${tournamentId} userId :: ${userId}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({ param: 'tournamentId', value: tournamentId});
            queryParams.push({ param: 'userId', value: userId});
            const url = AriesTournamentClient.getCompleteUrl( AriesTournamentClient.urls.getTournamentObserverTableId, queryParams );
            logger.info(`[AriesTournamentClient] [getTournamentObserverTableId] url :: ${url}`);
            const headers: any = AriesTournamentClient.getAriesTournamentServiceHeader(restClient.getRequestId());
            const resp: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(resp, `[AriesTournamentClient] [getTournamentObserverTableId] response :: `);
            return resp.data;
        } catch (error) {
            logger.error(error,`[AriesTournamentClient] [getTournamentObserverTableId]:: `)
            throw AriesTournamentClient.getError(error);
        }
    }

  @AriesClientLatencyDecorator
  static async getPlayerTournamentTablesDetails(restClient: any, userId: number, tournamentIds: number[], timeout?: number): Promise<any> {
    try {
      logger.info(`[AriesClient] [getPlayerTournamentTablesDetails] userId :: ${userId} tournamentIds :: ${tournamentIds}`);
      const url = AriesTournamentClient.getCompleteUrl(AriesTournamentClient.urls.getPlayerTournamentTables)
      const headers: any = AriesTournamentClient.getAriesTournamentServiceHeader(restClient.getRequestId());
      const request = {userId, tournamentIds};
      logger.info(`[AriesClient] [getPlayerTournamentTablesDetails] url :: ${url} headers :: ${JSON.stringify(headers)}`);
      logger.info(`[AriesClient] [getPlayerTournamentTablesDetails] request :: ${JSON.stringify(request)}`);
      const resp = await BaseClient.sendGetRequestWithHeaders(restClient, url,  headers, timeout, request);
      logger.info(`[AriesClient] [getPlayerTournamentTablesDetails] Response :: ${JSON.stringify(resp)}`);
      return resp.data;
    } catch(error) {
      logger.error(error,`[AriesClient] [getPlayerTournamentTablesDetails] Error :: `);
      throw AriesTournamentClient.getError(error);
    }
  }

  @AriesTournamentClientLatencyDecorator
  static async playerTournamentTableSitOut(restClient: any, sitOutRequest: any): Promise<any> {
    try {
      logger.info(`[AriesTournamentClient] [playerTournamentTableSitOut] Request: ${JSON.stringify(sitOutRequest)}`);
      const url = AriesTournamentClient.getCompleteUrl(
        AriesTournamentClient.urls.tournamentTableSitOut
      );
      const headers: any = AriesTournamentClient.getAriesTournamentServiceHeader(restClient.getRequestId());
      logger.info(`[AriesTournamentClient] [playerTournamentTableSitOut] url :: ${url} headers :: ${JSON.stringify(headers)}`);
      const resp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, sitOutRequest, headers);
      logger.info(resp, `[AriesTournamentClient] [playerTournamentTableSitOut] response :: `);
      return resp.data;
    } catch (error) {
      logger.error(error,`[AriesTournamentClient] [playerTournamentTableSitOut]:: `)
      throw AriesTournamentClient.getError(error);
    }
  }


  @AriesTournamentClientLatencyDecorator
  static async tournamentTablejoinBack(restClient: any, joinBackRequest: any): Promise<any> {
    try {
      logger.info(`[AriesTournamentClient] [tournamentTablejoinBack] Request: ${JSON.stringify(joinBackRequest)}`);
      const url = AriesTournamentClient.getCompleteUrl(
        AriesTournamentClient.urls.tournamentTableJoinBack
      );
      const headers: any = AriesTournamentClient.getAriesTournamentServiceHeader(restClient.getRequestId());
      logger.info(`[AriesTournamentClient] [tournamentTablejoinBack] url :: ${url} headers :: ${JSON.stringify(headers)}`);
      const resp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, joinBackRequest, headers);
      logger.info(resp, `[AriesTournamentClient] [tournamentTablejoinBack] response :: `);
      return resp.data;
    } catch (error) {
      logger.error(error,`[AriesTournamentClient] [tournamentTablejoinBack]:: `)
      throw AriesTournamentClient.getError(error);
    }
  }

  @AriesTournamentClientLatencyDecorator
  static async tournamentLeaveTable(restClient: any, leaveTableRequest: any): Promise<any> {
    try {
      logger.info(`[AriesTournamentClient] [tournamentLeaveTable] Request: ${JSON.stringify(leaveTableRequest)}`);
      const url = AriesTournamentClient.getCompleteUrl(
        AriesTournamentClient.urls.tournamentLeaveTable
      );
      const headers: any = AriesTournamentClient.getAriesTournamentServiceHeader(restClient.getRequestId());
      logger.info(`[AriesTournamentClient] [tournamentLeaveTable] url :: ${url} headers :: ${JSON.stringify(headers)}`);
      const resp: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, leaveTableRequest, headers);
      logger.info(resp, `[AriesTournamentClient] [tournamentLeaveTable] response :: `);
      return resp.data;
    } catch (error) {
      logger.error(error,`[AriesTournamentClient] [tournamentLeaveTable]:: `)
      throw AriesTournamentClient.getError(error);
    }
  }

  @AriesClientLatencyDecorator
  static async updateUserBetSettingsTournament(restClient: any, userId: string, request: UpdateUserBetSettingsRequest): Promise<any> {
      try {
          logger.info(`[AriesTournamentClient] [updateUserBetSettingsTournament] Request: ${JSON.stringify(request)}`);
          const url = AriesTournamentClient.getCompleteUrl(
            AriesTournamentClient.urls.updateUserBetSettingsTournament.replace(/##USER_ID##/g, userId)
          );
          const headers: any = AriesTournamentClient.getAriesTournamentServiceHeader(restClient.getRequestId());
          logger.info(`[AriesTournamentClient] [updateUserBetSettingsTournament] url :: ${url} headers :: ${JSON.stringify(headers)}`);
          const resp: any = await BaseClient.sendPutRequestWithHeaders(restClient, url, request, headers);
          logger.info(resp, `[AriesTournamentClient] [updateUserBetSettingsTournament] response :: `);
          return resp.data;
      } catch (error) {
          logger.error(error,`[AriesTournamentClient] [updateUserBetSettingsTournament]:: `)
          throw AriesTournamentClient.getError(error);
      }
  }

  private static getAriesTournamentServiceHeader(requestId: string) {
    const headers: any = {"X-Request-Id": requestId};
    return headers;
  }

  static wrapError(error: any) {
    if (error && !(error instanceof AriesServiceError)) {
      return AriesServiceErrorUtil.wrapError(error);
    }
    return error;
  }

  static getErrorFromCode(errorCode: number) {
    return AriesTournamentClient.getError({errorCode});
  }

  private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
    return RequestUtil.getCompleteRequestURL(getAriesTournamentServiceBaseUrl(), relativeUrl, queryParams);
  }

  private static getError(error: any) {
    logger.error('[TournamentAriesClient] Error: %s', JSON.stringify(error || {}));
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
      case 20006:
        return AriesServiceErrorUtil.getInsufficientWalletBalanceError();
      case 40003:
        return AriesServiceErrorUtil.getUserAlreadyOnTableError();
      case 40004:
        return AriesServiceErrorUtil.getPlayerNotAvailableOnTableError();
      case 40005:
        return AriesServiceErrorUtil.getPlayerAlreadyLeftError();
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

      case 20101:
        return SupernovaServiceErrorUtil.getInvalidRegisterTournamentRequest();

      default:
        return AriesServiceErrorUtil.getError(error);
    }
  }
}
