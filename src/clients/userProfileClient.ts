import UserModel from "../models/userProfile"; 

export default class UserProfileClient {
  static async createUser(username: string, email: string, password: string): Promise<any> {
    return new UserModel({ username, email, authentication: { password } }).save().then((user: { toObject: () => any; }) => user.toObject());
  }

  static async getUserById(userId: string): Promise<any> {
    return UserModel.findById(userId);
  }

  static async updateUserEmail(userId: string, email: string): Promise<any> {
    return UserModel.findByIdAndUpdate(userId, { email }, { new: true });
  }
}