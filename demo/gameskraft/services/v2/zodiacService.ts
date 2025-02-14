import ZodiacClient from '../../clients/v2/zodiacClient';
import LoggerUtil, { ILogger } from '../../utils/logger';
import { AriesService } from '../ariesService';
import IDMService from '../idmService';

const logger: ILogger = LoggerUtil.get("ZodiacServiceV2");

export default class ZodiacService {

    static async getUserHandsListByTableId(restClient: any, userId: number, tableId: number) {
        try {
            logger.info(`[ZodiacService] [getUserHandsListByTableId] userId :: ${userId} tableId :: ${tableId}`);
            const playerDetailsResponse = await AriesService.getPlayerDetails(restClient, `${userId}`, tableId);
            logger.info(`[ZodiacService] [getUserHandsListByTableId] userId :: ${userId} tableId :: ${tableId} playerDetailsResponse :: ${JSON.stringify(playerDetailsResponse)}`);
            const response = await ZodiacClient.getUserHandsListBySessionId(restClient, playerDetailsResponse?.playerGameSessionId);
            logger.info(`[ZodiacService] [getUserHandsListByTableId] userId :: ${userId} tableId :: ${tableId} response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[ZodiacService] [getUserHandsListByTableId] userId :: ${userId} tableId :: ${tableId} Error :: `);
            throw error;
        }
    }

