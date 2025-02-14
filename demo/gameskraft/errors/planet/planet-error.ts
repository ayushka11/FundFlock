import PlanetErrorCodes from "./planet-error-codes";
import ServiceError from '../service-error';

class PlanetServiceError extends ServiceError {
    
    static readonly LOCATION_RESTRICTED_BY_IP = PlanetServiceError.get(
        PlanetErrorCodes.LOCATION_RESTRICTED_BY_IP,
    );
    
    static readonly LOCATION_RESTRICTED_BY_GEO_COORDINATE = PlanetServiceError.get(
        PlanetErrorCodes.LOCATION_RESTRICTED_BY_GEO_COORDINATE,
    );
    
    static readonly LOCATION_RESTRICTED_MONITORING_MSG1 = PlanetServiceError.get(
        PlanetErrorCodes.LOCATION_RESTRICTED_MONITORING_MSG1,
    );
    
    static readonly LOCATION_RESTRICTED_MONITORING_MSG2 = PlanetServiceError.get(
        PlanetErrorCodes.LOCATION_RESTRICTED_MONITORING_MSG2,
    );
    
    static readonly LOCATION_RESTRICTED_MONITORING_MSG3 = PlanetServiceError.get(
        PlanetErrorCodes.LOCATION_RESTRICTED_MONITORING_MSG3,
    );

    static readonly LOCATION_DETAILS_NOT_FOUND = PlanetServiceError.get(
        PlanetErrorCodes.LOCATION_DETAILS_NOT_FOUND,
    );

    constructor(public name: string, public code: number, public message: any, public type: any) {
		super(name, code, message, type);
	}

	public static get(errorDetails: PlanetErrorCodes): PlanetServiceError {
		return new PlanetServiceError(
			errorDetails.name,
			errorDetails.code,
			errorDetails.message,
            errorDetails.type || 'PlanetServiceError',
		);
	}
}

export default PlanetServiceError;
