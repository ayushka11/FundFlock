import express, { NextFunction } from "express";
import { Request, Response, RequestHandler } from "express";
import UserService from "../services/userService";
import { AuthRequest } from "types/auth";
import CustomError from "../middlewares/errorHandlingMiddleware";
import CommunityService from "../services/communityService";
import ResponseHelper from "../helpers/responseHelper";

export default class CommunityController {
  static async createCommunity(
    req: AuthRequest,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const {
        community_name,
        description,
        members_usernames,
        net_fund_amt,
        expiring_date,
        milestones,
      } = req.body;

      const admin_id = await UserService.getUserId(req.user.username);

      const member_ids = await UserService.getUserIds(members_usernames);
      member_ids.push(admin_id);

      const data = await CommunityService.createCommunity(
        community_name,
        description,
        member_ids,
        admin_id,
        net_fund_amt,
        expiring_date
      );

      const milestones_data = await CommunityService.createMilestones(
        data._id,
        milestones
      );

      const milestone_ids = milestones_data.map(
        (milestone: any) => milestone._id
      );
      const updated_data = await CommunityService.updateCommunityMilestones(
        data._id,
        milestone_ids
      );

      await Promise.all(
        member_ids.map((member_id) =>
          UserService.updateUserCommunities(member_id, data._id)
        )
      );

      data.milestone_ids = milestone_ids;

      ResponseHelper.sendSuccessResponse(res, data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async getCommunityHome(
    req: AuthRequest,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const user_id = await UserService.getUserId(req.user.username);

      const communities_ids = await UserService.getUserCommunities(user_id);

      const data = await CommunityService.getCommunityHome(communities_ids);

      ResponseHelper.sendSuccessResponse(res, data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async getCommunityDetails(
    req: AuthRequest,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { community_id } = req.params;

      const data = await CommunityService.getCommunityDetails(community_id);

      ResponseHelper.sendSuccessResponse(res, data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async updateCommunityExpiringDate(
    req: AuthRequest,
    res: express.Response,
    next: express.NextFunction
  ) {
    try {
      const { community_id } = req.params;
      const { expiring_date } = req.body;
      const user_id = await UserService.getUserId(req.user.username);
      const isAdmin = await CommunityService.isUserAdmin(
        community_id,
        user_id
      );
      if (!isAdmin) {
        ResponseHelper.sendErrorResponse(
          res,
          "You are not authorized to update the expiring date of this community",
          403
        );
        return;
      }

      const data = await CommunityService.updateCommunityExpiringDate(
        community_id,
        expiring_date
      );

      ResponseHelper.sendSuccessResponse(res, data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }

  static async bulkUpdateCommunityStatus(req: Request, res: Response): Promise<void> {
    try {
      const { communityIds, status } = req.body;

      if (!communityIds || !Array.isArray(communityIds) || !status) {
        throw new CustomError("Missing required fields: communityIds (array) and status (string)", 400);
      }

      const result = await CommunityService.bulkUpdateCommunityStatus(communityIds, status);

      res.status(200).json({
        message: `Updated ${result.modifiedCount} communities to status "${status}"`,
        data: result,
      });
    } catch (error) {
      res.status(error.statusCode || 500).json({ error: error.message });
    }
  }
}
