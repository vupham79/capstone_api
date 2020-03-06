import mongoose from "mongoose";
import { Site, User, Admin } from "../models";

// export async function createSite() {
//   const UserResult = await User.findOne({ id: "1" });
//   const create = await Site.create([
//     {
//       id: "1",
//       phone: "0907419552",
//       longitude: "106.676089",
//       latitude: "106.676089",
//       color: "red",
//       logo: "https://i.ibb.co/gVpcW78/pv-featured-images.jpg",
//       fontTitle: "Arial",
//       fontBody: "Times New Roman",
//       title: "Pianissimo",
//       address: "689/7/10 Huong Lo 2",
//       navItems: [
//         {
//           id: "109919550538707",
//           name: "Home",
//           order: 1
//         },
//         {
//           id: "109919550538707",
//           name: "About",
//           order: 2
//         },
//         {
//           id: "109919550538707",
//           name: "Gallery",
//           order: 3
//         },
//         {
//           id: "109919550538707",
//           name: "Event",
//           order: 4
//         },
//         {
//           id: "109919550538707",
//           name: "Contact",
//           order: 5
//         },
//         {
//           id: "109919550538707",
//           name: "News",
//           order: 6
//         }
//       ],
//       isPublish: false,
//       cover: ["https://i.ibb.co/gVpcW78/pv-featured-images.jpg"],
//       posts: null
//     }
//   ]);
//   return create.populate({
//     path: "theme"
//   });
// }

export async function insertSite(pageId, body) {
  const insert = await Site.create({
    id: pageId,
    phone: body.phone,
    longitude: body.longitude,
    latitude: body.latitude,
    color: body.color,
    logo: body.logo,
    fontTitle: body.fontTitle,
    fontBody: body.fontBody,
    title: body.title,
    address: body.address,
    navItems: body.navItems,
    theme: body.theme,
    cover: body.cover,
    posts: body.posts,
    categories: body.categories,
    url: body.url,
    sitePath: body.sitePath.toLowerCase(),
    isPublish: body.isPublish,
    about: body.about,
    galleries: body.galleries,
    events: body.events
  });
  return insert;
}

export async function editSite(id, body) {
  const update = await Site.updateOne(
    { id: id },
    {
      phone: body.phone,
      longitude: body.longitude,
      latitude: body.latitude,
      address: body.address,
      cover: body.cover,
      categories: body.categories,
      about: body.about,
      galleries: body.galleries
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
    path: "theme posts events",
    populate: {
      path: "events.place"
    }
  });
}

export async function findOneSiteByAccessToken(id, body) {
  return await Site.findOne({
    id: id,
    accessToken: body.accessToken
  }).populate({
    path: "theme posts events"
  });
}

export async function findOneSite(id) {
  return await Site.findOne({ id: id }).populate({
    path: "theme posts events"
  });
}

export async function findAllSiteByUser(id, accessToken) {
  const sites = await User.findOne({
    id: id,
    accessToken: accessToken
  })
    .select("sites")
    .populate({
      path: "sites",
      select: "id title isPublish logo categories sitePath"
    });
  if (sites) {
    return sites;
  }
  return false;
}

export async function findSiteBySitepath(sitepath) {
  return await Site.findOne({ sitePath: sitepath.toLowerCase() }).populate({
    path: "theme posts events"
  });
}
