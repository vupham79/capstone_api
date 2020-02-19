import mongoose from "mongoose";
import { Site, Post, User, NavItem, HomePageImage } from "../models";
require("dotenv").config();

export async function createSite() {
  const PostResult = await Post.findOne({ id: "1" });
  const UserResult = await User.findOne({ id: "1" });
  const NavItemResult = await NavItem.findOne({ id: "1" });
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
      isActivated: true,
      postId: PostResult._id,
      userId: UserResult._id,
      navItemId: NavItemResult._id,
      homePageImageId: HomePageImageResult._id
    }
  ]);
  return await Site.find().populate({
    path: "postId userId navItemId homePageImageId",
    populate: [
      {
        path: "videoId imageId"
      }
    ]
  });
}

export async function insertSite(pageId, postId, userId, body) {
  const PostResult = await Post.findOne({ id: postId });
  const UserResult = await User.findOne({ id: userId });
  const NavItemResult = await NavItem.findOne({ id: pageId });
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
    isActivated: true,
    postId: PostResult._id,
    userId: UserResult._id,
    navItemId: NavItemResult._id,
    homePageImageId: HomePageImageResult._id
  });
  return await Site.find().populate({
    path: "postId userId navItemId homePageImageId",
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
    address: body.address
  });
  return await Site.find().populate({
    path: "postId userId navItemId homePageImageId",
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
    path: "postId userId navItemId homePageImageId",
    populate: [
      {
        path: "videoId imageId"
      }
    ]
  });
}

export async function findAllSite() {
  return await Site.find().populate({
    path: "postId userId navItemId homePageImageId",
    populate: [
      {
        path: "videoId imageId"
      }
    ]
  });
}

export async function findOneSite(id) {
  return await Site.findOne({ id: id }).populate({
    path: "postId userId navItemId homePageImageId",
    populate: [
      {
        path: "videoId imageId"
      }
    ]
  });
}
