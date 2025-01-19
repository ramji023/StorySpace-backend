import mongoose, { Types, Schema } from "mongoose";

const storySchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    content: {
        type: String,
        required: true,
    },
    userID: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    }
}, { timestamps: true })

export const Story = mongoose.model("Story", storySchema);