import TransactionModel from "../models/transactions";
import CommunityModel from "../models/communities";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongoose";

interface TransactionResponse {
  transaction_id: string;
  community_name: string;
  amount: number;
}

export default class TransactionClient {
  static async createTransaction(
    user_id: string,
    milestone_id: string,
    community_id: string,
    amount: number
  ): Promise<any> {
    try {
      const transaction = new TransactionModel({
        user_id,
        milestone_id,
        community_id,
        amount,
        created_at: new Date(),
        updated_at: new Date(),
      });

      const data = await transaction.save();

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getTransactionsByUser(
    user_id: string
  ): Promise<TransactionResponse[]> {
    try {
      const transactions = await TransactionModel.find({ user_id })
        .select("transaction_id community_id amount")
        .lean();

      if (transactions.length === 0) return [];

      const communityIds = transactions.map(
        (txn) => txn.community_id as unknown as ObjectId
      );

      const communities = await CommunityModel.find({
        _id: { $in: communityIds },
      })
        .select("_id community_name")
        .lean();

      const communityMap: Record<string, string> = {};
      communities.forEach((community) => {
        communityMap[community._id.toString()] = community.community_name;
      });

      return transactions.map((txn) => ({
        transaction_id: txn.transaction_id,
        community_name: communityMap[txn.community_id.toString()] || "Unknown",
        amount: txn.amount,
      }));
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }
}
