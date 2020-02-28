import { Router } from "express";
import {
  editAdmin,
  findAllAdmin,
  findOneAdmin,
  loginAdmin
} from "../services/adminDB";

const router = Router();

router.get("/login", async (req, res) => {
  try {
    await loginAdmin(req.query.username, req.query.password)
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
    await editAdmin(req.query.username, req.query.password)
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

router.get("/find/:username", async (req, res) => {
  try {
    await findOneAdmin(req.params.username)
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
    await findAllAdmin()
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
