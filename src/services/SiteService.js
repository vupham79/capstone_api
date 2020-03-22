import { mongoose, Site, User, Category, Post, Event } from "../models";
import moment from "moment";
import { CronJob } from "cron";

const cronJobs = [];
const limit = 5;

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
    events: body.events,
    homepage: body.homepage
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
      lastSync: body.lastSync
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
    id: id
  }).populate({
    path: "theme posts events"
  });
}

export async function findOneSite(id) {
  return await Site.findOne({ id: id }).populate({
    path: "theme posts events"
  });
}

export async function findAllSiteByUser(email) {
  const sites = await User.findOne({
    email: email
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
  return await Site.findOne({ sitePath: sitepath.toLowerCase() })
    .populate({
      path: "theme events"
    })
    .populate("posts", "", "", "", { limit: 4 });
}

export async function checkSiteExist(id) {
  return await User.find({ "sites.id": id });
}

export async function publishSite(id, isPublish) {
  return await Site.updateOne(
    {
      id
    },
    {
      isPublish
    }
  );
}

export async function saveDesign(data) {
  const site = await Site.findOne({
    id: data.pageId
  });
  if (site) {
    if (site.sitePath !== data.sitePath.trim()) {
      const sitePathExisting = await Site.findOne({
        sitePath: data.sitePath.trim()
      });
      if (!sitePathExisting) {
        site.fontTitle = data.fontTitle;
        site.fontBody = data.fontBody;
        site.title = data.name;
        site.color = data.color;
        site.navItems = data.navItems;
        site.theme = new mongoose.Types.ObjectId(data.findTheme._id);
        site.whatsapp = data.whatsapp;
        site.email = data.email;
        site.instagram = data.instagram;
        site.youtube = data.youtube;
        site.phone = data.phone;
        site.sitePath = data.sitePath;
        return await site.save();
      } else {
        return { msg: "Sitepath existed!" };
      }
    } else {
      site.fontTitle = data.fontTitle;
      site.fontBody = data.fontBody;
      site.title = data.name;
      site.color = data.color;
      site.navItems = data.navItems;
      site.theme = new mongoose.Types.ObjectId(data.findTheme._id);
      site.whatsapp = data.whatsapp;
      site.email = data.email;
      site.instagram = data.instagram;
      site.youtube = data.youtube;
      site.phone = data.phone;
      return await site.save();
    }
  } else {
    return { msg: "Site not existed!" };
  }
}

export async function updateLogo(id, logo) {
  return await Site.updateOne(
    {
      id
    },
    {
      logo
    }
  );
}

export async function updateFavicon(id, favicon) {
  return await Site.updateOne(
    {
      id
    },
    {
      favicon
    }
  );
}

export async function updateCovers(pageId, cover) {
  return await Site.updateOne(
    {
      id: pageId
    },
    {
      cover: cover ? cover : null
    }
  );
}

export async function insertAndUpdatePosts(pageId, postsList) {
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
        {
          posts: postIdList.length > 0 ? postIdList : null
        }
      );
    }
  });
}

export async function updateGallery(pageId, galleryList) {
  if (!galleryList) {
    await Site.updateOne(
      { id: pageId },
      {
        galleries: null
      }
    );
  } else {
    await Site.updateOne(
      { id: pageId },
      {
        galleries: galleryList.length > 0 ? galleryList : null
      }
    );
  }
}

export async function insertAndUpdateEvents(pageId, eventList) {
  await Event.insertMany(eventList, async (error, docs) => {
    if (error) {
      return error;
    } else {
      const eventIdList = [];
      docs.forEach(doc => {
        eventIdList.push(doc._id);
      });
      await Site.updateOne(
        { id: pageId },
        {
          events: eventIdList.length > 0 ? eventIdList : null
        }
      );
    }
  });
}

