const SDC = require('statsd-client');

const sdc = new SDC({ host: '0.0.0.0', port: 8125 });

const baseKey = 'node-service.';
const errorsBaseKey = baseKey + 'errors.';
const apiRequestsBaseKey = baseKey + 'api.requests.';
const instantCashBaseKey = baseKey + 'instant-cash.';
const diwaliReferralBaseKey = baseKey + 'diwali-referral.';
const tournamentMonotoringBaseKey = baseKey + 'tournament-monitoring.'
const webhookRequestBaseKey = baseKey + 'clevertap.';
const userReferralBaseKey = baseKey + 'user-referral.';
const blockedUserBaseKey = baseKey + 'blocked-user.';
const oldAppUserBaseKey = baseKey + 'old-app-user.';

const ipCheckBaseKey = baseKey + 'ip-check.';
const newOldGameServerDiffBaseKey = baseKey + 'new-old-game.';
const sessionsBaseKey = baseKey + 'session.';
const otpTrackingBaseKey = baseKey + "otp-tracking";
const smsWebhookBaseKey = baseKey + "gupshup";
const withdrawalWebhookBaseKey = baseKey + "withdrawal";
const scratchCardsBaseKey = baseKey + "scratch-cards";
const devideIDBaseKey = baseKey + "device-id";
const vendorIDBaseKey = baseKey + "vendor-id";
const loggedInUserSessionNotFound= baseKey+"logged-in-user-session-not-found"
const promotionsBaseKey = baseKey + "promotion.";
const addCashBaseKey  = baseKey + 'add-cash.';
const appTypeBaseKey = baseKey + "gk-app-type";

