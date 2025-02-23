import mongoose from "mongoose";

const communitySchema = new mongoose.Schema({
    community_name: { type: String, required: true },
    description: { type: String, required: true },
    admin_id: { type: String, required: true },
    manager_id: { type: String, required: true },
    member_ids: { type: Array, required: true },
    net_fund_amt: { type: Number, required: true },
    current_amount: { type: Number, default: 0 },
    milestones_ids: { type: Array, required: true },
    expiring_date: { type: Date, required: true },
    created_at: { type: Date, required: true },
    updated_at: { type: Date, required: true },
});

export const CommunityModel = mongoose.model("Community", communitySchema);

export default CommunityModel;