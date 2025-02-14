import MonitoringHelper from './monitoring-helper';
import LoggerUtil, {ILogger} from './logger';

const logger: ILogger = LoggerUtil.get("UncaughtExceptionHandler");

export function handleUncaughtException(): void {
	process.on('uncaughtException', (error: Error) => {
		logger.error(
			'************************ Caught uncaughtException ************************',
		);
		logger.error(`Uncaught:: ${JSON.stringify(error || {})}`);
		if (error && error.stack) logger.error(error);
		logger.error(
			'**************************************************************************',
		);
		MonitoringHelper.publishUncaughtException(error.name || '');
	});
}
