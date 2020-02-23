import mongoose from "mongoose";
import { HomePageImage, Post, Site, User } from "../models";
require("dotenv").config();

export async function createSite() {
  const PostResult = await Post.findOne({ id: "1" });
  const UserResult = await User.findOne({ id: "1" });
  const HomePageImageResult = await HomePageImage.findOne({ id: "1" });
  await Site.create([
    {
      id: "1",
      phone: "0907419552",
      longitude: "106.676089",
      latitude: "106.676089",
      logo: "https://i.ibb.co/gVpcW78/pv-featured-images.jpg",
      fontTitle: "Arial",
      fontBody: "Times New Roman",
      title: "Pianissimo",
      address: "689/7/10 Huong Lo 2",
      navItems: [
        {
          id: "109919550538707",
          name: "Home",
          order: 1
        },
        {
          id: "109919550538707",
          name: "About",
          order: 2
        },
        {
          id: "109919550538707",
          name: "Gallery",
          order: 3
        },
        {
          id: "109919550538707",
          name: "Event",
          order: 4
        },
        {
          id: "109919550538707",
          name: "Contact",
          order: 5
        },
        {
          id: "109919550538707",
          name: "News",
          order: 6
        }
      ],
      isPublish: true,
      posts: [PostResult._id],
      userId: UserResult._id,
      homePageImageId: HomePageImageResult._id
    }
  ]);
  return await Site.find().populate({
    path: " posts userId homePageImageId",
    populate: [
      {
        path: "videoId imageId"
      }
    ]
  });
}

export async function insertSite(pageId, userId, body, session) {
  const UserResult = await User.findOne({ id: userId });
  const HomePageImageResult = await HomePageImage.findOne({ id: pageId });
  const PostResult = await Post.find({ id: pageId });
  const site = await Site.create(
    [
      {
        id: pageId,
        phone: body.phone ? body.phone : "",
        longitude: body.longitude ? body.longitude : "",
        latitude: body.latitude ? body.latitude : "",
        logo: body.logo ? body.logo : "",
        fontTitle: body.fontTitle ? body.fontTitle : "",
        fontBody: body.fontBody ? body.fontBody : "",
        title: body.title ? body.title : "",
        address: body.address ? body.title : "",
        navItems: body.navItems ? body.navItems : "",
        posts: PostResult ? PostResult : "",
        isPublish: true,
        userId: UserResult && UserResult._id,
        homePageImageId: HomePageImageResult && HomePageImageResult._id,
        themeId: body.themeId
      }
    ],
    { session }
  );
  return site;
}

export async function editSite(id, body) {
  const SiteResult = await Site.findOne({ id: id });
  await SiteResult.updateOne({
    phone: body.phone ? body.phone : "",
    longitude: body.longitude ? body.longitude : "",
    latitude: body.latitude ? body.latitude : "",
    logo: body.logo ? body.logo : "",
    fontTitle: body.fontTitle ? body.fontTitle : "",
    fontBody: body.fontBody ? body.fontBody : "",
    title: body.title ? body.title : "",
    address: body.address ? body.title : "",
    navItems: body.navItems ? body.navItems : "",
    posts: body.posts ? body.posts : ""
  });
  return SiteResult;
}

export async function deleteSite(id) {
  const SiteResult = await Site.findOne({ id: id });
  await SiteResult.updateOne({
    isPublish: false
  });
  return SiteResult;
}

export async function findAllSite() {
  return await Site.find().populate({
    path: " posts userId homePageImageId",
    populate: [
      {
        path: "videoId imageId"
      }
    ]
  });
}

export async function findOneSiteByAccessToken(id, body) {
  return await Site.findOne({
    id: id,
    accessToken: body.accessToken ? body.accessToken : ""
  }).populate({
    path: " posts userId homePageImageId",
    populate: [
      {
        path: "videoId imageId"
      }
    ]
  });
}

export async function findOneSite(id) {
  return await Site.findOne({ id: id }).populate({
    path: " posts userId homePageImageId",
    populate: [
      {
        path: "videoId imageId"
      }
    ]
  });
}

export async function findAllSiteByUser(id, accessToken) {
  const user = await User.findOne({
    id: id,
    accessToken: accessToken ? accessToken : ""
  });
  if (user) {
    const site = await Site.find({
      userId: new mongoose.Types.ObjectId(user._id)
    }).populate({
      path: "posts userId homePageImageId",
      populate: [
        {
          path: "videoId imageId"
        }
      ]
    });
    return site;
  }
  return false;
}
