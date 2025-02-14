interface RewardData {
    userId: string;
    currencyCode: string;
    packId: string;
    amount: number;
    referenceId: string;
    transactionId: string;
    rewardMeta: string;
}
  
export interface RewardEvent {
eventName: string;
tenantId: string;
subOrgId: string;
data: RewardData;
}