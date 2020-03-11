import { Router } from "express";
import {
  insertCategory,
  editCategory,
  findOneCategory,
  findAllCategory
} from "../services/categoryDB";

const router = Router();

router.post("/insert/:id", async (req, res) => {
  try {
    const insert = await insertCategory(req.params.id, req.body);
    if (insert) {
      return res.status(200).send(insert);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    const update = await editCategory(req.params.id, req.body.name);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

router.get("/find/:id", async (req, res) => {
  try {
    const find = await findOneCategory(req.params.id);
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

router.get("/findAll", async (req, res) => {
  try {
    const find = await findAllCategory();
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

export default router;
