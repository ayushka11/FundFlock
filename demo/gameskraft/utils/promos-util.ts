const configService = require('../services/configService');
import _, { uniq } from 'lodash';
import {payinPaymentMethodTypes} from '../constants/payin-constants';
import {BETWEEN_SYMBOL, GREATER_THAN_SYMBOL, MAX_ADD_CASH_AMOUNT, MIN_ADD_CASH_AMOUNT, PROMOTION_TYPE, PROMO_CONDITIONS, PROMO_CONDITION_KEYS, PROMO_TYPE, REWARD_CURRENCY_IDENTIFIERS, RUPPEE_SYMBOL, promoTypes} from '../constants/promos';
import { ROYALTY_BENEFITS_TAG } from '../constants/royalty-constants';
import {TaxBreakup} from '../models/payin/tax-breakup';
import {
    AddCashPack,
    AddCashPackV2,
    Currency,
    IBenefitDetail,
    IBenefitValue,
    ICondition,
    Promotion,
    Reward,
    RewardDetails,
    RewardSlab,
    RoyaltyDetails,
    UserPromoResponse,
    UserPromoResponseV2,
    promosData
} from '../models/promos/promos';
import {IPromoQueryConditions, PromoEvent, UserPromoQueryRequest} from '../models/promos/request';
import {UserWalletBalance, UserWalletBalanceV2} from '../models/supernova/response';
import LoggerUtil, {ILogger} from '../utils/logger';
import Parser from './parser';
import { Tournament } from '../models/tournament';
import { PROMO_TRANSACTION_TYPES } from '../constants/supernova-constants';
import { PROMISE_STATUS } from '../constants/constants';

const logger: ILogger = LoggerUtil.get("promosUtil");
export const getPromoDetailsFromQuery = (query, vendorId: string) => {
    const promoType = query?.promoType ?? promoTypes.ADD_CASH;
    let isDefaultAmount: boolean = false;
    logger.info(`got selected amount from query as :: ${query?.selectedAmount}`)
    if (!(query?.selectedAmount) || (query?.selectedAmount && query?.selectedAmount == 0)) {
        isDefaultAmount = true;
        logger.info(`setting default amount request as  :: ${isDefaultAmount}`)
    }
    let amount = Number(query?.selectedAmount ? query?.selectedAmount : configService.getUserAddCashConfigForVendor()[vendorId].defaultAmount);
    if (!amount) {
        amount = configService.getUserAddCashConfigForVendor()[vendorId].defaultAmount;
    }
    return {promoType, amount, isDefaultAmount}
}

const roundToNearest100 = (amount) => {
    return Math.round(amount / 100) * 100;
}

export const getValidAvailablePromoCode = (promotions: Promotion[]) => {
    return promotions.filter(promotion => promotion.priority >= Number(configService.getPromotionPriorityConfig()[PROMOTION_TYPE.GLOBAL_PROMO]));
}

export const getUserPromoAmount = (userPromo: UserPromoQueryRequest, userTransactions: any[], vendorId: string): number => {
    if (userPromo.isDefaultAmount) {
        if (userTransactions.length) {
            // if the transactions exist find the median of them and give the amount and return it
            const mid = Math.floor(userTransactions.length / 2);
            const sortedTransactions: any[] = userTransactions.sort((prevTransation, currentTransaction) => prevTransation.amount - currentTransaction.amount);
            const medianTransactionAmount: any = sortedTransactions.length % 2 !== 0 ? sortedTransactions[mid]?.amount :sortedTransactions[mid]?.amount;
            const nearestRoundedNumber: number = roundToNearest100(medianTransactionAmount);
            logger.info(`got the mid as :: ${mid} and median transaction amount as :: `, medianTransactionAmount);
            return Math.max(nearestRoundedNumber, Number(configService.getUserAddCashConfigForVendor()[vendorId].defaultAmount));
        }
        return Number(configService.getUserAddCashConfigForVendor()[vendorId].defaultAmount);
    }
    return userPromo.amount;
}

const getUserAddCashPacks = (userAmountTaxBreakup: TaxBreakup[], userDcsInfo: number[], maxAmount: number, minAmount: number): AddCashPackV2[] => {// add the royalty benefits here
    return userAmountTaxBreakup.map((taxDetails: TaxBreakup, index: number) => {
        const addCashPack: AddCashPackV2 = {
            amount: taxDetails.transactionAmount,
            buyInValue: Parser.parseToTwoDecimal(taxDetails.taxableAmount + userDcsInfo[index]),// this is the total amount of benefits and add cash the user will get
            buyInWithBenefits: Parser.parseToTwoDecimal(taxDetails.taxableAmount + userDcsInfo[index]),
            buyInBreakup: {
                addCashAmount: taxDetails.transactionAmount,
                gstAmount: taxDetails.totalTax,
                discountCreditAmount: userDcsInfo[index]
            }
        }
        return addCashPack;
    }).filter(pack => pack.amount <= maxAmount && pack.amount >= minAmount)// only return packs lesser than the max amount
}



