export interface TablePlayersResponse {
    averageStack: number,
    playerList: Array<{
        userName: string,
        userId: string,
        vendorId: number,
        currentStackAmount: number
    }>
}