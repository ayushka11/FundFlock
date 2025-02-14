import ClsUtil from '../utils/cls-util';
import RequestUtil from '../utils/request-util';
import LoggerUtil, {ILogger} from '../utils/logger';
import { P52_VENDOR_ID } from '../constants/constants';

const logger: ILogger = LoggerUtil.get("vendorMiddleware");

function VendorMiddleware(request: any, res: any, next: any): void {
	let vendorId: string = RequestUtil.getVendorIdFromHeader(
		request.headers,
	);

	vendorId = vendorId || P52_VENDOR_ID;
	request.vendorId = vendorId;
	logger.info(`Inside vendor middleware ${vendorId}`);
	ClsUtil.addVendorIdToRequestNS(vendorId);

	return next();
}

export default VendorMiddleware;
