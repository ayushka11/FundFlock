export interface TableResultResponse {
    result: PlayerResult[],
}

export interface PlayerResult {
    userId?: number,
    userName: string,
    initialStackAmount: number,
    initialStackAmountInBB: string,
    winningStackAmount: number,
    winningStackAmountInBB: string,
    handsPlayed: number
}