import LoggerUtil, { ILogger } from "../utils/logger";
import ZodiacService from "./zodiacService";
import { UserPslStats } from "../models/zodiac/user-psl-stats";
import { getPslConfigForVendor } from "./configService";
import LeaderboardService from "./leaderboardService";

const logger: ILogger = LoggerUtil.get("PslService");

export default class PslService {
    static async getPslHomeWidgetData(restClient: any, userId: number, vendorId: string): Promise<any> {
        try {
            logger.info(`[getPslHomeWidgetData] userId :: ${userId}`);

            const isPslEnabled = PslService.getPslEnableStatus(userId, vendorId);
            if (!isPslEnabled) {
                return {};
            }
            const userPslStats: UserPslStats = await PslService.getUserPslStats(restClient, userId);

            const currentHomeState = getPslConfigForVendor()[vendorId].currentHomeState;
            let stateData = {}
            if (userPslStats?.isTicketClaimed !== true) {
                stateData = {
                    videoUrl: getPslConfigForVendor()[vendorId].states[1].homeVideoUrl
                }
            }
            else if (currentHomeState === 2 && userPslStats?.isTicketClaimed === true) {
                let userRank;
                if (userPslStats?.playedTournamentIds && userPslStats?.playedTournamentIds.length > 0) {
                    userRank = await PslService.getUserPslLeaderboardRank(restClient, userId, vendorId);
                }
                stateData = {
                    isLive: getPslConfigForVendor()[vendorId].states[2].isLive,
                    isEnded: getPslConfigForVendor()[vendorId].states[2].isEnded,
                    isActive: userPslStats?.isTicketClaimed || (!userPslStats?.isTicketClaimed && getPslConfigForVendor()[vendorId].states[2].isLive),
                    registeredTournamentCount: (userPslStats?.registeredTournamentIds || []).length || 0,
                    maxRegisteredTournaments: getPslConfigForVendor()[vendorId].maxRegisteredTournaments || 0,
                    showRegisterButton: userPslStats?.isTicketClaimed,
                    enableRegisterButton: userPslStats?.isTicketClaimed || false,
                    playedTournamentCount: (userPslStats?.playedTournamentIds || []).length || 0,
                    maxPlayedTournaments: getPslConfigForVendor()[vendorId].maxPlayedTournaments || 0,
                    showPlayButton: getPslConfigForVendor()[vendorId].states[2].isLive,
                    showLeaderboardButton: ((userPslStats?.playedTournamentIds || []).length > 0) && getPslConfigForVendor()[vendorId].states[2].isLive,
                    userRank: userRank,
                    dateText: getPslConfigForVendor()[vendorId].states[2].isEnded ? getPslConfigForVendor()[vendorId].states[2].endedText : ((userPslStats?.playedTournamentIds || []).length > 0 ? getPslConfigForVendor()[vendorId].states[2].playedDateText : getPslConfigForVendor()[vendorId].states[2].notPlayedDateText),
                    isQualified: getPslConfigForVendor()[vendorId].states[2].qualifiedRank <= userRank,
                }
            }
            else if (currentHomeState === 3) {
                stateData = {
                    isLive: getPslConfigForVendor()[vendorId].states[3].isLive,
                    isEnded: getPslConfigForVendor()[vendorId].states[3].isEnded,
                    isActive: getPslConfigForVendor()[vendorId].states[3].isActive,
                    dateText: getPslConfigForVendor()[vendorId].states[3].dateText,
                    winnersButtonText: getPslConfigForVendor()[vendorId].states[3].winnersButtonText,
                    isQualified: getPslConfigForVendor()[vendorId].states[3].selectedUsers.includes(userId),
                }
            }
            else if (currentHomeState === 4) {
                stateData = {
                    isLive: getPslConfigForVendor()[vendorId].states[4].isLive,
                    isEnded: getPslConfigForVendor()[vendorId].states[4].isEnded,
                    isActive: getPslConfigForVendor()[vendorId].states[4].isActive,
                    dateText: getPslConfigForVendor()[vendorId].states[4].dateText,
                    isQualified: getPslConfigForVendor()[vendorId].states[4].selectedUsers.includes(userId),
                }
            }
            else if (currentHomeState === 5) {
                stateData = {
                    isLive: getPslConfigForVendor()[vendorId].states[5].isLive,
                    isEnded: getPslConfigForVendor()[vendorId].states[5].isEnded,
                    isActive: getPslConfigForVendor()[vendorId].states[5].isActive,
                    dateText: getPslConfigForVendor()[vendorId].states[5].dateText,
                    isQualified: getPslConfigForVendor()[vendorId].states[5].selectedUsers.includes(userId),
                }
            }

            const pslHomeWidgetData = {
                isPslEnabled: isPslEnabled,
                isTicketClaimed: userPslStats?.isTicketClaimed || false,
                currentHomeState: currentHomeState,
                stateData: stateData
            };
            logger.info(`[getPslHomeWidgetData] pslHomeWidgetData :: ${JSON.stringify(pslHomeWidgetData)}`);
            return pslHomeWidgetData;
        } catch (e) {
            logger.error(e, `[getPslHomeWidgetData] Failed `);
            throw e;
        }
    }

