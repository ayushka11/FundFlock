import KSUID from 'ksuid';
import { EVENT_PUSH_NAMES, EVENT_PUSH_TOPICS } from "../constants/constants";
import EventNames from "./enums/eventNames"
import KafkaUtil from '../utils/kafka-util';
import LoggerUtil, { ILogger } from '../utils/logger';
import ClsUtil from '../utils/cls-util';
const logger: ILogger = LoggerUtil.get("EventPushService");
const getAppType = (): string => {
	const appType: string = ClsUtil.getAppType();
	return appType;
};

export default class EventPushService {

    private static eventPushTopics: { [key: string] : string } = {
        [EventNames.USER_LOGOUT_SUCCESS]: EVENT_PUSH_TOPICS.USER_LOGOUT,
        [EventNames.USER_LOCATION_BLOCKED_BY_IP]: EVENT_PUSH_TOPICS.USER_LOCATION,
        [EventNames.USER_LOCATION_UPDATE]: EVENT_PUSH_TOPICS.USER_LOCATION,
        [EventNames.USER_FEEDBACK]: EVENT_PUSH_TOPICS.USER_FEEDBACK,
        [EventNames.USER_PAYOUT_SUCCESS]: EVENT_PUSH_TOPICS.USER_PAYOUT,
        [EventNames.USER_PAYOUT_FAILED]: EVENT_PUSH_TOPICS.USER_PAYOUT,
        [EventNames.USER_PAYOUT_INITIATED]: EVENT_PUSH_TOPICS.USER_PAYOUT,
        [EventNames.USER_REFUND_INITIATED]: EVENT_PUSH_TOPICS.USER_PAYMENT,
        [EventNames.USER_REFUND_COMPLETED]: EVENT_PUSH_TOPICS.USER_PAYMENT,
        [EventNames.USER_REWARD_ALLOCATED]: EVENT_PUSH_TOPICS.USER_REWARD,
        [EventNames.USER_KYC_COMPLETE]: EVENT_PUSH_TOPICS.USER_KYC,
        [EventNames.USER_KYC_PENDING]: EVENT_PUSH_TOPICS.USER_KYC,
        [EventNames.USER_KYC_FAILURE]: EVENT_PUSH_TOPICS.USER_KYC,
        [EventNames.USER_KYC_PAN_SUCCESS]: EVENT_PUSH_TOPICS.USER_KYC,
        [EventNames.USER_BANK_STATUS]: EVENT_PUSH_TOPICS.USER_KYC,
        [EventNames.USER_UPI_STATUS]: EVENT_PUSH_TOPICS.USER_KYC,
        [EventNames.USER_KYC_BANK_SUCCESS]: EVENT_PUSH_TOPICS.USER_KYC,
        [EventNames.USER_DEPOSIT_SUCCESS]: EVENT_PUSH_TOPICS.USER_PAYMENT,
        [EventNames.USER_FIRST_DEPOSIT_SUCCESS]: EVENT_PUSH_TOPICS.USER_PAYMENT,
        [EventNames.USER_PROMO_BENEFIT_CREDITED]: EVENT_PUSH_TOPICS.USER_REWARD,
        [EventNames.USER_DEPOSIT_FAILURE]: EVENT_PUSH_TOPICS.USER_PAYMENT,
        [EventNames.SERVICE_DEPOSIT_FAILURE]: EVENT_PUSH_TOPICS.USER_PAYMENT,
        [EventNames.USER_KYC_EXTRACT_SUCCESS]: EVENT_PUSH_TOPICS.USER_KYC,
        [EventNames.USER_KYC_EXTRACT_FAILURE]: EVENT_PUSH_TOPICS.USER_KYC,
        [EventNames.USER_SIGNUP_SUCCESS]: EVENT_PUSH_TOPICS.USER_AUTH,
        [EventNames.USER_VERIFY_EMAIL]: EVENT_PUSH_TOPICS.USER_UPDATE,
        [EventNames.USER_INSTALLED_PACKAGES]: EVENT_PUSH_TOPICS.USER_PACKAGES,
        [EventNames.PRACTICE_APP_DOWNLOAD_SMS]: EVENT_PUSH_TOPICS.USER_SMS,
        [EventNames.USER_PROPERTIES_UPDATE]: EVENT_PUSH_TOPICS.USER_UPDATE,
        [EventNames.LEADERBOARD_USER_SETTLEMENT]: EVENT_PUSH_TOPICS.USER_LEADERBOARD_SETTLEMENT,
        [EventNames.LEADERBOARD_FRAUD_USER_SETTLEMENT]: EVENT_PUSH_TOPICS.USER_LEADERBOARD_SETTLEMENT,
        [EventNames.LEADERBOARD_RAKEBACK_USER_SETTLEMENT]: EVENT_PUSH_TOPICS.USER_LEADERBOARD_SETTLEMENT,
        [EventNames.USER_LEADERBOARD_SCORE_UPDATED]: EVENT_PUSH_TOPICS.LEADERBOARD,
        [EventNames.AUTO_TOP_UP_SETTING_UPDATE]: EVENT_PUSH_TOPICS.USER_UPDATE,
        [EventNames.LEADERBOARD_GROUP_CREATED]: EVENT_PUSH_TOPICS.LEADERBOARD_ANALYTICS,
        [EventNames.LEADERBOARD_GROUP_UPDATED]: EVENT_PUSH_TOPICS.LEADERBOARD_ANALYTICS,
        [EventNames.LEADERBOARD_CHILD_UPDATED]: EVENT_PUSH_TOPICS.LEADERBOARD_ANALYTICS,
        [EventNames.LEADERBOARD_CHILD_CREATED]: EVENT_PUSH_TOPICS.LEADERBOARD_ANALYTICS,
        [EventNames.CHILD_LEADERBOARD_STARTED]: EVENT_PUSH_TOPICS.LEADERBOARD_ANALYTICS,
        [EventNames.LEADERBOARD_PRIZE_POOL_CREATED]: EVENT_PUSH_TOPICS.LEADERBOARD_ANALYTICS,
    }

