export interface TableConfig {
    smallBlind: number,
    bigBlind: number,
    gameVariant: string,
    gameType: number,
    seatReserveDuration?: number,
    topupDuration?: number,
    isRitEnabled?: boolean,
    isEvChopEnabled?: boolean,
    isPotOfGoldEnabled?: boolean,
}