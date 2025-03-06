import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";
import AutoIncrementFactory from "mongoose-sequence";

const connection = mongoose.connection;
const AutoIncrement = AutoIncrementFactory(connection);

interface IUser extends Document {
  user_id: number; // Auto-incremented user ID
  username: string;
  email: string;
  password: string;
  communities_id: mongoose.Schema.Types.ObjectId[]; // Joined communities
  comparePassword: (enteredPassword: string) => Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    user_id: { type: Number, unique: true }, // Auto-incremented
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    communities_id: [{ type: Schema.Types.ObjectId, ref: "Community" }],
  },
  { timestamps: true }
);

// 🔹 Auto-increment user_id
UserSchema.plugin(AutoIncrement, { inc_field: "user_id" });

// 🔹 Hash password before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// 🔹 Method to compare hashed passwords
UserSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model<IUser>("User", UserSchema);
