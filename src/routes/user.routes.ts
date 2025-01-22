import { addAdditionalData, currentUser, refreshedTokens, testRoute } from "../controllers/user.controller";
import { Router } from "express";
import passport from "passport";
const router = Router();
import { userRegistration } from "../controllers/user.controller"
import { verifyUser } from "../middlewares/auth.middleware";

//test the route
router.route("/test").get(testRoute)

router.route("/auth/google").get(passport.authenticate('google', { session: false }));
router.route("/auth/google/callback").get(passport.authenticate('google', { failureRedirect: '/api/v1/users/auth/google', session: false }), userRegistration)

//get the current user
router.route("/current-user").get(verifyUser, currentUser);
// refresh the token
router.route("/refreshed-token").post(refreshedTokens);
// add additional data
router.route("/complete-profile").post(verifyUser, addAdditionalData);
export default router;