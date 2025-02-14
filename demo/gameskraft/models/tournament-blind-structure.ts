import CurrencyUtil from '../helpers/currency-util';
import TimerUtil from '../helpers/timer-util';
import {TournamentBlindStructure as GsResponse} from "./game-server/tournament-blind-structure";
import AriesBlindLevel from "../models/tournament/blind-level"

export class TournamentBlindStructure {
    level: number;
    smallBlindAmount: number;
    bigBlindAmount: number;
    anteAmount: number;
    turnDuration: number;
    timeBankDuration: number;
    timeBankRenewDuration: number;
    reconnectTimerDuration: number;
    disconnectTimerDuration: number;
    blindDuration: number;

    static convertGsResponse(response: GsResponse): TournamentBlindStructure {
        const blindStructure = new TournamentBlindStructure();
        blindStructure.level = response?.level ?? -1;
        blindStructure.smallBlindAmount = response?.small_blind || 0;
        blindStructure.bigBlindAmount = response?.big_blind || 0;
        blindStructure.anteAmount = response?.ante || 0;
        blindStructure.turnDuration = response?.turn_time || 0;
        blindStructure.timeBankDuration = response?.time_bank || 0;
        blindStructure.timeBankRenewDuration = response?.time_bank_renew || 0;
        blindStructure.reconnectTimerDuration = response?.reconnect_time || 0;
        blindStructure.disconnectTimerDuration = response?.disconnect_time || 0;
        blindStructure.blindDuration = response?.duration
        return blindStructure;
    }

    static convertAriesResponse(blindLevel: AriesBlindLevel, blindLevelDuration: number): TournamentBlindStructure {
        const blindStructure = new TournamentBlindStructure();
        blindStructure.level = blindLevel?.level ?? -1;
        blindStructure.smallBlindAmount = CurrencyUtil.getAmountInRupee(blindLevel?.smallBlind || 0);
        blindStructure.bigBlindAmount = CurrencyUtil.getAmountInRupee(blindLevel?.bigBlind || 0);
        blindStructure.anteAmount = CurrencyUtil.getAmountInRupee(blindLevel?.ante || 0);

        blindStructure.turnDuration = TimerUtil.getTimeInSeconds(blindLevel?.turnTime || 0);
        blindStructure.timeBankDuration = TimerUtil.getTimeInSeconds(blindLevel?.timeBank || 0);
        blindStructure.timeBankRenewDuration = TimerUtil.getTimeInSeconds(blindLevel?.timeBankRenew || 0);
        blindStructure.reconnectTimerDuration = TimerUtil.getTimeInSeconds(blindLevel?.reconnectTime || 0);
        blindStructure.disconnectTimerDuration = TimerUtil.getTimeInSeconds(blindLevel?.disconnectTime || 0);
        blindStructure.blindDuration = TimerUtil.getTimeInSeconds(blindLevelDuration)
        return blindStructure;
    }
}
