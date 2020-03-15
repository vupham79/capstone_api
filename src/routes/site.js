import { Router } from "express";
import { authAll, authUser } from "../controllers/AuthController";
import * as SiteController from "../controllers/SiteController";
const router = Router();

router.get("/find", authAll, SiteController.findOneById);

router.get("/find/:sitepath", SiteController.findOneBySitepath);

router.get("/findAllByUser", authUser, SiteController.findAllByUser);

router.get("/findAll", authUser, SiteController.findAll);

router.patch("/publish", authAll, SiteController.publish);

router.patch("/saveDesign", authUser, SiteController.saveDesign);

router.patch("/saveHomePageImage", authUser, SiteController.updateCover);

router.post("/createNewSite", authUser, SiteController.createNewSite);

router.patch("/syncEvent", authUser, SiteController.syncEvent);

router.patch("/syncData", authUser, SiteController.syncData);

router.patch("/logo", authUser, SiteController.updateLogo);

export default router;
