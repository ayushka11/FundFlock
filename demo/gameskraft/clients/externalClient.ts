import { ca } from 'date-fns/locale';
import RequestUtil from '../helpers/request-util';
import QueryParam from '../models/query-param';
import { getGmzBearerToken, getGmzUrl, getP52PartnerAppUrl } from '../services/configService';
import MigrationService from '../services/migrationService';
import LoggerUtil, { ILogger } from '../utils/logger';
import BaseClient from './baseClient';

const logger: ILogger = LoggerUtil.get("ExternalClient");
export default class ExternalClient extends BaseClient {

  private static urls = {
    gmzMigrationApi: '/poker/migrate-user',
    transferToGmz: '/apis/v1/'
  }


  private static getGmzCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
    return RequestUtil.getCompleteRequestURL(getGmzUrl(), relativeUrl, queryParams);
  }

  private static getGmzHeaders(requestId: string) {
    const headers: any = {
      'authorization' : getGmzBearerToken()
    }
    return headers
  }
  public static async gmzMigration (restClient: any, userId: number): Promise<any> {
    try {
      const gmzUrl: string = ExternalClient.getGmzCompleteUrl(this.urls.gmzMigrationApi);
      const headers: any = ExternalClient.getGmzHeaders(restClient.getRequestId());
      const response: any = await BaseClient.sendPostRequestWithHeaders(restClient, gmzUrl, { userId: userId }, headers);
      logger.info(`[ExternalClient] [gmzMigration] response :: ${JSON.stringify(response)}`)
      return response && response.data;
    } catch (error) {
      logger.error(error,`[ExternalClient] [gmzMigration] error :: `)
      throw error;
    }
  }


  private static getMsPartnerAppCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
    return RequestUtil.getCompleteRequestURL(getP52PartnerAppUrl(), relativeUrl, queryParams);
  }

  public static async msPokerWalletToGmzTransfer (restClient: any, userId: number): Promise<any> {
    try{
          const url = ExternalClient.getMsPartnerAppCompleteUrl(ExternalClient.urls.transferToGmz);
          const request = {
            x: 'transfer_pw_ptr_admin',
            pl: {
              partner_uid: userId,
            }
          }
          const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, {});
          return response;
    } catch (error) {
      logger.error(error,`[ExternalClient] [msPokerWalletToGmzTransfer] error `);
    }
  }
}
