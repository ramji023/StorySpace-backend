import mongoose, { Schema, Model } from "mongoose";
import jwt from "jsonwebtoken";

interface userInput {
    username: string;
    email: string;
    socialId: string,
    refreshToken?: string,
}

interface userDocument extends userInput, Document {
    generateAccessToken(): string,
    generateRefreshToken(): string,
}

const userSchema = new Schema<userDocument>({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    socialId: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
    }
}, { timestamps: true })

userSchema.methods.generateAccessToken = function (): string {
    const payload = {
        id: this._id,
        username: this.username,
        email: this.email,
    }
    const accesstoken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY!, { expiresIn: process.env.ACCESS_TOKEN_EXPIRATION })

    return accesstoken;
}

userSchema.methods.generateRefreshToken = function (): string {
    const payload = {
        id: this._id,
    }

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, { expiresIn: process.env.REFRESH_TOKEN_EXPIRATION })
    return refreshToken;
}


export const User: Model<userDocument> = mongoose.model<userDocument>("User", userSchema);