const keys = {
	servicesErrorsPrefix		: errorsBaseKey + 'services.',
	nonXhrErrorsPrefix			: errorsBaseKey + 'nonxhrapi.',
	uncaughtException			: errorsBaseKey + 'uncaughtException',
	exception401OnAddCash		: errorsBaseKey + 'exception401OnAddCash.getAddChipsPromotions',
	exception401OnInitiatePayment : errorsBaseKey + 'exception401OnInitiatePayment.initiatePayment',
	invalidTournaments			: errorsBaseKey + 'invalidTournaments',
	noTournamentFound			: errorsBaseKey + 'noTournamentsFound',
	claimScratchCardFailure			: errorsBaseKey + 'claimScratchCard',
	subscribeScratchCardFailure: errorsBaseKey + 'subscribeScratchCard',
	getScratchCardFailure: errorsBaseKey + 'getScratchCard',

	blockedUserLogout			: blockedUserBaseKey + 'logout',
	oldAppUser: oldAppUserBaseKey + 'logout.',
	loginFromOldApp: oldAppUserBaseKey + 'login.',


	blockedUserSummary			: blockedUserBaseKey + 'summary',
	ipCheckFailed				: ipCheckBaseKey + "blocked",

	exotelApiRequestPrefix		: apiRequestsBaseKey + 'exotel.',
	trackCleverTapWebHookRequest: webhookRequestBaseKey + 'webhook.',

	deferredInstantCashCount 	: instantCashBaseKey + "deferred.count",
	deferredInstantCashAmount 	: instantCashBaseKey + "deferred.amount",
	deniedInstantCashCount 		: instantCashBaseKey + "denied.count",
	deniedInstantCashAmount 	: instantCashBaseKey + "denied.amount",

	diwaliReferralAllocated				: diwaliReferralBaseKey + "allocated",
	diwaliReferralReleasedReferrer		: diwaliReferralBaseKey + "released.referrer",
	diwaliReferralReleasedReferredUser	: diwaliReferralBaseKey + "released.referred-user",

	tournamentPercentageFull			: tournamentMonotoringBaseKey + 'fill.percentage.',
	tournamentPlayersRequiredPerhour	: tournamentMonotoringBaseKey + 'fill.remaining.',

	userReferralAllocated				: userReferralBaseKey + "allocated",
	userReferralReleasedReferrer		: userReferralBaseKey + "released.referrer",
	userReferralReleasedReferredUser	: userReferralBaseKey + "released.referred-user",

	zookeeperUpdateError: errorsBaseKey + "zookeeper-update",
	oldGameShowUpgradeMsg: newOldGameServerDiffBaseKey + "show-upgrade",
	oldGameShowJGMsg: newOldGameServerDiffBaseKey + "joined-game-running",
	tournamentShowAppUpgradeMsg: baseKey + 'tournament-show-upgrade',
	logoutAllSessions: sessionsBaseKey+ "logout-all.",
	userIdZeroInProvinceReq: errorsBaseKey + "userid-zreo.",
	numOtps: otpTrackingBaseKey,
	fraudUserFound: errorsBaseKey + "fraud-user.",
	tournamentApiCalls: tournamentMonotoringBaseKey + "tournament-calls.",
	formRegistrationFromOldApp: blockedUserBaseKey + "regitsration",
	getSmsWebhook: smsWebhookBaseKey,
	getWithdrawalWebhook: withdrawalWebhookBaseKey,
	scratchCardClaimByUserTypeFive: scratchCardsBaseKey + ".claimed-by.type5",
	scratchCardSubscribedByUserTypeFive: scratchCardsBaseKey + ".subscribed-by.type5",
	scratchCardClaimByUser: scratchCardsBaseKey + ".claimed",
	scratchCardSubscribedByUser: scratchCardsBaseKey + ".subscribed",
	devideIDMismatch: devideIDBaseKey + ".mismatch",
	vendorIDMismatch: vendorIDBaseKey + ".mismatch",
	trackLoggedInUserSessionNotFound: vendorIDBaseKey + ".not-found",
	devideIDNull: devideIDBaseKey + ".null",
	apiLatency: baseKey + "api-latency.",
	requestLatency: baseKey + "req-latency.",
	apiCount: baseKey + "api-count.",
	requestCount: baseKey + "req-count.",
	totalRequestThroughCB: baseKey + "cb-req.",
	fallBackInCB: baseKey + "cb-fallback.",
	circuitOpened: baseKey + "cb-opened.",
	circuitHalfOpened: baseKey + "cb-halfOpened.",
	circuitClosed: baseKey + "cb-closed.",
	requestMadeInCB: baseKey + "cb-reqMade.",

	getPromotionsCapResponseNotSameAsGenie: promotionsBaseKey + "cap_response.different",
	getPromotionsGenieResponseNotSameAsCap: promotionsBaseKey + "genie_response.different",
	userJoinedMoreThan2Games: errorsBaseKey + "more-games",
	cashfreeWithdrawalWebhookCallByStatus: baseKey + "withdrawals.webhook.cashfree.",
	razorpayWithdrawalWebhookCallByStatus: baseKey + "withdrawals.webhook.razorpay.",
	withdrawalsAcceptedByWithdrawalService: baseKey + "withdrawal.request.success",
	withdrawalsErrorsByStatus: baseKey + "withdrawal.request.error.",
	paymentResponseStatusRate: addCashBaseKey + "processPayment.status.",
	getjuspayListError: addCashBaseKey + "juspay.error.list.",
	createAuthenticateJuspayError: addCashBaseKey + "juspay.error.createAuthenticate.",
	refreshWalletJuspayError: addCashBaseKey + "juspay.error.refreshwallet.",
	linkWalletJuspayError: addCashBaseKey + "juspay.error.linkwallet.",
	orderCreationFailed: addCashBaseKey + "error.orderCreationFailed.",
	addRealChipsToCapError: addCashBaseKey + "error.addRealChipsToCapError.",
	addRealChipsPromoError: addCashBaseKey + "error.addRealChipsPromoError.",
	fetchAddCashPacksError: addCashBaseKey + "error.fetchAddCashPacksError.",
	userAddCashPacksError: addCashBaseKey + "error.userAddCashPacksError.",
	generateWithdrawalOtpError: baseKey + "withdrawal.request.error.generateOtp",
	getWithdrawalsError: baseKey + "withdrawal.request.error.getWithdrawalsError",
	getRealChipsErrors: baseKey + "withdrawal.request.error.getRealChipsErrors",
	servicesErrorsPrefixV2: errorsBaseKey + 'v2.',
	allocateRegGiftErrors: 'gift-service.RegGift.errors.allocateRegGiftErrors.',
	getRegGiftErrors: 'gift-service.RegGift.errors.getRegGiftErrors.',
	updateRegGiftErrors: 'gift-service.RegGift.errors.updateRegGiftErrors.',
	updateRegGiftInCapErrors: 'gift-service.RegGift.errors.updateRegGiftInCapErrors.',
	successfullGiftRewarded: 'gift-service.RegGift.successfullGiftRewarded.',
	userBlockedForKyc: 'gift-service.RegGift.errors.userBlockedForKyc',
	allocateRegGiftCount: 'gift-service.RegGift.allocateRegGiftCount',
	allocateRefRegGiftCount: 'gift-service.RegGift.allocateRefRegGiftCount',
	allocateTotalRegGiftCount: 'gift-service.RegGift.allocateTotalRegGiftCount',
	getUserKycError: baseKey + "error.getUserKycError",
	updateUserKycError: baseKey + "error.updateUserKycError",
	requestError: baseKey + "req-error.",
	rejectUserKycApiError: baseKey + "api-error.POST-user.kyc_reject.",
	addUserKycUpiApiError: baseKey + "api-error.POST-user.kyc_upi.",
	updateKycDocumentApiError: baseKey + "api-error.POST-user.kyc_document.",
	getKycDetailsApiError: baseKey + "api-error.GET-user.kyc.",
	juspaySdkInitiatePayment: addCashBaseKey + "juspay.initiatePayment.",
	getUserQuestApiError: baseKey + "api-error.GET-user_quest.",
	assignUserQuestApiError: baseKey + "api-error.POST-assign_user_quest.",
	activateUserQuestApiError: baseKey + "api-error.POST-activate_user_quest.",
	claimActionRewardApiError: baseKey + "api-error.POST-claim_action_reward.",
	appDownloadsFraudUserIP: errorsBaseKey + 'fraudUser.AppDownloadsIP.',
	appDownloadsFraudUserMobile: errorsBaseKey + 'fraudUser.AppDownloadsMobile.',
	getQuestApiError: baseKey + "api-error.GET-quest.",
	claimQuestApiError: baseKey + "api-error.POST-claim_quest.",
    userAnalyticsDataApiError: `${baseKey}api-error.GET-user.analyticsData.`,
	userSessionApiError: `${baseKey}api-error.GET-user.session.`,
	generateOtpApiError: `${baseKey}api-error.POST-auth.generateOtp.`,
	otpLoginApiError: `${baseKey}api-error.POST-auth.otpLogin.`,
	userCheckStatusApiError: `${baseKey}api-error.POST-user.checkStatus.`,
	userPersonalGetApiError: `${baseKey}api-error.GET-user.personal.`,
	userPersonalPostApiError: `${baseKey}api-error.POST-user.personal.`,
	userSummaryApiError: `${baseKey}api-error.GET-user.summary.`,
	getPromotionsApiError: `${baseKey}api-error.GET-v2.marketing.promotions.`,
	exotelCheckPaymentError: `${baseKey}api-error.exotel-check-payment.`,
	exotelWithdrawalError: `${baseKey}api-error.exotel-check-withdrawal.`,
	sherlockRecomendationError: `${baseKey}api-error.GET-user.recommendation.`,
	appConfigError: `${baseKey}api-error.GET-app.config.`,
	withdrawalDowntime: `${baseKey}GET-downtime.summary.`,
	withdrawalDowntimeApiError: `${baseKey}api-error.GET-downtime.summary.`,
	trackSmsEmail: baseKey + "communication.",
	appTypeMisMatch: appTypeBaseKey + ".mismatch.",
};

