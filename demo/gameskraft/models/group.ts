import { GroupResponse as AriesGroupResponse } from "./aries/group-response";
import AriesUtil from "../utils/aries-util";
import { GroupType } from "./enums/group-type";

export class Group {
    id: number;
    name: string;
    gameType: number;
    gameVariant: number;
    smallBlindAmount: number;
    bigBlindAmount: number;
    minBuyInAmount: number;
    maxBuyInAmount: number;
    playerCount: number;
    isPractice: boolean;
    isQuickJoinEnabled: boolean;
    migratedRoom: boolean;

    static getGroupFromAriesResponse(ariesGroupResponse?: AriesGroupResponse): Group {
        const group: Group = new Group();
        group.id = ariesGroupResponse?.id ? ariesGroupResponse?.id : 0;
        group.name = ariesGroupResponse?.name ? ariesGroupResponse?.name : "";
        group.gameType = ariesGroupResponse?.gameType ? ariesGroupResponse?.gameType : -1;
        group.gameVariant = ariesGroupResponse?.gameVariant ? AriesUtil.getGameVariant(ariesGroupResponse?.gameVariant) : -1;
        group.smallBlindAmount = ariesGroupResponse?.smallBlind ? ariesGroupResponse?.smallBlind : 0;
        group.bigBlindAmount = ariesGroupResponse?.bigBlind ? ariesGroupResponse?.bigBlind : 0;
        group.minBuyInAmount = ariesGroupResponse?.minBuyIn ? ariesGroupResponse?.minBuyIn : 0;
        group.maxBuyInAmount = ariesGroupResponse?.maxBuyIn ? ariesGroupResponse?.maxBuyIn : 0;
        group.playerCount = ariesGroupResponse?.noOfPlayers ? ariesGroupResponse?.noOfPlayers : 0
        group.isPractice = ariesGroupResponse?.gameType === GroupType.PRACTICE;
        group.isQuickJoinEnabled = ariesGroupResponse?.isQuickJoinEnabled ? ariesGroupResponse?.isQuickJoinEnabled : false;
        group.migratedRoom = true;
        return group;
    }
}