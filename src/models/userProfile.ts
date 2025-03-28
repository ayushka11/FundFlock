import mongoose, { Schema, Document, Model } from "mongoose";

// Define the User schema
interface IUser extends Document {
  username: string;
  email: string;
  authentication?: {
    password: string;
  };
}

// Define schema
const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    authentication: {
      password: { type: String, required: true },
    },
  },
  { timestamps: true }
);

// Prevent model overwrite errors
const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default UserModel;
