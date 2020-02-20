import { Router } from "express";
import {
  createSite,
  insertSite,
  editSite,
  deleteSite,
  findAllSite,
  findOneSite,
  findAllSiteByUser
} from "../actions/siteDB";

const router = Router();

router.get("/create", async (req, res) => {
  await createSite()
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send(error);
    });
});

router.post("/insert/:id", async (req, res) => {
  await insertSite(req.params.id, req.body)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.patch("/update/:id", async (req, res) => {
  await editSite(req.params.id, req.body)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send(error);
    });
});

router.patch("/delete/:id", async (req, res) => {
  await deleteSite(req.params.id)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.get("/find/:id", async (req, res) => {
  await findOneSite(req.params.id)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.get("/findAllByUser/:id", async (req, res) => {
  await findAllSiteByUser(req.params.id)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

router.get("/findAll", async (req, res) => {
  await findAllSite()
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send("Something broke!");
    });
});

export default router;
