const ioredis = require('ioredis');
import {GUARDIAN_DOCUMENT_TYPE} from "../constants/guardian-constants";
import LoggerUtil from "../utils/logger";

const logger = LoggerUtil.get('redisService');

const configService = require('../services/configService');
let redisDataCluster;

const options = {
	reconnectOnError: function(err){ return true; },
	showFriendlyErrorStack: true
};

// Remove __ from all keys, unless they are exported.
const __redisKeyPrefix = 'apollo:';
const __redisSessionKeyPrefix = __redisKeyPrefix + 'session:';
const __redisUserSessionKeyPrefix = __redisKeyPrefix + 'user:';
const __redisGamesFeedKey = __redisKeyPrefix + 'games-feed';
const __redisAuthTokenKeyPrefix = __redisKeyPrefix + 'auth-token:';

const redisOnlineUsersKey = __redisKeyPrefix + 'online-users';
const redisPracticeAppOnlineUsersKey = __redisKeyPrefix + 'practice-app-online-users';
const redisMatchedTradesKey = __redisKeyPrefix + 'matched-trades';

const redisHourlyAppDownloadCountKeyPrefix = __redisKeyPrefix + 'hourly-app-downloads:';
const _redisAppSplitCountPrefix = __redisKeyPrefix + 'app-split-pop-count:';

const __redisUserKeyPrefix = __redisKeyPrefix + 'user:';
const __redisUserDetailsKeyPrefix = __redisKeyPrefix + 'user-details:';

const __redisFreeBlacklistTrnCount = __redisKeyPrefix + 'free-blacklist-trn-count:';
const __redisQuestCreationPrefix = __redisSessionKeyPrefix + "quest-creation";
const __redisUserDataPrefix = __redisKeyPrefix + 'user-data:';
const __redisSendSmsPrefix= __redisKeyPrefix + 'send-download-sms:';

const __redisIsRequestToIdmPrefix = __redisKeyPrefix + 'is-request-to-idm:';
const __redisIsRequestToTenetPaymentPrefix = __redisKeyPrefix + 'is-request-to-tenet-payment:';

const __redisKeyForGuardianPanUploadPrefix = __redisKeyPrefix + 'task-pan-upload:';
const __redisKeyForGuardianBankUploadPrefix = __redisKeyPrefix + 'task-bank-upload:';
const __redisKeyForGuardianAadharUploadPrefix = __redisKeyPrefix + 'task-aadhar-upload:';
const __redisKeyForGuardianVoterUploadPrefix = __redisKeyPrefix + 'task-voter-upload:';
const __redisKeyForGuardianDlUploadPrefix = __redisKeyPrefix + 'task-dl-upload:';

const __redisKeyForUserSessions= ':session';
const getSessionKey = function(sessionId) {
	return __redisSessionKeyPrefix + sessionId;
};

const getUserSessionKey = function(userId) {
	return __redisUserSessionKeyPrefix + userId + __redisKeyForUserSessions;
};
const getAuthTokenKey = function(authToken) {
	return __redisAuthTokenKeyPrefix + authToken;
};
const getGamesFeedKey = function() {
	return __redisGamesFeedKey;
};
const getUserDetailsKey = function(userId) {
	return __redisUserDetailsKeyPrefix + userId;
};
const getUserKey = function(userId) {
	return __redisUserKeyPrefix + userId;
};

const getAppSplitCountKey = function(userId) {
	return _redisAppSplitCountPrefix + userId;
};

const getFreeBlacklistTournamentCountKey = function(userId) {
	return __redisFreeBlacklistTrnCount + userId;
};

const getUserDataKey = function(userId) {
	return __redisUserDataPrefix + userId;
};

const getQuestCreationKey = function() {
	return __redisQuestCreationPrefix;
};

const getSendSmsKey = function(userId){
	return __redisSendSmsPrefix + userId;
};

const getIsRequestToIdmKey = function(userIdentifier, action) {
	return `${__redisIsRequestToIdmPrefix}${action}:${userIdentifier}`;
};

const getIsRequestToTenetPaymentKey = function(orderId, action) {
	return `${__redisIsRequestToTenetPaymentPrefix}${action}:${orderId}`;
};

