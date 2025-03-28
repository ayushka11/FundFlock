import mongoose, { Document, Schema } from "mongoose";

export interface IMessage extends Document {
  community_id: mongoose.Types.ObjectId;
  sender_id: string;
  text: string;
  timestamp: Date;
}

const messageSchema = new Schema<IMessage>({
  community_id: { type: Schema.Types.ObjectId, ref: "Community", required: true },
  sender_id: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

export const MessageModel = mongoose.model<IMessage>("Message", messageSchema);
