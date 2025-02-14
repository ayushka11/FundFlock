const CircuitBreaker = require('opossum');
const request = require('superagent');
const Agent = require('agentkeepalive');
const monitoringHelper = require('./monitoringHelper');
import LoggerUtil from '../utils/logger';

let requestsMade = 0, requestReallyMade = 0, responseReceived = 0, fallbackResponse = 0;
const keepaliveAgent = new Agent({
    // Using all defaults
//	  maxSockets: 100,
//	  maxFreeSockets: 10,
//	  timeout: 60000,
//	  freeSocketKeepAliveTimeout: 30000, // free socket keepalive for 30 seconds
});
let circuitBreakers = {};
const myLogger = LoggerUtil.get('circuitBreakerHelper');

// This function is just a copy of sendRequest function in restHelper. Improve this.
const sendRequest = function(circuitBreakerKey, method, url, requestBody, timeout, callback, reqParams) {
    // myLogger.info("debugNode came in the sendRequest");
    return new Promise((resolve, reject) => {
        requestReallyMade++;
        // myLogger.info("debugNode inside promise for url: "+url);
        monitoringHelper.trackReqMadeInCB(circuitBreakerKey);
        const t0 = Date.now();
        myLogger.info({method: method, url: url, requestBody: requestBody}, 'TODO: Remove request body. Calling internal rest service at url : ' + url);

        var req = request(method, url)
            .agent(keepaliveAgent)
            .set('Accept', 'application/json')
            .set('gk-request-id', reqParams.__requestId)
            .set('gk-session-id', reqParams.__sessionId)
            .set('gk-device-id', reqParams.__deviceId)
            .set('gk-client-ip', reqParams.__clientIp)
            .set('gk-interaction-id', reqParams.__interactionId)
            .set('gk-app-type', reqParams.__appType)
            .timeout(timeout);

        // Now send the request
        if (requestBody.__FILES__) {
            // Multipart request
            // Note: send method and content type is not required in multipart requests.
            var files = requestBody.__FILES__;
            var fields = requestBody.__FIELDS__;

            myLogger.info({fields: fields, files: files}, 'This is a multipart request');

            Object.keys(files).forEach(function(param) {
                req.attach(param, files[param]);
            });

            // Remaining fields
            Object.keys(fields).forEach(function (name) {
                req.field(name, '' + fields[name]);	// Everything should be string
            });

        } else {
            req.set('Content-Type', 'application/json').send(requestBody);
        }

        req.end(function(err, res) {
            responseReceived++;
            myLogger.info("debugNode inside callback of sendRequest error: "+JSON.stringify(err));
            // myLogger.info("debugNode inside callback of sendRequest response: "+Object.keys(res.body));
            let response = {};

            if (res) {
                response = res.body;
            }
            const requestUrl = `${method}-${(url.replace("http://", "")
                .split("?")[0])
                .replace(/\/[0-9]+/g, "")
                .replace(/\//g,".")
                .replace(".prod", "")}`;

            const latency = Date.now() - t0;
            myLogger.info({ requestUrl, latency });
            monitoringHelper.trackRequestCountInGrafana(requestUrl);
            monitoringHelper.trackRequestLatencyInGrafana(requestUrl, latency);

            ////////////////// SUPER IMP : This piece of code is very critical for debugging /////////////////
            /////////////////////////////  Do not modify without thinking thoroughly ////////////////////////
            var error;
            if (err) {
                myLogger.info({method:method, url:url, req: req, res: res, err: err},
                    'For error cases : Raw response from API');

                if (res) {
                    // We got a proper HTTP status in error
                    // This might have gateway timeout as well

                    // Logging only 5xx errors
                    if (res.statusCode >= 500) {
                        myLogger.fatal({ method: method, url:url, statusCode: res.statusCode },
                            'Error in calling rest service. Http 5xx.');
                    }
                    // TODO: What to do with 4xx
                } else {
                    // Most probably this is request timeout
                    // because of no response
                    myLogger.fatal({ method: method, url:url, code: err.code, message: err.message},
                        'Error in calling rest service. No response.');
                }

                try {
                    // Track the status as well
                    monitoringHelper.trackBackendServiceError(url.split('/')[2] + '.' +
                        (res ? res.statusCode : err.code));
                } catch (e) {
                    // Ignore
                    myLogger.error(e);
                }


                error = {
                    status: err.status
                };

                try {
                    error.code = response.error_code;
                    error.message = response.error;
                    error.statusCode = res.statusCode;
                } catch (e) {
                    error.code = err.status;
                        error.message = err.text
                }
                myLogger.info("debugNode rejecting promise");
                return reject({
                    error: error,
                    response: undefined,
                });
            }
            // myLogger.info("debugNode error object is: "+JSON.stringify(error))
            ////////////////////////////////////////////////////////////////////////////////////////////////
            myLogger.info({method:method, url:url, error: error}, 'Got the API response. Not logging the data.');
            // monitoringHelper.trackSuccessfulReqFromCB();
            myLogger.info("debugNode resolving promise ");
            return resolve({
                error: error,
                response: response,
            });
        });
    });
};

