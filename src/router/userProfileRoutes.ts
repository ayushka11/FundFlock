import express from "express";
import UserProfileController from "../controllers/userProfileController";

const router = express.Router();

// Create User Profile
router.post("/register", UserProfileController.registerUser);

// Get User Profile by ID
router.get("/:id", UserProfileController.getUserProfile);

// Update User Email
router.put("/:id/email", UserProfileController.updateUserEmail);

export default router;
