import express, { RequestHandler } from "express";
import { AuthRequest } from "types/auth";
import TransactionService from "../services/transactionService";
import UserService from "../services/userService";
import CommunityService from "../services/communityService";
import ResponseHelper from "../helpers/responseHelper";

export default class TransactionController {
  static async createTransaction(
    req: AuthRequest,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user_id = await UserService.getUserId(req.user.username);
      const { milestone_id, community_id, amount } = req.body;

      const target_amount = await CommunityService.getMilestoneAmount(
        milestone_id
      );
      const achieved_amount = await CommunityService.getMilestoneAchievedAmount(
        milestone_id
      );

      if (amount > target_amount - achieved_amount) {
        throw new Error("Amount exceeds remaining target amount");
      }

      const data = await TransactionService.createTransaction(
        user_id,
        milestone_id,
        community_id,
        amount
      );

      const milestoneUpdate = await CommunityService.updateMilestone(
        milestone_id,
        amount
      );

      const communityUpdate = await CommunityService.updateCommunityAmount(
        community_id,
        amount
      );

      ResponseHelper.sendSuccessResponse(res, data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async getTransactionsByUser(
    req: AuthRequest,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user_id = await UserService.getUserId(req.user.username);

      const data = await TransactionService.getTransactionsByUser(user_id);

      ResponseHelper.sendSuccessResponse(res, data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async getTransactionsByCommunity(
    req: AuthRequest,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { community_id } = req.params;

      const data = await TransactionService.getTransactionsByCommunity(
        community_id
      );

      ResponseHelper.sendSuccessResponse(res, data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
}
