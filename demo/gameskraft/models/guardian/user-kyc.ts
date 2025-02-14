export interface UserKycStatus {
    pan: number,
    upi: number,
    bank: number,
    aadhar: number,
    voter: number,
    dl: number,
    proofOfIdentityKyc?: number,
    proofOfAddressKyc?: number
}

export interface RegisteredDetails {
    name?: string
}

export interface UserKycDocumentDetails {
    documentType: number,
    documentDetails: any[],
    documentUrl?: string,
    statusChangeReason?: string,
}

export interface UserKycDetails {
    userKycStatus: UserKycStatus,
    userKycDocumentDetails?: UserKycDocumentDetails[]
}


export interface UserDocument {
    id: number;
    createdAt: string;
    updatedAt: string;
    tenantId: number;
    subOrgId: number;
    userId: string;
    taskId: string;
    documentType: number;
    documentNumber: string;
    documentStatus: number;
    statusChangeReason: number;
    registeredKycName: string | null;
    uploadDetails: DocumentUploadDetail[];
    documentDetails: DocumentDetail[];
    extractionDetails: DocumentDetail[];
    registeredDetails?: {
      name: string;
      state?: string; // Only present in case of voter id
      isPanAadharLinked: boolean;
    };
    autoVerificationStatus?: number,
  }
  
  interface DocumentUploadDetail {
    id: number;
    createdAt: string;
    updatedAt: string;
    tenantId: number;
    subOrgId: number;
    userId: string;
    taskId: string;
    documentSide: number;
    documentUrl: string;
    isDocumentCopyStored: boolean;
  }
  
  interface DocumentDetail {
    id: number;
    createdAt: string;
    updatedAt: string;
    tenantId: number;
    subOrgId: number;
    userId: string;
    taskId: string;
    field: string;
    value: string;
    isMismatch: boolean;
  }
  
  export interface GuardianKycDetails {
    totalDocuments: number;
    userDocuments: UserDocument[];
  }

  export interface PanDetails {
    name?: string,
    panId?: string
  }
  