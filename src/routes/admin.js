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
    const admin = await loginAdmin(req.body.username, req.body.password);
    if (admin) {
      return res.status(200).send(admin);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.patch("/update", async (req, res) => {
  try {
    await editAdmin(req.body.username, req.body.password)
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

router.get("/find", async (req, res) => {
  try {
    await findOneAdmin(req.body.username)
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
