import {GUARDIAN_DOCUMENT_STATUS} from "../constants/guardian-constants";
import {EMAIL_VERIFICATION_STATUS} from "../constants/idm-constants";
import {
    ADD_CASH_TRANSACTION_LABEL,
    DEFAULT_PAYMENT_MODE,
    DEFAULT_PROMO,
    DEFAULT_PSPID,
    MS_ADD_CASH_TRANSACTION_STATUS_MAPPER,
    MS_REFUND_TRANSACTION_STATUS_MAPPER,
    payinOrderStatus,
    payinPaymentMethodTypes,
    payinRefundOrderStatus,
    paymentGateway,
    paymentMethod,
    paymentModes,
    SUPERNOVA_PAYIN_TRANSACTION_STATUS_MAPPER,
    TRANSACTION_LABEL
} from "../constants/payin-constants";
import {CASH_TRANSACTION_TYPES, USER_TRANSACTION_TYPE} from "../constants/supernova-constants";
import {UserKycDetails} from "../models/guardian/user-kyc";
import {IDMUserProfile} from "../models/idm/user-idm";
import {
    BankDetails,
    CardBinDetails,
    CardDetails,
    PayinPaymentMethod,
    PaymentMethodsList,
    PaymentMode
} from "../models/payin/payment-method";
import {PayinInitiateOrder} from "../models/payin/request";
import {PaymentModeValidationResponse, TdsSnapshot, UserRefundData, UserRefundDetails, UserTdsDetails} from "../models/payin/response";
import {
    AddCashData,
    AddCashSummary,
    UserOrder,
    UserOrderDetails,
    UserOrderDetailsV2
} from "../models/payin/user-details";
import {RefundOrder, RefundOrderV2, SupernovaRefundDetailsRequest} from "../models/supernova/request";
import {UserTransactionDetails, UserTransactionSummary, UserWalletBalanceV2} from "../models/supernova/response";
import LoggerUtil from '../utils/logger';
import DatetimeUtil from "./datetime-util";
import {DepositEvent} from "../models/rocket-events/deposit-events";
import { UserRefundDcsAmountRequest } from "../models/aurora/request";
import { UserRefundDcsAmountsDetails } from "../models/aurora/response";
import Parser from "./parser";

const configService = require('../services/configService');
const logger = LoggerUtil.get("payin-util");

export const getPaymentResponse = (processPaymentResponse, queryParams) => {
    const paymentStatus = (processPaymentResponse.status == 'SUCCESS');
    const gatewayJusPay = queryParams?.source;
    const orderId = processPaymentResponse.orderId;
    const updatedAt = processPaymentResponse.updatedAt;
    return {paymentStatus, gatewayJusPay, orderId, updatedAt}
}

export const getWebhookDetailsFromOrder = (paymentOrder) => {
    return {
        userCreditAmount: paymentOrder?.amount,
        promo: paymentOrder?.orderMetaData?.promo ?? "",
        orderMeta: paymentOrder?.orderMetaData ?? {},
        userId: paymentOrder?.uniqueRef,
        taxableAmount: paymentOrder?.taxDetail?.taxableAmount ?? 0,
        gstAmount: paymentOrder?.taxDetail?.totalTax ?? 0,
        paymentMethod: paymentOrder?.paymentMethodType || '',
        addCashCount:  paymentOrder?.orderMetaData?.addCashCount ?? 0,
    }
}

export const getUserRefunds = (body) => {
    return body?.userRefunds ?? [];
}
export const getPayinInitiatePaymentOrderRequest = (body): PayinInitiateOrder => {
    return {
        ...body,
        paymentModeId: body?.mode ?? DEFAULT_PAYMENT_MODE,
        pspId: body.pspId ?? DEFAULT_PSPID
    }
}

export const getPromo = (body): string => {
    return body?.promotionCode ?? DEFAULT_PROMO;
}

export const getOrderIdfromQuery = (query): string => {
    return query?.orderId ?? "";
}
export const checkPayinStatus = (order: any) => {
    const isOrderSuccess: boolean = order.status == payinOrderStatus.SUCCESS;
    const isOrderFailure: boolean = (order.status == payinOrderStatus.ABANDONED || order.status == payinOrderStatus.AUTHENTICATION_FAILED || order.status == payinOrderStatus.AUTHORIZATION_FAILED || order.status == payinOrderStatus.FAILED);
    return {isOrderSuccess, isOrderFailure};
}

export const getDepositEventData = (order: any, addCashSummary: AddCashSummary, userDetails: IDMUserProfile): DepositEvent => {

    let bank = '',
        issuer = '',
        vpa = '',
        uniqueIdentifier = '',
        scheme = '',
        bin = '';

    const paymentDetails = order?.paymentDetail
    if (paymentDetails?.hasOwnProperty(paymentMethod.Card)) {
        uniqueIdentifier = paymentDetails.card?.cardFingerprint
        scheme = paymentDetails.card?.cardBrand
        issuer = paymentDetails.card?.cardIssuer
        bin = paymentDetails.card?.cardIsin
    }
    else if (paymentDetails?.hasOwnProperty(paymentMethod.UPI)) {
        uniqueIdentifier = paymentDetails.upi?.upiId
        vpa = uniqueIdentifier
    }
    else if (paymentDetails?.hasOwnProperty(paymentMethod.NetBanking)) {
        bank = paymentDetails.nb?.bankName
    }
    else if (paymentDetails?.hasOwnProperty(paymentMethod.Wallet)) {
        issuer = paymentDetails.wallet?.bankName
    }

    const depositTime : string = DatetimeUtil.getUTCDate(new Date(Date.now())).toISOString();

    return {
        amount: order?.amount,
        promoCode: order?.orderMetaData?.promo,
        transactionId: order?.orderId,
        paymentMethod: order?.paymentMethodType,
        paymentVendor: order?.paymentMethod,
        paymentGateway: paymentGateway.JUSPAY,
        reason: order?.gateWay?.errorMessage,
        addCashCount: addCashSummary?.addCashCount,
        isDepositFirstTime: (addCashSummary?.addCashCount === 1 ?? false),
        bank: bank,
        issuer: issuer,
        vpa: vpa,
        uniqueIdentifier: uniqueIdentifier,
        scheme: scheme,
        bin: bin,
        transactionDate: order?.orderCreatedAt,
        appVersionName: order?.orderMetaData?.deviceInfo?.appVersionName,
        osVersion: order?.orderMetaData?.deviceInfo?.osVersion,
        platform: order?.orderMetaData?.deviceInfo?.platform,
        clientIpAddress: order?.orderMetaData?.deviceInfo?.clientIpAddress,
        phoneNumber: userDetails?.mobile,
        email: userDetails?.email,
        depositTime: depositTime,
    }
}

