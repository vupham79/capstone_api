import { Router } from "express";
import * as AuthController from "../controllers/AuthController";
import * as UserController from "../controllers/UserController";
const router = Router();

router.post("/", UserController.login);

router.get("/logout", UserController.logout);

router.patch(
  "/deactivate/:id",
  AuthController.authAdmin,
  UserController.deactivateUser
);

router.patch(
  "/activate/:id",
  AuthController.authAdmin,
  UserController.activateUser
);

router.get("/pages", AuthController.authUser, UserController.getAllPages);

router.get("/findAll", AuthController.authAdmin, UserController.findAllUser);

export default router;
