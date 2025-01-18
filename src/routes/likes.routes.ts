import { toggleLikeStories } from "../controllers/like.controller";
import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware";
const router = Router()

router.route("/like/:storyID").post( verifyUser,toggleLikeStories)


export default router;