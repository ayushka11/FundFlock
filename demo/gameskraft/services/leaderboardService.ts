import LeaderboardClient from '../clients/leaderboardClient';
import { CASH_APP, DEFAULT_APOLLO_SOCKET_NAMESAPACE, GMZ_VENDOR_ID, P52_VENDOR_ID } from '../constants/constants';
import { DEFAULT_LEADERBOARD_PRIZE_CURRENCY_IDENTIFIER, LEADERBOARD_CAMPAIGN_STATUS, LEADERBOARD_CAMPAIGN_STATUS_STRING, LEADERBOARD_EVENT_NAMES, LEADERBOARD_GROUP_TENET_STATUS, LEADERBOARD_SORTING_ORDER, LEADERBOARD_STATUS, LEADERBOARD_STATUS_STRING, LEADERBOARD_STATUS_STRING_MAPPING } from '../constants/leaderboard-constants';
import { CURRENCY_CODE } from '../constants/supernova-constants';
import { RoomTables } from '../models/aries/room-tables';
import { Table } from '../models/cash-table';
import { TablePlayersDetails } from '../models/cash-table-player-details';
import SocketPublishEvents from '../models/enums/socket-publish-events';
import { LeaderboardScoreUpdate, LeaderboardStartedEvent } from '../models/leaderboard/event';
import { LeaderboardChildCancellationEvent } from '../models/leaderboard/leaderboard-child-cancel-event';
import { LeaderboardGroupCancellationEvent } from '../models/leaderboard/leaderboard-group-cancel-event';
import { LeaderboardGroupCompletedEvent } from '../models/leaderboard/leaderboard-group-completed-event';
import { ChildLeaderboardSchedulingDetails, LeaderboardScheduledEvent } from '../models/leaderboard/leaderboard-schedule-event';
import LeaderboardWinningGratificationData from '../models/leaderboard/leaderboard-winning-gratification';
import { GetChildLeaderboardDetailsByIdRequest, GetLeaderboardsFromGroupsRequest } from '../models/leaderboard/request';
import LeaderboardAuroraResponse, { LeaderboardCampaign } from '../models/leaderboard/response';
import BulkSettlementEvent, { RewardMeta, UserSettlement } from '../models/leaderboard/settlement-webhook';
import UserLeaderboardTotalEarnings, { UserLeaderboardWinningBreakup, ZodiacUserLeaderboardTotalWinning } from '../models/leaderboard/total-leaderboard-earning-response';
import EventNames from '../producer/enums/eventNames';
import EventPushService from '../producer/eventPushService';
import ConnectionManagerUtil from '../utils/connection-manager/connection-manager-util';
import { DateUtil } from '../utils/date-util';
import IdmUtil from '../utils/idm-utils';
import LoggerUtil from '../utils/logger';
import Parser from '../utils/parser';
import { AriesService } from './ariesService';
import IDMService from './idmService';
import RoyaltyService from './royaltyService';
import ZodiacService from './zodiacService';

const configService = require('../services/configService');

const logger = LoggerUtil.get("LeaderboardService");

