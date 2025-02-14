import {IAmountData} from "../amount-data"
import {GameVariant} from "../enums/game-variant"
import {TournamentType} from "../enums/tournament/tournament-type"
import {EntryType} from "../enums/tournament/entry-type"
import {MoneyType} from "../enums/money-type"
import {TournamentStatus} from "../enums/tournament/tournament-status"
import {TournamentSpeed} from "../enums/tournament/tournament-speed"
import {PlayerTournamentViewList} from "../player-mtt-list";
import {ITotalPrizePool} from "../total-prizepool";
import {PlayerTournamentStatus} from "../enums/tournament/player-tournament-status";
import {GsTournamentType} from "../game-server/mtt-list";
import PlayerConnectionStatus from '../enums/player-connection-status';
import PlayerGameStatus from '../enums/player-game-status';
import TableSeatStatus from '../enums/table-seat-status';

export interface IRooms {
    rooms: Array<IRoom>
}

export interface IRoom {
    id: string;
    name: string;
    gameVariant: number;
    smallBlindAmount: IAmountData;
    bigBlindAmount: IAmountData;
    minBuyInAmount: IAmountData;
    maxBuyInAmount: IAmountData;
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
    allowSeatSelection?: boolean;
    roomCardMeta?: {
        ritEnabledText: string;
        potOfGoldEnabledText: string;
        annonymousRoomText: string;
        tableEvChopEnabledText: string;
        practiceText: string;
        gameVariantText: string;
    }
}

export interface IGroups {
    groups: Array<IGroup>
}

export interface IGroup {
    id: number;
    name: string;
    gameVariant: number;
    smallBlindAmount: IAmountData;
    bigBlindAmount: IAmountData;
    minBuyInAmount: IAmountData;
    maxBuyInAmount: IAmountData;
    playerCount: number;
    isPractice: boolean;
    migratedRoom: boolean;
    isQuickJoinEnabled: boolean;
    groupCardMeta?: {
        practiceText: string;
        gameVariantText: string;
    }
}

export interface IWalletData {
    deposit: {
        value: number;
        text: string;
        currency: number;
    };
    winning: {
        value: number;
        text: string;
        currency: number;
    };
    real: {
        value: number;
        text: string;
        currency: number;
    };
    total: {
        value: number;
        text: string;
        currency: number;
    };
}

export interface ITicket {
    ticketName?: string;
    isTicketActive: boolean;
    ticketBalance: {
        value: number;
        text: string;
        currency: number;
    };
    ticketMax?: {
        value: number;
        text: string;
        currency: number;
    };
    ticketMin?: {
        value: number;
        text: string;
        currency: number;
    };
}

export interface ITableDetails {
    maxBuyInAmount: IAmountData;
    minBuyInAmount: IAmountData;
    smallBlindAmount?: IAmountData;
    bigBlindAmount?: IAmountData;
    gameType?: number;
    gameVariant?: string;
    antiBankingDuration?: number;
    timerDuration?: number;
    isPractice: boolean;
    isRIT?: boolean,
}

interface PopupMeta {
    popUpHeader?: string;
    tableBlindsText?: string;
    bonusText?: string;
    bonusPlaceholderText?: string;
    sliderMinBuyInText?: string;
    sliderMaxButtonText?: string;
    joinTableButtonText?: string;
    antiBankingTimerText?: string;
    antiBankingTimerPlaceholderText?: string;
    timerText?: string;
    timerPlaceholderText?: string;
}

export interface IReserveRoom {
    userId: number;
    seatId: number;
    tableId: string;
    wallet?: IWalletData;
    tableDetails: ITableDetails;
    ticketDetails?: ITicket;
    popupMeta: PopupMeta;
    showPopup?: boolean;
}

export interface IQuickJoinGroup {
    userId: number;
    seatId: number;
    tableId: string;
    roomId: number;
    groupId: number;
    vendorId: string;
    wallet?: IWalletData;
    tableDetails: ITableDetails;
    ticketDetails?: ITicket;
    popupMeta: PopupMeta;
    showPopup?: boolean;
    migratedRoom?: boolean;
}

