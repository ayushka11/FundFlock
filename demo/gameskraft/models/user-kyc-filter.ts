import {userKycDocumentStatus, userKycDocumentType} from "./enums/user-kyc";

export default interface UserKycFilter {
  documentType?: userKycDocumentType[],
  userKycDataMethod: string//userKycData, --> lite or normal
  documentStatus?: userKycDocumentStatus[],
  sortBy?: number
}
