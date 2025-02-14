import PlanetServiceError from './planet-error';
import ServiceErrorUtil from '../service-error-util';
import PlanetErrorCodes from "./planet-error-codes";

class PlanetServiceErrorUtil extends ServiceErrorUtil {
    public static getRuntimeError(): PlanetServiceError {
		return PlanetServiceError.get(PlanetErrorCodes.RUNTIME_ERROR);
	}

	public static getError(error: Error): PlanetServiceError {
		if (!(error instanceof PlanetServiceError)) {
			return this.getRuntimeError();
		}
		return error;
	}

    public static getLocationRestrictedByIp(): PlanetServiceError {
        return PlanetServiceError.LOCATION_RESTRICTED_BY_IP;
    }

    public static getLocationRestrictedByGeoCoordinate(): PlanetServiceError {
        return PlanetServiceError.LOCATION_RESTRICTED_BY_GEO_COORDINATE;
    }

    public static getLocationRestrictedMonitoringMsg1(): PlanetServiceError {
        return PlanetServiceError.LOCATION_RESTRICTED_MONITORING_MSG1;
    }

    public static getLocationRestrictedMonitoringMsg2(): PlanetServiceError {
        return PlanetServiceError.LOCATION_RESTRICTED_MONITORING_MSG2;
    }

    public static getLocationRestrictedMonitoringMsg3(): PlanetServiceError {
        return PlanetServiceError.LOCATION_RESTRICTED_MONITORING_MSG3;
    }

    public static getLocationDetailsNotFound(): PlanetServiceError {
        return PlanetServiceError.LOCATION_DETAILS_NOT_FOUND;
    }

	public static wrapError(error: any): PlanetServiceError {
		return PlanetServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `PlanetServiceError:${error.type}`,
        })
	}
}

export default PlanetServiceErrorUtil;
