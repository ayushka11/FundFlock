export interface PlayerTopupRequest {
    amount: number,
    roomId: string,
    success: boolean,
    ticketActive: boolean
}