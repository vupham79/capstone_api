import { Router } from "express";

const router = Router();

// router.post("/insert/:id", async (req, res) => {
//   try {
//     const insert = await insertPost(req.params.id, req.body);
//     if (insert) {
//       return res.status(200).send(insert);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(400).send({ error });
//   }
// });

// router.patch("/update/:id", async (req, res) => {
//   try {
//     const update = await editPost(req.params.id, req.body);
//     if (update) {
//       return res.status(200).send(update);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(400).send({ error });
//   }
// });

// router.get("/find/:id", async (req, res) => {
//   try {
//     const find = await findOnePost(req.params.id);
//     if (find) {
//       return res.status(200).send(find);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(400).send({ error });
//   }
// });

// router.get("/findAll", async (req, res) => {
//   try {
//     const find = await findAllPost();
//     if (find) {
//       return res.status(200).send(find);
//     }
//     return res.status(204).send();
//   } catch (error) {
//     return res.status(400).send({ error });
//   }
// });

export default router;
