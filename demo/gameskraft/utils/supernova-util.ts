import { differenceInDays } from 'date-fns';
import {
    COIN_TO_RAKE_CONVERSION,CURRENCY ,
    LOCKED_DCS_PACK_DESCRIPTION,
    NO_EXPIRY_DATE
} from '../constants/constants';
import { TRANSACTION_LABEL } from '../constants/payin-constants';
import {
    ALL_TRANSACTION_TYPES,
    BUY_IN_CURRENCY,
    CASH_TRANSACTION_NAMES,
    CASH_TRANSACTION_TYPES,
    CURRENCY_CODE,
    DCS_TDC_INCLUDE_TRANSACTIONS,
    DEBIT_RAKE_TRANSACTION_TYPES,
    GAME_PLAY_TRANSACTION,
    INTERNAL_TRANSACTION_TYPES, LEADERBOARD_TRANSACTION, ONLY_DCS_AND_TDC_TRANSACTION,
    SUPERNOVA_TRANSACTION_STATUS,
    TRANSACTION_ID_PREFIX,
    TRANSACTION_METHODS,
    TRANSACTION_TAG_MSG,
    TRANSACTION_TYPE_MSG,
    USER_TRANSACTION_TYPE
} from '../constants/supernova-constants';
import CurrencyUtil from '../helpers/currency-util';
import Parser from '../helpers/parser';
import { RoomType } from '../models/enums/room-type';
import { Room } from '../models/room';
import {
    SupernovaReserveSeatEligibilityRequest
} from '../models/supernova/request';
import { CurrencyPackStatus } from '../models/enums/currency-pack-status';
import { PackDetailsFilter, WalletTransactionFilter } from '../models/supernova/request';
import {
    AddCashData,
    BenefitData,
    Cashback,
    GameData,
    ICashback,
    ICashbacks,
    ICashGameTickets,
    ICashGameTicketTransactions,
    ICashTicket,
    ITicketTransaction,
    ITournamentTicket,
    ITournamentTickets,
    LockedDcsPackDetails,
    PackDetails,
    Ticket,
    UserTransactionDetails,
    UserTransactionSummary,
    UserWalletBalance,
    UserWalletBalanceV2,
    UserWalletDetails,
    WalletTransaction,
    WithdrawalData
} from '../models/supernova/response';
import { SupernovaRoomMeta } from '../models/supernova/supernova-room-meta';
import AmountUtil from './amount-util';
import AriesUtil from './aries-util';
import DatetimeUtil from './datetime-util';
import LoggerUtil from './logger';

const configService = require('../services/configService');

const logger = LoggerUtil.get("PlanetService");

export default class SupernovaUtil {

    static transformCashGameTicketsResponse(cashGameTickets: Ticket[], totalCashGameTicketCount: number, totalCashGameTicketAmount: number): ICashGameTickets {
        const cashGameTicketsResponse: ICashTicket[] = [];
        cashGameTickets.map((data: Ticket) => {
            const meta = (typeof data?.meta === 'string') ? JSON.parse(data?.meta ?? '{}') : (data?.meta ?? {});
            const rewardMetaData = meta?.rewardMeta ?
                (typeof meta?.rewardMeta === 'string') ? JSON.parse(meta?.rewardMeta ?? '{}') : (meta?.rewardMetaData ?? {}) :
                (typeof meta?.rewardMetaData === 'string') ? JSON.parse(meta?.rewardMetaData ?? '{}') : (meta?.rewardMetaData ?? {});
            const currentTime = Date.now();
            const expiryTime = new Date(data?.expiryTime).getTime();
            const variants = new Set<string>();
            (rewardMetaData?.variants ?? []).forEach((variant: any) => {
                variants.add(variant.gameVariant)
            });
            const ticket: ICashTicket = {
                id: data?.packId,
                name: rewardMetaData?.name ?? '',
                description: rewardMetaData?.description ?? '',
                balance: data?.balance,
                value: data?.initBalance,
                expiry: expiryTime,
                variants: Array.from(variants),
                status: (currentTime < expiryTime) ? "VALID" : "EXPIRED",
            };
            cashGameTicketsResponse.push(ticket);
        });
        return {cashGameTickets: cashGameTicketsResponse, totalCashGameTicketCount, totalCashGameTicketAmount};
    }

    static transformTournamentTicketsResponse(tournamentTickets: Ticket[], totalTournamentTicketCount: number, totalTournamentTicketAmount: number, tournamentDetails: any[]): ITournamentTickets {
        const tournamentTicketsResponse: ITournamentTicket[] = [];
        tournamentTickets.map((data: Ticket) => {
            const meta = (typeof data?.meta === 'string') ? JSON.parse(data?.meta ?? '{}') : (data?.meta ?? {});
            const rewardMetaData = meta?.rewardMeta ?
                (typeof meta?.rewardMeta === 'string') ? JSON.parse(meta?.rewardMeta ?? '{}') : (meta?.rewardMetaData ?? {}) :
                (typeof meta?.rewardMetaData === 'string') ? JSON.parse(meta?.rewardMetaData ?? '{}') : (meta?.rewardMetaData ?? {});
            const currentTime = Date.now();
            const expiryTime = new Date(data?.expiryTime).getTime();
            const tournamentDetail = tournamentDetails.find(tournamentDetail => tournamentDetail._id === data?.balance);
            const ticket: ITournamentTicket = {
                id: data?.packId,
                name: rewardMetaData?.name ?? '',
                value: data?.balance,
                expiry: expiryTime,
                ticketCount: 1,
                status: (currentTime < expiryTime) ? "VALID" : "EXPIRED",
                tournamentId: tournamentDetail?.tournament?.configuration?.id ?? '',
            };
            tournamentTicketsResponse.push(ticket)
        })
        return {tournamentTickets: tournamentTicketsResponse, totalTournamentTicketCount, totalTournamentTicketAmount};
    }

