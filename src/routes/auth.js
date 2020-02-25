import { Router } from "express";
import { login } from "../services/auth";

const router = Router();

router.post("/", async (req, res) => {
  const { accessToken, id, name, email, picture } = req.body;
  const data = await login({ accessToken, id, name, email, picture });
  if (data) {
    return res.status(200).send("Success");
  }
  return res.status(500).send("Failed");
});

export default router;