export const checkPayinRefundStatus = (order: any) => {
    const isOrderSuccess: boolean = order.status == payinOrderStatus.SUCCESS;
    const isOrderFailure: boolean = (order.status == payinOrderStatus.ABANDONED || order.status == payinOrderStatus.AUTHENTICATION_FAILED || order.status == payinOrderStatus.AUTHORIZATION_FAILED || order.status == payinOrderStatus.FAILED);
    return {isOrderSuccess, isOrderFailure};
}

export const checkPayinRefundStatusV2 = (order: any) => {
    const isOrderSuccess: boolean = order.status == payinRefundOrderStatus.SUCCESS;
    const isOrderFailure: boolean = order.status == payinRefundOrderStatus.FAILURE;
    return {isOrderSuccess, isOrderFailure};
}

const getSavedCardPaymentDetails = (vendorId) => {
    const errorText: string = configService.getSavedCardPaymentDetailsConfigForVendor()[vendorId].errorText;
    const showDisabled: boolean = configService.getSavedCardPaymentDetailsConfigForVendor()[vendorId].showDisabled;
    const blockedCards: any[] = configService.getSavedCardPaymentDetailsConfigForVendor()[vendorId].blockedCards;
    logger.info(`inside [payin-util] [getSavedCardPaymentDetails] ${JSON.stringify({
        errorText,
        showDisabled,
        blockedCards
    })}`);
    return {errorText, showDisabled, blockedCards};
}
const getCardDetails = (card, vendorId: string) => {
    const cardNumber = card.cardNumber;
    const cardIssuer = card.cardIssuer;
    const cardToken = card.cardToken;
    const cardType = card.cardType;
    const paymentMethodImageUrl = configService.getCardBrandImageForVendor()[vendorId].cards[card.cardBrand] || '';
    return {cardNumber, cardIssuer, cardToken, cardType, paymentMethodImageUrl}
}
const getUserSavedCards = (userPreferredPayinMethods: any, vendorId: string): any[] => {
    logger.info(userPreferredPayinMethods, 'got these as preferred payment modes')
    if (userPreferredPayinMethods) {
        return (userPreferredPayinMethods?.cards?.list || []).map((card: any) => {
            logger.info(`inside [payin-util] [getUserSavedCards] card:: ${JSON.stringify(card)}`);
            const cardDetails: CardDetails = getCardDetails(card, vendorId);
            logger.info(`inside [payin-util] [getUserSavedCards] cardDetails:: ${JSON.stringify(cardDetails)}`);
            return cardDetails;
        });
    }
    return [];
}

const getSavedCardsPaymentModeTypeDetails = (vendorId: string) => {
    const offerText: string = configService.getSavedCardsPaymentModeTypeDetailsForVendor()[vendorId].offerText;
    const errorText: string = configService.getSavedCardsPaymentModeTypeDetailsForVendor()[vendorId].errorText;
    const showDisabled: boolean = configService.getSavedCardsPaymentModeTypeDetailsForVendor()[vendorId].showDisabled;
    logger.info(`inside [payin-util] [getSavedCardsPaymentModeTypeDetails] ${JSON.stringify({
        offerText,
        errorText,
        showDisabled
    })}`);
    return {offerText, errorText, showDisabled};
}

const getUserSavedCardDetails = (userPreferredPayinMethods, vendorId: string) => {
    const paymentMode = paymentModes.savedCards;
    const paymentModeType = getUserSavedCards(userPreferredPayinMethods, vendorId);
    const paymentModeTypeDetails = getSavedCardsPaymentModeTypeDetails(vendorId);
    const paymentModeDetails = getSavedCardPaymentDetails(vendorId);
    return {paymentMode, paymentModeType, paymentModeTypeDetails, paymentModeDetails}
}

const getFeaturedBankDetails = (allAvailablePayinMethods, payinMethodsDowntime, vendorId: string) => {
    // finding all the net banking methods first from the list
    return allAvailablePayinMethods.filter(method => method.methodType === payinPaymentMethodTypes.NET_BANKING).
        // iterating on all the net banking methods to create the list
        map(method => {
            logger.info(`inside [payin-util] [extractPayinPaymentMethods] method :: ${JSON.stringify(method)}`);
            // getting the list of featured banks from zk
            const featuredBanks = configService.getBankListForVendor()[vendorId].featuredBanks;
            logger.info(`inside [payin-util] [extractPayinPaymentMethods] featuredBanks :: ${JSON.stringify(featuredBanks)}`);
            // if the current method is in featured bank list set the details which are to be given to the ui
            if (featuredBanks.filter(bank => bank == method.pspPaymentCode).length) {
                const bankDetails: BankDetails = {};
                bankDetails.bankName = method.name;
                bankDetails.bankCode = method.pspPaymentCode;
                bankDetails.paymentMethodImageUrl = configService.getNetBankingConfigForVendor()[vendorId].paymentMethodImageUrl[method.pspPaymentCode] || '';
                bankDetails.offerText = configService.getNetBankingConfigForVendor()[vendorId].offerText || '';
                // check for downtime
                const downTimeDetails: any[] = payinMethodsDowntime.filter(methodDowntime => methodDowntime.pspPaymentCode === method.pspPaymentCode);
                logger.info(`inside [payin-util] [extractPayinPaymentMethods] downTimeDetails :: ${JSON.stringify(downTimeDetails)}`);
                bankDetails.showDisabled = downTimeDetails.length ? downTimeDetails[0].isPaymentModeDown : false;
                bankDetails.errorText = downTimeDetails.length ? downTimeDetails[0].alertMessage : "";
                return bankDetails;
            }
        }).
        // remove all the null values from the final array as map may insert some null values in the final array
        filter(method => method != null);
}

