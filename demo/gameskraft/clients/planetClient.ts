import RequestUtil from "../helpers/request-util";
import QueryParam from "../models/query-param";
import {getPlanetServiceBaseUrl} from "../services/configService";
import LoggerUtil, {ILogger} from '../utils/logger';
import {PlanetClientLatencyDecorator} from "../utils/monitoring/client-latency-decorator";
import PlanetServiceErrorUtil from "../errors/planet/planet-error-util";
import PlanetBaseClient from "./planetBaseClient";
import PlanetServiceError from "../errors/planet/planet-error";

const logger: ILogger = LoggerUtil.get("PlanetClient");

export default class PlanetClient {

    private static urls = {
        getLocationDetails: '/api/v1/location/verify',
        getRestrictedStates: '/api/v1/location/restricted/states'
    };

    @PlanetClientLatencyDecorator
    static async getLocationDetails(restClient: any, request): Promise<any> {
        try {
            logger.info(request,`[PlanetClient] [getLocationDetails] Request`);
            const queryParams: QueryParam[] = [];

            Object.keys(request).map(key => {
                if (request[key]) {
                    queryParams.push({param: key, value: request[key]});
                }
            })

            const url = PlanetClient.getCompleteUrl(PlanetClient.urls.getLocationDetails, queryParams);
            logger.info(`[PlanetClient] [getLocationDetails] url :: ${url}`);

            const response = await PlanetBaseClient.sendGetRequestAsync(restClient, url, 5000);
            logger.info(response, `[PlanetClient] [getLocationDetails] response :: `);
            return response;
        }
        catch (error) {
            throw PlanetClient.getError(error);
        }
    }

    @PlanetClientLatencyDecorator
    static async getRestrictedStates(restClient: any, eventType: string): Promise<any> {
        try {
            logger.info(eventType,`[PlanetClient] [getRestrictedStates] Request`);
            const queryParams: QueryParam[] = [];

            queryParams.push({param: 'eventType', value: eventType});

            const url = PlanetClient.getCompleteUrl(PlanetClient.urls.getRestrictedStates, queryParams);
            logger.info(`[PlanetClient] [getRestrictedStates] url :: ${url}`);

            const response = await PlanetBaseClient.sendGetRequestAsync(restClient, url, 5000);
            logger.info(response, `[PlanetClient] [getRestrictedStates] response :: `);
            return response?.data || {};
        }
        catch (error) {
            throw PlanetClient.getError(error);
        }
    }

    static wrapError(error: any) {
        if (error && !(error instanceof PlanetServiceError)) {
            return PlanetServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    static getErrorFromCode(errorCode: number) {
        return PlanetClient.getError({errorCode});
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(getPlanetServiceBaseUrl(), relativeUrl, queryParams)
    }

    static getLocationRestrictedByIpErrorCode(){
        return 6001;
    }


    private static getError(error: any) {
        logger.error(error, `[PlanetClient] Error`);
        switch (error.errorCode) {
            case 6001:
                return PlanetServiceErrorUtil.getLocationRestrictedByIp();
            case 6002:
                return PlanetServiceErrorUtil.getLocationRestrictedByGeoCoordinate();
            case 6003:
                return PlanetServiceErrorUtil.getLocationRestrictedMonitoringMsg1();
            case 6004:
                return PlanetServiceErrorUtil.getLocationRestrictedMonitoringMsg2();
            case 6005:
                return PlanetServiceErrorUtil.getLocationRestrictedMonitoringMsg3();
            default:
                return PlanetServiceErrorUtil.getError(error);
        }
    }
};
