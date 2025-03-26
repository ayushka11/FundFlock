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
      const { community_id, amount } = req.body;

      const community = await CommunityService.getCommunityDetails(community_id);
      if (!community) {
        ResponseHelper.sendErrorResponse(res, "Community not found", 404);
        return;
      }

      if (amount > community.net_fund_amt - community.current_amount) {
        ResponseHelper.sendErrorResponse(
          res,
          "Amount exceeds required amount",
          400
        );
        return;
      }

      const data = await TransactionService.createTransaction(
        user_id,
        community_id,
        amount
      );

      await CommunityService.updateCommunityAmount(community_id, amount);

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
