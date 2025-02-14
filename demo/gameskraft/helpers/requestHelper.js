import LoggerUtil, { logger } from '../utils/logger';

const request = require('superagent');

const uuid = require('uuid');
const async = require('async');
const configService = require('../services/configService');
const redisService = require('../services/redisService');
const monitoringHelper = require('../helpers/monitoringHelper');


// ///////////////////////// Encrypted Header Parser : Start ///////////////////////////
export const decryptString = (encryptedString, sessionId) => {
  if (typeof encryptedString === 'undefined') {
    return {};
  }
  let decryptedStr = '';
  function string2Bin(str) {
    const result = [];
    for (let i = 0; i < str.length; i++) {
      result.push(str.charCodeAt(i));
    }
    return result;
  }
  function bin2String(array) {
    return String.fromCharCode.apply(String, array);
  }
  if (encryptedString.indexOf('app-version') === -1) {
    const b64decodedStr = Buffer.from(encryptedString, 'base64').toString('ascii');
    const n = b64decodedStr.length;
    const m = sessionId.length;
    const repeat = parseInt(n / m);
    const remainder = n % m;
    let key = '';
    for (let i = 0; i < repeat; i++) {
      key += sessionId;
    }
    key += sessionId.slice(0, remainder);

    const xor1 = string2Bin(b64decodedStr);
    const xor2 = string2Bin(key);

    const z = [];
    for (let i = 0; i < n; i++) {
      z.push(xor1[i] ^ xor2[i]);
    }
    decryptedStr = bin2String(z);
  } else {
    decryptedStr = encryptedString;
  }
  const decarr = decryptedStr.split('; ');
  const decCookie = {};
  for (let c of decarr) {
    c = c.split('=');
    if (c[0] && c[1]) {
      decCookie[c[0]] = c[1];
    }
  }
  return decCookie;
};
// ////////////////////////// Encrypted Header Parser : End ////////////////////////////

const hasSensitiveData = (inputObj, depth = 0) => {
  if (typeof inputObj === 'object' && inputObj !== null && depth < 3) { // because typeof null === "object"
    for (const k of Object.keys(inputObj)) {
      const val = inputObj[k];
      if (typeof val === 'object') {
        return hasSensitiveData(val, depth + 1);
      }
      if (['otp', 'passwd', 'VERIFICATION_URL'].indexOf(k) !== -1) {
        return true;
      }
    }
  }
  return false;
};

// ///////////////////////////// Logger : End ///////////////////////////////////////////

// //////////////////////////////////////////////////////////////////////////////////////
export const sanitizeData = (req, res, next) => {
  let params = req.body;
  for(let key in params) {
    if (params.hasOwnProperty(key)) {
      params[key] = params[key].replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }
  };
  next();
}
