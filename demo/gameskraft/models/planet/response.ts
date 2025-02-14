export interface LocationDetails {
    state?: string,
    country?: string,
    stateFromGeo?: string,
    countryFromGeo?: string,
    stateFromIp?: string,
    countryFromIp?: string,
    accuracyRadius?: number,
    gstStateCode?: number,
}

export interface LocationDetailsResponse {
    status?: LocationDetailsResponseStatus,
    data?: LocationDetails
}

export interface ILocationDetailsResponse {
    state?: string,
    isAllowed?: boolean
}

export interface LocationDetailsResponseStatus {
    success?: string,
    errorCode?: number,
    errorMessage?: string,
}

export interface ILocationDetails {
    lat?: number,
    lng?: number,
    ip?: string,
    accuracy?: number,
    eventType?: string
    state?: string,
    country?: string,
    stateFromGeo?: string,
    countryFromGeo?: string,
    stateFromIp?: string,
    countryFromIp?: string,
    accuracyRadius?: number,
    isAllowed?: boolean,
    ipBasedErrorCode?: number,
    gstStateCode?: number,
}

export interface LocationEventData {
    lat?: number,
    lng?: number,
    ip?: string,
    state?: string,
    country?: string,
    isAllowed?: boolean,
    accuracyRadius?: number,
    stateFromIp?: string,
    countryFromIp?: string,
}

export interface LocationDenyError {
    name?: string,
    code?: number,
    message?: string
}