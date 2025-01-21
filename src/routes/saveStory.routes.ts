import { getAllSavedStory, toggleSaveStories } from "../controllers/save.controller";
import { Router } from "express";
import { verifyUser } from "../middlewares/auth.middleware";
const router = Router();

router.route("/save-stories/:storyID").post(verifyUser, toggleSaveStories)
router.route("/save-stories").get(verifyUser, getAllSavedStory);
export default router;

