class InvoiceErrorCodes {

    private static BaseErrorCode = 18000;
    static RuntimeError = InvoiceErrorCodes.BaseErrorCode + 1;
    static InvalidInvoiceId = InvoiceErrorCodes.BaseErrorCode + 2;
    static InvalidDateFilter = InvoiceErrorCodes.BaseErrorCode + 3;

    static readonly RUNTIME_ERROR = new InvoiceErrorCodes(
        InvoiceErrorCodes.RuntimeError,
        'Something went wrong',
        'APPLICATION_RUNTIME_ERROR',
    );

    static readonly INVALID_INVOICE_ID = new InvoiceErrorCodes(
        InvoiceErrorCodes.InvalidInvoiceId,
        'Invoice id is not valid',
        'INVALID_INVOICE_ID',
    );

    static readonly INVALID_DATE_FILTER = new InvoiceErrorCodes(
        InvoiceErrorCodes.InvalidDateFilter,
        'Invalid date filter',
        'INVALID_DATE_FILTER',
    );

    // private to disallow creating other instances of this type
    private constructor(
        public code: number,
        public message: string,
        public name: string,
        public type?: string,
    ) {}
    toString(): string {
        return `${this.name}:${this.code}:${this.message}`;
    }
}

export default InvoiceErrorCodes;