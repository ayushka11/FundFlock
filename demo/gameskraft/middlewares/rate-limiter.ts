import monitoringHelper from '../helpers/monitoringHelper';
import LoggerUtil, {ILogger} from '../utils/logger';
import {default as Redis} from "ioredis";

const restHelper = require('../helpers/restHelper');
const configService = require('../services/configService');

import rateLimit = require("express-rate-limit");
import RedisStore = require('rate-limit-redis');

const logger: ILogger = LoggerUtil.get('RateLimiter');

export default class RateLimiter {

  static redisClient: any;

  static init(): void {
    RateLimiter.redisClient = new Redis({ host: configService.getRedisConfig().rateLimitingNode.host, port: configService.getRedisConfig().rateLimitingNode.port });
  }

  static appDownloadLinkPhoneLimiter(): any {
    return rateLimit({
      windowMs: configService.getApiAuthTokens().appDownloadLinkPhoneApiRateLimitTime * 1000 || 2 * 60 * 60 * 1000,
      max: configService.getApiAuthTokens().appDownloadLinkPhoneApiRequestsRate || 5,
      store: new RedisStore({
        client: RateLimiter.redisClient,
        expiry: configService.getApiAuthTokens().appDownloadLinkPhoneApiRateLimitTime || 2 * 60 * 60,
      }),
      keyGenerator(req, res) {
        const prefix = 'appDownloadMobile:';
        const mainKey = (req.body && req.body.mobile) ? req.body.mobile : null;
        return prefix + mainKey;
      },
      message: 'Too many app download requests from this mobile, please try again after 2 hours',
      handler(req, res, next) {
        const mobile = (req.body && req.body.mobile) ? req.body.mobile : null;
        if (!mobile) {
          res.status(200).send(restHelper.getSuccessResponse({}));
        } else {
          monitoringHelper.trackFraudUserForAppDownloadsMobile(mobile);
          logger.info({ mobile }, 'Too many app download requests from this mobile');
          res.status(200).send(restHelper.getSuccessResponse({}));
        }
      },
    })
  }

  static userLoginLimiter(): any {
    return rateLimit({
      windowMs: configService.getApiAuthTokens().loginApiRateLimitTime * 1000,
      max: configService.getApiAuthTokens().loginApiRequestsRate,
      store: new RedisStore({
        client: RateLimiter.redisClient,
        expiry: configService.getApiAuthTokens().loginApiRateLimitTime,
      }),
      keyGenerator(req, res) {
        logger.info({reqBody: req.body},'rate limiter req data' );
        return (req.body && req.body.email_or_mobile) || (req.body && req.body.email) || (req.body && req.body.mobile) || req.ip;
      },
      message: 'Too many login requests from this IP, please try again after 5 minutes',
      handler(req, res) {
        const email_or_mobile = (req.body && req.body.email_or_mobile) || (req.body && req.body.email) || (req.body && req.body.mobile) || req.ip;
        logger.info({ xFFor: req.headers['x-forwarded-for'], remoAdd: req.connection.remoteAddress , ip: req.ip}, "fraud: user ip address");
        monitoringHelper.trackFraudUser();
        logger.info({ email_or_mobile }, 'Too many login requests from this email_or_mobile');
        res.status(200).send({ status: { success: false, errors: [{ code: 101, message: this.message, data: {} }] } });
      },
    });
  }

  static userCheckStatusLimiter(): any {
    return rateLimit({
      windowMs: configService.getApiAuthTokens().checkStatusApiRateLimitTime * 1000,
      max: configService.getApiAuthTokens().checkStatusApiRequestsRate,
      store: new RedisStore({
        client: RateLimiter.redisClient,
        expiry: configService.getApiAuthTokens().checkStatusApiRateLimitTime,
      }),
      keyGenerator(req, res) {
        logger.info({reqBody: req.body},'rate limiter req data' );
        const prefix = 'checkStatus:';
        const mainKey = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : null || req.ip;
        return prefix + mainKey;
      },
      message: 'Too many login requests from this IP, please try again after 5 minutes',
      handler(req, res) {
        const email_or_mobile = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : null || req.ip;
        logger.info({ xFFor: req.headers['x-forwarded-for'], remoAdd: req.connection.remoteAddress , ip: req.ip}, "fraud: user ip address");
        monitoringHelper.trackFraudUser();
        logger.info({ email_or_mobile }, 'Too many login requests from this email_or_mobile');
        res.status(200).send({ status: { success: false, errors: [{ code: 101, message: this.message, data: {} }] } });
      },
    });
  }

  static appDownloadLinkIPLimiter(): any {
    return  rateLimit({
      windowMs: configService.getApiAuthTokens().appDownloadLinkIPApiRateLimitTime * 1000 || 10 * 60 * 1000,
      max: configService.getApiAuthTokens().appDownloadLinkIPApiRequestsRate || 50,
      store: new RedisStore({
        client: RateLimiter.redisClient,
        expiry: configService.getApiAuthTokens().appDownloadLinkIPApiRateLimitTime || 10 * 60,
      }),
      keyGenerator(req, res) {
        const prefix = 'appDownloadIPAddress:';
        const mainKey = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : null;
        return prefix + mainKey;
      },
      message: 'Too many app download requests from this IP, please try again after 10 minutes',
      handler(req, res, next) {
        const ipAddress = req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0] : null;
        if (!ipAddress) {
          next();
        } else {
          monitoringHelper.trackFraudUserForAppDownloadsIP(ipAddress);
          logger.info({ ipAddress }, 'Too many app download requests from this ip address');
          res.status(200).send(restHelper.getSuccessResponse({}));
        }
      },
    });
  }

}