export async function getFacebookPostData(data, dateFrom, dateTo) {
  let postsList = [];
  if (data.posts === undefined) {
    return null;
  }
  data.posts &&
    data.posts.data &&
    data.posts.data.forEach(async post => {
      // console.log(moment(post.created_time).isBetween(dateFrom, dateTo));
      if (dateFrom instanceof Date && dateTo instanceof Date) {
        console.log("dateFrom is not Date");
        if (moment(post.created_time).isBetween(dateFrom, dateTo)) {
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
              },
              target: post.attachments.data[0].target.url
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
              },
              target: post.attachments.data[0].target.url
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
              },
              target: post.attachments.data[0].target.url
            });
          }
        }
      } else {
        console.log("dateFrom is Date");
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
            },
            target: post.attachments.data[0].target.url
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
            },
            target: post.attachments.data[0].target.url
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
            },
            target: post.attachments.data[0].target.url
          });
        }
      }
    });
  return postsList;
}

export async function getFacebookGalleryData(data) {
  let galleryList = [];
  if (data.posts === undefined) {
    return null;
  }
  data.posts &&
    data.posts.data &&
    data.posts.data.forEach(async post => {
      if (post.attachments && post.attachments.data[0].media_type === "album") {
        post.attachments.data[0].subattachments.data.forEach(subAttachment => {
          galleryList.push({
            url: subAttachment.media.image.src,
            target: subAttachment.target.url
          });
        });
      } else if (
        post.attachments &&
        post.attachments.data[0].media_type === "photo"
      ) {
        galleryList.push({
          url: post.attachments.data[0].media.image.src,
          target: post.attachments.data[0].target.url
        });
      }
    });
  return galleryList;
}

export async function getFacebookPostSyncData(data) {
  if (data.posts === undefined) {
    return null;
  }
  let postsList = [];
  data.posts &&
    data.posts.data.forEach(post => {
      if (post.attachments && post.attachments.data[0].media_type === "album") {
        const subAttachmentList = [];
        post.attachments.data[0].subattachments.data.forEach(subAttachment => {
          subAttachmentList.push(subAttachment.media.image.src);
        });
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
          },
          target: post.attachments.data[0].target.url
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
          },
          target: post.attachments.data[0].target.url
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
          },
          target: post.attachments.data[0].target.url
        });
      }
    });
  return postsList;
}

export async function getFacebookEventData(data) {
  let eventList = [];
  if (data.events === undefined) {
    return null;
  }
  data.events &&
    data.events.data &&
    data.events.data.forEach(event => {
      //set place
      let place = {
        name: null,
        street: null,
        city: null,
        country: null
      };
      if (event.place) {
        place.name = event.place.name;
        if (event.place.location) {
          place.street =
            event.place.location.street !== undefined
              ? event.place.location.street
              : null;
          place.city =
            event.place.location.city !== undefined
              ? event.place.location.city
              : null;
          place.country =
            event.place.location.country !== undefined
              ? event.place.location.country
              : null;
        }
      } else {
        place = null;
      }
      //event list
      eventList.push({
        id: event.id,
        name: event.name,
        description: event.description,
        cover: event.cover ? event.cover.source : null,
        startTime: event.start_time,
        endTime: event.end_time,
        place: place,
        isCanceled: event.is_canceled,
        url: "facebook.com/" + event.id
      });
    });
  return eventList;
}

export async function getFacebookEventSyncData(data) {
  if (data.events === undefined) {
    return null;
  }
  let eventList = [];
  data.events &&
    data.events.data &&
    data.events.data.forEach(event => {
      //set place
      let place = {
        name: null,
        street: null,
        city: null,
        country: null
      };
      if (event.place) {
        place.name = event.place.name;
        if (event.place.location) {
          place.street =
            event.place.location.street !== undefined
              ? event.place.location.street
              : null;
          place.city =
            event.place.location.city !== undefined
              ? event.place.location.city
              : null;
          place.country =
            event.place.location.country !== undefined
              ? event.place.location.country
              : null;
        }
      } else {
        place = null;
      }
      //event list
      eventList.push({
        id: event.id,
        name: event.name,
        description: event.description,
        cover: event.cover ? event.cover.source : null,
        startTime: event.start_time,
        endTime: event.end_time,
        place: place,
        isCanceled: event.is_canceled,
        url: "facebook.com/" + event.id
      });
    });
  return eventList;
}

export async function getFacebookCategoryObjIdData(categoryInDB, categories) {
  let categoryObjIdList = [];
  categories.forEach(async category => {
    if (!categoryInDB.includes(category.name)) {
      await Category.create({
        name: category.name
      });
    }
    let find = await Category.findOne({
      name: category.name
    });
    if (find) {
      categoryObjIdList.push(new mongoose.Types.ObjectId(find._id));
    }
  });
  return categoryObjIdList;
}

