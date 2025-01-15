export class apiResponse {
    statusCode: number;
    message: string;
    data: object;
    success: boolean;
    constructor(
        statusCode: number,
        message: string,
        data: object,
    ) {
        this.statusCode = statusCode;
        this.message = message;
        this.data = data;
        this.success = statusCode < 400;
    }
}