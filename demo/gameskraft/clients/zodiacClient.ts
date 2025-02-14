import ZodiacServiceErrorUtil from "../errors/zodiac/zodiac-error-util";
import ZodiacServiceError from "../errors/zodiac/zodiac-error";
import RequestUtil from "../helpers/request-util";
import { Group } from '../models/group';
import QueryParam from "../models/query-param";
import { Room } from '../models/room';
import { GetRecommendedGroupsRequest } from '../models/zodiac/get-recommended-groups-request';
import { GetRecommendedRoomsRequest } from '../models/zodiac/get-recommended-rooms-request';
import { getZodiacServiceBaseUrl } from '../services/configService';
import { ZodiacClientLatencyDecorator } from "../utils/monitoring/client-latency-decorator";
import BaseClient from "./baseClient";
import LoggerUtil, { ILogger } from '../utils/logger';
import Pagination from "../models/pagination";
import {
    CreateUserNotePayload,
    GetUserNotesPayload,
    UpdateUserNoteColorPayload,
    UserNoteColorsResponse,
    UserNoteResponse,
    UserNotesResponse,
} from "../models/zodiac/user-note";
import { UserDetailsResponse } from "../models/zodiac/user-detail";

import {
    UpdateUserAutoTopUpSettingsPayload,
    UpdateUserBetSettingsPayload,
    UpdateUserGameSettingsPayload,
    UpdateUserSoundSettingsPayload,
    UserAutoTopUpResponse,
    UserBetSettingsResponse,
    UserGameplaySettingsResponse,
    UserGameSettingsResponse,
    UserSoundSettingsResponse,
} from "../models/zodiac/gameplay";
import { UserFairplayDetailsResponse } from "../models/zodiac/fairplay-details";
import { CreateUserRequest } from "../models/zodiac/create-user-request";
import { UpdateUserRequest } from "../models/zodiac/update-user-request";
import { UserCashGames } from "../models/zodiac/user-cash-game";
import { User, UserAcknowledgement } from "../models/zodiac/user";
import { ZODIAC_REQUEST_PARAM } from "../../gameskraft/constants/zodiac-constants";
import { ZodiacUserLeaderboardTotalWinning } from "../models/leaderboard/total-leaderboard-earning-response";
import { BulkUserGameplaySettingsRequest } from "../models/zodiac/bulk-user-gameplay-settings-request";
import { UserPslStats } from "../models/zodiac/user-psl-stats";

const logger: ILogger = LoggerUtil.get("ZodiacClient");

export default class ZodiacClient {

