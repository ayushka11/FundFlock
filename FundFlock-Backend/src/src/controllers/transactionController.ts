import { Request, Response, RequestHandler } from "express";
import { Transaction } from "../models/Transaction";
import { v4 as uuidv4 } from "uuid";

export const createTransaction: RequestHandler = async (req, res) => {
  try {
    const { userId, communityId, milestone_id, amount } = req.body;

    const newTransaction = new Transaction({
      transactionId: uuidv4(), // Generate UUID for transaction ID
      userId,
      communityId,
      milestone_id,
      amount
    });

    const savedTransaction = await newTransaction.save();
    res.status(201).json(savedTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Failed to create transaction", details: error.message });
  }
};

export const getTransactions: RequestHandler = async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Failed to fetch transactions", details: error.message });
  }
};

export const getTransactionById: RequestHandler = async (req, res) => {
  try {
    const { transactionId } = req.params; // UUID is a string

    const transaction = await Transaction.findOne({ transactionId });

    if (!transaction) {
      res.status(404).json({ error: "Transaction not found" });
      return;
    }

    res.status(200).json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Failed to fetch transaction", details: error.message });
  }
};
