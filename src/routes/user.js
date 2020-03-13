import { Router } from "express";
import { findAllUser, deactivateUser, activateUser } from "../services/userDB";
import { authAdmin } from "../services/middleware";
import { client as redis } from "../utils/redis_";
import { login } from "../services/userDB";
import jwt from "jsonwebtoken";
const router = Router();

router.post("/", async (req, res) => {
  try {
    const { accessToken, id, name, email, picture } = req.body;
    jwt.sign(
      { accessToken: accessToken, email: email, id: id },
      process.env.secret,
      async (err, token) => {
        const data = await login({ token, id, name, email, picture });
        if (err) {
          return res.status(500).send(err);
        }
        if (data) {
          redis.set(token, id);
          res.cookie("userToken", token, {
            expires: new Date(Date.now() + 365 * 24 * 3600 * 1000),
            signed: true
          });
          return res.status(200).send("Success");
        } else {
          return res.status(400).send("User is inactivated!");
        }
      }
    );
  } catch (error) {
    return res.status(400).send({ error });
  }
});

router.get("/logout", async (req, res) => {
  try {
    redis.del(req.signedCookies["userToken"]);
    return res
      .cookie("userToken", "", { maxAge: Date.now() })
      .status(200)
      .send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

router.patch("/deactivate/:id", authAdmin, async (req, res) => {
  try {
    const update = await deactivateUser(req.params.id);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

router.patch("/activate/:id", authAdmin, async (req, res) => {
  try {
    const update = await activateUser(req.params.id);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

router.get("/findAll", authAdmin, async (req, res) => {
  try {
    const find = await findAllUser();
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

export default router;
