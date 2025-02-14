import { UserBetSetting } from "../../zodiac/gameplay";

export interface User {
    id: number,
    vendorId: number,
    userName?: string,
    userIpAddress?: string,
    userMobileHash?: string,
    userPanHash?: string,
    userStateCode?: number,
    betSettings?: Array<UserBetSetting>,
    enablePostBB?: boolean,
    deviceInfo?: string,
    isChatBan?: boolean,
    userAvatar?: string,
    autoTopUpSetting?: UserAutoTopUpSetting
}

export interface UserAutoTopUpSetting {
    setting?: string,
    enableAutoTopUp?: boolean,
    topUpThresholdPrecentage?: number,
    topUpStackPercentage?: number
}
