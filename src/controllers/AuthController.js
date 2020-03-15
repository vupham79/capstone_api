import jwt from "jsonwebtoken";
import { client as redis } from "../utils/redis_";

export async function authAdmin(req, res, next) {
  try {
    const admin = jwt.verify(
      req.signedCookies["adminToken"],
      process.env.secret
    );
    if (admin) {
      redis.get(req.signedCookies["adminToken"], (err, reply) => {
        if (reply) {
          req.admin = admin;
          next();
        } else return res.status(401).send("Not Authenticated!");
      });
    } else {
      return res.status(401).send("Not Authenticated!");
    }
  } catch (error) {
    return res.status(401).send("Not Authenticated!");
  }
}

export async function authUser(req, res, next) {
  try {
    const user = jwt.verify(req.signedCookies["userToken"], process.env.secret);
    if (user) {
      redis.get(req.signedCookies["userToken"], (err, reply) => {
        if (reply) {
          req.user = user;
          next();
        } else return res.status(401).send("Not Authenticated!");
      });
    } else {
      return res.status(401).send("Not Authenticated!");
    }
  } catch (error) {
    return res.status(401).send("Not Authenticated!");
  }
}

export async function authAll(req, res, next) {
  try {
    let auth = false;
    redis.get(req.signedCookies["adminToken"], (err, reply) => {
      if (reply) {
        auth = true;
      }
      redis.get(req.signedCookies["userToken"], (err, reply) => {
        if (reply) {
          auth = true;
        }
        if (auth) {
          next();
        } else return res.status(401).send("Not Authenticated!");
      });
    });
  } catch (error) {
    return res.status(401).send("Not Authenticated!");
  }
}