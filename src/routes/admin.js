import { Router } from "express";
import * as AdminController from "../controllers/AdminController";
import passport from "../utils/passport";
require("dotenv").config();

const router = Router();

router.post(
  "/login",
  passport.authenticate("local", { failureRedirect: "/error" }),
  AdminController.login
);

router.get("/logout", AdminController.logout);

export default router;