const trackLoginFromOldApp = function(appVersion) {
	sdc.increment(keys.loginFromOldApp + appVersion);
}

const trackScratchCardClaimByUserTypeFive = function() {
	sdc.increment(keys.scratchCardClaimByUserTypeFive);
}

const trackScratchCardSubscribedByUserTypeFive = function() {
	sdc.increment(keys.scratchCardSubscribedByUserTypeFive);
}

const trackScratchCardClaimByUser = function() {
	sdc.increment(keys.scratchCardClaimByUser);
}

const trackScratchCardSubscribedByUser = function() {
	sdc.increment(keys.scratchCardSubscribedByUser);
}

const trackFormRegistrationFromOldApp = function(appVersion) {
	sdc.increment(keys.formRegistrationFromOldApp + appVersion);
}

const trackFraudUser = function() {
	sdc.increment(keys.fraudUserFound);
}

const trackTournamentApiCalls = function() {
	sdc.increment(keys.tournamentApiCalls);
}

const trackOtpGenerated = function() {
	sdc.increment(keys.numOtps);
};

const trackOtpVerified = function() {
	sdc.decrement(keys.numOtps);
};

const trackBlockedUserLogout = function() {
	sdc.increment(keys.blockedUserLogout);
};

const trackOldAppUserLogout = function(appVersion) {
	sdc.increment(keys.oldAppUser + appVersion);
}

