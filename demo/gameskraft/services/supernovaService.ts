import SupernovaClient from '../clients/supernovaClient';
import { ASC, DESC, EXPIRY_TIME } from '../constants/constants';
import {
    CASH_TRANSACTION_TYPES,
    CURRENCY_CODE,
    DATA_TRANSFORMATION_KEYS,
    TRANSACTION_METHODS,
    WALLET_TYPES
} from '../constants/supernova-constants';
import { CurrencyPackStatus } from '../models/enums/currency-pack-status';
import { MoneyType } from '../models/enums/money-type';
import { TournamentStatus } from '../models/enums/tournament/tournament-status';
import Pagination from '../models/pagination';
import { Room } from '../models/room';
import {
    DepositRequest,
    PackDetailsFilter,
    PlaceWithdrawalRequest,
    PlaceWithdrawalRequestV2,
    RefundOrderRequest,
    ReverseWithdrawalRequest,
    RevertRefundOrderRequest, SupernovaReserveSeatEligibilityRequest,
    TournamentEntryDetailsRequest,
    TournamentEntryDetailsRequestV2,
    UserCreateAccountRequest,
    WalletTransactionFilter
} from '../models/supernova/request';
import {
    Cashbacks,
    CashGameTickets,
    CashGameTicketTransactions,
    TournamentTickets,
    UserTransactionDetails,
    UserTransactionSummary,
    UserWalletBalance,
    WalletTransaction
} from '../models/supernova/response';
import { Tournament } from '../models/tournament';
import DatetimeUtil from '../utils/datetime-util';
import { LobbyUtil } from '../utils/lobby-util';

import LoggerUtil from '../utils/logger';
import SupernovaUtil from '../utils/supernova-util';
import { GsService } from './gsService';
import { TitanService } from './titanService';
import ZodiacService from './zodiacService';

const logger = LoggerUtil.get("SupernovaService");

export default class SupernovaService {

    static async placeWithdrawal(restClient: any, request: PlaceWithdrawalRequest, vendorId: number) {
        logger.info(request, `[placeWithdrawal] placeWithdrawalRequest :: `);
        const response: any = await SupernovaClient.placeWithdrawal(restClient, request, vendorId);
        logger.info(response, `[placeWithdrawal] placeWithdrawalResp :: `);
        return response.data;
    }

    static async placeWithdrawalV2(restClient: any, request: PlaceWithdrawalRequestV2, vendorId: number) {
        logger.info(request, `[placeWithdrawalV2] placeWithdrawalRequest :: `);
        const response: any = await SupernovaClient.placeWithdrawalV2(restClient, request, vendorId);
        logger.info(response, `[placeWithdrawalV2] placeWithdrawalResp :: `);
        return response.data;
    }

    static async createUserAccount(restClient: any, request: UserCreateAccountRequest, vendorId: number) {
        logger.info(`[createUserAccount] for userId ::`);
        const response: any = await SupernovaClient.createUserAccount(restClient, request, vendorId);
        logger.info(response, `[createUserAccount] response`);
        return response;
    }

    static async reverseWithdrawal(restClient: any, request: ReverseWithdrawalRequest, vendorId: number) {
        logger.info(request, `[reverseWithdrawal] reverseWithdrawalRequest :: `);
        const response: any = await SupernovaClient.reverseWithdrawal(restClient, request, vendorId);
        logger.info(response, `[reverseWithdrawal] reverseWithdrawalResp :: `);
        return response;
    }

    static async reverseWithdrawalV2(restClient: any, request: ReverseWithdrawalRequest, vendorId: number) {
        logger.info(request, `[reverseWithdrawalV2] reverseWithdrawalRequest :: `);
        const response: any = await SupernovaClient.reverseWithdrawalV2(restClient, request, vendorId);
        logger.info(response, `[reverseWithdrawalV2] reverseWithdrawalResp :: `);
        return response;
    }

    static async getTdsInformation(restClient: any, userId: string, amount: number, vendorId: number) {
        logger.info(`inside [SupernovaService] [getTdsInformation] for userId :: ${userId} ${amount}`);
        const response: any = await SupernovaClient.getTdsInfo(restClient, userId, amount, vendorId);
        logger.info(response, `inside [SupernovaService] [getTdsInformation] tdsInformation :: `);
        return response;
    }

    static async getTdsFreeWithdrawalDetails(restClient: any, userId: string, vendorId: number) {
        logger.info(`inside [SupernovaService] [getTdsFreeWithdrawalDetails] for userId :: ${userId}`);
        const response: any = await SupernovaClient.getTdsFreeWithdrawalDetails(restClient, userId, vendorId);
        logger.info(response, `inside [SupernovaService] [getTdsFreeWithdrawalDetails] tdsInformation :: `);
        return response;
    }

    static async getBalance(restClient: any, userId: string, token: string, vendorId: number) {
        logger.info(userId, `[SupernovaService] [getBalance] for userId :: `);
        const balances: any = await SupernovaClient.getBalance(restClient, userId, vendorId);
        logger.info(balances, `inside [SupernovaService] [getBalance] balances :: `);
        return SupernovaUtil.transformWalletBalanceResponse(balances);
    }

