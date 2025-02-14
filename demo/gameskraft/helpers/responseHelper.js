import LoggerUtil from "../utils/logger";
const logger = LoggerUtil.get('responseHelper');

const DEFAULT_ERROR_CODE = 5000000;
exports.DEFAULT_ERROR_CODE = DEFAULT_ERROR_CODE;

exports.initResponseManager = function(req, res) {

    // TODO: Later resolve the language as well.
    let language = 'random';    // It would be Telugu (te), Tamil (ta) etc.

    // Check for not supported language
    if (! errorMessages[language]) {
        language = 'default';
    }

    logger.info({language}, 'Identified the appropriate language for response');

    res.responseManager = {
        sendSuccess: function(data = {}) {
            res.send({
                data: data,
                status: {
                    success: true
                }
            });
        },
        sendError: function(error = {code: DEFAULT_ERROR_CODE}, data = {}) {
            let { code, type, name, message } = error;
            let errorMessage = errorMessages[language][DEFAULT_ERROR_CODE]();
            let errorDetail = errorDetails[DEFAULT_ERROR_CODE]();
            if (code !== DEFAULT_ERROR_CODE) {
                if (errorMessages[language][code]) {
                    errorMessage = errorMessages[language][code]();
                } else {
                    errorMessage = undefined;   
                }
            }
            if(code !== DEFAULT_ERROR_CODE) {
                if(errorDetails[code]) {
                    errorDetail = errorDetails[code]();
                }
            }
            if(data.parametrizedMsg) {
                errorMessage = constructParameterizedMessage(errorMessage, data.parametrizedMsg);
            }

            code = code.toString();     // Front end expects this as string

            res.send({
                status: {
                    success: false,
                    errors : [{
                        code,
                        type,
                        name,
                        message: errorMessage || message,
                        details: errorDetail,
                    }]
                },
            });
        },
    };
};

function constructParameterizedMessage(msg, params) {
    let message = msg;
    for(let token in params) {
        const keyToken = "%"+token+"%";
        message = message.replace(keyToken,params[token]);
    }
    return message;
}

// Note: Intentionally kept at the bottom. Because of circular dependencies.
const errorMessages = {
    // WARNING: Never remove the default option !!!
    default : require('../messages/errorMessages').MESSAGES,
    en      : require('../messages/errorMessages').MESSAGES,
};

const errorDetails = require('../messages/errorDetails').ERRORDETAILS;
