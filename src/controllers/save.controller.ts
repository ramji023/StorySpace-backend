import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { userDocument } from "../model/user.model";
import { apiError } from "../utils/apiError";
import { apiResponse } from "../utils/apiResponse";
import mongoose from "mongoose";
import { Save } from "model/saveStory.model";

// handle toogle the like button by user
export const toggleSaveStories = asyncHandler(async (req: Request, res: Response) => {
    const user = req.user as userDocument;
    if (!user) {
        throw new apiError(401, "user is not authorized")
    }
    const storyId = req.params.storyID;
    if (!storyId) {
        throw new apiError(404, "story id required in request query")
    }
    if (!mongoose.Types.ObjectId.isValid(storyId)) {
        throw new apiError(400, "Invalid Story ID");
    }
    if (!req.query || !req.query.action) {
        throw new apiError(404, "something went wrong while getting user action from params")
    }
    const action = req.query.action as string;
    if (action !== "save" && action !== "unsaved") {
        throw new apiError(404, "user send invalid action in query")
    }
    // now check user already like/dislike the story
    const existedLikeDocument = await Save.findOne({ storyId, userId: user._id });
    if (existedLikeDocument) {
        existedLikeDocument.status = action;
        await existedLikeDocument.save({ validateBeforeSave: false })
        return res.status(200).json(
            new apiResponse(200, `user ${action} the story successfully`, {})
        )
    }
    if (!existedLikeDocument) {
        await Save.create({
            userId: user._id,
            storyId: storyId,
            status: action,
        })
        return res.status(200).json(
            new apiResponse(200, `user ${action} the story successfully`, {})
        )
    }
})