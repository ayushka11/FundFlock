import {WebClient} from '@slack/web-api';
import {getSlackToken} from '../services/configService';
import LoggerUtil, {ILogger} from './logger';

const logger: ILogger = LoggerUtil.get("SlackUtil");

export default class SlackUtil {
    private static client

    public static async slackAlert(message: string) {

        if (!SlackUtil.client) {
            logger.info(`slackToken ${getSlackToken()}`);
            SlackUtil.client = new WebClient(getSlackToken());
        }

        try {
            const result = await SlackUtil.client.chat.postMessage({
                channel: '#poker-gamezy-migration-alerts',
                text: message,
            });
        } catch (error) {
            logger.error(`[SlackUtil] error ${JSON.stringify(error)}`);
        }
    }
}