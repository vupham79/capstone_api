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
    await insertSitePath(req.body.pathName)
      .then(result => {
        return res.status(200).send(result);
      })
      .catch(error => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.patch("/update", async (req, res) => {
  try {
    await updateSitePath(req.body.pathName)
      .then(result => {
        return res.status(200).send(result);
      })
      .catch(error => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/findAll", async (req, res) => {
  try {
    await findAllSitePath()
      .then(result => {
        return res.status(200).send(result);
      })
      .catch(error => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/find/:pathName", async (req, res) => {
  try {
    await findOneSitePath(req.params.pathName)
      .then(result => {
        return res.status(200).send(result);
      })
      .catch(error => {
        return res.status(500).send({ error });
      });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

export default router;
