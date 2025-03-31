import mongoose from "mongoose";

const lastReadSchema = new mongoose.Schema({
  user_id: { type: String, required: true },
  community_id: { type: String, required: true },
  last_read_message_id: { type: mongoose.Schema.Types.ObjectId, ref: "Message", required: true },
  updated_at: { type: Date, default: Date.now },
});

export const LastReadModel = mongoose.model("LastRead", lastReadSchema);
export default LastReadModel;
