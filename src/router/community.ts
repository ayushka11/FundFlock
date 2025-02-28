import express from "express";

import CommunityController from "../controllers/community";
import verifyToken from "../middlewares/authentication";
import { errorHandlingMiddleware } from "../middlewares/errorHandlingMiddleware";

export default (router: express.Router) => {
  router.post(
    "/community/create",
    verifyToken,
    CommunityController.createCommunity,
    errorHandlingMiddleware
  );
  router.get(
    "/community/home",
    verifyToken,
    CommunityController.getCommunityHome,
    errorHandlingMiddleware
  );
};
