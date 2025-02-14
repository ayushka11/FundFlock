import {v4 as uuid} from 'uuid';
import monitoringHelper from '../helpers/monitoringHelper';
import {decryptString} from '../helpers/requestHelper';
import ClsUtil from '../utils/cls-util';

import LoggerUtil, {ILogger} from '../utils/logger';
import RequestUtil from "../utils/request-util";
import {NO_OP, REQUEST_HEADERS} from "../constants/constants";

const redisService = require('../services/redisService');
import configService = require('../services/configService');

const logger: ILogger = LoggerUtil.get("SessionMiddleware")

class SessionManager {

	// NOTE: This will overwrite any existing session Manager
	// in the request. So better call it before processing the request.

	// NOTE: This is only update the attributes in redis.
	// It will not replace complete session. So partial update
	// is possible.

	private attributes: any = {};
	private userDeviceInfoUpdated: boolean = false;
	private headers: any = {};
	private deviceInfo: any = {};
	private sessionId: any;
	private vendorId: any;

	constructor(deviceInfo: any, sessionId: any, vendorId: any) {
		this.sessionId = sessionId;
		this.vendorId = vendorId;
		this.attributes = {
			// Only in memory, not in redis. This must be used only in current request.
			// verifiedApiKey,
		}
		this.deviceInfo = deviceInfo;
	}

	async touchSessionInRedis(sessionId) {
		const loggedInUserId = this.attributes?.loggedInUserId
		logger.info(`Touching session in Redis for sessionId :: ${sessionId} userId :: ${loggedInUserId}`);
		const redisSessionKey = redisService.getSessionKey(sessionId);
		let redisUserKey = '';
		if (loggedInUserId) {
			redisUserKey = redisService.getUserSessionKey(loggedInUserId);
		}
		logger.info(`Touching session in Redis for redisSessionKey :: ${redisSessionKey} redisUserKey :: ${redisUserKey}`);
		try {
			const redisttl =  loggedInUserId ? configService.getSessionConfig().loggedIn.ttl : configService.getSessionConfig().nonLoggedIn.ttl;
			logger.info(`Touching session in Redis for redisttl :: ${redisttl}`);
			redisService.getConnection().expire(redisSessionKey, redisttl).then(()=> {
			if (redisUserKey)	{
				redisService.getConnection().expire(redisUserKey, redisttl).then(()=> {
					logger.info(`Successfully touched session in Redis for redisSessionKey :: ${redisSessionKey} redisUserKey :: ${redisUserKey}`);
				}).catch((error) => {
					logger.error(error, `Error in touching session in Redis for redisSessionKey :: ${redisSessionKey} redisUserKey :: ${redisUserKey}`);
					throw error;
				});
			} else {
				logger.info(`Successfully touched session in Redis for redisSessionKey :: ${redisSessionKey}`);
			}
			}).catch((error) => {
				logger.error(error, `Error in touching session in Redis for redisSessionKey :: ${redisSessionKey}`);
				throw error;
			})
		} catch (e) {
			logger.error(e, "Error in touchSessionInRedis...");
			throw e;
		}
	}

	async saveSessionInRedis(attributes) {
		logger.info(attributes, "Saving session in Redis");
		let sessionId = this.getSessionId();

		if (!sessionId) {
			sessionId = attributes.sessionId;
		}

		const redisKey = redisService.getSessionKey(sessionId);

		try {
			const arrRes = await redisService.getPipeline()
			.hmset(redisKey, attributes)
			// Depending on the session type returns the expiry
			// that should be set in redis.
			.expire(redisKey, this.getLoggedInUserId()
					? configService.getSessionConfig()
							.loggedIn.ttl : configService.getSessionConfig().nonLoggedIn.ttl)
			.exec();
			logger.info({ arrRes }, 'saveSessionInRedis:: Got response from redis js');
		} catch (e) {
			logger.error(e, "Error in saveSessionRedis...");
			throw e;
		}
		return attributes;
	}

	async saveAttributeInSession(sessionId, key, value) {
		logger.info({key, value}, "Saving attribute in Redis");

		const redisKey = redisService.getSessionKey(sessionId);

		try {
			const res = await redisService.getConnection().hset(redisKey, key, value);
			logger.info(res, 'saveAttributeInSession:: Got response from redis js');
			return res;
		} catch (e) {
			logger.error(e, "Error in saveAttributeInSession...");
			throw e;
		}
	}

