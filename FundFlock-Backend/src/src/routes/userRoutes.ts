import express from "express";
import { registerUser, getUserProfile, updateUserEmail } from "../controllers/userController";

const router = express.Router();

// Create User Profile
router.post("/register", registerUser);

// Get User Profile by ID
router.get("/:user_id", getUserProfile);

// Update User Profile (Email Only)
router.put("/:user_id/email", updateUserEmail);

export default router;
