import { TablePlayersResponse } from "./game-server/table-player-response";
import { TablePlayersResponse as AriesTablePlayersResponse } from "./aries/table-player-response";

export interface TablePlayer {
    currentStack: number,
    name: string,
    userId?: string,
    vendorId: number,
    showVendorId?: boolean,

}

export class TablePlayersDetails {
    averagePot?: number;
    averageStack?: number;
    playerList?: TablePlayer[];

    static convertGsResponse(resp: TablePlayersResponse): TablePlayersDetails {

        return {
            averagePot: resp?.ap,
            playerList: (resp?.pl || []).map((player) => {
                return {
                    currentStack: player?.cs,
                    name: player?.na,
                    vendorId: player?.di,
                    showVendorId: player?.ds
                }
            })
        }
    }

    static convertAriesResponse(resp: AriesTablePlayersResponse): TablePlayersDetails {

        return {
            averageStack: resp?.averageStack,
            playerList: (resp?.playerList || []).map((player) => {
                return {
                    currentStack: player?.currentStackAmount,
                    name: player?.userName,
                    userId: player?.userId,
                    vendorId: player?.vendorId,
                }
            })
        }
    }
}