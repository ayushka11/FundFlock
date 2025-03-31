import express from "express";
import ChatController from "../controllers/chat";
import verifyToken from "../middlewares/authentication";
import { errorHandlingMiddleware } from "../middlewares/errorHandlingMiddleware";

export default (router: express.Router) => {
  const chatRouter = express.Router();

  chatRouter.post("/send", verifyToken, ChatController.sendMessage);
  chatRouter.get("/getChats/:community_id/:page", verifyToken, ChatController.getChats);
  chatRouter.post("/updateLastRead", verifyToken, ChatController.updateLastReadMessage);

  chatRouter.use(errorHandlingMiddleware);

  router.use("/chat", chatRouter);
};
