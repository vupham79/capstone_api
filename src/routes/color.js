import { Router } from "express";
import { getColor } from "../services/color";

const router = Router();

router.get("/", getColor, (req, res) => {
  try {
    return res.send("Helell");
  } catch (error) {
    return res.status(500).send({ error });
  }
});

export default router;
