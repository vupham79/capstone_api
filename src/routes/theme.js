import { Router } from "express";
import { insertTheme, findAllTheme, editTheme, findOneTheme } from "../services/themeDB";
import { authAdmin, authAll } from "../services/middleware";
const router = Router();

router.post("/insert/:id", async (req, res) => {
  try {
    const insert = await insertTheme(req.params.id, req.body);
    if (insert) {
      return res.status(200).send(insert);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

router.patch("/update/:id", authAdmin, async (req, res) => {
  try {
    const update = await editTheme(req.params.id, req.body);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

// router.patch("/delete/:id", async (req, res) => {
//   try {
//     const deleteTheme = await deleteTheme(req.params.id);
//     if (deleteTheme) {
//       return res.status(200).send(deleteTheme);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(400).send({ error });
//   }
// });

router.get("/find/:id", authAll, async (req, res) => {
  try {
    const find = await findOneTheme(req.params.id);
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

router.get("/findAll", authAll, async (req, res) => {
  try {
    const find = await findAllTheme();
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

export default router;