export const createUserPromosResponseV2 = (
    useRoyaltyLevelInfo: any,
    userAmountTaxBreakup: TaxBreakup[], 
    userWalletDetails: UserWalletBalanceV2, 
    userPaymentMethods: any, 
    userRoyaltyInfo: any, 
    userDcsInfo: number[], 
    amount: number, 
    vendorId: string,
    promo: Promotion,
    promoType: string,
    userExtraAmountTaxBreakup: TaxBreakup[],
    userExtraAmountDcsInfo: number[],
    tournamentDetails: Tournament[]
    ): UserPromoResponseV2 => {
    const dcsConsumptionPercentage: number = userRoyaltyInfo?.dcsAmtLimit ? Parser.parseToTwoDecimal(((Number(userRoyaltyInfo?.dcsExhaustedLimit) / Number(userRoyaltyInfo?.dcsAmtLimit)) * 100)) : 100;
    const royaltyDetails: RoyaltyDetails = {
        level: userRoyaltyInfo?.royaltyLevelName,
        percentageUtilized: dcsConsumptionPercentage,
        discountCreditBalance: userRoyaltyInfo?.dcsExhaustedLimit,
        maxDiscountCreditAmount: userRoyaltyInfo?.dcsAmtLimit,
        discountCreditBalanceResetDate: userRoyaltyInfo?.dcsExhaustionTime,
        isUserBanned: userRoyaltyInfo?.isUserBanned,
        isLevelXUser: userRoyaltyInfo?.isLevelXUser,
        royaltyLevelIcon: useRoyaltyLevelInfo.userInfo?.activeImageUrl,

    }
    const userResponse: UserPromoResponseV2 = {
        walletBalance: Number(userWalletDetails.playerGameBalance + userWalletDetails.winningBalance + userWalletDetails.discountCreditBalance),// change this to v2 1+2+3
        minAmount: configService.getUserAddCashConfigForVendor()[vendorId].minAmount ?? MIN_ADD_CASH_AMOUNT,
        maxAmount: configService.getUserAddCashConfigForVendor()[vendorId].maxAmount ?? MAX_ADD_CASH_AMOUNT,
        dailyAddCashLimit: configService.getUserAddCashConfigForVendor()[vendorId].dailyAddCashLimit ?? -1,
        monthlyAddCashLimit: configService.getUserAddCashConfigForVendor()[vendorId].monthlyAddCashLimit ?? -1,
        dailyAddCash: 0,
        monthlyAddCash: 0,
        preferredPaymentMethod: {},
        defaultPromoCode: {},
        addCashPacks: [],
        royaltyDetails,
    };
    userResponse.preferredPaymentMethod = userPaymentMethods?.lastUsedPreferredMode ?? {};
    userResponse.preferredPaymentMethod.amount = amount;
    if (userResponse.preferredPaymentMethod && userResponse.preferredPaymentMethod.paymentMethodType) {
        if (userResponse.preferredPaymentMethod.paymentMethodType == payinPaymentMethodTypes.NET_BANKING) {
            userResponse.preferredPaymentMethod.paymentMethodImageUrl = configService.getNetBankingConfigForVendor()[vendorId].paymentMethodImageUrl[userResponse.preferredPaymentMethod.nbBank] || '';
        }
        else if (userResponse.preferredPaymentMethod.paymentMethodType == payinPaymentMethodTypes.CREDIT_CARD || userResponse.preferredPaymentMethod.paymentMethodType == payinPaymentMethodTypes.DEBIT_CARD) {
            userResponse.preferredPaymentMethod.paymentMethodImageUrl = configService.getCardBrandImageForVendor()[vendorId].cards[userResponse.preferredPaymentMethod.cardBrand] || '';
        }
        else if (userResponse.preferredPaymentMethod.paymentMethodType == payinPaymentMethodTypes.WALLET) {
            userResponse.preferredPaymentMethod.paymentMethodImageUrl = configService.getWalletPaymentModeTypeConfigForVendor()[vendorId].paymentMethodImageUrl || '';
        }
    }

    userResponse.addCashPacks = getUserAddCashPacks(userAmountTaxBreakup, 
                                                    userDcsInfo, 
                                                    configService.getUserAddCashConfigForVendor()[vendorId].maxAmount ?? MAX_ADD_CASH_AMOUNT, 
                                                    configService.getUserAddCashConfigForVendor()[vendorId].minAmount ?? MIN_ADD_CASH_AMOUNT
                                                );
    userResponse.addCashPacks = addPromoAddCashPackBenefits(userResponse.addCashPacks,promo,promoType,tournamentDetails);
    
    userResponse.extraBenefits = getUserAddCashPacks(userExtraAmountTaxBreakup, 
        userExtraAmountDcsInfo, 
        configService.getUserAddCashConfigForVendor()[vendorId].maxAmount ?? MAX_ADD_CASH_AMOUNT, 
        configService.getUserAddCashConfigForVendor()[vendorId].minAmount ?? MIN_ADD_CASH_AMOUNT
    );

    userResponse.extraBenefits = addPromoAddCashPackBenefits(userResponse.extraBenefits,promo,promoType,tournamentDetails);
    // remove the benefits where promo is not applicable
    userResponse.extraBenefits = userResponse.extraBenefits.filter(benefit => !!(benefit.promoCode));
    userResponse.benefitDetails = promoBenefits(promo);
    return userResponse;
}
const promoBenefits = (promo: Promotion) => {
    if(!promo)return [];
    const benefitDetails: IBenefitDetail[] = promo.rewardSlabs.map((slab : RewardSlab,rewardIndex: number) => {
        const slabIndex: number = getValidRewardSlab(promo.rewardSlabs,slab.minValue);
        const benefitValue: IBenefitValue = {
            // create an empty object initially
        }
        if(slabIndex != -1){
            const rewardSlab : RewardSlab = promo.rewardSlabs[slabIndex];
            const rewardsBenefits: Map<string,{value: number,details: any[]}> = getRewardsBenefits(rewardSlab,slab.maxValue == Number.POSITIVE_INFINITY ? slab.minValue:slab.maxValue);
            const rewardBenefitValue:  Map<string,string> = getRewardsBenefitsValues(rewardSlab);
            Object.keys(rewardsBenefits).map((key: string) => {

                if (REWARD_CURRENCY_IDENTIFIERS.LOCKED_DCS == key){
                    if(!benefitValue.lockedDcs)
                        benefitValue.lockedDcs = rewardBenefitValue[key];
                    benefitValue.lockedDcs = rewardBenefitValue[key];
                }
                if (REWARD_CURRENCY_IDENTIFIERS.TOURNAMENT_DISCOUNT_SEGMENT == key){
                    if(!benefitValue.tournamentDcs)
                        benefitValue.tournamentDcs = rewardBenefitValue[key];
                    benefitValue.tournamentDcs = rewardBenefitValue[key];
                }
                if (REWARD_CURRENCY_IDENTIFIERS.SEAT == key){
                    if(!benefitValue.seat)
                        benefitValue.seat = rewardBenefitValue[key];
                    benefitValue.seat = rewardBenefitValue[key];
                }
            })
        }    
        let slabLabel= "";
        if(slab.minValue == slab.maxValue){
            slabLabel = `${RUPPEE_SYMBOL}${slab.minValue}`
        }
        if(rewardIndex == 0 && slab.minValue == -1)
        slabLabel = `${RUPPEE_SYMBOL}${slab.maxValue} ${GREATER_THAN_SYMBOL}`
    if(rewardIndex == promo.rewardSlabs.length-1 && slab.maxValue == Number.POSITIVE_INFINITY)
    slabLabel = `${GREATER_THAN_SYMBOL} ${RUPPEE_SYMBOL}${Math.max(Number(slab?.minValue)-1,0)}`
        const benefitDetail: IBenefitDetail = {
            slab: slabLabel.length ? slabLabel : `${RUPPEE_SYMBOL}${slab.minValue} ${BETWEEN_SYMBOL} ${RUPPEE_SYMBOL}${slab.maxValue}`,
            promoCode: promo.promoCode,
            benefits: benefitValue
        };
        return benefitDetail;
    })
    return normalizeBenefitDetails(benefitDetails);

}

