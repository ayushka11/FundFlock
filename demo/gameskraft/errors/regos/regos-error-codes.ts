class RegosErrorCodes {

    private static BaseErrorCode = 32000;
    private static RuntimeError = 1;

    static readonly RUNTIME_ERROR = new RegosErrorCodes(
        RegosErrorCodes.RuntimeError,
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

export default RegosErrorCodes;