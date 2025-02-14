import {IDMUserProfile} from '../models/idm/user-idm';
import EventNames from '../producer/enums/eventNames';
import EventPushService from '../producer/eventPushService';
import LoggerUtil from '../utils/logger';
import IDMService from './idmService';

const logger = LoggerUtil.get("UserFeedbackService");

export default class UserFeedbackService {

    static async pushUserFeedback(req: any, userId: number, vendorId: string, userMessage: string, deviceInfo: any) {
        const userDetails: IDMUserProfile = await IDMService.getUserDetails(req.internalRestClient, `${userId}`, vendorId);
        const eventData = {
            userId: userId,
            vendorId: vendorId,
            userName: userDetails.userHandle,
            userEmail: userDetails.email ?? '',
            userMessage: userMessage,
        };
        EventPushService.push(userId, Number(vendorId), '', EventNames.USER_FEEDBACK, eventData);
    }
};