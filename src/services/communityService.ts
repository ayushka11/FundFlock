import CommunityClient from '../clients/communityClient';

export default class CommunityService {
    static async createCommunity(community_name: string, description: string, member_ids: string[], admin_id: string, net_fund_amt: number, expiring_date: string): Promise<any> {
        try {
            if (!community_name || !description || member_ids.length === 0 || !net_fund_amt || !expiring_date) {
                return {
                    status: {
                        success: false,
                        error: "missing required fields",
                    },
                    data: {},
                };
            }

            const data = await CommunityClient.createCommunity(community_name, description, member_ids, admin_id, net_fund_amt, expiring_date);

            return {
                status: {
                    success: true,
                },
                data: data,
            };
        } catch (error) {
            console.error(error);
            return {
                status: {
                    success: false,
                    error: "internal server error",
                },
                data: {},
            };
        }
    }

    static async createMilestones(community_id: string, milestones: number[]): Promise<any> {
        try {
            if (!community_id || milestones.length === 0) {
                return {
                    status: {
                        success: false,
                        error: "missing required fields",
                    },
                    data: {},
                };
            }

            const data = await CommunityClient.createMilestones(community_id, milestones);

            return {
                status: {
                    success: true,
                },
                data: data,
            };
        } catch (error) {
            console.error(error);
            return {
                status: {
                    success: false,
                    error: "internal server error",
                },
                data: {},
            };
        }
    }

    static async updateCommunityMilestones(community_id: string, milestone_ids: string[]): Promise<any> {
        try {
            if (!community_id || milestone_ids.length === 0) {
                return {
                    status: {
                        success: false,
                        error: "missing required fields",
                    },
                    data: {},
                };
            }

            const data = await CommunityClient.updateCommunityMilestones(community_id, milestone_ids);
            
            return {
                status: {
                    success: true,
                },
                data: data,
            };
        } catch (error) {
            console.error(error);
            return {
                status: {
                    success: false,
                    error: "internal server error",
                },
                data: {},
            };
        }
    }
}