    private static urls = {
        getUserCashTableActiveHandHistory: '/v1/user/##USER_UNIQUE_ID##/cash/##TABLE_ID##/hand/history/active',
        getUserPracticeTableActiveHandHistory: '/v1/user/##USER_UNIQUE_ID##/practice/##TABLE_ID##/hand/history/active',
        getUserTournamentActiveHandHistory: '/v1/user/##USER_UNIQUE_ID##/tournament/##TOURNAMENT_ID##/hand/history/active',
        getUserCashTableHandHistory: '/v1/user/##USER_UNIQUE_ID##/cash/hand/history',
        getUserPracticeTableHandHistory: '/v1/user/##USER_UNIQUE_ID##/practice/hand/history',
        getUserTournamentHandHistory: '/v1/user/##USER_UNIQUE_ID##/tournament/hand/history',
        getUserCashTableHandDetails: '/v1/user/##USER_UNIQUE_ID##/cash/##TABLE_ID##/hand/##HAND_ID##/details',
        getUserPracticeTableHandDetails: '/v1/user/##USER_UNIQUE_ID##/practice/##TABLE_ID##/hand/##HAND_ID##/details',
        getUserTournamentHandDetails: '/v1/user/##USER_UNIQUE_ID##/tournament/##TOURNAMENT_ID##/hand/##HAND_ID##/details',
        getUserHandDetails: '/v1/user/##USER_UNIQUE_ID##/hand/##HAND_ID##/details',
        getUserStats: '/v1/user/##USER_ID##/stats',
        getUserGameplayStats: '/v1/user/##USER_ID##/gameplay/stats',
        getUserTournamentHistory: '/v1/user/##USER_UNIQUE_ID##/tournament/history',
        createUserNote: '/v1/user/##USER_UNIQUE_ID##/gameplay/note',
        getUserNotes: '/v1/user/##USER_UNIQUE_ID##/gameplay/notes',
        getUserDetails: '/v1/user/##USER_UNIQUE_ID##/gameplay/details',
        getUserNoteColors: '/v1/user/##USER_UNIQUE_ID##/gameplay/note/colors',
        updateUserNoteColor: '/v1/user/##USER_UNIQUE_ID##/gameplay/note/color',
        getUserGameplaySettings: '/v1/user/##USER_UNIQUE_ID##/gameplay/settings',
        updateUserBetSettings: '/v1/user/##USER_UNIQUE_ID##/gameplay/settings/bet',
        updateUserGameSettings: '/v1/user/##USER_UNIQUE_ID##/gameplay/settings/game',
        updateUserSoundSettings: '/v1/user/##USER_UNIQUE_ID##/gameplay/settings/sound',
        updateUserAutoTopUpSettings: '/v1/user/##USER_UNIQUE_ID##/gameplay/settings/autoTopUp',
        createUser: '/v1/user/##USER_UNIQUE_ID##',
        updateUser: '/v1/user/##USER_UNIQUE_ID##',
        getUserFairplayDetails: '/v1/user/##USER_UNIQUE_ID##/fairplay/details',
        getTicketApplicableTournaments: '/v1/user/ticket/tournaments',
        getUserCashGames: '/v1/user/##USER_ID##/rooms',
        getUserMigrationInfo: '/v1/user/##USER_UNIQUE_ID##/migration/info',
        getUserAcknowledgements: '/v1/policy/##USER_UNIQUE_ID##',
        createUserAcknowledgement: '/v1/policy/##USER_UNIQUE_ID##/acknowledge',
        getRecommendedRooms: '/v1/user/##USER_ID##/recommended/rooms',
        convertUserType: '/v1/user/##USER_ID##/convert',
        getRecommendedGroups: '/v1/user/##USER_ID##/recommended/groups',
        getUserLeaderboardTotalWinnings: '/v1/user/##USER_ID##/leaderboard/total/winnings',
        getUsersSettingsBulk: '/v1/user/tournament/bulk/gameplay/settings',
        getUserPslStats: '/v1/user/##USER_ID##/psl/stats',
        updateUserPslStats: '/v1/user/##USER_ID##/psl/stats',
        claimUserPslTicket: '/v1/user/##USER_ID##/psl/claim',
    }

    @ZodiacClientLatencyDecorator
    static async convertUserType(restClient: any, userId: number, userType: number, vendorId: number): Promise<any> {
        try {
            logger.info({userId, userType, vendorId}, `[ZodiacClient] [convertUserType] `);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "userType", value: userType});

