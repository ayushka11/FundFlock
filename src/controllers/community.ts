import express, { NextFunction, RequestHandler } from "express";
import UserService from "../services/userService";
import { AuthRequest } from "types/auth";

import CommunityService from "../services/communityService";
import ResponseHelper from "../helpers/responseHelper";

export default class CommunityController {
  static async createCommunity(req: AuthRequest, res: express.Response, next: express.NextFunction) {
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

      await UserService.updateUserCommunities(admin_id, data._id);

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

  static async getCommunityHome(req: AuthRequest, res: express.Response, next: express.NextFunction) {
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

  static async getCommunityDetails(req: AuthRequest, res: express.Response, next: express.NextFunction) {
    try {
      const { community_id } = req.params;

      const data = await CommunityService.getCommunityDetails(community_id);

      ResponseHelper.sendSuccessResponse(res, data);
    } catch (error) {
      console.error(error);
      next(error);
    }
  }
  
  static async bulkUpdateCommunityStatus(req: express.Request, res: express.Response, next: express.NextFunction) {
    try {
      // ✅ Explicitly define req.body structure
      const { communityIds, status }: { communityIds: string[]; status: string } = req.body as any;
  
      if (!Array.isArray(communityIds) || communityIds.length === 0 || !status) {
        return ResponseHelper.sendErrorResponse(res, "Invalid request data", 400);
      }
  
      const result = await CommunityService.bulkUpdateCommunityStatus(communityIds, status);
  
      return ResponseHelper.sendSuccessResponse(res, {
        message: "Community statuses updated successfully",
        modifiedCount: result.modifiedCount, // ✅ Correct field
      });
    } catch (error) {
      console.error("❌ Error updating community statuses:", error);
      return ResponseHelper.sendErrorResponse(res, "Failed to update community statuses", 500);
    }
  }
}
