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
    async function(req, accessToken, refreshToken, profile, done) {
      const user = await User.findOne({
        id: profile.id
      });
      if (user) {
        await User.updateOne(
          {
            id: profile.id
          },
          {
            accessToken: accessToken
          },
          function(err, user) {
            if (err) {
              done(err);
            } else {
              req.user = {
                ...user,
                accessToken
              };
              done(null, user);
            }
          }
        );
      } else {
        await User.create(
          {
            id: profile.id,
            displayName: profile.displayName,
            email: profile.emails && profile.emails[0].value,
            accessToken: accessToken,
            picture: `${process.env.facebookAPI}/${profile.id}/picture?type=large`
          },
          function(err, user) {
            if (err) {
              done(err);
            } else {
              req.user = {
                ...user,
                accessToken
              };
              done(null, user);
            }
          }
        );
      }
    }
  )
);

export default passport;
