import { User } from "../../request/aries/user";
import TournamentBuyInMethod from "../enums/tournament-buy-in-method";

export default interface TournamentEntryRequest {
  tournamentId?: number;
  user?: User;
  buyInMethod?: TournamentBuyInMethod;
  ticketId?: number;
  refId?: string;
  meta?: any;
  gstStateCode: number;
  otherVendorUsers: Array<UserIdsDetailsForFraudChecks>
}

export interface UserIdsDetailsForFraudChecks{
  userId: number,
  vendorId: number
}