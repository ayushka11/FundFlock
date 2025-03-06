import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/userController";

const router = express.Router();

router.get("/:user_id", getUserProfile);
router.put("/:user_id", updateUserProfile);

export default router;
