import { client as redis } from "../utils/redis_";
import jwt from "jsonwebtoken";

export function login(req, res) {
  try {
    const token = jwt.sign(
      { username: req.user.username, _id: req.user._id },
      process.env.secret
    );
    redis.set(token, req.user.username);
    return res
      .status(200)
      .cookie("adminToken", token, {
        signed: true,
        expires: new Date(Date.now() + 365 * 24 * 3600 * 1000)
      })
      .send();
  } catch (error) {
    return res.status(500).send({ error });
  }
}

export function logout(req, res) {
  try {
    redis.del(req.signedCookies["adminToken"]);
    return res
      .cookie("adminToken", "", { maxAge: Date.now() })
      .status(200)
      .send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}