export async function updateSiteList(userId, insert) {
  return await User.findOne({ id: userId })
    .select("sites")
    .then(async result => {
      let siteList = result.sites;
      siteList.push(insert._id);
      await result.updateOne({
        sites: siteList
      });
    });
}

export async function createAndSaveNewPost(pageId, newPostList) {
  if (!newPostList || newPostList.length === 0) {
    return;
  }
  await Post.create(newPostList, async (err, docs) => {
    if (err) {
      console.log(err);
    }
    if (docs) {
      //save new post
      let newPostObjIdList = [];
      docs.forEach(post => {
        newPostObjIdList.push(new mongoose.Types.ObjectId(post._id));
      });
      if (newPostObjIdList.length > 0) {
        await Site.updateOne(
          { id: pageId },
          {
            posts: newPostObjIdList
          }
        );
      }
    }
  });
}

export async function createAndSaveNewEvent(pageId, newEventList) {
  await Event.create(newEventList, async (err, docs) => {
    if (err) {
      console.log(err);
    }
    if (docs) {
      //save new event
      let newEventObjList = [];
      docs.forEach(event => {
        newEventObjList.push(new mongoose.Types.ObjectId(event._id));
      });
      await Site.updateOne(
        { id: pageId },
        {
          $push: {
            events: newEventObjList.length > 0 ? newEventObjList : null
          }
        }
      );
    }
  });
}

export async function updateExistingPost(existedPostList, existedPostIdList) {
  let newPostList = [];
  existedPostList.forEach(async post => {
    if (!existedPostIdList.includes(post.id)) {
      newPostList.push(post);
    } else {
      await Post.updateOne({ id: post.id }, post);
    }
  });
  return newPostList;
}

export async function updateExistingEvent(eventList, existedEventIdList) {
  let newEventList = [];
  eventList.forEach(async event => {
    if (!existedEventIdList.includes(event.id)) {
      newEventList.push(event);
    } else {
      await Event.updateOne({ id: event.id }, event);
    }
  });
  return newEventList;
}

export async function findSiteEventTab(id, sitePath) {
  if (sitePath) {
    return await Site.find({ sitePath })
      .populate("events")
      .select("events");
  } else
    return await Site.find({ id })
      .populate("events")
      .select("events");
}

export async function findSiteHomeTab(id, sitePath) {
  if (sitePath) {
    const site = await Site.findOne({ sitePath });
    return site;
  } else {
    const site = await Site.findOne({ id });
    return site;
  }
}

export async function findSiteGalleryTab(id, sitePath, pageNumber = 1) {
  let counter = 0;
  if (sitePath) {
    const total = await Site.findOne({ sitePath }, "galleries");
    await total.posts.map(() => {
      counter++;
    });
    const galleries = await Site.findOne({ sitePath })
      .select("galleries")
      .populate("galleries", "", "", "", {
        limit,
        skip: (pageNumber - 1) * limit
      });
    return {
      pageCount: Math.ceil(counter / limit),
      data: galleries
    };
  } else {
    const total = await Site.findOne({ id }, "galleries");
    await total.posts.map(() => {
      counter++;
    });
    const galleries = await Site.findOne({ id }, "galleries", {
      limit,
      skip: (pageNumber - 1) * limit
    });
    return {
      pageCount,
      data: galleries
    };
  }
}

export async function findSiteNewsTab(id, sitePath, pageNumber = 1) {
  let counter = 0;
  if (sitePath) {
    const total = await Site.findOne({ sitePath }, "posts");
    await total.posts.map(() => {
      counter++;
    });
    const posts = await Site.findOne({ sitePath })
      .select("posts")
      .populate("posts", "", "", "", { limit, skip: (pageNumber - 1) * limit });
    return {
      pageCount: Math.ceil(counter / limit),
      data: posts
    };
  } else {
    const total = await Site.findOne({ id }, "posts");
    await total.posts.map(() => {
      counter++;
    });
    const posts = await Site.findOne({ id })
      .select("posts")
      .populate("posts", "", "", "", { limit, skip: (pageNumber - 1) * limit });
    return {
      pageCount: Math.ceil(counter / limit),
      data: posts
    };
  }
}