const trackBlockedUserSummary = function() {
	sdc.increment(keys.blockedUserSummary);
};

const trackDiwaliReferralAllocated = function() {
	sdc.increment(keys.diwaliReferralAllocated);
};

const trackDiwaliReferralReleasedReferrer = function() {
	sdc.increment(keys.diwaliReferralReleasedReferrer);
};

const trackDiwaliReferralReleasedReferredUser = function() {
	sdc.increment(keys.diwaliReferralReleasedReferredUser);
};

const trackUserReferralAllocated = function() {
	sdc.increment(keys.userReferralAllocated);
};

const trackUserReferralReleasedReferrer = function() {
	sdc.increment(keys.userReferralReleasedReferrer);
};

const trackUserReferralReleasedReferredUser = function() {
	sdc.increment(keys.userReferralReleasedReferredUser);
};

const trackDeferredInstantCash = function(amount) {
	sdc.increment(keys.deferredInstantCashCount);
	sdc.increment(keys.deferredInstantCashAmount, amount);
};

const trackDeniedInstantCash = function(amount) {
	sdc.increment(keys.deniedInstantCashCount);
	sdc.increment(keys.deniedInstantCashAmount, amount);
};

const trackBackendServiceError = function(key) {
	sdc.increment(keys.servicesErrorsPrefix + key);
};
const trackBackendServiceErrorWithUrl = function(key) {

	sdc.increment(keys.servicesErrorsPrefixV2 + key);
};

const trackNonXhrApiCall = function(key) {
	sdc.increment(keys.nonXhrErrorsPrefix + key);
};

const trackUncaughtException = function() {
	sdc.increment(keys.uncaughtException);
};

const trackNoTournamentFoundException = function() {
	sdc.increment(keys.noTournamentFound);
};
const trackClaimScratchCardFailure = function() {
	sdc.increment(keys.claimScratchCardFailure);
};

const trackSubscribeScratchCardFailure = function() {
	sdc.increment(keys.subscribeScratchCardFailure);
};

const trackGetScratchCardFailure = function() {
	sdc.increment(keys.getScratchCardFailure);
};


const trackInvalidTournaments = function(count) {
	sdc.gauge(keys.invalidTournaments, count);
};

