import CommunityClient from "../clients/communityClient";
import CustomError from "../middlewares/errorHandlingMiddleware";

export default class CommunityService {
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
}
