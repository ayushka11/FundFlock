import { GsCommand } from "../../enums/gs-command";
import { LeaveTableRequestData } from "./leave-table-request-data";
import { RebuyRequestData } from "./rebuy-request-data";
import { ReserveRoomRequestData } from "./reserve-room-request-data";
import { SitAtTableRequestData } from "./sit-at-table-request-data";
import { TopupRequestData } from "./top-up-request-data";

export interface GsRequestPayload {
    command: GsCommand,
    data: any
}