export default class LeaderboardService {
    static async handleSettlementWebhook(restClient: any, settlementData: BulkSettlementEvent): Promise<any> {
        LeaderboardService.processLeaderboardChildCompletedEvent(restClient, settlementData);
        try {
            logger.info(`[LeaderboardService.handleSettlementWebhook] settlementData:: ${JSON.stringify(settlementData)}`);
            const userSettlement: UserSettlement[] = settlementData.userSettlement;
            const rewardMeta: RewardMeta = JSON.parse(settlementData?.prizePool?.prizeStructures[0]?.rewardMeta)
            logger.info('[LeaderboardService.handleSettlementWebhook] settlementData?.prizePool?.prizeStructures[0]?.rewardMeta',rewardMeta)
            const currencyCode = rewardMeta?.currencies[0]?.currencyIdentifier || DEFAULT_LEADERBOARD_PRIZE_CURRENCY_IDENTIFIER
            for(let i=0; i<userSettlement.length; i++){
                logger.info(`[LeaderboardService.handleSettlementWebhook] userSettlement`,userSettlement[i]);
                const userId = userSettlement[i].userId;
                const vendorId = userSettlement[i].meta.vendorId

                const lbDetailsRequest: GetChildLeaderboardDetailsByIdRequest = {
                    lbChildId: settlementData.meta.childLeaderboardId,
                    lbGroupId: settlementData.meta.leaderboardId,
                    lbCampaignTag: settlementData.meta.tag,
                    vendorId
                }


                const [userDetails, isRakeBackUser, lbDetails] = await Promise.all([
                    IDMService.getUserDetails(restClient, `${userId}`, vendorId),
                    RoyaltyService.checkIfUserInRakebackDeal(restClient, userId, Number(vendorId)),
                    LeaderboardService.getChildLeaderboardDetailsFromId(restClient, Number(userId), lbDetailsRequest)
                ]) ;
                const isgameplayBan: boolean = IdmUtil.getGameplayBan(userDetails);
                const lbInfo = `${lbDetails?.gameVariants} ${lbDetails?.gameStakes} ${lbDetails.gameBlinds} - ${lbDetails.leaderboardDate} ${lbDetails.hourRange}`
                logger.info(`[LeaderboardService.handleSettlementWebhook] userId - ${userId} currencyCode - ${currencyCode}, isRakeBackUser - ${isRakeBackUser}, isgameplayBan-${isgameplayBan}`)
                const eventData = {
                    transactionId: userSettlement[i].transactionId,
                    transactionAmount: userSettlement[i].transactionAmount,
                    rank: userSettlement[i].rank,
                    score: userSettlement[i].score,
                    rewardCode: userSettlement[i].rewardCode,
                    tag: settlementData.meta.tag,
                    leaderboardId: settlementData.meta.leaderboardId,
                    childLeaderboardId: settlementData.meta.childLeaderboardId,
                    lbGroups: '',
                    categories: settlementData.meta.categories,
                    gameStakes: lbDetails.gameStakes,
                    gameBlinds: lbDetails.gameBlinds,
                    gameVariants: lbDetails.gameVariants,
                    leaderboardDate: lbDetails.leaderboardDate,
                    hourRange: lbDetails.hourRange,
                    currencyCode: currencyCode,
                    leaderboardInfo: lbInfo,
                    campaignName: lbDetails.campaignName,
                    vendorId
                }
                logger.info(`[LeaderboardService.handleSettlementWebhook] userId- ${userId} isgameplayBan-${isgameplayBan} eventData:: ${JSON.stringify(eventData)}`);
                if (isgameplayBan){
                    EventPushService.push(Number(userId), Number(vendorId),"", EventNames.LEADERBOARD_FRAUD_USER_SETTLEMENT, eventData);
                } else if (isRakeBackUser){
                    EventPushService.push(Number(userId), Number(vendorId),"", EventNames.LEADERBOARD_RAKEBACK_USER_SETTLEMENT, eventData);
                } else {
                    EventPushService.push(Number(userId), Number(vendorId),"", EventNames.LEADERBOARD_USER_SETTLEMENT, eventData);
                }
            }

        } catch (e) {
            logger.error(e,`[LeaderboardService.handleSettlementWebhook]  `);
            throw (e);
        }
        
    }

    static async processLeaderboardEvents(restClient: any, eventData): Promise<any>{
        logger.info(`[LeaderboardService.processLeaderboardEvents] eventData:: ${JSON.stringify(eventData)}`);
        const eventName: string = eventData.eventName;
        switch (eventName) {
            case LEADERBOARD_EVENT_NAMES.LEADERBOARD_CHILD_CANCEL:
                LeaderboardService.processLeaderboardChildCancelledEvent(restClient, eventData);
                return ;
            case LEADERBOARD_EVENT_NAMES.LEADERBOARD_CHILD_STARTED:
                LeaderboardService.processLeaderboardChildStartedEvent(restClient, eventData);
                return ;
            case LEADERBOARD_EVENT_NAMES.LEADERBOARD_GROUP_CANCEL:
                LeaderboardService.processLeaderboardGroupCancelledEvent(restClient, eventData);
                return ;
            case LEADERBOARD_EVENT_NAMES.LEADERBOARD_SCHEDULE:
                LeaderboardService.processLeaderboardScheduledEvent(restClient, eventData);
                LeaderboardService.sendPrizePoolDataEvent(restClient, eventData);
                return ;
            case LEADERBOARD_EVENT_NAMES.LEADERBOARD_USER_SCORE_UPDATE:
                // LeaderboardService.processUserScoreUpdateEvent(restClient, eventData);
                LeaderboardService.publishUserScoreUpdateEvent(restClient, eventData);
                return ;
            case LEADERBOARD_EVENT_NAMES.LEADERBOARD_GROUP_COMPLETION:
                LeaderboardService.processLeaderboardGroupCompletedEvent(restClient, eventData)
                return ;
            default:
                return;
        }
    }

