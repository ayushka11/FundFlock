const configService = require('../services/configService');
import LoggerUtil, {ILogger} from '../utils/logger';
import cookie = require('cookie');

const logger: ILogger = LoggerUtil.get("CookiesMiddleware");

const __getBaseDomain = function (req: any) {
	const hostname = req.headers.host;
	let baseDomain = hostname;

	logger.info(`Hostname received in the req header : ${hostname}`);

	// If it is not an ip - Extract the base domain
	if (!/^[0-9.:]*$/.test(hostname)) {
		const parts = hostname.split(':')[0].split('.');	// Remove port and find parts
		if (parts.length > 2) {
			// Now the hostname is a subdomain. Set the base domain for cookie
			baseDomain = `.${parts[parts.length - 2]}.${parts[parts.length - 1]}`;
			logger.info(`Base domain is : ${baseDomain}`);
		}
	}

	// In all other cases same hostname will be used

	return baseDomain;
};

const __getAllCookies = function (req) {
	let list = {};
	const rc = req.headers.cookie;

	if (rc) {
		list = cookie.parse(rc);
	}

	logger.info({ cookies: list }, 'Successfully read all cookies from request');

	return list;
};

function CookiesMiddleware(req: any, res: any, next: any): void {

	// NOTE: This will overwrite any existing cookie Manager
	// in the request. So better call it before processing the request.
	req.cookieManager = {
		__req: req,
		__res: res,
		__cookies: {},
		__appVersion: null,

		// getAppVersion: function() {
		// 	return this.__appVersion;
		// },

		getDeviceId() {
			const { key } = configService.getCookiesConfig().deviceId;
			logger.info(`Reading device id from cookie : ${key}`);
			return this.__cookies[key];
		},

		getSessionId() {
			const { key } = configService.getCookiesConfig().sessionId;
			logger.info(`Reading session id from cookie : ${key}`);
			return this.__cookies[key];
		},

		getToken() {
			const { key } = configService.getCookiesConfig().token;
			logger.info(`Reading token from cookie : ${key}`);
			return this.__cookies[key];
		},

		setDeviceId(deviceId) {
			this.__setCookie(configService.getCookiesConfig().deviceId,
				deviceId, __getBaseDomain(this.__req));
		},

		setSessionId(sessionId) {
			this.__setCookie(configService.getCookiesConfig().sessionId,
				sessionId, __getBaseDomain(this.__req));
		},

		setToken(token) {
			this.__setCookie(configService.getCookiesConfig().token,
				token, __getBaseDomain(this.__req));
		},

		__setCookie(cookieConfig, value, domain) {
			const { key } = cookieConfig;
			const { maxAge } = cookieConfig;

			logger.info({ key, value, maxAge }, 'Setting cookie in response');
			this.__res.cookie(key, value, { domain, maxAge, secure: true, sameSite: 'none' });
			this.__cookies[key] = value;
		},

		__init(reqCookies, reqHeaders, callback) {
			const self = this;

			logger.info({ reqCookies, reqHeaders }, 'Initializing cookie manager.');

			self.__cookies = reqCookies;
			const appVersionHeader = reqHeaders['app-version'];
			self.__appVersion = appVersionHeader && !isNaN(appVersionHeader) ? parseFloat(appVersionHeader) : null;

			callback();
		},
	};

	// TODO: Cleanup request object, so that no one can directly manage cookies
	req.cookieManager.__init(__getAllCookies(req), req.headers, next);
}

export default CookiesMiddleware;