    static transformCashGameTicketTransactionResponse(cashGameTicketTransactions: WalletTransaction[]): ICashGameTicketTransactions {
        const cashGameTicketTransactionsResponse: ITicketTransaction[] = [];
        cashGameTicketTransactions.map((data: WalletTransaction) => {
            const transaction: ITicketTransaction = {
                transactionAmount: data?.transactionAmount,
                transactionType: parseInt(data?.transactionType),
                transactionName: this.getTransactionName(parseInt(data?.transactionType)),
                transactionDate: new Date(data?.updatedAt).getTime(),
                gameDetails: data?.meta?.tableMeta
            };
            cashGameTicketTransactionsResponse.push(transaction)
        })
        return {cashGameTicketTransactions: cashGameTicketTransactionsResponse};
    }

    static transformCashbackResponse(cashbacks: Cashback[]): ICashbacks {
        const cashbacksResponse: ICashback[] = [];
        cashbacks.map((data: Cashback) => {
            const meta = (typeof data?.meta === 'string') ? JSON.parse(data?.meta ?? '{}') : (data?.meta ?? {});
            const rewardMetaData = meta?.rewardMeta ?
                (typeof meta?.rewardMeta === 'string') ? JSON.parse(meta?.rewardMeta ?? '{}') : (meta?.rewardMetaData ?? {}) :
                (typeof meta?.rewardMetaData === 'string') ? JSON.parse(meta?.rewardMetaData ?? '{}') : (meta?.rewardMetaData ?? {});
            const expiryTime = new Date(data?.expiryTime).getTime();
            const cashback: ICashback = {
                id: data?.packId,
                promoCode: (rewardMetaData?.promoCode || rewardMetaData?.promo_code) ?? '',
                releasedAmount: data?.releasedLockedCashAmount,
                value: data?.initBalance,
                expiry: expiryTime,
                expiryText: DatetimeUtil.getCashbackExpiryText(expiryTime),
                status: SupernovaUtil.getCashbackStatus(expiryTime),
                statusText: SupernovaUtil.getCashbackStatusText(expiryTime),
            };
            cashbacksResponse.push(cashback);
        });
        return {cashbacks: cashbacksResponse};
    }

    static getCashbackStatus(timestamp: number) {
        let status = 5;
        if (timestamp > Date.now()) {
            const days = differenceInDays(timestamp, Date.now());
            if (days <= 3) {
                status = 10;
            }
        }
        else {
            status = 15;
        }
        return status;
    }

    static getCashbackStatusText(timestamp: number) {
        let status = 'Active';
        if (timestamp > Date.now()) {
            const days = differenceInDays(timestamp, Date.now());
            if (days <= 3) {
                status = 'Expiring Soon'
            }
        }
        else {
            status = 'Expired';
        }
        return status;
    }

    static getTransactionName(transactionType: number) {
        switch (transactionType) {
            case CASH_TRANSACTION_TYPES.JOIN_CASH_GAME_TABLE:
                return CASH_TRANSACTION_NAMES.JOIN_CASH_GAME_TABLE;
            case CASH_TRANSACTION_TYPES.LEAVE_CASH_GAME_TABLE:
                return CASH_TRANSACTION_NAMES.LEAVE_CASH_GAME_TABLE;
            default:
                return '';
        }
    }

    static getTransactionTypes(transactionMethod: string): number[] {
        switch (transactionMethod) {
            case TRANSACTION_METHODS.WALLET:
                return Object.keys(CASH_TRANSACTION_TYPES).map(key => CASH_TRANSACTION_TYPES[key]);
            case TRANSACTION_METHODS.GAMEPLAY:
                return Object.keys(GAME_PLAY_TRANSACTION).map(key => GAME_PLAY_TRANSACTION[key]);
            case TRANSACTION_METHODS.TDS:
                return [
                    CASH_TRANSACTION_TYPES.REFUND_CASH_TDS,
                    CASH_TRANSACTION_TYPES.REVERSE_REFUND_CASH_TDS,
                    CASH_TRANSACTION_TYPES.WITHDRAW_CASH_TDS,
                    CASH_TRANSACTION_TYPES.REVERSE_WITHDRAW_CASH_TDS,
                    CASH_TRANSACTION_TYPES.TDS_CORRECTION_CREDIT,
                    CASH_TRANSACTION_TYPES.TDS_CORRECTION_DEBIT,
                ];
            case TRANSACTION_METHODS.DCS:
            case TRANSACTION_METHODS.TDC:
                return [ ...Object.keys(DCS_TDC_INCLUDE_TRANSACTIONS).map(key => DCS_TDC_INCLUDE_TRANSACTIONS[key]),
                        ONLY_DCS_AND_TDC_TRANSACTION.ADD_CASH_REWARD_ALLOCATION,];
            case TRANSACTION_METHODS.LEADERBOARD :
                return Object.keys(LEADERBOARD_TRANSACTION).map(key => LEADERBOARD_TRANSACTION[key]);
            case TRANSACTION_METHODS.ALL:
                return Object.keys(ALL_TRANSACTION_TYPES).map(key => ALL_TRANSACTION_TYPES[key]);
            case TRANSACTION_METHODS.DEBIT_RAKE:
                return [
                    DEBIT_RAKE_TRANSACTION_TYPES.SETTLE_CASH_GAME_HAND_DEBIT_RAKE
                ];
            default:
                return [];
        }
    }

    static getInternalTransactionTypes(): number[] {
        return Object.keys(INTERNAL_TRANSACTION_TYPES).map(key => INTERNAL_TRANSACTION_TYPES[key]);
    }

    static createWalletTransactionFilter(transactionMethod: string, walletType: number, currencies?: string[], transactionId?: string[], amountGT?: number, fromDate?: string, referenceId?: string): WalletTransactionFilter {
        const transactionTypes: number[] = SupernovaUtil.getTransactionTypes(transactionMethod);
        const internalTransactionTypes: number[] = SupernovaUtil.getInternalTransactionTypes();
        return {walletType, currencies, transactionId, transactionTypes, amountGT, internalTransactionTypes, fromDate, referenceId};
    }

    static creatPackDetailsFilter(packStatus: CurrencyPackStatus, currencies: string[], orderBy?: string, sortBy?: string, excludeZeroPacks?: boolean ): PackDetailsFilter {
        const status: string = SupernovaUtil.getPackStatus(packStatus);
        return {status, currencies, orderBy, sortBy, packsRequired: true, excludeZeroPacks};
    }