    static async processLeaderboardChildStartedEvent(restClient: any, eventData: LeaderboardStartedEvent): Promise<any>{
        logger.info(`[LeaderboardService.processLeaderboardChildStartedEvent] eventData:: ${JSON.stringify(eventData)}`);
        LeaderboardService.markLeaderboardAsOngoing(restClient, eventData);
        const roomIds = eventData.categories || [];
        const promises: Array<Promise<Table[]>> = []
        for(let i=0; i<roomIds.length; i++){
            promises.push(AriesService.getRoomTables(restClient, roomIds[i]));
        }
        const roomsTableInfo: Table[] = ([] as Table[]).concat(...await Promise.all(promises))
        logger.info(roomsTableInfo,`[LeaderboardService.processLeaderboardChildStartedEvent] roomsTableInfo::`);
        for (let i=0; i<roomsTableInfo.length; i++){
            const playerDetails: TablePlayersDetails = await AriesService.getTablePlayerDetails(restClient, roomsTableInfo[i].id)
            const playerList = playerDetails.playerList ?? []
            for (let j=0; j<playerList.length; j++){
                const userId = playerList[j].userId;
                const payload = {tableIds: [roomsTableInfo[i].id]}
                logger.info(roomsTableInfo,`[LeaderboardService.processLeaderboardChildStartedEvent] userId ${userId}, ${JSON.stringify(payload)}`);
                if (userId){
                    ConnectionManagerUtil.sendMessageToUser(SocketPublishEvents.LEADERBOARD_STARTED, Number(userId), payload, DEFAULT_APOLLO_SOCKET_NAMESAPACE)
                }
            }
        }
        LeaderboardService.sendChildLeaderboardStartedEvent(restClient, eventData)
        return
    }

    static async markLeaderboardAsOngoing(restClient: any, eventData: LeaderboardStartedEvent){
        logger.info(`[LeaderboardService.markLeaderboardAsOngoing] eventData:: ${JSON.stringify(eventData)}`);
        const lbCampaignUpdateRequest = {status: LEADERBOARD_CAMPAIGN_STATUS.ONGOING};
        const lbCampaignTag = eventData?.tags;
        const updatedLbCampaign = await LeaderboardClient.updateLeaderboardCampaignStatus(restClient, lbCampaignTag, lbCampaignUpdateRequest);
        return updatedLbCampaign
    }


    static async processUserScoreUpdateEvent(restClient: any, eventData: LeaderboardScoreUpdate): Promise<any>{
        logger.info(`[LeaderboardService.proceUserScoreUpdateEvent] eventData:: ${JSON.stringify(eventData)}`);
        if (eventData.data.currentRank === eventData.data.previousRank){
            return
        }
        const roomIds = eventData.data.categories;
        const userTables: RoomTables[] = await AriesService.getPlayerActiveTableByRoom(restClient, eventData.userId, roomIds);
        const tableIds = userTables.map( userTable => {return userTable.tableId});
        const rankUpdateData = {tableIds: tableIds, previousRank: eventData.data.previousRank, currentRank: eventData.data.currentRank};
        ConnectionManagerUtil.sendMessageToUser(SocketPublishEvents.USER_LEADERBOARD_RANK_UPDATE, Number(eventData.userId), rankUpdateData, DEFAULT_APOLLO_SOCKET_NAMESAPACE)

    }

    static async getLeaderboardsOnTable(restClient: any, userId: number, roomId: number, vendorId: string): Promise<any>{
        logger.info(`[LeaderboardService.getLeaderboardsOnTable] eventData:: userId: ${userId}, roomId: ${roomId}`);
        const leaderboardResponse: LeaderboardAuroraResponse[] = await LeaderboardClient.getChildLeaderboardsOnTable(restClient, userId, roomId);
        if (leaderboardResponse.length >0){
            leaderboardResponse[0].status = LEADERBOARD_STATUS_STRING_MAPPING[leaderboardResponse[0].status]
        }
        if (leaderboardResponse.length> 0 && !leaderboardResponse[0].userRanksScoreboard){
            const userDetails = await IDMService.getUserDetails(restClient, String(userId), vendorId)
            leaderboardResponse[0].userRanksScoreboard = {
                vendorId: vendorId,
                userId: String(userId),
                userName: userDetails.displayName ?? '',
                rewardAmount: 0,
                score: 0,
                userAvatarUrl: userDetails.displayPicture
            }
        }
        return leaderboardResponse
    }

    static async getLeaderboardOnHybridLobby(restClient: any, userId: number, roomIds: Array<string>): Promise<any>{
        logger.info(`[LeaderboardService.getLeaderboardOnHybridLobby] eventData:: userId: ${userId}, roomIds: ${JSON.stringify(roomIds)}`);
        const leaderboardResponse = await LeaderboardClient.getRunningLeaderboardFromRooms(restClient, userId, roomIds);
        if (leaderboardResponse.length >0){
            leaderboardResponse[0].status = LEADERBOARD_STATUS_STRING_MAPPING[leaderboardResponse[0].status]
        }
        return leaderboardResponse
    }

