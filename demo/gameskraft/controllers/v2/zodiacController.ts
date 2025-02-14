import ZodiacService from '../../services/v2/zodiacService';
import LoggerUtil, { ILogger } from '../../utils/logger';
import RequestUtil from "../../helpers/request-util";
import { ZODIAC_REQUEST_PARAM } from '../../constants/zodiac-constants';
import ResponseUtil from '../../utils/response-util';

const logger: ILogger = LoggerUtil.get("ZodiacControllerV2");

export default class ZodiacController {

    static async getUserHandsListByTableId(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const tableId: number = RequestUtil.parseQueryParamAsNumber(params, ZODIAC_REQUEST_PARAM.TABLE_ID);
            logger.info(`[ZodiacController] [getUserHandsListByTableId] Request params :: ${JSON.stringify(params)} userId :: ${userId} tableId :: ${tableId}`);
            const response = await ZodiacService.getUserHandsListByTableId(req.internalRestClient, userId, tableId);
            logger.info(`[ZodiacController] [getUserHandsListByTableId] params :: ${JSON.stringify(params)} userId :: ${userId} tableId :: ${tableId} Response :: ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    }

    static async getUserHandDetailsByHandId(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const tableId: number = RequestUtil.parseQueryParamAsNumber(params, ZODIAC_REQUEST_PARAM.TABLE_ID);
            const handId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.HAND_ID);
            logger.info(`[ZodiacController] [getUserHandDetailsByHandId] Request params :: ${JSON.stringify(params)} userId :: ${userId} tableId :: ${tableId} handId :: ${handId}`);
            const response = await ZodiacService.getUserHandDetailsByHandId(req.internalRestClient, userId, handId, tableId);
            logger.info(`[ZodiacController] [getUserHandDetailsByHandId] Response :: params :: ${JSON.stringify(params)} userId :: ${userId} tableId :: ${tableId} handId :: ${handId} Response :: ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    }

    static async getUserHandSummaryByHandId(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const tableId: number = RequestUtil.parseQueryParamAsNumber(params, ZODIAC_REQUEST_PARAM.TABLE_ID);
            const handId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.HAND_ID);
            const vendorId = req.vendorId;
            logger.info(`[ZodiacController] [getUserHandSummaryByHandId] Request params :: ${JSON.stringify(params)} userId :: ${userId} tableId :: ${tableId} handId :: ${handId} vendorId :: ${vendorId}`);
            const response = await ZodiacService.getUserHandSummaryByHandId(req.internalRestClient, userId, handId, tableId, vendorId);
            logger.info(`[ZodiacController] [getUserHandSummaryByHandId] Response :: params :: ${JSON.stringify(params)} userId :: ${userId} tableId :: ${tableId} handId :: ${handId} vendorId :: ${vendorId} Response :: ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    }

    static async getUserPracticeHandsListByTableId(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const tableId: number = RequestUtil.parseQueryParamAsNumber(params, ZODIAC_REQUEST_PARAM.TABLE_ID);
            logger.info(`[ZodiacController] [getUserPracticeHandsListByTableId] Request params :: ${JSON.stringify(params)} userId :: ${userId} tableId :: ${tableId}`);
            const response = await ZodiacService.getUserPracticeHandsListByTableId(req.internalRestClient, userId, tableId);
            logger.info(`[ZodiacController] [getUserPracticeHandsListByTableId] Response :: params :: ${JSON.stringify(params)} userId :: ${userId} tableId :: ${tableId} Response :: ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    }

    static async getUserPracticeHandDetailsByHandId(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const tableId: number = RequestUtil.parseQueryParamAsNumber(params, ZODIAC_REQUEST_PARAM.TABLE_ID);
            const handId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.HAND_ID);
            logger.info(`[ZodiacController] [getUserPracticeHandDetailsByHandId] Request params :: ${JSON.stringify(params)} userId :: ${userId} tableId :: ${tableId} handId :: ${handId}`);
            const response = await ZodiacService.getUserPracticeHandDetailsByHandId(req.internalRestClient, userId, handId, tableId);
            logger.info(`[ZodiacController] [getUserPracticeHandDetailsByHandId] Response :: params :: ${JSON.stringify(params)} userId :: ${userId} tableId :: ${tableId} handId :: ${handId} Response :: ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    }

    static async getUserPracticeHandSummaryByHandId(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const tableId: number = RequestUtil.parseQueryParamAsNumber(params, ZODIAC_REQUEST_PARAM.TABLE_ID);
            const handId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.HAND_ID);
            const vendorId = req.vendorId;
            logger.info(`[ZodiacController] [getUserPracticeHandSummaryByHandId] Request params :: ${JSON.stringify(params)} userId :: ${userId} tableId :: ${tableId} handId :: ${handId} vendorId :: ${vendorId}`);
            const response = await ZodiacService.getUserPracticeHandSummaryByHandId(req.internalRestClient, userId, handId, tableId, vendorId);
            logger.info(`[ZodiacController] [getUserPracticeHandSummaryByHandId] Response :: params :: ${JSON.stringify(params)} userId :: ${userId} tableId :: ${tableId} handId :: ${handId} Response :: ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    }

    static async getUserTournamentHandsListByTournamentId(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const tournamentId: number = RequestUtil.parseQueryParamAsNumber(params, ZODIAC_REQUEST_PARAM.TOURNAMENT_ID);
            logger.info(`[ZodiacController] [getUserTournamentHandsListByTournamentId] Request params :: ${JSON.stringify(params)} userId :: ${userId} tournamentId :: ${tournamentId}`);
            const response = await ZodiacService.getUserTournamentHandsListByTournamentId(req.internalRestClient, userId, tournamentId);
            logger.info(`[ZodiacController] [getUserTournamentHandsListByTournamentId] Response :: params :: ${JSON.stringify(params)} userId :: ${userId} tournamentId :: ${tournamentId} Response :: ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    }

    static async getUserTournamentHandDetailsByHandId(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const tournamentId: number = RequestUtil.parseQueryParamAsNumber(params, ZODIAC_REQUEST_PARAM.TOURNAMENT_ID);
            const handId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.HAND_ID);
            logger.info(`[ZodiacController] [getUserTournamentHandDetailsByHandId] Request params :: ${JSON.stringify(params)} userId :: ${userId} tournamentId :: ${tournamentId} handId :: ${handId}`);
            const response = await ZodiacService.getUserTournamentHandDetailsByHandId(req.internalRestClient, userId, handId, tournamentId);
            logger.info(`[ZodiacController] [getUserTournamentHandDetailsByHandId] Response :: params :: ${JSON.stringify(params)} userId :: ${userId} tournamentId :: ${tournamentId} handId :: ${handId} Response :: ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    }

    static async getUserTournamentHandSummaryByHandId(req, res, next): Promise<any> {
        try {
            const {params} = req;
            const userId: number = req.sessionManager.getLoggedInUserId();
            const tournamentId: number = RequestUtil.parseQueryParamAsNumber(params, ZODIAC_REQUEST_PARAM.TOURNAMENT_ID);
            const handId: string = RequestUtil.parseQueryParamAsString(params, ZODIAC_REQUEST_PARAM.HAND_ID);
            const vendorId = req.vendorId;
            logger.info(`[ZodiacController] [getUserTournamentHandSummaryByHandId] Request params :: ${JSON.stringify(params)} userId :: ${userId} tournamentId :: ${tournamentId} handId :: ${handId} vendorId :: ${vendorId}`);
            const response = await ZodiacService.getUserTournamentHandSummaryByHandId(req.internalRestClient, userId, handId, tournamentId, vendorId);
            logger.info(`[ZodiacController] [getUserTournamentHandSummaryByHandId] Response :: params :: ${JSON.stringify(params)} userId :: ${userId} tournamentId :: ${tournamentId} handId :: ${handId} vendorId :: ${vendorId} Response :: ${JSON.stringify(response)}`);
            ResponseUtil.sendSuccessResponse(res, response);
        } catch (e) {
            next(e);
        }
    }

};