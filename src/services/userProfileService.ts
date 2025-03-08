import User from "../models/userProfile";
import mongoose from "mongoose";

/**
 * @desc Create a new user
 */
export const createUser = async (username: string, email: string, password: string) => {
  const newUser = new User({
    username,
    email,
    authentication: { password }, // 🔹 Store password inside `authentication`
  });

  return await newUser.save();
};

/**
 * @desc Get user by ID (MongoDB ObjectId as string)
 */
export const getUserById = async (user_id: string) => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new Error("Invalid user ID format");
  }

  return await User.findById(user_id);
};

/**
 * @desc Update user's email by ID
 */
export const updateUserEmailById = async (user_id: string, email: string) => {
  if (!mongoose.Types.ObjectId.isValid(user_id)) {
    throw new Error("Invalid user ID format");
  }

  return await User.findByIdAndUpdate(user_id, { email }, { new: true });
};
