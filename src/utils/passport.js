import passportJWT from "passport-jwt";
import passport from "passport";
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

export default passport;
