import { Router } from "express";
const router = Router()
import { verifyUser } from "../middlewares/auth.middleware";
import { getAllStoriesByUserId, saveNewStories } from "../controllers/story.controller";


// save new story 
router.route("/save-newStories").post(verifyUser, saveNewStories);
// fetch all recipe by current userID
router.route("/getAllRecipe").get(verifyUser, getAllStoriesByUserId);


export default router;