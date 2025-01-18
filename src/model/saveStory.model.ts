import { Schema } from "mongoose"
import mongoose from "mongoose"


const saveStorySchema = new Schema({
    userId: {
        tpye: Schema.Types.ObjectId,
        ref: "User",
    },
    storyId: {
        type: Schema.Types.ObjectId,
        ref: "Story",
    },
    status: {
        type: String,
        enum: ["save", "unsaved"],
    }
}, { timestamps: true })

export const Save = mongoose.model("Save", saveStorySchema)