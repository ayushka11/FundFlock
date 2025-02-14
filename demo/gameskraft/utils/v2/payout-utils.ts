import {
    BankConfig,
    Instrument,
    PayoutDowntime,
    PayoutPack,
    PayoutStatusV2,
    PayoutTransaction,
    PayoutTransactionV2,
    TdsInfo,
    UpiDetails
} from "../../models/payoutV2/response"
import {DEFAULT_PAYOUT_CONSTANT, PAYOUT_DOWNTIME_SEVERITY, PAYOUT_INSTRUMENT_DOWNTIME_STATUS, PAYOUT_MODE, SPLIT_UPI_LENGTH, TRANSACTION_STATUS_NAME_MAP, UPI_SPLITTER} from "../../constants/payout-constants"
import DatetimeUtil from "./../datetime-util"
import {logger} from "./../logger";
import {
    CASH_TRANSACTION_TYPES,
    MS_PAYOUT_TRANSACTION_TYPES,
    SUPERNOVA_TRANSACTION_STATUS,
    USER_TRANSACTION_TYPE
} from "../../constants/supernova-constants";
import Parser from "../parser";
import { BankDetails } from "../../models/payoutV2/response";
import { GUARDIAN_DOCUMENT_STATUS } from "../../constants/guardian-constants";

const configService = require('../../services/configService');

export default class PayoutUtilV2 {

    public static getPayoutConfig(vendorId: number) {
        const payoutConfig: any = configService.getPayoutConfigForVendor()[vendorId];
        return payoutConfig
    }

