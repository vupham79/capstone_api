import { Router } from "express";
import {
  createHomePageImage,
  insertHomePageImage,
  editHomePageImage,
  findAllHomePageImage,
  findOneHomePageImage
} from "../actions/homePageImageDB";

const router = Router();

router.get("/create", async (req, res) => {
  await createHomePageImage()
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.post("/insert/:id", async (req, res) => {
  await insertHomePageImage(req.params.id, req.body)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.patch("/update/:id", async (req, res) => {
  await editHomePageImage(req.params.id, req.body)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.get("/find/:id", async (req, res) => {
  await findOneHomePageImage(req.params.id)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.get("/findAll", async (req, res) => {
  await findAllHomePageImage()
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

export default router;
