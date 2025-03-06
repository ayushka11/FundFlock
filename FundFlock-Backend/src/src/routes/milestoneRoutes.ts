import express from "express";
import {
  createMilestone,
  getMilestones,
  getMilestoneById,
} from "../controllers/milestoneController";

const router = express.Router();

// 🔹 Route to create a new milestone
router.post("/", createMilestone);

// 🔹 Route to get all milestones
router.get("/", getMilestones);

// 🔹 Route to get a milestone by milestone_id
router.get("/:milestone_id", getMilestoneById);

export default router;
