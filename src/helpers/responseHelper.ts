export default class ResponseHelper {
	static sendSuccessResponse(res: any, responseBody: any): void {
		res.body = responseBody;
		res.send({
			status: {
				success: true,
			},
			data: responseBody,
		});
	}

    static sendErrorResponse(res: any, error: any, statusCode: number): void {
        res.status(statusCode).send({
            status: {
                success: false,
                error: error,
            },
        });
    }
}