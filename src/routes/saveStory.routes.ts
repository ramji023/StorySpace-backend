import { toggleSaveStories } from "../controllers/save.controller";
import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware";
const router = Router();

router.route("/save-stories/:storyID").post(verifyUser, toggleSaveStories)

export default router;

