import {NextFunction} from 'express';
import ResponseUtil from '../utils/response-util';
import ServiceError from '../errors/service-error';
import MonitoringHelper from '../utils/monitoring-helper';
import UnauthorizedError from '../errors/unauthorized-error';
import ServiceErrorUtil from '../errors/service-error-util';
import SupernovaServiceError from '../errors/supernova/supernova-error';
import IDMServiceError from '../errors/idm/idm-error';
import GuardianServiceError from '../errors/guardian/guardian-error';
import ZodiacServiceError from '../errors/zodiac/zodiac-error';
import LoggerUtil, {ILogger} from '../utils/logger';
import PlanetServiceError from "../errors/planet/planet-error";
import GsServiceError from '../errors/gs/gs-error';
import TrexControlCenterError from '../errors/trex/trex-control-center-error';
import AuthServiceError from '../errors/auth/auth-error';
import InvoiceServiceError from '../errors/invoice/invoice-error';
import PayinServiceError from '../errors/payin/payin-error';
import PayoutServiceError from '../errors/payout/payout-error';
import PromosServiceError from '../errors/promos/promos-error';
import ReferralServiceError from '../errors/referral/referral-error';
import RoyaltyServiceError from '../errors/royalty/royalty-error';

const logger: ILogger = LoggerUtil.get("ErrorHandlingMiddleware");

export default function ErrorHandlingMiddleware(
	error: Error,
	request: any,
	res: any,
	// @ts-ignore
	next: NextFunction,
): void {
	MonitoringHelper.publishApiError(error.name || 'unknown');

	logger.error(
		'[ErrorHandlingMiddleware] Error: %s',
		JSON.stringify(error || {}),
	);
	if (error && error.stack) logger.error(error); // Printing Error stack

	if (error instanceof ServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof AuthServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof IDMServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof GuardianServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof GsServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof InvoiceServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof PayinServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof PayoutServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof PlanetServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof PromosServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof ReferralServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof RoyaltyServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof SupernovaServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof ZodiacServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof PayoutServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof RoyaltyServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof PayinServiceError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof TrexControlCenterError) {
		ResponseUtil.sendErrorResponse(res, error);
	} else if (error instanceof UnauthorizedError) {
		ResponseUtil.sendErrorResponse(
			res,
			ServiceErrorUtil.getAuthorizationError(),
		);
	} else {
		ResponseUtil.sendErrorResponse(
			res,
			ServiceErrorUtil.getInternalServerError(),
		);
	}
}
