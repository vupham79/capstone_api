import { Router } from "express";
import {
  editAdmin,
  findAllAdmin,
  findOneAdmin,
  loginAdmin
} from "../services/adminDB";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const login = await loginAdmin(req.body.username, req.body.password);
    if (login) {
      return res.status(200).send(login);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.patch("/update", async (req, res) => {
  try {
    const update = await editAdmin(req.body.username, req.body.password);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/find", async (req, res) => {
  try {
    const find = await findOneAdmin(req.body.username);
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/findAll", async (req, res) => {
  try {
    const find = await findAllAdmin();
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

export default router;
