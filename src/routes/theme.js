import { Router } from "express";
import {
  createTheme,
  editTheme,
  findAllTheme,
  findOneTheme,
  insertTheme,
  findAllThemeByAdmin
} from "../services/themeDB";

const router = Router();

router.get("/create", async (req, res) => {
  try {
    await createTheme()
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

router.post("/insert/:id", async (req, res) => {
  try {
    await insertTheme(req.params.id, req.body)
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
    await editTheme(req.params.id, req.body)
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

router.patch("/delete/:id", async (req, res) => {
  try {
    await deleteTheme(req.params.id)
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
    await findOneTheme(req.params.id)
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
    await findAllTheme()
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

router.get("/findAllByAdmin", async (req, res) => {
  try {
    await findAllThemeByAdmin(req.params.username, req.params.password)
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
