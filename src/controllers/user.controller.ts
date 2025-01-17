import { NextFunction, Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";
import { User } from "../model/user.model";
import { findById, findUserByTheirEmail, generateAccessAndRefreshToken } from "../services/mongoose.service";
import jwt, { JwtPayload } from "jsonwebtoken";


// test the route
export const testRoute = asyncHandler(async (req: Request, res: Response) => {
    res.json(new apiResponse(201, "controller run successfully.I am your server", {}))
})




// when user registeration through google auth20
export const userRegistration = asyncHandler(async (req: any, res: Response) => {
    console.log("get the profile from passport.ts : ", req.user)
    const user = req.user;
    if (!user) {
        throw new apiError(400, "something is wrong while registering through google ")
    }

    await User.create(
        {
            username: user.username,
            email: user.email,
            socialId: user.socialId,
        }
    )

    const findUser = await findUserByTheirEmail(user.username, user.email)
    console.log("after saving in database : ", findUser);

    if (findUser) {
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(findUser._id.toString())
        console.log("jwt tokens are : ", { accessToken, refreshToken })
        const options = {
            httpOnly: true,
            secure: true,
        }
        res.cookie("AccessToken", accessToken, options)
        res.cookie("RefreshToken", refreshToken, options);
        // res.status(201).json(
        //     new apiResponse(201, "User registration successfully..", findUser)
        // )
        res.redirect('http://localhost:5173/');
    } else {
        throw new apiError(400, "something is wrong while saving in database")
    }

})



// return the current user data
export const currentUser = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
        throw new apiError(404, "user is not authorized")
    }
    const user = req.user
    console.log("authorized current user is : ", user)
    return res.status(201).json(
        new apiResponse(201, "fetch current user successfully", user)
    )
})



// refreshed the access and refresh token
export const refreshedTokens = asyncHandler(async (req: Request, res: Response) => {
    // get the refreshed token
    if (!req.cookies || !req.cookies.RefreshToken) {
        throw new apiError(401, "user don't have any tokens")
    }
    const CurrrefreshToken = req.cookies.RefreshToken;

    const decodedRefreshToken = jwt.verify(CurrrefreshToken, process.env.REFRESH_TOKEN_KEY!) as JwtPayload;
    if (!decodedRefreshToken) {
        throw new apiError(404, "there is something wrong while refreshing the refresh token")
    }
    const userId = decodedRefreshToken.id as string;
    const findUser = await findById(userId);

    if (!findUser) {
        throw new apiError(404, "user is not in database");
    }
    if (findUser) {
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(userId)
        const options = {
            httpOnly: true,
            secure: true,
        }
        res.cookie("AccessToken", accessToken, options)
        res.cookie("RefreshToken", refreshToken, options);
        res.status(202).json(
            new apiResponse(203, "refrsh both tokens successfully", findUser)
        )
    }


})