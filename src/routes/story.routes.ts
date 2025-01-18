import { Router } from "express"; 
const router = Router()
import { verifyUser } from "../middlewares/auth.middleware";
import { saveNewStories } from "../controllers/story.controller";

router.route("/save-newStories").post(verifyUser,saveNewStories);




export default router;