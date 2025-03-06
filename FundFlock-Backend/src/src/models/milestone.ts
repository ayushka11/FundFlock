import mongoose, { Schema, Document } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const connection = mongoose.connection;
const AutoIncrement = AutoIncrementFactory(connection);

interface IMilestone extends Document {
  milestone_id: number; // Auto-incremented ID
  community_id: mongoose.Schema.Types.ObjectId; // Reference to Community
  target_amount: number; // Cumulative target amount
  status: "pending" | "active" | "completed" | "dead"; // Status options
}

const MilestoneSchema = new Schema<IMilestone>(
  {
    milestone_id: { type: Number, unique: true }, // Auto-incremented
    community_id: { type: Schema.Types.ObjectId, ref: "Community", required: true },
    target_amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "dead"],
      default: "pending" // Default status
    }
  },
  { timestamps: true } // Adds `createdAt` and `updatedAt`
);

// 🔹 Auto-increment milestone_id
MilestoneSchema.plugin(AutoIncrement, { inc_field: "milestone_id" });

export const Milestone = mongoose.model<IMilestone>("Milestone", MilestoneSchema);
