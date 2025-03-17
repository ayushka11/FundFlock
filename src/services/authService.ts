import UserClient from "../clients/userClient";
import { random, authentication } from "../helpers/app";
import CustomError from "../middlewares/errorHandlingMiddleware";

export default class AuthService {
  static async login(email: string, password: string): Promise<any> {
    try {
      if (!email || !password) {
        throw new CustomError("no email or password", 400);
      }

      const user = await UserClient.getUserByEmailWithAuth(email);

      if (!user) {
        throw new CustomError("user not found", 404);
      }

      const expectedHash = authentication(user.authentication.salt, password);

      if (user.authentication.password !== expectedHash) {
        throw new CustomError("invalid email or password", 401);
      }

      return user;
    } catch (error) {
      throw error;
    }
  }

  static async register(
    username: string,
    email: string,
    password: string
  ): Promise<any> {
    try {
      if (!username || !email || !password) {
        throw new CustomError("missing required fields", 400);
      }

      const existingUser = await UserClient.getUserByEmail(email);
      if (existingUser) {
        throw new CustomError("user already exists", 409);
      }

      const salt = random();
      const user = await UserClient.createUser({
        username,
        email,
        authentication: {
          salt,
          password: authentication(salt, password),
        },
      });

      return user;
    } catch (error) {
      throw error;
    }
  }
}