const normalizeBenefitDetails = (benefitDetails: IBenefitDetail[]) => {
    const keysToBeAdded: Set<string> = new Set<string>();
    benefitDetails.map(benefitDetail => {
        Object.keys(benefitDetail.benefits).map(keys => keysToBeAdded.add(keys));
    });
    return benefitDetails.map(benefitDetail => {
        keysToBeAdded.forEach(key => {
            if(!benefitDetail.benefits[key]){
                benefitDetail.benefits[key] = '-';
            } else{
                benefitDetail.benefits[key] = `${benefitDetail.benefits[key]}`
            }
        });
        return benefitDetail;
    })
    

}
const getValidRewardSlab = (rewardSlab: RewardSlab[],amount: number) => {
    let validReward: number = -1;
    (rewardSlab || []).forEach((slab : RewardSlab,index: number) => {
        if(validReward != -1)return;

        let isconditionSatisfied : boolean = true;
        slab.conditions.map(condition => isconditionSatisfied = isconditionSatisfied && checkCondition(condition,amount));
        if(isconditionSatisfied) 
            validReward = index;
    });
    return validReward;
}

const getBenefitCurrencyValue = (currency: Currency) => {
    if (currency) {
        let benefit = '';
        if (currency.isFixed) {
            benefit =  currency.currencyIdentifier == REWARD_CURRENCY_IDENTIFIERS.SEAT ?`${RUPPEE_SYMBOL}${currency.fixedAmount}`:`${currency.fixedAmount}`;
        }
        if (currency.isBooster) {
            benefit =`${currency.boosterValue}`;
        }
        if (currency.isTransactional) {
            benefit =  `${currency.transactionPercent}%`;
        }
        return benefit;
    }
    return '';
}


const getBenefitValue = (currency: Currency,amount: number) => {
    if (currency) {
        let benefit = 0;
        if (currency.isFixed) {
            benefit =  currency.fixedAmount;
        }
        if (currency.isBooster) {
            benefit = Math.min(currency.maxLimit, amount * (currency.boosterValue));
        }
        if (currency.isTransactional) {
            benefit = Math.min(currency.maxLimit, amount * (currency.transactionPercent / 100));
        }
        return benefit;
    }
    return 0;
}

const getRewardsBenefitsValues = (rewardSlab: RewardSlab) => {
    const rewardsBenefits: Map<string,string> = new  Map<string,string> ();
    rewardSlab.rewards.map((reward : Reward) => {
        reward.parsedDetails.currencies.map((currency : Currency) => {
            if(rewardsBenefits.has(currency.currencyIdentifier)){
                rewardsBenefits[currency.currencyIdentifier] = getBenefitCurrencyValue(currency);
            } else{
                rewardsBenefits[currency.currencyIdentifier] = getBenefitCurrencyValue(currency);
            }
        });
    });
    return rewardsBenefits;
}

const getRewardsBenefits = (rewardSlab: RewardSlab,amount: number) => {
    const rewardsBenefits: Map<string,{value: number,details: any[]}> = new  Map<string,{value: number,details: any[]}> ();
    rewardSlab.rewards.map((reward : Reward) => {
        reward.parsedDetails.currencies.map((currency : Currency) => {
            if(rewardsBenefits.has(currency.currencyIdentifier)){
                rewardsBenefits[currency.currencyIdentifier].value += getBenefitValue(currency,amount);
                rewardsBenefits[currency.currencyIdentifier].details.push(currency.currencyMeta);
            } else{
                rewardsBenefits[currency.currencyIdentifier] = {value: 0,details: []};
                rewardsBenefits[currency.currencyIdentifier].value = getBenefitValue(currency,amount);
                rewardsBenefits[currency.currencyIdentifier].details.push(currency.currencyMeta);
            }
        });
    });
    return rewardsBenefits;
}

