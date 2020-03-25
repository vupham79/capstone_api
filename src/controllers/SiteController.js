import { mongoose, Site, Theme, SyncRecord } from "../models";
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
import nodemailer from "nodemailer";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fpwg.fptu@gmail.com",
    pass: "fptu123456"
  }
});

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

const defaultHomepageSetting = [
  {
    name: "About",
    order: 2,
    isActive: true,
    original: "about",
    filter: {
      type: "latest",
      items: null
    }
  },
  {
    name: "Gallery",
    order: 3,
    isActive: false,
    original: "gallery",
    filter: {
      type: "latest",
      items: null
    }
  },
  {
    name: "Event",
    order: 4,
    isActive: false,
    original: "event",
    filter: {
      type: "latest",
      items: null
    }
  },
  {
    name: "Contact",
    order: 5,
    isActive: true,
    original: "contact",
    filter: {
      type: "latest",
      items: null
    }
  },
  {
    name: "News",
    order: 6,
    isActive: false,
    original: "news",
    filter: {
      type: "latest",
      items: null
    }
  }
];

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

export async function applyAutoSync(req, res) {
  const { id, autoSync } = req.body;
  try {
    const autoSyncFormatted = {
      dataType: autoSync.dataType,
      minute: autoSync.minute ? autoSync.minute : null,
      hour: autoSync.hour ? autoSync.hour : null,
      day: autoSync.day ? autoSync.day : null
    };
    const update = await SiteService.updateAutoSync(id, autoSyncFormatted);
    switch (autoSync.dataType) {
      // sync all data
      case "all":
        console.log("all");
        SiteService.addCronJob({
          id,
          autoSync,
          job: () => autoSyncData(id, req.user.accessToken, req.user.email)
        });
        break;
      // sync event
      case "event":
        console.log("event");
        SiteService.addCronJob({
          id,
          autoSync,
          job: () => autoSyncEvent(id, req.user.accessToken, req.user.email)
        });
        break;
      // sync post
      case "post":
        console.log("post");
        SiteService.addCronJob({
          id,
          autoSync,
          job: () => autoSyncPost(req.user.email, id, req.user.accessToken)
        });
        break;
      // sync gallery
      case "gallery":
        console.log("gallery");
        SiteService.addCronJob({
          id,
          autoSync,
          job: () => autoSyncGallery(id, req.user.accessToken, req.user.email)
        });
        break;
      case "none":
        console.log("none");
        SiteService.addCronJob({
          id,
          autoSync
        });
        break;
      default:
        break;
    }
    if (update) {
      return res.status(200).send(update);
    } else return res.status(400).send({ error: "Apply auto sync failed!" });
  } catch (error) {
    res.status(400).send({ error: "Apply auto sync failed!" });
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
    sitePath,
    homepage,
    logoURL,
    coverURL
  } = req.body;
  try {
    if (
      !sitePath ||
      sitePath === undefined ||
      sitePath.replace(/\s/g, "") === "" ||
      sitePath.length > 35
    ) {
      return res.status(400).send({ error: "Invalid site path!" });
    }
    if (
      !name ||
      name === undefined ||
      name.replace(/\s/g, "") === "" ||
      name.length > 75
    ) {
      return res.status(400).send({ error: "Invalid title!" });
    }
    navItems &&
      navItems.length > 0 &&
      navItems.forEach(navItem => {
        if (
          !navItem ||
          !navItem.name ||
          navItem.name === undefined ||
          navItem.name.replace(/\s/g, "") === ""
        ) {
          console.log("Nav items empty");
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
        sitePath,
        homepage,
        logoURL,
        coverURL
      });
      if (update.msg) {
        return res.status(400).send(update);
      }
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
      sitepath.replace(/\s/g, "") === "" ||
      sitepath.length > 35
    ) {
      return res.status(400).send({ error: "Invalid site path" });
    }
    sitepath = sitepath.replace(/\s/g, "");
    //existed site path
    const isExistedSitePath = await SiteService.findExistedSitePath(sitepath);

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
              if (!theme) {
                return res.status(500).send({ error: "No theme existed!" });
              }
              await theme.sections.forEach(section => {
                defaultHomepageSetting.forEach(homepageSection => {
                  if (section === homepageSection.original) {
                    homepageSection.isActive = true;
                  }
                });
              });
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
                about: page.data.about,
                homepage: defaultHomepageSetting,
                autoSync: {
                  dataType: "none"
                }
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
      postsList = await SiteService.getFacebookPostData(data);
      const siteExist = await Site.findOne({ id: pageId });
      let syncRecordList = [];
      siteExist &&
        siteExist.syncRecords &&
        siteExist.syncRecords.forEach(record => {
          syncRecordList.push(new mongoose.Types.ObjectId(record));
        });
      //post Id list
      let postIdList = [];
      const record = await SyncRecord.create({
        dataType: "News",
        dateFrom: dateFrom,
        dateTo: dateTo
      });
      syncRecordList.push(new mongoose.Types.ObjectId(record._id));
      if (siteExist) {
        await siteExist.updateOne({
          id: pageId,
          syncRecords: syncRecordList
        });
        postsList.forEach(post => {
          postIdList.push(post.id);
        });
        //insert and update post
        await SiteService.insertAndUpdateSyncDataPost(pageId, postsList);
        await record.update({
          status: true
        });
        const update = await SiteService.findOneSite(pageId);
        return res.status(200).send(update);
      }
      return res.status(400).send({ error: "Site not existed!" });
    }
    return res.status(400).send({ error: "Facebook page event not existed!" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error });
  }
}

