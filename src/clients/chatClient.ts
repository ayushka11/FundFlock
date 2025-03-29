import MessageModel from '../models/message';

export default class ChatClient {
    static async sendMessage(
        user_id: string,
        community_id: string,
        message: string
    ): Promise<any> {
        try {
            const messageData = {
                userId: user_id,
                communityId: community_id,
                content: message,
                timestamp: new Date().toISOString(),
            };

            const createdMessage = await MessageModel.create(messageData);
            return createdMessage;
        } catch (error) {
            throw error;
        }
    }
}