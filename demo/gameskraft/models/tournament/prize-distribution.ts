import TournamentCurrency from "./enums/tournament-currency";
import PrizeDistributionType from "./enums/prize-distribution-type";

export default interface PrizeDistribution {
  primaryCurrency?: TournamentCurrency;
  secondaryCurrency?: TournamentCurrency;
  prizeDistributionType?: PrizeDistributionType;
  overlayPercent?: number;
  prizeDistributionGroupId?: number;
}

