import AriesErrorCodes from '../errors/aries/aries-error-codes';
import GsErrorCodes from "../errors/gs/gs-error-codes";
import SupernovaErrorCodes from '../errors/supernova/supernova-error-codes';
import { GameVariant } from "../models/enums/game-variant";

export const PROMISE_STATUS = {
    FULFILLED: 'fulfilled',
    REJECTED: 'rejected',
};

export const APP_UNIQUE_CODE = {
    P52_NORMAL_APP: 'cSWQ6YoRnfd',
    P52_PRACTICE_APP: '22TT+bYoWF2',
    GMZ_NORMAL_APP: '/royP/gPugR',
    GMZ_PRACTICE_APP: 'NsIZ4hZj0Yq',
};

export const NEW_USER_PRACTICE_BALANCE = 2000000;

export const MIN_THRESHOLD_PRACTICE_BALANCE = 10000;

export const CREDIT_PRACTICE_BALANCE = 500000;

export const NO_OP = () => {
};

export const GS_TOKEN_TTL = 2592000

export const P52_VENDOR_ID = "1"; // Pocket 52's vendor id
export const GMZ_VENDOR_ID = "8"; // Pocket 52's vendor id

export const DEFAULT_STAGE_OTP = "111111";

export const COMMUNICATION_MODE = {
    SMS: "SMS",
    EMAIL: "EMAIL"
};

export const SOCIAL_PROOF = {
    INITIAL_ONLINE_USERS: 1250,
    INITIAL_MATCHED_TRADES: 16500,
}

export const UPI_PACKAGE_NAME_MAP = {
    GOOGLE_PAY: 'com.google.android.apps.nbu.paisa.user',
    PAYTM_UPI: 'net.one97.paytm',
    BHIM_UPI: 'in.org.npci.upiapp',
    PHONEPE_UPI: 'com.phonepe.app',
    YONO_SBI: 'com.sbi.lotusintouch',
    ICICI_UPI: 'com.csam.icici.bank.imobile',
    YONO_LITE_SBI: 'com.sbi.SBIFreedomPlus',
    HDFC_PAYZAPP: 'com.enstage.wibmo.hdfc',
    AMAZON_PAY_UPI: 'in.amazon.mShop.android.shopping',
};

export const CASH_APP = 'CASH_APP';

export const PRACTICE_APP = 'PRACTICE_APP';

export const PAGINATION = {
    DEFAULT_OFFSET: 0,
    DEFAULT_NUM_OF_RECORDS: 10,
    MAX_NUM_OF_RECORDS: 30,
    MAX_EVENTS_RECORDS: 20,
    MAX_NUM_OF_RECORDS_30: 30,
    DEFAULT_PAGE_NO: 1,
};

export const REQUEST_PARAMS = {
    INVOICE_TYPE: 'invoiceType',
    PAGE_NO: 'pageNo',
    INVOICE_ID_QUERY_PARAM: 'invoiceId',
    ORDER_ID_QUERY_PARAM: 'orderId',
    PRODUCT_TYPE_QUERY_PARAM: 'productType',
    FROM_DATE_QUERY_PARAM: 'fromDate',
    TO_DATE_QUERY_PARAM: 'toDate',
    ROOM_ID_PARAM: 'roomId',
    GROUP_ID_PARAM: 'groupId',
    TABLE_ID_PARAM: 'tableId',
    TOURNAMENT_ID_PARAM: 'tournamentId',
    OFFSET_QUERY_STRING: 'offset',
    NUM_OF_RECORDS_QUERY_STRING: 'numOfRecords',
    TRANSACTION_ID: 'transactionId',
    TOURNAMENT_USER_NAME: 'tournamentUserName',
    AMOUNT: 'amount',
    VIDEO_SCREEN: 'screen',
    PLAYER_ID_PARAM: 'playerId',
    LEADERBOARD_CAMPAIGN_TAG: 'campaignTag',
    ROOM_IDS: 'roomIds',
    LEADERBOARD_CAMPAIGN_STATUS: 'status',
    LEADERBOARD_GROUP_ID: 'groupId',
    LEADERBOARD_CHILD_ID: 'childId',
    LEADERBOARD_STAKES: 'lbStakes',
    PACK_STATUS: 'status',
    SELECTED_DATE: 'selectedDate',
    IS_NEXT_LEADERBOARD: 'isNextLeaderboard'
};

