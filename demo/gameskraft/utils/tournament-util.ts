import { Number } from 'aws-sdk/clients/iot';
import {
    CURRENCY,
    GameVariantText,
    TouranementEntryMethodsText,
    TournamentCurrencyTypeUi,
    TournamentEntryTypeText,
    TournamentPrizeConfigType,
    TournamentSpeedText,
    TournamentStatusText,
    TournamentTypeText
} from "../constants/constants";
import CurrencyUtil from '../helpers/currency-util';
import { GameVariant } from '../models/enums/game-variant';
import { MoneyType } from '../models/enums/money-type';
import { EntryType } from '../models/enums/tournament/entry-type';
import { PlayerTournamentStatus } from '../models/enums/tournament/player-tournament-status';
import { PrizeConfigType } from '../models/enums/tournament/prize-config-type';
import { TournamentCurrencyType } from '../models/enums/tournament/tournament-currency-type';
import { TournamentSpeed } from '../models/enums/tournament/tournament-speed';
import { TournamentStatus } from '../models/enums/tournament/tournament-status';
import { TournamentType } from '../models/enums/tournament/tournament-type';
import {
    GsEntryType,
    GsMoneyType,
    GsPlayerTournamntStatus,
    GsTournamentSpeed,
    GsTournamentState,
    GsTournamentType
} from '../models/game-server/mtt-list';
import {
    IPlayerTournamentList,
    ITournamentBlindStructure,
    ITournamentConfig,
    ITournamentDetailsPlayerList,
    ITournamentDetailsPlayerListV3,
    ITournamentDetailsTableList,
    ITournamentDetailsTableListV3,
    ITournamentPrizeList
} from '../models/gateway/response';
import { PlayerMTTList, PlayerTournamentData } from '../models/player-mtt-list';
import { BuyInConfig, EntryConfig, Tournament, TournamentConfig } from '../models/tournament';
import { TournamentBlindStructure } from '../models/tournament-blind-structure';
import {
    TournamentDetails,
    TournamentPlayerList,
    TournamentPrizeList,
    TournamentTableList
} from '../models/tournament-details';
import AriesPrizeDistributionType from '../models/tournament/enums/prize-distribution-type';
import TournamentBuyInMethod from '../models/tournament/enums/tournament-buy-in-method';
import AriesTournamentBuyInMethod from '../models/tournament/enums/tournament-buy-in-method';
import AriesTournamentCurrency from '../models/tournament/enums/tournament-currency';
import AriesTournamentPrizeType from '../models/tournament/enums/tournament-prize-type';
import TournamentStatusAries from '../models/tournament/enums/tournament-status-aries';

import AriesTournamentType from '../models/tournament/enums/aries-tournament-type';
import AriesTournamentResponse from '../models/tournament/response/tournament-response';
import AriesTournamentVendorNameMapping from '../models/tournament/tournament-vendor-name-mapping';
import AmountUtil from './amount-util';
import AriesPrizeStructureLobby from "../models/tournament/response/prize-structure-lobby";

export class TournamentUtil {

    static getPlayerTournamentStatusFromId(userTournaments: PlayerMTTList, tournamentId: string): PlayerTournamentStatus {
        const response = (userTournaments?.openedList || [])?.find((value) => value?.tournamentId == tournamentId)
        if (response) {
            return response?.playerStatus;
        }
    }

