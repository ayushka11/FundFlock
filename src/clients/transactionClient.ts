import TransactionModel from "../models/transactions";
import { v4 as uuidv4 } from "uuid";

export default class TransactionClient {
  static async createTransaction(
    user_id: string,
    milestone_id: string,
    amount: number
  ): Promise<any> {
    try {
      const transaction = new TransactionModel({
        user_id,
        milestone_id,
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
}