export const REQUEST_HEADERS = {
    REQUEST_ID: 'x-request-id',
    APP_TYPE: 'gk-app-type',
    PLATFORM: 'gk-platform',
    APP_VERSION: 'gk-app-version-name',
    BUNDLE_VERSION: 'gk-app-bundle-name',
    DEVICE_NAME: 'gk-device-name',
    ANDROID_ID: 'gk-android-id',
    WIFI_MAC: 'gk-wifi-mac',
    DEVICE_VERSION: 'gk-device-version',
    DEVICE_ID: 'gk-device-id',
    VENDOR_ID: 'x-vendor-id',
};

export const CLS = {
    requestNamespaceName: 'request-namespace',
    requestInfoKey: 'requestInfo',
    appType: 'gk-app-type',
};

export const EVENT_PUSH_TOPICS = {
    USER_AUTH: "apollo-UserAuth",
    USER_UPDATE: "apollo-UserUpdate",
    USER_LOGOUT: "apollo-UserLogout",
    USER_LOCATION: "apollo-UserLocation",
    USER_PAYMENT: "apollo-UserPayment",
    USER_PAYOUT: "apollo-UserPayout",
    USER_KYC: "apollo-UserKyc",
    USER_FEEDBACK: "apollo-UserFeedback",
    USER_PACKAGES: "apollo-UserPackages",
    USER_SMS: "apollo-UserSms",
    USER_LEADERBOARD_SETTLEMENT: "apollo-leaderboardSettlement",
    USER_REWARD: "apollo-UserReward",
    LEADERBOARD: "apollo-leaderboard",
    LEADERBOARD_ANALYTICS: "apollo-leaderboard-analytics"
};

export const EVENT_PUSH_NAMES = {
    USER_LOGOUT_SUCCESS: "UserLogoutSuccess",
    USER_REWARD_ALLOCATED: "UserRewardAllocated",
    USER_LOCATION_BLOCKED_BY_IP: "UserLocationBlockedByIp",
    USER_LOCATION_UPDATE: "UserLocationUpdate",
    USER_FEEDBACK: "UserFeedback",
    USER_PAYOUT_SUCCESS: "UserPayoutSuccess",
    USER_PAYOUT_FAILED: "UserPayoutFailed",
    USER_PAYOUT_INITIATED: "UserPayoutInitiated",
    USER_REFUND_INITIATED: "UserRefundInitiated",
    USER_REFUND_COMPLETED: "UserRefundCompleted",
    USER_KYC_COMPLETE: "UserKycComplete",
    USER_KYC_PENDING: "UserKycPending",
    USER_KYC_FAILURE: "UserKycFailure",
    USER_KYC_EXTRACT_SUCCESS: "UserKycExtractSuccess",
    USER_KYC_EXTRACT_FAILURE: "UserKycExtractFailure",
    USER_KYC_PAN_SUCCESS: "UserKycPanSuccess",
    USER_KYC_BANK_SUCCESS: "UserKycBankSuccess",
    USER_DEPOSIT_SUCCESS: "UserDepositSuccess",
    USER_FIRST_DEPOSIT_SUCCESS: "UserFirstDepositSuccess",
    USER_DEPOSIT_FAILURE: "UserDepositFailure",
    SERVICE_DEPOSIT_FAILURE: "ServiceDepositFailure",
    USER_INSTALLED_PACKAGES: "UserInstalledPackages",
    USER_SIGNUP_SUCCESS: "UserSignupSuccess",
    USER_VERIFY_EMAIL: "UserVerifyEmail",
    USER_BANK_STATUS: "UserBankStatus",
    USER_UPI_STATUS: "UserUpiStatus",
    PRACTICE_APP_DOWNLOAD_SMS: "PracticeAppDownloadSms",
    USER_PROPERTIES_UPDATE: "UserPropertiesUpdate",
    LEADERBOARD_FRAUD_USER_SETTLEMENT: "LeaderboardFraudUserSettlement",
    LEADERBOARD_USER_SETTLEMENT: "LeaderboardUserSettlement",
    LEADERBOARD_RAKEBACK_USER_SETTLEMENT: "LeaderboardRakeBackUserSettlement",
    AUTO_TOP_UP_SETTING_UPDATE: "AutoTopUpSettingUpdate",
    USER_PROMO_BENEFIT_CREDITED: "userPromoBenefitCredited",
    USER_LEADERBOARD_SCORE_UPDATED: "UserLeaderboardScoreUpdated",
    CHILD_LEADERBOARD_STARTED: "ChildLeaderboardStarted",
    LEADERBOARD_GROUP_CREATED: "LeaderboardGroupCreated",
    LEADERBOARD_GROUP_UPDATED: "LeaderboardGroupUpdated",
    LEADERBOARD_CHILD_UPDATED: "LeaderboardChildUpdated",
    LEADERBOARD_CHILD_CREATED: "LeaderboardChildCreated",
    LEADERBOARD_PRIZE_POOL_CREATED: "LeaderboardPrizePoolCreated",
    LEADERBOARD_CHILD_STARTED: "LeaderboardChildStarted"
};

