import ChatClient from "../clients/chatClient";

export default class ChatService {
    static async sendMessage(
        user_id: string,
        community_id: string,
        message: string
    ): Promise<any> {   
        try {
            if (!user_id || !community_id || !message) {
                throw new Error("missing required fields");
            }

            const data = await ChatClient.sendMessage(
                user_id,
                community_id,
                message
            );

            return data;
        } catch (error) {
            throw error;
        }
    }
}