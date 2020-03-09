import jwt from "jsonwebtoken";
require("dotenv").config();

export async function authUser(req, res, next) {
  try {
    const user = jwt.verify(req.signedCookies["userToken"], process.env.secret);
    if (user) {
      req.user = user;
      next();
    } else {
      throw "Invalid user ID";
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
      req.admin = admin;
      next();
    } else {
      throw "Invalid user ID";
    }
  } catch (error) {
    return res.status(400).send("Not Authenticated!");
  }
}

export async function authAll(req, res, next) {
  try {
    let auth = false;
    jwt.verify(
      req.signedCookies["adminToken"],
      process.env.secret,
      (errAdmin, resultAdmin) => {
        if (resultAdmin) {
          req.admin = resultAdmin;
          auth = true;
        }
        jwt.verify(
          req.signedCookies["userToken"],
          process.env.secret,
          (errUser, resultUser) => {
            if (resultUser) {
              req.user = resultUser;
              auth = true;
            }
          }
        );
      }
    );
    if (auth) {
      next();
    } else {
      throw "Invalid user ID";
    }
  } catch (error) {
    return res.status(400).send("Not Authenticated!");
  }
}
