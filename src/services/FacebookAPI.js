import axios from "../utils/axios";

export async function getLongLivedToken(accessToken) {
  const data = await axios({
    params: { locale: "en_US ", access_token: accessToken },
    url:
      process.env.facebookAPI +
      `oauth/access_token?grant_type=fb_exchange_token&client_id=${process.env.clientID}&client_secret=${process.env.clientSecret}&fb_exchange_token=${accessToken}`,
  });
  return data.data;
}

export async function getUserPages(accessToken) {
  const data = await axios({
    params: { locale: "en_US ", access_token: accessToken },
    url:
      process.env.facebookAPI +
      "me?fields=accounts{category,name,id,access_token, picture, link}",
  });
  return data.data;
}

export async function getSyncEvent({ pageId, accessToken }) {
  const data = await axios({
    params: {
      fields:
        "events.limit(1000){id,name,description,place,is_canceled,end_time,start_time,cover}",
      locale: "en_US",
      access_token: accessToken,
    },
    url: process.env.facebookAPI + pageId,
  });
  return data.data;
}

export async function getSyncPost({ pageId, accessToken }) {
  const data = await axios({
    params: {
      fields:
        "posts.limit(1000){message,created_time,updated_time,attachments{title,media_type,subattachments,media,target}}",
      locale: "en_US",
      access_token: accessToken,
    },
    url: process.env.facebookAPI + pageId,
  });
  return data.data;
}

export async function getSyncGallery({ pageId, accessToken }) {
  const data = await axios({
    params: {
      fields:
        "posts.limit(1000){message,created_time,,updated_time,attachments{title,media_type,subattachments,media,target}}",
      locale: "en_US",
      access_token: accessToken,
    },
    url: process.env.facebookAPI + pageId,
  });
  return data.data;
}

export async function getSyncData({ pageId, accessToken }) {
  let page_about_story = null;
  try {
    const data = await axios({
      params: {
        fields: "page_about_story",
        access_token: accessToken,
      },
      url: process.env.facebookAPI + pageId,
    });
    if (data.data) {
      page_about_story = data.data.page_about_story;
    }
  } catch (error) {}
  const data = await axios({
    params: {
      fields:
        "category_list,location,single_line_address,phone,about," +
        "albums{picture,link}," +
        "posts.limit(1000){message,created_time,updated_time,attachments{title,media_type,subattachments,media,target}}," +
        "events.limit(1000){id,name,description,place,is_canceled,end_time,start_time,cover}",
      locale: "en_US",
      access_token: accessToken,
    },
    url: process.env.facebookAPI + pageId,
  });
  return data.data;
}

export async function getPageData({ pageId, accessToken }) {
  let page_about_story = null;
  try {
    const data = await axios({
      params: {
        fields: "page_about_story",
        access_token: accessToken,
      },
      url: process.env.facebookAPI + pageId,
    });
    if (data.data) {
      page_about_story = data.data.page_about_story;
    }
  } catch (error) {}
  const data = await axios({
    params: {
      fields:
        "name,cover,phone,category_list,about," +
        "location,single_line_address,albums{picture,link}," +
        "posts.limit(1000){message,created_time,updated_time,attachments{title,media_type,subattachments,media,target}}," +
        "events.limit(1000){id,name,description,place,is_canceled,end_time,start_time,cover}",
      locale: "en_US",
      access_token: accessToken,
    },
    url: process.env.facebookAPI + pageId,
  });
  const logo = await axios({
    params: {
      access_token: accessToken,
    },
    url: process.env.facebookAPI + pageId + "/picture?height=9999&redirect=0",
  });
  let cover = null;
  if (data.data.cover) {
    cover = await axios({
      params: {
        access_token: accessToken,
        fields: "images",
      },
      url: process.env.facebookAPI + data.data.cover.id,
    });
  }
  return {
    data: { ...data.data, page_about_story },
    logo: logo.data.data.url,
    cover: cover ? cover.data.images[0].source : null,
  };
}