const trackExotelApiRequest = function(action) {
	sdc.increment(keys.exotelApiRequestPrefix + action);
};

const trackTournamentPercentageFull = function(tournamentId, joinedPercentage) {
	sdc.gauge(keys.tournamentPercentageFull + tournamentId, joinedPercentage)
}

const trackTournamentPlayersRequiredPerhour = function(tournamentId, playersRequiredPerhour) {
	sdc.gauge(keys.tournamentPlayersRequiredPerhour + tournamentId, playersRequiredPerhour)
}

const trackCleverTapWebHookRequest = function(action) {
	sdc.increment(keys.trackCleverTapWebHookRequest + action);
};

const trackZookeeperUpdateError = function() {
	sdc.increment(keys.zookeeperUpdateError);
}

const trackSmsEmail = (functionName) => {
	sdc.increment(keys.trackSmsEmail + functionName);
}

const track401JsonExceptionOnAddCash = function() {
	sdc.increment(keys.exception401OnAddCash);
}

const track401JsonExceptionOnInitiatePayment = function() {
	sdc.increment(keys.exception401OnInitiatePayment);
};

const trackUsersShownUpgradeMsg = function() {
	sdc.increment(keys.oldGameShowUpgradeMsg);
};

const trackUsersShownUpgradeMsgForTournament = function() {
    sdc.increment(keys.tournamentShowAppUpgradeMsg);
};

const trackUsersWithJGPlayingOnOldApp = function () {
    sdc.increment(keys.oldGameShowJGMsg);
};

const trackUsersWithFailedIpCheck = function () {
    sdc.increment(keys.ipCheckFailed);
};

const logoutAllSessions = function() {
	sdc.increment(keys.logoutAllSessions);
}
const trackUserIdZeroInProvinceReq = function(scenario) {
	sdc.increment(keys.userIdZeroInProvinceReq + scenario);
};
const trackNoOfWebhookCall = function() {
	sdc.increment(keys.getSmsWebhook);
};

const trackNoOfWithdrawalWebhookCall = function() {
	sdc.increment(keys.getWithdrawalWebhook);
};

const trackDeviceIDMismatch = function() {
	sdc.increment(keys.devideIDMismatch);
};

const trackVendorIDMismatch = function() {
	sdc.increment(keys.vendorIDMismatch);
};

const trackLoggedInUserSessionNotFound = function() {
	sdc.increment(keys.loggedInUserSessionNotFound);
};

const trackDeviceIDNull = function() {
	sdc.increment(keys.devideIDNull);
};

const apiLatencyInGrafana = (url, time) => {
	sdc.gauge(keys.apiLatency + url, time);
};

const trackRequestLatencyInGrafana = (url, time) => {
	sdc.gauge(keys.requestLatency + url, time);
};

const trackApiCountInGrafana = (url) => {
	sdc.increment(keys.apiCount + url);
};

const trackRequestCountInGrafana = (url) => {
	sdc.increment(keys.requestCount + url);
};

const trackTotalReqThroughCB = (apiName) => {
	sdc.increment(keys.totalRequestThroughCB + apiName);
};

const trackFallBackInCB = (apiName) => {
	sdc.increment(keys.fallBackInCB + apiName);
};

const trackCBOpened = (apiName) => {
	sdc.increment(keys.circuitOpened + apiName);
};

const trackCBHalfOpened = (apiName) => {
	sdc.increment(keys.circuitHalfOpened + apiName);
};

const trackCBClosed = (apiName) => {
	sdc.increment(keys.circuitClosed + apiName);
};

const trackReqMadeInCB = (apiName) => {
	sdc.increment(keys.requestMadeInCB + apiName);
};

const trackGetPromotionsCapResponseNotSameAsGenie = () => {
	sdc.increment(keys.getPromotionsCapResponseNotSameAsGenie);
};

