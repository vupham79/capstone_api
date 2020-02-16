import { Router } from "express";
import { login } from "../actions/auth";

const router = Router();

router.post("/", login);

export default router;