export interface IReserveSeat {
    userId: number;
    vendorId: string;
    seatId: number;
    tableId: string;
    wallet?: IWalletData;
    tableDetails: ITableDetails;
    ticketDetails?: ITicket;
    popupMeta: PopupMeta;
    showPopup?: boolean;
}

export interface IJoinSimilarTable {
    userId: number;
    vendorId: string;
    seatId: number;
    tableId: string;
    wallet?: IWalletData;
    tableDetails: ITableDetails;
    ticketDetails?: ITicket;
    popupMeta: PopupMeta;
    showPopup?: boolean;
}


export interface IJoinTable {
    userId: number,
    seatId: number,
    tableId: string,
    stackSize: IAmountData
}

export interface IPlayerTopupData {
    userId: number;
    seatId: number;
    tableId: string;
    transactionId: number;
    topupAmount: IAmountData;
    message: string;
}

export interface IPlayerRebuyData {
    userId: number;
    seatId: number;
    tableId: string;
    transactionId: number;
    rebuyAmount: IAmountData;
    message: string;
}

export interface IPlayerLeaveTableData {
    userId: number;
    seatId?: number;
    tableId: string;
    roomId: number;
}


export interface IPlayerTournamentLeaveTableData {
    userId: number;
    seatId?: number;
    tableId: string;
}

export interface TopupMeta {
    popUpHeader: string;
    tableBlindsText: string;
    sliderMinBuyInText: string;
    sliderMaxButtonText: string;
    joinTableButtonText: string;
    reserveSeatTimerText: string;
    reserveSeatTimerPlaceholderText: string;
    showPopup: boolean;
}

export interface ITopupValuesData {
    userId: number;
    seatId: number;
    tableId: string;
    wallet?: IWalletData;
    tableDetails: ITableDetails;
    ticketDetails?: ITicket;
    popupMeta: PopupMeta;
    showPopup?: boolean;
    autoTopUpSetting?: IUserAutoTopUpSetting;
}

export interface IUserAutoTopUpSetting {
    setting: string;
    settingLabel: string;
    settingDescription: string;
    value: boolean;
    config?: UserAutoTopUpConfig;
}

export interface UserAutoTopUpConfig {
    topUpThresholdPrecentage?: number;
    topUpStackPercentage?: number;
}

export interface ITableResponse {
    tables: Array<{
        id: string,
        name?: string,
        averageStack?: IAmountData,
        tableIndex: number,
        playerCount?: number
    }>
}

export interface IGroupTableResponse {
    tables: Array<{
        id: number,
        roomId: number,
        bigBlindAmount: IAmountData,
        smallBlindAmount: IAmountData,
        minBuyInAmount: IAmountData,
        maxBuyInAmount: IAmountData,
        gameVariant: string,
        isRIT: boolean,
        isTurbo: boolean,
        isTenBB: boolean,
        isPractice: boolean,
        maxSeats: number,
        averageStack: IAmountData,
        averagePot: IAmountData,
        averagePotLevel: number,
        playerCount: number,
        migratedRoom: boolean,
        isPlayerSeated: boolean,
    }>,
    totalPlayerCount: number
}

export interface ITablePlayerDetailsResponse {
    averagePot?: IAmountData,
    averageStack?: IAmountData,
    playerList: Array<{
        currentStack: IAmountData,
        vendorId: number,
        showVendorId?: boolean,
        name: string
    }>
}

export interface IHomeScreenTab {
    title: string,
    hasTag: boolean,
    icon: string,
    tabId: string;
    widgetType: string;
    selected?: boolean;
    isWidget: boolean;
    components: HomeScreenTabComponent[];
}

export interface HomeScreenTabComponent {
    type?: string;
    name?: string;
    params: {
        showOffersWidget?: boolean;
    };
}

export interface IExploreGameWidgets {
    imageLink: string,
    cardText: string,
    deepLink: string
}

export interface IExplorePracticeGameWidgets {
    imageLink: string,
    cardText: string,
    deepLink?: string,
    bannerLink?: string,
    bannerClickUrl?: string
}