    static async getLeaderboardCampaigns(restClient: any, userId: number, statusFilter: number[]): Promise<LeaderboardCampaign[]>{
        logger.info(`[LeaderboardService.getLeaderboardCampaigns] eventData:: userId: ${userId}, roomId: ${userId}, status:${JSON.stringify(statusFilter)}`);
        if (statusFilter.length <= 0){
            statusFilter = [LEADERBOARD_CAMPAIGN_STATUS.UPCOMING, LEADERBOARD_CAMPAIGN_STATUS.ONGOING, LEADERBOARD_CAMPAIGN_STATUS.COMPLETED]
        }
        const lbCampaign = await LeaderboardClient.getLeaderboardCampaigns(restClient, userId, statusFilter);
        return lbCampaign
    }

    static async getLeaderboardsFromGroups(restClient: any, userId: number, request: any): Promise<any>{
        logger.info(`[LeaderboardService.getLeaderboardsFromGroups] request: ${JSON.stringify(request)}`);
        // TODO Can be Cached
        // Getting ActiveRooms By Stake
        const resp = await AriesService.getActiveRoomByStake(restClient, request.stake)

        const getLBFromStakesRequest: GetLeaderboardsFromGroupsRequest = {
            roomIds: resp.roomIds,
            campaignTag: request.leaderboardCampaignTag,
            selectedDate: request.selectedDate
        }
        logger.info(`[LeaderboardService.getLeaderboardsFromGroups] getLBFromStakesRequest: ${JSON.stringify(JSON.stringify(getLBFromStakesRequest))}`);
        const leaderboardGroups  = await LeaderboardClient.getLeaderboardsFromGroups(restClient, userId, getLBFromStakesRequest);
        const leaderboards = leaderboardGroups.leaderboards;
        const updatedLeaderboardResponses: Array<LeaderboardAuroraResponse> = await LeaderboardService.formatLeaderboardResponse(restClient, leaderboards);
        const groupedLeaderbaordResp = LeaderboardService.groupLeaderboardOnStatus(updatedLeaderboardResponses);

        // Remove Ongoing and Upcoming section in case date are different than current and previous dates
        if (request.selectedDate && !DateUtil.isInputDateTodayInIST(request.selectedDate) && groupedLeaderbaordResp[LEADERBOARD_STATUS_STRING.ONGOING].length == 0){
            delete groupedLeaderbaordResp[LEADERBOARD_STATUS_STRING.ONGOING]
        }
        if (request.selectedDate && DateUtil.isInputDateBeforeTodayInIST(request.selectedDate) && groupedLeaderbaordResp[LEADERBOARD_STATUS_STRING.UPCOMING].length == 0){
            delete groupedLeaderbaordResp[LEADERBOARD_STATUS_STRING.UPCOMING]
        }

        // Remove Ongoing and other section for completed campaign
        const formattedLeaderboardGroups = LeaderboardService.removeUnwantedSectionForCampaign(groupedLeaderbaordResp, leaderboardGroups.lbCampaignInfo)

        // Get Default Leaderboard to show for Desktop UI
        const defaultLeaderboardData = LeaderboardService.getDefaultLeaderboardFromGroupedLeaderboard(groupedLeaderbaordResp)

        return {
            leaderboards: formattedLeaderboardGroups,
            isNextDateLeaderboardsAvailable: leaderboardGroups.isNextDateLeaderboardsAvailable,
            tnc: leaderboardGroups.tnc,
            defaultLeaderboard: {
                leaderboardGroupId: defaultLeaderboardData.leaderboardGroupId,
                childLeaderboardId: defaultLeaderboardData.childLeaderboardId,
                campaignTag: defaultLeaderboardData.campaignTag
            },
            lbCampaignInfo: leaderboardGroups.lbCampaignInfo,
            selectedDateInIST: leaderboardGroups.selectedDateInIST
        }
    }

    static getGameStakesConfig(vendorId: string): object{
        const gameStakes = configService.getGameStakesConfigForLeaderboardForVendor()[vendorId]
        return gameStakes
    }

    static async getChildLeaderboardDetailsFromId(restClient: any, userId: number, request: GetChildLeaderboardDetailsByIdRequest): Promise<LeaderboardAuroraResponse>{
        logger.info(`[LeaderboardService.getChildLeaderboardDetailsFromId] userId - ${userId} request: ${JSON.stringify(request)}`);
        const lbDetails: LeaderboardAuroraResponse = await LeaderboardClient.getChildLeaderboardDetailsFromId(restClient, userId, request);
        lbDetails.status = LEADERBOARD_STATUS_STRING_MAPPING[lbDetails.status]
        if (!lbDetails.userRanksScoreboard && lbDetails.status.toUpperCase() != LEADERBOARD_STATUS.UPCOMING){
            const userDetails = await IDMService.getUserDetails(restClient, String(userId), request.vendorId)
            lbDetails.userRanksScoreboard = {
                vendorId: request.vendorId,
                userId: String(userId),
                userName: userDetails.userHandle?? '',
                rewardAmount: 0,
                score: 0,
                userAvatarUrl: userDetails.displayPicture
            }
        }
        return lbDetails
    }

