import RegosClient from "../clients/regosClient";
import { REWARD_CURRENCY_IDENTIFIERS } from "../constants/promos";
import { RegosServiceConstants } from "../constants/regos-service-constants";
import { TRANSACTION_METHODS, WALLET_TYPES } from "../constants/supernova-constants";
import Pagination from "../models/pagination";
import { Promotion } from "../models/promos/promos";
import { RewardEvent } from "../models/regos/requests";
import {
    PlayerTournamentRegisterRequest
} from '../models/request/player-tournament-register-request';
import TournamentRegisterType from '../models/supernova/enums/tournament-register-type';
import { ITournamentAutoRegisterRequest, WalletTransactionFilter } from "../models/supernova/request";
import { WalletTransaction } from "../models/supernova/response";
import EventNames from "../producer/enums/eventNames";
import EventPushService from "../producer/eventPushService";
import { getDomainFromVendorId } from "../utils/auth-util";
import LoggerUtil, {ILogger} from "../utils/logger";
import SupernovaUtil from "../utils/supernova-util";
import SessionUtil from "../utils/user-session-util";
import { GsService } from "./gsService";
import IDMService from "./idmService";
import PromosService from "./promosService";
import SupernovaService from "./supernovaService";
import { TitanService } from './titanService';
import TrexControlCenter from "./trexControlCenter";

const configService = require("../services/configService");
const logger: ILogger = LoggerUtil.get("RegosService");

export default class RegosService {

    static createRewardBenefitEvent = (event: RewardEvent,promotion: Promotion) => {
        return {
            orderId: event?.data?.referenceId,
            promoCode: promotion?.promoCode,
            currency: event?.data?.currencyCode,
            lockedDcValue: event?.data?.currencyCode == REWARD_CURRENCY_IDENTIFIERS.LOCKED_DCS ? event?.data?.amount:0,
            tdcValue: event?.data?.currencyCode == REWARD_CURRENCY_IDENTIFIERS.TOURNAMENT_DISCOUNT_SEGMENT ? event?.data?.amount:0,
            ticketValue: event?.data?.currencyCode == REWARD_CURRENCY_IDENTIFIERS.SEAT ? event?.data?.amount:0,
            tournamentId: event?.data?.currencyCode == REWARD_CURRENCY_IDENTIFIERS.SEAT ? JSON.parse(event.data?.rewardMeta || '{}')?.tournamentId: '',
        }
    }
    static async pushRewardAllocationEvent(event:RewardEvent,vendorId: number,restClient: any){
        try{
            const rewardTransactionFilter: WalletTransactionFilter = SupernovaUtil.createWalletTransactionFilter(TRANSACTION_METHODS.NONE, WALLET_TYPES.PRIMARY, [], null, null, null, event.data.referenceId);
            const rewardTransactions: WalletTransaction[] = await SupernovaService.getWalletTransactionsFromReferenceId(event.data.userId, Pagination.getDefaultCategoriesPagination(), rewardTransactionFilter, restClient, vendorId);
            const promoCode = rewardTransactions[0]?.meta?.promotion?.promoCode;
            const rewardCode = rewardTransactions[0]?.meta?.promotion?.rewardCode;
            const promoDetails = await PromosService.getPromoDetails(promoCode,`${vendorId}`,restClient);
            const rewardDetails = await RegosService.getRewardDetails(rewardCode,`${vendorId}`,restClient);
            const rewardBenefitEvent = this.createRewardBenefitEvent(event,promoDetails);
            EventPushService.push(Number(event.data.userId),vendorId,"",EventNames.USER_REWARD_ALLOCATED,{promoDetails,rewardDetails,event});
            EventPushService.push(Number(event.data.userId),vendorId,"",EventNames.USER_PROMO_BENEFIT_CREDITED,rewardBenefitEvent);
        }catch(e){
            logger.error(e,'got error in regosService,[pushRewardAllocationEvent]');
            throw e;
        }
    }

    static async allocateRewardSeat(restClient:any,event:RewardEvent,vendorId:number){
        // got for auto register
        try{
            const userDetails = await IDMService.getUserDetails(restClient,`${event.data.userId}`,`${vendorId}`)
            logger.info('got the user details :: ',userDetails);
            const userId = userDetails?.userId;
            logger.info(userId);
            const tournamentMeta: {tournamentId: number} = JSON.parse(event.data?.rewardMeta || '{}');
            logger.info('got the tournament meta :: ',tournamentMeta);
            const requestBody: PlayerTournamentRegisterRequest = {
                entry_method:'auto_register',
                ticketId:'',
                seatPackId: event.data.packId,
                meta: {
                    tournamentRegisterType: TournamentRegisterType.AUTO_REGISTER_THROUGH_ADD_CASH_REWARD
                }
            }

            const isTournamentMigrated: boolean = await TitanService.checkMigratedTournamentId(restClient, tournamentMeta?.tournamentId);

            //If tournament exist in Aries Tournaments
            if(isTournamentMigrated){
                const gstStateCode: number =  await SessionUtil.getUserGstStateCodeFromSession(userId);
                await TitanService.registerPlayerForTournament(restClient, String(tournamentMeta?.tournamentId), requestBody, userId, `${vendorId}`, gstStateCode);
            } else{
                const domain = getDomainFromVendorId(`${vendorId}`);
                const token: string = await TrexControlCenter.getToken(userId, userDetails?.userHandle, userDetails?.mobile, vendorId, domain, restClient);
                await GsService.registerPlayerForTournament(restClient, `${tournamentMeta.tournamentId}`, requestBody, token, `${vendorId}`, userId);
            }

        }catch(e){
            logger.error(e,'got error in regosService,[allocateRewardSeat]');
            throw e;
        }
    }
    static async allocateRewardWebhook(restClient: any, event: RewardEvent,vendorId: number,requestId: string) {
        try {
            await(Promise as any).allSettled([this.pushRewardAllocationEvent(event,vendorId,restClient)]);
            if (event.eventName == RegosServiceConstants.REWARD_EVENT.REWARD_ALLOCATED){
                logger.info('got the allocation req for :: vendorId',{event,vendorId});
                switch(event.data.currencyCode){
                    case REWARD_CURRENCY_IDENTIFIERS.SEAT:
                        await this.allocateRewardSeat(restClient,event,vendorId);
                }
            }
            return {};
        } catch (error) {
            logger.error(error, `[RegosService] [allocateRewardWebhook] Failed`);
            throw error;
        }
    }

    static async getRewardDetails(rewardCode: string,vendorId: string,restClient:any){
        try {
            logger.info(`inside [RegosService] [getRewardDetails]`);
            const rewardDetail = await RegosClient.getRewardDetails(rewardCode,vendorId,restClient);
            logger.info(`inside [RegosService] [getRewardDetails] rewardDetail ::  ${JSON.stringify(rewardDetail)}`);
            return rewardDetail;
        } catch (e) {
            logger.info(e,`inside [RegosService] [getRewardDetails] received error from [getRewardDetails] `);
            throw (e);
        }
    }

}
