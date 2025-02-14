import { CURRENCY, GameFeatures, TournamentSeat } from "../constants/constants";
import CurrencyUtil from '../helpers/currency-util';
import { SeatData, SeatsData } from '../models/aries/seats-data';
import { TableConfig } from '../models/aries/table-config';
import { AriesTableMetaAndSeatDetails } from '../models/aries/aries-table-meta-and-seat-details';
import { PlayerTournamentStatus } from "../models/enums/tournament/player-tournament-status";
import { TournamentStatus } from "../models/enums/tournament/tournament-status";
import {
    IBuyInConfig,
    IEntryConfig,
    IGroup,
    IGroupTableResponse,
    IJoinTable,
    IPlayerMTTListResponse,
    IQuickJoinGroup,
    IReserveRoom,
    IRoom,
    ISatelliteTournament, ITableMetaAndSeatDetails,
    ITablePlayerDetailsResponse,
    ITableResponse,
    ITournament,
    ITournamentBlindStructureResponse,
    ITournamentConfig,
    ITournamentDetails, ITournamentDetailsV3,
    ITournamentListingConfigV3,
    ITournamentListResponse, ITournamentListResponseV3, ITournamentV3
} from "../models/gateway/response";
import { JoinTable } from "../models/join-table";
import { PlayerMTTList } from "../models/player-mtt-list";
import { QuickJoinGroup } from '../models/quick-join-group';
import { ReserveRoom } from "../models/reserve-room";
import { Room } from "../models/room";
import { Group } from "../models/group";
import { TournamentEntryDetailsResponseV2, TournamentEntryDetailsResponseV3 } from '../models/supernova/tournament-response';
import TableMetaAndSeatDetails from '../models/table-meta-and-seat-details';
import {
    BuyInConfig,
    EntryConfig,
    nonFeaturedPlayerTournamentStatus,
    nonFetaturedTournamentStatus,
    Tournament
} from "../models/tournament";
import { TournamentBlindStructure } from "../models/tournament-blind-structure";
import { TournamentDetails } from "../models/tournament-details";
import AmountUtil from "./amount-util";
import { TournamentUtil } from "./tournament-util";
import LoggerUtil, { ILogger } from "./logger";
import { DateUtil } from "./date-util";
import { Table } from "../models/cash-table";
import { TablePlayer, TablePlayersDetails } from "../models/cash-table-player-details";
import { RoomUtil } from "./room-util";
import { TournamentEntryDetails } from "../models/game-server/tournament-entry-details";
import { TournamentEntryDetailsRequest, TournamentEntryDetailsRequestV2 } from "../models/supernova/request";
import { TournamentEntryDetailsResponse } from "../models/supernova/response";
import AriesTournamentResponse from "../models/tournament/response/tournament-response"
import { getCashAppPracticeGroups, getCashAppPracticeRooms } from "../services/configService";
import { TableDetails } from "../models/table-details";
import { TableUtil } from "./table-util";
import { GroupUtil } from "./group-util";
import AriesUtil from "./aries-util";

const logger: ILogger = LoggerUtil.get("LobbyUtil");

export class LobbyUtil {

    static getRoomTableResponse(resp: Table[] = [], isPractice: boolean): ITableResponse {
        const currency = isPractice ? CURRENCY.CHIPS : CURRENCY.INR
        return {
            tables: resp?.map((table: Table) => {
                return {
                    id: table?.id,
                    name: table?.name,
                    averageStack: AmountUtil.getAmountWithCurrency(table?.averageStack, currency),
                    tableIndex: table?.tableIndex,
                    playerCount: table?.playerCount
                }
            })
        }
    }

    static getTablePlayersResponse(resp: TablePlayersDetails, isPractice: boolean): ITablePlayerDetailsResponse {
        const currency = isPractice ? CURRENCY.CHIPS : CURRENCY.INR
        return {
            averagePot: AmountUtil.getAmountWithCurrency(resp?.averagePot, currency),
            playerList: (resp?.playerList || []).map((player: TablePlayer) => {
                return {
                    name: player?.name,
                    currentStack: AmountUtil.getAmountWithCurrency(player?.currentStack, currency),
                    vendorId: player?.vendorId,
                    showVendorId: player?.showVendorId
                }
            })
        }
    }

    static divideRoomList(rooms: Room[]) {
        const resp = {
            practiceRooms: [],
            nonPracticeRooms: []
        }
        rooms.map((room) => {
            if (room?.isPractice) {
                /* seperate practice and nonPracticeRooms */
                resp.practiceRooms.push(room)
            }
            else {
                resp.nonPracticeRooms.push(room)
            }
        })
        return resp;
    }

    static divideGroupList(groups: Group[]) {
        const resp = {
            practiceGroups: [],
            nonPracticeGroups: []
        }
        groups.map((group) => {
            if (group?.isPractice) {
                /* seperate practice and nonPracticeRooms */
                resp.practiceGroups.push(group)
            }
            else {
                resp.nonPracticeGroups.push(group)
            }
        })
        return resp;
    }

