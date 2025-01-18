import { Schema, Types } from "mongoose";
import mongoose from "mongoose";

const likeSchema = new Schema(
  {
    likeStauts: {
      type: String,
      enum: ["like", "dislike"],
    },
    userId: {
      type: Schema.Types.ObjectId, 
      ref: "User",
    },
    storyId: {
      type: Schema.Types.ObjectId,
      ref: "Story",
    },
  },
  { timestamps: true }
);

export const Like = mongoose.model("Like", likeSchema);
