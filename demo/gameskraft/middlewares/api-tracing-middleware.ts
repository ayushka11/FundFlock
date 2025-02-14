import {NextFunction, Request, Response} from 'express';
import MonitoringHelper from '../utils/monitoring-helper';
import LoggerUtil, {ILogger} from '../utils/logger';

const logger: ILogger = LoggerUtil.get("ApiTracingMiddleware");

export default function ApiTracingMiddleware(
	request: Request,
	res: Response,
	next: NextFunction,
): void {
	if (request.url && request.url.includes('health')) {
		// Ignore health checks
		return next();
	}

	const startTime: number = Date.now();

	let apiName = 'unknown';

	try {
		apiName = getApiName(request);
	} catch {
		logger.error('[ApiTracingMiddleware] Error with getting Api Name');
	}

	MonitoringHelper.publishApiOps(apiName);

	logger.info(
		`[Request] [${request.method}] [${request.url}] : `,
		JSON.stringify(request.body),
	);
	logger.info(
		`[Request] [${request.method}] [${request.url}] : `,
		JSON.stringify(request.headers.cookie),
	);
	res.on('finish', () => {
		MonitoringHelper.publishApiLatency(apiName, startTime);
		logger.info(
			`[Response] [${request.method}] [${request.url}] - ${res.statusCode} ${
				res.statusMessage
			}; ${res.get('Content-Length') || 0}b sent; latency: ${
				Date.now() - startTime
				// @ts-ignore
			}ms - ${JSON.stringify(res.body || {})}`,
		);
	});

	return next();
}

function getApiName(request: any): string {
	let pathSplit = request.path.split('/');
	pathSplit = pathSplit
		.filter((value: any) => value)
		.map((value: any) => (matchRegex(value) ? 'XXX' : value));
	const url = `${request.method}-${pathSplit.join('.')}`;
	return url;
}

function matchRegex(value: string) {
	const digitsRegex = new RegExp("^[0-9_]+$");
	const handIdRegex = new RegExp(/HH[A-Za-z0-9]+/g);
	const uuidRegex = new RegExp(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g);
	const tournamentIdRegex = new RegExp(/\d+_play$/);
	return digitsRegex.test(value) || handIdRegex.test(value) || uuidRegex.test(value) || tournamentIdRegex.test(value);
}
