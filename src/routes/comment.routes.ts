import { writeCommentByUser } from "../controllers/comment.controller";
import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware";
const router = Router()

router.route("/write-comment/:storyID").post(verifyUser,writeCommentByUser)


export default router;