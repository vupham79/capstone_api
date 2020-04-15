import {
  mongoose,
  Site,
  User,
  Category,
  Post,
  Event,
  SyncRecord,
} from "../models";
import moment from "moment";
import { CronJob } from "cron";

const cronJobs = [];
const defaultLimitNews = 9;
const defaultLimitEvent = 3;
const defaultLimitGallery = 9;

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
    homepage: body.homepage,
    story: body.story,
  });
  return insert;
}

export async function editSite(id, body) {
  const site = await Site.findOne({ id: id });
  site.phone = body.phone;
  site.longitude = body.longitude;
  site.latitude = body.latitude;
  site.address = body.address;
  site.categories = body.categories;
  site.about = body.about;
  site.syncRecords = body.syncRecords;
  site.showStory = body.showStory;
  // site.syncRecords = [...site.syncRecords, body.syncRecord];
  return await site.save();
}

export async function deleteSite(id) {
  const SiteResult = await Site.findOne({ id: id });
  await SiteResult.updateOne({
    isPublish: false,
  });
  return SiteResult;
}

export async function findAllSite() {
  return await Site.find().populate({
    path: "theme posts events",
    populate: {
      path: "events.place",
    },
  });
}

export async function findOneSiteByAccessToken(id, body) {
  return await Site.findOne({
    id: id,
  }).populate({
    path: "theme posts events",
  });
}

export async function findOneSite(id) {
  const site = await Site.findOne({ id: id })
    .populate({
      path: "theme posts",
    })
    .populate({
      path: "events",
      // match: { isActive: true },
      options: {
        sort: { startTime: -1 },
      },
    })
    .populate({
      path: "syncRecords",
      options: {
        sort: { createdAt: -1 },
      },
    });
  return site;
}

export function addSyncRecord(record, siteExist) {
  let syncRecordList = [];
  siteExist &&
    siteExist.syncRecords &&
    siteExist.syncRecords.forEach((record) => {
      syncRecordList.push(new mongoose.Types.ObjectId(record));
    });
  syncRecordList.push(new mongoose.Types.ObjectId(record._id));
  return syncRecordList;
}

export async function findAllSiteByUser(email) {
  const sites = await User.findOne({
    email: email,
  })
    .select("sites")
    .populate({
      path: "sites",
      select: "id title isPublish logo categories sitePath",
    });
  if (sites) {
    return sites;
  }
  return false;
}

export async function findSiteBySitepath(sitepath) {
  return await Site.findOne({ sitePath: sitepath.toLowerCase() })
    .select(
      "id phone longitude latitude color " +
        "logo fontTitle fontBody title address " +
        "navItems isPublish cover categories url " +
        "sitePath about whatsapp instagram email " +
        "youtube theme homepage showDetailSetting" +
        " story limitNews limitGallery limitEvent"
    )
    .populate("theme");
}

export async function checkSiteExist(id) {
  return await User.find({ "sites.id": id });
}

export async function publishSite(id, isPublish) {
  return await Site.updateOne(
    {
      id,
    },
    {
      isPublish,
    }
  );
}

export async function saveDesign(data) {
  const site = await Site.findOne({
    id: data.pageId,
  });
  if (site) {
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
    site.address = data.address;
    site.about = data.about;
    site.limitNews = data.limitNews;
    site.limitGallery = data.limitGallery;
    site.limitEvent = data.limitEvent;
    site.showDetailSetting.showDesEvent = data.showDesEvent;
    site.showDetailSetting.showPlaceEvent = data.showPlaceEvent;
    site.showDetailSetting.showCoverEvent = data.showCoverEvent;
    site.showDetailSetting.showStory = data.showStory;
    site.showDetailSetting.showMessenger = data.showMessenger;
    site.showDetailSetting.showPostMessage = data.showPostMessage;
    site.showDetailSetting.showAlbumNumber = data.showAlbumNumber;
    site.showDetailSetting.showPostPreviewImage = data.showPostPreviewImage;
    site.showDetailSetting.showPostCreatedTime = data.showPostCreatedTime;
    site.showDetailSetting.showSuggestLatestNews = data.showSuggestLatestNews;
    site.showDetailSetting.showGoogleMaps = data.showGoogleMaps;
    site.showDetailSetting.showAboutDescription = data.showAboutDescription;
    site.showDetailSetting.showAboutLogo = data.showAboutLogo;
    site.showDetailSetting.showMessageUs = data.showMessageUs;
    site.showDetailSetting.showPostMode = data.showPostMode;
    site.longitude = data.longitude;
    site.latitude = data.latitude;
    if (data.logoURL) {
      site.logo = data.logoURL;
    }
    if (data.coverURL) {
      site.cover = data.coverURL;
    }
    site.sitePath = data.sitePath;
    if (data.homepage) {
      site.homepage = data.homepage;
    }
    if (site.sitePath !== data.sitePath.trim()) {
      const sitePathExisting = await Site.findOne({
        sitePath: data.sitePath.trim(),
      });

      if (!sitePathExisting) {
        return await site.save();
      } else {
        return { msg: "Design saved but not sitepath because existed!" };
      }
    } else {
      return await site.save();
    }
  } else {
    return { msg: "Site not existed!" };
  }
}

