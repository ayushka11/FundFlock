import express from "express";

import AuthController from "../controllers/authentication";
import { errorHandlingMiddleware } from "../middlewares/errorHandlingMiddleware";

export default (router: express.Router) => {
  const authRouter = express.Router();

  authRouter.post("/register", AuthController.register);
  authRouter.post("/login", AuthController.login);
  authRouter.post("/logout", AuthController.logout);

  authRouter.use(errorHandlingMiddleware);

  router.use("/auth", authRouter);
};
