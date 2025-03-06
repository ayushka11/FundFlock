import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("❌ MONGO_URI is missing in .env file. Please add it.");
  process.exit(1); // Exit process if MongoDB URI is not provided
}

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    } as mongoose.ConnectOptions);

    console.log("\x1b[32m✅ MongoDB Connected\x1b[0m"); // Green text for success
  } catch (err) {
    console.error("\x1b[31m❌ MongoDB Connection Error:\x1b[0m", err); // Red text for error
    process.exit(1);
  }
};

export default connectDB;