export async function updateLogo(id, logo) {
  return await Site.updateOne(
    {
      id,
    },
    {
      logo,
    }
  );
}

export async function updateFavicon(id, favicon) {
  return await Site.updateOne(
    {
      id,
    },
    {
      favicon,
    }
  );
}

export async function updateCovers(pageId, cover) {
  return await Site.updateOne(
    {
      id: pageId,
    },
    {
      cover: cover ? cover : null,
    }
  );
}

export async function insertAndUpdatePosts(pageId, postsList) {
  const currentPostList = await Post.find();

  let insertPostList = postsList ? postsList : [];
  let updatePostList = postsList ? postsList : [];
  let existedPostIdList = [];
  let postObjIdList = [];
  postsList &&
    postsList.forEach((post) => {
      existedPostIdList.push(post.id);
    });

  currentPostList &&
    currentPostList.forEach((currentPost) => {
      if (existedPostIdList.includes(currentPost.id)) {
        insertPostList = insertPostList.filter(
          (post) => post.id !== currentPost.id
        );
        postObjIdList.push(currentPost._id);
      } else {
        updatePostList = updatePostList.filter(
          (post) => post.id !== currentPost.id
        );
      }
    });

  updatePostList.forEach(async (updatePost) => {
    await Post.updateOne({ id: updatePost.id }, updatePost);
  });

  await Site.updateOne(
    { id: pageId },
    {
      posts: postObjIdList.length > 0 ? postObjIdList : null,
    }
  );

  await Post.insertMany(
    insertPostList,
    { upsert: true },
    async (error, docs) => {
      if (error) {
        return error;
      } else {
        docs.forEach((doc) => {
          postObjIdList.push(doc._id);
        });
        await Site.updateOne(
          { id: pageId },
          {
            posts: postObjIdList.length > 0 ? postObjIdList : null,
          }
        );
      }
    }
  );
}

export async function updateGallery(pageId, galleryList) {
  if (!galleryList) {
    await Site.updateOne(
      { id: pageId },
      {
        galleries: null,
      }
    );
  } else {
    await Site.updateOne(
      { id: pageId },
      {
        galleries: galleryList.length > 0 ? galleryList : null,
      }
    );
  }
}

