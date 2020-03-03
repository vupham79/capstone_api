import { Router } from "express";
import { getUserPages, getPageData } from "../services/fbPage";
import { findOneSiteByAccessToken } from "../services/siteDB";

const router = Router();

router.get("/pages", async (req, res) => {
  try {
    const data = await getUserPages(req.query.access_token);
    if (data && data.accounts) {
      return res.status(200).send(data.accounts.data);
    }
    return res.status(500).send("No data found!");
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/getSiteInfo", async (req, res) => {
  try {
    const data = await findOneSiteByAccessToken(
      req.params.pageId,
      req.params.accessToken
    );
    if (data) {
      return res.status(200).send(data);
    }
    return res.status(500).send("No data found!");
  } catch (error) {
    return res.status(500).send({ error });
  }
});

export default router;
