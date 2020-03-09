import { Router } from "express";
import { Site } from "../models";
import { authAdmin, authUser, authAll } from "../services/middleware";
const router = Router();

router.get("/findAll", authAdmin, async (req, res) => {
  try {
    const find = await Site.find().select("sitePath");
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

export default router;
