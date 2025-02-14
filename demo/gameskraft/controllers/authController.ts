const restHelper = require('../helpers/restHelper');
import {
    GenerateOtpRequest,
    LoginWithPasswordRequest,
    SetPasswordRequest,
    VerifyOtpRequest,
    TrueCallerRequest,
    TrueCallerRequestV2
} from '../models/request/auth';
import LoggerUtil from '../utils/logger';
import AuthService from "../services/authService";
import ResponseUtil from '../utils/response-util';
import { CASH_APP, PRACTICE_APP } from '../constants/constants';

const logger = LoggerUtil.get("authController");

export default class AuthController {

    static async generateOtp (req, res, next)  {
        try {
            const reqBody: GenerateOtpRequest = req.body;
            const vendorId: string = req.vendorId;

            const response = await AuthService.login(req, reqBody, vendorId,CASH_APP);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error({error}, 'Error in generateOtp');
            return next(error);
        }
    };

    static async generatePracticeAppOtp (req, res, next)  {
        try {
            const reqBody: GenerateOtpRequest = req.body;
            const vendorId: string = req.vendorId;

            const response = await AuthService.login(req, reqBody, vendorId,PRACTICE_APP);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error({error}, 'Error in generateOtp');
            return next(error);
        }
    };

    static async generateOtpForgotPassword(req, res, next)  {
        try {
            const reqBody: GenerateOtpRequest = req.body;
            const vendorId: string = req.vendorId;

            const response = await AuthService.generateOtpForgotPassword(req, reqBody, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error({error}, 'Error in generateOtp');
            return next(error);
        }
    };

    static async otpLogin(req, res, next)  {
        try {
            const reqBody: VerifyOtpRequest = req.body;
            const vendorId: string = req.vendorId;
            const response = await AuthService.verifyOTPLogin(req, reqBody, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error({error}, 'Error in verifyOtp');
            return next(error);
        }
    };

    static async trueCallerLogin(req, res, next)  {
        try {
            const reqBody: TrueCallerRequest = req.body;
            const vendorId: string = req.vendorId;
            const response = await AuthService.verifyTrueCallerLogin(req, reqBody, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error({error}, 'Error in trueCallerLogin');
            return next(error);
        }
    };

    static async trueCallerLoginV2(req, res, next)  {
        try {
            const reqBody: TrueCallerRequestV2 = req.body;
            const vendorId: string = req.vendorId;
            const response = await AuthService.verifyTrueCallerLoginV2(req, reqBody, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error({error}, 'Error in trueCallerLogin');
            return next(error);
        }
    };

    static async verifyOtpForgotPassword (req, res, next)  {
        try {
            const reqBody: VerifyOtpRequest = req.body;
            const vendorId: string = req.vendorId;

            const response = await AuthService.verifyOTPForgotPassword(req, reqBody, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error({error}, 'Error in verifyOtpForgotPassword');
            return next(error);
        }
    }

    static async userLoggedinState (req, res, next)  {
        try {
            const vendorId: string = req.vendorId;

            const response = await AuthService.userLoggedinState(req, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error({error}, 'Error in userLoggedinState');
            return next(error);
        }
    }

    static async userSession(req, res, next)  {
        try {
            const vendorId: string = req.vendorId;
            const response = await AuthService.userSession(req, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error({error}, 'Error in userSession');
            return next(error);
        }
    }

    static async setUserPassword(req, res, next)  {
        try {
            const vendorId: string = req.vendorId;
            const reqBody: SetPasswordRequest = req.body;
            const response = await AuthService.setPassword(req, reqBody, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error({error}, 'Error in userSession');
            return next(error);
        }
    }

    static async checkLoggedInUserForApi(req, res, next) {
        if (AuthController.__isUserNotLoggedIn(req)) {
            res.send(restHelper.getErrorResponse(401, {    // Nothing as of now
            }, "unauthorized"));

            // No need to call other handlers
            return;
        }

        // Otherwise continue to next handler
        next();
    }

    static __isUserNotLoggedIn(req) {

        const userId = req.sessionManager.getLoggedInUserId();

        logger.info('Inside checkLoggedInUser. Logged in user id = ' + userId + " cookies :: " + req.cookieManager.getSessionId());

        return !userId;
    }

    static async loginWithPassword(req, res, next) {
        try {
            const reqBody: LoginWithPasswordRequest = req.body;
            const vendorId: string = req.vendorId;
            const response = await AuthService.loginWithPassword(req, reqBody, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error({error}, 'Error in loginWithPassword');
            next(error);
        }
    }

    static async refreshToken(req, res, next) {
        try {
            const response = await AuthService.refreshToken(req);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error({error}, 'Error in refreshToken');
            next(error);
        }
    }

    static async logoutUser(req, res, next) {
        try {
            const response = await AuthService.logoutUser(req);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error({error}, 'Error in logout User');
            next(error);
        }
    }

    static async checkLoggedInUserForPage(req, res, next) {
        if (AuthController.__isUserNotLoggedIn(req)) {
            res.redirect("/");
            // No need to call other handlers
            return;
        }
        // Otherwise continue to next handler
        next();
    }
}

