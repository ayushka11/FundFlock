import { VError } from '@netflix/nerror';
import ErrorCodes from './error-codes';

class UnauthorizedError extends VError {
	constructor(public name: string, public message: any, public code?: number) {
		super();
	}

	public static get(errorDetails: ErrorCodes): UnauthorizedError {
		return new UnauthorizedError(
			errorDetails.name,
			errorDetails.message,
			errorDetails.code,
		);
	}
}

export default UnauthorizedError;
