import LoggerUtil from '../utils/logger';
import Config from '../config/config';

const zookeeper = require('node-zookeeper-client');
const async = require('async');
const logger = LoggerUtil.get('configService');
const monitoringHelper = require('../helpers/monitoringHelper');

const client = zookeeper.createClient(
    Config.getZookeeperConfig().Url,
    {sessionTimeout: 10000, retries: 0},
);

const basePath = '/p52/services/apollo/';

const propertyTypes = {
    number: 1,
    string: 2,
    object: 3,
    boolean: 4,
};

const propertyKeys = {
    redisConfig: 'redisConfig',
    apiCacheConfig: 'apiCacheConfig',
    supernovaServiceBaseUrl: 'supernovaServiceBaseUrl',
    communicationServiceBaseUrl: 'communicationServiceBaseUrl',
    apiAuthTokens: 'apiAuthTokens',
    cookiesConfig: 'cookiesConfig',
    sessionConfig: 'sessionConfig',
    brandidForVendor: 'brandidForVendor',
    supernovaVendorId: 'supernovaVendorId',
    refundApprovalMethodForVendor: 'refundApprovalMethodForVendor',
    circuitBreakerConfig: 'circuitBreakerConfig',
    GSCCServiceBaseUrl: 'GSCCServiceBaseUrl',
    GSHallwayBaseUrlForVendor: 'GSHallwayBaseUrlForVendor',
    ariesServiceBaseUrl: 'ariesServiceBaseUrl',
    titanServiceBaseUrl: 'titanServiceBaseUrl',
    ariesTournamentServiceBaseUrl: 'ariesTournamentServiceBaseUrl',
    zodiacServiceBaseUrl: 'zodiacServiceBaseUrl',
    promosServiceBaseUrl: 'promosServiceBaseUrl',
    //tenet related
    idmServiceBaseUrl: 'idmServiceBaseUrl',
    idmServiceAccessKeys: 'idmServiceAccessKeys',
    guardianServiceBaseUrl: 'guardianServiceBaseUrl',
    guardianServiceAccessKeyForVendor: 'guardianServiceAccessKeyForVendor',
    concordiaServiceBaseUrl: 'concordiaServiceBaseUrl',
    concordiaServiceAccessKeyForVendor: 'concordiaServiceAccessKeyForVendor',

    //payout
    plutusBaseUrl: 'plutusBaseUrl',
    payoutServiceAccessKeyByVendor: 'payoutServiceAccessKeyByVendor',
    payoutConfigForVendor: 'payoutConfigForVendor',
    payoutPacksForVendor: 'payoutPacksForVendor',
    payoutBankListInfoForVendor: 'payoutBankListInfoForVendor',
    bankIconInfoBasedOnUpiForVendor: 'bankIconInfoBasedOnUpiForVendor',
    payoutbeneficiaryTagConfigForVendor: 'payoutbeneficiaryTagConfigForVendor',
    payoutbeneficiaryPriorityForVendor: 'payoutbeneficiaryPriorityForVendor',
    payoutDowntimeMessage: 'payoutDowntimeMessage',

    royaltyConfigForVendor: 'royaltyConfigForVendor',
    promosServiceAccessKey: 'promosServiceAccessKey',
    promosServiceAccessKeyForVendor: 'promosServiceAccessKeyForVendor',
    // kyc related
    maxKycAccountsForVendor: 'maxKycAccountsForVendor',
    userKycConfigRuleForVendor: 'userKycConfigRuleForVendor',
    oldUserKycConfigForVendor: 'oldUserKycConfigForVendor',
    newUserKycConfigForVendor: 'newUserKycConfigForVendor',
    digilockerStateConfigForVendor: 'digilockerStateConfigForVendor',
    pspIdConfigForVendor: 'pspIdConfigForVendor',
    payinMerchantIdForVendor: 'payinMerchantIdForVendor',
    payinServiceBaseUrl: 'payinServiceBaseUrl',
    payinServiceAccessKeyForVendor: 'payinServiceAccessKeyForVendor',
    isAadharConsentRequiredForVendor: 'isAadharConsentRequiredForVendor',
    maxKycBankAccountsForVendor: 'maxKycBankAccountsForVendor',
    maxKycUpiAccountsForVendor: 'maxKycUpiAccountsForVendor',
    maxUpiTransactionAmountForVendor: 'maxUpiTransactionAmountForVendor',

    // Aurora Service - Referral, Royalty, Affiliate
    auroraServiceBaseUrl: 'auroraServiceBaseUrl',
    // Planet Service - Location
    planetServiceBaseUrl: 'planetServiceBaseUrl',
    // payin service
    savedCardPaymentDetailsConfigForVendor: 'savedCardPaymentDetailsConfigForVendor',
    cardBrandImageForVendor: 'cardBrandImageForVendor',
    getSavedCardsPaymentModeTypeDetailsForVendor: 'getSavedCardsPaymentModeTypeDetailsForVendor',
    getWalletPaymentModeDetailsForVendor: 'getWalletPaymentModeDetailsForVendor',
    getWalletPaymentModeTypeConfigForVendor: 'getWalletPaymentModeTypeConfigForVendor',
    getNbPaymentModeDetailsForVendor: 'getNbPaymentModeDetailsForVendor',
    bankListForVendor: 'bankListForVendor',
    getNetBankingConfigForVendor: 'getNetBankingConfigForVendor',
    userAddCashConfigForVendor: 'userAddCashConfigForVendor',
    paymentModeMappingForVendor: 'paymentModeMappingForVendor',
    upiIntentPaymentMethodForVendor: 'upiIntentPaymentMethodForVendor',
    userTransactionTypeConfig: 'userTransactionTypeConfig',
    userRefundMessageForVendor: 'userRefundMessageForVendor',
    userAvailableWalletMethodsForVendor: 'userAvailableWalletMethodsForVendor',
    bannedCardBrandForVendor: 'bannedCardBrandForVendor',
    userAvatarsForVendor: 'userAvatarsForVendor',
    // user feedback
    userFeedbackMessageOnReceive: 'userFeedbackMessageOnReceive',
    // Banners new
    hotTournamentBannersVendor: 'hotTournamentBannersVendor',
    storyRewindBannerVendor: 'storyRewindBannerVendor',
    postAddCashOfferBannersVendor: 'postAddCashOfferBannersVendor',
    preAddCashOfferBannersVendor: 'preAddCashOfferBannersVendor',
    pslWidgetsBannersVendor: 'pslWidgetsBannersVendor',
    preAddCashCtLobbyBannersVendor: 'preAddCashCtLobbyBannersVendor',
    postAddCashCtLobbyBannersVendor: 'postAddCashCtLobbyBannersVendor',
    preAddCashMttLobbyBannersVendor: 'preAddCashMttLobbyBannersVendor',
    postAddCashMttLobbyBannersVendor: 'postAddCashMttLobbyBannersVendor',
    postAddCashCtLobbyBannersVendorV2: 'postAddCashCtLobbyBannersVendorV2',
    preAddCashCtLobbyBannersVendorV2: 'preAddCashCtLobbyBannersVendorV2',
    onboardingScreenBannersVendor: 'onboardingScreenBannersVendor',
    practiceAppOfferBanners: 'practiceAppOfferBanners',
    practiceAppLobbyBannersVendor: 'practiceAppLobbyBannersVendor',
    leaderboardHomePageBannersVendor: 'leaderboardHomePageBannersVendor',
    // MasterServer
    masterserverBaseUrl: 'masterserverBaseUrl',
    lobbyConfig: 'lobbyConfig',
    lobbyConfigForVendor: 'lobbyConfigForVendor',
    rngCertificateConfigForVendor: 'rngCertificateConfigForVendor',
    useroffers: 'useroffers',
    //invocie
    invoiceTenetAccessIdForVendor: 'invoiceTenetAccessIdForVendor',
    invoiceServiceBaseUrl: 'invoiceServiceBaseUrl',
    invoiceMetaConfigForVendor: 'invoiceMetaConfigForVendor',
    invoiceMetaConfigForVendorV2: 'invoiceMetaConfigForVendorV2',
    communicationTemplatesForVendor: 'communicationTemplatesForVendor',
    defaultAppUpdateConfigForPlatformForVendor: 'defaultAppUpdateConfigForVendor',
    newAppReleaseConfigForPlatformForVendor: 'newAppReleaseConfigForVendor',
    appLogsConfigForPlatformForVendor: 'appLogsConfigForVendor',
    appApiConfigForVendor: 'appApiConfigForVendor',
    appConfigPollingVendor: 'appConfigPollingVendor',
    gsBearerToken: 'gsBearerToken',
    appDowntimeConfigForVendor: 'appDowntimeConfigForVendor',
    getBalanceApiMetaForVendor: 'getBalanceApiMetaForVendor',

    //affiliate
    affiliateMetaConfigForVendor: 'affiliateMetaConfigForVendor',

    //Vendor Related
    vendorMeta: 'vendorMeta',
    // app Videos
    appVideosForVendor: 'appVideosForVendor',
    userPolicy: 'userPolicy',
    gmzBearerToken: 'gmzBearerToken',
    gmzUrl: 'gmzUrl',
    p52PartnerAppUrl: 'p52PartnerAppUrl',
    slackToken: 'slackToken',
    downtimeConfig: 'downTimeConfig',
    appVersionAndPlatformVersionCheck: 'appVersionAndPlatformCheckConfig',

    isRecommendedRoomsV2Enable: 'isRecommendedRoomsV2Enable',
    practiceAppLobbyConfig: 'practiceAppLobbyConfig',
    getPracticeBalanceApiMetaForVendor: 'getPracticeBalanceApiMetaForVendor',
    practiceAppVideos: 'practiceAppVideos',
    practiceAppRewards: 'practiceAppRewards',
    learnPokerForVendor: 'learnPokerForVendor',
    cashAppPracticeRooms: 'cashAppPracticeRooms',
    cashAppPracticeGroups: 'cashAppPracticeGroups',

    //Practice App Update Config
    defaultPracticeAppUpdateConfigForPlatformForVendor: 'defaultPracticeAppUpdateConfigForVendor',
    newPracticeAppReleaseConfigForPlatformForVendor: 'newPracticeAppReleaseConfigForVendor',
    practiceAppLogsConfigForPlatformForVendor: 'practiceAppLogsConfigForVendor',
    practiceAppDowntimeConfigForVendor: 'practiceAppDowntimeConfigForVendor',
    practiceAppApiConfigForVendor: 'practiceAppApiConfigForVendor',
    practiceAppConfigPollingVendor: 'practiceAppConfigPollingVendor',

    defaultChatSuggestionsForVendor: 'defaultChatSuggestionsForVendor',
    autoTopUpFlagForPlatformForVendor: 'autoTopUpFlagForPlatformForVendor',

    //rewards
    regosServiceBaseUrl: 'regosServiceBaseUrl',
    regosServiceAccessKeyForVendor: 'regosServiceAccessKeyForVendor',
    promotionPriorityConfig: 'promotionPriorityConfig',

    // api versioning
    apiRolloutPercentageForVendor: 'apiRolloutPercentageForVendor',
    //leaderboard
    gameStakesConfigForLeaderboardForVendor: 'gameStakesConfigForLeaderboardForVendor',
    leaderboardFeatureConfigByVendor: 'leaderboardFeatureConfigByVendor',
    leaderboardFAQByVendor: 'leaderboardFAQByVendor',

    appDownloadSmsConfig: 'appDownloadSmsConfig',

    //psl
    pslConfigForVendor: 'pslConfigForVendor',

};

