import InvoiceErrorCodes from "./invoice-error-codes";
import ServiceError from "../service-error";

class InvoiceServiceError extends ServiceError {

    static readonly INVALID_INVOICE_ID = InvoiceServiceError.get(
        InvoiceErrorCodes.INVALID_INVOICE_ID,
    );

    static readonly INVALID_DATE_FILTER = InvoiceServiceError.get(
        InvoiceErrorCodes.INVALID_DATE_FILTER,
    );

    constructor(public name: string, public code: number, public message: any, public type: any) {
        super(name, code, message, type);
    }

    public static get(errorDetails: InvoiceErrorCodes): InvoiceServiceError {
        return new InvoiceServiceError(
            errorDetails.name,
            errorDetails.code,
            errorDetails.message,
            errorDetails.type || 'InvoiceServiceError',
        );
    }
}

export default InvoiceServiceError;