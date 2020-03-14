import { Router } from "express";
import { authAdmin } from "../controllers/AuthController";
import * as SitepathController from "../controllers/SitepathController";
const router = Router();

router.get("/findAll", authAdmin, SitepathController.findAll);

export default router;
