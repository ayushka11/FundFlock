export interface InvoiceMetaInfoDao {
    menuFilters: Array<InvoiceMenuFilterDao>,
    emptyText: string;
    comingSoonText: string;
}
export interface InvoiceMenuFilterDao {
    title: string,
    invoiceMenuFilterType: number,
    maxMonthsToShow: number,
    default: boolean,
    enable: boolean,
    startingText: string,
    filters: Array<{
        title: string,
        filterType: number,
        default?: boolean
    }>
}

export interface InvoiceMetaInfo {
    menuFilters: Array<InvoiceMenuFilters>
    emptyText: string;
    comingSoonText: string;
}

export interface InvoiceMenuFilters {
    title: string;
    invoiceMenuFilterType: number;
    fromDate: string;
    toDate: string;
    default: boolean;
    enable: boolean;
    startingText: string;
    filters: Array<{
        title: string;
        type: number;
        default: boolean;
    }>
}

export interface InvoiceMetaInfoDaoV2 {
    menuFilters: Array<InvoiceMenuFilterDaoV2>,
    emptyText: string;
    comingSoonText: string;
}
export interface InvoiceMenuFilterDaoV2 {
    title: string,
    invoiceMenuFilterType: number,
    default: boolean,
    enable: boolean,
    startingText: string,
    filters: Array<{
        title: string,
        filterType: number,
        default?: boolean,
        emptyText: string;
        comingSoonText: string;
        maxMonthsToShow: number;
        toDateUTCTimeStamp: number;
    }>
}

export interface InvoiceMetaInfoV2 {
    menuFilters: Array<InvoiceMenuFiltersV2>
    emptyText: string;
    comingSoonText: string;
}
export interface InvoiceMenuFiltersV2 {
    title: string;
    invoiceMenuFilterType: number;
    default: boolean;
    enable: boolean;
    startingText: string;
    filters: Array<{
        fromDate: string;
        toDate: string;
        title: string;
        type: number;
        default: boolean;
    }>
}