    static async getAllParticipatedLeaderboard(restClient: any, userId: number){
        try{
            const status =  LEADERBOARD_GROUP_TENET_STATUS.RUNNING;
            const runningLeaderboards: LeaderboardAuroraResponse[] = await LeaderboardClient.getUserLeaderboardsByStatus(restClient, userId, status);
            const participatedLB = runningLeaderboards.filter(lb => lb.status === LEADERBOARD_STATUS.PARTICIPATED)
            participatedLB.forEach(leaderboard => {
                leaderboard.status = LEADERBOARD_STATUS_STRING_MAPPING[leaderboard.status];
            });
            return participatedLB
        } catch (e){
            logger.error('[LeaderboardService.getAllRunningLeaderboard] error',e)
        }
    }


    static async getLeaderboardHomePageInfo(restClient: any, userId: number, vendorId: string): Promise<any>{
        logger.info(`[LeaderboardService.getLeaderboardHomePageInfo] userId - ${userId} vendorId: ${vendorId}`);
        const runningLeaderboards = await LeaderboardService.getAllParticipatedLeaderboard(restClient, userId) ?? [];
        const formattedRunningLeaderboards = await LeaderboardService.formatLeaderboardResponse(restClient, runningLeaderboards)
        if (!runningLeaderboards || runningLeaderboards.length <= 0){
            const bannerData = configService.getLeaderboardBannersVendor();
            return {'banners': bannerData[vendorId]}
        }
        return {'leaderboards':formattedRunningLeaderboards}
    }

    static async getLeaderboardNeighbourDetails(restClient: any, userId: number, request: any): Promise<LeaderboardAuroraResponse>{
        logger.info(`[LeaderboardService.getLeaderboardNeighbourDetails] userId - ${userId} request: ${JSON.stringify(request)}`);
        const leaderboardResp: LeaderboardAuroraResponse = await LeaderboardClient.getLeaderboardNeighbourDetails(restClient, userId, request);
        if (!leaderboardResp.childLeaderboardId){
            return leaderboardResp
        }
        if (leaderboardResp && leaderboardResp.status){
            leaderboardResp.status = LEADERBOARD_STATUS_STRING_MAPPING[leaderboardResp.status]
        }
        if (leaderboardResp && !leaderboardResp.userRanksScoreboard && leaderboardResp.status.toUpperCase() != LEADERBOARD_STATUS.UPCOMING){
            const userDetails = await IDMService.getUserDetails(restClient, String(userId), request.vendorId)
            leaderboardResp.userRanksScoreboard = {
                vendorId: request.vendorId,
                userId: String(userId),
                userName: userDetails.userHandle ?? '',
                rewardAmount: 0,
                score: 0,
                userAvatarUrl: userDetails.displayPicture
            }
        }
        return leaderboardResp
    }

    static async getUserLeaboardTotalEarnings(restClient: any, userId: number): Promise<UserLeaderboardTotalEarnings>{
        logger.info(`[LeaderboardService.getUserLeaboardTotalEarnings] userId - ${userId} `);
        const userLeaderboardEarnings: ZodiacUserLeaderboardTotalWinning|undefined = await ZodiacService.getUserLeaderboardTotalWinnings(restClient, userId);
        const earningBreakup: Array<UserLeaderboardWinningBreakup> = []

        earningBreakup.push({
            currencyIdentifier: CURRENCY_CODE.DISCOUNT_CREDIT_SEGMENT,
            amount: userLeaderboardEarnings?.leaderboard_dc_segment_amount || 0
        })

        earningBreakup.push({
            currencyIdentifier: CURRENCY_CODE.WINNING_SEGMENT,
            amount: userLeaderboardEarnings?.leaderboard_winning_segment_amount || 0
        })
        const totalEarnings = Parser.parseToTwoDecimal((userLeaderboardEarnings?.leaderboard_winning_segment_amount || 0) + ( userLeaderboardEarnings?.leaderboard_dc_segment_amount || 0))
        return {
            totalAmount: totalEarnings,
            winnigBreakup: earningBreakup
        }
    }

    static async sendLeaderboardWinningGratification(restClient, winningData: LeaderboardWinningGratificationData) {
        logger.info(`[LeaderboardService.sendLeaderboardWinningGratification] userId - ${winningData.userId},  winningData - ${JSON.stringify(winningData)}`);
        const roomIds = winningData.userSettlementData.categories|| [];
        if (roomIds.length <= 0){
            return
        }
        const userTables: RoomTables[] = await AriesService.getPlayerActiveTableByRoom(restClient, String(winningData.userId), roomIds);
        const tableIds = userTables.map( userTable => {return userTable.tableId});
        winningData.userSettlementData.tableIds = tableIds
        ConnectionManagerUtil.sendMessageToUser(SocketPublishEvents.USER_LEADERBOARD_WINNING_GRATIFICATION, winningData.userId, winningData.userSettlementData, DEFAULT_APOLLO_SOCKET_NAMESAPACE)
    }