export async function findExistedEventObjIdList(pageId) {
  const site = await Site.findOne({ id: pageId })
    .select("events")
    .populate("events");
  let existedEventObjIdList = [];
  site.events.forEach(existedEvent => {
    existedEventObjIdList.push(new mongoose.Types.ObjectId(existedEvent._id));
  });
  return existedEventObjIdList;
}

export async function findExistedEventIdList(pageId) {
  const site = await Site.findOne({ id: pageId })
    .select("events")
    .populate("events");
  let existedEventIdList = [];
  site.events.forEach(existedEvent => {
    existedEventIdList.push(existedEvent.id);
  });
  return existedEventIdList;
}

export async function findExistedPostObjId(pageId) {
  const site = await Site.findOne({ id: pageId })
    .select("events")
    .populate("events");
  let existedEventObjIdList = [];
  let existedEventIdList = [];
  site.events.forEach(existedEvent => {
    existedEventObjIdList.push(new mongoose.Types.ObjectId(existedEvent._id));
    existedEventIdList.push(existedEvent.id);
  });
  return site;
}

export async function insertAndUpdateSyncDataPost(pageId, postsList) {
  //find existed post id
  const site = await Site.findOne({ id: pageId })
    .select("posts")
    .populate("posts");
  let existedPostObjIdList = [];
  let existedPostIdList = [];
  let fbPostIdList = [];
  postsList &&
    postsList.forEach(post => {
      fbPostIdList.push(post.id);
    });
  site.posts &&
    site.posts.forEach(existedPost => {
      if (fbPostIdList.includes(existedPost.id)) {
        existedPostIdList.push(existedPost.id);
      }
    });
  postsList &&
    postsList.forEach(async post => {
      if (!existedPostIdList.includes(post.id)) {
        const existedPost = await Post.findOne({ id: post.id });
        if (existedPost) {
          await Post.updateOne({ id: post.id }, post);
          const postResult = await Post.findOne({ id: post.id });
          existedPostObjIdList.push(
            new mongoose.Types.ObjectId(postResult._id)
          );
          await Site.updateOne(
            { id: pageId },
            { posts: existedPostObjIdList, lastSync: new Date() }
          );
        } else {
          const postResult = await Post.create(post);
          existedPostObjIdList.push(
            new mongoose.Types.ObjectId(postResult._id)
          );
          await Site.updateOne(
            { id: pageId },
            { posts: existedPostObjIdList, lastSync: new Date() }
          );
        }
      } else {
        await Post.updateOne({ id: post.id }, post);
        const postResult = await Post.findOne({ id: post.id });
        existedPostObjIdList.push(new mongoose.Types.ObjectId(postResult._id));
        await Site.updateOne(
          { id: pageId },
          { posts: existedPostObjIdList, lastSync: new Date() }
        );
      }
    });
}

export async function insertAndUpdateSyncDataEvents(pageId, eventList) {
  //find existed event id
  const site = await Site.findOne({ id: pageId })
    .select("events")
    .populate("events");
  let existedEventObjIdList = [];
  let existedEventIdList = [];
  let fbEventIdList = [];
  eventList &&
    eventList.forEach(event => {
      fbEventIdList.push(event.id);
    });
  site.events &&
    site.events.forEach(existedEvent => {
      if (fbEventIdList.includes(existedEvent.id)) {
        existedEventIdList.push(existedEvent.id);
      }
    });
  eventList &&
    eventList.forEach(async event => {
      if (!existedEventIdList.includes(event.id)) {
        console.log("Event exist but not inside Site: " + event.id);
        const existedEvent = await Event.findOne({ id: event.id });
        if (existedEvent) {
          await Event.updateOne({ id: event.id }, event);
          const eventResult = await Event.findOne({ id: event.id });
          existedEventObjIdList.push(
            new mongoose.Types.ObjectId(eventResult._id)
          );
          await Site.updateOne(
            { id: pageId },
            { events: existedEventObjIdList, lastSync: new Date() }
          );
        } else {
          const eventResult = await Event.create(event);
          console.log(eventResult);
          existedEventObjIdList.push(
            new mongoose.Types.ObjectId(eventResult._id)
          );
          await Site.updateOne(
            { id: pageId },
            { events: existedEventObjIdList, lastSync: new Date() }
          );
        }
      } else {
        await Event.updateOne({ id: event.id }, event);
        const eventResult = await Event.findOne({ id: event.id });
        existedEventObjIdList.push(
          new mongoose.Types.ObjectId(eventResult._id)
        );
        await Site.updateOne(
          { id: pageId },
          { events: existedEventObjIdList, lastSync: new Date() }
        );
      }
    });
}

