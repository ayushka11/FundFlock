import GuardianServiceError from "../errors/guardian/guardian-error";
import GuardianServiceErrorUtil from "../errors/guardian/guardian-error-util";
import QueryParam from "../models/query-param";
import LoggerUtil, {ILogger} from '../utils/logger';
import {GuardianClientLatencyDecorator} from "../utils/monitoring/client-latency-decorator";
import RequestUtil from "../helpers/request-util";
import {getGuardianServiceBaseUrl} from "../services/configService";
import BaseClient from "./baseClient";
import {GuardianCreateTaskRequestPayload, GuardianDigilockerTaskRequestPayload} from "../models/guardian/request";
import {createGuardianDigilockerAadharTaskPayload, createGuardianTaskPayload} from "../utils/guardian-util";
import UserKycFilter from "../models/user-kyc-filter";

const logger: ILogger = LoggerUtil.get("GuardianClient");
const configService = require('../services/configService');

export default class GuardianClient {
    static GUARDIAN_ERROR_CODES = {
        STATE_NOT_ALLLOWED_FOR_AADHAR: 6522,
        TASK_ID_DOESNOT_EXIST: 4005,
        BANK_ALREADY_VERIFIED: 4502,
        BANK_VERIFICATION_FAILED: 3999,
        UPI_VERIFICATION_FAILED: 3998,
        MAX_ALLOWED_KYC_LIMIT_EXCEEDED: 6524,
        EMPTY_FILE_UPLOADED_ERROR: 4402

    }
    private static urls = {
        createTask: '/v1/tasks',
        initiateDigilockerVerfication: '/v1/documents/verify/initiate',
        createUserConsent: '/v1/documents/consent',
        extractDocument: '/v1/documents/extract',
        verifyDocumentSync: '/v1/documents/sync/verify',
        verifyDocumentSyncV2: '/v2/documents/sync/verify',
        getKyc: '/v1/documents/filter',
        getIfscDetails: '/v1/bankInfo/ifsc/##IFSC##'
    }

