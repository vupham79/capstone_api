import { Router } from "express";
import {
  createUser,
  editUser,
  findAllUser,
  findOneUser,
  insertUser,
  deactivateUser,
  activateUser
} from "../services/userDB";

const router = Router();

router.get("/create", async (req, res) => {
  try {
    const user = await createUser();
    if (user) {
      return res.status(200).send(user);
    }
    return res.status(500).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.post("/insert/:id", async (req, res) => {
  try {
    await insertUser(req.params.id, req.body)
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
    await editUser(req.params.id, req.body)
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

router.patch("/deactivate/:id", async (req, res) => {
  try {
    await deactivateUser(req.params.id)
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

router.patch("/activate/:id", async (req, res) => {
  try {
    await activateUser(req.params.id)
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
    await findOneUser(req.params.id)
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
    await findAllUser()
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
