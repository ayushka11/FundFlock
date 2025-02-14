import { compareVersions } from 'compare-versions';
import AppApiConfig from '../models/app-api-config';
import AppLogsConfig from '../models/app-logs-config';
import AppUpdateConfig from '../models/app-update-config';
import AppDowntimeConfig from '../models/app-downtime-config';
import AppPollingConfig from '../models/app-polling-config';
import LoggerUtil, { ILogger } from '../utils/logger';
import Parser from '../utils/parser';
import {
    getAppApiConfigForVendor,
    getAppConfigPollingVendor,
    getAppLogsConfigForPlatformForVendor,
    getDefaultAppUpdateConfigForPlatformForVendor,
    getNewAppReleaseConfigForPlatformForVendor,
    getAppDowntimeConfigForVendor,
    getDefaultPracticeAppUpdateConfigForPlatformForVendor,
    getNewPracticeAppReleaseConfigForPlatformForVendor,
    getPracticeAppLogsConfigForPlatformForVendor,
    getPracticeAppDowntimeConfigForVendor,
    getPracticeAppApiConfigForVendor,
    getPracticeAppConfigPollingVendor,
    getLeaderboardFeatureConfigByVendor
} from './configService';
import { RoyaltyUserHomeInfo } from '../models/royalty/response';
import RoyaltyService from './royaltyService';
import { ROYALTY_VERSION } from '../constants/royalty-constants';
import {AppUpdateType} from "../models/enums/app-update-type";

const logger: ILogger = LoggerUtil.get("AppConfigService");

export default class AppConfigService {
    static async getAppUpdateConfig(restClient:any, userUniqueId: string, vendorId: string, userAppVersion: string, platform: string): Promise<AppUpdateConfig> {
        try {
            logger.info(`[getAppUpdateConfig] userUniqueId = ${userUniqueId}, vendorId = ${vendorId}, userAppVersion = ${userAppVersion}, platform = ${platform}`);
            const updateDisabledConfig: AppUpdateConfig = { isUpdateAvailable: false };
            if(userUniqueId == '' || userAppVersion == '' || platform == '') {
                return updateDisabledConfig;
            }

            const defaultAppUpdateConfigForPlatform = getDefaultAppUpdateConfigForPlatformForVendor()[vendorId];
            logger.info(`[getAppUpdateConfig] defaultAppUpdateConfigForPlatform = ${JSON.stringify(defaultAppUpdateConfigForPlatform)}`);

            const defaultAppUpdateConfig: AppUpdateConfig = defaultAppUpdateConfigForPlatform[platform];

            // Check if there is a new app release available
            const newAppReleaseConfig = getNewAppReleaseConfigForPlatformForVendor()[vendorId];
            const newAppReleaseConfigForPlatform = newAppReleaseConfig[platform];
            const newAppVersion: string = newAppReleaseConfigForPlatform['version'] || '';

            // Checking if the user is using app older than base app version
            const baseAppVersion: string = newAppReleaseConfig['baseAppVersion'] || '';
            if(baseAppVersion != '' && compareVersions(userAppVersion, baseAppVersion) === -1) {
                // User must update this app
                // Sending mandatory update to the user
                const updateConfig: AppUpdateConfig = newAppReleaseConfigForPlatform['updateConfig'];
                return {
                    ...updateConfig,
                    isUpdateAvailable: true,
                    updateType: AppUpdateType.MANDATORY,
                }
            }

            logger.info(`[getAppUpdateConfig] newAppReleaseConfigForPlatform = ${JSON.stringify(newAppReleaseConfigForPlatform)}, newAppVersion = ${newAppVersion}`);
            const userId: number = Parser.parseNumber(userUniqueId.split("_")[1]);

            // If user has an older app
            if(newAppVersion != '' && compareVersions(userAppVersion, newAppVersion) === -1) {
                if (newAppReleaseConfig.enableRoyaltyV2Upgrade && compareVersions(userAppVersion, newAppReleaseConfig?.baseRoyaltyV2App) == -1){
                    const royaltyUserVersion: string = await AppConfigService.getRoyaltyUserVersion(restClient, userId);
                    if (royaltyUserVersion === ROYALTY_VERSION.V2){
                        const updateConfig: AppUpdateConfig = newAppReleaseConfigForPlatform['updateConfig'];
                        // Sending mandatory update to the user
                        const response: AppUpdateConfig = {
                            ...updateConfig,
                            isUpdateAvailable: true,
                            updateType: AppUpdateType.MANDATORY,
                        }
                        logger.info(`[getAppUpdateConfig] RoyaltyVersion V2 returning newAppRelease response = ${JSON.stringify(response)}`);
                        return response;
                    }
                    // If user satisfies the rollout criterion
                    const newAppRollout: number = newAppReleaseConfigForPlatform['rollout'] || -1;
                    logger.info(`[getAppUpdateConfig] newAppRelease userUniqueId = ${userUniqueId}, newAppRollout = ${newAppRollout}`);
                    if((userId % 100) <= newAppRollout) {
                        AppConfigService.upgradeUserRoyaltyVersion(restClient, userId);
                        const response: AppUpdateConfig = newAppReleaseConfigForPlatform['updateConfig'];
                        logger.info(`[getAppUpdateConfig] returning newAppRelease response = ${JSON.stringify(response)}`);
                        return response;
                    }
                } else {
                    // If user satisfies the rollout criterion
                    const newAppRollout: number = newAppReleaseConfigForPlatform['rollout'] || -1;
                    logger.info(`[getAppUpdateConfig] newAppRelease userUniqueId = ${userUniqueId}, newAppRollout = ${newAppRollout}`);
                    if((userId % 100) <= newAppRollout) {
                        const response: AppUpdateConfig = newAppReleaseConfigForPlatform['updateConfig'];
                        logger.info(`[getAppUpdateConfig] returning newAppRelease response = ${JSON.stringify(response)}`);
                        return response;
                    }
                }
            }

            // if User has moved to New App and there is Auto Login
            const baseRoyaltyV2App = newAppReleaseConfig?.baseRoyaltyV2App
            if(baseRoyaltyV2App != '' && compareVersions(userAppVersion, baseRoyaltyV2App) >= 0) {
                logger.info(`Updating Royalty Version to V2 baseRoyaltyV2App = ${baseRoyaltyV2App}, userAppVersion = ${userAppVersion}`);
                AppConfigService.upgradeUserRoyaltyVersion(restClient, userId);
            }

            logger.info(`[getAppUpdateConfig] returning defaultAppUpdateConfig = ${JSON.stringify(defaultAppUpdateConfig)}`);
            return defaultAppUpdateConfig;
        } catch (error: any) {
            logger.error( `[getAppUpdateConfig] error :: `, error);
            throw error;
        }
    }

