import express from "express";
import UserProfileService from "../services/userProfileService";
import ResponseHelper from "../helpers/responseHelper";

export default class UserProfileController {
  static async registerUser(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { username, email, password } = req.body;

      if (!username || !email || !password) {
        return ResponseHelper.sendErrorResponse(
          res,
          "Missing required fields",
          400
        );
      }

      const user = await UserProfileService.createUser(
        username,
        email,
        password
      );
      return ResponseHelper.sendSuccessResponse(res, user, 201);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async getUserProfile(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { id } = req.params;

      if (!id) {
        return ResponseHelper.sendErrorResponse(
          res,
          "User ID is required",
          400
        );
      }

      const user = await UserProfileService.getUserById(id);
      if (!user) {
        return ResponseHelper.sendErrorResponse(res, "User not found", 404);
      }

      return ResponseHelper.sendSuccessResponse(res, user);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async updateUserEmail(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { id } = req.params;
      const { email } = req.body;

      if (!id || !email) {
        return ResponseHelper.sendErrorResponse(
          res,
          "User ID and new email are required",
          400
        );
      }

      const updatedUser = await UserProfileService.updateUserEmail(id, email);
      if (!updatedUser) {
        return ResponseHelper.sendErrorResponse(res, "User not found", 404);
      }

      return ResponseHelper.sendSuccessResponse(res, updatedUser);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
