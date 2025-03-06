import express from "express";
import {
  registerUser,
  getUsers,
  getUserById,
} from "../controllers/userController";

const router = express.Router();

// 🔹 Route to register a new user
router.post("/register", registerUser);

// 🔹 Route to get all users
router.get("/getAll", getUsers);

// 🔹 Route to get a user by user_id
router.get("/:user_id", getUserById);

export default router;
