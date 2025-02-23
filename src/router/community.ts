import express from "express";

import CommunityController from "../controllers/community";
import verifyToken from "../middlewares/authentication";

export default (router: express.Router) => {
    router.post('/community/create', verifyToken, CommunityController.createCommunity);
};