const getRedisKeyForGuardianPanUpload = function(userId,vendorId) {
	return `${__redisKeyForGuardianPanUploadPrefix}${vendorId}_${userId}`;
};

const getRedisKeyForGuardianBankUpload = function(userId,vendorId) {
	return `${__redisKeyForGuardianBankUploadPrefix}${vendorId}_${userId}`;
};

const getRedisKeyForGuardianAadharUpload = function (userId,vendorId) {
	return `${__redisKeyForGuardianAadharUploadPrefix}${vendorId}_${userId}`;
};

const getRedisKeyForGuardianVoterUpload = function (userId,vendorId) {
	return `${__redisKeyForGuardianVoterUploadPrefix}${vendorId}_${userId}`;
};

const getRedisKeyForGuardianDlUpload = function (userId,vendorId) {
	return `${__redisKeyForGuardianDlUploadPrefix}${vendorId}_${userId}`;
};

const getRedisKeyForGuardianDocumentUpload = function(userId,vendorId,docType) {
	switch(docType) {
		case GUARDIAN_DOCUMENT_TYPE.AADHAR: return getRedisKeyForGuardianAadharUpload(userId,vendorId);
		case GUARDIAN_DOCUMENT_TYPE.BANK: return getRedisKeyForGuardianBankUpload(userId,vendorId);
		case GUARDIAN_DOCUMENT_TYPE.DL: return getRedisKeyForGuardianDlUpload(userId,vendorId);
		case GUARDIAN_DOCUMENT_TYPE.PAN: return getRedisKeyForGuardianPanUpload(userId,vendorId);
		case GUARDIAN_DOCUMENT_TYPE.VOTER: return getRedisKeyForGuardianVoterUpload(userId,vendorId);
		default: return '';
	}
}

const trackAppDownload = function(callback) {
	let currentDate = new Date();
	let currentHour = currentDate.getHours() % 12;
	let key = redisHourlyAppDownloadCountKeyPrefix + currentHour;

	getPipeline()
	.incr(key)

	// Keeping it < 12 hrs for boundary cases. E.g. current = 00:59:59 then expire at 11:59:55
	// The key must expire before it comes next time. Otherwise the count will keep on increasing.
	.expire(key, 43200 - 60 * currentDate.getMinutes() - currentDate.getSeconds() - 5)

	.exec(function (error, data) {
		logger.info({error: error, data: data}, 'trackAppDownload: Got response from redis js');
		callback(error);
	});
};

// It will give total app downloads in last 12 hours
const getAppDownloadsCount = function(callback) {
	// let count: number = 1443727;
	// count += parseInt((new Date() - new Date(2020,7,1) ) / 60 / 1000 * 9)
	callback(null, {
		count: 1443727
	});
};

const incSendSmsCounter = function(userId) {
	let key = getSendSmsKey(userId);
	getPipeline()
	.incr(key)
	.exec(function (error, data) {
		logger.info({error: error, data: data}, 'key incremented');
	});
};
const getSendSmsCounter = function(userId, callback) {
	let key = getSendSmsKey(userId);
	getPipeline()
		.get(key)
		.exec(function (error, data) {
			const count = error ? 0 : data[0][1];
			callback(count);
		});
};

const setSendSmsCounter = function(userId) {
	let key = getSendSmsKey(userId);
	getPipeline()
	.set(key,1)
	.expire(key,60*2)
	.exec(function (error, data) {
		logger.info({error: error, data: data}, 'key is set');
	});
}

const trackAutoSplitPopupCount = function(userId) {
	let key = getAppSplitCountKey(userId);
	getPipeline()
		.incr(key)
		.exec(function (error, data) {
			logger.info({error: error, data: data},"key has been incremented");
		});
};

const getAutoSplitPopupCount = function(userId, callback) {
	let key = getAppSplitCountKey(userId);
	getPipeline()
		.get(key)
		.exec(function (error, data) {
			const countString = error ? 0 : data[0][1];
			const popupCount = countString ? parseInt(countString) : 0;	// Bucket might be missing as well. So it will be null.
			callback(popupCount);
		});
};

const init = function(callback) {
	const config = configService.getRedisConfig();

	logger.info({config}, 'Connecting to Redis, both new and old');

	redisDataCluster = new ioredis.Cluster(config.nodes, options);
	redisDataCluster.on('error', errorCallback);
	redisDataCluster.on('ready', callback);
};