    private static eventPushNames: { [key: string] : string } = {
        [EventNames.USER_LOGOUT_SUCCESS]: EVENT_PUSH_NAMES.USER_LOGOUT_SUCCESS,
        [EventNames.USER_LOCATION_BLOCKED_BY_IP]: EVENT_PUSH_NAMES.USER_LOCATION_BLOCKED_BY_IP,
        [EventNames.USER_LOCATION_UPDATE]: EVENT_PUSH_NAMES.USER_LOCATION_UPDATE,
        [EventNames.USER_FEEDBACK]: EVENT_PUSH_NAMES.USER_FEEDBACK,
        [EventNames.USER_PAYOUT_SUCCESS]: EVENT_PUSH_NAMES.USER_PAYOUT_SUCCESS,
        [EventNames.USER_PAYOUT_FAILED]: EVENT_PUSH_NAMES.USER_PAYOUT_FAILED,
        [EventNames.USER_REWARD_ALLOCATED]: EVENT_PUSH_NAMES.USER_REWARD_ALLOCATED,
        [EventNames.USER_PROMO_BENEFIT_CREDITED]: EVENT_PUSH_NAMES.USER_PROMO_BENEFIT_CREDITED,
        [EventNames.USER_PAYOUT_INITIATED]: EVENT_PUSH_NAMES.USER_PAYOUT_INITIATED,
        [EventNames.USER_REFUND_INITIATED]: EVENT_PUSH_NAMES.USER_REFUND_INITIATED,
        [EventNames.USER_REFUND_COMPLETED]: EVENT_PUSH_NAMES.USER_REFUND_COMPLETED,
        [EventNames.USER_KYC_COMPLETE]: EVENT_PUSH_NAMES.USER_KYC_COMPLETE,
        [EventNames.USER_KYC_PENDING]: EVENT_PUSH_NAMES.USER_KYC_PENDING,
        [EventNames.USER_KYC_FAILURE]: EVENT_PUSH_NAMES.USER_KYC_FAILURE,
        [EventNames.USER_KYC_PAN_SUCCESS]: EVENT_PUSH_NAMES.USER_KYC_PAN_SUCCESS,
        [EventNames.USER_KYC_BANK_SUCCESS]: EVENT_PUSH_NAMES.USER_KYC_BANK_SUCCESS,
        [EventNames.USER_FIRST_DEPOSIT_SUCCESS]: EVENT_PUSH_NAMES.USER_FIRST_DEPOSIT_SUCCESS,
        [EventNames.USER_DEPOSIT_SUCCESS]: EVENT_PUSH_NAMES.USER_DEPOSIT_SUCCESS,
        [EventNames.USER_DEPOSIT_FAILURE]: EVENT_PUSH_NAMES.USER_DEPOSIT_FAILURE,
        [EventNames.SERVICE_DEPOSIT_FAILURE]: EVENT_PUSH_NAMES.SERVICE_DEPOSIT_FAILURE,
        [EventNames.USER_INSTALLED_PACKAGES]: EVENT_PUSH_NAMES.USER_INSTALLED_PACKAGES,
        [EventNames.USER_KYC_EXTRACT_SUCCESS]: EVENT_PUSH_NAMES.USER_KYC_EXTRACT_SUCCESS,
        [EventNames.USER_KYC_EXTRACT_FAILURE]: EVENT_PUSH_NAMES.USER_KYC_EXTRACT_FAILURE,
        [EventNames.USER_SIGNUP_SUCCESS]: EVENT_PUSH_NAMES.USER_SIGNUP_SUCCESS,
        [EventNames.USER_VERIFY_EMAIL]: EVENT_PUSH_NAMES.USER_VERIFY_EMAIL,
        [EventNames.USER_BANK_STATUS]: EVENT_PUSH_NAMES.USER_BANK_STATUS,
        [EventNames.USER_UPI_STATUS]: EVENT_PUSH_NAMES.USER_UPI_STATUS,
        [EventNames.PRACTICE_APP_DOWNLOAD_SMS]: EVENT_PUSH_NAMES.PRACTICE_APP_DOWNLOAD_SMS,
        [EventNames.USER_PROPERTIES_UPDATE]: EVENT_PUSH_NAMES.USER_PROPERTIES_UPDATE,
        [EventNames.LEADERBOARD_USER_SETTLEMENT]: EVENT_PUSH_NAMES.LEADERBOARD_USER_SETTLEMENT,
        [EventNames.LEADERBOARD_FRAUD_USER_SETTLEMENT]: EVENT_PUSH_NAMES.LEADERBOARD_FRAUD_USER_SETTLEMENT,
        [EventNames.LEADERBOARD_RAKEBACK_USER_SETTLEMENT]: EVENT_PUSH_NAMES.LEADERBOARD_RAKEBACK_USER_SETTLEMENT,
        [EventNames.AUTO_TOP_UP_SETTING_UPDATE]: EVENT_PUSH_NAMES.AUTO_TOP_UP_SETTING_UPDATE,
        [EventNames.USER_LEADERBOARD_SCORE_UPDATED]: EVENT_PUSH_NAMES.USER_LEADERBOARD_SCORE_UPDATED,
        [EventNames.LEADERBOARD_GROUP_CREATED]: EVENT_PUSH_NAMES.LEADERBOARD_GROUP_CREATED,
        [EventNames.LEADERBOARD_GROUP_UPDATED]: EVENT_PUSH_NAMES.LEADERBOARD_GROUP_UPDATED,
        [EventNames.LEADERBOARD_CHILD_UPDATED]: EVENT_PUSH_NAMES.LEADERBOARD_CHILD_UPDATED,
        [EventNames.LEADERBOARD_CHILD_CREATED]: EVENT_PUSH_NAMES.LEADERBOARD_CHILD_CREATED,
        [EventNames.LEADERBOARD_PRIZE_POOL_CREATED]: EVENT_PUSH_NAMES.LEADERBOARD_PRIZE_POOL_CREATED,
        [EventNames.CHILD_LEADERBOARD_STARTED]: EVENT_PUSH_NAMES.LEADERBOARD_CHILD_STARTED,
    }