const getWalletMethods = (allAvailablePayinMethods, payinMethodsDowntime, vendorId: string) => {
    const walletMethods: string[] = configService.getUserAvailableWalletMethodsForVendor()[vendorId].methods;
    logger.info("wallet methods", walletMethods);
    return allAvailablePayinMethods.map((method) => {
        // if the method is paytm we send it as paytm is only supported eallet as of now
        logger.info(`inside [payin-util] [getWalletMethods] method  yay :: ${JSON.stringify(method)}`);

        if (method.methodType == payinPaymentMethodTypes.WALLET && walletMethods.includes(method.method)) {
            logger.info(`inside [payin-util] [getWalletMethods] found available wallet`);
            const walletMethod: any = {};
            walletMethod.name = configService.getUserAvailableWalletMethodsForVendor()[vendorId].walletName[method.method];
            walletMethod.displayName = method.name;
            walletMethod.paymentMethodImageUrl = configService.getWalletPaymentModeTypeConfigForVendor()[vendorId].paymentMethodImageUrl[method.method] || '';
            walletMethod.offerText = configService.getWalletPaymentModeTypeConfigForVendor()[vendorId].offerText[method.method] || '';
            const downTimeDetails: any[] = payinMethodsDowntime.filter((downTimeMethod: any) => method.method === downTimeMethod.method);
            logger.info(`inside [payin-util] [getWalletMethods] downTimeDetails :: ${JSON.stringify(downTimeDetails)}`);
            walletMethod.showDisabled = downTimeDetails.length ? downTimeDetails[0].isPaymentModeDown : false;
            walletMethod.errorText = downTimeDetails.length ? downTimeDetails[0].alertMessage : "";
            logger.info(`inside [payin-util] [getWalletMethods] walletMethod :: ${JSON.stringify(walletMethod)}`);
            return walletMethod
        }
    }).
        // remove all the null values from the array
        filter(method => method != null);
}

const getAllBankList = (allAvailablePayinMethods, payinMethodsDowntime, vendorId: string) => {
    // filter on all banks available for net banking
    return allAvailablePayinMethods.filter(method => method.methodType === payinPaymentMethodTypes.NET_BANKING).map(method => {
        logger.info(`inside [payin-util] [extractPayinPaymentMethods] method :: ${JSON.stringify(method)}`);
        const bankList = configService.getBankListForVendor()[vendorId].banks;
        logger.info(`inside [payin-util] [extractPayinPaymentMethods] bankList :: ${JSON.stringify(bankList)}`);
        if (bankList.filter(bank => bank == method.pspPaymentCode).length) {
            logger.info(`inside [payin-util] [extractPayinPaymentMethods] pspPaymentCode :: ${method.pspPaymentCode}`);
            const bankDetails: BankDetails = {};
            bankDetails.bankName = method.name;
            bankDetails.bankCode = method.pspPaymentCode;
            bankDetails.paymentMethodImageUrl = configService.getNetBankingConfigForVendor()[vendorId].paymentMethodImageUrl[method.pspPaymentCode] || '';
            bankDetails.offerText = configService.getNetBankingConfigForVendor()[vendorId].offerText;
            const downTimeDetails: any[] = payinMethodsDowntime.filter(methodDowntime => methodDowntime.pspPaymentCode === method.pspPaymentCode);
            logger.info(`inside [payin-util] [extractPayinPaymentMethods] downTimeDetails :: ${downTimeDetails}`);
            bankDetails.showDisabled = downTimeDetails.length ? downTimeDetails[0].isPaymentModeDown : false;
            bankDetails.errorText = downTimeDetails.length ? downTimeDetails[0].alertMessage : "";
            return bankDetails;
        }
    }).// remove all the null values from the array
        filter(method => method != null);
}

