import { Router } from "express";
import passport from "../utils/passport";
import jwt from "jsonwebtoken";
import { client as redis } from "../utils/redis";
require("dotenv").config();
const router = Router();

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/error" }),
  async (req, res) => {
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
      console.log(error);
      return res.status(500).send({ error });
    }
  }
);

router.get("/logout", async (req, res) => {
  try {
    redis.del(req.signedCookies["adminToken"]);
    return res
      .clearCookie("adminToken")
      .status(200)
      .send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

// router.patch("/update", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const update = await editAdmin(username, password);
//     if (update) {
//       return res.status(200).send(update);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(500).send({ error });
//   }
// });

// router.get("/find", async (req, res) => {
//   try {
//     const { username } = req.body;
//     const find = await findOneAdmin(username);
//     if (find) {
//       return res.status(200).send(find);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(500).send({ error });
//   }
// });

// router.get("/findAll", async (req, res) => {
//   try {
//     const find = await findAllAdmin();
//     if (find) {
//       return res.status(200).send(find);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(500).send({ error });
//   }
// });

export default router;
