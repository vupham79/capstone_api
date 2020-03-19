import jwt from "jsonwebtoken";
import { client as redis, checkTokenExist } from "../utils/redis_";

export async function authAdmin(req, res, next) {
  try {
    const admin = jwt.verify(
      req.signedCookies["adminToken"],
      process.env.secret
    );
    if (admin) {
      const exist = await checkTokenExist(req.signedCookies["adminToken"]);
      if (exist) {
        req.admin = admin;
        next();
      } else {
        return res.status(401).send("Not Authenticated!");
      }
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
      const exist = await checkTokenExist(req.signedCookies["userToken"]);
      if (exist) {
        req.user = user;
        next();
      } else {
        return res.status(401).send("Not Authenticated!");
      }
    } else {
      return res.status(401).send("Not Authenticated!");
    }
  } catch (error) {
    return res.status(401).send("Not Authenticated!");
  }
}

export async function authAll(req, res, next) {
  try {
    const existUser = await checkTokenExist(req.signedCookies["userToken"]);
    const existAdmin = await checkTokenExist(req.signedCookies["adminToken"]);
    if (existAdmin || existUser) {
      next();
    } else return res.status(401).send("Not Authenticated!");
  } catch (error) {
    return res.status(401).send("Not Authenticated!");
  }
}
