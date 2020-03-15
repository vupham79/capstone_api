import { Category, Event, mongoose, Post, Site, Theme, User } from "../models";
import { getPageData, getSyncData } from "../services/FacebookAPI";
import { findAllUser } from "../services/UserService";
import * as SiteService from "../services/SiteService";
import { findOneTheme } from "../services/ThemeService";

export async function findOneBySitepath(req, res) {
  try {
    const find = await SiteService.findSiteBySitepath(req.params.sitepath);
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
}

export async function findOneById(req, res) {
  try {
    const find = await SiteService.findOneSite(req.query.id);
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}

export async function findAllByUser(req, res) {
  try {
    const find = await SiteService.findAllSiteByUser(req.user.email);
    if (find) {
      return res.status(200).send(find);
    }
    return res.status(204).send();
  } catch (error) {
    return res.status(400).send({ error });
  }
}

export async function findAll(req, res) {
  try {
    const find = await findAllUser();
    if (find) {
      let siteList = [];
      find.forEach(user => {
        user.sites.forEach(site => {
          siteList.push({
            title: site.title,
            isPublish: site.isPublish,
            _id: site._id,
            theme: site.theme,
            categories: site.categories,
            sitePath: site.sitePath,
            phone: site.phone,
            id: site.id,
            displayName: user.displayName,
            picture: user.picture,
            email: user.email,
            isActivated: user.isActivated
          });
        });
      });
      return res.status(200).send(siteList);
    }
    return res.status(204).send();
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error });
  }
}

export async function publish(req, res) {
  const { id, isPublish } = req.body;
  try {
    const siteExist = await SiteService.checkSiteExist(id);
    if (siteExist) {
      const publish = await SiteService.publishSite(id, isPublish);
      if (publish) {
        return res.status(200).send(publish);
      }
      return res.status(400).send({ error: "Action failed!" });
    }
    return res.status(400).send({ error: "Can't find any result!" });
  } catch (error) {
    return res.status(400).send({ error });
  }
}