    static async getBalanceV2(restClient: any, userId: string, token: string, vendorId: number,getAcsDetails: boolean = false) {
        logger.info(userId, `[SupernovaService] [getBalance] for userId :: `);
        const balances: any = await SupernovaClient.getBalanceV2(restClient, userId, vendorId,getAcsDetails);
        logger.info(balances, `inside [SupernovaService] [getBalance] balances :: `);
        return SupernovaUtil.transformWalletBalanceResponseV2(balances,getAcsDetails);
    }


    static async getWalletDetails(restClient: any, userId: string, token: string, vendorId: number,getAcsDetails: boolean = false) {
        logger.info(userId, `[SupernovaService] [getWalletDetails] for userId :: `);
        const balancesPromise: any = SupernovaClient.getBalanceV2(restClient, userId, vendorId,getAcsDetails);
        const tournamentRegisteredByDepositRewardRespPromise: any = SupernovaService.getUserTournamentRegisteredByDepositRewardV2(restClient, userId, token, vendorId);
        const [balances, tournamentRegisteredByDepositRewardResp] = await (Promise as any).allSettled([balancesPromise, tournamentRegisteredByDepositRewardRespPromise]);
        logger.info(balances, `inside [SupernovaService] [getWalletDetails] balances :: `);
        return SupernovaUtil.transformWalletDetailsResponse(balances?.value ?? {}, tournamentRegisteredByDepositRewardResp?.value?.length ?? 0);
    }

    static async getCashTickets(restClient: any, userId: string, pagination: Pagination, vendorId: number) {
        try {
            logger.info(userId, `[SupernovaService] [getCashTickets] for userId :: `);
            const response: CashGameTickets = await SupernovaClient.getCashTickets(restClient, userId, pagination, vendorId);
            logger.info(response, `[SupernovaService] [getCashTickets]  response :: `);
            return SupernovaUtil.transformCashGameTicketsResponse(response.cashGameTickets, response.totalCashGameTicketCount, response.totalCashGameTicketAmount);
        } catch (e) {
            logger.error(e, `[SupernovaService] [getCashTickets] received error :: `);
            throw (e);
        }
    }

    static async getTournamentTickets(restClient: any, userId: string, pagination: Pagination, vendorId: number) {
        try {
            logger.info(userId, `[SupernovaService] [getTournamentTickets] for userId :: `);
            const response: TournamentTickets = await SupernovaClient.getTournamentTickets(restClient, userId, pagination, vendorId);
            logger.info(response, `[SupernovaService] [getTournamentTickets]  response :: `);
            const ticketAmounts = new Set<number>();
            (response.tournamentTickets ?? []).forEach(tournamentTicket => {
                if (tournamentTicket.balance) {
                    ticketAmounts.add(tournamentTicket.balance);
                }
            });
            if (!Array.from(ticketAmounts).length) {
                return {tournamentTickets: [], totalTournamentTicketCount: 0, totalTournamentTicketAmount: 0};
            }
            const tournamentDetails = await ZodiacService.getTicketApplicableTournaments(restClient, Array.from(ticketAmounts));
            logger.info(tournamentDetails, `[SupernovaService] [getTournamentTickets]  tournamentDetails :: `);
            return SupernovaUtil.transformTournamentTicketsResponse(response.tournamentTickets, response.totalTournamentTicketCount, response.totalTournamentTicketAmount, tournamentDetails);
        } catch (e) {
            logger.error(e, `[SupernovaService] [getTournamentTickets] received error :: `);
            throw (e);
        }
    }

    static async getCashTicketTransactions(restClient: any, userId: string, ticketId: string, pagination: Pagination, vendorId: number) {
        try {
            logger.info({UserId: userId, TicketId: ticketId}, `[SupernovaService] [getCashTicketTransactions] `);
            const response: CashGameTicketTransactions = await SupernovaClient.getCashTicketTransactions(restClient, userId, ticketId, pagination, vendorId);
            logger.info(response, `[SupernovaService] [getCashTicketTransactions] response :: `);
            return SupernovaUtil.transformCashGameTicketTransactionResponse(response.transactions);
        } catch (e) {
            logger.error(e, `[SupernovaService] [getCashTicketTransactions] received error :: `);
            throw (e);
        }
    }

    static async getCashbacks(restClient: any, userId: string, status: number, pagination: Pagination, token: string, vendorId: number) {
        try {
            logger.info({UserId: userId, Status: status}, `[SupernovaService] [getCashbacks] `);
            const response: Cashbacks = await SupernovaClient.getCashbacks(restClient, userId, status, pagination, vendorId);
            logger.info(response, `[SupernovaService] [getCashbacks] response :: `);
            return SupernovaUtil.transformCashbackResponse(response.cashbacks);
        } catch (e) {
            logger.error(e, `[SupernovaService] [getCashbacks] received error :: `);
            throw (e);
        }
    }