    static getPackStatus(packStatus: CurrencyPackStatus): string {
        switch (packStatus) {
            case CurrencyPackStatus.ACTIVE:
                return 'ACTIVE';
            case CurrencyPackStatus.UPCOMING:
                return 'ACTIVE';
            case CurrencyPackStatus.RECENTLY_COMPLETED:
                return 'ACTIVE';
            default:
                return 'EXPIRED';
        }
    }

    static getTransactionType(transactionType: number): string {
        const userTransactionTypeConfig = configService.getUserTransactionTypeConfig();
        if (((userTransactionTypeConfig.credit || []).filter(transaction => transaction == transactionType)).length) {
            return USER_TRANSACTION_TYPE.CREDIT
        }
        return USER_TRANSACTION_TYPE.DEBIT;
    }


    static getTransactionAmountSummary(transactions: WalletTransaction[]) {
        let amount: number = 0, previousBalance: number = 0, updatedBalance: number = 0;

        transactions = transactions.sort((a, b) => {
            if (!a.transactionType) {
                return 1;
            } else if (!b.transactionType) {
                return -1
            }
            return Number(a.transactionType) - Number(b.transactionType)
        });
        BUY_IN_CURRENCY.forEach((currency) => {
            previousBalance += transactions.filter((transaction) => transaction.currencyCode == currency)[0]?.previousBalance ?? 0;
            updatedBalance += transactions.filter((transaction) => transaction.currencyCode == currency).slice(-1)[0]?.updatedBalance ?? 0;

        })
        amount = Math.abs(updatedBalance - previousBalance);
        const id: string = transactions[0].transactionId;
        const createdAt: string = DatetimeUtil.getTzTime(transactions[0].createdAt);
        const transactionType: number = Number(transactions[0].transactionType);
        const status: number = SupernovaUtil.getSupernovaTransactionStatus(transactionType);
        const transactionTypeLabel: string = TRANSACTION_LABEL[transactions[0].transactionType];
        const tagMsg: string | undefined = SupernovaUtil.getTransactionTagMsg(transactions[0]);
        return {
            amount: Parser.parseToTwoDecimal(amount),
            previousBalance: Parser.parseToTwoDecimal(previousBalance),
            updatedBalance: Parser.parseToTwoDecimal(updatedBalance),
            id,
            createdAt,
            transactionType,
            status,
            transactionTypeLabel,
            tagMsg
        };
    }


    static getTransactionTagMsg(transaction: WalletTransaction): string | undefined {
        switch (transaction.transactionType) {
            case String(LEADERBOARD_TRANSACTION.LEADERBOARD_WINNING) : {
                return transaction.meta.transactionMsg;
            }
        }
    }

    static getUserTransactionSummary(userWalletTransactions: WalletTransaction[][]): UserTransactionSummary[] {
        return userWalletTransactions
            .filter(transactions => transactions.length > 0)
            .map(transactions => ({
                ...SupernovaUtil.getTransactionAmountSummary(transactions),
                type: SupernovaUtil.getTransactionType(Number(transactions[0].transactionType)),
                isNewTxn: true,
            }));
    }

    static getDcsTransactionAmountSummary(transactions: WalletTransaction[]) {
        let amount: number = 0, previousBalance: number = 0, updatedBalance: number = 0;
        transactions.forEach((transaction: WalletTransaction, index: number) => {
            amount += transaction.transactionAmount;
        })

        previousBalance += transactions.filter((transaction) => transaction.currencyCode == CURRENCY_CODE.DISCOUNT_CREDIT_SEGMENT)[0]?.previousBalance ?? 0;
        updatedBalance += transactions.filter((transaction) => transaction.currencyCode == CURRENCY_CODE.DISCOUNT_CREDIT_SEGMENT).slice(-1)[0]?.updatedBalance ?? 0;
        amount = Math.abs(updatedBalance - previousBalance);
        const id: string = transactions[0].transactionId;
        const createdAt: string = DatetimeUtil.getTzTime(transactions[0].createdAt);
        const transactionType: number = Number(transactions[0].transactionType);
        const status: number = SupernovaUtil.getSupernovaTransactionStatus(transactionType);
        const transactionTypeLabel: string = TRANSACTION_LABEL[transactions[0].transactionType];
        const tagMsg: string = SupernovaUtil.getTransactionDcsAndTdcTagMsg(transactions[0].transactionType);
        return {
            amount: Parser.parseToTwoDecimal(amount),
            previousBalance: Parser.parseToTwoDecimal(previousBalance),
            updatedBalance: Parser.parseToTwoDecimal(updatedBalance),
            id,
            createdAt,
            transactionType,
            status,
            transactionTypeLabel,
            tagMsg
        };
    }

    static getUserDcsTransactionSummary(userWalletTransactions: WalletTransaction[][]): UserTransactionSummary[] {
        return userWalletTransactions
            .filter(transactions => transactions.length > 0)
            .map(transactions => ({
                ...SupernovaUtil.getDcsTransactionAmountSummary(transactions),
                type: SupernovaUtil.getTransactionType(Number(transactions[0].transactionType)),
                isNewTxn: true,
            }));
    }

    static getUserTdcTransactionSummary(userWalletTransactions: WalletTransaction[][]): UserTransactionSummary[] {
        return userWalletTransactions
            .filter(transactions => transactions.length > 0)
            .map(transactions => ({
                ...SupernovaUtil.getTdcTransactionAmountSummary(transactions),
                type: SupernovaUtil.getTransactionType(Number(transactions[0].transactionType)),
                isNewTxn: true,
            }));
    }