    static async getLeaderboardFAQ(vendorId){
        const leaderboardFAQByVendor = configService.getLeaderboardFAQByVendor();
        return leaderboardFAQByVendor[vendorId];
    }

    private static async formatLeaderboardResponse(restClient: any, leaderboards: Array<LeaderboardAuroraResponse>){
        const roomIds: Array<string> = [];
        leaderboards.forEach(leaderboard => {
            roomIds.push(...leaderboard.roomIds);
        });
        const groupIdsFromRoomIds:Array<any> = await AriesService.getGroupIdsFromRoomIds(restClient, roomIds);
        const updatedLeaderboardResponses = leaderboards.map((response) => {
            const groupIds = groupIdsFromRoomIds
                .filter((item) => response.roomIds.includes(item.room_id.toString()))
                .map((item) => item.group_id.toString());
            response.status = LEADERBOARD_STATUS_STRING_MAPPING[response.status]
            return { ...response, groupIds };
        });
        return updatedLeaderboardResponses
    }

    static groupLeaderboardOnStatus(leaderboards: any){
        const groupedLeaderboards: { [x: string]: any[] } = {};
        // Initialize empty arrays for each status
        LEADERBOARD_SORTING_ORDER.forEach(status => {
            groupedLeaderboards[status] = [];
        });
        // Group leaderboards based on status
        leaderboards.forEach((leaderboard: { status: string }) => {
            if (LEADERBOARD_SORTING_ORDER.includes(leaderboard.status)) {
            groupedLeaderboards[leaderboard.status].push(leaderboard);
        }
        });
        groupedLeaderboards[LEADERBOARD_STATUS_STRING.COMPLETED] = LeaderboardService.sortLeaderboardOnEndTimeDesc(groupedLeaderboards[LEADERBOARD_STATUS_STRING.COMPLETED])
        if (groupedLeaderboards[LEADERBOARD_STATUS_STRING.PARTICIPATED] && groupedLeaderboards[LEADERBOARD_STATUS_STRING.PARTICIPATED].length == 0){
            delete groupedLeaderboards[LEADERBOARD_STATUS_STRING.PARTICIPATED]
        }
        if (groupedLeaderboards[LEADERBOARD_STATUS_STRING.PARTICIPATED] && groupedLeaderboards[LEADERBOARD_STATUS_STRING.PARTICIPATED].length > 0 && groupedLeaderboards[LEADERBOARD_STATUS_STRING.ONGOING] && groupedLeaderboards[LEADERBOARD_STATUS_STRING.ONGOING].length == 0){
            delete groupedLeaderboards[LEADERBOARD_STATUS_STRING.ONGOING]
        }
        return groupedLeaderboards;
    }

    static async publishUserScoreUpdateEvent(restClient:any, eventData: LeaderboardScoreUpdate):Promise<any>{
        const leaderboardGroupId = eventData.leaderboardId;
        const childLeaderboardId = eventData.childLbId;
        const campaignTag = eventData.data.tag;
        const userId = eventData.userId;
        const vendorId = eventData.data.userMeta.vendorId?? 0
        const request: GetChildLeaderboardDetailsByIdRequest = {
            lbGroupId: leaderboardGroupId,
            lbChildId: childLeaderboardId,
            lbCampaignTag: campaignTag,
            vendorId: P52_VENDOR_ID
        }
        const lbResponse: LeaderboardAuroraResponse = await LeaderboardClient.getChildLeaderboardDetailsFromId(restClient, 0, request);
        const lbDetails = LeaderboardService.formulateLeaderboardGroupEventData(lbResponse)
        EventPushService.push(Number(userId), Number(vendorId), '', EventNames.USER_LEADERBOARD_SCORE_UPDATED, {eventData, lbDetails});
    }

    static async processLeaderboardScheduledEvent(restClient: any, eventData: LeaderboardScheduledEvent){
        const leaderboardGroupId = eventData.leaderboardId;
        const childLeaderboardId = (eventData.data.child_leaderboards.length > 0 && eventData.data.child_leaderboards[0].id) || -1;
        const campaignTag = eventData.data.tag;
        const request: GetChildLeaderboardDetailsByIdRequest = {
            lbGroupId: leaderboardGroupId,
            lbChildId: childLeaderboardId,
            lbCampaignTag: campaignTag,
            vendorId: P52_VENDOR_ID
        }
        const lbDetails: LeaderboardAuroraResponse = await LeaderboardClient.getChildLeaderboardDetailsFromId(restClient, 0, request);
        const formattedLBGroupDetails = LeaderboardService.formulateLeaderboardGroupEventData(lbDetails);
        EventPushService.push(0, 0, '', EventNames.LEADERBOARD_GROUP_CREATED, formattedLBGroupDetails);
        eventData.data.child_leaderboards.forEach(childLB => {
            const childLBDetails = LeaderboardService.formulateChildLeaderboardEventData(childLB, leaderboardGroupId);
            EventPushService.push(0, 0, '', EventNames.LEADERBOARD_CHILD_CREATED, childLBDetails);
        })
    }

