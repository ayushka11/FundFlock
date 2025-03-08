import express from "express";
import { registerUser, getUserProfile, updateUserEmail } from "../controllers/userProfileController";

const router = express.Router();

// Create User Profile
router.post("/register", registerUser);

// Get User Profile by ID
router.get("/:id", getUserProfile); // Changed :user_id → :id

// Update User Email
router.put("/:id/email", updateUserEmail); // Changed :user_id → :id

export default router;
