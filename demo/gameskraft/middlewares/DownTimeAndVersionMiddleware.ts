
import { getAppDowntimeConfigForVendor, getAppVersionAndPlatformVersionCheck } from '../services/configService';
import DatetimeUtil from '../utils/datetime-util';
import LoggerUtil, {ILogger} from '../utils/logger';
const restHelper = require('../helpers/restHelper');

const logger: ILogger = LoggerUtil.get("DownTimeAndVersionMiddelware");

function DownTimeAndVersionMiddleware(request: any, res: any, next: any): void {
    const vendorId: string = request.headers["gk-vendor-id"] ?? "1";
	const downTimeConfig = getAppDowntimeConfigForVendor()[vendorId];
    const appVersionAndPlatformCheckConfig = getAppVersionAndPlatformVersionCheck()[vendorId];   
    const startTime = downTimeConfig?.startTime;
    const endTime = downTimeConfig?.endTime;
    const currentTime = DatetimeUtil.getTimeZoneDate(new Date()).getTime();
    const enableDownTime = downTimeConfig?.isDowntimeActive;
    const message = downTimeConfig?.apiMessage;
    if (enableDownTime &&  currentTime > startTime && currentTime <= endTime ) {
        res.send(restHelper.getErrorResponse(503, {},  message));
        return;
    } else  {
        if (request.headers.hasOwnProperty("gk-app-version-name")) {
            const  appVersion = request.headers["gk-app-version-name"];
            const  platform = request.headers["gk-platform"];
            logger.info("Platform", platform);
            const enableAppVersionCheck: boolean = appVersionAndPlatformCheckConfig?.enableAppVersionCheck;
            const appVersionToCheck: string = appVersionAndPlatformCheckConfig?.appVersionToCheck;
            const blockAppVersionMessage= appVersionAndPlatformCheckConfig?.blockedAppVersionMessage;
            const enablePlatformCheck = appVersionAndPlatformCheckConfig?.enablePlatformCheck;
            const bannedPlatforms = appVersionAndPlatformCheckConfig?.bannedPlatforms;
            const blockedPlatformMessage = appVersionAndPlatformCheckConfig?.blockedPlatformMessage;
            if (enableAppVersionCheck && appVersionToCheck && appVersion < appVersionToCheck) {
                res.send(restHelper.getErrorResponse(401, {}, blockAppVersionMessage));
                return;
            } else if (enablePlatformCheck && bannedPlatforms && bannedPlatforms.includes(platform.toLowerCase())) {
                res.send(restHelper.getErrorResponse(401, {}, blockedPlatformMessage));
                return;
            } else {
                return next();
            }
        } else {
           return  next();
        }
    }
}

export default DownTimeAndVersionMiddleware;
