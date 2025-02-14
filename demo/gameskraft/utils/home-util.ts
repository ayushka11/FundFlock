import { CURRENCY, GameFeatures } from "../constants/constants";
import { RoomType } from '../models/enums/room-type';
import { IGroup, IRoom } from '../models/gateway/response';
import { Group } from '../models/group';
import { Room } from "../models/room";
import { GetRecommendedGroupsRequest } from '../models/zodiac/get-recommended-groups-request';
import { GetRecommendedRoomsRequest } from '../models/zodiac/get-recommended-rooms-request';
import { RoomInfo } from "../models/zodiac/user-cash-game";
import AmountUtil from "./amount-util";
import GsUtil from "./gs-util";
import { RoomUtil } from "./room-util";

export default class HomeUtil {

    static getFTDAmount(response: any) {
        if(response?.transactions && response?.transactions?.length) {
           return  response?.transactions[0]?.amount
        } else {
            return 0;
        }
    }

    static getFrequentlyJoinedRoomId(response: Array<RoomInfo>): string {
        if (response && response.length) {
            response.sort((a: RoomInfo, b: RoomInfo) => {
                return b?.roomJoinCount - a?.roomJoinCount;
            })

            return response[0]?.roomId;
        }
        return "";

    }

    static getRecentlyJoinedRoomId(response: Array<RoomInfo>): string {
         if (response && response.length) {
            response.sort((a: RoomInfo, b: RoomInfo) => {
                return Number(a?.lastJoinedTime < b?.lastJoinedTime);
            })
            return response[0]?.roomId;
        }
        return "";

    }

    static getRoomsData(response: Array<Room> = []): Array<IRoom> {
        return response.map((room: Room) => {
            if (room) {
                let currency: number = CURRENCY.INR
                if (room?.isPractice) {
                    currency = CURRENCY.CHIPS
                }
                return {
                    id: room?.id,
                    name: room?.name,
                    gameVariant: room?.gameVariant,
                    smallBlindAmount: AmountUtil.getAmountWithCurrency(room?.smallBlindAmount, currency),
                    bigBlindAmount: AmountUtil.getAmountWithCurrency(room?.bigBlindAmount, currency),
                    minBuyInAmount: AmountUtil.getAmountWithCurrency(room?.minBuyInAmount, currency),
                    maxBuyInAmount: AmountUtil.getAmountWithCurrency(room?.maxBuyInAmount, currency),
                    seats: room?.seats,
                    playerCount: room?.playerCount,
                    isPOG: room?.isPOG,
                    isAnonymous: room?.isAnonymous,
                    isEvChopEnabled: room?.isEvChopEnabled,
                    isRIT: room?.isRIT,
                    isPractice: room?.isPractice,
                    order: room?.order,
                    filters: room?.filters,
                    migratedRoom: room?.migratedRoom,
                    roomCardMeta: {
                        ritEnabledText: GameFeatures.rit,
                        potOfGoldEnabledText: GameFeatures.potOfGold,
                        annonymousRoomText: GameFeatures.annonymous,
                        tableEvChopEnabledText: GameFeatures.evChop,
                        practiceText: GameFeatures.practice,
                        gameVariantText: RoomUtil.getGameVariantText(room?.gameVariant)
                    }
                }
            }
        });
    }

    static getGroupsData(response: Array<Group> = []): Array<IGroup> {
        return response.map((group: Group) => {
            if (group) {
                let currency: number = CURRENCY.INR
                if (group?.isPractice) {
                    currency = CURRENCY.CHIPS
                }
                return {
                    id: group?.id,
                    name: group?.name,
                    gameVariant: group?.gameVariant,
                    smallBlindAmount: AmountUtil.getAmountWithCurrency(group?.smallBlindAmount, CURRENCY.CHIPS),
                    bigBlindAmount: AmountUtil.getAmountWithCurrency(group?.bigBlindAmount, CURRENCY.CHIPS),
                    minBuyInAmount: AmountUtil.getAmountWithCurrency(group?.minBuyInAmount, currency),
                    maxBuyInAmount: AmountUtil.getAmountWithCurrency(group?.maxBuyInAmount, currency),
                    playerCount: group?.playerCount,
                    isPractice: group?.isPractice,
                    migratedRoom: group?.migratedRoom,
                    isQuickJoinEnabled: group?.isQuickJoinEnabled,
                    groupCardMeta: {
                        practiceText: GameFeatures.practice,
                        gameVariantText: RoomUtil.getGameVariantText(group?.gameVariant)
                    }
                }
            }
        });
    }

    static getRecommendedRoomRequest (rooms: Room[], firstDepositAmount?: number): GetRecommendedRoomsRequest {
        return {
            activeRoomsInfo: rooms.map(room => {
                return {
                    ...room,
                    gameType: (room.isPractice)? RoomType.PRACTICE: RoomType.CASH,
                }
            }),
            firstDepositAmount: firstDepositAmount
        }
    }

    static getRecommendedGroupsRequest (groups: Group[], firstDepositAmount?: number): GetRecommendedGroupsRequest {
        return {
            activeRoomsInfo: groups.map(group => {
                return {
                    ...group,
                    gameType: (group.isPractice)? RoomType.PRACTICE: RoomType.CASH,
                }
            }),
            firstDepositAmount: firstDepositAmount
        }
    }
}