    static sortTournaments(a: Tournament, b: Tournament, userTournaments: PlayerMTTList) {
        const startTimeA = a?.tournamentConfig?.startTime;
        const startTimeB = b?.tournamentConfig?.startTime;
        const tournamentStatusA = a?.tournamentStatus;
        const tournamentStatusB = b?.tournamentStatus;
        const playerStatusA = TournamentUtil.getPlayerTournamentStatusFromId(userTournaments, a?.id);
        const playerStatusB = TournamentUtil.getPlayerTournamentStatusFromId(userTournaments, b?.id);

        /* If both tournament are cancelled then newest tournament should come first*/
        if (tournamentStatusA === TournamentStatus.CANCELLED) {
            if (tournamentStatusB === TournamentStatus.CANCELLED) {
                return startTimeA - startTimeB
            }
            return 1
        }

        /*  completed must come up from cancelled
            2. if both Tare completed then sort on basis of start timne*/
        if (tournamentStatusA === TournamentStatus.COMPLETED) {
            if (tournamentStatusB === TournamentStatus.CANCELLED) {
                return -1
            }
            if (tournamentStatusB == TournamentStatus.COMPLETED) {
                return startTimeA - startTimeB
            }
            return 1;
        }

        /*  if a is running and b is completed or cancelled then a must come up */
        if (tournamentStatusA == TournamentStatus.RUNNING) {
            if (tournamentStatusB == TournamentStatus.COMPLETED || (tournamentStatusB == TournamentStatus.CANCELLED)) {
                return -1;
            }
            if (tournamentStatusB == TournamentStatus.RUNNING) {
                return startTimeA - startTimeB
            }
            return 1
        }
        /* if player has registerd for a and b is cancclled ,completed or running then a should come up*/
        if (playerStatusA === PlayerTournamentStatus.REGISTERED) {
            if ([TournamentStatus.CANCELLED, TournamentStatus.COMPLETED, TournamentStatus.RUNNING].indexOf(tournamentStatusB) > -1) {
                return -1;
            }
            if (playerStatusB === PlayerTournamentStatus.REGISTERED) {
                return startTimeA - startTimeB
            }
            return 1
        }
        /* if user is playing tournament a then it should come up */
        if (playerStatusA === PlayerTournamentStatus.PLAYING) {
            if ([TournamentStatus.CANCELLED, TournamentStatus.COMPLETED, TournamentStatus.RUNNING].indexOf(tournamentStatusB) > -1 || playerStatusB === PlayerTournamentStatus.REGISTERED) {
                return -1;
            }
            if (playerStatusB === PlayerTournamentStatus.PLAYING) {
                return startTimeA - startTimeB
            }
            return 1
        }

        /* if tournamet a is allowing registration and  b is either cancelled completed runnning or player is playing or registered in tournament b then a should come up  */
        if (tournamentStatusA == TournamentStatus.REGISTERING) {
            if ([TournamentStatus.CANCELLED, TournamentStatus.COMPLETED, TournamentStatus.RUNNING].indexOf(tournamentStatusB) > -1) {
                return -1;
            }
            if ([PlayerTournamentStatus.REGISTERED, PlayerTournamentStatus.PLAYING].indexOf(playerStatusB) > -1) {
                return -1;
            }
            if (tournamentStatusB == TournamentStatus.REGISTERING) {
                return startTimeA - startTimeB
            }
            return 1
        }

        /* if tournamet a is allowing late registration and  b is either registering cancelled completed runnning or player is playing or registered in tournament b then a should come up  */
        if (tournamentStatusA == TournamentStatus.LATE_REGISTRATION) {
            if ([TournamentStatus.REGISTERING, TournamentStatus.CANCELLED, TournamentStatus.COMPLETED, TournamentStatus.RUNNING].indexOf(tournamentStatusB) > -1) {
                return -1;
            }
            if ([PlayerTournamentStatus.REGISTERED, PlayerTournamentStatus.PLAYING].indexOf(playerStatusB) > -1) {
                return -1;
            }
            if (tournamentStatusB == TournamentStatus.LATE_REGISTRATION) {
                return startTimeA - startTimeB
            }
            return 1
        }

        /* if tournamet a is announced and  b is either registering cancelled completed runnning or player is playing or registered in tournament b then a should come up  */

        if (tournamentStatusA == TournamentStatus.ANNOUNCED) {
            if ([TournamentStatus.LATE_REGISTRATION, TournamentStatus.REGISTERING, TournamentStatus.CANCELLED, TournamentStatus.COMPLETED, TournamentStatus.RUNNING].indexOf(tournamentStatusB) > -1) {
                return -1;
            }
            if ([PlayerTournamentStatus.REGISTERED, PlayerTournamentStatus.PLAYING].indexOf(playerStatusB) > -1) {
                return -1;
            }
            if (tournamentStatusB == TournamentStatus.ANNOUNCED) {
                return startTimeA - startTimeB
            }
            return 1
        }
        /* this is case for aborted tournaments */

        if ([TournamentStatus.ANNOUNCED, TournamentStatus.LATE_REGISTRATION, TournamentStatus.REGISTERING, TournamentStatus.CANCELLED, TournamentStatus.COMPLETED, TournamentStatus.RUNNING].indexOf(tournamentStatusB) > -1) {
            return -1
        }
        if ([PlayerTournamentStatus.REGISTERED, PlayerTournamentStatus.PLAYING].indexOf(playerStatusB) > -1) {
            return -1;
        }
        return startTimeA - startTimeB
    }

    static getPlayerTournamentOpenedList(openedList: PlayerTournamentData[] = []): IPlayerTournamentList[] | [] {
        if (openedList.length > 0) {
            return openedList?.map((list: PlayerTournamentData) => {
                return {
                    tournamentId: list?.tournamentId,
                    playerStatus: list?.playerStatus,
                    playerStatusText: TournamentUtil.getPlayerTournamentStatusText(list?.playerStatus)
                }
            })
        }
        else {
            return []
        }
    }

