import { Router } from "express";
import { getFacebookPageInfo, getUserPages } from "../services/fbPage";
import { findOneSiteByAccessToken } from "../services/siteDB";

const router = Router();

router.get("/pageInfo", async (req, res) => {
  const data = await getFacebookPageInfo();
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

router.get("/pages", async (req, res) => {
  const data = await getUserPages(
    req.query.access_token ? req.query.access_token : ""
  );
  if (data && data.accounts) {
    return res.status(200).send(data.accounts.data);
  }
  return res.status(500).send("No data found!");
});

router.get("/syncPage", async (req, res) => {
  const data = await getUserPages(
    req.query.access_token ? req.query.access_token : ""
  );
  if (data && data.accounts) {
    return res.status(200).send(data.accounts.data);
  }
  return res.status(500).send("No data found!");
});

//authenticate
router.get("/getSiteInfo", async (req, res) => {
  const data = await findOneSiteByAccessToken(
    req.params.pageId ? req.params.pageId : "",
    req.params.accessToken ? req.params.accessToken : ""
  );
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

export default router;