export const extractPayinPaymentMethods = (allAvailablePayinMethods: PayinPaymentMethod[], userPreferredPayinMethods: any, payinMethodsDowntime: any[], platform: string, vendorId: string): PaymentMethodsList => {
    const paymentMethods: any[] = [];
    logger.info(`inside [payin-util] [extractPayinPaymentMethods] allAvailablePayinMethods :: ${JSON.stringify(allAvailablePayinMethods)}  payinMethodsDowntime :: ${JSON.stringify(payinMethodsDowntime)} userPreferredPayinMethods :: ${JSON.stringify(userPreferredPayinMethods)}`);
    // add upi intent
    const upiIntentMethods: PaymentMode = configService.getUpiIntentForVendor()[vendorId];
    const upiIntent: PaymentMode = getUpiIntentDowntimes(upiIntentMethods,payinMethodsDowntime);
    paymentMethods.push(upiIntent);

    // add wallets
    const walletDetails: PaymentMode = {
        paymentMode: paymentModes.wallet,
        paymentModeDetails: configService.getWalletPaymentModeDetailsForVendor()[vendorId],
    };
    walletDetails.paymentModeType = getWalletMethods(allAvailablePayinMethods, payinMethodsDowntime, vendorId)
    paymentMethods.push(walletDetails);
    logger.info(`inside [payin-util] [extractPayinPaymentMethods] paymentMethods :: ${JSON.stringify(paymentMethods)}`);

    // add saved cards
    const savedCardsDetails: PaymentMode = getUserSavedCardDetails(userPreferredPayinMethods, vendorId);
    logger.info(`inside [payin-util] [extractPayinPaymentMethods] savedCardsDetails :: ${JSON.stringify(savedCardsDetails)}`);
    paymentMethods.push(savedCardsDetails);



    // add netbanking
    const netBankingDetails: PaymentMode = {
        paymentMode: paymentModes.NetBanking,
        paymentModeDetails: configService.getNbPaymentModeDetailsForVendor()[vendorId],
        paymentModeTypeDetails: {},
        paymentModeType: [],
    };
    // in net banking there are 2 things one is featured banks and the other is the list of all the available banks
    const featuredBankList: any = {};
    // adding all the featured banks
    featuredBankList.name = "featured_bank_list";
    featuredBankList.details = getFeaturedBankDetails(allAvailablePayinMethods, payinMethodsDowntime, vendorId);
    netBankingDetails.paymentModeType.push(featuredBankList);

    const bankList: any = {};
    // adding all other bank list
    bankList.name = "bank_list";
    bankList.details = getAllBankList(allAvailablePayinMethods, payinMethodsDowntime, vendorId);
    netBankingDetails.paymentModeType.push(bankList);
    logger.info(`inside [payin-util] [extractPayinPaymentMethods] netBankingDetails :: ${netBankingDetails}`);
    paymentMethods.push(netBankingDetails);

    logger.info(`<-------------------------------printing final details --------------------------------------->`);
    logger.info(`inside [payin-util] [extractPayinPaymentMethods] paymentMethods :: ${paymentMethods}`);
    logger.info(`<-------------------------------printing final details --------------------------------------->`);
    const paymentMethodsMapping = configService.getPaymentModeMappingForVendor()[vendorId];
    return {
        paymentMethodsMapping,
        paymentMethodsList: paymentMethods
    };
}

const getUpiIntentDowntimes = (upiIntentMethods: PaymentMode,payinMethodsDowntime: any[]): PaymentMode => {
    const upiIntent: PaymentMode = {
        paymentMode: upiIntentMethods.paymentMode,
        paymentModeDetails: upiIntentMethods.paymentModeDetails,
        paymentModeTypeDetails: upiIntentMethods.paymentModeTypeDetails
    }
    upiIntent.paymentModeType = [{
        type: upiIntentMethods.paymentModeType[0].type,
        errorText:"",
        showDisabled:false,
        details:(upiIntentMethods.paymentModeType[0]?.details || []).map((paymentMode) => {
            const downTimeDetails: any[] = payinMethodsDowntime.filter(methodDowntime => methodDowntime.pspPaymentCode === paymentMode?.ios_pn || methodDowntime.pspPaymentCode === paymentMode?.android_pn);
            logger.info(`inside [payin-util] [getUpiIntentDowntimes] downTimeDetails :: ${downTimeDetails}`);
            paymentMode.showDisabled = downTimeDetails.length ? downTimeDetails[0].isPaymentModeDown : false;
            paymentMode.errorText = downTimeDetails.length ? downTimeDetails[0].alertMessage : "";
            return paymentMode;
        }),
    }];
    return upiIntent;
}

export const extractInitiateOrderUserResponse = (orderResponse, tenetCustomerId: string) => {
    const params: any = orderResponse?.postParams;
    params.firstname = orderResponse?.postParams.name;
    params.customerId = tenetCustomerId;
    params.juspay = {};
    params.juspay.client_auth_token = "";
    if (orderResponse?.postParams && orderResponse?.postParams?.token?.clientAuthToken) {
        params.juspay.client_auth_token = orderResponse?.postParams?.token?.clientAuthToken;
    }
    const paymentGateway: number = orderResponse?.pspId;
    params.url = orderResponse?.paymentLinks?.iframeLink;
    const url: string = params.url;
    return {params, paymentGateway, url};
}

export const createUserOrderDetails = (orderDetails: any, addCashCount: number) => {
    const status: number = orderDetails?.status === "SUCCESS" ? 1 : 0;
    const orderId: string = orderDetails?.orderId ?? "";
    const amount: number = orderDetails?.amount ?? 0;
    const userId: number = Number(orderDetails?.uniqueRef);
    const orderStatus: string = status ? "success" : "fail";
    const message: string = orderDetails?.errorMsg;
    const utr: string = orderDetails?.orderId ?? "";
    const promoCode: string = orderDetails?.orderMetaData?.promo
    const transactionTime: string = DatetimeUtil.getTzTime(orderDetails.createdAt);
    const successfulTransactionCount: number = addCashCount ?? 0
    const userOrderDetails: UserOrderDetails = {
        status,
        orderId,
        amount,
        successfulTransactionCount,
        userId,
        orderStatus,
        message,
        utr,
        promoCode,
        transactionTime,
    }
    return userOrderDetails;
}
/*{
    transactionId: 'abcawoihjfiawnfioanfilenveioanvsjlvnzdjvnsdufgnseouifneiuofsealifjalaeugh;oifnsejvnws',
    createdAt: '2023-09-13T12:29:21Z',
    updatedBuyInValue: 123,// current add cash value after this add cash --> kha se laenge ye kyunki change hoti rhegi
    transactionLabel: 'Join Table Successful',
    transactionType: CASH_TRANSACTION_TYPES.ADD_CASH,
    type: 'debit',
    status: 20,
    transactionAmount: 1000,
    addCashData: {
      buyInValue: 1001, // current add cash amount - gst + discount credit
      addCashAmount: 1000,
      gst: 219,
      discountCredit: 220,
      tournamentDiscountCredit: 10000,
    }
};*/

