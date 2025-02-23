import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";

export interface UserPayload extends JwtPayload {
  username: string;
  email: string;
}

export interface AuthRequest extends Request {
  user?: UserPayload;
}