    static getTdcTransactionAmountSummary(transactions: WalletTransaction[]) {
        let amount: number = 0, previousBalance: number = 0, updatedBalance: number = 0;
        transactions.forEach((transaction: WalletTransaction, index: number) => {
            amount += transaction.transactionAmount;
        })

        previousBalance += transactions.filter((transaction) => transaction.currencyCode == CURRENCY_CODE.TOURNAMENT_DISCOUNT_SEGMENT)[0]?.previousBalance ?? 0;
        updatedBalance += transactions.filter((transaction) => transaction.currencyCode == CURRENCY_CODE.TOURNAMENT_DISCOUNT_SEGMENT).slice(-1)[0]?.updatedBalance ?? 0;

        amount = Math.abs(updatedBalance - previousBalance);
        const id: string = transactions[0].transactionId;
        const createdAt: string = DatetimeUtil.getTzTime(transactions[0].createdAt);
        const transactionType: number = Number(transactions[0].transactionType);
        const status: number = SupernovaUtil.getSupernovaTransactionStatus(transactionType);
        const transactionTypeLabel: string = TRANSACTION_LABEL[transactions[0].transactionType];
        const tagMsg: string = SupernovaUtil.getTransactionDcsAndTdcTagMsg(transactions[0].transactionType);
        return {
            amount,
            previousBalance: Parser.parseToTwoDecimal(previousBalance),
            updatedBalance: Parser.parseToTwoDecimal(updatedBalance),
            id,
            createdAt,
            transactionType,
            status,
            transactionTypeLabel,
            tagMsg
        };
    }

    static getSupernovaTransactionStatus(transactionType: number): number {
        if (transactionType === DCS_TDC_INCLUDE_TRANSACTIONS.REWARD_EXPIRY) {
            return SUPERNOVA_TRANSACTION_STATUS.expired;
        }
        return SUPERNOVA_TRANSACTION_STATUS.success
    }

    static getUserTransactionDetails(userWalletTransactions: WalletTransaction[]): UserTransactionDetails {
        let addCashData: AddCashData;
        let withdrawalData: WithdrawalData;
        let gameData: GameData;
        let benefitData: BenefitData;
        let transactionLabel: string;
        let tagMsg: string | undefined;
        let type: string = SupernovaUtil.getTransactionType(Number(userWalletTransactions[0].transactionType));
        const transactionAmountSummary = SupernovaUtil.getTransactionAmountSummary(userWalletTransactions);

        switch (userWalletTransactions[0].transactionType) {
            case String(CASH_TRANSACTION_TYPES.ADD_CASH):
                addCashData = SupernovaUtil.transformAddCashTransactionForUserTransactionDetails(userWalletTransactions);
                transactionLabel = TRANSACTION_TYPE_MSG.ADD_CASH.replace("###", String(addCashData?.addCashAmount ?? transactionAmountSummary.amount))
                break;

            case String(CASH_TRANSACTION_TYPES.WITHDRAW_CASH):
                withdrawalData = SupernovaUtil.transformWithdrawTransactionForUserTransactionDetails(userWalletTransactions);
                transactionLabel = TRANSACTION_TYPE_MSG.WITHDRAW_CASH.replace("###", String(withdrawalData?.withdrawalPlaceAmount ?? transactionAmountSummary.amount))
                break;

            case String(CASH_TRANSACTION_TYPES.JOIN_CASH_GAME_TABLE):
            case String(CASH_TRANSACTION_TYPES.TOPUP_CASH_GAME_TABLE):
            case String(CASH_TRANSACTION_TYPES.REBUY_CASH_GAME_TABLE):
            case String(CASH_TRANSACTION_TYPES.LEAVE_CASH_GAME_TABLE):
            case String(CASH_TRANSACTION_TYPES.ADDON_TOURNAMENT):
            case String(CASH_TRANSACTION_TYPES.REGISTER_TOURNAMENT):
            case String(CASH_TRANSACTION_TYPES.REENTRY_TOURNAMENT):
            case String(CASH_TRANSACTION_TYPES.REBUY_TOURNAMENT):
            case String(CASH_TRANSACTION_TYPES.SETTLE_TOURNAMENT):
            case String(CASH_TRANSACTION_TYPES.UNREGISTER_TOURNAMENT):
            case String(CASH_TRANSACTION_TYPES.JOIN_CASH_GAME_TABLE_ROLLBACK):
            case String(CASH_TRANSACTION_TYPES.REBUY_CASH_GAME_TABLE_ROLLBACK):
            case String(CASH_TRANSACTION_TYPES.TOPUP_CASH_GAME_TABLE_ROLLBACK):
            case String(CASH_TRANSACTION_TYPES.CASH_GAME_TABLE_TRANSACTION_ROLLBACK):
            case String(CASH_TRANSACTION_TYPES.REGISTER_TOURNAMENT_ROLLBACK):
            case String(CASH_TRANSACTION_TYPES.REENTRY_TOURNAMENT_ROLLBACK):
            case String(CASH_TRANSACTION_TYPES.REBUY_TOURNAMENT_ROLLBACK):
            case String(CASH_TRANSACTION_TYPES.ADDON_TOURNAMENT_ROLLBACK):
            case String(CASH_TRANSACTION_TYPES.TOURNAMENT_TRANSACTION_ROLLBACK):
            case String(CASH_TRANSACTION_TYPES.CREDIT_USER_AMOUNT):
            case String(CASH_TRANSACTION_TYPES.DEBIT_USER_AMOUNT):
            case String(CASH_TRANSACTION_TYPES.CONFISCATE_USER_AMOUNT):
            case String(CASH_TRANSACTION_TYPES.SATELLITE_TOURNAMENT_WINNING):
            case String(CASH_TRANSACTION_TYPES.TRANSACTION_FIX_DEBIT):
            case String(CASH_TRANSACTION_TYPES.TRANSACTION_FIX_CREDIT):
            case String(CASH_TRANSACTION_TYPES.LEAVE_ON_COMPLETE_CASH_GAME_HAND):
            case String(CASH_TRANSACTION_TYPES.TOPUP_ON_COMPLETE_CASH_GAME_HAND):
            case String(CASH_TRANSACTION_TYPES.FRAUD_VICTIM_CREDIT):
            case String(CASH_TRANSACTION_TYPES.FISCAL_YEAR_ENDING_TDS_DEDUCTION):
            case String(CASH_TRANSACTION_TYPES.BUSINESS_PROMOTION_CREDIT):
            case String(CASH_TRANSACTION_TYPES.RUNNING_BALANCE_CORRECTION):
            case String(CASH_TRANSACTION_TYPES.LEADERBOARD_WINNING):
                gameData = SupernovaUtil.transformGameTransactionForUserTransactionDetails(userWalletTransactions);
                transactionLabel = SupernovaUtil.getTransactionLabelFromTransactionType(userWalletTransactions[0].transactionType);
                tagMsg = SupernovaUtil.getTransactionTagMsg(userWalletTransactions[0]);
                break;

            case String(CASH_TRANSACTION_TYPES.CREDIT_ADD_CASH_REWARD):
            case String(CASH_TRANSACTION_TYPES.CREDIT_WITHDRAW_REWARD):
            case String(CASH_TRANSACTION_TYPES.CREDIT_POCKET_COINS_AMOUNT):
            case String(CASH_TRANSACTION_TYPES.CREDIT_REFERRAL_REFEREE_BENEFIT_AMOUNT):
            case String(CASH_TRANSACTION_TYPES.CREDIT_REFERRAL_REFERRER_BENEFIT_AMOUNT):
            case String(CASH_TRANSACTION_TYPES.REWARD_EXPIRY):
            case String(CASH_TRANSACTION_TYPES.DISBURSE_RELEASED_LOCKED_DCS):
                benefitData = SupernovaUtil.transformBenefitDataForUserTransactionDetails(userWalletTransactions);
                const totalCredits = Parser.parseToTwoDecimal((benefitData?.discountCredit ?? 0) + (benefitData?.tournamentDiscountCredit ?? 0))
                transactionLabel = SupernovaUtil.getTransactionLabelFromTransactionType(userWalletTransactions[0].transactionType).replace('###', String(totalCredits));
                break;

            case String(CASH_TRANSACTION_TYPES.REFUND_CASH_TDS):
            case String(CASH_TRANSACTION_TYPES.REVERSE_REFUND_CASH_TDS):
            case String(CASH_TRANSACTION_TYPES.WITHDRAW_CASH_TDS):
            case String(CASH_TRANSACTION_TYPES.REVERSE_WITHDRAW_CASH_TDS):
                transactionLabel = SupernovaUtil.getTransactionLabelFromTransactionType(userWalletTransactions[0].transactionType);
                break;

            default:
                transactionLabel = SupernovaUtil.getTransactionLabelFromTransactionType(userWalletTransactions[0].transactionType);
        }

        const userTransactionDetails: UserTransactionDetails = {
            id: transactionAmountSummary.id,
            transactionLabel: transactionLabel,
            transactionType: transactionAmountSummary.transactionType,
            transactionAmount: transactionAmountSummary.amount,
            createdAt: transactionAmountSummary.createdAt,
            status: transactionAmountSummary.status,
            updatedBuyInValue: transactionAmountSummary.updatedBalance,
            type: type,
            tagMsg: tagMsg,
            addCashData: addCashData,
            withdrawalData: withdrawalData,
            gameData: gameData,
            benefitData: benefitData,
        }
        return userTransactionDetails;
    }


