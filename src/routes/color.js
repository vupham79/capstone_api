import { Router } from "express";
import { getColor } from "../actions/color";

const router = Router();

router.get("/", getColor, (req, res) => {
  return res.send("Helell");
});

export default router;
