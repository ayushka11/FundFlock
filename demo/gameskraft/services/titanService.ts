import TitanClient from '../clients/titanClient';
import AriesServiceErrorUtil from '../errors/aries/aries-error-util';
import { IDMUserProfile } from '../models/idm/user-idm';
import LoggerUtil, { ILogger } from "../utils/logger";
import TitanUtil from "../utils/titan-util";
import IDMService from "./idmService";
import IdmUtil from '../utils/idm-utils';
import { Tournament } from "../models/tournament";
import TitanTournamentResponse from "../models/tournament/response/tournament-response";
import TournamentPlayerStatusResponse, {
  UserTournamentTableDetails
} from "../models/tournament/response/tournament-player-status-response";
import ActiveTablesResponse from "../models/tournament/response/active-tables-response"
import TournamentPlayerStatusRequest from "../models/tournament/request/tournament-player-status-request"
import { PlayerMTTList } from "../models/player-mtt-list";
import TitanTournamentEntryRequest, {UserIdsDetailsForFraudChecks} from "../models/tournament/request/tournament-entry-request"
import { PlayerTournamentRegisterRequest } from "../models/request/player-tournament-register-request"


import { TournamentResponseV3 } from "../models/game-server/mtt-list";
import TournamentLeaderboardResponse from "../models/tournament/response/tournament-leaderboard-response";
import { PlayerTournamentStatus } from '../models/enums/tournament/player-tournament-status';
import { TournamentUserDetailResponse } from '../models/tournament/response/tournament-user-detail-response';
import TitanServiceErrorUtil from "../errors/titan/titan-error-util";
import AriesClient from "../clients/ariesClient";
import AriesTournamentClient from "../clients/ariesTournamentClient";
import { ALLOWED_VENDOR_IDS } from '../constants/idm-constants';
import AriesTournamentType from "../models/tournament/enums/aries-tournament-type";
import { UserPslStats } from "../models/zodiac/user-psl-stats";
import PslService from "./pslService";
import ZodiacServiceErrorUtil from "../errors/zodiac/zodiac-error-util";
import Constants from "connection-manager/lib/constants/constants";
import { MIGRATED_TOURNAMENT_ID } from "../constants/constants";
import { getPslConfigForVendor } from "./configService";

const ApiCacheHelper = require('../helpers/apiCacheHelper');

const logger: ILogger = LoggerUtil.get("TitanService");


export class TitanService {

    static async getTournaments(restClient: any, vendorId: number): Promise<Tournament[]> {
        try {
            const response: Array<TitanTournamentResponse> = await ApiCacheHelper.getTitanTournamentsFromCache(restClient);
            logger.info(`[getTournaments] Titan  response ${JSON.stringify(response)}`)
            const filteredTournaments: Array<TitanTournamentResponse> = TitanUtil.filterTournamentsByVendor(response, vendorId);
            logger.info(`[getTournaments] Titan  filteredTournaments ${JSON.stringify(filteredTournaments)}`)
            const tournaments: Tournament[] = TitanUtil.convertTournamentResponse(filteredTournaments, vendorId);
            return tournaments;
        } catch (error) {
            logger.error(error, `[getTournaments] Error`);
            throw TitanClient.wrapError(error);
        }
    }

    static async getFeaturedTournaments(restClient: any, vendorId: number, isMigratedTournament: boolean): Promise<TournamentResponseV3[]> {
        try {
            const response: Array<TitanTournamentResponse> = await ApiCacheHelper.getTitanTournamentsFromCache(restClient);
            logger.info(`[getTournaments] Titan  response ${JSON.stringify(response)}`)
            const filteredTournaments: Array<TitanTournamentResponse> = TitanUtil.filterTournamentsByVendor(response, vendorId);
            logger.info(`[getTournaments] Titan  filteredTournaments ${JSON.stringify(filteredTournaments)}`)
            const tournaments: TournamentResponseV3[] = TitanUtil.convertFeaturedTournamentResponse(filteredTournaments, vendorId, isMigratedTournament);
            logger.info(`[getTournaments] Titan  tournaments ${JSON.stringify(tournaments)}`)
            return tournaments;
        } catch (error) {
            logger.error(error, `[getTournaments] Error`);
            throw TitanClient.wrapError(error);
        }
    }


