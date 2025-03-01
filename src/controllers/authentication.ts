import express, { RequestHandler } from "express";
import { random, authentication } from "../helpers";
import AuthService from "../services/authService";
import jsonWebToken from "jsonwebtoken";
import ResponseHelper from "../helpers/responseHelper";
export default class AuthController {
  static async login(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const { email, password } = req.body;

      const data = await AuthService.login(email, password);

      const token = jsonWebToken.sign(
        {
          username: data.username,
          email: data.email,
          user_id: data._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("token", token, {
        domain: "localhost",
        path: "/",
      });

      ResponseHelper.sendSuccessResponse(res, data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async register(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      const { username, email, password } = req.body;

      const data = await AuthService.register(username, email, password);

      const token = jsonWebToken.sign(
        {
          username: data.username,
          email: data.email,
          user_id: data._id,
        },
        process.env.JWT_SECRET,
        {
          expiresIn: "1d",
        }
      );

      res.cookie("token", token, {
        domain: "localhost",
        path: "/",
      });

      ResponseHelper.sendSuccessResponse(res, data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async logout(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      res.clearCookie("token", {
        domain: "localhost",
        path: "/",
      });
      ResponseHelper.sendSuccessResponse(res, {});
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
