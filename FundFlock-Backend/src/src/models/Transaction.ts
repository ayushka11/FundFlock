import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface ITransaction extends Document {
  transactionId: string; // UUID
  userId: number; // user_id reference
  communityId: number; // community_id reference
  milestone_id: number; // milestone_id reference
  amount: number;
}

const TransactionSchema = new Schema<ITransaction>(
  {
    transactionId: { type: String, default: uuidv4, unique: true }, // Auto-generating UUID
    userId: { type: Number, ref: "User", required: true }, // user_id reference
    communityId: { type: Number, ref: "Community", required: true }, // community_id reference
    milestone_id: { type: Number, ref: "Milestone", required: true }, // milestone_id reference
    amount: { type: Number, required: true }
  },
  { timestamps: true } // Automatically adds `createdAt` and `updatedAt`
);

export const Transaction = mongoose.model<ITransaction>("Transaction", TransactionSchema);
