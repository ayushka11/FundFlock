import { GameVariantText, GroupsGameTypeInfoPriorityConstant } from "../constants/constants";
import LoggerUtil, { ILogger } from "./logger";
import { Number } from "aws-sdk/clients/iot";
import { GameVariant } from "../models/enums/game-variant";
import { Group } from "../models/group";

const logger: ILogger = LoggerUtil.get("GroupUtil");

export class GroupUtil {

    static sortGroupsComparator(a: Group, b: Group) {
        /*
            Sort according to:
            1. Descending order of Player Count
            2. Ascending order of Small Blind
            3. Ascending order of GameType Priority
        */
        logger.info(`Debugging sorting logic for  a: ${JSON.stringify(a)} b: ${JSON.stringify(b)}  `)
        return (b?.playerCount - a?.playerCount)
            || (a?.smallBlindAmount - b?.smallBlindAmount)
            || (GroupsGameTypeInfoPriorityConstant[a?.gameVariant]?.priority - GroupsGameTypeInfoPriorityConstant[b?.gameVariant]?.priority)
    }

    static getGameVariantText(variant: Number): string {
        switch (variant) {
            case GameVariant.NLHE:
                return GameVariantText.NLHE
            case GameVariant.PLO4:
                return GameVariantText.PLO4
            case GameVariant.PLO5:
                return GameVariantText.PLO5
            case GameVariant.PL06:
                return GameVariantText.PLO6
        }
    }

}