    static async processLeaderboardChildCancelledEvent(restClient: any, eventData: LeaderboardChildCancellationEvent){
        const leaderboardGroupId = eventData.leaderboardId;
        const formattedChildLBDetails = LeaderboardService.formulateChildLeaderboardEventData(eventData.data, leaderboardGroupId);
        EventPushService.push(0, 0, '', EventNames.LEADERBOARD_CHILD_UPDATED, formattedChildLBDetails);
        return
    }

    static async processLeaderboardGroupCancelledEvent(restClient: any, eventData: LeaderboardGroupCancellationEvent){
        const leaderboardGroupId = eventData.leaderboardId;
        const childLeaderboardId = (eventData.data.leaderboards.length > 0 && eventData.data.leaderboards[0].id) || -1;
        const request: GetChildLeaderboardDetailsByIdRequest = {
            lbGroupId: leaderboardGroupId,
            lbChildId: childLeaderboardId,
            vendorId: P52_VENDOR_ID
        }
        const lbDetails: LeaderboardAuroraResponse = await LeaderboardClient.getChildLeaderboardDetailsFromId(restClient, 0, request);
        const formattedLBGroupDetails = LeaderboardService.formulateLeaderboardGroupEventData(lbDetails);
        EventPushService.push(0, 0, '', EventNames.LEADERBOARD_GROUP_UPDATED, formattedLBGroupDetails);
    }

    static async processLeaderboardChildCompletedEvent(restClient: any, eventData: BulkSettlementEvent){
        const leaderboardGroupId = eventData.meta.leaderboardId;
        const childLeaderboardId = eventData.meta.childLeaderboardId;
        const request: GetChildLeaderboardDetailsByIdRequest = {
            lbGroupId: leaderboardGroupId,
            lbChildId: childLeaderboardId,
            vendorId: P52_VENDOR_ID
        }
        const lbDetails: LeaderboardAuroraResponse = await LeaderboardClient.getChildLeaderboardDetailsFromId(restClient, 0, request);
        const childLBDetails: ChildLeaderboardSchedulingDetails = {
            id: childLeaderboardId,
            status: "completed",
            starttime: lbDetails.startTime,
            endtime: lbDetails.endTime,
            claimendtime: "",
            claimstarttime: "",
            boosters: []
        }
        const formattedLBChildDetails = LeaderboardService.formulateChildLeaderboardEventData(childLBDetails, childLeaderboardId);
        EventPushService.push(0, Number(P52_VENDOR_ID), CASH_APP, EventNames.LEADERBOARD_CHILD_UPDATED, {formattedLBChildDetails, lbDetails});
        EventPushService.push(0, Number(GMZ_VENDOR_ID), CASH_APP, EventNames.LEADERBOARD_CHILD_UPDATED, {formattedLBChildDetails, lbDetails});
    }

    static async processLeaderboardGroupCompletedEvent(restClient: any, eventData: LeaderboardGroupCompletedEvent){
        const leaderboardGroupId = eventData.leaderboardId;
        const childLeaderboardId = eventData.data.child_leaderboards[0].id;
        const request: GetChildLeaderboardDetailsByIdRequest = {
            lbGroupId: leaderboardGroupId,
            lbChildId: childLeaderboardId,
            vendorId: P52_VENDOR_ID
        }
        const lbDetails: LeaderboardAuroraResponse = await LeaderboardClient.getChildLeaderboardDetailsFromId(restClient, 0, request);
        const formattedLBGroupDetails = LeaderboardService.formulateLeaderboardGroupEventData(lbDetails);
        EventPushService.push(0, 0, CASH_APP, EventNames.LEADERBOARD_GROUP_UPDATED, formattedLBGroupDetails);
    }

    static async sendChildLeaderboardStartedEvent(restClient: any, eventData: LeaderboardStartedEvent){
        logger.info(`[LeaderboardService.sendChildLeaderboardStartedEvent] eventData:: ${JSON.stringify(eventData)}`);
        const request: GetChildLeaderboardDetailsByIdRequest = {
            lbGroupId: eventData.leaderboardId,
            lbChildId: eventData.childLbId,
            vendorId: P52_VENDOR_ID
        }
        const lbResponse: LeaderboardAuroraResponse = await LeaderboardClient.getChildLeaderboardDetailsFromId(restClient, 0, request);
        const lbDetails = LeaderboardService.formulateLeaderboardGroupEventData(lbResponse)
        EventPushService.push(0, Number(P52_VENDOR_ID), CASH_APP, EventNames.CHILD_LEADERBOARD_STARTED, lbDetails)
        EventPushService.push(0, Number(GMZ_VENDOR_ID), CASH_APP, EventNames.CHILD_LEADERBOARD_STARTED, lbDetails)
    }

