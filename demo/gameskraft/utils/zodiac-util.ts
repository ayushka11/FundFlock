import {IDMUserProfile} from "../models/idm/user-idm";
import {
    IUserAutoTopUpSetting,
    IUserBetSetting,
    IUserBetSettings,
    IUserGameplaySettings,
    IUserGameSetting,
    IUserGameSettings,
    IUserSoundSetting,
    IUserSoundSettings,
    UserBetSetting,
    UserBetSettings,
    UserGameplaySettings,
    UserGameSetting,
    UserGameSettings,
    UserSoundSetting,
    UserSoundSettings, 
} from "../models/zodiac/gameplay";
import {IUserNote, IUserNoteColor, IUserNotes, ReferenceUser, UserNote, UserNoteColor,} from "../models/zodiac/user-note";
import { UserGameplayDetails, IUserGameplayDetails } from "../models/zodiac/user-detail";
import IdmUtil from "./idm-utils";
import { UserPslStats } from "../models/zodiac/user-psl-stats";

const configService = require("../services/configService");

export default class ZodiacUtil {

    static getUserNotes(vendorId: string, userIds: string[], userDetails: IDMUserProfile[], userNotes: UserNote[]): {
        [key: string]: IUserNotes
    } {
        const avatars = configService.getUserAvatarsForVendor()[vendorId];
        const _userNotes: { [key: string]: IUserNotes } = {}
        userIds.forEach((userId: string) => {
            const userNote: UserNote = userNotes.find((userNote: UserNote) => userId === userNote.reference_user_id);
            const userDetail: IDMUserProfile = userDetails.find((userDetail: IDMUserProfile) => userId === userDetail?.clientIdentifier);
            const defaultUserAvatar = IdmUtil.getDefaultAvatar(avatars?.allUserAvatars ?? []) ?? avatars?.defaultUserAvatar;
            if (userNote) {
                _userNotes[userId] = {
                    createdAt: userNote.created_at,
                    updatedAt: userNote.updated_at,
                    note: userNote.note,
                    colorId: userNote.color_id,
                    colorName: userNote.color_name,
                    colorKey: userNote.color_key,
                    colorHexCode: userNote.color_hex_code,
                    colorTag: userNote.color_tag,
                    displayPicture: userDetail?.displayPicture ?? defaultUserAvatar,
                };
            }
            else {
                _userNotes[userId] = {
                    createdAt: null,
                    updatedAt: null,
                    note: '',
                    colorId: null,
                    colorName: null,
                    colorKey: null,
                    colorHexCode: null,
                    colorTag: null,
                    displayPicture: userDetail?.displayPicture ?? defaultUserAvatar,
                };
            }
        });
        return _userNotes;
    }

    static getUserNotesV2(vendorId: string, referenceUserList: ReferenceUser[], userDetails: IDMUserProfile[], userNotes: UserNote[]): {
        [key: string]: IUserNotes
    } {
        const avatars = configService.getUserAvatarsForVendor()[vendorId];
        const updatedReferceUserList = referenceUserList.map((elem) => ({
            ...elem,
            userUniqueId: `${elem.vendorId}_${elem.userId}`
        }))
        const _userNotes: { [key: string]: IUserNotes } = {}
        updatedReferceUserList.forEach((referceUser) => {
            const userNote: UserNote = userNotes.find((userNote: UserNote) => referceUser.userUniqueId === userNote.reference_user_id);
            const userDetail: IDMUserProfile = userDetails.find((userDetail: IDMUserProfile) => referceUser.userUniqueId === userDetail?.clientIdentifier);
            const defaultUserAvatar = IdmUtil.getDefaultAvatar(avatars?.allUserAvatars ?? []) ?? avatars?.defaultUserAvatar;
            if (userNote) {
                _userNotes[referceUser.userId] = {
                    createdAt: userNote.created_at,
                    updatedAt: userNote.updated_at,
                    note: userNote.note,
                    colorId: userNote.color_id,
                    colorName: userNote.color_name,
                    colorKey: userNote.color_key,
                    colorHexCode: userNote.color_hex_code,
                    colorTag: userNote.color_tag,
                    displayPicture: userDetail?.displayPicture ?? defaultUserAvatar,
                };
            }
            else {
                _userNotes[referceUser.userId] = {
                    createdAt: null,
                    updatedAt: null,
                    note: '',
                    colorId: null,
                    colorName: null,
                    colorKey: null,
                    colorHexCode: null,
                    colorTag: null,
                    displayPicture: userDetail?.displayPicture ?? defaultUserAvatar,
                };
            }
        });
        return _userNotes;
    }
    
