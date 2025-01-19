import { Router } from "express";
const router = Router()
import { verifyUser } from "../middlewares/auth.middleware";
import { getAllStoriesByUserId, getAllStory, saveNewStories } from "../controllers/story.controller";


// save new story 
router.route("/save-newStories").post(verifyUser, saveNewStories);
// fetch all stories by current userID
router.route("/getAllStoriesOfCurrentUser").get(verifyUser, getAllStoriesByUserId);

//fetch all the stories
router.route("/getAllStories").get(getAllStory);
export default router;