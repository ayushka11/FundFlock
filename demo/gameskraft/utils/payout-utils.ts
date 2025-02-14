import {BankConfig, PayoutTransaction, PayoutTransactionStatus, TdsInfo} from "../models/payout/response"
import {DEFAULT_PAYOUT_CONSTANT} from "../constants/payout-constants"
import DatetimeUtil from "./datetime-util"
import {logger} from "./logger";
import {
    CASH_TRANSACTION_TYPES,
    MS_PAYOUT_TRANSACTION_TYPES,
    SUPERNOVA_TRANSACTION_STATUS,
    USER_TRANSACTION_TYPE
} from "../constants/supernova-constants";

const configService = require('../services/configService');

export default class PayoutUtil {

    public static getPayoutConfig(vendorId: string) {
        const payoutConfig: any = configService.getPayoutConfigForVendor()[vendorId];
        return payoutConfig
    }

    static processPayoutTransactionsResponse(payoutTransactions: any, addMsg?: boolean): PayoutTransaction[] {
        const processedPayoutTransactions: PayoutTransaction[] = [];
        payoutTransactions.map((data: any) => {
            const transaction: PayoutTransaction = {
                id: data.transferId,
                transactionType: CASH_TRANSACTION_TYPES.WITHDRAW_CASH,
                type: USER_TRANSACTION_TYPE.DEBIT,
                createdAt: DatetimeUtil.getTzTime(data.createdAt),
                updatedAt: DatetimeUtil.getTzTime(data.updatedAt),
                amount: data?.amount,
                tdsDeducted: data?.metadata?.tdsApplicable,
                withdrawalRequestedAmount: data?.metadata?.withdrawalRequestedAmount,
                utr: data.utr,
                reason: data.reason,
                status: SUPERNOVA_TRANSACTION_STATUS[data.status.toLowerCase()],
                transactionTypeLabel: DEFAULT_PAYOUT_CONSTANT.PAYOUT_LABEL
            };
            processedPayoutTransactions.push(transaction)
        })
        return processedPayoutTransactions;
    }

    static processMsPayoutTransactionsResponse(payoutTransactions: any): PayoutTransaction[] {
        const processedPayoutTransactions: PayoutTransaction[] = [];
        payoutTransactions.map((data: any) => {
            const transaction: PayoutTransaction = {
                id: data.tr_id,
                transactionType: CASH_TRANSACTION_TYPES.WITHDRAW_CASH,
                type: USER_TRANSACTION_TYPE.DEBIT,
                createdAt: data.tr_time,
                updatedAt: data.tr_time,
                amount: data.amount,
                tdsDeducted: 0,
                amountCredited: data.amount,
                utr: '',
                reason: '',
                status: MS_PAYOUT_TRANSACTION_TYPES[data.status.toLowerCase()],
                transactionTypeLabel: DEFAULT_PAYOUT_CONSTANT.PAYOUT_LABEL
            };
            processedPayoutTransactions.push(transaction)
        })
        return processedPayoutTransactions;
    }

    static processPayoutTransactionResponse(payoutTransaction: any, vendorId: string): PayoutTransactionStatus | undefined {
        logger.info(`processPayoutTransactionResponse - ${JSON.stringify(payoutTransaction)}`)
        if (!payoutTransaction || payoutTransaction.length <= 0) {
            return undefined
        }
        let msgInfo = {}
        const payoutConfig: any = configService.getPayoutConfigForVendor()[vendorId];
        const payoutMsgMap = payoutConfig?.payoutMsgMap;
        const status = payoutTransaction[0].status?.toLowerCase() || "";
        msgInfo = payoutMsgMap[status] || "";

        const processedPayoutTransactions: PayoutTransactionStatus = {
            transferId: payoutTransaction[0].transferId,
            createdAt: DatetimeUtil.getTzTime(payoutTransaction[0].createdAt),
            updatedAt: DatetimeUtil.getTzTime(payoutTransaction[0].updatedAt),
            requestedAmount: payoutTransaction[0]?.metadata?.withdrawalRequestedAmount,
            tdsDeducted: payoutTransaction[0]?.metadata?.tdsApplicable,
            amountCredited: payoutTransaction[0]?.metadata?.amountToBeCredit,
            utr: payoutTransaction[0].utr,
            reason: payoutTransaction[0].reason,
            status: payoutTransaction[0].status,
        }

        return {...processedPayoutTransactions, ...msgInfo};


    }

    public static getPayoutBankConfigWrtIfsc(ifsc: string, vendorId: string) {
        const payoutBankList: any = configService.getPayoutBankListInfoForVendor()[vendorId];
        const payoutConfig = PayoutUtil.getPayoutConfig(vendorId);
        const ifscSubCode = ifsc.substring(0, 5);
        const payoutBanks = payoutBankList.filter((bank: BankConfig) => bank.ifsc_sub_code == ifscSubCode);
        let bankInfo = {
            bankIcon: (payoutBanks && payoutBanks.length > 0) ? payoutBanks[0].image_link : payoutConfig?.defaultBankDetail?.imageUrl,
            bankShortName: (payoutBanks && payoutBanks.length > 0) ? payoutBanks[0].bank_short : ifsc.substring(0, 4),
            bankName: (payoutBanks && payoutBanks.length > 0) ? payoutBanks[0].bank_name : payoutConfig?.defaultBankDetail?.bankName || ""
        };
        return bankInfo;
    }


    public static getPayoutMinimumLimit(vendorId: string) {
        const payoutConfig = PayoutUtil.getPayoutConfig(vendorId);
        const minPayoutLimit = payoutConfig.payoutLimits?.minPayoutLimit;
        return minPayoutLimit;
    }


    public static getInstantPayoutLimit(vendorId: string) {
        const payoutConfig = PayoutUtil.getPayoutConfig(vendorId);
        const instantPayoutLimit = payoutConfig.payoutLimits?.instantPayoutLimit;
        return instantPayoutLimit;
    }

    public static getTransformedTdsInfo(tdsInfo: TdsInfo): TdsInfo {
        tdsInfo.amountEligibleWithoutTax = tdsInfo.withdrawalRequestedAmount - tdsInfo.taxableNetWinnings;
        tdsInfo.tdsSnapshot.totalWithdrawalRequestedIncludingCurrentWithdrawal = tdsInfo.tdsSnapshot.totalWithdrawalRequestedAmount + tdsInfo.withdrawalRequestedAmount
        tdsInfo.tdsSnapshot.totalDepositAmountIncludingStartingBalance = tdsInfo.tdsSnapshot?.startingDepositBalance + tdsInfo.tdsSnapshot?.startingWithdrawalBalance + tdsInfo.tdsSnapshot?.totalDepositAmount

        return tdsInfo
    }


}