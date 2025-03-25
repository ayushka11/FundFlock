export default class ResponseHelper {
  static sendSuccessResponse(
    res: any,
    responseBody: any,
    statusCode: number = 200
  ): void {
    res.status(statusCode).send({
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