const addPromoAddCashPackBenefits = (addCashPacks: AddCashPackV2[],promo: Promotion,promoType: string,tournamentDetails: Tournament[]) =>{
    let hotIndex = -1;let offerAvailable =false;
    const packsWithBenefits: AddCashPackV2[] = addCashPacks.map((pack: AddCashPackV2,index: number) => {
        const slabIndex: number = getValidRewardSlab(promo.rewardSlabs,pack.amount);
        pack.showHotDeal = false;
        if(slabIndex != -1){
            offerAvailable=true;
            hotIndex = index;
            const rewardSlab : RewardSlab = promo.rewardSlabs[slabIndex];

            const rewardsBenefits: Map<string,{value: number,details: any[]}> = getRewardsBenefits(rewardSlab,pack.amount);
            pack.buyInWithBenefits = Parser.parseToTwoDecimal(Number(pack.buyInValue));
            pack.promoCode = promo.promoCode;
            pack.benefits = {
                totalBuyInValueInclBenefits: 0,
                lockedDcs: 0,
                tournamentDcs: 0
            }

            Object.keys(rewardsBenefits).map((key: string) => {
                const benefit:{value: number,details: any[]} = rewardsBenefits[key];
                pack.buyInWithBenefits = Parser.parseToTwoDecimal(pack.buyInWithBenefits + Number(benefit.value));
                pack.benefits.totalBuyInValueInclBenefits = Parser.parseToTwoDecimal(pack.benefits.totalBuyInValueInclBenefits + Number(benefit.value));
                if(key == REWARD_CURRENCY_IDENTIFIERS.LOCKED_DCS){
                    pack.benefits.lockedDcs += Parser.parseToTwoDecimal(Number(benefit.value));
                }
                if(key == REWARD_CURRENCY_IDENTIFIERS.TOURNAMENT_DISCOUNT_SEGMENT){
                    pack.benefits.tournamentDcs += Parser.parseToTwoDecimal(Number(benefit.value));
                }
                if(key == REWARD_CURRENCY_IDENTIFIERS.SEAT){
                    const tournamentDetail: Tournament[] = tournamentDetails.filter(tournament => benefit.details[0]?.tournamentId == tournament.id);
                    pack.benefits.seat = {
                        tournamentName: tournamentDetail.length && tournamentDetail[0].name,
                        tournamentDate: tournamentDetail.length && tournamentDetail[0].tournamentConfig.startTime,
                        registerAmount: benefit.value,
                        tournamentPrizePool: tournamentDetail.length && tournamentDetail[0].prizePool,
                    };
                }

            })

        };
        return pack;
    });

    if(hotIndex > 0){
        packsWithBenefits[hotIndex].showHotDeal = true;
        return packsWithBenefits;
    } else if(offerAvailable){
        packsWithBenefits[hotIndex].showHotDeal = true;
        return packsWithBenefits;
    }
    return packsWithBenefits;

}

