import {IDMUserProfile} from "../models/idm/user-idm";
import PayinClient from '../clients/payinClient';
import PromosClient from '../clients/promosClient';
import {PAGINATION, PROMISE_STATUS} from '../constants/constants';
import {promosData, Promotion} from '../models/promos/promos';
import {PromoEvent, UserPromoQueryRequest} from '../models/promos/request';
import {UserWalletBalance} from '../models/supernova/response';
import LoggerUtil from '../utils/logger';
import {createPromosResponse, formulateUserPromoResponse, getUserPromoAmount} from '../utils/promos-util';
import PayinService from './payinService';
import SupernovaService from './supernovaService';
import IDMService from "./idmService";
import IdmUtil from "../utils/idm-utils";
import { PAYIN_TRANSACTION_STATUS, TRANSACTIONS_SORTING_METHOD } from "../constants/payin-constants";

const async = require('async');
const configService = require('../services/configService');
const redisService = require('../services/redisService');
const logger = LoggerUtil.get("PromosService");

export default class PromosService {

    static async getUserOffer() {
        try {
            logger.info(`inside [PromosService] [getUserOffer]`);
            const userOffers: any = configService.getUseroffers();
            logger.info(`inside [PromosService] [getUserOffer] userOffers ::  ${JSON.stringify(userOffers)}`);
            return userOffers;
        } catch (e) {
            PromosClient.getErrorFromCode(e?.status?.code)
            logger.info(e,`inside [PromosService] [getUserOffer] received error from [getUserOffer] `);
            throw (e);
        }
    }

    static async getUserPromos(userId: string,userPromo: UserPromoQueryRequest, restClient: any,vendorId: string): Promise<Promotion[]> {
        try {
             const userDetails: IDMUserProfile = await IDMService.getUserDetails(restClient, userId.toString(), vendorId);
             const isPromosBan: boolean = IdmUtil.getPromosBan(userDetails);
             if (isPromosBan) {
                 const userPromos = [];
                 return userPromos;
            }
            logger.info(`inside [PromosService] [getUserPromos] userId ::  ${userId} for promoType :: ${userPromo.promoType} on amount :: ${userPromo.amount}`);
            const promoDetails: Promotion[] = await PromosClient.getUserPromos(userId, userPromo, restClient,vendorId);
            logger.info(`inside [PromosService] [getUserPromos] promoDetails :: ${JSON.stringify(promoDetails)}`);
            const userPromos: Promotion[] = await createPromosResponse(promoDetails);
            logger.info(userPromos,' :: sending this response.');
            return userPromos;
        } catch (e) {
            logger.info(e,`inside [PromosService] [getUserPromos] received error from [getUserPromos] `);
            throw (e);
        }
    }

    static async publishSuccessEvent(userId: string, vendorId: string, data: promosData, eventName: string, restClient: any) {
        try {
            logger.info(`inside [PromosService] [publishSuccessEvent] userId ::  ${userId} on orderId :: ${data.referenceId}`);
            const promosEvent: PromoEvent = { eventName, userId, data };
            logger.info(`inside [PromosService] [publishSuccessEvent] promosEvent ::  ${JSON.stringify(promosEvent)}`);
            const userDetails: IDMUserProfile = await IDMService.getUserDetails(restClient, userId.toString(), vendorId);
            const isPromosBan: boolean = IdmUtil.getPromosBan(userDetails);
            let successEventpublishResponse = {};
            if (!isPromosBan) {
                successEventpublishResponse = await PromosClient.publishSuccessEvent(promosEvent, restClient,vendorId);
            }
            return successEventpublishResponse;
        } catch (e) {
            PromosClient.getErrorFromCode(e?.status?.code)
            logger.info(e,`inside [PromosService] [publishSuccessEvent] received error from [publishSuccessEvent] `);
            throw (e);
        }
    }

    static async getPromoDetails(promoCode: string,vendorId: string,restClient:any){
        try {
            logger.info(`inside [PromosService] [getPromoDetails]`);
            const promoDetail = await PromosClient.getPromoDetails(promoCode,vendorId,restClient);
            logger.info(`inside [PromosService] [getPromoDetails] promoDetails ::  ${JSON.stringify(promoDetail)}`);
            return promoDetail;
        } catch (e) {
            logger.info(e,`inside [PromosService] [getPromoDetails] received error from [getPromoDetails] `);
            throw (e);
        }
    }
};