    static getUserDcsTransactionDetails(userWalletTransactions: WalletTransaction[]): UserTransactionDetails {
        let type: string = SupernovaUtil.getTransactionType(Number(userWalletTransactions[0].transactionType));
        let transactionLabel: string
        const benefitData: BenefitData = SupernovaUtil.transformBenefitDataForUserTransactionDetails(userWalletTransactions);
        if (type === USER_TRANSACTION_TYPE.CREDIT) {
            transactionLabel = '### Credits Received'.replace('###', String(benefitData?.discountCredit ?? 0));
        }
        else if (type === USER_TRANSACTION_TYPE.DEBIT && Number(userWalletTransactions[0].transactionType) != DCS_TDC_INCLUDE_TRANSACTIONS.REWARD_EXPIRY) {
            transactionLabel = '### Credits Utilised'.replace('###', String(benefitData?.discountCredit ?? 0));
        }
        else {
            transactionLabel = TRANSACTION_TYPE_MSG.REWARD_EXPIRY.replace('###', String(benefitData?.discountCredit ?? 0));

        }


        const transactionAmountSummary = SupernovaUtil.getTransactionAmountSummary(userWalletTransactions);
        const userTransactionDetails: UserTransactionDetails = {
            id: transactionAmountSummary.id,
            transactionLabel: transactionLabel,
            transactionType: transactionAmountSummary.transactionType,
            transactionAmount: transactionAmountSummary.amount,
            createdAt: transactionAmountSummary.createdAt,
            status: transactionAmountSummary.status,
            updatedBuyInValue: transactionAmountSummary.updatedBalance,
            type: type,
            benefitData: {
                discountCredit: (benefitData?.discountCredit ?? 0),
            },

        }
        return userTransactionDetails;
    }

    static getUserTdcTransactionDetails(userWalletTransactions: WalletTransaction[]): UserTransactionDetails {
        let type: string = SupernovaUtil.getTransactionType(Number(userWalletTransactions[0].transactionType));
        let transactionLabel: string;
        const benefitData: BenefitData = SupernovaUtil.transformBenefitDataForUserTransactionDetails(userWalletTransactions);
        if (type === USER_TRANSACTION_TYPE.CREDIT) {
            transactionLabel = '### Credits Received'.replace('###', String(benefitData?.tournamentDiscountCredit ?? 0));
        }
        else if (type === USER_TRANSACTION_TYPE.DEBIT && Number(userWalletTransactions[0].transactionType) != DCS_TDC_INCLUDE_TRANSACTIONS.REWARD_EXPIRY) {
            transactionLabel = '### Credits Utilised'.replace('###', String(benefitData?.tournamentDiscountCredit ?? 0));
        }
        else {
            transactionLabel = TRANSACTION_TYPE_MSG.REWARD_EXPIRY.replace('###', String(benefitData?.tournamentDiscountCredit ?? 0));
        }


        const transactionAmountSummary = SupernovaUtil.getTransactionAmountSummary(userWalletTransactions);
        const userTransactionDetails: UserTransactionDetails = {
            id: transactionAmountSummary.id,
            transactionLabel: transactionLabel,
            transactionType: transactionAmountSummary.transactionType,
            transactionAmount: transactionAmountSummary.amount,
            createdAt: transactionAmountSummary.createdAt,
            status: transactionAmountSummary.status,
            updatedBuyInValue: transactionAmountSummary.updatedBalance,
            type: type,
            benefitData: {
                tournamentDiscountCredit: (benefitData?.tournamentDiscountCredit ?? 0),
            },
        }
        return userTransactionDetails;
    }

