import { Router } from "express";
import { authFB, authFBCallback } from "../actions/auth";

const router = Router();

router.get("/", authFB);

router.get("/callback", authFBCallback, (req, res) => {
  return res.send(req.user);
});

export default router;
