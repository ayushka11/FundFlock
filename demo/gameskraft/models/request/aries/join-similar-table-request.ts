import { ILocationMeta } from "../../location";
import { User } from "./user";

export interface JoinSimilarTableRequest {
  user: User,
  locationMeta: ILocationMeta,
  roomId: string,
  ignoreTables?: number[]
}
