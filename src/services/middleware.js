import jwt from "jsonwebtoken";
require("dotenv").config();

export async function authUser(req, res, next) {
  try {
    const user = jwt.verify(req.signedCookies["userToken"], process.env.secret);
    if (user) {
      req.user = user;
      next();
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
    }
  } catch (error) {
    return res.status(400).send("Not Authenticated!");
  }
}