export const CURRENCY = {
    INR: 1,
    CHIPS: 3,
    TDC: 5,
    DC: 7,
    SEATS: 9,
}

export const CURRENCY_SYMBOLS = {
    INR: '₹',
    CHIPS: ''
}


export const TOURNAMENT_CURRENCY_SYMBOLS = {
    WS: '₹',
    TDC: 'TDC',
    DC: 'DC'
}

export const ONE_THOUSAND = 1000;
export const ONE_LAKH = 100000;
export const ONE_CRORE = 10000000;

export const HOME_SCREEN_TABS_WITH_LEADERBOARD = [
    {
        "title": "Home",
        "hasTag": false,
        "icon": "./images/home_tab_icon.webp",
        "tabId": "HOME",
        "widgetType": "SCREEN",
        "selected": true,
        "isWidget": false,
        "components": [
            {
                "type": "static",
                "name": "HOME_SCREEN",
                "params": {
                    "showOffersWidget": true
                }
            }
        ]
    },
    {
        "title": "Leaderboard",
        "hasTag": true,
        "icon": "./images/leaderboard_tab_icon.webp",
        "tabId": "LEADERBOARD",
        "widgetType": "SCREEN",
        "isWidget": false,
        "selected": false,
        "components": [
            {
                "type": 'static',
                "name": 'LEADERBOARD_SCREEN',
                "params": {},
            },
        ]
    },
    {
        "title": "Referral",
        "hasTag": false,
        "icon": "./images/referral_tab_icon.webp",
        "tabId": "REFERRAL",
        "widgetType": "SCREEN",
        "isWidget": false,
        "selected": false,
        "components": [
            {
                "type": "static",
                "name": "REFERRAL_SCREEN",
                "params": {}
            }
        ]
    },
    {
        "title": "Wallet",
        "hasTag": false,
        "icon": "./images/wallet_tab_icon.webp",
        "tabId": "WALLET",
        "isWidget": true,
        "selected": false,
        "widgetType": "SCREEN",
        "components": [
            {
                "type": "static",
                "name": "WALLET_SCREEN",
                "params": {}
            }
        ]
    }
]

