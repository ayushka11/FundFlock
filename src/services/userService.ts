import UserClient from "../clients/userClient";

export default class UserService {
    static async getUserId(username: string): Promise<string> {
        try {
            const user = await UserClient.getUserByUsername(username);
            return user._id;
        } catch (error) {
            console.error(error);
            return "";
        }
    }

    static async getUserIds(usernames: string[]): Promise<string[]> {
        try {
            const users = await Promise.all(usernames.map((username) => UserClient.getUserByUsername(username)));
            return users.map((user) => user._id);
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    static async updateUserCommunities(user_id: string, community_id: string): Promise<any> {
        try {
            const data = await UserClient.updateUserCommunities(user_id, community_id);
            return data;
        } catch (error) {
            console.error(error);
            return;
        }
    }
}