export async function insertAndUpdateEvents(pageId, eventList) {
  const currentEventList = await Event.find();

  let insertEventList = eventList ? eventList : [];
  let updateEventList = eventList ? eventList : [];
  let existedEventIdList = [];
  let eventObjIdList = [];
  eventList &&
    eventList.forEach((event) => {
      existedEventIdList.push(event.id);
    });

  currentEventList &&
    currentEventList.forEach((currentEvent) => {
      if (existedEventIdList.includes(currentEvent.id)) {
        insertEventList = insertEventList.filter(
          (event) => event.id !== currentEvent.id
        );
        eventObjIdList.push(currentEvent._id);
      } else {
        updateEventList = updateEventList.filter(
          (event) => event.id !== currentEvent.id
        );
      }
    });

  updateEventList.forEach(async (updateEvent) => {
    await Event.updateOne({ id: updateEvent.id }, updateEvent);
  });

  await Site.updateOne(
    { id: pageId },
    {
      events: eventObjIdList.length > 0 ? eventObjIdList : null,
    }
  );

  await Event.insertMany(insertEventList, async (error, docs) => {
    if (error) {
      return error;
    } else {
      docs.forEach((doc) => {
        eventObjIdList.push(doc._id);
      });
      await Site.updateOne(
        { id: pageId },
        {
          events: eventObjIdList.length > 0 ? eventObjIdList : null,
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
  let dateFromTime = dateFrom;
  if (dateFrom === undefined) {
    dateFromTime = null;
  }
  let dateToTime = dateTo;
  if (dateTo === undefined) {
    dateToTime = null;
  }
  if (moment(dateFromTime).isValid() && moment(dateFromTime).isValid()) {
    data.posts &&
      data.posts.data &&
      data.posts.data.forEach(async (post) => {
        if (moment(post.created_time).isBetween(dateFrom, dateTo)) {
          if (!post.attachments || post.attachments === undefined) {
            console.log("No attachments: ", post.message);
            if(!post.message || post.message === undefined || post.message.replace(/\s/g, "") === "") {
            } else {
              postsList.push({
                id: post.id,
                title: null,
                message: post.message,
                isActive: true,
                createdTime: post.created_time,
                attachments: null,
                target: null,
              });
            }
          } else if (
            post.attachments &&
            post.attachments.data[0].media_type === "album"
          ) {
            const subAttachmentList = [];
            post.attachments.data[0].subattachments.data.forEach(
              (subAttachment) => {
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
                video: null,
              },
              target: post.attachments.data[0].target.url,
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
                video: null,
              },
              target: post.attachments.data[0].target.url,
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
                video: post.attachments.data[0].media.source,
              },
              target: post.attachments.data[0].target.url,
            });
          }
        }
      });
  } else {
    data.posts &&
      data.posts.data &&
      data.posts.data.forEach(async (post) => {
        if (!post.attachments || post.attachments === undefined) {
          console.log("No attachments: ", post.message);
          if(!post.message || post.message === undefined || post.message.replace(/\s/g, "") === "") {
          } else {
            postsList.push({
              id: post.id,
              title: null,
              message: post.message,
              isActive: true,
              createdTime: post.created_time,
              attachments: null,
              target: null,
            });
          }
        } else if (
          post.attachments &&
          post.attachments.data[0].media_type === "album"
        ) {
          const subAttachmentList = [];
          post.attachments.data[0].subattachments.data.forEach(
            (subAttachment) => {
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
              video: null,
            },
            target: post.attachments.data[0].target.url,
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
              video: null,
            },
            target: post.attachments.data[0].target.url,
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
              video: post.attachments.data[0].media.source,
            },
            target: post.attachments.data[0].target.url,
          });
        }
      });
  }
  return postsList;
}

export async function getFacebookGalleryData(data, dateFrom, dateTo) {
  let galleryList = [];
  if (data.posts === undefined) {
    return null;
  }

  let dateFromTime = dateFrom;
  if (dateFrom === undefined) {
    dateFromTime = null;
  }
  let dateToTime = dateTo;
  if (dateTo === undefined) {
    dateToTime = null;
  }
  if (moment(dateFromTime).isValid() && moment(dateFromTime).isValid()) {
    data.posts &&
      data.posts.data &&
      data.posts.data.forEach(async (post) => {
        if (moment(post.created_time).isBetween(dateFrom, dateTo)) {
          console.log(post.created_time);
          if (
            post.attachments &&
            post.attachments.data[0].media_type === "album"
          ) {
            post.attachments.data[0].subattachments.data.forEach(
              (subAttachment) => {
                galleryList.push({
                  url: subAttachment.media.image.src,
                  target: subAttachment.target.url,
                  createdTime: post.created_time,
                });
              }
            );
          } else if (
            post.attachments &&
            post.attachments.data[0].media_type === "photo"
          ) {
            galleryList.push({
              url: post.attachments.data[0].media.image.src,
              target: post.attachments.data[0].target.url,
              createdTime: post.created_time,
            });
          }
        }
      });
  } else {
    data.posts &&
      data.posts.data &&
      data.posts.data.forEach(async (post) => {
        if (
          post.attachments &&
          post.attachments.data[0].media_type === "album"
        ) {
          post.attachments.data[0].subattachments.data.forEach(
            (subAttachment) => {
              galleryList.push({
                url: subAttachment.media.image.src,
                target: subAttachment.target.url,
                createdTime: post.created_time,
              });
            }
          );
        } else if (
          post.attachments &&
          post.attachments.data[0].media_type === "photo"
        ) {
          galleryList.push({
            url: post.attachments.data[0].media.image.src,
            target: post.attachments.data[0].target.url,
            createdTime: post.created_time,
          });
        }
      });
  }
  return galleryList;
}