    static async getPslInfoPageData(restClient: any, userId: number, vendorId: string): Promise<any> {
        try {
            logger.info(`[getPslInfoPageData] userId :: ${userId}`);

            const isPslEnabled = PslService.getPslEnableStatus(userId, vendorId);
            if (!isPslEnabled) {
                return {
                    isPslEnabled: false
                }
            }
            const userPslStats: UserPslStats = await PslService.getUserPslStats(restClient, userId);
            let userRank;
            if ((userPslStats?.playedTournamentIds || []).length > 0) {
                userRank = await PslService.getUserPslLeaderboardRank(restClient, userId, vendorId);
            }

            const statesData = {
                1: {
                    isLive: getPslConfigForVendor()[vendorId].states[1].isLive,
                    isEnded: getPslConfigForVendor()[vendorId].states[1].isEnded,
                    isClaimed: userPslStats?.isTicketClaimed || false,
                    dateText: getPslConfigForVendor()[vendorId].states[1].dateText
                },
                2: {
                    isLive: getPslConfigForVendor()[vendorId].states[2].isLive,
                    isEnded: getPslConfigForVendor()[vendorId].states[2].isEnded,
                    isActive: userPslStats?.isTicketClaimed || (!userPslStats?.isTicketClaimed && getPslConfigForVendor()[vendorId].states[2].isLive),
                    registeredTournamentCount: (userPslStats?.registeredTournamentIds || []).length || 0,
                    maxRegisteredTournaments: getPslConfigForVendor()[vendorId].maxRegisteredTournaments || 0,
                    showRegisterButton: userPslStats?.isTicketClaimed,
                    enableRegisterButton: userPslStats?.isTicketClaimed || false,
                    playedTournamentCount: (userPslStats?.playedTournamentIds || []).length || 0,
                    maxPlayedTournaments: getPslConfigForVendor()[vendorId].maxPlayedTournaments || 0,
                    showPlayButton: getPslConfigForVendor()[vendorId].states[2].isLive,
                    showLeaderboardButton: ((userPslStats?.playedTournamentIds || []).length > 0) && getPslConfigForVendor()[vendorId].states[2].isLive,
                    userRank: userRank,
                    dateText: getPslConfigForVendor()[vendorId].states[2].isEnded ? getPslConfigForVendor()[vendorId].states[2].endedText : ((userPslStats?.playedTournamentIds || []).length > 0 ? getPslConfigForVendor()[vendorId].states[2].playedDateText : getPslConfigForVendor()[vendorId].states[2].notPlayedDateText),
                    isQualified: getPslConfigForVendor()[vendorId].states[2].qualifiedRank <= userRank,
                },
                3: {
                    isLive: getPslConfigForVendor()[vendorId].states[3].isLive,
                    isEnded: getPslConfigForVendor()[vendorId].states[3].isEnded,
                    isActive: getPslConfigForVendor()[vendorId].states[3].isActive,
                    dateText: getPslConfigForVendor()[vendorId].states[3].dateText,
                    winnersButtonText: getPslConfigForVendor()[vendorId].states[3].winnersButtonText,
                    isQualified: getPslConfigForVendor()[vendorId].states[3].selectedUsers.includes(userId),
                },
                4: {
                    isLive: getPslConfigForVendor()[vendorId].states[4].isLive,
                    isEnded: getPslConfigForVendor()[vendorId].states[4].isEnded,
                    isActive: getPslConfigForVendor()[vendorId].states[4].isActive,
                    dateText: getPslConfigForVendor()[vendorId].states[4].dateText,
                    isQualified: getPslConfigForVendor()[vendorId].states[4].selectedUsers.includes(userId),
                },
                5: {
                    isLive: getPslConfigForVendor()[vendorId].states[5].isLive,
                    isEnded: getPslConfigForVendor()[vendorId].states[5].isEnded,
                    isActive: getPslConfigForVendor()[vendorId].states[5].isActive,
                    dateText: getPslConfigForVendor()[vendorId].states[5].dateText,
                    isQualified: getPslConfigForVendor()[vendorId].states[5].selectedUsers.includes(userId),
                }

            };
            const pslInfoPageData = {
                isPslEnabled: isPslEnabled,
                states: statesData,
                winners: getPslConfigForVendor()[vendorId].winners,
                pslHandBookUrl: getPslConfigForVendor()[vendorId].pslHandBookUrl,
                faq: getPslConfigForVendor()[vendorId].faq,
            }
            logger.info(`[getPslInfoPageData] pslInfoPageData :: ${JSON.stringify(pslInfoPageData)}`);
            return pslInfoPageData;
        } catch (e) {
            logger.error(e, `[getPslInfoPageData] Failed `);
            throw e;
        }
    }