	getLoggedInUserId() {
		// NOTE: Redis stores everything as a string
		if (this.attributes.loggedInUserId) {
			return parseInt(this.attributes.loggedInUserId);
		}
		return null;
	}

	getVendorId() {
		// NOTE: Redis stores everything as a string
		if (this.attributes.vendorId) {
			return parseInt(this.attributes.vendorId);
		}
		return null;
	}

	// This is User Unique Id or `vendorId_userId`
	getLoggedInUserUniqueId(): string {
		if (this.attributes.loggedInUserId && this.vendorId) {
			return `${this.vendorId}_${this.attributes.loggedInUserId}`;
		}

		return null;
	}

	getOTP() {
		if (this.attributes.otp) {
			return parseInt(this.attributes.otp);
		}
		return null;
	}

	getPayinCustomerId(): string {
		if(this.attributes.payinCustomerId){
			return this.attributes.payinCustomerId;
		}
		return null;
	}

	getUserWalletTranactionsMaxOffset(type): number {
		const attributeName = `${type}MaxOffset`
		if(this.attributes[attributeName]){
			return this.attributes[attributeName];
		}
		return null;
	}

	setLoggedInUser(userId) {
		this.attributes.loggedInUserId = userId;

		return this.saveAttributeInSession(this.attributes.sessionId, "loggedInUserId", userId);
	}

	setOTP(otp) {
		this.attributes.otp = otp;
		return this.saveAttributeInSession(this.attributes.sessionId, "otp", otp);
	}

	setPayinCustomerId(tenetCustomerId) {
		this.attributes.payinCustomerId = tenetCustomerId;
		return this.saveAttributeInSession(this.attributes.sessionId, "payinCustomerId", tenetCustomerId);
	}

	setUserWalletTranactionsMaxOffset(type, offset) {
		const attributeName = `${type}MaxOffset`
		this.attributes[attributeName] = offset;
		return this.saveAttributeInSession(this.attributes.sessionId, attributeName, offset);
	}

	getLocation() {
		if (this.attributes.location) {
			return JSON.parse(this.attributes.location);
		}
		return undefined;
	}

	setLocation(lat, lng, ip, accuracy, state, stateFromIP, country, isAllowed, popupMessage,
		popupBtnTxt, locationPopupFrequencyType, ipBasedErrorCode, gstStateCode) {
		this.attributes.location = JSON.stringify({
			lat,
			lng,
			ip,
			accuracy,
			state,
			stateFromIP,
			country,
			isAllowed,
			ipBasedErrorCode,
			locationPopupFrequencyType,
			popupBtnTxt,
			popupMessage,
			gstStateCode
		});

		return this.saveAttributeInSession(this.attributes.sessionId, "location", this.attributes.location);
	}

	getClientIp() {
		return this.attributes.clientIp;
	}

	// Note: We are not updating the clientIp in every request because of apis from internal server hence a new fuction
	getClientIpFromRequest(){
		return this.attributes.clientIpInRequest;
	}

	// Note: Do not take IP in argument. IP from current request is already stored
	// in memory. This method will just update the session in redis.
	// In some cases, we are calling APIs from internal servers.
	// Hence we cannot update the IP in every request.
	// So call this method to persist IP change.
	updateClientIp() {
		if (this.attributes.clientIp != this.attributes.clientIpInRequest) {
			logger.info('Client IP has changed. Updating the session');
			this.attributes.clientIp = this.attributes.clientIpInRequest;

			this.saveAttributeInSession(this.attributes.sessionId, "clientIp", this.attributes.clientIp).then(NO_OP).catch(NO_OP);
		}
	}

	setUploadedFile(s3BucketName, docType, filePath) {
		const attributeName = this.getUploadedFileAttributeName(docType);

		this.attributes[attributeName] = JSON.stringify({
			filePath,
			s3BucketName,
		});

		return this.saveAttributeInSession(this.attributes.sessionId, attributeName, this.attributes[attributeName]);
	}

	getUploadedFile(docType) {
		const attributeName = this.getUploadedFileAttributeName(docType);
		const value = this.attributes[attributeName];

		return value ? JSON.parse(value) : {};
	}

