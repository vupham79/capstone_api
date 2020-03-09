import { Router } from "express";
import { getUserPages } from "../services/fbPage";
import { authUser } from "../services/middleware";

const router = Router();

router.get("/pages", authUser, async (req, res) => {
  try {
    const data = await getUserPages(req.user.accessToken);
    if (data && data.accounts) {
      return res.status(200).send(data.accounts.data);
    }
    return res.status(400).send("No data found!");
  } catch (error) {
    return res.status(400).send({ error });
  }
});

// router.get("/getSiteInfo", async (req, res) => {
//   try {
//     const data = await findOneSiteByAccessToken(
//       req.params.pageId,
//       req.params.accessToken
//     );
//     if (data) {
//       return res.status(200).send(data);
//     }
//     return res.status(400).send("No data found!");
//   } catch (error) {
//     return res.status(400).send({ error });
//   }
// });

export default router;
