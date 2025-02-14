import { UserNote, IUserNotesV2 } from "./user-note";

export interface HUDStats {
    hasValidGameplayStats: boolean,
    emptyStatsText: string,
    statsLabel: string,
    totalHandsPlayed: number,
    vpipPercentage: number,
    pfrPercentage: number,
    wtsdPercentage: number,
    wsdPercentage: number,
    threeBetPercentage:number,
    cBetPercentage:number
}

export interface UserGameplayStats {   
    NLHE?: HUDStats,
    PLO4?: HUDStats,
    PLO5?: HUDStats,
    PLO6?: HUDStats,
    [key: string]: HUDStats | undefined, 
}

export interface UserDetailsResponse {
    data: UserGameplayDetails;
}

export interface UserGameplayDetails {
    [userId: string]: {
        userNote: UserNote | undefined;
        userGameplayStats: UserGameplayStats | undefined;
    };
}

export interface IUserGameplayDetails {
    [userId: string]: {
        userNote: IUserNotesV2 | undefined;
        userGameplayStats: UserGameplayStats | undefined;
        displayPicture: string
    };
}
 