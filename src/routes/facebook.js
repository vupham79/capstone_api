import {
  getFacebookPageInfo,
  getFacebookPageToken,
  getFacebookPages,
  getUserPages
} from "../actions/fbPage";
import { Router } from "express";

const router = Router();

router.get("/pageInfo", async (req, res) => {
  const data = await getFacebookPageInfo();
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

router.get("/pageToken", async (req, res) => {
  const data = await getFacebookPageToken();
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

router.get("/pages", async (req, res) => {
  const data = await getUserPages(req.query.access_token);
  if (data && data.accounts) {
    return res.status(200).send(data.accounts.data);
  }
  return res.status(500).send("No data found!");
});

export default router;
