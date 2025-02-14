import { ZodiacClientLatencyDecorator } from "../../utils/monitoring/client-latency-decorator";
import LoggerUtil, { ILogger } from '../../utils/logger';
import ZodiacServiceErrorUtil from "../../errors/zodiac/zodiac-error-util";
import RequestUtil from "../../helpers/request-util";
import QueryParam from "../../models/query-param";
import { getZodiacServiceBaseUrl } from '../../services/configService';
import BaseClient from "../baseClient";

const logger: ILogger = LoggerUtil.get("ZodiacClientV2");

export default class ZodiacClient {

    private static urls = {
        getUserCashTableHandsListBySessionId: '/v2/user/cash/##TABLE_SESSION_ID##/hand/history/active',
        getUserHandDetailsByHandId: '/v2/user/##USER_ID##/cash/##TABLE_ID##/hand/##HAND_ID##/details',
        getUserHandSummaryByHandId: '/v2/user/##USER_ID##/cash/##TABLE_ID##/hand/##HAND_ID##/summary',
        getUserPracticeTableHandsListBySessionId: '/v2/user/practice/##TABLE_SESSION_ID##/hand/history/active',
        getUserPracticeHandDetailsByHandId: '/v2/user/##USER_ID##/practice/##TABLE_ID##/hand/##HAND_ID##/details',
        getUserPracticeHandSummaryByHandId: '/v2/user/##USER_ID##/practice/##TABLE_ID##/hand/##HAND_ID##/summary',
        getUserTournamentHandsListByTournamentId: '/v2/user/##USER_ID##/tournament/##TOURNAMENT_ID##/hand/history/active',
        getUserTournamentHandDetailsByHandId: '/v2/user/##USER_ID##/tournament/##TOURNAMENT_ID##/hand/##HAND_ID##/details',
        getUserTournamentHandSummaryByHandId: '/v2/user/##USER_ID##/tournament/##TOURNAMENT_ID##/hand/##HAND_ID##/summary',
    };