const properties = {};

function getProperty(key, type, callback) {
    logger.info({key, type}, 'Fetching value from zookeeper');

    client.getData(
        basePath + key,
        (event) => {
            // Log these things in fatal log, for more accuracy.
            logger.fatal({event}, 'Received zookeeper watcher event');

            // Call the same method again to get the data as well as add watcher back.
            getProperty(key, type, (error, data) => {
                logger.fatal({error, data}, 'Callback received from getProperty. Check error and data for details.');
            });
        },
        (error, data, stat) => {
            if (data) {
                data = data.toString('utf8');
            }

            logger.info({error, data}, 'Got data');
            try {
                if (type === propertyTypes.string) {
                    properties[key] = data;
                } else if (type === propertyTypes.number) {
                    properties[key] = parseInt(data);
                } else if (type === propertyTypes.object) {
                    properties[key] = JSON.parse(data);
                } else if (type === propertyTypes.boolean) {
                    properties[key] = (data === 'true');
                }
            } catch (e) {
                logger.fatal(e, '***************** Exception in parsing the value in zookeeper *****************');
                error = e;
                monitoringHelper.trackZookeeperUpdateError();
            }

            callback(error, data);
        },
    );
}

export const init = (callback) => {
    logger.info('Connecting to zookeeper');

    client.once('connected', () => {
        logger.info('Connected to the zookeeper server. Fetching all the properties');

        async.series([

            // We need to write specific code for each property to check if it's a string, boolean or json
            (callback) => {
                getProperty(propertyKeys.redisConfig, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.regosServiceBaseUrl, propertyTypes.string, callback);
            },
            (callback) => {
                getProperty(propertyKeys.supernovaServiceBaseUrl, propertyTypes.string, callback);
            },
            (callback) => {
                getProperty(propertyKeys.regosServiceAccessKeyForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.promotionPriorityConfig, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.apiRolloutPercentageForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.bannedCardBrandForVendor, propertyTypes.object, callback);
            },

            (callback) => {
                getProperty(propertyKeys.GSCCServiceBaseUrl, propertyTypes.string, callback);
            },
            (callback) => {
                getProperty(propertyKeys.GSHallwayBaseUrlForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.zodiacServiceBaseUrl, propertyTypes.string, callback);
            },
            (callback) => {
                getProperty(propertyKeys.promosServiceBaseUrl, propertyTypes.string, callback);
            },
            (callback) => {
                getProperty(propertyKeys.communicationServiceBaseUrl, propertyTypes.string, callback);
            },
            (callback) => {
                getProperty(propertyKeys.plutusBaseUrl, propertyTypes.string, callback);
            },
            (callback) => {
                getProperty(propertyKeys.payoutServiceAccessKeyByVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.apiAuthTokens, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.cookiesConfig, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.sessionConfig, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.brandidForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.supernovaVendorId, propertyTypes.number, callback);
            },
            (callback) => {
                getProperty(propertyKeys.refundApprovalMethodForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.circuitBreakerConfig, propertyTypes.boolean, callback);
            },
            (callback) => {
                getProperty(propertyKeys.idmServiceBaseUrl, propertyTypes.string, callback);
            },
            (callback) => {
                getProperty(propertyKeys.idmServiceAccessKeys, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.maxKycAccountsForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.guardianServiceBaseUrl, propertyTypes.string, callback);
            },
            (callback) => {
                getProperty(propertyKeys.guardianServiceAccessKeyForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.payoutConfigForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.payoutPacksForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.royaltyConfigForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.payoutBankListInfoForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.promosServiceAccessKey, propertyTypes.string, callback);
            },
            (callback) => {
                getProperty(propertyKeys.promosServiceAccessKeyForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.digilockerStateConfigForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.pspIdConfigForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.savedCardPaymentDetailsConfigForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.cardBrandImageForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.getSavedCardsPaymentModeTypeDetailsForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.getWalletPaymentModeDetailsForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.getWalletPaymentModeTypeConfigForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.getNbPaymentModeDetailsForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.bankListForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.getNetBankingConfigForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.userAddCashConfigForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.userTransactionTypeConfig, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.userRefundMessageForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.userAvailableWalletMethodsForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.payinMerchantIdForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.payinServiceBaseUrl, propertyTypes.string, callback)
            },
            (callback) => {
                getProperty(propertyKeys.payinServiceAccessKeyForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.isAadharConsentRequiredForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.maxKycBankAccountsForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.maxKycUpiAccountsForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.maxUpiTransactionAmountForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.userKycConfigRuleForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.oldUserKycConfigForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.userAvatarsForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.newUserKycConfigForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.userFeedbackMessageOnReceive, propertyTypes.string, callback);
            },
            (callback) => {
                getProperty(propertyKeys.hotTournamentBannersVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.postAddCashOfferBannersVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.preAddCashOfferBannersVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.pslWidgetsBannersVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.preAddCashCtLobbyBannersVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.postAddCashCtLobbyBannersVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.preAddCashCtLobbyBannersVendorV2, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.postAddCashCtLobbyBannersVendorV2, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.preAddCashMttLobbyBannersVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.postAddCashMttLobbyBannersVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.onboardingScreenBannersVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.leaderboardHomePageBannersVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.masterserverBaseUrl, propertyTypes.string, callback)
            },
            (callback) => {
                getProperty(propertyKeys.lobbyConfig, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.lobbyConfigForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.rngCertificateConfigForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.useroffers, propertyTypes.object, callback)
            },
            // Aurora Servcie - Referral, Royalty, Affiliate
            (callback) => {
                getProperty(propertyKeys.auroraServiceBaseUrl, propertyTypes.string, callback);
            },
            // Planet Service - Location
            (callback) => {
                getProperty(propertyKeys.planetServiceBaseUrl, propertyTypes.string, callback);
            },
            // Invoice Service
            (callback) => {
                getProperty(propertyKeys.invoiceTenetAccessIdForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.invoiceServiceBaseUrl, propertyTypes.string, callback);
            },
            (callback) => {
                getProperty(propertyKeys.invoiceMetaConfigForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.invoiceMetaConfigForVendorV2, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.affiliateMetaConfigForVendor, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.paymentModeMappingForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.upiIntentPaymentMethodForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.communicationTemplatesForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.defaultAppUpdateConfigForPlatformForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.newAppReleaseConfigForPlatformForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.appLogsConfigForPlatformForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.appApiConfigForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.appVideosForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.appConfigPollingVendor, propertyTypes.object, callback)
            },
            (callback => {
                getProperty(propertyKeys.gsBearerToken, propertyTypes.string, callback)
            }),
            (callback => {
                getProperty(propertyKeys.getBalanceApiMetaForVendor, propertyTypes.object, callback)
            }),
            ((callback) => {
                getProperty(propertyKeys.appDowntimeConfigForVendor, propertyTypes.object, callback)
            }),
            ((callback) => {
                getProperty(propertyKeys.vendorMeta, propertyTypes.object, callback)
            }),
            (callback) => {
                getProperty(propertyKeys.userPolicy, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.userPolicy, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.gmzBearerToken, propertyTypes.string, callback)
            },
            (callback) => {
                getProperty(propertyKeys.gmzUrl, propertyTypes.string, callback)
            },
            (callback) => {
                getProperty(propertyKeys.storyRewindBannerVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.p52PartnerAppUrl, propertyTypes.string, callback)
            },
            (callback) => {
                getProperty(propertyKeys.slackToken, propertyTypes.string, callback)
            },
            (callback) => {
                getProperty(propertyKeys.appVersionAndPlatformVersionCheck, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.downtimeConfig, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.bankIconInfoBasedOnUpiForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.ariesServiceBaseUrl, propertyTypes.string, callback)
            },
            (callback) => {
                getProperty(propertyKeys.titanServiceBaseUrl, propertyTypes.string, callback)
            },
            (callback) => {
                getProperty(propertyKeys.ariesTournamentServiceBaseUrl, propertyTypes.string, callback)
            },
            (callback) => {
                getProperty(propertyKeys.payoutbeneficiaryTagConfigForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.payoutbeneficiaryPriorityForVendor, propertyTypes.object, callback)

            },
            (callback) => {
                getProperty(propertyKeys.isRecommendedRoomsV2Enable, propertyTypes.boolean, callback)

            },
            (callback) => {
                getProperty(propertyKeys.payoutDowntimeMessage, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.apiCacheConfig, propertyTypes.object, callback);
            },
            (callback) => {
                getProperty(propertyKeys.practiceAppOfferBanners, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.practiceAppLobbyBannersVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.practiceAppLobbyConfig, propertyTypes.object, callback)
            },
            (callback => {
                getProperty(propertyKeys.getPracticeBalanceApiMetaForVendor, propertyTypes.object, callback)
            }),
            (callback => {
                getProperty(propertyKeys.practiceAppVideos, propertyTypes.object, callback)
            }),
            (callback => {
                getProperty(propertyKeys.practiceAppRewards, propertyTypes.object, callback)
            }),
            (callback => {
                getProperty(propertyKeys.learnPokerForVendor, propertyTypes.object, callback)
            }),
            (callback) => {
                getProperty(propertyKeys.concordiaServiceBaseUrl, propertyTypes.string, callback)
            },
            (callback) => {
                getProperty(propertyKeys.concordiaServiceAccessKeyForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.cashAppPracticeRooms, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.cashAppPracticeGroups, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.defaultPracticeAppUpdateConfigForPlatformForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.newPracticeAppReleaseConfigForPlatformForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.practiceAppLogsConfigForPlatformForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.practiceAppDowntimeConfigForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.practiceAppApiConfigForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.practiceAppConfigPollingVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.defaultChatSuggestionsForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.gameStakesConfigForLeaderboardForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.autoTopUpFlagForPlatformForVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.leaderboardFeatureConfigByVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.leaderboardFAQByVendor, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.appDownloadSmsConfig, propertyTypes.object, callback)
            },
            (callback) => {
                getProperty(propertyKeys.pslConfigForVendor, propertyTypes.object, callback)
            },
        ], (error, results) => {
            logger.info({error, results}, 'Read all the properties from zookeeper');
            callback(error, {}); // No need to pass back anything as of now
        });
    });

    client.connect();
};

