import {v4 as uuid} from 'uuid';
import ClsUtil from '../utils/cls-util';
import RequestUtil from '../utils/request-util';
import LoggerUtil, {ILogger} from '../utils/logger';
import { CASH_APP, PRACTICE_APP } from '../constants/constants';

const logger: ILogger = LoggerUtil.get("clsMiddleware");

function ClsMiddleware(request: any, res: any, next: any): void {
	ClsUtil.getNS()?.run(() => {
		let requestId: string = RequestUtil.getRequestIdFromHeader(
			request.headers,
		);

		if (requestId) {
			ClsUtil.addRequestIdToRequestNS(requestId);
		} else {
			requestId = uuid();
			ClsUtil.addRequestIdToRequestNS(requestId);
		}
		let appType = RequestUtil.getApptypeFromHeaders(request.headers);
		if(! ( appType == CASH_APP || appType == PRACTICE_APP ) ){
			appType = CASH_APP;	
		}
		ClsUtil.setAppTypeToNS(appType);

		logger.info(`clsMiddleware requestId: ${requestId}  :: appType: ${appType}`);

		request.requestId = requestId;
		next();
	});
}

export default ClsMiddleware;
