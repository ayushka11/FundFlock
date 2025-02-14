const configService = require('../services/configService');
import LoggerUtil from "../utils/logger";

const logger = LoggerUtil.get('analyticsHelper');

// For all internal API calls
// A new client should be created on every new client request
exports.initGkAnalyticsClient = function(req, sessionId, deviceId, clientIp, interactionId,
		osName, osVersion, browserName, browserVersion) {

	const __sendEventToServer = function(sessionId, deviceId, interactionId,
			osName, osVersion, browserName, browserVersion,
			eventName, userId, errorCode, eventData) {

		const eventRequest = {
			eventName : eventName, // sessionStart, login, sessionEnd
			sessionId : sessionId,
			deviceId : deviceId,
			interactionId : interactionId,
			source : "nodeProxy",	// Fixed for node proxy component
			eventTimeStamp : Date.now(),
			errorCode : errorCode, // Error Code .... 0 if success.
			eventHeaders : "{}", // N.A.
			eventData :  JSON.stringify(eventData),
			additionalField : "{}" // N.A.
		};

		if (userId) {
			eventRequest.userId = userId;
		}

		logger.info({eventRequest: eventRequest}, "Sending event details to gk analytics");

		// var config = configService.getAnalyticsServiceConfig();

		// Call Async
		setImmediate(() => {
			// analyticsClient
			// 	.genericEventClient(config.host, config.port)
			// 	.trackData(eventRequest, function(err, res) {
			// 		if (err) {
			// 			logger.error({err: err}, "Some error occurred in gk analytics");
			// 		}
			//
			// 		logger.info({res: res}, "Got response from gk analytics");
			// 	});
		});
	};

	// Don't refer req inside client object
	req.gkAnalyticsClient = {
		__sessionId : undefined,
		__deviceId : undefined,
		__clientIp : undefined,
		__interactionId: undefined,
		__osName: undefined,
		__osVersion: undefined,
		__browserName: undefined,
		__browserVersion: undefined,

		trackSessionStartEvent : function() {
			this.__trackEvent("sessionStart", undefined, 0, {});
		},

		trackSessionEnd : function(userId) {
			this.__trackEvent("sessionEnd", userId, 0, {});
		},

		trackLocationUpdate : function(userId, lat, lng, ip, state, country, isAllowed) {
			this.__trackEvent("locationUpdate", userId, 0, {
				lat: lat,
				lng: lng,
				ip: ip,
				state: state,
				country: country,
				isAllowed: isAllowed
			});
		},

		trackLocationBlockedByIP : function(userId, lat, lng, ip, state, country, isAllowed, accuracyRadius) {
			this.__trackEvent("locationBlockedByIP", userId, 0, {
				lat: lat,
				lng: lng,
				ip: ip,
				state: state,
				country: country,
				isAllowed: isAllowed,
				accuracyRadius: accuracyRadius
			});
		},

		trackGoogleLoginEvent : function(userId, googleUserId, userAutoRegistered, appUuid, appMappingKey, errorCode) {
			if (userAutoRegistered) {
				// Send registration event as well as login event
				this.__trackRegisterEvent("Google", userId, googleUserId, appUuid, appMappingKey, errorCode);
			}

			this.__trackLoginEvent("Google", userId, googleUserId, errorCode);
		},

		trackGoogleOtpLoginEvent : function(userId, googleUserId, userAutoRegistered, appUuid, appMappingKey, errorCode) {
			if (userAutoRegistered) {
				// Send registration event as well as login event
				this.__trackOtpRegisterEvent("Google", userId, googleUserId, appUuid, appMappingKey, errorCode);
			}

			this.__trackOtpLoginEvent("Google", userId, googleUserId, errorCode);
		},

		trackFacebookLoginEvent : function(userId, facebookUserId, userAutoRegistered, appUuid, appMappingKey, errorCode) {
			if (userAutoRegistered) {
				this.__trackRegisterEvent("Facebook", userId, facebookUserId, appUuid, appMappingKey, errorCode);
			}

			this.__trackLoginEvent("Facebook", userId, facebookUserId, errorCode);
		},

		trackFacebookOtpLoginEvent : function(userId, facebookUserId, userAutoRegistered, appUuid, appMappingKey, errorCode) {
			if (userAutoRegistered) {
				this.__trackOtpRegisterEvent("Facebook", userId, facebookUserId, appUuid, appMappingKey, errorCode);
			}

			this.__trackOtpLoginEvent("Facebook", userId, facebookUserId, errorCode);
		},

		trackGamesKraftLoginEvent : function(userId, emailOrPhone, errorCode) {
			this.__trackLoginEvent("GamesKraft", userId, emailOrPhone, errorCode);
		},

		trackGamesKraftOtpLoginEvent : function(userId, emailOrPhone, errorCode) {
			this.__trackOtpLoginEvent("GamesKraft", userId, emailOrPhone, errorCode);
		},

		trackGamesKraftRegisterEvent : function(userId, emailOrPhone, appUuid, appMappingKey, errorCode) {
			this.__trackRegisterEvent("GamesKraft", userId, emailOrPhone, appUuid, appMappingKey, errorCode);
		},

		trackGamesKraftOtpRegisterEvent : function(userId, emailOrPhone, appUuid, appMappingKey, errorCode) {
			this.__trackOtpRegisterEvent("GamesKraft", userId, emailOrPhone, appUuid, appMappingKey, errorCode);
		},

		__trackLoginEvent : function(authProvider, userId, loginId, errorCode) {
			this.__trackEvent("login", userId, errorCode, {
				loginId: loginId,
				authProvider: authProvider
			});
		},

		__trackOtpLoginEvent : function(authProvider, userId, loginId, errorCode) {
			this.__trackEvent("otp_login", userId, errorCode, {
				loginId: loginId,
				authProvider: authProvider
			});
		},

		__trackRegisterEvent : function(authProvider, userId, loginId, appUuid, appMappingKey, errorCode) {
			this.__trackEvent("register", userId, errorCode, {
				loginId: loginId,
				authProvider: authProvider,
				appUuid: appUuid,
				appMappingKey: appMappingKey
			});
		},

		__trackOtpRegisterEvent : function(authProvider, userId, loginId, appUuid, appMappingKey, errorCode) {
			this.__trackEvent("otp_register", userId, errorCode, {
				loginId: loginId,
				authProvider: authProvider,
				appUuid: appUuid,
				appMappingKey: appMappingKey
			});
		},

		trackInitPaymentEvent : function(eventData, errorCode) {
			this.__trackEvent("mintServiceInitPayment", undefined, errorCode, eventData);
		},

		trackProcessPaymentEvent : function(eventData, errorCode) {
			this.__trackEvent("mintServiceProcessPayment", undefined, errorCode, eventData);
		},

		__trackEvent : function(eventName, userId, errorCode, eventData) {
			//userAgent:	// Not required as of now
			eventData.ip = this.__clientIp;

			// TODO : Fill this from headers
			eventData.osName = this.__osName;
			eventData.osVersion = this.__osVersion;
			eventData.browserName = this.__browserName;
			eventData.browserVersion = this.__browserVersion;

			__sendEventToServer(this.__sessionId, this.__deviceId, this.__interactionId,
					this.__osName, this.__osVersion, this.__browserName, this.__browserVersion,
					eventName, userId, errorCode, eventData);
		},

		__init : function(sessionId, deviceId, clientIp, interactionId,
				osName, osVersion, browserName, browserVersion) {
			this.__sessionId = sessionId;
			this.__deviceId = deviceId;
			this.__clientIp = clientIp;
			this.__interactionId = interactionId;
			this.__osName = osName;
			this.__osVersion = osVersion;
			this.__browserName = browserName;
			this.__browserVersion = browserVersion;
		}
	};

	logger.info({osName, osVersion, browserName, browserVersion}, 'Initializing Analytics client with device information');
	req.gkAnalyticsClient.__init(sessionId, deviceId, clientIp, interactionId,
			osName, osVersion, browserName, browserVersion);

};

