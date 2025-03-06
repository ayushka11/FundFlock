import express from "express";
import {
  createTransaction,
  getTransactions,
  getTransactionById,
} from "../controllers/transactionController";

const router = express.Router();

// 🔹 Route to create a new transaction
router.post("/", createTransaction);

// 🔹 Route to get all transactions
router.get("/", getTransactions);

// 🔹 Route to get a transaction by UUID
router.get("/:transactionId", getTransactionById);

export default router;