export const HOME_SCREEN_TABS_WITH_LEADERBOARD_PSL = [
    {
        "title": "Home",
        "hasTag": false,
        "icon": "./images/home_tab_icon.webp",
        "tabId": "HOME",
        "widgetType": "SCREEN",
        "selected": true,
        "isWidget": false,
        "components": [
            {
                "type": "static",
                "name": "HOME_SCREEN",
                "params": {
                    "showOffersWidget": true
                }
            }
        ]
    },
    {
        "title": "Leaderboard",
        "hasTag": true,
        "icon": "./images/leaderboard_tab_icon.webp",
        "tabId": "LEADERBOARD",
        "widgetType": "SCREEN",
        "isWidget": false,
        "selected": false,
        "components": [
            {
                "type": 'static',
                "name": 'LEADERBOARD_SCREEN',
                "params": {},
            },
        ]
    },
    {
        "title": "Psl",
        "hasTag": false,
        "icon": "./images/psl_tab_icon.webp",
        "tabId": "PSL",
        "widgetType": "SCREEN",
        "isWidget": false,
        "selected": false,
        "components": [
            {
                "type": 'static',
                "name": 'PSL_SCREEN',
                "params": {},
            },
        ]
    },
    {
        "title": "Referral",
        "hasTag": false,
        "icon": "./images/referral_tab_icon.webp",
        "tabId": "REFERRAL",
        "widgetType": "SCREEN",
        "isWidget": false,
        "selected": false,
        "components": [
            {
                "type": "static",
                "name": "REFERRAL_SCREEN",
                "params": {}
            }
        ]
    },
    {
        "title": "Wallet",
        "hasTag": false,
        "icon": "./images/wallet_tab_icon.webp",
        "tabId": "WALLET",
        "isWidget": true,
        "selected": false,
        "widgetType": "SCREEN",
        "components": [
            {
                "type": "static",
                "name": "WALLET_SCREEN",
                "params": {}
            }
        ]
    }
]

export const HOME_SCREEN_TABS_WITH_PSL = [
    {
        "title": "Home",
        "hasTag": false,
        "icon": "./images/home_tab_icon.webp",
        "tabId": "HOME",
        "widgetType": "SCREEN",
        "selected": true,
        "isWidget": false,
        "components": [
            {
                "type": "static",
                "name": "HOME_SCREEN",
                "params": {
                    "showOffersWidget": true
                }
            }
        ]
    },
    {
        "title": "Rewards",
        "hasTag": false,
        "icon": "./images/rewards_tab_icon.webp",
        "tabId": "REWARDS",
        "widgetType": "SCREEN",
        "isWidget": false,
        "selected": false,
        "components": [
            {
                "type": "static",
                "name": "REWARDS_SCREEN_WEBVIEW",
                "params": {}
            }
        ]
    },
    {
        "title": "Psl",
        "hasTag": false,
        "icon": "./images/psl_tab_icon.webp",
        "tabId": "PSL",
        "widgetType": "SCREEN",
        "isWidget": false,
        "selected": false,
        "components": [
            {
                "type": 'static',
                "name": 'PSL_SCREEN',
                "params": {},
            },
        ]
    },
    {
        "title": "Referral",
        "hasTag": false,
        "icon": "./images/referral_tab_icon.webp",
        "tabId": "REFERRAL",
        "widgetType": "SCREEN",
        "isWidget": false,
        "selected": false,
        "components": [
            {
                "type": "static",
                "name": "REFERRAL_SCREEN",
                "params": {}
            }
        ]
    },
    {
        "title": "Wallet",
        "hasTag": false,
        "icon": "./images/wallet_tab_icon.webp",
        "tabId": "WALLET",
        "isWidget": true,
        "selected": false,
        "widgetType": "SCREEN",
        "components": [
            {
                "type": "static",
                "name": "WALLET_SCREEN",
                "params": {}
            }
        ]
    }
]

