import LoggerUtil, {ILogger} from '../utils/logger';
import RequestUtil from "../utils/request-util";
import PlanetService from "../services/planetService";
import PlanetUtil from "../utils/planet-util";
import ResponseUtil from "../utils/response-util";
import {PLANET_REQUEST_PARAM} from '../constants/planet-contants';

const logger: ILogger = LoggerUtil.get("PlanetController");

export default class PlanetController {

    static async getLocationDetails(req, res, next): Promise<any> {
        try {
            const {query} = req;
            const ip = RequestUtil.getUserIp(req);
            const locationRequest = PlanetUtil.getLocationParams(query, ip)
            logger.info({LocationRequest: locationRequest}, `[PlanetController] [getLocationDetails] Request`);
            const resp: any = await PlanetService.checkUserLocation(req, locationRequest);
            logger.info(resp, `[PlanetController] [updateLocation] Response `);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getRestrictedStates(req, res, next): Promise<any> {
        try {
            const {query} = req;
            const eventType: string = RequestUtil.parseQueryParamAsString(query, PLANET_REQUEST_PARAM.EVENT_TYPE);
            logger.info({EventType: eventType}, `[PlanetController] [getRestrictedStates] Request`);
            const resp: any = await PlanetService.getRestrictedStates(req, eventType);
            logger.info(resp, `[PlanetController] [getRestrictedStates] Response `);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

}
