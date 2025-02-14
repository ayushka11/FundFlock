import {
    DEFAULT_COUNTRY_NAME,
    DEFAULT_LOCATION_ACCURACY,
    DEFAULT_STATE_CODE,
    DEFAULT_STATE_NAME,
    OUTSIDE_INDIA_STATE_CODE,
    OUTSIDE_INDIA_STATE_NAME,
    UNKNOWN_COUNTRY_NAME,
    UNKNOWN_STATE_CODE,
    UNKNOWN_STATE_NAME
} from "../constants/planet-contants";
import {ILocationDetails} from "../models/planet/response";
import {LocationRequest} from "../models/planet/request";
import PlanetClient from "../clients/planetClient";
import LoggerUtil from "./logger";
const logger = LoggerUtil.get("PlanetUtil");

export default class PlanetUtil {
    static getLocationAccuracy = (accuracy: number) => {
        return accuracy && accuracy < DEFAULT_LOCATION_ACCURACY ? Math.floor(accuracy) : DEFAULT_LOCATION_ACCURACY;
    }

    static getLocationParams(param, ip): LocationRequest {
        let {lat, lng, accuracy, eventType} = param;
        return {
            lat: parseFloat(lat),
            lng: parseFloat(lng),
            ip: ip,
            accuracy: PlanetUtil.getLocationAccuracy(accuracy),
            eventType: eventType
        }
    }

    static setLocationDetails(response, request): ILocationDetails {
        let locationDetails: ILocationDetails;
        // Check if the response is successful or not
        if (response?.status?.success === "true") {
            locationDetails = {...response.data, ...request, isAllowed: true};
        }
        else {
            if (response?.status?.errorCode === PlanetClient.getLocationRestrictedByIpErrorCode()) {
                locationDetails = {
                    ...response.data, ...request,
                    isAllowed: false,
                    ipBasedErrorCode: PlanetClient.getLocationRestrictedByIpErrorCode()
                };
            }
            else {
                locationDetails = {...response.data, ...request, isAllowed: false};
                if (locationDetails?.countryFromGeo === UNKNOWN_COUNTRY_NAME) {
                    locationDetails.isAllowed = true;
                    locationDetails.state = OUTSIDE_INDIA_STATE_NAME;
                    locationDetails.gstStateCode = OUTSIDE_INDIA_STATE_CODE;
                    return locationDetails;
                }
            }
        }
        if (locationDetails.state === UNKNOWN_STATE_NAME) {
            locationDetails.state = DEFAULT_STATE_NAME
        }
        if (locationDetails.country === UNKNOWN_COUNTRY_NAME) {
            locationDetails.country = DEFAULT_COUNTRY_NAME
        }
        if (locationDetails.gstStateCode === UNKNOWN_STATE_CODE) {
            locationDetails.gstStateCode = DEFAULT_STATE_CODE
        }
        return locationDetails
    }
}