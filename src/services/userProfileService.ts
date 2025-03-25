import UserProfileClient from "../clients/userProfileClient";

export default class UserProfileService {
  /**
   * @desc Register a new user
   */
  static async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<any> {
    try {
      const newUser = await UserProfileClient.createUser(
        username,
        email,
        password
      );
      return newUser;
    } catch (error) {
      console.error("Error in createUser Service:", error);
      throw error;
    }
  }

  /**
   * @desc Get user by ID
   */
  static async getUserById(userId: string): Promise<any> {
    try {
      const user = await UserProfileClient.getUserById(userId);
      return user;
    } catch (error) {
      console.error("Error in getUserById Service:", error);
      throw error;
    }
  }

  /**
   * @desc Update user email
   */
  static async updateUserEmail(userId: string, email: string): Promise<any> {
    try {
      const updatedUser = await UserProfileClient.updateUserEmail(
        userId,
        email
      );
      return updatedUser;
    } catch (error) {
      console.error("Error in updateUserEmail Service:", error);
      throw error;
    }
  }
}
