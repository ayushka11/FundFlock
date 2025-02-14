export interface UserGameplaySettingsResponse {
    user_id: number;
    vendor_id?: number;
    gameplay_config: UserGameplaySettings;
}

export interface UserGameplaySettings {
    bet_settings: Array<UserBetSetting>;
    game_settings: Array<UserGameSetting>;
    sound_settings: Array<UserSoundSetting>;
    auto_top_up_setting?: UserAutoTopUpSetting;
}

export interface UserBetSettingsResponse {
    user_id: number;
    gameplay_config: UserBetSettings;
}

export interface UserBetSettings {
    bet_settings: Array<UserBetSetting>;
}

export interface UserGameSettingsResponse {
    user_id: number;
    gameplay_config: UserGameSettings;
}

export interface UserGameSettings {
    game_settings: Array<UserGameSetting>;
}

export interface UserSoundSettingsResponse {
    user_id: number;
    gameplay_config: UserSoundSettings;
}

export interface UserSoundSettings {
    sound_settings: Array<UserSoundSetting>;
}

export interface UserBetSetting {
    id: number;
    button_index: number;
    game_type: string;
    street_indicator: string;
    default_bet_metric: string;
    value: number;
}

export interface UserGameSetting {
    setting: string;
    setting_label: string;
    setting_description: string;
    value: boolean;
}

export interface UserSoundSetting {
    setting: string;
    setting_label: string;
    setting_description: string;
    value: boolean
}

export interface IUserGameplaySettings {
    betSettings: { [key: string]: Array<IUserBetSetting> };
    gameSettings: Array<IUserGameSetting>;
    soundSettings: Array<IUserSoundSetting>;
    autoTopUpSetting?: IUserAutoTopUpSetting;
}

export interface IUserBetSettings {
    betSettings: Array<IUserBetSetting>;
}

export interface IUserGameSettings {
    gameSettings: Array<IUserGameSetting>;
}

export interface IUserSoundSettings {
    soundSettings: Array<IUserSoundSetting>;
}

export interface IUserBetSetting {
    id: number;
    buttonIndex: number;
    gameType: string;
    streetIndicator: string;
    defaultBetMetric: string;
    value: number;
}

export interface IUserGameSetting {
    setting: string;
    settingLabel: string;
    settingDescription: string;
    value: boolean;
}

export interface IUserSoundSetting {
    setting: string;
    settingLabel: string;
    settingDescription: string;
    value: boolean;
}

export interface UpdateUserBetSettingsRequest {
    settings: Array<UpdateUserBetSetting>;
}

export interface UpdateUserBetSetting {
    id: number;
    value: number;
}

export interface UpdateUserBetSettingsPayload {
    settings: Array<UpdateUserBetSetting>;
}

export interface UpdateUserGameSettingsRequest {
    settings: Array<UpdateUserGameSetting>;
}

export interface UpdateUserGameSetting {
    setting: string;
    value: number;
}

export interface UpdateUserGameSettingsPayload {
    settings: Array<UpdateUserGameSetting>;
}

export interface UpdateUserSoundSettingsRequest {
    settings: Array<UpdateUserSoundSetting>;
}

export interface UpdateUserSoundSetting {
    setting: string;
    value: number;
}

export interface UpdateUserSoundSettingsPayload {
    settings: Array<UpdateUserSoundSetting>;
}
export interface UpdateUserAutoTopUpSetting{
    enableAutoTopUp: boolean,
    topUpThresholdPrecentage: number,
    topUpStackPercentage: number,
}

export interface IUserAutoTopUpSetting {
    setting: string;
    settingLabel: string;
    settingDescription: string;
    value: boolean;
    config?: UserAutoTopUpConfig;
}

export interface UserAutoTopUpSetting {
    setting: string;
    setting_label: string;
    setting_description: string;
    value: boolean;
    config?: UserAutoTopUpConfig;
}

export interface UpdateUserAutoTopUpSettingsPayload {
    setting: string;
    value: number;
    config?: UserAutoTopUpConfig;
}

export interface UserAutoTopUpConfig {
    topUpThresholdPrecentage?: number;
    topUpStackPercentage?: number;
}

export interface UserAutoTopUpResponse {
    user_id: number;
    gameplay_config: UserAutoTopUpSettings;
}

export interface UserAutoTopUpSettings {
    auto_top_up_setting: UserAutoTopUpSetting;
}