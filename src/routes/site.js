import { Router } from "express";
import { authAll, authUser, authAdmin } from "../controllers/AuthController";
import * as SiteController from "../controllers/SiteController";
const router = Router();

router.get("/find", authAll, SiteController.findOneById);

router.get("/find/:sitepath", SiteController.findOneBySitepath);

router.get("/find/:sitepath/:tab", SiteController.findSiteDataByTab);

router.get("/findAllByUser", authUser, SiteController.findAllByUser);

router.get("/findAll", authAdmin, SiteController.findAll);

router.patch("/publish", authAll, SiteController.publish);

router.patch("/saveDesign", authUser, SiteController.saveDesign);

router.patch("/saveHomePageImage", authUser, SiteController.updateCover);

router.post("/createNewSite", authUser, SiteController.createNewSite);

router.patch("/syncEvent", authUser, SiteController.syncEvent);

router.patch("/syncData", authUser, SiteController.syncData);

router.patch("/syncPost", authUser, SiteController.syncPost);

router.patch("/syncGallery", authUser, SiteController.syncGallery);

router.patch("/logo", authUser, SiteController.updateLogo);

router.patch("/favicon", authUser, SiteController.updateFavicon);

export default router;
