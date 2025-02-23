import express from "express";

import AuthController from "../controllers/authentication";

export default (router: express.Router) => {
  router.post("/auth/register", AuthController.register);
  router.post("/auth/login", AuthController.login);
};
