import { Request, Response, RequestHandler } from "express";
import User from "../models/userProfile"; // Ensure correct import
import mongoose from "mongoose";

/**
 * @desc Create User Profile (Register)
 */
export const registerUser: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { username, email, authentication } = req.body;

    if (!authentication || !authentication.password) {
      res.status(400).json({ error: "Password is required" });
      return;
    }

    const newUser = new User({
      username,
      email,
      authentication: { password: authentication.password }
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to register user", details: error.message });
  }
};

/**
 * @desc Get User Profile by ID
 */
export const getUserProfile: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params; // Use _id instead of user_id

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to fetch user profile", details: error.message });
  }
};

/**
 * @desc Update User Email
 */
export const updateUserEmail: RequestHandler = async (req, res): Promise<void> => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ error: "Invalid user ID" });
      return;
    }

    if (!email) {
      res.status(400).json({ error: "Email is required" });
      return;
    }

    const updatedUser = await User.findByIdAndUpdate(id, { email }, { new: true });

    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ error: "Failed to update email", details: error.message });
  }
};
