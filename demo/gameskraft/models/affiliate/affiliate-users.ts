export interface AffiliateUsers{
    userId?: number;
    affiliateUserId?: number;
    startDate?: string;
    lastPlayedDate?: string;
    status?: number;
    comments?: string;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface IAffiliateUsers {
    userId?: number
    userName?: string;
    displayPicture?: string;
    rakeStartDate?: string;
    lastPlayedDate?: string;
}