import express from "express";

import authentication from "./authentication";
import community from "./community";

const router = express.Router();

export default (): express.Router => {
  authentication(router);
  community(router);
  return router;
};
