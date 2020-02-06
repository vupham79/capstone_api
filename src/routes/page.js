import { Router } from "express";
import { getFacebookPageInfo, getFacebookPageToken } from "../actions/fbPage";

const router = Router();

router.get("/:id", getFacebookPageInfo);

router.get("/:id/token", getFacebookPageToken);

export default router;
