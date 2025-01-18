import { Request, Response } from "express";
import { userDocument } from "../model/user.model";
import { asyncHandler } from "../utils/asyncHandler";
import { apiError } from "../utils/apiError";
import { Comment } from "../model/comment.model";
import { apiResponse } from "../utils/apiResponse";
import mongoose from "mongoose";

// handle comment action by user
export const writeCommentByUser = asyncHandler(async (req: Request, res: Response) => {
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
    const { content } = req.body;
    if (!content) {
        throw new apiError(404, "comment content is required")
    }

    await Comment.create({
        content: content,
        userId: user._id,
        storyId: storyId,
    })

    return res.status(200).json(
        new apiResponse(200, "user write comment successfully", {})
    )
})






