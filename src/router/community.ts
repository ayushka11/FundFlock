import express, { RequestHandler } from "express";

import CommunityController from "../controllers/community";
import verifyToken from "../middlewares/authentication";
import { errorHandlingMiddleware } from "../middlewares/errorHandlingMiddleware";

export default (router: express.Router) => {
  const communityRouter = express.Router();

  communityRouter.use(verifyToken);

  communityRouter.post("/create", CommunityController.createCommunity);
  communityRouter.get("/home", CommunityController.getCommunityHome);
  communityRouter.get("/details/:community_id", CommunityController.getCommunityDetails);
  communityRouter.put("/bulk-update-status", CommunityController.bulkUpdateCommunityStatus);
  communityRouter.get(
    "/details/:community_id",
    CommunityController.getCommunityDetails
  );
  communityRouter.post("/updateExpiringDate/:community_id", CommunityController.updateCommunityExpiringDate);

  communityRouter.use(errorHandlingMiddleware);

  router.use("/community", communityRouter);
};
