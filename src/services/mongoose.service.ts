import { Types } from "mongoose";
import { Story } from "../model/story.model";
import { User } from "../model/user.model"
import { apiError } from "../utils/apiError";


// find the user by their id
export const findById = async (userId: string) => {
    const existedUser = await User.findById(userId).select("-socialId -refreshToken");
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



//find all the recipe by User
export const findAllStoryByUserId = async (userId: string) => {
    const pipeline = [
        {
            $match: {
                userID: new Types.ObjectId(userId)
            }
        }
    ]
    const allStories = await Story.aggregate(pipeline);
    console.log("all stories fetched for current user : ",allStories);
    
    // If no stories are found, return an empty array
    if (allStories.length === 0) {
        return [];
    }
    const sortStories = allStories.map((story) => ({
        id: story._id,
        title: story.title,
        snippet: story.content.substring(0, 100) + "...", // Extract snippet
        image: extractImageFromContent(story.content) || "default-image-url.jpg",
    }));
    return sortStories;
}
// Function to extract image from content
function extractImageFromContent(content: string): string | null {
    const regex = /<img\s+[^>]*src="([^"]*)"[^>]*>/;
    const match = content.match(regex);
    return match ? match[1] : null; // Return the first image URL or null
}