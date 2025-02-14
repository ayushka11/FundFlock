import ZodiacClient from "../clients/zodiacClient";
import { Room } from '../models/room';
import { GetRecommendedGroupsRequest } from '../models/zodiac/get-recommended-groups-request';
import { GetRecommendedRoomsRequest } from '../models/zodiac/get-recommended-rooms-request';
import LoggerUtil, { ILogger } from "../utils/logger";
import Pagination from "../models/pagination";
import {
    UpdateUserAutoTopUpSettingsPayload,
    UpdateUserBetSettingsPayload,
    UpdateUserGameSettingsPayload,
    UpdateUserSoundSettingsPayload,
    UserAutoTopUpResponse,
    UserAutoTopUpSetting,
    UserBetSettings,
    UserBetSettingsResponse,
    UserGameplaySettings,
    UserGameplaySettingsResponse,
    UserGameSettings,
    UserGameSettingsResponse,
    UserSoundSettings,
    UserSoundSettingsResponse,
} from "../models/zodiac/gameplay";
import {
    CreateUserNotePayload,
    GetUserNotesPayload,
    UpdateUserNoteColorPayload,
    UserNote,
    UserNoteColor,
    UserNoteColorsResponse,
    UserNoteResponse,
    UserNotesResponse,
} from "../models/zodiac/user-note";
import { UserDetailsResponse, UserGameplayDetails } from "../models/zodiac/user-detail";
import { UserFairplayDetails, UserFairplayDetailsResponse } from "../models/zodiac/fairplay-details";
import { CreateUserRequest } from "../models/zodiac/create-user-request";
import { UpdateUserRequest } from "../models/zodiac/update-user-request";
import { User, UserAcknowledgement } from "../models/zodiac/user";
import ZodiacUtil from "../utils/zodiac-util";
import { ZodiacUserLeaderboardTotalWinning } from "../models/leaderboard/total-leaderboard-earning-response";
import { BulkUserGameplaySettingsRequest } from "../models/zodiac/bulk-user-gameplay-settings-request";
import { UserPslStats } from "../models/zodiac/user-psl-stats";

const configService = require('../services/configService');
const logger: ILogger = LoggerUtil.get("ZodiacService");

export default class ZodiacService {
    // this will be depriciated in future so pls donot use this
    static async getAcknowledgements(restClient: any, userUniqueId: string): Promise<any[]> {
        try {
            logger.info('fetching acknowledgements for :: ', userUniqueId);
            const userAcknowledgements: any[] = await ZodiacClient.getUserAcknowledgements(restClient, userUniqueId);// all the acknowledgements of this user
            logger.info("userAcknowledgements", userAcknowledgements);
            return userAcknowledgements;
        } catch (e) {
            logger.info('error in fetching acknowledgements');
            throw e;
        }
    }

    // depriciated method
    // use the getUserPolicy in concordiaService
    static async getUserPolicy(restClient: any, userUniqueId: any, vendorId: string) {
        try {
            logger.info("got the data for getUserPolicy", {userUniqueId, vendorId});
            let response: any = {};
            const userStatus: User = await ZodiacService.getUserMigrationInfo(restClient, userUniqueId);
            logger.info("userStatus", userStatus);
            logger.info({vendorId, conf: configService.getUserPolicy().config})
            if (userStatus.has_migrated_to_apollo && !userStatus.created_directly_on_apollo && ((configService.getUserPolicy().config || []).filter(vendor => vendor == vendorId)).length) { // user is old user and from gamezy
                const userAcknowledgements: any[] = await ZodiacClient.getUserAcknowledgements(restClient, userUniqueId);// all the acknowledgements of this user
                logger.info("userAcknowledgements", userAcknowledgements);
                const userPolicy: any = configService.getUserPolicy().policy;
                const acknowledgements: any[] = userAcknowledgements.filter(ack => ack.policy_id == userPolicy.policyId);
                if (!acknowledgements.length) {// if the user has acknowledged the current policy
                    logger.info("user has not acknowledgeed this policy")
                    response = userPolicy;
                }
            }
            logger.info(response, `[ZodiacService] [getUserPolicy] getUserPolicy :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ZodiacService] [getUserPolicy] received error :: `);
            throw (e);
        }
    }

