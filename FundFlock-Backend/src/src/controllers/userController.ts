import { Request, Response, RequestHandler } from "express";
import { User } from "../models/User";
import bcrypt from "bcryptjs";

export const registerUser: RequestHandler = async (req, res) => {
  try {
    const { username, email, password, communities_id } = req.body;

    const newUser = new User({
      username,
      email,
      password,
      communities_id
    });

    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Failed to register user", details: error.message });
  }
};

export const getUsers: RequestHandler = async (req, res) => {
  try {
    console.log("herererrererer")
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Failed to fetch users", details: error.message });
  }
};

export const getUserById: RequestHandler = async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id, 10); // Ensure it's a number

    if (isNaN(userId)) {
      res.status(400).json({ error: "Invalid user ID. It must be a number." });
      return;
    }

    const user = await User.findOne({ user_id: userId });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Failed to fetch user", details: error.message });
  }
};

export const getUserProfile: RequestHandler = async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id, 10); // Convert user_id to number

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID. Must be a number." });
    }

    const user = await User.findOne({ user_id: userId }).select("-password"); // Exclude password

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ error: "Failed to fetch user profile", details: error.message });
  }
};

export const updateUserProfile: RequestHandler = async (req, res) => {
  try {
    const userId = parseInt(req.params.user_id, 10);
    const { username, email } = req.body;

    if (isNaN(userId)) {
      return res.status(400).json({ error: "Invalid user ID." });
    }

    const updatedUser = await User.findOneAndUpdate(
      { user_id: userId },
      { username, email },
      { new: true, runValidators: true }
    ).select("-password"); // Exclude password

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error("Error updating user profile:", error);
    res.status(500).json({ error: "Failed to update profile", details: error.message });
  }
};

