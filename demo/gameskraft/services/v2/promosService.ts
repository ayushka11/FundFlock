import PromosClient from '../../clients/promosClient';
import {PAGINATION, PROMISE_STATUS} from '../../constants/constants';

import {IPromoQueryConditions, UserPromoQueryRequest} from '../../models/promos/request';
import {UserWalletBalanceV2} from '../../models/supernova/response';
import LoggerUtil from '../../utils/logger';
import {createRequestResponse, createUserPromosResponseV2, getExtraBenefitDetails, getPromoType, getUserAddCashAmount, getUserPromoAmount, getValidAvailablePromoCode} from '../../utils/promos-util';
import PayinService from './../payinService';
import {PAYIN_TRANSACTION_STATUS, TRANSACTIONS_SORTING_METHOD} from "../../constants/payin-constants";
import PayinServiceV2 from "./payinService";
import {TaxBreakup} from "../../models/payin/tax-breakup";
import SupernovaServiceV2 from './supernovaService';
import RoyaltyService from '../royaltyService';
import PromosService from '../promosService';
import { promoTypes } from '../../constants/promos';
import { Promotion } from '../../models/promos/promos';
import { GsService } from '../gsService';
import { Tournament } from '../../models/tournament';
import { AddCashSummary } from '../../models/payin/user-details';
import { TitanService } from '../titanService';

const async = require('async');
const configService = require('../configService');
const redisService = require('../redisService');
const logger = LoggerUtil.get("PromosServiceV2");

export default class PromosServiceV2 {

    static async getUserPromos(userId: string, payinCustomerId: string, userPromo: UserPromoQueryRequest, gstStateCode: number, vendorId: string, restClient: any,token: string): Promise<any> {
        try {
            logger.info(`inside [PromosServiceV2] [getUserPromos] userId ::  ${userId} for promoType :: ${userPromo.promoType} on amount :: ${userPromo.amount} for the gst state code :: ${gstStateCode}`);
            
            // fetch the add cash details for the user
            let transactionPageSize: number = PAGINATION.DEFAULT_NUM_OF_RECORDS,
                transactionPageNumber: number = PAGINATION.DEFAULT_PAGE_NO;
            let userTransactionsReq: any = await (Promise as any).allSettled([
                PayinService.getUserTransactions(restClient, payinCustomerId, transactionPageNumber, transactionPageSize, TRANSACTIONS_SORTING_METHOD.DESC, PAYIN_TRANSACTION_STATUS.SUCCESS, vendorId),
                PayinService.getUserAddCashSummary(userId, restClient, payinCustomerId, vendorId)
            ]);

            const [userTransactions,addCashSummaryResp]: [any[],AddCashSummary] = [userTransactionsReq[0]?.value || [],userTransactionsReq[1]?.value || {}];
            // get the amounts and check if they fit in slabs to power the packs
            userPromo.amount = Number(getUserPromoAmount(userPromo, userTransactions, vendorId));
            

            // fetch promos if there is a ntd promo available
            const conditions: IPromoQueryConditions = {addCashCount: addCashSummaryResp.addCashCount};
            let userAvailablePromo = await (Promise as any).allSettled([PromosService.getUserPromos(userId,{promoType: userPromo.promoType,conditions},restClient,vendorId)])
            logger.info("[getUserPromos] get the promos triggering ntd promo for the user :: ",userAvailablePromo);
            // no ntd promo so cehck for global or cohort based
            userAvailablePromo = userAvailablePromo[0]?.value || [];
            if(!userAvailablePromo.length){
                userAvailablePromo = await (Promise as any).allSettled([PromosService.getUserPromos(userId,{promoType: userPromo.promoType},restClient,vendorId)]);
                userAvailablePromo = userAvailablePromo[0]?.value || [];
                userAvailablePromo = getValidAvailablePromoCode(userAvailablePromo);
            }
            const promoApplicable: Promotion = userAvailablePromo.length && userAvailablePromo[0];

            // check the promo type for the given promo
            const promoType: string = getPromoType(promoApplicable);
            logger.info('[getUserPromos] got the promo type',promoType);

            // create the multipliers according to add cash amount and extra benefits
            const userAddCashAmount: number[] = getUserAddCashAmount(userPromo.amount,promoApplicable,promoType,userPromo.isDefaultAmount,vendorId);
            const extraBenefitsAmount: number[] = getExtraBenefitDetails(userAddCashAmount,promoApplicable,promoType,vendorId);
            logger.info({extraBenefitsAmount,userAddCashAmount},'[getUserPromos] got the multipliers :: ');
            
            // get the promo details
            const promoDetails: any[] = await (Promise as any).allSettled([
                SupernovaServiceV2.getUserWalletBalance(userId, restClient, vendorId),
                PayinService.getUserPreferredPaymentMethods(payinCustomerId, restClient, vendorId),
                PayinServiceV2.getUserTaxBreakup(userAddCashAmount, gstStateCode, vendorId, restClient),
                RoyaltyService.getRoyaltyDcsInfo(restClient, Number(userId), vendorId),
                RoyaltyService.getDcsAmount(restClient, Number(userId), userAddCashAmount, vendorId),
                RoyaltyService.getUserRoyaltyInfo(restClient,Number(userId)),
                PayinServiceV2.getUserTaxBreakup(extraBenefitsAmount, gstStateCode, vendorId, restClient),
                RoyaltyService.getDcsAmount(restClient, Number(userId), extraBenefitsAmount, vendorId),
                GsService.getMTTListV2(restClient,token,vendorId),
                TitanService.getTournaments(restClient,Number(vendorId))
            ]);
            logger.info(`inside [PromosServiceV2] [getUserPromos] promoDetails :: ${JSON.stringify(promoDetails)}`);

            const [userWalletDetails,
                    userPaymentMethods ,
                    userAmountTaxBreakup,
                    userRoyaltyInfo ,
                    userDcsInfo ,
                    useRoyaltyLevelInfo,
                    userExtraAmountTaxBreakup ,
                    userExtraAmountDcsInfo ,
                    tournamentDetails]  = createRequestResponse(promoDetails)
            logger.info('[getUserPromos] got the promoDetail :: ',[ userWalletDetails,
                                                                    userPaymentMethods ,
                                                                    userAmountTaxBreakup,
                                                                    userRoyaltyInfo ,
                                                                    userDcsInfo ,
                                                                    useRoyaltyLevelInfo,
                                                                    userExtraAmountTaxBreakup ,
                                                                    userExtraAmountDcsInfo ,
                                                                    tournamentDetails]);
            const userPromoResponse = createUserPromosResponseV2(useRoyaltyLevelInfo,userAmountTaxBreakup, userWalletDetails, userPaymentMethods, userRoyaltyInfo, userDcsInfo, userPromo.amount, vendorId,promoApplicable,promoType,userExtraAmountTaxBreakup,userExtraAmountDcsInfo,tournamentDetails);
            return userPromoResponse;
        } catch (e) {
            PromosClient.getErrorFromCode(e?.status?.code)
            logger.info(e,`inside [PromosService] [getUserPromos] received error from [getUserPromos] `);
            throw (e);
        }
    }
};