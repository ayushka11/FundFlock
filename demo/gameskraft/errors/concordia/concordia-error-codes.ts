class ConcordiaErrorCodes {

    private static BaseErrorCode = 22000;
    static RuntimeError = ConcordiaErrorCodes.BaseErrorCode + 1;


    static readonly RUNTIME_ERROR = new ConcordiaErrorCodes(
        ConcordiaErrorCodes.RuntimeError,
        'Something went wrong',
        'APPLICATION_RUNTIME_ERROR',
    );

    // private to disallow creating other instances of this type
    private constructor(
        public code: number,
        public message: string,
        public name: string,
        public type?: string,
    ) { }
    toString(): string {
        return `${this.name}:${this.code}:${this.message}`;
    }
}

export default ConcordiaErrorCodes;
