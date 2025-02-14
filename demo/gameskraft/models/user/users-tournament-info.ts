import { UserGameplaySettingsResponse } from "../zodiac/gameplay";

export default interface UsersTournamentInfo{
    usersDetailsInfo: Array<UserDetailInfo>,
    usersPanHashInfo: Array<UserPanDetailInfo>,
    usersGameplaySettings: Array<UserGameplaySettingsResponse>
}


export interface UserDetailInfo {
    userId: number,
    vendorId: number,
    avatarUrl: string,
    chatBan: boolean,
}

export interface UserPanDetailInfo {
    userId: number,
    vendorId: number,
    userPanHash: string | null,
}

