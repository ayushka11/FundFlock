import {USER_NOTE_REQUEST_PARAMS, ZODIAC_REQUEST_PARAM} from "../constants/zodiac-constants";
import {
    CreateUserNotePayload,
    CreateUserNoteRequest,
    CreateUserNoteRequestV2,
    GetUserNotesPayload,
    IUserNote,
    IUserNoteColor,
    IUserNotes,
    ReferenceUser,
    UpdateUserNoteColorPayload,
    UpdateUserNoteColorRequest,
    UserNote,
    UserNoteColor,
} from "../models/zodiac/user-note";
import { 
    UserGameplayDetails, IUserGameplayDetails
} from "../models/zodiac/user-detail";
import MigrationService from '../services/migrationService';
import ZodiacService from "../services/zodiacService";
import LoggerUtil, {ILogger} from '../utils/logger';
import ResponseUtil from "../utils/response-util";
import RequestUtil from "../helpers/request-util";
import ZodiacUtil from "../utils/zodiac-util";
import {
    IUserBetSettings,
    IUserGameplaySettings,
    IUserGameSettings,
    IUserSoundSettings,
    UpdateUserAutoTopUpSetting,
    UpdateUserAutoTopUpSettingsPayload,
    UpdateUserBetSettingsPayload,
    UpdateUserBetSettingsRequest,
    UpdateUserGameSettingsPayload,
    UpdateUserGameSettingsRequest,
    UpdateUserSoundSettingsPayload,
    UpdateUserSoundSettingsRequest,
    UserAutoTopUpSetting,
    UserBetSettings,
    UserGameplaySettings,
    UserGameSettings,
    UserSoundSettings
} from "../models/zodiac/gameplay";
import Pagination from "../models/pagination";
import IDMService from "../services/idmService";
import {GMZ_VENDOR_ID, P52_VENDOR_ID, PRACTICE_APP} from "../constants/constants";
import IDMServiceErrorUtil from "../errors/idm/idm-error-util";
import { AriesService } from "../services/ariesService";
import UserGameSettingType from "../models/enums/user-game-setting-type";
import VendorUtil from "../utils/vendor-utils";
import { getAutoTopUpFlagForPlatformForVendor } from "../services/configService";
import ClsUtil from '../utils/cls-util';
import EventPushService from "../producer/eventPushService";
import EventNames from "../producer/enums/eventNames";
import { AriesTournamentService } from "../services/ariesTournamentService";

const logger: ILogger = LoggerUtil.get("ZodiacController");

export default class ZodiacController {