    static getAppLogsConfig(userUniqueId: string, vendorId: string, userAppVersion: string, platform: string): AppLogsConfig {
        try {
            logger.info(`[getAppLogsConfig] userUniqueId = ${userUniqueId}, vendorId = ${vendorId}, userAppVersion = ${userAppVersion}, platform = ${platform}`);

            const appLogsConfigForPlatform = getAppLogsConfigForPlatformForVendor()[vendorId];

            logger.info(`[getAppLogsConfig] appLogsConfigForPlatform = ${JSON.stringify(appLogsConfigForPlatform)}`);

            const appLogsConfig: AppLogsConfig = appLogsConfigForPlatform[platform];

            logger.info(`[AppConfigService] [getAppLogsConfig] appLogsConfig = ${JSON.stringify(appLogsConfig)}`);

            if(!appLogsConfig) {
               return {
                   sendLogsToBackend: false,
                   sendRequestLog: false,
                   sendErrorLog : false,
                   sendCatchLog : false,
               }
            }

            return appLogsConfig;
        } catch (error: any) {
            logger.error( `[getAppLogsConfig] error :: `, error);
            throw error;
        }
    }
    static getAppDowntimeConfig(userUniqueId: string, vendorId: string, userAppVersion: string, platform: string ): AppDowntimeConfig {
        try {
            logger.info(`[AppConfigService] [getAppDowntimeConfig] userUniqueId = ${userUniqueId}, vendorId = ${vendorId}, userAppVersion = ${userAppVersion}, platform = ${platform}`);

            const appDowntimeConfig: AppDowntimeConfig = getAppDowntimeConfigForVendor()[vendorId];

            logger.info(`[AppConfigService] [getAppDowntimeConfig] appDowntimeConfig = ${JSON.stringify(appDowntimeConfig)}`);

            return appDowntimeConfig;

        } catch (error: any) {
            logger.error(`[AppConfigService] [getAppDowntimeConfig] error :: `, error);
        }
    }