    static getSatelliteTournamentConfig(tournamentConfig: TournamentConfig): ITournamentConfig | undefined {
        if (tournamentConfig) {
            return {
                startTime: tournamentConfig?.startTime,
                lateRegistrationDuration: tournamentConfig?.lateRegistrationDuration,
                buyInAmount: AmountUtil.getAmountWithCurrency(tournamentConfig?.buyInAmount, CURRENCY.INR),
                entryType: tournamentConfig?.entryType,
                entryMethods: tournamentConfig?.entryMethods,
                stackAmount: AmountUtil.getAmountWithCurrency(tournamentConfig?.stackAmount, CURRENCY.INR),
                maxNumberOfSeat: tournamentConfig?.maxNumberOfSeat,
                isSatellite: tournamentConfig?.isSatellite,
                hasSatellite: tournamentConfig?.hasSatellite,
                isActive: tournamentConfig?.isActive,
                ticketWinners: tournamentConfig?.ticketWinners,
            }
        }
        else {
            return;
        }
    }

    static getTournamentDetailsTableList(tableList: TournamentTableList[] = []): ITournamentDetailsTableList[] | [] {
        if (tableList.length > 0) {
            return (tableList).map((tableList: TournamentTableList) => {
                return {
                    maxStackAmount: AmountUtil.getAmountWithCurrency(tableList?.maxStackAmount, CURRENCY.INR, tableList?.maxStackAmountInBB),
                    minStackAmount: AmountUtil.getAmountWithCurrency(tableList?.minStackAmount, CURRENCY.INR, tableList?.minStackAmountInBB),
                    players: tableList?.players,
                    tableNumber: tableList?.tableId
                }
            })
        }
        else {
            return [];
        }
    }

    static getTournamentDetailsPlayerList(playerList: TournamentPlayerList[] = []): ITournamentDetailsPlayerList[] | [] {
        (playerList || []).sort((a: TournamentPlayerList, b: TournamentPlayerList) => {
            return a?.rank - b?.rank
        })
        if (playerList.length > 0) {
            return (playerList).map((playerList: TournamentPlayerList) => {
                return {
                    idx: playerList?.idx,
                    isIdxShow: playerList?.isIdxShow,
                    playerId: playerList?.playerId,
                    playerName: playerList?.playerName,
                    rank: playerList?.rank,
                    reEntries: playerList?.reEntries,
                    stackAmount: AmountUtil.getAmountWithCurrency(playerList?.stackAmount, CURRENCY.INR, playerList?.stackAmountInBB),
                    tableNumber: playerList?.tableId
                }
            })
        }
        else {
            return [];
        }
    }

    static getTournamentDetailsTableListV3(tableList: TournamentTableList[] = []): ITournamentDetailsTableListV3[] | [] {
        if (tableList.length > 0) {
            return (tableList).map((tableList: TournamentTableList) => {
                return {
                    maxStackAmount: AmountUtil.getAmountWithCurrency(tableList?.maxStackAmount, CURRENCY.CHIPS, tableList?.maxStackAmountInBB),
                    minStackAmount: AmountUtil.getAmountWithCurrency(tableList?.minStackAmount, CURRENCY.CHIPS, tableList?.minStackAmountInBB),
                    players: tableList?.players,
                    tableNumber: tableList?.tableNumber,
                    tableId: tableList?.tableId
                }
            })
        }
        else {
            return [];
        }
    }

    static getTournamentDetailsPlayerListV3(playerList: TournamentPlayerList[] = []): ITournamentDetailsPlayerListV3[] | [] {
        (playerList || []).sort((a: TournamentPlayerList, b: TournamentPlayerList) => {
            return a?.rank - b?.rank
        })
        if (playerList.length > 0) {
            return (playerList).map((playerList: TournamentPlayerList) => {
                return {
                    idx: playerList?.idx,
                    isIdxShow: playerList?.isIdxShow,
                    playerId: playerList?.playerId,
                    playerName: playerList?.playerName,
                    rank: playerList?.rank,
                    reEntries: playerList?.reEntries,
                    stackAmount: AmountUtil.getAmountWithCurrency(playerList?.stackAmount, CURRENCY.CHIPS, playerList?.stackAmountInBB),
                    tableNumber: playerList?.tableId
                }
            })
        }
        else {
            return [];
        }
    }

    static getTournamentDetailsPrizeList(prizeLists: TournamentPrizeList[] = []): ITournamentPrizeList[] | [] {
        if (prizeLists.length > 0) {
            return prizeLists.map((prizeList: TournamentPrizeList) => {
                return {
                    amount: AmountUtil.getAmountWithCurrency(prizeList?.amount, CURRENCY.INR),
                    asset: prizeList?.asset,
                    idx: prizeList?.idx,
                    isIdxShow: prizeList?.isIdxShow,
                    playerId: prizeList?.playerId,
                    playerName: prizeList?.playerName,
                    rank: prizeList?.rank,
                    point: prizeList?.point
                }
            });
        }
        else {
            return [];
        }
    }

