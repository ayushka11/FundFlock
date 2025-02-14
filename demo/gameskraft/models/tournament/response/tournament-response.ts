import {AriesGameVariant} from "../../enums/aries-game-variant";
import TournamentStatusAries from "../enums/tournament-status-aries";
import AriesTournamentType from "../enums/aries-tournament-type";
import TournamentFeature from "../tournament-feature";
import PrizeDistribution from "../prize-distribution";
import TournamentBuyInMethod from "../enums/tournament-buy-in-method";
import TournamentPrizeType from "../enums/tournament-prize-type";
import { TournamentStats } from '../tournament-stats';
import TournamentVendorNameMapping from "../tournament-vendor-name-mapping";
import PrizeStructureLobby from "./prize-structure-lobby";
import BlindLevel from "../blind-level";
import { TournamentSpeed } from "../../enums/tournament/tournament-speed";

export default interface TournamentResponse {
  id?: number;
  gameVariant?: AriesGameVariant;
  status?: TournamentStatusAries;
  tournamentType?: AriesTournamentType;
  tournamentSpeed?: TournamentSpeed;
  feature?: TournamentFeature;
  tag?: Array<string>;
  prizeDistribution?: PrizeDistribution
  registrationAmount?: number;
  registrationFee?: number;
  reentryFee?: number;
  reentryAmount?: number;
  registerBuyinMethod?: TournamentBuyInMethod[];
  reentryBuyinMethod?: TournamentBuyInMethod[];
  maxSeatsPerTable?: number;
  currentBlindLevelId?: number;
  currentBlindLevelStartTs?: number;
  currentBlindLevelPauseTs?: number;
  currentBlindLevelEndTs?: number;
  canReenter?: number;
  prizePool?: number;
  prizeAssetCount?: number;
  prizeAssetType?: TournamentPrizeType;
  announceTime?: number;
  registrationStartTime?: number;
  startTime?: number;
  lateRegistrationEndTime?: number;
  completedAt?: number;
  canceledAt?: number;
  breakDuration?: number;
  breakStartTs?: number;
  postCompletionListingDuration?: number;
  remainingPlayers?: number;
  registerCount?: number;
  reentryCount?: number;
  vendorMetadata?: Array<TournamentVendorNameMapping>
  reentryLimit?: number;
  minPlayers?: number;
  maxPlayers?: number;
  prizeStructureList?: PrizeStructureLobby[];
  blindLevelDuration?: number;
  blindStructureGroupId?: number;
  blindLevels?: BlindLevel[];
  playerInitialStack?: number;
  totalEntriesRequired?: number;
  entriesRequired?: number;
  stats: TournamentStats;
  parentTournamentId?: number
}
