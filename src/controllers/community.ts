import express, { RequestHandler } from "express";
import UserService from "../services/userService";
import { AuthRequest } from "types/auth";

import CommunityService from "../services/communityService";

export default class CommunityController {
  static async createCommunity(req: AuthRequest, res: express.Response) {
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

      const data = await CommunityService.createCommunity(
        community_name,
        description,
        member_ids,
        admin_id,
        net_fund_amt,
        expiring_date
      );

      const milestones_data = await CommunityService.createMilestones(
        data.data._id,
        milestones
      );

      const milestone_ids = milestones_data.data.map((milestone: any) => milestone._id);
      const updated_data = await CommunityService.updateCommunityMilestones(
        data.data._id,
        milestone_ids
      );

      await UserService.updateUserCommunities(admin_id, data.data._id);

      await Promise.all(
        member_ids.map((member_id) =>
          UserService.updateUserCommunities(member_id, data.data._id)
        )
      );

      data.data.milestone_ids = milestone_ids;

      if (!data.status.success) {
        res.status(401).json(data);
        return;
      }

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }

  static async getCommunityHome(req: AuthRequest, res: express.Response) {
    try {
      const user_id = await UserService.getUserId(req.user.username);

      const communities_ids = await UserService.getUserCommunities(user_id);

      const data = await CommunityService.getCommunityHome(communities_ids);

      if (!data.status.success) {
        res.status(401).json(data);
        return;
      }

      res.status(200).json(data);
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  }
}

