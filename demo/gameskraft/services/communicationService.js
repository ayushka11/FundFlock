import {GMZ_VENDOR_ID, P52_VENDOR_ID} from "../constants/constants";

const configService = require("./configService");
const monitoringHelper = require("../helpers/monitoringHelper");
const { COMMUNICATION_MODE } = require("../constants/constants");
import BaseClient from "../clients/baseClient";
import LoggerUtil from "../utils/logger";

const logger = LoggerUtil.get("communicationService");

exports.sendSMSForOTPLogin = function (
  restClient,
  mobile,
  code,
  uniqueCode,
  vendorId,
  callback
) {
  logger.info({ mobile, code }, "Sending sending SMS for OTP login : ");
  let requestJson = {
    messageInfo: [
      {
        mobile: [mobile],
        templateId:
          configService.getCommunicationTemplatesForVendor()[vendorId]
            .otpLoginNewSMS,
        params: {
          UNIQUE_CODE: uniqueCode,
          OTP: code,
        },
      },
    ],
  };
  monitoringHelper.trackSmsEmail(
    COMMUNICATION_MODE.SMS + "." + "sendSMSForOTPLogin"
  );
  restClient.sendPostRequest(
    __getCompleteUrl(urls.sendMessage),
    requestJson,
    callback
  );
};

exports.sendForgotPasswordOTP = function (
  restClient,
  mobile,
  userHandle,
  otp,
  vendorId,
  callback
) {
  logger.info("Sending forgot password otp : viaSMS");
  let requestJson = {
    messageInfo: [
      {
        mobile: [mobile],
        templateId:
          configService.getCommunicationTemplatesForVendor()[vendorId]
            .forgotPasswordOtpViaSMS,
        params: {
          USER_NAME: userHandle,
          OTP: otp,
        },
      },
    ],
  };
  restClient.sendPostRequest(
    __getCompleteUrl(urls.sendMessage),
    requestJson,
    callback
  );
};

exports.sendAppDownloadLink = function (
  restClient,
  mobile,
  vendorId,
  isRummy,
  callback
) {
  logger.info("Sending AppDownloadLink : viaSMS");
  let templateId= -1;
  let params = {};
  if(vendorId === P52_VENDOR_ID) {
    if(isRummy) {
      templateId = configService.getCommunicationTemplatesForVendor()[vendorId].pocket52RummyAppDownloadSms;
      params = {
        TEXT: configService.getAppDownloadSmsConfig()[vendorId].pocket52RummyAppDownloadSmsText,
        AMOUNT: configService.getAppDownloadSmsConfig()[vendorId].pocket52RummyAppDownloadSmsAmount,
        URL: configService.getAppDownloadSmsConfig()[vendorId].pocket52RummyAppDownloadSmsUrl,
      }
    }
    else {
        templateId = configService.getCommunicationTemplatesForVendor()[vendorId].pocket52AppDownloadSms;
        params = {
          TEXT: configService.getAppDownloadSmsConfig()[vendorId].pocket52AppDownloadSmsText,
          AMOUNT: configService.getAppDownloadSmsConfig()[vendorId].pocket52AppDownloadSmsAmount,
          URL: configService.getAppDownloadSmsConfig()[vendorId].pocket52AppDownloadSmsUrl,
        }
    }
  } else if(vendorId === GMZ_VENDOR_ID) {
    templateId = configService.getCommunicationTemplatesForVendor()[vendorId].gamezyAppDownloadSms;
    params = {
      TEXT: configService.getAppDownloadSmsConfig()[vendorId].gamezyAppDownloadSmsText,
      AMOUNT: configService.getAppDownloadSmsConfig()[vendorId].gamezyAppDownloadSmsAmount,
      URL: configService.getAppDownloadSmsConfig()[vendorId].gamezyAppDownloadSmsUrl,
    }
  }
  let requestJson = {
    messageInfo: [
      {
        mobile: [mobile],
        templateId:templateId,
        params: params
      },
    ],
  };
  restClient.sendPostRequest(
    __getCompleteUrl(urls.sendMessage),
    requestJson,
    callback
  );
};

exports.processSmsWebhook = async function (
  restClient,
  webhookResponse,
  vendorId
) {
  logger.info(
    "[processSmsWebhook] got the response for sms webhook :: ",
    webhookResponse
  );
  const headers = getCommunicationServiceHeaders(vendorId);
  logger.info("sending the request with headers", headers);
  let smsWebhookRes = await BaseClient.sendPostRequestWithHeaders(
    restClient,
    __getCompleteUrl(urls.processSmsWebhook),
    webhookResponse,
    headers
  );
  logger.info(
    "[processSmsWebhook] got the response from communicationService :: ",
    smsWebhookRes
  );
  return smsWebhookRes;
};

function __getCompleteUrl(relativeUrl) {
  return configService.getCommunicationServiceBaseUrl() + relativeUrl;
}

function getCommunicationServiceHeaders(vendorId) {
  const tenetBrandId = configService.getBrandIdForVendor()[vendorId];
  const headers = { "X-Brand-Id": tenetBrandId };
  return headers;
}

const urls = {
  sendMessage: "/message",
  processSmsWebhook: "/smsWebhook/gupshup",
};