const trackGetPromotionsGenieResponseNotSameAsCap = () => {
	sdc.increment(keys.getPromotionsGenieResponseNotSameAsCap);
};

const trackUserJoinedMoreThan2Games = () => {
	sdc.increment(keys.userJoinedMoreThan2Games);
};

const trackNoOfCashfreeWithdrawalWebhookCallByStatus = (eventName) => {
	sdc.increment(keys.cashfreeWithdrawalWebhookCallByStatus + eventName);
};

const trackNoOfRazorpayWithdrawalWebhookCallByStatus = (eventName) => {
	sdc.increment(keys.razorpayWithdrawalWebhookCallByStatus + eventName);
};

const trackNoOfWithdrawalsAcceptedByWithdrawalService = () => {
	sdc.increment(keys.withdrawalsAcceptedByWithdrawalService);
};

const trackNoOfWithdrawalsErrorsByStatus = (errorCode) => {
	sdc.increment(keys.withdrawalsErrorsByStatus + errorCode);
};

const trackPaymentResponseRate = (statusCode, sdkVersion) => {
	sdc.increment(keys.paymentResponseStatusRate + statusCode + '.' + sdkVersion);
};

const trackGetjuspayListError = (statusCode) => {
	sdc.increment(keys.getjuspayListError + statusCode);
};

const trackCreateAuthenticateJuspayError = (statusCode) => {
	sdc.increment(keys.createAuthenticateJuspayError + statusCode);
};

const trackRefreshWalletJuspayError = (statusCode) => {
	sdc.increment(keys.refreshWalletJuspayError + statusCode);
};

const trackLinkWalletJuspayError = (statusCode) => {
	sdc.increment(keys.linkWalletJuspayError + statusCode);
};

const trackGenerateWithdrawalOtpError = () => {
	sdc.increment(keys.generateWithdrawalOtpError);
};

const trackAllocateRegGiftErrors = (statusCode) => {
	sdc.increment(keys.allocateRegGiftErrors + statusCode);
};

const trackGetRegGiftErrors = (statusCode) => {
	sdc.increment(keys.getRegGiftErrors + statusCode);
};

const trackUpdateRegGiftErrors = (statusCode) => {
	sdc.increment(keys.updateRegGiftErrors + statusCode);
};

const trackUpdateRegGiftInCapErrors = (statusCode) => {
	sdc.increment(keys.updateRegGiftInCapErrors + statusCode);
};

const trackSuccessfullGiftRewarded = () => {
	sdc.increment(keys.successfullGiftRewarded);
};

const trackUserBlockedForKyc = () => {
	sdc.increment(keys.userBlockedForKyc);
};

const trackAllocateRegGiftCount = () => {
	sdc.increment(keys.allocateRegGiftCount);
};

const trackOrderCreationFailed = (statusCode) => {
	sdc.increment(keys.orderCreationFailed + statusCode);
};

const trackAddRealChipsToCapError = (statusCode) => {
	sdc.increment(keys.addRealChipsToCapError + statusCode);
};

const trackGetWithdrawalsError = (statusCode) => {
	sdc.increment(keys.getWithdrawalsError + statusCode);
};

const trackGetRealChipsErrors = (statusCode) => {
	sdc.increment(keys.getRealChipsErrors + statusCode);
};

const trackAddRealChipsPromoError = (statusCode) => {
	sdc.increment(keys.addRealChipsPromoError + statusCode);
};

const trackFetchAddCashPacksError = (statusCode) => {
	sdc.increment(keys.fetchAddCashPacksError + statusCode);
};

const trackUserAddCashPacksError = (statusCode) => {
	sdc.increment(keys.userAddCashPacksError + statusCode);
};

const trackAllocateRefRegGiftCount = () => {
	sdc.increment(keys.allocateRefRegGiftCount);
};

const trackAllocateTotalRegGiftCount = () => {
	sdc.increment(keys.allocateTotalRegGiftCount);
};

