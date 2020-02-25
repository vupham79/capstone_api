import { Router } from "express";
import { getFirebaseValue } from "../services/firebase";

const router = Router();

router.get("/firebase", getFirebaseValue);

export default router;