	getVerifiedApiKey() {
		// Only in memory, for current request
		return this.attributes.verifiedApiKey;
	}

	async removeSession() {
		return this.removeSessionFromRedis(this.attributes.sessionId);
	}

	async removeUserSession() {
		return this.removeUserSessionFromRedis(this.attributes.loggedInUserId);
	}

	initWithNewSession(sessionId, deviceId, clientIp,reqHeaders,vendorId) {
		this.attributes.sessionId = sessionId;
		this.attributes.deviceId = deviceId;
		this.attributes.clientIp = clientIp;
		this.attributes.clientIpInRequest = clientIp;
		this.headers = reqHeaders;
		// only add vendorId when we start a new session
		this.attributes.vendorId = vendorId;
		return this.saveSessionInRedis(this.attributes);
	}

	initWithExistingSession(attributes, clientIpInRequest, reqHeaders) {
		this.headers = reqHeaders;
		this.attributes = attributes;

		// Always update in memory. Not in redis.
		this.attributes.clientIpInRequest = clientIpInRequest;
	}

	getSessionId() {
		return this.attributes.sessionId;
	}

	getDeviceOs(deviceInfoObject: any) {
		// find device os name. (Same code as getDeviceDetailsJSON)
		// osName will exist because it is already checked as part of required fields
		let deviceOs = 'web';
		if (deviceInfoObject.osName && deviceInfoObject.osName === 'Other') {
			if (deviceInfoObject['gk-android-version'] && deviceInfoObject['gk-android-version'].includes('iOS')) {
				deviceOs = 'iOS';
			} else {
				deviceOs = 'Android';
			}
		}
		return deviceOs;
	}

	getDevicePlatform(logger) {
		// osName will exist because it is already checked as part of required fields
		let deviceInfoObject: any = {};
		if (typeof this.attributes.userDeviceInfo === 'string') {
			deviceInfoObject = JSON.parse(this.attributes.userDeviceInfo);
		} else if (typeof this.attributes.userDeviceInfo === 'object') {
			deviceInfoObject = this.attributes.userDeviceInfo;
		}
		logger.info({deviceInfoObject}, 'user device info data is');
		let deviceInfoResp: any = {
			platform: 'desktopWeb'
		};
		if (deviceInfoObject.osName) {
			if (deviceInfoObject.osName === 'Other'
				&& deviceInfoObject['gk-android-version']
				&& deviceInfoObject['gk-android-version'].includes('iOS')) {
				deviceInfoResp.platform = 'iOS';
				deviceInfoResp.appVersion = deviceInfoObject["gk-app-version-name"];
			} else if(deviceInfoObject.osName === 'Other') {
				deviceInfoResp.platform = 'Android';
				deviceInfoResp.appVersion = deviceInfoObject["gk-app-version-name"];
			} else if(deviceInfoObject.osName === 'iOS') {
				deviceInfoResp.platform = 'iOSMWeb';
			} else if(deviceInfoObject.osName === 'Android') {
				deviceInfoResp.platform = 'androidMWeb';
			}
		}
		return deviceInfoResp;
	}

	combineDeviceInfoObjects(oldDeviceInfo, newDeviceInfo) {
		const combineDeviceInfoObject = { ...oldDeviceInfo };
		let isDataUpdated = false;
		Object.keys(newDeviceInfo).forEach((k) => {
			if (typeof newDeviceInfo[k] !== 'undefined' && newDeviceInfo[k] !== null) {
				if (oldDeviceInfo[k] && newDeviceInfo[k] === oldDeviceInfo[k]) {
					return;
				}
				if(k === 'osName' && oldDeviceInfo[k]){
					return;
				}
				combineDeviceInfoObject[k] = newDeviceInfo[k];
				isDataUpdated = true;
			}
		});
		return [combineDeviceInfoObject, isDataUpdated];
	}