    // depriciated method
    // use the getUserPolicy in concordiaService
    static async createUserAcknowledgement(restClient: any, userUniqueId: any, acknowledgement: UserAcknowledgement, userId: string, vendorId: string) {
        try {
            const userAcknowledgement: any = await ZodiacClient.createUserAcknowledgement(restClient, userUniqueId, acknowledgement);
            logger.info(userAcknowledgement, `[ZodiacService] [createUserAcknowledgement] response :: `);
            const isMigrationPolicy = ZodiacUtil.getIsMigrationPolicy(configService.getUserPolicy().migrationPolicy, acknowledgement.policyId);
            if (isMigrationPolicy) {
                logger.info("migrating data for the user");
            }
            return {};
        } catch (e) {
            logger.info(e, `[ZodiacService] [createUserAcknowledgement] received error :: `);
            throw (e);
        }
    }

    static async getUserCashTableActiveHandHistory(restClient: any, userUniqueId: string, tableId: string) {
        try {
            logger.info({
                UserUniqueId: userUniqueId,
                TableId: tableId
            }, `[ZodiacService] [getUserCashTableActiveHandHistory] `);
            const response: any = await ZodiacClient.getUserCashTableActiveHandHistory(restClient, userUniqueId, tableId);
            logger.info(response, `[ZodiacService] [getUserCashTableActiveHandHistory] cashTableActiveHandHistory :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ZodiacService] [getUserCashTableActiveHandHistory] received error :: `);
            throw (e);
        }
    }

    static async getUserPracticeTableActiveHandHistory(restClient: any, userUniqueId: string, tableId: string) {
        try {
            logger.info({
                UserUniqueId: userUniqueId,
                TableId: tableId
            }, `[ZodiacService] [getUserPracticeTableActiveHandHistory] `);
            const response: any = await ZodiacClient.getUserPracticeTableActiveHandHistory(restClient, userUniqueId, tableId);
            logger.info(response, `[ZodiacService] [getUserPracticeTableActiveHandHistory] practiceTableActiveHandHistory :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ZodiacService] [getUserPracticeTableActiveHandHistory] received error :: `);
            throw (e);
        }
    }

    static async getUserTournamentActiveHandHistory(restClient: any, userUniqueId: string, tournamentId: string) {
        try {
            logger.info({
                UserUniqueId: userUniqueId,
                TournamentId: tournamentId
            }, `[ZodiacService] [getUserTournamentActiveHandHistory] `);
            const response: any = await ZodiacClient.getUserTournamentActiveHandHistory(restClient, userUniqueId, tournamentId);
            logger.info(response, `[ZodiacService] [getUserTournamentActiveHandHistory] tournamentActiveHandHistory :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ZodiacService] [getUserTournamentActiveHandHistory] received error :: `);
            throw (e);
        }
    }

    static async getUserCashTableHandHistory(restClient: any, userUniqueId: string, date: string, pagination: Pagination, gameVariant: string) {
        try {
            logger.info({
                UserUniqueId: userUniqueId,
                Date: date,
                GameVariant: gameVariant
            }, `[ZodiacService] [getUserCashTableHandHistory] `);
            const response: any = await ZodiacClient.getUserCashTableHandHistory(restClient, userUniqueId, date, pagination, gameVariant);
            logger.info(response, `[ZodiacService] [getUserCashTableHandHistory] userCashTableHandHistory :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ZodiacService] [getUserCashTableHandHistory] received error :: `);
            throw (e);
        }
    }

    static async getUserPracticeTableHandHistory(restClient: any, userUniqueId: string, date: string, pagination: Pagination, gameVariant: string) {
        try {
            logger.info({
                UserUniqueId: userUniqueId,
                Date: date,
                GameVariant: gameVariant
            }, `[ZodiacService] [getUserPracticeTableHandHistory] `);
            const response: any = await ZodiacClient.getUserPracticeTableHandHistory(restClient, userUniqueId, date, pagination, gameVariant);
            logger.info(response, `[ZodiacService] [getUserPracticeTableHandHistory] userCashTableHandHistory :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ZodiacService] [getUserPracticeTableHandHistory] received error :: `);
            throw (e);
        }
    }

    static async getUserTournamentHandHistory(restClient: any, userUniqueId: string, date: string, pagination: Pagination) {
        try {
            logger.info({
                UserUniqueId: userUniqueId,
                Date: date
            }, `[ZodiacService] [getUserTournamentHandHistory] `);
            const response: any = await ZodiacClient.getUserTournamentHandHistory(restClient, userUniqueId, date, pagination);
            logger.info(response, `[ZodiacService] [getUserTournamentHandHistory] userTournamentHandHistory :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ZodiacService] [getUserTournamentHandHistory] received error :: `);
            throw (e);
        }
    }

