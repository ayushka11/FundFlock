import UserModel from "../models/users";

export default class UserClient {
  static async getUsers(): Promise<any> {
    return UserModel.find();
  }

  static async getUserByUsername(username: string): Promise<any> {
    return UserModel.findOne({ username });
  }

  static async getUserByEmail(email: string): Promise<any> {
    return UserModel.findOne({ email });
  }

  static async getUserByEmailWithAuth(email: string): Promise<any> {
    return UserModel.findOne({ email }).select(
      "+authentication.salt +authentication.password"
    );
  }

  static async getUserById(id: string): Promise<any> {
    return UserModel.findById(id);
  }

  static async createUser(values: Record<string, any>): Promise<any> {
    return new UserModel(values).save().then((user) => user.toObject());
  }

  static async deleteUserById(id: string): Promise<any> {
    return UserModel.findOneAndDelete({ _id: id });
  }

  static async updateUserById(
    id: string,
    values: Record<string, any>
  ): Promise<any> {
    return UserModel.findByIdAndUpdate(id, values, { new: true });
  }

  static async updateUserCommunities(
    user_id: string,
    community_id: string
  ): Promise<any> {
    return UserModel.findByIdAndUpdate(user_id, {
      $push: { communities_ids: community_id },
    });
  }

  static async getUsernameById(id: string): Promise<any> {
    return UserModel.findById(id).select("username");
  }
}
