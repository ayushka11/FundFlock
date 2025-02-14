import SupernovaServiceError from "../errors/supernova/supernova-error";
import SupernovaServiceErrorUtil from "../errors/supernova/supernova-error-util";
import RequestUtil from "../helpers/request-util";
import Pagination from "../models/pagination";
import QueryParam from "../models/query-param";
import {
    DepositRequest,
    DepositRequestV2, PackDetailsFilter,
    PlaceWithdrawalRequestV2,
    RefundOrderRequest,
    RefundOrderRequestV2,
    ReverseWithdrawalRequest,
    RevertPayinRefundRequest,
    RevertRefundOrderRequest, SupernovaReserveSeatEligibilityRequest,
    TournamentEntryDetailsRequest,
    TournamentEntryDetailsRequestV2,
    UserCreateAccountRequest,
    UserCreditPracticeChipsRequest,
    WalletAndTdsMigrationRequest,
    WalletTransactionFilter
} from '../models/supernova/request';
import { Tournament } from '../models/tournament';
import {getSupernovaServiceBaseUrl} from "../services/configService";
import LoggerUtil, {ILogger} from '../utils/logger';
import {SupernovaClientLatencyDecorator} from "../utils/monitoring/client-latency-decorator";
import BaseClient from "./baseClient";
import {CASH_TRANSACTION_TYPES, TICKET_TYPES, WALLET_TYPES} from "../constants/supernova-constants";
import {TournamentEntryDetailsResponse} from "../models/supernova/response";

const logger: ILogger = LoggerUtil.get("SupernovaClient");

export default class SupernovaClient {

    private static urls = {
        // Payout Supernova Contract
        getTDSInfo: '/v1/user/##USER_ID##/withdrawal/tds/details',
        placeWithdrawal: '/v1/account/withdraw',
        reverseWithdrawal: '/v1/account/withdraw/reverse',
        placeWithdrawalV2: '/v2/account/withdraw',
        reverseWithdrawalV2: '/v2/account/withdraw/reverse',
        getBalance: '/v1/account/##USER_ID##/balance',
        getBalanceV2: '/v2/account/##USER_ID##/balance',
        getCashTickets: '/v1/user/##USER_ID##/game/cash/tickets',
        getCashTicketTransactions: '/v1/user/##USER_ID##/statement',
        getTournamentTickets: '/v1/user/##USER_ID##/game/tournament/tickets',
        getWalletTransactions: '/v1/user/##USER_ID##/statement',
        createUserAccount: '/v1/account',
        processUserDeposit: '/v1/account/deposit',
        getUserWalletBalance: '/v1/account/##USER_ID##/balance',
        getUserRefundTdsDetails: '/v1/user/##USER_ID##/refund/tds/details',
        getUserRefundTdsDetailsV2: '/v1/user/##USER_ID##/refund/tds/details',
        refundCash: '/v1/account/refund',
        refundCashV2: '/v2/account/refund',
        revertUserRefund: '/v1/account/refund/reverse',
        getTournamentEntryDetails: '/v1/b2b/game/tournament/user/##USER_ID##/entry/details',
        getTournamentEntryDetailsV2: '/v2/b2b/game/tournament/user/##USER_ID##/entry/details',
        getTournamentEntryDetailsV3: '/v1/game/tournament/user/##USER_ID##/entry/details',
        getCashGameBuyInDetails: '/v2/b2b/game/cash/user/##USER_ID##/buy-in/details',
        getCashbacks: '/v1/user/##USER_ID##/reward/cashbacks',
        processUserDepositV2: '/v2/account/deposit',
        getUserWalletBalanceV2: '/v2/account/##USER_ID##/balance',
        getTdsFreeWithdrawalDetails: '/v1/user/##USER_ID##/withdrawal/tds/free/amount',
        userMigrationApi: '/v1/migration/wallet-tds',
        revertUserRefundV2: 'v2/account/refund/reverse',
        creditPracticeChips: '/v2/account/credit/practicechips',
        userTournamentsRegisteredThroughDepositReward: '/v2/b2b/##USER_ID##/tournament/details/registerThroughDepositReward',
        checkUserCanUnregisterTournamanet: '/v2/b2b/##USER_ID##/check/unregister/tournament/##TOURNAMENT_ID##',
        packDetails: '/v1/account/##USER_ID##/pack/details',
        reserveCashSeatEligibility: '/v1/game/cash/room/eligibility',
        reservePracticeSeatEligibility: '/v1/game/practice/room/eligibility',
    };

