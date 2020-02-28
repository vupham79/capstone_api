import { Router } from "express";
import {
  editPost,
  findAllPost,
  findOnePost,
  insertPost
} from "../services/postDB";

const router = Router();

router.post("/insert/:id", async (req, res) => {
  try {
    await insertPost(req.params.id, req.body)
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

router.patch("/update/:id", async (req, res) => {
  try {
    await editPost(req.params.id, req.body)
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
    await findOnePost(req.params.id)
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
    await findAllPost()
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
