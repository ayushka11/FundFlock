export interface AffiliatePayments{
    userId?: number;
    invoiceNumber?: string;
    startDate?: string;
    endDate?: string;
    paidAmount?: number;
    gstAmount?: number;
    actualAmount?: number;
    benefitAmount?: number;
    extraPaidAmount?: number;
    invoiceLink?: string;
    comments?: string;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IAffiliatePayments {
    userId?: number
    invoiceNumber?: string
    startDate?: string
    endDate?: string
    paidAmount?: number
    invoiceLink?: string
}