    static getAppApiConfig(userUniqueId: string, vendorId: string, userAppVersion: string, platform: string): AppApiConfig{
        try {
            logger.info(`[getAppApiConfig] userUniqueId = ${userUniqueId}, vendorId = ${vendorId}, userAppVersion = ${userAppVersion}, platform = ${platform}`);
            const appApiConfig: AppApiConfig = getAppApiConfigForVendor()[vendorId];
            logger.info(`[getAppApiConfig] appApiConfig = ${JSON.stringify(appApiConfig)}`);

            return appApiConfig;
        } catch (error: any) {
            logger.error( `[getAppApiConfig] error :: `, error);
            throw error;
        }
    }

    static getAppPollingConfig(userUniqueId: string, vendorId: string, userAppVersion: string, platform: string): AppPollingConfig {
        try {
            logger.info(`[getAppPollingConfig] userUniqueId = ${userUniqueId}, vendorId = ${vendorId}, userAppVersion = ${userAppVersion}, platform = ${platform}`);
            const appPollingConfig: AppPollingConfig = getAppConfigPollingVendor()[vendorId];
            logger.info(`[getAppPollingConfig] appPollingConfig = ${JSON.stringify(appPollingConfig)}`);

            return appPollingConfig;
        } catch (error: any) {
            logger.error( `[getAppPollingConfig] error :: `, error);
            throw error;
        }
    }

    static async getRoyaltyUserVersion(restClient, userId):Promise<string> {
        let royaltyUserHomeInfo: RoyaltyUserHomeInfo = null;
        try {
            royaltyUserHomeInfo = await RoyaltyService.getRoyaltyHomeInfo(restClient, userId);
        } catch (e) {
            logger.error(e,'royaltyUserHomeInfo, error');
        }
        if (royaltyUserHomeInfo && royaltyUserHomeInfo.royaltyVersion === ROYALTY_VERSION.V2){
            return  ROYALTY_VERSION.V2
        } else {
            return ROYALTY_VERSION.V1
        }
    }

    static async upgradeUserRoyaltyVersion(restClient, userId):Promise<any>{
        try {
            const updateUserRoyaltyVersion: any =  await RoyaltyService.upgradeUserRoyaltyVersion(restClient, userId);
            logger.info(`[getAppPollingConfig] updateUserRoyaltyVersion = ${JSON.stringify(updateUserRoyaltyVersion)}`);
            return updateUserRoyaltyVersion
        } catch (e) {
            logger.error(e,'updateUserRoyaltyVersion, error');
            return
        }


    }

    static isUserAppUpgradedToNewGS(req): boolean {
        const vendorId: string = req?.vendorId;
        let userAppVersion: string = '';
        const userId: number = req.sessionManager.getLoggedInUserId() || -1;
        if (req.headers.hasOwnProperty("gk-app-version-name")) {
            userAppVersion = req.headers["gk-app-version-name"]
        }
        const newAppReleaseConfig = getNewAppReleaseConfigForPlatformForVendor()[vendorId];
        const baseAriesUpgradeApp = newAppReleaseConfig?.baseAriesUpgradeApp;
        const baseAriesVersionForUserFilter = "10.0.0";
        const ariesUserFilter = newAppReleaseConfig?.ariesUserFilter || [];
        logger.info(`baseAriesUpgradeApp = ${baseAriesUpgradeApp}, userAppVersion = ${userAppVersion}, ariesUserFilter = ${JSON.stringify(ariesUserFilter)}, baseAriesVersionForUserFilter = ${baseAriesVersionForUserFilter}`);
        if(baseAriesUpgradeApp != '' && compareVersions(userAppVersion, baseAriesUpgradeApp) >= 0) {
            return true
        } else if ( (baseAriesUpgradeApp != '' && compareVersions(userAppVersion, baseAriesVersionForUserFilter) >= 0 )
                    &&  (ariesUserFilter && ariesUserFilter.includes(userId)) ) {
            return true
        }

        return false
    }