export interface IWidgets {
    title?: string,
    key?: string,
    items?: any,
    name?: string
    cardTitle?: string
    content?: string
    earnings?: number
    referred?: number
    buttonText?: string
    deepLink?: string
    imageLink?: string
}

export interface IHomeWidgets {
    onlinePlayers: number,
    pslConfig?: object,
    widgets: IWidgets[],
    homeScreenTabs: IHomeScreenTab[],
}

export interface IPlayerJoinBack {
    tableId: string,
    seatId?: number,
    userId: number,
    roomId?: number,
    wallet?: IWalletData;
    tableDetails?: ITableDetails;
    ticketDetails?: ITicket;
    popupMeta?: PopupMeta;
    showPopup?: boolean;

}

export interface ITournamentBlindStructure {
    level: number;
    smallBlindAmount: IAmountData;
    bigBlindAmount: IAmountData;
    anteAmount: IAmountData;
    turnDuration: number;
    timeBankDuration: number;
    timeBankRenewDuration: number;
    reconnectTimerDuration: number;
    disconnectTimerDuration: number;
    blindDuration: number;
}

export interface ITournamentBlindStructureResponse {
    tournamentId: string,
    blindStructureDetails: Array<ITournamentBlindStructure>
    userId: number,
    blindStructureMeta: {
        headerDesktopText?: string,
        headerMobileText?: string,
        levelHeaderText?: string,
        blindsHeaderText?: string,
        anteHeaderText?: string,
        durationHeaderText?: string,
    }
}

export interface ISatelliteTournament {
    id: string
    gameVariant: number
    tournamentType: number
    tournamentStatus: number
    tournamentSpeed: number
    tournamentConfig: ITournamentConfig
    name: string
    prizePool: IAmountData
    remainingPlayer: number
    playerCount: number
    blindLevel: number
    anteAmount: IAmountData
    smallBlindAmount: IAmountData
    bigBlindAmount: IAmountData
    blindDuration: number
    tournamentMeta: {
        tournamentTypeText?: string,
        entryTypeText?: string,
        entryMethodsText?: string[],
        tournamentStatusText?: string,
        tournamentSpeedText?: string,
    }
}

export interface ITournamentDetailsTableList {
    maxStackAmount: IAmountData;
    minStackAmount: IAmountData;
    players: number;
    tableNumber: string;
}

export interface ITournamentDetailsTableListV3 {
    maxStackAmount: IAmountData;
    minStackAmount: IAmountData;
    players: number;
    tableNumber: string;
    tableId: string;
}

export interface ITournamentDetailsPlayerList {
    idx: number;
    isIdxShow: boolean;
    playerId: string;
    playerName: string;
    rank: number;
    reEntries: number;
    stackAmount: IAmountData;
    tableNumber: string;
}

export interface ITournamentDetailsPlayerListV3 {
    playerId: string;
    playerName: string;
    rank: number;
    stackAmount: IAmountData;
}

export interface ITournamentPrizeList {
    amount: IAmountData;
    primaryAmount?: IAmountData;
    secondaryAmount?: IAmountData;
    asset: string;
    idx: number;
    isIdxShow: boolean;
    playerId: string;
    playerName: string;
    rank: number;
    point: string;
}

export interface ITournamentDetailsBlindDetails {
    currentSmallBlindAmount: IAmountData;
    currentBigBlindAmount: IAmountData;
    currentAnteAmount: IAmountData;
    currentLevel: number;
    currentLevelStart: number;
    currentLevelPause: number;
    currentLevelEnd: number;
    nextSmallBlindAmount: IAmountData;
    nextBigBlindAmount: IAmountData;
    nextAnteAmount: IAmountData;
    nextLevel: number;
    nextLevelStart: number;
}

export interface ITournamentDetailsStats {
    handsPlayed: number;
    stackMaxAmount: IAmountData;
    stackMinAmount: IAmountData;
    stackAvgAmount: IAmountData;
}

