import { Router } from "express";
import mongoose from "mongoose";
import { getPostData } from "../services/fbPage";
import { authenticate } from "../services/middleware";
import {
  findAllSite,
  findAllSiteByUser,
  findOneSite,
  insertSite
} from "../services/siteDB";
import { Site, Theme } from "../models";
const router = Router();

router.get("/find/:id", async (req, res) => {
  await findOneSite(req.params.id)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send({ error });
    });
});

router.get("/findAllByUser", async (req, res) => {
  await findAllSiteByUser(req.query.userId, req.query.accessToken)
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send({ error });
    });
});

router.get("/findAll", async (req, res) => {
  await findAllSite()
    .then(result => {
      return res.status(200).send(result);
    })
    .catch(error => {
      return res.status(500).send({ error });
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
  return res.status(500).send({ error: "Action failed!" });
});

router.patch("/saveDesign", authenticate, async (req, res) => {
  const {
    logo,
    fontBody,
    fontTitle,
    navItems,
    themeId,
    pageId,
    name,
    color
  } = req.body;
  try {
    const theme = await Theme.findOne({ id: themeId });
    if (theme) {
      const update = await Site.updateOne(
        { id: pageId },
        {
          logo: logo && logo,
          fontTitle: fontTitle && fontTitle,
          fontBody: fontBody && fontBody,
          title: name && name,
          color: color && color,
          navItems: navItems && navItems,
          themeId: new mongoose.Types.ObjectId(theme._id)
        }
      );
      if (update) {
        return res.status(200).send(update);
      } else {
        return res.status(500).send({ error: "Insert failed!" });
      }
    }
    return res.status(500).send({ error: "Theme not exist!" });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.post("/createNewSite", authenticate, async (req, res) => {
  const data = await getPostData({
    pageId: req.body.pageId ? req.body.pageId : "",
    access_token: req.body.accessToken ? req.body.accessToken : ""
  });
  if (data) {
    const siteExist = await findOneSite(req.body.pageId);
    try {
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
        let imageIds = [];
        let videoIds = [];
        return Site.createCollection()
          .then(() => Site.startSession())
          .then(_session => {
            session = _session;
            session.withTransaction(async () => {
              const postsList = [];
              data.posts &&
                data.posts.data.forEach(post => {
                  if (
                    post.attachments &&
                    post.attachments.data[0].media_type === "album"
                  ) {
                    const subAttachmentList = [];
                    post.attachments.data[0].subattachments.data.forEach(
                      subAttachment => {
                        subAttachmentList.push(subAttachment.media.image.src);
                      }
                    );
                    postsList.push({
                      id: post.id,
                      title: post.attachments.data[0].title
                        ? post.attachments.data[0].title
                        : "",
                      message: post.message ? post.message : "",
                      attachments: {
                        id: post.id,
                        media_type: "album",
                        images: subAttachmentList,
                        video: ""
                      }
                    });
                  } else if (
                    post.attachments &&
                    post.attachments.data[0].media_type === "photo"
                  ) {
                    postsList.push({
                      id: post.id,
                      message: post.message ? post.message : "",
                      title: post.attachments.data[0].title
                        ? post.attachments.data[0].title
                        : "",
                      attachments: {
                        id: post.id,
                        media_type: "photo",
                        images: [post.attachments.data[0].media.image.src],
                        video: ""
                      }
                    });
                  } else if (
                    post.attachments &&
                    post.attachments.data[0].media_type === "event"
                  ) {
                    postsList.push({
                      id: post.id,
                      message: post.message ? post.message : "",
                      title: post.attachments.data[0].title
                        ? post.attachments.data[0].title
                        : "",
                      attachments: {
                        id: post.id,
                        media_type: "event",
                        images: [post.attachments.data[0].media.image.src],
                        video: ""
                      }
                    });
                  } else if (
                    post.attachments &&
                    post.attachments.data[0].media_type === "video"
                  ) {
                    postsList.push({
                      id: post.id,
                      message: post.message ? post.message : "",
                      title: post.attachments.data[0].title
                        ? post.attachments.data[0].title
                        : "",
                      attachments: {
                        id: post.id,
                        media_type: "video",
                        images: [],
                        video: post.attachments.data[0].media.source
                      }
                    });
                  }
                });
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
                  logo: req.body.logo ? req.body.logo : "",
                  fontTitle: theme.fontTitle ? theme.fontTitle : "",
                  fontBody: theme.fontBody ? theme.fontBody : "",
                  color: theme.mainColor ? theme.mainColor : "",
                  title: data.name ? data.name : "",
                  address: data.single_line_address
                    ? data.single_line_address
                    : "",
                  navItems: defaultNavItems ? defaultNavItems : [],
                  username: req.body.profile.name ? req.body.profile.name : "",
                  themeId: new mongoose.Types.ObjectId(theme._id),
                  posts: postsList,
                  cover: data.cover ? [data.cover.source] : []
                }
              ).catch(error => console.log("site error"));
              console.log(insertStatus.id);
              if (insertStatus) {
                return res.status(200).send(insertStatus);
              } else {
                return res.status(500).send({ error: "Insert failed!" });
              }
            });
          });
      }
      return res.status(500).send({ error: "Site existed!" });
    } catch (error) {
      return res.status(500).send({ error });
    }
  }
});

export default router;