const getOrderTransactionLabel = (status: number, amount: number): string => {
    const orderStatus: number = SUPERNOVA_PAYIN_TRANSACTION_STATUS_MAPPER[status];
    return String(ADD_CASH_TRANSACTION_LABEL[orderStatus]).replace("{amount}", `${amount}`);
}
export const createUserOrder = (orderDetails: any, userTransactionDetails: any,userWalletBalance: any) => {

    const orderId: string = orderDetails?.orderId ?? "";
    const amount: number = orderDetails?.amount ?? 0;
    const transactionTime: string = DatetimeUtil.getTzTime(orderDetails.createdAt);
    const updatedBalance: number = userTransactionDetails?.updatedBuyInValue;//fill this from supernova ka order details api
    const invoiceId: string = orderDetails?.taxDetail?.invoiceId;
    const addCashAmount: number = amount;// this is the amount user has added right or the amt after taxes?
    const gstAmount: number = orderDetails?.taxDetail?.totalTax;
    const discountCreditAmount: number = userTransactionDetails?.addCashData?.discountCredit;// get the order details from supernova and fill this
    const buyInAmount: number = userTransactionDetails?.addCashData?.buyInValue; // this buy in for the current tranxn
    const tournamentDiscountCreditAmount: number = userTransactionDetails?.addCashData?.tournamentDiscountCredit;// get the order details from supernova and fill this
    const addCashData: AddCashData = userTransactionDetails.addCashData
    const transactionLabel: string = getOrderTransactionLabel(orderDetails?.status, amount);
    const userOrderDetails: UserOrder = {
        transactionId: orderId,
        createdAt: transactionTime,
        updatedBuyInValue: updatedBalance,
        transactionType: CASH_TRANSACTION_TYPES.ADD_CASH,
        transactionLabel: transactionLabel,
        type: USER_TRANSACTION_TYPE.CREDIT,
        status: SUPERNOVA_PAYIN_TRANSACTION_STATUS_MAPPER[orderDetails?.status],
        transactionAmount: amount,
    }
    // only send this key if the order was successful
    if(payinOrderStatus.SUCCESS == orderDetails?.status){
        userOrderDetails.addCashData = addCashData
    }
    return userOrderDetails;
}

export const createUserOrderDetailsV2 = (orderDetails: any, addCashCount: number, userTransactionDetails: UserTransactionDetails,userWalletBalance: UserWalletBalanceV2) => {
    const status: number = orderDetails?.status === "SUCCESS" ? 1 : 0;
    const orderId: string = orderDetails?.orderId ?? "";
    const amount: number = orderDetails?.amount ?? 0;
    const userId: number = Number(orderDetails?.uniqueRef);
    const orderStatus: string = status ? "success" : "fail";
    const message: string = orderDetails?.errorMsg;
    const utr: string = orderDetails?.orderId ?? "";
    const promoCode: string = orderDetails?.orderMetaData?.promo
    const transactionTime: string = DatetimeUtil.getTzTime(orderDetails.createdAt);
    const successfulTransactionCount: number = addCashCount ?? 0
    const updatedBalance: number = Number(userWalletBalance.currentBalance);
    const invoiceId: string = orderDetails?.taxDetail?.invoiceId;
    const addCashAmount: number = amount;// this is the amount user has added
    const gstAmount: number = orderDetails?.taxDetail?.totalTax;
    const discountCreditAmount: number = userTransactionDetails?.addCashData?.discountCredit || 0
    const userOrderDetails: UserOrderDetailsV2 = {
        status,
        orderId,
        amount,
        successfulTransactionCount,
        userId,
        orderStatus,
        message,
        utr,
        promoCode,
        transactionTime,
        discountCreditAmount,
        updatedBalance,
        invoiceId,
        addCashAmount,
        gstAmount,
        ...userTransactionDetails.addCashData
    }
    return userOrderDetails;
}

export const processUserTransactionsForRefund = (userTransactions: any[], userDepositBalance: number) => {
    let cummulativeDepositBalance: number = 0;
    const userRefundOrderDetails: RefundOrder[] = [];
    logger.info(`inside [payinUtil] [processUserTransactionsForRefund] userTransactions :: ${JSON.stringify(userTransactions)} `);
    if (userTransactions.length && userDepositBalance > cummulativeDepositBalance) {
        for (let transaction: number = 0; transaction < userTransactions.length; transaction++) {
            logger.info(`inside [payinUtil] [processUserTransactionsForRefund] checking for transaction number :: ${transaction} userDepositBalance :: ${userDepositBalance}`);
            if (cummulativeDepositBalance >= userDepositBalance) {
                logger.info(`inside [payinUtil] [processUserTransactionsForRefund] cummulativeDepositBalance :: ${cummulativeDepositBalance} `);
                break;
            }
            const currentOrderRefundAmount: number = Number(userTransactions[transaction].amount) - Number(userTransactions[transaction].amtRefunded);
            logger.info(`inside [payinUtil] [processUserTransactionsForRefund] currentOrderRefundAmount :: ${currentOrderRefundAmount} `);
            const currentCummulativeRefundAmount: number = Math.min(cummulativeDepositBalance + currentOrderRefundAmount, userDepositBalance);
            logger.info(`inside [payinUtil] [processUserTransactionsForRefund] currentCummulativeRefundAmount :: ${currentCummulativeRefundAmount} `);
            const amountAddedForRefund: number = Math.min(currentOrderRefundAmount, userDepositBalance - cummulativeDepositBalance);
            logger.info(`inside [payinUtil] [processUserTransactionsForRefund] amountAddedForRefund :: ${amountAddedForRefund} `);
            cummulativeDepositBalance = currentCummulativeRefundAmount;
            logger.info(`inside [payinUtil] [processUserTransactionsForRefund] finally cummulativeDepositBalance :: ${cummulativeDepositBalance} `);
            if (amountAddedForRefund) {
                const refundOrder: RefundOrder = {};
                refundOrder.transactionId = userTransactions[transaction].orderId;
                refundOrder.amount = amountAddedForRefund;
                logger.info(`inside [payinUtil] [processUserTransactionsForRefund] fpushing refundOrder :: ${JSON.stringify(refundOrder)} `);
                userRefundOrderDetails.push(refundOrder);
            }
        }
    }
    else {
        return [];
    }
    if (cummulativeDepositBalance < userDepositBalance) {
        logger.info(`inside [payinUtil] [processUserTransactionsForRefund] refund amount mismatch`);
        //todo: alert in monitoring for anomaly
    }
    return userRefundOrderDetails;
}