export interface IPrizeDistributionDetails {
    prizeConfigType: string,
    isOverlay: boolean,
    entriesLeft: number,
    primaryCurrency: string,
    secondaryCurrency: string,
    totalEntriesRequired: number,
    overlayPercent: string,
}

export interface ITournamentDetails {
    name: string;
    tournamentStatus?: TournamentStatus;
    tableList?: Array<ITournamentDetailsTableList>;
    playerList?: Array<ITournamentDetailsPlayerList>;
    prizeList?: Array<ITournamentPrizeList>;
    blindDetails?: ITournamentDetailsBlindDetails;
    tournamentConfig: ITournamentConfig
    totalPlayers?: number;
    remainingPlayers?: number;
    stats?: ITournamentDetailsStats;
    totalPrizePool?: number;
    totalPrizePoolWithOverlay?: ITotalPrizePool;
    totalTickets?: number;
    totalPoints?: string;
    isHandForHandActive?: boolean;
    isBreak?: boolean;
    tournamentDetailsMeta?: {
        tournamentTypeText?: string,
        entryTypeText?: string,
        entryMethodsText?: string[],
        tournamentStatusText?: string,
        tournamentSpeedText?: string,
    },
    totalAssets?: string,
    prizeDistributionDetails?: IPrizeDistributionDetails
}


export interface ITournamentDetailsV3 {
    name: string;
    tournamentStatus?: TournamentStatus;
    tableList?: Array<ITournamentDetailsTableList>;
    playerList?: Array<ITournamentDetailsPlayerListV3>;
    prizeList?: Array<ITournamentPrizeList>;
    blindDetails?: ITournamentDetailsBlindDetails;
    tournamentConfig: ITournamentConfigV3
    totalPlayers?: number;
    remainingPlayers?: number;
    stats?: ITournamentDetailsStats;
    totalPrizePool?: number;
    totalPrizePoolWithOverlay?: ITotalPrizePool;
    totalTickets?: number;
    totalPoints?: string;
    isHandForHandActive?: boolean;
    isBreak?: boolean;
    tournamentDetailsMeta?: {
        tournamentTypeText?: string,
        entryTypeText?: string,
        entryMethodsText?: string[],
        tournamentStatusText?: string,
        tournamentSpeedText?: string,
        gameVariantText?: string,
    },
    totalAssets?: string,
    prizeDistributionDetails?: IPrizeDistributionDetails
    playerStatus?: PlayerTournamentStatus
    migratedTournament?: boolean;
    myRank?: number;
}

export interface IPlayerTournamentRegisterResponse {
    message: string,
    userId: number,
    tournamentId: string
}

export interface IPlayerTournamentUnregisterResponse {
    message: string,
    userId: number,
    tournamentId: string
}

export interface IPlayerTournamentStatus {
    message: string,
    userId: number,
    tournamentId: string
}

export interface IPlayerTournamentList {
    tournamentId: string,
    playerStatus: number,
    playerStatusText: string
}

export interface IPlayerMTTListResponse {
    openedList: Array<IPlayerTournamentList>,
    viewingList: Array<PlayerTournamentViewList>,
}

export interface IEntryConfig {
    type: EntryType;
    config: {
        bountyAmount: IAmountData;
        limit: number;
        methods: MoneyType[];
        popUpDuration: number;
        prizePoolContribution: IAmountData;
        registrationFee: IAmountData;
        totalAmount: IAmountData;
        end: number;
        minStack: IAmountData;
        topUpDuration?: number;
        reBuyLimit?: number;
        reBuyDuration?: number;
        reBuyMinStack?: IAmountData;
        reBuyTopUpDuration?: number;
        reBuyEnd?: number;
        addOnAfter?: number;
        addOnChips?: number;
        addOnAmount?: IAmountData;
        addOnDuration?: number;
    };
}

export interface IBuyInConfig {
    type: MoneyType[];
    totalAmount: IAmountData;
    registrationFee: IAmountData;
    prizePoolContribution: IAmountData;
    bountyAmount: IAmountData;
}

