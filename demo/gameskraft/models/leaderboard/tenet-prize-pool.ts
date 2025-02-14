export interface TenetPrizePoolAPIResponse {
    id: number;
    linkId: string;
    name: string;
    poolType: string;
    poolAmount: number;
    poolCalculation: string;
    maxUsers: number | null;
    poolAmountPerUser: number | null;
    prizeStructures: PrizeStructure[];
    meta: any | null;
};


export interface PrizeStructure {
    createdAt: string | null;
    updatedAt: string | null;
    id: number;
    prizePoolId: number;
    name: string;
    description: string;
    type: string;
    prizeStructureCalculation: string;
    rewardCode: string;
    rewardMeta: string; // Ideally, this would be another interface, but for simplicity, we'll keep it as a string.
    rewardType: string;
    ranks: Rank[];
    upperUserIndex: number;
    scoringThreshold: number;
    dynamicRankConfig: any | null;
}


export interface Rank {
    createdAt: string;
    updatedAt: string;
    id: number;
    prizeStructureId: number;
    fromRank: number;
    endRank: number;
    isFixed: boolean;
    transactionPercentage: number;
    transactionAmount: number;
    fixedAmount: number | null;
}