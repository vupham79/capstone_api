import { Router } from "express";
import * as AuthController from "../controllers/AuthController";
import * as CategoryController from "../controllers/CategoryController";
const router = Router();

router.post("/insert", AuthController.authAdmin, CategoryController.insert);

router.patch(
  "/update/:id",
  AuthController.authAdmin,
  CategoryController.update
);

router.get("/find/:id", CategoryController.findOne);

router.get("/findAll", AuthController.authAdmin, CategoryController.findAll);

export default router;
