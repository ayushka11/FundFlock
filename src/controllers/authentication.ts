import express, { RequestHandler } from "express";
import { random, authentication } from "../helpers";
import AuthService from "../services/authService";
import jsonWebToken from "jsonwebtoken";
export default class AuthController {
  static async login(req: express.Request, res: express.Response) {
    try {
      const { email, password } = req.body;

      const data = await AuthService.login(email, password);

      if (!data.status.success) {
        res.status(401).json(data);
        return;
      }

      const user = data.data;

      const token = jsonWebToken.sign(
        {
          username: user.username,
          email: user.email
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

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  static async register(req: express.Request, res: express.Response) {
    try {
      const { username, email, password } = req.body;

      const data = await AuthService.register(username, email, password);

      if (!data.status.success) {
        res.status(401).json(data);
        return;
      }

      const user = data.data;

      const token = jsonWebToken.sign(
        {
          username: user.username,
          email: user.email
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
      
      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
}
