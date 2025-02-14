export interface RoyaltyBenefits {
    withdrawalAmtLimit : number,
    withdrawalCountLimit : number,
    coinConversionFactor : number,
}


export interface RoyaltyUserHomeInfo {
    userId?: number,
    vendorId?: number,
    status?: number,
    currentLevelId?: number,
    coinConversionFactor?: number,
    coinsInCurrentLevel?: number
    redeemableCoins?: number,
    totalCoinGenerated?: number,
    totalRakeGenerated?: number,
    totalAmountEarned?: number,
    isManualRedeemEnabled?: boolean,
    dcsAmtLimit?: number,
    dcsExhaustedLimit?: number,
    dcsExhaustionTime?: string,
    dcsExhaustedTimeLimit?: number,
    dcsConversionPercent?: number,
    levelName?: string,
    activeImageUrl?: string,
    inactiveImageUrl?: string,
    currentLevelActiveImageUrl?: string,
    currentLevelInactiveImageUrl?: string,
    color?: string,
    userNextLevelName?: string,
    userNextLevelId?: number
    isUserBanned?: boolean
    nextAutoRedeemDate?: string,
    redeemableBalance?: number,
    totalCoinsRedeemed?: number,
    totalCoinsForNextLevel?: number,
    coinsLeftForNextLevel?: number,
    currentLevelBaseValue?: number,
    isLevelXUser?: boolean,
    totalDCSAwardedViaAC?: number,
    totalDCSCoinsAwardedViaAC?: number,
    redeemableCoinsV2?: number,
    redeemableBalanceV2?: number,
    royaltyVersion?: string,
};
