import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AuthRequest, UserPayload } from "../types/auth";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.JWT_SECRET;

const verifyToken = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token;

  if (!token) {
    const data = {
      status: {
        success: false,
        error: "Token not found, access denied",
      },
      data: {},
    }
    res.status(403).json(data);
    return;
  }

  try {
    const decoded = jwt.verify(token, SECRET_KEY) as UserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    const data = {
      status: {
        success: false,
        error: "Invalid token, access denied",
      },
      data: {},
    }
    res.status(403).json(data);
  }
};

export default verifyToken;
