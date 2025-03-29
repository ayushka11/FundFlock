import MessageModel from "../models/message";
import UserModel from "../models/users";

const PAGE_SIZE = 20; // Number of messages per page

export default class ChatClient {
  static async sendMessage(
    user_id: string,
    community_id: string,
    message: string
  ): Promise<any> {
    try {
      const messageData = {
        sender_id: user_id,
        community_id: community_id,
        content: message,
        timestamp: new Date().toISOString(),
      };

      return new MessageModel(messageData)
        .save()
        .then((message) => message.toObject());
    } catch (error) {
      throw error;
    }
  }

  static async getChats(community_id: string, page: number): Promise<any> {
    try {
      const limit = PAGE_SIZE + 1;
      const skip = (page-1) * PAGE_SIZE;

      console.log("Fetching messages for community:", community_id);
        console.log("Page:", page);

      const messages = await MessageModel.find({ community_id: String(community_id) })
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit)
        .lean();
        
    console.log("Messages:", messages);
      const senderIds = messages.map((msg) => msg.sender_id);
      const users = await UserModel.find(
        { _id: { $in: senderIds } },
        { _id: 1, username: 1 }
      ).lean();

      const userMap = new Map(
        users.map((user) => [user._id.toString(), user.username])
      );

      const formattedMessages = messages.map((msg) => ({
        ...msg,
        sender: userMap.get(msg.sender_id) || "Unknown",
      }));

      const isLastPage = messages.length <= PAGE_SIZE;

      return {
        messages: formattedMessages.slice(0, PAGE_SIZE),
        isLastPage,
      };
    } catch (error) {
      throw error;
    }
  }
}
