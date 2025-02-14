import InvoiceServiceError from "./invoice-error";
import InvoiceErrorCodes from "./invoice-error-codes";
import ServiceErrorUtil from "../service-error-util";

class InvoiceServiceErrorUtil extends ServiceErrorUtil {
    public static getRuntimeError(): InvoiceServiceError {
        return InvoiceServiceError.get(InvoiceErrorCodes.RUNTIME_ERROR);
    }

    public static getInvalidInvoiceId(): InvoiceServiceError {
        return InvoiceServiceError.INVALID_INVOICE_ID;
    }

    public static getInvalidDateFilter(): InvoiceServiceError {
        return InvoiceServiceError.INVALID_DATE_FILTER;
    }

    public static getError(error: Error): InvoiceServiceError {
        if (!(error instanceof InvoiceServiceError)) {
            return this.getRuntimeError();
        }
        return error;
    }

    public static wrapError(error: any): InvoiceServiceError {
        return InvoiceServiceError.get({
            name: error.name,
            code: error.code,
            message: error.message,
            type: `InvoiceServiceError:${error.type}`,
        });
    }
}

export default InvoiceServiceErrorUtil;