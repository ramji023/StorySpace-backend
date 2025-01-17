import { currentUser, testRoute } from "../controllers/user.controller";
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


export default router;