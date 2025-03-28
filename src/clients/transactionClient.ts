import TransactionModel from "../models/transactions";
import CommunityModel from "../models/communities";
import UserModel from "../models/users";
import { v4 as uuidv4 } from "uuid";
import { ObjectId } from "mongoose";

interface TransactionResponse {
  transaction_id: string;
  community_name?: string;
  username?: string;
  amount: number;
}

export default class TransactionClient {
  static async createTransaction(
    user_id: string,
    community_id: string,
    amount: number
  ): Promise<any> {
    try {
      const transaction = new TransactionModel({
        user_id,
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
    user_id: string,
    pageNumber: number
  ): Promise<{ transactions: TransactionResponse[]; isLastPage: boolean }> {
    try {
      const pageSize = 10;
      const skip = (pageNumber - 1) * pageSize;

      const transactions = await TransactionModel.find({ user_id })
        .select("transaction_id community_id amount")
        .skip(skip)
        .limit(pageSize + 1)
        .lean();

      if (transactions.length === 0)
        return { transactions: [], isLastPage: true };

      const communityIds = transactions
        .slice(0, pageSize)
        .map((txn) => txn.community_id as unknown as ObjectId);

      const communities = await CommunityModel.find({
        _id: { $in: communityIds },
      })
        .select("_id community_name")
        .lean();

      const communityMap: Record<string, string> = {};
      communities.forEach((community) => {
        communityMap[community._id.toString()] = community.community_name;
      });

      const isLastPage = transactions.length <= pageSize;
      const paginatedTransactions = transactions
        .slice(0, pageSize)
        .map((txn) => ({
          transaction_id: txn.transaction_id,
          community_name:
            communityMap[txn.community_id.toString()] || "Unknown",
          amount: txn.amount,
        }));

      return { transactions: paginatedTransactions, isLastPage };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  static async getTransactionsByCommunity(
    community_id: string,
    pageNumber: number
  ): Promise<{ transactions: TransactionResponse[]; isLastPage: boolean }> {
    try {
      const pageSize = 10;
      const skip = (pageNumber - 1) * pageSize;

      const transactions = await TransactionModel.find({ community_id })
        .select("transaction_id user_id amount")
        .skip(skip)
        .limit(pageSize + 1) // Fetch one extra record to check if there is another page
        .lean();

      if (transactions.length === 0)
        return { transactions: [], isLastPage: true };

      const userIds = transactions
        .slice(0, pageSize)
        .map((txn) => txn.user_id as unknown as ObjectId);

      const users = await UserModel.find({ _id: { $in: userIds } })
        .select("_id username")
        .lean();

      const userMap: Record<string, string> = {};
      users.forEach((user) => {
        userMap[user._id.toString()] = user.username;
      });

      const isLastPage = transactions.length <= pageSize;
      const paginatedTransactions = transactions
        .slice(0, pageSize)
        .map((txn) => ({
          transaction_id: txn.transaction_id,
          username: userMap[txn.user_id.toString()] || "Unknown",
          amount: txn.amount,
        }));

      return { transactions: paginatedTransactions, isLastPage };
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw error;
    }
  }

  static async getTransactionsByCommunityId(
    community_id: string
  ): Promise<any> {
    try {
      return TransactionModel.find({ community_id }).lean();
    } catch (error) {
      throw error;
    }
  }
}
