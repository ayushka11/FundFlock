import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  authentication: {
    password: { type: String, required: true, select: false },
    salt: { type: String, select: false }
  },
  communities_ids: { type: Array, required: true },
});

export const UserModel = mongoose.model("User", userSchema);

export default UserModel;