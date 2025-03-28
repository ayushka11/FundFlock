import express, { Request, Response } from "express";
import { MessageModel } from "../models/message";

const router = express.Router();

// Get paginated chat messages
router.get("/:communityId", async (req: Request, res: Response) => {
  try {
    const { communityId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const messages = await MessageModel.find({ community_id: communityId })
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.json(messages.reverse());
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
});

export default router;