            const url = ZodiacClient.getCompleteUrl(
                ZodiacClient.urls.convertUserType.replace(/##USER_ID##/g, `${userId}`), queryParams);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info({url: url, headers: headers}, `[ZodiacClient] [convertUserType] `);
            const response = await BaseClient.sendPutRequestWithHeaders(restClient, url, {}, headers);
            logger.info(response, `[ZodiacClient] [convertUserType] response :: `);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserAcknowledgements(restClient: any, userUniqueId: string): Promise<any[]> {
        try {
            logger.info(`[ZodiacClient] [getUserAcknowledgements] userUniqueId :: ${userUniqueId}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserAcknowledgements.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            logger.info(`[ZodiacClient] [getUserAcknowledgements] url :: ${url}`);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getUserAcknowledgements] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }


    @ZodiacClientLatencyDecorator
    static async createUserAcknowledgement(restClient: any, userUniqueId: string, acknowledgement: UserAcknowledgement): Promise<any> {
        try {
            logger.info(`[ZodiacClient] [createUserAcknowledgement] userUniqueId :: ${userUniqueId} acknowledgement:: `, acknowledgement);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.createUserAcknowledgement.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            logger.info(`[ZodiacClient] [createUserAcknowledgement] url :: ${url}`);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, acknowledgement, headers);
            logger.info(`[ZodiacClient] [createUserAcknowledgement] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserCashTableActiveHandHistory(restClient: any, userUniqueId: string, tableId: string): Promise<any> {
        try {
            logger.info({
                userUniqueId: userUniqueId,
                TableId: tableId
            }, `[ZodiacClient] [getUserCashTableActiveHandHistory] `);

            const url = ZodiacClient.getCompleteUrl(
                ZodiacClient.urls.getUserCashTableActiveHandHistory
                    .replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`)
                    .replace(/##TABLE_ID##/g, `${tableId}`)
            );
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserCashTableActiveHandHistory] `);

            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[ZodiacClient] [getUserCashTableActiveHandHistory] response :: `);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserPracticeTableActiveHandHistory(restClient: any, userUniqueId: string, tableId: string): Promise<any> {
        try {
            logger.info({
                userUniqueId: userUniqueId,
                TableId: tableId
            }, `[ZodiacClient] [getUserPracticeTableActiveHandHistory] `);
            const url = ZodiacClient.getCompleteUrl(
                ZodiacClient.urls.getUserPracticeTableActiveHandHistory
                    .replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`)
                    .replace(/##TABLE_ID##/g, `${tableId}`)
            );
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());

            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserPracticeTableActiveHandHistory] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[ZodiacClient] [getUserPracticeTableActiveHandHistory] response :: `);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserTournamentActiveHandHistory(restClient: any, userUniqueId: string, tournamentId: string): Promise<any> {
        try {
            logger.info({
                userUniqueId: userUniqueId,
                TournamentId: tournamentId
            }, `[ZodiacClient] [getUserTournamentHandHistory] `);

            const url = ZodiacClient.getCompleteUrl(
                ZodiacClient.urls.getUserTournamentActiveHandHistory
                    .replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`)
                    .replace(/##TOURNAMENT_ID##/g, `${tournamentId}`)
            );
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());

            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserTournamentHandHistory] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[ZodiacClient] [getUserTournamentHandHistory] response :: `);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserCashTableHandHistory(restClient: any, userUniqueId: string, date: string, pagination: Pagination, gameVariant: string): Promise<any> {
        try {
            logger.info({userUniqueId: userUniqueId, Date: date}, `[ZodiacClient] [getUserCashTableHandHistory] `);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "date", value: date});
            queryParams.push({param: "gameVariant", value: gameVariant});

            if (pagination) {
                if (pagination.offset) queryParams.push({param: "offset", value: pagination.offset});
                if (pagination.numOfRecords) queryParams.push({param: "numOfRecords", value: pagination.numOfRecords});
            }

            const url = ZodiacClient.getCompleteUrl(
                ZodiacClient.urls.getUserCashTableHandHistory.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`), queryParams);

            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());

            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserCashTableHandHistory] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[ZodiacClient] [getUserCashTableHandHistory] response :: `);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserPracticeTableHandHistory(restClient: any, userUniqueId: string, date: string, pagination: Pagination, gameVariant: string): Promise<any> {
        try {
            logger.info({userUniqueId: userUniqueId, Date: date}, `[ZodiacClient] [getUserPracticeTableHandHistory] `);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "date", value: date});
            queryParams.push({param: "gameVariant", value: gameVariant});

            if (pagination) {
                if (pagination.offset) queryParams.push({param: "offset", value: pagination.offset});
                if (pagination.numOfRecords) queryParams.push({param: "numOfRecords", value: pagination.numOfRecords});
            }

            const url = ZodiacClient.getCompleteUrl(
                ZodiacClient.urls.getUserPracticeTableHandHistory.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`), queryParams);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserPracticeTableHandHistory] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[ZodiacClient] [getUserPracticeTableHandHistory] response :: `);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserTournamentHandHistory(restClient: any, userUniqueId: string, date: string, pagination: Pagination): Promise<any> {
        try {
            logger.info({userUniqueId: userUniqueId, Date: date}, `[ZodiacClient] [getUserTournamentHandHistory] `);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "date", value: date});

            if (pagination) {
                if (pagination.offset) queryParams.push({param: "offset", value: pagination.offset});
                if (pagination.numOfRecords) queryParams.push({param: "numOfRecords", value: pagination.numOfRecords});
            }

            const url = ZodiacClient.getCompleteUrl(
                ZodiacClient.urls.getUserTournamentHandHistory
                    .replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`), queryParams);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());

            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserTournamentHandHistory] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[ZodiacClient] [getUserTournamentHandHistory] response :: `);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserCashTableHandDetails(restClient: any, userUniqueId: string, tableId: string, handId: string): Promise<any> {
        try {
            logger.info({
                userUniqueId: userUniqueId,
                TableId: tableId,
                HandId: handId
            }, `[ZodiacClient] [getUserTableHandDetails] `);

            const url = ZodiacClient.getCompleteUrl(
                ZodiacClient.urls.getUserCashTableHandDetails
                    .replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`)
                    .replace(/##TABLE_ID##/g, `${tableId}`)
                    .replace(/##HAND_ID##/g, `${handId}`));

            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());

            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserTableHandDetails] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[ZodiacClient] [getUserTableHandDetails] response :: `);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserPracticeTableHandDetails(restClient: any, userUniqueId: string, tableId: string, handId: string): Promise<any> {
        try {
            logger.info({
                userUniqueId: userUniqueId,
                TableId: tableId,
                HandId: handId
            }, `[ZodiacClient] [getUserTableHandDetails] `);

            const url = ZodiacClient.getCompleteUrl(
                ZodiacClient.urls.getUserPracticeTableHandDetails
                    .replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`)
                    .replace(/##TABLE_ID##/g, `${tableId}`)
                    .replace(/##HAND_ID##/g, `${handId}`));

            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());

            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserTableHandDetails] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[ZodiacClient] [getUserTableHandDetails] response :: `);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserTournamentHandDetails(restClient: any, userUniqueId: string, tournamentId: string, handId: string): Promise<any> {
        try {
            logger.info({
                userUniqueId: userUniqueId,
                TournamentId: tournamentId,
                HandId: handId
            }, `[ZodiacClient] [getUserTournamentHandDetails] `);

            const url = ZodiacClient.getCompleteUrl(
                ZodiacClient.urls.getUserTournamentHandDetails
                    .replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`)
                    .replace(/##TOURNAMENT_ID##/g, `${tournamentId}`)
                    .replace(/##HAND_ID##/g, `${handId}`));

            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());

            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserTournamentHandDetails] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[ZodiacClient] [getUserTournamentHandDetails] response :: `);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserHandDetails(restClient: any, userUniqueId: string, handId: string): Promise<any> {
        try {
            logger.info({
                userUniqueId: userUniqueId,
                HandId: handId
            }, `[ZodiacClient] [getUserHandDetails] `);

            const url = ZodiacClient.getCompleteUrl(
                ZodiacClient.urls.getUserHandDetails
                    .replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`)
                    .replace(/##HAND_ID##/g, `${handId}`));

            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());

            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserHandDetails] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[ZodiacClient] [getUserHandDetails] response :: `);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserTournamentHistory(restClient: any, userUniqueId: string, date: string): Promise<any> {
        try {
            logger.info({
                userUniqueId: userUniqueId,
                Date: date
            }, `[ZodiacClient] [getUserTournamentHistory] `);

            const queryParams: QueryParam[] = [];
            queryParams.push({param: "date", value: date});

            const url = ZodiacClient.getCompleteUrl(
                ZodiacClient.urls.getUserHandDetails
                    .replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`), queryParams);

            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());

            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserTournamentHistory] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[ZodiacClient] [getUserTournamentHistory] response :: `);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserStats(restClient: any, userId: number): Promise<any> {
        try {
            logger.info({
                userId: userId,
            }, `[ZodiacClient] [getUserTournamentHistory] `);

            const url = ZodiacClient.getCompleteUrl(
                ZodiacClient.urls.getUserStats
                    .replace(/##USER_ID##/g, `${userId}`));

            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserStats] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[ZodiacClient] [getUserStats] response :: `);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserGameplayStats(restClient: any, userId: number, vendorId: number, gameType: number, gameVariant: string): Promise<any> {
        try {
            logger.info({
                UserId: userId,
                VendorId: vendorId,
                GameType: gameType,
                GameVariant: gameVariant
            }, `[ZodiacClient] [getUserGameplayStats] `);

            const queryParams: QueryParam[] = [];

            if (gameVariant) {
                queryParams.push({
                    param: ZODIAC_REQUEST_PARAM.GAME_VARIANT,
                    value: gameVariant,
                });
            }
            if (gameType) {
                queryParams.push({
                    param: ZODIAC_REQUEST_PARAM.GAME_TYPE,
                    value: gameType,
                });
            }
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserGameplayStats.replace(/##USER_ID##/g, `${userId}`), queryParams);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserGameplayStats] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[ZodiacClient] [getUserGameplayStats] response :: `);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async createUserNote(restClient: any, userUniqueId: string, request: CreateUserNotePayload): Promise<UserNoteResponse> {
        try {
            logger.info(`[ZodiacClient] [createUserNote] userUniqueId :: ${userUniqueId} :: request :: ${JSON.stringify(request)}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.createUserNote.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            logger.info({url: url, headers: headers}, `[ZodiacClient] [createUserNote] `);
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[ZodiacClient] [createUserNote] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserNotes(restClient: any, userUniqueId: string, request: GetUserNotesPayload): Promise<UserNotesResponse> {
        try {
            logger.info(`[ZodiacClient] [getUserNotes] userUniqueId :: ${userUniqueId} :: request :: ${JSON.stringify(request)}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserNotes.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            logger.info(`[ZodiacClient] [getUserNotes] url :: ${url}`);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserNotes] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, null, request,);
            logger.info(response, `[ZodiacClient] [getUserNotes] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserDetails(restClient: any, userUniqueId: string, gameType: number, gameVariant: string, request: GetUserNotesPayload): Promise<UserDetailsResponse> {
        try {
            logger.info(`[ZodiacClient] [getUserDetails] userUniqueId :: ${userUniqueId} :: request :: ${JSON.stringify(request)}`);
            const queryParams: QueryParam[] = [];

            if (gameVariant) {
                queryParams.push({
                    param: ZODIAC_REQUEST_PARAM.GAME_VARIANT,
                    value: gameVariant,
                });
            }
            if (gameType) {
                queryParams.push({
                    param: ZODIAC_REQUEST_PARAM.GAME_TYPE,
                    value: gameType,
                });
            }

            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserDetails.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`), queryParams);
            logger.info(`[ZodiacClient] [getUserDetails] url :: ${url}`);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserDetails] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, null, request,);
            logger.info(response, `[ZodiacClient] [getUserDetails] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserNoteColors(restClient: any, userUniqueId: string): Promise<UserNoteColorsResponse> {
        try {
            logger.info(`[ZodiacClient] [getUserNoteColors] userUniqueId :: ${userUniqueId}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserNoteColors.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            logger.info({url: url, headers: headers}, `[ZodiacClient] [getUserNoteColors] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[ZodiacClient] [getUserNoteColors] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    static async updateUserNoteColor(restClient: any, userUniqueId: string, request: UpdateUserNoteColorPayload): Promise<UserNoteColorsResponse> {
        try {
            logger.info(`[ZodiacClient] [updateUserNoteColor] userUniqueId :: ${userUniqueId} :: request :: ${JSON.stringify(request)}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.updateUserNoteColor.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            logger.info(`[ZodiacClient] [updateUserNoteColor] url :: ${url}`);

            const response = await BaseClient.sendPutRequestAsync(restClient, url, request);
            logger.info(`[ZodiacClient] [updateUserNoteColor] response :: ${JSON.stringify(response)}`);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserGameplaySettings(restClient: any, userUniqueId: string): Promise<UserGameplaySettingsResponse> {
        try {
            logger.info(`[ZodiacClient] [getUserGameplaySettings] userUniqueId :: ${userUniqueId}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserGameplaySettings.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            logger.info(`[ZodiacClient] [getUserGameplaySettings] url :: ${url}`);

            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getUserGameplaySettings] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async updateUserBetSettings(restClient: any, userUniqueId: string, request: UpdateUserBetSettingsPayload): Promise<UserBetSettingsResponse> {
        try {
            logger.info(`[ZodiacClient] [updateUserBetSettings] userUniqueId :: ${userUniqueId} :: request :: ${JSON.stringify(request)}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.updateUserBetSettings.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            logger.info(`[ZodiacClient] [updateUserBetSettings] url :: ${url}`);

            const response = await BaseClient.sendPutRequestAsync(restClient, url, request);
            logger.info(`[ZodiacClient] [updateUserBetSettings] response :: ${JSON.stringify(response)}`);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async updateUserGameSettings(restClient: any, userUniqueId: string, request: UpdateUserGameSettingsPayload): Promise<UserGameSettingsResponse> {
        try {
            logger.info(`[ZodiacClient] [updateUserGameSettings] userUniqueId :: ${userUniqueId} :: request :: ${JSON.stringify(request)}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.updateUserGameSettings.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            logger.info(`[ZodiacClient] [updateUserGameSettings] url :: ${url}`);

            const response = await BaseClient.sendPutRequestAsync(restClient, url, request);
            logger.info(`[ZodiacClient] [updateUserGameSettings] response :: ${JSON.stringify(response)}`);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }


    @ZodiacClientLatencyDecorator
    static async updateUserAutoTopUpSettings(restClient: any, userUniqueId: string, request: UpdateUserAutoTopUpSettingsPayload): Promise<UserAutoTopUpResponse> {
        try {
            logger.info(`[ZodiacClient] [updateUserAutoTopUpSettings] userUniqueId :: ${userUniqueId} :: request :: ${JSON.stringify(request)}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.updateUserAutoTopUpSettings.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            logger.info(`[ZodiacClient] [updateUserAutoTopUpSettings] url :: ${url}`);

            const response = await BaseClient.sendPutRequestAsync(restClient, url, request);
            logger.info(`[ZodiacClient] [updateUserAutoTopUpSettings] response :: ${JSON.stringify(response)}`);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async updateUserSoundSettings(restClient: any, userUniqueId: string, request: UpdateUserSoundSettingsPayload): Promise<UserSoundSettingsResponse> {
        try {
            logger.info(`[ZodiacClient] [updateUserSoundSettings] userUniqueId :: ${userUniqueId} :: request :: ${JSON.stringify(request)}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.updateUserSoundSettings.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            logger.info(`[ZodiacClient] [updateUserSoundSettings] url :: ${url}`);

            const response = await BaseClient.sendPutRequestAsync(restClient, url, request);
            logger.info(`[ZodiacClient] [updateUserSoundSettings] response :: ${JSON.stringify(response)}`);
            return response.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async createUser(restClient: any, userUniqueId: string, reqBody: CreateUserRequest): Promise<User> {
        try {
            logger.info(`[ZodiacClient] [createUser] userUniqueId :: ${userUniqueId}  reqBody :: ${JSON.stringify(reqBody)}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.createUser.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            logger.info({url: url, headers: headers}, `[ZodiacClient] [createUser] `);
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, reqBody, headers);
            logger.info(response, `[ZodiacClient] [createUser] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async updateUser(restClient: any, userUniqueId: string, reqBody: UpdateUserRequest): Promise<User> {
        try {
            logger.info(`[ZodiacClient] [updateUser] userUniqueId :: ${userUniqueId}  reqBody :: ${JSON.stringify(reqBody)}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.updateUser.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            logger.info({url: url, headers: headers}, `[ZodiacClient] [updateUser] `);
            const response = await BaseClient.sendPutRequestWithHeaders(restClient, url, reqBody, headers);
            logger.info(response, `[ZodiacClient] [updateUser] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserFairplayDetails(restClient: any, userUniqueId: string): Promise<UserFairplayDetailsResponse> {
        try {
            logger.info(`[ZodiacClient] [getUserFairplayDetails] userUniqueId :: ${userUniqueId}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserFairplayDetails.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            logger.info(`[ZodiacClient] [getUserFairplayDetails] url :: ${url}`);

            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getUserFairplayDetails] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getTicketApplicableTournaments(restClient: any, ticketAmounts: number[]): Promise<UserFairplayDetailsResponse> {
        try {
            logger.info(`[ZodiacClient] [getTicketApplicableTournaments] ticketAmounts :: ${ticketAmounts}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "ticketAmounts", value: ticketAmounts.join(',')});
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getTicketApplicableTournaments, queryParams);
            logger.info(`[ZodiacClient] [getTicketApplicableTournaments] url :: ${url}`);

            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getTicketApplicableTournaments] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserCashGames(restClient: any, userId: number): Promise<UserCashGames> {
        try {
            logger.info(`[ZodiacClient] [getUserCashGames] userId :: ${userId}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserCashGames.replace(/##USER_ID##/g, `${userId}`));
            logger.info(`[ZodiacClient] [getUserCashGames] url :: ${url}`);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getUserCashGames] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserMigrationInfo(restClient: any, userUniqueId: string): Promise<User> {
        try {
            logger.info(`[ZodiacClient] [getUserMigrationInfo] userUniqueId :: ${userUniqueId}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserMigrationInfo.replace(/##USER_UNIQUE_ID##/g, `${userUniqueId}`));
            logger.info(`[ZodiacClient] [getUserMigrationInfo] url :: ${url}`);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[ZodiacClient] [getUserMigrationInfo] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getRecommendedRooms(restClient: any, userId: number, requestBody: GetRecommendedRoomsRequest, timeout?: number): Promise<Room[]> {
        try {
            logger.info(`[ZodiacClient] [getRecommendedRooms] request :: ${JSON.stringify(requestBody)}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getRecommendedRooms.replace(/##USER_ID##/g, `${userId}`));
            logger.info(`[ZodiacClient] [getRecommendedRooms] url :: ${url}`);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, timeout, requestBody);
            logger.info(`[ZodiacClient] [getRecommendedRooms] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getRecommendedGroups(restClient: any, userId: number, requestBody: GetRecommendedGroupsRequest, timeout?: number): Promise<Group[]> {
        try {
            logger.info(`[ZodiacClient] [getRecommendedGroups] request :: ${JSON.stringify(requestBody)}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getRecommendedRooms.replace(/##USER_ID##/g, `${userId}`));
            logger.info(`[ZodiacClient] [getRecommendedGroups] url :: ${url}`);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, timeout, requestBody);
            logger.info(`[ZodiacClient] [getRecommendedGroups] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserLeaderboardTotalWinnings(restClient: any, userId: number, timeout?: number): Promise<ZodiacUserLeaderboardTotalWinning|undefined> {
        try {
            logger.info(`[ZodiacClient] [getUserLeaderboardTotalWinnings] userId :: ${userId}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserLeaderboardTotalWinnings.replace(/##USER_ID##/g, `${userId}`));
            logger.info(`[ZodiacClient] [getUserLeaderboardTotalWinnings] url :: ${url}`);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, timeout);
            logger.info(`[ZodiacClient] [getUserLeaderboardTotalWinnings] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUsersTournamentSettingsInfoBulk(restClient: any, bulkSettingsRequest: BulkUserGameplaySettingsRequest): Promise<UserGameplaySettingsResponse[]> {
        try {
            logger.info(`[ZodiacClient] [getBulkUserGameplaySettings] bulkSettingsRequest :: ${bulkSettingsRequest}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUsersSettingsBulk);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            logger.info(`getBulkUserGameplaySettings url : ${url}, headers: ${JSON.stringify(headers)}`);
            const response = await BaseClient.sendGetRequestWithHeadersAndBody(
                restClient,
                url,
                headers,
                bulkSettingsRequest
            );
            logger.info(`[ZodiacClient] [getBulkUserGameplaySettings] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error('getUsersTournamentSettingsInfoBulk',error)
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async getUserPslStats(restClient: any, userId: number, timeout?: number): Promise<UserPslStats> {
        try {
            logger.info(`[ZodiacClient] [getUserPslStats] userId :: ${userId}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.getUserPslStats.replace(/##USER_ID##/g, `${userId}`));
            logger.info(`[ZodiacClient] [getUserPslStats] url :: ${url}`);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, timeout);
            logger.info(`[ZodiacClient] [getUserPslStats] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async updateUserPslStats(restClient: any, userId: number, requestBody: UserPslStats): Promise<UserPslStats> {
        try {
            logger.info(`[ZodiacClient] [updateUserPslStats] userId :: ${userId} :: requestBody :: ${JSON.stringify(requestBody)}`);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.updateUserPslStats.replace(/##USER_ID##/g, `${userId}`));
            logger.info(`[ZodiacClient] [updateUserPslStats] url :: ${url}`);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const response = await BaseClient.sendPutRequestWithHeaders(restClient, url, requestBody, headers);
            logger.info(`[ZodiacClient] [updateUserPslStats] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    @ZodiacClientLatencyDecorator
    static async claimUserPslTicket(restClient: any, userId: number): Promise<UserPslStats> {
        try {
            logger.info(`[ZodiacClient] [claimUserPslTicket] userId :: ${userId} `);
            const url = ZodiacClient.getCompleteUrl(ZodiacClient.urls.claimUserPslTicket.replace(/##USER_ID##/g, `${userId}`));
            logger.info(`[ZodiacClient] [claimUserPslTicket] url :: ${url}`);
            const headers: any = ZodiacClient.getZodiacServiceHeaders(restClient.getRequestId());
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, {}, headers);
            logger.info(`[ZodiacClient] [claimUserPslTicket] response :: ${JSON.stringify(response)}`);
            return response?.data;
        } catch (error) {
            throw ZodiacClient.getError(error);
        }
    }

    static wrapError(error: any) {
        if (error && !(error instanceof ZodiacServiceError)) {
            return ZodiacServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    private static getZodiacServiceHeaders(requestId: string, vendorId?: number) {
        let headers: any = {"x-request-id": requestId};
        if (vendorId) {
            headers = {...headers, "x-vendor-id": vendorId};
        }
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
            case 13001:
                return ZodiacServiceErrorUtil.getPslPassAlreadyClaimed();
            case 13002:
                return ZodiacServiceErrorUtil.getPslPassNotClaimed();
            default:
                return ZodiacServiceErrorUtil.getError(error);
        }
    }
};