    static async getActiveTournamentIds(restClient: any): Promise<number[]> {
        try {
            const tournamentIds: Array<number> = await TitanClient.getActiveTournamentIds(restClient);
            logger.info(`[getTournaments] Titan  response ${JSON.stringify(tournamentIds)}`)
            return tournamentIds;
        } catch (error) {
            logger.error(error, `[getTournaments] Error`);
            throw TitanClient.wrapError(error);
        }
    }

  static async getPlayerMTTList(restClient: any, userId: number, vendorId: number): Promise<PlayerMTTList> {
    try {
      //get tournamentIds list from cached tournaments
      const titanTournamentResponse: Array<TitanTournamentResponse> = await ApiCacheHelper.getTitanTournamentsFromCache(restClient);
      const tournamentIds = TitanUtil.extractIdsFromTournaments(titanTournamentResponse);
      const request: TournamentPlayerStatusRequest = {
        userId,
        vendorId,
        tournamentIds
      }
      logger.info(`[TitanService
     ] [getPlayerDetails] request :: ${request}`);
      const response: TournamentPlayerStatusResponse = await TitanClient.getTournamentPlayerStatus(restClient, request);
      logger.info(`[TitanService
     ] [getPlayerMTTList] TitanResponse ${JSON.stringify(response)}`)
      let userTournamentTableDetails: Array<UserTournamentTableDetails> = [];
      if (response.registeredTournaments.length){
        userTournamentTableDetails = await AriesTournamentClient.getPlayerTournamentTablesDetails(restClient, userId, response.registeredTournaments);
        logger.info(`[TitanService] [getPlayerMTTList] userTournamentTableDetails ${JSON.stringify(userTournamentTableDetails)}`)
      }
      const playerMTTList: PlayerMTTList = TitanUtil.convertPlayerMTTListResponse(titanTournamentResponse, response, userTournamentTableDetails);
      return playerMTTList;
    } catch (error) {
      logger.error(error, `[getPlayerMTTList] error `)
      throw TitanClient.wrapError(error);
    }
  }

    static async getPlayerStatus(restClient: any, userId: number, vendorId: number, tournamentIds: number[]): Promise<TournamentPlayerStatusResponse> {
        try {
            const request: TournamentPlayerStatusRequest = {
                userId,
                vendorId,
                tournamentIds
            }
            logger.info(`[TitanService] [getPlayerStatus] request :: ${request}`);
            const response: TournamentPlayerStatusResponse = await TitanClient.getTournamentPlayerStatus(restClient, request);
            logger.info(`[TitanService] [getPlayerStatus] TitanResponse ${JSON.stringify(response)}`)

            return response;
        } catch (error) {
            logger.error(error, `[getPlayerStatus] error `)
            throw TitanClient.wrapError(error);
        }
    }

    static async getPlayerTournamentStatus(restClient: any, userId: number, tournamentId: number): Promise<PlayerTournamentStatus> {
        try {
            logger.info(`[TitanService] [getPlayerTournamentStatus] userId :: ${userId} tournamentId :: ${tournamentId}`);
            const response: number = await TitanClient.getPlayerTournamentStatus(restClient, userId, tournamentId);
            logger.info(`[TitanService] [getPlayerTournamentStatus] TitanResponse ${JSON.stringify(response)}`)

            return response;
        } catch (error) {
            logger.error(error, `[getPlayerTournamentStatus] error `)
            throw TitanClient.wrapError(error);
        }
    }

