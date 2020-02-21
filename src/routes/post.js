import { Router } from "express";
import {
  createPost,
  insertPost,
  editPost,
  deletePost,
  findAllPost,
  findOnePost
} from "../actions/postDB";
import { authenticate } from "../actions/middleware";

const router = Router();

router.post("/insert/:id", authenticate, async (req, res) => {
  await insertPost(req.params.id, req.body)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.patch("/update/:id", authenticate, async (req, res) => {
  await editPost(req.params.id, req.body)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.patch("/delete/:id", authenticate, async (req, res) => {
  await deletePost(req.params.id)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.get("/find/:id", async (req, res) => {
  await findOnePost(req.params.id)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.get("/findAll", async (req, res) => {
  await findAllPost()
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

export default router;
