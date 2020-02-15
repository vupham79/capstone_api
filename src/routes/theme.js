import { Router } from "express";
import {
  createTheme,
  insertTheme,
  editTheme,
  deleteTheme,
  findAllTheme,
  findOneTheme
} from "../actions/themeDB";

const router = Router();

router.get("/create", async (req, res) => {
  await createTheme()
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send(error);
    });
});

router.post("/insert/:id", async (req, res) => {
  await insertTheme(req.params.id)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.patch("/update/:id", async (req, res) => {
  await editTheme(req.params.id)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.patch("/delete/:id", async (req, res) => {
  await deleteTheme(req.params.id)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.get("/find/:id", async (req, res) => {
  await findOneTheme(req.params.id)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.get("/findAll", async (req, res) => {
  await findAllTheme()
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

export default router;
