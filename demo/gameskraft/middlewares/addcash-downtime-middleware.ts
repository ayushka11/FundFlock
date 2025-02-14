import ServiceErrorUtil from "../errors/service-error-util";
import DatetimeUtil from "../utils/datetime-util";
import LoggerUtil, { ILogger } from '../utils/logger';
import ResponseUtil from "../utils/response-util";
import { getDowntimeConfig } from "../services/configService";
const logger: ILogger = LoggerUtil.get("AddCashDownTimeMiddleware");

export function AddCashDownTimeMiddleware (req, res, next) {
    try {
        const addCashDowntimeVendorConfig = getDowntimeConfig()?.addCash;
        const vendorId: string = req?.vendorId || "1";
        const addCashConfig = addCashDowntimeVendorConfig?.[vendorId];
            const startTime = addCashConfig?.startTime;
            const endTime = addCashConfig?.endTime;
            const currentTime = DatetimeUtil.getTimeZoneDate(new Date()).getTime();
            const enableDownTime = addCashConfig?.isDowntimeActive;
            const message = addCashConfig?.apiMessage;
        if (enableDownTime &&  currentTime > startTime) {
                ResponseUtil.sendErrorResponse(res, ServiceErrorUtil.getAddCashDowntimeError());
                return;
        } else {
            next();
        }
    } catch (error) {
        logger.error({error}, 'Error in AddCashDownTimeMiddleware');
        return next(error);
    }
}