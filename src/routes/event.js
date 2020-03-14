import { Router } from "express";
import * as AuthController from "../controllers/AuthController";
import * as EventController from "../controllers/EventController";
const router = Router();

router.post("/insert/:id", AuthController.authUser, EventController.insert);

router.patch("/update/:id", AuthController.authUser, EventController.update);

router.get("/find/:id", AuthController.authAll, EventController.findOne);

router.get("/findAll", AuthController.authAdmin, EventController.findAll);

export default router;