	getUserDeviceInfo() {
		// Create object out of user device details
		let deviceInfoObject = {};
		if (typeof this.attributes.userDeviceInfo === 'string') {
			deviceInfoObject = JSON.parse(this.attributes.userDeviceInfo);
		} else if (typeof this.attributes.userDeviceInfo === 'object') {
			deviceInfoObject = this.attributes.userDeviceInfo;
		}
		// if updated device info doesn't exist
		if (this.userDeviceInfoUpdated === false) {
			// removing allRequiresFieldsExist condition as app version is not updated due to this.
			this.userDeviceInfoUpdated = true;
			const userDeviceInfoInCurrentRequest = {
				...{
					'gk-device-name': this.headers['gk-device-name'],
					'gk-android-version': this.headers['gk-android-version'],
					'gk-app-version-name': this.headers['gk-app-version-name'],
					'gk-advertising-id': this.headers['gk-advertising-id'],
					'gk-uuid': this.headers['gk-uuid'],
					'gk-wifi-mac': this.headers['gk-wifi-mac'],
					'gk-android-id': this.headers['gk-android-id'],
					'gk-app-type': this.headers['gk-app-type'],
					'gk-device-id': this.headers['gk-device-id'],
					browserName: this.deviceInfo.getBrowserName(),
					browserVersion: this.deviceInfo.getBrowserVersion(),
					osName: this.deviceInfo.getOsName(),
					osVersion: this.deviceInfo.getOsVersion(),
				},
				...decryptString(this.headers['gk-header-data'], this.sessionId),
			};
			deviceInfoObject = this.combineDeviceInfoObjects(
				deviceInfoObject, userDeviceInfoInCurrentRequest,
			);
			if (deviceInfoObject[1]) {
				this.attributes.userDeviceInfo = JSON.stringify(deviceInfoObject[0]);
				this.saveAttributeInSession(this.attributes.sessionId, "userDeviceInfo", this.attributes.userDeviceInfo).then(NO_OP).catch(NO_OP);
			}
			if(Array.isArray(deviceInfoObject)){
				deviceInfoObject = deviceInfoObject[0];
			}
		}
		return deviceInfoObject;
	}

	async loadSessionFromRedis (sessionId) {
		if (!sessionId) {
			throw new Error('session id is undefined')
		}
		const redisKey = redisService.getSessionKey(sessionId);
		const data = await redisService.getConnection().hgetall(redisKey);

		logger.info(data, `loadSessionFromRedis response`);

		return data;
	};

	// important: only use this function whenever the user is logged in
	async updateUserSessionInRedis() {
		//SessionId
		const userSessionIdInRedis = await this.getUserSessionIdFromRedis(this.attributes.loggedInUserId);
		logger.info(`received the user session from redis :: ${userSessionIdInRedis}`);

		const sessionId = this.getSessionId();
		logger.info(`checking with current session id :: ${sessionId}`);
		//user mapping with session id
		const userSessionKey = redisService.getUserSessionKey(this.attributes.loggedInUserId);
		const existingSessionKey = redisService.getSessionKey(userSessionIdInRedis);

		return redisService.getPipeline()
		.set(userSessionKey, sessionId)
		.expire(userSessionKey, configService.getSessionConfig().loggedIn.ttl)
		.exec()
		.then(() => {
			logger.info(`"Successfully updated user session key to ${sessionId}`);
			if(userSessionIdInRedis !== sessionId) {
				redisService.getConnection().del(existingSessionKey).then(() => {
					logger.info(`"Successfully deleted existing session key ${existingSessionKey}`);
				}).catch(e => {
					logger.error(e, `Error in deleting existing session key :: ${existingSessionKey}`);
				})
			}
		})
		.catch(e => {
			logger.error(e, `Error in updating existing user session key to :: ${sessionId}`);
			throw e
		});
	}

	async getUserSessionDataFromRedis(userId) {
		const userSessionIdInRedis = await this.getUserSessionIdFromRedis(userId);
		const sessionData = await this.loadSessionFromRedis(userSessionIdInRedis);

		return sessionData;
	}

	async getUserSessionIdFromRedis(userId) {
		const userSessionKey = redisService.getUserSessionKey(userId);
		const data = await redisService.getConnection().get(userSessionKey);

		logger.info({ redisData: data }, `loadUserSessionIDFromRedis response`);
		return data;
	};

	async removeSessionFromRedis(sessionId) {
		const redisKey = redisService.getSessionKey(sessionId);

		return redisService.getConnection().del(redisKey);
	};

