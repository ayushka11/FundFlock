import PlanetClient from "../clients/planetClient";
import LoggerUtil from "../utils/logger";
import PlanetServiceErrorUtil from "../errors/planet/planet-error-util";
import {ILocationDetails, ILocationDetailsResponse, LocationDetailsResponse} from "../models/planet/response";
import {COUNTRY} from "../constants/planet-contants";
import {LocationRequest} from "../models/planet/request";
import PlanetUtil from "../utils/planet-util";
import EventPushService from "../producer/eventPushService";
import EventNames from "../producer/enums/eventNames";

const monitoringHelper = require('../helpers/monitoringHelper');
const logger = LoggerUtil.get("PlanetService");

export default class PlanetService {
    static async checkUserLocation(req: any, request: LocationRequest): Promise<any> {
        try {
            const {lat, lng} = request;
            if (!lat || !lng) {
                throw PlanetServiceErrorUtil.getLocationDetailsNotFound();
            }

            const userId = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const deviceInfo = req.sessionManager.getUserDeviceInfo();

            // Get location details
            const response: LocationDetailsResponse = await PlanetService.getLocationDetails(req.internalRestClient, request);

            logger.info(response, `[PlanetService] [checkUserLocation] Location Details Response :: `);

            let locationDetails: ILocationDetails = PlanetUtil.setLocationDetails(response, request);

            // Process location details
            const osVersion = deviceInfo['gk-android-version'];

            //Block IOS Users outside of India
            if (locationDetails.isAllowed && osVersion !== undefined && locationDetails.country !== COUNTRY.INDIA && osVersion?.toLowerCase().includes('ios')) {
                locationDetails.isAllowed = false;
            }
            const locationDetailsResponse: ILocationDetailsResponse = {
                state: locationDetails.state,
                isAllowed: locationDetails.isAllowed
            }
            await PlanetService.updateLocation(req, userId, vendorId, deviceInfo, locationDetails);

            return locationDetailsResponse;
        } catch (error) {
            logger.info(`[PlanetService] [checkUserLocation] received error ${error}`);
            throw error;
        }
    }

    static async getLocationDetails(restClient: any, request: LocationRequest): Promise<LocationDetailsResponse> {
        try {
            logger.info(request, `[PlanetService] [getLocationDetails] Request :: `);
            const response: LocationDetailsResponse = await PlanetClient.getLocationDetails(restClient, request);
            logger.info(response, `[PlanetService] [getLocationDetails] Response :: `);
            return response;
        } catch (e) {
            logger.info(e, `[PlanetService] [getLocationDetails] received error`);
            throw e;
        }
    }

    static async updateLocation(req: any, userId: number, vendorId: string, deviceInfo: any, locationDetails: ILocationDetails): Promise<void> {
        await req.sessionManager.setLocation(
            locationDetails.lat,
            locationDetails.lng,
            locationDetails.ip,
            locationDetails.accuracy,
            locationDetails.state ,
            locationDetails.stateFromIp,
            locationDetails.country,
            locationDetails.isAllowed,
            "",
            "",
            "",
            locationDetails.ipBasedErrorCode,
            locationDetails.gstStateCode
        );
        EventPushService.push(userId, Number(vendorId), "", EventNames.USER_LOCATION_UPDATE, locationDetails);
    }

    static async getRestrictedStates(req: any, eventType: string): Promise<string> {
        try {
            logger.info(eventType, `[PlanetService] [getRestrictedStates] Request :: `);
            const response: string = await PlanetClient.getRestrictedStates(req.internalRestClient, eventType);
            logger.info(response, `[PlanetService] [getRestrictedStates] Response :: `);
            return response;
        } catch (e) {
            logger.info(e, `[PlanetService] [getRestrictedStates] received error`);
            throw e;
        }
    }
}
