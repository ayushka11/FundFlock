import MonitoringUtil from '../utils/monitoring-helper';

const request = require('superagent');
const monitoringHelper = require('./monitoringHelper');
const circuitBreaker = require('./circuitBreakerHelper');
const configService = require('../services/configService');

const Agent = require('agentkeepalive');
import LoggerUtil from '../utils/logger';
import RequestUtil from '../utils/request-util';
import { CASH_APP, PRACTICE_APP } from '../constants/constants';
const logger = LoggerUtil.get('restHelper');

const keepaliveAgent = new Agent({
	// Using all defaults
	//	  maxSockets: 100,
	//	  maxFreeSockets: 10,
	//	  timeout: 60000,
	//	  freeSocketKeepAliveTimeout: 30000, // free socket keepalive for 30 seconds
});

////////// WARNING !!! These methods have been deprecated. Use response helper /////////
exports.getErrorResponse = function (code, data, message) {
	// TODO: use error codes based message with localization, atleast in node-service
	if (code === undefined || code === null) {
		code = '5000000';
	}

	if (!message) {
		data = {
			buttons: [
				{ label: "OK", actionId: 0 },
			]
		};
	}

	return {
		status: {
			success: false,
			errors: [{
				code: code.toString(),	// Front end expects this as string
				message: message ? message : 'Error. Please try again.',
				data: data
			}]
		},
	};
};
////////// WARNING !!! These methods have been deprecated. Use response helper /////////
exports.getSuccessResponse = function (data) {
	return {
		data: data,
		status: {
			success: true
		}
	};
};
/*
exports.addMessages = function(messages) {
	for (code in messages) {
		if (self.messages[code]) {
			throw new Error('Duplicate message code : ' + code);
		}
	}
};*/
///////////////////////////////////////////////////////////////////////////////////