export const formulateUserPromoResponse = (userPromos: Promotion[], userWalletDetails: UserWalletBalance, userPaymentMethods: any, amount: number, vendorId: string): UserPromoResponse => {
    logger.info(`inside [promosUtil] [formulateUserPromoResponse] userPromos ::`, userPromos)
    const userResponse: UserPromoResponse = {
        walletBalance: Number(userWalletDetails.depositBalance) + Number(userWalletDetails.withdrawalBalance),
        minAmount: configService.getUserAddCashConfigForVendor()[vendorId].minAmount ?? MIN_ADD_CASH_AMOUNT,
        maxAmount: configService.getUserAddCashConfigForVendor()[vendorId].maxAmount ?? MAX_ADD_CASH_AMOUNT,
        dailyAddCashLimit: configService.getUserAddCashConfigForVendor()[vendorId].dailyAddCashLimit ?? -1,
        monthlyAddCashLimit: configService.getUserAddCashConfigForVendor()[vendorId].monthlyAddCashLimit ?? -1,
        dailyAddCash: 0,// ye kha se layenge to be checked
        monthlyAddCash: 0,// same here as well
        preferredPaymentMethod: {},
        defaultPromoCode: {},
        addCashPacks: []
    };
    // get the last used payment method from userPreferredPaymentMethods
    if (userPaymentMethods?.lastUsedPreferredMode && userPaymentMethods?.lastUsedPreferredMode.paymentMethodType != payinPaymentMethodTypes.UPI_INTENT) {
        userResponse.preferredPaymentMethod = userPaymentMethods?.lastUsedPreferredMode ?? {};
    }
    else {
        userResponse.preferredPaymentMethod = {};
    }
    userResponse.preferredPaymentMethod.amount = amount;
    if (userResponse.preferredPaymentMethod && userResponse.preferredPaymentMethod.paymentMethodType) {
        if (userResponse.preferredPaymentMethod.paymentMethodType == payinPaymentMethodTypes.NET_BANKING) {
            userResponse.preferredPaymentMethod.paymentMethodImageUrl = configService.getNetBankingConfigForVendor()[vendorId].paymentMethodImageUrl[userResponse.preferredPaymentMethod.nbBank] || '';
        }
        else if (userResponse.preferredPaymentMethod.paymentMethodType == payinPaymentMethodTypes.CREDIT_CARD || userResponse.preferredPaymentMethod.paymentMethodType == payinPaymentMethodTypes.DEBIT_CARD) {
            userResponse.preferredPaymentMethod.paymentMethodImageUrl = configService.getCardBrandImageForVendor()[vendorId].cards[userResponse.preferredPaymentMethod.cardBrand] || '';
        }
        else if (userResponse.preferredPaymentMethod.paymentMethodType == payinPaymentMethodTypes.WALLET) {
            userResponse.preferredPaymentMethod.paymentMethodImageUrl = configService.getWalletPaymentModeTypeConfigForVendor()[vendorId].paymentMethodImageUrl || '';
        }
    }
    logger.info(`inside [promosUtil] [formulateUserPromoResponse] preferredPaymentMethod :: ${JSON.stringify(userResponse.preferredPaymentMethod)}`)

    if (userPromos.length) {
        const defaultPromoCode: any = {
            code: userPromos[0]?.promoCode ?? "",
            min: Math.min(...userPromos[0]?.rewardSlabs.map((slab: any) => slab?.minAmount ?? 0)),
            max: -1,
            description: userPromos[0]?.name
        }
        logger.info(`inside [promosUtil] [formulateUserPromoResponse] minAMount for default promo :: ${JSON.stringify(Math.min(...userPromos[0]?.rewardSlabs.map((slab: any) => slab?.minAmount ?? 0)))}`)
        logger.info(`inside [promosUtil] [formulateUserPromoResponse] defaultPromoCode :: ${JSON.stringify(defaultPromoCode)}`)
        userResponse.defaultPromoCode = defaultPromoCode;
    }
    if (userPromos.length) {
        // if we have promos for the user
        // creating add cash packs for the ui we take the first promo adde cash packs and then process them
        const packs: any[] = userPromos[0]?.rewardSlabs;
        // first we sort the add cash packs in ascending order and them multiply the amount with available multipliers
        // the for every new amount created we get the available promo which could be applied
        // using these prmos we create the final oack
        packs.sort((smallPack, bigPack) => smallPack.minAmount - bigPack.minAmount);
        logger.info(`inside [promosUtil] [formulateUserPromoResponse] sorted packs :: ${JSON.stringify(packs)}`)
        const multipliers: number[] = configService.getUserAddCashConfigForVendor()[vendorId].addCashMultipliers;
        logger.info(`inside [promosUtil] [formulateUserPromoResponse] multipliers :: ${JSON.stringify(multipliers)}`)
        const addCashPacks: AddCashPack[] = multipliers.map(multiplier => {
            const packAmount = amount * multiplier;
            const worth = amount * multiplier;
            const packDetails = []
            return {
                amount: packAmount,
                worth,
                packDetails
            }
        });
        // ^ these are the default packs
        logger.info(`inside [promosUtil] [formulateUserPromoResponse] addCashPacks :: ${JSON.stringify(addCashPacks)}`)

        const userPacks: AddCashPack[] = addCashPacks.map((addCashPack) => {
            logger.info(`inside [promosUtil] [formulateUserPromoResponse] addCashPack :: ${JSON.stringify(addCashPack)}`)
            // get all the smallest pack which can be applied to this i.e the pack whose minAmount is just smaller than the current value
            const availablePacks = packs.filter(pack => addCashPack.amount >= pack.minAmount);
            logger.info(`inside [promosUtil] [formulateUserPromoResponse] availablePacks :: ${JSON.stringify(availablePacks)}`)
            if (availablePacks.length) {
                let currentWorth = addCashPack.amount;
                let availableReward: any = {};
                try {
                    // since after filter we have got all the packs which are smaller and in increasing order the last pack would be the one which is the greatest of all
                    // but will have the largst minAmount where our amount will fit
                    // hence taking the largest pack with minAmount smaller than the current value
                    availableReward = JSON.parse((availablePacks && availablePacks[availablePacks.length - 1] && availablePacks[availablePacks.length - 1].reward
                        && availablePacks[availablePacks.length - 1].reward) || '{}');
                } catch (error) {
                    logger.error(`unable to parse reward from promo error: `, error);
                }
                logger.info(`inside [promosUtil] [formulateUserPromoResponse] availableReward :: ${JSON.stringify(availableReward)}`);
                (availableReward?.currencies ?? []).map(currency => {
                    if (currency) {
                        let benefit = 0;
                        if (currency.isFixed) {
                            benefit = Math.min(currency.maxLimit, amount + currency.fixedAmount);
                        }
                        if (currency.isBooster) {
                            benefit = Math.min(currency.maxLimit, amount * (currency.boosterValue));
                        }
                        if (currency.isTransactional) {
                            benefit = Math.min(currency.maxLimit, amount * (currency.transactionPercent / 100));
                        }
                        currentWorth += benefit;
                        addCashPack.packDetails.push({
                            bonusType: currency.currencyIdentifier,
                            bonusWeight: benefit,
                        });
                        addCashPack.worth = currentWorth;
                    }
                })
                logger.info(currentWorth)
            }
            return addCashPack;
        })
        // setting these packs to our addCashPacks
        // remove all the packs whose amount is greater/less than the max/min configurable amount

        userResponse.addCashPacks = userPacks.filter(pack => pack.amount >= userResponse.minAmount && pack.amount <= userResponse.maxAmount);
    }
    else {
        // if no packs were found simply iterate and send the amount with their corresponding multipliers
        const multipliers: number[] = configService.getUserAddCashConfigForVendor()[vendorId].addCashMultipliers;
        logger.info(`inside [promosUtil] [formulateUserPromoResponse] multipliers :: ${JSON.stringify(multipliers)}`)
        const addCashPacks: any[] = multipliers.map(multiplier => {
            const packAmount = amount * multiplier;
            const worth = amount * multiplier;
            const packDetails = []
            return {
                amount: packAmount,
                worth,
                packDetails
            }
        });
        // remove all the packs whose amount is greater/less than the max/min configurable amount
        userResponse.addCashPacks = addCashPacks.filter(pack => pack.amount >= userResponse.minAmount && pack.amount <= userResponse.maxAmount);
    }
    logger.info(`inside [promosUtil] [formulateUserPromoResponse] userResponse :: ${JSON.stringify(userResponse)}`)
    return userResponse;
}

