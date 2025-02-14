export default interface LeaderboardResponse{
  childLeaderboardId: number;
  status: string;
  startTime: string;
  endTime: string;
  joinStatus: string;
  leaderboardGroupId: number;
  roomIds: string[];
  campaignTag: string;
  leaderboardGroupJoinedStatus: string;
  leaderboardGroupJoinedCount: number;
  lbGroupStatus: string;
  lbGroupCreatedAt: string;
  lbGroupUpdatedAt: string;
  lbGroupEndTime?: string;
  lbGroupStartTime?: string;
  description: string | null;
  meta: object,
  scoreboard?: ScoreBoardResponse[];
  deltaRanksScoreboard?: ScoreBoardResponse[];
  userRanksScoreboard?: ScoreBoardResponse;
  prizePool?: number,
  placesPaid?: number,
  gameVariants?: Array<string>,
  gameStakes?: Array<string>,
  gameBlinds?: Array<string>,
  hourRange?: string,
  leaderboardDate?: string,
  lbDateRange?: string,
  campaignName?: string,
  scoringThreshold: number
}


export interface ScoreBoardResponse{
  userId: string,
  userName: string,
  rank?: number,
  vendorId: string,
  rewardAmount: number,
  rewardCurrencyIdentifier?: string,
  score: number,
  userAvatarUrl?: string,
}


export interface LeaderboardCampaign {
  id?: number;
  name?: string;
  byLine?: string;
  startTime?: string;
  endTime?: string;
  listingStartTime?: string;
  listingEndTime?: string;
  totalPrizePool?: number;
  status?: number;
  placesShown?: number;
  tag?: string;
  tnc?: string;
  vendorIds?: string[];
  vendorMetadata?: LeaderboardCampaignVendorMetadata;
  metaData?: string;
  createdAt?: string;
  updatedAt?: string;
  activeLeaderboards?: number;
  statusString?: string;
  dateRange?: string;
  bannerLink?: string;
}


interface LeaderboardCampaignVendorMetadata{
  vendorNameMapping:Array<LeaderboardCampaignVendorNameMapping>
}


interface LeaderboardCampaignVendorNameMapping{
  vendorId?: number;
  vendorCampaignName?: string;
}