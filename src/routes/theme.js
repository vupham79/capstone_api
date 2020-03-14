import { Router } from "express";
import { authAdmin, authAll } from "../controllers/AuthController";
import * as ThemeController from "../controllers/ThemeController";
const router = Router();

router.patch("/update/:id", authAdmin, ThemeController.update);

router.get("/find/:id", authAll, ThemeController.findOne);

router.get("/findAll", authAll, ThemeController.findAll);

export default router;
