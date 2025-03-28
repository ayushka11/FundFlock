import CommunityModel from "../models/communities";
import CommunityClient from "../clients/communityClient";
import UserClient from "../clients/userClient";
import CustomError from "../middlewares/errorHandlingMiddleware";
import UserModel from "../models/users";

export default class CommunityService {
  static async getAllCommunities() {
    return await CommunityModel.find({});
  }

  static async createCommunity(
    community_name: string,
    description: string,
    member_ids: string[],
    admin_id: string,
    net_fund_amt: number,
    expiring_date: string
  ): Promise<any> {
    try {
      if (
        !community_name ||
        !description ||
        member_ids.length === 0 ||
        !net_fund_amt ||
        !expiring_date
      ) {
        throw new CustomError("missing required fields", 400);
      }

      const data = await CommunityClient.createCommunity(
        community_name,
        description,
        member_ids,
        admin_id,
        net_fund_amt,
        expiring_date
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async createMilestones(
    community_id: string,
    milestones: number[]
  ): Promise<any> {
    try {
      if (!community_id || milestones.length === 0) {
        throw new CustomError("missing required fields", 400);
      }

      const data = await CommunityClient.createMilestones(
        community_id,
        milestones
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async updateCommunityMilestones(
    community_id: string,
    milestone_ids: string[]
  ): Promise<any> {
    try {
      if (!community_id || milestone_ids.length === 0) {
        throw new CustomError("missing required fields", 400);
      }

      const data = await CommunityClient.updateCommunityMilestones(
        community_id,
        milestone_ids
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getCommunityHome(communities_ids: string[]): Promise<any> {
    try {
      const community_info = await Promise.all(
        communities_ids.map((community_id) =>
          CommunityClient.getCommunity(community_id)
        )
      );

      const communities = community_info.map((community) => {
        return {
          community_id: community._id,
          community_name: community.community_name,
          description: community.description,
          net_fund_amt: community.net_fund_amt,
          current_amount: community.current_amount,
          expiring_date: community.expiring_date,
          status: "",
        };
      });

      const today = new Date();
      communities.forEach((community) => {
        const expiring_date = new Date(community.expiring_date);
        if (today > expiring_date) {
          community.status = "expired";
        } else {
          community.status = "active";
        }
      });

      const data = {
        communities: communities,
      };

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getCommunityDetails(community_id: string): Promise<any> {
    try {
      if (!community_id) {
        throw new CustomError("Missing required fields", 400);
      }

      const community = await CommunityClient.getCommunity(community_id);
      if (!community) {
        throw new CustomError("Community not found", 404);
      }

      const milestone_data = await CommunityClient.getMilestones(community_id);

      const admin_username = await UserClient.getUsernameById(
        community.admin_id
      );

      const members_usernames: string[] = await Promise.all(
        community.member_ids.map((member_id: string) =>
          UserClient.getUsernameById(member_id)
        )
      );

      const manager_username = await UserClient.getUsernameById(
        community.manager_id
      );

      const milestones = milestone_data.map((milestone: any) => {
        return {
          target_amount: milestone.target_amount,
          status: milestone.status,
          achieved_amount: milestone.achieved_amount,
        };
      });

      const data = {
        community_id: community._id,
        community_name: community.community_name,
        description: community.description,
        admin_username: admin_username.username,
        members_usernames: members_usernames.map(
          (member: any) => member.username
        ),
        manager_username: manager_username.username,
        net_fund_amt: community.net_fund_amt,
        current_amount: community.current_amount,
        expiring_date: community.expiring_date,
        milestones: milestones,
      };

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async bulkUpdateCommunityStatus(communityIds: string[], status: string) {
    try {
      const result = await CommunityModel.updateMany(
        { _id: { $in: communityIds } }, // Find communities with matching IDs
        { $set: { status, updated_at: new Date() } } // Update status and timestamp
      );
  
      return { modifiedCount: result.modifiedCount }; // ✅ Return an object with modifiedCount
    } catch (error) {
      console.error("❌ Error updating community statuses:", error);
      throw error;
    }
  }  
  
  static async getExpiringCommunities(expiryDate: Date) {
    return await CommunityModel.find({ expiring_date: expiryDate });
  }
}