    static plo6CompaitableApp(req): boolean {
        let userAppVersion: string = '';
        if (req.headers.hasOwnProperty("gk-app-version-name")) {
            userAppVersion = req.headers["gk-app-version-name"]
        }
        const baseAriesVersionForPlo6 = "10.2.0";
        logger.info(`baseAriesVersionForPlo6 = ${baseAriesVersionForPlo6}, userAppVersion = ${userAppVersion}`);
        return compareVersions(userAppVersion, baseAriesVersionForPlo6) >= 0;

    }

    // Practice App Configs
    static async getPracticeAppUpdateConfig(restClient:any, userUniqueId: string, vendorId: string, userAppVersion: string, platform: string): Promise<AppUpdateConfig>{
        try {
            logger.info(`[getPracticeAppUpdateConfig] userUniqueId = ${userUniqueId}, vendorId = ${vendorId}, userAppVersion = ${userAppVersion}, platform = ${platform}`);
            const updateDisabledConfig: AppUpdateConfig = { isUpdateAvailable: false };
            if(userUniqueId == '' || userAppVersion == '' || platform == '') {
                return updateDisabledConfig;
            }
            const defaultFreeAppUpdateConfigForPlatform = getDefaultPracticeAppUpdateConfigForPlatformForVendor()[vendorId];
            logger.info(`[getPracticeAppUpdateConfig] defaultFreeAppUpdateConfigForPlatform = ${JSON.stringify(defaultFreeAppUpdateConfigForPlatform)}`);

            const defaultAppUpdateConfig: AppUpdateConfig = defaultFreeAppUpdateConfigForPlatform[platform];

            // Check if there is a new app release available
            const newPracticeAppReleaseConfig = getNewPracticeAppReleaseConfigForPlatformForVendor()[vendorId];
            const newPracticeAppReleaseConfigForPlatform = newPracticeAppReleaseConfig[platform];
            const newAppVersion: string = newPracticeAppReleaseConfigForPlatform['version'] || '';

            // Checking if the user is using app older than base app version
            const baseAppVersion: string = newPracticeAppReleaseConfig['baseAppVersion'] || '';
            if(baseAppVersion != '' && compareVersions(userAppVersion, baseAppVersion) === -1) {
                // User must update this app
                // Sending mandatory update to the user
                const updateConfig: AppUpdateConfig = newPracticeAppReleaseConfigForPlatform['updateConfig'];
                return {
                    ...updateConfig,
                    isUpdateAvailable: true,
                    updateType: AppUpdateType.MANDATORY,
                }
            }

            logger.info(`[getPracticeAppUpdateConfig] newAppReleaseConfigForPlatform = ${JSON.stringify(newPracticeAppReleaseConfigForPlatform)}, newAppVersion = ${newAppVersion}`);
            const userId: number = Parser.parseNumber(userUniqueId.split("_")[1]);
            // If user has an older app
            if(newAppVersion != '' && compareVersions(userAppVersion, newAppVersion) === -1) {
                // If user satisfies the rollout criterion
                const newAppRollout: number = newPracticeAppReleaseConfigForPlatform['rollout'] || -1;
                logger.info(`[getPracticeAppUpdateConfig] newAppRelease userUniqueId = ${userUniqueId}, newAppRollout = ${newAppRollout}`);
                if((userId % 100) <= newAppRollout) {
                    const response: AppUpdateConfig = newPracticeAppReleaseConfigForPlatform['updateConfig'];
                    logger.info(`[getPracticeAppUpdateConfig] returning newAppRelease response = ${JSON.stringify(response)}`);
                    return response;
                }
            }
            // if User has logged in to to Practice App still sends royalty V2 upgrade
            const baseRoyaltyV2App = newPracticeAppReleaseConfig?.baseRoyaltyV2App
            if(baseRoyaltyV2App != '' && compareVersions(userAppVersion, baseRoyaltyV2App) >= 0) {
                logger.info(`Updating Royalty Version to V2 baseRoyaltyV2App = ${baseRoyaltyV2App}, userAppVersion = ${userAppVersion}`);
                AppConfigService.upgradeUserRoyaltyVersion(restClient, userId);
            }

            logger.info(`[getAppUpdateConfig] returning defaultAppUpdateConfig = ${JSON.stringify(defaultAppUpdateConfig)}`);
            return defaultAppUpdateConfig;
        } catch (error: any) {
            logger.error( `[getAppUpdateConfig] error :: `, error);
            throw error;
        }
    }