const trackGetUserKycError = () => {
	sdc.increment(keys.getUserKycError);
};

const trackUpdateUserKycError = () => {
	sdc.increment(keys.updateUserKycError)
};

const trackRequestErrorInGrafana = (url) => {
	sdc.increment(keys.requestError + url);
};

const trackRejectUserKycApiErrorInGrafana = (statusCode) => {
	sdc.increment(keys.rejectUserKycApiError + statusCode);
};

const trackAddUserKycUpiApiErrorInGrafana = (statusCode) => {
	sdc.increment(keys.addUserKycUpiApiError + statusCode);
};

const trackUpdateKycDocumentApiErrorInGrafana = (statusCode) => {
	sdc.increment(keys.updateKycDocumentApiError + statusCode);
};

const trackGetKycDetailsApiErrorInGrafana = (statusCode) => {
	sdc.increment(keys.getKycDetailsApiError + statusCode);
};

const trackJuspaySdkInitiatePayment = (sdkVersion) => {
	sdc.increment(keys.juspaySdkInitiatePayment + sdkVersion);
};

const trackGetUserQuestApiErrorInGrafana = (statusCode) => {
	sdc.increment(keys.getUserQuestApiError + statusCode);
};

const trackAssignUserQuestApiErrorInGrafana = (statusCode) => {
	sdc.increment(keys.assignUserQuestApiError + statusCode);
};

const trackActivateUserQuestApiErrorInGrafana = (statusCode) => {
	sdc.increment(keys.activateUserQuestApiError + statusCode);
};

const trackClaimActionRewardApiErrorInGrafana = (statusCode) => {
	sdc.increment(keys.claimActionRewardApiError + statusCode);
};

const trackFraudUserForAppDownloadsIP = function(ip) {
	sdc.increment(keys.appDownloadsFraudUserIP + ip);
}

const trackFraudUserForAppDownloadsMobile = function(mobile) {
	sdc.increment(keys.appDownloadsFraudUserMobile + mobile);
}

const trackGetQuestApiErrorInGrafana = (statusCode) => {
	sdc.increment(keys.getQuestApiError + statusCode);
};

const trackClaimQuestApiErrorInGrafana = (statusCode) => {
	sdc.increment(keys.claimQuestApiError + statusCode);
};

const trackErrorInGrafana = (keyName, statusCode) => {
	sdc.increment(keyName + statusCode);
};

const trackEventInGrafana = (eventKey) => {
	sdc.increment(eventKey);
}

const publishKafkaError = (name) => {
	sdc.timing(`error.kafka.${name}`, 1);
}

const publishKafkaLatency = (name, time) => {
	sdc.timing(`kafka.latency.${name}`, time);
}

const publishKafkaOps = (name) => {
	sdc.timing(`kafka.ops.${name}`, 1);
}

const trackAppTypeMisMatch = (functionName) => {
	sdc.increment(keys.appTypeMisMatch + functionName);
};