    static getTransactionLabelFromTransactionType(transactionType: string): string {
        for (const key in TRANSACTION_TYPE_MSG) {
            if (TRANSACTION_TYPE_MSG.hasOwnProperty(key) && CASH_TRANSACTION_TYPES[key] === Number(transactionType)) {
                return TRANSACTION_TYPE_MSG[key];
            }
        }
        return TRANSACTION_TYPE_MSG.OTHERS;
    }

    static getTransactionDcsAndTdcTagMsg(transactionType: string): string | undefined {
        for (const key in TRANSACTION_TAG_MSG) {
            if (TRANSACTION_TAG_MSG.hasOwnProperty(key) && ALL_TRANSACTION_TYPES[key] === Number(transactionType)) {
                return TRANSACTION_TAG_MSG[key];
            }
        }
    }


    static transformAddCashTransactionForUserTransactionDetails(userWalletTransactions: WalletTransaction[]): AddCashData {
        let gst: number = 0;
        let buyInValue: number = 0;
        let discountCredits: number = 0;
        let tournamentDiscountCredit: number = 0;
        let acsCreditAmount: number = 0;
        let lockedDcsCreditAmount: number = 0;
        let tournamentTicketCreditAmount: number = 0;
        userWalletTransactions
            .forEach((transaction) => {
                if (transaction.currencyCode === CURRENCY_CODE.DISCOUNT_CREDIT_SEGMENT) {
                    discountCredits += transaction.transactionAmount;
                }
                if (transaction.currencyCode === CURRENCY_CODE.TOURNAMENT_DISCOUNT_SEGMENT) {
                    tournamentDiscountCredit += transaction.transactionAmount;
                }
                if (transaction.currencyCode === CURRENCY_CODE.ADD_CASH_SEGMENT) {
                    acsCreditAmount += transaction.transactionAmount;
                }
                if (transaction.currencyCode === CURRENCY_CODE.GST_SEGMENT) {
                    gst += transaction.transactionAmount;
                }
                if (transaction.currencyCode === CURRENCY_CODE.LOCKED_DCS) {
                    lockedDcsCreditAmount += transaction.transactionAmount;
                }
                if (transaction.currencyCode === CURRENCY_CODE.SEAT) {
                    tournamentTicketCreditAmount += transaction.transactionAmount;
                }
            });
        let addCashData: AddCashData;
        if (acsCreditAmount > 0 || discountCredits > 0 || gst > 0 || tournamentDiscountCredit > 0) {
            addCashData = {
                buyInValue: Parser.parseToTwoDecimal(acsCreditAmount + discountCredits),
                addCashAmount: Parser.parseToTwoDecimal(acsCreditAmount + gst),
                gst: Parser.parseToTwoDecimal(gst),
                discountCredit: Parser.parseToTwoDecimal(discountCredits),
                tournamentDiscountCredit: Parser.parseToTwoDecimal(tournamentDiscountCredit),
                lockedDcsCredit: Parser.parseToTwoDecimal(lockedDcsCreditAmount),
                tournamentTickets: Parser.parseToTwoDecimal(tournamentTicketCreditAmount),
                benefitAmount: Parser.parseToTwoDecimal(tournamentDiscountCredit + lockedDcsCreditAmount + tournamentTicketCreditAmount),
                totalValue: Parser.parseToTwoDecimal(acsCreditAmount + discountCredits + tournamentDiscountCredit + lockedDcsCreditAmount + tournamentTicketCreditAmount),
            }
        }
        return addCashData;
    }

    static transformWithdrawTransactionForUserTransactionDetails(userWalletTransactions: WalletTransaction[]): WithdrawalData {
        let requestedAmount: number = 0;
        let winningsToGameBalance: number = 0;
        let tds: number = 0;
        userWalletTransactions
            .forEach((transaction) => {
                if (transaction.currencyCode === CURRENCY_CODE.WINNING_SEGMENT) {
                    requestedAmount += transaction.transactionAmount;
                }
                if (transaction.currencyCode === CURRENCY_CODE.GAME_SEGMENT) {
                    winningsToGameBalance += transaction.transactionAmount;
                }
                if (transaction.currencyCode === CURRENCY_CODE.WINNING_SEGMENT && Number(transaction.transactionType) === CASH_TRANSACTION_TYPES.WITHDRAW_CASH_TDS) {
                    tds += transaction.transactionAmount;
                }
            });
        let withdrawalData: WithdrawalData;
        if (requestedAmount > 0 || winningsToGameBalance > 0 || tds > 0) {
            withdrawalData = {
                requestedAmount: Parser.parseToTwoDecimal(requestedAmount),
                winningsToGameBalance: Parser.parseToTwoDecimal(winningsToGameBalance),
                tds: Parser.parseToTwoDecimal(tds),
                winningsToBank: Parser.parseToTwoDecimal(requestedAmount - winningsToGameBalance - tds),
                withdrawalPlaceAmount: Parser.parseToTwoDecimal(requestedAmount - winningsToGameBalance),
            }
        }
        return withdrawalData;
    }

