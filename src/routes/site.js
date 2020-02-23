import { Router } from "express";
import mongoose from "mongoose";
import { getPageData } from "../actions/fbPage";
import { insertHomePageImage } from "../actions/homePageImageDB";
import { insertImage, createImage } from "../actions/imageDB";
import { authenticate } from "../actions/middleware";
import { insertPost } from "../actions/postDB";
import {
  findAllSite,
  findAllSiteByUser,
  findOneSite,
  insertSite
} from "../actions/siteDB";
import { insertVideo } from "../actions/videoDB";
import { Site, Theme, Image, Video, Post } from "../models";
const router = Router();

router.get("/find/:id", async (req, res) => {
  await findOneSite(req.params.id)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send(error);
    });
});

router.get("/findAllByUser", async (req, res) => {
  await findAllSiteByUser(req.query.userId, req.query.accessToken)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send(error);
    });
});

router.get("/findAll", async (req, res) => {
  await findAllSite()
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send(error);
    });
});

router.patch("/publish", async (req, res) => {
  const { id, isPublish } = req.body;
  const publish = await Site.updateOne(
    {
      id
    },
    {
      isPublish
    }
  );
  if (publish) {
    return res.status(200).send(publish);
  }
  return res.status(500).send("Action failed!");
});

router.post("/saveDesign", authenticate, async (req, res) => {
  const {
    logo,
    fontBody,
    fontTitle,
    navItems,
    themeId,
    pageId,
    name
  } = req.body;
  const siteExist = await findOneSite(pageId);
  if (!siteExist) {
    const theme = await Theme.findOne({ id: themeId });
    if (theme) {
      const update = await Site.updateOne(
        { id: pageId },
        {
          logo: logo ? logo : "",
          fontTitle: fontTitle ? fontTitle : "",
          fontBody: fontBody ? fontBody : "",
          title: name ? name : "",
          navItems: navItems ? navItems : [],
          themeId: new mongoose.Types.ObjectId(theme._id)
        }
      );
      if (update) {
        return res.status(200).send(update);
      } else {
        return res.status(500).send("Insert failed!");
      }
    }
    return res.status(500).send("Theme not exist!");
  }
  return res.status(500).send("Site existed!");
});

router.post("/createNewSite", authenticate, async (req, res) => {
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
      let session;
      return Image.createCollection()
        .then(() => Image.startSession())
        .then(_session => {
          session = _session;
          session.withTransaction(async () => {
            data.posts &&
              data.posts.data.forEach(async post => {
                post.id &&
                  insertImage(
                    post.id,
                    {
                      url: post.full_picture ? post.full_picture : ""
                    },
                    session
                  );
              });
            data.videos &&
              data.videos.data.forEach(async video => {
                video.id &&
                  insertVideo(
                    video.id,
                    {
                      url: video.permalink_url ? video.permalink_url : ""
                    },
                    session
                  );
              });
            data.cover &&
              insertHomePageImage(
                req.body.pageId,
                {
                  url: data.cover.source
                },
                session
              );
          });
        })
        .then(
          data.posts &&
            data.posts.data.forEach(async post => {
              await insertPost(
                req.body.pageId ? req.body.pageId : "",
                {
                  content: post.message ? post.message : ""
                },
                session
              );
            })
        )
        .then(async () => {
          var theme = await Theme.findOne({
            "categories.name": req.body.category
          });
          if (!theme) {
            var theme = await Theme.findOne();
          }
          const insertStatus = await insertSite(
            req.body.pageId,
            req.body.userId,
            {
              phone: data.phone ? data.phone : "",
              longitude: data.location ? data.location.longitude : "",
              latitude: data.location ? data.location.latitude : "",
              logo: data.picture ? data.picture.data.url : "",
              fontTitle: theme.fontTitle ? theme.fontTitle : "",
              fontBody: theme.fontBody ? theme.fontBody : "",
              title: req.body.name ? req.body.name : "",
              address: data.single_line_address ? data.single_line_address : "",
              navItems: defaultNavItems ? defaultNavItems : [],
              username: req.body.profile.name ? req.body.profile.name : "",
              themeId: new mongoose.Types.ObjectId(theme._id)
            },
            session
          );

          if (insertStatus) {
            return res.status(200).send(insertStatus);
          } else {
            return res.status(500).send("Insert failed!");
          }
        });
    }
    return res.status(500).send("Site existed!");
  }
  return res.status(500).send("No data found!");
});

export default router;
