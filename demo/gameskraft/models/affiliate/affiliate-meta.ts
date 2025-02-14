export interface AffiliateMetaInfoDao {
    menuFilters: Array<AffiliateMenuFilterDao>,
    emptyPaymentsText: string;
    emptyUsersText: string;
    comingSoonText: string;
}

export interface AffiliateMenuFilterDao {
    type: number,
    title: string,
    default: boolean,
    enable: boolean,
    startingText: string,
    fromDateUTCTimeStamp: number;
    toDateUTCTimeStamp: number;
}

export interface AffiliateMetaInfo {
    menuFilters: Array<AffiliateMenuFilters>
    emptyPaymentsText: string;
    emptyUsersText: string;
    comingSoonText: string;
}

export interface AffiliateMenuFilters {
    type: number,
    title: string,
    default: boolean,
    enable: boolean,
    startingText: string,
    fromDate: string;
    toDate: string;
}