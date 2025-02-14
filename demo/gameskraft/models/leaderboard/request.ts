export interface GetLeaderboardsFromGroupsRequest{
    campaignTag: string,
    roomIds: string[],
    selectedDate: string,
}

export interface GetChildLeaderboardDetailsByIdRequest{
    lbGroupId: number,
    lbChildId: number,
    lbCampaignTag?: string,
    vendorId: string
}