import ServiceErrorUtil from "../errors/service-error-util";
import { compareVersions } from 'compare-versions';
import { IAppVersionAndPlatform } from "../models/appversion-and-platform";

export function appVersionUtil(req) {
    let appVersion: string = '';
    if (req.headers.hasOwnProperty("gk-app-version-name")) {
        appVersion = req.headers["gk-app-version-name"]
        if (appVersion != '' && compareVersions(appVersion, "9.0.0") < 0) {
            throw ServiceErrorUtil.getInternalServerError();
        }
    }
}

export function getPlatformAndVersion(req): IAppVersionAndPlatform {
    let appVersion: string = '';
    let platform: string = '';
    if (req.headers.hasOwnProperty("gk-platform")) {
        platform = req.headers["gk-platform"]
    }
    if (req.headers.hasOwnProperty("gk-app-version-name")) {
        appVersion = req.headers["gk-app-version-name"]
    }
    return {
        version: appVersion,
        platform: (platform === 'mac' || platform === 'windows') ? 'web' : 'app'
    }
}

export default { appVersionUtil, getPlatformAndVersion }