export interface ITournamentConfig {
    minPlayers?: number;
    maxPlayers?: number;
    startTime?: number;
    endTime?: number;
    entryConfig?: IEntryConfig
    buyInConfig?: IBuyInConfig;
    breakStart?: number,
    breakEnd?: number,
    totalBuyIns?: number,
    totalReBuys?: number,
    totalAddOns?: number,
    totalReEntries?: number,
    hasSatellite?: boolean;
    isSatellite?: boolean;
    isFeatured?: boolean;
    maxNumberOfSeat?: number;
    satelliteTournamentList?: any[];
    featureColor?: string;
    featureColors?: Array<string>;
    tag?: string;
    stackAmount?: IAmountData;
    registrationStartTime?: number;
    lateRegistrationDuration?: number;
    buyInAmount?: IAmountData;
    entryType?: EntryType;
    entryMethods?: MoneyType[];
    isActive?: boolean;
    ticketWinners?: string[]
}

export interface ITournamentConfigV3 {
    minPlayers?: number;
    maxPlayers?: number;
    startTime?: number;
    endTime?: number;
    entryConfig?: IEntryConfig
    buyInConfig?: IBuyInConfig;
    breakStart?: number,
    breakEnd?: number,
    totalBuyIns?: number,
    totalReBuys?: number,
    totalAddOns?: number,
    totalReEntries?: number,
    hasSatellite?: boolean;
    isSatellite?: boolean;
    isFeatured?: boolean;
    maxNumberOfSeat?: number;
    satelliteTournamentList?: any[];
    featureColor?: string;
    featureColors?: Array<string>;
    tag?: string;
    stackAmount?: IAmountData;
    registrationStartTime?: number;
    lateRegistrationDuration?: number;
    lateRegistrationEndTime?: number;
    buyInAmount?: IAmountData;
    entryType?: EntryType;
    entryMethods?: MoneyType[];
    isActive?: boolean;
    ticketWinners?: string[]
    gameVariant?: number;
    tournamentType: TournamentType;
    tournamentSpeed?: TournamentSpeed;
}

export interface ITournamentListingConfigV3{
    startTime?: number;
    entryConfig?: IEntryConfig
    buyInConfig?: IBuyInConfig;
    isSatellite?: boolean;
    isFeatured?: boolean;
    featureColor?: string;
    featureColors?: Array<string>;
    tag?: string;
    registrationStartTime?: number;
    lateRegistrationDuration?: number;
    buyInAmount?: IAmountData;
    entryType?: EntryType;
    entryMethods?: MoneyType[];
    lateRegistrationEndTime?: number;
}

export interface ITournament {
    id: string;
    gameVariant: GameVariant;
    tournamentType: TournamentType;
    tournamentStatus: TournamentStatus;
    tournamentSpeed: TournamentSpeed;
    tournamentConfig: ITournamentConfig;
    name: string;
    prizePool: IAmountData;
    totalTickets: number;
    totalPoints?: string;
    remainingPlayer: number;
    playerCount: number;
    blindLevel: number;
    anteAmount: IAmountData;
    smallBlindAmount: IAmountData;
    bigBlindAmount: IAmountData;
    blindDuration: number;
    filters: {
        userFilter: number[]
    };
    hasPlayed: boolean,
    tournamentMeta: {
        gameVariantText: string,
        tournamentTypeText: string,
        entryTypeText: string,
        entryMethodsText: string[],
        tournamentStatusText: string,
        tournamentSpeedText: string,
    }
    totalPrizePoolWithOverlay?: IAmountData,
    totalAssets?: string
}

export interface ITournamentV3 {
    id: string;
    gameVariant: GameVariant;
    tournamentType: TournamentType;
    tournamentStatus: TournamentStatus;
    tournamentSpeed: TournamentSpeed;
    tournamentConfig: ITournamentListingConfigV3;
    name: string;
    prizePool: IAmountData;
    totalTickets: number;
    totalPoints?: string;
    remainingPlayer: number;
    playerCount: number;
    tournamentMeta: {
        gameVariantText: string,
        tournamentTypeText: string,
        entryTypeText: string,
        entryMethodsText: string[],
        tournamentStatusText: string,
        tournamentSpeedText: string,
    }
    playerStatus: PlayerTournamentStatus;
    migratedTournament: boolean;
    totalPrizePoolWithOverlay?: IAmountData,
    totalAssets?: string
}

