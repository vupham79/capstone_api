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
    phone,
    sitePath
  } = req.body;
  try {
    navItems &&
      navItems.length > 0 &&
      navItems.forEach(navItem => {
        if (
          !navItem ||
          !navItem.name ||
          navItem.name === undefined ||
          navItem.name.replace(/\s/g, "") === ""
        ) {
          return res
            .status(400)
            .send({ error: "Navigation item must not be empty!" });
        }
      });
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
        instagram,
        phone,
        sitePath
      });
      if (update) {
        return res.status(200).send(update);
      } else if (update.msg) {
        return res.status(400).send({ error: update.msg });
      }
    }
    return res.status(400).send({ error: "Theme not exist!" });
  } catch (error) {
    return res.status(400).send(error);
  }
}

export async function createNewSite(req, res) {
  try {
    let eventList = [];
    let galleryList = [];
    let postsList = [];
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
              categoryObjIdList = await SiteService.getFacebookCategoryObjIdData(
                categoryInDB,
                page.data.category_list && page.data.category_list
              );
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
              await SiteService.updateSiteList(req.user.id, insert);
              if (insert) {
                //post list
                postsList = await SiteService.getFacebookPostData(page);
                //gallery list
                galleryList = await SiteService.getFacebookGalleryData(page);
                await SiteService.updateGallery(pageId, galleryList);
                //insert port and update site's posts
                await SiteService.insertAndUpdatePosts(pageId, postsList);
                //event list
                eventList = await SiteService.getFacebookEventData(page);
                await SiteService.insertAndUpdateEvents(pageId, eventList);
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
      eventList = await SiteService.getFacebookEventData(data);
      const siteExist = await findOneSite(pageId);
      if (siteExist) {
        //event Id list
        let eventIdList = [];
        eventList.forEach(event => {
          eventIdList.push(event.id);
        });
        //insert and update event
        await SiteService.insertAndUpdateSyncDataEvents(
          pageId,
          eventList,
          eventIdList
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
              postsList = await SiteService.getFacebookPostSyncData(
                data,
                galleryList
              );
              //update galleries
              await Site.updateOne(
                { id: pageId },
                {
                  galleries: galleryList.length > 0 ? galleryList : null
                }
              );
              //post Id list
              let postIdList = [];
              if (postsList) {
                postsList.forEach(post => {
                  postIdList.push(post.id);
                });
                //insert and update post
                await SiteService.insertAndUpdateSyncDataPost(
                  pageId,
                  postsList,
                  postIdList
                );
              }

              //event list
              eventList = await SiteService.getFacebookEventSyncData(data);
              //event Id list
              let eventIdList = [];
              if (eventList) {
                eventList.forEach(event => {
                  eventIdList.push(event.id);
                });
                //insert and update event
                await SiteService.insertAndUpdateSyncDataEvents(
                  pageId,
                  eventList,
                  eventIdList
                );
              }

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

export async function updateFavicon(req, res) {
  const { favicon, id } = req.body;
  try {
    const update = await SiteService.updateFavicon(id, favicon);
    if (update) {
      return res.status(200).send(update);
    }
    return res.status(400).send({ error: "Action failed!" });
  } catch (error) {
    return res.status(400).send({ error });
  }
}

export async function findSiteDataByTab(req, res) {
  const { tab, sitePath, skip, limit } = req.params;
  try {
    if (tab === "home") {
      const home = await SiteService.findSiteHomeTab(sitePath, skip, limit);
      return home;
    } else if (tab === "event") {
      const events = await SiteService.findSiteEventTab(sitePath, skip, limit);
      return events;
    } else if (tab === "gallery") {
      const gallery = await SiteService.findSiteGalleryTab(
        sitePath,
        skip,
        limit
      );
      return gallery;
    } else if (tab === "news") {
      const news = await SiteService.findSiteNewsTab(sitePath, skip, limit);
      return news;
    } else if (tab === "contact") {
      const contact = await SiteService.findSiteContactTab(
        sitePath,
        skip,
        limit
      );
      return contact;
    } else if (tab === "about") {
      const about = await SiteService.findSiteAboutTab(sitePath, skip, limit);
      return about;
    }
  } catch (error) {
    return res.status(400).send({ error });
  }
}
