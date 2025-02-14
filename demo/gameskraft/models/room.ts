import GsUtil from "../utils/gs-util";
import {RoomResponse as GsRoomResponse} from "./game-server/room-response";
import {RoomResponse as AriesRoomResponse} from "./aries/room-response";
import AriesUtil from "../utils/aries-util";
import { RoomType } from "./enums/room-type";

export class Room {
    id: string;
    groupId: number;
    name: string;
    gameType?: number;
    gameVariant: number;
    smallBlindAmount: number;
    bigBlindAmount: number;
    minBuyInAmount: number;
    maxBuyInAmount: number;
    seats: number;
    playerCount: number;
    isRIT?: boolean;
    isPOG?: boolean;
    isAnonymous?: boolean;
    isEvChopEnabled?: boolean;
    isPractice: boolean;
    order: number;
    filters?: {
        userIds: Array<string>
    };
    migratedRoom: boolean;
    allowSeatSelection?: boolean //Check For this parameter
    isPrimary?: boolean

    static getRoomFromGsRoomResponse(gsRoomResposne?: GsRoomResponse): Room {
        const room: Room = new Room();
        room.id = gsRoomResposne?.id;
        room.name = gsRoomResposne?.nm ? gsRoomResposne?.nm : "";
        room.gameVariant = gsRoomResposne?.gt ? GsUtil.getGameVariant(gsRoomResposne?.gt) : -1;
        room.smallBlindAmount = gsRoomResposne?.sb ? gsRoomResposne?.sb : 0;
        room.bigBlindAmount = gsRoomResposne?.bb ? gsRoomResposne?.bb : 0;
        room.minBuyInAmount = gsRoomResposne?.xb ? gsRoomResposne?.xb : 0;
        room.maxBuyInAmount = gsRoomResposne?.yb ? gsRoomResposne?.yb : 0;
        room.seats = gsRoomResposne?.se ? gsRoomResposne?.se : 0
        room.playerCount = gsRoomResposne?.pc ? gsRoomResposne?.pc : 0
        if (gsRoomResposne?.ir) {
            room.isRIT = gsRoomResposne?.ir
        } else {
            room.isRIT = false
        }
        if (gsRoomResposne?.ip) {
            room.isPOG = gsRoomResposne?.ip;
        } else {
            room.isPOG = false;
        }
        if (gsRoomResposne?.ia) {
            room.isAnonymous = gsRoomResposne?.ia;
        } else {
            room.isAnonymous = false;
        }
        if (gsRoomResposne?.ev) {
            room.isEvChopEnabled = gsRoomResposne?.ev
        } else {
            room.isEvChopEnabled = false;
        }
        if (gsRoomResposne?.kv) {
            if (gsRoomResposne?.kv?.pr) {
                room.isPractice = true;
            } else {
                room.isPractice = false;
            }
            if (gsRoomResposne?.kv?.ats) {
                room.allowSeatSelection = true
            } else {
                room.allowSeatSelection = false
            }
        } else {
            room.isPractice = false;
            room.allowSeatSelection = false
        }
        if (gsRoomResposne?.od) {
            room.order = gsRoomResposne?.od
        } else {
            room.order = 0;
        }
        if (gsRoomResposne?.uf && gsRoomResposne?.uf.length > 0) {
            room.filters = {
                userIds: gsRoomResposne?.uf
            }
        }
        room.migratedRoom = false;
        return room;
    }

    static getRoomFromAriesResponse(ariesRoomResponse?: AriesRoomResponse): Room {
        const room: Room = new Room();
        room.id = ariesRoomResponse?.roomId ? ariesRoomResponse?.roomId : "";
        room.groupId = ariesRoomResponse?.groupId ? ariesRoomResponse?.groupId : 0;
        room.name = ariesRoomResponse?.name ? ariesRoomResponse?.name : "";
        room.gameType = ariesRoomResponse?.gameType ? ariesRoomResponse?.gameType : -1;
        room.gameVariant = ariesRoomResponse?.gameVariant ? AriesUtil.getGameVariant(ariesRoomResponse?.gameVariant) : -1;
        room.smallBlindAmount = ariesRoomResponse?.smallBlind ? ariesRoomResponse?.smallBlind : 0;
        room.bigBlindAmount = ariesRoomResponse?.bigBlind ? ariesRoomResponse?.bigBlind : 0;
        room.minBuyInAmount = ariesRoomResponse?.minBuyIn ? ariesRoomResponse?.minBuyIn : 0;
        room.maxBuyInAmount = ariesRoomResponse?.maxBuyIn ? ariesRoomResponse?.maxBuyIn : 0;
        room.seats = ariesRoomResponse?.maxSeatsPerTable ? ariesRoomResponse?.maxSeatsPerTable : 0
        room.playerCount = ariesRoomResponse?.noOfPlayers ? ariesRoomResponse?.noOfPlayers : 0
        if (ariesRoomResponse?.ritActive) {
            room.isRIT = ariesRoomResponse?.ritActive
        } else {
            room.isRIT = false
        }
        if (ariesRoomResponse?.potOfGoldActive) {
            room.isPOG = ariesRoomResponse?.potOfGoldActive;
        } else {
            room.isPOG = false;
        }
        if (ariesRoomResponse?.anonymousMode) {
            room.isAnonymous = ariesRoomResponse?.anonymousMode;
        } else {
            room.isAnonymous = false;
        }
        if (ariesRoomResponse?.evChopActive) {
            room.isEvChopEnabled = ariesRoomResponse?.evChopActive
        } else {
            room.isEvChopEnabled = false;
        }
        if (ariesRoomResponse?.gameType == RoomType.PRACTICE) {
            room.isPractice = true;
        } else {
            room.isPractice = false;
        }
        if (ariesRoomResponse?.allowSeatSelection) {
            room.allowSeatSelection = true
        } else {
            room.allowSeatSelection = false
        }
        room.migratedRoom = true;
        room.isPrimary = ariesRoomResponse?.isPrimary
        return room;
    }
}