    static async getTournamentActiveTables(restClient: any, tournamentId: number): Promise<ActiveTablesResponse[]> {
        try {
            const response: ActiveTablesResponse[] = await TitanClient.getActiveTables(restClient, tournamentId);
            logger.info(`[getTournamentActiveTables] Titan  response ${JSON.stringify(response)}`)
            return response;
        } catch (error) {
            logger.error(error, `[getTournamentActiveTables] Error`);
            throw TitanClient.wrapError(error);
        }
    }

    static async getTournamentLeaderboard(restClient: any, tournamentId: number, userId: number): Promise<TournamentLeaderboardResponse> {
        try {
            const response: TournamentLeaderboardResponse = await TitanClient.getTournamentLeaderboard(restClient, tournamentId, userId);
            logger.info(`[getTournamentLeaderboard] Titan  response ${JSON.stringify(response)}`)
            return response;
        } catch (error) {
            logger.error(error, `[getTournamentLeaderboard] Error`);
            throw TitanClient.wrapError(error);
        }
    }

    static async findTitanTournamentById(restClient: any, tournamentId: number): Promise<TitanTournamentResponse | undefined> {
        try {
            const tournament: TitanTournamentResponse | undefined = await ApiCacheHelper.getTitanTournamentByIdFromCache(restClient, tournamentId);
            logger.info(`[findInTitanTournaments] Titan  tournament ${JSON.stringify(tournament)}`)
            return tournament;
        } catch (error) {
            logger.error(error, `[findInTitanTournaments] Error`);
            throw TitanClient.wrapError(error);
        }
    }

    static async checkMigratedTournamentId(restClient: any, tournamentId: number): Promise<boolean> {
        try {
            logger.info(`[checkMigratedTournamentId] tournamentId ${JSON.stringify(tournamentId)}`)
            if (tournamentId < MIGRATED_TOURNAMENT_ID) {
                return true;
            }
            return false;
        } catch (error) {
            logger.error(error, `[checkMigratedTournamentId] Error`);
            throw TitanClient.wrapError(error);
        }
    }

    static async registerPlayerForTournament(restClient: any, tournamentId: string, playerTournamentRegisterRequest: PlayerTournamentRegisterRequest, userId: number, vendorId: string, gstStateCode: number): Promise<any> {
        try {
            const userDetails: IDMUserProfile = await IDMService.getUserDetails(restClient, `${userId}`, vendorId);
            let isGamePlayBan: boolean = false;
            isGamePlayBan = IdmUtil.getGameplayBan(userDetails);
            if (isGamePlayBan) {
                throw AriesServiceErrorUtil.getGameplayBannedError();
            }
            const tournament: TitanTournamentResponse | undefined = await TitanService.findTitanTournamentById(restClient, Number(tournamentId));
            if (!tournament) {
                throw TitanServiceErrorUtil.getTournamentNotFoundError();
            }

            // If tournament type is psl then check if user has claimed the ticket and if user has already registered for max tournaments
            let userPslStats: UserPslStats | undefined;
            if (tournament?.tournamentType === AriesTournamentType.PSL) {
                userPslStats = await PslService.getUserPslStats(restClient, userId);
                if (!userPslStats?.isTicketClaimed) {
                    throw ZodiacServiceErrorUtil.getPslPassNotClaimed();
                }
                if(userPslStats?.registeredTournamentIds && userPslStats?.registeredTournamentIds.length >= getPslConfigForVendor()[vendorId].maxRegisteredTournaments) {
                    throw ZodiacServiceErrorUtil.getMaximumPslTournamentRegistrationLimitError();
                }
            }
            const otherVendorUsers: Array<UserIdsDetailsForFraudChecks> = await TitanService.getOtherVendorsUserWithSameMobileNumber(restClient, userDetails.mobile, vendorId);
            const titanTournamentEntryRequest: TitanTournamentEntryRequest = TitanUtil.getTournamentEntryRequest(Number(tournamentId), playerTournamentRegisterRequest, userId, Number(vendorId), userDetails?.userHandle, gstStateCode, otherVendorUsers)

            const response: any = await TitanClient.registerPlayerForTournament(restClient, titanTournamentEntryRequest);
            logger.info(`[registerPlayerForTournament] TitanResponse ${JSON.stringify(response)}`)
            // if user is registered for tournament and tournament type is psl then update the usl psl stats
            if (tournament?.tournamentType === AriesTournamentType.PSL  && userPslStats) {
                await PslService.updateUserPslStatsOnRegistration(restClient, userId, Number(tournamentId), userPslStats);
            }
            return response;
        } catch (error) {
            logger.error(error, `[registerPlayerForTournament] error `)
            throw TitanClient.wrapError(error);
        }
    }

