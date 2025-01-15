import { NextFunction, Request, Response } from "express";
import { apiError } from "../utils/apiError";


export const globalErrorHandler = (err: apiError, req: Request, res: Response, next: NextFunction) => {
    const checkApiError = err instanceof apiError;

    const statusCode = checkApiError ? err.statusCode : 500;
    const message = checkApiError ? err.message : "something is wrong with server"
    const success = checkApiError ? err.success : false;
    const data = checkApiError ? err.data : null;
    const errors = checkApiError ? err.errors : [];
    const stack = checkApiError ? err?.stack : "";

    res.json(
        {
            statusCode,
            message,
            success,
            errors,
            data,
            stack,
        }
    )
}