export const processUserTransactionsForRefundV2 = (userTransactions: any[], userDepositBalance: number) => {
    let cummulativeDepositBalance: number = 0;
    const userRefundOrderDetails: RefundOrderV2[] = [];
    const userRefundDcsDetails: UserRefundDcsAmountRequest[] = [];
    logger.info(`inside [payinUtil] [processUserTransactionsForRefundV2] userTransactions :: ${JSON.stringify(userTransactions)} `);
    if (userTransactions.length && userDepositBalance > cummulativeDepositBalance) {
        for (let transaction: number = 0; transaction < userTransactions.length; transaction++) {
            logger.info(`inside [payinUtil] [processUserTransactionsForRefundV2] checking for transaction number :: ${transaction} userDepositBalance :: ${userDepositBalance}`);
            if (cummulativeDepositBalance >= userDepositBalance) {
                logger.info(`inside [payinUtil] [processUserTransactionsForRefundV2] cummulativeDepositBalance :: ${cummulativeDepositBalance} `);
                break;
            }
            // change .amount with amount after deducting gst
            const currentOrderRefundAmount: number = Number(userTransactions[transaction].eligibleRefundAmount);
            logger.info(`inside [payinUtil] [processUserTransactionsForRefundV2] currentOrderRefundAmount :: ${currentOrderRefundAmount} `);
            const currentCummulativeRefundAmount: number = Math.min(cummulativeDepositBalance + currentOrderRefundAmount, userDepositBalance);
            logger.info(`inside [payinUtil] [processUserTransactionsForRefundV2] currentCummulativeRefundAmount :: ${currentCummulativeRefundAmount} `);
            const amountAddedForRefund: number = Math.min(currentOrderRefundAmount, userDepositBalance - cummulativeDepositBalance);
            logger.info(`inside [payinUtil] [processUserTransactionsForRefundV2] amountAddedForRefund :: ${amountAddedForRefund} `);
            cummulativeDepositBalance = currentCummulativeRefundAmount;
            logger.info(`inside [payinUtil] [processUserTransactionsForRefundV2] finally cummulativeDepositBalance :: ${cummulativeDepositBalance} `);
            const refundOrder: RefundOrderV2 = {};
            refundOrder.transactionId = userTransactions[transaction].orderId;
            refundOrder.amount = Parser.parseToTwoDecimal(amountAddedForRefund);
            refundOrder.depositedAmount = userTransactions[transaction].amount;
            refundOrder.gstAmount = userTransactions[transaction].taxDetail.totalTax
            logger.info(`inside [payinUtil] [processUserTransactionsForRefundV2] fpushing refundOrder :: ${JSON.stringify(refundOrder)} `);
            userRefundOrderDetails.push(refundOrder);
            const refundDcsOrder: UserRefundDcsAmountRequest = {
                transactionId:userTransactions[transaction].orderId,
                amount:Parser.parseToTwoDecimal(userTransactions[transaction].amount),
                gstDeductedAmount: userTransactions[transaction].taxDetail.taxableAmount || Parser.parseToTwoDecimal(userTransactions[transaction].amount),
                refundAmountRequested: Parser.parseToTwoDecimal(amountAddedForRefund)
            };
            logger.info(`inside [payinUtil] [processUserTransactionsForRefundV2] fpushing refundDcsOrder :: ${JSON.stringify(refundDcsOrder)} `);
            userRefundDcsDetails.push(refundDcsOrder)
        }
    }
    else {
        return {userRefundOrderDetails:[],userRefundDcsDetails:[]};
    }
    if (cummulativeDepositBalance < userDepositBalance) {
        logger.info(`inside [payinUtil] [processUserTransactionsForRefundV2] refund amount mismatch`);
        //todo: alert in monitoring for anomaly
    }

    return {userRefundOrderDetails,userRefundDcsDetails};
}

const getUserTdsDetails = (refundableAmount: number, taxLiability: number, netRefundedAmount: number, userRefundTdsDetails: UserRefundData[]): UserTdsDetails => {
    const userTdsDetails: any = {
        refundRequestedAmount: refundableAmount,
        tdsApplicable: taxLiability,
        totalWithdrawalRequestedAmount: userRefundTdsDetails.length && userRefundTdsDetails[0]?.tdsSnapshot ? userRefundTdsDetails[0]?.tdsSnapshot?.totalWithdrawalRequestedAmount : 0,
        totalDepositAmount: userRefundTdsDetails.length && userRefundTdsDetails[0]?.tdsSnapshot ? userRefundTdsDetails[0]?.tdsSnapshot?.totalDepositAmount : 0,
        totalPreviousTaxedAmount: userRefundTdsDetails.length ? userRefundTdsDetails[0]?.tdsSnapshot?.totalPreviousTaxedAmount : 0
    }
    const totalInclusiveRefundAmount: number = userTdsDetails.refundRequestedAmount + (userRefundTdsDetails.length && userRefundTdsDetails[0]?.tdsSnapshot ? userRefundTdsDetails[0]?.tdsSnapshot.totalRefundAmount : 0);
    const netWinnings: number = userTdsDetails.totalWithdrawalRequestedAmount + totalInclusiveRefundAmount - userTdsDetails.totalDepositAmount;
    const totalTaxableWinnings: number = netWinnings - userTdsDetails.totalPreviousTaxedAmount;
    const fiscalYear: string = userRefundTdsDetails.length && userRefundTdsDetails[0]?.tdsSnapshot ? userRefundTdsDetails[0].tdsSnapshot.fiscalYear : '';
    const tdsPercentage: number = userRefundTdsDetails.length ? userRefundTdsDetails[0].tdsPercentage : 0;
    return {
        ...userTdsDetails,
        totalInclusiveRefundAmount,
        netWinnings,
        totalTaxableWinnings,
        fiscalYear,
        tdsPercentage,
        netRefundedAmount
    }

}