    static async getWalletTransactions(req: any, userId: string, pagination: Pagination, token: string, vendorId: number) {
        try {
            logger.info(`inside [SupernovaService] [getWalletTransactions] for userId :: ${userId}`);

            const walletTransactionFilter: WalletTransactionFilter = SupernovaUtil.createWalletTransactionFilter(TRANSACTION_METHODS.WALLET, WALLET_TYPES.PRIMARY);
            logger.info(walletTransactionFilter, `Wallet Transaction Filter :: `)

            const walletTransactions: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, pagination, walletTransactionFilter, req.internalRestClient, vendorId);
            logger.info(walletTransactions, `[SupernovaService] [getWalletTransactions] walletTransactions :: `);

            const walletTransactionsResponse: WalletTransaction[][] = SupernovaUtil.transformTransaction(walletTransactions, DATA_TRANSFORMATION_KEYS.TRANSACTION_ID);
            logger.info(walletTransactionsResponse, `[SupernovaService] [getWalletTransactions] walletTransactionsResponse :: `);

            const userTransactionSummary: UserTransactionSummary[] = SupernovaUtil.getUserTransactionSummary(walletTransactionsResponse);
            logger.info(userTransactionSummary, `[SupernovaService] [getWalletTransactions] userTransactionSummary :: `);

            return {transactions: [...userTransactionSummary]};
        } catch (e) {
            logger.error(`[SupernovaService] [getWalletTransactions] received error :: ${(e)}`);
            throw (e);
        }
    }

    static async getWalletLeaderboardTransactions(req: any, userId: string, pagination: Pagination, token: string, vendorId: number) {
        try {
            logger.info(`inside [SupernovaService] [getWalletLeaderboardTransactions] for userId :: ${userId}`);

            const walletTransactionFilter: WalletTransactionFilter = SupernovaUtil.createWalletTransactionFilter(TRANSACTION_METHODS.LEADERBOARD, WALLET_TYPES.PRIMARY);
            logger.info(walletTransactionFilter, `Wallet Transaction Filter :: `)

            const walletTransactions: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, pagination, walletTransactionFilter, req.internalRestClient, vendorId);
            logger.info(walletTransactions, `[SupernovaService] [getWalletLeaderboardTransactions] walletTransactions :: `);

            const walletTransactionsResponse: WalletTransaction[][] = SupernovaUtil.transformTransaction(walletTransactions, DATA_TRANSFORMATION_KEYS.TRANSACTION_ID);
            logger.info(walletTransactionsResponse, `[SupernovaService] [getWalletLeaderboardTransactions] walletTransactionsResponse :: `);

            const userTransactionSummary: UserTransactionSummary[] = SupernovaUtil.getUserTransactionSummary(walletTransactionsResponse);
            logger.info(userTransactionSummary, `[SupernovaService] [getWalletLeaderboardTransactions] userTransactionSummary :: `);

            return {transactions: [...userTransactionSummary]};
        } catch (e) {
            logger.error(`[SupernovaService] [getWalletLeaderboardTransactions] received error :: ${(e)}`);
            throw (e);
        }
    }

    static async getWalletGameplayTransactions(req: any, userId: string, pagination: Pagination, token: string, vendorId: number) {
        try {
            logger.info(userId, `[SupernovaService] [getWalletGameplayTransactions] for userId :: `);
            const walletTransactionFilter: WalletTransactionFilter = SupernovaUtil.createWalletTransactionFilter(TRANSACTION_METHODS.GAMEPLAY, WALLET_TYPES.PRIMARY);

            const gameplayTransactions: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, pagination, walletTransactionFilter, req.internalRestClient, vendorId);
            logger.info(gameplayTransactions, `[SupernovaService] [getWalletGameplayTransactions] userGameplayTransactions :: `);

            const gameplayTransactionsResponse: WalletTransaction[][] = SupernovaUtil.transformTransaction(gameplayTransactions, DATA_TRANSFORMATION_KEYS.TRANSACTION_ID);
            logger.info(gameplayTransactionsResponse, `[SupernovaService] [getWalletGameplayTransactions] gameplayTransactionsResponse :: `);

            const userTransactionSummary: UserTransactionSummary[] = SupernovaUtil.getUserTransactionSummary(gameplayTransactionsResponse);
            logger.info(userTransactionSummary, `[SupernovaService] [getWalletGameplayTransactions] userTransactionSummary :: `);

            return {transactions: [...userTransactionSummary]};
        } catch (e) {
            logger.error(`[SupernovaService] [getWalletGameplayTransactions] received error :: ${(e)}`);
            throw (e);
        }
    }

    static async getWalletTdsTransactions(req: any, userId: string, pagination: Pagination, token: string, vendorId: number) {
        try {
            logger.info(`[SupernovaService] [getWalletTdsTransactions] for userId :: ${userId}`);
            const walletTransactionFilter: WalletTransactionFilter = SupernovaUtil.createWalletTransactionFilter(TRANSACTION_METHODS.TDS, WALLET_TYPES.PRIMARY, [], [], undefined, DatetimeUtil.getStartOfFiscalYear().toISOString());

            const tdsTransactions: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, pagination, walletTransactionFilter, req.internalRestClient, vendorId);
            logger.info(tdsTransactions, `[SupernovaService] [getWalletTdsTransactions] userTdsTransactions :: `);

            const tdsTransactionsResponse: WalletTransaction[][] = SupernovaUtil.transformTransaction(tdsTransactions, DATA_TRANSFORMATION_KEYS.TRANSACTION_ID);
            logger.info(tdsTransactionsResponse, `[SupernovaService] [getWalletTdsTransactions] tdsTransactionsResponse :: `);

            const userTransactionSummary: UserTransactionSummary[] = SupernovaUtil.getUserTransactionSummary(tdsTransactionsResponse);
            logger.info(userTransactionSummary, `[SupernovaService] [getWalletTdsTransactions] userTransactionSummary :: `);

            return {transactions: [...userTransactionSummary]};
        } catch (e) {
            logger.error(`[SupernovaService] [getWalletTdsTransactions] received error :: ${(e)}`);
            throw (e);
        }
    }

    static async getWalletDcsTransactions(req: any, userId: string, pagination: Pagination, token: string, vendorId: number) {
        try {
            logger.info(`[SupernovaService] [getWalletTdsTransactions] for userId :: ${userId}`);
            const walletTransactionFilter: WalletTransactionFilter = SupernovaUtil.createWalletTransactionFilter(TRANSACTION_METHODS.DCS, WALLET_TYPES.PRIMARY, [CURRENCY_CODE.DISCOUNT_CREDIT_SEGMENT], [], 0);

            const dcsTransactions: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, pagination, walletTransactionFilter, req.internalRestClient, vendorId);
            logger.info(dcsTransactions, `[SupernovaService] [getWalletTdsTransactions] userTdsTransactions :: `);

            const dcsTransactionsResponse: WalletTransaction[][] = SupernovaUtil.transformTransaction(dcsTransactions, DATA_TRANSFORMATION_KEYS.TRANSACTION_ID);
            logger.info(dcsTransactionsResponse, `[SupernovaService] [getWalletTdsTransactions] tdsTransactionsResponse :: `);

            const userTransactionSummary: UserTransactionSummary[] = SupernovaUtil.getUserDcsTransactionSummary(dcsTransactionsResponse);
            logger.info(userTransactionSummary, `[SupernovaService] [getWalletTdsTransactions] userTransactionSummary :: `);

            return {transactions: [...userTransactionSummary]};
        } catch (e) {
            logger.error(`[SupernovaService] [getWalletTdsTransactions] received error :: ${(e)}`);
            throw (e);
        }
    }

    static async getWalletTdcTransactions(req: any, userId: string, pagination: Pagination, token: string, vendorId: number) {
        try {
            logger.info(`[SupernovaService] [getWalletTdsTransactions] for userId :: ${userId}`);
            const walletTransactionFilter: WalletTransactionFilter = SupernovaUtil.createWalletTransactionFilter(TRANSACTION_METHODS.TDC, WALLET_TYPES.PRIMARY, [CURRENCY_CODE.TOURNAMENT_DISCOUNT_SEGMENT], [], 0);

            const tdcTransactions: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, pagination, walletTransactionFilter, req.internalRestClient, vendorId);
            logger.info(tdcTransactions, `[SupernovaService] [getWalletTdsTransactions] userTdsTransactions :: `);

            const tdcTransactionsResponse: WalletTransaction[][] = SupernovaUtil.transformTransaction(tdcTransactions, DATA_TRANSFORMATION_KEYS.TRANSACTION_ID);
            logger.info(tdcTransactionsResponse, `[SupernovaService] [getWalletTdsTransactions] tdsTransactionsResponse :: `);

            const userTransactionSummary: UserTransactionSummary[] = SupernovaUtil.getUserTdcTransactionSummary(tdcTransactionsResponse);
            logger.info(userTransactionSummary, `[SupernovaService] [getWalletTdsTransactions] userTransactionSummary :: `);

            return {transactions: [...userTransactionSummary]};
        } catch (e) {
            logger.error(`[SupernovaService] [getWalletTdsTransactions] received error :: ${(e)}`);
            throw (e);
        }
    }


    static async getWalletTransaction(req: any, userId: string, transactionId: string, token: string, vendorId: number) {
        try {
            logger.info(`[SupernovaService] [getWalletTransaction] for userId :: ${userId}`);
            const walletTransactionFilter: WalletTransactionFilter = SupernovaUtil.createWalletTransactionFilter(TRANSACTION_METHODS.ALL, WALLET_TYPES.PRIMARY, [], [transactionId]);

            const transactions: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, Pagination.getDefaultCategoriesPagination(), walletTransactionFilter, req.internalRestClient, vendorId);
            logger.info(transactions, `[SupernovaService] [getWalletTransaction] transactions :: `);


            if (transactions.length < 1) {
                return {};
            }

            if (transactions[0]?.transactionType == `${CASH_TRANSACTION_TYPES.ADD_CASH}`) {
                const rewardTransactionFilter: WalletTransactionFilter = SupernovaUtil.createWalletTransactionFilter(TRANSACTION_METHODS.NONE, WALLET_TYPES.PRIMARY, [], null, null, null, transactions[0]?.meta?.payinOrderId ?? '');
                const rewardTransactions: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, Pagination.getDefaultCategoriesPagination(), rewardTransactionFilter, req.internalRestClient, vendorId);
                transactions.push(...rewardTransactions);
            }
            const userTransactionDetails: UserTransactionDetails = SupernovaUtil.getUserTransactionDetails(transactions);
            logger.info(userTransactionDetails, `[SupernovaService] [getWalletTransaction] userTransactionDetails :: `);

            return userTransactionDetails;
        } catch (e) {
            logger.error(`[SupernovaService] [getWalletTdsTransactions] received error :: ${(e)}`);
            throw (e);
        }
    }


    static async getWalletLeaderboardTransaction(req: any, userId: string, transactionId: string, token: string, vendorId: number) {
        try {
            logger.info(`[SupernovaService] [getWalletLeaderboardTransaction] for userId :: ${userId}`);
            const walletTransactionFilter: WalletTransactionFilter = SupernovaUtil.createWalletTransactionFilter(TRANSACTION_METHODS.ALL, WALLET_TYPES.PRIMARY, [], [transactionId]);

            const transactions: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, Pagination.getDefaultCategoriesPagination(), walletTransactionFilter, req.internalRestClient, vendorId);
            logger.info(transactions, `[SupernovaService] [getWalletLeaderboardTransaction] transactions :: `);


            if (transactions.length < 1) {
                return {};
            }

            if (transactions[0]?.transactionType == `${CASH_TRANSACTION_TYPES.ADD_CASH}`) {
                const rewardTransactionFilter: WalletTransactionFilter = SupernovaUtil.createWalletTransactionFilter(TRANSACTION_METHODS.NONE, WALLET_TYPES.PRIMARY, [], null, null, null, transactions[0]?.meta?.payinOrderId ?? '');
                const rewardTransactions: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, Pagination.getDefaultCategoriesPagination(), rewardTransactionFilter, req.internalRestClient, vendorId);
                transactions.push(...rewardTransactions);
            }
            const userTransactionDetails: UserTransactionDetails = SupernovaUtil.getUserTransactionDetails(transactions);
            logger.info(userTransactionDetails, `[SupernovaService] [getWalletLeaderboardTransaction] userTransactionDetails :: `);

            return userTransactionDetails;
        } catch (e) {
            logger.error(`[SupernovaService] [getWalletLeaderboardTransaction] received error :: ${(e)}`);
            throw (e);
        }
    }

    static async getDcsWalletTransaction(req: any, userId: string, transactionId: string, token: string, vendorId: number) {
        try {
            logger.info(`[SupernovaService] [getDcsWalletTransaction] for userId :: ${userId}`);
            const walletTransactionFilter: WalletTransactionFilter = SupernovaUtil.createWalletTransactionFilter(TRANSACTION_METHODS.ALL, WALLET_TYPES.PRIMARY, [], [transactionId]);

            const transactions: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, Pagination.getDefaultCategoriesPagination(), walletTransactionFilter, req.internalRestClient, vendorId);
            logger.info(transactions, `[SupernovaService] [getDcsWalletTransaction] transactions :: `);

            if (transactions.length < 1) {
                return {};
            }
            const userTransactionDetails: UserTransactionDetails = SupernovaUtil.getUserDcsTransactionDetails(transactions);
            logger.info(userTransactionDetails, `[SupernovaService] [getDcsWalletTransaction] userTransactionDetails :: `);

            return userTransactionDetails;
        } catch (e) {
            logger.error(`[SupernovaService] [getDcsWalletTransaction] received error :: ${(e)}`);
            throw (e);
        }
    }

    static async getTdcWalletTransaction(req: any, userId: string, transactionId: string, token: string, vendorId: number) {
        try {
            logger.info(`[SupernovaService] [getTdcWalletTransaction] for userId :: ${userId}`);
            const walletTransactionFilter: WalletTransactionFilter = SupernovaUtil.createWalletTransactionFilter(TRANSACTION_METHODS.ALL, WALLET_TYPES.PRIMARY, [], [transactionId]);

            const transactions: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, Pagination.getDefault(), walletTransactionFilter, req.internalRestClient, vendorId);
            logger.info(transactions, `[SupernovaService] [getTdcWalletTransaction] transactions :: `);

            if (transactions.length < 1) {
                return {};
            }
            const userTransactionDetails: UserTransactionDetails = SupernovaUtil.getUserTdcTransactionDetails(transactions);
            logger.info(userTransactionDetails, `[SupernovaService] [getTdcWalletTransaction] userTransactionDetails :: `);

            return userTransactionDetails;
        } catch (e) {
            logger.error(`[SupernovaService] [getTdcWalletTransaction] received error :: ${(e)}`);
            throw (e);
        }
    }

    static async getTdsWalletTransaction(req: any, userId: string, transactionId: string, token: string, vendorId: number) {
        try {
            logger.info(`[SupernovaService] [getTdsWalletTransaction] for userId :: ${userId}`);
            const walletTransactionFilter: WalletTransactionFilter = SupernovaUtil.createWalletTransactionFilter(TRANSACTION_METHODS.TDS, WALLET_TYPES.PRIMARY, [], [transactionId], undefined, DatetimeUtil.getStartOfFiscalYear().toISOString());

            const transactions: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, Pagination.getDefault(), walletTransactionFilter, req.internalRestClient, vendorId);
            logger.info(transactions, `[SupernovaService] [getTdsWalletTransaction] transactions :: `);

            if (transactions.length < 1) {
                return {};
            }
            const userTransactionDetails: UserTransactionDetails = SupernovaUtil.getUserTransactionDetails(transactions);
            logger.info(userTransactionDetails, `[SupernovaService] [getTdsWalletTransaction] userTransactionDetails :: `);

            return userTransactionDetails;
        } catch (e) {
            logger.error(`[SupernovaService] [getTdsWalletTransaction] received error :: ${(e)}`);
            throw (e);
        }
    }

    static async processUserDeposit(userId: string, depositAmount: number, payinOrderId: string, promoCode: string, restClient: any, vendorId: number) {
        try {
            logger.info({
                UserId: userId,
                DepositAmount: depositAmount,
                PayinOrderId: payinOrderId,
                promoCode
            }, `[SupernovaService] [processUserDeposit] `);
            const requestId: string = restClient.getRequestId();
            const request: DepositRequest = {userId, depositAmount, payinOrderId, requestId, promoCode};
            logger.info(request, `[SupernovaService] [processUserDeposit] userDepositRequest :: `);
            const response: any = SupernovaClient.processUserDeposit(request, restClient, vendorId);
            logger.info(response, `[SupernovaService] [processUserDeposit] userDepositResponse ::`);
            return response;
        } catch (e) {
            logger.error(`[SupernovaService] [processUserDeposit] received error :: ${(e)}`);
            throw (e);
        }
    }

    static async getUserWalletBalance(userId: string, restClient: any, vendorId: number): Promise<UserWalletBalance> {
        logger.info(`inside [SupernovaService] [getUserWalletBalance] for userId :: ${userId}`);
        const response: any = SupernovaClient.getUserWalletBalance(userId, restClient, vendorId);
        logger.info(response, `[SupernovaService] [getUserWalletBalance] userWalletBalance :: `);
        return response;
    }

    static async getUserRefundTdsDetails(userId: string, request: RefundOrderRequest, restClient: any, vendorId: number) {
        logger.info(request, `[SupernovaService] [getUserRefundTdsDetails] for User Refund TDS Request :: `);
        const response: any = await SupernovaClient.getUserRefundTdsDetails(userId, request, restClient, vendorId);
        logger.info(response, `[SupernovaService] [getUserRefundTdsDetails] userRefundTdsDetails :: `);
        return response;
    }

    static async refundCash(userRefund: any, restClient: any, vendorId: number) {
        logger.info(userRefund, `[SupernovaService] [refundCash] for userRefund :: `);
        const response: any = SupernovaClient.refundCash(userRefund, restClient, vendorId);
        logger.info(response, `inside [SupernovaService] [refundCash] userRefundDetails :: `);
        return response;
    }

    static async revertUserRefund(request: RevertRefundOrderRequest, restClient: any, vendorId: number) {
        logger.info(request, `[SupernovaService] [revertUserRefund] for RevertRefundOrderRequest :: `);
        const response: any = SupernovaClient.revertUserRefund(request, restClient, vendorId);
        logger.info(response, `[SupernovaService] [revertUserRefund] revertedOrder :: `);
        return response;
    }

    static async getTournamentEntryDetails(restClient: any, userId: number, request: TournamentEntryDetailsRequest, vendorId: number) {
        logger.info(request, `[SupernovaService] [getTournamentEntryDetails] for TournamentEntryDetailsRequest :: `);
        const response: any = await SupernovaClient.getTournamentEntryDetails(restClient, userId, request, vendorId);
        logger.info(response, `[SupernovaService] [getTournamentEntryDetails] response :: `);
        return response;
    }

    static async getTournamentEntryDetailsV2(restClient: any, userId: number, request: TournamentEntryDetailsRequest, vendorId: number) {
        logger.info(request, `[SupernovaService] [getTournamentEntryDetails] for TournamentEntryDetailsRequest :: `);
        const response: any = await SupernovaClient.getTournamentEntryDetailsV2(restClient, userId, request, vendorId);
        logger.info(response, `[SupernovaService] [getTournamentEntryDetails] response :: `);
        return response;
    }

    static async getTournamentEntryDetailsV3(restClient: any, userId: number, request: TournamentEntryDetailsRequestV2, vendorId: number) {
        logger.info(request, `[SupernovaService] [getTournamentEntryDetailsV3] for TournamentEntryDetailsRequest :: `);
        const response: any = await SupernovaClient.getTournamentEntryDetailsV3(restClient, userId, request, vendorId);
        logger.info(response, `[SupernovaService] [getTournamentEntryDetailsV3] response :: `);
        return response;
    }

    static async getCashGameBuyInDetails(restClient: any, userId: number, request: any, vendorId: number) {
        logger.info(request, `[SupernovaService] [getTournamentEntryDetails] for TournamentEntryDetailsRequest :: `);
        const response: any = await SupernovaClient.getCashGameBuyInDetails(restClient, userId, request, vendorId);
        logger.info(response, `[SupernovaService] [getTournamentEntryDetails] response :: `);
        return response;
    }

    static async getHandDebitRakeTransaction(req: any, userId: string, vendorId: number) {
        try {
            logger.info(`[SupernovaService] [getHandDebitRakeTransaction] for userId :: ${userId}`);
            const rakeTransactionFilter: WalletTransactionFilter = SupernovaUtil.createRakeTransactionFilter(TRANSACTION_METHODS.DEBIT_RAKE,0,new Date('2020-01-01T00:00:00.000Z').toISOString());

            const transactions: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, Pagination.getDefaultCategoriesPagination(), rakeTransactionFilter, req.internalRestClient, vendorId);
            logger.info(transactions, `[SupernovaService] [getHandDebitRakeTransaction] transactions :: `);

            return transactions;
        } catch (e) {
            logger.error(`[SupernovaService] [getHandDebitRakeTransaction] received error :: ${(e)}`);
            throw (e);
        }
    }

    static async getWalletTransactionsFromReferenceId(userId: string, pagination: Pagination, walletTransactionFilter: WalletTransactionFilter, restClient: any, vendorId: number) {
        try {
         const walletTransactionDetails: WalletTransaction[] = await SupernovaClient.getWalletTransactions(userId, Pagination.getDefaultCategoriesPagination(), walletTransactionFilter, restClient, vendorId);
         return walletTransactionDetails;
         }catch(e){
             logger.error(e);
             throw(e);
         }
     }
    static async getUserTournamentRegisteredByDepositReward(restClient: any, userId: string, token: string, vendorId: number) {
        try {
            logger.info(`[SupernovaService] [getUserTournamentRegisteredByDepositReward] for userId :: ${userId}`);
            const tournaments: Tournament[] = await GsService.getMTTListV2(restClient, token, `${vendorId}`);
            const tournamentIds: string[] = tournaments.filter((tournament: Tournament) => {
                return (((tournament?.tournamentStatus ?? 0) < TournamentStatus.RUNNING) && (tournament?.tournamentConfig?.buyInConfig?.type ?? [])?.includes(MoneyType.AUTO_REGISTER))
            }).map((tournament: Tournament) => tournament?.id ?? '');
            const response: any = await SupernovaClient.getUserTournamentRegisteredThroughDepositReward(userId, Pagination.getDefaultCategoriesPagination(), tournamentIds, restClient, vendorId);
            return tournaments.filter((tournament: Tournament) => (response?.tournamentIds ?? []).includes(tournament?.id ?? '')).map((tournament: Tournament) => LobbyUtil.getTournamentResponseV2(tournament));
        } catch (e) {
            logger.error(`[SupernovaService] [getUserTournamentRegisteredByDepositReward] received error :: ${(e)}`);
            throw (e);
        }
    }

    static async getUserTournamentRegisteredByDepositRewardV2(restClient: any, userId: string, token: string, vendorId: number) {
        try {
            logger.info(`[SupernovaService] [getUserTournamentRegisteredByDepositRewardV2] for userId :: ${userId}`);
            const gsTournamentsPromise = GsService.getMTTListV2(restClient, token, `${vendorId}`);
            const ariesTournamentPromise = TitanService.getTournaments(restClient, vendorId);
            const [gsTournaments, ariesTournaments] = await (Promise as any).allSettled([gsTournamentsPromise, ariesTournamentPromise]);
            const allToutnaments: Tournament[] = [...gsTournaments?.value, ...ariesTournaments?.value];
            const tournamentIds: string[] = allToutnaments
              .filter((tournament: Tournament) => {
                        return (((tournament?.tournamentStatus ?? 0) < TournamentStatus.RUNNING) )})
              .map((tournament: Tournament) => tournament?.id ?? '');
            const response: any = await SupernovaClient.getUserTournamentRegisteredThroughDepositReward(userId, Pagination.getDefaultCategoriesPagination(), tournamentIds, restClient, vendorId);
            return allToutnaments.filter((tournament: Tournament) => (response?.tournamentIds ?? []).includes(tournament?.id ?? '')).map((tournament: Tournament) => LobbyUtil.getTournamentResponseV2(tournament));
        } catch (e) {
            logger.error(`[SupernovaService] [getUserTournamentRegisteredByDepositRewardV2] received error :: ${(e)}`);
            throw (e);
        }
    }

    static async checkUserCanUnregisterTheTournament(restClient: any, userId: string, vendorId: number, tournamentId: string) {
        try {
            logger.info(`[SupernovaService] [checkUserCanUnregisterTheTournament] for userId :: ${userId}`);
            return await SupernovaClient.checkUserCanUnregisterTheTournament(userId, tournamentId, restClient, vendorId);
        } catch (e) {
            logger.error(`[SupernovaService] [checkUserCanUnregisterTheTournament] received error :: ${(e)}`);
            throw (e);
        }
    }


    static async getUserLockedDcsPackDetails(restClient: any, userId: string, packStatus: number, pagination: Pagination, vendorId: number) {
        try {
            if (packStatus == CurrencyPackStatus.ALL) {

                const packDetailsFilter: PackDetailsFilter = SupernovaUtil.creatPackDetailsFilter(CurrencyPackStatus.EXPIRED, [CURRENCY_CODE.LOCKED_DCS], EXPIRY_TIME, DESC, false);
                const expiredPackResponse: any = await SupernovaClient.getUserPackDetails(userId, packDetailsFilter, pagination, restClient, vendorId);

                const packDetailsFilter2: PackDetailsFilter = SupernovaUtil.creatPackDetailsFilter(CurrencyPackStatus.RECENTLY_COMPLETED, [CURRENCY_CODE.LOCKED_DCS], EXPIRY_TIME, ASC, false);
                const recentlyCompletedResponse: any = await SupernovaClient.getUserPackDetails(userId, packDetailsFilter2, pagination, restClient, vendorId);

                const packDetailsFilter3: PackDetailsFilter = SupernovaUtil.creatPackDetailsFilter(CurrencyPackStatus.UPCOMING, [CURRENCY_CODE.LOCKED_DCS], EXPIRY_TIME, ASC, true);
                pagination.numOfRecords += 1;
                const activePackResponse: any = await SupernovaClient.getUserPackDetails(userId, packDetailsFilter3, pagination, restClient, vendorId);
                return {
                    activePacks: SupernovaUtil.transforPackDetailsResponse(activePackResponse?.currencyPacks?.list ?? {}, [CurrencyPackStatus.ACTIVE], true),
                    upcomingPacks: SupernovaUtil.transforPackDetailsResponse(activePackResponse?.currencyPacks?.list ?? {}, [CurrencyPackStatus.UPCOMING], true),
                    recentlyCompletedPacks: SupernovaUtil.transforPackDetailsResponse(recentlyCompletedResponse?.currencyPacks?.list ?? {}, [CurrencyPackStatus.RECENTLY_COMPLETED], false),
                    inactivePacks: SupernovaUtil.transforPackDetailsResponse(expiredPackResponse?.currencyPacks?.list ?? {}, [CurrencyPackStatus.EXPIRED, CurrencyPackStatus.COMPLETED], false),
                }

            } else {

                let isActivePackPossible: boolean = ((packStatus == CurrencyPackStatus.UPCOMING) && (pagination.offset == 0));
                let excludeZeroPacks: boolean = false;
                if (packStatus == CurrencyPackStatus.UPCOMING) {
                    excludeZeroPacks = true;
                    pagination.numOfRecords += 1;
                }
                const packDetailsFilter: PackDetailsFilter = SupernovaUtil.creatPackDetailsFilter(packStatus, [CURRENCY_CODE.LOCKED_DCS], EXPIRY_TIME, (packStatus > CurrencyPackStatus.RECENTLY_COMPLETED) ? DESC: ASC, excludeZeroPacks);
                const response: any = await SupernovaClient.getUserPackDetails(userId, packDetailsFilter, pagination, restClient, vendorId);
                return {
                    activePacks: (packStatus == CurrencyPackStatus.ACTIVE) ? SupernovaUtil.transforPackDetailsResponse(response?.currencyPacks?.list ?? {}, [CurrencyPackStatus.ACTIVE], isActivePackPossible): [],
                    upcomingPacks: (packStatus == CurrencyPackStatus.UPCOMING)? SupernovaUtil.transforPackDetailsResponse(response?.currencyPacks?.list ?? {}, [CurrencyPackStatus.UPCOMING], isActivePackPossible): [],
                    recentlyCompletedPacks: (packStatus == CurrencyPackStatus.RECENTLY_COMPLETED) ? SupernovaUtil.transforPackDetailsResponse(response?.currencyPacks?.list ?? {}, [CurrencyPackStatus.RECENTLY_COMPLETED], isActivePackPossible): [],
                    inactivePacks: (packStatus >= CurrencyPackStatus.COMPLETED) ? SupernovaUtil.transforPackDetailsResponse(response?.currencyPacks?.list ?? {}, [CurrencyPackStatus.EXPIRED, CurrencyPackStatus.COMPLETED], isActivePackPossible): [],
                }
            }
        } catch (e) {
            logger.error(`[SupernovaService] [getUserTournamentRegisteredByDepositReward] received error :: ${(e)}`);
            throw (e);
        }
    }

    static async reserveSeatEligibility(restClient: any, userId: string, vendorId: string, roomInfo: Room, appType: string): Promise<any> {
        try {
            const reserveSeatEligibilityRequest: SupernovaReserveSeatEligibilityRequest = SupernovaUtil.getReserveSeatEligibilityRequest(userId, vendorId, roomInfo, appType);
            logger.info(reserveSeatEligibilityRequest, `[SupernovaService] [reserveSeatEligiBility] reserveSeatEligibilityRequest :: `);
            if (roomInfo.isPractice) {
                await SupernovaClient.reservePracticeSeatEligiBility(restClient, reserveSeatEligibilityRequest);
            } else {
                await SupernovaClient.reserveCashSeatEligiBility(restClient, reserveSeatEligibilityRequest);
            }
        } catch (e) {
            logger.error(`[SupernovaService] [reserveRoomEligiBility] received error :: ${(e)}`);
            throw (e);
        }
    }
};
