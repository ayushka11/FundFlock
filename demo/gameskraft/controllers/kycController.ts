import {APP_KYC} from "../constants/kyc";
import GuardianService from "../services/guardianService";
import LoggerUtil, {ILogger} from "../utils/logger";
import RequestUtil from "../utils/request-util";
import {
    GUARDIAN_DOCUMENT_STATUS,
    GUARDIAN_REQUEST_PARAM,
    GUARDIAN_SORT_DATA_CONFIG
} from "../constants/guardian-constants";
import UserKycFilter from "../models/user-kyc-filter";
import ResponseUtil from "../utils/response-util";
import VendorUtil from "../utils/vendor-utils";

const restHelper = require("../helpers/restHelper");

const logger: ILogger = LoggerUtil.get("KycController");
export default class KycController {
    static getKycConstants(req, res, next): void {
        logger.info(`[KycController] [getKycConstants]`);
        try {
            ResponseUtil.sendSuccessResponse(res, APP_KYC);
        } catch (e) {
            next(e);
        }
    };

    static async getUserKycIfscDetails(req, res, next): Promise<any> {
        logger.info(`[KycController] [getUserKycIfscDetails]`);
        try {
            const {params, query} = req;
            const {body} = req;
            const vendorId: string = req.vendorId;
            const ifscCode: string = query?.bankIfsc ?? '';
            const ifscCodeDetails: any = await GuardianService.getIfscDetails(ifscCode, req.internalRestClient, vendorId);
            ResponseUtil.sendSuccessResponse(res, ifscCodeDetails);
        } catch (e) {
            next(e);
        }
    };

    static async getUserKycConfig(req, res, next): Promise<any> {
        try {
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const userKycConfig: any = await GuardianService.getUserKycConfig(userId, req.internalRestClient, vendorId);
            ResponseUtil.sendSuccessResponse(res, userKycConfig);
        } catch (e) {
            next(e);
        }
    }


    static async getDigilockerStateConfig(req, res, next): Promise<any> {
        logger.info(`[KycController] [getDigilockerStateConfig]`);
        try {
            const vendorId: string = req.vendorId;
            const digilockerStateConfig = await GuardianService.getDigilockerStateConfig(vendorId);
            logger.info(`[KycController] [getDigilockerStateConfig] received DigilockerStateConfig :: ${JSON.stringify(digilockerStateConfig)}`);
            ResponseUtil.sendSuccessResponse(res, digilockerStateConfig);
        } catch (e) {
            next(e);
        }
    };

    static async initiateDigilockerKyc(req, res, next): Promise<any> {
        /*
            1. get the user id of the user
            2. check if the body contains a state
                2.1 if yes go forward
                2.2 else send the error her only
            3. send the user id,internal rest client and state to guardian service
            4. inside the guardian service
                4.1 check if the state is from the given list of states
                    4.1.1 if yes continue
                    4.1.2 else send the error
                4.2 create a task id for the given user using guardian client
                4.3 insert this task id into the redis using redis service
                4.4 use this task id and send a post request to /document of guardian client
                4.5 get the link and other required data
                4.6 send it back to user
        */
        try {
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const {params, query} = req;
            const {body} = req;
            const userState: string = body.userState ?? "Unknown";
            const userConsent: boolean = body?.userConsent ?? true;
            const retryAttempts: string = RequestUtil.parseQueryParamAsString(query, GUARDIAN_REQUEST_PARAM.RETRY_ATTEMPT_PARAM);
            const digilockerActionLink: any = await GuardianService.initiateDigilockerKyc(userId, userState, userConsent, retryAttempts, req.internalRestClient, vendorId);
            ResponseUtil.sendSuccessResponse(res, digilockerActionLink);
        } catch (e) {
            next(e);
        }
    }

