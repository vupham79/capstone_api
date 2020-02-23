import { Router } from "express";
import {
  createImage,
  editImage,
  findAllImage,
  findOneImage,
  insertImage
} from "../actions/imageDB";

const router = Router();

router.get("/create", async (req, res) => {
  await createImage()
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!: ", error);
    });
});

router.post("/insert/:id", async (req, res) => {
  await insertImage(req.params.id, req.body)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.patch("/update/:id", async (req, res) => {
  await editImage(req.params.id, req.body)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.get("/find/:id", async (req, res) => {
  await findOneImage(req.params.id)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.get("/findAll", async (req, res) => {
  await findAllImage()
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

export default router;
