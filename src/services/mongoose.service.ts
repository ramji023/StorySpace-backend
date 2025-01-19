import mongoose, { Schema, Types } from "mongoose";
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
    const showStorySnippetToCurrentUser = [
        {
            $match: {
                userID: new mongoose.Types.ObjectId(userId)
            }
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "storyId",
                as: "likeDetails"
            }
        },
        {
            $lookup: {
                from: "Comment",
                localField: "_id",
                foreignField: "storyId",
                as: "commentResult",
            }
        },
        {
            $addFields: {
                likeCount: { $size: "$likeDetails" },
                commentCount: { $size: "$commentResult" }
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                content: 1,
                likeCount: 1,
                commentCount: 1,
                createdAt: 1,
            }
        }
    ]

    const allStories = await Story.aggregate(showStorySnippetToCurrentUser);
    console.log("all stories fetched for current user : ", allStories);

    // If no stories are found, return an empty array
    if (allStories.length === 0) {
        return [];
    }

    const sortStories = allStories.map((story) => ({
        id: story._id.toString(), // Ensure _id is converted to a string
        title: story.title || "Untitled",
        description: story.description + "..." || "No content available...",
        image: extractImageFromContent(story.content) || "default-image-url.jpg",
        likeCount: story.likeCount || 0,
        commentCount: story.commentCount || 0,
        createdAt: formatDate(story.createdAt), // Ensure this formats the date properly
    }));
    return sortStories;
}
// Function to extract image from content
function extractImageFromContent(content: string): string | null {
    const regex = /<img\s+[^>]*src="([^"]*)"[^>]*>/;
    const match = content.match(regex);
    return match ? match[1] : null; // Return the first image URL or null
}
// function to formate date
function formatDate(dateString: string): string {
    // Parse the ISO date string into a Date object
    const date = new Date(dateString);

    // Extract day, month, and year
    const day = date.getUTCDate();
    const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
    const year = date.getUTCFullYear();

    // Format as 'DD MON YYYY'
    return `${day.toString().padStart(2, '0')} ${month} ${year}`;
}



// get all the story from database 
export const getAllStories = async () => {
    const pipeline = [
        {
            $lookup: {
                from: "users",
                localField: "userID",
                foreignField: "_id",
                as: "userDetail"
            }
        },
        {
            $unwind: "$userDetail"
        },
        {
            $lookup: {
                from: "likes",
                localField: "_id",
                foreignField: "storyId",
                as: "likeDetails"
            }
        },
        {
            $lookup: {
                from: "comments",
                localField: "_id",
                foreignField: "storyId",
                as: "commentResult",
            }
        },
        {
            $addFields: {
                author: "$userDetail.username",
                likeCount: { $size: "$likeDetails" },
                commentCount: { $size: "$commentResult" }
            }
        },
        {
            $project: {
                _id: 1,
                title: 1,
                content: 1,
                description: 1,
                author: 1,
                likeCount: 1,
                commentCount: 1,
                createdAt: 1,
            }
        }
    ]

    const getAllStories = await Story.aggregate(pipeline)

    console.log("get all stories from database : ", getAllStories);

    if (getAllStories.length === 0) {
        return [];
    }

    const sortStories = getAllStories.map((story) => (
        {
            id: story._id.toString(),
            author:story.author,
            title: story.title,
            description: story.description + "..." || "No content available...",
            image: extractImageFromContent(story.content) || "default-image-url.jpg",
            likeCount: story.likeCount || 0,
            commentCount: story.commentCount || 0,
            createdAt: formatDate(story.createdAt),
        }
    ))

    return sortStories;
}

