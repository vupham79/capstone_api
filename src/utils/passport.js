import passport from "passport";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User } from "../models";

require("dotenv").config();

passport.serializeUser(function(user, done) {
  console.log("serial:", user);
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  console.log("deserial:", user);
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      passReqToCallback: true,
      clientID: process.env.clientID,
      clientSecret: process.env.clientSecret,
      callbackURL: "https://localhost:8000/auth/facebook/callback",
      profileFields: ["id", "displayName", "link", "email"]
    },
    async function(req, accessToken, refreshToken, profile, done) {}
  )
);

export default passport;