const getCircuitBreakerConfig = function () {
    return {
        timeout: 15000,
        errorThresholdPercentage: 50,
        resetTimeout: 15000,
    }
};

const initCircuitBreaker = function(circuitBreakerKey) {
    let circuitBreakerConfig = getCircuitBreakerConfig();
    let circuitBreaker = new CircuitBreaker(sendRequest, circuitBreakerConfig);

    circuitBreaker.fallback(() => {
        fallbackResponse++;
        monitoringHelper.trackFallBackInCB(circuitBreakerKey);
        myLogger.info("debugNode logging the fallback ");
        return {
            error: {
                status: 500,
                code: 500,
                message: "Service currently not available",
            },
            response: undefined,
        }
    });

    circuitBreaker.on('fallback', () => {
        myLogger.info("debugNode fallback is being performed!!")
    });

    circuitBreaker.on("open", () => {
        monitoringHelper.trackCBOpened(circuitBreakerKey);
        myLogger.info("debugNode circuit state changed to open "+new Date().getTime());
    });

    circuitBreaker.on("close", () => {
        monitoringHelper.trackCBClosed(circuitBreakerKey);
        myLogger.info("debugNode circuit state changed to closed");
    });

    circuitBreaker.on("halfOpen", () => {
        monitoringHelper.trackCBHalfOpened(circuitBreakerKey);
        myLogger.info("debugNode circuit state changed to halfOpen "+new Date().getTime());
    });

    return circuitBreaker;
};

const getCircuitBreaker = function (circuitBreakerKey) {
    if(circuitBreakers[circuitBreakerKey]) {
        myLogger.info("debugNode returning the previous existing circuit breaker");
        return circuitBreakers[circuitBreakerKey];
    }
    myLogger.info("debugNode making new circuit breaker");
    let circuitBreaker = initCircuitBreaker(circuitBreakerKey);
    circuitBreakers[circuitBreakerKey] = circuitBreaker;
    return circuitBreakers[circuitBreakerKey];
};

const callWithCircuitBreakerConfigs = function(circuitBreakerKey, method, url, requestBody, timeout, callback, reqParams) {
    let circuitBreaker = getCircuitBreaker(circuitBreakerKey);
    requestsMade++;
    monitoringHelper.trackTotalReqThroughCB(url);
    myLogger.info("debugNode open: "+circuitBreaker.opened+" halfOpen: "+circuitBreaker.halfOpen);
    // myLogger.info("debugNode going to make a request for : " + url);
    circuitBreaker.fire(circuitBreakerKey, method, url, requestBody, timeout, callback, reqParams).then((response) => {
        myLogger.info("debugNode Response after successful calling: " + JSON.stringify(response.error));
        callback(response.error, response.response);
    }).catch((e) => {
        myLogger.info("debugNode Error after calling with circuit breaker: " + e);
    })
};

// This function returns if circuit breaker is enabled for this given request. Right now this is just for testing
// stabillity of circuit breaker on Production later on I plan to drive this through Zoo keeper.
const isCircuitBreakerEnabled = function(url) {
    const apiName = "happyHour";
    if(!!url.includes("/v1/promotion/happyHour?userId")) {
        return apiName;
    }

};

module.exports = {
    isCircuitBreakerEnabled: isCircuitBreakerEnabled,
    callWithCircuitBreakerConfigs: callWithCircuitBreakerConfigs,
    initCircuitBreaker: initCircuitBreaker,
};
