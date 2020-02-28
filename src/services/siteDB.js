import mongoose from "mongoose";
import { Site, User, Admin } from "../models";
require("dotenv").config();

export async function createSite() {
  const UserResult = await User.findOne({ id: "1" });
  const create = await Site.create([
    {
      id: "1",
      phone: "0907419552",
      longitude: "106.676089",
      latitude: "106.676089",
      color: "red",
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
      isPublish: false,
      cover: ["https://i.ibb.co/gVpcW78/pv-featured-images.jpg"],
      posts: [],
      user: UserResult._id
    }
  ]);
  return create.populate({
    path: "theme",
    populate: {
      path: "posts"
    }
  });
}

export async function insertSite(pageId, body) {
  const insert = await Site.create({
    id: pageId,
    phone: body.phone ? body.phone : "",
    longitude: body.longitude ? body.longitude : "",
    latitude: body.latitude ? body.latitude : "",
    color: body.color ? body.color : "",
    logo: body.logo ? body.logo : "",
    fontTitle: body.fontTitle ? body.fontTitle : "",
    fontBody: body.fontBody ? body.fontBody : "",
    title: body.title ? body.title : "",
    address: body.address ? body.address : "",
    navItems: body.navItems ? body.navItems : "",
    isPublish: false,
    theme: body.theme,
    cover: body.cover ? body.cover : [],
    posts: body.posts ? body.posts : [],
    categories: body.categories ? body.categories : [],
    url: body.url ? body.url : "",
    sitePath: body.sitePath ? body.sitePath : {}
  });
  return insert;
}

export async function editSite(id, body) {
  const update = await Site.updateOne(
    { id: id },
    {
      phone: body.phone ? body.phone : "",
      longitude: body.longitude ? body.longitude : "",
      latitude: body.latitude ? body.latitude : "",
      address: body.address ? body.address : "",
      cover: body.cover ? body.cover : [],
      posts: body.posts ? body.posts : [],
      categories: body.categories ? body.categories : []
    }
  );
  return update;
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
    path: "theme",
    populate: {
      path: "posts"
    }
  });
}

export async function findOneSiteByAccessToken(id, body) {
  return await Site.findOne({
    id: id,
    accessToken: body.accessToken ? body.accessToken : ""
  }).populate({
    path: "theme",
    populate: {
      path: "posts"
    }
  });
}

export async function findOneSite(id) {
  return await Site.findOne({ id: id }).populate({
    path: "theme",
    populate: {
      path: "posts"
    }
  });
}

export async function findAllSiteByUser(id, accessToken) {
  const sites = await User.findOne({
    id: id,
    accessToken: accessToken ? accessToken : ""
  })
    .select("sites.categories")
    .populate({
      path: "sites",
      select: "categories id title isPublish logo"
    });
  if (sites) {
    return sites;
  }
  return false;
}

export async function findAllSiteByAdmin(username, password) {
  const admin = await Admin.findOne({
    username: username,
    password: password
  });
  if (admin) {
    const site = await Site.find()
      .select("logo title categories fontTitle fontBody theme isPublish id")
      .populate({
        path: "theme categories"
      });
    return site;
  }
  return false;
}