    static async getUserHandDetailsByHandId(restClient: any, userId: number, handId: string, tableId: number) {
        try {
            logger.info(`[ZodiacService] [getUserHandDetailsByHandId] userId :: ${userId} tableId :: ${tableId} handId :: ${handId}`);
            const response = await ZodiacClient.getUserHandDetailsByHandId(restClient, userId, handId, tableId);
            logger.info(`[ZodiacService] [getUserHandDetailsByHandId] userId :: ${userId} tableId :: ${tableId} handId :: ${handId} Response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(`[ZodiacService] [getUserHandDetailsByHandId] userId :: ${userId} tableId :: ${tableId} handId :: ${handId} Error :: ${error}`);
            throw error;
        }
    }

    static async getUserHandSummaryByHandId(restClient: any, userId: number, handId: string, tableId: number, vendorId: string) {
        try {
            logger.info(`[ZodiacService] [getUserHandSummaryByHandId] userId :: ${userId} tableId :: ${tableId} handId :: ${handId}`);
            const userHandSummaryResponse = await ZodiacClient.getUserHandSummaryByHandId(restClient, userId, handId, tableId);
            logger.info(`[ZodiacService] [getUserHandSummaryByHandId] userId :: ${userId} tableId :: ${tableId} handId :: ${handId} userHandSummaryResponse :: ${JSON.stringify(userHandSummaryResponse)}`);
            //  update each player avatar in playerHandSummary
            await Promise.all(
                Object.values(userHandSummaryResponse.playersHandSummary).map(async (player: any) => {
                    if (player.playerId === -1) {
                        return; // ignore empty seats
                    }

                    const userProfile = await IDMService.getUserDetails(restClient, player.playerId.toString(), player.vendorId.toString());

                    player.playerAvatar = userProfile.displayPicture ?? "";
                })
            );
            logger.info(`[ZodiacService] [getUserHandSummaryByHandId] userId :: ${userId} tableId :: ${tableId} handId :: ${handId} userDetails :: ${JSON.stringify(userHandSummaryResponse)}`);
            return userHandSummaryResponse;
        } catch (error) {
            logger.error(`[ZodiacService] [getUserHandSummaryByHandId] userId :: ${userId} tableId :: ${tableId} handId :: ${handId} Error :: ${error}`);
            throw error;
        }
    }

    static async getUserPracticeHandsListByTableId(restClient: any, userId: number, tableId: number) {
        try {
            logger.info(`[ZodiacService] [getUserPracticeHandsListByTableId] userId :: ${userId} tableId :: ${tableId}`);
            const playerDetailsResponse = await AriesService.getPlayerDetails(restClient, `${userId}`, tableId);
            logger.info(`[ZodiacService] [getUserPracticeHandsListByTableId] userId :: ${userId} tableId :: ${tableId} playerDetailsResponse :: ${JSON.stringify(playerDetailsResponse)}`);
            const response = await ZodiacClient.getUserPracticeHandsListBySessionId(restClient, playerDetailsResponse?.playerGameSessionId);
            logger.info(`[ZodiacService] [getUserPracticeHandsListByTableId] userId :: ${userId} tableId :: ${tableId} response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[ZodiacService] [getUserPracticeHandsListByTableId] userId :: ${userId} tableId :: ${tableId} Error :: `);
            throw error;
        }
    }

    static async getUserPracticeHandDetailsByHandId(restClient: any, userId: number, handId: string, tableId: number) {
        try {
            logger.info(`[ZodiacService] [getUserPracticeHandDetailsByHandId] userId :: ${userId} tableId :: ${tableId} handId :: ${handId}`);
            const response = await ZodiacClient.getUserPracticeHandDetailsByHandId(restClient, userId, handId, tableId);
            logger.info(`[ZodiacService] [getUserPracticeHandDetailsByHandId] userId :: ${userId} tableId :: ${tableId} handId :: ${handId} Response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(`[ZodiacService] [getUserPracticeHandDetailsByHandId] userId :: ${userId} tableId :: ${tableId} handId :: ${handId} Error :: ${error}`);
            throw error;
        }
    }

    static async getUserPracticeHandSummaryByHandId(restClient: any, userId: number, handId: string, tableId: number, vendorId: string) {
        try {
            logger.info(`[ZodiacService] [getUserPracticeHandSummaryByHandId] userId :: ${userId} tableId :: ${tableId} handId :: ${handId}`);
            const userHandSummaryResponse = await ZodiacClient.getUserPracticeHandSummaryByHandId(restClient, userId, handId, tableId);
            logger.info(`[ZodiacService] [getUserPracticeHandSummaryByHandId] userId :: ${userId} tableId :: ${tableId} handId :: ${handId} userHandSummaryResponse :: ${JSON.stringify(userHandSummaryResponse)}`);
            //  update each player avatar in playerHandSummary
            await Promise.all(
                Object.values(userHandSummaryResponse.playersHandSummary).map(async (player: any) => {
                    if (player.playerId === -1) {
                        return; // ignore empty seats
                    }

                    const userProfile = await IDMService.getUserDetails(restClient, player.playerId.toString(), player.vendorId.toString());

                    player.playerAvatar = userProfile.displayPicture ?? "";
                })
            );
            logger.info(`[ZodiacService] [getUserPracticeHandSummaryByHandId] userId :: ${userId} tableId :: ${tableId} handId :: ${handId} userDetails :: ${JSON.stringify(userHandSummaryResponse)}`);
            return userHandSummaryResponse;
        } catch (error) {
            logger.error(`[ZodiacService] [getUserPracticeHandSummaryByHandId] userId :: ${userId} tableId :: ${tableId} handId :: ${handId} Error :: ${error}`);
            throw error;
        }
    }

    static async getUserTournamentHandsListByTournamentId(restClient: any, userId: number, tournamentId: number) {
        try {
            logger.info(`[ZodiacService] [getUserTournamentHandsListByTournamentId] userId :: ${userId} tournamentId :: ${tournamentId}`);
            // const playerDetailsResponse = await AriesService.getPlayerDetails(restClient, `${userId}`, tournamentId);
            // logger.info(`[ZodiacService] [getUserTournamentHandsListByTournamentId] userId :: ${userId} tournamentId :: ${tournamentId} playerDetailsResponse :: ${JSON.stringify(playerDetailsResponse)}`);
            const response = await ZodiacClient.getUserTournamentHandsListByTournamentId(restClient, userId, tournamentId);
            logger.info(`[ZodiacService] [getUserTournamentHandsListByTournamentId] userId :: ${userId} tournamentId :: ${tournamentId} response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[ZodiacService] [getUserTournamentHandsListByTournamentId] userId :: ${userId} tournamentId :: ${tournamentId} Error :: `);
            throw error;
        }
    }

    static async getUserTournamentHandDetailsByHandId(restClient: any, userId: number, handId: string, tournamentId: number) {
        try {
            logger.info(`[ZodiacService] [getUserTournamentHandDetailsByHandId] userId :: ${userId} tournamentId :: ${tournamentId} handId :: ${handId}`);
            const response = await ZodiacClient.getUserTournamentHandDetailsByHandId(restClient, userId, handId, tournamentId);
            logger.info(`[ZodiacService] [getUserTournamentHandDetailsByHandId] userId :: ${userId} tournamentId :: ${tournamentId} handId :: ${handId} Response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(`[ZodiacService] [getUserTournamentHandDetailsByHandId] userId :: ${userId} tournamentId :: ${tournamentId} handId :: ${handId} Error :: ${error}`);
            throw error;
        }
    }

    static async getUserTournamentHandSummaryByHandId(restClient: any, userId: number, handId: string, tournamentId: number, vendorId: string) {
        try {
            logger.info(`[ZodiacService] [getUserTournamentHandSummaryByHandId] userId :: ${userId} tournamentId :: ${tournamentId} handId :: ${handId}`);
            const userHandSummaryResponse = await ZodiacClient.getUserTournamentHandSummaryByHandId(restClient, userId, handId, tournamentId);
            logger.info(`[ZodiacService] [getUserTournamentHandSummaryByHandId] userId :: ${userId} tournamentId :: ${tournamentId} handId :: ${handId} userHandSummaryResponse :: ${JSON.stringify(userHandSummaryResponse)}`);
            //  update each player avatar in playerHandSummary
            await Promise.all(
                Object.values(userHandSummaryResponse.playersHandSummary).map(async (player: any) => {
                    if (player.playerId === -1) {
                        return; // ignore empty seats
                    }

                    const userProfile = await IDMService.getUserDetails(restClient, player.playerId.toString(), player.vendorId.toString());

                    player.playerAvatar = userProfile.displayPicture ?? "";
                })
            );
            logger.info(`[ZodiacService] [getUserTournamentHandSummaryByHandId] userId :: ${userId} tournamentId :: ${tournamentId} handId :: ${handId} userDetails :: ${JSON.stringify(userHandSummaryResponse)}`);
            return userHandSummaryResponse;
        } catch (error) {
            logger.error(`[ZodiacService] [getUserTournamentHandSummaryByHandId] userId :: ${userId} tournamentId :: ${tournamentId} handId :: ${handId} Error :: ${error}`);
            throw error;
        }
    }

};
