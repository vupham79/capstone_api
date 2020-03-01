import { Router } from "express";
import {
  createTheme,
  editTheme,
  findAllTheme,
  findOneTheme,
  insertTheme,
  findAllThemeByAdmin
} from "../services/themeDB";

const router = Router();

router.get("/create", async (req, res) => {
  try {
    const create = await createTheme();
    if (create) {
      return res.status(200).send(create);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.post("/insert/:id", async (req, res) => {
  try {
    const insert = await insertTheme(req.params.id, req.body);
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
    const update = await editTheme(req.params.id, req.body);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.patch("/delete/:id", async (req, res) => {
  try {
    const deleteTheme = await deleteTheme(req.params.id);
    if (deleteTheme) {
      return res.status(200).send(deleteTheme);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const find = await findOneTheme(req.params.id);
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
    const find = await findAllTheme();
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/findAllByAdmin", async (req, res) => {
  try {
    const find = await findAllThemeByAdmin(
      req.query.username,
      req.query.password
    );
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

export default router;
