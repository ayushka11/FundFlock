import mongoose from "mongoose";
import dotenv from "dotenv";
import CommunityModel from "../models/communities";

dotenv.config(); // Load .env variables ✅

const MONGO_URL = process.env.MONGO_URL; // Use the correct key from .env
if (!MONGO_URL) {
  console.error("❌ Error: MONGO_URL is not defined in .env file.");
  process.exit(1);
}

async function migrateLastActivity() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log("✅ Connected to MongoDB");

    // Add 'last_activity' field with default value as 'created_at'
    const result = await CommunityModel.updateMany(
      { last_activity: { $exists: false } },
      [{ $set: { last_activity: "$created_at" } }]
    );

    console.log(`✅ Migration completed. Updated ${result.modifiedCount} communities.`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    console.log("🔌 Disconnected from MongoDB");
  }
}

// Run the migration
migrateLastActivity();