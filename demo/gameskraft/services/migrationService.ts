import ExternalClient from '../clients/externalClient';
import SupernovaClient from '../clients/supernovaClient';
import {IDMUserProfile} from '../models/idm/user-idm';
import LoggerUtil, {ILogger} from '../utils/logger';
import SlackUtil from '../utils/slack-util';
import IDMService from './idmService';
import {USER_ACKNOWLEDGEMENT} from "../constants/zodiac-constants";

const logger: ILogger = LoggerUtil.get("MigrationService");
export default class MigrationService {

    public static async migrateGmzWallet(req: any, userId: string, vendorId: string, acknowledgement: number): Promise<any> {
        try {
            const idmProfile: IDMUserProfile = await IDMService.getUserDetails(req.internalRestClient, userId ?? '', vendorId);
            const networkId: string = idmProfile?.customAttributes?.vendorUniqueUserId ?? '';
            const partnerUserId: number = Number(networkId?.split('_')?.[1] ?? '0');

            if (partnerUserId) {
                const response: any = await ExternalClient.msPokerWalletToGmzTransfer(req.internalRestClient, partnerUserId);
                if (response && (response?.st ?? -1) < 0) {
                    logger.info(`[MigrationService] [migrateGmzWallet] pokerwallet to partner wallet failed  :: ${userId}, response :: ${JSON.stringify(response)}`);
                    SlackUtil.slackAlert(`Gmz migration failed | userId :: ${userId} | error :: pokerwallet to partner wallet failed, response :: ${JSON.stringify(response)}`);
                    return;
                }
                if (acknowledgement === USER_ACKNOWLEDGEMENT.ACCEPT) {
                    const response: any = await ExternalClient.gmzMigration(req.internalRestClient, partnerUserId);
                    logger.info(`[MigrationService] [migrateGmzWallet] partner migration api response :: ${JSON.stringify(response)}`);
                    response.userId = userId;
                    const supernovaResponse: any = await SupernovaClient.userWalletAndTdsMigration(req.internalRestClient, response, vendorId);
                    logger.info(`[MigrationService] [migrateGmzWallet] supernova response response :: ${JSON.stringify(supernovaResponse)}`);
                }
            }
            else {
                logger.info(`[MigrationService] [migrateGmzWallet] partnerUserId do not exist for userId  :: ${userId}`);
                SlackUtil.slackAlert(`Gmz migration failed | userId :: ${userId} | error :: partnerUserId do not exist for userId `);
            }

        } catch (error) {
            logger.error(error,`[MigrationService] [migrateGmzWallet] error :: `);
            SlackUtil.slackAlert(`Gmz migration failed | userId :: ${userId} | error :: ${JSON.stringify(error)}`);
        }
    }

}
