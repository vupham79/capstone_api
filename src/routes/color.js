import { Router } from "express";
import { getColor } from "../services/color";

const router = Router();

router.get("/", getColor, (req, res) => {
  return res.send("Helell");
});

export default router;
