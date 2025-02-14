export interface UserPslStats {
    userId?: number;
    vendorId?: number;
    isTicketClaimed?: boolean;
    registeredTournamentIds?: Array<number>;
    playedTournamentIds?: Array<number>;
    createdAt?: string;
    updatedAt?: string;
}