export interface GuardianTaskResponse {
    id?: number,
    tenantId?: number,
    subOrgId?: number,
    userId?: string,
    taskId?: string,
    documentType?: number,
    expirationTime?: number,
    status?: number,
    documentExpirationTime?: number,
    isTemporary?: string
}

interface GuardianDocumentFieldDetails {
    field: string,
    value: string
}

export interface GuardianDocumentDetails {
    documentDetails?: GuardianDocumentFieldDetails[],
    documentNumber?: string
}