    static getRoomsData(rooms: Room[] = []): IRoom[] {
        const { practiceRooms, nonPracticeRooms } = LobbyUtil.divideRoomList(rooms);
        const cashAppPracticeRooms = getCashAppPracticeRooms();
        logger.info(`[getRoomsData] cashAppPracticeRooms: ${JSON.stringify(cashAppPracticeRooms)}`);
        practiceRooms.sort(RoomUtil.sortRoomsComparator);
        nonPracticeRooms.sort(RoomUtil.sortRoomsComparator);
        const practiceRoomResponse = practiceRooms
            .filter((room: Room) => room?.id && cashAppPracticeRooms.includes(room.id))
            .map((room: Room) => {
                let currency: number = CURRENCY.INR
                if (room?.isPractice) {
                    currency = CURRENCY.CHIPS
                }
                return {
                    id: room?.id,
                    name: room?.name,
                    gameType: room?.gameType,
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
            })
        const nonPracticeRoomsRespones = nonPracticeRooms.map((room: Room) => {
            let currency: number = CURRENCY.INR
            if (room?.isPractice) {
                currency = CURRENCY.CHIPS
            }
            return {
                id: room?.id,
                name: room?.name,
                gameType: room?.gameType,
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
        })

        return [...practiceRoomResponse, ...nonPracticeRoomsRespones]
    }

    static getPracticeRoomsData(rooms: Room[] = []): IRoom[] {
        const { practiceRooms } = LobbyUtil.divideRoomList(rooms);
        practiceRooms.sort(RoomUtil.sortRoomsComparator);

        const practiceRoomResponse = practiceRooms.map((room: Room) => {
            let currency: number = CURRENCY.INR
            if (room?.isPractice) {
                currency = CURRENCY.CHIPS
            }
            return {
                id: room?.id,
                name: room?.name,
                gameType: room?.gameType,
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
        })

        return practiceRoomResponse;
    }


    static getGroupsData(groups: Group[] = []): IGroup[] {
        const { practiceGroups, nonPracticeGroups } = LobbyUtil.divideGroupList(groups);
        const cashAppPracticeGroups = getCashAppPracticeGroups();
        logger.info(`[getGroupsData] cashAppPracticeGroups: ${JSON.stringify(cashAppPracticeGroups)}`);
        practiceGroups.sort(GroupUtil.sortGroupsComparator);
        nonPracticeGroups.sort(GroupUtil.sortGroupsComparator);

        const practiceGroupResponse = practiceGroups
            .filter((group: Group) => group?.id && cashAppPracticeGroups.includes(group.id))
            .map((group: Group) => {
                const currency = CURRENCY.CHIPS
                return {
                    id: group?.id,
                    name: group?.name,
                    gameType: group?.gameType,
                    gameVariant: group?.gameVariant,
                    smallBlindAmount: AmountUtil.getAmountWithCurrency(group?.smallBlindAmount, currency),
                    bigBlindAmount: AmountUtil.getAmountWithCurrency(group?.bigBlindAmount, currency),
                    minBuyInAmount: AmountUtil.getAmountWithCurrency(group?.minBuyInAmount, currency),
                    maxBuyInAmount: AmountUtil.getAmountWithCurrency(group?.maxBuyInAmount, currency),
                    playerCount: group?.playerCount,
                    isPractice: group?.isPractice,
                    isQuickJoinEnabled: group?.isQuickJoinEnabled,
                    migratedRoom: group?.migratedRoom,
                    groupCardMeta: {
                        ritEnabledText: GameFeatures.rit,
                        potOfGoldEnabledText: GameFeatures.potOfGold,
                        annonymousRoomText: GameFeatures.annonymous,
                        tableEvChopEnabledText: GameFeatures.evChop,
                        practiceText: GameFeatures.practice,
                        gameVariantText: GroupUtil.getGameVariantText(group?.gameVariant)
                    }
                }
            })

        const nonPracticeGroupsResponse = nonPracticeGroups.map((group: Group) => {
            //Currency Chips harcode to remove rupee symbol in INr
            const currency = CURRENCY.INR;
            return {
                id: group?.id,
                name: group?.name,
                gameType: group?.gameType,
                gameVariant: group?.gameVariant,
                smallBlindAmount: AmountUtil.getAmountWithCurrency(group?.smallBlindAmount, CURRENCY.CHIPS),
                bigBlindAmount: AmountUtil.getAmountWithCurrency(group?.bigBlindAmount, CURRENCY.CHIPS),
                minBuyInAmount: AmountUtil.getAmountWithCurrency(group?.minBuyInAmount, currency),
                maxBuyInAmount: AmountUtil.getAmountWithCurrency(group?.maxBuyInAmount, currency),
                playerCount: group?.playerCount,
                isPractice: group?.isPractice,
                isQuickJoinEnabled: group?.isQuickJoinEnabled,
                migratedRoom: group?.migratedRoom,
                groupCardMeta: {
                    ritEnabledText: GameFeatures.rit,
                    potOfGoldEnabledText: GameFeatures.potOfGold,
                    annonymousRoomText: GameFeatures.annonymous,
                    tableEvChopEnabledText: GameFeatures.evChop,
                    practiceText: GameFeatures.practice,
                    gameVariantText: GroupUtil.getGameVariantText(group?.gameVariant)
                }
            }
        })

        return [...practiceGroupResponse, ...nonPracticeGroupsResponse]
    }

    static getPracticeGroupsData(groups: Group[] = []): IGroup[] {
        const { practiceGroups } = LobbyUtil.divideGroupList(groups);
        practiceGroups.sort(GroupUtil.sortGroupsComparator);

        const practiceGroupResponse = practiceGroups.map((group: Group) => {

            const currency = CURRENCY.CHIPS
            return {
                id: group?.id,
                name: group?.name,
                gameType: group?.gameType,
                gameVariant: group?.gameVariant,
                smallBlindAmount: AmountUtil.getAmountWithCurrency(group?.smallBlindAmount, currency),
                bigBlindAmount: AmountUtil.getAmountWithCurrency(group?.bigBlindAmount, currency),
                minBuyInAmount: AmountUtil.getAmountWithCurrency(group?.minBuyInAmount, currency),
                maxBuyInAmount: AmountUtil.getAmountWithCurrency(group?.maxBuyInAmount, currency),
                playerCount: group?.playerCount,
                isPractice: group?.isPractice,
                isQuickJoinEnabled: group?.isQuickJoinEnabled,
                migratedRoom: group?.migratedRoom,
                groupCardMeta: {
                    ritEnabledText: GameFeatures.rit,
                    potOfGoldEnabledText: GameFeatures.potOfGold,
                    annonymousRoomText: GameFeatures.annonymous,
                    tableEvChopEnabledText: GameFeatures.evChop,
                    practiceText: GameFeatures.practice,
                    gameVariantText: GroupUtil.getGameVariantText(group?.gameVariant)
                }
            }
        })

        return practiceGroupResponse;
    }


    static getReserveRoomResponse(reserveRoom: ReserveRoom, userId: string): IReserveRoom {
        return {
            userId: Number(userId),
            tableId: reserveRoom?.tableId,
            seatId: reserveRoom?.seatId,
            wallet: RoomUtil.getRoomWalletResponse(reserveRoom?.wallet),
            tableDetails: RoomUtil.getRoomTableDetails(reserveRoom?.tableDetails, false),
            ticketDetails: RoomUtil.getRoomTicketDetails(reserveRoom?.ticketDetails, false),
            showPopup: RoomUtil.showPopupCheck(reserveRoom),
            popupMeta: {
                popUpHeader: "Join Table",
                tableBlindsText: "Table Blinds",
                bonusText: "User ##BONUS##% of your bonus amount",
                bonusPlaceholderText: "##BONUS##",
                sliderMinBuyInText: "MIN",
                sliderMaxButtonText: "MAX",
                joinTableButtonText: "Join Table",
                timerText: " You have  ##SECONDS## to confirm",
                timerPlaceholderText: "##SECONDS##",
                antiBankingTimerText: "Your AntiBanking remaining timer ##SECONDS##",
                antiBankingTimerPlaceholderText: "##SECOND##"
            }
        }
    }

    static getReservePracticeRoomResponse(reserveRoom: ReserveRoom, userId: string): IReserveRoom {
        return {
            userId: Number(userId),
            tableId: reserveRoom?.tableId,
            seatId: reserveRoom?.seatId,
            wallet: RoomUtil.getRoomWalletResponse(reserveRoom?.wallet),
            tableDetails: RoomUtil.getRoomTableDetails(reserveRoom?.tableDetails, true),
            ticketDetails: RoomUtil.getRoomTicketDetails(reserveRoom?.ticketDetails, true),
            showPopup: false,
            popupMeta: {
                popUpHeader: "Join Table",
                tableBlindsText: "Table Blinds",
                bonusText: "User ##BONUS##% of your bonus amount",
                bonusPlaceholderText: "##BONUS##",
                sliderMinBuyInText: "MIN",
                sliderMaxButtonText: "MAX",
                joinTableButtonText: "Join Table",
                timerText: " You have  ##SECONDS## to confirm",
                timerPlaceholderText: "##SECONDS##",
                antiBankingTimerText: "Your AntiBanking remaining time ##SECONDS##",
                antiBankingTimerPlaceholderText: "##SECOND##",
            }
        }
    }

    static getQuickJoinGroupResponse(quickJoinGroup: QuickJoinGroup, userId: string, vendorId: number): IQuickJoinGroup {
        return {
            userId: Number(userId),
            groupId: quickJoinGroup?.groupId,
            roomId: quickJoinGroup?.roomId,
            tableId: quickJoinGroup?.tableId,
            vendorId: `${vendorId}`,
            seatId: quickJoinGroup?.seatId,
            wallet: RoomUtil.getRoomWalletResponse(quickJoinGroup?.wallet),
            tableDetails: RoomUtil.getRoomTableDetails(quickJoinGroup?.tableDetails, false),
            ticketDetails: RoomUtil.getRoomTicketDetails(quickJoinGroup?.ticketDetails, false),
            showPopup: RoomUtil.showPopupCheck(quickJoinGroup),
            migratedRoom: quickJoinGroup?.migratedRoom,
            popupMeta: {
                popUpHeader: "Join Table",
                tableBlindsText: "Table Blinds",
                bonusText: "User ##BONUS##% of your bonus amount",
                bonusPlaceholderText: "##BONUS##",
                sliderMinBuyInText: "MIN",
                sliderMaxButtonText: "MAX",
                joinTableButtonText: "Join Table",
                timerText: " You have  ##SECONDS## to confirm",
                timerPlaceholderText: "##SECONDS##",
                antiBankingTimerText: "Your AntiBanking remaining timer ##SECONDS##",
                antiBankingTimerPlaceholderText: "##SECOND##"
            }
        }
    }

    static getQuickJoinPracticeGroupResponse(quickJoinGroup: QuickJoinGroup, userId: string, vendorId: number): IQuickJoinGroup {
        return {
            userId: Number(userId),
            groupId: quickJoinGroup?.groupId,
            roomId: quickJoinGroup?.roomId,
            tableId: quickJoinGroup?.tableId,
            seatId: quickJoinGroup?.seatId,
            vendorId: `${vendorId}`,
            wallet: RoomUtil.getRoomWalletResponse(quickJoinGroup?.wallet),
            tableDetails: RoomUtil.getRoomTableDetails(quickJoinGroup?.tableDetails, true),
            ticketDetails: RoomUtil.getRoomTicketDetails(quickJoinGroup?.ticketDetails, true),
            showPopup: RoomUtil.showPopupCheck(quickJoinGroup),
            migratedRoom: quickJoinGroup?.migratedRoom,
            popupMeta: {
                popUpHeader: "Join Table",
                tableBlindsText: "Table Blinds",
                bonusText: "User ##BONUS##% of your bonus amount",
                bonusPlaceholderText: "##BONUS##",
                sliderMinBuyInText: "MIN",
                sliderMaxButtonText: "MAX",
                joinTableButtonText: "Join Table",
                timerText: " You have  ##SECONDS## to confirm",
                timerPlaceholderText: "##SECONDS##",
                antiBankingTimerText: "Your AntiBanking remaining timer ##SECONDS##",
                antiBankingTimerPlaceholderText: "##SECOND##"
            }
        }
    }

    static getJoinTableResponse(joinTable: JoinTable, userId: string, tableId: string): IJoinTable {
        return {
            seatId: joinTable.seatId,
            userId: Number(userId),
            stackSize: AmountUtil.getAmountWithCurrency(joinTable?.stackSize, CURRENCY.INR),
            tableId: tableId
        }
    }

    static getJoinPracticeTableResponse(joinTable: JoinTable, userId: string, tableId: string): IJoinTable {
        return {
            seatId: joinTable.seatId,
            userId: Number(userId),
            stackSize: AmountUtil.getAmountWithCurrency(joinTable?.stackSize, CURRENCY.CHIPS),
            tableId: tableId
        }
    }

    static getGroupTablesResponse(tablesDetails: TableDetails[] = [], userId: number): IGroupTableResponse {
        tablesDetails.sort(TableUtil.sortTablesComparator);

        // Calculate total player count
        const totalPlayerCount = tablesDetails.reduce((total, table) => total + (table.playerCount || 0), 0);

        return {
            tables: tablesDetails?.map((table: TableDetails) => {
                const currency = table?.isPractice ? CURRENCY.CHIPS : CURRENCY.INR
                return {
                    id: table?.id,
                    roomId: table?.roomId,
                    smallBlindAmount: AmountUtil.getAmountWithCurrency(table?.smallBlindAmount, currency),
                    bigBlindAmount: AmountUtil.getAmountWithCurrency(table?.bigBlindAmount, currency),
                    minBuyInAmount: AmountUtil.getAmountWithCurrency(table?.minBuyInAmount, currency),
                    maxBuyInAmount: AmountUtil.getAmountWithCurrency(table?.maxBuyInAmount, currency),
                    gameType: table?.gameType,
                    gameVariant: table?.gameVariant,
                    isPractice: table?.isPractice,
                    isRIT: table?.ritActive,
                    isTurbo: table?.isTurbo,
                    isTenBB: table?.isTenBB,
                    maxSeats: table?.maxSeats,
                    averageStack: AmountUtil.getAmountWithCurrency(table?.averageStack, currency),
                    averagePot: AmountUtil.getFloorAmountWithCurrency(table?.averagePot, currency),
                    averagePotLevel: AriesUtil.getAveragePotLevel(table?.averagePot, table?.bigBlindAmount),
                    playerCount: table?.playerCount,
                    migratedRoom: table?.migratedRoom,
                    isPlayerSeated: table?.playerIds?.includes(userId),
                }
            }),
            totalPlayerCount: totalPlayerCount
        };
    }

    static getPlayerMTTListResponse(playerMTTList: PlayerMTTList, userId: number): IPlayerMTTListResponse {
        return {
            openedList: TournamentUtil.getPlayerTournamentOpenedList(playerMTTList?.openedList),
            viewingList: playerMTTList?.viewingList,
        }
    }

    static getTournamentBlindStructure(response: TournamentBlindStructure[], userId: number, tournamentId: string): ITournamentBlindStructureResponse {
        return {
            tournamentId: tournamentId,
            userId: userId,
            blindStructureDetails: TournamentUtil.getTournamentBlindStructureDetails(response),
            blindStructureMeta: {
                headerDesktopText: "BLIND STRUCUTRE",
                headerMobileText: "Blind Structure",
                levelHeaderText: "Level",
                blindsHeaderText: "Blinds",
                anteHeaderText: "Ante",
                durationHeaderText: "Duration(secs.)"
            }

        }
    }

    static getTournamentEntryConfig(entryConfig: EntryConfig): IEntryConfig {
        return {
            type: entryConfig?.type,
            config: TournamentUtil.getTournamentEntryConfig(entryConfig)
        }
    }

    static getTournamentBuyInConfig(buyInConfig: BuyInConfig): IBuyInConfig {
        return {
            type: buyInConfig?.type,
            totalAmount: AmountUtil.getAmountWithCurrency(buyInConfig?.totalAmount, CURRENCY.INR),
            registrationFee: AmountUtil.getAmountWithCurrency(buyInConfig?.registrationFee, CURRENCY.INR),
            prizePoolContribution: AmountUtil.getAmountWithCurrency(buyInConfig?.prizePoolContribution, CURRENCY.INR),
            bountyAmount: AmountUtil.getAmountWithCurrency(buyInConfig?.bountyAmount, CURRENCY.INR),
        }
    }

    static getSatelliteTournamentResponse(sattyList: Tournament[] = []): ISatelliteTournament[] {
        return sattyList.map((resp: Tournament) => {
            return {
                id: resp?.id,
                gameVariant: resp?.gameVariant,
                tournamentType: resp?.tournamentType,
                tournamentStatus: resp?.tournamentStatus,
                tournamentSpeed: resp?.tournamentSpeed,
                tournamentConfig: TournamentUtil.getSatelliteTournamentConfig(resp?.tournamentConfig),
                name: resp?.name,
                prizePool: AmountUtil.getAmountWithCurrency(resp?.prizePool, CURRENCY.INR),
                remainingPlayer: resp?.remainingPlayer,
                playerCount: resp?.playerCount,
                blindLevel: resp?.blindLevel,
                anteAmount: AmountUtil.getAmountWithCurrency(resp?.anteAmount, CURRENCY.INR),
                smallBlindAmount: AmountUtil.getAmountWithCurrency(resp?.smallBlindAmount, CURRENCY.INR),
                bigBlindAmount: AmountUtil.getAmountWithCurrency(resp?.bigBlindAmount, CURRENCY.INR),
                blindDuration: resp?.blindDuration,
                tournamentMeta: {
                    tournamentTypeText: TournamentUtil.getTournamentTypeText(resp?.tournamentType),
                    entryTypeText: TournamentUtil.getTournamentEntryTypeText(resp?.tournamentConfig?.entryType),
                    entryMethodsText: TournamentUtil.getTournamentEntryMethodText(resp?.tournamentConfig?.entryMethods),
                    tournamentStatusText: TournamentUtil.getTournamentStatusText(resp?.tournamentStatus),
                    tournamentSpeedText: TournamentUtil.getTournamentSpeedText(resp?.tournamentSpeed),
                },
            }
        })
    }


    static getTournamentDetails(resp: TournamentDetails, userId: number): ITournamentDetails {
        return {
            name: resp?.name || "",
            tournamentStatus: resp?.tournamentStatus,
            tableList: TournamentUtil.getTournamentDetailsTableList(resp?.tableList),
            playerList: TournamentUtil.getTournamentDetailsPlayerList(resp?.playerList),
            prizeList: TournamentUtil.getTournamentDetailsPrizeList(resp?.prizeList),
            blindDetails: {
                currentSmallBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.currentSmallBlindAmount, CURRENCY.INR),
                currentBigBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.currentBigBlindAmount, CURRENCY.INR),
                currentAnteAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.currentAnteAmount, CURRENCY.INR),
                currentLevel: resp?.blindDetails?.currentLevel,
                currentLevelStart: resp?.blindDetails?.currentLevelStart,
                currentLevelPause: resp?.blindDetails?.currentLevelPause,
                currentLevelEnd: resp?.blindDetails?.currentLevelEnd,
                nextSmallBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.nextSmallBlindAmount, CURRENCY.INR),
                nextBigBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.nextBigBlindAmount, CURRENCY.INR),
                nextAnteAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.nextAnteAmount, CURRENCY.INR),
                nextLevel: resp?.blindDetails?.nextLevel,
                nextLevelStart: resp?.blindDetails?.nextLevelStart
            },
            tournamentConfig: {
                minPlayers: resp?.tournamentConfig?.minPlayers,
                maxPlayers: resp?.tournamentConfig?.maxPlayers,
                totalBuyIns: resp?.tournamentConfig?.totalBuyIns,
                totalReBuys: resp?.tournamentConfig?.totalReBuys,
                totalAddOns: resp?.tournamentConfig?.totalAddOns,
                totalReEntries: resp?.tournamentConfig?.totalReEntries,
                entryConfig: LobbyUtil.getTournamentEntryConfig(resp?.tournamentConfig?.entryConfig),
                breakStart: resp?.tournamentConfig?.breakStart,
                breakEnd: resp?.tournamentConfig?.breakEnd,
                startTime: resp?.tournamentConfig?.startTime,
                endTime: resp?.tournamentConfig?.endTime,
                isSatellite: resp?.tournamentConfig?.isSatellite,
                satelliteTournamentList: LobbyUtil.getSatelliteTournamentResponse(resp?.tournamentConfig?.satelliteTournamentList),
            },
            totalPlayers: resp?.totalPlayers,
            remainingPlayers: resp?.remainingPlayers,
            stats: {
                handsPlayed: resp?.stats?.handsPlayed,
                stackMaxAmount: AmountUtil.getAmountWithCurrency(resp?.stats?.stackMaxAmount, CURRENCY.INR, resp?.stats?.stackMaxAmountInBB),
                stackMinAmount: AmountUtil.getAmountWithCurrency(resp?.stats?.stackMinAmount, CURRENCY.INR, resp?.stats?.stackMinAmountInBB),
                stackAvgAmount: AmountUtil.getAmountWithCurrency(resp?.stats?.stackAvgAmount, CURRENCY.INR, resp?.stats?.stackAvgAmountInBB),
            },
            totalPrizePool: resp?.totalPrizePool,
            totalTickets: resp?.totalTickets,
            totalPoints: resp?.totalPoints,
            isHandForHandActive: resp?.isHandForHandActive,
            isBreak: resp?.isBreak,
            tournamentDetailsMeta: {
                entryTypeText: TournamentUtil.getTournamentEntryTypeText(resp?.tournamentConfig?.entryType),
                entryMethodsText: TournamentUtil.getTournamentEntryMethodText(resp?.tournamentConfig?.entryMethods),
                tournamentStatusText: TournamentUtil.getTournamentStatusText(resp?.tournamentStatus),
            }
        }
    }


    static getTournamentDetailsV2(resp: TournamentDetails, userId: number): ITournamentDetails {
        return {
            name: resp?.name || "",
            tournamentStatus: resp?.tournamentStatus,
            tableList: TournamentUtil.getTournamentDetailsTableList(resp?.tableList),
            playerList: TournamentUtil.getTournamentDetailsPlayerList(resp?.playerList),
            prizeList: TournamentUtil.getTournamentDetailsPrizeListV2(resp?.prizeList, resp),
            blindDetails: {
                currentSmallBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.currentSmallBlindAmount, CURRENCY.INR),
                currentBigBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.currentBigBlindAmount, CURRENCY.INR),
                currentAnteAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.currentAnteAmount, CURRENCY.INR),
                currentLevel: resp?.blindDetails?.currentLevel,
                currentLevelStart: resp?.blindDetails?.currentLevelStart,
                currentLevelPause: resp?.blindDetails?.currentLevelPause,
                currentLevelEnd: resp?.blindDetails?.currentLevelEnd,
                nextSmallBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.nextSmallBlindAmount, CURRENCY.INR),
                nextBigBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.nextBigBlindAmount, CURRENCY.INR),
                nextAnteAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.nextAnteAmount, CURRENCY.INR),
                nextLevel: resp?.blindDetails?.nextLevel,
                nextLevelStart: resp?.blindDetails?.nextLevelStart
            },
            tournamentConfig: {
                minPlayers: resp?.tournamentConfig?.minPlayers,
                maxPlayers: resp?.tournamentConfig?.maxPlayers,
                totalBuyIns: resp?.tournamentConfig?.totalBuyIns,
                totalReBuys: resp?.tournamentConfig?.totalReBuys,
                totalAddOns: resp?.tournamentConfig?.totalAddOns,
                totalReEntries: resp?.tournamentConfig?.totalReEntries,
                entryConfig: LobbyUtil.getTournamentEntryConfig(resp?.tournamentConfig?.entryConfig),
                breakStart: resp?.tournamentConfig?.breakStart,
                breakEnd: resp?.tournamentConfig?.breakEnd,
                startTime: resp?.tournamentConfig?.startTime,
                endTime: resp?.tournamentConfig?.endTime,
                isSatellite: resp?.tournamentConfig?.isSatellite,
                satelliteTournamentList: LobbyUtil.getSatelliteTournamentResponse(resp?.tournamentConfig?.satelliteTournamentList),
            },
            totalPlayers: resp?.totalPlayers,
            remainingPlayers: resp?.remainingPlayers,
            stats: {
                handsPlayed: resp?.stats?.handsPlayed,
                stackMaxAmount: AmountUtil.getAmountWithCurrency(resp?.stats?.stackMaxAmount, CURRENCY.INR, resp?.stats?.stackMaxAmountInBB),
                stackMinAmount: AmountUtil.getAmountWithCurrency(resp?.stats?.stackMinAmount, CURRENCY.INR, resp?.stats?.stackMinAmountInBB),
                stackAvgAmount: AmountUtil.getAmountWithCurrency(resp?.stats?.stackAvgAmount, CURRENCY.INR, resp?.stats?.stackAvgAmountInBB),
            },
            totalPrizePool: resp?.totalPrizePool,
            totalPrizePoolWithOverlay: {
                prizePool: AmountUtil.getAmountWithTournamentCurrency(resp?.totalPrizePool, resp?.prizeDistributionDetails?.primaryCurrency, false),
                prizePoolWithOverlay: AmountUtil.getAmountWithTournamentCurrency(resp?.totalPrizePool, resp?.prizeDistributionDetails?.primaryCurrency, resp?.prizeDistributionDetails?.isOverlay),
                primaryPrizePool: AmountUtil.getAmountWithTournamentCurrency(AmountUtil.getAmountFromPercent(resp?.totalPrizePool, (resp?.prizeDistributionDetails?.overlayPercent ?? 100)), resp?.prizeDistributionDetails?.primaryCurrency, false),
                secondaryPrizePool: AmountUtil.getAmountWithTournamentCurrency(resp?.totalPrizePool - AmountUtil.getAmountFromPercent(resp?.totalPrizePool, resp?.prizeDistributionDetails?.overlayPercent ?? 100), resp?.prizeDistributionDetails?.secondaryCurrency, false)

            },
            totalTickets: resp?.totalTickets,
            totalPoints: resp?.totalPoints,
            isHandForHandActive: resp?.isHandForHandActive,
            isBreak: resp?.isBreak,
            tournamentDetailsMeta: {
                entryTypeText: TournamentUtil.getTournamentEntryTypeText(resp?.tournamentConfig?.entryType),
                entryMethodsText: TournamentUtil.getTournamentEntryMethodText(resp?.tournamentConfig?.entryMethods),
                tournamentStatusText: TournamentUtil.getTournamentStatusText(resp?.tournamentStatus),
            },
            totalAssets: (resp?.totalTickets ?? 0) > 0 ? `${resp?.totalTickets} ${TournamentSeat.SEATS}` : '',
            prizeDistributionDetails: {
                prizeConfigType: TournamentUtil.getTournamentPrizeConfig(resp?.prizeDistributionDetails?.prizeConfigType),
                primaryCurrency: TournamentUtil.getTournamentCurrencyInString(resp?.prizeDistributionDetails?.primaryCurrency),
                secondaryCurrency: TournamentUtil.getTournamentCurrencyInString(resp?.prizeDistributionDetails?.secondaryCurrency),
                isOverlay: resp?.prizeDistributionDetails?.isOverlay,
                overlayPercent: `${AmountUtil.roundTo2(100 - (resp?.prizeDistributionDetails?.overlayPercent ?? 100))}%`,
                totalEntriesRequired: resp?.prizeDistributionDetails?.totalEntriesRequired,
                entriesLeft: resp?.prizeDistributionDetails?.entriesLeft,
            }
        }
    }

    static getTournamentDetailsV3(resp: TournamentDetails): ITournamentDetailsV3 {
        return {
            name: resp?.name || "",
            tournamentStatus: resp?.tournamentStatus,
            tableList: TournamentUtil.getTournamentDetailsTableListV3(resp?.tableList),
            playerList: TournamentUtil.getTournamentDetailsPlayerListV3(resp?.playerList),
            prizeList: TournamentUtil.getTournamentDetailsPrizeListV3(resp?.prizeList, resp),
            blindDetails: {
                currentSmallBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.currentSmallBlindAmount, CURRENCY.CHIPS),
                currentBigBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.currentBigBlindAmount, CURRENCY.CHIPS),
                currentAnteAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.currentAnteAmount, CURRENCY.CHIPS),
                currentLevel: resp?.blindDetails?.currentLevel,
                currentLevelStart: resp?.blindDetails?.currentLevelStart,
                currentLevelPause: resp?.blindDetails?.currentLevelPause,
                currentLevelEnd: resp?.blindDetails?.currentLevelEnd,
                nextSmallBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.nextSmallBlindAmount, CURRENCY.CHIPS),
                nextBigBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.nextBigBlindAmount, CURRENCY.CHIPS),
                nextAnteAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.nextAnteAmount, CURRENCY.CHIPS),
                nextLevel: resp?.blindDetails?.nextLevel,
                nextLevelStart: resp?.blindDetails?.nextLevelStart
            },
            tournamentConfig: {
                minPlayers: resp?.tournamentConfig?.minPlayers,
                maxPlayers: resp?.tournamentConfig?.maxPlayers,
                totalBuyIns: resp?.tournamentConfig?.totalBuyIns,
                totalReBuys: resp?.tournamentConfig?.totalReBuys,
                totalAddOns: resp?.tournamentConfig?.totalAddOns,
                totalReEntries: resp?.tournamentConfig?.totalReEntries,
                lateRegistrationEndTime: resp?.tournamentConfig?.lateRegistrationEndTime,
                entryConfig: LobbyUtil.getTournamentEntryConfig(resp?.tournamentConfig?.entryConfig),
                buyInConfig: LobbyUtil.getTournamentBuyInConfig(resp?.tournamentConfig?.buyInConfig),
                breakStart: resp?.tournamentConfig?.breakStart,
                breakEnd: resp?.tournamentConfig?.breakEnd,
                startTime: resp?.tournamentConfig?.startTime,
                endTime: resp?.tournamentConfig?.endTime,
                isSatellite: resp?.tournamentConfig?.isSatellite,
                satelliteTournamentList: LobbyUtil.getSatelliteTournamentResponse(resp?.tournamentConfig?.satelliteTournamentList),
                stackAmount: AmountUtil.getAmountWithCurrency(resp?.tournamentConfig?.stackAmount, CURRENCY.CHIPS),
                tournamentSpeed: resp?.tournamentConfig?.tournamentSpeed,
                tournamentType: resp?.tournamentConfig?.tournamentType,
                gameVariant: resp?.tournamentConfig?.gameVariant,
                maxNumberOfSeat: resp?.tournamentConfig?.maxNumberOfSeat,
                lateRegistrationDuration: resp?.tournamentConfig?.lateRegistrationDuration,
            },
            totalPlayers: resp?.totalPlayers,
            remainingPlayers: resp?.remainingPlayers,
            stats: {
                handsPlayed: resp?.stats?.handsPlayed,
                stackMaxAmount: AmountUtil.getAmountWithCurrency(resp?.stats?.stackMaxAmount, CURRENCY.CHIPS, resp?.stats?.stackMaxAmountInBB),
                stackMinAmount: AmountUtil.getAmountWithCurrency(resp?.stats?.stackMinAmount, CURRENCY.CHIPS, resp?.stats?.stackMinAmountInBB),
                stackAvgAmount: AmountUtil.getAmountWithCurrency(resp?.stats?.stackAvgAmount, CURRENCY.CHIPS, resp?.stats?.stackAvgAmountInBB),
            },
            totalPrizePool: resp?.totalPrizePool,
            totalPrizePoolWithOverlay: {
                prizePool: AmountUtil.getAmountWithTournamentCurrency(resp?.totalPrizePool, resp?.prizeDistributionDetails?.primaryCurrency, false),
                prizePoolWithOverlay: AmountUtil.getAmountWithTournamentCurrency(resp?.totalPrizePool, resp?.prizeDistributionDetails?.primaryCurrency, resp?.prizeDistributionDetails?.isOverlay),
                primaryPrizePool: AmountUtil.getAmountWithTournamentCurrency(AmountUtil.getAmountFromPercent(resp?.totalPrizePool, (resp?.prizeDistributionDetails?.overlayPercent ?? 100)), resp?.prizeDistributionDetails?.primaryCurrency, false),
                secondaryPrizePool: AmountUtil.getAmountWithTournamentCurrency(resp?.totalPrizePool - AmountUtil.getAmountFromPercent(resp?.totalPrizePool, resp?.prizeDistributionDetails?.overlayPercent ?? 100), resp?.prizeDistributionDetails?.secondaryCurrency, false)

            },
            totalTickets: resp?.totalTickets,
            totalPoints: resp?.totalPoints,
            isHandForHandActive: resp?.isHandForHandActive,
            isBreak: resp?.isBreak,
            tournamentDetailsMeta: {
                entryTypeText: TournamentUtil.getTournamentEntryTypeText(resp?.tournamentConfig?.entryType),
                entryMethodsText: TournamentUtil.getTournamentEntryMethodText(resp?.tournamentConfig?.entryMethods),
                tournamentStatusText: TournamentUtil.getTournamentStatusText(resp?.tournamentStatus),
                tournamentSpeedText: TournamentUtil.getTournamentSpeedText(resp?.tournamentConfig?.tournamentSpeed),
                tournamentTypeText: TournamentUtil.getTournamentTypeText(resp?.tournamentConfig?.tournamentType),
                gameVariantText: TournamentUtil.getGameVariantText(resp?.tournamentConfig?.gameVariant)
            },
            totalAssets: (resp?.totalTickets ?? 0) > 0 ? `${resp?.totalTickets} ${TournamentSeat.SEATS}` : '',
            prizeDistributionDetails: {
                prizeConfigType: TournamentUtil.getTournamentPrizeConfig(resp?.prizeDistributionDetails?.prizeConfigType),
                primaryCurrency: TournamentUtil.getTournamentCurrencyInString(resp?.prizeDistributionDetails?.primaryCurrency),
                secondaryCurrency: TournamentUtil.getTournamentCurrencyInString(resp?.prizeDistributionDetails?.secondaryCurrency),
                isOverlay: resp?.prizeDistributionDetails?.isOverlay,
                overlayPercent: `${AmountUtil.roundTo2(100 - (resp?.prizeDistributionDetails?.overlayPercent ?? 100))}%`,
                totalEntriesRequired: resp?.prizeDistributionDetails?.totalEntriesRequired,
                entriesLeft: resp?.prizeDistributionDetails?.entriesLeft,
            },
            migratedTournament: resp.migratedTournament,
            playerStatus: resp.playerStatus,
            myRank: resp?.myRank,
        }
    }


    static getTournamentDetailsV4(resp: TournamentDetails): ITournamentDetailsV3 {
        return {
            name: resp?.name || "",
            tournamentStatus: resp?.tournamentStatus,
            tableList: TournamentUtil.getTournamentDetailsTableList(resp?.tableList),
            playerList: TournamentUtil.getTournamentDetailsPlayerList(resp?.playerList),
            prizeList: TournamentUtil.getTournamentDetailsPrizeListV2(resp?.prizeList, resp),
            blindDetails: {
                currentSmallBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.currentSmallBlindAmount, CURRENCY.INR),
                currentBigBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.currentBigBlindAmount, CURRENCY.INR),
                currentAnteAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.currentAnteAmount, CURRENCY.INR),
                currentLevel: resp?.blindDetails?.currentLevel,
                currentLevelStart: resp?.blindDetails?.currentLevelStart,
                currentLevelPause: resp?.blindDetails?.currentLevelPause,
                currentLevelEnd: resp?.blindDetails?.currentLevelEnd,
                nextSmallBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.nextSmallBlindAmount, CURRENCY.INR),
                nextBigBlindAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.nextBigBlindAmount, CURRENCY.INR),
                nextAnteAmount: AmountUtil.getAmountWithCurrency(resp?.blindDetails?.nextAnteAmount, CURRENCY.INR),
                nextLevel: resp?.blindDetails?.nextLevel,
                nextLevelStart: resp?.blindDetails?.nextLevelStart
            },
            tournamentConfig: {
                minPlayers: resp?.tournamentConfig?.minPlayers,
                maxPlayers: resp?.tournamentConfig?.maxPlayers,
                totalBuyIns: resp?.tournamentConfig?.totalBuyIns,
                totalReBuys: resp?.tournamentConfig?.totalReBuys,
                totalAddOns: resp?.tournamentConfig?.totalAddOns,
                totalReEntries: resp?.tournamentConfig?.totalReEntries,
                lateRegistrationEndTime: resp?.tournamentConfig?.lateRegistrationEndTime,
                entryConfig: LobbyUtil.getTournamentEntryConfig(resp?.tournamentConfig?.entryConfig),
                buyInConfig: LobbyUtil.getTournamentBuyInConfig(resp?.tournamentConfig?.buyInConfig),
                breakStart: resp?.tournamentConfig?.breakStart,
                breakEnd: resp?.tournamentConfig?.breakEnd,
                startTime: resp?.tournamentConfig?.startTime,
                endTime: resp?.tournamentConfig?.endTime,
                isSatellite: resp?.tournamentConfig?.isSatellite,
                satelliteTournamentList: LobbyUtil.getSatelliteTournamentResponse(resp?.tournamentConfig?.satelliteTournamentList),
                stackAmount: AmountUtil.getAmountWithCurrency(resp?.tournamentConfig?.stackAmount, CURRENCY.CHIPS),
                tournamentSpeed: resp?.tournamentConfig?.tournamentSpeed,
                tournamentType: resp?.tournamentConfig?.tournamentType,
                gameVariant: resp?.tournamentConfig?.gameVariant,
                maxNumberOfSeat: resp?.tournamentConfig?.maxNumberOfSeat,
                lateRegistrationDuration: resp?.tournamentConfig?.lateRegistrationDuration,
            },
            totalPlayers: resp?.totalPlayers,
            remainingPlayers: resp?.remainingPlayers,
            stats: {
                handsPlayed: resp?.stats?.handsPlayed,
                stackMaxAmount: AmountUtil.getAmountWithCurrency(resp?.stats?.stackMaxAmount, CURRENCY.INR, resp?.stats?.stackMaxAmountInBB),
                stackMinAmount: AmountUtil.getAmountWithCurrency(resp?.stats?.stackMinAmount, CURRENCY.INR, resp?.stats?.stackMinAmountInBB),
                stackAvgAmount: AmountUtil.getAmountWithCurrency(resp?.stats?.stackAvgAmount, CURRENCY.INR, resp?.stats?.stackAvgAmountInBB),
            },
            totalPrizePool: resp?.totalPrizePool,
            totalPrizePoolWithOverlay: {
                prizePool: AmountUtil.getAmountWithTournamentCurrency(resp?.totalPrizePool, resp?.prizeDistributionDetails?.primaryCurrency, false),
                prizePoolWithOverlay: AmountUtil.getAmountWithTournamentCurrency(resp?.totalPrizePool, resp?.prizeDistributionDetails?.primaryCurrency, resp?.prizeDistributionDetails?.isOverlay),
                primaryPrizePool: AmountUtil.getAmountWithTournamentCurrency(AmountUtil.getAmountFromPercent(resp?.totalPrizePool, (resp?.prizeDistributionDetails?.overlayPercent ?? 100)), resp?.prizeDistributionDetails?.primaryCurrency, false),
                secondaryPrizePool: AmountUtil.getAmountWithTournamentCurrency(resp?.totalPrizePool - AmountUtil.getAmountFromPercent(resp?.totalPrizePool, resp?.prizeDistributionDetails?.overlayPercent ?? 100), resp?.prizeDistributionDetails?.secondaryCurrency, false)

            },
            totalTickets: resp?.totalTickets,
            totalPoints: resp?.totalPoints,
            isHandForHandActive: resp?.isHandForHandActive,
            isBreak: resp?.isBreak,
            tournamentDetailsMeta: {
                entryTypeText: TournamentUtil.getTournamentEntryTypeText(resp?.tournamentConfig?.entryType),
                entryMethodsText: TournamentUtil.getTournamentEntryMethodText(resp?.tournamentConfig?.entryMethods),
                tournamentStatusText: TournamentUtil.getTournamentStatusText(resp?.tournamentStatus),
                tournamentSpeedText: TournamentUtil.getTournamentSpeedText(resp?.tournamentConfig?.tournamentSpeed),
                tournamentTypeText: TournamentUtil.getTournamentTypeText(resp?.tournamentConfig?.tournamentType),
                gameVariantText: TournamentUtil.getGameVariantText(resp?.tournamentConfig?.gameVariant)
            },
            totalAssets: (resp?.totalTickets ?? 0) > 0 ? `${resp?.totalTickets} ${TournamentSeat.SEATS}` : '',
            prizeDistributionDetails: {
                prizeConfigType: TournamentUtil.getTournamentPrizeConfig(resp?.prizeDistributionDetails?.prizeConfigType),
                primaryCurrency: TournamentUtil.getTournamentCurrencyInString(resp?.prizeDistributionDetails?.primaryCurrency),
                secondaryCurrency: TournamentUtil.getTournamentCurrencyInString(resp?.prizeDistributionDetails?.secondaryCurrency),
                isOverlay: resp?.prizeDistributionDetails?.isOverlay,
                overlayPercent: `${AmountUtil.roundTo2(100 - (resp?.prizeDistributionDetails?.overlayPercent ?? 100))}%`,
                totalEntriesRequired: resp?.prizeDistributionDetails?.totalEntriesRequired,
                entriesLeft: resp?.prizeDistributionDetails?.entriesLeft,
            },
            migratedTournament: resp.migratedTournament,
            playerStatus: resp.playerStatus,
            myRank: resp?.myRank,
        }
    }


    static divideTournamentList(tournaments: Tournament[] = [], userTournaments: PlayerMTTList) {
        const resp = {
            featuredTournaments: [],
            nonFeaturedTournaments: []
        }
        tournaments.map((tournament) => {
            if (tournament?.tournamentConfig?.isFeatured) {
                /*Check the state of the tournament because if featured tournament is
                cancelled or finished then it should not be grouped in featured*/
                const tournamentStatus = tournament?.tournamentStatus;
                const playerStatus = TournamentUtil.getPlayerTournamentStatusFromId(userTournaments, tournament?.id);
                if (nonFetaturedTournamentStatus?.indexOf(tournamentStatus) === -1 && nonFeaturedPlayerTournamentStatus.indexOf(playerStatus) === -1) {
                    resp.featuredTournaments.push(tournament)
                }
                else {
                    resp.nonFeaturedTournaments.push(tournament)
                }
            }
            else {
                resp.nonFeaturedTournaments.push(tournament)
            }
        })
        return resp;
    }

    static sortTournaments(tournaments: Tournament[], userTournaments: PlayerMTTList) {

        logger.info(`[sortTournaments] unSorted Tournaments ${JSON.stringify(tournaments)}`);

        tournaments.sort(TournamentUtil.sortTournaments.bind(userTournaments));

        logger.info(`[sortTournaments] Sorted Tournaments result: ${JSON.stringify(tournaments)}`);

    }

    static getTournamentConfig(tournament: Tournament): ITournamentConfig {
        const tournamentConfig = tournament?.tournamentConfig
        return {
            minPlayers: tournamentConfig?.minPlayers,
            maxPlayers: tournamentConfig?.maxPlayers,
            startTime: tournamentConfig?.startTime,
            endTime: tournamentConfig?.endTime,
            entryConfig: LobbyUtil.getTournamentEntryConfig(tournamentConfig?.entryConfig),
            buyInConfig: LobbyUtil.getTournamentBuyInConfig(tournamentConfig?.buyInConfig),
            breakStart: tournamentConfig?.breakStart,
            breakEnd: tournamentConfig?.breakEnd,
            totalBuyIns: tournamentConfig?.totalBuyIns,
            totalReBuys: tournamentConfig?.totalReBuys,
            totalAddOns: tournamentConfig?.totalAddOns,
            totalReEntries: tournamentConfig?.totalReEntries,
            hasSatellite: tournamentConfig?.hasSatellite,
            isSatellite: tournamentConfig?.isSatellite,
            isFeatured: tournamentConfig?.isFeatured,
            maxNumberOfSeat: tournamentConfig?.maxNumberOfSeat,
            featureColor: tournamentConfig?.featureColor,
            featureColors: tournamentConfig?.featureColors,
            tag: tournamentConfig?.tag,
            stackAmount: AmountUtil.getAmountWithCurrency(tournamentConfig?.stackAmount, CURRENCY.INR, tournamentConfig?.stackAmountInBB),
            registrationStartTime: tournamentConfig?.registrationStartTime,
            lateRegistrationDuration: tournamentConfig?.lateRegistrationDuration
        }
    }

    static getTournamentListingConfigV3(tournament: Tournament): ITournamentListingConfigV3 {
        const tournamentConfig = tournament?.tournamentConfig
        return {
            startTime: tournamentConfig?.startTime,
            entryConfig: LobbyUtil.getTournamentEntryConfig(tournamentConfig?.entryConfig),
            buyInConfig: LobbyUtil.getTournamentBuyInConfig(tournamentConfig?.buyInConfig),
            isSatellite: tournamentConfig?.isSatellite,
            isFeatured: tournamentConfig?.isFeatured,
            featureColor: tournamentConfig?.featureColor,
            featureColors: tournamentConfig?.featureColors,
            tag: tournamentConfig?.tag,
            registrationStartTime: tournamentConfig?.registrationStartTime,
            lateRegistrationDuration: tournamentConfig?.lateRegistrationDuration,
            lateRegistrationEndTime: tournamentConfig?.lateRegistrationEndTime,
        }
    }

    static getTournamentResponse(tournament: Tournament): ITournament {

        const tournamentResponse: ITournament = {
            id: tournament?.id,
            gameVariant: tournament?.gameVariant,
            tournamentType: tournament?.tournamentType,
            tournamentStatus: tournament?.tournamentStatus,
            tournamentSpeed: tournament?.tournamentSpeed,
            tournamentConfig: LobbyUtil.getTournamentConfig(tournament),
            name: tournament?.name,
            prizePool: AmountUtil.getAmountWithCurrency(tournament?.prizePool, CURRENCY.INR),
            totalTickets: tournament?.totalTickets,
            remainingPlayer: tournament?.remainingPlayer,
            playerCount: tournament?.playerCount,
            blindLevel: tournament?.blindLevel,
            anteAmount: AmountUtil.getAmountWithCurrency(tournament?.anteAmount, CURRENCY.INR),
            smallBlindAmount: AmountUtil.getAmountWithCurrency(tournament?.smallBlindAmount, CURRENCY.INR),
            bigBlindAmount: AmountUtil.getAmountWithCurrency(tournament?.bigBlindAmount, CURRENCY.INR),
            blindDuration: tournament?.blindDuration,
            filters: tournament?.filters,
            hasPlayed: tournament?.hasPlayed,
            tournamentMeta: {
                gameVariantText: TournamentUtil.getGameVariantText(tournament?.gameVariant),
                tournamentTypeText: TournamentUtil.getTournamentTypeText(tournament?.tournamentType),
                entryTypeText: TournamentUtil.getTournamentEntryTypeText(tournament?.tournamentConfig?.entryConfig?.type),
                entryMethodsText: TournamentUtil.getTournamentEntryMethodText(tournament?.tournamentConfig?.entryConfig?.config?.methods),
                tournamentStatusText: TournamentUtil.getTournamentStatusText(tournament?.tournamentStatus),
                tournamentSpeedText: TournamentUtil.getTournamentSpeedText(tournament?.tournamentSpeed),
            }

        }
        logger.info(tournamentResponse, "Tournament Final Data");
        return tournamentResponse;

    }

    static getTournamentResponseV2(tournament: Tournament): ITournament {

        const tournamentResponse: ITournament = {
            id: tournament?.id,
            gameVariant: tournament?.gameVariant,
            tournamentType: tournament?.tournamentType,
            tournamentStatus: tournament?.tournamentStatus,
            tournamentSpeed: tournament?.tournamentSpeed,
            tournamentConfig: LobbyUtil.getTournamentConfig(tournament),
            name: tournament?.name,
            prizePool: AmountUtil.getAmountWithCurrency(tournament?.prizePool, CURRENCY.INR),
            totalTickets: tournament?.totalTickets,
            remainingPlayer: tournament?.remainingPlayer,
            playerCount: tournament?.playerCount,
            blindLevel: tournament?.blindLevel,
            anteAmount: AmountUtil.getAmountWithCurrency(tournament?.anteAmount, CURRENCY.INR),
            smallBlindAmount: AmountUtil.getAmountWithCurrency(tournament?.smallBlindAmount, CURRENCY.INR),
            bigBlindAmount: AmountUtil.getAmountWithCurrency(tournament?.bigBlindAmount, CURRENCY.INR),
            blindDuration: tournament?.blindDuration,
            filters: tournament?.filters,
            hasPlayed: tournament?.hasPlayed,
            tournamentMeta: {
                gameVariantText: TournamentUtil.getGameVariantText(tournament?.gameVariant),
                tournamentTypeText: TournamentUtil.getTournamentTypeText(tournament?.tournamentType),
                entryTypeText: TournamentUtil.getTournamentEntryTypeText(tournament?.tournamentConfig?.entryConfig?.type),
                entryMethodsText: TournamentUtil.getTournamentEntryMethodText(tournament?.tournamentConfig?.entryConfig?.config?.methods),
                tournamentStatusText: TournamentUtil.getTournamentStatusText(tournament?.tournamentStatus),
                tournamentSpeedText: TournamentUtil.getTournamentSpeedText(tournament?.tournamentSpeed),
            },
            totalPrizePoolWithOverlay: AmountUtil.getAmountWithTournamentCurrency(tournament?.prizePool, tournament?.primaryCurrency, tournament?.isOverlayActive),
            totalAssets: (tournament?.totalTickets ?? 0) > 0 ? `${tournament?.totalTickets} ${TournamentSeat.SEATS}` : ''

        }
        logger.info(tournamentResponse, "Tournament Final Data");
        return tournamentResponse;

    }

    static getTournamentResponseV3(tournament: Tournament, playerStatus: PlayerTournamentStatus): ITournamentV3 {
        const tournamentResponse: ITournamentV3 = {
            id: tournament?.id,
            gameVariant: tournament?.gameVariant,
            tournamentType: tournament?.tournamentType,
            tournamentStatus: tournament?.tournamentStatus,
            tournamentSpeed: tournament?.tournamentSpeed,
            tournamentConfig: LobbyUtil.getTournamentListingConfigV3(tournament),
            name: tournament?.name,
            prizePool: AmountUtil.getAmountWithCurrency(tournament?.prizePool, CURRENCY.INR),
            totalTickets: tournament?.totalTickets,
            remainingPlayer: tournament?.remainingPlayer,
            playerCount: tournament?.playerCount,
            playerStatus: playerStatus,
            tournamentMeta: {
                gameVariantText: TournamentUtil.getGameVariantText(tournament?.gameVariant),
                tournamentTypeText: TournamentUtil.getTournamentTypeText(tournament?.tournamentType),
                entryTypeText: TournamentUtil.getTournamentEntryTypeText(tournament?.tournamentConfig?.entryConfig?.type),
                entryMethodsText: TournamentUtil.getTournamentEntryMethodText(tournament?.tournamentConfig?.entryConfig?.config?.methods),
                tournamentStatusText: TournamentUtil.getTournamentStatusText(tournament?.tournamentStatus),
                tournamentSpeedText: TournamentUtil.getTournamentSpeedText(tournament?.tournamentSpeed),
            },
            totalPrizePoolWithOverlay: AmountUtil.getAmountWithTournamentCurrency(tournament?.prizePool, tournament?.primaryCurrency, tournament?.isOverlayActive),
            totalAssets: (tournament?.totalTickets ?? 0) > 0 ? `${tournament?.totalTickets} ${TournamentSeat.SEATS}` : '',
            migratedTournament: tournament.migratedTournament || false,
            totalPoints: tournament?.totalPoints,
        }
        logger.info(tournamentResponse, "Tournament Final Data");
        return tournamentResponse;

    }

    static getTournamentList(tournaments: Tournament[], userTournaments: PlayerMTTList): ITournamentListResponse[] {
        const {
            featuredTournaments,
            nonFeaturedTournaments
        } = LobbyUtil.divideTournamentList(tournaments, userTournaments);
        logger.info(`[getTournamentList] unSorted  featuredTournaments ${JSON.stringify(featuredTournaments)}`);
        featuredTournaments.sort(TournamentUtil.sortTournaments.bind(userTournaments))
        logger.info(`[getTournamentList] Sorted featuredTournaments result: ${JSON.stringify(featuredTournaments)}`);
        logger.info(`[getTournamentList] unSorted  nonFeaturedTournaments ${JSON.stringify(nonFeaturedTournaments)}`);
        nonFeaturedTournaments.sort(TournamentUtil.sortTournaments.bind(userTournaments))
        logger.info(`[getTournamentList] Sorted nonFeaturedTournaments result: ${JSON.stringify(nonFeaturedTournaments)}`);


        let registeredTournamentsResponse: ITournament[] = []
        let lateRegistrationTournamentsResponse: ITournament[] = []
        let runningTournamentsResponse: ITournament[] = []
        let completedTournamentsResponse: ITournament[] = []
        let cancelledTournamentsResponse: ITournament[] = []
        let startingInNextHourTournamentsResponse: ITournament[] = []
        let restOfDayTournamentsResponse: ITournament[] = []
        let dateWiseTournamentsResponse: any = {}
        let featuredTournamentsResponse: ITournament[] = (featuredTournaments || []).map((tournament: Tournament) => {
            tournament.hasPlayed = false
            const playerStatus = TournamentUtil.getPlayerTournamentStatusFromId(userTournaments, tournament?.id)
            if (playerStatus === PlayerTournamentStatus.COMPLETED || playerStatus === PlayerTournamentStatus.BUSTED || playerStatus === PlayerTournamentStatus.FINISHED) {
                tournament.hasPlayed = true
            }
            return LobbyUtil.getTournamentResponse(tournament)
        })

        nonFeaturedTournaments?.forEach((tournament: Tournament) => {

            tournament.hasPlayed = false
            const playerStatus = TournamentUtil.getPlayerTournamentStatusFromId(userTournaments, tournament?.id)
            const tournamentStatus: number = tournament?.tournamentStatus;
            const startTime = tournament?.tournamentConfig?.startTime;


            if (tournamentStatus === TournamentStatus.RUNNING && playerStatus !== PlayerTournamentStatus.PLAYING) { // checking for running tournaments and if the user is not playing the tournament, if yes pushing it to runningTournaments Array

                runningTournamentsResponse.push(LobbyUtil.getTournamentResponse(tournament))

            }
            else if (tournamentStatus === TournamentStatus.COMPLETED) { // checking for completed tournaments

                if (playerStatus === PlayerTournamentStatus.COMPLETED || playerStatus === PlayerTournamentStatus.BUSTED || playerStatus === PlayerTournamentStatus.FINISHED) {
                    tournament.hasPlayed = true
                }
                completedTournamentsResponse.push(LobbyUtil.getTournamentResponse(tournament))

            }
            else if (tournamentStatus === TournamentStatus.CANCELLED) { // checking for cancelled tournaments

                cancelledTournamentsResponse.push(LobbyUtil.getTournamentResponse(tournament))

            }
            else if (playerStatus === PlayerTournamentStatus.REGISTERED || playerStatus === PlayerTournamentStatus.PLAYING) { // checking for registered tournaments

                registeredTournamentsResponse.push(LobbyUtil.getTournamentResponse(tournament))

            }
            else if (tournamentStatus === TournamentStatus.LATE_REGISTRATION) { // checking for late registration tournaments

                lateRegistrationTournamentsResponse.push(LobbyUtil.getTournamentResponse(tournament))

            }
            else if (DateUtil.isWithinNextHourFromNow(startTime) && !(tournamentStatus === TournamentStatus.CANCELLED || tournamentStatus === TournamentStatus.ABORTED || tournamentStatus === TournamentStatus.COMPLETED)) { // checking for tournaments starting in within hour

                startingInNextHourTournamentsResponse.push(LobbyUtil.getTournamentResponse(tournament))

            }
            else if (DateUtil.isSameDayToday(startTime) && !DateUtil.isWithinNextHourFromNow(startTime)) { // checking for tournaments rest of the tournaments in the same day

                restOfDayTournamentsResponse.push(LobbyUtil.getTournamentResponse(tournament))

            }
            else if (playerStatus !== PlayerTournamentStatus.BUSTED) { // filling the date wise tournaments array

                if (!Array.isArray(dateWiseTournamentsResponse[new Date(startTime).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })])) {
                    dateWiseTournamentsResponse[new Date(startTime).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })] = [];
                }
                dateWiseTournamentsResponse[new Date(startTime).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })].push(LobbyUtil.getTournamentResponse(tournament))
            }
        });
        let dateWiseTournamentsList: ITournamentListResponse[] = []
        for (let [tournamentDate, tournamentData] of Object.entries(dateWiseTournamentsResponse)) {
            dateWiseTournamentsList.push({
                title: "date_wise_tournaments",
                date: tournamentDate,
                data: tournamentData as []
            })
        }

        let response: ITournamentListResponse[] = [
            {
                title: "featured_tournaments",
                data: featuredTournamentsResponse
            },
            {
                title: "registered_tournaments",
                data: registeredTournamentsResponse
            },
            {
                title: "late_registration_tournaments",
                data: lateRegistrationTournamentsResponse
            },
            {
                title: "upcoming_tournaments",
                data: startingInNextHourTournamentsResponse
            },
            {
                title: "rest_tournaments",
                data: restOfDayTournamentsResponse
            },
            ...dateWiseTournamentsList,
            {
                title: "running_tournaments",
                data: runningTournamentsResponse
            },
            {
                title: "completed_tournaments",
                data: completedTournamentsResponse
            },
            {
                title: "cancelled_tournaments",
                data: cancelledTournamentsResponse
            }
        ]
        return response
    }


    static getTournamentListV2(tournaments: Tournament[], userTournaments: PlayerMTTList): ITournamentListResponse[] {
        const {
            featuredTournaments,
            nonFeaturedTournaments
        } = LobbyUtil.divideTournamentList(tournaments, userTournaments);
        logger.info(`[getTournamentList] unSorted  featuredTournaments ${JSON.stringify(featuredTournaments)}`);
        featuredTournaments.sort(TournamentUtil.sortTournaments.bind(userTournaments))
        logger.info(`[getTournamentList] Sorted featuredTournaments result: ${JSON.stringify(featuredTournaments)}`);
        logger.info(`[getTournamentList] unSorted  nonFeaturedTournaments ${JSON.stringify(nonFeaturedTournaments)}`);
        nonFeaturedTournaments.sort(TournamentUtil.sortTournaments.bind(userTournaments))
        logger.info(`[getTournamentList] Sorted nonFeaturedTournaments result: ${JSON.stringify(nonFeaturedTournaments)}`);


        let registeredTournamentsResponse: ITournament[] = []
        let lateRegistrationTournamentsResponse: ITournament[] = []
        let runningTournamentsResponse: ITournament[] = []
        let completedTournamentsResponse: ITournament[] = []
        let cancelledTournamentsResponse: ITournament[] = []
        let startingInNextHourTournamentsResponse: ITournament[] = []
        let restOfDayTournamentsResponse: ITournament[] = []
        let dateWiseTournamentsResponse: any = {}
        let featuredTournamentsResponse: ITournament[] = (featuredTournaments || []).map((tournament: Tournament) => {
            tournament.hasPlayed = false
            const playerStatus = TournamentUtil.getPlayerTournamentStatusFromId(userTournaments, tournament?.id)
            if (playerStatus === PlayerTournamentStatus.COMPLETED || playerStatus === PlayerTournamentStatus.BUSTED || playerStatus === PlayerTournamentStatus.FINISHED) {
                tournament.hasPlayed = true
            }
            return LobbyUtil.getTournamentResponseV2(tournament)
        })

        nonFeaturedTournaments?.forEach((tournament: Tournament) => {

            tournament.hasPlayed = false
            const playerStatus = TournamentUtil.getPlayerTournamentStatusFromId(userTournaments, tournament?.id)
            const tournamentStatus: number = tournament?.tournamentStatus;
            const startTime = tournament?.tournamentConfig?.startTime;


            if (tournamentStatus === TournamentStatus.RUNNING && playerStatus !== PlayerTournamentStatus.PLAYING) { // checking for running tournaments and if the user is not playing the tournament, if yes pushing it to runningTournaments Array

                runningTournamentsResponse.push(LobbyUtil.getTournamentResponseV2(tournament))

            }
            else if (tournamentStatus === TournamentStatus.COMPLETED) { // checking for completed tournaments

                if (playerStatus === PlayerTournamentStatus.COMPLETED || playerStatus === PlayerTournamentStatus.BUSTED || playerStatus === PlayerTournamentStatus.FINISHED) {
                    tournament.hasPlayed = true
                }
                completedTournamentsResponse.push(LobbyUtil.getTournamentResponseV2(tournament))

            }
            else if (tournamentStatus === TournamentStatus.CANCELLED) { // checking for cancelled tournaments

                cancelledTournamentsResponse.push(LobbyUtil.getTournamentResponseV2(tournament))

            }
            else if (playerStatus === PlayerTournamentStatus.REGISTERED || playerStatus === PlayerTournamentStatus.PLAYING) { // checking for registered tournaments

                registeredTournamentsResponse.push(LobbyUtil.getTournamentResponseV2(tournament))

            }
            else if (tournamentStatus === TournamentStatus.LATE_REGISTRATION) { // checking for late registration tournaments

                lateRegistrationTournamentsResponse.push(LobbyUtil.getTournamentResponseV2(tournament))

            }
            else if (DateUtil.isWithinNextHourFromNow(startTime) && !(tournamentStatus === TournamentStatus.CANCELLED || tournamentStatus === TournamentStatus.ABORTED || tournamentStatus === TournamentStatus.COMPLETED)) { // checking for tournaments starting in within hour

                startingInNextHourTournamentsResponse.push(LobbyUtil.getTournamentResponseV2(tournament))

            }
            else if (DateUtil.isSameDayToday(startTime) && !DateUtil.isWithinNextHourFromNow(startTime)) { // checking for tournaments rest of the tournaments in the same day

                restOfDayTournamentsResponse.push(LobbyUtil.getTournamentResponseV2(tournament))

            }
            else if (playerStatus !== PlayerTournamentStatus.BUSTED) { // filling the date wise tournaments array

                if (!Array.isArray(dateWiseTournamentsResponse[new Date(startTime).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })])) {
                    dateWiseTournamentsResponse[new Date(startTime).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })] = [];
                }
                dateWiseTournamentsResponse[new Date(startTime).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })].push(LobbyUtil.getTournamentResponseV2(tournament))
            }
        });
        let dateWiseTournamentsList: ITournamentListResponse[] = []
        for (let [tournamentDate, tournamentData] of Object.entries(dateWiseTournamentsResponse)) {
            dateWiseTournamentsList.push({
                title: "date_wise_tournaments",
                date: tournamentDate,
                data: tournamentData as []
            })
        }

        let response: ITournamentListResponse[] = [
            {
                title: "featured_tournaments",
                data: featuredTournamentsResponse
            },
            {
                title: "registered_tournaments",
                data: registeredTournamentsResponse
            },
            {
                title: "late_registration_tournaments",
                data: lateRegistrationTournamentsResponse
            },
            {
                title: "upcoming_tournaments",
                data: startingInNextHourTournamentsResponse
            },
            {
                title: "rest_tournaments",
                data: restOfDayTournamentsResponse
            },
            ...dateWiseTournamentsList,
            {
                title: "running_tournaments",
                data: runningTournamentsResponse
            },
            {
                title: "completed_tournaments",
                data: completedTournamentsResponse
            },
            {
                title: "cancelled_tournaments",
                data: cancelledTournamentsResponse
            }
        ]
        return response
    }

    static getTournamentListV3(tournaments: Tournament[], userTournaments: PlayerMTTList): ITournamentListResponseV3[] {
        const {
            featuredTournaments,
            nonFeaturedTournaments
        } = LobbyUtil.divideTournamentList(tournaments, userTournaments);
        logger.info(`[getTournamentList] unSorted  featuredTournaments ${JSON.stringify(featuredTournaments)}`);
        featuredTournaments.sort(TournamentUtil.sortTournaments.bind(userTournaments))
        logger.info(`[getTournamentList] Sorted featuredTournaments result: ${JSON.stringify(featuredTournaments)}`);
        logger.info(`[getTournamentList] unSorted  nonFeaturedTournaments ${JSON.stringify(nonFeaturedTournaments)}`);
        nonFeaturedTournaments.sort(TournamentUtil.sortTournaments.bind(userTournaments))
        logger.info(`[getTournamentList] Sorted nonFeaturedTournaments result: ${JSON.stringify(nonFeaturedTournaments)}`);


        let registeredTournamentsResponse: ITournamentV3[] = []
        let lateRegistrationTournamentsResponse: ITournamentV3[] = []
        let runningTournamentsResponse: ITournamentV3[] = []
        let completedTournamentsResponse: ITournamentV3[] = []
        let cancelledTournamentsResponse: ITournamentV3[] = []
        let startingInNextHourTournamentsResponse: ITournamentV3[] = []
        let restOfDayTournamentsResponse: ITournamentV3[] = []
        let dateWiseTournamentsResponse: any = {}
        let featuredTournamentsResponse: ITournamentV3[] = (featuredTournaments || []).map((tournament: Tournament) => {
            tournament.hasPlayed = false
            const playerStatus = TournamentUtil.getPlayerTournamentStatusFromId(userTournaments, tournament?.id) || PlayerTournamentStatus.NOT_REGISTERED
            if (playerStatus === PlayerTournamentStatus.COMPLETED || playerStatus === PlayerTournamentStatus.BUSTED || playerStatus === PlayerTournamentStatus.FINISHED) {
                tournament.hasPlayed = true
            }
            return LobbyUtil.getTournamentResponseV3(tournament, playerStatus)
        })

        nonFeaturedTournaments?.forEach((tournament: Tournament) => {

            tournament.hasPlayed = false
            const playerStatus = TournamentUtil.getPlayerTournamentStatusFromId(userTournaments, tournament?.id) || PlayerTournamentStatus.NOT_REGISTERED
            const tournamentStatus: number = tournament?.tournamentStatus;
            const startTime = tournament?.tournamentConfig?.startTime;


            if (tournamentStatus === TournamentStatus.RUNNING && playerStatus !== PlayerTournamentStatus.PLAYING) { // checking for running tournaments and if the user is not playing the tournament, if yes pushing it to runningTournaments Array

                runningTournamentsResponse.push(LobbyUtil.getTournamentResponseV3(tournament, playerStatus))

            }
            else if (tournamentStatus === TournamentStatus.COMPLETED) { // checking for completed tournaments

                if (playerStatus === PlayerTournamentStatus.COMPLETED || playerStatus === PlayerTournamentStatus.BUSTED || playerStatus === PlayerTournamentStatus.FINISHED) {
                    tournament.hasPlayed = true
                }
                completedTournamentsResponse.push(LobbyUtil.getTournamentResponseV3(tournament, playerStatus))

            }
            else if (tournamentStatus === TournamentStatus.CANCELLED) { // checking for cancelled tournaments

                cancelledTournamentsResponse.push(LobbyUtil.getTournamentResponseV3(tournament, playerStatus))

            }
            else if (playerStatus === PlayerTournamentStatus.REGISTERED || playerStatus === PlayerTournamentStatus.PLAYING) { // checking for registered tournaments

                registeredTournamentsResponse.push(LobbyUtil.getTournamentResponseV3(tournament, playerStatus))

            }
            else if (tournamentStatus === TournamentStatus.LATE_REGISTRATION) { // checking for late registration tournaments

                lateRegistrationTournamentsResponse.push(LobbyUtil.getTournamentResponseV3(tournament, playerStatus))

            }
            else if (DateUtil.isWithinNextHourFromNow(startTime) && !(tournamentStatus === TournamentStatus.CANCELLED || tournamentStatus === TournamentStatus.ABORTED || tournamentStatus === TournamentStatus.COMPLETED)) { // checking for tournaments starting in within hour

                startingInNextHourTournamentsResponse.push(LobbyUtil.getTournamentResponseV3(tournament, playerStatus))

            }
            else if (DateUtil.isSameDayToday(startTime) && !DateUtil.isWithinNextHourFromNow(startTime)) { // checking for tournaments rest of the tournaments in the same day

                restOfDayTournamentsResponse.push(LobbyUtil.getTournamentResponseV3(tournament, playerStatus))

            }
            else if (playerStatus !== PlayerTournamentStatus.BUSTED) { // filling the date wise tournaments array

                if (!Array.isArray(dateWiseTournamentsResponse[new Date(startTime).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })])) {
                    dateWiseTournamentsResponse[new Date(startTime).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric'
                    })] = [];
                }
                dateWiseTournamentsResponse[new Date(startTime).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                })].push(LobbyUtil.getTournamentResponseV3(tournament, playerStatus))
            }
        });
        let dateWiseTournamentsList: ITournamentListResponseV3[] = []
        for (let [tournamentDate, tournamentData] of Object.entries(dateWiseTournamentsResponse)) {
            dateWiseTournamentsList.push({
                title: "date_wise_tournaments",
                date: tournamentDate,
                data: tournamentData as []
            })
        }

        let response: ITournamentListResponseV3[] = [
            {
                title: "featured_tournaments",
                data: featuredTournamentsResponse
            },
            {
                title: "registered_tournaments",
                data: registeredTournamentsResponse
            },
            {
                title: "late_registration_tournaments",
                data: lateRegistrationTournamentsResponse
            },
            {
                title: "upcoming_tournaments",
                data: startingInNextHourTournamentsResponse
            },
            {
                title: "rest_tournaments",
                data: restOfDayTournamentsResponse
            },
            ...dateWiseTournamentsList,
            {
                title: "running_tournaments",
                data: runningTournamentsResponse
            },
            {
                title: "completed_tournaments",
                data: completedTournamentsResponse
            },
            {
                title: "cancelled_tournaments",
                data: cancelledTournamentsResponse
            }
        ]
        return response
    }


    static getTournamentEntryDetailsPayload(tournamentId: string, data: TournamentEntryDetails): TournamentEntryDetailsRequest {
        let reentryEntryAmount: number, reentryRegistrationFee: number, reentryPrizePoolContribution: number = 0;
        let reentryEntryMethods: string[] = [];
        if (data.entryMethod?.type?.type === "re_entry") {
            reentryEntryAmount = data.entryMethod?.type?.config?.total_amount ?? 0;
            reentryRegistrationFee = data.entryMethod?.type?.config?.registration_fee ?? 0;
            reentryPrizePoolContribution = data.entryMethod?.type?.config?.prize_pool_contribution ?? 0;
            reentryEntryMethods = data.entryMethod?.type?.config?.methods ?? [];
        }
        return {
            tournamentId,
            registerEntryAmount: data.entryMethod?.buy_in?.total_amount ?? 0,
            registerRegistrationFee: data.entryMethod?.buy_in?.registration_fee ?? 0,
            registerPrizePoolContribution: data.entryMethod?.buy_in?.prize_pool_contribution ?? 0,
            registerEntryMethods: data.entryMethod?.methods ?? [],
            reentryEntryAmount: reentryEntryAmount > 0 ? reentryEntryAmount : undefined,
            reentryRegistrationFee: reentryRegistrationFee > 0 ? reentryRegistrationFee : undefined,
            reentryPrizePoolContribution: reentryPrizePoolContribution > 0 ? reentryPrizePoolContribution : undefined,
            reentryEntryMethods: reentryEntryMethods && reentryEntryMethods?.length > 0 ? reentryEntryMethods : undefined,
        }
    }

    static getTournamentEntryDetailsPayloadForNewTournament(tournament: AriesTournamentResponse): TournamentEntryDetailsRequestV2 {
        let reentryBuyInAmount: number, reentryRegistrationFee: number, reentryPrizePoolContribution: number = 0;
        let reentryBuyInMethods: number[] = [];
        if (tournament?.canReenter) {
            reentryBuyInAmount = CurrencyUtil.getAmountInRupee(tournament?.reentryAmount ?? 0);
            reentryRegistrationFee = CurrencyUtil.getAmountInRupee(tournament?.reentryFee ?? 0);
            reentryPrizePoolContribution = CurrencyUtil.getAmountInRupee(tournament?.reentryAmount - tournament?.reentryFee) ?? 0;
            reentryBuyInMethods = tournament?.reentryBuyinMethod ?? [];
        }
        return {
            tournamentId: tournament?.id,
            registerBuyInAmount: CurrencyUtil.getAmountInRupee(tournament?.registrationAmount ?? 0),
            registerRegistrationFee: CurrencyUtil.getAmountInRupee(tournament?.registrationFee ?? 0),
            registerPrizePoolContribution: CurrencyUtil.getAmountInRupee(tournament?.registrationAmount - tournament?.registrationFee) ?? 0,
            registerBuyInMethods: tournament?.registerBuyinMethod ?? [],

            reentryBuyInAmount: reentryBuyInAmount > 0 ? reentryBuyInAmount : undefined,
            reentryRegistrationFee: reentryRegistrationFee > 0 ? reentryRegistrationFee : undefined,
            reentryPrizePoolContribution: reentryPrizePoolContribution > 0 ? reentryPrizePoolContribution : undefined,
            reentryBuyInMethods: reentryBuyInMethods && reentryBuyInMethods?.length > 0 ? reentryBuyInMethods : undefined,
        }
    }

    static getTournamentEntryDetails(data: TournamentEntryDetailsResponse) {
        const { entryMethods } = data;
        const depositBalance = AmountUtil.getAmountWithCurrency(data?.depositBalance, CURRENCY.INR);
        const withdrawalBalance = AmountUtil.getAmountWithCurrency(data?.withdrawalBalance, CURRENCY.INR);
        const totalBalance = AmountUtil.getAmountWithCurrency(data?.totalBalance, CURRENCY.INR);
        const registrationFee = AmountUtil.getAmountWithCurrency(data?.registrationFee, CURRENCY.INR);
        const prizePoolContribution = AmountUtil.getAmountWithCurrency(data?.prizePoolContribution, CURRENCY.INR)
        const _entryMethods = [];
        entryMethods.forEach((entryMethod) => {
            const entryMethodType = TournamentUtil.getEntryMethodsFromGsResponse([entryMethod.entryMethod])[0];
            const entryAmount = AmountUtil.getAmountWithCurrency(entryMethod?.entryAmount, CURRENCY.INR);
            const _wallet = entryMethod?.wallet ?? {};
            const wallet = {
                depositBalance: AmountUtil.getAmountWithCurrency(_wallet?.depositBalance, CURRENCY.INR),
                withdrawalBalance: AmountUtil.getAmountWithCurrency(_wallet?.withdrawalBalance, CURRENCY.INR),
                tournamentTicketBalance: AmountUtil.getAmountWithCurrency(_wallet?.tournamentTicketBalance, CURRENCY.INR),
                totalBalance: AmountUtil.getAmountWithCurrency(_wallet?.totalBalance, CURRENCY.INR)
            }
            const _debit = entryMethod?.debit ?? {};
            const debit = {
                ddepositBalance: AmountUtil.getAmountWithCurrency(_debit?.depositBalance, CURRENCY.INR),
                withdrawalBalance: AmountUtil.getAmountWithCurrency(_debit?.withdrawalBalance, CURRENCY.INR),
                tournamentTicketBalance: AmountUtil.getAmountWithCurrency(_debit?.tournamentTicketBalance, CURRENCY.INR),
                totalBalance: AmountUtil.getAmountWithCurrency(_debit?.totalBalance, CURRENCY.INR)

            }
            _entryMethods.push({
                ...entryMethod,
                wallet: wallet,
                debit: debit,
                entryAmount: entryAmount,
                entryMethod: entryMethodType,
                entryMethodName: TournamentUtil.getTournamentEntryMethodText([entryMethodType])[0],
            });
        });
        return {
            ...data,
            depositBalance: depositBalance,
            withdrawalBalance: withdrawalBalance,
            totalBalance: totalBalance,
            registrationFee: registrationFee,
            prizePoolContribution: prizePoolContribution,
            entryMethods: _entryMethods
        }
    }

    static getTournamentEntryDetailsV2(data: TournamentEntryDetailsResponseV2) {
        const { entryMethods } = data;
        const playerGameBalance = AmountUtil.getAmountWithCurrency(data?.playerGameBalance, CURRENCY.INR);
        const winningBalance = AmountUtil.getAmountWithCurrency(data?.winningBalance, CURRENCY.INR);
        const discountCreditBalance = AmountUtil.getAmountWithCurrency(data?.discountCreditBalance, CURRENCY.CHIPS);
        const tournamentDiscountCreditBalance = AmountUtil.getAmountWithCurrency(data?.tournamentDiscountCreditBalance, CURRENCY.CHIPS);
        const totalBalance = AmountUtil.getAmountWithCurrency(data?.totalBalance, CURRENCY.CHIPS);
        const registrationFee = AmountUtil.getAmountWithCurrency(data?.registrationFee, CURRENCY.INR);
        const prizePoolContribution = AmountUtil.getAmountWithCurrency(data?.prizePoolContribution, CURRENCY.INR)
        const _entryMethods = [];
        entryMethods.forEach((entryMethod) => {
            const entryMethodType = TournamentUtil.getEntryMethodsFromGsResponse([entryMethod.entryMethod])[0];
            const entryAmount = AmountUtil.getAmountWithCurrency(entryMethod?.entryAmount, CURRENCY.INR);
            const _wallet = entryMethod?.wallet ?? {};
            const wallet = {
                totalBalance: AmountUtil.getAmountWithCurrency(_wallet?.totalBalance, CURRENCY.CHIPS),
                playerGameBalance: AmountUtil.getAmountWithCurrency(_wallet?.playerGameBalance, CURRENCY.INR),
                winningBalance: AmountUtil.getAmountWithCurrency(_wallet?.winningBalance, CURRENCY.INR),
                discountCreditBalance: AmountUtil.getAmountWithCurrency(_wallet?.discountCreditBalance, CURRENCY.CHIPS),
                tournamentDiscountCreditBalance: AmountUtil.getAmountWithCurrency(_wallet?.tournamentDiscountCreditBalance, CURRENCY.CHIPS),
                totalRealBalance: AmountUtil.getAmountWithCurrency(_wallet?.totalRealBalance, CURRENCY.INR),
            }
            const _debit = entryMethod?.debit ?? {};
            const debit = {
                totalBalance: AmountUtil.getAmountWithCurrency(_debit?.totalBalance, CURRENCY.CHIPS),
                playerGameBalance: AmountUtil.getAmountWithCurrency(_debit?.playerGameBalance, CURRENCY.INR),
                winningBalance: AmountUtil.getAmountWithCurrency(_debit?.winningBalance, CURRENCY.INR),
                discountCreditBalance: AmountUtil.getAmountWithCurrency(_debit?.discountCreditBalance, CURRENCY.CHIPS),
                tournamentDiscountCreditBalance: AmountUtil.getAmountWithCurrency(_debit?.tournamentDiscountCreditBalance, CURRENCY.CHIPS),
                totalRealBalance: AmountUtil.getAmountWithCurrency(_debit?.totalRealBalance, CURRENCY.INR),
            }
            _entryMethods.push({
                ...entryMethod,
                wallet: wallet,
                debit: debit,
                entryAmount: entryAmount,
                entryMethod: entryMethodType,
                entryMethodName: TournamentUtil.getTournamentEntryMethodText([entryMethodType])[0],
            });
        });
        return {
            ...data,
            playerGameBalance: playerGameBalance,
            winningBalance: winningBalance,
            discountCreditBalance: discountCreditBalance,
            tournamentDiscountCreditBalance: tournamentDiscountCreditBalance,
            totalBalance: totalBalance,
            registrationFee: registrationFee,
            prizePoolContribution: prizePoolContribution,
            entryMethods: _entryMethods
        }
    }

    static getTournamentEntryDetailsV3(data: TournamentEntryDetailsResponseV3) {
        const {entryMethods} = data;
        const playerGameBalance = AmountUtil.getAmountWithCurrency(data?.playerGameBalance, CURRENCY.INR);
        const winningBalance = AmountUtil.getAmountWithCurrency(data?.winningBalance, CURRENCY.INR);
        const discountCreditBalance = AmountUtil.getAmountWithCurrency(data?.discountCreditBalance, CURRENCY.CHIPS);
        const tournamentDiscountCreditBalance = AmountUtil.getAmountWithCurrency(data?.tournamentDiscountCreditBalance, CURRENCY.CHIPS);
        const totalBalance = AmountUtil.getAmountWithCurrency(data?.totalBalance, CURRENCY.CHIPS);
        const registrationFee = AmountUtil.getAmountWithCurrency(data?.registrationFee, CURRENCY.INR);
        const prizePoolContribution = AmountUtil.getAmountWithCurrency(data?.prizePoolContribution, CURRENCY.INR)
        const _entryMethods = [];
        entryMethods.forEach((entryMethod) => {
            const entryMethodType = TournamentUtil.getEntryMethodsFromSupernovaResponse(entryMethod.entryMethod);
            const entryAmount = AmountUtil.getAmountWithCurrency(entryMethod?.entryAmount, CURRENCY.INR);
            const _wallet = entryMethod?.wallet ?? {};
            const wallet = {
                totalBalance: AmountUtil.getAmountWithCurrency(_wallet?.totalBalance, CURRENCY.CHIPS),
                playerGameBalance: AmountUtil.getAmountWithCurrency(_wallet?.playerGameBalance, CURRENCY.INR),
                winningBalance: AmountUtil.getAmountWithCurrency(_wallet?.winningBalance, CURRENCY.INR),
                discountCreditBalance: AmountUtil.getAmountWithCurrency(_wallet?.discountCreditBalance, CURRENCY.CHIPS),
                tournamentDiscountCreditBalance: AmountUtil.getAmountWithCurrency(_wallet?.tournamentDiscountCreditBalance, CURRENCY.CHIPS),
                totalRealBalance: AmountUtil.getAmountWithCurrency(_wallet?.totalRealBalance, CURRENCY.INR),
            }
            const _debit = entryMethod?.debit ?? {};
            const debit = {
                totalBalance: AmountUtil.getAmountWithCurrency(_debit?.totalBalance, CURRENCY.CHIPS),
                playerGameBalance: AmountUtil.getAmountWithCurrency(_debit?.playerGameBalance, CURRENCY.INR),
                winningBalance: AmountUtil.getAmountWithCurrency(_debit?.winningBalance, CURRENCY.INR),
                discountCreditBalance: AmountUtil.getAmountWithCurrency(_debit?.discountCreditBalance, CURRENCY.CHIPS),
                tournamentDiscountCreditBalance: AmountUtil.getAmountWithCurrency(_debit?.tournamentDiscountCreditBalance, CURRENCY.CHIPS),
                totalRealBalance: AmountUtil.getAmountWithCurrency(_debit?.totalRealBalance, CURRENCY.INR),
            }
            _entryMethods.push({
                ...entryMethod,
                wallet: wallet,
                debit: debit,
                entryAmount: entryAmount,
                entryMethod: entryMethodType,
            });
        });
        return {
            ...data,
            playerGameBalance: playerGameBalance,
            winningBalance: winningBalance,
            discountCreditBalance: discountCreditBalance,
            tournamentDiscountCreditBalance: tournamentDiscountCreditBalance,
            totalBalance: totalBalance,
            registrationFee: registrationFee,
            prizePoolContribution: prizePoolContribution,
            entryMethods: _entryMethods
        }
    }

    static getTableMetaAndSeatDetails(response: TableMetaAndSeatDetails, userId: string): ITableMetaAndSeatDetails {
        const isPlayerSeated: boolean = response?.seatsData.some((seatData: SeatData) => seatData?.userId == Number(userId));
        const currency: number = response?.isPractice ? CURRENCY.CHIPS : CURRENCY.INR
        return {
            id: response?.id,
            roomId: response?.roomId,
            smallBlindAmount: AmountUtil.getAmountWithCurrency(response?.smallBlindAmount),
            bigBlindAmount: AmountUtil.getAmountWithCurrency(response?.bigBlindAmount),
            minBuyInAmount: AmountUtil.getAmountWithCurrency(response?.minBuyInAmount),
            maxBuyInAmount: AmountUtil.getAmountWithCurrency(response?.maxBuyInAmount),
            gameType: response?.gameType,
            gameVariant: response?.gameVariant,
            isPractice: response?.isPractice,
            isRIT: response?.ritActive,
            isTurbo: response?.isTurbo,
            isTenBB: response?.isTenBB,
            maxSeats: response?.maxSeats,
            averagePot: AmountUtil.getFloorAmountWithCurrency(response?.averagePot, CURRENCY.CHIPS),
            isPlayerSeated: isPlayerSeated,
            canReserveSeat: !(isPlayerSeated || !response?.tableHasEmptySeat),
            seatsData: response?.seatsData,
            migratedRoom: true,
            tableHasEmptySeat: response?.tableHasEmptySeat
        }

    }
}