export const getRedisConfig = () => properties[propertyKeys.redisConfig];
export const getSupernovaServiceBaseUrl = () => properties[propertyKeys.supernovaServiceBaseUrl];
export const getGSCCServiceBaseUrl = () => properties[propertyKeys.GSCCServiceBaseUrl];
export const getGSHallwayBaseUrlForVendor = () => properties[propertyKeys.GSHallwayBaseUrlForVendor];
export const getZodiacServiceBaseUrl = () => properties[propertyKeys.zodiacServiceBaseUrl];
export const getPromosServiceBaseUrl = () => properties[propertyKeys.promosServiceBaseUrl];
export const getPayoutServiceBaseUrl = () => properties[propertyKeys.plutusBaseUrl];
export const getPayoutServiceAccessKeyByVendor = () => properties[propertyKeys.payoutServiceAccessKeyByVendor];
export const getCommunicationServiceBaseUrl = () => properties[propertyKeys.communicationServiceBaseUrl];
export const getApiAuthTokens = () => properties[propertyKeys.apiAuthTokens];
export const getCookiesConfig = () => properties[propertyKeys.cookiesConfig];
export const getSessionConfig = () => properties[propertyKeys.sessionConfig];
export const getBrandIdForVendor = () => properties[propertyKeys.brandidForVendor];
export const getRefundApprovalMethodForVendor = () => properties[propertyKeys.refundApprovalMethodForVendor];
export const getCircuitBreakerConfig = () => properties[propertyKeys.circuitBreakerConfig];
export const getUserAvatarsForVendor = () => properties[propertyKeys.userAvatarsForVendor];
export const getIdmServiceBaseUrl = () => properties[propertyKeys.idmServiceBaseUrl];
export const getIdmServiceAccessKeys = () => properties[propertyKeys.idmServiceAccessKeys];
export const getMaxKycAccountsForVendor = () => properties[propertyKeys.maxKycAccountsForVendor];
export const getGuardianServiceBaseUrl = () => properties[propertyKeys.guardianServiceBaseUrl];
export const getGuardianServiceAccessKeyForVendor = () => properties[propertyKeys.guardianServiceAccessKeyForVendor];
export const getPayoutConfigForVendor = () => properties[propertyKeys.payoutConfigForVendor];
export const getPayoutPacksForVendor = () => properties[propertyKeys.payoutPacksForVendor];
export const getRoyaltyConfigForVendor = () => properties[propertyKeys.royaltyConfigForVendor];
export const getPayoutBankListInfoForVendor = () => properties[propertyKeys.payoutBankListInfoForVendor];
export const getPromosServiceAccessKey = () => properties[propertyKeys.promosServiceAccessKey];
export const getPromosServiceAccessKeyForVendor = () => properties[propertyKeys.promosServiceAccessKeyForVendor];
export const getuserKycConfigRuleForVendor = () => properties[propertyKeys.userKycConfigRuleForVendor];
export const getOldUserKycConfigForVendor = () => properties[propertyKeys.oldUserKycConfigForVendor];
export const getNewUserKycConfigForVendor = () => properties[propertyKeys.newUserKycConfigForVendor];
export const getIsAadharConsentRequiredParamForVendor = () => properties[propertyKeys.isAadharConsentRequiredForVendor];
export const getMaxKycBankAccountsForVendor = () => properties[propertyKeys.maxKycBankAccountsForVendor];
export const getMaxKycUpiAccountsForVendor = () => properties[propertyKeys.maxKycUpiAccountsForVendor];
export const getMaxUpiTransactionAmountForVendor = () => properties[propertyKeys.maxUpiTransactionAmountForVendor];

