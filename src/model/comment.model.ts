import { Schema } from "mongoose"
import mongoose from "mongoose"


const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
    },
    userId: {
        tpye: Schema.Types.ObjectId,
        ref: "User",
    },
    storyId: {
        type: Schema.Types.ObjectId,
        ref: "Story",
    }
}, { timestamps: true })

export const Comment = mongoose.model("Comment", commentSchema)