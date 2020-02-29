import { Router } from "express";
import {
  insertSitePath,
  findAllSitePath,
  findOneSitePath,
  updateSitePath
} from "../services/sitePathDB";

const router = Router();

router.post("/insert", async (req, res) => {
  try {
    const insert = await insertSitePath(req.body.pathName);
    if (insert) {
      return res.status(200).send(insert);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.patch("/update", async (req, res) => {
  try {
    const update = await updateSitePath(req.body.pathName);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/findAll", async (req, res) => {
  try {
    const sitepaths = await findAllSitePath();
    if (sitepaths) {
      return res.status(200).send(sitepaths);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/find/:pathName", async (req, res) => {
  try {
    const sitepath = await findOneSitePath(req.params.pathName);
    if (sitepath) {
      return res.status(200).send(sitepath);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

export default router;
