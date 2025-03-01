import { Request } from "express";

declare module "express" {
  interface Request {
    user?: {
      username: string;
      email: string;
      iat?: number; // Issued at timestamp
      exp?: number; // Expiry timestamp
    };
  }
}
