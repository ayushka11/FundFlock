
import AriesTournamentClient from "../clients/ariesTournamentClient";
import { UpdateBetSettingsResponse } from "../models/aries/update-bet-settings";
import { TournamentTableIdResponse } from "../models/tournament/response/tournament-tableid-response";
import { UpdateUserBetSettingsPayload } from "../models/zodiac/gameplay";
import LoggerUtil, { ILogger } from "../utils/logger";

const logger: ILogger = LoggerUtil.get("AriesTournamentService");

export class AriesTournamentService {

    static async getTournamentObserverTableId(restClient: any,tournamentId: number , userId: number): Promise<number> {
        try {
            logger.info(`[AriesTournamentService] [getTournamentObserverTableId] userId :: ${userId} tournamentId :: ${tournamentId}`);
            const response: TournamentTableIdResponse = await AriesTournamentClient.getTournamentObserverTableId(restClient,tournamentId,userId);
            logger.info(`[AriesTournamentService] [getTournamentObserverTableId] AriesResponse ${JSON.stringify(response)}`)

            return response.tableId;
        } catch (error) {
            logger.error(error, `[getTournamentObserverTableId] error `)
            throw AriesTournamentClient.wrapError(error);
        }
    }

    static async updateUserBetSettingsTournament(restClient: any, userId: string, request: UpdateUserBetSettingsPayload): Promise<any> {
        try {
            const response: UpdateBetSettingsResponse = await AriesTournamentClient.updateUserBetSettingsTournament(restClient, userId, request);
            logger.info(`[AriesService] [updateUserBetSettingsTournament] response :: ${JSON.stringify(response)}`);
            return response;
        } catch (error) {
            logger.error(error, `[AriesService] [updateUserBetSettingsTournament] Failed`);
            throw error;
        }
    }

}