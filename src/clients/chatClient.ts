import MessageModel from "../models/message";
import LastReadModel from "../models/lastRead";
import UserModel from "../models/users";

const PAGE_SIZE = 20;

export default class ChatClient {
  static async sendMessage(user_id: string, community_id: string, message: string): Promise<any> {
    try {
      const messageData = {
        sender_id: user_id,
        community_id: community_id,
        content: message,
        timestamp: new Date().toISOString(),
      };

      const newMessage = await new MessageModel(messageData).save();

      await LastReadModel.findOneAndUpdate(
        { user_id, community_id },
        { last_read_message_id: newMessage._id, updated_at: new Date() },
        { upsert: true, new: true }
      );

      return newMessage.toObject();
    } catch (error) {
      throw error;
    }
  }

  static async getChats(user_id: string, community_id: string, page: number): Promise<any> {
    try {
      const limit = PAGE_SIZE + 1;
      const skip = (page - 1) * PAGE_SIZE;

      const messages = await MessageModel.find({ community_id })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean();

      const senderIds = messages.map((msg) => msg.sender_id);
      const users = await UserModel.find(
        { _id: { $in: senderIds } },
        { _id: 1, username: 1 }
      ).lean();

      const userMap = new Map(users.map((user) => [user._id.toString(), user.username]));

      const formattedMessages = messages.map((msg) => ({
        ...msg,
        sender: userMap.get(msg.sender_id) || "Unknown",
      }));

      const isLastPage = messages.length <= PAGE_SIZE;

      const lastRead = await LastReadModel.findOne({ user_id, community_id })
        .select("last_read_message_id")
        .lean();

      return {
        messages: formattedMessages.slice(0, PAGE_SIZE),
        isLastPage,
        last_read_message_id: lastRead?.last_read_message_id || null,
      };
    } catch (error) {
      throw error;
    }
  }

  static async updateLastReadMessage(user_id: string, community_id: string, message_id: string) {
    try {
      await LastReadModel.findOneAndUpdate(
        { user_id, community_id },
        { last_read_message_id: message_id, updated_at: new Date() },
        { upsert: true, new: true }
      );
    } catch (error) {
      throw error;
    }
  }
}
