import { mongoose, Site, User, Category, Post, Event } from "../models";

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
  console.log("id: " + id);
  const site = await Site.findOne({ id: id }).populate({
    path: "theme posts events"
  });
  console.log(site);
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
  return await Site.findOne({ sitePath: sitepath.toLowerCase() }).populate({
    path: "theme posts events"
  });
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
    const sitePathExisting = await Site.findOne({
      sitePath: data.sitePath
    });
    if (sitePathExisting) {
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
  await Site.updateOne(
    { id: pageId },
    {
      galleries: galleryList.length > 0 ? galleryList : null
    }
  );
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

export async function getFacebookPostData(page) {
  let postsList = [];
  if (page.data.posts === undefined) {
    return null;
  }
  page.data.posts &&
    page.data.posts.data &&
    page.data.posts.data.forEach(async post => {
      if (post.attachments && post.attachments.data[0].media_type === "album") {
        const subAttachmentList = [];
        post.attachments.data[0].subattachments.data.forEach(subAttachment => {
          subAttachmentList.push(subAttachment.media.image.src);
        });
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
    });
  return postsList;
}

export async function getFacebookGalleryData(data) {
  let galleryList = [];
  console.log(data);
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
  console.log("Gallery list: " + galleryList);
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

export async function getFacebookEventData(page) {
  let eventList = [];
  if (page.data.events === undefined) {
    return null;
  }
  page.data.events &&
    page.data.events.data &&
    page.data.events.data.forEach(event => {
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

export async function updateExistingPost(postsList, existedPostIdList) {
  let newPostList = [];
  postsList.forEach(async post => {
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
export async function findSiteEventTab(sitePath, skip = 0, limit = 10) {
  return await Site.find({ sitePath: sitePath })
    .populate("events", "select", null, null, { skip, limit })
    .select("events");
}

export async function findSiteHomeTab(sitePath, skip = 0, limit = 10) {
  return await Site.find({ sitePath }).populate("", "", null, null, {
    skip,
    limit
  });
}
export async function findSiteGalleryTab(sitePath, skip = 0, limit = 10) {
  return await Site.find({ sitePath }).populate("", "", null, null, {
    skip,
    limit
  });
}

export async function findSiteNewsTab(sitePath, skip = 0, limit = 10) {
  return await Site.find({ sitePath }).populate("", "", null, null, {
    skip,
    limit
  });
}

export async function findSiteContactTab(sitePath, skip = 0, limit = 10) {
  return await Site.find({ sitePath }).populate("", "", null, null, {
    skip,
    limit
  });
}

export async function findSiteAboutTab(sitePath, skip = 0, limit = 10) {
  return await Site.find({ sitePath }).populate("", "", null, null, {
    skip,
    limit
  });
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

export async function insertAndUpdateSyncDataPost(
  pageId,
  postsList,
  postIdList
) {
  await Post.findOneAndUpdate(
    { id: { $in: postIdList } },
    postsList,
    {
      upsert: true,
      useFindAndModify: false
    },
    async (error, result) => {
      if (error) {
        // console.log(error);
      }
      if (!result) {
        //find existed post id
        const site = await Site.findOne({ id: pageId })
          .select("posts")
          .populate("posts");
        let existedPostObjIdList = [];
        let existedPostIdList = [];
        site.posts &&
          site.posts.forEach(existedPost => {
            existedPostObjIdList.push(
              new mongoose.Types.ObjectId(existedPost._id)
            );
            existedPostIdList.push(existedPost.id);
          });
        //update existing post
        let newPostList = await updateExistingPost(
          postsList,
          existedPostIdList
        );
        //create new post and save new post into site
        await createAndSaveNewPost(pageId, newPostList);
      }
    }
  );
}

export async function insertAndUpdateSyncDataEvents(
  pageId,
  eventList,
  eventIdList
) {
  await Event.findOneAndUpdate(
    { id: { $in: eventIdList } },
    eventList,
    {
      upsert: true,
      useFindAndModify: false
    },
    async (error, result) => {
      if (error) {
        // console.log(error);
      }
      if (!result) {
        //find existed event id
        const site = await Site.findOne({ id: pageId })
          .select("events")
          .populate("events");
        let existedEventObjIdList = [];
        let existedEventIdList = [];
        site.events &&
          site.events.forEach(existedEvent => {
            existedEventObjIdList.push(
              new mongoose.Types.ObjectId(existedEvent._id)
            );
            existedEventIdList.push(existedEvent.id);
          });
        //update existing event
        let newEventList = await updateExistingEvent(
          eventList,
          existedEventIdList
        );
        //create new event and save new event into site
        await createAndSaveNewEvent(pageId, newEventList);
      }
    }
  );
}

export async function insertAndUpdateSyncEvents(
  pageId,
  eventList,
  eventIdList
) {
  await Event.findOneAndUpdate(
    { id: { $in: eventIdList } },
    eventList,
    {
      upsert: true,
      useFindAndModify: false
    },
    async (error, result) => {
      if (error) {
        // console.log(error);
      }
      if (!result) {
        //find existed event id
        const site = await Site.findOne({ id: pageId })
          .select("events")
          .populate("events");
        let existedEventObjIdList = [];
        let existedEventIdList = [];
        site.events.forEach(existedEvent => {
          existedEventObjIdList.push(
            new mongoose.Types.ObjectId(existedEvent._id)
          );
          existedEventIdList.push(existedEvent.id);
        });
        //update existing event
        let newEventList = await SiteSerivce.updateExistingEvent(
          eventList,
          existedEventIdList
        );
        //create new event and save new event into site
        await SiteSerice.createAndSaveNewEvent(pageId, newEventList);
      }
    }
  );
}

export async function insertAndUpdateSyncGallery(
  pageId,
  eventList,
  eventIdList
) {
  await Event.findOneAndUpdate(
    { id: { $in: eventIdList } },
    eventList,
    {
      upsert: true,
      useFindAndModify: false
    },
    async (error, result) => {
      if (error) {
        // console.log(error);
      }
      if (!result) {
        //find existed event id
        const site = await Site.findOne({ id: pageId })
          .select("events")
          .populate("events");
        let existedEventObjIdList = [];
        let existedEventIdList = [];
        site.events.forEach(existedEvent => {
          existedEventObjIdList.push(
            new mongoose.Types.ObjectId(existedEvent._id)
          );
          existedEventIdList.push(existedEvent.id);
        });
        //update existing event
        let newEventList = await SiteSerivce.updateExistingEvent(
          eventList,
          existedEventIdList
        );
        //create new event and save new event into site
        await SiteSerice.createAndSaveNewEvent(pageId, newEventList);
      }
    }
  );
}
