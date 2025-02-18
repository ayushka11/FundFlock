import express from "express";
import UserClient from "../clients/userClient";
import { random, authentication } from "../helpers";

export default class AuthService {
    static async login(email: string, password: string): Promise<any> {
        try {
            if (!email || !password) {
                return {
                    status: {
                      success: false,
                      error: "no email or password",
                    },
                    data: {},
                  };
            }

            const user = await UserClient.getUserByEmailWithAuth(email);
            
            if (!user) {
                return {
                    status: {
                      success: false,
                      error: "user not found",
                    },
                    data: {},
                  };
            }

            const expectedHash = authentication(user.authentication.salt, password);

            if (user.authentication.password !== expectedHash) {
                return {
                    status: {
                      success: false,
                      error: "incorrect password",
                    },
                    data: {},
                  };
            }

            const salt = random();
            user.authentication.sessionToken = authentication(
                salt,
                user._id.toString()
            );

            await user.save();

            return {
                status: {
                  success: true,
                },
                data: user,
            };
        } catch (error) {
            console.error(error);
            return {
                status: {
                  success: false,
                  error: "internal server error",
                },
                data: {},
            };
        }
    }

    static async register(username: string, email: string, password: string): Promise<any> {
        try {
            if (!username || !email || !password) {
                return {
                    status: {
                      success: false,
                      error: "missing fields",
                    },
                    data: {},
                  };
            }

            const existingUser = await UserClient.getUserByEmail(email);
            if (existingUser) {
                return {
                    status: {
                      success: false,
                      error: "user already exists",
                    },
                    data: {},
                  };
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

            return {
                status: {
                  success: true,
                },
                data: user,
            };
        } catch (error) {
            console.error(error);
            return {
                status: {
                  success: false,
                  error: "internal server error",
                },
                data: {},
            };
        }
    }
}