    static async push(userId: number, vendorId: number, appType: string, eventType: string, eventData: any, extraData?: any) {
        const topic = this.eventPushTopics[eventType];
        const eventName = this.eventPushNames[eventType];
        if (!extraData) {
            extraData = {};
        }
        if (topic) {
            if (eventName) {
                const sanitizedEvent = {
                    value: JSON.stringify({
                        id: (await KSUID.random()).string,
                        userId,
                        vendorId,
                        name: eventName,
                        source: "apollo",
                        version: "1",
                        ts: Date.now(),
                        data: eventData,
                        meta: {
                            appType : appType ||  getAppType(),
                            ...extraData,
                        },
                    }),
                };
                logger.info(`[EventPushService] - topic :: ${topic} :: sanitizedEvent :: ${JSON.stringify(sanitizedEvent)}`)
                KafkaUtil.sendMessage(topic, sanitizedEvent).then((data) =>{
                    logger.info(data, "Successfully pushed kafka message")
                }).catch(e => {
                    logger.error(e, "Error in Kafka push")
                })
            } else {
                logger.error(`[EventPushService] - Unknown Event Type for eventName :: eventType :: ${eventType}`);
            }
        } else {
            logger.error(`[EventPushService] - Unknown Event Type for topic :: eventType :: ${eventType}`);
        }
    }
}