export const getSlabValues = (rewardSlab: RewardSlab) => {
    logger.info('rewardSlab::  ',rewardSlab.conditions);
    let minValue:number =  -1,maxValue: number = Number.POSITIVE_INFINITY;
    const minCondition = rewardSlab.conditions.filter(condition => condition.key == PROMO_CONDITION_KEYS.AMOUNT &&  condition.operator == PROMO_CONDITIONS.GREATER_THAN || condition.operator == PROMO_CONDITIONS.GREATER_THAN_EQUAL_TO);
    const maxCondition = rewardSlab.conditions.filter(condition => condition.key == PROMO_CONDITION_KEYS.AMOUNT && condition.operator == PROMO_CONDITIONS.LESS_THAN || condition.operator == PROMO_CONDITIONS.LESS_THAN_EQUAL_TO);
    const equalToCondition = rewardSlab.conditions.filter(condition => condition.key == PROMO_CONDITION_KEYS.AMOUNT && condition.operator == PROMO_CONDITIONS.EQUAL_TO);
    if(minCondition.length){
        minValue = minCondition[0].operator == PROMO_CONDITIONS.GREATER_THAN ? Number(Number(minCondition[0].value)+1): Number(minCondition[0].value);
    }
    if(maxCondition.length){
        maxValue = maxCondition[0].operator == PROMO_CONDITIONS.LESS_THAN ? Number(Number(maxCondition[0].value)-1): Number(maxCondition[0].value);
    } if(equalToCondition.length){
        minValue = maxValue = Number(equalToCondition[0].value)
    }
    return {minValue,maxValue};
}

export async function createPromosResponse(promos: Promotion[]): Promise<Promotion[]> {
    try{
    const PromoResponse = [];
    await promos.map(async (promo: Promotion) => {
        promo.rewardSlabs = await promo.rewardSlabs.map((rewards: RewardSlab) => {
            const rewardx = rewards.rewards.map((reward: Reward) => {
                const details = reward.details;
                const parsedDetails =  JSON.parse(details);
                logger.info('parsed the details :: ', parsedDetails);
                reward.parsedDetails = parsedDetails;
                reward.parsedDetails.currencies = reward.parsedDetails.currencies.map(currency => {
                    const currencyMeta = currency.metaData ? JSON.parse(currency.metaData) : {};
                    return {...currency,currencyMeta};
                })
                logger.info('pushing this reward :: ', reward);
                return reward;
            });
            rewards.rewards = rewardx;
            const slabValues = getSlabValues(rewards);
            rewards.minValue = slabValues.minValue;
            rewards.maxValue = slabValues.maxValue;
            rewards.conditions = rewards.conditions.filter(condition => condition.key == PROMO_CONDITION_KEYS.AMOUNT);
            return rewards;
        })
        promo.rewardSlabs.sort((a: RewardSlab,b: RewardSlab) =>{
            if(a.minValue == b.minValue)return a.maxValue - b.maxValue;
            return a.minValue-b.minValue;
        })
        PromoResponse.push(promo);
        return promo;
    });
    return PromoResponse;
    }catch(e){
        logger.error(e);
    }
}

export const getPromoType = (promo: Promotion)  => {
    if(!promo){
        return "";
    }

    const availableRewards: Map< number,Set<string> > = new Map<number,Set<string>> ();
    promo.rewardSlabs.forEach((rewardSlab: RewardSlab,index: number) => {
        // take every slab
        // for every slab take out the rewards 
        // for index i add all the currencies in rewards

        availableRewards[index] = new Set<string> ();

        // collection of rewards for a promo every reward contains currencies with 1 currency each
        const rewards: RewardDetails[] = (rewardSlab?.rewards || []).map(reward => reward.parsedDetails);

        rewards.map((reward: RewardDetails) => {
            reward?.currencies.map((currency: Currency) => {

                availableRewards[index].add(currency.currencyIdentifier);
            })
        });
    });
    let isTicketOnlyPromo : boolean = true; 

    Object.keys(availableRewards).map((indexKey: string) => {
        // if it was already not a ticket only promo move forward
        if(!isTicketOnlyPromo) return;
        // if ther is only one currency in a reward and it is seat it implies its a ticket only promo
        if(availableRewards[indexKey].size == 1 && availableRewards[indexKey].has(REWARD_CURRENCY_IDENTIFIERS.SEAT)){
            return;
        }
        // this is a normal promo
        isTicketOnlyPromo = false;
        return;
    })
    return isTicketOnlyPromo ? PROMO_TYPE.TICKET_ONLY : PROMO_TYPE.NORMAL; 
}

const checkCondition = (condition: ICondition,value: number) => {
    const comparisonValue: number = Number(condition.value);
    switch(condition.operator){
        case PROMO_CONDITIONS.EQUAL_TO:
            return value == comparisonValue;
        case PROMO_CONDITIONS.GREATER_THAN:
            return value > comparisonValue;
        case PROMO_CONDITIONS.GREATER_THAN_EQUAL_TO:
            return value >= comparisonValue;
        case PROMO_CONDITIONS.LESS_THAN:
            return value < comparisonValue;
        case PROMO_CONDITIONS.LESS_THAN_EQUAL_TO:
            return value <= comparisonValue;
        case PROMO_CONDITIONS.NOT_EQUAL_TO:
            return value != comparisonValue;
    }
}

const getMinOfferValue = (rewardSlabs : RewardSlab[]) => {
    let minOfferValue = Number.POSITIVE_INFINITY;
    rewardSlabs.forEach((rewardSlab : RewardSlab) => {
        minOfferValue = Math.min(minOfferValue,rewardSlab.minValue);
    })
    return minOfferValue;
}

const getMaxOfferValue = (rewardSlabs : RewardSlab[]) => {
    let maxOfferValue = 0;
    rewardSlabs.forEach((rewardSlab : RewardSlab) => {
        maxOfferValue = Math.max(maxOfferValue,rewardSlab.maxValue);
    })
    return maxOfferValue;
}

