import { Router } from "express";
import { loginAdmin } from "../services/adminDB";

const router = Router();

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const login = await loginAdmin(username, password);
    if (login) {
      return res.status(200).send(login);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

// router.patch("/update", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const update = await editAdmin(username, password);
//     if (update) {
//       return res.status(200).send(update);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(500).send({ error });
//   }
// });

// router.get("/find", async (req, res) => {
//   try {
//     const { username } = req.body;
//     const find = await findOneAdmin(username);
//     if (find) {
//       return res.status(200).send(find);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(500).send({ error });
//   }
// });

// router.get("/findAll", async (req, res) => {
//   try {
//     const find = await findAllAdmin();
//     if (find) {
//       return res.status(200).send(find);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(500).send({ error });
//   }
// });

export default router;
