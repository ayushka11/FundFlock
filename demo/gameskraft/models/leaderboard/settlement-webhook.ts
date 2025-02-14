import { TenetPrizePoolAPIResponse } from "./tenet-prize-pool"

export default interface BulkSettlementEvent {
    prizeStructure: PrizeStructure,
    prizePool: TenetPrizePoolAPIResponse
    userSettlement: UserSettlement[],
    meta: {
        childLeaderboardId: number,
        leaderboardId: number,
        tag: string,
        categories: Array<string>
    }
}

export interface PrizeStructure {
    id: number,
    name: string,
    scoringThreshold: number,
    ranks: Array<PrizeOnRank>,
    enabled: boolean
};

export interface PrizeOnRank {
    fromRank: number,
    toRank: number,
    rewardCode: string,
    rewardMeta: string,
}

export interface RewardMeta {
    createdAt: string,
    rewardId: number,
    rewardGroupCode?: string,
    lifetimeUsage?: number,
    applyRoundOff?: boolean,
    description?: string,
    rewardCode: string,
    rewardGroupName: string,
    tagName: Array<string>,
    enabled: boolean,
    currencies: RewardCurrencies[],
    updatedAt: string
}

interface RewardCurrencies {
    isDuration?: boolean,
    midnightActivation?: boolean,
    isTransactional?: boolean,
    currencyIdentifier?: string,
    metaData?: object,
    transactionPercent?: number,
    maxLimit?: number,
    isBooster?: boolean,
    expiryTime?: string,
    isOffset?: boolean,
    midnightExpiry?: boolean,
    isFixed?: boolean,
    cashbackRewardConfigId?: number
}

export interface UserSettlement {
    transactionId: string,
    transactionAmount: number,
    userId: string,
    rewardCode: string,
    meta: {
        vendorId: string
    },
    source: string,
    referenceId: string,
    rank: number,
    score: number
}