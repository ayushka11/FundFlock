import ChatClient from "../clients/chatClient";

export default class ChatService {
  static async sendMessage(user_id: string, community_id: string, message: string): Promise<any> {
    if (!user_id || !community_id || !message) {
      throw new Error("Missing required fields");
    }

    return await ChatClient.sendMessage(user_id, community_id, message);
  }

  static async getChats(user_id: string, community_id: string, page: number): Promise<any> {
    if (!user_id || !community_id || !page) {
      throw new Error("Missing required fields");
    }

    return await ChatClient.getChats(user_id, community_id, page);
  }

  static async updateLastReadMessage(user_id: string, community_id: string, message_id: string) {
    return await ChatClient.updateLastReadMessage(user_id, community_id, message_id);
  }
}
