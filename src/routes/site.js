import { Router } from "express";
import mongoose from "mongoose";
import { getPageData, getSyncData } from "../services/fbPage";
import { authenticate } from "../services/middleware";
import {
  findAllSite,
  findAllSiteByUser,
  findOneSite,
  insertSite,
  editSite
} from "../services/siteDB";
import { activePost, deactivePost } from "../services/postDB";
import { Site, Post, User, Theme } from "../models";
const router = Router();

router.get("/find/:id", async (req, res) => {
  try {
    const find = await findOneSite(req.params.id);
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/findAllByUser", async (req, res) => {
  try {
    const find = await findAllSiteByUser(
      req.query.userId,
      req.query.accessToken
    );
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/findAll", async (req, res) => {
  try {
    const find = await findAllSite();
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.patch("/publish", async (req, res) => {
  const { id, isPublish } = req.body;
  try {
    const user = await User.find({ "sites.id": id });
    if (user) {
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
    }
    return res.status(500).send({ error: "Can't find any result!" });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.patch("/activePost", async (req, res) => {
  const { activeList, deactiveList } = req.body;
  try {
    const update = await activePost({
      activeList: activeList && activeList.length > 0 && activeList,
      deactiveList: deactiveList && deactiveList.length > 0 && deactiveList
    });
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(500).send({ error: "Update failed!" });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.patch("/saveDesign", authenticate, async (req, res) => {
  const {
    fontBody,
    fontTitle,
    navItems,
    pageId,
    theme,
    name,
    color
  } = req.body;
  try {
    const findTheme = await Theme.findOne({ id: theme });
    if (findTheme) {
      const update = await Site.updateOne(
        { id: pageId },
        {
          fontTitle: fontTitle && fontTitle,
          fontBody: fontBody && fontBody,
          title: name && name,
          color: color && color,
          navItems: navItems && navItems,
          theme: new mongoose.Types.ObjectId(findTheme._id),
          sitePath: name ? name : ""
        }
      );
      if (update) {
        return res.status(200).send(update);
      }
      return res.status(500).send({ error: "Save failed!" });
    }
    return res.status(500).send({ error: "Theme not exist!" });
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.post("/createNewSite", authenticate, async (req, res) => {
  try {
    const postsList = [];
    const {
      userId,
      category,
      pageUrl,
      pageId,
      accessToken,
      isPublish,
      sitepath
    } = req.body;
    const data = await getPageData({
      pageId: pageId ? pageId : "",
      access_token: accessToken ? accessToken : ""
    });
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
    if (data) {
      const siteExist = await findOneSite(pageId);
      if (!siteExist) {
        let session;
        return Site.createCollection()
          .then(() => Site.startSession())
          .then(_session => {
            session = _session;
            session.withTransaction(async () => {
              var theme = await Theme.findOne({
                "categories.name": category
              });
              if (!theme) {
                var theme = await Theme.findOne();
              }
              const insert = await insertSite(pageId, {
                phone: data.phone ? data.phone : "",
                longitude: data.location ? data.location.longitude : "",
                latitude: data.location ? data.location.latitude : "",
                logo: data.picture ? data.picture.data.url : "",
                fontTitle: theme.fontTitle ? theme.fontTitle : "",
                fontBody: theme.fontBody ? theme.fontBody : "",
                color: theme.mainColor ? theme.mainColor : "",
                title: data.name ? data.name : "",
                address: data.single_line_address
                  ? data.single_line_address
                  : "",
                navItems: defaultNavItems ? defaultNavItems : [],
                theme: new mongoose.Types.ObjectId(theme._id),
                cover: data.cover ? [data.cover.source] : [],
                categories: data.category_list ? data.category_list : [],
                url: pageUrl,
                isPublish: isPublish,
                sitePath: sitepath,
                about: data.about ? data.about : ""
              });
              await User.findOne({ id: userId })
                .select("sites")
                .then(async result => {
                  let siteList = result.sites;
                  siteList.push(insert._id);
                  await result.updateOne({
                    sites: siteList
                  });
                });
              if (insert) {
                data.posts &&
                  data.posts.data.forEach(async post => {
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
                        isActive: true,
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
                        isActive: true,
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
                        isActive: true,
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
                        isActive: true,
                        attachments: {
                          id: post.id,
                          media_type: "video",
                          images: [],
                          video: post.attachments.data[0].media.source
                        }
                      });
                    }
                  });

                await Post.insertMany(postsList, async (error, docs) => {
                  if (error) {
                    return error;
                  } else {
                    const postIdList = [];
                    docs.forEach(doc => {
                      postIdList.push(doc._id);
                    });
                    await Site.updateOne({ id: pageId }, { posts: postIdList });
                  }
                });

                return res.status(200).send(insert);
              } else {
                return res.status(500).send({ error: "Insert site failed!" });
              }
            });
          });
      }
      return res.status(500).send({ error: "Site existed!" });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.patch("/syncData", authenticate, async (req, res) => {
  try {
    const { pageId, accessToken } = req.body;
    let postsList = [];
    const data = await getPageData({
      pageId: pageId ? pageId : "",
      access_token: accessToken ? accessToken : ""
    });
    if (data) {
      const siteExist = await findOneSite(pageId);
      if (siteExist) {
        let session;
        return Site.createCollection()
          .then(() => Site.startSession())
          .then(_session => {
            session = _session;
            session.withTransaction(async () => {
              const update = await editSite(pageId, {
                phone: data.phone ? data.phone : "",
                longitude: data.location ? data.location.longitude : "",
                latitude: data.location ? data.location.latitude : "",
                address: data.single_line_address
                  ? data.single_line_address
                  : "",
                cover: data.cover ? [data.cover.source] : [],
                categories: data.category_list ? data.category_list : [],
                about: data.about ? data.about : ""
              });
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
                      isActive: true,
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
                      title: post.attachments.data[0].title
                        ? post.attachments.data[0].title
                        : "",
                      isActive: true,
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
                      title: post.attachments.data[0].title
                        ? post.attachments.data[0].title
                        : "",
                      isActive: true,
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
                      title: post.attachments.data[0].title
                        ? post.attachments.data[0].title
                        : "",
                      isActive: true,
                      attachments: {
                        id: post.id,
                        media_type: "video",
                        images: [],
                        video: post.attachments.data[0].media.source
                      }
                    });
                  }
                });

              let idPostList = await Post.find().select("id");
              let existedPostList = [];
              idPostList.forEach(existedPost => {
                existedPostList.push(existedPost.id);
              });
              let currentPostList = [];
              let newPostList = [];
              postsList.forEach(post => {
                if (existedPostList.includes(post.id)) {
                  currentPostList.push(post);
                } else {
                  newPostList.push(post);
                }
              });
              await Post.create(newPostList, async (error, docs) => {
                if (error) {
                  console.log(error);
                } else {
                  let postIdList = [];
                  let existedPostIdList = [];
                  if (docs && docs.length > 0) {
                    docs.forEach(doc => {
                      postIdList.push(new mongoose.Types.ObjectId(doc._id));
                    });
                    currentPostList.forEach(currentPost => {
                      existedPostIdList.push(
                        new mongoose.Types.ObjectId(currentPost._id)
                      );
                    });
                    await Site.updateOne(
                      { id: pageId },
                      { posts: existedPostIdList.concat(postIdList) }
                    );
                  }
                }
              });

              currentPostList.forEach(async currentPost => {
                await Post.updateOne({ id: currentPost.id }, currentPost);
              });
              if (update) {
                return res.status(200).send(update);
              } else {
                return res.status(500).send({ error: "Edit failed!" });
              }
            });
          });
      }
      return res.status(500).send({ error: "Site not existed!" });
    }
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.patch("/logo", async (req, res) => {
  const { logo, id } = req.body;
  try {
    const update = await Site.updateOne(
      {
        id
      },
      {
        logo
      }
    );
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(500).send({ error: "Action failed!" });
  } catch (error) {
    return res.status(500).send({ error });
  }
});
export default router;
