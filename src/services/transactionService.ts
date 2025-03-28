import TransactionClient from "../clients/transactionClient";
import CustomError from "../middlewares/errorHandlingMiddleware";

export default class TransactionService {
  static async createTransaction(
    user_id: string,
    community_id: string,
    amount: number
  ): Promise<any> {
    try {
      if (!user_id || !amount) {
        throw new CustomError("missing required fields", 400);
      }

      const data = await TransactionClient.createTransaction(
        user_id,
        community_id,
        amount
      );

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getTransactionsByUser(user_id: string, pageNumber: number): Promise<any> {
    try {
      if (!user_id || !pageNumber) {
        throw new CustomError("missing required fields", 400);
      }

      const data = await TransactionClient.getTransactionsByUser(user_id, pageNumber);

      return data;
    } catch (error) {
      throw error;
    }
  }

  static async getTransactionsByCommunity(community_id: string, pageNumber: number): Promise<any> {
    try {
      if (!community_id) {
        throw new CustomError("missing required fields", 400);
      }

      const data = await TransactionClient.getTransactionsByCommunity(
        community_id,
        pageNumber
      );

      return data;
    } catch (error) {
      throw error;
    }
  }
}
