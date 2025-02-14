import { SupernovaRefundDetailsRequest } from "../supernova/request";

export interface PaymenSuccessResponse {
    paymentStatus: boolean,
    gatewayJusPay: string,
    orderId: string,
    updatedAt: string
}

export interface TdsSnapshot {
    fiscalYear: string;
    startingDepositBalance: number;
    startingWithdrawalBalance: number;
    totalDepositAmount: number;
    totalWithdrawalRequestedAmount: number;
    totalWithdrawalAmount: number;
    totalWithdrawalTdsDeductedAmount: number;
    totalPreviousTaxedWithdrawalAmount: number;
    totalRefundRequestedAmount: number;
    totalRefundAmount: number;
    totalRefundTdsDeductedAmount: number;
    totalPreviousTaxedRefundAmount: number;
    totalPreviousTaxedAmount: number;
    totalTdsDeductedAmount: number;
  }
  
  export interface UserRefundData {
    userId: number;
    refundTransactionId: string;
    tdsTransactionId: string;
    refundRequestedAmount: number;
    netWinnings: number;
    taxableNetWinnings: number;
    tdsApplicable: number;
    amountToBeCredit: number;
    previousTaxedWinnings: number;
    previousTaxedAmount: number;
    tdsPercentage: number;
    tdsSnapshot: TdsSnapshot;
    refundAmountAfterGst?: number;
    amountToBeCreditAfterGst?: number;
  }

  export interface UserTdsDetails {
    refundRequestedAmount : number,
    tdsApplicable : number,
    totalWithdrawalRequestedAmount : number,
    totalDepositAmount : number,
    totalPreviousTaxedAmount : number,
    totalInclusiveRefundAmount?: number,
    netWinnings: number,
    totalTaxableWinnings: number,
    fiscalYear: string,
    tdsPercentage: number,
    netRefundedAmount: number
  }

  export interface  UserRefundDetails{
    depositAmount?: number;// this is the acs segement amount
    refundableAmount?: number;//refund requested amount ka sum hai ye 
    taxLiability?: number;//total tax liablity of the user
    netRefundedAmount?: number;// sum of amount to be credited
    refundDetails?: SupernovaRefundDetailsRequest[];
    netDcsDeductionApplicable?: number;
    tdsInformation?: UserTdsDetails
}

export interface PaymentModeValidationResponse{
  isModeValid: boolean,
  paymentModeId?: number,
  iconUrl?: string | undefined,
  paymentModeName?: string,
  cardType?: string,
  cardBrand?: string,
  cardIssuer?: string
}