    static getPracticeAppLogsConfig(userUniqueId: string, vendorId: string, userAppVersion: string, platform: string): AppLogsConfig {
        try {
            logger.info(`[getPracticeAppLogsConfig] userUniqueId = ${userUniqueId}, vendorId = ${vendorId}, userAppVersion = ${userAppVersion}, platform = ${platform}`);

            const appLogsConfigForPlatform = getPracticeAppLogsConfigForPlatformForVendor()[vendorId];

            logger.info(`[getPracticeAppLogsConfig] appLogsConfigForPlatform = ${JSON.stringify(appLogsConfigForPlatform)}`);

            const appLogsConfig: AppLogsConfig = appLogsConfigForPlatform[platform];

            logger.info(`[AppConfigService] [getPracticeAppLogsConfig] appLogsConfig = ${JSON.stringify(appLogsConfig)}`);

            if(!appLogsConfig) {
               return {
                   sendLogsToBackend: false,
                   sendRequestLog: false,
                   sendErrorLog : false,
                   sendCatchLog : false,
               }
            }

            return appLogsConfig;
        } catch (error: any) {
            logger.error( `[getAppLogsConfig] error :: `, error);
            throw error;
        }
    }
    static getPracticeAppDowntimeConfig(userUniqueId: string, vendorId: string, userAppVersion: string, platform: string ): AppDowntimeConfig {
        try {
            logger.info(`[AppConfigService] [getPracticeAppDowntimeConfig] userUniqueId = ${userUniqueId}, vendorId = ${vendorId}, userAppVersion = ${userAppVersion}, platform = ${platform}`);

            const appDowntimeConfig: AppDowntimeConfig = getPracticeAppDowntimeConfigForVendor()[vendorId];

            logger.info(`[AppConfigService] [getPracticeAppDowntimeConfig] appDowntimeConfig = ${JSON.stringify(appDowntimeConfig)}`);

            return appDowntimeConfig;

        } catch (error: any) {
            logger.error(`[AppConfigService] [getPracticeAppDowntimeConfig] error :: `, error);
        }
    }

    static getPracticeAppApiConfig(userUniqueId: string, vendorId: string, userAppVersion: string, platform: string): AppApiConfig{
        try {
            logger.info(`[getPracticeAppApiConfig] userUniqueId = ${userUniqueId}, vendorId = ${vendorId}, userAppVersion = ${userAppVersion}, platform = ${platform}`);
            const appApiConfig: AppApiConfig = getPracticeAppApiConfigForVendor()[vendorId];
            logger.info(`[getPracticeAppApiConfig] appApiConfig = ${JSON.stringify(appApiConfig)}`);

            return appApiConfig;
        } catch (error: any) {
            logger.error( `[getPracticeAppApiConfig] error :: `, error);
            throw error;
        }
    }

    static getPracticeAppPollingConfig(userUniqueId: string, vendorId: string, userAppVersion: string, platform: string): AppPollingConfig {
        try {
            logger.info(`[getPracticeAppPollingConfig] userUniqueId = ${userUniqueId}, vendorId = ${vendorId}, userAppVersion = ${userAppVersion}, platform = ${platform}`);
            const appPollingConfig: AppPollingConfig = getPracticeAppConfigPollingVendor()[vendorId];
            logger.info(`[getPracticeAppPollingConfig] appPollingConfig = ${JSON.stringify(appPollingConfig)}`);

            return appPollingConfig;
        } catch (error: any) {
            logger.error( `[getPracticeAppPollingConfig] error :: `, error);
            throw error;
        }
    }

    static getLeaderboardFeatureEnabledStatus(userAppVersion, vendorId){
        const leaderboardFeatureConfig = getLeaderboardFeatureConfigByVendor()[vendorId];
        const leaderboardBaseVersion = leaderboardFeatureConfig.leaderboardAppVersion;
        const isUserEligibleForLeaderboard = userAppVersion != '' && compareVersions(userAppVersion, leaderboardBaseVersion) >= 0;
        return isUserEligibleForLeaderboard && leaderboardFeatureConfig.isEnabled;
    }
}
