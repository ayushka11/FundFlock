import TournamentPrizeType from "../enums/tournament-prize-type";

export default interface PrizeStructureLobby{
  userName?: string;
  userId?: number;
  prizeValue?: number;
  prizeType?: TournamentPrizeType;
  primaryAmount?: number;
  secondaryAmount?: number;
  rank?: number;
}