export interface ITournamentListResponse {
    title?: string,
    data?: ITournament[],
    date?: string
}

export interface ITournamentListResponseV3 {
    title?: string,
    data?: ITournamentV3[],
    date?: string
}

export interface UserPersonal {
    displayName: string;
    displayPicture: string;
    emailStatus: number;
    mobile: string;
    email: string;
    mobileStatus: number;
    userId: number;
    username_editable: boolean;
    isAffiliate?: boolean;
}

export interface UserSummary {
    userId?: number;
    practiceChips?: number;
    realChips?: {
        added?: number;
        withdrawable?: number;
        cancellableWithdrawalAmount?: number;
        addCashCount?: number;
    },
    bonus?: {
        totalAmount?: number;
        releasedAmount?: number;
    },
    cashback?: {
        totalAmount?: number;
        releasedAmount?: number;
    },
    effectiveBalance?: number;
    displayName?: string; // username
    userType?: number;
    userUniqueId?: string;
    mobile?: string;
}

export interface UserSummaryV2 {
    userId?: number;
    practiceChips?: number;
    discountCreditBalance?: number,
    tournamentDiscountCreditBalance?: number,
    realChips?: {
        added?: number;
        withdrawable?: number;
        cancellableWithdrawalAmount?: number;
        addCashCount?: number;
    },
    bonus?: {
        totalAmount?: number;
        releasedAmount?: number;
    },
    cashback?: {
        totalAmount?: number;
        releasedAmount?: number;
    },
    effectiveBalance?: number;
    displayName?: string; // username
    userType?: number;
    userUniqueId?: string;
    mobile?: string;
    userStats?: any
}

export interface UserAvatars {
    avatar_url?: string[];
    default_avatar_url?: string;
    msg?: string;
}

export interface UpdateUserPersonal {
    displayPicture?: string;
    email?: string;
    displayName?: string;
}

export interface PlayerBuyInDetails {
    playerGameBalance?: number;
    winningBalance?: number;
    discountCreditBalance?: number;
    totalRealBalance?: number;
}

export interface IPlayerBuyInDetails {
    playerGameBalance?: IAmountData;
    winningBalance?: IAmountData;
    discountCreditBalance?: IAmountData;
    totalRealBalance?: IAmountData;
}

export interface PracticeAppDcsWidget {
    maxDcLimit?: number;
    handsPerDc?: number;
    dcEarned?: number;
    isRakeGenerated?: boolean;
    isDcLimitReached?: boolean;
}

export interface  ISeatData {
    seatId: number;
    userId?: number;
    userName?: string;
    vendorId?: number;
    stackValue?: number;
    stackValueInBB?: string;
    playerActionType?: string;
    playerActionName?: string;
    seatStatusName?: string;
    seatStatusType?: TableSeatStatus;
    gameStatusName?: string;
    gameStatusType?: PlayerGameStatus;
    connectionStatusName?: string;
    connectionStatusType?: PlayerConnectionStatus;
    turnBankTimer?: number;
    disconnectTimer?: number;
    userAvatar?: string;
}

export interface ITableMetaAndSeatDetails {
    averagePot: IAmountData,
    bigBlindAmount: IAmountData,
    canReserveSeat: boolean,
    gameVariant: string,
    gameType: number,
    isPlayerSeated: boolean,
    isPractice: boolean,
    isRIT: boolean,
    isTenBB: boolean,
    isTurbo: boolean,
    maxBuyInAmount: IAmountData,
    maxSeats: number,
    migratedRoom: boolean,
    minBuyInAmount: IAmountData,
    roomId: number,
    seatsData: Array<ISeatData>,
    smallBlindAmount: IAmountData,
    tableHasEmptySeat: boolean,
    id: number
}

export interface IPlayerTournamentJoinBack {
    tournamentId: number,
    userId: number,

}

export interface TournamentObserverTableId {
    tableId: number;
}
