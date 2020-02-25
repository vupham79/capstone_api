import { Router } from "express";
import readColor from "../services/getColor";

const router = Router();

router.get("/", (req, res) => {
  const result = readColor(req.body);
  return res.status(200).send(result);
});

export default router;