    static async extractKycDocumentDetails(req, res, next) {
        try {
            const {params, query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const docType: number = RequestUtil.parseQueryParamAsNumber(query, GUARDIAN_REQUEST_PARAM.DOCUMENT_TYPE);
            const userKycextractedDetails: any = await GuardianService.extractUserKycDetails(userId, docType, req.internalRestClient, vendorId);
            ResponseUtil.sendSuccessResponse(res, userKycextractedDetails);
        } catch (e) {
            next(e);
        }

    }

    static async verifyKycDocuments(req, res, next) {
        try {
            // params have taskId --> to be taken from redis service via guardian service
            // document details --> send thru the params
            // documentType --> comes from query params of the url
            const {params, query} = req;
            const {body} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const userDocumentDetails: any = body.documentDetails ?? {};
            const docType: number = RequestUtil.parseQueryParamAsNumber(query, GUARDIAN_REQUEST_PARAM.DOCUMENT_TYPE);
            let uploadedFile: string = req.sessionManager.getUploadedFile(docType);
            // add kyc data validation checks here if required?
            await GuardianService.verifyUserKycDetails(userId, userDocumentDetails, docType, uploadedFile, req.internalRestClient, vendorId);
            ResponseUtil.sendSuccessResponse(res, {});
        } catch (e) {
            next(e);
        }
    }

    static async verifyKycBankDocuments(req, res, next) {
        try {
            // params have taskId --> to be taken from redis service via guardian service
            // document details --> send thru the params
            // documentType --> comes from query params of the url
            const {body} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const bankKycVerificationResponse : any = await GuardianService.verifyKycBankDocuments(userId, body, req.internalRestClient, vendorId);
            ResponseUtil.sendSuccessResponse(res, bankKycVerificationResponse);
        } catch (e) {
            next(e);
        }
    }

    static async verifyKycUpiDocuments(req, res, next) {
        try {
            // params have taskId --> to be taken from redis service via guardian service
            // document details --> send thru the params
            // documentType --> comes from query params of the url
            const {body} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const upiKycVerificationResponse = await GuardianService.verifyKycUpiDocuments(userId, body, req.internalRestClient, vendorId);
            ResponseUtil.sendSuccessResponse(res, upiKycVerificationResponse);
        } catch (e) {
            next(e);
        }
    }

    static async processKycWebhook(req, res, next) {// make 2 functions for this
        try {
            logger.info(`[KycController] [processTenetKycWebhookResponse]`);
            const {query, param} = req;
            const {body} = req;
            const vendorId: string = query.vendorId;
            logger.info(`[KycController] [processTenetKycWebhookResponse]  successResponse :: ${JSON.stringify(body)}`);
            await GuardianService.processTenetKycWebhookResponse(body, req.internalRestClient, vendorId);
            ResponseUtil.sendSuccessResponse(res, {});
        } catch (e) {
            next(e);
        }

    }
    
    
    
    static async processKycWebhookForVendor(req, res, next) {
        try {
            logger.info(`[KycController] [processKycWebhookForVendor]`);
            const {query, params} = req;
            const vendor: string = RequestUtil.parseQueryParamAsString(params, GUARDIAN_REQUEST_PARAM.VENDOR);
            logger.info(`[KycController] [processKycWebhookForVendor] vendor :: ${vendor}`);
            const vendorId: number = VendorUtil.getVendorIdFromName(vendor);
            logger.info('tracking webhook request for vendor id :: ',vendorId);
            const {body} = req;
            logger.info(`[KycController] [processTenetKycWebhookResponse]  successResponse :: ${JSON.stringify(body)}`);
            await GuardianService.processTenetKycWebhookResponse(body, req.internalRestClient, `${vendorId}`);
            ResponseUtil.sendSuccessResponse(res, {});
        } catch (e) {
            next(e);
        }
    }


    static async getUserKycDetails(req, res, next) {
        try {
            /*
                get kyc based on
                    1. doc type pan aadhar etc --> nothing implies send everything, array of strings
                    2. method  = lite or full kyc details
            */
            const {params, query} = req;
            const userId: string = req.sessionManager.getLoggedInUserId();
            const vendorId: string = req.vendorId;
            const docType: number[] = RequestUtil.parseQueryParamAsNumberArray(query, GUARDIAN_REQUEST_PARAM.DOCUMENT_TYPE);
            const userKycDataMethod: string = RequestUtil.parseQueryParamAsString(query, GUARDIAN_REQUEST_PARAM.USER_KYC_DATA);
            let documentStatus: number[] = RequestUtil.parseQueryParamAsNumberArray(query, GUARDIAN_REQUEST_PARAM.DOCUMENT_STATUS);
            let userKycFilter: UserKycFilter = {userKycDataMethod};
            if (docType.length) {
                userKycFilter.documentType = docType
            }
            if (!documentStatus.length) {
                userKycFilter.documentStatus = [
                    GUARDIAN_DOCUMENT_STATUS.VERIFIED,
                    GUARDIAN_DOCUMENT_STATUS.MANUAL_REVIEW,
                    GUARDIAN_DOCUMENT_STATUS.REJECTED,
                    GUARDIAN_DOCUMENT_STATUS.SUBMITTED
                ];
            }
            userKycFilter.sortBy = GUARDIAN_SORT_DATA_CONFIG.DESC;
            const getSelectedDocumentInformation: boolean = true;
            logger.info(`inside [kycController] [getUserKycDetails] received userKycFilter as ${JSON.stringify(userKycFilter)}`);
            const kycDetails: any = await GuardianService.getUserKycDetails(userId, userKycFilter, req.internalRestClient, vendorId, getSelectedDocumentInformation);
            ResponseUtil.sendSuccessResponse(res, kycDetails);

        } catch (e) {
            next(e);
        }
    }
}