    static async getUserCashTableHandDetails(restClient: any, userUniqueId: string, tableId: string, handId: string) {
        try {
            logger.info({
                UserUniqueId: userUniqueId,
                TableId: tableId,
                HandId: handId
            }, `[ZodiacService] [getUserCashTableHandDetails] `);
            const response: any = await ZodiacClient.getUserCashTableHandDetails(restClient, userUniqueId, tableId, handId);
            logger.info(response, `[ZodiacService] [getUserCashTableHandDetails] userCashTableHandDetails :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ZodiacService] [getUserCashTableHandDetails] received error :: `);
            throw (e);
        }
    }

    static async getUserPracticeTableHandDetails(restClient: any, userUniqueId: string, tableId: string, handId: string) {
        try {
            logger.info({
                UserUniqueId: userUniqueId,
                TableId: tableId,
                HandId: handId
            }, `[ZodiacService] [getUserPracticeTableHandDetails] `);
            const response: any = await ZodiacClient.getUserPracticeTableHandDetails(restClient, userUniqueId, tableId, handId);
            logger.info(response, `[ZodiacService] [getUserPracticeTableHandDetails] userPracticeTableHandDetails :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ZodiacService] [getUserPracticeTableHandDetails] received error :: `);
            throw (e);
        }
    }

    static async getUserTournamentHandDetails(restClient: any, userUniqueId: string, tournamentId: string, handId: string) {
        try {
            logger.info({
                UserUniqueId: userUniqueId,
                TournamentId: tournamentId,
                HandId: handId
            }, `[ZodiacService] [getUserTournamentHandDetails] `);
            const response: any = await ZodiacClient.getUserTournamentHandDetails(restClient, userUniqueId, tournamentId, handId);
            logger.info(response, `[ZodiacService] [getUserTournamentHandDetails] userTournamentHandDetails :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ZodiacService] [getUserTournamentHandDetails] received error :: `);
            throw (e);
        }
    }

    static async getUserHandDetails(restClient: any, userUniqueId: string, handId: string) {
        try {
            logger.info({
                UserUniqueId: userUniqueId,
                HandId: handId
            }, `[ZodiacService] [getUserHandDetails] `);
            const response: any = await ZodiacClient.getUserHandDetails(restClient, userUniqueId, handId);
            logger.info(response, `[ZodiacService] [getUserHandDetails] userHandDetails :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ZodiacService] [getUserHandDetails] received error :: `);
            throw (e);
        }
    }


    static async getUserStats(restClient: any, userId: number) {
        try {
            logger.info({
                UserId: userId,
            }, `[ZodiacService] [getUserStats] `);
            const response: any = await ZodiacClient.getUserStats(restClient, userId);
            logger.info(response, `[ZodiacService] [getUserStats] userStats :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ZodiacService] [getUserStats] received error :: `);
            throw (e);
        }
    }

    static async getUserGameplayStats(restClient: any, userId: number, vendorId: number, gameType: number, gameVariant: string) {
        try {
            logger.info({
                UserId: userId,
                VendorId: vendorId,
                GameType: gameType,
                GameVariant: gameVariant
            }, `[ZodiacService] [getUserGameplayStats] `);
            const response: any = await ZodiacClient.getUserGameplayStats(restClient, userId, vendorId, gameType, gameVariant);
            logger.info(response, `[ZodiacService] [getUserGameplayStats] userGameplayStats :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ZodiacService] [getUserGameplayStats] received error :: `);
            throw (e);
        }
    }

    static async getUserTournamentHistory(restClient: any, userUniqueId: string, date: string) {
        try {
            logger.info({
                UserUniqueId: userUniqueId,
                Date: date
            }, `[ZodiacService] [getUserTournamentHistory] `);
            const response: any = await ZodiacClient.getUserTournamentHistory(restClient, userUniqueId, date);
            logger.info(response, `[ZodiacService] [getUserTournamentHistory] userTournamentHistory :: `);
            return response;
        } catch (e) {
            logger.info(e, `[ZodiacService] [getUserTournamentHistory] received error :: `);
            throw (e);
        }
    }