export const getDigilockerStateConfigForVendor = () => properties[propertyKeys.digilockerStateConfigForVendor];
export const getAuroraServiceBaseUrl = () => properties[propertyKeys.auroraServiceBaseUrl];
export const getPlanetServiceBaseUrl = () => properties[propertyKeys.planetServiceBaseUrl];
export const getPayInMerchantIdForVendor = () => properties[propertyKeys.payinMerchantIdForVendor];
export const getPayinServiceBaseUrl = () => properties[propertyKeys.payinServiceBaseUrl];
export const getPayinServiceAccessKeyForVendor = () => properties[propertyKeys.payinServiceAccessKeyForVendor];
export const getPspIdConfigForVendor = () => properties[propertyKeys.pspIdConfigForVendor];
export const getSavedCardPaymentDetailsConfigForVendor = () => properties[propertyKeys.savedCardPaymentDetailsConfigForVendor];
export const getCardBrandImageForVendor = () => properties[propertyKeys.cardBrandImageForVendor];
export const getSavedCardsPaymentModeTypeDetailsForVendor = () => properties[propertyKeys.getSavedCardsPaymentModeTypeDetailsForVendor];
export const getWalletPaymentModeDetailsForVendor = () => properties[propertyKeys.getWalletPaymentModeDetailsForVendor];
export const getWalletPaymentModeTypeConfigForVendor = () => properties[propertyKeys.getWalletPaymentModeTypeConfigForVendor];
export const getNbPaymentModeDetailsForVendor = () => properties[propertyKeys.getNbPaymentModeDetailsForVendor];
export const getBankListForVendor = () => properties[propertyKeys.bankListForVendor];
export const getNetBankingConfigForVendor = () => properties[propertyKeys.getNetBankingConfigForVendor];
export const getUserAddCashConfigForVendor = () => properties[propertyKeys.userAddCashConfigForVendor];
export const getUserTransactionTypeConfig = () => properties[propertyKeys.userTransactionTypeConfig];
export const getUserRefundMessageForVendor = () => properties[propertyKeys.userRefundMessageForVendor];
export const getUserAvailableWalletMethodsForVendor = () => properties[propertyKeys.userAvailableWalletMethodsForVendor];
export const getUserFeedbackMessageOnReceive = () => properties[propertyKeys.userFeedbackMessageOnReceive];
export const getHotTournamentBannersVendor = () => properties[propertyKeys.hotTournamentBannersVendor];
export const getStoryRewindBannerVendor = () => properties[propertyKeys.storyRewindBannerVendor];
export const getPostAddCashOfferBannersVendor = () => properties[propertyKeys.postAddCashOfferBannersVendor];
export const getPreAddCashOfferBannersVendor = () => properties[propertyKeys.preAddCashOfferBannersVendor];
export const getPslWidgetsBannersVendor = () => properties[propertyKeys.pslWidgetsBannersVendor];
export const getPreAddCashCtLobbyBannersVendor = () => properties[propertyKeys.preAddCashCtLobbyBannersVendor];
export const getPreAddCashCtLobbyBannersVendorV2 = () => properties[propertyKeys.preAddCashCtLobbyBannersVendorV2];
export const getPostAddCashCtLobbyBannersVendorV2 = () => properties[propertyKeys.postAddCashCtLobbyBannersVendorV2];
export const getPostAddCashCtLobbyBannersVendor = () => properties[propertyKeys.postAddCashCtLobbyBannersVendor];
export const getPreAddCashMttLobbyBannersVendor = () => properties[propertyKeys.preAddCashMttLobbyBannersVendor];
export const getPostAddCashMttLobbyBannersVendor = () => properties[propertyKeys.postAddCashMttLobbyBannersVendor];
export const getOnboardingScreenBannersVendor = () => properties[propertyKeys.onboardingScreenBannersVendor];
export const getLeaderboardBannersVendor = () => properties[propertyKeys.leaderboardHomePageBannersVendor];
export const getMasterserverBaseUrl = () => properties[propertyKeys.masterserverBaseUrl];
export const getLobbyConfig = () => properties[propertyKeys.lobbyConfig];
export const getLobbyConfigForVendor = () => properties[propertyKeys.lobbyConfigForVendor];
export const getRNGCertificateConfigForVendor = () => properties[propertyKeys.rngCertificateConfigForVendor];
export const getUseroffers = () => properties[propertyKeys.useroffers];
export const getTenetInvoiceAccessIdForVendor = () => properties[propertyKeys.invoiceTenetAccessIdForVendor];
export const getInvoiceServiceBaseUrl = () => properties[propertyKeys.invoiceServiceBaseUrl]
export const getInvoiceMetaConfigForVendor = () => properties[propertyKeys.invoiceMetaConfigForVendor]
export const getInvoiceMetaConfigForVendorV2 = () => properties[propertyKeys.invoiceMetaConfigForVendorV2]
export const getAffiliateMetaConfigForVendor = () => properties[propertyKeys.affiliateMetaConfigForVendor]
export const getUpiIntentForVendor = () => properties[propertyKeys.upiIntentPaymentMethodForVendor]
export const getPaymentModeMappingForVendor = () => properties[propertyKeys.paymentModeMappingForVendor]
export const getCommunicationTemplatesForVendor = () => properties[propertyKeys.communicationTemplatesForVendor]
export const getDefaultAppUpdateConfigForPlatformForVendor = () => properties[propertyKeys.defaultAppUpdateConfigForPlatformForVendor]
export const getNewAppReleaseConfigForPlatformForVendor = () => properties[propertyKeys.newAppReleaseConfigForPlatformForVendor]
export const getAppLogsConfigForPlatformForVendor = () => properties[propertyKeys.appLogsConfigForPlatformForVendor]
export const getAppApiConfigForVendor = () => properties[propertyKeys.appApiConfigForVendor]
export const getAppConfigPollingVendor = () => properties[propertyKeys.appConfigPollingVendor]
export const getGsBearerToken = () => properties[propertyKeys.gsBearerToken]
export const getBalanceApiMetaForVendor = () => properties[propertyKeys.getBalanceApiMetaForVendor]
export const getAppDowntimeConfigForVendor = () => properties[propertyKeys.appDowntimeConfigForVendor]
export const getVendorMeta = () => properties[propertyKeys.vendorMeta]
export const getUserPolicy = () => properties[propertyKeys.userPolicy]
export const getAppVideosForVendor = () => properties[propertyKeys.appVideosForVendor];
export const getGmzBearerToken = () => properties[propertyKeys.gmzBearerToken];
export const getGmzUrl = () => properties[propertyKeys.gmzUrl]
export const getP52PartnerAppUrl = () => properties[propertyKeys.p52PartnerAppUrl]
export const getSlackToken = () => properties[propertyKeys.slackToken]
export const getAppVersionAndPlatformVersionCheck = () => properties[propertyKeys.appVersionAndPlatformVersionCheck];
export const getDowntimeConfig = () => properties[propertyKeys.downtimeConfig];
export const getAriesServiceBaseUrl = () => properties[propertyKeys.ariesServiceBaseUrl];
export const getTitanServiceBaseUrl = () => properties[propertyKeys.titanServiceBaseUrl];
export const getAriesTournamentServiceBaseUrl = () => properties[propertyKeys.ariesTournamentServiceBaseUrl];
export const getBankIconInfoBasedOnUpiForVendor = () => properties[propertyKeys.bankIconInfoBasedOnUpiForVendor];
export const getPayoutbeneficiaryTagConfigForVendor = () => properties[propertyKeys.payoutbeneficiaryTagConfigForVendor];
export const getPayoutbeneficiaryPriorityForVendor = () => properties[propertyKeys.payoutbeneficiaryPriorityForVendor];
export const getPayoutDowntimeMessage = () => properties[propertyKeys.payoutDowntimeMessage];
export const getApiCacheConfig = () => properties[propertyKeys.apiCacheConfig];

