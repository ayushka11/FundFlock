import {RoyaltyBenefits, RoyaltyUserHomeInfo} from "../models/royalty/response";
import RoyaltyClient from "../clients/royaltyClient";

import LoggerUtil from '../utils/logger';
import { UserRefundDcsAmountsDetails, UserRevertRefundDcsAmountRequest } from "../models/aurora/response";
import { UserRefundDcsAmountRequest } from "../models/aurora/request";
import { rest } from "lodash";
import { RoyaltyDetails } from "../models/promos/promos";
import RoyaltyUtil from "../utils/royalty-util";
import PayinService from "./payinService";
import { TRANSACTIONS_SORTING_METHOD } from "../constants/payin-constants";
import PayinServiceV2 from "./v2/payinService";
import { GMZ_VENDOR_ID } from "../constants/constants";
import { CreateRoyaltyUser } from "../models/royalty/request";
import { LEVEL_ID, ROYALTY_USER_STATUS } from "../constants/royalty-constants";

const configService = require('../services/configService');

const logger = LoggerUtil.get("RoyaltyService");

export default class RoyaltyService {
    static async redeemCoins(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[redeemCoins] userId :: ${userId}`);
            const coinRedeemResp: any = await RoyaltyClient.redeemCoins(restClient, userId);
            logger.info(`[redeemCoins] got data :: ${JSON.stringify(coinRedeemResp)}`);
            return coinRedeemResp
        } catch (e) {
            logger.error(e,`[redeemCoins]  `);
            throw (e);
        }

    }
    
    static async redeemCoinsV2(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[redeemCoinsV2] userId :: ${userId}`);
            const coinRedeemResp: any = await RoyaltyClient.redeemCoinsV2(restClient, userId);
            logger.info(`[redeemCoinsV2] got data :: ${JSON.stringify(coinRedeemResp)}`);
            return coinRedeemResp
        } catch (e) {
            logger.error(e,`[redeemCoinsV2]  `);
            throw (e);
        }

    }    

    static async getUserRoyaltyInfo(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[getUserRoyaltyInfo] userId :: ${userId}`);
            const userRoyaltyInfo: any = await RoyaltyClient.getUserRoyaltyInfoWithLevels(restClient, userId);
            logger.info(`[getUserRoyaltyInfo] got data :: ${JSON.stringify(userRoyaltyInfo)}`);
            return userRoyaltyInfo
        } catch (e) {
            logger.error(e,`[getUserRoyaltyInfo] Failed `);
            throw (e);
        }
    }

    static async getRoyaltyDcsInfo(restClient: any, userId: number, vendorId: string): Promise<any> {
        try {
            logger.info(`[getRoyaltyDcsInfo] userId :: ${userId}, vendorId :: ${vendorId}`);
            const userRoyaltyInfo: any = await RoyaltyClient.getRoyaltyDcsInfo(restClient, userId, vendorId);
            logger.info(`[getRoyaltyDcsInfo] got data :: ${JSON.stringify(userRoyaltyInfo)}`);
            return userRoyaltyInfo
        } catch (e) {
            logger.error(e,`[getRoyaltyDcsInfo] Failed `);
            throw (e);
        }
    }

    static async getDcsAmount(restClient: any, userId: number, userAddCashAmount: number[], vendorId: string): Promise<any> {
        try {
            logger.info(`[getDcsAmount] userId :: ${userId}, vendorId :: ${vendorId}`);
            const userDcsAmount: any = await RoyaltyClient.getDcsAmount(restClient, userId, vendorId, userAddCashAmount);
            logger.info(`[getDcsAmount] got data :: ${JSON.stringify(userDcsAmount)}`);
            return userDcsAmount;
        } catch (e) {
            logger.error(e,`[getDcsAmount] Failed `);
            throw (e);
        }
    }

    static async creditUserDcs(restClient: any, userId: number, userAddCashAmount: number, vendorId: string,transactionId: string): Promise<any> {
        try {
            logger.info(`[creditUserDcs] userId :: ${userId}, vendorId :: ${vendorId}`);
            const userDcsAmount: any = await RoyaltyClient.creditUserDcs(restClient, userId, vendorId, userAddCashAmount,transactionId);
            logger.info(`[creditUserDcs] got data :: ${JSON.stringify(userDcsAmount)}`);
            return userDcsAmount;
        } catch (e) {
            logger.error(e,`[creditUserDcs] Failed `);
            throw (e);
        }
    }

    static async getRoyaltyHomeInfo(restClient: any, userId: number): Promise<RoyaltyUserHomeInfo> {
        try {
            logger.info(`[getUserRoyaltyInfo] userId :: ${userId}`);
            const userRoyaltyInfo: any = await RoyaltyClient.getRoyaltyUserInfo(restClient, userId);
            logger.info(`[getUserRoyaltyInfo] got data :: ${JSON.stringify(userRoyaltyInfo)}`);
            return userRoyaltyInfo
        } catch (e) {
            logger.error(e,`[getUserRoyaltyInfo] Failed `);
            throw (e);
        }
    }

    static async getUserRoyaltyBenefits(restClient: any, userId: number, vendorId: number): Promise<any> {
        try {
            logger.info(`[getUserRoyaltyBenefits] userId :: ${userId}, vendorId :: ${vendorId}`);
            const userRoyaltyInfo: any = await RoyaltyClient.getUserRoyaltyBenefits(restClient, userId);

            // User Default Withdrawal Count for Gamezy since its a business requirement
            if (vendorId && vendorId.toString() === GMZ_VENDOR_ID){
                const defaultRoyaltyBenefits = RoyaltyService.getDefaultRoyaltyBenefits(vendorId)
                userRoyaltyInfo.withdrawalCountLimit = defaultRoyaltyBenefits.withdrawalCountLimit;
            }
            logger.info(`[getUserRoyaltyBenefits] got data :: ${JSON.stringify(userRoyaltyInfo)}`);
            return userRoyaltyInfo
        } catch (e) {
            logger.info(e,`[getUserRoyaltyBenefits] Failed `);
            // Send Default Benefits
            return RoyaltyService.getDefaultRoyaltyBenefits(vendorId)

        }
    }

    static async getRoyaltyFAQs(restClient: any): Promise<any> {
        try {
            logger.info(`[getRoyaltyFAQs] Request `);
            const royaltyFAQs: any = await RoyaltyClient.getRoyaltyFAQs(restClient);
            logger.info(`[getUserRoyaltyBenefits] Response :: ${JSON.stringify(royaltyFAQs)}`);
            return royaltyFAQs
        } catch (e) {
            logger.info(e,`[getUserRoyaltyBenefits] Failed `);
            throw (e);
        }
    }

    static getDefaultRoyaltyBenefits(vendorId: number): RoyaltyBenefits {
        const royaltyConfig: any = configService.getRoyaltyConfigForVendor()[vendorId];
        return {
            withdrawalAmtLimit: royaltyConfig?.default_benefits?.withdrawalAmtLimit,
            withdrawalCountLimit: royaltyConfig?.default_benefits?.withdrawalCountLimit,
            coinConversionFactor: royaltyConfig?.default_benefits?.coinConversionFactor,
        }
    }

    static async upgradeUserRoyaltyVersion(restClient: any, userId: number): Promise<any> {
        try {
            logger.info(`[upgradeUserRoyaltyVersion] userId :: ${userId}`);
            const updateUserRoyaltyVersion: any = await RoyaltyClient.upgradeUserRoyaltyVersion(restClient, userId);
            logger.info(`[upgradeUserRoyaltyVersion] got data :: ${JSON.stringify(updateUserRoyaltyVersion)}`);
            return updateUserRoyaltyVersion
        } catch (e) {
            logger.error(e,`[upgradeUserRoyaltyVersion] Failed `);
        }
    }

    static async getRefundDcsDetails(userId: number,userRefundDcsDetails:UserRefundDcsAmountRequest[] ,vendorId: number,restClient: any): Promise<UserRefundDcsAmountsDetails[]>{
        try {
            logger.info(`[getRefundDcsDetails] Request `,userRefundDcsDetails);
            const refundDcsDetails: any = await RoyaltyClient.getRefundDcsDetails(userId,userRefundDcsDetails,vendorId,restClient);
            logger.info(`[getRefundDcsDetails] Response :: ${JSON.stringify(refundDcsDetails)}`);
            return refundDcsDetails
        } catch (e) {
            logger.info(e,`[getRefundDcsDetails] Failed `);
            throw (e);
        }
    }

    static async debitUserDcsOnRefund(dcsDeductionRequest: UserRefundDcsAmountRequest[],userId: number,vendorId: number,restClient: any){
        try {
            logger.info(`[debitUserDcsOnRefund] Request `,dcsDeductionRequest);
            const refundDcsDetails: any = await RoyaltyClient.debitUserDcsOnRefund(userId,dcsDeductionRequest,vendorId,restClient);
            logger.info(`[debitUserDcsOnRefund] Response :: ${JSON.stringify(refundDcsDetails)}`);
            return refundDcsDetails
        } catch (e) {
            logger.info(e,`[debitUserDcsOnRefund] Failed `);
            throw (e);
        }
    }

    static async revertRefundDcs(userId: number,vendorId: number,revertedDcsOrder:UserRevertRefundDcsAmountRequest,restClient: any){
        try {
            logger.info(`[revertRefundDcs] Request `,revertedDcsOrder);
            const refundDcsDetails: any = await RoyaltyClient.revertRefundDcs(userId,vendorId,revertedDcsOrder,restClient);
            logger.info(`[revertRefundDcs] Response :: ${JSON.stringify(refundDcsDetails)}`);
            return refundDcsDetails
        } catch (e) {
            logger.info(e,`[revertRefundDcs] Failed `);
            throw (e);
        }
    }

    static async getRoyaltyAddCashUserDetails(userId: number,payinCustomerId: string,vendorId: number,restClient: any){
        try {
            logger.info(`[getRoyaltyAddCashUserDetails] Request `,{userId});
            const [userRoyaltyInfo,userTransaction,userRoyaltyDcsAmountInfo]: any = await Promise.all([
                RoyaltyService.getUserRoyaltyInfo(restClient,userId),
                PayinServiceV2.getUserAddCashHistory({internalRestClient : restClient}, payinCustomerId, 1, 1, `${vendorId}`),
                RoyaltyService.getRoyaltyDcsInfo(restClient, Number(userId), `${vendorId}`)
            ]);
            logger.info("[getRoyaltyAddCashUserDetails] got response from royalty CLient :: ",{userRoyaltyInfo,userTransaction,userRoyaltyDcsAmountInfo})
            const royaltyAddCashUserDetailsResp: RoyaltyDetails = RoyaltyUtil.transformRoyaltyInfo(userRoyaltyInfo,userTransaction.transactions,userRoyaltyDcsAmountInfo)
            logger.info(`[getRoyaltyAddCashUserDetails] Response :: ${JSON.stringify(royaltyAddCashUserDetailsResp)}`);
            return royaltyAddCashUserDetailsResp
        } catch (e) {
            logger.info(e,`[getRoyaltyAddCashUserDetails] Failed `);
            throw (e);
        }
    }

    static async checkIfUserInRakebackDeal(restClient: any, userId: string, vendorId: number): Promise<any>{
        try {
            logger.info(`[checkIfUserInRakebackDeal] Request `,{userId});
            const isRakebackuser: boolean = await RoyaltyClient.checkIfUserInRakeback(restClient, userId, vendorId)
            logger.info(`[checkIfUserInRakebackDeal] Response :: ${JSON.stringify(isRakebackuser)}`);
            return isRakebackuser
        } catch (e) {
            return true
            logger.info(e,`[checkIfUserInRakebackDeal] Failed `);
        }
    }

    static async createRoyaltyUser(restClient: any, userId: number, vendorId: string){
        try {
            logger.info(`[createRoyaltyUser] Request userId: ${userId} vendorId: ${vendorId} `,);
            const createRoyaltyUserReq: CreateRoyaltyUser = {
                userId,
                vendorId: Number(vendorId),
                currentLevelId: LEVEL_ID.BRONZE,
                status: ROYALTY_USER_STATUS.ACTIVE
            }
            const createRoyaltyUserResp: any = await RoyaltyClient.createRoyaltyUser(restClient, createRoyaltyUserReq);
            logger.info(`[createRoyaltyUser] Response :: ${JSON.stringify(createRoyaltyUserResp)}`);
            return createRoyaltyUserResp
        } catch (e) {
            logger.info(e,`[createRoyaltyUser] Failed `);
            throw (e);
        }
    }

};