    @ZodiacClientLatencyDecorator
    static async getUserHandsListBySessionId(restClient: any, sessionId: string) {
        try {
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserCashTableHandsListBySessionId.replace(/##TABLE_SESSION_ID##/g, sessionId));
            logger.info(`[ZodiacClient] [getUserHandsListBySessionId] sessionId :: ${sessionId} url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getUserHandsListBySessionId] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserHandDetailsByHandId(restClient: any, userId: number, handId: string, tableId: number) {
        try {
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserHandDetailsByHandId.replace(/##USER_ID##/g, String(userId)).replace(/##HAND_ID##/g, handId).replace(/##TABLE_ID##/g, String(tableId)));
            logger.info(`[ZodiacClient] [getUserHandDetailsByHandId] userId :: ${userId} handId :: ${handId} tableId :: ${tableId} url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getUserHandDetailsByHandId] userId :: ${userId} handId :: ${handId} tableId :: ${tableId} response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserHandSummaryByHandId(restClient: any, userId: number, handId: string, tableId: number) {
        try {
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserHandSummaryByHandId.replace(/##USER_ID##/g, String(userId)).replace(/##HAND_ID##/g, handId).replace(/##TABLE_ID##/g, String(tableId)));
            logger.info(`[ZodiacClient] [getUserHandSummaryByHandId] userId :: ${userId} handId :: ${handId} tableId :: ${tableId} url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getUserHandSummaryByHandId] userId :: ${userId} handId :: ${handId} tableId :: ${tableId} response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserPracticeHandsListBySessionId(restClient: any, sessionId: string) {
        try {
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserPracticeTableHandsListBySessionId.replace(/##TABLE_SESSION_ID##/g, sessionId));
            logger.info(`[ZodiacClient] [getUserPracticeHandsListBySessionId] sessionId :: ${sessionId} url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getUserPracticeHandsListBySessionId] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserPracticeHandDetailsByHandId(restClient: any, userId: number, handId: string, tableId: number) {
        try {
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserPracticeHandDetailsByHandId.replace(/##USER_ID##/g, String(userId)).replace(/##HAND_ID##/g, handId).replace(/##TABLE_ID##/g, String(tableId)));
            logger.info(`[ZodiacClient] [getUserPracticeHandDetailsByHandId] userId :: ${userId} handId :: ${handId} tableId :: ${tableId} url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getUserPracticeHandDetailsByHandId] userId :: ${userId} handId :: ${handId} tableId :: ${tableId} response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserPracticeHandSummaryByHandId(restClient: any, userId: number, handId: string, tableId: number) {
        try {
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserPracticeHandSummaryByHandId.replace(/##USER_ID##/g, String(userId)).replace(/##HAND_ID##/g, handId).replace(/##TABLE_ID##/g, String(tableId)));
            logger.info(`[ZodiacClient] [getUserPracticeHandSummaryByHandId] userId :: ${userId} handId :: ${handId} tableId :: ${tableId} url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getUserPracticeHandSummaryByHandId] userId :: ${userId} handId :: ${handId} tableId :: ${tableId} response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserTournamentHandsListByTournamentId(restClient: any, userId: number, tournamentId: number) {
        try {
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserTournamentHandsListByTournamentId.replace(/##USER_ID##/g, String(userId)).replace(/##TOURNAMENT_ID##/g, String(tournamentId)));
            logger.info(`[ZodiacClient] [getUserTournamentHandsListByTournamentId] userId :: ${userId} tournamentId :: ${tournamentId} url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getUserTournamentHandsListByTournamentId] userId :: ${userId} tournamentId :: ${tournamentId} response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserTournamentHandDetailsByHandId(restClient: any, userId: number, handId: string, tournamentId: number) {
        try {
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserTournamentHandDetailsByHandId.replace(/##USER_ID##/g, String(userId)).replace(/##HAND_ID##/g, handId).replace(/##TOURNAMENT_ID##/g, String(tournamentId)));
            logger.info(`[ZodiacClient] [getUserTournamentHandDetailsByHandId] userId :: ${userId} handId :: ${handId} tournamentId :: ${tournamentId} url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getUserTournamentHandDetailsByHandId] userId :: ${userId} handId :: ${handId} tournamentId :: ${tournamentId} response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserTournamentHandSummaryByHandId(restClient: any, userId: number, handId: string, tournamentId: number) {
        try {
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserTournamentHandSummaryByHandId.replace(/##USER_ID##/g, String(userId)).replace(/##HAND_ID##/g, handId).replace(/##TOURNAMENT_ID##/g, String(tournamentId)));
            logger.info(`[ZodiacClient] [getUserTournamentHandSummaryByHandId] userId :: ${userId} handId :: ${handId} tournamentId :: ${tournamentId} url :: ${url} headers :: ${JSON.stringify(headers)}`);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getUserTournamentHandSummaryByHandId] userId :: ${userId} handId :: ${handId} tournamentId :: ${tournamentId} response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    private static getZodiacServiceHeaders(requestId: string) {
        const headers: any = {"x-request-id": requestId};
        return headers;
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(getZodiacServiceBaseUrl(), relativeUrl, queryParams)
    }

    private static getError(error: any) {
        logger.error('[ZodiacClient] Error: %s', JSON.stringify(error || {}));
        switch (error.errorCode) {
            case 10001:
                return ZodiacServiceErrorUtil.getRuntimeError();
            case 10005:
                return ZodiacServiceErrorUtil.getAuthorizationError();
            case 10015:
                return ZodiacServiceErrorUtil.getInternalServerError();
            case 10020:
                return ZodiacServiceErrorUtil.getBodyValidationError('Request Payload is Incorrect');
            case 10025:
                return ZodiacServiceErrorUtil.getInternalServerError();
            case 11_0001:
                return ZodiacServiceErrorUtil.getUserAlreadyExists();
            case 11002:
                return ZodiacServiceErrorUtil.getUserDoesNotExists();
            case 11003:
                return ZodiacServiceErrorUtil.getInvalidGameplayNoteColorToUpdate();
            case 11004:
                return ZodiacServiceErrorUtil.getInvalidGameplayNoteColorId();
            case 11010:
                return ZodiacServiceErrorUtil.getNoActiveTableSessionError();
            case 11011:
                return ZodiacServiceErrorUtil.getNoHandInCurrentTableSessionError();
            case 11012:
                return ZodiacServiceErrorUtil.getNoTableSessionsOnCurrentDateError();
            case 11013:
                return ZodiacServiceErrorUtil.getNoTableHandsOnCurrentDateError();
            case 11014:
                return ZodiacServiceErrorUtil.getTableHandDetailsNotFoundError();
            case 11001:
                return ZodiacServiceErrorUtil.getUserAlreadyExists();
            case 11102:
                return ZodiacServiceErrorUtil.getUserDoesNotExists();
            case 11103:
                return ZodiacServiceErrorUtil.getInvalidGameplayNoteColorToUpdate();
            case 11104:
                return ZodiacServiceErrorUtil.getInvalidGameplayNoteColorId();
            case 12010:
                return ZodiacServiceErrorUtil.getNoActiveTournamentError();
            case 12011:
                return ZodiacServiceErrorUtil.getNoHandsInCurrentTournamentError();
            case 12012:
                return ZodiacServiceErrorUtil.getNoTournamentHandsOnCurrentDateError();
            case 12013:
                return ZodiacServiceErrorUtil.getTournamentHandDetailsNotFoundError();
            default:
                return ZodiacServiceErrorUtil.getError(error);
        }
    }

};