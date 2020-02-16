import { Router } from "express";
import {
  createUser,
  insertUser,
  editUser,
  findAllUser,
  findOneUser
} from "../actions/userDB";
import User from "../models/User";

const router = Router();

router.get("/create", async (req, res) => {
  await createUser()
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send(error);
    });
});

router.post("/insert/:id", async (req, res) => {
  console.log(req.body);
  await insertUser(req.params.id, req.body)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send(error);
    });
});

router.patch("/update/:id", async (req, res) => {
  await editUser(req.params.id, req.body)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send(error);
    });
});

router.get("/find/:id", async (req, res) => {
  await findOneUser(req.params.id)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.get("/findAll", async (req, res) => {
  await findAllUser()
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

export default router;
