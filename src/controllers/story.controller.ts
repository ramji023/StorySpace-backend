import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { Story } from "../model/story.model";
import { User, userDocument } from "../model/user.model";
import { apiResponse } from "../utils/apiResponse";

// save all the stories in database
export const saveNewStories = asyncHandler(async (req: Request, res: Response) => {
    const data = req.body;
    console.log("got story data by client-side", data);
    if (!data) {
        throw new apiError(404, "there is no story data")
    }
    const currentUser = req.user as userDocument;
    if (!currentUser) {
        throw new apiError(401, "user is not authorized..")
    }

    console.log("authorized user data : ", currentUser._id)
    try {
        const newStory = await Story.create({
            title: data.title,
            content: data.content,
            userID: currentUser._id,
        })
        console.log(newStory);
        return res.status(201).json(
            new apiResponse(201, "story saved in database successfully", newStory)
        )
    } catch (error) {
        throw new apiError(404, "something went wrong while saving story in database..")
    }

})