    static async getPslScheduleData(restClient: any, userId: number, vendorId: string): Promise<any> {
        try {
            logger.info(`[getPslScheduleData] userId :: ${userId}`);
            const pslScheduleData = getPslConfigForVendor()[vendorId].schedule;
            logger.info(`[getPslScheduleData] pslScheduleData :: ${JSON.stringify(pslScheduleData)}`);
            return pslScheduleData;
        } catch (e) {
            logger.error(e, `[getPslScheduleData] Failed `);
            throw e;
        }
    }

    static async getPslLeaderboardData(restClient: any, userId: number, vendorId: string): Promise<any> {
        try {
            logger.info(`[getPslLeaderboardData] userId :: ${userId}`);
            const isLeaderboardActive = getPslConfigForVendor()[vendorId].leaderboard.isActive;
            const isLeaderboardInProgress = getPslConfigForVendor()[vendorId].leaderboard.inProgress;
            let data = {};
            const leaderboardDataRequest = {
                lbGroupId: getPslConfigForVendor()[vendorId].leaderboard.leaderboardGroupId,
                lbChildId: getPslConfigForVendor()[vendorId].leaderboard.childLeaderboardId,
                lbCampaignTag: getPslConfigForVendor()[vendorId].leaderboard.leaderboardCampaignTag,
                vendorId: vendorId
            }
            logger.info(`[getPslLeaderboardData] leaderboardDataRequest :: ${JSON.stringify(leaderboardDataRequest)}`);
            if (isLeaderboardActive && !isLeaderboardInProgress) {
                data = await LeaderboardService.getChildLeaderboardDetailsFromId(restClient, userId, leaderboardDataRequest);
            }
            const pslLeaderboardData = {
                isLeaderboardActive: isLeaderboardActive,
                isLeaderboardInProgress: isLeaderboardInProgress,
                data: data
            }
            logger.info(`[getPslLeaderboardData] pslLeaderboardData :: ${JSON.stringify(pslLeaderboardData)}`);
            return pslLeaderboardData;
        } catch (e) {
            logger.error(e, `[getPslLeaderboardData] Failed `);
            throw e;
        }
    }

