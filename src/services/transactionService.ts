import TransactionClient from "../clients/transactionClient";
import CustomError from "../middlewares/errorHandlingMiddleware";

export default class TransactionService {
  static async createTransaction(user_id: string, milestone_id: string, amount: number): Promise<any> {
    try {
        if (!user_id || !milestone_id || !amount) {
            throw new CustomError("missing required fields", 400);
        }

        const data = await TransactionClient.createTransaction(user_id, milestone_id, amount);

        return data;
    } catch (error) {
      throw error;
    }
  }
}