    static getTournamentDetailsPrizeListV2(prizeLists: TournamentPrizeList[] = [], resp: TournamentDetails): ITournamentPrizeList[] | [] {
        if (prizeLists.length > 0) {
            return prizeLists.map((prizeList: TournamentPrizeList) => {
                return {
                    amount: AmountUtil.getAmountWithTournamentCurrency(prizeList?.amount, resp?.prizeDistributionDetails?.primaryCurrency, resp?.prizeDistributionDetails?.isOverlay),
                    primaryAmount: AmountUtil.getAmountWithTournamentCurrency(prizeList?.primaryValue, resp?.prizeDistributionDetails?.primaryCurrency, false),
                    secondaryAmount: AmountUtil.getAmountWithTournamentCurrency(prizeList?.secondaryValue, resp?.prizeDistributionDetails?.secondaryCurrency, false),
                    asset: (prizeList?.asset) ? '1 SEAT' : '',
                    idx: prizeList?.idx,
                    isIdxShow: prizeList?.isIdxShow,
                    playerId: prizeList?.playerId,
                    playerName: prizeList?.playerName,
                    rank: prizeList?.rank,
                    point: prizeList?.point
                }
            });
        }
        else {
            return [];
        }
    }

    static getTournamentDetailsPrizeListV3(prizeLists: TournamentPrizeList[] = [], resp: TournamentDetails): ITournamentPrizeList[] | [] {
        if (prizeLists.length > 0) {
            return prizeLists.map((prizeList: TournamentPrizeList) => {
                return {
                    amount: AmountUtil.getAmountWithTournamentCurrency(prizeList?.amount, resp?.prizeDistributionDetails?.primaryCurrency, resp?.prizeDistributionDetails?.isOverlay),
                    primaryAmount: AmountUtil.getAmountWithTournamentCurrency(prizeList?.primaryValue, resp?.prizeDistributionDetails?.primaryCurrency, false),
                    secondaryAmount: AmountUtil.getAmountWithTournamentCurrency(prizeList?.secondaryValue, resp?.prizeDistributionDetails?.secondaryCurrency, false),
                    asset: prizeList?.asset,
                    idx: prizeList?.idx,
                    isIdxShow: prizeList?.isIdxShow,
                    playerId: prizeList?.playerId,
                    playerName: prizeList?.playerName,
                    rank: prizeList?.rank,
                    point: prizeList?.point
                }
            });
        }
        else {
            return [];
        }
    }

    static getTournamentBlindStructureDetails(response: TournamentBlindStructure[] = []): ITournamentBlindStructure[] | [] {
        if (response?.length > 0) {
            return response.map((resp: TournamentBlindStructure) => {
                return {
                    level: resp?.level,
                    smallBlindAmount: AmountUtil.getAmountWithCurrency(resp?.smallBlindAmount, CURRENCY.INR),
                    bigBlindAmount: AmountUtil.getAmountWithCurrency(resp?.bigBlindAmount, CURRENCY.INR),
                    anteAmount: AmountUtil.getAmountWithCurrency(resp?.anteAmount, CURRENCY.INR),
                    turnDuration: resp?.turnDuration,
                    timeBankDuration: resp?.timeBankDuration,
                    timeBankRenewDuration: resp?.timeBankRenewDuration,
                    reconnectTimerDuration: resp?.reconnectTimerDuration,
                    disconnectTimerDuration: resp?.disconnectTimerDuration,
                    blindDuration: resp?.blindDuration
                }
            })
        }
        else {
            return [];
        }
    }

    static getTournamentEntryConfig(entryConfig: EntryConfig) {
        if (entryConfig?.config) {
            const config = entryConfig?.config
            return {
                bountyAmount: AmountUtil.getAmountWithCurrency(config?.bountyAmount, CURRENCY.INR),
                limit: config?.limit,
                methods: config?.methods,
                popUpDuration: config?.popUpDuration,
                prizePoolContribution: AmountUtil.getAmountWithCurrency(config?.prizePoolContribution, CURRENCY.INR),
                registrationFee: AmountUtil.getAmountWithCurrency(config?.registrationFee, CURRENCY.INR),
                totalAmount: AmountUtil.getAmountWithCurrency(config?.totalAmount, CURRENCY.INR),
                topUpDuration: config?.topUpDuration,
                end: config?.end,
                minStack: AmountUtil.getAmountWithCurrency(config?.minStack, CURRENCY.INR),
                reBuyLimit: config?.reBuyLimit,
                reBuyDuration: config?.reBuyDuration,
                reBuyMinStack: AmountUtil.getAmountWithCurrency(config?.reBuyMinStack, CURRENCY.INR),
                reBuyTopUpDuration: config?.reBuyTopUpDuration,
                reBuyEnd: config?.reBuyEnd,
                addOnAfter: config?.addOnAfter,
                addOnChips: config?.addOnChips,
                addOnAmount: AmountUtil.getAmountWithCurrency(config?.addOnAmount, CURRENCY.INR),
                addOnDuration: config?.addOnDuration
            }
        }
    }


