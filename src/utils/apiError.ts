export class apiError extends Error {
    statusCode: number;
    message: string;
    data: string;
    errors: Array<string>;
    stack?: string;
    success: boolean;
    constructor(
        statusCode: number,
        errors: string[] = [],
        data: string = null,
        message: string,
        success: boolean = false,
        stack: string = "",
    ) {
        super(message);

        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = success;
        this.errors = errors;
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}