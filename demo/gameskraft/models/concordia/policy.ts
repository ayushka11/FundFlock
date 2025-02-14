interface IContentMeta{
    policyId: number;
    policyName: string;
    policyImageUrl: string;
    policyData: {
      heading: string;
      subHeading: string;
      policyText: {
        text: string;
        boldText: string[];
      };
    };
    policyButtonText: string[];
};

export interface IPolicy {
    createdAt: string;
    updatedAt: string;
    tenantId: number;
    subOrgId: number;
    policyId: number;
    version: number;
    name: string;
    url: string;
    status: number;
    priority: number;
    type: string;
    uuid: string;
    acceptanceDate: string;
    mandatoryAcceptanceDate: string;
    contentMeta: IContentMeta;
    policyMetadata: {};
    metadata: {};
}

export interface IPolicyAcknowledgement {
    userId: string,
    action: number
}