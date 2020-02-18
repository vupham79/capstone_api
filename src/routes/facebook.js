import {
  getFacebookPageInfo,
  getFacebookPageToken,
  getPageImage,
  uploadPageImage,
  downloadPageImage,
  getUserPages,
  confirmPage
} from "../actions/fbPage";
import { insertTheme } from "../actions/themeDB";
import { insertSuggestedColor } from "../actions/suggestedColorDB";
import { insertHomePageImage } from "../actions/homePageImageDB";
import { insertImage, findOneImage, editImage } from "../actions/imageDB";
import {
  insertNavItem,
  findOneNavItem,
  editNavItem
} from "../actions/navItemDB";
import { insertPost, findOnePost, editPost } from "../actions/postDB";
import { insertSite } from "../actions/siteDB";
import { insertUser } from "../actions/userDB";
import { insertVideo, findOneVideo, editVideo } from "../actions/videoDB";
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

router.get("/pageImage/get/:id", async (req, res) => {
  const data = await getPageImage(req.params.id);
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

router.get("/pageImage/upload/:id", async (req, res) => {
  const data = await uploadPageImage(req.params.id);
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

router.get("/pageImage/download/:id", async (req, res) => {
  const data = await downloadPageImage(req.params.id);
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

router.post("/confirmPage", async (req, res) => {
  const data = await confirmPage({
    pageId: req.body.pageId,
    access_token: req.body.accessToken
  });
  console.log(req.body.navItems);
  if (data) {
    //kiểm tra coi đúng chưa ?
    data.posts &&
      (await data.posts.data.forEach(async image => {
        if ((await findOneImage(image.id)) === null) {
          await insertImage(image.id, {
            url: image.full_picture === null ? "" : image.full_picture
          });
        } else {
          await editImage(image.id, {
            url: image.full_picture === null ? "" : image.full_picture
          });
        }
      }));
    data.videos &&
      (await data.videos.data.forEach(async video => {
        if ((await findOneVideo(video.id)) === null) {
          await insertVideo(video.id, {
            url: video.permalink_url === null ? "" : video.permalink_url
          });
        } else {
          await editVideo(video.id, {
            url: video.permalink_url === null ? "" : video.permalink_url
          });
        }
      }));
    data.posts &&
      (await data.posts.data.forEach(async post => {
        const exist = await findOnePost(post.id);
        if (!exist) {
          await insertPost(post.id, {
            content: post.message === null ? "" : post.message
          });
        } else {
          await editPost(post.id, {
            content: post.message === null ? "" : post.message
          });
        }
      }));
    req.body.navItems &&
      (await req.body.navItems.forEach(async navItem => {
        const exist = await findOneNavItem(req.body.pageId);
        if (!exist) {
          await insertNavItem(req.body.pageId, {
            order: navItem.order === null ? "" : navItem.order,
            title: navItem.name === null ? "" : navItem.name
          });
        } else {
          await editNavItem(req.body.pageId, {
            order: navItem.order === null ? "" : navItem.order,
            title: navItem.name === null ? "" : navItem.name
          });
        }
      }));
  }
  return res.status(500).send("No data found!");
});

export default router;