    static async createUserNote(restClient: any, userUniqueId: string, request: CreateUserNotePayload): Promise<UserNote> {
        try {
            const response: UserNoteResponse = await ZodiacClient.createUserNote(restClient, userUniqueId, request);
            logger.info(`[ZodiacService] [createUserNote] response :: ${JSON.stringify(response)}`);
            const userNote: UserNote = response.data;
            logger.info(`[ZodiacService] [createUserNote] userNote :: ${JSON.stringify(userNote)}`);
            return userNote;
        } catch (error) {
            logger.error(error, `[ZodiacService] [createUserNote] Failed`);
            throw error;
        }
    }

    static async getUserNotes(restClient: any, userUniqueId: string, request: GetUserNotesPayload): Promise<UserNote[]> {
        try {
            const response: UserNotesResponse = await ZodiacClient.getUserNotes(restClient, userUniqueId, request);
            logger.info(`[ZodiacService] [getUserNotes] response :: ${JSON.stringify(response)}`);
            const userNotes: UserNote[] = response.data ?? [];
            logger.info(`[ZodiacService] [getUserNotes] userNotes :: ${JSON.stringify(userNotes)}`);
            return userNotes;
        } catch (error) {
            logger.error(error, `[ZodiacService] [getUserNotes] Failed`);
            throw error;
        }
    }

    static async getUserDetails(restClient: any, userUniqueId: string, gameType: number, gameVariant: string, request: GetUserNotesPayload): Promise<UserGameplayDetails> {
        try {
            const response: UserDetailsResponse = await ZodiacClient.getUserDetails(restClient, userUniqueId, gameType, gameVariant, request);
            logger.info(`[ZodiacService] [getUserDetails] response :: ${JSON.stringify(response)}`);
            const userGameplayDetails: UserGameplayDetails = response.data ?? {};
            logger.info(`[ZodiacService] [getUserDetails] userGameplayDetails :: ${JSON.stringify(userGameplayDetails)}`);
            return userGameplayDetails;
        } catch (error) {
            logger.error(error, `[ZodiacService] [getUserDetails] Failed`);
            throw error;
        }
    }

    static async getUserNoteColors(restClient: any, userUniqueId: string): Promise<UserNoteColor[]> {
        try {
            const response: UserNoteColorsResponse = await ZodiacClient.getUserNoteColors(restClient, userUniqueId);
            logger.info(`[ZodiacService] [getUserNoteColors] response :: ${JSON.stringify(response)}`);
            const userNoteColors: UserNoteColor[] = response.gameplay_note_colors ?? [];
            logger.info(`[ZodiacService] [getUserNoteColors] userNoteColors :: ${JSON.stringify(userNoteColors)}`);
            return userNoteColors;
        } catch (error) {
            logger.error(error, `[ZodiacService] [getUserNoteColors] Failed`);
            throw error;
        }
    }

    static async updateUserNoteColor(restClient: any, userUniqueId: string, request: UpdateUserNoteColorPayload): Promise<UserNoteColor[]> {
        try {
            const response: UserNoteColorsResponse = await ZodiacClient.updateUserNoteColor(restClient, userUniqueId, request);
            logger.info(`[ZodiacService] [updateUserNoteColor] response :: ${JSON.stringify(response)}`);
            const userNoteColors: UserNoteColor[] = response.gameplay_note_colors ?? [];
            logger.info(`[ZodiacService] [updateUserNoteColor] userNoteColors :: ${JSON.stringify(userNoteColors)}`);
            return userNoteColors;
        } catch (error) {
            logger.error(error, `[ZodiacService] [updateUserNoteColor] Failed`);
            throw error;
        }
    }

    static async getUserGameplaySettings(restClient: any, userUniqueId: string): Promise<UserGameplaySettings> {
        try {
            const response: UserGameplaySettingsResponse = await ZodiacClient.getUserGameplaySettings(restClient, userUniqueId);
            logger.info(`[ZodiacService] [getUserGameplaySettings] response :: ${JSON.stringify(response)}`);
            const gameplaySettings: UserGameplaySettings = response.gameplay_config;
            logger.info(`[ZodiacService] [getUserGameplaySettings] gameplaySettings :: ${JSON.stringify(gameplaySettings)}`);
            return gameplaySettings;
        } catch (error) {
            logger.error(error, `[ZodiacService] [getUserGameplaySettings] Failed`);
            throw error;
        }
    }