    @GuardianClientLatencyDecorator
    static async getUserKycDetails(userId: string, userKycFilter: UserKycFilter, restClient: any, vendorId: string): Promise<any> {
        try {
            logger.info(`[GuardianClient] [getUserKycDetails] userId :: ${userId} user kyc filter :: ${JSON.stringify(userKycFilter)}`);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "userId", value: userId});
            if (userKycFilter.documentType) {
                queryParams.push({param: "documentType", value: userKycFilter.documentType});
            }
            if (userKycFilter.documentStatus) {
                queryParams.push({param: "documentStatus", value: userKycFilter.documentStatus});
            }
            if (userKycFilter.sortBy) {
                queryParams.push({param: "sortBy", value: userKycFilter.sortBy});
            }
            const url: string = GuardianClient.getCompleteUrl(GuardianClient.urls.getKyc, queryParams);
            const headers: any = GuardianClient.getGuardianServiceHeaders(restClient.getRequestId(), vendorId);
            logger.info(`[GuardianClient] [getUserKycDetails] url :: ${url} with headers :: ${JSON.stringify(headers)}`);
            const guardianGetKycResponse: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[GuardianClient] [getUserKycDetails] response :: ${JSON.stringify(guardianGetKycResponse || {})}`);
            return guardianGetKycResponse.data;
        } catch (error) {
            logger.error(error,`[GuardianClient] [getUserKycDetails]:: `)
            throw GuardianClient.getError(error);
        }
    }

    @GuardianClientLatencyDecorator
    static async createTask(userId: string, documentType: number, documentMethod: string, restClient: any, vendorId: string): Promise<any> {
        try {
            logger.info(`[GuardianClient] [createTask] userId :: ${userId} document type :: ${documentType} with document method :: ${documentMethod}`);
            const queryParams: QueryParam[] = [];
            const guardianTaskRequestPayload: GuardianCreateTaskRequestPayload = createGuardianTaskPayload(userId, documentType);
            logger.info(`[GuardianClient] [createTask] guardianTaskRequestPayload :: ${JSON.stringify(guardianTaskRequestPayload)}`)
            const url: string = GuardianClient.getCompleteUrl(GuardianClient.urls.createTask, queryParams);
            logger.info(`[GuardianClient] [createTask] url :: ${url}`);
            const headers: any = GuardianClient.getGuardianServiceHeaders(restClient.getRequestId(), vendorId);
            const guardianTaskResponse: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, guardianTaskRequestPayload, headers);
            logger.info(`[GuardianClient] [createTask] response :: ${JSON.stringify(guardianTaskResponse || {})}`);
            return guardianTaskResponse.data.task;
        } catch (error) {
            throw GuardianClient.getError(error);
        }
    }

    @GuardianClientLatencyDecorator
    static async createUserConsent(taskId: string, userConsent: boolean, restClient, vendorId: string) {
        try {
            logger.info(`[GuardianClient] [createUserConsent] taskId :: ${taskId} userConsent:: ${userConsent}`);
            const queryParams: QueryParam[] = [];
            const initiateVerification: boolean = userConsent;
            const guardianTaskRequestPayload: any = {initiateVerification};
            logger.info(`[GuardianClient] [createUserConsent] guardianTaskRequestPayload :: ${JSON.stringify(guardianTaskRequestPayload)}`)
            const url: string = GuardianClient.getCompleteUrl(GuardianClient.urls.createUserConsent, queryParams);
            logger.info(`[GuardianClient] [createUserConsent] url :: ${url}`);
            const headers: any = GuardianClient.getGuardianServiceHeaders(restClient.getRequestId(), vendorId);
            const guardianTaskResponse: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, guardianTaskRequestPayload, headers);
            logger.info(`[GuardianClient] [createUserConsent] response :: ${JSON.stringify(guardianTaskResponse || {})}`);
            return guardianTaskResponse.data;
        } catch (error) {
            throw GuardianClient.getError(error);
        }
    }

    @GuardianClientLatencyDecorator
    static async getDigilockerVerficationLink(taskId: string, userState: string, retryAttempts: string, restClient: any, vendorId: string) {
        try {
            logger.info(`[GuardianClient] [getDigilockerVerficationLink] taskId :: ${taskId} user state :: ${userState}`);
            const queryParams: QueryParam[] = [];
            // if(retryAttempts){
            //     queryParams.push({param: "retry", value: retryAttempts});
            // }
            const guardianDigilockerTaskRequestPayload: GuardianDigilockerTaskRequestPayload = createGuardianDigilockerAadharTaskPayload(taskId, userState);
            logger.info(`[GuardianClient] [getDigilockerVerficationLink] guardianDigilockerTaskRequestPayload :: ${JSON.stringify(guardianDigilockerTaskRequestPayload)}`)
            const url: string = GuardianClient.getCompleteUrl(GuardianClient.urls.initiateDigilockerVerfication, queryParams);
            logger.info(`[GuardianClient] [getDigilockerVerficationLink] url :: ${url}`);
            const headers: any = GuardianClient.getGuardianServiceHeaders(restClient.getRequestId(), vendorId);
            const guardianTaskResponse: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, guardianDigilockerTaskRequestPayload, headers);
            logger.info(`[GuardianClient] [getDigilockerVerficationLink] response :: ${JSON.stringify(guardianTaskResponse || {})}`);
            return guardianTaskResponse.data;
        } catch (error) {
            throw GuardianClient.getError(error);
        }
    }

    @GuardianClientLatencyDecorator
    static async extractUserKycDetails(taskId: string, restClient: any, vendorId: string) {
        try {
            logger.info(`[GuardianClient] [extractUserKycDetails] userTaskId :: ${taskId}`);
            const queryParams: QueryParam[] = [];
            logger.info(`[GuardianClient] [extractUserKycDetails] guardianTaskRequestPayload :: ${JSON.stringify({taskId})}`)
            const url: string = GuardianClient.getCompleteUrl(GuardianClient.urls.extractDocument, queryParams);
            logger.info(`[GuardianClient] [extractUserKycDetails] url :: ${url}`);
            const headers: any = GuardianClient.getGuardianServiceHeaders(restClient.getRequestId(), vendorId);
            const guardianTaskResponse: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, {taskId}, headers);
            logger.info(`[GuardianClient] [extractUserKycDetails] response :: ${JSON.stringify(guardianTaskResponse || {})}`);
            return guardianTaskResponse.data;
        } catch (error) {
            throw GuardianClient.getError(error);
        }
    }

    @GuardianClientLatencyDecorator
    static async verifyDocumentSync(taskId: string, documentDetails: any, restClient: any, vendorId: string) {
        try {
            logger.info(`[GuardianClient] [verifyDocumentSync] userTaskId :: ${taskId}`);
            const queryParams: QueryParam[] = [];
            logger.info(`[GuardianClient] [verifyDocumentSync] guardianTaskRequestPayload :: ${JSON.stringify(documentDetails)}`)
            const documentVerficiationPayload: any = {taskId, documentDetails};
            const url: string = GuardianClient.getCompleteUrl(GuardianClient.urls.verifyDocumentSync, queryParams);
            logger.info(`[GuardianClient] [verifyDocumentSync] url :: ${url}`);
            const headers: any = GuardianClient.getGuardianServiceHeaders(restClient.getRequestId(), vendorId);
            const guardianTaskResponse: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, documentVerficiationPayload, headers);
            logger.info(`[GuardianClient] [verifyDocumentSync] response :: ${JSON.stringify(guardianTaskResponse || {})}`);
            return guardianTaskResponse.data;
        } catch (error) {
            throw GuardianClient.getError(error);
        }
    }

    @GuardianClientLatencyDecorator
    static async verifyDocumentSyncV2(taskId: string, documentDetails: any, restClient: any, vendorId: string) {
        try {
            logger.info(`[GuardianClient] [verifyDocumentSyncV2] userTaskId :: ${taskId}`);
            const queryParams: QueryParam[] = [];
            logger.info(`[GuardianClient] [verifyDocumentSyncV2] guardianTaskRequestPayload :: ${JSON.stringify(documentDetails)}`)
            const documentVerficiationPayload: any = {taskId, documentDetails};
            const url: string = GuardianClient.getCompleteUrl(GuardianClient.urls.verifyDocumentSyncV2, queryParams);
            logger.info(`[GuardianClient] [verifyDocumentSyncV2] url :: ${url}`);
            const headers: any = GuardianClient.getGuardianServiceHeaders(restClient.getRequestId(), vendorId);
            const guardianTaskResponse: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, documentVerficiationPayload, headers);
            logger.info(`[GuardianClient] [verifyDocumentSyncV2] response :: ${JSON.stringify(guardianTaskResponse || {})}`);
            return guardianTaskResponse.data;
        } catch (error) {
            throw GuardianClient.getError(error);
        }
    }

    @GuardianClientLatencyDecorator
    static async getIfscDetails(ifsc: string, restClient: any, vendorId: string) {
        try {
            logger.info(`[GuardianClient] [getIfscDetails] ifsc :: ${ifsc}`);
            const url: string = GuardianClient.getCompletUrlWithoutSlash(GuardianClient.urls.getIfscDetails.replace('##IFSC##', ifsc));
            logger.info(`[GuardianClient] [getIfscDetails] url :: ${url}`);
            const headers: any = GuardianClient.getGuardianServiceHeaders(restClient.getRequestId(), vendorId);
            const guardianTaskResponse: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(`[GuardianClient] [getIfscDetails] response :: ${JSON.stringify(guardianTaskResponse || {})}`);
            return guardianTaskResponse.data;
        } catch (error) {
            throw GuardianClient.getError(error);
        }
    }

    static wrapError(error: any) {
        if (error && !(error instanceof GuardianServiceError)) {
            return GuardianServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    static getErrorFromCode(errorCode: number,errorMessage?: string) {
        return GuardianClient.getError({errorCode,errorMessage});
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(getGuardianServiceBaseUrl(), relativeUrl, queryParams);
    }

    // Created This Because the RequestUtil.getCompleteRequestURL Add Forward Slash at the end of Request.
    private static getCompletUrlWithoutSlash(relativeUrl: string, queryParams?: QueryParam[]) {
        return `${getGuardianServiceBaseUrl()}${relativeUrl}`
    }

    private static getGuardianServiceHeaders(requestId: string, vendorId: string) {
        const headers: any = {
            'X-Access-Id': configService.getGuardianServiceAccessKeyForVendor()[vendorId],
            "X-Request-Id": requestId
        };
        return headers;
    }

    private static getError(error: any) {
        logger.error('[GuardianClient] Error: %s', JSON.stringify(error || {}));
        switch (error.errorCode) {
            case 3998:
                return GuardianServiceErrorUtil.getUpiVerificationFailedError(error.errorMessage);
            case 3999:
                return GuardianServiceErrorUtil.getBankVerificationFailedError(error.errorMessage);
            case 4000:
                return GuardianServiceErrorUtil.getInternalServerError();
            case 4001:
                return GuardianServiceErrorUtil.getSecurityHeadersNotProvided();
            case 4002:
                return GuardianServiceErrorUtil.getInvalidAccessId();
            case 4003:
                return GuardianServiceErrorUtil.getUpstreamErrorStr();
            case 4004:
                return GuardianServiceErrorUtil.getInvalidRequest();
            case 4005:
                return GuardianServiceErrorUtil.getInvalidTask();
            case 4006:
                return GuardianServiceErrorUtil.getInvalidJson();
            case 4007:
                return GuardianServiceErrorUtil.getPartnerInvalidResponse();
            case 4008:
                return GuardianServiceErrorUtil.getInvalidDocumentField();
            case 4009:
                return GuardianServiceErrorUtil.getInvalidDocumentStatus();
            case 4010:
                return GuardianServiceErrorUtil.getIdfyInsufficientBalance();
            case 4011:
                return GuardianServiceErrorUtil.getCashfreeInsufficientBalance();
            case 4012:
                return GuardianServiceErrorUtil.getPartnerServiceUnknownError();
            case 4013:
                return GuardianServiceErrorUtil.getDocumentNotUploaded();
            case 4014:
                return GuardianServiceErrorUtil.getPartnerClientError();
            case 4015:
                return GuardianServiceErrorUtil.getRequestIdNotProvided();
            // add 4017
            case 4301:
                return GuardianServiceErrorUtil.getFileNotSupported();
            case 4302:
                return GuardianServiceErrorUtil.getFileSizeExceeded();
            case 4303:
                return GuardianServiceErrorUtil.getUploadToS3Failed();
            case 4304:
                return GuardianServiceErrorUtil.getDocumentAlreadyUploaded();
            case 4402:
                return GuardianServiceErrorUtil.getInvalidImageUrl();
            case 4403:
                return GuardianServiceErrorUtil.getInvalidImage();
            case 4404:
                return GuardianServiceErrorUtil.getImageNotAccessible();
            case 4406:
                return GuardianServiceErrorUtil.getImageNotPan();
            case 4407:
                return GuardianServiceErrorUtil.getMinorDobPan();
            case 4408:
                return GuardianServiceErrorUtil.getPanTypeNotIndividual();
            case 4409:
                return GuardianServiceErrorUtil.getExtractionResponseInvalid();
            case 4410:
                return GuardianServiceErrorUtil.getDocumentNotOriginal();
            case 4415:
                return GuardianServiceErrorUtil.faceNotDetected();
            case 4416:
            return GuardianServiceErrorUtil.providedScannedCopy();
            case 4501:
                return GuardianServiceErrorUtil.getInvalidDocumentKycLevel();
            case 4502:
                return GuardianServiceErrorUtil.getPrerequisiteDocumentNotVerified();
            case 4503:
                return GuardianServiceErrorUtil.getDocumentKycAlreadyDone();
            case 4504:
                return GuardianServiceErrorUtil.getSameDetailsVerifiedAlreadyVerified();
            case 4505:
                return GuardianServiceErrorUtil.getSameDetailsAlreadyVerifiedForUser();
            case 4506:
                return GuardianServiceErrorUtil.getPanIdNotFoundOnSource();
            case 4507:
                return GuardianServiceErrorUtil.getSourceBankError();
            case 4508:
                return GuardianServiceErrorUtil.getInvalidBankAccount();
            case 4509:
                return GuardianServiceErrorUtil.getInvalidIfsc();
            case 4510:
                return GuardianServiceErrorUtil.getAccountBlocked();
            case 4511:
                return GuardianServiceErrorUtil.getAccountClosed();
            case 4512:
                return GuardianServiceErrorUtil.getInvalidPartnerIfscResponse();
            case 4513:
                return GuardianServiceErrorUtil.getInvalidPartnerBankVerifyResponse();
            case 4514:
                return GuardianServiceErrorUtil.getBankNotSupported();
            case 4515:
                return GuardianServiceErrorUtil.getDigitalBankWithoutConsent();
            case 4516:
                return GuardianServiceErrorUtil.getIfscFromBannedState();
            case 4517:
                return GuardianServiceErrorUtil.getIfscNotProvided();
            case 4517:
                return GuardianServiceErrorUtil.getInvalidUpi();
            case 4518:
                return GuardianServiceErrorUtil.getUpiNotSupported();
            case 4519:
                return GuardianServiceErrorUtil.getUpiWithoutConsent();
            case 4520:
                return GuardianServiceErrorUtil.getVerificationAlreadyStarted();
            case 4601:
                return GuardianServiceErrorUtil.getInvalidTransition();
            case 4700:
                return GuardianServiceErrorUtil.getWebhookUnknownError();
            case 6522:
                return GuardianServiceErrorUtil.getStateNotAllowedForAadharError();
            case 6523:
                return GuardianServiceErrorUtil.getMaxAllowedKycLimitExceededError();
            case 6524:
                return GuardianServiceErrorUtil.getMaxAllowedKycLimitExceededError();
            default:
                return GuardianServiceErrorUtil.getError(error);
        }
    }
};