function errorCallback(error) {
	logger.fatal({error}, 'Redis DataCluster Error');
}

const getPipeline = function() {
	return redisDataCluster.pipeline();
};

const getConnection = function() {
	return redisDataCluster;
}

const getUserDetailsFromRedis = function(userId, callback) {
	const redisKey = getUserDetailsKey(userId);
	getPipeline()
    .hgetall(redisKey)
    .exec(function (error, data) {
      logger.info({error, data}, 'getUserDetailsFromRedis: Got response from redis');
      callback(error, error ? null : data[0][1]);
    }
  );
}

const getUserSessionId = async function(userId) {
	const redisKey = getUserSessionKey(userId);
	try {
		const sessionId = await getConnection().get(redisKey);

		logger.info(sessionId, "response recvd from getUserSessionid");
		return sessionId;
	} catch (e) {
		throw e;
	}
}

const getUserAttribute = async function(userId,key) {
	let value;
	const redisKey = getUserDetailsKey(userId);
	getPipeline()
    .hget(redisKey,key)
    .exec(function (error, data) {
      logger.info({error, data}, 'getUserDetailsFromRedis: Got response from redis');
	  value =  error ? null : data[0][1];
    }
  );
  return value;
}

const setUserDetailsInRedis = function(userId, email, mobile) {
	const redisKey = getUserDetailsKey(userId);
	const userDetails = {mobile, email};
	getPipeline()
    .hmset(redisKey, userId, JSON.stringify(userDetails))
    .expire(redisKey, configService.getSessionConfig().userDetailsTtl)
	  .exec((err, response) => {
		  logger.info({ err, response }, "Got response from redis for user details setting");
		// callback(null, channelInfo);
	});
}

// use this in idm to set the customer id when obtained from payinService.
const setUserPayinCustomerIdInRedis = function(userId: string,payinCustomerId: string) {
	const redisKey = getUserDetailsKey(userId);
	const userDetails = {payinCustomerId};
	getPipeline()
    .hmset(redisKey, userId, JSON.stringify(userDetails))
    .expire(redisKey, configService.getSessionConfig().userDetailsTtl)
	  .exec((err, response) => {
		  logger.info({ err, response }, "Got response from redis for user details setting");
		// callback(null, channelInfo);
	});
}

const setUserRegistrationSessionInRedis = function(userId) {
	const redisKey = getUserDetailsKey(userId) + "-registered";
	const userDetails = {
		registered: true
	};
	getPipeline()
    .hmset(redisKey, userId, JSON.stringify(userDetails))
	  .exec((err, response) => {
		  logger.info({ err, response}, "Got response from redis for user registration setting");
		// callback(null, channelInfo);
	});
};

const getUserRegistrationSessionFromRedis = function(userId, callback) {
	const redisKey = getUserDetailsKey(userId) + "-registered";

    getPipeline()
    .hgetall(redisKey)
    .exec(function (error, data) {
      logger.info({error, data}, 'getRegistered User value: Got response from redis');
      callback(error, error ? null : data[0][1]);
    });
};

const setFreeBlacklistedTournamentCountInRedis = function(userId, count) {
	return new Promise((resolve, reject) => {
		const redisKey = getFreeBlacklistTournamentCountKey(userId);
		const { freeBlacklistedTrnCountRedisExpiry } = configService.getTournamentsConfig();
		// expiry is given in seconds. We are setting expiry of 4 hours
		getPipeline()
		.set(redisKey, count)
		.expire(redisKey, freeBlacklistedTrnCountRedisExpiry || 14400)
		.exec(function (error, data) {
			logger.info({ error, data }, 'Inside setFreeBlacklistedTournamentCount, redisService.js');
			if (error) {
				reject(error);
			} else {
				resolve(data);
			}
		});
	});
};

const getFreeBlacklistedTournamentCountFromRedis = function(userId) {
	return new Promise((resolve, reject) => {
		const redisKey = getFreeBlacklistTournamentCountKey(userId);
		getPipeline()
		.get(redisKey)
		.exec(function (error, data) {
			logger.info({ error, data }, 'Inside getFreeBlacklistTournamentCountKey, redisService.js');
			if (error) {
				reject(error);
			} else {
				resolve(data[0][1]);
			}
		});
	});
};

