import { Request, Response } from "express";
import { apiResponse } from "../utils/apiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";
import { User } from "../model/user.model";
import { findUserByTheirEmail, generateAccessAndRefreshToken } from "../services/mongoose.service";



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
    console.log("after saving in database : ",findUser);
    
    if (findUser) {
        const { accessToken, refreshToken } = await generateAccessAndRefreshToken(findUser._id.toString())
       console.log("jwt tokens are : ",{accessToken,refreshToken})
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