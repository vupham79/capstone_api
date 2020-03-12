import { Router } from "express";
import { findAllUser, deactivateUser, activateUser } from "../services/userDB";
import { authAdmin } from "../services/middleware";
import { client as redis } from "../utils/redis";
const router = Router();

router.get("/logout", async (req, res) => {
  try {
    redis.del(req.signedCookies["userToken"]);
    return res
      .cookie("userToken", "", { maxAge: Date.now() })
      .status(200)
      .send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

// router.get("/create", async (req, res) => {
//   try {
//     const user = await createUser();
//     if (user) {
//       return res.status(200).send(user);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(400).send({ error });
//   }
// });

// router.post("/insert/:id", async (req, res) => {
//   try {
//     const insert = await insertUser(req.params.id, req.body);
//     if (insert) {
//       return res.status(200).send(insert);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(400).send({ error });
//   }
// });

// router.patch("/update/:email", async (req, res) => {
//   try {
//     const update = await editUser(req.params.email, req.body);
//     if (update) {
//       return res.status(200).send(update);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(400).send({ error });
//   }
// });

router.patch("/deactivate/:id", authAdmin, async (req, res) => {
  try {
    const update = await deactivateUser(req.params.id);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

router.patch("/activate/:id", authAdmin, async (req, res) => {
  try {
    const update = await activateUser(req.query.id);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

// router.get("/find/:email", async (req, res) => {
//   try {
//     const find = await findOneUser(req.params.email);
//     if (find) {
//       return res.status(200).send(find);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(400).send({ error });
//   }
// });

router.get("/findAll", authAdmin, async (req, res) => {
  try {
    const find = await findAllUser();
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
});

export default router;
