import { TournamentUtil } from "../utils/tournament-util"
import { PlayerTournamentStatus } from "./enums/tournament/player-tournament-status"
import { PlayerMTTListResponse } from "./game-server/player-mtt-list"
export interface PlayerTournamentData {
    tournamentId: string,
    playerStatus: PlayerTournamentStatus
}


export interface PlayerTournamentViewList {
    tournamentId: string,
    viewList: Array<string>
}


export class PlayerMTTList {
    openedList: Array<PlayerTournamentData>
    viewingList: Array<PlayerTournamentViewList>

    static convertGsResponse(response: PlayerMTTListResponse, viewListResponse: any) {
        const playerMttList = new PlayerMTTList();
        playerMttList.openedList = []
        playerMttList.viewingList = []

        for (let key in response) {
            playerMttList.openedList.push({
                tournamentId: key,
                playerStatus: TournamentUtil.getPlayerTournamentStatus(response[key])
            })
        }
        for (let key in viewListResponse) {
            playerMttList.viewingList.push({
                tournamentId: key,
                viewList: viewListResponse[key]
            })
        }
        return playerMttList
    }

    static convertGsResponseV3(response: PlayerMTTListResponse, viewListResponse: any) {
        const playerMttList = new PlayerMTTList();
        playerMttList.openedList = []
        playerMttList.viewingList = []

        for (let key in response) {
            playerMttList.openedList.push({
                tournamentId: key,
                playerStatus: TournamentUtil.getPlayerTournamentStatusV3(response[key])
            })
        }
        for (let key in viewListResponse) {
            playerMttList.viewingList.push({
                tournamentId: key,
                viewList: viewListResponse[key]
            })
        }
        return playerMttList
    }

    static convertGsPlayerStatusResponse(response: PlayerMTTListResponse): Array<PlayerTournamentData> {
        const playerMttList: PlayerMTTList = new PlayerMTTList();
        playerMttList.openedList = []

        for (let key in response) {
            playerMttList.openedList.push({
                tournamentId: key,
                playerStatus: TournamentUtil.getPlayerTournamentStatus(response[key])
            })
        }
        return playerMttList.openedList
    }
}