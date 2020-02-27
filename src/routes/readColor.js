import { Router } from "express";
import readColor from "../services/getColor";

const router = Router();

router.get("/", (req, res) => {
  try {
    const result = readColor(req.body);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ error });
  }
});

export default router;