	async removeUserSessionFromRedis(userId) {
		const redisKey = redisService.getUserSessionKey(userId);
		logger.info(`inside [sessionMiddleware] [removeUserSessionFromRedis] ${redisKey}`);
		return redisService.getConnection().del(redisKey);
	};

	getUploadedFileAttributeName(docType) {
		return `uploaded_${docType}`;
	}
}

async function SessionMiddleware(req: any, res: any, next: any): Promise<any> {

	const vendorId = req.vendorId;

	logger.info(`Inside Session middleware:: Vendor is :: ${vendorId}`);

	let sessionId = req.cookieManager.getSessionId();
	logger.info({ sessionId: `${sessionId}` }, `SessionId read from cookie ${sessionId}`);

	// Check if the device id cookie is present
	let deviceId = req.cookieManager.getDeviceId();
	logger.info({ deviceId: `${deviceId}` }, 'DeviceId read from cookie');

	// NOTE: These dependencies cannot be initialized earlier.
	const restHelper = require('../helpers/restHelper');
	const responseHelper = require('../helpers/responseHelper');

	if (!deviceId) {
		deviceId = uuid();
		logger.info(`Generated new device id : ${deviceId}`);

		req.cookieManager.setDeviceId(deviceId);
	}

	ClsUtil.addDeviceIdToRequestNS(deviceId);

	const userIp = RequestUtil.getUserIp(req);

	const sessionManager: SessionManager = new SessionManager(req.gkDeviceInfo, sessionId, vendorId);
	req.sessionManager = sessionManager; // Setting sessionManager in request object

	let redisData: any = {};
	try {
		let attributes: any = await sessionManager.loadSessionFromRedis(sessionId);

		if (!attributes || Object.keys(attributes).length == 0) {
			throw new Error("Attributes is null or empty");
		}

		// Session already present for the User
		logger.info({ attributes }, 'Successfully loaded the saved session.');

		if (attributes.deviceId != deviceId) {
			logger.info({ attributes }, "ERROR: DeviceId doesn't match with the saved session.");
			monitoringHelper.trackDeviceIDMismatch();
		}

		sessionManager.initWithExistingSession(attributes, userIp, req.headers);
		ClsUtil.addUserIdToRequestNS(sessionManager.getLoggedInUserId());

		// Now we can safely update the session expiry. No need to update any attribute.
		// Kinda touch the session in redis.
		try {
			await sessionManager.touchSessionInRedis(sessionId);
			redisData = attributes;
		} catch (e) {
			logger.error(e, "error in touching session");
		}
	} catch (e) {
		logger.error(e);
		logger.info({ sessionId },
				`Unable to load session [${sessionId}] from redis.`);

		// Create new session as no session exists
		sessionId = uuid();
		logger.info({ sessionId }, 'Generated new session id. Creating new session with this new session id.');

		try {
			logger.info(`initialising a new session`);
			redisData = await sessionManager.initWithNewSession(
					sessionId,
					deviceId, userIp,req.headers, vendorId
			);
			logger.info(redisData, "initWithNewSession redis response");
		} catch (e) {
			logger.error(e, "initWithNewSession failed..");
			res.send(restHelper.getErrorResponse(401, {
				// Nothing as of now
			}, "unauthorized"));

			// No need to call other handlers
			return;
		}

		logger.info(`New Session :: setting sessionId cookie:: ${sessionId}`);
		req.cookieManager.setSessionId(sessionId);
	}

	// Post processing
	let isNewSession = (sessionId != redisData.sessionId);
	sessionId = redisData.sessionId;

	// Now that session id is decided, we can initialize other modules
	ClsUtil.addSessionIdToRequestNS(sessionId);

	const appType = RequestUtil.parseQueryParamAsString(req.headers, REQUEST_HEADERS.APP_TYPE);

	restHelper.initInternalRestClient(req, req.requestId, sessionId, deviceId, userIp, appType, vendorId);
	responseHelper.initResponseManager(req, res);

	logger.info(`received redisData as :: ${JSON.stringify(redisData)}`);

	if (isNewSession) {
		logger.info(`New Session :: setting sessionId cookie:: ${sessionId}`);
		req.cookieManager.setSessionId(sessionId);
	}

	return next();
}

export default SessionMiddleware;
