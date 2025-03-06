import { Request, Response, RequestHandler } from "express";
import { Milestone } from "../models/milestone";

export const createMilestone: RequestHandler = async (req, res) => {
  try {
    const { community_id, target_amount, status } = req.body;

    const newMilestone = new Milestone({
      community_id,
      target_amount,
      status
    });

    const savedMilestone = await newMilestone.save();
    res.status(201).json(savedMilestone);
  } catch (error) {
    console.error("Error creating milestone:", error);
    res.status(500).json({ error: "Failed to create milestone", details: error.message });
  }
};

export const getMilestones: RequestHandler = async (req, res) => {
  try {
    const milestones = await Milestone.find();
    res.status(200).json(milestones);
  } catch (error) {
    console.error("Error fetching milestones:", error);
    res.status(500).json({ error: "Failed to fetch milestones", details: error.message });
  }
};

export const getMilestoneById: RequestHandler = async (req, res) => {
  try {
    const milestoneId = parseInt(req.params.milestone_id, 10); // Ensure it's a number

    if (isNaN(milestoneId)) {
      res.status(400).json({ error: "Invalid milestone ID. It must be a number." });
      return;
    }

    const milestone = await Milestone.findOne({ milestone_id: milestoneId });

    if (!milestone) {
      res.status(404).json({ error: "Milestone not found" });
      return;
    }

    res.status(200).json(milestone);
  } catch (error) {
    console.error("Error fetching milestone:", error);
    res.status(500).json({ error: "Failed to fetch milestone", details: error.message });
  }
};