    static getUserDetails(vendorId: string, referenceUserList: ReferenceUser[], userDetails: IDMUserProfile[], userGameplayDetails: UserGameplayDetails): IUserGameplayDetails {
        const avatars = configService.getUserAvatarsForVendor()[vendorId];
        const _userDetails: IUserGameplayDetails = {};

        referenceUserList.forEach(referenceUser => {
            const userUniqueId = `${referenceUser.vendorId}_${referenceUser.userId}`;
            
            //userGameplayStats
            const userGameplayStats = userGameplayDetails[userUniqueId]?.userGameplayStats;
            
             //displayPicture
            const userDetail: IDMUserProfile = userDetails.find((userDetail: IDMUserProfile) => userUniqueId === userDetail?.clientIdentifier);
            const defaultUserAvatar = IdmUtil.getDefaultAvatar(avatars?.allUserAvatars ?? []) ?? avatars?.defaultUserAvatar; 
            const displayPicture = userDetail?.displayPicture ?? defaultUserAvatar;
 
            //userNote
            const userNote_ = userGameplayDetails[userUniqueId]?.userNote;
            const userNote = userNote_ ? {
                createdAt: userNote_.created_at,
                updatedAt: userNote_.updated_at,
                note: userNote_.note,
                colorId: userNote_.color_id,
                colorName: userNote_.color_name,
                colorKey: userNote_.color_key,
                colorHexCode: userNote_.color_hex_code,
                colorTag: userNote_.color_tag,
            } : {
                createdAt: null,
                updatedAt: null,
                note: '',
                colorId: null,
                colorName: null,
                colorKey: null,
                colorHexCode: null,
                colorTag: null,
            };

            _userDetails[referenceUser.userId] = {
                userGameplayStats,
                userNote,
                displayPicture
            };
        });
        return _userDetails;
    }

    static getUserNote(userNote: UserNote): IUserNote {
        return {
            userId: userNote.user_id,
            createdAt: userNote.created_at,
            updatedAt: userNote.updated_at,
            referenceUserId: userNote.reference_user_id,
            note: userNote.note,
            colorId: userNote.color_id,
            colorName: userNote.color_name,
            colorKey: userNote.color_key,
            colorHexCode: userNote.color_hex_code,
            colorTag: userNote.color_tag,
        };
    }

    static getUserNoteColors(userNoteColors: UserNoteColor[]): IUserNoteColor[] {
        return userNoteColors.map((userNoteColor: UserNoteColor) => {
            return {
                colorId: userNoteColor.id,
                colorName: userNoteColor.color_name,
                colorKey: userNoteColor.color_key,
                colorHexCode: userNoteColor.color_hex_code,
                colorTag: userNoteColor.color_tag,
                isColorTagEditable: userNoteColor.is_color_tag_editable,
            };
        });
    }