export async function saveDesign(req, res) {
  let {
    fontBody,
    fontTitle,
    navItems,
    pageId,
    theme,
    name,
    color,
    whatsapp,
    email,
    youtube,
    instagram,
    phone
  } = req.body;
  try {
    const findTheme = await findOneTheme(theme);
    if (findTheme) {
      //check null whatsapp, email
      if (!email || email === undefined || email.replace(/\s/g, "") === "") {
        email = null;
      }
      if (
        !instagram ||
        instagram === undefined ||
        instagram.replace(/\s/g, "") === ""
      ) {
        instagram = null;
      }
      if (
        !youtube ||
        youtube === undefined ||
        youtube.replace(/\s/g, "") === ""
      ) {
        youtube = null;
      }
      if (
        !whatsapp ||
        whatsapp === undefined ||
        whatsapp.replace(/\s/g, "") === ""
      ) {
        whatsapp = null;
      }
      const update = await SiteService.saveDesign({
        pageId,
        fontTitle,
        fontBody,
        name,
        color,
        navItems,
        findTheme,
        whatsapp,
        email,
        youtube,
        phone
      });
      if (update) {
        return res.status(200).send(update);
      }
      return res.status(400).send({ error: "Save failed!" });
    }
    return res.status(400).send({ error: "Theme not exist!" });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
}

export async function createNewSite(req, res) {
  try {
    let eventList = [];
    let galleryList = [];
    const postsList = [];
    let { pageUrl, pageId, sitepath, isPublish } = req.body;
    //site path is empty, undefined or null
    if (
      !sitepath ||
      sitepath === undefined ||
      sitepath.replace(/\s/g, "") === ""
    ) {
      return res.status(400).send({ error: "Sitepath must not be empty!" });
    }
    sitepath = sitepath.replace(/\s/g, "");
    //existed site path
    const isExistedSitePath = await Site.findOne({
      sitePath: sitepath.toLowerCase()
    });

    if (isExistedSitePath) {
      return res
        .status(400)
        .send({ error: "A website with this sitepath already existed!" });
    }
    //get page data
    const page = await getPageData({
      pageId: pageId,
      accessToken: req.user.accessToken
    }).catch(error => {
      return res.status(400).send({ error: "This facebook page not existed!" });
    });
    //default nav items
    const defaultNavItems = [
      {
        name: "Home",
        order: 1,
        isActive: true,
        original: "home"
      },
      {
        name: "About",
        order: 2,
        isActive: true,
        original: "about"
      },
      {
        name: "Gallery",
        order: 3,
        isActive: true,
        original: "gallery"
      },
      {
        name: "Event",
        order: 4,
        isActive: true,
        original: "event"
      },
      {
        name: "Contact",
        order: 5,
        isActive: true,
        original: "contact"
      },
      {
        name: "News",
        order: 6,
        isActive: true,
        original: "news"
      }
    ];
    //if fb api data existed
    if (page.data) {
      if (page.data.statusCode !== undefined) {
        return res
          .status(400)
          .send({ error: "Facebook page data not existed!" });
      }
      const siteExist = await Site.findOne({
        id: pageId
      });
      //if site not existed
      if (!siteExist) {
        let session;
        return Site.createCollection()
          .then(() => Site.startSession())
          .then(_session => {
            session = _session;
            session.withTransaction(async () => {
              let categoryInDB = [];
              const categoryList = await Category.find();
              categoryList.forEach(category => {
                categoryInDB.push(category.name);
              });
              let categoryObjIdList = [];
              page.data.category_list &&
                page.data.category_list.forEach(async category => {
                  if (!categoryInDB.includes(category.name)) {
                    await Category.create({
                      name: category.name
                    });
                  }
                  let find = await Category.findOne({
                    name: category.name
                  });
                  if (find) {
                    categoryObjIdList.push(
                      new mongoose.Types.ObjectId(find._id)
                    );
                  }
                });
              //find theme
              let theme = await Theme.findOne({
                categories: { $in: categoryObjIdList }
              });
              if (!theme) {
                theme = await Theme.findOne();
              }
              // insert site
              const insert = await SiteService.insertSite(pageId, {
                phone: page.data.phone,
                longitude: page.data.location
                  ? page.data.location.longitude
                  : null,
                latitude: page.data.location
                  ? page.data.location.latitude
                  : null,
                logo: page.logo
                  ? page.logo
                      .replace(/\&amp\;/g, "&")
                      .replace(/\&gt\;/g, ">")
                      .replace(/\&lt\;/g, "<")
                      .replace(/\&quot\;/g, "'")
                      .replace(/\&\#39\;/g, "'")
                  : null,
                fontTitle: theme && theme.fontTitle,
                fontBody: theme && theme.fontBody,
                color: theme && theme.mainColor,
                title: page.data.name,
                address: page.data.single_line_address,
                navItems: defaultNavItems,
                theme: new mongoose.Types.ObjectId(theme._id),
                cover: page.data.cover ? [page.data.cover.source] : null,
                url: pageUrl,
                isPublish: isPublish,
                sitePath: sitepath,
                about: page.data.about
              });
              //find user
              await User.findOne({ id: req.user.id })
                .select("sites")
                .then(async result => {
                  let siteList = result.sites;
                  siteList.push(insert._id);
                  await result.updateOne({
                    sites: siteList
                  });
                });
              if (insert) {
                //post list
                page.data.posts &&
                  page.data.posts.data.forEach(async post => {
                    if (
                      post.attachments &&
                      post.attachments.data[0].media_type === "album"
                    ) {
                      const subAttachmentList = [];
                      post.attachments.data[0].subattachments.data.forEach(
                        subAttachment => {
                          subAttachmentList.push(subAttachment.media.image.src);
                          galleryList.push({
                            url: subAttachment.media.image.src,
                            target: subAttachment.target.url
                          });
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
                      galleryList.push({
                        url: post.attachments.data[0].media.image.src,
                        target: post.attachments.data[0].target.url
                      });
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
                await Site.updateOne(
                  { id: pageId },
                  {
                    galleries: galleryList.length > 0 ? galleryList : null
                  }
                );
                //insert port and update site's posts
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
                //event list
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
                //return
                return res.status(200).send(insert);
              } else {
                return res.status(400).send({ error: "Insert site failed!" });
              }
            });
          });
      }
      return res.status(400).send({ error: "Site existed!" });
    }
    return res.status(400).send({ error: "Facebook page data not existed!" });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
}

export async function syncEvent(req, res) {
  try {
    let eventList = [];
    const { pageId } = req.body;
    const data = await getSyncEvent({
      pageId: pageId,
      accessToken: req.user.accessToken
    });
    if (data) {
      //event list
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
      const siteExist = await findOneSite(pageId);
      if (siteExist) {
        //event Id list
        let eventIdList = [];
        eventList.forEach(event => {
          eventIdList.push(event.id);
        });
        //insert and update event
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
              let newEventList = [];
              eventList.forEach(async event => {
                if (!existedEventIdList.includes(event.id)) {
                  newEventList.push(event);
                } else {
                  await Event.updateOne({ id: event.id }, event);
                }
              });
              //create new event and save new event into site
              await Event.create(newEventList, async (err, docs) => {
                if (err) {
                  console.log(err);
                }
                if (docs) {
                  //save new event
                  let newEventObjList = [];
                  docs.forEach(event => {
                    newEventObjList.push(
                      new mongoose.Types.ObjectId(event._id)
                    );
                  });
                  await Site.updateOne(
                    { id: pageId },
                    {
                      $push: {
                        events:
                          newEventObjList.length > 0 ? newEventObjList : null
                      }
                    }
                  );
                }
              });
            }
          }
        );

        if (siteExist) {
          return res.status(200).send(siteExist);
        } else {
          return res.status(400).send({ error: "Edit failed!" });
        }
      }
      return res.status(400).send({ error: "Site not existed!" });
    }
    return res.status(400).send({ error: "Facebook page event not existed!" });
  } catch (error) {
    return res.status(400).send({ error });
  }
}

export async function syncData(req, res) {
  try {
    let galleryList = [];
    let postsList = [];
    let eventList = [];
    const { pageId, lastSync } = req.body;
    const data = await getSyncData({
      pageId: pageId,
      accessToken: req.user.accessToken
    });
    if (data) {
      const siteExist = await SiteService.findOneSite(pageId);
      if (siteExist) {
        let session;
        return Site.createCollection()
          .then(() => Site.startSession())
          .then(_session => {
            session = _session;
            session.withTransaction(async () => {
              //update site
              const update = await SiteService.editSite(pageId, {
                phone: data.phone,
                longitude: data.location ? data.location.longitude : null,
                latitude: data.location ? data.location.latitude : null,
                address: data.single_line_address,
                cover: data.cover ? [data.cover.source] : null,
                categories: data.category_list,
                about: data.about,
                genre: data.genre,
                lastSync: lastSync
              });
              //post list
              data.posts &&
                data.posts.data.forEach(post => {
                  if (
                    post.attachments &&
                    post.attachments.data[0].media_type === "album"
                  ) {
                    const subAttachmentList = [];
                    post.attachments.data[0].subattachments.data.forEach(
                      subAttachment => {
                        subAttachmentList.push(subAttachment.media.image.src);
                        galleryList.push({
                          url: subAttachment.media.image.src,
                          target: subAttachment.target.url
                        });
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
                    galleryList.push({
                      url: post.attachments.data[0].media.image.src,
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
              //update galleries
              await Site.updateOne(
                { id: pageId },
                {
                  galleries: galleryList.length > 0 ? galleryList : null
                }
              );
              //post Id list
              let postIdList = [];
              postsList.forEach(post => {
                postIdList.push(post.id);
              });
              //insert and update post
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
                    let newPostList = [];
                    postsList.forEach(async post => {
                      if (!existedPostIdList.includes(post.id)) {
                        newPostList.push(post);
                      } else {
                        await Post.updateOne({ id: post.id }, post);
                      }
                    });
                    //create new post and save new post into site
                    await Post.create(newPostList, async (err, docs) => {
                      if (err) {
                        console.log(err);
                      }
                      if (docs) {
                        //save new post
                        let newPostObjIdList = [];
                        docs.forEach(post => {
                          newPostObjIdList.push(
                            new mongoose.Types.ObjectId(post._id)
                          );
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
                }
              );

              //event list
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
              //event Id list
              let eventIdList = [];
              eventList.forEach(event => {
                eventIdList.push(event.id);
              });
              //insert and update event
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
                    let newEventList = [];
                    eventList.forEach(async event => {
                      if (!existedEventIdList.includes(event.id)) {
                        newEventList.push(event);
                      } else {
                        await Event.updateOne({ id: event.id }, event);
                      }
                    });
                    //create new event and save new event into site
                    await Event.create(newEventList, async (err, docs) => {
                      if (err) {
                        console.log(err);
                      }
                      if (docs) {
                        //save new event
                        let newEventObjList = [];
                        docs.forEach(event => {
                          newEventObjList.push(
                            new mongoose.Types.ObjectId(event._id)
                          );
                        });
                        await Site.updateOne(
                          { id: pageId },
                          {
                            $push: {
                              events:
                                newEventObjList.length > 0
                                  ? newEventObjList
                                  : null
                            }
                          }
                        );
                      }
                    });
                  }
                }
              );
              if (update) {
                return res.status(200).send(update);
              } else {
                return res.status(400).send({ error: "Edit failed!" });
              }
            });
          });
      }
      return res.status(400).send({ error: "Site not existed!" });
    }
    return res.status(400).send({ error: "Facebook page data not existed!" });
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
}

export async function updateLogo(req, res) {
  const { logo, id } = req.body;
  try {
    const update = await SiteService.updateLogo(id, logo);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(400).send({ error: "Action failed!" });
  } catch (error) {
    return res.status(400).send({ error });
  }
}

export async function updateCover(req, res) {
  const { pageId, cover } = req.body;
  try {
    const update = await SiteService.updateCovers(pageId, cover);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(400).send({ error: "Save failed!" });
  } catch (error) {
    return res.status(400).send({ error });
  }
}