export const getConcordiaServiceBaseUrl = () => properties[propertyKeys.concordiaServiceBaseUrl];
export const getConcordiaServiceAccessKeyForVendor = () => properties[propertyKeys.concordiaServiceAccessKeyForVendor];


export const IsRecommendedRoomsV2Enable = () => properties[propertyKeys.isRecommendedRoomsV2Enable];
export const getPracticeAppOfferBanners = () => properties[propertyKeys.practiceAppOfferBanners];
export const getPracticeAppLobbyBannersVendor = () => properties[propertyKeys.practiceAppLobbyBannersVendor];
export const getPracticeAppLobbyConfig = () => properties[propertyKeys.practiceAppLobbyConfig];
export const getPracticeBalanceApiMetaForVendor = () => properties[propertyKeys.getPracticeBalanceApiMetaForVendor];
export const getPracticeAppVideos = () => properties[propertyKeys.practiceAppVideos];
export const getPracticeAppRewards = () => properties[propertyKeys.practiceAppRewards];
export const getLearnPokerForVendor = () => properties[propertyKeys.learnPokerForVendor];
export const getCashAppPracticeRooms = () => properties[propertyKeys.cashAppPracticeRooms];
export const getCashAppPracticeGroups = () => properties[propertyKeys.cashAppPracticeGroups];