    static getPlayerTournamentStatus(status: string): PlayerTournamentStatus {
        switch (status) {
            case GsPlayerTournamntStatus.PLAYING:
                return PlayerTournamentStatus.PLAYING;
            case GsPlayerTournamntStatus.REGISTERED:
                return PlayerTournamentStatus.REGISTERED
            case GsPlayerTournamntStatus.BUSTED:
                return PlayerTournamentStatus.BUSTED
            case GsPlayerTournamntStatus.FINISHED:
                return PlayerTournamentStatus.FINISHED
            case GsPlayerTournamntStatus.COMPLETED:
                return PlayerTournamentStatus.COMPLETED
            default:
                return;
        }
    }

    static getPlayerTournamentStatusV3(status: string): PlayerTournamentStatus {
        switch (status) {
            case GsPlayerTournamntStatus.PLAYING:
                return PlayerTournamentStatus.REGISTERED;
            case GsPlayerTournamntStatus.REGISTERED:
                return PlayerTournamentStatus.REGISTERED
            case GsPlayerTournamntStatus.BUSTED:
                return PlayerTournamentStatus.BUSTED
            case GsPlayerTournamntStatus.FINISHED:
                return PlayerTournamentStatus.FINISHED
            case GsPlayerTournamntStatus.COMPLETED:
                return PlayerTournamentStatus.COMPLETED
            default:
                return;
        }
    }

    static getTournamentTypeFromGsResponse(type: GsTournamentType): TournamentType {
        switch (type) {
            case GsTournamentType.NORMAL:
                return TournamentType.NORMAL;
            case GsTournamentType.BOUNTY:
                return TournamentType.BOUNTY;
            case GsTournamentType.PROGRESSIVE_BOUNTY:
                return TournamentType.PROGRESSIVE_BOUNTY;
            case GsTournamentType.HIT_AND_RUN:
                return TournamentType.HIT_AND_RUN;
            case GsTournamentType.WIN_THE_BUTTON:
                return TournamentType.WIN_THE_BUTTON;
            case GsTournamentType.THIRTY_BB:
                return TournamentType.THIRTY_BB;
            case GsTournamentType.MSP:
                return TournamentType.MSP;
            case GsTournamentType.MFP:
                return TournamentType.MFP;
            case GsTournamentType.POINTS:
                return TournamentType.POINTS
            default:
                return;
        }
    }

    static getEntryMethodsFromGsResponse(type: GsMoneyType[] = []): MoneyType[] {
        return type.map((moneyType) => {
            switch (moneyType) {
                case GsMoneyType.FREE_ROLL:
                    return MoneyType.FREE_ROLL;
                case GsMoneyType.POKER_MONEY:
                    return MoneyType.POKER_MONEY;
                case GsMoneyType.TICKET:
                    return MoneyType.TICKET;
                case GsMoneyType.POCKET_COIN:
                    return MoneyType.POCKET_COIN;
                case GsMoneyType.AUTO_REGISTER:
                    return MoneyType.AUTO_REGISTER;
                default:
                    return;
            }
        });
    }

    //TODO handle other buyin methods
    static getEntryMethodsFromSupernovaResponse(entryMethod: AriesTournamentBuyInMethod): MoneyType{
        switch (entryMethod) {
            case AriesTournamentBuyInMethod.REAL_MONEY:
                return MoneyType.POKER_MONEY;
            case AriesTournamentBuyInMethod.TICKET:
                return MoneyType.TICKET;
            default:
                return;
        }
    }

    static getEntryTypeFromGsResponse(type: GsEntryType): EntryType {
        switch (type) {
            case GsEntryType.FREEZE_OUT:
                return EntryType.FREEZE_OUT;
            case GsEntryType.RE_ENTRY:
                return EntryType.RE_ENTRY;
            case GsEntryType.RE_BUY:
                return EntryType.RE_BUY;
            case GsEntryType.RE_BUY_ADD_ON:
                return EntryType.RE_BUY_ADD_ON;
            default:
                return;
        }
    }

