import {CASH_APP, REQUEST_HEADERS, REQUEST_PARAMS} from '../constants/constants';
import Pagination from '../models/pagination';

export default class RequestUtil {
	public static parseQueryParamAsNumber(
		parameters: any,
		parameterName: string,
	): number {
		return Number.parseInt(parameters[parameterName] || '0', 10);
	}

	public static parseQueryParamAsFloat(
		parameters: any,
		parameterName: string,
	): number {
		return Number.parseFloat(parameters[parameterName] || '0');
	}

	public static parseQueryParamAsString(
		parameters: any,
		parameterName: string,
	): string {
		return parameters[parameterName] || '';
	}

	public static parseQueryParamAsArray(
		parameters: any,
		parameterName: string,
	): string[] {
		return (
			(parameters[parameterName] && parameters[parameterName].split(',')) || []
		);
	}

	// Filter only number parse values
	public static parseQueryParamAsNumberArray(
		parameters: any,
		parameterName: string,
	): number[] {
		return (
			(parameters[parameterName] && parameters[parameterName].split(',')) ||
			[]
		).map((element: string) => Number.parseInt(element || '0', 10));
	}

	public static getRequestIdFromHeader(headers: any): string {
		return (
			headers[REQUEST_HEADERS.REQUEST_ID] ||
			headers[REQUEST_HEADERS.REQUEST_ID.toUpperCase()] ||
			''
		);
	}

	public static getVendorIdFromHeader(headers: any): string {
		return (
			headers[REQUEST_HEADERS.VENDOR_ID] ||
			headers[REQUEST_HEADERS.VENDOR_ID.toUpperCase()] ||
			''
		);
	}

	public static getApptypeFromHeaders(headers: any): string {
		return (
			headers[REQUEST_HEADERS.APP_TYPE] ||
			headers[REQUEST_HEADERS.APP_TYPE.toUpperCase()] ||
			''
		);
	}

	public static getPaginationInfo(query: any): Pagination {
		const offset: number = RequestUtil.parseQueryParamAsNumber(
			query,
			REQUEST_PARAMS.OFFSET_QUERY_STRING,
		);
		const numOfRecords: number = RequestUtil.parseQueryParamAsNumber(
			query,
			REQUEST_PARAMS.NUM_OF_RECORDS_QUERY_STRING,
		);

		return Pagination.get(offset, numOfRecords);
	}

	public static getTransactionId(query: any): string {
		return RequestUtil.parseQueryParamAsString(
			query,
			REQUEST_PARAMS.TRANSACTION_ID,
		);
	}

	public static getUserIp(req: any): string {
		let userIp: string = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || (req.connection.socket ? req.connection.socket.remoteAddress : null);

		if (userIp && userIp.indexOf(',') > -1) {
			userIp = userIp.substring(0, userIp.indexOf(','));
		}

		return userIp;
	}

	public static getRequestMetaInfo(req: any): any {
		return {
		  sessionId: req.cookieManager.getSessionId(),
		  deviceId: req.cookieManager.getDeviceId(),
		  clientIp: req.sessionManager.getClientIp(),
		  osName: req.gkDeviceInfo.getOsName(),
		  osVersion: req.gkDeviceInfo.getOsVersion(),
		  browserName: req.gkDeviceInfo.getBrowserName(),
		  browserVersion: req.gkDeviceInfo.getBrowserVersion(),
		  platform: req.gkDeviceInfo.getPlatform(),
		  appVersion: req.gkDeviceInfo.getCompleteAppVersion(),
		  deviceName: req.gkDeviceInfo.getDeviceName(),
		  deviceVersion: req.gkDeviceInfo.getDeviceVersion(),
		};
	}

	public static getDeviceMetaInfo(req : any) : any {
		return {
			osName: req?.gkDeviceInfo?.getOsName(),
			osVersion: req?.gkDeviceInfo?.getOsVersion(),
			browserName: req?.gkDeviceInfo?.getBrowserName(),
			browserVersion: req?.gkDeviceInfo?.getBrowserVersion(),
			platform: req?.gkDeviceInfo?.getPlatform(),
			appVersion: req?.gkDeviceInfo?.getCompleteAppVersion(),
			deviceName: req?.gkDeviceInfo?.getDeviceName(),
			deviceVersion: req?.gkDeviceInfo?.getDeviceVersion(),
		}
	}


	public static getPackStatus(query: any): number {
		return RequestUtil.parseQueryParamAsNumber(
			query,
			REQUEST_PARAMS.PACK_STATUS,
		);
	}

	public static isValidGenerateOtpRequestId(restClient: any) {
		const requestId = restClient.getRequestId();
		const pattern = /^\d{13}:GENERATE_OTP:\d+:\d+$/;
		return pattern.test(requestId);
	}
}