export const HOME_SCREEN_TABS = [
    {
        "title": "Home",
        "hasTag": false,
        "icon": "./images/home_tab_icon.webp",
        "tabId": "HOME",
        "widgetType": "SCREEN",
        "selected": true,
        "isWidget": false,
        "components": [
            {
                "type": "static",
                "name": "HOME_SCREEN",
                "params": {
                    "showOffersWidget": true
                }
            }
        ]
    },
    {
        "title": "Rewards",
        "hasTag": false,
        "icon": "./images/rewards_tab_icon.webp",
        "tabId": "REWARDS",
        "widgetType": "SCREEN",
        "isWidget": false,
        "selected": false,
        "components": [
            {
                "type": "static",
                "name": "REWARDS_SCREEN_WEBVIEW",
                "params": {}
            }
        ]
    },
    {
        "title": "Referral",
        "hasTag": false,
        "icon": "./images/referral_tab_icon.webp",
        "tabId": "REFERRAL",
        "widgetType": "SCREEN",
        "isWidget": false,
        "selected": false,
        "components": [
            {
                "type": "static",
                "name": "REFERRAL_SCREEN",
                "params": {}
            }
        ]
    },
    {
        "title": "Wallet",
        "hasTag": false,
        "icon": "./images/wallet_tab_icon.webp",
        "tabId": "WALLET",
        "isWidget": true,
        "selected": false,
        "widgetType": "SCREEN",
        "components": [
            {
                "type": "static",
                "name": "WALLET_SCREEN",
                "params": {}
            }
        ]
    }
]


export const PRACTICE_HOME_SCREEN_TABS = [
    {
        "title": "Home",
        "tabId": "HOME",
        "icon": "home_tab_icon.webp",
        "widgetType": "SCREEN",
        "selected": true,
        "isWidget": false,
        "hasTag": false,
        "components": [
            {
                "type": "static",
                "name": "HOME_SCREEN",
                "params": {
                    "showOffersWidget": true
                }
            }
        ]
    },
    {
        "title": "Rewards",
        "tabId": "REWARDS",
        "icon": "rewards_tab_icon.webp",
        "widgetType": "SCREEN",
        "selected": false,
        "isWidget": false,
        "hasTag": false,
        "components": [
            {
                "type": "static",
                "name": "REWARDS_SCREEN_WEBVIEW",
                "params": {}
            }
        ]
    },
    {
        "title": "Learn",
        "tabId": "LEARN_POKER",
        "icon": "referral_tab_icon.webp",
        "widgetType": "SCREEN",
        "selected": false,
        "isWidget": false,
        "hasTag": false,
        "components": [
            {
                "type": "static",
                "name": "LEARN_POKER_SCREEN",
                "params": {}
            }
        ]
    },
    {
        "title": "Wallet",
        "tabId": "WALLET",
        "icon": "wallet_tab_icon.webp",
        "widgetType": "SCREEN",
        "selected": false,
        "isWidget": false,
        "hasTag": false,
        "components": [
            {
                "type": "static",
                "name": "WALLET_SCREEN",
                "params": {}
            }
        ]
    }
]

export const EXPLORE_GAMES_WIDGETS_V2 = [
    {
        "imageLink": "https://cdn.pocket52.com/pocket52-app-uploads/general/N5vVVfuweRRmUnMy4KwjrY.png",
        "cardText": "HOLD'EM",
        "deepLink": "texas_holdem"
    },
    {
        "imageLink": "https://cdn.pocket52.com/pocket52-app-uploads/general/c5xxF6o3EWti9TTF9pUm4A.png",
        "cardText": "OHAMA",
        "deepLink": "pot_limit_omaha"
    },
    {
        "imageLink": "https://cdn.pocket52.com/pocket52-app-uploads/general/7rQCAirS8SzZ3nKXkqbKZd.png",
        "cardText": "TOURNAMENTS",
        "deepLink": "tournaments"
    },
    {
        "imageLink": "https://cdn.pocket52.com/pocket52-app-uploads/general/WYjGdGnFxN5ZyRyWYDdCHn.png",
        "cardText": "FREEROLL",
        "deepLink": "freeroll"
    }
]