export const formulateUserRefundResponse = (userDepositBalance: number, userRefundTdsDetails: UserRefundData[]) => {
    const userRefundResponse: any = {};
    // add deposit details
    userRefundResponse.depositAmount = userDepositBalance;
    let refundableAmount: number = 0, taxLiability: number = 0, netRefundedAmount: number = 0;
    // add refun Details array which is to be sent back by the ui
    const refundDetails: any[] = [];
    const refundTdsSnapshots: TdsSnapshot[] = [];
    (userRefundTdsDetails || []).map((tdsEntry: UserRefundData) => {
        refundableAmount += tdsEntry?.refundRequestedAmount;
        taxLiability += tdsEntry?.tdsApplicable;
        netRefundedAmount += tdsEntry?.amountToBeCredit;
        // push the details required for refundDetails array
        refundDetails.push({
            refundAmount: tdsEntry?.refundRequestedAmount,
            transactionId: tdsEntry?.refundTransactionId,
            tdsTransactionId: tdsEntry?.tdsTransactionId
        });
        // push the tds snapshots for the ui
        refundTdsSnapshots.push(tdsEntry.tdsSnapshot);
    });
    /*
    {
        A: SUM(refundRequestedAmount)
        B: SUM(tdsApplicable)
        C: array[0].totalWithdrawalRequestedAmount
        D array[0].totalDepositAmount
        E: array[0].totalRefundAmount + A
        F: C+E-D --> netWinnings
        G: array[0].totalPreviousTaxedAmount
        H: F-G --> totalTaxableWinnings
        I: B
        J: SUM(amountToBeCredit)  --> netRefundedAmount
    }
    */
    userRefundResponse.refundableAmount = refundableAmount; // SUM(refundRequestedAmount)
    userRefundResponse.taxLiability = taxLiability; // SUM(tdsApplicable)
    userRefundResponse.netRefundAmount = netRefundedAmount;// SUM(amountToBeCredit)
    userRefundResponse.refundDetails = refundDetails;
    userRefundResponse.tdsInformation = getUserTdsDetails(refundableAmount, taxLiability, netRefundedAmount, userRefundTdsDetails);
    logger.info(`inside [payinUtil] [formulateUserRefundResponse]got userRefundResponse :: ${JSON.stringify(userRefundResponse)}`);
    return userRefundResponse;
}

const getRefundDcsDeductionAmount = (transactionId: string,userRefunDcsOrderDetails: UserRefundDcsAmountsDetails[]): number => {
    const refundOrderDetail:UserRefundDcsAmountsDetails[] = userRefunDcsOrderDetails.filter(dcsOrder => dcsOrder.transactionId == transactionId);
    logger.info(refundOrderDetail)
    if(refundOrderDetail.length){
        return refundOrderDetail[0].dcsRefundableAmount;
    }
    return 0;

}
const getPayinOrderDetails = (transactionDetails: any[], transactionId: string) => {
    const refundOrderDetail:UserRefundDcsAmountsDetails[] =transactionDetails.filter(order => order.orderId == transactionId);
    if(refundOrderDetail.length){
        return refundOrderDetail[0];
    }
    return {};

}

export const formulateUserRefundResponseV2 = (userDepositBalance: number, userRefundTdsDetails: UserRefundData[],userRefunDcsOrderDetails: UserRefundDcsAmountsDetails[],payinOrderDetails: any[]) => {

    const userRefundResponse:UserRefundDetails = {};
    // add deposit details
    userRefundResponse.depositAmount = userDepositBalance;// this is the add cash balance
    let refundableAmount: number = 0, taxLiability: number = 0, netRefundedAmount: number = 0;
    // add refun Details array which is to be sent back by the ui
    const refundDetails: SupernovaRefundDetailsRequest[] = [];
    const refundTdsSnapshots: TdsSnapshot[] = [];
    (userRefundTdsDetails || []).map((tdsEntry: UserRefundData) => {
        refundableAmount += tdsEntry?.refundAmountAfterGst;
        taxLiability += tdsEntry?.tdsApplicable;// same hi rhega ye toh
        netRefundedAmount += tdsEntry?.amountToBeCreditAfterGst;// new key coming up
        const orderDetails: any = getPayinOrderDetails(payinOrderDetails,tdsEntry?.refundTransactionId);
        // push the details required for refundDetails array
        const supernovaRefundDetailsRequest: SupernovaRefundDetailsRequest = {
            refundAmount: tdsEntry?.refundAmountAfterGst,
            depositedAmount: orderDetails.amount,
            gstAmount: orderDetails?.taxDetail?.totalTax,
            revertDcsAmount: getRefundDcsDeductionAmount(tdsEntry?.refundTransactionId,userRefunDcsOrderDetails),////dcs amount to be reverted
            transactionId: tdsEntry?.refundTransactionId,
            tdsTransactionId: tdsEntry?.tdsTransactionId,
            payinRefundAmount: tdsEntry?.amountToBeCreditAfterGst,
            amountAfterGst: orderDetails?.taxDetail?.taxableAmount
        }
        refundDetails.push(supernovaRefundDetailsRequest);
        // push the tds snapshots for the ui
        refundTdsSnapshots.push(tdsEntry.tdsSnapshot);
    });
    /*
    {
        A: SUM(refundRequestedAmount)
        B: SUM(tdsApplicable)
        C: array[0].totalWithdrawalRequestedAmount
        D array[0].totalDepositAmount
        E: array[0].totalRefundAmount + A
        F: C+E-D --> netWinnings
        G: array[0].totalPreviousTaxedAmount
        H: F-G --> totalTaxableWinnings
        I: B
        J: SUM(amountToBeCredit)  --> netRefundedAmount
    }
    */
    userRefundResponse.refundableAmount = refundableAmount; // SUM(refundRequestedAmount)
    userRefundResponse.taxLiability = taxLiability; // SUM(tdsApplicable)
    userRefundResponse.netRefundedAmount = netRefundedAmount;// SUM(amountToBeCredit)
    userRefundResponse.refundDetails = refundDetails;
    let netDcsDeductionApplicable: number = 0;
    userRefunDcsOrderDetails.map(dcsOrder => {
        if(dcsOrder.dcsRefundableAmount){
            netDcsDeductionApplicable += dcsOrder.dcsRefundableAmount;
        }
    })
    userRefundResponse.netDcsDeductionApplicable = netDcsDeductionApplicable;
    userRefundResponse.tdsInformation = getUserTdsDetails(refundableAmount, taxLiability, netRefundedAmount, userRefundTdsDetails);
    logger.info(`inside [payinUtil] [formulateUserRefundResponse]got userRefundResponse :: ${JSON.stringify(userRefundResponse)}`);
    return userRefundResponse;
}

