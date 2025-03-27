import mongoose from "mongoose";
import community from "router/community";
import { v4 as uuidv4 } from "uuid";

const TransactionSchema = new mongoose.Schema({
  transaction_id: {
    type: String,
    default: () => uuidv4(),
    unique: true,
    sparse: true,
    required: true,
  },
  user_id: { type: String, required: true },
  community_id: { type: String, required: true },
  amount: { type: Number, required: true },
  created_at: { type: Date, required: true, default: Date.now },
  updated_at: { type: Date, required: true, default: Date.now },
});

export default mongoose.model("Transaction", TransactionSchema);
