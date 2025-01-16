import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20"

console.log("Initializing Passport strategy...");

passport.use(new GoogleStrategy(
    {
        clientID: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        callbackURL: process.env.GOOGLE_CALLBACK_URL!,
        scope: ['profile', 'email'],
    }, async function (
        accessToken: string,
        refreshToken: string,
        profile: Profile,
        cb: VerifyCallback,
    ) {

    const userData = {
        socialId:profile.id,
        username: profile.displayName,
        email: profile.emails?.[0]?.value,
    }
    // console.log(accessToken);
    // console.log(profile);
    console.log("collect data from google service : ",userData);
    cb(null, userData)
}))
export default passport;