export const getDefaultPracticeAppUpdateConfigForPlatformForVendor = () => properties[propertyKeys.defaultPracticeAppUpdateConfigForPlatformForVendor]
export const getNewPracticeAppReleaseConfigForPlatformForVendor = () => properties[propertyKeys.newPracticeAppReleaseConfigForPlatformForVendor]
export const getPracticeAppLogsConfigForPlatformForVendor = () => properties[propertyKeys.practiceAppLogsConfigForPlatformForVendor]
export const getPracticeAppDowntimeConfigForVendor = () => properties[propertyKeys.practiceAppDowntimeConfigForVendor]
export const getPracticeAppApiConfigForVendor = () => properties[propertyKeys.practiceAppApiConfigForVendor]
export const getPracticeAppConfigPollingVendor = () => properties[propertyKeys.practiceAppConfigPollingVendor]

export const getDefaultChatSuggestionsForVendor = () => properties[propertyKeys.defaultChatSuggestionsForVendor]
export const getGameStakesConfigForLeaderboardForVendor = () => properties[propertyKeys.gameStakesConfigForLeaderboardForVendor]
export const getAutoTopUpFlagForPlatformForVendor = () => properties[propertyKeys.autoTopUpFlagForPlatformForVendor]
export const getRegosServiceBaseUrl = () => properties[propertyKeys.regosServiceBaseUrl];
export const getRegosServiceAccessKeyForVendor = () => properties[propertyKeys.regosServiceAccessKeyForVendor];
export const getPromotionPriorityConfig = () => properties[propertyKeys.promotionPriorityConfig];
export const getApiRolloutPercentageForVendor = () => properties[propertyKeys.apiRolloutPercentageForVendor];

export const getLeaderboardFeatureConfigByVendor = () => properties[propertyKeys.leaderboardFeatureConfigByVendor]
export const getLeaderboardFAQByVendor = () => properties[propertyKeys.leaderboardFAQByVendor]
export const getBannedCardBrandForVendor = () => properties[propertyKeys.bannedCardBrandForVendor];

export const getAppDownloadSmsConfig = () => properties[propertyKeys.appDownloadSmsConfig]

// PSL
export const getPslConfigForVendor = () => properties[propertyKeys.pslConfigForVendor];

