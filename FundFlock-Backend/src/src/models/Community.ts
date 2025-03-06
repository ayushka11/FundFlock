import mongoose, { Schema, Document } from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const connection = mongoose.connection;
const AutoIncrement = AutoIncrementFactory(connection);

interface ICommunity extends Document {
  community_id: number;
  community_name: string;
  description: string;
  admin: number;
  members: number[];
  manager: number;
  net_fund_amt: number;
  currentAmount: number;
  milestones: {
    milestone_id: number;
    // other milestone fields
  }[];
  createdAt: Date;
  expiresAt: Date;
}

const MilestoneSchema = new Schema(
  {
    milestone_id: { type: Number },
    // other milestone fields
  },
  { _id: false }
);

const CommunitySchema = new Schema<ICommunity>(
  {
    community_id: { type: Number, unique: true },
    community_name: { type: String, required: true },
    description: { type: String, required: true, maxlength: 300 },
    admin: { type: Number, ref: "User", required: true },
    members: [{ type: Number, ref: "User" }],
    manager: { type: Number, ref: "User", required: true },
    net_fund_amt: { type: Number, required: true },
    currentAmount: { type: Number, default: 0 },
    milestones: [MilestoneSchema],
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
  },
  { timestamps: true }
);

// Apply auto-increment plugin for community_id
CommunitySchema.plugin(AutoIncrement, { inc_field: "community_id" });

// Apply auto-increment plugin for milestone_id within milestones array
MilestoneSchema.plugin(AutoIncrement, { inc_field: "milestone_id", id: "milestone_seq" });

export const Community = mongoose.model<ICommunity>("Community", CommunitySchema);