export const EXPLORE_GAMES_WIDGETS_V2_GZ_POKER = [
    {
        "imageLink": "https://cdn.pocket52.com/pocket52-app-uploads/general/nlhe_gz.png",
        "cardText": "HOLD'EM",
        "deepLink": "texas_holdem"
    },
    {
        "imageLink": "https://cdn.pocket52.com/pocket52-app-uploads/general/omaha_gz.png",
        "cardText": "OHAMA",
        "deepLink": "pot_limit_omaha"
    },
    {
        "imageLink": "https://cdn.pocket52.com/pocket52-app-uploads/general/tournament_gz.png",
        "cardText": "TOURNAMENTS",
        "deepLink": "tournaments"
    },
    {
        "imageLink": "https://cdn.pocket52.com/pocket52-app-uploads/general/free_roll_gz.png",
        "cardText": "FREEROLL",
        "deepLink": "freeroll"
    }
]

export const EXPLORE_GAMES_WIDGETS = [
    {
        "imageLink": "https://dgoe7er4vaygt.cloudfront.net/home-banners/HOLDEM-compressed.png",
        "cardText": "HOLD'EM",
        "deepLink": "texas_holdem"
    },
    {
        "imageLink": "https://dgoe7er4vaygt.cloudfront.net/home-banners/OHAMA-compressed.png",
        "deepLink": "pot_limit_omaha",
        "cardText": "OHAMA"
    },
    {
        "imageLink": "https://dgoe7er4vaygt.cloudfront.net/home-banners/TOURNEY-compressed.png",
        "deepLink": "tournaments",
        "cardText": "TOURNAMENTS"
    },
    {
        "imageLink": "https://dgoe7er4vaygt.cloudfront.net/home-banners/FREEROLL-compressed.png",
        "deepLink": "freeroll",
        "cardText": "FREEROLL"
    }
]

export const PRACTICE_EXPLORE_GAMES_WIDGETS = [
    {
        "imageLink": "https://d269ymt03w3v2s.cloudfront.net/banner/FREE_GAMES.png",
        "cardText": "Free Games",
        "deepLink": "all"
    },
    {
        "imageLink": "https://dgoe7er4vaygt.cloudfront.net/home-banners/TOURNEY-compressed.png",
        "bannerLink": "https://d269ymt03w3v2s.cloudfront.net/banner/practice-app-tournaments-1.jpg",
        "bannerClickUrl": "https://pocket52-prod.onelink.me/kSof/dihu3c4u",
        "cardText": "TOURNAMENTS"
    }
]

export const GameVariantText = {
    NLHE: 'NLHE',
    PLO4: 'PLO',
    PLO5: 'PLO5',
    PLO6: 'PLO6',
}

export const GameFeatures = {
    rit: "RIT",
    potOfGold: "POG",
    annonymous: "ANON",
    evChop: "EVCHOP",
    practice: "PRACTICE"
}

export const TournamentTypeText = {
    Normal: "Normal",
    Bounty: "Bounty",
    ProgressiveBounty: "Progressive Bounty",
    HitAndRun: "Hit and Run",
    WinTheButton: "Win the Button",
    BB30: "30 BB",
    MSP: "MSP",
    MFP: "MFP",
    Points: "Points"
}
export const TournamentSpeedText = {
    Slow: "Slow",
    Normal: "Normal",
    Turbo: "Turbo",
    HyperTurbo: "Hyper Turbo",
    Hyper: "Hyper",
    Regular: "Regular"
}

export const TournamentStatusText = {
    Announced: "Announced",
    Registering: "Registering",
    Running: "Running",
    LateRegistration: "Late Registration",
    Completed: "Completed",
    Canceled: "Canceled",
    Aborted: "Aborted",
}

export const TouranementEntryMethodsText = {
    FreeRoll: "Free Roll",
    PokerMoney: "Poker Money",
    Ticket: "Ticket",
    PocketCoin: "Pocket Coin",
}

export const TournamentEntryTypeText = {
    FreezeOut: "Freeze Out",
    ReEntry: "Re-Entry",
    ReBuy: "Re-Buy",
    ReBuyAddOn: "Re-Buy Add-On",
}

export const TournamentPrizeConfigType = {
    Overlay: "overlay",
    Fixed: "fixed",
}

export const TournamentCurrencyTypeUi = {
    WS: "WS",
    TDC: "TDC",
    DC: "DC",
}

