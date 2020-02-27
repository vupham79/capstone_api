import { Router } from "express";
import { editAdmin, findAllAdmin, findOneAdmin } from "../services/adminDB";

const router = Router();

router.patch("/update/:id", async (req, res) => {
  try {
    await editAdmin(req.params.id, req.body)
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

router.get("/find/:id", async (req, res) => {
  try {
    await findOneAdmin(req.params.id)
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
