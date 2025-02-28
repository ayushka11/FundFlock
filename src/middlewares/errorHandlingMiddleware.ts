import { Request, Response, NextFunction } from "express";

export default class CustomError extends Error {
  statusCode?: number;
  constructor(message: string, statusCode?: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandlingMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = (err as CustomError).statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    status: {
      success: false,
      error: message,
    },
    data: {},
  });
};

export { errorHandlingMiddleware, CustomError };
