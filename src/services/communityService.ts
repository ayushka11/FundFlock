import CommunityClient from "../clients/communityClient";

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
        return {
          status: {
            success: false,
            error: "missing required fields",
          },
          data: {},
        };
      }

      const data = await CommunityClient.createCommunity(
        community_name,
        description,
        member_ids,
        admin_id,
        net_fund_amt,
        expiring_date
      );

      return {
        status: {
          success: true,
        },
        data: data,
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

  static async createMilestones(
    community_id: string,
    milestones: number[]
  ): Promise<any> {
    try {
      if (!community_id || milestones.length === 0) {
        return {
          status: {
            success: false,
            error: "missing required fields",
          },
          data: {},
        };
      }

      const data = await CommunityClient.createMilestones(
        community_id,
        milestones
      );

      return {
        status: {
          success: true,
        },
        data: data,
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

  static async updateCommunityMilestones(
    community_id: string,
    milestone_ids: string[]
  ): Promise<any> {
    try {
      if (!community_id || milestone_ids.length === 0) {
        return {
          status: {
            success: false,
            error: "missing required fields",
          },
          data: {},
        };
      }

      const data = await CommunityClient.updateCommunityMilestones(
        community_id,
        milestone_ids
      );

      return {
        status: {
          success: true,
        },
        data: data,
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

  static async getCommunityHome(communities_ids: string[]): Promise<any> {
    try {
      const communities = await Promise.all(
        communities_ids.map((community_id) =>
          CommunityClient.getCommunity(community_id)
        )
      );

      const data = communities.map((community) => {
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
      data.forEach((community) => {
        const expiring_date = new Date(community.expiring_date);
        if (today > expiring_date) {
          community.status = "expired";
        } else {
          community.status = "active";
        }
      });
      console.log(data);

      return {
        status: {
          success: true,
        },
        data: data,
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