// TODO : Using old style for now. But the format is easy to convert in future.
module.exports = {
	trackLoginFromOldApp,
	trackScratchCardClaimByUserTypeFive,
	trackScratchCardSubscribedByUserTypeFive,
	trackScratchCardClaimByUser,
	trackScratchCardSubscribedByUser,
	trackFormRegistrationFromOldApp,
	trackFraudUser,
	trackTournamentApiCalls,
	trackDeferredInstantCash,
	trackDeniedInstantCash,
	trackBackendServiceError,
	trackNonXhrApiCall,
	trackUncaughtException,
	trackInvalidTournaments,
	trackNoTournamentFoundException,
	trackExotelApiRequest,

	trackDiwaliReferralAllocated,
	trackDiwaliReferralReleasedReferredUser,
	trackDiwaliReferralReleasedReferrer,
	trackCleverTapWebHookRequest,

	trackTournamentPercentageFull,
	trackTournamentPlayersRequiredPerhour,

	trackUserReferralAllocated,
	trackUserReferralReleasedReferredUser,
	trackUserReferralReleasedReferrer,
	trackZookeeperUpdateError,

	trackBlockedUserLogout,
	trackBlockedUserSummary,
	track401JsonExceptionOnAddCash,
	track401JsonExceptionOnInitiatePayment,
    trackUsersShownUpgradeMsg,
    trackUsersShownUpgradeMsgForTournament,
	trackUsersWithJGPlayingOnOldApp,
	logoutAllSessions,
	trackClaimScratchCardFailure,
	trackSubscribeScratchCardFailure,
	trackGetScratchCardFailure,
	trackUserIdZeroInProvinceReq,
	trackOldAppUserLogout,
	trackOtpGenerated,
	trackUsersWithFailedIpCheck,
	trackOtpVerified,
	trackNoOfWebhookCall,
	trackNoOfWithdrawalWebhookCall,
	trackDeviceIDMismatch,
	trackDeviceIDNull,
	apiLatencyInGrafana,
	trackRequestLatencyInGrafana,
	trackApiCountInGrafana,
	trackRequestCountInGrafana,
	trackTotalReqThroughCB,
	trackFallBackInCB,
	trackCBOpened,
	trackCBHalfOpened,
	trackCBClosed,
	trackReqMadeInCB,

	trackLoggedInUserSessionNotFound,

	trackGetPromotionsCapResponseNotSameAsGenie,
	trackGetPromotionsGenieResponseNotSameAsCap,
	trackUserJoinedMoreThan2Games,
	trackNoOfCashfreeWithdrawalWebhookCallByStatus,
	trackNoOfRazorpayWithdrawalWebhookCallByStatus,
	trackNoOfWithdrawalsAcceptedByWithdrawalService,
	trackNoOfWithdrawalsErrorsByStatus,
	trackPaymentResponseRate,
	trackGetjuspayListError,
	trackCreateAuthenticateJuspayError,
	trackRefreshWalletJuspayError,
	trackLinkWalletJuspayError,
	trackGenerateWithdrawalOtpError,
	trackBackendServiceErrorWithUrl,
	trackAllocateRegGiftErrors,
	trackGetRegGiftErrors,
	trackUpdateRegGiftErrors,
	trackUpdateRegGiftInCapErrors,
	trackSuccessfullGiftRewarded,
	trackUserBlockedForKyc,
	trackAllocateRegGiftCount,
	trackOrderCreationFailed,
	trackAddRealChipsToCapError,
	trackGetWithdrawalsError,
	trackAddRealChipsPromoError,
	trackAllocateRefRegGiftCount,
	trackAllocateTotalRegGiftCount,
	trackFetchAddCashPacksError,
	trackUserAddCashPacksError,
	trackGetRealChipsErrors,
	trackGetUserKycError,
	trackUpdateUserKycError,
	trackRequestErrorInGrafana,
	trackRejectUserKycApiErrorInGrafana,
	trackAddUserKycUpiApiErrorInGrafana,
	trackUpdateKycDocumentApiErrorInGrafana,
	trackGetKycDetailsApiErrorInGrafana,
	trackJuspaySdkInitiatePayment,
	trackVendorIDMismatch,
	trackGetUserQuestApiErrorInGrafana,
	trackAssignUserQuestApiErrorInGrafana,
	trackActivateUserQuestApiErrorInGrafana,
	trackClaimActionRewardApiErrorInGrafana,

	trackFraudUserForAppDownloadsIP,
	trackFraudUserForAppDownloadsMobile,
	trackGetQuestApiErrorInGrafana,
	trackClaimQuestApiErrorInGrafana,
	keys,
	trackErrorInGrafana,
	trackEventInGrafana,
	publishKafkaError,
	publishKafkaLatency,
	publishKafkaOps,
	trackSmsEmail,
	trackAppTypeMisMatch,
};


