import jwt, { JwtPayload } from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler";
import { NextFunction, Response, Request } from "express";
import { apiError } from "../utils/apiError";
import { findById } from "../services/mongoose.service";
import { userDocument } from "../model/user.model";

export const verifyUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    console.log("auth middleware called..")
    // Check if the client sent cookies and if the AccessToken exists
    console.log("cookies are :",req.cookies?.AccessToken);
    if (!req.cookies||req.cookies.AccessToken===undefined) {
        throw new apiError(401, "There is no token provided by the client");
    }

    const token = req.cookies.AccessToken;
    console.log(token)
    try {
        // Decode and verify the JWT
        const decodeToken = jwt.verify(token, process.env.ACCESS_TOKEN_KEY!) as JwtPayload;

        console.log("Decoded token:", decodeToken);

        // check the token contains the _id property
        if (typeof decodeToken === "object" && "id" in decodeToken) {
            const userId = decodeToken.id as string;

            // Check if the user in the database
            // console.log(userId)
            const existedUser = await findById(userId);
            if (existedUser) {
                req.user = existedUser as userDocument;
                return next();
            } else {
                throw new apiError(401, "No user found with the provided token");
            }
        } else {
            throw new apiError(401, "Invalid token or missing '_id' property");
        }
    } catch (error) {
        console.error("Error verifying token:", error);
        throw new apiError(401, "Error verifying the token");
    }
});
