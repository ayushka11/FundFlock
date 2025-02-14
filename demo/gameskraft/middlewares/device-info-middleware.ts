import LoggerUtil, {ILogger} from '../utils/logger';
import RequestUtil from "../utils/request-util";
import {REQUEST_HEADERS} from "../constants/constants";
import ClsUtil from "../utils/cls-util";

const useragent = require('useragent');

const logger: ILogger = LoggerUtil.get("DeviceInfoMiddleware");

function DeviceInfoMiddleware(req: any, res: any, next: any): void {

	req.gkDeviceInfo = {
		__osName: null,
		__osVersion: null,
		__browserName: null,
		__browserVersion: null,
		__deviceName: null,
		__deviceVersion: null,

		__platform: null,
		__appVersion: null,
		__bundleVersion: null,

		__init(agent, headers) {
			this.__platform = RequestUtil.parseQueryParamAsString(headers, REQUEST_HEADERS.PLATFORM);
			this.__osName = agent.os.family;
			this.__osVersion = agent.os.toVersion();
			this.__browserName = agent.family;
			this.__browserVersion = agent.toVersion();
			this.__deviceName = this.__platform === 'web' && agent.device.family || RequestUtil.parseQueryParamAsString(headers, REQUEST_HEADERS.DEVICE_NAME);
			this.__deviceVersion = this.__platform === 'web' && agent.device.toVersion() || RequestUtil.parseQueryParamAsString(headers, REQUEST_HEADERS.DEVICE_VERSION);
			this.__appVersion = RequestUtil.parseQueryParamAsString(headers, REQUEST_HEADERS.APP_VERSION);
			this.__bundleVersion = RequestUtil.parseQueryParamAsString(headers, REQUEST_HEADERS.BUNDLE_VERSION);
		},

		getOsName() {
			return this.__osName;
		},
		getOsVersion() {
			return this.__osVersion;
		},
		getBrowserName() {
			return this.__browserName;
		},
		getBrowserVersion() {
			return this.__browserVersion;
		},
		getPlatform() {
			return this.__platform;
		},
		getAppVersion() {
			return this.__appVersion;
		},
		getBundleVersion() {
			return this.__bundleVersion;
		},
		getCompleteAppVersion() {
			return this.__platform !== 'web' && `${this.__appVersion}.${this.__bundleVersion}` || this.__bundleVersion;
		},
		getDeviceName() {
			return this.__deviceName;
		},
		getDeviceVersion() {
			return this.__deviceVersion;
		},
	};

	// Now we can initialize the device info
	try {
		const agent = useragent.parse(req.headers['user-agent']);
		logger.info({ agent }, 'User agent details');

		req.gkDeviceInfo.__init(agent, req.headers);

		ClsUtil.addPlatformToRequestNS(req.gkDeviceInfo.getPlatform());
		ClsUtil.addAppVersionToRequestNS(req.gkDeviceInfo.getCompleteAppVersion());
	} catch (e) {
		logger.error("Error in device info init", e);
		return next(e);
	}

	next();
}

export default DeviceInfoMiddleware;
