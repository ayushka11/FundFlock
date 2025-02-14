import AppApiConfig from '../models/app-api-config';
import AppLogsConfig from '../models/app-logs-config';
import AppUpdateConfig from '../models/app-update-config';
import AppConfigService from '../services/appConfigService';
import AppDowntimeConfig from '../models/app-downtime-config';
import AppPollingConfig from '../models/app-polling-config';
import LoggerUtil, {ILogger} from '../utils/logger';
import ResponseUtil from "../utils/response-util";
import RoyaltyService from '../services/royaltyService';
import { RoyaltyUserHomeInfo } from '../models/royalty/response';
import { ROYALTY_VERSION } from '../constants/royalty-constants'

const configService = require('../services/configService');
const logger: ILogger = LoggerUtil.get("AppController");

export default class AppController {

    static async getAppConfig(req, res, next): Promise<any> {
        try {
            const headers = req?.headers;

            let appVersion: string = '';
            let androidVersion: string = '';
            if (req.headers.hasOwnProperty("gk-app-version-name")) {
                appVersion = req.headers["gk-app-version-name"]
            }

            if (req.headers.hasOwnProperty("gk-android-version")) {
                androidVersion = req.headers["gk-android-version"];
            }

            let platform: string = ''
            if (headers.hasOwnProperty("gk-platform")) {
                platform = headers["gk-platform"]
            }

            const vendorId: string = req.vendorId;

            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const userId: number = req.sessionManager.getLoggedInUserId()

            logger.info(`[AppController] [getAppUpdateConfig] userUniqueId = ${userUniqueId} vendorId = ${vendorId}, appVersion = ${appVersion}, platform = ${platform}`);

            const appUpdateConfig: AppUpdateConfig = await AppConfigService.getAppUpdateConfig(req.internalRestClient, userUniqueId, vendorId, appVersion, platform);
            const appLogsConfig: AppLogsConfig = AppConfigService.getAppLogsConfig(userUniqueId, vendorId, appVersion, platform);
            const appDowntimeConfig: AppDowntimeConfig = AppConfigService.getAppDowntimeConfig(userUniqueId, vendorId, appVersion, platform);
            const appApiConfig: AppApiConfig = AppConfigService.getAppApiConfig(userUniqueId, vendorId, appVersion, platform);
            const appPollingConfig: AppPollingConfig = AppConfigService.getAppPollingConfig(userUniqueId, vendorId, appVersion, platform);
            const leaderboardFeatureConfig = AppConfigService.getLeaderboardFeatureEnabledStatus(appVersion, vendorId);
            if (androidVersion == '8') {
                appUpdateConfig.isUpdateAvailable = false;
            }
            const resp = {
                appPollingConfig,
                appUpdateConfig: appUpdateConfig,
                appLogsConfig: appLogsConfig,
                appDowntimeConfig: appDowntimeConfig,
                appApiConfig: appApiConfig,
                leaderboardConfig: {isEnabled: leaderboardFeatureConfig}
            }

            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getPracticeAppConfig(req, res, next): Promise<any> {
        try {
            const headers = req?.headers;

            let appVersion: string = '';
            if (req.headers.hasOwnProperty("gk-app-version-name")) {
                appVersion = req.headers["gk-app-version-name"]
            }

            let platform: string = ''
            if (headers.hasOwnProperty("gk-platform")) {
                platform = headers["gk-platform"]
            }

            const vendorId: string = req.vendorId;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            logger.info(`[AppController] [getPracticeAppConfig] userUniqueId = ${userUniqueId} vendorId = ${vendorId}, appVersion = ${appVersion}, platform = ${platform}`);

            const appUpdateConfig: AppUpdateConfig = await AppConfigService.getPracticeAppUpdateConfig(req.internalRestClient, userUniqueId, vendorId, appVersion, platform);
            const appLogsConfig: AppLogsConfig = AppConfigService.getPracticeAppLogsConfig(userUniqueId, vendorId, appVersion, platform);
            const appDowntimeConfig: AppDowntimeConfig = AppConfigService.getPracticeAppDowntimeConfig(userUniqueId, vendorId, appVersion, platform);
            const appApiConfig: AppApiConfig = AppConfigService.getPracticeAppApiConfig(userUniqueId, vendorId, appVersion, platform);
            const appPollingConfig: AppPollingConfig = AppConfigService.getPracticeAppPollingConfig(userUniqueId, vendorId, appVersion, platform);

            const resp = {
                appUpdateConfig,
                appPollingConfig,
                appLogsConfig: appLogsConfig,
                appDowntimeConfig: appDowntimeConfig,
                appApiConfig: appApiConfig,
            }

            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getRNGConfig(req, res, next): Promise<any> {
        try {
            const vendorId: string = req.vendorId;
            const rngCertificateConfig: any = configService.getRNGCertificateConfigForVendor();
            const resp = rngCertificateConfig[vendorId];
            logger.info(resp, `[AppController] [getRNGConfig] Response `);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }
}
