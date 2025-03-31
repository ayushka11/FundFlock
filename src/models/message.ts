import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender_id: { type: String, required: true },
  community_id: { type: String, required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const MessageModel = mongoose.model("Message", messageSchema);
export default MessageModel;
