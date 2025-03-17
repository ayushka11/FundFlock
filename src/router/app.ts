import express from "express";

import authentication from "./authentication";
import community from "./community";
import transaction from "./transaction";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  community(router);
  transaction(router);
  return router;
};
