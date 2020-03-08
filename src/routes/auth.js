import { Router } from "express";
import { login } from "../services/auth";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { accessToken, id, name, email, picture } = req.body;
    const data = await login({ accessToken, id, name, email, picture });
    if (data) {
      res.cookie("accessToken", accessToken, {
        expires: new Date(Date.now() + 365 * 24 * 3600 * 1000),
        signed: true
      });
      res.cookie("email", email, {
        expires: new Date(Date.now() + 365 * 24 * 3600 * 1000),
        signed: true
      });
      return res.status(200).send("Success");
    }
    return res.status(400).send("Failed");
  } catch (error) {
    return res.status(400).send({ error });
  }
});

export default router;
