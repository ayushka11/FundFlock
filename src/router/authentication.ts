import express from "express";

import AuthController from "../controllers/authentication";
import { errorHandlingMiddleware } from "../middlewares/errorHandlingMiddleware";

export default (router: express.Router) => {
  router.post("/auth/register", AuthController.register, errorHandlingMiddleware);
  router.post("/auth/login", AuthController.login, errorHandlingMiddleware);
};
