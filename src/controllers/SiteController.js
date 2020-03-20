import { mongoose, Site, Theme } from "../models";
import {
  getPageData,
  getSyncData,
  getSyncEvent,
  getSyncGallery,
  getSyncPost
} from "../services/FacebookAPI";
import * as SiteService from "../services/SiteService";
import { findOneTheme } from "../services/ThemeService";
import { findAllUser } from "../services/UserService";

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
      return res.status(200).send(update);
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
              //find theme
              let theme = await Theme.findOne();
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
                postsList = await SiteService.getFacebookPostData(page.data);
                //gallery list
                galleryList = await SiteService.getFacebookGalleryData(
                  page.data
                );
                await SiteService.updateGallery(pageId, galleryList);
                //insert port and update site's posts
                if (postsList && postsList.length > 0) {
                  await SiteService.insertAndUpdatePosts(pageId, postsList);
                }
                //event list
                eventList = await SiteService.getFacebookEventData(page.data);
                if (eventList && eventList.length > 0) {
                  await SiteService.insertAndUpdateEvents(pageId, eventList);
                }
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

export async function syncPost(req, res) {
  try {
    let postsList = [];
    const { pageId, dateFrom, dateTo } = req.body;
    const data = await getSyncPost({
      pageId: pageId,
      accessToken: req.user.accessToken
    });
    if (data) {
      //post list
      postsList = await SiteService.getFacebookPostData(data, dateFrom, dateTo);
      const siteExist = await SiteService.findOneSite(pageId);
      //post Id list
      let postIdList = [];
      if (siteExist) {
        postsList.forEach(post => {
          postIdList.push(post.id);
        });
        //insert and update post
        await SiteService.insertAndUpdateSyncDataPost(pageId, postsList);
        return res.status(200).send(siteExist);
      }
      return res.status(400).send({ error: "Site not existed!" });
    }
    return res.status(400).send({ error: "Facebook page event not existed!" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error });
  }
}

export async function syncGallery(req, res) {
  try {
    let galleryList = [];
    const { pageId } = req.body;
    const data = await getSyncGallery({
      pageId: pageId,
      accessToken: req.user.accessToken
    });
    if (data) {
      //gallery list
      galleryList = await SiteService.getFacebookGalleryData(data);
      const siteExist = await SiteService.findOneSite(pageId);
      if (siteExist) {
        //update galleries
        await Site.updateOne(
          { id: pageId },
          {
            galleries: galleryList.length > 0 ? galleryList : null
          }
        );
        return res.status(200).send(siteExist);
      }
      return res.status(400).send({ error: "Site not existed!" });
    }
    return res.status(400).send({ error: "Facebook page event not existed!" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error });
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
      const siteExist = await SiteService.findOneSite(pageId);
      if (siteExist) {
        //event Id list
        let eventIdList = [];
        eventList.forEach(event => {
          eventIdList.push(event.id);
        });
        //insert and update event
        await SiteService.insertAndUpdateSyncEvents(
          pageId,
          eventList,
          eventIdList
        );

        return res.status(200).send(siteExist);
      } else {
        return res.status(400).send({ error: "Site not existed!" });
      }
    }
    return res.status(400).send({ error: "Facebook page event not existed!" });
  } catch (error) {
    console.log(error);
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
              postsList = await SiteService.getFacebookPostSyncData(data);
              //gallery list
              galleryList = await SiteService.getFacebookGalleryData(data);
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
                  postsList
                );
              }
              //event list
              eventList = await SiteService.getFacebookEventSyncData(data);
              //event Id list
              if (eventList) {
                //insert and update event
                await SiteService.insertAndUpdateSyncDataEvents(
                  pageId,
                  eventList
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
  const { tab, sitepath, skip, limit } = req.params;
  try {
    if (tab === "home") {
      const home = await SiteService.findSiteHomeTab(sitepath, skip, limit);
      return res.status(200).send(home);
    } else if (tab === "event") {
      const events = await SiteService.findSiteEventTab(sitepath, skip, limit);
      return res.status(200).send(events);
    } else if (tab === "gallery") {
      const gallery = await SiteService.findSiteGalleryTab(
        sitepath,
        skip,
        limit
      );
      return res.status(200).send(gallery);
    } else if (tab === "news") {
      const news = await SiteService.findSiteNewsTab(sitepath, skip, limit);
      return res.status(200).send(news);
    } else if (tab === "contact") {
      const contact = await SiteService.findSiteContactTab(
        sitepath,
        skip,
        limit
      );
      return res.status(200).send(contact);
    } else if (tab === "about") {
      const about = await SiteService.findSiteAboutTab(sitepath, skip, limit);
      return res.status(200).send(about);
    }
  } catch (error) {
    return res.status(400).send({ error });
  }
}