    static transformGameTransactionForUserTransactionDetails(userWalletTransactions): GameData {
        let buyInValue: number = 0;
        let realBuyInValue: number = 0;
        let playerGameBalance: number = 0;
        let winning: number = 0;
        let discountCredit: number = 0;
        let tournamentDiscountCredit: number = 0;
        userWalletTransactions
            .forEach((transaction) => {
                if (transaction.currencyCode === CURRENCY_CODE.WINNING_SEGMENT) {
                    winning += transaction.transactionAmount;
                }
                if (transaction.currencyCode === CURRENCY_CODE.GAME_SEGMENT) {
                    playerGameBalance += transaction.transactionAmount;
                }
                if (transaction.currencyCode === CURRENCY_CODE.DISCOUNT_CREDIT_SEGMENT) {
                    discountCredit += transaction.transactionAmount;
                }
                if (transaction.currencyCode === CURRENCY_CODE.TOURNAMENT_DISCOUNT_SEGMENT) {
                    tournamentDiscountCredit += transaction.transactionAmount;
                }
            });

        let gameData: GameData;
        if (winning > 0 || playerGameBalance > 0 || tournamentDiscountCredit > 0 || discountCredit > 0) {
            gameData = {
                buyInValue: Parser.parseToTwoDecimal(playerGameBalance + winning + discountCredit + tournamentDiscountCredit),
                realBuyInValue: Parser.parseToTwoDecimal(playerGameBalance + winning),
                playerGameBalance: playerGameBalance,
                winnigs: winning,
                discountCredit: discountCredit,
                tournamentDiscountCredit: tournamentDiscountCredit
            }
        }
        return gameData;
    }

    static transformBenefitDataForUserTransactionDetails(userWalletTransactions): BenefitData {
        let discountCredit: number = 0;
        let tournamentDiscountCredit: number = 0;
        userWalletTransactions
            .forEach((transaction) => {
                if (transaction.currencyCode === CURRENCY_CODE.DISCOUNT_CREDIT_SEGMENT) {
                    discountCredit += transaction.transactionAmount;
                }
                if (transaction.currencyCode === CURRENCY_CODE.TOURNAMENT_DISCOUNT_SEGMENT) {
                    tournamentDiscountCredit += transaction.transactionAmount;
                }
            });

        let benefitData: BenefitData;
        if (discountCredit > 0 || tournamentDiscountCredit > 0) {
            benefitData = {
                discountCredit: discountCredit,
                tournamentDiscountCredit: tournamentDiscountCredit,
            }
        }
        return benefitData;
    }


    static transformTransaction = (transactions: WalletTransaction[], transformationKey: string): WalletTransaction[][] => {
        // Use reduce to aggregate the transactions based on the transformation key
        const transformedTransactions: Map<string, WalletTransaction[]> = transactions.reduce((agg, transaction) => {
            const key = transaction[transformationKey];
            if (!agg.has(key)) {
                agg.set(key, []);
            }
            agg.get(key)!.push(transaction);
            return agg;
        }, new Map<string, WalletTransaction[]>());

        // Return the aggregated transactions as an array
        return Array.from(transformedTransactions.values());
    }

    static transformWalletBalanceResponse(balance: UserWalletBalance): UserWalletBalance {
        const balanceResponse: UserWalletBalance = {
            userId: balance?.userId,
            depositBalance: balance?.depositBalance,
            withdrawalBalance: balance?.withdrawalBalance,
            practiceBalance: balance?.practiceBalance,
            cashGameTicketBalance: balance?.cashGameTicketBalance,
            tournamentTicketBalance: balance?.tournamentTicketBalance,
            lockedCashBalance: balance?.lockedCashBalance,
            releasedLockedCashBalance: balance?.releasedLockedCashBalance,
            currentBalance: balance?.depositBalance + balance?.withdrawalBalance //Total of Deposit + Withdrawal
        }
        return balanceResponse;
    }

