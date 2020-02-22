import {
  getFacebookPageInfo,
  getUserPages,
  getPageData
} from "../actions/fbPage";
import { findOneThemeByCategory } from "../actions/themeDB";
import { insertHomePageImage } from "../actions/homePageImageDB";
import { insertImage } from "../actions/imageDB";
import { insertPost } from "../actions/postDB";
import {
  insertSite,
  findOneSite,
  findOneSiteByAccessToken
} from "../actions/siteDB";
import { insertVideo } from "../actions/videoDB";
import { Router } from "express";
import { authenticate } from "../actions/middleware";
import mongoose, { ObjectId } from "mongoose";
import { Theme } from "../models";

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

router.post("/confirmPage", authenticate, async (req, res) => {
  const data = await getPageData({
    pageId: req.body.pageId ? req.body.pageId : "",
    access_token: req.body.accessToken ? req.body.accessToken : ""
  });
  if (data) {
    const siteExist = await findOneSite(req.body.pageId);
    if (!siteExist) {
      const defaultNavItems = [
        {
          name: "Home",
          order: 1,
          isActive: true
        },
        {
          name: "About",
          order: 2,
          isActive: true
        },
        {
          name: "Gallery",
          order: 3,
          isActive: true
        },
        {
          name: "Event",
          order: 4,
          isActive: true
        },
        {
          name: "Contact",
          order: 5,
          isActive: true
        },
        {
          name: "News",
          order: 6,
          isActive: true
        }
      ];
      const saveImage = new Promise(function(resolve, reject) {
        data.posts &&
          data.posts.data.forEach(async post => {
            await insertImage(post.id ? post.id : "", {
              url: post.full_picture ? post.full_picture : ""
            });
          });
      });
      const saveVideo = new Promise(function(resolve, reject) {
        data.videos &&
          data.videos.data.forEach(async video => {
            await insertVideo(video.id ? video.id : "", {
              url: video.permalink_url ? video.permalink_url : ""
            });
          });
      });
      const saveHomePageImage = new Promise(async function(resolve, reject) {
        await insertHomePageImage(req.body.pageId ? req.body.pageId : "", {
          url: data.cover ? data.cover.source : ""
        });
      });
      Promise.all([saveImage, saveVideo, saveHomePageImage]).then(function(
        response
      ) {});
      const postsIdList = [];
      data.posts &&
        data.posts.data.forEach(async post => {
          await insertPost(post.id ? post.id : "", {
            content: post.message ? post.message : ""
          }).then(post => {
            postsIdList.push(new mongoose.Types.ObjectId(post._id));
          });
        });
      var theme = await Theme.findOne({
        "categories.name": "theme3"
      });
      if (!theme) {
        var theme = await Theme.findOne();
      }
      const insertStatus = await insertSite(req.body.pageId, req.body.userId, {
        phone: data.phone ? data.phone : "",
        longitude: data.location.longitude ? data.location.longitude : "",
        latitude: data.location.latitude ? data.location.latitude : "",
        logo: data.logo ? data.logo : "",
        fontTitle: theme.fontTitle ? theme.fontTitle : "",
        fontBody: theme.fontBody ? theme.fontBody : "",
        title: req.body.name ? req.body.name : "",
        address: data.single_line_address ? data.single_line_address : "",
        navItems: defaultNavItems ? defaultNavItems : [],
        posts: postsIdList ? postsIdList : [],
        username: req.body.profile.name ? req.body.profile.name : "",
        themeId: new mongoose.Types.ObjectId(theme._id)
      });
      if (insertStatus) {
        return res.status(200).send(insertStatus);
      } else {
        return res.status(500).send("Insert failed!");
      }
    }
    return res.status(500).send("Site existed!");
  }
  return res.status(500).send("No data found!");
});

export default router;