    static async sendPrizePoolDataEvent(restClient: any, eventData: LeaderboardScheduledEvent){
        const childLeaderboardId = eventData.data.child_leaderboards[0].id;
        const lbDetails: LeaderboardAuroraResponse = await LeaderboardClient.getPrizePool(restClient, childLeaderboardId);
        EventPushService.push(0, 0, CASH_APP, EventNames.LEADERBOARD_PRIZE_POOL_CREATED, lbDetails);
    }

    static formulateLeaderboardGroupEventData(lbDetails: LeaderboardAuroraResponse): any{
        lbDetails.scoreboard = undefined
        return lbDetails
    }

    static formulateChildLeaderboardEventData(childLeaderboardSchedulingDetails: ChildLeaderboardSchedulingDetails, leaderboardGroupId: number){
        return {
            status: childLeaderboardSchedulingDetails.status,
            startTime: DateUtil.convertUTCtoIST(childLeaderboardSchedulingDetails.starttime),
            endTime: DateUtil.convertUTCtoIST(childLeaderboardSchedulingDetails.endtime),
            childLeaderboardId: childLeaderboardSchedulingDetails.id,
            leaderboardGroupId
        }
    }

    static removeUnwantedSectionForCampaign(groupedLeaderboardResp: any, lbCampaignInfo: LeaderboardCampaign){
        if (lbCampaignInfo.statusString && lbCampaignInfo.statusString.toUpperCase() == LEADERBOARD_CAMPAIGN_STATUS_STRING.COMPLETED.toUpperCase()){
            if (groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.ONGOING] && groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.ONGOING].length == 0){
                delete groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.ONGOING]
            }
            if (groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.UPCOMING] && groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.UPCOMING].length == 0){
                delete groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.UPCOMING]
            }
            if (groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.PARTICIPATED] && groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.PARTICIPATED].length == 0){
                delete groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.PARTICIPATED]
            }
        }

        if (lbCampaignInfo.statusString && lbCampaignInfo.statusString.toUpperCase() == LEADERBOARD_CAMPAIGN_STATUS_STRING.UPCOMING.toUpperCase()){
            if (groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.COMPLETED] && groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.COMPLETED].length == 0){
                delete groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.COMPLETED]
            }
            if (groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.ONGOING] && groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.ONGOING].length == 0){
                delete groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.ONGOING]
            }
            if (groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.PARTICIPATED] && groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.PARTICIPATED].length == 0){
                delete groupedLeaderboardResp[LEADERBOARD_STATUS_STRING.PARTICIPATED]
            }
        }
        return groupedLeaderboardResp
    }

    static getDefaultLeaderboardFromGroupedLeaderboard(groupedLeaderboardResp: any){
        let defaultLeaderboardData = LeaderboardService.getFirstLeaderboard(groupedLeaderboardResp, LEADERBOARD_STATUS_STRING.PARTICIPATED)
        defaultLeaderboardData = defaultLeaderboardData? defaultLeaderboardData: LeaderboardService.getFirstLeaderboard(groupedLeaderboardResp, LEADERBOARD_STATUS_STRING.ONGOING)
        defaultLeaderboardData = defaultLeaderboardData? defaultLeaderboardData: LeaderboardService.getFirstLeaderboard(groupedLeaderboardResp, LEADERBOARD_STATUS_STRING.UPCOMING)
        defaultLeaderboardData = defaultLeaderboardData? defaultLeaderboardData: LeaderboardService.getFirstLeaderboard(groupedLeaderboardResp, LEADERBOARD_STATUS_STRING.COMPLETED)
        return defaultLeaderboardData || {}
    }

    static getFirstLeaderboard (groupedLeaderboardResp: any,status: string){
        return groupedLeaderboardResp[status] && groupedLeaderboardResp[status].length > 0 ? groupedLeaderboardResp[status][0] : null;
    };

    static sortLeaderboardOnEndTimeDesc(leaderboards: any[]):any[]{
        return leaderboards.sort((a, b) => {
            // Convert startTimes to Date objects for comparison
            const endTimeA = new Date(a.endTime);
            const endTimeB = new Date(b.endTime);
            // Compare startTimes
            if (endTimeA > endTimeB) {
                return -1;
            }
            if (endTimeA < endTimeB) {
                return 1;
            }
            return 0;
        });
    }
};