    static transformWalletBalanceResponseV2(balance: UserWalletBalanceV2,getAcsDetails: boolean): UserWalletBalanceV2 {
        const balanceResponse: UserWalletBalanceV2 = {
            userId: balance?.userId,
            playerGameBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.playerGameBalance)),
            winningBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.winningBalance)),
            discountCreditBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.discountCreditBalance)),
            tournamentDiscountCreditBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.tournamentDiscountCreditBalance)),
            practiceBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.practiceBalance)),
            lockedDiscountCreditBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.lockedDiscountCreditBalance)),
            currentBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.playerGameBalance + balance?.winningBalance + balance?.discountCreditBalance)),
            totalTournamentBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.playerGameBalance + balance?.winningBalance + balance?.discountCreditBalance + balance?.tournamentDiscountCreditBalance)),
            formattedUserWalletBalance: {
                playerGameBalance: AmountUtil.getAmountWithBeauty(balance?.playerGameBalance, CURRENCY.INR),
                winningBalance: AmountUtil.getAmountWithBeauty(balance?.winningBalance, CURRENCY.INR),
                discountCreditBalance: AmountUtil.getAmountWithBeauty(balance?.discountCreditBalance, CURRENCY.CHIPS),
                tournamentDiscountCreditBalance: AmountUtil.getAmountWithBeauty(balance?.tournamentDiscountCreditBalance, CURRENCY.CHIPS),
                lockedDiscountCreditBalance: AmountUtil.getAmountWithBeauty(balance?.lockedDiscountCreditBalance, CURRENCY.CHIPS),
                currentBalance: AmountUtil.getAmountWithBeauty(balance?.playerGameBalance + balance?.winningBalance + balance?.discountCreditBalance, CURRENCY.CHIPS),
                totalTournamentBalance: AmountUtil.getAmountWithBeauty(balance?.playerGameBalance + balance?.winningBalance + balance?.discountCreditBalance + balance?.tournamentDiscountCreditBalance, CURRENCY.CHIPS)
            }
        }
        if(getAcsDetails)
            balanceResponse.addCashBalance = Number(AmountUtil.getAmountDoubleDecimal(balance?.addCashBalance));
        return balanceResponse;
    }

    static transformWalletDetailsResponse(balance: UserWalletDetails, tournamentTicketsCount: number): UserWalletDetails {
        const balanceResponse: UserWalletDetails = {
            userId: balance?.userId,
            playerGameBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.playerGameBalance)),
            winningBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.winningBalance)),
            discountCreditBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.discountCreditBalance)),
            tournamentDiscountCreditBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.tournamentDiscountCreditBalance)),
            practiceBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.practiceBalance)),
            lockedDiscountCreditBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.lockedDiscountCreditBalance)),
            currentBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.playerGameBalance + balance?.winningBalance + balance?.discountCreditBalance)),
            totalTournamentBalance: Number(AmountUtil.getAmountDoubleDecimal(balance?.playerGameBalance + balance?.winningBalance + balance?.discountCreditBalance + balance?.tournamentDiscountCreditBalance)),
            tournamentTicketCount: tournamentTicketsCount
        }
        return balanceResponse;
    }


    static getWalletTransactionId(orderId:string,transactionType: number):string {
        switch(transactionType){
            case ALL_TRANSACTION_TYPES.ADD_CASH:
                return TRANSACTION_ID_PREFIX.ADDCASH.replace('{orderId}',orderId);
            default:
                return orderId;
        }
    }

    static createRakeTransactionFilter(transactionMethod: string, amountGT?: number, fromDate?: string): WalletTransactionFilter {
        const transactionTypes: number[] = SupernovaUtil.getTransactionTypes(transactionMethod);
        return {transactionTypes, amountGT, fromDate};
    }

    static transforPackDetailsResponse (response: PackDetails[], includePackStatus: CurrencyPackStatus[], isActivePackPossible?: boolean): LockedDcsPackDetails[] {
        const resp: LockedDcsPackDetails[] = [];
        for (let key in Object.keys(response)) {
            const packDetails: PackDetails = response[key];
            const status: number = SupernovaUtil.getPackStatusFromPackDetails(packDetails, Number(key), isActivePackPossible)
            const data: LockedDcsPackDetails = {
                status: status,
                expiryTime: SupernovaUtil.getExpiryTimeOfPack(packDetails?.expiryTime),
                createdAt: new Date(packDetails?.createdAt).getTime(),
                maxBenefitBalance: Parser.parseToTwoDecimal(packDetails?.initBalance ?? 0),
                redeemedBalance: SupernovaUtil.getRedeemedBalanceForLockedDcs(packDetails, status),
                description: (status <= CurrencyPackStatus.UPCOMING)? SupernovaUtil.getLockedDcsPackDescription(packDetails): '',
                completedOn: (status == CurrencyPackStatus.COMPLETED || status == CurrencyPackStatus.RECENTLY_COMPLETED) ? new Date(packDetails?.updatedAt).getTime(): undefined,
            }
            if (includePackStatus && !includePackStatus.includes(data.status)) {
                continue;
            }
            resp.push(data);
        }
        return resp;
    }

    static getRedeemedBalanceForLockedDcs(packDetails: PackDetails, packStatus: number): number {
        let redeemedBalance: number = Parser.parseToTwoDecimal((packDetails?.initBalance ?? 0) - (packDetails?.balance ?? 0));
        const rewardMeta = SupernovaUtil.getLockedDcsRewardMeta(packDetails?.meta);
        const releaseAmount = Parser.parseToTwoDecimal((rewardMeta?.releasePercentage ?? 0) * (packDetails?.initBalance ?? 0) / 100);
        if (releaseAmount !=0 ) {
            redeemedBalance = redeemedBalance - (redeemedBalance % releaseAmount);
        }

        return redeemedBalance;
    }


    static getPackStatusFromPackDetails(packDetails: PackDetails, key?: number, isActivePackPossible?: boolean): CurrencyPackStatus {
        if (new Date(packDetails?.expiryTime).getTime() > Date.now()) {
            if (packDetails?.balance == 0) {
                return CurrencyPackStatus.RECENTLY_COMPLETED;
            }
            return (isActivePackPossible && (key == 0)) ? CurrencyPackStatus.ACTIVE: CurrencyPackStatus.UPCOMING;
        } else  if (packDetails?.balance == 0) {
            return CurrencyPackStatus.COMPLETED;
        } else {
            return CurrencyPackStatus.EXPIRED;
        }
    }

    static getExpiryTimeOfPack(expiryDate: Date): number | undefined {
        const expiryTime: number = new Date(expiryDate).getTime();
        if (expiryTime < NO_EXPIRY_DATE) {
            return expiryTime;
        }
    }

    static getLockedDcsPackDescription(packDetails: PackDetails): string {
        const rewardMeta = SupernovaUtil.getLockedDcsRewardMeta(packDetails?.meta);
        const cycleDcAmount: number = Parser.parseToTwoDecimal((rewardMeta?.releasePercentage ?? 0) * (packDetails?.initBalance ?? 0) / 100);
        const coinNeedToGenerate: number = Parser.parseToTwoDecimal(cycleDcAmount /(COIN_TO_RAKE_CONVERSION * ((rewardMeta?.rakeBackPercentage ?? 1) / 100)));
        return LOCKED_DCS_PACK_DESCRIPTION
          .replace('##DC##', `${cycleDcAmount}`)
          .replace('##COINS##', `${coinNeedToGenerate}`)
    }

    static getLockedDcsRewardMeta(metaData: any): any {
        const meta = (typeof metaData === 'string') ? JSON.parse(metaData ?? '{}') : (metaData ?? {});
        return ((typeof meta?.rewardMetaData === 'string') && meta?.rewardMetaData != "" )? JSON.parse(meta?.rewardMetaData ?? '{}') : (meta?.rewardMetaData ?? {});
    }


    static getRoomMetaDetails(roomConfig: Room): SupernovaRoomMeta {
        return {
            gameVariant: AriesUtil.getAriesGameVariant(roomConfig.gameVariant),
            gameType: roomConfig?.isPractice ? RoomType.PRACTICE : RoomType.CASH,
            smallBlind: CurrencyUtil.getAmountInPaisa(roomConfig?.smallBlindAmount),
            bigBlind: CurrencyUtil.getAmountInPaisa(roomConfig?.bigBlindAmount),
            minBuyIn: CurrencyUtil.getAmountInPaisa(roomConfig?.minBuyInAmount),
            maxBuyIn: CurrencyUtil.getAmountInPaisa(roomConfig?.maxBuyInAmount)
        }
    }

    static getReserveSeatEligibilityRequest(userId: string, vendorId: string, roomInfo: Room, appType: string): SupernovaReserveSeatEligibilityRequest {
        return {
            roomId: Number.parseInt(roomInfo.id),
            userId: Number(userId),
            vendorId: Number.parseInt(vendorId),
            roomMeta: SupernovaUtil.getRoomMetaDetails(roomInfo),
            appType
        }
    }
}
