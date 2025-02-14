export default class DownloadInvoiceInfoDao {
    invoicePdfLink?: string;

    public static get(downloadInvoiceInfoDao: DownloadInvoiceInfoDao): DownloadInvoiceInfo {
        return {
            invoicePdfLink: downloadInvoiceInfoDao.invoicePdfLink,
        };
    }
}

export interface DownloadInvoiceInfo {
    invoicePdfLink?: string;
}