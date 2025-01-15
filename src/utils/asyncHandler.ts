import { NextFunction, Request, Response } from "express"

type asyncHandle = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>

export const asyncHandler = (func: asyncHandle) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(func(req, res, next)).catch(next)
    }
}