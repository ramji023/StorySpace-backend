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
    }
}, { timestamps: true })

export const Save = mongoose.model("Save", saveStorySchema)