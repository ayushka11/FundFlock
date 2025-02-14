import HomePageService from "../services/homePageService";
import LoggerUtil, {ILogger} from "../utils/logger";
import ResponseUtil from "../utils/response-util";
import PayinService from "../services/payinService";
import {TRANSACTIONS_SORTING_METHOD} from "../constants/payin-constants";
import HomeUtil from "../utils/home-util";
import {HOME_SCREEN_WIDGETS} from "../constants/constants";

const restHelper = require("../helpers/restHelper");

const logger: ILogger = LoggerUtil.get("HomeController");
const configService = require('../services/configService');

export default class HomeController {

    static getHomeScreenWidgets = async (req, res, next) => {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const payinCustomerId: string = req?.sessionManager?.getPayinCustomerId();
            const token = req?.cookieManager?.getToken();
            let appVersion;
            if (req.headers.hasOwnProperty("gk-app-version-name")) {
                appVersion = req.headers["gk-app-version-name"]
            }

            const userTransaction = await PayinService.getUserAddCashHistory(req, payinCustomerId, 1, 1, TRANSACTIONS_SORTING_METHOD.ASC, vendorId);
            logger.info(`[HomeController] [getHomeScreenWidgets] Request userId :: ${userId} userTransaction :: ${JSON.stringify(userTransaction)}`);
            const firstTimeDepositAmount = HomeUtil.getFTDAmount(userTransaction);
            logger.info(`[HomeController] [getHomeScreenWidgets] equest userId :: ${userId} firstTimeDepositAmount :: ${JSON.stringify(firstTimeDepositAmount)}`);
            const homeScreenWidgets = await HomePageService.getHomeScreenWidgets(req, userId, firstTimeDepositAmount, payinCustomerId, token, appVersion);
            logger.info(`[HomeController] [getHomeScreenWidgets] Response userId :: ${userId} homeScreenWidgets :: ${JSON.stringify(homeScreenWidgets)}`);
            ResponseUtil.sendSuccessResponse(res, homeScreenWidgets);
        } catch (e) {
            logger.error(e,`[HomeController] [getHomeScreenWidgets] Error ::`);
            next(e);
        }
    }

    static getHomeScreenWidgetsV2 = async (req, res, next) => {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const payinCustomerId: string = req?.sessionManager?.getPayinCustomerId();
            const token = req?.cookieManager?.getToken();
            let appVersion;
            if (req.headers.hasOwnProperty("gk-app-version-name")) {
                appVersion = req.headers["gk-app-version-name"]
            }
            const userTransaction = await PayinService.getUserAddCashHistory(req, payinCustomerId, 1, 1, TRANSACTIONS_SORTING_METHOD.ASC, vendorId);
            logger.info(`[HomeController] [getHomeScreenWidgetsV2] Request userId :: ${userId} userTransaction :: ${JSON.stringify(userTransaction)}`);
            const firstTimeDepositAmount = HomeUtil.getFTDAmount(userTransaction);
            logger.info(`[HomeController] [getHomeScreenWidgetsV2] equest userId :: ${userId} firstTimeDepositAmount :: ${JSON.stringify(firstTimeDepositAmount)}`);
            const homeScreenWidgets = await HomePageService.getHomeScreenWidgetsV2(req, userId, firstTimeDepositAmount, payinCustomerId, token, appVersion);
            logger.info(`[HomeController] [getHomeScreenWidgetsV2] Response userId :: ${userId} homeScreenWidgets :: ${homeScreenWidgets}`);
            ResponseUtil.sendSuccessResponse(res, homeScreenWidgets);
        } catch (e) {
            logger.error(e,`[HomeController] [getHomeScreenWidgetsV2] Error ::`);
            next(e);
        }
    }

    static getHomeScreenWidgetsV3 = async (req, res, next) => {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const payinCustomerId: string = req?.sessionManager?.getPayinCustomerId();
            const token = req?.cookieManager?.getToken();
            let appVersion;
            if (req.headers.hasOwnProperty("gk-app-version-name")) {
                appVersion = req.headers["gk-app-version-name"]
            }
            const userTransaction = await PayinService.getUserAddCashHistory(req, payinCustomerId, 1, 1, TRANSACTIONS_SORTING_METHOD.ASC, vendorId);
            logger.info(`[HomeController] [getHomeScreenWidgetsV3] Request userId :: ${userId} userTransaction :: ${JSON.stringify(userTransaction)}`);
            const firstTimeDepositAmount = HomeUtil.getFTDAmount(userTransaction);
            logger.info(`[HomeController] [getHomeScreenWidgetsV3] equest userId :: ${userId} firstTimeDepositAmount :: ${JSON.stringify(firstTimeDepositAmount)}`);
            const homeScreenWidgets = await HomePageService.getHomeScreenWidgetsV3(req, userId, firstTimeDepositAmount, payinCustomerId, token, appVersion);
            logger.info(`[HomeController] [getHomeScreenWidgetsV3] Response userId :: ${userId} homeScreenWidgets :: ${homeScreenWidgets}`);
            ResponseUtil.sendSuccessResponse(res, homeScreenWidgets);
        } catch (e) {
            logger.error(e,`[HomeController] [getHomeScreenWidgetsV3] Error ::`);
            next(e);
        }
    }

    static getHomeScreenWidgetsV4 = async (req, res, next) => {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const payinCustomerId: string = req?.sessionManager?.getPayinCustomerId();
            const token = req?.cookieManager?.getToken();
            let appVersion;
            if (req.headers.hasOwnProperty("gk-app-version-name")) {
                appVersion = req.headers["gk-app-version-name"]
            }            
            const userTransaction = await PayinService.getUserAddCashHistory(req, payinCustomerId, 1, 1, TRANSACTIONS_SORTING_METHOD.ASC, vendorId);
            logger.info(`[HomeController] [getHomeScreenWidgetsV4] Request userId :: ${userId} userTransaction :: ${JSON.stringify(userTransaction)}`);
            const firstTimeDepositAmount = HomeUtil.getFTDAmount(userTransaction);
            logger.info(`[HomeController] [getHomeScreenWidgetsV4] equest userId :: ${userId} firstTimeDepositAmount :: ${JSON.stringify(firstTimeDepositAmount)}`);
            const homeScreenWidgets = await HomePageService.getHomeScreenWidgetsV4(req, userId, firstTimeDepositAmount, payinCustomerId, token, appVersion);
            logger.info(`[HomeController] [getHomeScreenWidgetsV4] Response userId :: ${userId} homeScreenWidgets :: ${homeScreenWidgets}`);
            ResponseUtil.sendSuccessResponse(res, homeScreenWidgets);
        } catch (e) {
            logger.error(e,`[HomeController] [getHomeScreenWidgetsV4] Error ::`);
            next(e);
        }
    }

    static getPracticeHomeScreenWidgetsV2 = async (req, res, next) => {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const token = req?.cookieManager?.getToken();
            logger.info(`[HomeController] [getPracticeHomeScreenWidgetsV2] Request userId :: ${userId} vendorId :: ${JSON.stringify(vendorId)}`);
            const homeScreenWidgets = await HomePageService.getPracticeHomeScreenWidgetsV2(req, userId,token);
            logger.info(`[HomeController] [getPracticeHomeScreenWidgetsV2] Response userId :: ${userId} homeScreenWidgets :: ${homeScreenWidgets}`);
            ResponseUtil.sendSuccessResponse(res, homeScreenWidgets);
        } catch (e) {
            logger.error(`[HomeController] [getPracticeHomeScreenWidgetsV2] Error :: ${JSON.stringify(e)}`);
        }
    }

    static getOnlineUsersCount = async (req, res, next) => {
        try {
            const vendorId: string = req.vendorId;
            logger.info(`[HomeController] [getOnlineUsersCount] Request vendorId :: ${vendorId}`);
            const onlineUsersCount = await HomePageService.getOnlineUsersCount(req.internalRestClient, vendorId);
            const onlineUsersCountResp: any = {
                onlinePlayers: onlineUsersCount
            }
            logger.info(`[HomeController] [getOnlineUsersCount] Response vendorId :: ${vendorId} onlineUsersCountResp :: ${onlineUsersCountResp}`);
            ResponseUtil.sendSuccessResponse(res, onlineUsersCountResp);
        } catch (e) {
            logger.error(e,`[HomeController] [getOnlineUsersCount] Error ::`);
            next(e);
        }
    }

    static getRecommendedRooms = async (req, res, next) => {
        try {
            const userId: number = req?.sessionManager?.getLoggedInUserId();
            const payinCustomerId: string = req?.sessionManager?.getPayinCustomerId();
            const token = req?.cookieManager?.getToken();
            logger.info(`[HomeController] [getRecommendedRooms] Request userId :: ${userId} `);
            const recommendedRooms = await HomePageService.getRecommendedRooms(req, userId, payinCustomerId, token);
            const recommendedRoomsResp: any = {
                title: HOME_SCREEN_WIDGETS.RECOMMENDED_GAMES.title,
                items: recommendedRooms?.items
            };
            logger.info(`[HomeController] [getRecommendedRooms] Response userId :: ${userId} recommendedRooms :: ${JSON.stringify(recommendedRoomsResp)}`);
            ResponseUtil.sendSuccessResponse(res, recommendedRoomsResp);
        } catch (e) {
            logger.error(e, `[getRecommendedRooms] error `,)
            next(e);
        }
    }

    static getRecommendedGroups = async (req, res, next) => {
        try {
            const userId: number = req?.sessionManager?.getLoggedInUserId();
            const payinCustomerId: string = req?.sessionManager?.getPayinCustomerId();
            const token = req?.cookieManager?.getToken();
            logger.info(`[HomeController] [getRecommendedGroups] Request userId :: ${userId} `);
            const recommendedGroups = await HomePageService.getRecommendedGroups(req, userId, payinCustomerId);
            const recommendedGroupsResp: any = {
                title: HOME_SCREEN_WIDGETS.RECOMMENDED_GAMES.title,
                items: recommendedGroups?.items
            };
            logger.info(`[HomeController] [getRecommendedGroups] Response userId :: ${userId} recommendedGroups :: ${JSON.stringify(recommendedGroupsResp)}`);
            ResponseUtil.sendSuccessResponse(res, recommendedGroupsResp);
        } catch (e) {
            logger.error(e, `[getRecommendedRooms] error `,)
            next(e);
        }
    }

    static getPracticeAppLearnPoker = async (req,res,next) => {
        try{
            const vendorId: string = req.vendorId;
            logger.info(`[HomeController] [getPracticeAppLearnPoker] vendorId :: ${vendorId} `);
            const learnPoker: any = configService.getLearnPokerForVendor();
            const resp = learnPoker[vendorId];
            logger.info(resp, `[HomeController] [getPracticeAppLearnPoker] Response `);
            return ResponseUtil.sendSuccessResponse(res, resp);
        }catch(e){
            logger.error(e, `[HomeController] [getPracticeAppLearnPoker] error `,);
            next(e);
        }
    }

    static getPracticeAppDcsWidget = async (req,res,next) => {
        try{
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const token = req?.cookieManager?.getToken();
            logger.info(`[HomeController] [getPracticeAppDcsWidget] Request userId :: ${userId} vendorId :: ${JSON.stringify(vendorId)}`);
            const resp = await HomePageService.getPracticeAppDcsWidget(req, userId,token);
            logger.info(`[HomeController] [getPracticeAppDcsWidget] Response userId :: ${userId} resp :: ${resp}`);
            ResponseUtil.sendSuccessResponse(res, resp);
        }catch(e){
            logger.error(e, `[HomeController] [getPracticeAppDcsWidget] error `,);
            next(e);
        }
    }

};
