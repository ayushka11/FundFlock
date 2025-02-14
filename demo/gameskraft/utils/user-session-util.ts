import LoggerUtil, {ILogger} from '../utils/logger';
const redisService = require('../services/redisService');
const logger: ILogger = LoggerUtil.get("UserSessionUtil")


export default class SessionUtil {

    static async getUserSessionDetailsFromUserId(userId: number){
        const userSessionIdInRedis = await SessionUtil.getUserSessionIdFromRedis(userId);
		const sessionData = await SessionUtil.loadSessionFromRedis(userSessionIdInRedis);

		return sessionData;
    }


    static async getUserSessionIdFromRedis(userId) {
		const userSessionKey = redisService.getUserSessionKey(userId);
		const data = await redisService.getConnection().get(userSessionKey);
		logger.info({ redisData: data }, `loadUserSessionIDFromRedis response`);
		return data;
	};


    static async loadSessionFromRedis (sessionId) {
		if (!sessionId) {
			throw new Error('session id is undefined')
		}
		const redisKey = redisService.getSessionKey(sessionId);
		const data = await redisService.getConnection().hgetall(redisKey);
		logger.info(data, `loadSessionFromRedis response`);
		return data;
	};

    static async getUserGstStateCodeFromSession(userId: number): Promise<number>{
        const userSessionDetails = await SessionUtil.getUserSessionDetailsFromUserId(userId);
        let response = {};
        try {
            response = JSON.parse(userSessionDetails && userSessionDetails.location || '');
        } catch (e) {
            logger.error(e, "getLocationInternalAPI:: Error in parsing redis data");
        }
        const gstStateCode = response['gstStateCode']?? 29
        return gstStateCode
    }

}