    static async unregisterPlayerForTournament(restClient: any, tournamentId: number, userId: number, vendorId: number, gstStateCode: number): Promise<any> {
        try {
            const tournament: TitanTournamentResponse | undefined = await TitanService.findTitanTournamentById(restClient, Number(tournamentId));
            if (!tournament) {
                throw TitanServiceErrorUtil.getTournamentNotFoundError();
            }
            const request = {
                gstStateCode
            }
            const response: any = await TitanClient.unregisterPlayerForTournament(restClient, tournamentId, userId, vendorId, request);
            // if user is unregistered for tournament and tournament type is psl then update the usl psl stats
            if (tournament?.tournamentType === AriesTournamentType.PSL) {
                await PslService.updateUserPslStatsOnUnRegistration(restClient, userId, Number(tournamentId));
            }
            logger.info(`[unregisterPlayerForTournament] TitanResponse ${JSON.stringify(response)}`)
            return response;
        } catch (error) {
            logger.error(error, `[unregisterPlayerForTournament] error `)
            throw TitanClient.wrapError(error);
        }
    }


  static async getTournamentObserverDetailsByUsername(restClient: any,tournamentId: number , tournamentUserName: string): Promise<TournamentUserDetailResponse> {
    try {
        logger.info(`[TitanService] [getTournamentObserverDetailsByUsername] tournamentUserName :: ${tournamentUserName} tournamentId :: ${tournamentId}`);
        const response: TournamentUserDetailResponse = await TitanClient.getTournamentObserverDetailsByUsername(restClient,tournamentId,tournamentUserName);
        logger.info(`[TitanService] [getTournamentObserverDetailsByUsername] AriesResponse ${JSON.stringify(response)}`)

        return response;
    } catch (error) {
        logger.error(error, `[getTournamentObserverDetailsByUsername] error `)
        throw TitanClient.wrapError(error);
    }
  }

  static async getChildSattyTournaments(restClient: any, tournamentId: number): Promise<TitanTournamentResponse[]> {
    try {
      const tournament: TitanTournamentResponse[] = await ApiCacheHelper.getChildSattyTournamentfromParent(restClient, tournamentId);
      logger.info(`[getChildSattyTournaments] Titan  tournament ${JSON.stringify(tournament)}`)
      return tournament;
    } catch (error) {
      logger.error(error, `[getChildSattyTournaments] Error`);
      throw TitanClient.wrapError(error);
    }
  }

  static async getOtherVendorsUserWithSameMobileNumber(restClient: any, mobileNumber: string, requestingVendorId: string): Promise<UserIdsDetailsForFraudChecks[]>{
    const remainingVendorIds = Object.values(ALLOWED_VENDOR_IDS).filter(x => x !== Number(requestingVendorId));
    const usersDetailPromises = remainingVendorIds.map(vendorId => IDMService.getUserDetails(restClient, mobileNumber, String(vendorId)));
    const resp = await (Promise as any).allSettled(usersDetailPromises);
    const userArray = resp
        .filter(result => result.status === "fulfilled")
        .map(result => ({
            vendorId: remainingVendorIds[resp.indexOf(result)],
            userId: result?.value?.userId
        }));
    return userArray;
}

}
