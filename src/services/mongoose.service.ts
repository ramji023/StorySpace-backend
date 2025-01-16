import { User } from "../model/user.model"
import { apiError } from "../utils/apiError";


// find the user by their id
export const findById = async (userId: string) => {
    const existedUser = await User.findById(userId);
    if (existedUser) {
        return existedUser;
    }
    return null;
}


//find the user by their username & email
export const findUserByTheirEmail = async (username: string, email: string) => {
    const existedUser = await User.findOne(
        {
            $or: [{ username }, { email }]
        }
    ).select("-socialId -refreshToken")
    if (existedUser) {
        return existedUser;
    }
    return null;
}


// define function to generate access and refresh token
export const generateAccessAndRefreshToken = async (userID: string) => {
    try {
        const user = await findById(userID)
        console.log("user exist : ", user);
        if (user) {
            const accessToken = user.generateAccessToken();
            const refreshToken = user.generateRefreshToken();
            user.refreshToken = refreshToken;
            await user.save({ validateBeforeSave: false });
            return { accessToken, refreshToken };
        } else {
            throw new apiError(400, "user is not in database")
        }
    } catch (err) {
        throw new apiError(400, "something is wrong while generating the tokens")
    }
}