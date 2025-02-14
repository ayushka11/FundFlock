import ServiceErrorUtil from '../errors/service-error-util';
import {CheckStatusRequest, CheckUsernameRequest, VerifyEmailRequest} from '../models/request/user';
import EventNames from '../producer/enums/eventNames';
import UserService from '../services/userService';
import LoggerUtil from '../utils/logger';
import ResponseUtil from '../utils/response-util';
import EventPushService from '../producer/eventPushService';
import UserDetails from '../models/user-details';

const configService = require('../services/configService');
const logger = LoggerUtil.get("userController");

export default class UserController {

    static async checkStatus(req, res, next) {
        try {
            const reqBody: CheckStatusRequest = req.body;
            const vendorId: string = req.vendorId;
            const response = await UserService.checkStatus(req, reqBody, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error(error, 'Error in checkStatus');
            next(error);
        }
    }

    static async getUserSummary(req, res, next) {
        try {
            const reqBody: CheckStatusRequest = req.body;
            const vendorId: string = req.vendorId;
            const response = await UserService.getUserSummary(req, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error(error, 'Error in getUserSummary');
            next(error);
        }
    }

    static async getUserSummaryV2(req, res, next) {
        try {
            const reqBody: CheckStatusRequest = req.body;
            const vendorId: string = req.vendorId;
            const response = await UserService.getUserSummaryV2(req, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error(error, 'Error in getUserSummaryV2');
            next(error);
        }
    }

    static async getPracticeUserSummaryV2(req, res, next) {
        try {
            const reqBody: CheckStatusRequest = req.body;
            const vendorId: string = req.vendorId;
            const response = await UserService.getPracticeUserSummaryV2(req, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error(error, 'Error in getPracticeUserSummaryV2');
            next(error);
        }
    }

    static async getUserPersonal(req, res, next) {
        try {
            const vendorId: string = req.vendorId;
            const response = await UserService.getUserPersonal(req, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error(error, 'Error in getUserPersonal');
            next(error);
        }
    }

    static async updateUserPersonal(req, res, next) {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const response = await UserService.updateUserPersonal(req, userId, req.body, vendorId);

            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error(error, 'Error in updateUserPersonal');
            next(error);
        }
    }

    static async getUserProfile(req, res, next) {
        try {
            const vendorId: string = req.vendorId;
            const response = await UserService.getUserPersonal(req, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error(error, 'Error in getUserProfile');
            next(error);
        }
    }

    static async getUserAvatars(req, res, next) {
        try {
            const vendorId: string = req.vendorId;
            const response = await UserService.getUserAvatars(req, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error(error, 'Error in getUserAvatars');
            next(error);
        }
    }

    static async checkPermission(req, res, next) {
        try {
            const response = await UserService.checkPermission(req);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error(error, 'Error in checkPermission');
            next(error);
        }
    }

    static async verifyEmail(req, res, next) {
        try {
            const reqBody: VerifyEmailRequest = req.body;
            const vendorId: string = req.vendorId;
            const response = await UserService.verifyEmail(req, reqBody, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error(error, 'Error in verifyEmail');
            next(error);
        }
    }

    static async getSession(req, res, next) {
        try {
            const userId = req.sessionManager.getLoggedInUserId();
            const vendorId = req.sessionManager.getVendorId();
            let data: any = {
                loggedInUserId: userId,
                vendorId
            };
            if (!userId) {
                ResponseUtil.sendErrorResponse(res, ServiceErrorUtil.getAuthorizationError());
                return;
            }
            logger.info({data}, 'user session data');
            ResponseUtil.sendSuccessResponse(res, data);
        } catch (error) {
            logger.error({error}, 'Error in getSession');
            next(error);
        }
    }

    static async checkUsername(req, res, next) {
        try {
            const reqBody: CheckUsernameRequest = req.body;
            const vendorId: string = req.vendorId;
            const response = await UserService.checkUsername(req, reqBody, vendorId);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error(error, 'Error in checkUsername');
            next(error);
        }
    }

    static async updateUploadsInSession(req, res, next) {
        try{
            const params = req.body;
            logger.info({params: params}, 'Inside updateUploadsInSession');
            req.sessionManager.setUploadedFile(params.s3BucketName, params.docType, params.filePath).then(() => {
                ResponseUtil.sendSuccessResponse(res, {});
            }).catch((error: Error) => {
                next(error);
            });
        } catch(error){
            logger.error({error}, 'Error in updateUploadsInSession');
            next(error);
        }
    };

    // Internal API - HAS NO session, need to remove after GS moved to NEW GS
    // Do not use this - Remove after NEW GS is deployed
    static async getLocationInternalAPI(req, res, next) {
        try {
            const userId = req.params.userId;

            if (!userId) {
                ResponseUtil.sendErrorResponse(res, ServiceErrorUtil.getAuthorizationError());
                return;
            }

            const data = await req.sessionManager.getUserSessionDataFromRedis(userId);
            let response = {};
            try {
                response = JSON.parse(data && data.location || '');
            } catch (e) {
                logger.error(e, "getLocationInternalAPI:: Error in parsing redis data");
            }

            ResponseUtil.sendSuccessResponse(res, response);
        } catch (error) {
            logger.error({error}, 'Error in getLocationInternalAPI');
            next(error);
        }
    }

    static async storeUserPackages(req, res, next) {
        try {
            const userId = req.sessionManager.getLoggedInUserId();
            const vendorId = req.vendorId;
            const reqBody = req.body;
            const packages = reqBody.packages;
            logger.error({packages}, "package store request");
            const eventData = {
                userId,
                packages,
            };
            EventPushService.push(userId, Number(vendorId), "", EventNames.USER_INSTALLED_PACKAGES, eventData);
            ResponseUtil.sendSuccessResponse(res, {});
        } catch (error: any) {
            logger.error({error}, 'Error in storing app packages [storeUserPackages]');
            next(error);
        }
    }

    static async usersTournamentSettingsInfoBulk(req, res, next) {
        try {
            const usersInfoList: Array<UserDetails> = req.body;
            logger.info({usersInfoList}, "[usersTournamentSettingsInfoBulk] [usersInfoList]");
            const resp: any = await UserService.getUsersTournamentSettingsInfo(req.internalRestClient, usersInfoList);
            logger.info({resp}, "[usersTournamentSettingsInfoBulk] resp");
            ResponseUtil.sendSuccessResponse(res, resp);
        } catch (error: any) {
            logger.error({error}, 'Error in storing app packages [storeUserPackages]');
            next(error);
        }
    }
}