export async function getFacebookPostSyncData(data) {
  if (data.posts === undefined) {
    return null;
  }
  let postsList = [];
  data.posts &&
    data.posts.data.forEach((post) => {
      if (!post.attachments || post.attachments === undefined) {
        postsList.push({
          id: post.id,
          title: null,
          message: post.message,
          isActive: true,
          createdTime: post.created_time,
          attachments: null,
          target: null,
        });
      } else if (
        post.attachments &&
        post.attachments.data[0].media_type === "album"
      ) {
        const subAttachmentList = [];
        post.attachments.data[0].subattachments.data.forEach(
          (subAttachment) => {
            subAttachmentList.push(subAttachment.media.image.src);
          }
        );
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
            video: null,
          },
          target: post.attachments.data[0].target.url,
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
            video: null,
          },
          target: post.attachments.data[0].target.url,
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
            video: post.attachments.data[0].media.source,
          },
          target: post.attachments.data[0].target.url,
        });
      }
    });
  return postsList;
}

export async function getFacebookEventData(data, dateFrom, dateTo) {
  let eventList = [];
  if (data.events === undefined) {
    return null;
  }

  let dateFromTime = dateFrom;
  if (dateFrom === undefined) {
    dateFromTime = null;
  }
  let dateToTime = dateTo;
  if (dateTo === undefined) {
    dateToTime = null;
  }
  console.log(data.events.data.length);
  if (moment(dateFromTime).isValid() && moment(dateFromTime).isValid()) {
    data.events &&
      data.events.data &&
      data.events.data.forEach((event) => {
        console.log("Event start time: " + event.start_time);
        if (moment(event.start_time).isBetween(dateFrom, dateTo)) {
          console.log("Matching start time: " + event.start_time);
          //set place
          let place = {
            name: null,
            street: null,
            city: null,
            country: null,
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
            url: "facebook.com/" + event.id,
            isActive: true,
          });
        }
      });
  } else {
    data.events &&
      data.events.data &&
      data.events.data.forEach((event) => {
        //set place
        let place = {
          name: null,
          street: null,
          city: null,
          country: null,
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
          url: "facebook.com/" + event.id,
          isActive: true,
        });
      });
  }

  return eventList;
}

export async function getFacebookEventSyncData(data) {
  if (data.events === undefined) {
    return null;
  }
  let eventList = [];
  data.events &&
    data.events.data &&
    data.events.data.forEach((event) => {
      //set place
      let place = {
        name: null,
        street: null,
        city: null,
        country: null,
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
        url: "facebook.com/" + event.id,
        isActive: true,
      });
    });
  return eventList;
}

