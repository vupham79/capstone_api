import { Router } from "express";
import {
  createUser,
  editUser,
  findAllUser,
  findOneUser,
  insertUser,
  deactivateUser,
  activateUser
} from "../services/userDB";

const router = Router();

router.get("/create", async (req, res) => {
  try {
    const user = await createUser();
    if (user) {
      return res.status(200).send(user);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.post("/insert/:id", async (req, res) => {
  try {
    const insert = await insertUser(req.params.id, req.body);
    if (insert) {
      return res.status(200).send(insert);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    const update = await editUser(req.params.id, req.body);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.patch("/deactivate/:id", async (req, res) => {
  try {
    const update = await deactivateUser(req.params.id);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.patch("/activate/:id", async (req, res) => {
  try {
    const update = await activateUser(req.params.id);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const find = await findOneUser(req.params.id);
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
    const find = await findAllUser();
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

export default router;