export async function autoSyncPost(userEmail, pageId, accessToken) {
  try {
    let postsList = [];
    const data = await getSyncPost({
      pageId: pageId,
      accessToken: accessToken
    });
    if (data) {
      //post list
      postsList = await SiteService.getFacebookPostData(data);
      const siteExist = await SiteService.findOneSite(pageId);
      //post Id list
      let postIdList = [];
      if (siteExist) {
        postsList.forEach(post => {
          postIdList.push(post.id);
        });
        //insert and update post
        await SiteService.insertAndUpdateSyncDataPost(pageId, postsList);
        // success
        // send mail with defined transport object
        await transporter.sendMail({
          from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: "Sync Success ✔", // Subject line
          text: "Your site has synced data success", // plain text body
          html: `
          <h5><strong>FPWG System</strong></h5>
          <p>Hi,</p>
          <p>Your site just synced successfully!</p>
          <br/>
          ` // html body
        });
      } else {
        // site not exist
        await transporter.sendMail({
          from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: "Sync Failed ✔", // Subject line
          text: "Your site is not exist to sync", // plain text body
          html: `
        <h5><strong>FPWG System</strong></h5>
        <p>Hi,</p>
        <p>Your site not exist to sync!</p>
        <br/>
        ` // html body
        });
      }
    } else {
      // page not exist
      await transporter.sendMail({
        from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Sync Failed ✔", // Subject line
        text: "Your Facebook Page is not exist to sync", // plain text body
        html: `
      <h5><strong>FPWG System</strong></h5>
      <p>Hi,</p>
      <p>Cannot find your Facebook Page to sync!</p>
      <br/>
      ` // html body
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function syncGallery(req, res) {
  try {
    let galleryList = [];
    const { pageId, dateFrom, dateTo } = req.body;
    const data = await getSyncGallery({
      pageId: pageId,
      accessToken: req.user.accessToken
    });
    if (data) {
      //gallery list
      galleryList = await SiteService.getFacebookGalleryData(data);
      const siteExist = await Site.findOne({ id: pageId });
      let syncRecordList = [];
      siteExist &&
        siteExist.syncRecords &&
        siteExist.syncRecords.forEach(record => {
          syncRecordList.push(new mongoose.Types.ObjectId(record));
        });
      const record = await SyncRecord.create({
        dataType: "Gallery",
        dateFrom: dateFrom,
        dateTo: dateTo
      });
      syncRecordList.push(new mongoose.Types.ObjectId(record._id));
      if (siteExist) {
        //update galleries
        await Site.updateOne(
          { id: pageId },
          {
            galleries: galleryList.length > 0 ? galleryList : null,
            syncRecords: syncRecordList
          }
        );
        if (update) {
          await record.update({
            status: true
          });
        }
        const update = await SiteService.findOneSite(pageId);
        return res.status(200).send(update);
      }
      return res.status(400).send({ error: "Site not existed!" });
    }
    return res.status(400).send({ error: "Facebook page event not existed!" });
  } catch (error) {
    console.log(error);
    return res.status(400).send({ error });
  }
}

export async function autoSyncGallery(pageId, accessToken, userEmail) {
  try {
    let galleryList = [];
    const data = await getSyncGallery({
      pageId: pageId,
      accessToken
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
        await transporter.sendMail({
          from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: "Sync Success ✔", // Subject line
          text: "Your site has synced data success", // plain text body
          html: `
          <h5><strong>FPWG System</strong></h5>
          <p>Hi,</p>
          <p>Your site just synced successfully!</p>
          <br/>
          ` // html body
        });
      } else {
        await transporter.sendMail({
          from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: "Sync Failed ✔", // Subject line
          text: "Your site has synced data failed", // plain text body
          html: `
        <h5><strong>FPWG System</strong></h5>
        <p>Hi,</p>
        <p>Your site is not existed to sync!</p>
        <br/>
        ` // html body
        });
      }
    } else {
      await transporter.sendMail({
        from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Sync Failed ✔", // Subject line
        text: "Your site has synced data failed", // plain text body
        html: `
      <h5><strong>FPWG System</strong></h5>
      <p>Hi,</p>
      <p>Cannot find your Facebook page to sync!</p>
      <br/>
      ` // html body
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function syncEvent(req, res) {
  try {
    let eventList = [];
    const { pageId, dateFrom, dateTo } = req.body;
    const data = await getSyncEvent({
      pageId: pageId,
      accessToken: req.user.accessToken
    });
    if (data) {
      //event list
      eventList = await SiteService.getFacebookEventData(data);
      const siteExist = await Site.findOne({ id: pageId });
      let syncRecordList = [];
      siteExist &&
        siteExist.syncRecords &&
        siteExist.syncRecords.forEach(record => {
          syncRecordList.push(new mongoose.Types.ObjectId(record));
        });
      const record = await SyncRecord.create({
        dataType: "Gallery",
        dateFrom: dateFrom,
        dateTo: dateTo
      });
      syncRecordList.push(new mongoose.Types.ObjectId(record._id));
      if (siteExist) {
        await siteExist.updateOne({ id: pageId, syncRecords: syncRecordList });
        //event Id list
        let eventIdList = [];
        eventList.forEach(event => {
          eventIdList.push(event.id);
        });
        //insert and update event
        await SiteService.insertAndUpdateSyncDataEvents(pageId, eventList);
        await record.update({
          status: true
        });
        const update = await SiteService.findOneSite(pageId);
        return res.status(200).send(update);
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

export async function autoSyncEvent(pageId, accessToken, userEmail) {
  try {
    let eventList = [];
    const data = await getSyncEvent({
      pageId: pageId,
      accessToken
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
        await SiteService.insertAndUpdateSyncDataEvents(pageId, eventList);
        await transporter.sendMail({
          from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: "Sync Success ✔", // Subject line
          text: "Your site has synced data success", // plain text body
          html: `
          <h5><strong>FPWG System</strong></h5>
          <p>Hi,</p>
          <p>Your site just synced successfully!</p>
          <br/>
          ` // html body
        });
      } else {
        await transporter.sendMail({
          from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: "Sync Failed ✔", // Subject line
          text: "Your site has synced data failed", // plain text body
          html: `
          <h5><strong>FPWG System</strong></h5>
          <p>Hi,</p>
          <p>Your site is not existed to sync</p>
          <br/>
          ` // html body
        });
      }
    } else {
      await transporter.sendMail({
        from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Sync Failed ✔", // Subject line
        text: "Your site has synced data failed", // plain text body
        html: `
      <h5><strong>FPWG System</strong></h5>
      <p>Hi,</p>
      <p>Facebook page event not existed!</p>
      <br/>
      ` // html body
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function syncData(req, res) {
  try {
    let galleryList = [];
    let postsList = [];
    let eventList = [];
    const { pageId, dateFrom, dateTo } = req.body;
    console.log(req.body);
    const data = await getSyncData({
      pageId: pageId,
      accessToken: req.user.accessToken
    });
    if (data) {
      const siteExist = await Site.findOne({ id: pageId });
      let syncRecordList = [];
      siteExist &&
        siteExist.syncRecords &&
        siteExist.syncRecords.forEach(record => {
          syncRecordList.push(new mongoose.Types.ObjectId(record));
        });
      const record = await SyncRecord.create({
        dataType: "Gallery",
        dateFrom: dateFrom,
        dateTo: dateTo
      });
      syncRecordList.push(new mongoose.Types.ObjectId(record._id));
      if (siteExist) {
        let session;
        return Site.createCollection()
          .then(() => Site.startSession())
          .then(_session => {
            session = _session;
            session.withTransaction(async () => {
              //update site
              const record = await SyncRecord.create({
                dataType: "All",
                dateFrom: dateFrom,
                dateTo: dateTo
              });
              const update = await SiteService.editSite(pageId, {
                phone: data.phone,
                longitude: data.location ? data.location.longitude : null,
                latitude: data.location ? data.location.latitude : null,
                address: data.single_line_address,
                cover: data.cover ? [data.cover.source] : null,
                categories: data.category_list,
                about: data.about,
                genre: data.genre,
                syncRecords: syncRecordList
              });
              //post list
              postsList = await SiteService.getFacebookPostSyncData(data);
              //gallery list
              galleryList = await SiteService.getFacebookGalleryData(data);
              //update galleries
              await SiteService.updateGallery(pageId, galleryList);
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
                await record.update({
                  status: true
                });
                const update = await SiteService.findOneSite(pageId);
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

export async function autoSyncData(pageId, accessToken, userEmail) {
  try {
    let galleryList = [];
    let postsList = [];
    let eventList = [];
    const data = await getSyncData({
      pageId,
      accessToken
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
              const record = await SyncRecord.create({
                dataType: "All"
              });
              const update = await SiteService.editSite(pageId, {
                phone: data.phone,
                longitude: data.location ? data.location.longitude : null,
                latitude: data.location ? data.location.latitude : null,
                address: data.single_line_address,
                cover: data.cover ? [data.cover.source] : null,
                categories: data.category_list,
                about: data.about,
                genre: data.genre,
                syncRecord: record
              });
              //post list
              postsList = await SiteService.getFacebookPostSyncData(data);
              //gallery list
              galleryList = await SiteService.getFacebookGalleryData(data);
              //update galleries
              await SiteService.updateGallery(pageId, galleryList);
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
                await record.update({
                  status: true
                });
                await transporter.sendMail({
                  from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
                  to: userEmail, // list of receivers
                  subject: "Sync Success ✔", // Subject line
                  text: "Your site has synced data success", // plain text body
                  html: `
                  <h5><strong>FPWG System</strong></h5>
                  <p>Hi,</p>
                  <p>Your site just synced successfully!</p>
                  <br/>
                  ` // html body
                });
              } else {
                await transporter.sendMail({
                  from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
                  to: userEmail, // list of receivers
                  subject: "Sync Failed ✔", // Subject line
                  text: "Your site has synced data failed", // plain text body
                  html: `
                  <h5><strong>FPWG System</strong></h5>
                  <p>Hi,</p>
                  <p>Your site just synced successfully!</p>
                  <br/>
                  ` // html body
                });
              }
            });
          });
      } else {
        await transporter.sendMail({
          from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: "Sync Failed ✔", // Subject line
          text: "Your site is not existed to sync", // plain text body
          html: `
        <h5><strong>FPWG System</strong></h5>
        <p>Hi,</p>
        <p>Your site just synced successfully!</p>
        <br/>
        ` // html body
        });
      }
    } else {
      await transporter.sendMail({
        from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Sync Failed ✔", // Subject line
        text: "Cannot find your Facebook Page data to sync", // plain text body
        html: `
      <h5><strong>FPWG System</strong></h5>
      <p>Hi,</p>
      <p>Your site just synced successfully!</p>
      <br/>
      ` // html body
      });
    }
  } catch (error) {
    console.log(error);
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
  const { id, page, pageNumber, sitePath } = req.query;
  try {
    if (page === "home") {
      const home = await SiteService.findSiteHomeTab(id, sitePath);
      return res.status(200).send(home);
    } else if (page === "event") {
      const events = await SiteService.findSiteEventTab(
        id,
        sitePath,
        pageNumber
      );
      return res.status(200).send(events);
    } else if (page === "gallery") {
      const gallery = await SiteService.findSiteGalleryTab(
        id,
        sitePath,
        pageNumber
      );
      return res.status(200).send(gallery);
    } else if (page === "news") {
      const news = await SiteService.findSiteNewsTab(id, sitePath, pageNumber);
      return res.status(200).send(news);
    }
    return res.status(400).send();
  } catch (error) {
    console.log(error);
    return res.status(400).send(error);
  }
}
