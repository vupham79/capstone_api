import mongoose from "mongoose";
import { Site, Post, User, HomePageImage } from "../models";
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
      category: "Product",
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
      isActivated: true,
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

export async function insertSite(pageId, userId, body) {
  const UserResult = await User.findOne({ id: userId });
  const HomePageImageResult = await HomePageImage.findOne({ id: pageId });
  await Site.collection.insertOne({
    id: pageId,
    phone: body.phone,
    longitude: body.longitude,
    latitude: body.latitude,
    logo: body.logo,
    fontTitle: body.fontTitle,
    fontBody: body.fontBody,
    category: body.category,
    title: body.title,
    address: body.address,
    navItems: body.navItems,
    isActivated: true,
    posts: body.posts,
    userId: UserResult._id,
    homePageImageId: HomePageImageResult._id
  });
  return await Site.find().populate({
    path: " posts userId homePageImageId",
    populate: [
      {
        path: "videoId imageId"
      }
    ]
  });
}

export async function editSite(id, body) {
  const SiteResult = await Site.findOne({ id: id });
  await SiteResult.updateOne({
    phone: body.phone,
    longitude: body.longitude,
    latitude: body.latitude,
    logo: body.logo,
    fontTitle: body.fontTitle,
    fontBody: body.fontBody,
    category: body.category,
    title: body.title,
    address: body.address,
    navItems: body.navItems,
    posts: body.posts
  });
  return await Site.find().populate({
    path: " posts userId homePageImageId",
    populate: [
      {
        path: "videoId imageId"
      }
    ]
  });
}

export async function deleteSite(id) {
  const SiteResult = await Site.findOne({ id: id });
  await SiteResult.updateOne({
    isActivated: false
  });
  return await Site.find().populate({
    path: " posts userId homePageImageId",
    populate: [
      {
        path: "videoId imageId"
      }
    ]
  });
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
