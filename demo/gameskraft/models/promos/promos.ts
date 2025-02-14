enum transactionType {
    PROMO_TRANSACTION = `123`
}
export interface promosData {
    amount:number,
    paymentMethod?:string,
    referenceId:string,
    promoCode?: string,
    transactionType?: string,
    addCashCount?: string
}


interface UserSegment {
    type: string;
    nthAddCashCount: number;
}

interface AddCashSlab {
    minAmount: number;
    rewardCode: string;
    reward: Record<string, any>; // Replace 'any' with the appropriate type if known
}

export interface Reward {
    code: string;
    details: string;//RewardDetails stringified
    parsedDetails?: RewardDetails;
}

export interface Currency {
    currencyIdentifier: string;
    cashbackRewardConfigId: number;
    maxLimit?: number;
    isFixed: boolean;
    fixedAmount?: number;
    isBooster: boolean;
    boosterValue?: number;
    isTransactional: boolean;
    transactionPercent: number;
    isOffset: boolean;
    isDuration: boolean;
    midnightActivation: boolean;
    midnightExpiry: boolean;
    expiryTime: string;
    durationInMinutes?:number;
    metaData?: string;
    currencyMeta?:any;
}
export interface RewardDetails {
    rewardCode: string;
    rewardGroupCode: string;
    rewardGroupName: string;
    lifetimeUsage: number;
    enabled: boolean;
    description: string;
    tagName: string[];
    currencies?: Currency[];
    createdAt: string;
    updatedAt: string;
}
export interface RewardSlab {
    priority: number;
    scoreFormula: string;
    rewards: Reward[];
    conditions: ICondition[];
    minValue: number;
    maxValue: number;
}

export interface ICondition {
    key: string;
    operator: string;
    value: string;
    type: string;
}

export interface OfferLimit {
    hourly: number;
    daily: number;
    weekly: number;
    monthly: number;
    lifeTime: number;
    maxPromotionClaimedLimit: number;
}

export interface Promotion {
    id: string;
    title: string;
    name: string;
    type: string;
    priority: number;
    userSegment: string;
    startTime: string;
    endTime: string;
    promoCode: string;
    meta: string;
    rewardSlabs: RewardSlab[];
    totalUsesCount: number;
    cohorts: any[];
    enabled: boolean;
    offerLimit: OfferLimit;
    eventName: string;
}


interface DefaultPromoCode {
    code?: string,
    min?: number,
    max?: number,
    bonusText?: string,
    ticketText?: string
}

export interface PackDetail {
    bonusType: string,
    bonusWeight: number
}

export interface AddCashPack {
    amount: number,
    worth: number,
    packDetails: PackDetail[],
}

export interface UserPromoResponse {
    walletBalance: number,
    minAmount: number,
    maxAmount: number,
    dailyAddCashLimit: number,
    monthlyAddCashLimit: number,
    dailyAddCash: number,
    monthlyAddCash: number,
    preferredPaymentMethod: any,
    defaultPromoCode?: DefaultPromoCode,
    addCashPacks: AddCashPack[],
}

export interface RoyaltyDetails {
    level?: string,
    percentageUtilized?: number,
    discountCreditBalance?: number,
    maxDiscountCreditAmount?: number,
    discountCreditBalanceResetDate?: string,
    isUserBanned?: boolean,
    isLevelXUser?: boolean,
    maxDepositAmountForDcs?: number,
    nextAvailableRoyaltyLevel?: string,
    nextAvailableRoyaltyLevelDcs?: number,
    nextAvailableRoyaltyLevelAmountForDcs?: number,
    isFtdUser?: boolean,
    royaltyLevelIcon?: string,
    userGstAmount?: number,
    nextAvailableRoyaltyLevelDcsLimit?: number,

}

interface BuyInBreakup {
    addCashAmount: number,
    gstAmount: number,
    discountCreditAmount?: number,
    discountCreditUtilisedAmount?: number,
}

export interface ISeatBenefits {
    tournamentName: string,
    tournamentDate: number,
    registerAmount: number,
    tournamentPrizePool: number,
}

export interface IBenefitDetails {
    lockedDcs?: number,
    tournamentDcs?: number,
    seat?: ISeatBenefits,
    totalBuyInValueInclBenefits: number
}

export interface AddCashPackV2 {
    amount: number,
    buyInValue: number,
    buyInWithBenefits: number,
    buyInBreakup: BuyInBreakup,
    showHotDeal?: boolean,
    promoCode?: string,
    benefits?:IBenefitDetails
}

export interface IBenefitValue {
    lockedDcs?: string | number,
    tournamentDcs?: number | string,
    seat?: number | string
}

export interface IBenefitDetail {
    slab: string,
    promoCode: string,
    benefits:IBenefitValue
}

export interface UserPromoResponseV2 {
    walletBalance: number,
    minAmount: number,
    maxAmount: number,
    dailyAddCashLimit: number,
    monthlyAddCashLimit: number,
    dailyAddCash: number,
    monthlyAddCash: number,
    preferredPaymentMethod: any,
    defaultPromoCode?: DefaultPromoCode,
    addCashPacks: AddCashPackV2[],
    royaltyDetails?: RoyaltyDetails,
    extraBenefits?: AddCashPackV2[],
    benefitDetails?: IBenefitDetail[]
}