    static async getUserPslLeaderboardRank(restClient: any, userId: number, vendorId: string): Promise<number | undefined> {
        try {
            logger.info(`[getUserPslLeaderboardRank] userId :: ${userId}`);
            const leaderboardDataRequest = {
                lbGroupId: getPslConfigForVendor()[vendorId].leaderboard.leaderboardGroupId,
                lbChildId: getPslConfigForVendor()[vendorId].leaderboard.childLeaderboardId,
                lbCampaignTag: getPslConfigForVendor()[vendorId].leaderboard.leaderboardCampaignTag,
                vendorId: vendorId
            }
            const leaderboardDetails = await LeaderboardService.getChildLeaderboardDetailsFromId(restClient, userId, leaderboardDataRequest);
            const userRank = leaderboardDetails?.userRanksScoreboard?.rank;
            return userRank;
        } catch (e) {
            logger.error(e, `[getUserPslLeaderboardRank] Failed `);
            return;
        }
    }

    static async claimPslTicket(restClient: any, userId: number, vendorId: string): Promise<any> {
        try {
            logger.info(`[claimPslTicket] userId :: ${userId}`);
            const resp = await ZodiacService.claimUserPslTicket(restClient, userId);
            return resp;
        } catch (e) {
            logger.error(e, `[claimPslTicket] Failed `);
            throw e;
        }
    }

    static async getUserPslTicketClaimStatus(restClient: any, userId: number, vendorId: string): Promise<any> {
        try {
            logger.info(`[getUserPslTicketClaimStatus] userId :: ${userId}`);
            const userPslStats: UserPslStats = await PslService.getUserPslStats(restClient, userId);
            return {
                isTicketClaimed: userPslStats?.isTicketClaimed || false
            }
        } catch (e) {
            logger.error(e, `[getUserPslTicketClaimStatus] Failed `);
            throw e;
        }
    }

    static getPslEnableStatus(userId: number, vendorId: string): boolean {
        try {
            logger.info(`[getPslEnableStatus] userId :: ${userId} vendorId :: ${vendorId}`);
            return getPslConfigForVendor()[vendorId]?.isEnabled || (getPslConfigForVendor()[vendorId]?.testUsers || []).includes(userId);
        } catch (e) {
            logger.error(e, `[getPslEnableStatus] Failed `);
            throw e;
        }
    }

    static async getUserPslStats(restClient: any, userId: number): Promise<UserPslStats> {
        try {
            logger.info(`[getUserPslStats] userId :: ${userId}`);
            return await ZodiacService.getUserPslStats(restClient, userId);
        } catch (e) {
            logger.error(e, `[getUserPslStats] Failed `);
            return {};
        }
    }

    static async updateUserPslStatsOnRegistration(restClient: any, userId: number, tournamentId: number, userPslStats: UserPslStats): Promise<UserPslStats> {
        try {
            logger.info(`[updatePslStatsOnRegistration] userId :: ${userId}, tournamentId :: ${tournamentId}`);
            const registeredTournamentIds = userPslStats.registeredTournamentIds || [];
            if (!registeredTournamentIds.includes(tournamentId)) {
                registeredTournamentIds.push(tournamentId);
            }
            userPslStats.registeredTournamentIds = registeredTournamentIds;
            const response: UserPslStats = await ZodiacService.updateUserPslStats(restClient, userId, userPslStats);
            return response;
        } catch (e) {
            logger.error(e, `[updatePslStatsOnRegistration] Failed `);
            throw e;
        }
    }

    static async updateUserPslStatsOnUnRegistration(restClient: any, userId: number, tournamentId: number): Promise<UserPslStats> {
        try {
            logger.info(`[updateUserPslStatsOnUnRegistration] userId :: ${userId}, tournamentId :: ${tournamentId}`);
            const userPslStats: UserPslStats = await PslService.getUserPslStats(restClient, userId);
            const registeredTournamentIds = userPslStats.registeredTournamentIds || [];
            // Remove the tournamentId from the registeredTournamentIds array
            const index = registeredTournamentIds.indexOf(tournamentId);
            if (index > -1) {
                registeredTournamentIds.splice(index, 1);
            }
            userPslStats.registeredTournamentIds = registeredTournamentIds;
            const response: UserPslStats = await ZodiacService.updateUserPslStats(restClient, userId, userPslStats);
            return response;
        } catch (e) {
            logger.error(e, `[updateUserPslStatsOnUnRegistration] Failed `);
            throw e;
        }
    }
}
