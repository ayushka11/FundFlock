import { Request, Response, RequestHandler } from "express";
import { Community } from "../models/Community"; // Ensure the import is correct

export const createCommunity: RequestHandler = async (req, res) => {
  try {
    const { community_name, description, admin, members, manager, net_fund_amt } = req.body;

    const newCommunity = new Community({
      community_name,
      description,
      admin,
      members,
      manager,
      net_fund_amt
    });

    const savedCommunity = await newCommunity.save();
    res.status(201).json(savedCommunity);
  } catch (error) {
    console.error("Error creating community:", error);
    res.status(500).json({ error: "Failed to create community", details: error.message });
  }
};

export const getCommunities: RequestHandler = async (req, res) => {
  try {
    const communities = await Community.find();
    res.status(200).json(communities);
  } catch (error) {
    console.error("Error fetching communities:", error);
    res.status(500).json({ error: "Failed to fetch communities", details: error.message });
  }
};

export const getCommunityById: RequestHandler = async (req, res) => {
  try {
    const communityId = parseInt(req.params.community_id, 10); // Ensure it's a number

    if (isNaN(communityId)) {
      res.status(400).json({ error: "Invalid community ID. It must be a number." });
      return; // Ensure function exits after sending a response
    }

    const community = await Community.findOne({ community_id: communityId });

    if (!community) {
      res.status(404).json({ error: "Community not found" });
      return; // Ensure function exits after sending a response
    }

    res.status(200).json(community);
  } catch (error) {
    console.error("Error fetching community:", error);
    res.status(500).json({ error: "Failed to fetch community", details: error.message });
  }
};
