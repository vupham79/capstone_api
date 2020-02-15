import mongoose from "mongoose";
import { Site, Post, User, NavItem, HomePageImage } from "../models";
require("dotenv").config();

export async function createSite() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const PostResult = await Post.findOne({ id: 1 });
  const UserResult = await User.findOne({ id: 1 });
  const NavItemResult = await NavItem.findOne({ id: 1 });
  const HomePageImageResult = await HomePageImage.findOne({ id: 1 });
  await Site.create([
    {
      id: 1,
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
        path: "videoId"
      },
      {
        path: "imageId"
      }
    ]
  });
}

export async function insertSite(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const PostResult = await Post.findOne({ id: 1 });
  const UserResult = await User.findOne({ id: 1 });
  const NavItemResult = await NavItem.findOne({ id: 1 });
  const HomePageImageResult = await HomePageImage.findOne({ id: 1 });
  await Site.collection.insertOne({
    id: Number.parseInt(id),
    phone: "0908936361",
    longitude: "10.001",
    latitude: "10.001",
    logo: "https://i.ibb.co/gVpcW78/pv-featured-images.jpg",
    fontTitle: "Times New Roman",
    fontBody: "Arial",
    category: "Entertainment",
    title: "Pianissimo 2",
    address: "hoangcmse61788@fpt.edu.vn",
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
        path: "videoId"
      },
      {
        path: "imageId"
      }
    ]
  });
}

export async function editSite(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const PostResult = await Post.findOne({ id: 1 });
  const UserResult = await User.findOne({ id: 1 });
  const NavItemResult = await NavItem.findOne({ id: 1 });
  const HomePageImageResult = await HomePageImage.findOne({ id: 1 });
  const SiteResult = await Site.findOne({ id: id });
  await SiteResult.updateOne({
    id: Number.parseInt(id),
    phone: "0902347082",
    longitude: "15.052",
    latitude: "20.052",
    logo: "https://i.ibb.co/gVpcW78/pv-featured-images.jpg",
    fontTitle: "verdana",
    fontBody: "verdana",
    category: "Product",
    title: "Entertainment",
    address: "hoangcmse61788@gmail.com",
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
        path: "videoId"
      },
      {
        path: "imageId"
      }
    ]
  });
}

export async function deleteSite(id) {
  mongoose.connect(process.env.MONGODB_URL_DEV);
  const PostResult = await Post.findOne({ id: 1 });
  const UserResult = await User.findOne({ id: 1 });
  const NavItemResult = await NavItem.findOne({ id: 1 });
  const HomePageImageResult = await HomePageImage.findOne({ id: 1 });
  const SiteResult = await Site.findOne({ id: id });
  await SiteResult.updateOne({
    id: Number.parseInt(id),
    phone: "0902347082",
    longitude: "15.052",
    latitude: "20.052",
    logo: "https://i.ibb.co/gVpcW78/pv-featured-images.jpg",
    fontTitle: "verdana",
    fontBody: "verdana",
    category: "Product",
    title: "Entertainment",
    address: "hoangcmse61788@gmail.com",
    isActivated: false,
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

export async function findAllSite() {
  mongoose.connect(process.env.MONGODB_URL_DEV);
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
  mongoose.connect(process.env.MONGODB_URL_DEV);
  return await Site.findOne({ id: id }).populate({
    path: "postId userId navItemId homePageImageId",
    populate: [
      {
        path: "videoId imageId"
      }
    ]
  });
}
