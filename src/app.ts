import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import "dotenv/config";
import cookieParser from "cookie-parser";
const app = express();
app.use(cors());
const server = http.createServer(app);


// use middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())



// test the server
app.get("/", (req: Request, res: Response) => {
    res.send("Hey Client, I am a server")
})


import { globalErrorHandler } from "./middlewares/error.middleware";
app.use(globalErrorHandler);  // handle globally errors


export default server;

