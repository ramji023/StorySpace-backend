import {Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";




// test the route
export const testRoute = asyncHandler(async (req: Request, res: Response) => {
    res.json(new apiResponse(201, "controller run successfully.I am your server", {}))
})

// when user registeration through google auth20
export const userRegistration = asyncHandler(async (req: any, res: Response) => {
        console.log("get the profile from passport.ts : ",req.user)
})