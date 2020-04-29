import nodemailer from "nodemailer";
import { mongoose, Site, SyncRecord, Theme, User, Post } from "../models";
import {
  getPageData,
  getSyncData,
  getSyncEvent,
  getSyncGallery,
  getSyncPost,
} from "../services/FacebookAPI";
import * as SiteService from "../services/SiteService";
import { findOneTheme } from "../services/ThemeService";
import { findAllUser } from "../services/UserService";

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "fpwg.fptu@gmail.com",
    pass: "123456Aa@",
  },
});

const defaultNavItems = [
  {
    name: "Home",
    order: 1,
    isActive: true,
    original: "home",
  },
  {
    name: "About",
    order: 2,
    isActive: true,
    original: "about",
  },
  {
    name: "Gallery",
    order: 3,
    isActive: true,
    original: "gallery",
  },
  {
    name: "Event",
    order: 4,
    isActive: true,
    original: "event",
  },
  {
    name: "Contact",
    order: 5,
    isActive: true,
    original: "contact",
  },
  {
    name: "News",
    order: 6,
    isActive: true,
    original: "news",
  },
];

const defaultHomepageSetting = [
  {
    name: "About",
    order: 2,
    isActive: true,
    original: "about",
    filter: {
      type: "latest",
      items: null,
    },
  },
  {
    name: "Gallery",
    order: 3,
    isActive: false,
    original: "gallery",
    filter: {
      type: "latest",
      items: null,
    },
  },
  {
    name: "Event",
    order: 4,
    isActive: false,
    original: "event",
    filter: {
      type: "latest",
      items: null,
    },
  },
  {
    name: "Contact",
    order: 5,
    isActive: true,
    original: "contact",
    filter: {
      type: "latest",
      items: null,
    },
  },
  {
    name: "News",
    order: 6,
    isActive: false,
    original: "news",
    filter: {
      type: "latest",
      items: null,
    },
  },
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
      find.forEach((user) => {
        user.sites &&
          user.sites.forEach((site) => {
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
              isActivated: user.isActivated,
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
      let userActivated = false;
      const siteResut = await Site.findOne({ id: id });
      const userCheck = await User.find();
      userCheck &&
        userCheck.forEach((user) => {
          if (
            user.sites.includes(new mongoose.Types.ObjectId(siteResut._id)) &&
            user.isActivated
          ) {
            userActivated = true;
          }
        });
      if (userActivated === false) {
        return res.status(400).send({ error: "User is not activated!" });
      }
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
  const {
    id,
    autoSync,
    about,
    address,
    story,
    email,
    phone,
    postWith, //(int) 1: message, 2: video, 3: photo
    containMsg,
    eventContainTitle,
  } = req.body;
  try {
    const autoSyncFormatted = {
      dataType: autoSync.dataType,
      minute: autoSync.minute ? autoSync.minute : null,
      hour: autoSync.hour ? autoSync.hour : null,
      day: autoSync.day ? autoSync.day : null,
    };
    const update = await SiteService.updateAutoSync(id, autoSyncFormatted);
    switch (autoSync.dataType) {
      // sync all data
      case "all":
        SiteService.addCronJob({
          id,
          autoSync,
          job: () =>
            autoSyncData(
              id,
              req.user.accessToken,
              req.user.email,
              about,
              address,
              story,
              email,
              phone
            ),
        });
        break;
      // sync event
      case "event":
        SiteService.addCronJob({
          id,
          autoSync,
          job: () =>
            autoSyncEvent(
              id,
              req.user.accessToken,
              req.user.email,
              eventContainTitle
            ),
        });
        break;
      // sync post
      case "post":
        SiteService.addCronJob({
          id,
          autoSync,
          job: () =>
            autoSyncPost(
              req.user.email,
              id,
              req.user.accessToken,
              postWith,
              containMsg
            ),
        });
        break;
      // sync gallery
      case "gallery":
        SiteService.addCronJob({
          id,
          autoSync,
          job: () => autoSyncGallery(id, req.user.accessToken, req.user.email),
        });
        break;
      case "none":
        SiteService.addCronJob({
          id,
          autoSync,
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
    coverURL,
    address,
    showDesEvent = true,
    showPlaceEvent = true,
    showCoverEvent = true,
    about,
    limitNews = 6,
    limitGallery = 6,
    limitEvent = 6,
    showStory = true,
    showMessenger = true,
    showPostMessage = true,
    showAlbumNumber = true,
    showPostPreviewImage = true,
    showPostCreatedTime = true,
    showSuggestLatestNews = true,
    showGoogleMaps = true,
    showAboutDescription = true,
    showAboutLogo = true,
    showMessageUs = true,
    longitude,
    latitude,
    showPostMode = 0,
    story,
  } = req.body;
  try {
    if (
      !sitePath ||
      sitePath === undefined ||
      sitePath.replace(/\s/g, "") === "" ||
      sitePath.length > 35 ||
      sitePath === "admin" ||
      sitePath === "edit" ||
      sitePath === "view"
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
      navItems.forEach((navItem) => {
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
        coverURL,
        address,
        showDesEvent,
        showPlaceEvent,
        showCoverEvent,
        about,
        limitNews,
        limitGallery,
        limitEvent,
        showStory,
        showMessenger,
        showPostMessage,
        showAlbumNumber,
        showPostPreviewImage,
        showPostCreatedTime,
        showSuggestLatestNews,
        showGoogleMaps,
        showAboutDescription,
        showAboutLogo,
        showMessageUs,
        longitude,
        latitude,
        showPostMode,
        story,
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
      sitepath.length > 35 ||
      sitepath === "admin" ||
      sitepath === "edit" ||
      sitepath === "view"
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
    console.log(req.body);
    const page = await getPageData({
      pageId: pageId,
      accessToken: req.user.accessToken,
    }).catch((error) => {
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
        id: pageId,
      });
      //if site not existed
      if (!siteExist) {
        let session;
        return Site.createCollection()
          .then(() => Site.startSession())
          .then((_session) => {
            session = _session;
            session.withTransaction(async () => {
              //find theme
              let theme = await Theme.findOne();
              if (!theme) {
                return res.status(500).send({ error: "No theme existed!" });
              }
              theme.sections &&
                (await theme.sections.forEach((section) => {
                  defaultHomepageSetting.forEach((homepageSection) => {
                    if (section === homepageSection.original) {
                      homepageSection.isActive = true;
                    }
                  });
                }));
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
                cover: page.cover
                  ? [
                      page.cover
                        .replace(/\&amp\;/g, "&")
                        .replace(/\&gt\;/g, ">")
                        .replace(/\&lt\;/g, "<")
                        .replace(/\&quot\;/g, "'")
                        .replace(/\&\#39\;/g, "'"),
                    ]
                  : null,
                url: pageUrl,
                isPublish: isPublish,
                sitePath: sitepath,
                about: page.data.about,
                homepage: defaultHomepageSetting,
                autoSync: {
                  dataType: "none",
                },
                story: page.data.page_about_story
                  ? {
                      id: page.data.page_about_story.id,
                      title: page.data.page_about_story.title,
                      composedText: page.data.page_about_story.composed_text
                        ? page.data.page_about_story.composed_text.map(
                            (val) => val.text
                          )
                        : null,
                    }
                  : null,
                email: req.body.profile.email,
              });
              //find user
              await SiteService.updateSiteList(req.user.id, insert);
              if (insert) {
                //post list
                // console.log("Data: ", page.data);
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
    return res.status(400).send(error);
  }
}

export async function syncPost(req, res) {
  try {
    let postsList = [];
    const {
      pageId,
      dateFrom = null,
      dateTo = null,
      postWith = 0, //(int) 1: message, 2: video, 3: photo
      containMsg = "",
    } = req.body;
    const data = await getSyncPost({
      pageId: pageId,
      accessToken: req.user.accessToken,
    });
    console.log("total: ", data.posts.data.length);
    if (data) {
      //post list
      postsList = await SiteService.getFacebookPostData(data, dateFrom, dateTo); //filter by date range
      console.log("Get posts list length: ", postsList.length);

      const siteExist = await Site.findOne({ id: pageId });
      if (siteExist) {
        const existedSite = await Site.findOne({ id: pageId })
          .select("posts")
          .populate("posts");
        console.log("Existed Site Posts: ", existedSite.posts.length);

        //filter Post by type, message
        let filteredPostResult = SiteService.filterPost(
          postsList,
          containMsg,
          postWith
        );
        console.log("Filtered Post Result: ", filteredPostResult.length);

        const record = await SyncRecord.create({
          dataType: "News",
          dateFrom: dateFrom,
          dateTo: dateTo,
        });
        let syncRecordList = SiteService.addSyncRecord(record, siteExist);
        await siteExist.updateOne({
          id: pageId,
          syncRecords: syncRecordList,
        });
        await record.updateOne({
          status: true,
        });
        //insert and update post
        const update = 
        await SiteService.insertAndUpdateSyncDataPost(
          pageId,
          filteredPostResult,
          dateFrom,
          dateTo,
          !!containMsg,
          !!postWith
        );
        // const update = await SiteService.findOneSite(pageId);
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

export async function autoSyncPost(
  userEmail,
  pageId,
  accessToken,
  postWith, //(int) 1: message, 2: video, 3: photo
  containMsg
) {
  try {
    console.log(
      pageId,
      postWith, //(int) 1: message, 2: video, 3: photo
      containMsg
    );
    let postsList = [];
    const data = await getSyncPost({
      pageId: pageId,
      accessToken: accessToken,
    });
    const siteExist = await SiteService.findOneSite(pageId);
    if (siteExist) {
      if (data) {
        const record = await SyncRecord.create({
          dataType: "News",
        });
        let syncRecordList = SiteService.addSyncRecord(record, siteExist);
        await Site.updateOne(
          { id: pageId },
          {
            syncRecords: syncRecordList,
          }
        );
        //post list
        postsList = await SiteService.getFacebookPostData(data);
        console.log("Posts List length: ", postsList.length);

        //filter Post
        let filteredPostResult = SiteService.filterPost(
          postsList,
          containMsg,
          postWith
        );
        console.log("Filtered Post Result length: ", filteredPostResult.length);

        //post Id list
        let postIdList = [];
        postsList &&
          postsList.forEach((post) => {
            postIdList.push(post.id);
          });
        //insert and update post
        await SiteService.insertAndUpdateSyncDataPost(
          pageId,
          filteredPostResult
        );
        // success
        await record.update({
          status: true,
        });
        // send mail with defined transport object
        await transporter.sendMail({
          from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: "Sync Success ✔", // Subject line
          text: "Your site has synced post success", // plain text body
          html: `
          <h5><strong>FPWG System</strong></h5>
          <p>Hi,</p>
          <p>Your site ${siteExist.title} just synced post successfully!</p>
          <br/>
          `, // html body
        });
      } else {
        // site not exist
        await transporter.sendMail({
          from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: "Sync Failed ✔", // Subject line
          text: "Your site is not existed to sync post", // plain text body
          html: `
        <h5><strong>FPWG System</strong></h5>
        <p>Hi,</p>
        <p>Cannot find your Facebook Page ${siteExist.title}'s post to sync!</p>
        <br/>
        `, // html body
        });
      }
    } else {
      // page not exist
      await transporter.sendMail({
        from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Sync Failed ✔", // Subject line
        text: "Your Facebook Page is not exist to sync post", // plain text body
        html: `
      <h5><strong>FPWG System</strong></h5>
      <p>Hi,</p>
      <p>Your site is not existed to sync post!</p>
      <br/>
      `, // html body
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
      accessToken: req.user.accessToken,
    });
    if (data) {
      //gallery list
      galleryList = await SiteService.getFacebookGalleryData(
        data,
        dateFrom,
        dateTo
      );
      const siteExist = await Site.findOne({ id: pageId });
      if (siteExist) {
        galleryList &&
          galleryList.forEach((item) => {
            siteExist.galleries &&
              siteExist.galleries.forEach((siteItem) => {
                if (item.target === siteItem.target) {
                  item._id = new mongoose.Types.ObjectId(siteItem._id);
                }
              });
          });
        const record = await SyncRecord.create({
          dataType: "Gallery",
          dateFrom: dateFrom,
          dateTo: dateTo,
        });
        let syncRecordList = SiteService.addSyncRecord(record, siteExist);
        //update galleries
        const update = await Site.updateOne(
          { id: pageId },
          {
            galleries: galleryList.length > 0 ? galleryList : null,
            syncRecords: syncRecordList,
          }
        );
        if (update) {
          await record.updateOne({
            status: true,
          });
        }
        const siteResult = await SiteService.findOneSite(pageId);
        return res.status(200).send(siteResult);
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
      accessToken,
    });
    const siteExist = await SiteService.findOneSite(pageId);
    if (siteExist) {
      if (data) {
        const record = await SyncRecord.create({
          dataType: "Gallery",
        });
        let syncRecordList = SiteService.addSyncRecord(record, siteExist);
        //gallery list
        galleryList = await SiteService.getFacebookGalleryData(data);
        galleryList &&
          galleryList.forEach((item) => {
            siteExist.galleries &&
              siteExist.galleries.forEach((siteItem) => {
                if (item.target === siteItem.target) {
                  item._id = new mongoose.Types.ObjectId(siteItem._id);
                }
              });
          });
        //update galleries
        await Site.updateOne(
          { id: pageId },
          {
            galleries: galleryList.length > 0 ? galleryList : null,
            syncRecords: syncRecordList,
          }
        );
        await record.updateOne({
          status: true,
        });
        await transporter.sendMail({
          from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: "Sync Success ✔", // Subject line
          text: "Your site has synced gallery success", // plain text body
          html: `
          <h5><strong>FPWG System</strong></h5>
          <p>Hi,</p>
          <p>Your site ${siteExist.title} just synced gallery successfully!</p>
          <br/>
          `, // html body
        });
      } else {
        await transporter.sendMail({
          from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: "Sync Failed ✔", // Subject line
          text: "Your site has synced gallery failed", // plain text body
          html: `
        <h5><strong>FPWG System</strong></h5>
        <p>Hi,</p>
        <p>Cannot find your Facebook page ${siteExist.title}'s gallery to sync!</p>
        <br/>
        `, // html body
        });
      }
    } else {
      await transporter.sendMail({
        from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Sync Failed ✔", // Subject line
        text: "Your site has synced gallery failed", // plain text body
        html: `
      <h5><strong>FPWG System</strong></h5>
      <p>Hi,</p>
      <p>Your site is not existed to sync gallery!</p>
      <br/>
      `, // html body
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export async function syncEvent(req, res) {
  try {
    let eventList = [];
    const { pageId, dateFrom, dateTo, eventContainTitle } = req.body;
    console.log(eventContainTitle);
    const data = await getSyncEvent({
      pageId: pageId,
      accessToken: req.user.accessToken,
    });
    console.log("Req Body: ", req.body);
    console.log("Get sync event data: ", data.events.data.length);
    if (data) {
      //event list
      eventList = await SiteService.getFacebookEventData(
        data,
        dateFrom,
        dateTo
      );
      console.log("Event list length: ", eventList.length);
      if (!eventList) {
        return res
          .status(200)
          .send({ msg: "Facebook page has no event existed!" });
      }
      const siteExist = await Site.findOne({ id: pageId });
      if (siteExist) {
        const existedSite = await Site.findOne({ id: pageId })
          .select("posts events")
          .populate("posts events");
        console.log("Existed Site Posts: ", existedSite.events.length);

        //filer post and event list
        let filteredEventResult = SiteService.filterEvent(
          eventList,
          eventContainTitle
        );

        const record = await SyncRecord.create({
          dataType: "Event",
          dateFrom: dateFrom,
          dateTo: dateTo,
        });
        let syncRecordList = SiteService.addSyncRecord(record, siteExist);
        await siteExist.updateOne({ id: pageId, syncRecords: syncRecordList });
        //insert and update event
        await SiteService.insertAndUpdateSyncDataEvents(
          pageId,
          filteredEventResult,
          dateFrom,
          dateTo,
          !!eventContainTitle
        );
        await record.updateOne({
          status: true,
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

export async function autoSyncEvent(
  pageId,
  accessToken,
  userEmail,
  containTitle
) {
  try {
    let eventList = [];
    const data = await getSyncEvent({
      pageId: pageId,
      accessToken,
    });
    const siteExist = await SiteService.findOneSite(pageId);
    if (siteExist) {
      if (data) {
        const record = await SyncRecord.create({
          dataType: "Event",
        });
        let syncRecordList = SiteService.addSyncRecord(record, siteExist);
        await Site.updateOne(
          { id: pageId },
          {
            syncRecords: syncRecordList,
          }
        );
        //event list
        eventList = await SiteService.getFacebookEventData(data);

        const existedSite = await Site.findOne({ id: pageId })
          .select("posts events")
          .populate("posts events");

          console.log(containTitle);
        //filer post and event list
        let filteredEventResult = SiteService.filterEvent(
          eventList,
          containTitle
        );
        console.log("filteredEventResult: ", filteredEventResult.length);

        //get filtered Event Id List
        let filteredEventResultIdList = [];
        filteredEventResult.forEach((event) => {
          filteredEventResultIdList.push(event.id);
        });

        //get updated Event list
        let updatedEventList = [];
        existedSite.events &&
          existedSite.events.forEach((event) => {
            if (filteredEventResultIdList.includes(event.id)) {
              const eventResult = filteredEventResult.find(
                (checkEvent) => checkEvent.id === event.id
              );
              updatedEventList.push(eventResult);
            } else {
              updatedEventList.push(event);
            }
          });
        eventList = updatedEventList;
        //event Id list
        let eventIdList = [];
        eventList &&
          eventList.forEach((event) => {
            eventIdList.push(event.id);
          });
        //insert and update event
        await SiteService.insertAndUpdateSyncDataEvents(pageId, eventList);
        await record.updateOne({
          status: true,
        });
        await transporter.sendMail({
          from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: "Sync Success ✔", // Subject line
          text: "Your site has synced event success", // plain text body
          html: `
          <h5><strong>FPWG System</strong></h5>
          <p>Hi,</p>
          <p>Your site ${siteExist.title} just synced event successfully!</p>
          <br/>
          `, // html body
        });
      } else {
        await transporter.sendMail({
          from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
          to: userEmail, // list of receivers
          subject: "Sync Failed ✔", // Subject line
          text: "Your site has synced event failed", // plain text body
          html: `
          <h5><strong>FPWG System</strong></h5>
          <p>Hi,</p>
          <p>Cannot find Facebook page ${siteExist.title}'s event to sync!</p>
          <br/>
          `, // html body
        });
      }
    } else {
      await transporter.sendMail({
        from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
        to: userEmail, // list of receivers
        subject: "Sync Failed ✔", // Subject line
        text: "Your site has synced event failed", // plain text body
        html: `
      <h5><strong>FPWG System</strong></h5>
      <p>Hi,</p>
      <p>Your site is not existed to sync event!</p>
      <br/>
      `, // html body
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
    const {
      pageId,
      dateFrom,
      dateTo,
      showStory,
      filterPostMessage,
      filterPostType,
      filterEventTitle,
      about = false,
      address = false,
      story = false,
      email = false,
      phone = false,
    } = req.body;
    console.log(req.body);
    let showStoryValue = showStory;
    if (showStory === undefined) {
      showStoryValue = false;
    }
    const data = await getSyncData({
      pageId: pageId,
      accessToken: req.user.accessToken,
    });
    if (data) {
      const siteExist = await Site.findOne({ id: pageId });
      if (siteExist) {
        let session;
        return Site.createCollection()
          .then(() => Site.startSession())
          .then((_session) => {
            session = _session;
            session.withTransaction(async () => {
              //update site
              const record = await SyncRecord.create({
                dataType: "All",
                dateFrom: dateFrom,
                dateTo: dateTo,
              });
              let syncRecordList = SiteService.addSyncRecord(record, siteExist);
              console.log(about,
                address,
                story,
                email,
                phone);
              // const update =
              await SiteService.editSite(pageId, {
                categories: data.category_list,
                syncRecords: syncRecordList,
                data: data,
                about,
                address,
                story,
                email,
                phone,
              });
              //post list
              postsList = await SiteService.getFacebookPostData(
                data,
                dateFrom,
                dateTo
              );
              //gallery list
              galleryList = await SiteService.getFacebookGalleryData(
                data,
                dateFrom,
                dateTo
              );
              //event list
              eventList = await SiteService.getFacebookEventData(
                data,
                dateFrom,
                dateTo
              );
              galleryList &&
                galleryList.forEach((item) => {
                  siteExist.galleries &&
                    siteExist.galleries.forEach((siteItem) => {
                      if (item.target === siteItem.target) {
                        item._id = new mongoose.Types.ObjectId(siteItem._id);
                      }
                    });
                });
              //update galleries
              await SiteService.updateGallery(pageId, galleryList);

              const existedSite = await Site.findOne({ id: pageId })
                .select("posts events")
                .populate("posts events");

              //post Id list
              if (postsList) {
                let filteredPostResult = SiteService.filterPost(
                  postsList,
                  filterPostMessage,
                  filterPostType
                );

                //get filtered Post Id List
                let filteredPostResultIdList = [];
                filteredPostResult.forEach((post) => {
                  filteredPostResultIdList.push(post.id);
                });

                //get updated Post list
                let updatedPostList = [];
                existedSite.posts &&
                  existedSite.posts.forEach((post) => {
                    if (filteredPostResultIdList.includes(post.id)) {
                      const postResult = filteredPostResult.find(
                        (checkPost) => checkPost.id === post.id
                      );
                      // console.log(
                      //   "Post Result: " + post.id + " : ",
                      //   postResult
                      // );
                      updatedPostList.push(postResult);
                    } else {
                      updatedPostList.push(post);
                    }
                  });
                postsList = updatedPostList;

                //insert and update post
                await SiteService.insertAndUpdateSyncDataPost(
                  pageId,
                  postsList
                );
              }
              //event Id list
              if (eventList) {
                //filer post and event list
                let filteredEventResult = SiteService.filterEvent(
                  eventList,
                  filterEventTitle
                );

                //get filtered Event Id List
                let filteredEventResultIdList = [];
                filteredEventResult.forEach((event) => {
                  filteredEventResultIdList.push(event.id);
                });

                //get updated Event list
                let updatedEventList = [];
                existedSite.events &&
                  existedSite.events.forEach((event) => {
                    if (filteredEventResultIdList.includes(event.id)) {
                      const eventResult = filteredEventResult.find(
                        (checkEvent) => checkEvent.id === event.id
                      );
                      // console.log(
                      //   "eventResult " + event.id + " : ",
                      //   eventResult
                      // );
                      updatedEventList.push(eventResult);
                    } else {
                      updatedEventList.push(event);
                    }
                  });
                eventList = updatedEventList;

                //insert and update event
                await SiteService.insertAndUpdateSyncDataEvents(
                  pageId,
                  eventList
                );
              }
              // if (update) {
              await record.update({
                status: true,
              });
              const siteResult = await SiteService.findOneSite(pageId);
              // console.log("Site result length: ", siteResult.posts.length);
              return res.status(200).send(siteResult);
              // } else {
              // return res.status(400).send({ error: "Edit failed!" });
              // }
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

export async function autoSyncData(
  pageId,
  accessToken,
  userEmail,
  about = false,
  address = false,
  story = false,
  email = false,
  phone = false
) {
  try {
    let galleryList = [];
    let postsList = [];
    let eventList = [];
    const data = await getSyncData({
      pageId,
      accessToken,
    });
    const siteExist = await SiteService.findOneSite(pageId);
    if (siteExist) {
      if (data) {
        let session;
        return Site.createCollection()
          .then(() => Site.startSession())
          .then((_session) => {
            session = _session;
            session.withTransaction(async () => {
              //update site
              const record = await SyncRecord.create({
                dataType: "All",
              });
              let syncRecordList = SiteService.addSyncRecord(record, siteExist);
              console.log("syncRecordList: ", syncRecordList.length);
              const update = await SiteService.editSite(pageId, {
                categories: data.category_list,
                syncRecords: syncRecordList,
                data: data,
                about,
                address,
                story,
                email,
                phone,
              });
              if (data.post) {
                //gallery list
                galleryList = await SiteService.getFacebookGalleryData(data);
                galleryList &&
                  galleryList.forEach((item) => {
                    siteExist.galleries &&
                      siteExist.galleries.forEach((siteItem) => {
                        if (item.target === siteItem.target) {
                          item._id = new mongoose.Types.ObjectId(siteItem._id);
                        }
                      });
                  });
                //update galleries
                await SiteService.updateGallery(pageId, galleryList);
                //post list
                postsList = await SiteService.getFacebookPostSyncData(data);
                //post Id list
                let postIdList = [];
                if (postsList) {
                  postsList &&
                    postsList.forEach((post) => {
                      postIdList.push(post.id);
                    });
                  //insert and update post
                  await SiteService.insertAndUpdateSyncDataPost(
                    pageId,
                    postsList
                  );
                }
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
                  status: true,
                });
                await transporter.sendMail({
                  from: '"FPWG 👻" <fpwg.fptu@gmail.com>', // sender address
                  to: userEmail, // list of receivers
                  subject: "Sync Success ✔", // Subject line
                  text: "Your site has synced data success", // plain text body
                  html: `
                  <h5><strong>FPWG System</strong></h5>
                  <p>Hi,</p>
                  <p>Your site ${siteExist.title} just synced successfully!</p>
                  <br/>
                  `, // html body
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
                  <p>Your site ${siteExist.title} has synced data failed!</p>
                  <br/>
                  `, // html body
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
        <p>Cannot find your Facebook Page ${siteExist.title}'s data to sync!</p>
        <br/>
        `, // html body
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
      <p>Your site is not existed to sync data!</p>
      <br/>
      `, // html body
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
