import AppUpdateConfig from "./app-update-config";
import AppLogsConfig from "./app-logs-config";
import AppDowntimeConfig from './app-downtime-config';

export default interface AppConfig {
    appUpdateConfig: AppUpdateConfig,
    appLogsConfig: AppLogsConfig,
    appDowntimeConfig: AppDowntimeConfig,
}
