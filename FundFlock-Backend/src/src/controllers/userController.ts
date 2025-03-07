import { Request, Response, RequestHandler } from "express";
import { User } from "../models/User"; // Import User model
import bcrypt from "bcryptjs";

/**
 * @desc Create User Profile
 * @route POST /api/users/register
 */
export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { username, email, pin } = req.body;

    // Hash PIN before saving
    const hashedPin = await bcrypt.hash(pin, 10);

    // Get the last user_id and increment for new user
    const lastUser = await User.findOne().sort({ user_id: -1 });
    const newUserId = lastUser ? lastUser.user_id + 1 : 1;

    const newUser = new User({
      user_id: newUserId,
      username,
      email,
      pin: hashedPin,
      created_at: new Date(),
      updated_at: new Date(),
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user", details: error.message });
  }
};

/**
 * @desc Get User Profile by ID
 * @route GET /api/users/:user_id
 */
export const getUserProfile: RequestHandler = async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id, 10);

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID. Must be a number." });
    }

    const user = await User.findOne({ user_id: userId }).select("-pin"); // Exclude PIN

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile", details: error.message });
  }
};

/**
 * @desc Update User Email
 * @route PUT /api/users/:user_id/email
 */
export const updateUserEmail: RequestHandler = async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id, 10);
    const { email } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const updatedUser = await User.findOneAndUpdate(
      { user_id: userId },
      { email, updated_at: new Date() },
      { new: true, runValidators: true }
    ).select("-pin"); // Exclude PIN

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user email:", error);
    res.status(500).json({ error: "Failed to update email", details: error.message });
  }
};