const setUserData = function(userId, data) {
	return new Promise((resolve, reject) => {
		const redisKey = getUserDataKey(userId);
		getPipeline()
		.set(redisKey, data)
		.expire(redisKey, 86400)
		.exec(function (error, data) {
			logger.info({ error, data }, 'Inside setUserDataInRedisKey, redisService.js');
			if (error) {
				reject(error);
			} else {
				resolve(data[0][1]);
			}
		});
	});
}

const getUserData = function(userId) {
	return new Promise((resolve, reject) => {
		const redisKey = getUserDataKey(userId);
		getPipeline()
		.get(redisKey)
		.exec(function (error, data) {
			logger.info({ error, data }, 'Inside getUserDataInRedisKey, redisService.js');
			if (error) {
				reject(error);
			} else {
				resolve(data[0][1]);
			}
		});
	});
}

const deleteUserRegistrationSessionFromRedis = function(userId, callback) {
	const redisKey = getUserDetailsKey(userId) + "-registered";

    getPipeline()
      .hdel(redisKey, userId)
      .exec(function (error, data) {
        callback(null, data[0][1]);
      });
};

const setQuestCreationSessionInRedis = function(callback) {
	const redisKey = getQuestCreationKey();
    getPipeline()
    .set(redisKey, 1)
	.expire(redisKey, 30)
    .exec(function (error, data) {
      logger.info({error, data}, 'Inside setQuestCreationSessionInRedis, redisService.js');
      callback(error, error ? null : data);
    });
};

const getQuestCreationSessionFromRedis = function(callback) {
	const redisKey = getQuestCreationKey();
    getPipeline()
    .get(redisKey)
    .exec(function (error, data) {
      logger.info({error, data}, 'Inside getQuestCreationSessionFromRedis, redisService.js');
      callback(error, error ? null : data[0][1]);
    });
};

const getOnlineUsersFromRedis = function () {
	return new Promise((resolve, reject) => {
		getPipeline()
			.hgetall(redisOnlineUsersKey)
			.exec(function (error, data) {
				// logger.info({ error, data }, 'Inside getOnlineUsersFromRedis, redisService.js');
				if (error) {
					reject(error);
				} else {
					resolve(data[0][1]);
				}
			});
	});
}

const setOnlineUsersInRedis = function (userId) {
	return new Promise((resolve, reject) => {
		const updatedAt = Date.now();
		getPipeline()
			.hmset(redisOnlineUsersKey,  userId, updatedAt)
			.exec(function (error, data) {
				// logger.info({ error, data }, 'Inside setOnlineUsersInRedis, redisService.js');
				if (error) {
					reject(error);
				} else {
					resolve(Number(data[0][1]));
				}
			});
	});
}

const removeOnlineUserFromRedis = function (userId) {
	return new Promise((resolve, reject) => {
		getPipeline()
			.hdel(redisOnlineUsersKey, userId)
			.exec(function (error, data) {
				// logger.info({ error, data }, 'Inside removeOnlineUserFromRedis, redisService.js');
				if (error) {
					reject(error);
				} else {
					resolve(data[0][1]);
				}
			});
	});
}

const getPracticeAppOnlineUsersFromRedis = function () {
	return new Promise((resolve, reject) => {
		getPipeline()
			.hgetall(redisPracticeAppOnlineUsersKey)
			.exec(function (error, data) {
				if (error) {
					reject(error);
				} else {
					resolve(data[0][1]);
				}
			});
	});
}

const setPracticeAppOnlineUsersInRedis = function (userId) {
	return new Promise((resolve, reject) => {
		const updatedAt = Date.now();
		getPipeline()
			.hmset(redisPracticeAppOnlineUsersKey,  userId, updatedAt)
			.exec(function (error, data) {
				if (error) {
					reject(error);
				} else {
					resolve(Number(data[0][1]));
				}
			});
	});
}

const removePracticeAppOnlineUserFromRedis = function (userId) {
	return new Promise((resolve, reject) => {
		getPipeline()
			.hdel(redisPracticeAppOnlineUsersKey, userId)
			.exec(function (error, data) {
				if (error) {
					reject(error);
				} else {
					resolve(data[0][1]);
				}
			});
	});
}

