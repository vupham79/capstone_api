import { Router } from "express";
import { authAdmin, authAll } from "../controllers/AuthController";
import * as ThemeController from "../controllers/ThemeController";
const router = Router();

router.post("/insert", authAdmin, ThemeController.insert);

router.patch("/update/:id", authAdmin, ThemeController.update);

router.get("/find/:id", authAll, ThemeController.findOne);

router.get("/findAll", authAll, ThemeController.findAll);

router.delete("/delete/:id", authAdmin, ThemeController.deleteOne);

export default router;