const handleMutlplierAmountForSingleTicket = (promo: Promotion,multiplierAmounts: number[]) => {
    
    // simply check if the amt is covered or not and accordingly put the amount
    let offersAvailable: number = 0;
    const uniqueOffer: Set<number> = new Set<number> ();
    multiplierAmounts.forEach((amount: number) => {
        const rewardIndex = getValidRewardSlab(promo.rewardSlabs,amount);
        // rewardIndex -1 implies nothing is satisfying(no slab)
        if(rewardIndex != -1){
            offersAvailable++;
            uniqueOffer.add(rewardIndex);
        }
    });
    // an offer is available so return the default multiplier
    if(offersAvailable > 0){
        return multiplierAmounts;
    }
    logger.info('[handleMultiplierAmountsForTicketOnlyPromo] no offer available for 1 ticket promo going for making custom recommendation');
    const lastMultiplierIndex = multiplierAmounts.length-1;
    const minOfferValue: number = getMinOfferValue(promo.rewardSlabs);
    const maxOfferValue: number = getMaxOfferValue(promo.rewardSlabs);
    if(minOfferValue > multiplierAmounts[lastMultiplierIndex]){
        // this implies the slab of minoffer is actually more than multipliers recvd
        // hence take the last 2 from multipliers and last from the offer
        return [multiplierAmounts[1],multiplierAmounts[2],minOfferValue].sort((a,b) => a-b);
    } else if(maxOfferValue < multiplierAmounts[0]){
        // this implies the slab of offer is actually less than multipliers recvd
        // hence take the first 2 from multipliers and last from the offer
        return [maxOfferValue,multiplierAmounts[0],multiplierAmounts[1]].sort((a,b) => a-b);
    }
    // if the slab is somewhere in between
    return [...multiplierAmounts,minOfferValue,maxOfferValue].sort((a,b) => a-b).slice(undefined,lastMultiplierIndex);


}

const handleMultiplierAmountForTwoTickets = (promo: Promotion,multiplierAmounts: number[]) => {
    // simply check if the amt is covered or not and accordingly put the amount
    let offersAvailable: number = 0;
    const uniqueOffer: Set<number> = new Set<number> ();
    multiplierAmounts.forEach((amount: number) => {
        const rewardIndex = getValidRewardSlab(promo.rewardSlabs,amount);
        if(rewardIndex != -1){
            offersAvailable++;
            uniqueOffer.add(rewardIndex);
        }
    });
    if(offersAvailable > 1 && uniqueOffer.size == 2){
        return multiplierAmounts;
    }
    const minOfferValueForFirstSlab: number = getMinOfferValue([promo.rewardSlabs[0]]);
    const minOfferValueForSecondSlab: number = getMinOfferValue([promo.rewardSlabs[1]]);
    const ans = [minOfferValueForFirstSlab,minOfferValueForSecondSlab,multiplierAmounts[0]].sort((a,b) => a-b)
    return ans;
}

const handleMultiplierAmountsForMultipleTickets = (promo: Promotion,multiplierAmounts: number[]) => {
    let slabs = _.cloneDeep(promo.rewardSlabs);
    slabs = slabs.reverse();
    let offersAvailable: number = 0;
    const uniqueOffer: Set<number> = new Set<number> ();
    //check for offers available
    multiplierAmounts.forEach((amount: number) => {
        const rewardIndex = getValidRewardSlab(slabs,amount);
        if(rewardIndex != -1){
            offersAvailable++;
            uniqueOffer.add(rewardIndex);
        }
    });
    // if more than 2 or 2 offers are available do nothing
    if(uniqueOffer.size >= 2){
        return multiplierAmounts;
    }
    const multipliersFinal = [];
    // find out all the slabs and the min values for all the slabs which have not be included
    slabs.map((slab,index) => {
        if(uniqueOffer.size >= 2)return;
        if(uniqueOffer.has(index)){
            return;
        }
        // ^^^^ we are adding the values to final multipliers here
        multipliersFinal.push(getMinOfferValue([slab]));
        uniqueOffer.add(index);
    })
    // check if the values are still lesser than 3 add the leftovers from original multipliers
    // sort them of not sorted and done
    if(multipliersFinal.length < 3)multipliersFinal.push(...multiplierAmounts.slice(undefined,3-multipliersFinal.length));
    const sortedMultipliers = multipliersFinal.sort((a,b) => a-b)
    return sortedMultipliers;
}

const handleMultiplierAmountsForTicketOnlyPromo = (promo: Promotion,multiplierAmounts: number[]) => {
    if(promo.rewardSlabs.length == 1) 
        return handleMutlplierAmountForSingleTicket(promo,multiplierAmounts);
    else if(promo.rewardSlabs.length == 2){
        return handleMultiplierAmountForTwoTickets(promo,multiplierAmounts);
    }
    return handleMultiplierAmountsForMultipleTickets(promo,multiplierAmounts);

}

const handleMultiplierAmountsForNormalPromo = (promo: Promotion,multiplierAmounts: number[]) => {
    let offersAvailable: number = 0;
    const uniqueOffer: Set<number> = new Set<number> ();
    // check for available offers
    multiplierAmounts.forEach((amount: number) => {
        const rewardIndex = getValidRewardSlab(promo.rewardSlabs,amount);
            if(rewardIndex != -1){
                offersAvailable++;
                uniqueOffer.add(rewardIndex);
            }
    });
    if(uniqueOffer.size > 0){
        return multiplierAmounts;
    }
    // if no offer is present make the highest one as the amount just greater and in the slab
    let reqdMulitplier = -1;
    if(!promo.rewardSlabs.length){
        return [];
    }
    // otherwise find the nearest slab
    const lastMultiplier = multiplierAmounts[multiplierAmounts.length -1];
    const firstMultiplier = multiplierAmounts[0];
    const minOfferPerSlab = promo.rewardSlabs.map((rewardSlab : RewardSlab) => {
        return getMinOfferValue([rewardSlab])
    });
    if(!minOfferPerSlab.length)return multiplierAmounts;
    logger.info({minOfferPerSlab,lastMultiplier,multiplierAmounts},' got this data [handleMultiplierAmountsForNormalPromo]');
    // no downselling
    if(firstMultiplier > minOfferPerSlab[minOfferPerSlab.length-1]){
        return multiplierAmounts;
    }
    if(lastMultiplier < minOfferPerSlab[0]){
        return [...multiplierAmounts.slice(undefined,-1),minOfferPerSlab[0]].slice(-3);
    }
    return [minOfferPerSlab[0],...multiplierAmounts.slice(0,2)].sort((a,b) => a-b);
}

