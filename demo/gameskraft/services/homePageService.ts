import {
    IExploreGameWidgets,
    IExplorePracticeGameWidgets,
    IGroup,
    IHomeScreenTab,
    IHomeWidgets,
    IRoom,
    IWidgets,
    PracticeAppDcsWidget
} from '../models/gateway/response';
import {
    DEAULT_TIME_FOR_ONLINE_USER,
    EXPLORE_GAMES_WIDGETS,
    EXPLORE_GAMES_WIDGETS_V2,
    EXPLORE_GAMES_WIDGETS_V2_GZ_POKER,
    GMZ_VENDOR_ID,
    HOME_SCREEN_TABS,
    HOME_SCREEN_TABS_WITH_LEADERBOARD,
    HOME_SCREEN_TABS_WITH_LEADERBOARD_PSL,
    HOME_SCREEN_TABS_WITH_PSL,
    HOME_SCREEN_WIDGETS,
    P52_VENDOR_ID,
    PRACTICE_EXPLORE_GAMES_WIDGETS,
    PRACTICE_HOME_SCREEN_TABS,
    TournamentSeat
} from '../constants/constants';
import { Group } from '../models/group';
import { Room } from '../models/room';
import { GetRecommendedGroupsRequest } from '../models/zodiac/get-recommended-groups-request';
import { GetRecommendedRoomsRequest } from '../models/zodiac/get-recommended-rooms-request';
import { AriesService } from './ariesService';
import {
    getHotTournamentBannersVendor,
    getPostAddCashOfferBannersVendor,
    getPracticeAppOfferBanners,
    getPracticeAppRewards,
    getPreAddCashOfferBannersVendor,
    getPslWidgetsBannersVendor,
    getStoryRewindBannerVendor,
    IsRecommendedRoomsV2Enable
} from './configService';
import RoyaltyService from './royaltyService';
import { TitanService } from './titanService';
import ReferralServiceV2 from './v2/referralService';
import { GsService } from './gsService';

import LoggerUtil from '../utils/logger';
import HomeUtil from '../utils/home-util';
import PayinService from './payinService';
import SupernovaService from './supernovaService';
import { TRANSACTIONS_SORTING_METHOD } from '../constants/payin-constants';
import ZodiacService from './zodiacService';
import { TournamentResponse } from '../models/game-server/mtt-list';
import AmountUtil from '../utils/amount-util';
import { TournamentCurrencyType } from '../models/enums/tournament/tournament-currency-type';
import GsUtil from '../utils/gs-util';
import PracticeAppRewardClient from '../clients/practiceAppRewardClient';
import LeaderboardService from './leaderboardService';
import PslService from "./pslService";

const redisService = require('../services/redisService');
const ApiCacheHelper = require('../helpers/apiCacheHelper');
const logger = LoggerUtil.get("HomePageService");
const configService = require('../services/configService');
import AppConfigService from './appConfigService';


export default class HomePageService {

    static async getOnlineUsersCount(internalRestClient: any, vendorId: string): Promise<number> {
        const onlineUsersResponse = await ApiCacheHelper.getOnlineUsersFromCache();
        if (onlineUsersResponse) {
            let usersCount = 0;
            Object.keys(onlineUsersResponse || {}).forEach((userId,) => {
                // Now remove all the users who are not active since 1 hr
                if (Date.now() - onlineUsersResponse[userId] > DEAULT_TIME_FOR_ONLINE_USER) {
                    // This would help in the next API call. Basically a cleanup operation in parallel.
                    redisService.removeOnlineUserFromRedis(userId);	// No need to wait
                }
                else {
                    usersCount++;
                }
            });
            return usersCount;
        }
        return 0;
    }

    static async getPracticeAppOnlineUsersCount(internalRestClient: any, vendorId: string): Promise<number> {
        const onlineUsersResponse = await ApiCacheHelper.getPracticeAppOnlineUsersFromCache();
        if (onlineUsersResponse) {
            let usersCount = 0;
            Object.keys(onlineUsersResponse || {}).forEach((userId,) => {
                // Now remove all the users who are not active since 1 hr
                if (Date.now() - onlineUsersResponse[userId] > DEAULT_TIME_FOR_ONLINE_USER) {
                    // This would help in the next API call. Basically a cleanup operation in parallel.
                    redisService.removePracticeAppOnlineUserFromRedis(userId);	// No need to wait
                }
                else {
                    usersCount++;
                }
            });
            return usersCount;
        }
        return 0;
    }

    static async getHomeScreenTabs(userId: number, vendorId: string, appVersion: string): Promise<IHomeScreenTab[]> {
        const leaderboardFeatureConfig = AppConfigService.getLeaderboardFeatureEnabledStatus(appVersion, vendorId);
        let homeScreenTabs: IHomeScreenTab[] = HOME_SCREEN_TABS;
        if (leaderboardFeatureConfig) {
            homeScreenTabs = HOME_SCREEN_TABS_WITH_LEADERBOARD
            if (PslService.getPslEnableStatus(userId, vendorId)) {
                homeScreenTabs = HOME_SCREEN_TABS_WITH_LEADERBOARD_PSL
            }
        }
        else {
            if (PslService.getPslEnableStatus(userId, vendorId)) {
                homeScreenTabs = HOME_SCREEN_TABS_WITH_PSL
            }
        }

        return homeScreenTabs;
    }

    static async getPracticeHomeScreenTabs(): Promise<IHomeScreenTab[]> {
        let homeScreenTabs: IHomeScreenTab[] = PRACTICE_HOME_SCREEN_TABS;
        return homeScreenTabs;
    }