    static getUserGameplaySettings(gameplaySettings: UserGameplaySettings): IUserGameplaySettings {
        const {bet_settings, game_settings, sound_settings, auto_top_up_setting} = gameplaySettings;
        const betSettings: { [key: string]: IUserBetSetting[] } = {};
        const filteredBetSettings = bet_settings.filter((bet_setting) => bet_setting.game_type === 'cash');
        filteredBetSettings.forEach((bet_setting: UserBetSetting) => {
            if (betSettings[bet_setting.street_indicator]) {
                betSettings[bet_setting.street_indicator].push({
                    id: bet_setting.id,
                    buttonIndex: bet_setting.button_index,
                    gameType: bet_setting.game_type,
                    streetIndicator: bet_setting.street_indicator,
                    defaultBetMetric: bet_setting.default_bet_metric,
                    value: bet_setting.value,
                });
            }
            else {
                betSettings[bet_setting.street_indicator] = [{
                    id: bet_setting.id,
                    buttonIndex: bet_setting.button_index,
                    gameType: bet_setting.game_type,
                    streetIndicator: bet_setting.street_indicator,
                    defaultBetMetric: bet_setting.default_bet_metric,
                    value: bet_setting.value,
                }];
            }
        });
        const gameSettings: IUserGameSetting[] = game_settings.map((game_setting: UserGameSetting) => {
            return {
                setting: game_setting.setting,
                settingLabel: game_setting.setting_label,
                settingDescription: game_setting.setting_description,
                value: game_setting.value,
            };
        });
        const soundSettings: IUserSoundSetting[] = sound_settings.map((sound_setting: UserSoundSetting) => {
            return {
                setting: sound_setting.setting,
                settingLabel: sound_setting.setting_label,
                settingDescription: sound_setting.setting_description,
                value: sound_setting.value,
            };
        });

        const autoTopUpSetting : IUserAutoTopUpSetting = {
            setting: auto_top_up_setting?.setting,
            settingLabel: auto_top_up_setting?.setting_label,
            settingDescription: auto_top_up_setting?.setting_description,
            value: auto_top_up_setting?.value,
            config: auto_top_up_setting?.config
        }

        return {
            betSettings,
            gameSettings,
            soundSettings,
            autoTopUpSetting,
        };
    }
    static getAutoTopUpSettings(gameplaySettings: UserGameplaySettings): IUserAutoTopUpSetting {
        const {auto_top_up_setting} = gameplaySettings;
        const autoTopUpSetting : IUserAutoTopUpSetting = {
            setting: auto_top_up_setting?.setting,
            settingLabel: auto_top_up_setting?.setting_label,
            settingDescription: auto_top_up_setting?.setting_description,
            value: auto_top_up_setting?.value,
            config: auto_top_up_setting?.config
        }
        return autoTopUpSetting;
    }

    static filterGameSoundFromGameSettings(gameplaySettings: IUserGameplaySettings): IUserGameplaySettings{
        const filteredGameSettings = gameplaySettings.gameSettings.filter(gameSetting => gameSetting.setting !== "gameSound");
        return {
            ...gameplaySettings,
            gameSettings: filteredGameSettings
        };
    }

    static getUserBetSettings(gameplaySettings: UserBetSettings): IUserBetSettings {
        const {bet_settings} = gameplaySettings;
        const betSettings: IUserBetSetting[] = bet_settings.map((bet_setting: UserBetSetting) => {
            return {
                id: bet_setting.id,
                buttonIndex: bet_setting.button_index,
                gameType: bet_setting.game_type,
                streetIndicator: bet_setting.street_indicator,
                defaultBetMetric: bet_setting.default_bet_metric,
                value: bet_setting.value,
            };
        });
        return {
            betSettings,
        };
    }

    static getUserGameSettings(gameplaySettings: UserGameSettings): IUserGameSettings {
        const {game_settings} = gameplaySettings;
        const gameSettings: IUserGameSetting[] = game_settings.map((game_setting: UserGameSetting) => {
            return {
                setting: game_setting.setting,
                settingLabel: game_setting.setting_label,
                settingDescription: game_setting.setting_description,
                value: game_setting.value,
            };
        });
        return {
            gameSettings,
        };
    }

    static getUserSoundSettings(gameplaySettings: UserSoundSettings): IUserSoundSettings {
        const {sound_settings} = gameplaySettings;
        const soundSettings: IUserSoundSetting[] = sound_settings.map((sound_setting: UserSoundSetting) => {
            return {
                setting: sound_setting.setting,
                settingLabel: sound_setting.setting_label,
                settingDescription: sound_setting.setting_description,
                value: sound_setting.value,
            };
        });
        return {
            soundSettings,
        };
    }

    static getIsMigrationPolicy(migrationPolicy: number[],policyId: number): boolean {
        const currentPolicy: number[] = migrationPolicy.filter(policy => policy == policyId);
        return currentPolicy.length> 0;
    }

    static getUserClaimPslTickerResponse(userPslStats: UserPslStats){
        return {
            isTicketClaimed: userPslStats.isTicketClaimed,
        }
    }
}