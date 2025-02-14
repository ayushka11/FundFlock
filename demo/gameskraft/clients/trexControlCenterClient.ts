import { head } from 'lodash';
import TrexControlCenterError from '../errors/trex/trex-control-center-error';
import RequestUtil from "../helpers/request-util";
import QueryParam from "../models/query-param";

import {getGSCCServiceBaseUrl, getGsBearerToken} from '../services/configService';
import LoggerUtil, {ILogger} from '../utils/logger';
import {TrexClientLatencyDecorator} from "../utils/monitoring/client-latency-decorator";
import gsBaseClient from "./gsBaseClient";
import TrexControlCenterErrorUtil from '../errors/trex/trex-control-center-error-util';

const logger: ILogger = LoggerUtil.get("TrexControlCenterClient");

export default class TrexControlCenterClient {

    private static urls = {
        gsControlCenter: '/gs/cc/control/v1',
    }


    private static getTrexControlCenterHeaders() {

        const bearerToken = getGsBearerToken();
        if (bearerToken) {
            const headers: any = { 'Authorization': `Bearer ${bearerToken}`};
            return headers;
        } else {
            return {};
        }
    }

    @TrexClientLatencyDecorator
    static async getLoginSessionToken(loginSessionData, restClient) {
        try {
            logger.info(loginSessionData, `[getLoginSessionToken]`);

            const url = TrexControlCenterClient.getCompleteUrl(TrexControlCenterClient.urls.gsControlCenter);
            const pl = {
                command: "login",
                data: loginSessionData,
            }
            const headers = TrexControlCenterClient.getTrexControlCenterHeaders();
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url,pl, headers);

            logger.info(`[P52Client] [getP52SessionToken] response :: ${JSON.stringify(response || {})}`);

            return response.message;
        } catch (error) {
            logger.error(error, "Unable to generate login session token from GS control center");
            throw TrexControlCenterClient.getError(error);
        }
    }

    @TrexClientLatencyDecorator
    static async refreshToken(refreshTokenData, restClient) {
        try {
            logger.info(refreshTokenData, `[refreshToken]`);

            const url = TrexControlCenterClient.getCompleteUrl(TrexControlCenterClient.urls.gsControlCenter);
            const pl = {
                command: "refresh_token",
                data: refreshTokenData,
            }
            const headers = TrexControlCenterClient.getTrexControlCenterHeaders();
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, pl, headers);

            logger.info(`[P52Client] [refreshToken] response :: ${JSON.stringify(response || {})}`);

            return response.message;
        } catch (error) {
            logger.error(error, "Unable to generate refresj session token from GS control center");
            throw TrexControlCenterClient.getError(error);
        }
    }


    @TrexClientLatencyDecorator
    static async validateToken(tokenData, restClient) {
        try {
            logger.info(tokenData, `[validateToken]`);

            const url = TrexControlCenterClient.getCompleteUrl(TrexControlCenterClient.urls.gsControlCenter);
            const pl = {
                command: "validate_token",
                data: tokenData,
            }
            const headers = TrexControlCenterClient.getTrexControlCenterHeaders();
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, pl, headers);

            logger.info(`[P52Client] [validateToken] response :: ${JSON.stringify(response || {})}`);

            return response.message;
        } catch (error) {
            logger.error(error, "Unable to generate validateToken session token from GS control center");
            throw TrexControlCenterClient.getError(error);
        }
    }

    @TrexClientLatencyDecorator
    static async logout(data, restClient) {
        try {
            logger.info(data, `[logout]`);

            const url = TrexControlCenterClient.getCompleteUrl(TrexControlCenterClient.urls.gsControlCenter);
            const pl = {
                command: "logout",
                data: data
            }
            const headers = TrexControlCenterClient.getTrexControlCenterHeaders();
            const response = await gsBaseClient.sendPostRequestWithHeaders(restClient, url, pl, headers);

            logger.info(response, `[P52Client] [logout] response`);

            return response.message;
        } catch (error) {
            logger.error(error, "Unable to logout token from GS control center");
            throw TrexControlCenterClient.getError(error);
        }
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(getGSCCServiceBaseUrl(), relativeUrl, queryParams)
    }

     private static getError(error: any) {
        logger.error(JSON.stringify(error || {}), 'Error: ');
        const errorMessage: string = error?.message || error.errorCode;
        switch (errorMessage) {
            // Cash Table
            case "Error : CC000":
                return TrexControlCenterErrorUtil.getRuntimeError();
            case "Error : CC001":
                return TrexControlCenterErrorUtil.getBadRequest();
            case "Error : CC002":
                return TrexControlCenterErrorUtil.getJsonMarshal();
            case "Error : CC003":
                return TrexControlCenterErrorUtil.getJsonUnmarshal();
            case "Error : CC004":
                return TrexControlCenterErrorUtil.getHostCommunicationError();
            case "Error : CC005":
                return TrexControlCenterErrorUtil.getIDNotSpecified();
            case "Error : CC006":
                return TrexControlCenterErrorUtil.getDockerServiceError();
            case "Error : CC007":
                return TrexControlCenterErrorUtil.getLoginFromOtherDomain();
            case "Error : CC008":
                return TrexControlCenterErrorUtil.getLoginError();
            case "Error : CC009":
                return TrexControlCenterErrorUtil.getExpiredToken();
            case "Error : CC010":
                return TrexControlCenterErrorUtil.getInvalidToken();
            case "Error : CC011":
                return TrexControlCenterErrorUtil.getRevokedToken();
            case "Error : CC012":
                return TrexControlCenterErrorUtil.getCashTableIDAlreadyExist();
            case "Error : CC013":
                return TrexControlCenterErrorUtil.getTournamentIDAlreadyExist();
            case "Error : CC014":
                return TrexControlCenterErrorUtil.getInvalidUser();
            case "Error : CC015":
                return TrexControlCenterErrorUtil.getLoginBanned();
            case "Error : CC016":
                return TrexControlCenterErrorUtil.getPublishError();
            case "Error : CC017":
                return TrexControlCenterErrorUtil.getRoomIDAlreadyExist();
            case "Error : CC018":
                return TrexControlCenterErrorUtil.getDBIOError();
            case "Error : CC019":
                return TrexControlCenterErrorUtil.getRoomNotAvailable();
            case "Error : CC020":
                return TrexControlCenterErrorUtil.getInvalidParam();
            case "Error : CC021":
                return TrexControlCenterErrorUtil.getPrivateTableConfigNotFound();
            case "Error : CC022":
                return TrexControlCenterErrorUtil.getLimitNotSpecified();
            case "Error : CC023":
                return TrexControlCenterErrorUtil.getUnlockPCTFailed();
            case "Error : CC024":
                return TrexControlCenterErrorUtil.getPrivateCashTableIDAlreadyExist();
            case "Error : CC025":
                return TrexControlCenterErrorUtil.getPrivateCashTablePinAlreadyExist();
            case "Error : CC026":
                return TrexControlCenterErrorUtil.getPrivateTableCreationLocked();
            case "Error : CC027":
                return TrexControlCenterErrorUtil.getTournamentNotAvailable();
            case "Error : CC028":
                return TrexControlCenterErrorUtil.getEVChopAndRITBothEnabled();
            case "Error : CC029":
                return TrexControlCenterErrorUtil.getSNGNotAvailable();
            default: 
                return TrexControlCenterErrorUtil.getError(error);
        }
    }
};