    static getTournamentStatusFromGsResponse(tournamentState: GsTournamentState): TournamentStatus {
        switch (tournamentState) {
            case GsTournamentState.ANNOUNCED:
                return TournamentStatus.ANNOUNCED;
            case GsTournamentState.REGISTERING:
                return TournamentStatus.REGISTERING;
            case GsTournamentState.RUNNING:
                return TournamentStatus.RUNNING;
            case GsTournamentState.LATE_REGISTRATION:
                return TournamentStatus.LATE_REGISTRATION;
            case GsTournamentState.COMPLETED:
                return TournamentStatus.COMPLETED;
            case GsTournamentState.CANCELLED:
                return TournamentStatus.CANCELLED;
            case GsTournamentState.ABORTED:
                return TournamentStatus.ABORTED;
            default:
                return;
        }
    }

    static getTournamentSpeedFromGsResponse(tournamentSpeed: GsTournamentSpeed): TournamentSpeed {
        switch (tournamentSpeed) {
            case GsTournamentSpeed.SLOW:
                return TournamentSpeed.SLOW;
            case GsTournamentSpeed.NORMAL:
                return TournamentSpeed.NORMAL;
            case GsTournamentSpeed.TURBO:
                return TournamentSpeed.TURBO;
            case GsTournamentSpeed.HYPER_TURBO:
                return TournamentSpeed.HYPER_TURBO;
            case GsTournamentSpeed.HYPER:
                return TournamentSpeed.HYPER
            case GsTournamentSpeed.REGULAR:
                return TournamentSpeed.REGULAR
            default:
                return;
        }
    }

    static getTournamentTypeText(type: TournamentType): string {
        switch (type) {
            case TournamentType.NORMAL:
                return TournamentTypeText.Normal
            case TournamentType.BOUNTY:
                return TournamentTypeText.Bounty
            case TournamentType.PROGRESSIVE_BOUNTY:
                return TournamentTypeText.ProgressiveBounty
            case TournamentType.HIT_AND_RUN:
                return TournamentTypeText.HitAndRun
            case TournamentType.WIN_THE_BUTTON:
                return TournamentTypeText.WinTheButton
            case TournamentType.THIRTY_BB:
                return TournamentTypeText.BB30
            case TournamentType.MSP:
                return TournamentTypeText.MSP
            case TournamentType.MFP:
                return TournamentTypeText.MFP
            case TournamentType.POINTS:
                return TournamentTypeText.Points
            default:
                return;
        }
    }

    static getTournamentSpeedText(value: TournamentSpeed): string {
        switch (value) {
            case TournamentSpeed.SLOW:
                return TournamentSpeedText.Slow
            case TournamentSpeed.NORMAL:
                return TournamentSpeedText.Normal
            case TournamentSpeed.TURBO:
                return TournamentSpeedText.Turbo
            case TournamentSpeed.HYPER_TURBO:
                return TournamentSpeedText.HyperTurbo
            case TournamentSpeed.HYPER:
                return TournamentSpeedText.Hyper
            case TournamentSpeed.REGULAR:
                return TournamentSpeedText.Regular
            default:
                return;
        }
    }

    static getTournamentEntryTypeText(value: EntryType): string {
        switch (value) {
            case EntryType.FREEZE_OUT:
                return TournamentEntryTypeText.FreezeOut
            case EntryType.RE_ENTRY:
                return TournamentEntryTypeText.ReEntry
            case EntryType.RE_BUY:
                return TournamentEntryTypeText.ReBuy
            case EntryType.RE_BUY_ADD_ON:
                return TournamentEntryTypeText.ReBuyAddOn
            default:
                return;
        }
    }

    static getTournamentPrizeConfig(value: PrizeConfigType): string {
        switch (value) {
            case PrizeConfigType.OVERLAY:
                return TournamentPrizeConfigType.Overlay
            case PrizeConfigType.FIXED:
                return TournamentPrizeConfigType.Fixed
            default:
                return;
        }
    }

    static getTournamentCurrencyInString(value: TournamentCurrencyType): string {
        switch (value) {
            case TournamentCurrencyType.WS:
                return TournamentCurrencyTypeUi.WS
            case TournamentCurrencyType.TDC:
                return TournamentCurrencyTypeUi.TDC
            case TournamentCurrencyType.DC:
                return TournamentCurrencyTypeUi.DC
            default:
                return '';
        }
    }

    static getTournamentStatusText(value: TournamentStatus): string {
        switch (value) {
            case TournamentStatus.ANNOUNCED:
                return TournamentStatusText.Announced
            case TournamentStatus.REGISTERING:
                return TournamentStatusText.Registering
            case TournamentStatus.RUNNING:
                return TournamentStatusText.Registering
            case TournamentStatus.LATE_REGISTRATION:
                return TournamentStatusText.LateRegistration
            case TournamentStatus.COMPLETED:
                return TournamentStatusText.Completed
            case TournamentStatus.CANCELLED:
                return TournamentStatusText.Canceled
            case TournamentStatus.ABORTED:
                return TournamentStatusText.Aborted
            default:
                return;
        }
    }

