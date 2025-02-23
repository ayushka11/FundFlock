import mongoose from "mongoose";

const milestoneSchema = new mongoose.Schema({
  community_id: { type: String, required: true },
  target_amount: { type: Number, required: true },
  status: { type: String, enum: ["pending", "active", "completed", "dead"], required: true },
  achieved_amount: { type: Number, required: true, default: 0 },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});

const MilestoneModel = mongoose.model("Milestone", milestoneSchema);

export default MilestoneModel;