    // depriciated method donot use this
    // use policy controller
    static async getUserPolicy(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const vendorId: string = req.vendorId;
            logger.info({UserUniqueId: userUniqueId}, `[ZodiacController] [getUserPolicy] `);
            const resp = await ZodiacService.getUserPolicy(req.internalRestClient, userUniqueId, vendorId);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }
    // depriciated method donot use this
    // use policy controller
    static async createUserPolicyAcknowledgement(req, res, next): Promise<any> {
        try {
            const {params, query} = req;
            const {body} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            logger.info({UserUniqueId: userUniqueId}, `[ZodiacController] [getUserPolicy] `);
            const resp = await ZodiacService.createUserAcknowledgement(req.internalRestClient, userUniqueId, body,userId,vendorId);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getUserCashTableActiveHandHistory(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const tableId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.TABLE_ID);
            logger.info({
                UserUniqueId: userUniqueId,
                TableId: tableId
            }, `[ZodiacController] [getUserCashTableActiveHandHistory] `);
            const resp: any = await ZodiacService.getUserCashTableActiveHandHistory(req.internalRestClient, userUniqueId, tableId);
            logger.info(resp, `[ZodiacController] [getUserCashTableActiveHandHistory] cashTableActiveHandHistory :: `);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getUserPracticeTableActiveHandHistory(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const tableId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.TABLE_ID);
            logger.info({
                UserUniqueId: userUniqueId,
                TableId: tableId
            }, `[ZodiacController] [getUserPracticeTableActiveHandHistory] `);
            const resp: any = await ZodiacService.getUserPracticeTableActiveHandHistory(req.internalRestClient, userUniqueId, tableId);
            logger.info(resp, `[ZodiacController] [getUserPracticeTableActiveHandHistory] practiceTableActiveHandHistory :: `);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getUserTournamentActiveHandHistory(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const tournamentId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.TOURNAMENT_ID);
            logger.info({
                UserUniqueId: userUniqueId,
                TournamentId: tournamentId
            }, `[ZodiacController] [getUserTournamentActiveHandHistory] `);
            const resp: any = await ZodiacService.getUserTournamentActiveHandHistory(req.internalRestClient, userUniqueId, tournamentId);
            logger.info(resp, `[ZodiacController] [getUserTournamentActiveHandHistory] userTournamentActiveHandHistory :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getUserCashTableHandHistory(req, res, next): Promise<any> {
        try {
            const {query} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const date: string = RequestUtil.parseQueryParamAsString(query, ZODIAC_REQUEST_PARAM.DATE);
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            const gameVariant: string = RequestUtil.parseQueryParamAsString(query, ZODIAC_REQUEST_PARAM.GAME_VARIANT);
            logger.info({
                UserUniqueId: userUniqueId,
                Date: date,
                GameVariant: gameVariant
            }, `[ZodiacController] [getUserCashTableHandHistory] `);
            const resp: any = await ZodiacService.getUserCashTableHandHistory(req.internalRestClient, userUniqueId, date, pagination, gameVariant);
            logger.info(resp, `[ZodiacController] [getUserCashTableHandHistory] userCashTableHandHistory :: `);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getUserPracticeTableHandHistory(req, res, next): Promise<any> {
        try {
            const {query} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const date: string = RequestUtil.parseQueryParamAsString(query, ZODIAC_REQUEST_PARAM.DATE);
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            const gameVariant: string = RequestUtil.parseQueryParamAsString(query, ZODIAC_REQUEST_PARAM.GAME_VARIANT);
            logger.info({
                UserUniqueId: userUniqueId,
                Date: date,
                GameVariant: gameVariant
            }, `[ZodiacController] [getUserPracticeTableHandHistory] `);
            const resp: any = await ZodiacService.getUserPracticeTableHandHistory(req.internalRestClient, userUniqueId, date, pagination, gameVariant);
            logger.info(resp, `[ZodiacController] [getUserPracticeTableHandHistory] practiceTableHandHistory :: `);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getUserTournamentHandHistory(req, res, next): Promise<any> {
        try {
            const {query} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const date: string = RequestUtil.parseQueryParamAsString(query, ZODIAC_REQUEST_PARAM.DATE);
            const pagination: Pagination = RequestUtil.getPaginationInfo(query);
            logger.info({UserUniqueId: userUniqueId, Date: date}, `[ZodiacController] [getUserTournamentHandHistory] `);
            const resp: any = await ZodiacService.getUserTournamentHandHistory(req.internalRestClient, userUniqueId, date, pagination);
            logger.info(resp, `[ZodiacController] [getUserTournamentHandHistory] userTournamentHandHistory :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getUserCashTableHandDetails(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const tableId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.TABLE_ID);
            const handId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.HAND_ID);
            logger.info({
                UserUniqueId: userUniqueId,
                TableId: tableId,
                HandId: handId
            }, `[ZodiacController] [getUserCashTableHandDetails] `);
            const resp: any = await ZodiacService.getUserCashTableHandDetails(req.internalRestClient, userUniqueId, tableId, handId);
            logger.info(resp, `[ZodiacController] [getUserCashTableHandDetails] userCashTableHandDetails :: `);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getUserPracticeTableHandDetails(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const tableId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.TABLE_ID);
            const handId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.HAND_ID);
            logger.info({
                UserUniqueId: userUniqueId,
                TableId: tableId,
                HandId: handId
            }, `[ZodiacController] [getUserPracticeTableHandDetails] `);
            const resp: any = await ZodiacService.getUserPracticeTableHandDetails(req.internalRestClient, userUniqueId, tableId, handId);
            logger.info(resp, `[ZodiacController] [getUserPracticeTableHandDetails] userPracticeTableHandDetails :: `);
            return ResponseUtil.sendSuccessResponse(res, resp);
        } catch (e) {
            next(e);
        }
    }

    static async getUserTournamentHandDetails(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const tournamentId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.TOURNAMENT_ID);
            const handId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.HAND_ID);
            logger.info({
                UserUniqueId: userUniqueId,
                TournamentId: tournamentId,
                HandId: handId
            }, `[ZodiacController] [getUserTournamentHandDetails] `);
            const resp: any = await ZodiacService.getUserTournamentHandDetails(req.internalRestClient, userUniqueId, tournamentId, handId);
            logger.info(resp, `[ZodiacController] [getUserTournamentHandDetails] userTournamentHandDetails :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getUserHandDetails(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const handId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.HAND_ID);
            logger.info({UserUniqueId: userUniqueId, HandId: handId}, `[ZodiacController] [getUserHandDetails] `);
            const resp: any = await ZodiacService.getUserHandDetails(req.internalRestClient, userUniqueId, handId);
            logger.info(resp, `[ZodiacController] [getUserHandDetails] userHandDetails :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getUserTournamentHistory(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const date: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.DATE);
            logger.info({UserUniqueId: userUniqueId, Date: date}, `[ZodiacController] [getUserTournamentHistory] `);
            const resp: any = await ZodiacService.getUserTournamentHistory(req.internalRestClient, userUniqueId, date);
            logger.info(resp, `[ZodiacController] [getUserTournamentHistory] userTournamentHistory :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getUserStats(req,res,next):Promise<any> {
        try {
            const userId: number = req.sessionManager.getLoggedInUserId();
            logger.info({userId: userId}, `[ZodiacController] [getUserStats] `);
            const resp: any = await ZodiacService.getUserStats(req.internalRestClient, Number(userId));
            logger.info(resp, `[ZodiacController] [getUserStats] userStats :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getUserGameplayStats(req,res,next):Promise<any> {
        try {
            const {params, query} = req;
            const userId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.USER_ID);
            const vendorId: string = req.vendorId;
            const gameType: number = RequestUtil.parseQueryParamAsNumber(query, ZODIAC_REQUEST_PARAM.GAME_TYPE);  
            const gameVariant: string = RequestUtil.parseQueryParamAsString(query, ZODIAC_REQUEST_PARAM.GAME_VARIANT);
            logger.info({
                UserId: userId, 
                VendorId: vendorId,
                GameType: gameType,
                GameVariant: gameVariant
            }, `[ZodiacController] [getUserGameplayStats] `);
            const resp: any = await ZodiacService.getUserGameplayStats(req.internalRestClient, Number(userId), Number(vendorId), gameType, gameVariant);
            logger.info(resp, `[ZodiacController] [getUserGameplayStats] userGameplayStats :: `);
            return ResponseUtil.sendSuccessResponse(res, resp)
        } catch (e) {
            next(e);
        }
    }

    static async getUserNotes(req, res, next): Promise<any> {
        try {
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const vendorId: string = req.vendorId;
            const referenceUserIdString: string = req.query?.referenceUserIds ?? '';
            const getUserNotesPayload: GetUserNotesPayload = {
                reference_user_ids: referenceUserIdString.split(','),
            };
            logger.info(`[ZodiacController] [getUserNotes] userUniqueId :: ${userUniqueId} :: getUserNotesPayload :: ${JSON.stringify(getUserNotesPayload)}`);
            const _userNotes: UserNote[] = await ZodiacService.getUserNotes(req.internalRestClient, userUniqueId, getUserNotesPayload);
            logger.info(`[ZodiacController] [getUserNotes] _userNotes :: ${JSON.stringify(_userNotes)}`);
            const referenceUserIds: string[] = referenceUserIdString.split(',');
            const userDetails = await (Promise as any).allSettled(
                referenceUserIds.map((referenceUserId: string) => {
                    const [vendorId, userId] = referenceUserId.split('_');
                    if (vendorId === P52_VENDOR_ID || vendorId === GMZ_VENDOR_ID) {
                        return IDMService.getUserDetails(req.internalRestClient, userId, vendorId);
                    } else {
                        // Return a resolved promise for non-matching vendorId
                        return Promise.resolve(null);
                    }
                }),
            );
            logger.info(`[ZodiacController] [getUserNotes] userDetails :: ${JSON.stringify(userDetails)}`);
            const filteredUserDetails = userDetails.filter((userDetail) => userDetail.status === 'fulfilled').map((userDetail) => userDetail.value);
            logger.info(`[ZodiacController] [getUserNotes] filteredUserDetails :: ${JSON.stringify(filteredUserDetails)}`);
            const userNotes: {
                [key: string]: IUserNotes
            } = ZodiacUtil.getUserNotes(vendorId, referenceUserIds, filteredUserDetails, _userNotes);
            logger.info(`[ZodiacController] [getUserNotes] userNotes :: ${JSON.stringify(userNotes)}`);
            return ResponseUtil.sendSuccessResponse(res, {userNotes});
        } catch (error) {
            next(error);
        }
    }

    static async getUserNotesV2(req, res, next): Promise<any> {
        try {
            const {query, body} = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const vendorId: string = req.vendorId;
            const referenceUserIdArray = body.referenceUserIdList;
            const referenceUserIdString: string = referenceUserIdArray.map((elem) => `${elem.vendorId}_${elem.userId}`).join(',');
            const getUserNotesPayload: GetUserNotesPayload = {
                reference_user_ids: referenceUserIdString.split(','),
            };
            logger.info(`[ZodiacController] [getUserNotesV2] userUniqueId :: ${userUniqueId} :: getUserNotesPayload :: ${JSON.stringify(getUserNotesPayload)}`);
            const _userNotes: UserNote[] = await ZodiacService.getUserNotes(req.internalRestClient, userUniqueId, getUserNotesPayload);
            logger.info(`[ZodiacController] [getUserNotesV2] _userNotes :: ${JSON.stringify(_userNotes)}`);
            const userDetails = await (Promise as any).allSettled(
                referenceUserIdArray.map((referenceUser) => {
                    const userId = referenceUser.userId;
                    const vendorId = String(referenceUser.vendorId);
                    if (vendorId == P52_VENDOR_ID || vendorId == GMZ_VENDOR_ID) {
                        return IDMService.getUserDetails(req.internalRestClient, userId, vendorId);
                    } else {
                        // Return a resolved promise for non-matching vendorId
                        return Promise.resolve(null);
                    }
                }),
            );
            logger.info(`[ZodiacController] [getUserNotesV2] userDetails :: ${JSON.stringify(userDetails)}`);
            const filteredUserDetails = userDetails.filter((userDetail) => userDetail.status === 'fulfilled').map((userDetail) => userDetail.value);
            logger.info(`[ZodiacController] [getUserNotesV2] filteredUserDetails :: ${JSON.stringify(filteredUserDetails)}`);
            const userNotes: {
                [key: string]: IUserNotes
            } = ZodiacUtil.getUserNotesV2(vendorId, referenceUserIdArray, filteredUserDetails, _userNotes);
            logger.info(`[ZodiacController] [getUserNotesV2] userNotes :: ${JSON.stringify(userNotes)}`);
            return ResponseUtil.sendSuccessResponse(res, {userNotes});
        } catch (error) {
            next(error);
        }
    }

    static async getUserDetails(req, res, next): Promise<any> {
        try {
            const { body, query } = req;
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const vendorId: string = req.vendorId;
            const gameType: number = RequestUtil.parseQueryParamAsNumber(query, ZODIAC_REQUEST_PARAM.GAME_TYPE);  
            const gameVariant: string = RequestUtil.parseQueryParamAsString(query, ZODIAC_REQUEST_PARAM.GAME_VARIANT);
            const referenceUserIdArray = body.referenceUserIdList;
            const referenceUserIdString: string = referenceUserIdArray.map((elem) => `${elem.vendorId}_${elem.userId}`).join(',');
            const getUserNotesPayload: GetUserNotesPayload = {
                reference_user_ids: referenceUserIdString.split(','),
            };
            logger.info(`[ZodiacController] [getUserDetails] userUniqueId :: ${userUniqueId} :: getUserNotesPayload :: ${JSON.stringify(getUserNotesPayload)}`);
            
            //get User Gameplay Details(User Notes + User HUD stats)
            const _userDetails: UserGameplayDetails = await ZodiacService.getUserDetails(req.internalRestClient, userUniqueId, gameType, gameVariant, getUserNotesPayload);
            logger.info(`[ZodiacController] [getUserDetails] _userDetails :: ${JSON.stringify(_userDetails)}`);
           
            //get IDM User Details
            const userIDMDetails = await (Promise as any).allSettled(
                referenceUserIdArray.map((referenceUser) => {
                    const userId = referenceUser.userId;
                    const vendorId = String(referenceUser.vendorId);
                    if (vendorId == P52_VENDOR_ID || vendorId == GMZ_VENDOR_ID) {
                        return IDMService.getUserDetails(req.internalRestClient, userId, vendorId);
                    } else {
                        // Return a resolved promise for non-matching vendorId
                        return Promise.resolve(null);
                    }
                }),
            );
            logger.info(`[ZodiacController] [getUserDetails] userIDMDetails :: ${JSON.stringify(userIDMDetails)}`);
            const filteredUserDetails = userIDMDetails.filter((userDetail) => userDetail.status === 'fulfilled').map((userDetail) => userDetail.value);
            logger.info(`[ZodiacController] [getUserDetails] filteredUserDetails :: ${JSON.stringify(filteredUserDetails)}`);
            
            //combine _userDetails and userIDMDetails 
            const userDetails: IUserGameplayDetails = ZodiacUtil.getUserDetails(vendorId, referenceUserIdArray, filteredUserDetails, _userDetails);
            logger.info(`[ZodiacController] [getUserDetails] userDetails :: ${JSON.stringify(userDetails)}`);
            return ResponseUtil.sendSuccessResponse(res, {userDetails});
        } catch (error) {
            next(error);
        }
    }

    static async createUserNote(req, res, next): Promise<any> {
        try {
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const reqBody = req.body;
            const request: CreateUserNoteRequest = reqBody;
            const createUserNotePayload: CreateUserNotePayload = {
                reference_user_id: request.referenceUserId,
                note: request.note,
                color_id: request.colorId,
            };
            logger.info(`[ZodiacController] [createUserNote] userUniqueId :: ${userUniqueId} :: createUserNotePayload :: ${JSON.stringify(createUserNotePayload)}`);
            const _userNote: UserNote = await ZodiacService.createUserNote(req.internalRestClient, userUniqueId, createUserNotePayload);
            logger.info(`[ZodiacController] [createUserNote] _userNote :: ${JSON.stringify(_userNote)}`);
            const userNote: IUserNote = ZodiacUtil.getUserNote(_userNote);
            logger.info(`[ZodiacController] [createUserNote] userNote :: ${JSON.stringify(userNote)}`);
            return ResponseUtil.sendSuccessResponse(res, {userNote});
        } catch (error) {
            next(error);
        }
    }

    static async createUserNoteV2(req, res, next): Promise<any> {
        try {
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const reqBody = req.body;
            const request: CreateUserNoteRequestV2 = reqBody;
            if (![P52_VENDOR_ID, GMZ_VENDOR_ID].includes(`${request?.referenceUser?.vendorId}`)) {
                throw IDMServiceErrorUtil.getInvalidVendorId();
            }
            const createUserNotePayload: CreateUserNotePayload = {
                reference_user_id: `${request.referenceUser?.vendorId}_${request.referenceUser?.userId}`,
                note: request.note,
                color_id: request.colorId,
            };
            logger.info(`[ZodiacController] [createUserNoteV2] userUniqueId :: ${userUniqueId} :: createUserNotePayload :: ${JSON.stringify(createUserNotePayload)}`);
            const _userNote: UserNote = await ZodiacService.createUserNote(req.internalRestClient, userUniqueId, createUserNotePayload);
            logger.info(`[ZodiacController] [createUserNoteV2] _userNote :: ${JSON.stringify(_userNote)}`);
            const userNote: IUserNote = ZodiacUtil.getUserNote(_userNote);
            logger.info(`[ZodiacController] [createUserNoteV2] userNote :: ${JSON.stringify(userNote)}`);
            return ResponseUtil.sendSuccessResponse(res, {userNote});
        } catch (error) {
            next(error);
        }
    }

    static async getUserNoteColors(req, res, next): Promise<any> {
        try {
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            logger.info(`[ZodiacController] [getUserNoteColors] userUniqueId :: ${userUniqueId}`);
            const _userNoteColors: UserNoteColor[] = await ZodiacService.getUserNoteColors(req.internalRestClient, userUniqueId);
            logger.info(`[ZodiacController] [getUserNoteColors] _userNoteColors :: ${JSON.stringify(_userNoteColors)}`);
            const userNoteColors: IUserNoteColor[] = ZodiacUtil.getUserNoteColors(_userNoteColors);
            logger.info(`[ZodiacController] [getUserNoteColors] userNoteColors :: ${JSON.stringify(userNoteColors)}`);
            return ResponseUtil.sendSuccessResponse(res, {userNoteColors});
        } catch (error) {
            next(error);
        }
    }

    static async updateUserNoteColor(req, res, next): Promise<any> {
        try {
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const reqBody = req.body;
            const request: UpdateUserNoteColorRequest = reqBody;
            const updateUserNoteColorPayload: UpdateUserNoteColorPayload = {
                color_id: request.colorId,
                color_tag: request.colorTag,
            };
            logger.info(`[ZodiacController] [updateUserNoteColor] userUniqueId :: ${userUniqueId} ::  updateUserNoteColorPayload :: ${JSON.stringify(updateUserNoteColorPayload)}`);
            const _userNoteColors: UserNoteColor[] = await ZodiacService.updateUserNoteColor(req.internalRestClient, userUniqueId, updateUserNoteColorPayload);
            logger.info(`[ZodiacController] [updateUserNoteColor] _userNoteColors :: ${JSON.stringify(_userNoteColors)}`);
            const userNoteColors: IUserNoteColor[] = ZodiacUtil.getUserNoteColors(_userNoteColors);
            logger.info(`[ZodiacController] [updateUserNoteColor] userNoteColors :: ${JSON.stringify(userNoteColors)}`);
            return ResponseUtil.sendSuccessResponse(res, {userNoteColors});
        } catch (error) {
            next(error);
        }
    }

    static async getUserGameplaySettings(req, res, next): Promise<any> {
        try {
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            logger.info(`[ZodiacController] [getUserGameplaySettings] userUniqueId :: ${userUniqueId}`);
            const _gameplaySettings: UserGameplaySettings = await ZodiacService.getUserGameplaySettings(req.internalRestClient, userUniqueId);
            logger.info(`[ZodiacController] [getUserGameplaySettings] _gameplaySettings :: ${JSON.stringify(_gameplaySettings)}`);
            const processedGameplaySettings: IUserGameplaySettings = ZodiacUtil.getUserGameplaySettings(_gameplaySettings);
            // IN v2 Added soundSettings in IUserGameplaySettings. Removing soundSettings key for V1.
            const { soundSettings,autoTopUpSetting, ...gameplaySettings } = processedGameplaySettings;
            logger.info(`[ZodiacController] [getUserGameplaySettings] gameplaySettings :: ${JSON.stringify(gameplaySettings)}`);
            return ResponseUtil.sendSuccessResponse(res, {gameplaySettings});
        } catch (error) {
            next(error);
        }
    }

    static async getUserGameplaySettingsV2(req, res, next): Promise<any> {
        try {
            const headers = req?.headers;
            const vendorId: string = req.vendorId;
            let platform: string = ''
            if (headers.hasOwnProperty("gk-platform")) {
                platform = headers["gk-platform"]
            }
            const appType = ClsUtil.getAppType();
            logger.info(`[ZodiacController] [getUserGameplaySettingsV2] vendorId :: ${vendorId} platform :: ${platform} appType :: ${appType}`);
            
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            logger.info(`[ZodiacController] [getUserGameplaySettingsV2] userUniqueId :: ${userUniqueId}`);
            const _gameplaySettings: UserGameplaySettings = await ZodiacService.getUserGameplaySettings(req.internalRestClient, userUniqueId);
            logger.info(`[ZodiacController] [getUserGameplaySettingsV2] _gameplaySettings :: ${JSON.stringify(_gameplaySettings)}`);
            const processedGameplaySettings: IUserGameplaySettings = ZodiacUtil.getUserGameplaySettings(_gameplaySettings); 
            // IN v2 Added soundSettings in IUserGameplaySettings. filtering out existing gameSound from gameSettings.
            const gameplaySettings: IUserGameplaySettings = ZodiacUtil.filterGameSoundFromGameSettings(processedGameplaySettings);
            logger.info(`[ZodiacController] [getUserGameplaySettingsV2] gameplaySettings :: ${JSON.stringify(gameplaySettings)}`);
            
            // AUTO TOP UP FLAG CHECK 
            const autoTopUpFlagForPlatform = getAutoTopUpFlagForPlatformForVendor()[vendorId];
            logger.info(`[ZodiacController] autoTopUpFlagForPlatform = ${JSON.stringify(autoTopUpFlagForPlatform)}`);
            const autoTopUpFlag: boolean = autoTopUpFlagForPlatform[platform] || false;
            logger.info(`[ZodiacController] [getUserGameplaySettingsV2] autoTopUpFlag = ${JSON.stringify(autoTopUpFlag)}`);
           
            // remove autoTopUpSetting if flag false or PRACTICE_APP
            if(autoTopUpFlag === false || appType === PRACTICE_APP){
                const {autoTopUpSetting, ...filteredGameplaySettings} = gameplaySettings;
                return ResponseUtil.sendSuccessResponse(res, {gameplaySettings:filteredGameplaySettings});
            }
            return ResponseUtil.sendSuccessResponse(res, {gameplaySettings});
        } catch (error) {
            next(error);
        }
    }

    static async updateUserBetSettings(req, res, next): Promise<any> {
        try {
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const userId: string = req.sessionManager.getLoggedInUserId();
            const reqBody = req.body;
            const request: UpdateUserBetSettingsRequest = reqBody;
            const updateUserBetSettingsPayload: UpdateUserBetSettingsPayload = {
                settings: request.settings,
            };
            logger.info(`[ZodiacController] [updateUserBetSettings] userUniqueId :: ${userUniqueId} :: updateUserBetSettingsPayload :: ${JSON.stringify(updateUserBetSettingsPayload)}`);
            const zodiacGameplaySettings =  await  ZodiacService.updateUserBetSettings(req.internalRestClient, userUniqueId, updateUserBetSettingsPayload);
            const [ariesGameplaySettingsResp, ariesTournamentGameplaySettingsResp] = await await (Promise as any).allSettled([
                AriesService.updateUserBetSettings(req.internalRestClient, userId, updateUserBetSettingsPayload),
                AriesTournamentService.updateUserBetSettingsTournament(req.internalRestClient, userId, updateUserBetSettingsPayload)
            ]);
            // const gameplaySettings: UserBetSettings = await ZodiacService.updateUserBetSettings(req.internalRestClient, userUniqueId, updateUserBetSettingsPayload);
            logger.info(`[ZodiacController] [updateUserBetSettings] gameplaySettings :: ${JSON.stringify(zodiacGameplaySettings)} ariesGameplaySettings :: ${JSON.stringify(ariesGameplaySettingsResp?.value)}, ariesGameplayTournamentSettings :: ${JSON.stringify(ariesTournamentGameplaySettingsResp?.value)} `);
            const betSettings: IUserBetSettings = ZodiacUtil.getUserBetSettings(zodiacGameplaySettings);
            logger.info(`[ZodiacController] [updateUserBetSettings] betSettings :: ${JSON.stringify(betSettings)}`);
            return ResponseUtil.sendSuccessResponse(res, betSettings);
        } catch (error) {
            next(error);
        }
    }

    static async updateUserGameSettings(req, res, next): Promise<any> {
        try {
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const userId: string = req.sessionManager.getLoggedInUserId();
            const reqBody = req.body;
            const request: UpdateUserGameSettingsRequest = reqBody;
            const updateUserGameSettingsPayload: UpdateUserGameSettingsPayload = {
                settings: request.settings,
            };
            logger.info(`[ZodiacController] [updateUserGameSettings] userUniqueId :: ${userUniqueId} :: updateUserGameSettingsPayload :: ${JSON.stringify(updateUserGameSettingsPayload)}`);
            const zodiacGameplaySettings = await  ZodiacService.updateUserGameSettings(req.internalRestClient, userUniqueId, updateUserGameSettingsPayload);
            if(updateUserGameSettingsPayload?.settings.filter((setting) => setting.setting === UserGameSettingType.AUTO_POST_BB).length > 0) {
                const ariesGameplaySettings = await AriesService.updateUserEnablePostBB(req.internalRestClient, userId, updateUserGameSettingsPayload);
                logger.info(`[ZodiacController] [updateUserGameSettings] ariesGameplaySettings :: ${JSON.stringify(ariesGameplaySettings)} `);
            }
            // const gameplaySettings: UserGameSettings = await ZodiacService.updateUserGameSettings(req.internalRestClient, userUniqueId, updateUserGameSettingsPayload);
            logger.info(`[ZodiacController] [updateUserGameSettings] gameplaySettings :: ${JSON.stringify(zodiacGameplaySettings)}`);
            const gameSettings: IUserGameSettings = ZodiacUtil.getUserGameSettings(zodiacGameplaySettings);
            logger.info(`[ZodiacController] [updateUserGameSettings] gameSettings :: ${JSON.stringify(gameSettings)}`);
            return ResponseUtil.sendSuccessResponse(res, gameSettings);
        } catch (error) {
            next(error);
        }
    }

    static async updateUserAutoTopUpSettings(req, res, next): Promise<any> {
        try {
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId();
            const userId: string = req.sessionManager.getLoggedInUserId();
            const reqBody = req.body;
            const vendorId: string = req.vendorId;
            const updateUserAutoTopUpSettingsPayload: UpdateUserAutoTopUpSettingsPayload = reqBody;
            logger.info(`[ZodiacController] [updateUserAutoTopUpSettings] userUniqueId :: ${userUniqueId} :: updateUserAutoTopUpSettingsPayload :: ${JSON.stringify(updateUserAutoTopUpSettingsPayload)}`);
            const autoTopUpSetting : UserAutoTopUpSetting = await  ZodiacService.updateUserAutoTopUpSettings(req.internalRestClient, userUniqueId, updateUserAutoTopUpSettingsPayload);
            EventPushService.push(Number(userId), Number(vendorId),'', EventNames.AUTO_TOP_UP_SETTING_UPDATE, {auto_topup_status: autoTopUpSetting.value })
            logger.info(`[ZodiacController] autoTopUpSetting :: ${JSON.stringify(autoTopUpSetting)} `);
            if(autoTopUpSetting.config?.topUpThresholdPrecentage != null && autoTopUpSetting.config?.topUpStackPercentage != null) {
                const updateUserAutoTopUpSetting: UpdateUserAutoTopUpSetting =  {
                    enableAutoTopUp: autoTopUpSetting.value,
                    topUpThresholdPrecentage: autoTopUpSetting.config.topUpThresholdPrecentage,
                    topUpStackPercentage: autoTopUpSetting.config.topUpStackPercentage
                }
                logger.info(`[ZodiacController] updateUserAutoTopUpSettings :: ${JSON.stringify(updateUserAutoTopUpSetting)} `);
                const ariesAutoTopUpSetting = await AriesService.updateUserAutoTopUpSetting(req.internalRestClient, userId, updateUserAutoTopUpSetting);
                logger.info(`[ZodiacController] [updateUserAutoTopUpSettings] ariesAutoTopUpSetting :: ${JSON.stringify(ariesAutoTopUpSetting)} `);
            }
            return ResponseUtil.sendSuccessResponse(res, autoTopUpSetting);
        } catch (error) {
            next(error);
        }
    }

    static async updateUserSoundSettings(req, res, next): Promise<any> {
        try {
            const userUniqueId: string = req.sessionManager.getLoggedInUserUniqueId(); 
            const reqBody = req.body;
            const request: UpdateUserSoundSettingsRequest = reqBody;
            const updateUserSoundSettingsPayload: UpdateUserSoundSettingsPayload = {
                settings: request.settings,
            };
            logger.info(`[ZodiacController] [updateUserSoundSettings] userUniqueId :: ${userUniqueId} :: updateUserSoundSettingsPayload :: ${JSON.stringify(updateUserSoundSettingsPayload)}`);
            const zodiacGameplaySettings: UserSoundSettings =  await  ZodiacService.updateUserSoundSettings(req.internalRestClient, userUniqueId, updateUserSoundSettingsPayload);
            logger.info(`[ZodiacController] [updateUserSoundSettings] gameplaySettings :: ${JSON.stringify(zodiacGameplaySettings)} `);
            const soundSettings: IUserSoundSettings = ZodiacUtil.getUserSoundSettings(zodiacGameplaySettings);
            logger.info(`[ZodiacController] [updateUserSoundSettings] soundSettings :: ${JSON.stringify(soundSettings)}`);
            return ResponseUtil.sendSuccessResponse(res, soundSettings);
            } catch (error) {
            next(error);
        }
    }
    
}
