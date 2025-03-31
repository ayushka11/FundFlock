import express from "express";

import authentication from "./authentication";
import community from "./community";
import transaction from "./transaction";
import chat from "./chat";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  community(router);
  transaction(router);
  chat(router);
  return router;
};
