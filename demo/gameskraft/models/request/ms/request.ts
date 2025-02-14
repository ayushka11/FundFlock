import { MsCommand } from "../../enums/ms-command";

export interface MsRequest {
    x: MsCommand,
    pl: any
}