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
import { insertSite, findOneSite, editSite } from "../actions/siteDB";
import { insertVideo, findOneVideo, editVideo } from "../actions/videoDB";
import { Router } from "express";
import { Site, Post, User, HomePageImage } from "../models";
import {
  insertCategory,
  editCategory,
  findOneCategory
} from "../actions/categoryDB";

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
  // console.log(req.body);
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
        await insertSite(req.body.pageId, req.body.profile.id, {
          phone: data.phone ? data.phone : "",
          longitude: data.location.longitude ? data.location.longitude : "",
          latitude: data.location.latitude ? data.location.latitude : "",
          logo: data.logo ? data.logo : "",
          fontTitle: req.body.fontTitle ? req.body.fontTitle : "",
          fontBody: req.body.fontBody ? req.body.fontBody : "",
          title: req.body.name ? req.body.name : "",
          address: data.single_line_address ? data.single_line_address : "",
          navItems: navItemsList ? navItemsList : [],
          posts: postsIdList ? postsIdList : []
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
          posts: postsIdList ? postsIdList : []
        });
      }
    });
    Promise.all([saveSite]).finally(function(response) {});

    const saveTheme = new Promise(async function(resolve, reject) {
      const themeExist = await findOneTheme(req.body.pageId);
      if (!themeExist) {
        console.log("not exist");
        console.log(req.body.fontTitle);
        console.log(req.body.color);
        console.log(categoryList);
        await insertTheme(req.body.pageId, {
          name: req.body.name ? req.body.name : "",
          mainFont: req.body.fontTitle ? req.body.fontTitle : "",
          mainColor: req.body.color ? req.body.color : "",
          categories: categoryList ? categoryList : []
        });
      } else {
        console.log("exist");
        await editTheme(req.body.pageId, {
          name: req.body.name ? req.body.name : "",
          mainFont: req.body.fontTitle ? req.body.fontTitle : "",
          mainColor: req.body.color ? req.body.color : "",
          categories: categoryList ? categoryList : []
        });
      }
    });
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
    Promise.all([saveTheme, saveCategory]).finally(function(response) {});
    return res.status(200).send(data);
  }
  return res.status(500).send("No data found!");
});

export default router;