export const getUserAddCashAmount = (amount: number, promos: Promotion,promoType: string,isDefaultAmount: boolean,vendorId: string) => {
    logger.info({amount,promos,promoType,vendorId},'fetch add cash amounts for :: ');
    const multipliers: number[] = configService.getUserAddCashConfigForVendor()[vendorId].addCashMultipliers;
    const multiplierAmounts: number[] =  multipliers.map((amt) => amt * amount);
    // default amount implies this is the default recommendation
    // if its not a default amount donot do anything lwt the user decide
    // user is gawd
    if(!isDefaultAmount)
        return multiplierAmounts;
    // if there is no promo code available donot do any processing 
    // ps: nothing can be done here
    if(promos?.promoCode){
        switch(promoType){
            case PROMO_TYPE.TICKET_ONLY:
                return handleMultiplierAmountsForTicketOnlyPromo(promos,multiplierAmounts);
            case PROMO_TYPE.NORMAL: 
                return handleMultiplierAmountsForNormalPromo(promos,multiplierAmounts);
            default:
                return multiplierAmounts;
        }
    }
    return multiplierAmounts;
}

export const  getExtraBenefitDetails = (amounts: number[],promoApplicable: Promotion,promoType: string,vendorId: string) => {
    const usedPromoSlabs: Set<string> = new Set<string> ();
    // find all the used promos
    amounts.forEach((amount: number) => {
        const slabIndex: number = getValidRewardSlab(promoApplicable.rewardSlabs,amount);
        if(slabIndex != -1)
            usedPromoSlabs.add(`${slabIndex}`);
    });
    if(promoType == PROMO_TYPE.TICKET_ONLY && promoApplicable.rewardSlabs.length > usedPromoSlabs.size){
        // find the slab not used send the minAmount of that back as a new array
        const unUsedSlab = promoApplicable.rewardSlabs.filter((slab: RewardSlab,index: number) => !usedPromoSlabs.has(`${index}`));
        if(unUsedSlab.length){
            return [...unUsedSlab.map(slab => slab.minValue)].slice(undefined,3);
        }
    } else if(promoType == PROMO_TYPE.NORMAL){
        // find the slab not used send the minAmount of that back as a new array
        // if all the slabs are used send highest slab ka X2 X3 X4
        const lastSlab = promoApplicable.rewardSlabs.length-1;
        // all promos were used here
        let maxRewardValueHere: number = 0;
        const maxOfferValueOfAllSlabs = getMaxOfferValue(promoApplicable.rewardSlabs);
           const minOfferValueOfAllSlabs = getMinOfferValue(promoApplicable.rewardSlabs);
           const maxOfferValueOfLargestSlabs = getMinOfferValue([promoApplicable.rewardSlabs[lastSlab]]);
           const minOfferValueOfLargestSlab = getMinOfferValue([promoApplicable.rewardSlabs[lastSlab]]);
           let maxRewardValue: number = 0;
           
           if(maxOfferValueOfAllSlabs  == Number.POSITIVE_INFINITY){
                if(minOfferValueOfLargestSlab == -1){
                    maxRewardValue = amounts[amounts.length-1]+1;
                    maxRewardValueHere = amounts[amounts.length-1]+1;
                } else{
                    maxRewardValue = minOfferValueOfAllSlabs;
                    maxRewardValueHere = minOfferValueOfLargestSlab*2;
                }
           } else{
            maxRewardValue = maxOfferValueOfAllSlabs;
            if(maxOfferValueOfAllSlabs == minOfferValueOfLargestSlab){
                maxRewardValueHere = maxOfferValueOfAllSlabs*2;
            }else {
                maxRewardValueHere = maxOfferValueOfAllSlabs;
            }
           }
        if(usedPromoSlabs.size == promoApplicable.rewardSlabs.length){
            return configService.getUserAddCashConfigForVendor()[vendorId].addCashMultipliers.map(multiplier => maxRewardValue*Number(multiplier));
        }
        // find the slabs which are unused

        const unUsedSlab = promoApplicable.rewardSlabs.filter((slab: RewardSlab,index: number) => !usedPromoSlabs.has(`${index}`));
        // get the min values of each slabs also we donot want the slabs which donot have a min value
        let minAmountSlabs = unUsedSlab.filter(slab => slab.minValue != -1);
        let minAmountSlabValues = minAmountSlabs.map(slab => slab.minValue);
        // get the amounts and return them
        const multiplierAmounts = [...minAmountSlabValues
            ,...configService.getUserAddCashConfigForVendor()[vendorId].addCashMultipliers.map(multiplier => maxRewardValueHere*Number(multiplier))
        ].slice(0,3);
        return multiplierAmounts.sort((a,b) =>a-b);
    }
}

export const createConditionParamString = (condition: IPromoQueryConditions) =>{
    return `{${(Object.keys(condition).map(key => '"'+`${key}`+'"'+':'+String(condition[key]))).join(',').toString()}}`
}


export const createPromoSuccessEvent = (amount:number,referenceId: string,promoCode: string,paymentMethod: string,addCashCount: string): promosData => {
    return  {
        amount,
        referenceId,
        promoCode,
        paymentMethod,
        addCashCount,
        transactionType: `${PROMO_TRANSACTION_TYPES.PROMO_PUBLISH}`
    }
}

export const createRequestResponse = (promoDetails: any[]) => {
    return [
        promoDetails[0]?.value || {},
        promoDetails[1]?.value || {},
        promoDetails[2]?.value || [],
        promoDetails[3]?.value || {},
        promoDetails[4]?.value || [],
        promoDetails[5]?.value || {},
        promoDetails[6]?.value || [],
        promoDetails[7]?.value || [],
        [...(promoDetails[8]?.value || []),...(promoDetails[9]?.value || [])]
    ]
}