export const TournamentSeat = {
    SEATS: "Seats"
}


export const HOME_SCREEN_WIDGETS = {
    EXPLORE_GAMES: {
        title: "Explore Games",
        key: "explore_games"
    },
    STORY_REWIND: {
        title: "Story Rewind",
        key: 'story_rewind'
    },
    RECOMMENDED_GAMES: {
        title: "Recommended Cash Games",
        key: "recommended_cash_games"
    },
    FEATURED_TOURNAMENTS: {
        title: "Featured Tournaments",
        key: "featured_tournaments"
    },
    LEADERBOARD_INFO: {
        title: {
            "1": "Leaderboard",
            "8": "Leaderboard"
        },
        key: "leaderboard_info"
    },
    USER_ROYALTY_INFO: {
        title: {
            "1": "Royalty Rewards",
            "8": "Gamezy Rewards"
        },
        key: "royalty_rewards"
    },
    HOT_TOURNAMENT_BANNERS: {
        title: "Hot Tournament Series",
        key: "hot_tournament_series"
    },
    OFFERS_BANNERS: {
        title: {
            "1": "Offers For You",
            "8": "Offers For You"
        },
        key: "offers"
    },
    USER_REFERRAL_INFO: {
        title: "Refer & Earn",
        key: "referral"
    },
    PSL: {
        title: "PSL",
        key: "psl"
    },
    PRACTICE_APP_REWARDS: {
        title: "Your Rewards",
        key: "practice_app_rewards"
    }
}

export const RoomsGameTypeInfoPriorityConstant = {
    [GameVariant.NLHE]: {
        priority: 1,
    },
    [GameVariant.PLO4]: {
        priority: 4,
    },
    [GameVariant.PLO5]: {
        priority: 3,
    },
    [GameVariant.PL06]: {
        priority: 2,
    },
};

export const GroupsGameTypeInfoPriorityConstant = {
    [GameVariant.NLHE]: {
        priority: 1,
    },
    [GameVariant.PLO4]: {
        priority: 4,
    },
    [GameVariant.PLO5]: {
        priority: 3,
    },
    [GameVariant.PL06]: {
        priority: 2,
    },
};

export const InvoiceConstant = {
    sortByDate: "DESC(invoiceDate)",
    sortByInvoiceId: "DESC(id)"
}

export const INVOICE_TYPE_TEXT = {
    CASH_GAME: 'Cash Games',
    TOURNAMENTS: 'Tournaments',
    ADD_CASH: 'Add Cash',
}

export const __errorCodes = {
    InsufficientFunds: GsErrorCodes.CashTableInsufficientFunds,
    InsufficientFundsAries: AriesErrorCodes.InsufficientWalletBalance,
    InsufficientFundsSupernova: SupernovaErrorCodes.InsufficientWalletBalance
};

export const GENERATE_AFFILIATE_REPORT_BASE_URL = "https://q8k6l10yf9.execute-api.ap-south-1.amazonaws.com/prod";

export const PROD_TEST_USERS: string[] = ["6789123450", "6789123451", "6000000000", "6000000001"];

export const PROD_TEST_USER_OTP: string = "277227";

export const DEAULT_TIME_FOR_ONLINE_USER = 3600000;

export const FISCAL_YEAR_CONFIG = {
    MONTH: 3,
    DAY: 1,
}

export const HTTP_SERVER_KEEP_ALIVE_TIMEOUT = 65000;
export const HTTP_SERVER_HEADERS_TIMEOUT = 66000;

export const LOCKED_DCS_PACK_DESCRIPTION = '##DC## DC will be unlocked for every ##COINS## coins generated'
export const EXPIRY_TIME = 'EXPIRY_TIME';
export const ASC = 'ASC';
export const DESC = 'DESC';
export const NO_EXPIRY_DATE = 32509404718000;
export const COIN_TO_RAKE_CONVERSION = 9.44;
export const DEFAULT_APOLLO_SOCKET_NAMESAPACE = '/'
export const MIGRATED_TOURNAMENT_ID = 1714521600


