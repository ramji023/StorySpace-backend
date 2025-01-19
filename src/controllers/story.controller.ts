import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import { Request, Response } from "express";
import { Story } from "../model/story.model";
import { User, userDocument } from "../model/user.model";
import { apiResponse } from "../utils/apiResponse";
import { findAllStoryByUserId, getAllStories } from "../services/mongoose.service";

// save new story created by User in database
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
            description: data.description,
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


// get all the storeis created by an authorized user
export const getAllStoriesByUserId = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as userDocument;
    if (!user) {
        throw new apiError(404, "user is not authorized")
    }
    const userId = user._id;

    const result = await findAllStoryByUserId(userId.toString());
    console.log("all story is : ", result)
    if (result.length === 0) {
        return res.status(201).json(
            new apiResponse(201, "there is no story you have created", {})
        )
    }
    if (result.length !== 0) {
        return res.status(200).json(
            new apiResponse(200, "fetch all story by current user", result)
        )
    }
})



// get all the stories from database
export const getAllStory = asyncHandler(async (req: Request, res: Response) => {
    const result = await getAllStories();
    if (result.length === 0) {
        return res.status(201).json(
            new apiResponse(201, "there is no story here ....", {})
        )
    }
    if (result.length !== 0) {
        return res.status(201).json(
            new apiResponse(201, "fetch all the stories..", result)
        )
    }
})