export async function getFacebookCategoryObjIdData(categoryInDB, categories) {
  let categoryObjIdList = [];
  categories.forEach(async (category) => {
    if (!categoryInDB.includes(category.name)) {
      await Category.create({
        name: category.name,
      });
    }
    let find = await Category.findOne({
      name: category.name,
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
    .then(async (result) => {
      let siteList = result.sites;
      siteList.push(insert._id);
      await result.updateOne({
        sites: siteList,
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
      docs.forEach((post) => {
        newPostObjIdList.push(new mongoose.Types.ObjectId(post._id));
      });
      if (newPostObjIdList.length > 0) {
        await Site.updateOne(
          { id: pageId },
          {
            posts: newPostObjIdList,
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
      docs.forEach((event) => {
        newEventObjList.push(new mongoose.Types.ObjectId(event._id));
      });
      await Site.updateOne(
        { id: pageId },
        {
          $push: {
            events: newEventObjList.length > 0 ? newEventObjList : null,
          },
        }
      );
    }
  });
}

export async function updateExistingPost(existedPostList, existedPostIdList) {
  let newPostList = [];
  existedPostList.forEach(async (post) => {
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
  eventList.forEach(async (event) => {
    if (!existedEventIdList.includes(event.id)) {
      newEventList.push(event);
    } else {
      await Event.updateOne({ id: event.id }, event);
    }
  });
  return newEventList;
}

export async function findSiteEventTab(id, sitePath, pageNumber = 1) {
  let counter = 0;
  if (sitePath) {
    const total = await Site.findOne({ sitePath }, "events").select(
      "events limitEvent"
    );
    await total.events.map(() => {
      counter++;
    });
    const limitEvent = total.limitEvent;
    const events = await Site.findOne({ sitePath })
      .select("events")
      .populate({
        path: "events",
        // match: { isActive: true },
        options: {
          limit: limitEvent,
          skip: (pageNumber - 1) * limitEvent,
          sort: { startTime: -1 },
        },
      });
    return {
      pageCount: Math.ceil(counter / limitEvent),
      data: events,
    };
  } else {
    const total = await Site.findOne({ id }, "events").select(
      "events limitEvent"
    );
    if (total && total.events) {
      await total.events.map(() => {
        counter++;
      });
    }
    const limitEvent = total.limitEvent;
    const events = await Site.findOne({ id })
      .select("events")
      .populate({
        path: "events",
        // match: { isActive: true },
        options: {
          limit: limitEvent,
          skip: (pageNumber - 1) * limitEvent,
          sort: { startTime: -1 },
        },
      });
    return {
      pageCount: Math.ceil(counter / limitEvent),
      data: events,
    };
  }
}

function findDataBySection(sitePath) {
  return new Promise(async (resolve, reject) => {
    const site = await Site.findOne({ sitePath });
    const sections = site.homepage;
    for (const section of sections) {
      if (section.isActive) {
        if (section.original === "event") {
          if (section.filter.type === "manual") {
            if (section.filter.items) {
              for (const _id of section.filter.items) {
                let event = await Event.findOne({ _id });
                if (event) {
                  let index = section.filter.items.findIndex(
                    (item) => item === _id
                  );
                  section.filter.items[index] = event;
                }
              }
            }
          } else {
            const events = await Site.find({ sitePath })
              .select("events")
              .populate({
                path: "events",
                // match: { isActive: true },
                options: {
                  limit: defaultLimitEvent,
                  sort: { startTime: -1 },
                },
              });
            section.filter.items = [];
            for (let index = 0; index < events[0].events.length; index++) {
              const element = events[0].events[index];
              section.filter.items[index] = element;
            }
          }
        } else if (section.original === "gallery") {
          if (section.filter.type === "manual") {
            let gallery = await Site.findOne({ sitePath }).select("galleries");
            gallery.galleries.forEach((image) => {
              if (section.filter.items.includes(image._id)) {
                const index = section.filter.items.findIndex((item) => {
                  return item === image.id;
                });
                section.filter.items[index] = image;
              }
            });
          } else {
            const galleries = await Site.aggregate([
              { $match: { sitePath: sitePath } },
              { $unwind: "$galleries" },
              {
                $group: {
                  _id: "$galleries",
                },
              },
              { $sort: { _id: -1 } },
              { $limit: defaultLimitGallery },
            ]);
            section.filter.items = [];
            for (let index = 0; index < galleries.length; index++) {
              const element = galleries[index]._id;
              section.filter.items[index] = element;
            }
            section.filter.items = galleries;
          }
        } else if (section.original === "news") {
          if (section.filter.type === "manual") {
            if (section.filter.items) {
              for (const _id of section.filter.items) {
                let post = await Post.findOne({ _id });
                if (post) {
                  let index = section.filter.items.findIndex((item) => {
                    return item === _id;
                  });
                  section.filter.items[index] = post;
                }
              }
            }
          } else {
            const posts = await Site.find({ sitePath })
              .select("posts")
              .populate({
                path: "posts",
                match: { isActive: true },
                options: { limit: defaultLimitNews, sort: { createdTime: -1 } },
              });
            section.filter.items = [];
            for (let index = 0; index < posts[0].posts.length; index++) {
              const element = posts[0].posts[index];
              section.filter.items[index] = element;
            }
          }
        }
      }
    }
    resolve(sections);
  });
}
export async function findSiteHomeTab(id, sitePath) {
  return await findDataBySection(sitePath);
}

export async function findSiteGalleryTab(id, sitePath, pageNumber = 1) {
  let counter = 0;
  if (sitePath) {
    const total = await Site.findOne({ sitePath }, "galleries").select(
      "galleries limitGallery"
    );
    await total.galleries.map(() => {
      counter++;
    });
    const limitGallery = total.limitGallery;
    const galleries = await Site.aggregate([
      { $match: { sitePath: sitePath } },
      { $unwind: "$galleries" },
      {
        $group: {
          _id: "$galleries",
        },
      },
      { $sort: { _id: -1 } },
      { $skip: (pageNumber - 1) * limitGallery },
      { $limit: limitGallery },
    ]);
    return {
      pageCount: Math.ceil(counter / limitGallery),
      data: galleries,
    };
  } else {
    const total = await Site.findOne({ id }, "galleries").select(
      "galleries limitGallery"
    );
    if (total && total.galleries) {
      await total.galleries.map(() => {
        counter++;
      });
    }
    const galleries = await Site.aggregate([
      { $match: { id: id } },
      { $unwind: "$galleries" },
      {
        $group: {
          _id: "$galleries",
        },
      },
      { $sort: { _id: -1 } },
      { $skip: (pageNumber - 1) * limitGallery },
      { $limit: limitGallery },
    ]);
    return {
      pageCount: Math.ceil(counter / limitGallery),
      data: galleries,
    };
  }
}

export async function findSiteNewsTab(id, sitePath, pageNumber = 1) {
  let counter = 0;
  if (sitePath) {
    const total = await Site.findOne({ sitePath })
      .populate({
        path: "posts",
        match: { isActive: true },
      })
      .select("posts limitNews");
    await total.posts.map(() => {
      counter++;
    });
    const limitNews = total.limitNews;
    const posts = await Site.findOne({ sitePath })
      .select("posts")
      .populate({
        path: "posts",
        match: { isActive: true },
        options: {
          limit: limitNews,
          skip: (pageNumber - 1) * limitNews,
          sort: { createdTime: -1 },
        },
      });
    return {
      pageCount: Math.ceil(counter / limitNews),
      data: posts,
    };
  } else {
    const total = await Site.findOne({ id })
      .populate({
        path: "posts",
        match: { isActive: true },
      })
      .select("posts limitNews");
    await total.posts.map(() => {
      counter++;
    });
    const limitNews = total.limitNews;
    const posts = await Site.findOne({ id })
      .select("posts")
      .populate({
        path: "posts",
        match: { isActive: true },
        options: {
          limit: limitNews,
          skip: (pageNumber - 1) * limitNews,
          sort: { createdTime: -1 },
        },
      });
    return {
      pageCount: Math.ceil(counter / limitNews),
      data: posts,
    };
  }
}

export async function findExistedEventObjIdList(pageId) {
  const site = await Site.findOne({ id: pageId })
    .select("events")
    .populate("events");
  let existedEventObjIdList = [];
  site.events.forEach((existedEvent) => {
    existedEventObjIdList.push(new mongoose.Types.ObjectId(existedEvent._id));
  });
  return existedEventObjIdList;
}

export async function findExistedEventIdList(pageId) {
  const site = await Site.findOne({ id: pageId })
    .select("events")
    .populate("events");
  let existedEventIdList = [];
  site.events.forEach((existedEvent) => {
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
  site.events.forEach((existedEvent) => {
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
  console.log(postsList.length);
  postsList &&
    postsList.forEach((post) => {
      fbPostIdList.push(post.id);
    });
  console.log("Fb Post Id List length: ", fbPostIdList.length);
  console.log("Post List length: ", postsList.length);
  site.posts &&
    site.posts.forEach(async (existedPost) => {
      if (fbPostIdList.includes(existedPost.id)) {
        console.log("Existed Post: ", existedPost.id);
        existedPostIdList.push(existedPost.id);
      } else {
        console.log("Deactive Post: ", existedPost.id);
        await Post.updateOne({ id: existedPost.id }, { isActive: false });
      }
    });

  postsList &&
    postsList.forEach(async (post) => {
      if (!existedPostIdList.includes(post.id)) {
        const existedPost = await Post.findOne({ id: post.id });
        if (existedPost) {
          await Post.updateOne({ id: post.id }, post);
          const postResult = await Post.findOne({ id: post.id });
          existedPostObjIdList.push(
            new mongoose.Types.ObjectId(postResult._id)
          );
          await Site.updateOne({ id: pageId }, { posts: existedPostObjIdList });
        } else {
          const postResult = await Post.create(post);
          existedPostObjIdList.push(
            new mongoose.Types.ObjectId(postResult._id)
          );
          await Site.updateOne({ id: pageId }, { posts: existedPostObjIdList });
        }
      } else {
        await Post.updateOne({ id: post.id }, post);
        const postResult = await Post.findOne({ id: post.id });
        existedPostObjIdList.push(new mongoose.Types.ObjectId(postResult._id));
        await Site.updateOne({ id: pageId }, { posts: existedPostObjIdList });
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
    eventList.forEach((event) => {
      fbEventIdList.push(event.id);
    });
  site.events &&
    site.events.forEach(async (existedEvent) => {
      if (fbEventIdList.includes(existedEvent.id)) {
        console.log("Existed Event: ", existedEvent.id);
        existedEventIdList.push(existedEvent.id);
      } else {
        console.log("Deactive Event: ", existedEvent.id);
        await Event.updateOne({ id: existedEvent.id }, { isActive: false });
      }
    });
  console.log("Fb Event Id List length: ", fbEventIdList.length);
  console.log("Event List length: ", eventList.length);
  if (eventList) {
    eventList.forEach(async (event) => {
      if (!existedEventIdList.includes(event.id)) {
        const existedEvent = await Event.findOne({ id: event.id });
        if (existedEvent) {
          await Event.updateOne({ id: event.id }, event);
          const eventResult = await Event.findOne({ id: event.id });
          existedEventObjIdList.push(
            new mongoose.Types.ObjectId(eventResult._id)
          );
          const result = await Site.updateOne(
            { id: pageId },
            {
              events: existedEventObjIdList,
            }
          );
        } else {
          const eventResult = await Event.create(event);
          existedEventObjIdList.push(
            new mongoose.Types.ObjectId(eventResult._id)
          );
          const result = await Site.updateOne(
            { id: pageId },
            { events: existedEventObjIdList }
          );
        }
      } else {
        await Event.updateOne({ id: event.id }, event);
        const eventResult = await Event.findOne({ id: event.id });
        existedEventObjIdList.push(
          new mongoose.Types.ObjectId(eventResult._id)
        );
        const result = await Site.updateOne(
          { id: pageId },
          { events: existedEventObjIdList }
        );
      }
    });
  }
}

export async function findExistedSitePath(sitepath) {
  return await Site.findOne({
    sitePath: sitepath.toLowerCase(),
  });
}

export async function addCronJob({ pageId, autoSync, job }) {
  const { minute, hour, day, dataType } = autoSync;
  if (dataType === "none") {
    cronJobs.forEach((cronJob) => {
      if (cronJob.siteId === pageId) {
        if (cronJob.job) {
          cronJob.job.stop();
        }
      }
    });
  } else {
    let convertMinute = "";
    let convertHour = "";
    let convertDay = "";
    if (minute && typeof minute === "number" && minute >= 0) {
      convertMinute = `/${minute}`;
    }
    if (hour && typeof hour === "number" && hour >= 0) {
      convertHour = `/${hour}`;
    }
    if (day && typeof day === "number" && day > 0) {
      convertDay = `/${day}`;
    }
    let cronjob = new CronJob(
      `*${convertMinute} *${convertHour} *${convertDay} * *`,
      function () {
        job();
      }
    );
    let exist = false;
    cronJobs.forEach((cronJob) => {
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
        job: cronjob,
      });
    }
    cronjob.start();
  }
  return true;
}

export async function updateAutoSync(id, autoSync) {
  return await Site.updateOne(
    {
      id,
    },
    {
      autoSync,
    }
  );
}
