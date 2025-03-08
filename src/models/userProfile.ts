import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    authentication: {
      password: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// 🔹 Prevent model overwrite error
const User = mongoose.models.User || mongoose.model("User", userSchema);

export default User;
