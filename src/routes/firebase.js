import { Router } from "express";
import { getFirebaseValue } from "../actions/firebase";

const router = Router();

router.get("/firebase", getFirebaseValue);

export default router;
