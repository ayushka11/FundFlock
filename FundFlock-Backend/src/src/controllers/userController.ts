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