// export async function insertAndUpdateSyncEvents(
//   pageId,
//   eventList,
//   eventIdList
// ) {
//   await Event.findOneAndUpdate(
//     { id: { $in: eventIdList } },
//     eventList,
//     {
//       upsert: true,
//       useFindAndModify: false
//     },
//     async (error, result) => {
//       if (error) {
//         // console.log(error);
//       }
//       if (!result) {
//         //find existed event id
//         const site = await Site.findOne({ id: pageId })
//           .select("events")
//           .populate("events");
//         let existedEventObjIdList = [];
//         let existedEventIdList = [];
//         site.events.forEach(existedEvent => {
//           existedEventObjIdList.push(
//             new mongoose.Types.ObjectId(existedEvent._id)
//           );
//           existedEventIdList.push(existedEvent.id);
//         });
//         //update existing event
//         let newEventList = await SiteSerivce.updateExistingEvent(
//           eventList,
//           existedEventIdList
//         );
//         //create new event and save new event into site
//         await SiteSerice.createAndSaveNewEvent(pageId, newEventList);
//       }
//     }
//   );
// }

// export async function insertAndUpdateSyncGallery(
//   pageId,
//   eventList,
//   eventIdList
// ) {
//   await Event.findOneAndUpdate(
//     { id: { $in: eventIdList } },
//     eventList,
//     {
//       upsert: true,
//       useFindAndModify: false
//     },
//     async (error, result) => {
//       if (error) {
//         // console.log(error);
//       }
//       if (!result) {
//         //find existed event id
//         const site = await Site.findOne({ id: pageId })
//           .select("events")
//           .populate("events");
//         let existedEventObjIdList = [];
//         let existedEventIdList = [];
//         site.events.forEach(existedEvent => {
//           existedEventObjIdList.push(
//             new mongoose.Types.ObjectId(existedEvent._id)
//           );
//           existedEventIdList.push(existedEvent.id);
//         });
//         //update existing event
//         let newEventList = await SiteSerivce.updateExistingEvent(
//           eventList,
//           existedEventIdList
//         );
//         //create new event and save new event into site
//         await SiteSerice.createAndSaveNewEvent(pageId, newEventList);
//       }
//     }
//   );
// }

export async function findExistedSitePath(sitepath) {
  return await Site.findOne({
    sitePath: sitepath.toLowerCase()
  });
}

export async function addCronJob({ pageId, autoSync, job }) {
  const { minute, hour, day, none } = autoSync;
  if (none) {
    cronJobs.forEach(cronJob => {
      if (cronJob.siteId === pageId) {
        exist = true;
        if (cronJob.job) {
          cronJob.job.stop();
        }
      }
    });
  } else {
    let cronjob = new CronJob(
      `* *${typeof minute === "number" && minute >= 0 && "/"}${typeof minute ===
        "number" &&
        minute >= 0 &&
        minute - 1} *${typeof hour === "number" &&
        hour >= 0 &&
        "/"}${typeof hour === "number" &&
        hour >= 0 &&
        hour - 1} *${typeof day === "number" && day > 0 && "/"}${typeof day ===
        "number" &&
        day > 0 &&
        day} * *`,
      function() {
        job();
      }
    );
    let exist = false;
    cronJobs.forEach(cronJob => {
      if (cronJob.siteId === pageId) {
        exist = true;
        if (cronJob.job) {
          cronJob.job.stop();
        }
        cronJob.job = cronjob;
      }
    });
    if (!exist) {
      cronJobs.push({
        siteId: pageId,
        job: cronjob
      });
    }
    cronjob.start();
  }
  return true;
}

export async function stopCronJob(siteId) {
  cronJobs.forEach(cronJob => {
    if (cronJob.siteId === siteId) {
      if (cronJob.job) {
        cronJob.job.stop();
      }
    }
  });
  return true;
}
