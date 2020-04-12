import { client as redis } from "../utils/redis_";
import * as UserService from "../services/UserService";
import { getUserPages } from "../services/FacebookAPI";
import jwt from "jsonwebtoken";

export async function login(req, res) {
  try {
    const { accessToken, id, name, email, picture } = req.body;
    jwt.sign(
      { accessToken: accessToken, email: email, id: id },
      process.env.secret,
      async (err, token) => {
        const data = await UserService.login({
          token,
          id,
          name,
          email,
          picture,
        });
        if (err) {
          return res.status(500).send(err);
        }
        if (data) {
          redis.set(token, id);
          res.cookie("userToken", token, {
            expires: new Date(Date.now() + 365 * 24 * 3600 * 1000),
            signed: true,
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
}

export async function logout(req, res) {
  try {
    redis.del(req.signedCookies["userToken"]);
    return res
      .cookie("userToken", "", { maxAge: Date.now() })
      .status(200)
      .send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}

export async function deactivateUser(req, res) {
  try {
    const update = await UserService.deactivateUser(req.params.id);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}

export async function activateUser(req, res) {
  try {
    const update = await UserService.activateUser(req.params.id);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}

export async function findAllUser(req, res) {
  try {
    const find = await UserService.findAllUser();
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}

export async function getAllPages(req, res) {
  try {
    const data = await getUserPages(req.user.accessToken);
    if (data && data.accounts) {
      return res.status(200).send(data.accounts.data);
    }
    return res.status(400).send("No data found!");
  } catch (error) {
    return res.status(400).send({ error });
  }
}