    static async getExploreGamesWidgets(): Promise<IWidgets> {
        const exploreGamesWidgets: IExploreGameWidgets[] = EXPLORE_GAMES_WIDGETS;
        const exploreGamesWidgetsResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.EXPLORE_GAMES.title,
            key: HOME_SCREEN_WIDGETS.EXPLORE_GAMES.key,
            items: exploreGamesWidgets
        };
        return exploreGamesWidgetsResp;
    }

    static async getExploreGamesWidgetsV2ForVendor(vendorId: string): Promise<IWidgets> {
        let exploreGamesWidgets: IExploreGameWidgets[] = [];
        switch (vendorId) {
            case P52_VENDOR_ID:
                exploreGamesWidgets = EXPLORE_GAMES_WIDGETS_V2;
                break;
            case GMZ_VENDOR_ID:
                exploreGamesWidgets = EXPLORE_GAMES_WIDGETS_V2_GZ_POKER;
                break;
            default:
                break;
        }

        return {
            title: HOME_SCREEN_WIDGETS.EXPLORE_GAMES.title,
            key: HOME_SCREEN_WIDGETS.EXPLORE_GAMES.key,
            items: exploreGamesWidgets
        };
    }

    static async getPracticeExploreGamesWidgets(): Promise<IWidgets> {
        const exploreGamesWidgets: IExplorePracticeGameWidgets[] = PRACTICE_EXPLORE_GAMES_WIDGETS;
        const exploreGamesWidgetsResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.EXPLORE_GAMES.title,
            key: HOME_SCREEN_WIDGETS.EXPLORE_GAMES.key,
            items: exploreGamesWidgets
        };
        return exploreGamesWidgetsResp;
    }

    static async getFeaturedTournaments(internalRestClient: any, vendorId: string): Promise<IWidgets> {
        const featuredTournaments = await GsService.getFeaturedMtt(internalRestClient, vendorId);
        const featuredTournamentsResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.FEATURED_TOURNAMENTS.title,
            key: HOME_SCREEN_WIDGETS.FEATURED_TOURNAMENTS.key,
            items: featuredTournaments
        };
        return featuredTournamentsResp;
    }

    static async getFeaturedTournamentsV2(internalRestClient: any, vendorId: string): Promise<IWidgets> {
        const featuredTournaments: TournamentResponse[] = await GsService.getFeaturedMttV2(internalRestClient, vendorId);
        let featuredTournamentsResponse: TournamentResponse[] = (featuredTournaments || []).map((tournament: TournamentResponse) => {
            const primaryCurrency: TournamentCurrencyType = GsUtil.getTournamentCurrencyType(tournament?.primaryCurrency);
            return {
                ...tournament,
                totalPrizePoolWithOverlay: AmountUtil.getAmountWithTournamentCurrency(tournament?.pp, primaryCurrency, tournament?.isOverlayActive),
                totalAssets: (tournament?.tt ?? 0) > 0 ? `${tournament?.tt} ${TournamentSeat.SEATS}` : ''
            }
        })
        const featuredTournamentsResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.FEATURED_TOURNAMENTS.title,
            key: HOME_SCREEN_WIDGETS.FEATURED_TOURNAMENTS.key,
            items: featuredTournamentsResponse
        };
        return featuredTournamentsResp;
    }

    static async getFeaturedTournamentsV3(internalRestClient: any, vendorId: string): Promise<IWidgets> {

        const [gsFeaturedTournaments, ariesFeaturedTournament] = await (Promise as any).allSettled([GsService.getFeaturedMttV3(internalRestClient, vendorId, false), TitanService.getFeaturedTournaments(internalRestClient, Number(vendorId), true)])
        logger.info(`[getFeaturedTournamentsV3] gsFeaturedTournaments ${JSON.stringify(gsFeaturedTournaments)} `);
        logger.info(`[getFeaturedTournamentsV3] ariesFeaturedTournament ${JSON.stringify(ariesFeaturedTournament)} `);

        const featuredTournamentsResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.FEATURED_TOURNAMENTS.title,
            key: HOME_SCREEN_WIDGETS.FEATURED_TOURNAMENTS.key,
            items: [...gsFeaturedTournaments.value, ...ariesFeaturedTournament.value]
        };
        return featuredTournamentsResp;
    }

    static async getUserRoyaltyInfo(internalRestClient, userId, vendorId: string): Promise<IWidgets> {
        let userRoyaltyInfo = {}
        try {
            userRoyaltyInfo = await RoyaltyService.getRoyaltyHomeInfo(internalRestClient, userId);
        } catch (e) {
            logger.error(e, `[getUserRoyaltyInfo] Failed `);
        }
        const userRoyaltyInfoResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.USER_ROYALTY_INFO.title[vendorId],
            key: HOME_SCREEN_WIDGETS.USER_ROYALTY_INFO.key,
            items: userRoyaltyInfo
        };
        return userRoyaltyInfoResp;
    }

    static async getLeaderboardInfo(internalRestClient, userId, vendorId: string): Promise<IWidgets> {
        const leaderboardFeatureConfig = configService.getLeaderboardFeatureConfigByVendor()[vendorId]
        let leaderboardInfo = {}
        if (leaderboardFeatureConfig.isEnabled){
            try {
                leaderboardInfo = await LeaderboardService.getLeaderboardHomePageInfo(internalRestClient, userId, vendorId)
            } catch (e) {
                logger.error(e,`[getLeaderboardInfo] Failed `);
            }
        }
        const userLeaderboardInfo: IWidgets = {
            title: HOME_SCREEN_WIDGETS.LEADERBOARD_INFO.title[vendorId],
            key: HOME_SCREEN_WIDGETS.LEADERBOARD_INFO.key,
            items: leaderboardInfo
        };
        return userLeaderboardInfo;
    }

    static async getHotTournamentBanners(vendorId: string): Promise<IWidgets> {
        const hotTournamentBannersResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.HOT_TOURNAMENT_BANNERS.title,
            key: HOME_SCREEN_WIDGETS.HOT_TOURNAMENT_BANNERS.key,
            items: getHotTournamentBannersVendor()[vendorId]
        };
        return hotTournamentBannersResp;
    }

    static async getStoryRewindBanner(vendorId: string): Promise<IWidgets> {
        const storyRewindBannersResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.STORY_REWIND.title,
            key: HOME_SCREEN_WIDGETS.STORY_REWIND.key,
            items: getStoryRewindBannerVendor()[vendorId]
        };
        return storyRewindBannersResp;
    }

    static async getUserReferralInfo(internalRestClient, userId): Promise<IWidgets> {
        const userReferralInfo = await ReferralServiceV2.getUserReferralStats(internalRestClient, userId);
        const userReferralInfoResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.USER_REFERRAL_INFO.title,
            key: HOME_SCREEN_WIDGETS.USER_REFERRAL_INFO.key,
            items: userReferralInfo
        };
        return userReferralInfoResp;
    }

    static async getOffersBanners(hasUserDepositedMoney: boolean, vendorId: string): Promise<IWidgets> {
        const offersBanners = (hasUserDepositedMoney ? getPostAddCashOfferBannersVendor()[vendorId] : getPreAddCashOfferBannersVendor()[vendorId]);
        const offersBannersResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.OFFERS_BANNERS.title[vendorId],
            key: HOME_SCREEN_WIDGETS.OFFERS_BANNERS.key,
            items: offersBanners
        };
        return offersBannersResp;
    }

    static async getPracticeOffersBanners(vendorId: string): Promise<IWidgets> {
        const practiceAppOffersBanners = getPracticeAppOfferBanners()[vendorId];
        const offersBannersResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.OFFERS_BANNERS.title[vendorId],
            key: HOME_SCREEN_WIDGETS.OFFERS_BANNERS.key,
            items: practiceAppOffersBanners
        };
        return offersBannersResp;
    }

    static async getPracticeAppRewards(vendorId: string): Promise<IWidgets> {
        const practiceAppRewardData = getPracticeAppRewards()[vendorId];
        const rewardsResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.PRACTICE_APP_REWARDS.title,
            key: HOME_SCREEN_WIDGETS.PRACTICE_APP_REWARDS.key,
            items: practiceAppRewardData
        };
        return rewardsResp;
    }

    static async getPslWidgetsBanners(vendorId: string): Promise<IWidgets> {
        const pslBannersResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.PSL.title,
            key: HOME_SCREEN_WIDGETS.PSL.key,
            items: getPslWidgetsBannersVendor()[vendorId]
        };
        return pslBannersResp;
    }

    static async getPslWidgetsV2(internalRestClient: any, userId: number, vendorId: string): Promise<IWidgets> {
        const pslHomeWidgetData = await PslService.getPslHomeWidgetData(internalRestClient, userId, vendorId);
        const pslBannersResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.PSL.title,
            key: HOME_SCREEN_WIDGETS.PSL.key,
            items: pslHomeWidgetData
        };
        return pslBannersResp;
    }

    static async createHomeWidgets(exploreGamesWidgets, storyRewindBanner, recommendedRooms, runningLeaderboards, pslWidgets, featuredTournaments, userRoyaltyInfo, hotTournamentBanners, offersBanners, userReferralInfo): Promise<IWidgets[]> {
        let widgets: IWidgets[] = [exploreGamesWidgets, storyRewindBanner, recommendedRooms, runningLeaderboards, pslWidgets, featuredTournaments, userRoyaltyInfo, hotTournamentBanners, offersBanners, userReferralInfo];
        return widgets;
    }

    static async createHomeWidgetsV2(exploreGamesWidgets, storyRewindBanner, runningLeaderboards, pslWidgets, recommendedRooms, featuredTournaments, userRoyaltyInfo, hotTournamentBanners, offersBanners, userReferralInfo): Promise<IWidgets[]> {
        let widgets: IWidgets[] = [exploreGamesWidgets, storyRewindBanner, runningLeaderboards, pslWidgets, recommendedRooms, featuredTournaments, userRoyaltyInfo, hotTournamentBanners, offersBanners, userReferralInfo];
        return widgets;
    }

    static async createPracticeHomeWidgets(exploreGamesWidgets, practiceAppRewards, offersBanners): Promise<IWidgets[]> {
        let widgets: IWidgets[] = [exploreGamesWidgets, offersBanners, practiceAppRewards];
        return widgets;
    }

    static async getHomeScreenWidgets(req: any, userId: number, firstTimeDepositAmount: number, payinCustomerId: string, token: string, appVersion: string): Promise<IHomeWidgets> {
        const vendorId: string = req?.vendorId;
        try {
            const hasUserDepositedMoney = firstTimeDepositAmount > 0;
            const vendorId: string = req.vendorId;
            //  Home Page promises
            const homePagePromises = [
                HomePageService.getOnlineUsersCount(req.internalRestClient, vendorId),
                HomePageService.getHomeScreenTabs(userId, vendorId, appVersion),
                HomePageService.getExploreGamesWidgets(),
                HomePageService.getRecommendedRooms(req, userId, payinCustomerId, token, firstTimeDepositAmount),
                HomePageService.getOffersBanners(hasUserDepositedMoney, vendorId),
                HomePageService.getFeaturedTournaments(req.internalRestClient, vendorId),
                HomePageService.getUserRoyaltyInfo(req.internalRestClient, userId, vendorId),
                HomePageService.getHotTournamentBanners(vendorId),
                HomePageService.getStoryRewindBanner(vendorId),
                HomePageService.getUserReferralInfo(req.internalRestClient, userId),
                HomePageService.getPslWidgetsBanners(vendorId),
                HomePageService.getLeaderboardInfo(req.internalRestClient, userId, vendorId),
            ];
            //  await on Promises to get settled
            const homePagePromisesResult = await (Promise as any).allSettled(homePagePromises);
            //  map results to individual widgets
            const [
                onlineUsersCountResult,
                homeScreenTabsResult,
                exploreGamesWidgetsResult,
                recommendedRoomsResult,
                offersBannersResult,
                featuredTournamentsResult,
                userRoyaltyInfoResult,
                hotTournamentBannersResult,
                storyRewindBannerResult,
                userReferralInfoResult,
                pslBannersResult,
                lbHomePageInfoResult
            ] = homePagePromisesResult;
            //  get the actual results from PromiseResults with handling resolve & reject
            const onlineUsersCount = onlineUsersCountResult.status === 'fulfilled' ? onlineUsersCountResult.value : 0;
            const homeScreenTabs = homeScreenTabsResult.status === 'fulfilled' ? homeScreenTabsResult.value : {};
            const exploreGamesWidgets = exploreGamesWidgetsResult.status === 'fulfilled' ? exploreGamesWidgetsResult.value : {};
            const recommendedRooms = recommendedRoomsResult.status === 'fulfilled' ? recommendedRoomsResult.value : {};
            const offersBanners = offersBannersResult.status === 'fulfilled' ? offersBannersResult.value : {};
            const featuredTournaments = featuredTournamentsResult.status === 'fulfilled' ? featuredTournamentsResult.value : {};
            const userRoyaltyInfo = userRoyaltyInfoResult.status === 'fulfilled' ? userRoyaltyInfoResult.value : {};
            const hotTournamentBanners = hotTournamentBannersResult.status === 'fulfilled' ? hotTournamentBannersResult.value : {};
            const userReferralInfo = userReferralInfoResult.status === 'fulfilled' ? userReferralInfoResult.value : {};
            const pslBanners = pslBannersResult.status === 'fulfilled' ? pslBannersResult.value : {};
            const storyRewindBanner = storyRewindBannerResult.status === 'fulfilled' ? storyRewindBannerResult.value : {};
            const lbHomePageInfo = lbHomePageInfoResult.status === 'fulfilled' ? lbHomePageInfoResult.value : {};
            logger.info(`[Debug] userRoyaltyInfo :: ${JSON.stringify(userRoyaltyInfo)}`);
            //  create final home screen response
            let homeScreenWidgets: IHomeWidgets = {
                onlinePlayers: onlineUsersCount,
                widgets: await HomePageService.createHomeWidgets(exploreGamesWidgets, storyRewindBanner, recommendedRooms, lbHomePageInfo, pslBanners, featuredTournaments, userRoyaltyInfo, hotTournamentBanners, offersBanners, userReferralInfo),
                homeScreenTabs: homeScreenTabs,
            };
            return homeScreenWidgets;
        } catch (e) {
            logger.error(e, `[HomePageService] [getHomeScreenWidgets] Error :: `);
            throw e;
        }
    }

    static async getHomeScreenWidgetsV2(req: any, userId: number, firstTimeDepositAmount: number, payinCustomerId: string, token: string, appVersion: string): Promise<IHomeWidgets> {
        const vendorId: string = req?.vendorId;
        try {
            const hasUserDepositedMoney = firstTimeDepositAmount > 0;
            const vendorId: string = req.vendorId;
            //  Home Page promises
            const homePagePromises = [
                HomePageService.getOnlineUsersCount(req.internalRestClient, vendorId),
                HomePageService.getHomeScreenTabs(userId, vendorId, appVersion),
                HomePageService.getExploreGamesWidgets(),
                HomePageService.getRecommendedRooms(req, userId, payinCustomerId, token, firstTimeDepositAmount),
                HomePageService.getOffersBanners(hasUserDepositedMoney, vendorId),
                HomePageService.getFeaturedTournamentsV2(req.internalRestClient, vendorId),
                HomePageService.getUserRoyaltyInfo(req.internalRestClient, userId, vendorId),
                HomePageService.getHotTournamentBanners(vendorId),
                HomePageService.getStoryRewindBanner(vendorId),
                HomePageService.getUserReferralInfo(req.internalRestClient, userId),
                HomePageService.getPslWidgetsBanners(vendorId),
                HomePageService.getLeaderboardInfo(req.internalRestClient, userId, vendorId),
            ];
            //  await on Promises to get settled
            const homePagePromisesResult = await (Promise as any).allSettled(homePagePromises);
            //  map results to individual widgets
            const [
                onlineUsersCountResult,
                homeScreenTabsResult,
                exploreGamesWidgetsResult,
                recommendedRoomsResult,
                offersBannersResult,
                featuredTournamentsResult,
                userRoyaltyInfoResult,
                hotTournamentBannersResult,
                storyRewindBannerResult,
                userReferralInfoResult,
                pslBannersResult,
                lbHomePageInfoResult,
            ] = homePagePromisesResult;
            //  get the actual results from PromiseResults with handling resolve & reject
            const onlineUsersCount = onlineUsersCountResult.status === 'fulfilled' ? onlineUsersCountResult.value : 0;
            const homeScreenTabs = homeScreenTabsResult.status === 'fulfilled' ? homeScreenTabsResult.value : {};
            const exploreGamesWidgets = exploreGamesWidgetsResult.status === 'fulfilled' ? exploreGamesWidgetsResult.value : {};
            const recommendedRooms = recommendedRoomsResult.status === 'fulfilled' ? recommendedRoomsResult.value : {};
            const offersBanners = offersBannersResult.status === 'fulfilled' ? offersBannersResult.value : {};
            const featuredTournaments = featuredTournamentsResult.status === 'fulfilled' ? featuredTournamentsResult.value : {};
            const userRoyaltyInfo = userRoyaltyInfoResult.status === 'fulfilled' ? userRoyaltyInfoResult.value : {};
            const hotTournamentBanners = hotTournamentBannersResult.status === 'fulfilled' ? hotTournamentBannersResult.value : {};
            const userReferralInfo = userReferralInfoResult.status === 'fulfilled' ? userReferralInfoResult.value : {};
            const storyRewindBanner = storyRewindBannerResult.status === 'fulfilled' ? storyRewindBannerResult.value : {};
            const pslBanners = pslBannersResult.status === 'fulfilled' ? pslBannersResult.value : {};
            const lbHomePageInfo = lbHomePageInfoResult.status === 'fulfilled' ? lbHomePageInfoResult.value : {};
            logger.info(`[Debug] userRoyaltyInfo :: ${JSON.stringify(userRoyaltyInfo)}`);
            //  create final home screen response
            let homeScreenWidgets: IHomeWidgets = {
                onlinePlayers: onlineUsersCount,
                widgets: await HomePageService.createHomeWidgets(exploreGamesWidgets, storyRewindBanner, recommendedRooms, pslBanners, featuredTournaments, lbHomePageInfo, userRoyaltyInfo, hotTournamentBanners, offersBanners, userReferralInfo),
                homeScreenTabs: homeScreenTabs,
            };
            return homeScreenWidgets;
        } catch (e) {
            logger.error(e, `[HomePageService] [getHomeScreenWidgets] Error :: `);
            throw e;
        }
    }


    static async getHomeScreenWidgetsV3(req: any, userId: number, firstTimeDepositAmount: number, payinCustomerId: string, token: string, appVersion: string): Promise<IHomeWidgets> {
        const vendorId: string = req?.vendorId;
        try {
            const hasUserDepositedMoney = firstTimeDepositAmount > 0;
            const vendorId: string = req.vendorId;
            //  Home Page promises
            const homePagePromises = [
                HomePageService.getOnlineUsersCount(req.internalRestClient, vendorId),
                HomePageService.getHomeScreenTabs(userId, vendorId, appVersion),
                HomePageService.getExploreGamesWidgets(),
                HomePageService.getRecommendedGroups(req, userId, payinCustomerId, firstTimeDepositAmount),
                HomePageService.getOffersBanners(hasUserDepositedMoney, vendorId),
                HomePageService.getFeaturedTournamentsV2(req.internalRestClient, vendorId),
                HomePageService.getUserRoyaltyInfo(req.internalRestClient, userId, vendorId),
                HomePageService.getHotTournamentBanners(vendorId),
                HomePageService.getStoryRewindBanner(vendorId),
                HomePageService.getUserReferralInfo(req.internalRestClient, userId),
                HomePageService.getPslWidgetsBanners(vendorId),
                HomePageService.getLeaderboardInfo(req.internalRestClient, userId, vendorId),
            ];
            //  await on Promises to get settled
            const homePagePromisesResult = await (Promise as any).allSettled(homePagePromises);
            //  map results to individual widgets
            const [
                onlineUsersCountResult,
                homeScreenTabsResult,
                exploreGamesWidgetsResult,
                recommendedRoomsResult,
                offersBannersResult,
                featuredTournamentsResult,
                userRoyaltyInfoResult,
                hotTournamentBannersResult,
                storyRewindBannerResult,
                userReferralInfoResult,
                pslBannersResult,
                lbHomePageInfoResult,
            ] = homePagePromisesResult;
            //  get the actual results from PromiseResults with handling resolve & reject
            const onlineUsersCount = onlineUsersCountResult.status === 'fulfilled' ? onlineUsersCountResult.value : 0;
            const homeScreenTabs = homeScreenTabsResult.status === 'fulfilled' ? homeScreenTabsResult.value : {};
            const exploreGamesWidgets = exploreGamesWidgetsResult.status === 'fulfilled' ? exploreGamesWidgetsResult.value : {};
            const recommendedRooms = recommendedRoomsResult.status === 'fulfilled' ? recommendedRoomsResult.value : {};
            const offersBanners = offersBannersResult.status === 'fulfilled' ? offersBannersResult.value : {};
            const featuredTournaments = featuredTournamentsResult.status === 'fulfilled' ? featuredTournamentsResult.value : {};
            const userRoyaltyInfo = userRoyaltyInfoResult.status === 'fulfilled' ? userRoyaltyInfoResult.value : {};
            const hotTournamentBanners = hotTournamentBannersResult.status === 'fulfilled' ? hotTournamentBannersResult.value : {};
            const userReferralInfo = userReferralInfoResult.status === 'fulfilled' ? userReferralInfoResult.value : {};
            const storyRewindBanner = storyRewindBannerResult.status === 'fulfilled' ? storyRewindBannerResult.value : {};
            const pslBanners = pslBannersResult.status === 'fulfilled' ? pslBannersResult.value : {};
            const lbHomePageInfo = lbHomePageInfoResult.status === 'fulfilled' ? lbHomePageInfoResult.value : {};
            logger.info(`[Debug] userRoyaltyInfo :: ${JSON.stringify(userRoyaltyInfo)}`);
            //  create final home screen response
            let homeScreenWidgets: IHomeWidgets = {
                onlinePlayers: onlineUsersCount,
                widgets: await HomePageService.createHomeWidgets(exploreGamesWidgets, storyRewindBanner, recommendedRooms, pslBanners, featuredTournaments, lbHomePageInfo, userRoyaltyInfo, hotTournamentBanners, offersBanners, userReferralInfo),
                homeScreenTabs: homeScreenTabs,
            };
            return homeScreenWidgets;
        } catch (e) {
            logger.error(e, `[HomePageService] [getHomeScreenWidgets] Error :: `);
            throw e;
        }
    }

    static async getHomeScreenWidgetsV4(req: any, userId: number, firstTimeDepositAmount: number, payinCustomerId: string, token: string, appVersion: string): Promise<IHomeWidgets> {
        try {
            const hasUserDepositedMoney = firstTimeDepositAmount > 0;
            const vendorId: string = req?.vendorId;
            //  Home Page promises
            const homePagePromises = [
                HomePageService.getOnlineUsersCount(req.internalRestClient, vendorId),
                HomePageService.getHomeScreenTabs(userId, vendorId, appVersion),
                HomePageService.getExploreGamesWidgetsV2ForVendor(vendorId),
                HomePageService.getRecommendedGroups(req, userId, payinCustomerId, firstTimeDepositAmount),
                HomePageService.getOffersBanners(hasUserDepositedMoney, vendorId),
                HomePageService.getFeaturedTournamentsV3(req.internalRestClient, vendorId),
                HomePageService.getUserRoyaltyInfo(req.internalRestClient, userId, vendorId),
                HomePageService.getHotTournamentBanners(vendorId),
                HomePageService.getStoryRewindBanner(vendorId),
                HomePageService.getUserReferralInfo(req.internalRestClient, userId),
                HomePageService.getPslWidgetsV2(req.internalRestClient, userId, vendorId),
                HomePageService.getLeaderboardInfo(req.internalRestClient, userId, vendorId),
            ];
            //  await on Promises to get settled
            const homePagePromisesResult = await (Promise as any).allSettled(homePagePromises);
            //  map results to individual widgets
            const [
                onlineUsersCountResult,
                homeScreenTabsResult,
                exploreGamesWidgetsResult,
                recommendedRoomsResult,
                offersBannersResult,
                featuredTournamentsResult,
                userRoyaltyInfoResult,
                hotTournamentBannersResult,
                storyRewindBannerResult,
                userReferralInfoResult,
                pslWidgetResult,
                lbHomePageInfoResult,
            ] = homePagePromisesResult;
            //  get the actual results from PromiseResults with handling resolve & reject
            const onlineUsersCount = onlineUsersCountResult.status === 'fulfilled' ? onlineUsersCountResult.value : 0;
            const homeScreenTabs = homeScreenTabsResult.status === 'fulfilled' ? homeScreenTabsResult.value : {};
            const exploreGamesWidgets = exploreGamesWidgetsResult.status === 'fulfilled' ? exploreGamesWidgetsResult.value : {};
            const recommendedRooms = recommendedRoomsResult.status === 'fulfilled' ? recommendedRoomsResult.value : {};
            const offersBanners = offersBannersResult.status === 'fulfilled' ? offersBannersResult.value : {};
            const featuredTournaments = featuredTournamentsResult.status === 'fulfilled' ? featuredTournamentsResult.value : {};
            const userRoyaltyInfo = userRoyaltyInfoResult.status === 'fulfilled' ? userRoyaltyInfoResult.value : {};
            const hotTournamentBanners = hotTournamentBannersResult.status === 'fulfilled' ? hotTournamentBannersResult.value : {};
            const userReferralInfo = userReferralInfoResult.status === 'fulfilled' ? userReferralInfoResult.value : {};
            const storyRewindBanner = storyRewindBannerResult.status === 'fulfilled' ? storyRewindBannerResult.value : {};
            const pslWidgets = pslWidgetResult.status === 'fulfilled' ? pslWidgetResult.value : {};
            const lbHomePageInfo = lbHomePageInfoResult.status === 'fulfilled' ? lbHomePageInfoResult.value : {};
            logger.info(`[Debug] userRoyaltyInfo :: ${JSON.stringify(userRoyaltyInfo)}`);

            //  create final home screen response
            let homeScreenWidgets: IHomeWidgets = {
                onlinePlayers: onlineUsersCount,
                pslConfig: {
                    isPslEnabled: PslService.getPslEnableStatus(userId, vendorId),
                    isTicketClaimed: pslWidgets?.items?.isTicketClaimed || false,
                },
                widgets: await HomePageService.createHomeWidgetsV2(exploreGamesWidgets, storyRewindBanner, lbHomePageInfo, pslWidgets, recommendedRooms, featuredTournaments, userRoyaltyInfo, hotTournamentBanners, offersBanners, userReferralInfo),
                homeScreenTabs: homeScreenTabs,
            };
            return homeScreenWidgets;
        } catch (e) {
            logger.error(e, `[HomePageService] [getHomeScreenWidgets] Error :: `);
            throw e;
        }
    }

    static async getPracticeHomeScreenWidgetsV2(req: any, userId: number, token: string): Promise<IHomeWidgets> {
        try {
            const vendorId: string = req.vendorId;
            //  Home Page promises
            const homePagePromises = [
                HomePageService.getPracticeAppOnlineUsersCount(req.internalRestClient, vendorId),
                HomePageService.getPracticeHomeScreenTabs(),
                HomePageService.getPracticeExploreGamesWidgets(),
                HomePageService.getPracticeOffersBanners(vendorId),
                HomePageService.getPracticeAppRewards(vendorId),
            ];
            //  await on Promises to get settled
            const homePagePromisesResult = await (Promise as any).allSettled(homePagePromises);
            //  map results to individual widgets
            const [
                onlineUsersCountResult,
                homeScreenTabsResult,
                exploreGamesWidgetsResult,
                offersBannersResult,
                rewardsResult
            ] = homePagePromisesResult;
            //  get the actual results from PromiseResults with handling resolve & reject
            const onlineUsersCount = onlineUsersCountResult.status === 'fulfilled' ? onlineUsersCountResult.value : 0;
            const homeScreenTabs = homeScreenTabsResult.status === 'fulfilled' ? homeScreenTabsResult.value : {};
            const exploreGamesWidgets = exploreGamesWidgetsResult.status === 'fulfilled' ? exploreGamesWidgetsResult.value : {};
            const offersBanners = offersBannersResult.status === 'fulfilled' ? offersBannersResult.value : {};
            const practiceAppRewards = rewardsResult.status === 'fulfilled' ? rewardsResult.value : {};
            logger.info(`[HomePageService] [getPracticeHomeScreenWidgetsV2] practiceAppRewards :: ${JSON.stringify(practiceAppRewards)}`);
            //  create final home screen response
            let homeScreenWidgets = {
                onlinePlayers: onlineUsersCount,
                widgets: await HomePageService.createPracticeHomeWidgets(exploreGamesWidgets, practiceAppRewards, offersBanners),
                homeScreenTabs: homeScreenTabs,
            };
            return homeScreenWidgets;
        } catch (e) {
            logger.error(`[HomePageService] [getPracticeHomeScreenWidgetsV2] Error :: ${JSON.stringify(e)}`);
            throw e;
        }
    }

    static async getRecommendedRooms(req: any, userId: number, payinCustomerId: string, token: string, _firstTimeDepositAmount?: number): Promise<any> {

        if (IsRecommendedRoomsV2Enable()) {
            return await HomePageService.getRecommendedRoomsV2(req, userId, payinCustomerId, _firstTimeDepositAmount);
        }
        const vendorId: string = req?.vendorId;
        logger.info(`[getRecommendedRooms] Request userId :: ${userId} `);
        let addCashTransaction, userCashGames, royaltyInfo;
        if (_firstTimeDepositAmount) {
            [userCashGames, royaltyInfo] = await (Promise as any).allSettled([ZodiacService.getUserCashGames(req.internalRestClient, userId), RoyaltyService.getRoyaltyHomeInfo(req.internalRestClient, userId)]);
        }
        else {
            [addCashTransaction, userCashGames, royaltyInfo] = await (Promise as any).allSettled([PayinService.getUserAddCashHistory({internalRestClient: req.internalRestClient}, payinCustomerId, 1, 1, TRANSACTIONS_SORTING_METHOD.ASC, vendorId), ZodiacService.getUserCashGames(req.internalRestClient, userId), RoyaltyService.getRoyaltyHomeInfo(req.internalRestClient, userId)]);
        }
        logger.info(`[getRecommendedRooms] AddCashTransaction :: ${JSON.stringify(addCashTransaction)} :: userCashGames :: ${JSON.stringify(userCashGames)} :: royaltyInfo :: ${JSON.stringify(royaltyInfo)} :: firstTimeDepositAmount :: ${JSON.stringify(_firstTimeDepositAmount)} `);
        const firstTimeDepositAmount = _firstTimeDepositAmount ?? HomeUtil.getFTDAmount(addCashTransaction?.value);
        const frequentlyJoinRoomId = HomeUtil.getFrequentlyJoinedRoomId(userCashGames?.value?.rooms)
        const lastJoinedRoomId = HomeUtil.getRecentlyJoinedRoomId(userCashGames?.value?.rooms)
        const isRakeGenerated = royaltyInfo?.value && royaltyInfo?.value?.totalCoinGenerated > 0 ? true : false
        logger.info(`[getRecommendedRooms] firstTimeDepositAmount :: ${JSON.stringify(firstTimeDepositAmount)} :: frequentlyJoinRoomId :: ${JSON.stringify(frequentlyJoinRoomId)} :: lastJoinedRoomId :: ${JSON.stringify(lastJoinedRoomId)} rakeGeneratedInfo :: ${JSON.stringify(isRakeGenerated)} `);
        const _recommendedRooms = await GsService.getRecommendedRooms(req.internalRestClient, userId, firstTimeDepositAmount, isRakeGenerated, frequentlyJoinRoomId, lastJoinedRoomId, token, vendorId);
        logger.info(`[getRecommendedRooms] Response userId :: ${userId} recommendedRooms :: ${JSON.stringify(_recommendedRooms)}`);
        const recommendedRooms: IRoom[] = HomeUtil.getRoomsData(_recommendedRooms)
        const recommendedRoomsResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.RECOMMENDED_GAMES.title,
            key: HOME_SCREEN_WIDGETS.RECOMMENDED_GAMES.key,
            items: recommendedRooms
        }
        logger.info(`[getRecommendedRooms] Response userId :: ${userId} recommendedRooms :: ${JSON.stringify(recommendedRoomsResp)}`);
        return recommendedRoomsResp;

    }

    static async getRecommendedRoomsV2(req: any, userId: number, payinCustomerId: string, _firstTimeDepositAmount?: number): Promise<any> {
        const vendorId: string = req?.vendorId;
        const [addCashTransaction, rooms] = await (Promise as any).allSettled([PayinService.getUserAddCashHistory({internalRestClient: req.internalRestClient}, payinCustomerId, 1, 1, TRANSACTIONS_SORTING_METHOD.ASC, vendorId), AriesService.getRooms(req.internalRestClient, `${userId}`)]);
        logger.info(`[getRecommendedRoomsV2] AddCashTransaction :: ${JSON.stringify(addCashTransaction)} :: rooms :: ${JSON.stringify(rooms)} `);
        const firstTimeDepositAmount = _firstTimeDepositAmount ?? HomeUtil.getFTDAmount(addCashTransaction?.value);
        const requestBody: GetRecommendedRoomsRequest = HomeUtil.getRecommendedRoomRequest(rooms?.value, firstTimeDepositAmount);
        const response: Room[] = await ZodiacService.getRecommendedRooms(req.internalRestClient, userId, requestBody);
        logger.info(`[getRecommendedRoomsV2] Response userId :: ${userId} recommendedRooms :: ${JSON.stringify(response)}`);
        const recommendedRooms: IRoom[] = HomeUtil.getRoomsData(response);
        const recommendedRoomsResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.RECOMMENDED_GAMES.title,
            key: HOME_SCREEN_WIDGETS.RECOMMENDED_GAMES.key,
            items: recommendedRooms
        }

        return recommendedRoomsResp;
    }

    static async getRecommendedGroups(req: any, userId: number, payinCustomerId: string, _firstTimeDepositAmount?: number): Promise<any> {
        const vendorId: string = req?.vendorId;
        const [addCashTransaction, groups] = await (Promise as any).allSettled([PayinService.getUserAddCashHistory({internalRestClient: req.internalRestClient}, payinCustomerId, 1, 1, TRANSACTIONS_SORTING_METHOD.ASC, vendorId), AriesService.getGroups(req.internalRestClient, `${userId}`)]);
        logger.info(`[getRecommendedGroups] AddCashTransaction :: ${JSON.stringify(addCashTransaction)} :: rooms :: ${JSON.stringify(groups)} `);
        const firstTimeDepositAmount = _firstTimeDepositAmount ?? HomeUtil.getFTDAmount(addCashTransaction?.value);
        const requestBody: GetRecommendedGroupsRequest = HomeUtil.getRecommendedGroupsRequest(groups?.value, firstTimeDepositAmount);
        const response: Group[] = await ZodiacService.getRecommendedGroups(req.internalRestClient, userId, requestBody);
        logger.info(`[getRecommendedGroups] Response userId :: ${userId} recommendedGroups :: ${JSON.stringify(response)}`);
        const recommendedGroups: IGroup[] = HomeUtil.getGroupsData(response);
        const recommendedGroupsResp: IWidgets = {
            title: HOME_SCREEN_WIDGETS.RECOMMENDED_GAMES.title,
            key: HOME_SCREEN_WIDGETS.RECOMMENDED_GAMES.key,
            items: recommendedGroups
        }

        return recommendedGroupsResp;
    }

    static async getPracticeAppDcsWidget(req: any, userId: string, token: string): Promise<any> {
        try {
            const vendorId: string = req.vendorId;

            const staticRewardData = getPracticeAppRewards()[vendorId];
            const walletDetails = await SupernovaService.getBalanceV2(req.internalRestClient, userId, token, Number(vendorId));
            logger.info(`[HomePageService] [getPracticeAppDcsWidget] walletDetails : ${JSON.stringify(walletDetails)}`);

            let isRakeGenerated: boolean = false;
            const debitRakeTransactions = await SupernovaService.getHandDebitRakeTransaction(req, userId, Number(vendorId));
            if (debitRakeTransactions && debitRakeTransactions.length > 0) {
                isRakeGenerated = true;
            }

            const dcsLimit = await PracticeAppRewardClient.checkDcsLimit(req.internalRestClient, Number(userId), vendorId) || false;
            let practiceAppRewardData: PracticeAppDcsWidget = {}
            practiceAppRewardData.dcEarned = walletDetails.discountCreditBalance;
            practiceAppRewardData.handsPerDc = staticRewardData?.handsPerDc;
            practiceAppRewardData.maxDcLimit = staticRewardData?.maxDcLimit;
            practiceAppRewardData.isRakeGenerated = isRakeGenerated;
            practiceAppRewardData.isDcLimitReached = dcsLimit?.isMaxDcLimitReached;

            return practiceAppRewardData;
        } catch (e) {
            logger.error(`[HomePageService] [getPracticeAppDcsWidget] Error :: ${JSON.stringify(e)}`);
            throw e;
        }
    }
};
