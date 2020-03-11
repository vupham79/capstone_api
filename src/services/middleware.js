import jwt from "jsonwebtoken";
import { client as redis, get } from "../utils/redis";
require("dotenv").config();

export async function authUser(req, res, next) {
  try {
    const user = jwt.verify(req.signedCookies["userToken"], process.env.secret);
    if (user) {
      redis.get(req.signedCookies["userToken"], (err, reply) => {
        if (err) {
          throw "Invalid token";
        }
        if (reply) {
          console.log(reply);
          req.user = user;
          next();
        }
      });
    } else {
      throw "Invalid token";
    }
  } catch (error) {
    return res.status(400).send("Not Authenticated!");
  }
}

export async function authAdmin(req, res, next) {
  try {
    const admin = jwt.verify(
      req.signedCookies["adminToken"],
      process.env.secret
    );
    if (admin) {
      redis.get(req.signedCookies["adminToken"], (err, reply) => {
        if (err) {
          throw "Invalid token";
        }
        if (reply) {
          req.admin = admin;
          next();
        }
      });
    } else {
      throw "Invalid token";
    }
  } catch (error) {
    return res.status(400).send("Not Authenticated!");
  }
}

export async function authAll(req, res, next) {
  try {
    let auth = false;
    console.log("START");
    redis.get(req.signedCookies["adminToken"], (err, reply) => {
      if (reply) {
        console.log("Admin: ", reply);
        auth = true;
      }
      redis.get(req.signedCookies["userToken"], (err, reply) => {
        if (reply) {
          console.log("User: ", reply);
          auth = true;
        }
        if (auth) {
          next();
        }
      });
    });
  } catch (error) {
    return res.status(400).send("Not Authenticated!");
  }
}