    static async updateUserBetSettings(restClient: any, userUniqueId: string, request: UpdateUserBetSettingsPayload): Promise<UserBetSettings> {
        try {
            const response: UserBetSettingsResponse = await ZodiacClient.updateUserBetSettings(restClient, userUniqueId, request);
            logger.info(`[ZodiacService] [updateUserBetSettings] response :: ${JSON.stringify(response)}`);
            const betSettings: UserBetSettings = response.gameplay_config;
            logger.info(`[ZodiacService] [updateUserBetSettings] betSettings :: ${JSON.stringify(betSettings)}`);
            return betSettings;
        } catch (error) {
            logger.error(error, `[ZodiacService] [updateUserBetSettings] Failed`);
            throw error;
        }
    }

    static async updateUserGameSettings(restClient: any, userUniqueId: string, request: UpdateUserGameSettingsPayload): Promise<UserGameSettings> {
        try {
            const response: UserGameSettingsResponse = await ZodiacClient.updateUserGameSettings(restClient, userUniqueId, request);
            logger.info(`[ZodiacService] [updateUserGameSettings] response :: ${JSON.stringify(response)}`);
            const gameSettings: UserGameSettings = response.gameplay_config;
            logger.info(`[ZodiacService] [updateUserGameSettings] gameSettings :: ${JSON.stringify(gameSettings)}`);
            return gameSettings;
        } catch (error) {
            logger.error(error, `[ZodiacService] [updateUserBetSettings] Failed`);
            throw error;
        }
    }

    static async updateUserAutoTopUpSettings(restClient: any, userUniqueId: string, request: UpdateUserAutoTopUpSettingsPayload): Promise<UserAutoTopUpSetting> {
        try {
            const response: UserAutoTopUpResponse = await ZodiacClient.updateUserAutoTopUpSettings(restClient, userUniqueId, request);
            logger.info(`[ZodiacService] [updateUserAutoTopUpSettings] response :: ${JSON.stringify(response)}`);
            const autoTopUpSetting: UserAutoTopUpSetting = response.gameplay_config?.auto_top_up_setting;
            logger.info(`[ZodiacService] [updateUserAutoTopUpSettings] autoTopUpSetting :: ${JSON.stringify(autoTopUpSetting)}`);
            return autoTopUpSetting;
        } catch (error) {
            logger.error(error, `[ZodiacService] [updateUserAutoTopUpSettings] Failed`);
            throw error;
        }
    }

    static async updateUserSoundSettings(restClient: any, userUniqueId: string, request: UpdateUserSoundSettingsPayload): Promise<UserSoundSettings> {
        try {
            const response: UserSoundSettingsResponse = await ZodiacClient.updateUserSoundSettings(restClient, userUniqueId, request);
            logger.info(`[ZodiacService] [updateUserSoundSettings] response :: ${JSON.stringify(response)}`);
            const soundSettings: UserSoundSettings = response.gameplay_config;
            logger.info(`[ZodiacService] [updateUserSoundSettings] soundSettings :: ${JSON.stringify(soundSettings)}`);
            return soundSettings;
        } catch (error) {
            logger.error(error, `[ZodiacService] [updateUserBetSettings] Failed`);
            throw error;
        }
    }

    static async createUser(restClient: any, userUniqueId: string, reqBody: CreateUserRequest): Promise<User> {
        try {
            const response: User = await ZodiacClient.createUser(restClient, userUniqueId, reqBody);
            logger.info(`[ZodiacService] [createUser] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[ZodiacService] [createUser] Failed`);
            throw error;
        }
    }

    static async updateUser(restClient: any, userUniqueId: string, reqBody: UpdateUserRequest): Promise<User> {
        try {
            const response: User = await ZodiacClient.updateUser(restClient, userUniqueId, reqBody);
            logger.info(`[ZodiacService] [updateUser] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[ZodiacService] [updateUser] Failed`);
            throw error;
        }
    }

    static async getUserFairplayDetails(restClient: any, userUniqueId: string): Promise<UserFairplayDetails> {
        try {
            const response: UserFairplayDetailsResponse = await ZodiacClient.getUserFairplayDetails(restClient, userUniqueId);
            logger.info(`[ZodiacService] [getUserFairplayDetails] response :: ${JSON.stringify(response)}`);
            const fairplayDetails: UserFairplayDetails = response.fairplay_config;
            logger.info(`[ZodiacService] [getUserFairplayDetails] fairplayDetails :: ${JSON.stringify(fairplayDetails)}`);
            return fairplayDetails;
        } catch (error) {
            logger.error(error, `[ZodiacService] [getUserFairplayDetails] Failed`);
            throw error;
        }
    }

