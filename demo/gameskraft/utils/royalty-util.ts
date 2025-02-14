import { GST_PERCENTAGE, ROYALTY_BENEFITS_TAG } from "../constants/royalty-constants";
import { RoyaltyDetails } from "../models/promos/promos";
import { UserTransactionSummary } from "../models/supernova/response";
import { logger } from "./logger";
import Parser from "./parser";

export default class RoyaltyUtil {
    public static getMaxDepositAmountForDcsAtCurrentLevel = (dcsAmountLimit: number,dcsExhaustedLimit: number,dcsConversionPercent: number): number => {
        if(dcsConversionPercent){
            return ((dcsAmountLimit - dcsExhaustedLimit)*100)/(dcsConversionPercent);
        }
        return 0;
    };
    
    public static getNextAvailableRoyaltyLevelDcsAmount = (useRoyaltyLevelInfo: any,nextAvailableRoyaltyLevel: string = ""): number => {
        if(nextAvailableRoyaltyLevel.length){
            const currentRoyaltyLevelInfo: any = useRoyaltyLevelInfo?.levelInfo.filter(level => {
                return level.name == nextAvailableRoyaltyLevel;
            });
            if(!currentRoyaltyLevelInfo.length){
                return 0;
            }
            const nextRoyaltyLevelInfo: any = useRoyaltyLevelInfo?.levelInfo.filter(level => {
                return level.levelId == currentRoyaltyLevelInfo[0].levelId + 1;
            });
            if(!nextRoyaltyLevelInfo.length){
                return 0;
            }
            const royaltyLevelDcsBenefit: any = nextRoyaltyLevelInfo.benefits[0].filter(benefits => benefits.tag == ROYALTY_BENEFITS_TAG.DCS_BENEFIT);
            if(royaltyLevelDcsBenefit.length){
                return royaltyLevelDcsBenefit[0].value;
            }
        }
        
        return 0;
    
    }
    
    public static getUserLevel(useRoyaltyLevelInfo : any){
        if(useRoyaltyLevelInfo?.userInfo?.isLevelXUser){
            return {};
        }
        const userLevel: any[] = useRoyaltyLevelInfo.levelInfo.filter(level => level.levelId == useRoyaltyLevelInfo?.userInfo?.currentLevelId);
        if(userLevel.length)return userLevel[0];
        return {};
    }
    public static getUserNextLevel(useRoyaltyLevelInfo : any){
        if(useRoyaltyLevelInfo?.userInfo?.isLevelXUser){
            return {};
        }
        const userLevel: any[] = useRoyaltyLevelInfo.levelInfo.filter(level => level.levelId == useRoyaltyLevelInfo?.userInfo?.currentLevelId+1);
        if(userLevel.length)return userLevel[0];
        return {};
    }

    static getmaxDepositAmountForDcs = (dcsAmount: number,dcsConversionPercent: number) =>{
        return Parser.parseToTwoDecimal(dcsAmount*(((100+GST_PERCENTAGE))/GST_PERCENTAGE));
    }
    
