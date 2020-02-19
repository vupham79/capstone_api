import {
  getFacebookPageInfo,
  getFacebookPageToken,
  getPageImage,
  uploadPageImage,
  downloadPageImage,
  getUserPages,
  confirmPage
} from "../actions/fbPage";
import { insertTheme, findOneTheme, editTheme } from "../actions/themeDB";
import {
  insertSuggestedColor,
  findOneSuggestedColor,
  editSuggestedColor
} from "../actions/suggestedColorDB";
import {
  insertHomePageImage,
  findOneHomePageImage,
  editHomePageImage
} from "../actions/homePageImageDB";
import { insertImage, findOneImage, editImage } from "../actions/imageDB";
import { insertUser, findOneUser, editUser } from "../actions/userDB";
import { insertPost, findOnePost, editPost } from "../actions/postDB";
import { insertSite, findOneSite, editSite } from "../actions/siteDB";
import { insertVideo, findOneVideo, editVideo } from "../actions/videoDB";
import { Router } from "express";
import { Site, Post, User, HomePageImage } from "../models";
import {
  insertCategory,
  editCategory,
  findOneCategory
} from "../actions/categoryDB";
import {
  insertSuggestedTheme,
  editSuggestedTheme,
  findOneSuggestedTheme
} from "../actions/suggestedThemeDB";

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
  console.log(JSON.stringify(req.body.picture));
  if (data) {
    let navItemsList = [];
    req.body.navItems.forEach(navItem => {
      navItemsList.push({
        id: req.body.pageId,
        order: navItem.order,
        title: navItem.name
      });
    });

    const saveImage = new Promise(async function(resolve, reject) {
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
    });
    const saveVideo = new Promise(async function(resolve, reject) {
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
    });
    const saveColor = new Promise(async function(resolve, reject) {
      const colorExist = await findOneSuggestedColor(req.body.pageId);
      if (!colorExist) {
        await insertSuggestedColor(req.body.pageId, {
          color: req.body.color === null ? "" : req.body.color
        });
      } else {
        await editSuggestedColor(req.body.pageId, {
          color: req.body.color === null ? "" : req.body.color
        });
      }
    });
    const saveHomePageImage = new Promise(async function(resolve, reject) {
      const homePageImageExist = await findOneHomePageImage(req.body.pageId);
      if (!homePageImageExist) {
        await insertHomePageImage(req.body.pageId, {
          url: data.cover.source === null ? "" : data.cover.source
        });
      } else {
        await editHomePageImage(req.body.pageId, {
          url: data.cover.source === null ? "" : data.cover.source
        });
      }
    });
    const saveUser = new Promise(async function(resolve, reject) {
      const userExist = await findOneUser(req.body.profile.id);
      if (!userExist) {
        await insertUser(req.body.profile.id, {
          displayName:
            req.body.profile.name === null ? "" : req.body.profile.name,
          email: req.body.email === null ? "" : req.body.email,
          phone: data.phone === null ? "" : data.phone,
          accessToken:
            req.body.accessToken === null ? "" : req.body.accessToken,
          picture: req.body.picture === null ? "" : req.body.picture
        });
      } else {
        await editUser(req.body.profile.id, {
          isplayName:
            req.body.profile.name === null ? "" : req.body.profile.name,
          email: req.body.email === null ? "" : req.body.email,
          phone: data.phone === null ? "" : data.phone,
          accessToken:
            req.body.accessToken === null ? "" : req.body.accessToken,
          picture: req.body.picture === null ? "" : req.body.picture
        });
      }
    });
    const saveSuggestedTheme = new Promise(async function(resolve, reject) {
      const suggestedThemeExist = await findOneSuggestedTheme(req.body.pageId);
      if (!suggestedThemeExist) {
        await insertSuggestedTheme(req.body.pageId, {
          name: req.body.name === null ? "" : req.body.name
        });
      } else {
        await editSuggestedTheme(req.body.pageId, {
          name: req.body.name === null ? "" : req.body.name
        });
      }
    });
    Promise.all([
      saveImage,
      saveVideo,
      saveHomePageImage,
      saveColor,
      saveUser,
      saveSuggestedTheme
    ]).then(function(response) {});
    const savePost = new Promise(async function(resolve, reject) {
      data.posts &&
        data.posts.data.forEach(async post => {
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
          const saveSite = new Promise(async function(resolve, reject) {
            const siteExist = await findOneSite(req.body.pageId);
            if (!siteExist) {
              await insertSite(req.body.pageId, post.id, req.body.profile.id, {
                phone: data.phone === null ? "" : data.phone,
                longitude:
                  data.location.longitude === null
                    ? ""
                    : data.location.longitude,
                latitude:
                  data.location.latitude === null ? "" : data.location.latitude,
                logo: data.logo ? "" : data.logo,
                fontTitle:
                  req.body.fontTitle === null ? "" : req.body.fontTitle,
                fontBody: req.body.fontBody === null ? "" : req.body.fontBody,
                category: "a",
                title: req.body.name === null ? "" : req.body.name,
                address:
                  data.single_line_address === null
                    ? ""
                    : data.single_line_address,
                navItems: navItemsList === null ? [] : navItemsList
              });
            } else {
              await editSite(req.body.pageId, post.id, req.body.profile.id, {
                phone: data.phone === null ? "" : data.phone,
                longitude:
                  data.location.longitude === null
                    ? ""
                    : data.location.longitude,
                latitude:
                  data.location.latitude === null ? "" : data.location.latitude,
                logo: data.logo === null ? "" : data.logo,
                fontTitle:
                  req.body.fontTitle === null ? "" : req.body.fontTitle,
                fontBody: req.body.fontBody === null ? "" : req.body.fontBody,
                category: "a",
                title: req.body.name === null ? "" : req.body.name,
                address:
                  data.single_line_address === null
                    ? ""
                    : data.single_line_address,
                navItems: navItemsList === null ? [] : navItemsList
              });
            }
          });
          Promise.all([saveSite]).finally(function(response) {});
        });
    });
    Promise.all([savePost]).finally(async function(response) {});
    const saveTheme = new Promise(async function(resolve, reject) {
      const themeExist = await findOneTheme(req.body.pageId);
      if (!themeExist) {
        await insertTheme(req.body.pageId, {
          name: req.body.name === null ? "" : req.body.name,
          suggested_font: req.body.fontTitle === null ? "" : req.body.fontTitle
        });
      } else {
        await editTheme(req.body.pageId, {
          name: req.body.name === null ? "" : req.body.name,
          suggested_font: req.body.fontTitle === null ? "" : req.body.fontTitle
        });
      }
    });
    const saveCategory = new Promise(async function(resolve, reject) {
      const categoryExist = await findOneCategory(req.body.pageId);
      if (!categoryExist) {
        await insertCategory(req.body.pageId, {
          name: req.body.name === null ? "" : req.body.name
        });
      } else {
        await editCategory(req.body.pageId, {
          name: req.body.name === null ? "" : req.body.name
        });
      }
    });
    Promise.all([saveTheme, saveCategory]).finally(function(response) {});
  }
  return res.status(500).send("No data found!");
});

export default router;
