import UserBetSettingBetMetricType from "../enums/user-bet-setting-bet-metric-type";
import UserBetSettingGameType from "../enums/user-bet-setting-game-type";
import UserBetSettingStreetIndicatorType from "../enums/user-bet-setting-street-indicator-type";
import UserGameSettingType from "../enums/user-game-setting-type";

export interface User {
    _id?: string;
	user_id?: number;
	vendor_id?: number;
    user_unique_id?: string;
    created_at?: string;
	updated_at?: string;
    has_migrated_to_apollo?: boolean;
    show_apollo_update?: boolean;
    created_directly_on_apollo?: boolean;
    gameplay_note_colors?: Array<UserGameplayNoteColor>;
	fairplay_config?: UserFairplayConfig;
    gameplay_config?: UserGameplayConfig;
}

export class UserGameplayNoteColor {
    id?: number;
    color_name?: string;
    color_key?: string;
    color_hex_code?: string;
    color_tag?: string;
    is_color_tag_editable?: boolean;
}

export class UserFairplayConfig {
    instant_withdrawal_allowed?: boolean;
}

export class UserGameplayConfig {
    bet_settings?: Array<UserBetSetting>;
    game_settings?: Array<UserGameSetting>;
    auto_top_up_setting?: UserAutoTopUpSetting;
}

export class UserBetSetting {
    id?: number;
    button_index?: number;
    game_type?: UserBetSettingGameType;
    street_indicator?: UserBetSettingStreetIndicatorType;
    default_bet_metric?: UserBetSettingBetMetricType;
    value?: number;
}

export class UserGameSetting {
    setting?: UserGameSettingType;
    setting_label?: string;
    setting_description?: string;
    value?: boolean;
}

export class UserAcknowledgement {
    acknowledgement: number;
    policyId: number;
    userUniqueId?: string;
}


export class UserAutoTopUpSetting {
    setting: string;
    setting_label: string;
    setting_description: string;
    value: boolean;
    config?: UserAutoTopUpConfig;
}
export class UserAutoTopUpConfig {
    topUpThresholdPrecentage?: number;
    topUpStackPercentage?: number;
}
