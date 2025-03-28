import CommunityModel from "../models/communities";
import MilestoneModel from "../models/milestones";

export default class CommunityClient {
  static async createCommunity(
    community_name: string,
    description: string,
    member_ids: string[],
    admin_id: string,
    net_fund_amt: number,
    expiring_date: string
  ): Promise<any> {
    const manager_id = admin_id;
    const created_at = new Date();
    const updated_at = new Date();
    return new CommunityModel({
      community_name,
      description,
      member_ids,
      admin_id,
      manager_id,
      net_fund_amt,
      expiring_date,
      created_at,
      updated_at,
    })
      .save()
      .then((community) => community.toObject());
  }

  static async createMilestones(
    community_id: string,
    milestones: number[]
  ): Promise<any> {
    const milestonesData = milestones.map((target_amount: number) => ({
      community_id,
      target_amount,
      status: "pending",
      achieved_amount: 0,
      created_at: new Date(),
      updated_at: new Date(),
    }));

    return MilestoneModel.insertMany(milestonesData).then((milestones: any[]) =>
      milestones.map((milestone: any) => milestone.toObject())
    );
  }

  static async updateCommunityMilestones(
    community_id: string,
    milestone_ids: string[]
  ): Promise<any> {
    return CommunityModel.findOneAndUpdate(
      { _id: community_id },
      { milestones_ids: milestone_ids },
      { new: true }
    ).then((community) => community.toObject());
  }

  static async getCommunity(community_id: string): Promise<any> {
    return CommunityModel.findOne({ _id: community_id }).then((community) =>
      community.toObject()
    );
  }

  static async getMilestones(community_id: string): Promise<any> {
    return MilestoneModel.find({ community_id }).then((milestones) =>
      milestones.map((milestone) => milestone.toObject())
    );
  }

  static async updateMany(filter: object, update: object) {
    return await CommunityModel.updateMany(filter, update);
  }
  
  static async getMilestone(milestone_id: string): Promise<any> {
    return MilestoneModel.findOne({ _id: milestone_id }).then((milestone) =>
      milestone.toObject()
    );
  }

  static async updateCommunityAmount(
    community_id: string,
    current_amount: number
  ): Promise<any> {
    return CommunityModel.findOneAndUpdate(
      { _id: community_id },
      { current_amount, updatedAt: Date.now() },
      { new: true }
    ).then((community) => community.toObject());
  }

  static async updateMilestone(
    milestone_id: string,
    achieved_amount: number,
    status: string
  ): Promise<any> {
    return MilestoneModel.findOneAndUpdate(
      { _id: milestone_id },
      { achieved_amount, status, updatedAt: Date.now() },
      { new: true }
    ).then((milestone) => milestone.toObject());
  }

  static async updateCommunityExpiringDate(
    community_id: string,
    expiring_date: string
  ): Promise<any> {
    return CommunityModel.findOneAndUpdate(
      { _id: community_id },
      { expiring_date: new Date(expiring_date), updatedAt: Date.now() },
      { new: true }
    ).then((community) => community.toObject());
  }
}