    static async getTicketApplicableTournaments(restClient: any, ticketAmounts: number[]): Promise<any> {
        try {
            const response: any = await ZodiacClient.getTicketApplicableTournaments(restClient, ticketAmounts);
            logger.info(`[ZodiacService] [getTicketApplicableTournaments] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[ZodiacService] [getTicketApplicableTournaments] Failed`);
            throw error;
        }
    }

    static async getUserCashGames(restClient: any, userId: number): Promise<any> {
        try {
            const response: any = await ZodiacClient.getUserCashGames(restClient, userId);
            logger.info(`[ZodiacService] [getUserCashGames] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[ZodiacService] [getUserCashGames] Failed`);
            throw error;
        }
    }

    static async getUserMigrationInfo(restClient: any, userUniqueId: string): Promise<User> {
        try {
            const response: any = await ZodiacClient.getUserMigrationInfo(restClient, userUniqueId);
            logger.info(`[ZodiacService] [getUserMigrationInfo] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[ZodiacService] [getUserMigrationInfo] Failed`);
            throw error;
        }
    }

    static async getRecommendedRooms(restClient: any, userId: number, requestBody: GetRecommendedRoomsRequest): Promise<Room[]> {
        try {
            const response: any = await ZodiacClient.getRecommendedRooms(restClient, userId, requestBody, 10000);
            logger.info(`[ZodiacService] [getRecommendedRooms] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[ZodiacService] [getRecommendedRooms] Failed`);
            throw error;
        }
    }

    static async getRecommendedGroups(restClient: any, userId: number, requestBody: GetRecommendedGroupsRequest): Promise<any> {
        try {
            const response: any = await ZodiacClient.getRecommendedGroups(restClient, userId, requestBody);
            logger.info(`[ZodiacService] [getRecommendedGroups] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            return requestBody.activeRoomsInfo.slice(0, 2);
            logger.error(error, `[ZodiacService] [getRecommendedGroups] Failed`);
            throw error;
        }
    }

    static async getUserLeaderboardTotalWinnings(restClient: any, userId: number): Promise<ZodiacUserLeaderboardTotalWinning> {
        try {
            const response: ZodiacUserLeaderboardTotalWinning| undefined = await ZodiacClient.getUserLeaderboardTotalWinnings(restClient, userId,);
            logger.info(`[ZodiacService] [getUserLeaderboardTotalWinnings] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[ZodiacService] [getUserLeaderboardTotalWinnings] Failed`);
            throw error;
        }
    }

    static async getBulkUserGameplaySettings(restClient: any, bulkSettingsRequest: BulkUserGameplaySettingsRequest): Promise<UserGameplaySettingsResponse[]>{
        try {
          const response: UserGameplaySettingsResponse[] = await ZodiacClient.getUsersTournamentSettingsInfoBulk(restClient, bulkSettingsRequest)
          logger.info(`[ZodiacService] [getBulkUserGameplaySettings]  response: ${JSON.stringify(response)}`);
          return response
        } catch (error){
          logger.error(`[ZodiacService] [getBulkUserGameplaySettings]  error: ${JSON.stringify(error)}`);
          throw(error)
        }
      }

    static async getUserPslStats(restClient: any, userId: number): Promise<any> {
        try {
            const response: UserPslStats = await ZodiacClient.getUserPslStats(restClient, userId);
            logger.info(`[ZodiacService] [getUserPslStats] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[ZodiacService] [getUserPslStats] Failed`);
            throw error;
        }
    }

    static async claimUserPslTicket(restClient: any, userId: number): Promise<any> {
        try {
            const userPslStats: UserPslStats = await ZodiacClient.claimUserPslTicket(restClient, userId);
            logger.info(`[ZodiacService] [claimUserPslTicket] userPslStats :: ${JSON.stringify(userPslStats)}`);
            const response = ZodiacUtil.getUserClaimPslTickerResponse(userPslStats)
            return response;
        } catch (error) {
            logger.error(error, `[ZodiacService] [claimUserPslTicket] Failed`);
            throw error;
        }
    }

    static async updateUserPslStats(restClient: any, userId: number, request: UserPslStats): Promise<any> {
        try {
            logger.info(`[ZodiacService] [updateUserPslStats] request :: ${JSON.stringify(request)}`);
            const response: any = await ZodiacClient.updateUserPslStats(restClient, userId, request);
            logger.info(`[ZodiacService] [updateUserPslStats] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[ZodiacService] [updateUserPslStats] Failed`);
            throw error;
        }
    }
}
