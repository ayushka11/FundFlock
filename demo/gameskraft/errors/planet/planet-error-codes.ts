class PlanetErrorCodes {

    private static BaseErrorCode = 13000;
    static RuntimeError = PlanetErrorCodes.BaseErrorCode + 1;
    static LocationRestrictedByIp = PlanetErrorCodes.BaseErrorCode + 2;
    static LocationRestrictedByGeoCoordinate = PlanetErrorCodes.BaseErrorCode + 3;
    static LocationRestrictedMonitoringMsg1 = PlanetErrorCodes.BaseErrorCode + 4;
    static LocationRestrictedMonitoringMsg2 = PlanetErrorCodes.BaseErrorCode + 5;
    static LocationRestrictedMonitoringMsg3 = PlanetErrorCodes.BaseErrorCode + 6;
    static LocationDetailsNotFound = PlanetErrorCodes.BaseErrorCode + 7;

    static readonly RUNTIME_ERROR = new PlanetErrorCodes(
        PlanetErrorCodes.RuntimeError,
		'Something went wrong',
		'APPLICATION_RUNTIME_ERROR',
	);
    
    static readonly LOCATION_RESTRICTED_BY_IP = new PlanetErrorCodes(
        PlanetErrorCodes.LocationRestrictedByIp,
        'Location is restricted by IP',
        'LOCATION_RESTRICTED_BY_IP',
    );
    
    static readonly LOCATION_RESTRICTED_BY_GEO_COORDINATE = new PlanetErrorCodes(
        PlanetErrorCodes.LocationRestrictedByGeoCoordinate,
        'Location is restricted by geo coordinates',
        'LOCATION_RESTRICTED_BY_GEO_COORDINATE',
    );
    
    static readonly LOCATION_RESTRICTED_MONITORING_MSG1 = new PlanetErrorCodes(
        PlanetErrorCodes.LocationRestrictedMonitoringMsg1,
        'Location is restricted',
        'LOCATION_RESTRICTED_MONITORING_MSG1',
    );
    
    static readonly LOCATION_RESTRICTED_MONITORING_MSG2 = new PlanetErrorCodes(
        PlanetErrorCodes.LocationRestrictedMonitoringMsg2,
        'Location is restricted',
        'LOCATION_RESTRICTED_MONITORING_MSG2',
    );
    
    static readonly LOCATION_RESTRICTED_MONITORING_MSG3 = new PlanetErrorCodes(
        PlanetErrorCodes.LocationRestrictedMonitoringMsg3,
        'Location is restricted',
        'LOCATION_RESTRICTED_MONITORING_MSG3',
    );

    static readonly LOCATION_DETAILS_NOT_FOUND = new PlanetErrorCodes(
        PlanetErrorCodes.LocationDetailsNotFound,
        'Could not fetch your Location details',
        'LOCATION_DETAILS_NOT_FOUND',
    );

	// private to disallow creating other instances of this type
	private constructor(
		public code: number,
		public message: string,
		public name: string,
		public type?: string,
	) {}
	toString(): string {
		return `${this.name}:${this.code}:${this.message}`;
	}
}

export default PlanetErrorCodes;