    @SupernovaClientLatencyDecorator
    static async placeWithdrawal(
        restClient: any,
        request: PlaceWithdrawalRequestV2,
        vendorId: number
    ): Promise<any> {
        try {
            logger.info(request, `[SupernovaClient] [placeWithdrawal] request :: `);
            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.placeWithdrawal);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [placeWithdrawal] `);
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [placeWithdrawal] response :: `);
            return response;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async placeWithdrawalV2(
        restClient: any,
        request: PlaceWithdrawalRequestV2,
        vendorId: number
    ): Promise<any> {
        try {
            logger.info(request, `[SupernovaClient] [placeWithdrawalV2] request :: `);
            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.placeWithdrawalV2);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [placeWithdrawalV2] `);
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [placeWithdrawalV2] response :: `);
            return response;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async createUserAccount(
        restClient: any,
        request: UserCreateAccountRequest,
        vendorId: number
    ): Promise<any> {
        try {
            logger.info(request, `[SupernovaClient] [createUserAccount] request :: `);
            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.createUserAccount);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [createUserAccount] `);
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [createUserAccount] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async creditPracticeChipsV2(
        restClient: any,
        request: UserCreditPracticeChipsRequest,
        vendorId: number
    ): Promise<any> {
        try {
            logger.info(request, `[SupernovaClient] [creditPracticeChipsV2] request :: `);
            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.creditPracticeChips);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [creditPracticeChipsV2] `);
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [creditPracticeChipsV2] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async reverseWithdrawal(
        restClient: any,
        request: ReverseWithdrawalRequest,
        vendorId: number
    ): Promise<any> {
        try {
            logger.info(`[SupernovaClient] [reverseWithdrawal] request :: ${JSON.stringify(request || {})}`);
            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.reverseWithdrawal);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [reverseWithdrawal] `);
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [reverseWithdrawal] response :: `);
            return response;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async reverseWithdrawalV2(
        restClient: any,
        request: ReverseWithdrawalRequest,
        vendorId: number
    ): Promise<any> {
        try {
            logger.info(`[SupernovaClient] [reverseWithdrawalV2] request :: ${JSON.stringify(request || {})}`);
            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.reverseWithdrawalV2);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [reverseWithdrawalV2] `);
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [reverseWithdrawalV2] response :: `);
            return response;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getTdsInfo(restClient: any, userId: string, withdrawalAmount: number, vendorId: number): Promise<any> {
        try {
            logger.info({UserId: userId, WithdrawalAmount: withdrawalAmount}, `[SupernovaClient] [getTDSInfo] `);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "userId", value: userId});
            queryParams.push({param: "withdrawalAmount", value: withdrawalAmount});
            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.getTDSInfo.replace(/##USER_ID##/g, `${userId}`), queryParams);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [getTdsInfo] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[SupernovaClient] [getTdsInfo] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async processUserDeposit(request: DepositRequest, restClient: any, vendorId: number): Promise<any> {
        try {
            logger.info(request, `[SupernovaClient] [processUserDeposit] User Deposit Request `);
            const url: string = SupernovaClient.getCompleteUrl(SupernovaClient.urls.processUserDeposit);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [processUserDeposit] `);
            const response: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [processUserDeposit] response :: `);
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    static async getTdsFreeWithdrawalDetails(restClient: any, userId: string, vendorId: number): Promise<any> {
        try {
            logger.info({UserId: userId,}, `[SupernovaClient] [getTdsFreeWithdrawalAmount] `);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "userId", value: userId});
            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.getTdsFreeWithdrawalDetails.replace(/##USER_ID##/g, `${userId}`), queryParams);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [getTdsFreeWithdrawalAmount] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[SupernovaClient] [getTdsFreeWithdrawalAmount] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async processUserDepositV2(request: DepositRequestV2, restClient: any, vendorId: number): Promise<any> {
        try {
            logger.info(request, `[SupernovaClient] [processUserDepositV2] User Deposit Request `);
            const url: string = SupernovaClient.getCompleteUrl(SupernovaClient.urls.processUserDepositV2);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [processUserDepositV2] `);
            const response: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [processUserDepositV2] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getUserWalletBalance(userId: string, restClient: any, vendorId: number): Promise<any> {
        try {
            logger.info(userId, `[SupernovaClient1] [getUserWalletBalance] userId :: `);
            const url: string = SupernovaClient.getCompleteUrl(SupernovaClient.urls.getUserWalletBalance.replace(/##USER_ID##/g, userId));
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [getUserWalletBalance] `);
            const response: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[SupernovaClient] [getUserWalletBalance] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getUserWalletBalanceV2(userId: string, restClient: any, vendorId: number): Promise<any> {
        try {
            logger.info(userId, `[SupernovaClient1] [getUserWalletBalanceV2] userId :: `);
            const url: string = SupernovaClient.getCompleteUrl(SupernovaClient.urls.getUserWalletBalanceV2.replace(/##USER_ID##/g, userId));
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [getUserWalletBalanceV2] `);
            const response: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[SupernovaClient] [getUserWalletBalanceV2] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getUserRefundTdsDetails(userId: string, request: RefundOrderRequest, restClient: any, vendorId: number): Promise<any> {
        try {
            logger.info({
                UserId: userId,
                UserRefundTDSRequest: request
            }, `[SupernovaClient1] [getUserRefundTdsDetails] `);
            const url: string = SupernovaClient.getCompleteUrl(SupernovaClient.urls.getUserRefundTdsDetails.replace(/##USER_ID##/g, userId));
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [getUserRefundTdsDetails] `);
            const response: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, null, request);
            logger.info(response, `[SupernovaClient] [getUserRefundTdsDetails] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getUserRefundTdsDetailsV2(userId: string, request: RefundOrderRequestV2, vendorId: number,restClient: any,timeout?: number ): Promise<any> {
        try {
            logger.info({
                UserId: userId,
                UserRefundTDSRequest: request
            }, `[SupernovaClient1] [getUserRefundTdsDetailsV2] `);
            const url: string = SupernovaClient.getCompleteUrl(SupernovaClient.urls.getUserRefundTdsDetailsV2.replace(/##USER_ID##/g, userId));
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [getUserRefundTdsDetailsV2] `);
            const response: any = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, timeout, request);
            logger.info(response, `[SupernovaClient] [getUserRefundTdsDetailsV2] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async refundCash(request: any, restClient: any, vendorId: number): Promise<any> {
        try {
            logger.info(request, `[SupernovaClient1] [refundCash] Refund Cash Request `);
            const url: string = SupernovaClient.getCompleteUrl(SupernovaClient.urls.refundCash);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [refundCash] `);
            const response: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [refundCash] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async refundCashV2(request: any, restClient: any, vendorId: number): Promise<any> {
        try {
            logger.info(request, `[SupernovaClient1] [refundCashV2] Refund Cash Request `);
            const url: string = SupernovaClient.getCompleteUrl(SupernovaClient.urls.refundCashV2);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [refundCashV2] `);
            const response: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [refundCashV2] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async revertUserRefundV2(request: RevertPayinRefundRequest, restClient: any, vendorId: number): Promise<any> {
        try {
            logger.info(request, `[SupernovaClient1] [revertUserRefundV2] RevertRefundOrderRequest  `);
            const url: string = SupernovaClient.getCompleteUrl(SupernovaClient.urls.revertUserRefundV2);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [revertUserRefundV2] `);
            const response: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [revertUserRefundV2] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async revertUserRefund(request: RevertRefundOrderRequest, restClient: any, vendorId: number): Promise<any> {
        try {
            logger.info(request, `[SupernovaClient1] [revertUserRefund] RevertRefundOrderRequest  `);
            const url: string = SupernovaClient.getCompleteUrl(SupernovaClient.urls.revertUserRefund);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [revertUserRefund] `);
            const response: any = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [revertUserRefund] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getBalance(restClient: any, userId: string, vendorId: number): Promise<any> {
        try {
            logger.info(userId, `[SupernovaClient] [getBalance] userId :: `);
            const url = SupernovaClient.getCompleteUrl(
                SupernovaClient.urls.getBalance.replace(/##USER_ID##/g, `${userId}`));
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);

            logger.info({url: url, headers: headers}, `[SupernovaClient] [getBalance] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[SupernovaClient] [getBalance] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getBalanceV2(restClient: any, userId: string, vendorId: number,getAcsDetails: boolean = false): Promise<any> {
        try {
            logger.info(userId, `[SupernovaClient] [getBalance] userId :: `);
            const queryParams: QueryParam[] = [];
            if(getAcsDetails){
                queryParams.push({param:'showAddCashBalance',value:getAcsDetails});
            }
            const url = SupernovaClient.getCompleteUrl(
                SupernovaClient.urls.getBalanceV2.replace(/##USER_ID##/g, `${userId}`),queryParams);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);

            logger.info({url: url, headers: headers}, `[SupernovaClient] [getBalance] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[SupernovaClient] [getBalance] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getCashTickets(restClient: any, userId: string, pagination: Pagination, vendorId: number): Promise<any> {
        try {
            logger.info(userId, `[SupernovaClient] [getCashTickets] userId :: `);
            const queryParams: QueryParam[] = [];
            if (pagination) {
                if (pagination.offset) queryParams.push({param: "offset", value: pagination.offset});
                if (pagination.numOfRecords) queryParams.push({param: "numOfRecords", value: pagination.numOfRecords});
            }
            const url = SupernovaClient.getCompleteUrl(
                SupernovaClient.urls.getCashTickets.replace(/##USER_ID##/g, `${userId}`), queryParams);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);

            logger.info({url: url, headers: headers}, `[SupernovaClient] [getCashTickets] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[SupernovaClient] [getCashTickets] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getCashTicketTransactions(restClient: any, userId: string, ticketId: string, pagination: Pagination, vendorId: number): Promise<any> {
        try {
            logger.info(userId, `[SupernovaClient] [getCashTicketTransactions] userId :: `);
            const queryParams: QueryParam[] = [];
            if (pagination) {
                if (pagination.offset) queryParams.push({param: "offset", value: pagination.offset});
                if (pagination.numOfRecords) queryParams.push({param: "numOfRecords", value: pagination.numOfRecords});
            }
            queryParams.push({param: "packId", value: ticketId});
            queryParams.push({param: "walletType", value: WALLET_TYPES.PRIMARY});
            queryParams.push({param: "currencies", value: TICKET_TYPES.CASH_GAME_TICKETS});
            queryParams.push({
                param: "transactionTypes",
                value: [CASH_TRANSACTION_TYPES.JOIN_CASH_GAME_TABLE, CASH_TRANSACTION_TYPES.LEAVE_CASH_GAME_TABLE]
            });

            const url = SupernovaClient.getCompleteUrl(
                SupernovaClient.urls.getCashTicketTransactions.replace(/##USER_ID##/g, `${userId}`), queryParams);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);

            logger.info({url: url, headers: headers}, `[SupernovaClient] [getCashTicketTransactions] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[SupernovaClient] [getCashTicketTransactions] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getTournamentTickets(restClient: any, userId: string, pagination: Pagination, vendorId: number): Promise<any> {
        try {
            logger.info(userId, `[SupernovaClient] [getTournamentTickets] userId :: `);
            const queryParams: QueryParam[] = [];
            if (pagination) {
                if (pagination.offset) queryParams.push({param: "offset", value: pagination.offset});
                if (pagination.numOfRecords) queryParams.push({param: "numOfRecords", value: pagination.numOfRecords});
            }
            const url = SupernovaClient.getCompleteUrl(
                SupernovaClient.urls.getTournamentTickets.replace(/##USER_ID##/g, `${userId}`), queryParams);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);

            logger.info({url: url, headers: headers}, `[SupernovaClient] [getTournamentTickets] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[SupernovaClient] [getTournamentTickets] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getCashbacks(restClient: any, userId: string, status: number, pagination: Pagination, vendorId: number): Promise<any> {
        try {
            logger.info(userId, `[SupernovaClient] [getCashbacks] userId :: `);
            const queryParams: QueryParam[] = [];
            queryParams.push({param: "status", value: status});
            if (pagination) {
                if (pagination.offset) queryParams.push({param: "offset", value: pagination.offset});
                if (pagination.numOfRecords) queryParams.push({param: "numOfRecords", value: pagination.numOfRecords});
            }
            const url = SupernovaClient.getCompleteUrl(
                SupernovaClient.urls.getCashbacks.replace(/##USER_ID##/g, `${userId}`), queryParams);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);

            logger.info({url: url, headers: headers}, `[SupernovaClient] [getCashbacks] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[SupernovaClient] [getCashbacks] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getWalletTransactions(userId: string, pagination: Pagination, walletTransactionFilter: WalletTransactionFilter, restClient: any, vendorId: number): Promise<any> {
        try {
            logger.info(`[SupernovaClient] [getWalletTransactions] userId :: ${userId} for page :: ${JSON.stringify(pagination)}`);
            const queryParams: QueryParam[] = [];
            if (pagination) {
                if (pagination.offset) queryParams.push({param: "offset", value: pagination.offset});
                if (pagination.numOfRecords) queryParams.push({param: "numOfRecords", value: pagination.numOfRecords});
            }
            logger.info(walletTransactionFilter, `Wallet Transaction Filters :: `);

            Object.keys(walletTransactionFilter).map(key => {
                if (walletTransactionFilter[key] != null) {
                    queryParams.push({param: key, value: walletTransactionFilter[key]});
                }
            })

            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.getWalletTransactions.replace(/##USER_ID##/g, `${userId}`), queryParams);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [getWalletTransactions] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[SupernovaClient] [getTournamentTickets] response :: `);
            return response.data.transactions;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getTournamentEntryDetails(restClient: any, userId: number, request: TournamentEntryDetailsRequest, vendorId: number): Promise<TournamentEntryDetailsResponse> {
        try {
            logger.info(userId, `[SupernovaClient] [getTournamentEntryDetails] userId :: `);
            const url = SupernovaClient.getCompleteUrl(
                SupernovaClient.urls.getTournamentEntryDetails.replace(/##USER_ID##/g, `${userId}`));
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);

            logger.info({url: url, headers: headers}, `[SupernovaClient] [getTournamentEntryDetails] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, null, request);
            logger.info(response, `[SupernovaClient] [getTournamentEntryDetails] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getTournamentEntryDetailsV2(restClient: any, userId: number, request: TournamentEntryDetailsRequest, vendorId: number): Promise<TournamentEntryDetailsResponse> {
        try {
            logger.info(userId, `[SupernovaClient] [getTournamentEntryDetails] userId :: `);
            const url = SupernovaClient.getCompleteUrl(
                SupernovaClient.urls.getTournamentEntryDetailsV2.replace(/##USER_ID##/g, `${userId}`));
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);

            logger.info({url: url, headers: headers}, `[SupernovaClient] [getTournamentEntryDetails] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, null, request);
            logger.info(response, `[SupernovaClient] [getTournamentEntryDetails] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getTournamentEntryDetailsV3(restClient: any, userId: number, request: TournamentEntryDetailsRequestV2, vendorId: number): Promise<TournamentEntryDetailsResponse> {
        try {
            logger.info(userId, `[SupernovaClient] [getTournamentEntryDetailsV3] userId :: `);
            const url = SupernovaClient.getCompleteUrl(
                SupernovaClient.urls.getTournamentEntryDetailsV3.replace(/##USER_ID##/g, `${userId}`));
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);

            logger.info({url: url, headers: headers}, `[SupernovaClient] [getTournamentEntryDetailsV3] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, null, request);
            logger.info(response, `[SupernovaClient] [getTournamentEntryDetailsV3] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getCashGameBuyInDetails(restClient: any, userId: number, request: any, vendorId: number): Promise<TournamentEntryDetailsResponse> {
        try {
            logger.info(userId, `[SupernovaClient] [getCashGameBuyInDetails] userId :: `);
            const url = SupernovaClient.getCompleteUrl(
                SupernovaClient.urls.getCashGameBuyInDetails.replace(/##USER_ID##/g, `${userId}`));
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);

            logger.info({url: url, headers: headers}, `[SupernovaClient] [getCashGameBuyInDetails] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, null, request);
            logger.info(response, `[SupernovaClient] [getCashGameBuyInDetails] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async userWalletAndTdsMigration(restClient: any, request: WalletAndTdsMigrationRequest, vendorId: string): Promise<any> {
        try {
            logger.info(`[SupernovaClient] [userWalletAndTdsMigration] request :: ${JSON.stringify(request)}} `);
            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.userMigrationApi);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(Number(vendorId));
            logger.info({url: url, headers: headers}, `[SupernovaClient] [userWalletAndTdsMigration]`)
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [userWalletAndTdsMigration] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getUserTournamentRegisteredThroughDepositReward(userId: string, pagination: Pagination, tournamentIds: string[], restClient: any, vendorId: number): Promise<any> {
        try {
            logger.info(`[SupernovaClient] [getUserTournamentRegisteredThroughDepositReward] userId :: ${userId} for page :: ${JSON.stringify(pagination)}`);
            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.userTournamentsRegisteredThroughDepositReward.replace(/##USER_ID##/g, `${userId}`));
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [getWalletTransactions] `);
            const request = {
                tournamentIds: tournamentIds
            }
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers, null, request);
            logger.info(response, `[SupernovaClient] [getTournamentTickets] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async checkUserCanUnregisterTheTournament(userId: string, tournamentId: string, restClient: any, vendorId: number): Promise<any> {
        try {
            logger.info(`[SupernovaClient] [checkUserCanUnregisterTheTournament] userId :: ${userId}`);
            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.checkUserCanUnregisterTournamanet
              .replace(/##USER_ID##/g, `${userId}`))
              .replace(/##TOURNAMENT_ID##/g, tournamentId);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [checkUserCanUnregisterTheTournament] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[SupernovaClient] [checkUserCanUnregisterTheTournament] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async getUserPackDetails(userId: string, packDetailsFilter: PackDetailsFilter, pagination: Pagination,  restClient: any, vendorId: number): Promise<any> {
        try {
            const queryParams: QueryParam[] = [];
            if (pagination) {
                if (pagination.offset) queryParams.push({param: "offset", value: pagination.offset});
                if (pagination.numOfRecords) queryParams.push({param: "numOfRecords", value: pagination.numOfRecords});
            }
            logger.info(packDetailsFilter, `Wallet Transaction Filters :: `);

            Object.keys(packDetailsFilter).map(key => {
                if (packDetailsFilter[key] != null) {
                    queryParams.push({param: key, value: packDetailsFilter[key]});
                }
            })
            logger.info(`[SupernovaClient] [checkUserCanUnregisterTheTournament] userId :: ${userId}`);
            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.packDetails.replace(/##USER_ID##/g, `${userId}`), queryParams);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [checkUserCanUnregisterTheTournament] `);
            const response = await BaseClient.sendGetRequestWithHeaders(restClient, url, headers);
            logger.info(response, `[SupernovaClient] [checkUserCanUnregisterTheTournament] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async reserveCashSeatEligiBility(restClient: any, request: SupernovaReserveSeatEligibilityRequest): Promise<any> {
        try {
            logger.info(`[SupernovaClient] [reserveCashSeatEligiBility] request :: ${JSON.stringify(request)}} `);
            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.reserveCashSeatEligibility);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(request.vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [reserveCashSeatEligiBility]`)
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [reserveCashSeatEligiBility] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    @SupernovaClientLatencyDecorator
    static async reservePracticeSeatEligiBility(restClient: any, request: SupernovaReserveSeatEligibilityRequest): Promise<any> {
        try {
            logger.info(`[SupernovaClient] [reservePracticeSeatEligiBility] request :: ${JSON.stringify(request)}} `);
            const url = SupernovaClient.getCompleteUrl(SupernovaClient.urls.reservePracticeSeatEligibility);
            const headers: any = SupernovaClient.getSupernovaServiceHeaders(request.vendorId);
            logger.info({url: url, headers: headers}, `[SupernovaClient] [reservePracticeSeatEligiBility]`)
            const response = await BaseClient.sendPostRequestWithHeaders(restClient, url, request, headers);
            logger.info(response, `[SupernovaClient] [reservePracticeSeatEligiBility] response :: `);
            return response.data;
        } catch (error) {
            throw SupernovaClient.getError(error);
        }
    }

    static getErrorFromCode(errorCode: number) {
        return SupernovaClient.getError({errorCode});
    }

    static wrapError(error: any) {
        if (error && !(error instanceof SupernovaServiceError)) {
            return SupernovaServiceErrorUtil.wrapError(error);
        }
        return error;
    }

    private static getSupernovaServiceHeaders(vendorId: number) {
        const headers = {'x-vendor-id': vendorId};
        return headers
    }

    private static getCompleteUrl(relativeUrl: string, queryParams?: QueryParam[]) {
        return RequestUtil.getCompleteRequestURL(getSupernovaServiceBaseUrl(), relativeUrl, queryParams)
    }

    private static getError(error: any) {
        logger.error('[SupernovaClient] Error: %s', JSON.stringify(error || {}));
        switch (error.errorCode) {
            case 10001:
                return SupernovaServiceErrorUtil.getRuntimeError();
            case 10005:
                return SupernovaServiceErrorUtil.getAuthorizationError();
            case 10015:
                return SupernovaServiceErrorUtil.getInternalServerError();
            case 10020:
                return SupernovaServiceErrorUtil.getBodyValidationError();
            case 10025:
                return SupernovaServiceErrorUtil.getDbAnomaly();
            case 10030:
                return SupernovaServiceErrorUtil.getInvalidVendorId();
            case 11001:
                return SupernovaServiceErrorUtil.getInsufficientBalance();
            case 11002:
                return SupernovaServiceErrorUtil.getInvalidReserveCashGameTableRequest();
            case 11003:
                return SupernovaServiceErrorUtil.getInvalidJoinCashGameTableBuyinAmount();
            case 11004:
                return SupernovaServiceErrorUtil.getInvalidJoinCashGameTableRequest();
            case 11005:
                return SupernovaServiceErrorUtil.getInvalidLeaveCashGameTableRequest();
            case 11006:
                return SupernovaServiceErrorUtil.getInvalidSettleCashGameHandRequest();
            case 11007:
                return SupernovaServiceErrorUtil.getInvalidSettleCashGameHandUsers();
            case 11008:
                return SupernovaServiceErrorUtil.getInvalidTopupCashGameTableTopupAmount();
            case 11009:
                return SupernovaServiceErrorUtil.getInvalidCompleteCashGameTableTopupAmount();
            case 11010:
                return SupernovaServiceErrorUtil.getInvalidRebuyCashGameTableRebuyAmount();
            case 11011:
                return SupernovaServiceErrorUtil.getInvalidRebuyCashGameTableRequest();
            case 12001:
                return SupernovaServiceErrorUtil.getInvalidReservePracticeGameTableRequest();
            case 12002:
                return SupernovaServiceErrorUtil.getInvalidJoinPracticeGameTableBuyinAmount();
            case 12003:
                return SupernovaServiceErrorUtil.getInvalidJoinPracticeGameTableRequest();
            case 12004:
                return SupernovaServiceErrorUtil.getInvalidLeavePracticeGameTableRequest();
            case 12005:
                return SupernovaServiceErrorUtil.getInvalidSettlePracticeGameHandRequest();
            case 12006:
                return SupernovaServiceErrorUtil.getInvalidSettlePracticeGameHandUsers();
            case 12007:
                return SupernovaServiceErrorUtil.getInvalidTopupPracticeGameTableTopupAmount();
            case 12008:
                return SupernovaServiceErrorUtil.getInvalidCompletePracticeGameTableTopupAmount();
            case 12010:
                return SupernovaServiceErrorUtil.getInvalidRebuyPracticeGameTableRebuyAmount();
            case 12011:
                return SupernovaServiceErrorUtil.getInvalidRebuyPracticeGameTableRequest();
            case 13001:
                return SupernovaServiceErrorUtil.getTdsLedgerEntryAlreadyExists();
            case 13002:
                return SupernovaServiceErrorUtil.getTdsLedgerEntryNotExists();
            case 13003:
                return SupernovaServiceErrorUtil.getTdsDetailsMismatch();
            case 13004:
                return SupernovaServiceErrorUtil.getInvalidWithdrawalAmount();
            case 13005:
                return SupernovaServiceErrorUtil.getInvalidRefundAmount();
            case 14001:
                return SupernovaServiceErrorUtil.getUserDepositAlreadySuccessfulOrFailed();
            case 14002:
                return SupernovaServiceErrorUtil.getUserWithdrawalAlreadySuccessfulOrFailed();
            case 14003:
                return SupernovaServiceErrorUtil.getUserRefundAlreadySuccessfulOrFailed();
            case 14004:
                return SupernovaServiceErrorUtil.getInvalidUserConfiscationAmount();
            case 14005:
                return SupernovaServiceErrorUtil.getInvalidUserCreditAmount();
            case 14007:
                return SupernovaServiceErrorUtil.getInvalidUserDebitAmount();
            case 15001:
                return SupernovaServiceErrorUtil.getInvalidTransactionIdForRollback();
            case 15002:
                return SupernovaServiceErrorUtil.getInvalidRegisterTournamentRequest();
            case 15003:
                return SupernovaServiceErrorUtil.getInvalidReentryTournamentRequest();
            case 15004:
                return SupernovaServiceErrorUtil.getInvalidRebuyTournamentRequest();
            case 15005:
                return SupernovaServiceErrorUtil.getInvalidAddonTournamentRequest();
            case 15006:
                return SupernovaServiceErrorUtil.getInvalidUnregisterTournamentRequest();
            case 15007:
                return SupernovaServiceErrorUtil.getTournamentAccountCreationFailed();
            case 15008:
                return SupernovaServiceErrorUtil.getInvalidSettleTournamentRequest();
            case 15009:
                return SupernovaServiceErrorUtil.getInvalidTransactionIdForRollforward();
            case 15010:
                return SupernovaServiceErrorUtil.getInvalidTournamentIdForRollforward();
            case 15011:
                return SupernovaServiceErrorUtil.getInvalidEntryMethodsForTournament();
            default:
                return SupernovaServiceErrorUtil.getError(error);
        }

    }
};
