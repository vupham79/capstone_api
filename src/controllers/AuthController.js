import jwt from "jsonwebtoken";
import { client as redis, checkTokenExist } from "../utils/redis_";

export async function authAdmin(req, res, next) {
  try {
    const admin = jwt.verify(
      req.signedCookies["adminToken"],
      process.env.secret
    );
    if (admin) {
      checkTokenExist(req.signedCookies["adminToken"]).then(result => {
        if (result) {
          req.admin = admin;
          next();
        } else {
          return res.status(401).send("Not Authenticated!");
        }
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
      checkTokenExist(req.signedCookies["userToken"]).then(result => {
        if (result) {
          req.user = user;
          next();
        } else {
          return res.status(401).send("Not Authenticated!");
        }
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
    checkTokenExist(req.signedCookies["userToken"]).then(result => {
      if (result) {
        next();
      } else {
        checkTokenExist(req.signedCookies["adminToken"]).then(result => {
          if (result) {
            next();
          } else {
            return res.status(401).send("Not Authenticated!");
          }
        });
      }
    });
  } catch (error) {
    return res.status(401).send("Not Authenticated!");
  }
}
