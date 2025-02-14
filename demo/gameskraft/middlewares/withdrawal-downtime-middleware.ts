import ServiceErrorUtil from "../errors/service-error-util";
import DatetimeUtil from "../utils/datetime-util";
import LoggerUtil, { ILogger } from '../utils/logger';
import ResponseUtil from "../utils/response-util";
import { getDowntimeConfig } from "../services/configService";
const logger: ILogger = LoggerUtil.get("WithdrawalDownTimeMiddleware");

export function WithdrawalDownTimeMiddleware (req, res, next) {
    try {
        const withdrawalVendorConfig = getDowntimeConfig()?.withdrawal;
        const vendorId: string = req?.vendorId || "1";
        const withdrawalConfig = withdrawalVendorConfig?.[vendorId];
            const startTime = withdrawalConfig?.startTime;
            const endTime = withdrawalConfig?.endTime;
            const currentTime = DatetimeUtil.getTimeZoneDate(new Date()).getTime();
            const enableDownTime = withdrawalConfig?.isDowntimeActive;
            const message = withdrawalConfig?.apiMessage;
        if (enableDownTime &&  currentTime > startTime) {
                ResponseUtil.sendErrorResponse(res, ServiceErrorUtil.getWithdrawalDowntimeError());
                return;
        } else {
            next();
        }
    } catch (error) {
        logger.error({error}, 'Error in WithdrawalDownTimeMiddleware');
        return next(error);
    }
}