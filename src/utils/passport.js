import passportJWT from "passport-jwt";
import passport from "passport";
import { Admin } from "../models";
var LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
require("dotenv").config();

passport.use(
  new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.secret
    },
    function(jwtPayload, cb) {
      //find the user in db if needed. This functionality may be omitted if you store everything you'll need in JWT payload.
      if (jwtPayload.email && jwtPayload.accessToken) {
        return cb(null, jwtPayload);
      }
      return cb(null);
    }
  )
);

passport.use(
  new LocalStrategy(async function(username, password, done) {
    try {
      const admin = await Admin.findOne({ username: username });
      if (!admin) {
        return done(null, false, { message: "Incorrect username." });
      }
      if (admin.password !== password) {
        return done(null, false, { message: "Incorrect password." });
      }
      return done(null, admin);
    } catch (error) {
      return done(error);
    }
  })
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

export default passport;
