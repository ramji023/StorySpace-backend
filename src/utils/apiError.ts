export class apiError extends Error {
    statusCode: number;
    data: string | null;
    errors: Array<string>;
    stack?: string;
    success: boolean;

    constructor(
        statusCode: number,
        message: string,
        data: string = null,
        errors: string[] = [],
        success: boolean = false,
        stack?: string
    ) {
        super(message);

        this.statusCode = statusCode;
        this.data = data;
        this.errors = errors;
        this.success = success;


        // Ensures the error's prototype is set to apiError
        Object.setPrototypeOf(this, apiError.prototype);
        
        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }

}