export const checkUserRefundEligibilty = (userKycDetails: UserKycDetails, userProfile: IDMUserProfile) => {
    // check if the user if eligible for refund
    // check if the user has done the kyc
    // check if the user has a verified email
    if (userKycDetails.userKycStatus.pan == GUARDIAN_DOCUMENT_STATUS.VERIFIED &&
        userKycDetails.userKycStatus.bank == GUARDIAN_DOCUMENT_STATUS.VERIFIED &&
        userProfile.emailStatus == EMAIL_VERIFICATION_STATUS.VERIFIED
        ) {
        return true;
    }
    return false;
}

export const getUserAddCashHistoryResponse = (userOrders: any[]) => {
    const addCashHistory: UserTransactionSummary[] = [];
    (userOrders || []).map(order => {
        addCashHistory.push({
            transactionType: CASH_TRANSACTION_TYPES.ADD_CASH,
            createdAt: DatetimeUtil.getTzTime(order.createdAt),
            id: order?.orderId || '',
            status: SUPERNOVA_PAYIN_TRANSACTION_STATUS_MAPPER[order.status],
            amount: order?.amount || 0,
            type: USER_TRANSACTION_TYPE.CREDIT,
            transactionTypeLabel: TRANSACTION_LABEL[`${CASH_TRANSACTION_TYPES.ADD_CASH}`]
        });
    })
    return addCashHistory;
}
export const getUserAddCashHistoryResponseV2 = (userOrders: any[]) => {
    const addCashHistory: UserTransactionSummary[] = [];
    (userOrders || []).map(order => {
        addCashHistory.push({
            transactionType: CASH_TRANSACTION_TYPES.ADD_CASH,
            createdAt: DatetimeUtil.getTzTime(order.createdAt),
            id: order?.orderId || '',
            status: SUPERNOVA_PAYIN_TRANSACTION_STATUS_MAPPER[order.status],
            amount: order?.amount || 0,
            type: USER_TRANSACTION_TYPE.CREDIT,
            transactionTypeLabel: TRANSACTION_LABEL[`${CASH_TRANSACTION_TYPES.ADD_CASH}`],
            isNewTxn: true
        });
    })
    return addCashHistory;
}

export const getUserAddCashMsHistoryResponse = (transactions: any[]) => {
    return transactions.map((transaction) => {
        return {
            "transactionType": CASH_TRANSACTION_TYPES.ADD_CASH,
            "createdAt": transaction.tr_time,
            "id": transaction.tr_id,
            "status": MS_ADD_CASH_TRANSACTION_STATUS_MAPPER[transaction.status],
            "amount": transaction.amount,
            "type": USER_TRANSACTION_TYPE.CREDIT,
            "transactionTypeLabel": TRANSACTION_LABEL[`${CASH_TRANSACTION_TYPES.ADD_CASH}`],
        };
    });
}

export const getUserRefundHistoryResponse = (refundOrders) => {
    const refundHistory: UserTransactionSummary[] = [];
    (refundOrders || []).map((order) => {
        refundHistory.push({
            transactionType: CASH_TRANSACTION_TYPES.REFUND_CASH,
            createdAt: DatetimeUtil.getTzTime(order.createdAt),
            id: order?.refundId || '',
            status: SUPERNOVA_PAYIN_TRANSACTION_STATUS_MAPPER[order.status],
            amount: order?.amount || 0,
            type: USER_TRANSACTION_TYPE.DEBIT,
            transactionTypeLabel: TRANSACTION_LABEL[`${CASH_TRANSACTION_TYPES.REFUND_CASH}`],
            isNewTxn: false
        });
    })
    return refundHistory;
}

export const getUserRefundMsHistoryResponse = (transactions: any[]) => {
    return transactions.map((transaction) => {
        return {
            "transactionType": CASH_TRANSACTION_TYPES.REFUND_CASH,
            "createdAt": transaction.tr_time,
            "id": transaction.tr_id,
            "status": MS_REFUND_TRANSACTION_STATUS_MAPPER[transaction.status],
            "amount": transaction.amount,
            "type": USER_TRANSACTION_TYPE.DEBIT,
            "transactionTypeLabel": TRANSACTION_LABEL[`${CASH_TRANSACTION_TYPES.REFUND_CASH}`],
        };
    });
}

export const invalidCardResponse: PaymentModeValidationResponse = {
    isModeValid: false,
}

export const validCardResponse : PaymentModeValidationResponse = {
    isModeValid: true
}

export const validateCardPaymentMode = (card: CardBinDetails,vendorId: string) => {
    if(configService.getBannedCardBrandForVendor()[vendorId].filter((brand: string) => brand == card.cardBrand).length){
        return invalidCardResponse;
    }
    return validCardResponse;
}