    public static getNextAvailableRoyaltyLevelDcs = (useRoyaltyLevelInfo: any,isFtd: boolean):{
        maxDepositAmountForDcs: number,
        nextAvailableRoyaltyLevel: string,
        nextAvailableRoyaltyLevelDcs: number,
        nextAvailableRoyaltyLevelAmountForDcs: number,
        royaltyLevelIcon: string,
        level: string,
        nextAvailableRoyaltyLevelDcsLimit: number
    } => {
        let maxDepositAmountForDcs: number = 0;
        let nextAvailableRoyaltyLevel : string;
        let nextAvailableRoyaltyLevelDcs: number = 0;
        let nextAvailableRoyaltyLevelDcsLimit: number = 0;
        let nextAvailableRoyaltyLevelAmountForDcs: number = 0;
        let royaltyLevelIcon: string = "";
        let level: string = "";
        if(isFtd || !useRoyaltyLevelInfo?.userInfo){
            const initialRoyaltyLevel: any = useRoyaltyLevelInfo?.levelInfo[0];
            const nextAvailableRoyalty: any = useRoyaltyLevelInfo?.levelInfo[1];
            maxDepositAmountForDcs = this.getmaxDepositAmountForDcs(initialRoyaltyLevel?.dcsAmtLimit,initialRoyaltyLevel?.dcsConversionPercent);
            nextAvailableRoyaltyLevel = nextAvailableRoyalty.name;
            nextAvailableRoyaltyLevelDcs = nextAvailableRoyalty.dcsAmtLimit;
            nextAvailableRoyaltyLevelDcsLimit = nextAvailableRoyalty.dcsAmtLimit;;
            nextAvailableRoyaltyLevelAmountForDcs =this.getmaxDepositAmountForDcs(nextAvailableRoyaltyLevelDcs, useRoyaltyLevelInfo?.levelInfo[1].dcsConversionPercent);
            royaltyLevelIcon = "";
            level = ""
        } else{
            const userLevel: any = this.getUserLevel(useRoyaltyLevelInfo);
            if(useRoyaltyLevelInfo?.userInfo?.isLevelXUser || userLevel.levelId ==useRoyaltyLevelInfo?.levelInfo[useRoyaltyLevelInfo?.levelInfo.length -1].levelId ){
                nextAvailableRoyaltyLevel = "";
                nextAvailableRoyaltyLevelDcs = 0;
                nextAvailableRoyaltyLevelDcsLimit = 0;
                maxDepositAmountForDcs = this.getmaxDepositAmountForDcs(useRoyaltyLevelInfo?.userInfo?.dcsAmtLimit - useRoyaltyLevelInfo?.userInfo?.dcsExhaustedLimit,userLevel.dcsConversionPercent);
                nextAvailableRoyaltyLevelAmountForDcs = 0;
                royaltyLevelIcon = useRoyaltyLevelInfo?.userInfo?.activeImageUrl;
                level = useRoyaltyLevelInfo?.userInfo?.levelName;
            } else{
                const currentLevel: any = this.getUserLevel(useRoyaltyLevelInfo);
                const nextLevel: any = this.getUserNextLevel(useRoyaltyLevelInfo);
                maxDepositAmountForDcs =this.getmaxDepositAmountForDcs(useRoyaltyLevelInfo?.userInfo?.dcsAmtLimit - useRoyaltyLevelInfo?.userInfo?.dcsExhaustedLimit,currentLevel.dcsConversionPercent);
                nextAvailableRoyaltyLevel = nextLevel.name;
                nextAvailableRoyaltyLevelDcs = nextLevel.dcsAmtLimit - useRoyaltyLevelInfo?.userInfo?.dcsExhaustedLimit;
                nextAvailableRoyaltyLevelDcsLimit = nextLevel.dcsAmtLimit;
                nextAvailableRoyaltyLevelAmountForDcs = this.getmaxDepositAmountForDcs(nextAvailableRoyaltyLevelDcs,nextLevel.dcsConversionPercent);
                royaltyLevelIcon = nextLevel.activeImage;
                level = currentLevel.name;
            }
        }

        return {maxDepositAmountForDcs,
            nextAvailableRoyaltyLevel,
            nextAvailableRoyaltyLevelDcs,
            nextAvailableRoyaltyLevelAmountForDcs,
            royaltyLevelIcon,
            level,nextAvailableRoyaltyLevelDcsLimit}
    }

    static getFTDUser = (userTransaction: any[]) => {
        return userTransaction.length == 0;  
    }

    public static transformRoyaltyInfo = (userRoyaltyInfo: any,userTransaction:any[],userRoyaltyDcsAmountInfo: any): RoyaltyDetails => {
        const isFtdUser = this.getFTDUser(userTransaction);
        const dcsConsumptionPercentage: number = userRoyaltyDcsAmountInfo?.dcsAmtLimit ? Parser.parseToTwoDecimal(((Number(userRoyaltyDcsAmountInfo?.dcsExhaustedLimit) / Number(userRoyaltyDcsAmountInfo?.dcsAmtLimit)) * 100)) : 100;   
        const   {
            maxDepositAmountForDcs,
            nextAvailableRoyaltyLevel,
            nextAvailableRoyaltyLevelDcs,
            nextAvailableRoyaltyLevelAmountForDcs,
            royaltyLevelIcon,
            level,
            nextAvailableRoyaltyLevelDcsLimit
        } = this.getNextAvailableRoyaltyLevelDcs(userRoyaltyInfo,isFtdUser);

    const dcsExhaustedLimit = userRoyaltyDcsAmountInfo?.dcsExhaustedLimit || 0;
        const royaltyDetails: RoyaltyDetails = {
            percentageUtilized: dcsConsumptionPercentage,
            discountCreditBalance: dcsExhaustedLimit,
            maxDiscountCreditAmount: userRoyaltyDcsAmountInfo?.dcsAmtLimit,
            discountCreditBalanceResetDate: userRoyaltyDcsAmountInfo?.dcsExhaustionTime,
            isUserBanned: userRoyaltyInfo?.userInfo?.isUserBanned,
            isLevelXUser: userRoyaltyInfo?.userInfo?.isLevelXUser,
            isFtdUser,
            maxDepositAmountForDcs,
            nextAvailableRoyaltyLevel,
            nextAvailableRoyaltyLevelDcs,
            nextAvailableRoyaltyLevelAmountForDcs,
            royaltyLevelIcon,
            level,
            nextAvailableRoyaltyLevelDcsLimit
            
        }
        return royaltyDetails;

    }
}