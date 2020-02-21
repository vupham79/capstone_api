import {
  getFacebookPageInfo,
  getFacebookPageToken,
  getPageImage,
  uploadPageImage,
  downloadPageImage,
  getUserPages,
  confirmPage
} from "../actions/fbPage";
import {
  insertTheme,
  findOneTheme,
  editTheme,
  findOneThemeByCategory
} from "../actions/themeDB";
import {
  insertHomePageImage,
  findOneHomePageImage,
  editHomePageImage
} from "../actions/homePageImageDB";
import { insertImage, findOneImage, editImage } from "../actions/imageDB";
import { insertUser, findOneUser, editUser } from "../actions/userDB";
import {
  insertPost,
  findOnePost,
  editPost,
  findAllPost
} from "../actions/postDB";
import {
  insertSite,
  findOneSite,
  editSite,
  findOneSiteByAccessToken,
  findAllSiteByUser
} from "../actions/siteDB";
import { insertVideo, findOneVideo, editVideo } from "../actions/videoDB";
import { Router } from "express";
import { Site, Post, User, HomePageImage } from "../models";
import {
  insertCategory,
  editCategory,
  findOneCategory
} from "../actions/categoryDB";
import { authenticate } from "../actions/middleware";

const router = Router();

router.get("/pageInfo", async (req, res) => {
  const data = await getFacebookPageInfo();
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

//authenticate
router.get("/getSiteInfo", async (req, res) => {
  const data = await findOneSiteByAccessToken(
    req.params.pageId,
    req.params.accessToken
  );
  if (data) {
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

router.post("/confirmPage", authenticate, async (req, res) => {
  const data = await confirmPage({
    pageId: req.body.pageId,
    access_token: req.body.accessToken
  });
  if (data) {
    let navItemsList = [];
    req.body.navItems.forEach(navItem => {
      navItemsList.push({
        order: navItem.order,
        title: navItem.name,
        isActive: true
      });
    });
    let categoryList = [];
    req.body.pages.forEach(page => {
      categoryList.push({
        id: req.body.pageId,
        category: page.category
      });
    });
    const saveImage = new Promise(function(resolve, reject) {
      data.posts &&
        data.posts.data.forEach(async post => {
          const existImage = await findOneImage(post.id);
          if (!existImage) {
            await insertImage(post.id, {
              url: post.full_picture ? post.full_picture : ""
            });
          } else {
            await editImage(post.id, {
              url: post.full_picture ? post.full_picture : ""
            });
          }
        });
    });
    const saveVideo = new Promise(function(resolve, reject) {
      data.videos &&
        data.videos.data.forEach(async video => {
          const videoExist = await findOneVideo(video.id);
          if (!videoExist) {
            await insertVideo(video.id, {
              url: video.permalink_url ? video.permalink_url : ""
            });
          } else {
            await editVideo(video.id, {
              url: video.permalink_url ? video.permalink_url : ""
            });
          }
        });
    });
    const saveHomePageImage = new Promise(async function(resolve, reject) {
      const homePageImageExist = await findOneHomePageImage(req.body.pageId);
      if (!homePageImageExist) {
        await insertHomePageImage(req.body.pageId, {
          url: data.cover.source ? data.cover.source : ""
        });
      } else {
        await editHomePageImage(req.body.pageId, {
          url: data.cover.source ? data.cover.source : ""
        });
      }
    });
    Promise.all([saveImage, saveVideo, saveHomePageImage]).then(function(
      response
    ) {});
    const savePost = new Promise(async function(resolve, reject) {
      data.posts &&
        data.posts.data.forEach(async post => {
          const exist = await findOnePost(post.id);
          if (!exist) {
            await insertPost(post.id, {
              content: post.message ? post.message : ""
            });
          } else {
            await editPost(post.id, {
              content: post.message ? post.message : ""
            });
          }
        });
    });
    Promise.all([savePost]).finally(async function(response) {});

    const saveSite = new Promise(async function(resolve, reject) {
      const postsList = await findAllPost();
      let postsIdList = [];
      postsList.forEach(post => {
        postsIdList.push(post._id);
      });
      const siteExist = await findOneSite(req.body.pageId);
      if (!siteExist) {
        await insertSite(req.body.pageId, req.body.userId, {
          phone: data.phone ? data.phone : "",
          longitude: data.location.longitude ? data.location.longitude : "",
          latitude: data.location.latitude ? data.location.latitude : "",
          logo: data.logo ? data.logo : "",
          fontTitle: req.body.fontTitle ? req.body.fontTitle : "",
          fontBody: req.body.fontBody ? req.body.fontBody : "",
          title: req.body.name ? req.body.name : "",
          address: data.single_line_address ? data.single_line_address : "",
          navItems: navItemsList ? navItemsList : [],
          posts: postsIdList ? postsIdList : [],
          username: req.body.profile.name ? req.body.profile.name : ""
        });
      } else {
        await editSite(req.body.pageId, {
          phone: data.phone ? data.phone : "",
          longitude: data.location.longitude ? data.location.longitude : "",
          latitude: data.location.latitude ? data.location.latitude : "",
          logo: data.logo ? data.logo : "",
          fontTitle: req.body.fontTitle ? req.body.fontTitle : "",
          fontBody: req.body.fontBody ? req.body.fontBody : "",
          title: req.body.name ? req.body.name : "",
          address: data.single_line_address ? data.single_line_address : "",
          navItems: navItemsList ? navItemsList : [],
          posts: postsIdList ? postsIdList : [],
          profile: req.body.profile ? req.body.profile : {}
        });
      }
    });
    Promise.all([saveSite]).finally(function(response) {});

    // const saveTheme = new Promise(async function(resolve, reject) {
    // const themeExist = await findOneTheme(req.body.pageId);
    // if (!themeExist) {
    //   await insertTheme(req.body.pageId, {
    //     name: req.body.name ? req.body.name : "",
    //     mainFont: req.body.fontTitle ? req.body.fontTitle : "",
    //     mainColor: req.body.color ? req.body.color : "",
    //     categories: categoryList ? categoryList : []
    //   });
    // } else {
    //   await editTheme(req.body.pageId, {
    //     name: req.body.name ? req.body.name : "",
    //     mainFont: req.body.fontTitle ? req.body.fontTitle : "",
    //     mainColor: req.body.color ? req.body.color : "",
    //     categories: categoryList ? categoryList : []
    //   });
    // }
    // });
    console.log(categoryList);
    const theme = await findOneThemeByCategory(categoryList[0].category);
    console.log(theme);
    const saveCategory = new Promise(async function(resolve, reject) {
      const categoryExist = await findOneCategory(req.body.pageId);
      if (!categoryExist) {
        await insertCategory(req.body.pageId, {
          name: req.body.name ? req.body.name : ""
        });
      } else {
        await editCategory(req.body.pageId, {
          name: req.body.name ? req.body.name : ""
        });
      }
    });
    Promise.all([saveCategory]).finally(function(response) {});
    const data2 = await findAllSiteByUser(
      req.body.userId,
      req.body.accessToken
    );
    // console.log(req.body.userId + "-" + req.body.accessToken);
    // console.log(data2);
    return res.status(200).send(data2);
  }
  return res.status(500).send("No data found!");
});

export default router;