const getMatchedTradesFromRedis = function () {
	return new Promise((resolve, reject) => {
		getPipeline()
			.get(redisMatchedTradesKey)
			.exec(function (error, data) {
				// logger.info({ error, data }, 'Inside getMatchedTradesFromRedis, redisService.js');
				if (error) {
					reject(error);
				} else {
					resolve(Number(data[0][1]));
				}
			});
	});
}

const setMatchedTradesInRedis = function (data) {
	return new Promise((resolve, reject) => {
		getPipeline()
			.set(redisMatchedTradesKey, data)
			.exec(function (error, data) {
				// logger.info({ error, data }, 'Inside setMatchedTradesInRedis, redisService.js');
				if (error) {
					reject(error);
				} else {
					resolve(Number(data[0][1]));
				}
			});
	});
}


//Retrieve if user has recently generated request via idm or province service as province and idm will generate different OTP
const getIsRequestToIdm = function(userIdentifier, action) {
	return new Promise((resolve, reject) => {
		const redisKey = getIsRequestToIdmKey(userIdentifier, action);
		getPipeline()
			.get(redisKey)
			.exec(function (error, data) {
				logger.info({ error, data }, 'Inside getIsRequestToIdm, redisService.js');
				if (error) {
					reject(error);
				} else {
					resolve(JSON.parse(data[0][1]));
				}
			});
	});
}



async function getGuardianTaskId(userId,vendorId,docType) {
	logger.info({userId,vendorId,docType},'getGuardianTaskId');
	const key = getRedisKeyForGuardianDocumentUpload(userId,vendorId,docType);

	let userTaskId: string = "";
	await getPipeline()
		.get(key)
		.exec(function (error, data) {
			const taskId = error ? null : data[0][1];
			userTaskId = taskId;
		});
	logger.info(userTaskId,'got task id');
	return userTaskId;
}

const getIsRequestToTenetPayment = function(orderId, action) {
	return new Promise((resolve, reject) => {
		const redisKey = getIsRequestToTenetPaymentKey(orderId, action);
		getPipeline()
			.get(redisKey)
			.exec(function (error, data) {
				logger.info({ error, data }, 'Inside getIsRequestToTenetPayment, redisService.js');
				if (error) {
					reject(error);
				} else {
					resolve(JSON.parse(data[0][1]));
				}
			});
	});
}

const addOnlineUser = function(userId, callback) {
		const updatedAt = Date.now();
		return new Promise((resolve, reject) => {
			getPipeline()
				.get(redisOnlineUsersKey)
				.exec(function (error, data) {
					logger.info({
						error,
						data
					}, 'Inside getIsRequestToTenetPayment, redisService.js');
					if (error) {
						reject(error);
					} else {
						resolve(JSON.parse(data[0][1]));
					}
				});
		});
}


module.exports = {
	getSessionKey,
	getAuthTokenKey,
	getGamesFeedKey,
	init,
	getPipeline,
	trackAppDownload,
	getAppDownloadsCount,
	trackAutoSplitPopupCount,
	getAutoSplitPopupCount,
	getUserKey,
	redisDataCluster,
	getUserDetailsKey,
	getUserDetailsFromRedis,
	getConnection,
	getUserAttribute,
	setUserDetailsInRedis,
	setUserRegistrationSessionInRedis,
	deleteUserRegistrationSessionFromRedis,
	getUserRegistrationSessionFromRedis,
	setFreeBlacklistedTournamentCountInRedis,
	getFreeBlacklistedTournamentCountFromRedis,
	setQuestCreationSessionInRedis,
	getQuestCreationSessionFromRedis,
	setUserData,
	getUserData,
	incSendSmsCounter,
	getSendSmsCounter,
	setSendSmsCounter,
	getOnlineUsersFromRedis,
	setOnlineUsersInRedis,
	removeOnlineUserFromRedis,
	getMatchedTradesFromRedis,
	setMatchedTradesInRedis,
	getIsRequestToIdm,
	getGuardianTaskId,
	getIsRequestToTenetPayment,
	getUserSessionKey,
	getPracticeAppOnlineUsersFromRedis,
	setPracticeAppOnlineUsersInRedis,
	removePracticeAppOnlineUserFromRedis
};
