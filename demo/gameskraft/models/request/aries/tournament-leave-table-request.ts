import { User } from "./user";

export interface TournamentLeaveTableRequest {
  tableId: string,
  tournamentId: number,
  user: User
}
