import { IAppVersionAndPlatform } from './../models/appversion-and-platform';
import {
    getLobbyConfig,
    getPostAddCashCtLobbyBannersVendor,
    getPostAddCashMttLobbyBannersVendor,
    getPreAddCashCtLobbyBannersVendor,
    getPreAddCashMttLobbyBannersVendor,
    getPracticeAppLobbyBannersVendor,
    getPracticeAppLobbyConfig,
    getPreAddCashCtLobbyBannersVendorV2,
    getPostAddCashCtLobbyBannersVendorV2, getLobbyConfigForVendor
} from "./configService";
import LobbyBannerType from "../models/enums/lobby-banner-type";

import LoggerUtil from '../utils/logger';
import { compareVersions } from 'compare-versions';

const logger = LoggerUtil.get("LobbyService");

export default class LobbyService {

    static getLobbyBanners(userId: string, hasUserDepositedMoney: boolean, bannerType: string, vendorId: string, platformAndVersionData?: IAppVersionAndPlatform) {
        logger.info(`[LobbyService] [getLobbyBanners] userId :: ${userId} vendorID :: ${vendorId}`);
        let lobbyBanners;
        //	user segmentation - post Add Cash & pre Add Cash
        if (hasUserDepositedMoney) {
            //	if query Param has bannerType decides Mtt or Ct Banners
            lobbyBanners = (bannerType === LobbyBannerType.TOURNAMENT_BANNERS ? getPostAddCashMttLobbyBannersVendor()[vendorId] :
                ((platformAndVersionData?.platform === 'web' && !(compareVersions(platformAndVersionData?.version, "11.0.3") < 0)) ? getPostAddCashCtLobbyBannersVendorV2()[vendorId] : getPostAddCashCtLobbyBannersVendor()[vendorId]));
        }
        else {
            lobbyBanners = (bannerType === LobbyBannerType.TOURNAMENT_BANNERS ? getPreAddCashMttLobbyBannersVendor()[vendorId] :
                ((platformAndVersionData?.platform === 'web' && !(compareVersions(platformAndVersionData?.version, "11.0.3") < 0)) ? getPreAddCashCtLobbyBannersVendorV2()[vendorId] : getPreAddCashCtLobbyBannersVendor()[vendorId]));
        }
        logger.info(`[LobbyService] [getLobbyBanners] userId :: ${userId} lobbyBanners :: ${lobbyBanners}`);
        return lobbyBanners;
    }

    static getPracticeLobbyBanners(userId: string, bannerType: string, vendorId: string) {
        logger.info(`[LobbyService] [getPracticeLobbyBanners] userId :: ${userId} vendorID :: ${vendorId}`);
        const lobbyBanners = getPracticeAppLobbyBannersVendor()[vendorId];
        logger.info(`[LobbyService] [getPracticeLobbyBanners] userId :: ${userId} lobbyBanners :: ${lobbyBanners}`);
        return lobbyBanners;
    }

    static getLobbyConfig(userId: number, vendorId: string) {
        logger.info(`[LobbyService] [getLobbyConfig] `);
        const lobbyConfig = getLobbyConfigForVendor()[vendorId];
        logger.info(lobbyConfig, `[LobbyService] [getLobbyConfig] Lobby Config :: }`);
        return lobbyConfig;
    }

    static getPracticeLobbyConfig(userId: number) {
        logger.info(`[LobbyService] [getPracticeLobbyConfig] `);
        const lobbyConfig = getPracticeAppLobbyConfig();
        logger.info(lobbyConfig, `[LobbyService] [getPracticeLobbyConfig] Lobby Config :: }`);
        return lobbyConfig;
    }

};