    static getTournamentEntryMethodText(values: MoneyType[] = []): string[] {
        return values.map((value) => {
            switch (value) {
                case MoneyType.FREE_ROLL:
                    return TouranementEntryMethodsText.FreeRoll
                case MoneyType.POKER_MONEY:
                    return TouranementEntryMethodsText.PokerMoney
                case MoneyType.TICKET:
                    return TouranementEntryMethodsText.Ticket
                case MoneyType.POCKET_COIN:
                    return TouranementEntryMethodsText.PocketCoin
                default:
                    return;
            }
        });
    }

    static getPlayerTournamentStatusText(value: PlayerTournamentStatus): string {
        switch (value) {
            case PlayerTournamentStatus.PLAYING:
                return GsPlayerTournamntStatus.PLAYING;
            case PlayerTournamentStatus.REGISTERED:
                return GsPlayerTournamntStatus.REGISTERED;
            case PlayerTournamentStatus.BUSTED:
                return GsPlayerTournamntStatus.BUSTED;
            case PlayerTournamentStatus.FINISHED:
                return GsPlayerTournamntStatus.FINISHED;
            case PlayerTournamentStatus.COMPLETED:
                return GsPlayerTournamntStatus.COMPLETED
            default:
                return;
        }
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

    static getEntryTypeFromAriesCanReenter(canReenter: Number): EntryType {
        switch (canReenter) {
            case 0:
                return EntryType.FREEZE_OUT;
            case 1:
                return EntryType.RE_ENTRY;
            default:
                return;
        }
    }

    //TODO need UI change
    static getTournamentTypeFromAriesTournamentType(type: AriesTournamentType): TournamentType {
        switch (type) {
            case AriesTournamentType.NORMAL:
                return TournamentType.NORMAL;
            case AriesTournamentType.SATELLITE:
                return TournamentType.NORMAL;
            case AriesTournamentType.PSL:
                return TournamentType.POINTS;
            default:
                return;
        }
    }

    static getTournamentEntryConfigFromAriesResponse(response: AriesTournamentResponse): EntryConfig {
        return {
                type: TournamentUtil.getEntryTypeFromAriesCanReenter(response?.canReenter),
                config: {
                    limit: response?.reentryLimit,
                    totalAmount: CurrencyUtil.getAmountInRupee(response?.reentryAmount)
                    // bountyAmount: entryConfig?.config?.bounty_amount,
                    // methods: TournamentUtil.getEntryMethodsFromGsResponse(entryConfig?.config?.methods),
                    // popUpDuration: entryConfig?.config?.pop_up_duration,
                    // prizePoolContribution: entryConfig?.config?.prize_pool_contribution,
                    // registrationFee: entryConfig?.config?.registration_fee,
                    // topUpDuration: entryConfig?.config?.top_up_duration,
                    // end: entryConfig?.config?.end,
                    // minStack: entryConfig?.config?.min_stack,
                    // reBuyLimit: entryConfig?.config?.re_buy_limit,
                    // reBuyDuration: entryConfig?.config?.re_buy_duration,
                    // reBuyMinStack: entryConfig?.config?.re_buy_min_stack,
                    // reBuyTopUpDuration: entryConfig?.config?.re_buy_top_up_duration,
                    // reBuyEnd: entryConfig?.config?.re_buy_end,
                    // addOnAfter: entryConfig?.config?.add_on_after,
                    // addOnChips: entryConfig?.config?.add_on_chips,
                    // addOnAmount: entryConfig?.config?.add_on_amount,
                    // addOnDuration: entryConfig?.config?.add_on_duration
                }
        }
    }

    static getTournamentBuyInConfigFromAriesResponse(response: AriesTournamentResponse): BuyInConfig {
        return {
            type: TournamentUtil.getMoneyTypesFromTournamentBuyInMethod(response?.reentryBuyinMethod ?? []), //TODO remove hardcoded
            totalAmount: CurrencyUtil.getAmountInRupee(response?.registrationAmount),
            registrationFee: CurrencyUtil.getAmountInRupee(response?.registrationFee),
            prizePoolContribution: CurrencyUtil.getAmountInRupee(response?.registrationAmount) - CurrencyUtil.getAmountInRupee(response?.registrationFee),
            bountyAmount: 0,
        }
    }

    static getMoneyTypesFromTournamentBuyInMethod (buyInMethods: TournamentBuyInMethod[]): MoneyType[] {
        return buyInMethods.map((buyInMethod: TournamentBuyInMethod) => {
            switch (buyInMethod) {
                case TournamentBuyInMethod.REAL_MONEY:
                    return MoneyType.POKER_MONEY
                case TournamentBuyInMethod.AUTO_REGISTER:
                    return MoneyType.AUTO_REGISTER
                default:
                  return MoneyType.POKER_MONEY
            }
        })
    }

    //TODO need UI change
    static getTournamentStatusFromAriesTournamentStatus(ariesTournamentStatus: TournamentStatusAries): TournamentStatus {
        switch (ariesTournamentStatus) {
            case TournamentStatusAries.ANNOUNCED:
                return TournamentStatus.ANNOUNCED;
            case TournamentStatusAries.REGISTRATION:
                return TournamentStatus.REGISTERING;
            case TournamentStatusAries.RUNNING:
                return TournamentStatus.RUNNING;
            case TournamentStatusAries.LATE_REGISTRATION:
                return TournamentStatus.LATE_REGISTRATION;
            case TournamentStatusAries.COMPLETED:
                return TournamentStatus.COMPLETED;
            case TournamentStatusAries.CANCELED:
                return TournamentStatus.CANCELLED;
            case TournamentStatusAries.ABORTED:
                return TournamentStatus.ABORTED;
            default:
                return;
        }
    }
    static getTournamentCurrencyTypeFromAriesTournamentCurrency(tournamentCurrency: AriesTournamentCurrency): TournamentCurrencyType {
        switch (tournamentCurrency) {
            case AriesTournamentCurrency.DISCOUNT_CREDIT:
                return TournamentCurrencyType.DC;
            case AriesTournamentCurrency.TOURNAMENT_DISCOUNT_CREDIT:
                return TournamentCurrencyType.TDC;
            case AriesTournamentCurrency.WINNING_SEGMENT:
                return TournamentCurrencyType.WS;
            // TODO handle case AriesTournamentCurrency.TICKET
            default:
                return;
        }
    }

    static getIsSatelliteFromAriesTournamentType(tournamentType: AriesTournamentType): boolean {
        return tournamentType === AriesTournamentType.SATELLITE;
    }

    static getTournamentNameFromAriesTournamentVendorMetadata(vendorMetadata: Array<AriesTournamentVendorNameMapping>, vendorId: number): string {
        return (vendorMetadata.find(vendor => vendor.vendorId === vendorId) || {}).vendorTournamentName || "";
    }

    static getAssetValue(resp: AriesPrizeStructureLobby): string{
        let asset = '';
        if (resp.prizeType == AriesTournamentPrizeType.SEATS) {
            asset = '1 SEAT';
        } else if (resp.prizeType == AriesTournamentPrizeType.POINTS) {
            asset = `${CurrencyUtil.getPointsDeScaled(resp.prizeValue)} POINTS`
        }
        return asset;
    }

    //TODO handle other cases
    static getAriesBuyInMethodFromGSEntryMethod(gsEntryMethod : string): AriesTournamentBuyInMethod {
        switch (gsEntryMethod) {
            case GsMoneyType.POKER_MONEY:
                return AriesTournamentBuyInMethod.REAL_MONEY;
            case GsMoneyType.TICKET:
                return AriesTournamentBuyInMethod.TICKET;
            case GsMoneyType.AUTO_REGISTER:
                return AriesTournamentBuyInMethod.AUTO_REGISTER;
            default:
                return;
        }
    }

    static getIsOverlayActiveFromAriesPrizeDistributionType(prizeDistributionType: AriesPrizeDistributionType, overlayPercent: number): boolean {
        switch (prizeDistributionType) {
            case AriesPrizeDistributionType.FIXED :
                return false
            case AriesPrizeDistributionType.OVERLAY:
                return overlayPercent < 100;
            default:
                return;
        }
    }

    static getTotalTicketsFromAriesPrizeAsset(prizeType: AriesTournamentPrizeType, prizeAssetCount: number): number {
        return prizeType == AriesTournamentPrizeType.SEATS ? prizeAssetCount : 0;
    }

    static getTournamentPrizeConfigFromAriesPrizeDistributionType(prizeDistributionType: AriesPrizeDistributionType): PrizeConfigType {
        switch (prizeDistributionType) {
            case AriesPrizeDistributionType.OVERLAY:
                return PrizeConfigType.OVERLAY;
            case AriesPrizeDistributionType.FIXED:
                return PrizeConfigType.FIXED;
            default:
                return;
        }
    }

    static getTimeInMilliSeconds(timeInNanoSeconds: number ) {
        return timeInNanoSeconds / 1000000;
    }

    static isTournamentRunning(status: TournamentStatusAries){
       return (status == TournamentStatusAries.RUNNING || status == TournamentStatusAries.PRIZE_STRUCTURE_CREATION_IN_PROGRESS
         ||status == TournamentStatusAries.LATE_REGISTRATION);
    }
}
