const configService = require('../services/configService');
const redisService = require('../services/redisService');
import { AuthData } from '../models/auth-data';
import LoggerUtil, {ILogger} from './logger';
import cookie = require('cookie');

const logger: ILogger = LoggerUtil.get("SocketUtil");

export default class SocketUtil {

    static async getAuthDataFromCookie(cookies : string){
        let list = {};
        let authData : AuthData;
        try{
            if(cookies){
                list = cookie.parse(cookies);
            }
            logger.info({ cookies: list }, '[SocketUtil] Successfully read all cookies from request');
            const { key } = configService.getCookiesConfig().sessionId;
            logger.info(`[SocketUtil] Reading session id from cookie : ${key}`);
            const sessionId = list[key];
            logger.info(`[SocketUtil] Session id  : ${sessionId}`);
            
            if (sessionId) {
                const redisKey = redisService.getSessionKey(sessionId);
                const data = await redisService.getConnection().hgetall(redisKey);
                logger.info(data, `[SocketUtil] loadSessionFromRedis response`);
                if(data?.loggedInUserId && data?.vendorId){
                    authData = {
                        loggedInUserId : data?.loggedInUserId,
                        vendorId : data?.vendorId
                    }
                }
            }
           
        }catch(error) {
            logger.error(error,`[SocketUtil] [getAuthDataFromCookie] :: `)
        }
		return authData;
    }
   
}