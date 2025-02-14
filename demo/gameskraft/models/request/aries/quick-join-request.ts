import { ILocationMeta } from "../../location";
import { User } from "./user";

export interface QuickJoinGroupRequest {
  groupId: number,
  user: User,
  locationMeta: ILocationMeta
}
