import ServiceError from '../errors/service-error';

export default class ResponseUtil {
	static sendSuccessResponse(res: any, responseBody: any): void {
		res.body = responseBody;
		res.send({
			status: {
				success: true,
			},
			data: responseBody,
		});
	}

	static sendErrorResponse(res: any, error: ServiceError, data: any = {}): void {
		res.responseManager.sendError(error, data);
	}
}