    public static getPayoutMetaTexts(vendorId: number) {
        const payoutConfig: any = configService.getPayoutConfigForVendor()[vendorId];
        return payoutConfig?.meta?.uiTexts || {};
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
                transactionTypeLabel: DEFAULT_PAYOUT_CONSTANT.PAYOUT_LABEL,
                isNewTxn: true,
                accountId: data?.accountId
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

    static getPayoutStatusV2(payoutTransaction: any, vendorId: number): PayoutStatusV2 | undefined {
        logger.info(`processPayoutTransactionResponse - ${JSON.stringify(payoutTransaction)}`)
        if (!payoutTransaction || payoutTransaction.length <= 0) {
            return undefined
        }
        let msgInfo = {}
        const payoutConfig: any = configService.getPayoutConfigForVendor()[vendorId];
        const payoutMsgMap = payoutConfig?.payoutMsgMap;
        const status = payoutTransaction[0].status?.toLowerCase() || "";
        msgInfo = payoutMsgMap[status] || "";

        const processedPayoutTransactions: PayoutStatusV2 = {
            transferId: payoutTransaction[0].transferId,
            createdAt: DatetimeUtil.getTzTime(payoutTransaction[0].createdAt),
            updatedAt: DatetimeUtil.getTzTime(payoutTransaction[0].updatedAt),
            requestedAmount: payoutTransaction[0]?.metadata?.withdrawalRequestedAmount,
            tdsDeducted: payoutTransaction[0]?.metadata?.tdsApplicable,
            amountCredited: payoutTransaction[0]?.metadata?.amountToBeCredit,
            tdsPercentage: payoutTransaction[0]?.metadata?.tdsPercentage,
            utr: payoutTransaction[0].utr,
            reason: payoutTransaction[0].reason,
            status: payoutTransaction[0].status,
        }

        const withdrawalPack = payoutTransaction[0].metadata?.selectedPayoutPack;
        const walletMeta = payoutTransaction[0].metadata?.userAccount
        const isSuperSaverApplied = payoutTransaction[0]?.metadata?.selectedPayoutPack?.superSaver

        return {...processedPayoutTransactions, ...msgInfo, withdrawalPack, walletMeta, isSuperSaverApplied};
    }


    static getSinglePayoutTransactionV2(payoutTransaction: any): PayoutTransactionV2 | undefined {
        logger.info(`getSinglePayoutTransactionV2 Request - ${JSON.stringify(payoutTransaction)}`)
        if (!payoutTransaction || payoutTransaction.length <= 0) {
            return undefined
        }
        let msgInfo = {}
        const processedPayoutTransactions: PayoutTransactionV2 = {
            transactionId: payoutTransaction[0].transferId,
            createdAt: DatetimeUtil.getTzTime(payoutTransaction[0].createdAt),
            updatedAt: DatetimeUtil.getTzTime(payoutTransaction[0].updatedAt),
            requestedAmount: payoutTransaction[0]?.metadata?.withdrawalRequestedAmount,
            tdsDeducted: payoutTransaction[0]?.metadata?.tdsApplicable || 0,
            amountCredited: payoutTransaction[0]?.metadata?.amountToBeCredit,
            utr: payoutTransaction[0].utr,
            reason: payoutTransaction[0].reason,
            status: SUPERNOVA_TRANSACTION_STATUS[payoutTransaction[0].status.toLowerCase()],
            transactionType: CASH_TRANSACTION_TYPES.WITHDRAW_CASH,
            type: USER_TRANSACTION_TYPE.DEBIT,
            transactionLabel: `₹${payoutTransaction[0]?.metadata?.amountToBeCredit} Withdrawal ${TRANSACTION_STATUS_NAME_MAP[payoutTransaction[0].status.toLowerCase()]}`

        }

        const withdrawalData = {
            requestedAmount: payoutTransaction[0]?.metadata?.requestedAmount,
            winningsToGameBalance: payoutTransaction[0]?.metadata.selectedPayoutPack?.gameBalanceCredit,
            withdrawalPlaceAmount: payoutTransaction[0]?.metadata?.withdrawalRequestedAmount || 0,
            winningsToBank: payoutTransaction[0]?.metadata?.amountToBeCredit || 0,
            tds: payoutTransaction[0]?.metadata?.tdsApplicable || 0
        }
        logger.info(`getSinglePayoutTransactionV2 Response  - ${JSON.stringify({withdrawalData})}`)
        const updatedBuyInValue = Parser.parseToTwoDecimal(
            (payoutTransaction[0].metadata?.userAccount?.winningBalance || 0) + (payoutTransaction[0].metadata?.userAccount?.playerGameBalance || 0) +
            (payoutTransaction[0].metadata?.userAccount?.discountCreditBalance || 0))
        return {...processedPayoutTransactions, ...msgInfo, withdrawalData, updatedBuyInValue};


    }

    public static getPayoutBankConfigWrtIfsc(ifsc: string, vendorId: number) {
        const payoutBankList: any = configService.getPayoutBankListInfoForVendor()[vendorId];
        const payoutConfig = PayoutUtilV2.getPayoutConfig(vendorId);
        const ifscSubCode = ifsc.substring(0, 5);
        const payoutBanks = payoutBankList.filter((bank: BankConfig) => bank.ifsc_sub_code == ifscSubCode);
        let bankInfo = {
            bankIcon: (payoutBanks && payoutBanks.length > 0) ? payoutBanks[0].image_link : payoutConfig?.defaultBankDetail?.imageUrl,
            bankShortName: (payoutBanks && payoutBanks.length > 0) ? payoutBanks[0].bank_short : ifsc.substring(0, 4),
            bankName: (payoutBanks && payoutBanks.length > 0) ? payoutBanks[0].bank_name : payoutConfig?.defaultBankDetail?.bankName || ""
        };
        return bankInfo;
    }

    public static getUpiInstrument(upiId: string = ""): string {
        const splitUpiDetails: string[] = upiId.split(UPI_SPLITTER);
        logger.info(`upi id after splitting ${JSON.stringify(splitUpiDetails)}`);
        if(splitUpiDetails.length == SPLIT_UPI_LENGTH){
            return splitUpiDetails[splitUpiDetails.length -1];
        }
        return '';
    }
    public static getUpiDowntime(payoutdowntime: PayoutDowntime[],upiId: string): {isDisabled: boolean,errorText: string} {
        const payoutInstrument = payoutdowntime.filter(method => method.mode == PAYOUT_MODE.UPI);
        if(payoutInstrument.length){
            const upiInstrument: string = UPI_SPLITTER + this.getUpiInstrument(upiId);
            const isPaymentModeUp: boolean = this.isPaymentModeUp(payoutInstrument[0]);
            // disable everything
            if(!isPaymentModeUp){
                const isDisabled: boolean = this.isInstrumentDisabled(payoutInstrument[0]);
                const errorText: string = this.instrumentDowntimeText(payoutInstrument[0]);
                return {isDisabled,errorText};
            }
            const downtimeInstruments: Instrument[] = payoutInstrument[0].instruments;
            const upiDowntime: Instrument[] = downtimeInstruments.filter(instrument => instrument.instrument == upiInstrument);
            if(upiDowntime.length){
                const downtime: Instrument = upiDowntime[0];
                const isDisabled: boolean = this.isInstrumentDisabled(downtime);
                const errorText: string = this.instrumentDowntimeText(downtime);
                return {isDisabled,errorText};
            }
        }
        return {isDisabled: false,errorText: ''}
    }

    public static getBankDowntimeStatus(payoutdowntime: PayoutDowntime[],bank: any,bankName: string):{isDisabled: boolean,errorText: string} {
        const payoutInstrument = payoutdowntime.filter(method => method.mode == PAYOUT_MODE.IMPS);
        if(payoutInstrument.length){
            const isPaymentModeUp: boolean = this.isPaymentModeUp(payoutInstrument[0]);
            // disable everything
            if(!isPaymentModeUp){
                const isDisabled: boolean = this.isInstrumentDisabled(payoutInstrument[0]);
                const errorText: string = this.instrumentDowntimeText(payoutInstrument[0]);
                return {isDisabled,errorText};
            }
            const downtimeInstruments: Instrument[] = payoutInstrument[0].instruments;
            const bankDowntime: Instrument[] = downtimeInstruments.filter(instrument => instrument.name.toLowerCase() == bankName.toLowerCase());
            if(bankDowntime.length){
                const downtime: Instrument = bankDowntime[0];
                const isDisabled: boolean = this.isInstrumentDisabled(downtime);
                const errorText: string = this.instrumentDowntimeText(downtime);
                return {isDisabled,errorText};
            }
        }
        return {isDisabled: false,errorText: ''}
         
    }
    static isPaymentModeUp(instrument: Instrument | PayoutDowntime): boolean {
        if(instrument.status == PAYOUT_INSTRUMENT_DOWNTIME_STATUS.UP){
            return true;
        }
        return false;
    }

    static isInstrumentDisabled(instrument: Instrument | PayoutDowntime): boolean {
        if(instrument.status == PAYOUT_INSTRUMENT_DOWNTIME_STATUS.DOWN){
            return true;
        }
        return false;
    }

    static instrumentDowntimeText(instrument: Instrument | PayoutDowntime): string {
        if(this.isInstrumentDisabled(instrument)){
            return configService.getPayoutDowntimeMessage()[PAYOUT_DOWNTIME_SEVERITY.HIGH]
        }
        return configService.getPayoutDowntimeMessage()[PAYOUT_DOWNTIME_SEVERITY.MODERATE]
    }


    public static getPayoutMinimumLimit(vendorId: number) {
        const payoutConfig = PayoutUtilV2.getPayoutConfig(vendorId);
        const minPayoutLimit = payoutConfig.payoutLimits?.minPayoutLimit;
        return minPayoutLimit;
    }


    public static getInstantPayoutLimit(vendorId: number) {
        const payoutConfig = PayoutUtilV2.getPayoutConfig(vendorId);
        const instantPayoutLimit = payoutConfig.payoutLimits?.instantPayoutLimit;
        return instantPayoutLimit;
    }

    public static getTransformedTdsInfo(tdsInfo: TdsInfo): TdsInfo {
        tdsInfo.amountEligibleWithoutTax = tdsInfo.withdrawalRequestedAmount - tdsInfo.taxableNetWinnings;
        tdsInfo.tdsSnapshot.totalWithdrawalRequestedIncludingCurrentWithdrawal = tdsInfo.tdsSnapshot.totalWithdrawalRequestedAmount + tdsInfo.withdrawalRequestedAmount
        tdsInfo.tdsSnapshot.totalDepositAmountIncludingStartingBalance = tdsInfo.tdsSnapshot?.startingDepositBalance + tdsInfo.tdsSnapshot?.startingWithdrawalBalance + tdsInfo.tdsSnapshot?.totalDepositAmount

        return tdsInfo
    }

    public static getPayoutPacks(vendorId: number) {
        const payoutPacks: any = configService.getPayoutPacksForVendor()[vendorId];
        return payoutPacks
    }

    public static getSelectedPayoutPacksData(packId: number, amount: number, vendorId: number): PayoutPack {
        const payoutPacks: any = configService.getPayoutPacksForVendor()[vendorId];
        const filteredPayoutPack = payoutPacks.payoutPacks.filter(
            payoutPack => payoutPack.id === packId).map(payoutPack => ({
            ...payoutPack,
            gameBalanceCredit: Parser.parseToTwoDecimal(payoutPack.gameBalanceCredit * amount),
            withdrawToBank: Parser.parseToTwoDecimal(payoutPack.withdrawToBank * amount),
            discountCredit: Parser.parseToTwoDecimal(payoutPack.discountCredit * amount),
            finalAmount: Parser.parseToTwoDecimal(payoutPack.gameBalanceCredit * amount + payoutPack.withdrawToBank * amount + payoutPack.discountCredit * amount)
        }));
        return filteredPayoutPack && filteredPayoutPack[0]
    }

    public static getPayoutAccessIdByVendor(vendorId) {
        const getPayoutAccessIdByVendor = configService.getPayoutServiceAccessKeyByVendor();
        return getPayoutAccessIdByVendor[vendorId] || configService.getPayoutServiceAccessKey()
    }

    public static getPayoutServiceBaseUrlByVendor(vendorId) {
        const getPayoutServiceBaseUrlByVendor = configService.getPayoutServiceBaseUrl();
        return getPayoutServiceBaseUrlByVendor[vendorId] || configService.getPayoutServiceBaseUrl()
    }

    public static getPayoutDetailsMeta(vendorId: number): object {
        const payoutMeta = PayoutUtilV2.getPayoutMetaTexts(vendorId);
        return payoutMeta?.getPayoutDetails || {}
    }

    public static getPayoutPacksMeta(vendorId: number): object {
        const payoutMeta = PayoutUtilV2.getPayoutMetaTexts(vendorId);
        return payoutMeta?.getPayoutPacks || {}
    }

    public static getValidatePayoutMeta(vendorId: number): object {
        const payoutMeta = PayoutUtilV2.getPayoutMetaTexts(vendorId);
        return payoutMeta?.validatePayout || {}
    }

    public static getPayoutTransactionMeta(vendorId: number): object {
        const payoutMeta = PayoutUtilV2.getPayoutMetaTexts(vendorId);
        return payoutMeta?.getPayoutTransaction || {}
    }

    public static checkBeneficiaryAccountLimitReached(beneficiaryDetails: BankDetails[] | UpiDetails[],maxBeneficiaryAccountsAllowed): boolean {
        if(beneficiaryDetails.length < maxBeneficiaryAccountsAllowed) return false;
        return true;
    }
}