// For all internal API calls
// A new client should be created on every new client request
exports.initInternalRestClient = function(req, requestId, sessionId, deviceId, clientIp, appType, vendorId) {
	if(! ( appType == CASH_APP || appType == PRACTICE_APP ) ){
		logger.info(`[restHelper] - APP_TYPE_MISMATCH :: ${appType}  :: requestId :: ${requestId}`);
		monitoringHelper.trackAppTypeMisMatch(appType);
		appType = CASH_APP;	
	}
	req.internalRestClient = {
		__clientIp : clientIp,
		__deviceId : deviceId,
		__sessionId : sessionId,
		__requestId : requestId,
		__appType: appType || "CASH_APP",
		__brandId: configService.getBrandIdForVendor()[vendorId],
		__location: req.sessionManager && req.sessionManager.getLocation && JSON.stringify(req.sessionManager.getLocation() || '') || "",
		gkLogger: LoggerUtil.get('RestHelper'),
    __gkDeviceInfo: req && JSON.stringify(RequestUtil.getDeviceMetaInfo(req) ||'') || '',
		__headers: {},
		__sessionManager:  req.sessionManager || {},
		__vendorId: vendorId,

		getRequestId : function() {
			return this.__requestId;
		},

		sendGetRequest : function(url, callback, timeout, reqBody ) {
			// This tells whether the given API is behind circuitBreaker or not.
			let circuitBreakerKey = circuitBreaker.isCircuitBreakerEnabled(url);

			// To see whether CB is enabled in zookeeper
			const isCBEnabled = configService.getCircuitBreakerConfig();
			if(circuitBreakerKey && isCBEnabled) {
				circuitBreaker.callWithCircuitBreakerConfigs(
					circuitBreakerKey,
					'GET',
					url,
					reqBody,
					timeout ? timeout : 1500,
					callback,
					{
						__clientIp : this.__clientIp,
						__deviceId : this.__deviceId,
						__sessionId : this.__sessionId,
						__requestId : this.__requestId,
						__appType: this.__appType,
            gkLogger: LoggerUtil.get('RestHelper'),
					});
			} else {
				this.__sendRequest('GET', url, reqBody, timeout ? timeout : 1500, callback);
			}
		},

		sendGetRequestAsync : function(url, timeout, reqBody  ) {
			return new Promise((resolve, reject) => {
				this.sendGetRequest(url, (error, response) => {
					if (error) {
						reject(error);
					} else {
						resolve(response);
					}
				}, timeout, reqBody);
			})
		},
		sendGetRequestWithHeaders: function (url, headers, timeout, reqBody ) {
			this.__headers = headers;
			return new Promise((resolve, reject) => {
				this.sendGetRequest(url, (error, response) => {
					if (error) {
						reject(error);
					} else {
						resolve(response);
					}
				}, timeout, reqBody);
			})
		},
		sendPostRequestWithHeaders: function (url, reqBody = {}, headers, timeout) {
			this.__headers = headers;
			return new Promise((resolve, reject) => {
				this.sendPostRequest(url, reqBody, (error, response) => {
					if (error) {
						reject(error);
					} else {
						resolve(response);
					}
				});
			})
		},
		sendPutRequestWithHeaders: function (url, reqBody = {}, headers, timeout) {
			this.__headers = headers;
			return new Promise((resolve, reject) => {
				this.sendPutRequest(url, reqBody, (error, response) => {
					if (error) {
						reject(error);
					} else {
						resolve(response);
					}
				});
			})
		},
		sendDeleteRequestWithHeaders: function (url, reqBody = {}, headers, timeout) {
			this.__headers = headers;
			return new Promise((resolve, reject) => {
				this.sendDeleteRequest(url, reqBody, (error, response) => {
					if (error) {
						reject(error);
					} else {
						resolve(response);
					}
				});
			})
		},
		sendPostRequestAsync: function (url, reqBody = {}) {
			return new Promise((resolve, reject) => {
				this.sendPostRequest(url, reqBody, (error, response) => {
					if (error) {
						reject(error);
					} else {
						resolve(response);
					}
				});
			})
		},
		sendDeleteRequestAsync: function (url, reqBody = {}) {
			return new Promise((resolve, reject) => {
				this.sendDeleteRequest(url, reqBody, (error, response) => {
					if (error) {
						reject(error);
					} else {
						resolve(response);
					}
				});
			})
		},
		sendPutRequestAsync: function (url, reqBody = {}) {
			return new Promise((resolve, reject) => {
				this.sendPutRequest(url, reqBody, (error, response) => {
					if (error) {
						reject(error);
					} else {
						resolve(response);
					}
				});
			})
		},

		sendPostRequest: function (url, requestBody, callback) {
			this.__sendRequest('POST', url, requestBody, 30000, callback);
		},


		sendPutRequest: function (url, requestBody, callback) {
			this.__sendRequest('PUT', url, requestBody, 30000, callback);
		},

		sendDeleteRequest: function (url, requestBody, callback) {
			this.__sendRequest('DELETE', url, requestBody, 30000, callback);
		},

		__sendRequest: function (method, url, requestBody, timeout, callback) {
			const self = this;
			const t0 = Date.now();
			logger.info({ method: method, url: url, requestBody: requestBody }, 'TODO: Remove request body. Calling internal rest service at url : ' + url);
			const currentLocation = JSON.stringify(this.__sessionManager?.getLocation ? this.__sessionManager?.getLocation() : '');
			let req = request(method, url)
				// .agent(keepaliveAgent) // Commenting this as this is causing memory leak. Tests do not show any performance downsides on removing this.
					.set('Accept', 'application/json')
					.set('gk-request-id', this.__requestId)
					.set('gk-session-id', this.__sessionId)
					.set('gk-device-id', this.__deviceId)
					.set('gk-client-ip', this.__clientIp)
					.set('gk-app-type', this.__appType)
					.set("x-brand-id", this.__brandId)
					.set("gk-location-info",  currentLocation ? currentLocation : this.__location)
					.set('x-request-id', this.__requestId)
					.set('gk-device-info', this.__gkDeviceInfo)
					.set('x-vendor-id', this.__vendorId)
					//.timeout({
					//    response: timeout,  // Wait 'timeout' seconds for the server to start sending response,
					//    deadline: timeout + 20000, // but allow 20 more seconds for response to finish receiving.
					//})
					.timeout(timeout);

			Object.keys(this.__headers).forEach((header) => {
				req.set(header, this.__headers[header]);
			});

			// Now send the request
			if (requestBody?.__FILES__) {

				// Multipart request
				// Note: send method and content type is not required in multipart requests.
				let files = requestBody.__FILES__;
				let fields = requestBody.__FIELDS__;

				logger.info({ fields: fields, files: files }, 'This is a multipart request');

				Object.keys(files).forEach(function (param) {
					req.attach(param, files[param]);
				});

				// Remaining fields
				Object.keys(fields).forEach(function (name) {
					req.field(name, '' + fields[name]);	// Everything should be string
				});

			} else {
				req.set('Content-Type', 'application/json').send(requestBody);
			}
			logger.info({ headers: req.headers }, 'Calling internal rest service with headers');

			req.end(function (err, res) {
				let response = {};

				if (res) {
					response = res.body;
					response.httpStatusCode = res?.statusCode;
				}
				//				if (res.body) {
				//					// Don't log complete res, it has complete request as well,
				//					// which might have the user secret information
				//					response = {
				//						status: res.body.status,
				//						text: res.body
				//					}
				//				}


				////////////////// SUPER IMP : This piece of code is very critical for debugging /////////////////
				/////////////////////////////  Do not modify without thinking thoroughly ////////////////////////

				const requestUrl = `${method}-${(url.replace("http://", "")
					.split("?")[0])
					.replace(/\/[0-9]+/g, "")
					.replace(/\//g, ".")
					.replace(".prod", "")}`;

				if(res?.statusCode) {
					MonitoringUtil.publishClientHttpStatusCode(res.statusCode);
				}

				var error;
				if (err) {
					logger.info({ method: method, url: url, req: req, res: res, err: err },
						'For error cases : Raw response from API');
					if (res) {
						// We got a proper HTTP status in error
						// This might have gateway timeout as well

						// Logging only 5xx errors
						if (res.statusCode >= 500) {
							logger.fatal({ method: method, url: url, statusCode: res.statusCode },
								'Error in calling rest service. Http 5xx.');
						}
						// TODO: What to do with 4xx
						// Adding this for GS Code
						if (res.statusCode >= 400 && res.statusCode < 500) {
							logger.fatal({ method: method, url:url, statusCode: res.statusCode },
									'Error in calling rest service. Http 4xx.');
						}
					} else {
						// Most probably this is request timeout
						// because of no response
						logger.fatal({ method: method, url: url, code: err.code, message: err.message },
							'Error in calling rest service. No response.');
					}

					try {
						// Track the status as well
						monitoringHelper.trackBackendServiceError(url.split('/')[2] + '.' +
							(res ? res.statusCode : err.code));
						// track error for particular requests
						if (requestUrl) {
							monitoringHelper.trackRequestErrorInGrafana(requestUrl + "." + (res ? res.statusCode : err.code));
						}
					} catch (e) {
						// Ignore
						logger.error(e);
					}


					error = {
						status: err.status
					};

					const text = res?.text || '{}';
					let responseText;
					try {
						responseText = JSON.parse(text);
					} catch (error) {
						responseText = {};
					}

					try {
						error.code = response?.error_code || responseText?.status?.code;
						error.message = response?.error || responseText?.status?.message || responseText?.status?.errorMessage;;
						error.statusCode = res?.statusCode || responseText?.status?.code || responseText?.status?.statusCode;
						error.errorCode = response.errorCode || responseText?.status?.code || response.status?.statusCode || response.data?.rejectionCode || res?.statusCode || response?.message || responseText?.status?.statusCode;
					} catch (e) {
						error.code = err.status,
						error.message = err.text
					}
				}
				////////////////////////////////////////////////////////////////////////////////////////////////

				//self.gkLogger.info({method:method, url:url, response: response, error: error},
				//		'Got the API response');

				// Don't log the response
				logger.info({ method: method, url: url, error: error }, 'Got the API response. Not logging the data.');

				const latency = Date.now() - t0;
				logger.info({ requestUrl, latency });
				logger.info({ requestUrl, header: req.header }, "Request Header");
				callback(error, response);
			});
		},
		sendRequestWithHeader: function (method, url, headers, reqBody , timeout, callback) {
			this.__headers = headers;
			logger.info(`[restHelper] [sendRequestWithHeader] headers :: ${JSON.stringify(headers)}`);
			if (method === 'GET') {
				this.sendGetRequest(url, callback, timeout, reqBody);
			} else {
				this.__sendRequest(method, url, reqBody, timeout ? timeout : 30000, callback);
			}
		},
	};


};


