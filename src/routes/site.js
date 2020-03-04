import { Router } from "express";
import mongoose from "mongoose";
import { getPageData, getSyncData } from "../services/fbPage";
import { authenticate } from "../services/middleware";
import {
  findAllSiteByUser,
  findOneSite,
  insertSite,
  editSite,
  findSiteBySitepath
} from "../services/siteDB";
import { findAllUser } from "../services/userDB";
import { activePost } from "../services/postDB";
import { Site, Post, User, Theme } from "../models";
const router = Router();

router.get("/find", async (req, res) => {
  try {
    const find = await findOneSite(req.query.id);
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(500).send({ error });
  }
});

router.get("/find/:sitepath", async (req, res) => {
  try {
    const find = await findSiteBySitepath(req.params.sitepath);
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
    const find = await findAllUser();
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
          fontTitle: fontTitle,
          fontBody: fontBody,
          title: name,
          color: color,
          navItems: navItems.length > 0 ? navItems : null,
          theme: new mongoose.Types.ObjectId(findTheme._id)
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
    let galleries = [];
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
    //site path is empty, undefined or null
    if (!sitepath) {
      return res.status(500).send({ error: "Sitepath must not be empty!" });
    }
    //existed site path
    const isExistedSitePath = await Site.findOne({ sitePath: sitepath });
    if (isExistedSitePath) {
      return res
        .status(500)
        .send({ error: "A website with this sitepath already existed!" });
    }
    //get page data
    const data = await getPageData({
      pageId: pageId,
      access_token: accessToken
    }).catch(error => {
      return res.status(500).send({ error: "This facebook page not existed!" });
    });
    //gallery albums
    data.albums &&
      data.albums.data &&
      data.albums.data.forEach(album => {
        galleries.push(album.picture.data.url);
      });
    //default nav items
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
    //if fb api data existed
    if (data) {
      const siteExist = await findOneSite(pageId);
      //if site not existed
      if (!siteExist) {
        let session;
        return Site.createCollection()
          .then(() => Site.startSession())
          .then(_session => {
            session = _session;
            session.withTransaction(async () => {
              //find theme
              var theme = await Theme.findOne({
                "categories.name": category
              });
              if (!theme) {
                var theme = await Theme.findOne();
              }
              //insert site
              const insert = await insertSite(pageId, {
                phone: data.phone,
                longitude: data.location ? data.location.longitude : null,
                latitude: data.location ? data.location.latitude : null,
                logo: data.picture ? data.picture.data.url : null,
                fontTitle: theme.fontTitle,
                fontBody: theme.fontBody,
                color: theme.mainColor,
                title: data.name,
                address: data.single_line_address,
                navItems: defaultNavItems,
                theme: new mongoose.Types.ObjectId(theme._id),
                cover: data.cover ? [data.cover.source] : null,
                categories:
                  data.category_list.length > 0 ? data.category_list : null,
                url: pageUrl,
                isPublish: isPublish,
                sitePath: sitepath,
                about: data.about,
                genre: data.genre,
                galleries: galleries
              });
              //find user
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
                //post list
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
                        title: post.attachments.data[0].title,
                        message: post.message,
                        isActive: true,
                        createdTime: post.created_time,
                        attachments: {
                          id: post.id,
                          media_type: "album",
                          images: subAttachmentList,
                          video: null
                        }
                      });
                    } else if (
                      post.attachments &&
                      post.attachments.data[0].media_type === "photo"
                    ) {
                      postsList.push({
                        id: post.id,
                        message: post.message,
                        title: post.attachments.data[0].title,
                        isActive: true,
                        createdTime: post.created_time,
                        attachments: {
                          id: post.id,
                          media_type: "photo",
                          images: [post.attachments.data[0].media.image.src],
                          video: null
                        }
                      });
                    } else if (
                      post.attachments &&
                      post.attachments.data[0].media_type === "event"
                    ) {
                      postsList.push({
                        id: post.id,
                        message: post.message,
                        title: post.attachments.data[0].title,
                        isActive: true,
                        createdTime: post.created_time,
                        attachments: {
                          id: post.id,
                          media_type: "event",
                          images: [post.attachments.data[0].media.image.src],
                          video: null
                        }
                      });
                    } else if (
                      post.attachments &&
                      post.attachments.data[0].media_type === "video"
                    ) {
                      postsList.push({
                        id: post.id,
                        message: post.message,
                        title: post.attachments.data[0].title,
                        isActive: true,
                        createdTime: post.created_time,
                        attachments: {
                          id: post.id,
                          media_type: "video",
                          images: null,
                          video: post.attachments.data[0].media.source
                        }
                      });
                    }
                  });
                //insert port and update site's posts
                await Post.insertMany(postsList, async (error, docs) => {
                  if (error) {
                    return error;
                  } else {
                    const postIdList = [];
                    docs.forEach(doc => {
                      postIdList.push(doc._id);
                    });
                    await Site.updateOne(
                      { id: pageId },
                      { posts: postIdList.length > 0 ? postIdList : null }
                    );
                  }
                });
                //return
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
    let postsList = [];
    let galleries = [];
    const { pageId, accessToken } = req.body;
    const data = await getSyncData({
      pageId: pageId,
      access_token: accessToken
    });
    //gallery albums
    data.albums &&
      data.albums.data &&
      data.albums.data.forEach(album => {
        galleries.push(album.picture.data.url);
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
                phone: data.phone,
                longitude: data.location ? data.location.longitude : null,
                latitude: data.location ? data.location.latitude : null,
                address: data.single_line_address,
                cover: data.cover ? [data.cover.source] : null,
                categories: data.category_list,
                about: data.about,
                genre: data.genre,
                galleries: galleries
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
                      title: post.attachments.data[0].title,
                      message: post.message,
                      createdTime: post.created_time,
                      isActive: true,
                      attachments: {
                        id: post.id,
                        media_type: "album",
                        images: subAttachmentList,
                        video: null
                      }
                    });
                  } else if (
                    post.attachments &&
                    post.attachments.data[0].media_type === "photo"
                  ) {
                    postsList.push({
                      id: post.id,
                      title: post.attachments.data[0].title,
                      createdTime: post.created_time,
                      message: post.message,
                      isActive: true,
                      attachments: {
                        id: post.id,
                        media_type: "photo",
                        images: [post.attachments.data[0].media.image.src],
                        video: null
                      }
                    });
                  } else if (
                    post.attachments &&
                    post.attachments.data[0].media_type === "event"
                  ) {
                    postsList.push({
                      id: post.id,
                      title: post.attachments.data[0].title,
                      message: post.message,
                      createdTime: post.created_time,
                      isActive: true,
                      attachments: {
                        id: post.id,
                        media_type: "event",
                        images: [post.attachments.data[0].media.image.src],
                        video: null
                      }
                    });
                  } else if (
                    post.attachments &&
                    post.attachments.data[0].media_type === "video"
                  ) {
                    postsList.push({
                      id: post.id,
                      title: post.attachments.data[0].title,
                      message: post.message,
                      createdTime: post.created_time,
                      isActive: true,
                      attachments: {
                        id: post.id,
                        media_type: "video",
                        images: null,
                        video: post.attachments.data[0].media.source
                      }
                    });
                  }
                });

              let postIdList = [];
              postsList.forEach(post => {
                postIdList.push(post.id);
              });
              //insert and update post
              await Post.findOneAndUpdate(
                { id: { $in: postIdList } },
                postsList,
                {
                  upsert: true,
                  useFindAndModify: false
                },
                async (error, result) => {
                  if (error) {
                    // console.log(error);
                  }
                  if (!result) {
                    const site = await Site.findOne({ id: pageId })
                      .select("posts")
                      .populate("posts");
                    let existedPostObjIdList = [];
                    let existedPostIdList = [];
                    site.posts.forEach(existedPost => {
                      existedPostObjIdList.push(
                        new mongoose.Types.ObjectId(existedPost._id)
                      );
                      existedPostIdList.push(existedPost.id);
                    });
                    let newPostList = [];
                    postsList.forEach(async post => {
                      if (!existedPostIdList.includes(post.id)) {
                        newPostList.push(post);
                      } else {
                        await Post.updateOne({ id: post.id }, post);
                      }
                    });
                    await Post.create(newPostList, async (err, docs) => {
                      if (err) {
                        console.log(err);
                      }
                      if (docs) {
                        let newPostObjIdList = [];
                        docs.forEach(post => {
                          newPostObjIdList.push(
                            new mongoose.Types.ObjectId(post._id)
                          );
                        });
                        await Site.updateOne(
                          { id: pageId },
                          {
                            $push: {
                              posts:
                                newPostObjIdList.length > 0
                                  ? newPostObjIdList
                                  : null
                            }
                          }
                        );
                      }
                    });
                  }
                }
              );

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
