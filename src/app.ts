import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
import passport from "passport";
const app = express();
app.use(cors());
const server = http.createServer(app);


// use middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())



import "./strategies/passport"; // run passport.ts file
app.use(passport.initialize())// use and initialize passport


// // test the server
// app.get("/", (req: Request, res: Response) => {
//     res.send("Hey Client, I am a server")
// })

// test the controller
// import userRoute from "./routes/user.routes"
// app.use("/api/v1/users", userRoute);


// handle all user based actions like authentication etc etc
import userRoute from "./routes/user.routes"
app.use("/api/v1/users", userRoute);

//handle all story based actions like add-stories,save-stories,fetch-AllStories
import storyRoute from "./routes/story.routes"
app.use("/api/v1/story", storyRoute);

//handle all user-like based actions
import likeRoute from "./routes/likes.routes"
app.use("/api/v1/likes", likeRoute)

//handle all user-comment based action
import commentRoute from "./routes/comment.routes"
app.use("/api/v1/comments", commentRoute)

//handle all user-saveStory based action
import saveStory from "./routes/saveStory.routes"
app.use("/api/v1/saveStories", saveStory);




// import global error handler
import { globalErrorHandler } from "./middlewares/error.middleware";
app.use(globalErrorHandler);  // handle globally errors


export default server;

