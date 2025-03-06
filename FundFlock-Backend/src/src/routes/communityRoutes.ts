import express from "express";
import {
  createCommunity,
  getCommunities,
  getCommunityById,
} from "../controllers/communityController";

const router = express.Router();

// 🔹 Route to create a new community
router.post("/", createCommunity);

// 🔹 Route to get all communities
router.get("/", getCommunities);

// 🔹 Route to get a single community by its auto-incremented ID
router.get("/:community_id", getCommunityById);

export default router;
