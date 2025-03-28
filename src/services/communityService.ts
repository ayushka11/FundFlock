import TransactionClient from "../clients/transactionClient";
import CommunityClient from "../clients/communityClient";
import UserClient from "../clients/userClient";
import CustomError from "../middlewares/errorHandlingMiddleware";
import UserModel from "../models/users";
import CommunityModel from "../models/communities";

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
      const transactions = await TransactionClient.getTransactionsByCommunityId(
        community_id
      );

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

      const created_at = new Date(community.created_at);
      const today = new Date();
      const expiringDate = new Date(community.expiring_date);

      const daysElapsed = Math.max(
        Math.floor(
          (today.getTime() - created_at.getTime()) / (1000 * 60 * 60 * 24)
        ),
        1
      );

      const daysRemaining = Math.max(
        Math.ceil(
          (expiringDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
        ),
        1
      );

      const currentRateOfInflow = community.current_amount / daysElapsed;
      const remainingAmount = community.net_fund_amt - community.current_amount;
      const requiredRateOfInflow = remainingAmount / daysRemaining;

      const totalContributions: Record<string, number> = {};
      for (const transaction of transactions) {
        if (!totalContributions[transaction.user_id]) {
          totalContributions[transaction.user_id] = 0;
        }
        totalContributions[transaction.user_id] += transaction.amount;
      }

      const memberContributions = await Promise.all(
        Object.entries(totalContributions).map(async ([user_id, amount]) => {
          const username = await UserClient.getUsernameById(user_id);
          return { username: username.username, total_contribution: amount };
        })
      );

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
        current_rate_of_inflow: currentRateOfInflow.toFixed(2),
        required_rate_of_inflow: requiredRateOfInflow.toFixed(2),
        member_contributions: memberContributions,
      };

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async bulkUpdateCommunityStatus(communityIds: string[], status: string) {
    try {
      if (!communityIds || communityIds.length === 0) {
        throw new CustomError("No community IDs provided", 400);
      }
      if (!status) {
        throw new CustomError("Missing status", 400);
      }

      const result = await CommunityClient.updateMany(
        { _id: { $in: communityIds } }, // Find communities by their IDs
        { $set: { status, updated_at: new Date() } } // Update status & timestamp
      );

      return result; // Contains modifiedCount (number of communities updated)
    } catch (error) {
      console.error("❌ Error in bulkUpdateCommunityStatus:", error);
      throw error;
    }
  }

  static async getMilestoneAchievedAmount(milestone_id: string): Promise<any> {
    try {
      if (!milestone_id) {
        throw new CustomError("missing required fields", 400);
      }

      const milestone = await CommunityClient.getMilestone(milestone_id);

      return milestone.achieved_amount;
    } catch (error) {
      throw error;
    }
  }

  static async updateCommunityAmount(community_id: string, amount: number) {
    try {
      if (!community_id || isNaN(amount)) {
        throw new CustomError("Missing required fields", 400);
      }

      const community = await CommunityClient.getCommunity(community_id);

      if (amount > community.net_fund_amt - community.current_amount) {
        throw new CustomError("Amount exceeds required amount", 400);
      }

      const milestones = await CommunityClient.getMilestones(community_id);

      let previous_amount = 0;
      let toAdd = amount;

      for (const milestone of milestones) {
        milestone.required_amount = milestone.target_amount - previous_amount;
        previous_amount = milestone.target_amount;
      }

      for (const milestone of milestones) {
        if (toAdd <= 0) break;
        let now_required = milestone.required_amount - milestone.achieved_amount;
        if (now_required <= toAdd) {
          milestone.achieved_amount += now_required;
          toAdd -= now_required;
        } else {
          milestone.achieved_amount += toAdd;
          toAdd = 0;
        }
        if (milestone.achieved_amount == milestone.required_amount) {
          milestone.status = "completed";
        }
      }

      console.log(milestones);

      await Promise.all(
        milestones.map((m: any) =>
          CommunityClient.updateMilestone(
            m._id,
            Number(m.achieved_amount),
            m.status
          )
        )
      );

      await CommunityClient.updateCommunityAmount(
        community_id,
        Number(amount) + Number(community.current_amount)
      );

      return;
    } catch (error) {
      throw error;
    }
  }

  static async isUserAdmin(
    community_id: string,
    user_id: string
  ): Promise<boolean> {
    try {
      if (!community_id || !user_id) {
        throw new CustomError("missing required fields", 400);
      }

      const community = await CommunityClient.getCommunity(community_id);

      if (community.admin_id !== String(user_id)) {
        return false;
      }

      return true;
    } catch (error) {
      throw error;
    }
  }

  static async updateCommunityExpiringDate(
    community_id: string,
    expiring_date: string
  ): Promise<any> {
    try {
      if (!community_id || !expiring_date) {
        throw new CustomError("missing required fields", 400);
      }

      const community = await CommunityClient.getCommunity(community_id);

      if (community.expiring_date < new Date()) {
        throw new CustomError("Community has already expired", 400);
      }

      const data = await CommunityClient.updateCommunityExpiringDate(
        community_id,
        expiring_date
      );

      return data;
    } catch (error) {
      console.error("❌ Error updating community statuses:", error);
      throw error;
    }
  }  
  
  static async getExpiringCommunities(expiryDate: Date) {
    return await CommunityModel.find({ expiring_date: expiryDate });
  }
}
